'use strict';

/**
 * AISStream WebSocket Connector
 *
 * Maintains a persistent WebSocket connection to AISStream.io.
 * Features:
 *   - Auto-reconnect with exponential backoff (1s → 2s → 4s → 8s → max 60s)
 *   - Subscription to all 4 message types on connect
 *   - Dispatches parsed messages to provided messageHandler callback
 *   - Logs all mandatory events per PRD §11
 */

const WebSocket = require('ws');
const logger = require('../logger');

const WS_ENDPOINT = 'wss://stream.aisstream.io/v0/stream';
const MESSAGE_TYPES = [
  'PositionReport',
  'ShipStaticData',
  'StandardClassBPositionReport',
];

const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS = 60_000;

/**
 * Create and manage an AISStream WebSocket connection.
 *
 * @param {function} messageHandler - called with (parsedMessage) for each AIS message
 * @returns {{ stop: function }} controller object
 */
function createAisStreamConnector(messageHandler) {
  let ws = null;
  let reconnectAttempt = 0;
  let reconnectTimer = null;
  let stopped = false;
  let parseErrorCount = 0;

  function getBackoffMs() {
    const delay = BACKOFF_BASE_MS * Math.pow(2, reconnectAttempt);
    return Math.min(delay, BACKOFF_MAX_MS);
  }

  function sendSubscription() {
    const apiKey = process.env.AISSTREAM_API_KEY;
    if (!apiKey) {
      logger.error({ event: 'AISSTREAM_CONFIG_ERROR', reason: 'AISSTREAM_API_KEY not set' });
      return;
    }

    const subscriptionMsg = JSON.stringify({
      APIKey: apiKey,
      BoundingBoxes: [[[-90, -180], [90, 180]]], // global
      FilterMessageTypes: MESSAGE_TYPES,
    });

    ws.send(subscriptionMsg);
    logger.info({ event: 'AISSTREAM_SUBSCRIBED', messageTypes: MESSAGE_TYPES });
  }

  function connect() {
    if (stopped) return;

    logger.info({
      event: 'AISSTREAM_CONNECTING',
      endpoint: WS_ENDPOINT,
      attempt: reconnectAttempt,
    });

    ws = new WebSocket(WS_ENDPOINT);

    ws.on('open', () => {
      reconnectAttempt = 0; // reset on successful connection
      logger.info({ event: 'AISSTREAM_CONNECTED', endpoint: WS_ENDPOINT });
      sendSubscription();
    });

    ws.on('message', (data) => {
      let parsed;
      const rawStr = data.toString('utf8');
      try {
        parsed = JSON.parse(rawStr);
        // User-requested raw logging for volume tracking
        console.log('RAW_AIS_MSG', JSON.stringify({
          type: parsed.MessageType,
          mmsi: parsed.MetaData?.MMSI,
          shipType: parsed.Message?.ShipStaticData?.Type ?? 
                    parsed.Message?.PositionReport?.NavigationalStatus
        }));
      } catch (err) {
        parseErrorCount++;
        logger.warn({
          event: 'AISSTREAM_PARSE_ERROR',
          parse_error_count: parseErrorCount,
          error: err.message,
          raw: rawStr.slice(0, 200),
        });
        return;
      }

      // Log any error type message the server sends
      if (parsed.Error || parsed.error || parsed.MessageType === 'ERROR') {
        logger.error({ event: 'AISSTREAM_SERVER_ERROR', payload: parsed });
        return;
      }

      const receiptUtc = new Date().toISOString();
      const meta = parsed.MetaData || {};
      const timeUtc = meta.time_utc || receiptUtc;
      const ingestLatencyMs = Date.now() - new Date(timeUtc).getTime();

      logger.debug({
        event: 'AIS_MESSAGE_RECEIVED',
        messageType: parsed.MessageType,
        mmsi: meta.MMSI,
        lat: meta.latitude,
        lon: meta.longitude,
        sog: parsed.Message?.PositionReport?.Sog,
        cog: parsed.Message?.PositionReport?.Cog,
        navStatus: parsed.Message?.PositionReport?.NavigationalStatus,
        receiptUtc,
        ingestLatencyMs,
      });

      try {
        messageHandler(parsed);
      } catch (err) {
        logger.error({ event: 'AISSTREAM_HANDLER_ERROR', error: err.message });
      }
    });

    ws.on('close', (code, reason) => {
      if (stopped) return;

      const backoffMs = getBackoffMs();
      reconnectAttempt++;

      logger.warn({
        event: 'AISSTREAM_RECONNECT',
        attempt: reconnectAttempt,
        backoffMs,
        reason: reason?.toString() || 'Connection closed unexpectedly',
        code,
      });

      reconnectTimer = setTimeout(connect, backoffMs);
    });

    ws.on('error', (err) => {
      logger.error({
        event: 'AISSTREAM_ERROR',
        error: err.message,
      });
      // 'close' event will fire after error, triggering reconnect
    });
  }

  connect();

  return {
    stop() {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.removeAllListeners();
        ws.terminate();
        ws = null;
      }
      logger.info({ event: 'AISSTREAM_STOPPED' });
    },
    getStats() {
      return { parseErrorCount, reconnectAttempt };
    },
  };
}

module.exports = { createAisStreamConnector };
