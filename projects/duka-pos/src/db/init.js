const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

/**
 * Initialize the SQLite database.
 * Creates tables if they don't exist.
 */
function initDB(dbPath) {
  const db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');

  // Read and execute schema
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const createIfNotExists = db.transaction(() => {
    for (const stmt of statements) {
      // Convert CREATE TABLE to CREATE TABLE IF NOT EXISTS
      const safe = stmt.replace(
        /CREATE TABLE /gi,
        'CREATE TABLE IF NOT EXISTS '
      );
      db.exec(safe + ';');
    }
  });

  createIfNotExists();

  // Seed default settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (settingsCount.c === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    const seedSettings = db.transaction(() => {
      insert.run('store_name', 'Duka POS');
      insert.run('store_address', '');
      insert.run('tax_rate', '0.16'); // Kenya VAT 16%
      insert.run('low_stock_threshold', '5');
      insert.run('currency', 'KES');
      insert.run('printer_type', 'epson');
      insert.run('printer_interface', 'usb');
    });
    seedSettings();
  }

  return db;
}

module.exports = { initDB };
