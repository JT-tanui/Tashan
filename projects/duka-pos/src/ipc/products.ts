// TS IPC Handler for Products & Inventory
import { Database } from 'better-sqlite3';
import type { Product } from '@/shared/types';
import { logger } from '@/utils/logger';

// Assume logger is configured globally and available
// Assume db is typed more precisely as DukaDB if DukaDB type is defined and imported

export function registerProductHandlers(ipc: any, db: Database) {
  ipc.handle('products:list', (): Product[] => {
    try {
      const stmt = db.prepare(`SELECT * FROM products WHERE is_active = 1 ORDER BY name ASC`);
      return stmt.all() as Product[];
    } catch (err: any) {
      logger.error('products:list error:', err);
      throw new Error(`Database error: ${err.message}`);
    }
  });

  ipc.handle('products:get', (_, id: number): Product | undefined => {
    try {
      const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
      return stmt.get(id) as Product | undefined;
    } catch (err: any) {
      logger.error(`products:get(${id}) error:`, err);
      throw new Error(`Database error: ${err.message}`);
    }
  });

  ipc.handle('products:create', (_, product: Partial<Product>) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO products (name, sku, price, cost, stock, barcode, is_active)
        VALUES (@name, @sku, @price, @cost, @stock, @barcode, 1)
      `);
      const info: any = stmt.run(product);
      return { id: info.lastInsertRowid, ...product } as Product;
    } catch (err: any) {
      logger.error('products:create error:', err);
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('Product with this SKU already exists.');
      }
      throw new Error(`Database error: ${err.message}`);
    }
  });

  ipc.handle('products:update', (_, id: number, data: Partial<Product>) => {
    const keys = Object.keys(data).filter(k => k !== 'id');
    if (keys.length === 0) return { changes: 0 };

    const setClause = keys.map(k => `${k} = @${k}`).join(', ');
    const stmt = db.prepare(`UPDATE products SET ${setClause}, updated_at = datetime('now','localtime') WHERE id = @id`);

    try {
      const info = stmt.run({ ...data, id });
      return { changes: info.changes };
    } catch (err: any) {
      logger.error(`products:update(${id}) error:`, err);
      throw new Error(`Database error: ${err.message}`);
    }
  });

  ipc.handle('products:adjustStock', (_, id: number, change: number, reason: string) => {
    const adjust = db.transaction(() => {
      const updateStmt = db.prepare(`UPDATE products SET stock = stock + ?, updated_at = datetime('now','localtime') WHERE id = ?`);
      updateStmt.run(change, id);
      const logStmt = db.prepare(`INSERT INTO inventory_logs (product_id, change, reason) VALUES (?, ?, ?)`);
      logStmt.run(id, change, reason);
      const getStmt = db.prepare('SELECT stock FROM products WHERE id = ?');
      return getStmt.get(id) as { stock: number };
    });
    try {
      return adjust();
    } catch (err: any) {
      logger.error(`products:adjustStock(${id}) error:`, err);
      throw new Error(`Database error: ${err.message}`);
    }
  });
}
