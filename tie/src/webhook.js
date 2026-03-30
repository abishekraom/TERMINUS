const { request } = require('undici');
const config = require('./config');
const logger = require('./logger');
const { db } = require('./firebase');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Notify VDIE Route Monitor of a new/updated/expired ThreatZone.
 * Retries up to 3 times at 5s intervals per PRD §9.
 * On all retries failing → writes to Firestore /webhookRetryQueue for the 2-min cron.
 */
async function notifyVdie(threatZone, eventType) {
  const start = Date.now();
  const payload = {
    threatId: threatZone.threatId,
    eventType,
    geometry: threatZone.geometry,
    routingImpact: threatZone.routingImpact,
    severity: threatZone.classification?.severity,
    affectedModes: threatZone.classification?.affectedModes,
    expiresAtUtc: threatZone.temporal?.expiresAtUtc,
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await request(config.webhook.url, {
        method: 'POST',
        headers: {
          'x-api-key': config.webhook.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        bodyTimeout: 8000,
        headersTimeout: 8000,
      });

      const status = response.statusCode;
      const latency = Date.now() - start;

      if (status >= 200 && status < 300) {
        logger.info({
          event: 'VDIE_WEBHOOK_DELIVERED',
          threatId: threatZone.threatId,
          eventType,
          httpStatus: status,
          deliveryLatencyMs: latency,
        });
        return; // Success — stop retrying
      }

      logger.error({
        event: 'VDIE_WEBHOOK_FAILED',
        threatId: threatZone.threatId,
        httpStatus: status,
        attempt,
        willRetryIn: attempt < MAX_RETRIES ? RETRY_DELAY_MS : 0,
      });

    } catch (error) {
      logger.error({
        event: 'VDIE_WEBHOOK_FAILED',
        threatId: threatZone.threatId,
        err: error.message,
        attempt,
        willRetryIn: attempt < MAX_RETRIES ? RETRY_DELAY_MS : 0,
      });
    }

    if (attempt < MAX_RETRIES) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  // All retries exhausted — write to Firestore retry queue (PRD §9)
  try {
    await db.collection('webhookRetryQueue').doc(threatZone.threatId).set({
      threatId: threatZone.threatId,
      webhookPayload: payload,
      failedAt: new Date().toISOString(),
      attempts: MAX_RETRIES,
    });
    logger.warn({
      event: 'VDIE_WEBHOOK_QUEUED_FOR_RETRY',
      threatId: threatZone.threatId,
      reason: 'All delivery attempts failed — written to /webhookRetryQueue',
    });
  } catch (queueErr) {
    logger.error({
      event: 'WEBHOOK_RETRY_QUEUE_WRITE_FAILED',
      threatId: threatZone.threatId,
      err: queueErr.message,
    });
  }
}

/**
 * Drain the /webhookRetryQueue — called by the 2-min cron in scheduler.js.
 */
async function processWebhookRetryQueue() {
  try {
    const snapshot = await db.collection('webhookRetryQueue').limit(20).get();
    if (snapshot.empty) return;

    for (const doc of snapshot.docs) {
      const { threatId, webhookPayload } = doc.data();
      try {
        const response = await request(config.webhook.url, {
          method: 'POST',
          headers: {
            'x-api-key': config.webhook.apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
          bodyTimeout: 8000,
          headersTimeout: 8000,
        });

        if (response.statusCode >= 200 && response.statusCode < 300) {
          await doc.ref.delete();
          logger.info({
            event: 'WEBHOOK_RETRY_SUCCESS',
            threatId,
            httpStatus: response.statusCode,
          });
        } else {
          logger.warn({
            event: 'WEBHOOK_RETRY_STILL_FAILING',
            threatId,
            httpStatus: response.statusCode,
          });
        }
      } catch (err) {
        logger.error({
          event: 'WEBHOOK_RETRY_ERROR',
          threatId,
          err: err.message,
        });
      }
    }
  } catch (err) {
    logger.error({ event: 'WEBHOOK_RETRY_QUEUE_DRAIN_ERROR', err: err.message });
  }
}

module.exports = { notifyVdie, processWebhookRetryQueue };
