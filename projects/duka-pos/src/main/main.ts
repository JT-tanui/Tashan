// Main process entry point (TypeScript)
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDB } from '@/db/init';
import { registerProductHandlers } from '@/ipc/products';
import { registerSalesHandlers } from '@/ipc/sales';
import { registerSettingsHandlers } from '@/ipc/settings';
import { registerPrinterHandlers } from '@/ipc/printer';
import { registerMpesaHandlers } from '@/ipc/mpesa';
import { registerExportHandlers } from '@/ipc/export';
import { registerAuthHandlers } from '@/ipc/auth';
import { logger } from '@/utils/logger';
import { Settings } from '@/shared/types/settings'; // Import Settings type

let mainWindow: BrowserWindow | null = null;
let db: Database | null = null; // Use Database type from better-sqlite3

// TODO: Define more specific types if possible, e.g., for better-sqlite3 instances
type DBHelper = any;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    title: 'Duka POS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  if (process.env.NODE_ENV === 'development') {
    // URL to the Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Path to the static index.html in production
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  const dbPath = path.join(app.getPath('userData'), 'duka-pos.db');
  try {
    db = await initDB(dbPath); // Assuming initDB can be async if needed
    logger.info('Database initialized successfully at:', dbPath);

    // Register all IPC handlers
    registerProductHandlers(ipcMain, db);
    registerSalesHandlers(ipcMain, db);
    registerSettingsHandlers(ipcMain, db);
    registerPrinterHandlers(ipcMain);
    registerMpesaHandlers(ipcMain, db);
    registerExportHandlers(ipcMain, db);
    registerAuthHandlers(ipcMain, db); // Initialize auth handlers

    createWindow();
  } catch (error) {
    logger.error('Failed to initialize app or database:', error);
    app.quit(); // Exit if critical initialization fails
  }
}).catch(err => {
  logger.error('Error during app initialization:', err);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
