// Sales IPC handlers — end-to-end MVP: create sale, list, and simple aggregation
function registerSalesHandlers(ipc, db){
  // 1. Create sale
  ipc.handle('sales:create', (_, sale) => {
    // Basic validation
    if (!sale || !sale.items || sale.items.length === 0) {
      throw new Error('Sale must have at least one item');
    }

    // Start a transaction to insert sale and sale_items, update stock, and log inventory
    const t = db.transaction(() => {
      // Calculate totals client-side before insert
      let subtotal = 0;
      sale.items.forEach(it => { subtotal += (it.quantity * it.unit_price); });
      const taxRate = parseFloat(sale.taxRate ?? 0.16);
      const tax = +(subtotal * taxRate).toFixed(2);
      const discount = sale.discount ? +sale.discount : 0;
      const total = +(subtotal + tax - discount).toFixed(2);

      const insertSale = db.prepare(`
        INSERT INTO sales (date_time, subtotal, tax, discount, total, payment_method, amount_received, change_due, status)
        VALUES (datetime('now','localtime'), ?, ?, ?, ?, ?, 0, 0, 'completed')
      `);
      const info = insertSale.run(subtotal, tax, discount, total, sale.payment_method);
      const saleId = info.lastInsertRowid;

      const insertItem = db.prepare(`
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, line_total)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const it of sale.items) {
        insertItem.run(saleId, it.product_id, it.quantity, it.unit_price, it.quantity * it.unit_price);
        // Decrement stock
        const dec = db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`);
        dec.run(it.quantity, it.product_id);

        // Inventory log
        const log = db.prepare(`INSERT INTO inventory_logs (product_id, change, reason) VALUES (?, ?, ?)`);
        log.run(it.product_id, -it.quantity, 'sale');
      }

      return { saleId, total };
    });

    try {
      return t();
    } catch (err) {
      console.error('sales:create error:', err);
      throw err;
    }
  });

  // 2. List sales (optional date range)
  ipc.handle('sales:list', (_, dateFrom, dateTo) => {
    const q = `SELECT * FROM sales WHERE 1=1` +
      (dateFrom ? ' AND date_time >= ?' : '') +
      (dateTo ? ' AND date_time <= ?' : '') +
      ' ORDER BY date_time DESC';
    const stmt = db.prepare(q);
    const params = [];
    if (dateFrom) params.push(dateFrom);
    if (dateTo) params.push(dateTo);
    try {
      return stmt.all(params);
    } catch (err) {
      console.error('sales:list error:', err);
      throw err;
    }
  });

  // 3. Get sale by id
  ipc.handle('sales:get', (_, id) => {
    try {
      const saleStmt = db.prepare('SELECT * FROM sales WHERE id = ?');
      const sale = saleStmt.get(id);
      if (!sale) return null;
      const itemsStmt = db.prepare('SELECT si.*, p.name, p.sku FROM sale_items si JOIN products p ON si.product_id = p.id WHERE si.sale_id = ?');
      const items = itemsStmt.all(id);
      return { ...sale, items };
    } catch (err) {
      console.error('sales:get error:', err);
      throw err;
    }
  });

  // 4. Void sale (basic)
  ipc.handle('sales:void', (_, id) => {
    // Simple: mark as void, restore stock
    const t = db.transaction(() => {
      // Revert stock for items in this sale
      const items = db.prepare('SELECT product_id, quantity FROM sale_items WHERE sale_id = ?').all(id);
      for (const it of items) {
        db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(it.quantity, it.product_id);
      }
      // Update sale status
      db.prepare('UPDATE sales SET status = ? WHERE id = ?').run('voided', id);
      // Delete line items (optional)
      db.prepare('DELETE FROM sale_items WHERE sale_id = ?').run(id);
    });
    try { t(); return { ok: true }; } catch (e) { throw e; }
  });
}

module.exports = { registerSalesHandlers };
