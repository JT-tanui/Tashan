// TS IPC Handler for Products & Inventory (migrated)
import { Database } from 'better-sqlite3';
import type { Document } from 'better-sqlite3';
import { Product } from '@/shared/types';

export function registerProductHandlers(ipc: any, db: any) {
  ipc.handle('products:list', () => {
    const stmt = db.prepare(`SELECT * FROM products WHERE is_active = 1 ORDER BY name ASC`);
    return stmt.all() as Product[];
  });

  ipc.handle('products:get', (_, id: number) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id) as Product | undefined;
  });

  ipc.handle('products:create', (_, product: Partial<Product>) => {
    const stmt = db.prepare(`
      INSERT INTO products (name, sku, price, cost, stock, barcode, is_active)
      VALUES (@name, @sku, @price, @cost, @stock, @barcode, 1)
    `);
    const info: any = stmt.run(product);
    return { id: info.lastInsertRowid, ...(product as any) } as Product;
  });

  ipc.handle('products:update', (_, id: number, data: Partial<Product>) => {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return { changes: 0 };
    const setClause = keys.map(k => `${k} = @${k}`).join(', ');
    const stmt = db.prepare(`UPDATE products SET ${setClause}, updated_at = datetime('now','localtime') WHERE id = @id`);
    const info = stmt.run({ ...data, id } as any);
    return { changes: info.changes };
  });

  ipc.handle('products:adjustStock', (_, id: number, change: number, reason: string) => {
    const adjust = db.transaction(() => {
      const updateStmt = db.prepare(`UPDATE products SET stock = stock + ? WHERE id = ?`);
      updateStmt.run(change, id);
      const logStmt = db.prepare(`INSERT INTO inventory_logs (product_id, change, reason) VALUES (?, ?, ?)`);
      logStmt.run(id, change, reason);
      const getStmt = db.prepare('SELECT stock FROM products WHERE id = ?');
      return getStmt.get(id);
    });
    try {
      return adjust();
    } catch (err) {
      throw err;
    }
  });
}
