'use strict';

const http = require('http');
const fs = require('fs');
const { header, subheader, pass, fail, info, assert, summary, runTest } = require('./test-utils');

async function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    }).on('error', err => reject(err));
  });
}

async function run() {
  header('Integration Tests: VDIE Express & WebSocket API');

  subheader('HTTP Route Diagnostics');
  info('To complete API integration diagnostics, you must ensure the VDIE master server is actively running (`npm run start`).');

  try {
    const health = await httpGet('http://localhost:3001/health');
    assert(health.statusCode === 200, `Health check responds optimally on port 3001 HTTP (${health.statusCode})`, `Health check failed HTTP ${health.statusCode}`);
    
    // Attempt parsing 
    const healthJson = JSON.parse(health.body);
    assert(healthJson.status === 'ok', 'Engine explicitly reports OK operational status', 'Engine returned degraded/offline status payload');
    
    fs.writeFileSync('health.json', health.body);
    pass('Saved payload cleanly directly down to health.json');
  } catch(e) {
    fail('Health Endpoint Failure (Server is likely down):', e);
  }

  try {
    const snapshot = await httpGet('http://localhost:3001/vessels/snapshot?lod=5');
    assert(snapshot.statusCode === 200, `Snapshot endpoint HTTP OK (${snapshot.statusCode})`, `Snapshot query crashed with ${snapshot.statusCode}`);
    
    let snapJson;
    try {
      snapJson = JSON.parse(snapshot.body);
      pass('Snapshot structured cleanly parsing JSON arrays properly out of standard library responses.');
    } catch(err) {
      fail('Snapshot payload malformed or not JSON compliant!', err);
    }
    
    fs.writeFileSync('snapshot.json', snapshot.body);
    pass('Piped 100% of snapshot telemetry into snapshot.json for visualization routines');
  } catch(e) {
    fail('Dynamic Snapshot Delivery Failure:', e);
  }

  summary();
  process.exit();
}

run();
