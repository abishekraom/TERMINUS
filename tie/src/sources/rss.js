const Parser = require('rss-parser');
const { processEvent } = require('../threatManager');
const logger = require('../logger');

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
});

const feeds = [
  'https://feeds.reuters.com/reuters/worldNews',
  'https://feeds.reuters.com/reuters/businessNews',
  'https://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rsshub.app/ap/topics/apf-topnews', // PRD §3 Source 3 — AP top news
];

async function fetchRss() {
  const start = Date.now();
  logger.debug({ event: 'POLL_CYCLE_START', source: 'RSS', scheduledIntervalMs: 180000 });
  
  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items) {
        const dedupKey = item.guid || item.link;
        await processEvent({
          provider: 'RSS',
          dedupKey,
          dedupTtlMinutes: 24 * 60,
          title: item.title,
          content: item.contentSnippet || item.content,
          url: item.link,
          fetchedAt: new Date().toISOString(),
          rawApiResponse: item,
          additionalContext: { pubDate: item.isoDate || item.pubDate, categories: item.categories },
          forceScrape: true
        });
      }
    } catch (err) {
      logger.error({ err, source: 'RSS', url }, 'RSS fetch failed');
    }
  }

  logger.debug({
    event: 'SOURCE_FETCH_COMPLETE',
    source: 'RSS',
    fetchLatencyMs: Date.now() - start
  });
}

module.exports = { fetchRss };
