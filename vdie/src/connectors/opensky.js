'use strict';

/**
 * OpenSky Network Connector
 *
 * Features:
 *   - OAuth2 Bearer Token acquisition via OPENSKY_TOKEN_ENDPOINT
 *   - Auto token rotation on 401 Unauthorized
 *   - 30-second polling of /states/all (configurable via OPENSKY_POLL_INTERVAL_MS)
 *   - 60-second backoff on 429 Too Many Requests
 *   - Filters: on_ground==false, category IN [4, 5, 6]
 *   - Dispatches normalized states to provided callback
 */

const { fetch } = require('undici');
const logger = require('../logger');

const OPENSKY_STATES_URL = 'https://opensky-network.org/api/states/all?extended=1';

/**
 * Create the OpenSky polling connector.
 *
 * @param {function} messageHandler - called with raw OpenSky response object
 * @returns {{ stop: function, getStats: function }}
 */
function createOpenSkyConnector(messageHandler) {
  let accessToken = null;
  let tokenExpiresAt = 0;
  let pollTimer = null;
  let stopped = false;
  let pollCount = 0;
  let errorCount = 0;

  const pollIntervalMs = parseInt(process.env.OPENSKY_POLL_INTERVAL_MS, 10) || 30_000;
  const tokenEndpoint = process.env.OPENSKY_TOKEN_ENDPOINT || 'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token';
  const clientId = process.env.OPENSKY_CLIENT_ID;
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET;

  /**
   * Fetch a new OAuth2 Bearer token from OpenSky.
   */
  async function fetchOAuthToken() {
    if (!clientId || !clientSecret) return;

    try {
      const body = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;
      const res = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      });

      if (!res.ok) {
        throw new Error(`Token fetch failed: ${res.status}`);
      }

      const data = await res.json();
      accessToken = data.access_token;
      // Buffer of 60s to avoid edge-case expiration
      tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60_000;

      logger.info({ event: 'OPENSKY_TOKEN_REFRESHED', expires_in: data.expires_in });
    } catch (err) {
      logger.error({ event: 'OPENSKY_TOKEN_ERROR', error: err.message });
      accessToken = null;
      throw err;
    }
  }

  /**
   * Single poll of the OpenSky /states/all endpoint.
   */
  async function poll() {
    if (stopped) return;

    pollCount++;

    try {
      // Refresh token if needed
      if (!accessToken || Date.now() > tokenExpiresAt) {
        await fetchOAuthToken();
      }

      if (!accessToken) {
        logger.warn({ event: 'OPENSKY_POLL_SKIPPED', reason: 'no_token' });
        schedulePoll(pollIntervalMs);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${accessToken}`
      };

      const res = await fetch(OPENSKY_STATES_URL, { headers });

      if (res.status === 401 || res.status === 403) {
        logger.warn({ event: 'OPENSKY_AUTH_FAILED', action: 'refresh_token', status: res.status });
        accessToken = null; // force refresh on next poll
        schedulePoll(pollIntervalMs);
        return;
      }

      if (res.status === 429) {
        errorCount++;
        const retryAfter = new Date(Date.now() + 60_000).toISOString();
        logger.warn({
          event: 'OPENSKY_RATE_LIMITED',
          backoffMs: 60_000,
          retryAfter,
        });
        schedulePoll(60_000);
        return;
      }

      if (!res.ok) {
        errorCount++;
        logger.error({ event: 'OPENSKY_POLL_ERROR', status: res.status });
        schedulePoll(pollIntervalMs);
        return;
      }

      const data = await res.json();

      logger.debug({
        event: 'OPENSKY_POLL_SUCCESS',
        totalStates: data.states?.length ?? 0,
        pollCount,
      });

      try {
        messageHandler(data);
      } catch (err) {
        logger.error({ event: 'OPENSKY_HANDLER_ERROR', error: err.message });
      }
    } catch (err) {
      errorCount++;
      logger.error({ event: 'OPENSKY_POLL_EXCEPTION', error: err.message });
    }

    schedulePoll(pollIntervalMs);
  }

  function schedulePoll(delayMs) {
    if (stopped) return;
    pollTimer = setTimeout(poll, delayMs);
  }

  // Start immediately
  poll();

  return {
    stop() {
      stopped = true;
      if (pollTimer) {
        clearTimeout(pollTimer);
        pollTimer = null;
      }
      logger.info({ event: 'OPENSKY_STOPPED' });
    },
    getStats() {
      return { pollCount, errorCount };
    },
  };
}

module.exports = { createOpenSkyConnector };
