const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');
const config = require('../config');
const { AIRPORT_LOOKUP } = require('../constants/airportLookup');

/**
 * Top 50 cargo airports cycled in batches of 5 per PRD §3 Source 7.
 */
const AIRPORTS = Object.keys(AIRPORT_LOOKUP);

/**
 * Parse NOTAM coordinates string "DD MM SS N/S DDD MM SS E/W" → { lat, lon }
 * Falls back to ICAO airport lookup table if parsing fails.
 */
function parseNotamCoordinates(coordStr, icaoLocation) {
  if (coordStr) {
    try {
      // Format: "29 55 00 N 032 33 00 E"
      const parts = coordStr.trim().split(/\s+/);
      if (parts.length >= 8) {
        const latDeg = parseInt(parts[0], 10);
        const latMin = parseInt(parts[1], 10);
        const latSec = parseInt(parts[2], 10);
        const latDir = parts[3];
        const lonDeg = parseInt(parts[4], 10);
        const lonMin = parseInt(parts[5], 10);
        const lonSec = parseInt(parts[6], 10);
        const lonDir = parts[7];

        let lat = latDeg + latMin / 60 + latSec / 3600;
        let lon = lonDeg + lonMin / 60 + lonSec / 3600;
        if (latDir === 'S') lat = -lat;
        if (lonDir === 'W') lon = -lon;
        return { lat, lon };
      }
    } catch {
      // Fall through to lookup
    }
  }

  // Fallback: airport lookup table
  const code = (icaoLocation || '').toUpperCase();
  const airport = AIRPORT_LOOKUP[code];
  if (airport) {
    return { lat: airport.lat, lon: airport.lon };
  }

  return null;
}

async function fetchFaa() {
  const apiKey = config.faa?.apiKey;
  if (!apiKey) {
    logger.debug({ event: 'FAA_NOTAM_SKIPPED', reason: 'No FAA_NOTAM_API_KEY configured' });
    return;
  }

  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'FAA_NOTAM', scheduledIntervalMs: 600000 });

  const now = new Date().toISOString();

  for (let i = 0; i < AIRPORTS.length; i += 5) {
    const batch = AIRPORTS.slice(i, i + 5);

    for (const icao of batch) {
      try {
        const url = `https://external-api.faa.gov/notamapi/v1/notams?icaoLocation=${icao}&notamType=NOTAM&effectiveStartDate=${encodeURIComponent(now)}`;
        const res = await request(url, {
          headers: {
            'client_id': apiKey,
            'client_secret': config.faa?.clientSecret || '',
          },
          bodyTimeout: 10000,
          headersTimeout: 10000,
        });

        if (res.statusCode !== 200) {
          logger.warn({ event: 'FAA_NOTAM_HTTP_ERROR', icao, status: res.statusCode });
          continue;
        }

        const data = await res.body.json();
        const notams = data.items || [];

        logger.debug({
          event: 'SOURCE_FETCH_COMPLETE',
          source: 'FAA_NOTAM',
          icao,
          itemsFetched: notams.length,
          fetchLatencyMs: Date.now() - start,
        });

        for (const feature of notams) {
          const notam = feature?.properties?.coreNOTAMData?.notam;
          if (!notam) continue;

          const dedupKey = notam.number || notam.id;
          if (!dedupKey) continue;

          const coordsParsed = parseNotamCoordinates(notam.coordinates, notam.icaoLocation || icao);
          const airport = AIRPORT_LOOKUP[(notam.icaoLocation || icao).toUpperCase()];

          const title = `NOTAM ${notam.number} — ${icao}: ${(notam.text || '').slice(0, 120)}`;
          const content = notam.text || '';

          await processEvent({
            provider: 'FAA_NOTAM',
            dedupKey,
            dedupTtlMinutes: notam.effectiveEnd
              ? Math.max(60, Math.floor((new Date(notam.effectiveEnd) - Date.now()) / 60000))
              : 1440,
            title,
            content,
            url: '',
            fetchedAt: new Date().toISOString(),
            rawApiResponse: feature,
            additionalContext: {
              notamId: notam.id,
              notamNumber: notam.number,
              icaoLocation: notam.icaoLocation || icao,
              scope: notam.scope,
              effectiveStart: notam.effectiveStart,
              effectiveEnd: notam.effectiveEnd,
              lat: coordsParsed?.lat ?? airport?.lat ?? null,
              lon: coordsParsed?.lon ?? airport?.lon ?? null,
              radius: notam.radius,
            },
            forceScrape: false,
          });
        }
      } catch (err) {
        logger.error({ err: err.message, source: 'FAA_NOTAM', icao }, 'FAA NOTAM fetch failed');
      }
    }
  }

  logger.debug({
    event: 'SOURCE_FETCH_COMPLETE',
    source: 'FAA_NOTAM',
    fetchLatencyMs: Date.now() - start,
  });
}

module.exports = { fetchFaa };
