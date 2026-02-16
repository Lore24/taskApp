const fs = require('fs');
const path = require('path');

const isVercel = !!process.env.VERCEL;

// On Vercel, the filesystem is read-only except /tmp
// Use /tmp/db.json for the writable database and seed from the bundled db.json
const LOCAL_DB_PATH = path.join(__dirname, '..', 'db.json');
const VERCEL_DB_PATH = '/tmp/db.json';
const DB_PATH = isVercel ? VERCEL_DB_PATH : LOCAL_DB_PATH;

const DEFAULT_DATA = {
  projects: [],
  tasks: [],
  subtasks: [],
};

function seedIfNeeded() {
  if (isVercel && !fs.existsSync(VERCEL_DB_PATH)) {
    try {
      // Copy the bundled db.json to /tmp on first request
      if (fs.existsSync(LOCAL_DB_PATH)) {
        fs.copyFileSync(LOCAL_DB_PATH, VERCEL_DB_PATH);
      } else {
        fs.writeFileSync(VERCEL_DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      }
    } catch (err) {
      console.error('Error seeding db to /tmp:', err);
    }
  }
}

function readDB() {
  seedIfNeeded();
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDB(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return DEFAULT_DATA;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
    throw err;
  }
}

module.exports = { readDB, writeDB };
