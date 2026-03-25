// Settings IPC handlers — real SQLite reads/writes

function registerSettingsHandlers(ipc, db) {
  // Get all settings as key-value object
  ipc.handle('settings:getAll', () => {
    try {
      const rows = db.prepare('SELECT key, value FROM settings').all();
      const obj = {};
      for (const r of rows) obj[r.key] = r.value;
      return obj;
    } catch (err) {
      console.error('settings:getAll error:', err);
      throw err;
    }
  });

  // Set a single setting (upsert)
  ipc.handle('settings:set', (_, key, value) => {
    try {
      const existing = db.prepare('SELECT id FROM settings WHERE key = ?').get(key);
      if (existing) {
        db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(value, key);
      } else {
        db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
      }
      return { ok: true };
    } catch (err) {
      console.error(`settings:set(${key}) error:`, err);
      throw err;
    }
  });

  // License activation
  ipc.handle('license:activate', (_, licenseKey) => {
    try {
      // Simple validation: key must be non-empty and at least 16 chars
      if (!licenseKey || licenseKey.length < 16) {
        return { ok: false, error: 'Invalid license key format' };
      }
      const existing = db.prepare('SELECT id FROM licenses WHERE license_key = ?').get(licenseKey);
      if (existing) {
        return { ok: false, error: 'License already activated' };
      }
      // Get machine identifier (simple approach)
      const os = require('os');
      const machineId = os.hostname() + '-' + os.platform() + '-' + os.arch();
      db.prepare('INSERT INTO licenses (license_key, machine_id) VALUES (?, ?)').run(licenseKey, machineId);
      return { ok: true, machineId };
    } catch (err) {
      console.error('license:activate error:', err);
      throw err;
    }
  });

  ipc.handle('license:status', () => {
    try {
      const lic = db.prepare('SELECT * FROM licenses ORDER BY activated_at DESC LIMIT 1').get();
      return lic ? { activated: true, ...lic } : { activated: false };
    } catch (err) {
      console.error('license:status error:', err);
      throw err;
    }
  });
}

module.exports = { registerSettingsHandlers };
