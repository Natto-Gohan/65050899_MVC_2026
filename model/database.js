const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.join(__dirname, 'database.db')
);

// Politicians
db.run(`
CREATE TABLE IF NOT EXISTS Politicians (
  politician_id TEXT PRIMARY KEY CHECK(length(politician_id)=8 AND politician_id NOT LIKE '0%'),
  name TEXT,
  party TEXT
)`);

// Campaigns
db.run(`
CREATE TABLE IF NOT EXISTS Campaigns (
  campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
  election_year INTEGER,
  district TEXT
)`);

// Promises
db.run(`
CREATE TABLE IF NOT EXISTS Promises (
  promise_id INTEGER PRIMARY KEY AUTOINCREMENT,
  politician_id TEXT,
  detail TEXT,
  announce_date TEXT,
  status TEXT,
  FOREIGN KEY(politician_id) REFERENCES Politicians(politician_id)
)`);

// PromiseUpdates
db.run(`
CREATE TABLE IF NOT EXISTS PromiseUpdates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  promise_id INTEGER,
  update_date TEXT,
  detail TEXT,
  FOREIGN KEY(promise_id) REFERENCES Promises(promise_id)
)`);

module.exports = db;
