#!/usr/bin/env node
'use strict';

/**
 * VDIE Demo Replay System
 *
 * Reads a pre-recorded NDJSON file of vessel positions and replays them
 * into Firebase Realtime DB at the correct cadence — simulating live data
 * for demo day without requiring live AIS/ADS-B feeds.
 *
 * Usage:
 *   node tools/replay.js <recording.ndjson> [--speed 1] [--loop] [--dry-run]
 *
 * Options:
 *   --speed <n>    Playback speed multiplier (default: 1 = real-time, 2 = 2x fast)
 *   --loop         Loop the recording indefinitely
 *   --dry-run      Parse and validate without writing to Firebase
 *   --batch <n>    Number of concurrent writes per tick (default: 50)
 *
 * NDJSON line format (expected):
 *   { "capturedAt": "ISO-8601", "elapsedMs": 0, "vesselId": "...", "state": { ... } }
 *
 * The replay engine groups lines by their elapsedMs, sleeps the correct
 * inter-group delay (adjusted by --speed), then writes each vessel state
 * to Firebase Realtime DB at /vessels/{vesselId}/state and appends to
 * /vessels/{vesselId}/trail.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ── CLI Args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const inputFile = args.find((a) => !a.startsWith('--'));

if (!inputFile) {
  console.error('Usage: node tools/replay.js <recording.ndjson> [--speed 1] [--loop] [--dry-run]');
  process.exit(1);
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultVal;
}

const SPEED = parseFloat(getArg('speed', '1'));
const LOOP = hasFlag('loop');
const DRY_RUN = hasFlag('dry-run');
const BATCH_SIZE = parseInt(getArg('batch', '50'), 10);

const inputPath = path.resolve(inputFile);

if (!fs.existsSync(inputPath)) {
  console.error(`File not found: ${inputPath}`);
  process.exit(1);
}

// ── Firebase Setup ───────────────────────────────────────────────────────────

let realtimeDb = null;

if (!DRY_RUN) {
  // Reuse the same Firebase init as VDIE
  const { realtimeDb: db } = require('../src/firebase');
  realtimeDb = db;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Remove undefined properties from an object recursively.
 */
function cleanse(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanse);
  const result = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      result[key] = cleanse(obj[key]);
    }
  }
  return result;
}

// ── NDJSON Parser ────────────────────────────────────────────────────────────

/**
 * Parse the entire NDJSON file into an array of entries, grouped by elapsedMs.
 * Returns: [{ elapsedMs, entries: [{ vesselId, state }] }]
 */
async function parseRecording(filePath) {
  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const linesByElapsed = new Map(); // elapsedMs → [entries]
  let lineCount = 0;
  let parseErrors = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    lineCount++;

    try {
      const entry = JSON.parse(line);

      if (!entry.vesselId || !entry.state) {
        parseErrors++;
        continue;
      }

      const elapsed = entry.elapsedMs ?? 0;
      if (!linesByElapsed.has(elapsed)) {
        linesByElapsed.set(elapsed, []);
      }
      linesByElapsed.get(elapsed).push({
        vesselId: entry.vesselId,
        state: entry.state,
      });
    } catch (err) {
      parseErrors++;
    }
  }

  // Sort groups by elapsedMs ascending
  const groups = Array.from(linesByElapsed.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([elapsedMs, entries]) => ({ elapsedMs, entries }));

  return { groups, lineCount, parseErrors, vesselIds: new Set(groups.flatMap(g => g.entries.map(e => e.vesselId))) };
}

// ── Firebase Writer ──────────────────────────────────────────────────────────

/**
 * Write a batch of vessel states to Firebase Realtime DB.
 */
async function writeBatch(entries) {
  const updates = {};

  for (const { vesselId, state } of entries) {
    // Update the state timestamp to "now" so the data looks fresh
    const freshState = {
      ...state,
      lastUpdatedUtc: new Date().toISOString(),
    };

    updates[`vessels/${vesselId}/state`] = cleanse(freshState);

    // Append latest position to trail
    if (state.position) {
      const trailPoint = {
        lat: state.position.lat,
        lon: state.position.lon,
        altMetres: state.position.altitudeMetres,
        timestampUtc: new Date().toISOString(),
        sogKnots: state.motion?.sogKnots ?? 0,
      };
      // We use a push-style write for trail; batch update sets the state
      // Trail append will be handled separately below
    }
  }

  if (Object.keys(updates).length > 0) {
    await realtimeDb.ref().update(updates);
  }

  // Append trail points via individual transactions (batched)
  const trailPromises = entries
    .filter((e) => e.state.position?.lat != null)
    .map(({ vesselId, state }) => {
      const trailRef = realtimeDb.ref(`vessels/${vesselId}/trail`);
      return trailRef.transaction((currentTrail) => {
        const trail = Array.isArray(currentTrail) ? currentTrail : [];
        trail.push(cleanse({
          lat: state.position.lat,
          lon: state.position.lon,
          altMetres: state.position.altitudeMetres,
          timestampUtc: new Date().toISOString(),
          sogKnots: state.motion?.sogKnots ?? 0,
        }));
        // Ring buffer: keep last 200
        if (trail.length > 200) {
          return trail.slice(trail.length - 200);
        }
        return trail;
      }).catch(() => {}); // swallow individual trail errors
    });

  await Promise.all(trailPromises);
}

