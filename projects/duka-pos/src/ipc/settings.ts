// TS Settings IPC handlers — real TS version
export function registerSettingsHandlers(ipc: any, db: any) {
  ipc.handle('settings:getAll', () => {
    const rows: any[] = db.prepare('SELECT key, value FROM settings').all();
    const obj: any = {};
    for (const r of rows) obj[r.key] = r.value;
    return obj;
  });

  ipc.handle('settings:set', (_, key: string, value: string) => {
    const existing = db.prepare('SELECT id FROM settings WHERE key = ?').get(key);
    if (existing) {
      db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
    }
    return { ok: true };
  });
}
