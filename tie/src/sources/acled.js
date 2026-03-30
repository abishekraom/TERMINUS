const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');
const config = require('../config');

async function fetchAcled() {
  if (!config.acled.apiKey || !config.acled.email) return;
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'ACLED', scheduledIntervalMs: 600000 });

  const dateStr = new Date().toISOString().split('T')[0];
  // limit=100 as per PRD
  const url = `https://api.acleddata.com/acled/read?key=${config.acled.apiKey}&email=${config.acled.email}&event_date=${dateStr}&event_date_where=BETWEEN&region=11,12,15&event_type=Battles|Violence against civilians|Strategic developments&limit=100`;

  try {
    const res = await request(url);
    const data = await res.body.json();
    const events = data.data || [];

    logger.debug({
      event: 'SOURCE_FETCH_COMPLETE',
      source: 'ACLED',
      itemsFetched: events.length,
      fetchLatencyMs: Date.now() - start
    });

    for (const ev of events) {
      const dedupKey = String(ev.data_id);
      
      const title = `${ev.event_type} (${ev.sub_event_type}) in ${ev.location}, ${ev.country}`;
      const content = ev.notes;

      await processEvent({
        provider: 'ACLED',
        dedupKey,
        dedupTtlMinutes: 7 * 24 * 60,
        title,
        content,
        url: '',
        fetchedAt: new Date().toISOString(),
        rawApiResponse: ev,
        additionalContext: {
          lat: ev.latitude,
          lon: ev.longitude,
          fatalities: ev.fatalities,
          actors: [ev.actor1, ev.actor2]
        },
        forceScrape: false
      });
    }

  } catch (err) {
    logger.error({ err, source: 'ACLED' }, 'ACLED fetch failed');
  }
}

module.exports = { fetchAcled };
