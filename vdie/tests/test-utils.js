'use strict';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const ICONS = {
  pass: '✅',
  fail: '❌',
  suite: '🧪',
  info: 'ℹ️',
  warn: '⚠️',
  clock: '⏱️',
};

let globalStats = { passed: 0, failed: 0, startTime: Date.now() };

function header(title) {
  console.log(`\n${COLORS.bright}${COLORS.cyan}${ICONS.suite}  ${title}${COLORS.reset}`);
  console.log(`${COLORS.dim}${'═'.repeat(60)}${COLORS.reset}\n`);
}

function subheader(title) {
  console.log(`\n${COLORS.bright}${COLORS.blue}▶  ${title}${COLORS.reset}`);
}

function pass(msg) {
  console.log(`   ${ICONS.pass}  ${COLORS.green}${msg}${COLORS.reset}`);
  globalStats.passed++;
}

function fail(msg, err) {
  console.error(`   ${ICONS.fail}  ${COLORS.red}${msg}${COLORS.reset}`);
  if (err) {
    if (typeof err === 'string') {
      console.error(`      ${COLORS.gray}└─ ${err}${COLORS.reset}`);
    } else if (err.message) {
      console.error(`      ${COLORS.gray}└─ ${err.message}${COLORS.reset}`);
      if (err.stack) {
         console.error(`      ${COLORS.gray}   ${err.stack.split('\n')[1].trim()}${COLORS.reset}`);
      }
    }
  }
  globalStats.failed++;
}

function info(msg) {
  console.log(`   ${ICONS.info}  ${COLORS.dim}${msg}${COLORS.reset}`);
}

function assert(condition, successMsg, failMsg) {
  if (condition) {
    pass(successMsg);
  } else {
    fail(failMsg, 'Assertion Failed. Condition evaluated to false.');
  }
}

function assertEqual(actual, expected, msg) {
  if (actual === expected) {
    pass(msg);
  } else {
    fail(msg, `Expected: ${expected} | Actual: ${actual}`);
  }
}

function summary() {
  const duration = ((Date.now() - globalStats.startTime) / 1000).toFixed(2);
  console.log(`\n${COLORS.dim}${'═'.repeat(60)}${COLORS.reset}`);
  
  if (globalStats.failed === 0 && globalStats.passed > 0) {
    console.log(`  ${COLORS.bright}${COLORS.green}ALL TESTS PASSED${COLORS.reset}`);
  } else {
    console.log(`  ${COLORS.bright}${COLORS.red}TESTS FAILED${COLORS.reset}`);
  }
  
  console.log(`  Passed: ${COLORS.green}${globalStats.passed}${COLORS.reset} | Failed: ${COLORS.red}${globalStats.failed}${COLORS.reset} | Time: ${ICONS.clock} ${duration}s`);
  console.log(`${COLORS.dim}${'═'.repeat(60)}${COLORS.reset}\n`);
  
  if (globalStats.failed > 0) {
    process.exit(1);
  }
}

async function runTest(name, fn) {
  try {
    const start = Date.now();
    await fn();
    const ms = Date.now() - start;
    console.log(`   ${ICONS.pass}  ${COLORS.green}${name}${COLORS.reset} ${COLORS.gray}(${ms}ms)${COLORS.reset}`);
    globalStats.passed++;
  } catch (err) {
    fail(name, err);
  }
}

module.exports = {
  header,
  subheader,
  pass,
  fail,
  info,
  assert,
  assertEqual,
  summary,
  runTest,
  COLORS
};
