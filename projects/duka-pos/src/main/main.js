const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDB } = require('../db/init');
const { registerProductHandlers } = require('./ipc/products');
const { registerSalesHandlers } = require('./ipc/sales');
const { registerSettingsHandlers } = require('./ipc/settings');
const { registerPrinterHandlers } = require('./ipc/printer');
const { registerMpesaHandlers } = require('./ipc/mpesa');
const { registerExportHandlers } = require('./ipc/export');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    title: 'Duka POS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In dev, load from Vite dev server; in prod, load built index.html
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }
}

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath('userData'), 'duka-pos.db');
  db = initDB(dbPath);

  // Register all IPC handlers
  registerProductHandlers(ipcMain, db);
  registerSalesHandlers(ipcMain, db);
  registerSettingsHandlers(ipcMain, db);
  registerPrinterHandlers(ipcMain);
  registerMpesaHandlers(ipcMain, db);
  registerExportHandlers(ipcMain, db);

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
