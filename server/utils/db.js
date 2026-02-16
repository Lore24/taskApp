const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

const DEFAULT_DATA = {
  projects: [],
  tasks: [],
  subtasks: [],
};

function readDB() {
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
