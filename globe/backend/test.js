const http = require('http');
const fs = require('fs');

http.get('http://localhost:3001/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('health.json', data));
}).on('error', err => fs.writeFileSync('health.json', JSON.stringify({error: err.message})));

http.get('http://localhost:3001/vessels/snapshot?lod=5', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => fs.writeFileSync('snapshot.json', data));
}).on('error', err => fs.writeFileSync('snapshot.json', JSON.stringify({error: err.message})));
