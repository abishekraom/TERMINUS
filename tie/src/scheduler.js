const cron = require('node-cron');
const { fetchGdelt } = require('./sources/gdelt');
const { fetchNewsApi } = require('./sources/newsapi');
const { fetchRss } = require('./sources/rss');
const { fetchAcled } = require('./sources/acled');
const { fetchOwm } = require('./sources/owm');
const { fetchUsgs } = require('./sources/usgs');
const { fetchFaa } = require('./sources/faa');
const { expireThreats } = require('./threatManager');
const { processWebhookRetryQueue } = require('./webhook');
const logger = require('./logger');

function startScheduler() {
  logger.info('Starting Threat Intelligence Engine standard schedulers...');

  // GDELT: every 3 mins — PRD §6
  cron.schedule('*/3 * * * *', fetchGdelt);

  // RSS (Reuters + BBC + AP): every 3 mins — PRD §6
  cron.schedule('*/3 * * * *', fetchRss);

  // USGS earthquake feed: every 3 mins — PRD §6
  cron.schedule('*/3 * * * *', fetchUsgs);

  // ACLED conflict data: every 10 mins — PRD §6
  cron.schedule('*/10 * * * *', fetchAcled);

  // FAA NOTAM: every 10 mins — PRD §6
  cron.schedule('*/10 * * * *', fetchFaa);

  // NewsAPI: every 15 mins — PRD §6
  cron.schedule('*/15 * * * *', fetchNewsApi);

  // OWM chokepoint weather: every 45 secs — PRD §6
  cron.schedule('*/45 * * * * *', fetchOwm);

  // Expire stale ThreatZones: every 5 minutes — PRD §7.8
  cron.schedule('*/5 * * * *', expireThreats);

  // Drain VDIE webhook retry queue: every 2 minutes — PRD §9 (VDIE webhook delivery failure)
  cron.schedule('*/2 * * * *', processWebhookRetryQueue);

  // Initial polls on startup
  setImmediate(async () => {
    logger.info('Running initial polls on startup...');
    await Promise.allSettled([
      fetchGdelt(),
      fetchRss(),
      fetchUsgs(),
      fetchOwm(),
      fetchNewsApi(),
      fetchAcled(),
      fetchFaa(),
    ]);
    logger.info('Initial polls complete.');
  });
}

module.exports = { startScheduler };
