require('dotenv').config();
const fs = require('fs');
const { admin, realtimeDb } = require('./src/firebase');

async function deploy() {
  try {
    const rules = fs.readFileSync('./database.rules.json', 'utf8');
    await realtimeDb.setRules(rules);
    console.log('Successfully deployed Realtime Database rules!');
    process.exit(0);
  } catch (error) {
    console.error('Error deploying rules:', error);
    process.exit(1);
  }
}

deploy();
