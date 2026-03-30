const { v4: uuidv4 } = require('uuid');
const { db } = require('./firebase');
const { classifyEvent } = require('./gemini');
const { notifyVdie } = require('./webhook');
const logger = require('./logger');
const FirecrawlApp = require('@mendable/firecrawl-js').default;
const config = require('./config');

const firecrawl = new FirecrawlApp({ apiKey: config.firecrawl.apiKey || 'placeholder' });

// ─── PRD §13 — Severity → edgeCostMultiplier Table ──────────────────────────
const SEVERITY_TO_EDGE_COST = {
  1: 1.2,
  2: 1.8,
  3: 2.5,
  4: 4.0,
  5: 99.0,
};

function getEdgeCostMultiplier(severity) {
  return SEVERITY_TO_EDGE_COST[severity] ?? 1.2;
}

// ─── PRD §13 — POINT_RADIUS → 32-vertex Polygon ─────────────────────────────
/**
 * Generates a 32-vertex circle polygon from a center point and radius.
 * The polygon ring is closed (first === last vertex).
 * PRD §13: "TIE's threatZoneBuilder.js converts all point+radius threats into
 * a 32-vertex approximated circle polygon before writing to Firestore."
 */
function circleToPolygon(centerLat, centerLon, radiusKm, numVertices = 32) {
  const R = 6371; // Earth radius in km
  const coordinates = [];
  for (let i = 0; i <= numVertices; i++) {
    const angle = (i * 2 * Math.PI) / numVertices;
    const latRad = (centerLat * Math.PI) / 180;
    const dLat = (radiusKm / R) * Math.cos(angle);
    const dLon = (radiusKm / R) * Math.sin(angle) / Math.cos(latRad);
    const lat = centerLat + (dLat * 180) / Math.PI;
    const lon = centerLon + (dLon * 180) / Math.PI;
    coordinates.push([lon, lat]);
  }
  // Ensure ring is closed
  coordinates[numVertices] = coordinates[0];
  return [coordinates];
}

/**
 * Convert Gemini geoBoundary output to a valid GeoJSON Feature with Polygon geometry.
 * Supports POINT_RADIUS, BOUNDING_BOX, and NAMED_REGION.
 * PRD §5 + §13 compliance.
 */
function convertToGeoJson(boundary) {
  if (!boundary) {
    return {
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: { centerLat: 0, centerLon: 0, radiusKm: 0 },
    };
  }

  let coordinates = [];
  const centerLat = boundary.centerLat ?? 0;
  const centerLon = boundary.centerLon ?? 0;
  const radiusKm = boundary.radiusKm ?? 50;

  if (boundary.type === 'POINT_RADIUS' && boundary.centerLat != null && boundary.centerLon != null) {
    // 32-vertex circle polygon — CesiumJS / GeoJSON compatible
    coordinates = circleToPolygon(boundary.centerLat, boundary.centerLon, boundary.radiusKm ?? 50);
  } else if (boundary.type === 'BOUNDING_BOX' && boundary.bbox) {
    const [[minLon, minLat], [maxLon, maxLat]] = boundary.bbox;
    coordinates = [[
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat], // closed ring
    ]];
  } else if (boundary.type === 'NAMED_REGION' && boundary.centerLat != null && boundary.centerLon != null) {
    // Named region with center: generate a 50km approximated circle
    coordinates = circleToPolygon(boundary.centerLat, boundary.centerLon, boundary.radiusKm ?? 50);
  } else if (boundary.centerLat != null && boundary.centerLon != null) {
    // Fallback: generate circle from whatever center we have
    coordinates = circleToPolygon(boundary.centerLat, boundary.centerLon, boundary.radiusKm ?? 50);
  }

  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates },
    properties: {
      centerLat,
      centerLon,
      radiusKm,
      namedRegion: boundary.namedRegion || undefined,
    },
  };
}

// ─── Deduplication ───────────────────────────────────────────────────────────
async function checkDedup(provider, key) {
  const safeProvider = encodeURIComponent(provider);
  const safeKey = encodeURIComponent(key);
  const docRef = db.collection('threatDedup').doc(safeProvider).collection('keys').doc(safeKey);
  const doc = await docRef.get();
  return doc.exists;
}

