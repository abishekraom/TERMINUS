#!/usr/bin/env node
'use strict';

/**
 * VDIE Demo Recorder
 *
 * Captures live vessel state snapshots from the running VDIE engine
 * into an NDJSON file for later replay.
 *
 * Usage:
 *   node tools/record.js [--duration 300] [--interval 5] [--output data/demo/recording.ndjson]
 *
 * The recorder polls the REST snapshot endpoint at the configured interval
 * and writes each vessel state as a separate NDJSON line with an envelope
 * containing the capture timestamp.
 *
 * NDJSON line format:
 *   { "capturedAt": "ISO-8601", "elapsed": 0, "vesselId": "...", "state": { ... } }
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// ── CLI Args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultVal;
}

const DURATION_SEC = parseInt(getArg('duration', '300'), 10);   // default 5 min
const INTERVAL_SEC = parseInt(getArg('interval', '5'), 10);     // default 5s
const OUTPUT_FILE = getArg('output', 'data/demo/recording.ndjson');
const PORT = parseInt(getArg('port', '3001'), 10);
const API_KEY = getArg('api-key', process.env.INTERNAL_API_KEY || '');
const LOD = parseInt(getArg('lod', '5000'), 10);

// ── Setup ────────────────────────────────────────────────────────────────────

const outputPath = path.resolve(__dirname, '..', OUTPUT_FILE);
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const writeStream = fs.createWriteStream(outputPath, { flags: 'w', encoding: 'utf8' });

console.log('╔══════════════════════════════════════════════════╗');
console.log('║          VDIE Demo Recorder                     ║');
console.log('╠══════════════════════════════════════════════════╣');
console.log(`║  Duration    : ${DURATION_SEC}s`);
console.log(`║  Interval    : ${INTERVAL_SEC}s`);
console.log(`║  LOD         : ${LOD}`);
console.log(`║  Output      : ${OUTPUT_FILE}`);
console.log(`║  VDIE Port   : ${PORT}`);
console.log('╚══════════════════════════════════════════════════╝');
console.log('');

let recordingStartTime = null;
let totalLines = 0;
let snapshots = 0;

// ── Snapshot Fetcher ─────────────────────────────────────────────────────────

function fetchSnapshot() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: `/vessels/snapshot?lod=${LOD}`,
      method: 'GET',
      headers: {},
      timeout: 10000,
    };

    if (API_KEY) options.headers['x-api-key'] = API_KEY;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(new Error(`JSON parse error: ${err.message}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    req.end();
  });
}

// ── Recording Loop ───────────────────────────────────────────────────────────

async function captureSnapshot() {
  try {
    const snapshot = await fetchSnapshot();
    const vessels = snapshot.vessels || [];

    if (!recordingStartTime) {
      recordingStartTime = Date.now();
    }

    const capturedAt = new Date().toISOString();
    const elapsedMs = Date.now() - recordingStartTime;

    for (const vessel of vessels) {
      const line = JSON.stringify({
        capturedAt,
        elapsedMs,
        vesselId: vessel.vesselId,
        state: vessel,
      });
      writeStream.write(line + '\n');
      totalLines++;
    }

    snapshots++;
    process.stdout.write(
      `\r  [${new Date().toLocaleTimeString()}] Snapshot #${snapshots} — ${vessels.length} vessels (${totalLines} lines total)`
    );
  } catch (err) {
    console.error(`\n  ⚠ Snapshot error: ${err.message}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Recording started — will run for ${DURATION_SEC}s...\n`);

  // Take immediate first snapshot
  await captureSnapshot();

  const intervalTimer = setInterval(captureSnapshot, INTERVAL_SEC * 1000);

  // Stop after duration
  setTimeout(() => {
    clearInterval(intervalTimer);
    writeStream.end(() => {
      console.log(`\n\n✅ Recording complete!`);
      console.log(`   Snapshots : ${snapshots}`);
      console.log(`   Lines     : ${totalLines}`);
      console.log(`   File      : ${outputPath}`);
      console.log(`   Size      : ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
      process.exit(0);
    });
  }, DURATION_SEC * 1000);
}

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\nRecording interrupted by user.');
  writeStream.end(() => {
    console.log(`Saved ${totalLines} lines to ${outputPath}`);
    process.exit(0);
  });
});

main().catch((err) => {
  console.error('Fatal recorder error:', err);
  process.exit(1);
});
