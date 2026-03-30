const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');
const config = require('../config');
const crypto = require('crypto');

function hash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

async function fetchNewsApi() {
  if (!config.newsApi.apiKey) return;
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'NEWSAPI', scheduledIntervalMs: 900000 });
  const q = '"supply chain" OR "port congestion" OR "shipping disruption" OR "canal closure"';
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=50&apiKey=${config.newsApi.apiKey}`;

  try {
    const res = await request(url);
    const data = await res.body.json();
    const articles = data.articles || [];

    logger.debug({
      event: 'SOURCE_FETCH_COMPLETE',
      source: 'NEWSAPI',
      itemsFetched: articles.length,
      fetchLatencyMs: Date.now() - start
    });

    for (const art of articles) {
      const dedupKey = hash(art.url);
      await processEvent({
        provider: 'NEWSAPI',
        dedupKey,
        dedupTtlMinutes: 24 * 60,
        title: art.title,
        content: art.description + " " + art.content,
        url: art.url,
        fetchedAt: new Date().toISOString(),
        rawApiResponse: art,
        additionalContext: { publishedAt: art.publishedAt, source: art.source?.name },
        forceScrape: true
      });
    }

  } catch (err) {
    logger.error({ err, source: 'NEWSAPI' }, 'NEWSAPI fetch failed');
  }
}

module.exports = { fetchNewsApi };