async function markDedup(provider, key, ttlMinutes) {
  const safeProvider = encodeURIComponent(provider);
  const safeKey = encodeURIComponent(key);
  const docRef = db.collection('threatDedup').doc(safeProvider).collection('keys').doc(safeKey);
  await docRef.set({
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + ttlMinutes * 60000),
  });
}

function calculateExpiry(classification) {
  const dur = classification.temporal?.estimatedDurationHours || 24;
  return new Date(Date.now() + Math.max(dur, 24) * 3600000).toISOString();
}

// ─── Main Event Processor ─────────────────────────────────────────────────────
async function processEvent({
  provider,
  dedupKey,
  dedupTtlMinutes,
  title,
  content,
  url,
  rawApiResponse = {},
  additionalContext = {},
  forceScrape = false,
  fetchedAt = new Date().toISOString(),
}) {
  try {
    if (await checkDedup(provider, dedupKey)) {
      logger.trace({ event: 'DEDUP_CACHE_HIT', source: provider, guid: dedupKey, skipped: true });
      return;
    }

    // Firecrawl enrichment — fetch full article body for URL-based sources
    let finalContent = content;
    if (url && forceScrape) {
      try {
        const startScrape = Date.now();
        const result = await firecrawl.scrapeUrl(url, {
          formats: ['markdown'],
          onlyMainContent: true,
          timeout: 10000,
        });
        if (result && result.data && result.data.markdown) {
          finalContent = result.data.markdown;
          logger.debug({
            event: 'FIRECRAWL_SCRAPE',
            url,
            success: true,
            contentLengthChars: finalContent.length,
            scrapeLatencyMs: Date.now() - startScrape,
          });
        }
      } catch (err) {
        // PRD §9: Firecrawl scrape timeout → use title+description as fallback
        logger.warn({ event: 'FIRECRAWL_SCRAPE_FAILED', url, err: err.message, scrapeSuccess: false });
        finalContent = content; // fall back to original content
      }
    }

    const classificationResult = await classifyEvent({
      sourceType: provider,
      title,
      content: finalContent,
      additionalContext,
    });

    if (!classificationResult) return;

    const { parsed: c, raw, latency } = classificationResult;

    if (c.isRelevant === false) {
      logger.debug({
        event: 'IRRELEVANT_EVENT_DROPPED',
        source: provider,
        title,
        confidence: c.confidence,
        reason: 'isRelevant=false from Gemini',
      });
      await markDedup(provider, dedupKey, dedupTtlMinutes);
      return;
    }

    const threatId = uuidv4();
    const severity = c.severity ?? 1;

    // PRD §13 — Severity to edgeCostMultiplier mapping
    const edgeCostMultiplier = getEdgeCostMultiplier(severity);
    const isHardBlock = severity >= 5;

    const routingImpact = {
      edgeCostMultiplier,
      isHardBlock,
      minimumSafeDistanceKm: c.routingImpact?.minimumSafeDistanceKm ?? 10,
      suggestedDetourRegion: c.routingImpact?.suggestedDetourRegion ?? null,
      affectedEdgeIds: [], // populated by Pathfinder after graph update
    };

    const threatZone = {
      threatId,
      schemaVersion: '1.1.0',
      status: 'ACTIVE',
      source: {
        provider,
        originalUrl: url || '',
        headline: title,
        rawText: (finalContent || title || '').slice(0, 2000),
        fetchedAtUtc: fetchedAt,
        rawApiResponse,
      },
      classification: {
        threatType: c.threatType,
        subType: c.subType || 'UNKNOWN',
        confidence: c.confidence,
        severity,
        affectedModes: c.affectedModes || ['maritime'],
        geminiModel: 'gemini-2.0-flash',
        geminiRawOutput: raw,
        classifiedAtUtc: new Date().toISOString(),
        classificationLatencyMs: latency,
        isRelevant: true,
        rawConfidenceReasoning: c.rawConfidenceReasoning || '',
      },
      // PRD §5 + §13: always a closed Polygon — 32-vertex for POINT_RADIUS
      geometry: convertToGeoJson(c.geoBoundary),
      affectedInfrastructure: c.affectedInfrastructure || {
        ports: [],
        airports: [],
        waterways: [],
        countries: [],
      },
      temporal: {
        estimatedStartUtc: c.temporal?.estimatedStartUtc || new Date().toISOString(),
        estimatedEndUtc: c.temporal?.estimatedEndUtc || null,
        estimatedDurationHours: c.temporal?.estimatedDurationHours || null,
        isOngoing: c.temporal?.isOngoing ?? true,
        createdAtUtc: new Date().toISOString(),
        lastUpdatedUtc: new Date().toISOString(),
        expiresAtUtc: calculateExpiry(c),
      },
      routingImpact,
      impactAssessment: {
        affectedVesselCount: 0,
        affectedVesselIds: [],
        affectedOperatorIds: [],
        estimatedTotalDelayHours: 0,
        economicImpactCategory: 'MEDIUM',
      },
      summary: c.summary || '',
      operatorActions: c.operatorActions || [],
      // Phase 2 extension fields — reserved null per PRD §5
      correlatedThreatIds: [],
      historicalSimilarEvents: [],
      confidenceDecayRate: 0.1,
    };

    // PRD §7.5 — Low confidence → draft queue, do NOT notify VDIE
    if (c.confidence < 0.4) {
      logger.warn({
        event: 'LOW_CONFIDENCE_THREAT_DRAFTED',
        threatId,
        confidence: c.confidence,
        threatType: c.threatType,
        title,
        writtenTo: '/threatsDraft',
      });
      await db.collection('threatsDraft').doc(threatId).set(threatZone);
      await markDedup(provider, dedupKey, dedupTtlMinutes);
      return;
    }

    // PRD §7.6 — Publish to Firestore + spatial indexes + notify VDIE
    if (severity >= 1) {
      const startWrite = Date.now();

      // Write to /threats
      await db.collection('threats').doc(threatId).set(threatZone);

      // Spatial index: /threatsByRegion/{region}/active/{threatId}
      const region = c.geoBoundary?.namedRegion;
      if (region) {
        await db.collection('threatsByRegion').doc(region).collection('active').doc(threatId).set({ threatId });
      }

      // Type index: /threatsByType/{threatType}/active/{threatId}
      if (c.threatType) {
        await db.collection('threatsByType').doc(c.threatType).collection('active').doc(threatId).set({ threatId });
      }

      logger.info({
        event: 'THREAT_FIRESTORE_WRITE',
        threatId,
        collection: '/threats',
        threatType: c.threatType,
        severity,
        centerLat: threatZone.geometry.properties.centerLat,
        centerLon: threatZone.geometry.properties.centerLon,
        namedRegion: threatZone.geometry.properties.namedRegion,
        writeLatencyMs: Date.now() - startWrite,
      });

      await notifyVdie(threatZone, 'THREAT_CREATED');
      await markDedup(provider, dedupKey, dedupTtlMinutes);
    }

  } catch (error) {
    logger.error({ err: error.message, source: provider, title }, 'Failed to process event');
  }
}

