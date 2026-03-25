#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

// Colors for terminal (ANSI escape codes)
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m'
};

const envPath = path.join(__dirname, '.env');
let PORT = 3001;
let API_KEY = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#]+?)=(.+)$/);
    if (match) {
      if (match[1].trim() === 'PORT') PORT = match[2].trim();
      if (match[1].trim() === 'INTERNAL_API_KEY') API_KEY = match[2].trim();
    }
  });
}

const options = {
  hostname: 'localhost',
  port: PORT,
  path: '/vessels/snapshot?lod=5000',
  method: 'GET',
  headers: {}
};

if (API_KEY) options.headers['x-api-key'] = API_KEY;

console.log(`${colors.cyan}Connecting to VDIE API on port ${PORT}...${colors.reset}`);

// Utility to flatten nested objects for a cleaner table display
function flattenObject(ob) {
  var toReturn = {};
  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    if ((typeof ob[i]) == 'object' && ob[i] !== null) {
      if (Array.isArray(ob[i])) {
        // Summarize arrays
        toReturn[i] = `[Array of ${ob[i].length} items]`;
      } else {
        var flatObject = flattenObject(ob[i]);
        for (var x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + '.' + x] = flatObject[x];
        }
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
}

function printAsciiBox(title, contentLines, color = colors.cyan) {
  const width = Math.max(50, title.length + 4, ...contentLines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length));
  
  console.log(`${color}╔${'═'.repeat(width + 2)}╗${colors.reset}`);
  console.log(`${color}║${colors.bright} ${title.padEnd(width)} ${colors.reset}${color}║${colors.reset}`);
  console.log(`${color}╠${'═'.repeat(width + 2)}╣${colors.reset}`);
  
  contentLines.forEach(line => {
    const rawLen = line.replace(/\x1b\[[0-9;]*m/g, '').length;
    const padding = ' '.repeat(Math.max(0, width - rawLen));
    console.log(`${color}║${colors.reset} ${line}${padding} ${color}║${colors.reset}`);
  });
  console.log(`${color}╚${'═'.repeat(width + 2)}╝${colors.reset}\n`);
}

function visualizeRecord(record, title, color) {
  console.log(`${color}${colors.bright}=====> ${title} RECORD <=====${colors.reset}`);
  
  // Separate arrays from standard fields
  const scalars = {};
  const arrays = {};
  
  for (const key in record) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      if (Array.isArray(record[key])) {
        arrays[key] = record[key];
      } else {
        scalars[key] = record[key];
      }
    }
  }

  const flat = flattenObject(scalars);
  const tableData = Object.keys(flat).map(k => ({
    Field: k,
    Value: String(flat[k]).substring(0, 50) + (String(flat[k]).length > 50 ? '...' : '')
  }));
  
  console.table(tableData);

  // Present arrays efficiently
  for (const arrayKey in arrays) {
    const arr = arrays[arrayKey];
    console.log(`\n${color}--- [Array Field: ${arrayKey}] (${arr.length} items) ---${colors.reset}`);
    if (arr.length > 0) {
      if (typeof arr[0] === 'object' && arr[0] !== null) {
         console.table(arr.slice(0, 5)); // Cap to 5 to avoid screen flood
         if (arr.length > 5) console.log(`${color}  ... and ${arr.length - 5} more items${colors.reset}`);
      } else {
         console.log(arr.join(', '));
      }
    } else {
      console.log('  (Empty)');
    }
  }
  
  console.log('');
}

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`Error: Status Code ${res.statusCode}`);
      return;
    }

    try {
      const parsed = JSON.parse(data);
      const vessels = parsed.vessels || [];

      let shipsCount = 0;
      let planesCount = 0;
      let sampleShip = null;
      let samplePlane = null;

      vessels.forEach(v => {
        const type = v.vesselType || 'UNKNOWN';
        const isAircraft = v.source === 'ADSB' || type.includes('AIRCRAFT') || type === 'AIRCRAFT_CARGO';
        
        if (isAircraft) {
          planesCount++;
          if (!samplePlane) samplePlane = v;
        } else {
          shipsCount++;
          if (!sampleShip) sampleShip = v;
        }
      });

      // Calculate total breakdown proportionally if LOD capped
      let totalShips = shipsCount;
      let totalPlanes = planesCount;
      
      if (parsed.total > parsed.count && parsed.count > 0) {
        const ratio = parsed.total / parsed.count;
        totalShips = Math.round(shipsCount * ratio);
        totalPlanes = Math.round(planesCount * ratio);
      }

      const summaryLines = [
        `System Timestamp : ${colors.yellow}${parsed.generatedAt}${colors.reset}`,
        `Total Tracked    : ${colors.bright}${parsed.total}${colors.reset} vessels`,
        `Fetched (LOD)    : ${parsed.count} vessels`,
        ``,
        `--- Estimated Breakdown ---`,
        `${colors.magenta}✈ AIRPLANES      : ${totalPlanes}${colors.reset}`,
        `${colors.green}⛴ SHIPS          : ${totalShips}${colors.reset}`
      ];

      printAsciiBox('VDIE GLOBAL METRICS dashboard', summaryLines, colors.cyan);

      if (sampleShip) {
        visualizeRecord(sampleShip, 'SHIP', colors.green);
      }
      
      if (samplePlane) {
        visualizeRecord(samplePlane, 'AIRPLANE', colors.magenta);
      }

    } catch (e) {
      console.error('Failed to parse response JSON:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
