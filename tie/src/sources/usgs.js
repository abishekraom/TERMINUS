const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');

async function fetchUsgs() {
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'USGS', scheduledIntervalMs: 180000 });
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_hour.geojson`;

  try {
    const res = await request(url);
    const data = await res.body.json();
    const Earthquakes = data.features || [];

    logger.debug({
      event: 'SOURCE_FETCH_COMPLETE',
      source: 'USGS',
      itemsFetched: Earthquakes.length,
      fetchLatencyMs: Date.now() - start
    });

    for (const eq of Earthquakes) {
      if (!eq.properties) continue;
      
      const mag = eq.properties.mag;
      const tsunami = eq.properties.tsunami;
      
      if (mag >= 6.0 || tsunami == 1) {
        logger.warn({
          event: 'SEISMIC_EVENT_DETECTED',
          usgsId: eq.id,
          magnitude: mag,
          depth: eq.geometry?.coordinates?.[2],
          tsunamiFlag: tsunami,
          place: eq.properties.place,
          lat: eq.geometry?.coordinates?.[1],
          lon: eq.geometry?.coordinates?.[0]
        });

        const dedupKey = eq.id;
        const title = `Significant Earthquake: Mag ${mag} near ${eq.properties.place}`;
        
        await processEvent({
          provider: 'USGS',
          dedupKey,
          dedupTtlMinutes: 48 * 60,
          title,
          content: eq.properties.title + ` Details: ${eq.properties.url}. Tsnuami warning level: ${tsunami}.`,
          url: eq.properties.url,
          fetchedAt: new Date().toISOString(),
          rawApiResponse: eq,
          additionalContext: { lat: eq.geometry?.coordinates?.[1], lon: eq.geometry?.coordinates?.[0], magnitude: mag },
          forceScrape: false
        });
      }
    }

  } catch (err) {
    logger.error({ err, source: 'USGS' }, 'USGS fetch failed');
  }
}

module.exports = { fetchUsgs };
