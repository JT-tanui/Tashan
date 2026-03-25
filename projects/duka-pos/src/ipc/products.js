// products.js — IPC Handler for Products & Inventory
// Real SQLite implementation

function registerProductHandlers(ipc, db) {
  // 1. List all active products
  // GET /products
  ipc.handle('products:list', () => {
    try {
      const stmt = db.prepare(`
        SELECT * FROM products 
        WHERE is_active = 1 
        ORDER BY name ASC
      `);
      return stmt.all();
    } catch (err) {
      console.error('products:list error:', err);
      throw err;
    }
  });

  // 2. Get single product
  ipc.handle('products:get', (_, id) => {
    try {
      const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
      return stmt.get(id);
    } catch (err) {
      console.error(`products:get(${id}) error:`, err);
      throw err;
    }
  });

  // 3. Create product
  // POST /products
  ipc.handle('products:create', (_, product) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO products (name, sku, price, cost, stock, barcode, is_active)
        VALUES (@name, @sku, @price, @cost, @stock, @barcode, 1)
      `);
      const info = stmt.run(product);
      return { id: info.lastInsertRowid, ...product };
    } catch (err) {
      console.error('products:create error:', err);
      // Handle SKU conflict
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Product with this SKU already exists.');
      }
      throw err;
    }
  });

  // 4. Update product
  // PUT /products/:id
  ipc.handle('products:update', (_, id, data) => {
    try {
      // Dynamic update query builder
      const keys = Object.keys(data).filter(k => k !== 'id');
      if (keys.length === 0) return { changes: 0 };

      const setClause = keys.map(k => `${k} = @${k}`).join(', ');
      const stmt = db.prepare(`
        UPDATE products 
        SET ${setClause}, updated_at = datetime('now','localtime')
        WHERE id = @id
      `);

      const info = stmt.run({ ...data, id });
      return { changes: info.changes };
    } catch (err) {
      console.error(`products:update(${id}) error:`, err);
      throw err;
    }
  });

  // 5. Adjust stock (restocking, counts, written off)
  // POST /products/:id/adjust
  ipc.handle('products:adjustStock', (_, id, change, reason) => {
    const adjust = db.transaction(() => {
      // Update product stock
      const updateStmt = db.prepare(`
        UPDATE products 
        SET stock = stock + ?, updated_at = datetime('now','localtime')
        WHERE id = ?
      `);
      updateStmt.run(change, id);

      // Log the movement
      const logStmt = db.prepare(`
        INSERT INTO inventory_logs (product_id, change, reason)
        VALUES (?, ?, ?)
      `);
      logStmt.run(id, change, reason);

      // Return new stock level
      const getStmt = db.prepare('SELECT stock FROM products WHERE id = ?');
      return getStmt.get(id);
    });

    try {
      return adjust();
    } catch (err) {
      console.error(`products:adjustStock(${id}) error:`, err);
      throw err;
    }
  });
}

module.exports = { registerProductHandlers };
