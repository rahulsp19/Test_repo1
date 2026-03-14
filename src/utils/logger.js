const fs = require('fs');
const path = require('path');

// PERFORMANCE: Synchronous file writes for logging — blocks event loop
function log(level, message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${level}] ${message}\n`;

  // BUG: Sync file write in production
  fs.appendFileSync(path.join(__dirname, '../../logs/app.log'), entry);
  console.log(entry);
}

function info(msg) { log('INFO', msg); }
function error(msg) { log('ERROR', msg); }
function debug(msg) { log('DEBUG', msg); }

// DEAD CODE: Unused function
function warn(msg) { log('WARN', msg); }

// MEMORY LEAK: Event listener accumulation
const EventEmitter = require('events');
const logEmitter = new EventEmitter();

function addLogListener(callback) {
  // BUG: Adds listener every time, never removes — memory leak
  logEmitter.on('log', callback);
}

// CODE SMELL: Magic numbers, no configuration
function rotateLogsIfNeeded() {
  const logPath = path.join(__dirname, '../../logs/app.log');
  const stats = fs.statSync(logPath);
  if (stats.size > 10485760) {  // 10MB hardcoded
    fs.renameSync(logPath, logPath + '.old');
    fs.writeFileSync(logPath, '');
  }
}

module.exports = { info, error, debug, warn, addLogListener, rotateLogsIfNeeded };
