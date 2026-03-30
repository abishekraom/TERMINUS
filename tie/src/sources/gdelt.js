const { request } = require('undici');
const { processEvent } = require('../threatManager');
const logger = require('../logger');
const crypto = require('crypto');

function hash(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

async function fetchGdelt() {
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'GDELT', scheduledIntervalMs: 180000 });
  const keywords = '"supply chain" OR maritime OR "port congestion" OR shipping';
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(keywords)}&mode=ArtList&maxrecords=250&format=json&timespan=15min`;
  
  try {
    const res = await request(url);
    const data = await res.body.json();
    const articles = data.articles || [];

    logger.debug({
      event: 'SOURCE_FETCH_COMPLETE',
      source: 'GDELT',
      itemsFetched: articles.length,
      fetchLatencyMs: Date.now() - start
    });

    for (const art of articles) {
      const dedupKey = hash(art.url);
      await processEvent({
        provider: 'GDELT',
        dedupKey,
        dedupTtlMinutes: 24 * 60,
        title: art.title,
        url: art.url,
        fetchedAt: new Date().toISOString(),
        rawApiResponse: art,
        additionalContext: { domain: art.domain, language: art.language },
        forceScrape: true // PRD: Feed title + fetched article body (via Firecrawl) to Gemini.
      });
    }

  } catch (err) {
    logger.error({ err, source: 'GDELT' }, 'GDELT fetch failed');
  }
}

module.exports = { fetchGdelt };
