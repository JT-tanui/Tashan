const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function initDB(dbPath) {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Multi-statement exec is safe in better-sqlite3
  db.exec(schema);

  // Seed default settings
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
  if (settingsCount.c === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    const seedSettings = db.transaction(() => {
      insert.run('store_name', 'Duka POS');
      insert.run('store_address', 'Nairobi, Kenya');
      insert.run('tax_rate', '0.16');
      insert.run('currency', 'KES');
      insert.run('printer_type', 'epson');
      insert.run('printer_interface', 'usb');
    });
    seedSettings();
  }

  // Seed sample products if empty
  const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (prodCount.c === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (name, sku, price, cost, stock, barcode, is_active)
      VALUES (@name, @sku, @price, @cost, @stock, @barcode, 1)
    `);
    const seedProducts = db.transaction(() => {
      const prods = [
        { name: 'Milk 500ml', sku: 'MILK-500', price: 65, cost: 50, stock: 40, barcode: '6001234567890' },
        { name: 'Bread 400g', sku: 'BRD-400', price: 65, cost: 55, stock: 30, barcode: '6001234567891' },
        { name: 'Sugar 1kg', sku: 'SUG-1KG', price: 210, cost: 190, stock: 50, barcode: '6001234567892' },
        { name: 'Maize Flour 2kg', sku: 'UGA-2KG', price: 230, cost: 200, stock: 25, barcode: '6001234567893' },
        { name: 'Cooking Oil 1L', sku: 'OIL-1L', price: 320, cost: 280, stock: 15, barcode: '6001234567894' },
        { name: 'Tea Leaves 500g', sku: 'TEA-500', price: 150, cost: 120, stock: 60, barcode: '6001234567895' },
        { name: 'Soap Bar', sku: 'SOAP-BAR', price: 45, cost: 35, stock: 100, barcode: '6001234567896' }
      ];
      for (const p of prods) insertProd.run(p);
    });
    seedProducts();
  }

  return db;
}

module.exports = { initDB };
