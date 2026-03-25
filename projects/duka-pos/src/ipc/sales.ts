// TS Sales IPC handlers — full transaction for sale creation
import { Database } from 'better-sqlite3';
import { SaleItem } from '@/shared/types';

export function registerSalesHandlers(ipc: any, db: any) {
  ipc.handle('sales:create', (_, sale: { items: SaleItem[]; payment_method: string; taxRate?: number; discount?: number; }) => {
    const t = db.transaction(() => {
      let subtotal = 0;
      for (const it of sale.items) subtotal += it.quantity * it.unit_price;
      const tax = +(subtotal * (sale.taxRate ?? 0.16)).toFixed(2);
      const discount = sale.discount ? +sale.discount : 0;
      const total = +(subtotal + tax - discount).toFixed(2);
      const insertSale = db.prepare(`INSERT INTO sales (date_time, subtotal, tax, discount, total, payment_method, amount_received, change_due, status) VALUES (datetime('now','localtime'), ?, ?, ?, ?, ?, 0, 0, 'completed')`);
      const info = insertSale.run(subtotal, tax, discount, total, sale.payment_method);
      const saleId = info.lastInsertRowid;
      const insertItem = db.prepare(`INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?)`);
      for (const it of sale.items) {
        insertItem.run(saleId, it.product_id, it.quantity, it.unit_price, it.quantity * it.unit_price);
        const dec = db.prepare(`UPDATE products SET stock = stock - ? WHERE id = ?`);
        dec.run(it.quantity, it.product_id);
        const log = db.prepare(`INSERT INTO inventory_logs (product_id, change, reason) VALUES (?, ?, ?)`);
        log.run(it.product_id, -it.quantity, 'sale');
      }
      return { saleId, total };
    });
    try {
      return t();
    } catch (e) {
      throw e;
    }
  });

  ipc.handle('sales:list', (_, dateFrom, dateTo) => {
    const q = `SELECT * FROM sales WHERE 1=1` + (dateFrom ? ' AND date_time >= ?' : '') + (dateTo ? ' AND date_time <= ?' : '') + ' ORDER BY date_time DESC';
    const stmt = db.prepare(q);
    const params = [];
    if (dateFrom) params.push(dateFrom);
    if (dateTo) params.push(dateTo);
    return stmt.all(params);
  });

  ipc.handle('sales:get', (_, id: number) => {
    const saleStmt = db.prepare('SELECT * FROM sales WHERE id = ?');
    const sale = saleStmt.get(id);
    if (!sale) return null;
    const itemsStmt = db.prepare('SELECT si.*, p.name, p.sku FROM sale_items si JOIN products p ON si.product_id = p.id WHERE si.sale_id = ?');
    const items = itemsStmt.all(id);
    return { ...sale, items };
  });

  ipc.handle('sales:void', (_, id: number) => {
    const t = db.transaction(() => {
      const items = db.prepare('SELECT product_id, quantity FROM sale_items WHERE sale_id = ?').all(id);
      for (const it of items) {
        db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(it.quantity, it.product_id);
      }
      db.prepare('UPDATE sales SET status = ? WHERE id = ?').run('voided', id);
      db.prepare('DELETE FROM sale_items WHERE sale_id = ?').run(id);
    });
    try { t(); return { ok: true }; } catch (e) { throw e; }
  });
}