// ─── Expiry Runner (PRD §7.8) ─────────────────────────────────────────────────
async function expireThreats() {
  try {
    const now = new Date().toISOString();
    const snapshot = await db.collection('threats')
      .where('status', '==', 'ACTIVE')
      .where('temporal.expiresAtUtc', '<', now)
      .get();

    if (snapshot.empty) {
      logger.debug({ event: 'EXPIRY_RUNNER_NO_THREATS' });
      return;
    }

    const batch = db.batch();
    for (const doc of snapshot.docs) {
      const data = doc.data();
      batch.update(doc.ref, {
        status: 'EXPIRED',
        'temporal.lastUpdatedUtc': new Date().toISOString(),
      });

      logger.info({
        event: 'THREAT_EXPIRED',
        threatId: data.threatId,
        originalSeverity: data.classification?.severity,
        activeDurationHours: data.temporal?.estimatedDurationHours ?? 24,
        affectedVesselCount: data.impactAssessment?.affectedVesselCount ?? 0,
      });

      // Notify VDIE of expiry — non-blocking
      notifyVdie(data, 'THREAT_EXPIRED').catch((err) =>
        logger.error({ event: 'EXPIRY_NOTIFY_FAILED', err: err.message, threatId: data.threatId })
      );
    }

    await batch.commit();
    logger.info({ event: 'EXPIRY_RUNNER_COMPLETE', expiredCount: snapshot.size });
  } catch (err) {
    logger.error({ err: err.message }, 'Error in expiry runner');
  }
}

module.exports = { processEvent, expireThreats, checkDedup, markDedup };