// ── Replay Engine ────────────────────────────────────────────────────────────

async function replayOnce(groups, totalLines) {
  let writtenVessels = 0;
  let writtenBatches = 0;
  const replayStart = Date.now();

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    // Calculate delay before this group
    if (i > 0) {
      const prevElapsed = groups[i - 1].elapsedMs;
      const delayMs = (group.elapsedMs - prevElapsed) / SPEED;

      if (delayMs > 0) {
        await sleep(delayMs);
      }
    }

    // Write in batches
    const entries = group.entries;
    for (let b = 0; b < entries.length; b += BATCH_SIZE) {
      const batch = entries.slice(b, b + BATCH_SIZE);

      if (!DRY_RUN) {
        const batchStart = Date.now();
        await writeBatch(batch);
        const latency = Date.now() - batchStart;

        writtenBatches++;
        writtenVessels += batch.length;

        const elapsed = ((Date.now() - replayStart) / 1000).toFixed(1);
        process.stdout.write(
          `\r  ⏵ ${elapsed}s elapsed | Group ${i + 1}/${groups.length} | ${writtenVessels}/${totalLines} writes | ${latency}ms batch latency    `
        );
      } else {
        writtenVessels += batch.length;
        const elapsed = ((Date.now() - replayStart) / 1000).toFixed(1);
        process.stdout.write(
          `\r  ⏵ ${elapsed}s elapsed | Group ${i + 1}/${groups.length} | ${writtenVessels}/${totalLines} vessels (DRY RUN)    `
        );
      }
    }
  }

  return { writtenVessels, writtenBatches };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║          VDIE Demo Replay System                ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  File      : ${path.basename(inputPath)}`);
  console.log(`║  Speed     : ${SPEED}x`);
  console.log(`║  Loop      : ${LOOP ? 'yes' : 'no'}`);
  console.log(`║  Dry Run   : ${DRY_RUN ? 'yes' : 'no'}`);
  console.log(`║  Batch Size: ${BATCH_SIZE}`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  console.log('Parsing recording...');
  const { groups, lineCount, parseErrors, vesselIds } = await parseRecording(inputPath);

  const totalDurationMs = groups.length > 0 ? groups[groups.length - 1].elapsedMs : 0;
  const replayDurationMs = totalDurationMs / SPEED;

  console.log(`  Lines         : ${lineCount}`);
  console.log(`  Parse Errors  : ${parseErrors}`);
  console.log(`  Unique Vessels: ${vesselIds.size}`);
  console.log(`  Time Groups   : ${groups.length}`);
  console.log(`  Original Dur  : ${(totalDurationMs / 1000).toFixed(1)}s`);
  console.log(`  Replay Dur    : ${(replayDurationMs / 1000).toFixed(1)}s (at ${SPEED}x)`);
  console.log('');

  if (groups.length === 0) {
    console.error('No valid entries found in recording. Exiting.');
    process.exit(1);
  }

  let iteration = 0;

  do {
    iteration++;
    if (LOOP) {
      console.log(`\n── Replay iteration #${iteration} ──`);
    } else {
      console.log('Starting replay...\n');
    }

    const { writtenVessels, writtenBatches } = await replayOnce(groups, lineCount);

    console.log(`\n\n✅ Replay iteration #${iteration} complete!`);
    console.log(`   Vessels written : ${writtenVessels}`);

    if (!DRY_RUN) {
      console.log(`   Batches         : ${writtenBatches}`);
    }

    if (LOOP) {
      console.log('   Looping in 2s...');
      await sleep(2000);
    }
  } while (LOOP);

  if (!LOOP) {
    console.log('\nReplay finished. Exiting.');
    process.exit(0);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nReplay interrupted by user.');
  process.exit(0);
});

main().catch((err) => {
  console.error('Fatal replay error:', err);
  process.exit(1);
});
