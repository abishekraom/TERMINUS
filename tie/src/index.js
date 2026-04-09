require('dotenv').config();
const fastify = require('fastify')({ logger: false });
const cors = require('@fastify/cors');
const { startScheduler } = require('./scheduler');
const config = require('./config');
const logger = require('./logger');
const { db } = require('./firebase');

// ─── Health (public — no auth required) ────────────────────────────────────
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    service: 'tie',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  };
});

// ─── x-api-key Authentication Hook (PRD §2 + §13) ──────────────────────────
async function authenticate(request, reply) {
  const apiKey = request.headers['x-api-key'];
  if (!apiKey || apiKey !== config.webhook.apiKey) {
    reply.code(401).send({ error: 'Unauthorized', message: 'Missing or invalid x-api-key header' });
  }
}

// ─── Protected Routes ────────────────────────────────────────────────────────

/**
 * GET /threats/active — returns all ACTIVE ThreatZones, optionally filtered by mode.
 * Used by the Pathfinder engine per PRD §13 integration contract.
 * Query param: ?mode=maritime | air
 */
fastify.get('/threats/active', { preHandler: authenticate }, async (request, reply) => {
  try {
    const { mode } = request.query;
    const collRef = db.collection('threats').where('status', '==', 'ACTIVE');
    const snapshot = await collRef.get();

    let threats = snapshot.docs.map((doc) => doc.data());

    // Filter by affectedModes if mode param provided
    if (mode) {
      threats = threats.filter((t) =>
        t.classification?.affectedModes?.includes(mode)
      );
    }

    return reply.code(200).send({
      count: threats.length,
      threats,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err: err.message }, 'Failed to fetch active threats');
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
});

/**
 * GET /threats/:threatId — returns a single ThreatZone by ID.
 */
fastify.get('/threats/:threatId', { preHandler: authenticate }, async (request, reply) => {
  try {
    const { threatId } = request.params;
    const doc = await db.collection('threats').doc(threatId).get();

    if (!doc.exists) {
      return reply.code(404).send({ error: 'Not Found', threatId });
    }

    return reply.code(200).send(doc.data());
  } catch (err) {
    logger.error({ err: err.message, threatId: request.params.threatId }, 'Failed to fetch threat');
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
});

// ─── Server Startup ───────────────────────────────────────────────────────────
const start = async () => {
  try {
    await fastify.register(cors, {
      origin: 'http://localhost:5173', // Your Vite frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
    });
    
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    logger.info(`TIE Server listening on port ${config.port}`);
    startScheduler();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
