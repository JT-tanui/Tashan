import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Type alias to satisfy TS if not importing DB types directly
type DB = any;

export function initDB(dbPath: string): DB {
  // Use dynamic require to avoid TS compile-time type mismatch for the DB constructor
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const DatabaseCtor = require('better-sqlite3');
  const db: any = new DatabaseCtor(dbPath);

  // Enable WAL for concurrency safety
  db.pragma('journal_mode = WAL');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Execute all statements in a single transaction to ensure schema is applied consistently
  const createIfNotExists = db.transaction(() => {
    // Split statements by semicolon and apply; guard empty statements
    const statements = schema
      .split(';')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);
    for (const stmt of statements) {
      // Convert CREATE TABLE to IF NOT EXISTS to be idempotent
      const safe = stmt.replace(/CREATE TABLE /gi, 'CREATE TABLE IF NOT EXISTS ');
      db.exec(safe + ';');
    }
  });
  createIfNotExists();

  // Seed default settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (settingsCount && settingsCount.c === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    const seedSettings = db.transaction(() => {
      insert.run('store_name