const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  // Products
  products: {
    list: () => ipcRenderer.invoke('products:list'),
    get: (id) => ipcRenderer.invoke('products:get', id),
    create: (product) => ipcRenderer.invoke('products:create', product),
    update: (id, data) => ipcRenderer.invoke('products:update', id, data),
    adjustStock: (id, change, reason) =>
      ipcRenderer.invoke('products:adjustStock', id, change, reason),
  },

  // Sales
  sales: {
    create: (sale) => ipcRenderer.invoke('sales:create', sale),
    list: (dateFrom, dateTo) => ipcRenderer.invoke('sales:list', dateFrom, dateTo),
    get: (id) => ipcRenderer.invoke('sales:get', id),
    void: (id) => ipcRenderer.invoke('sales:void', id),
  },

  // Settings
  settings: {
    getAll: () => ipcRenderer.invoke('settings:getAll'),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  },

  // Printer
  printer: {
    testPrint: () => ipcRenderer.invoke('printer:testPrint'),
    printReceipt: (saleId) => ipcRenderer.invoke('printer:printReceipt', saleId),
  },

  // M-Pesa
  mpesa: {
    stkPush: (phone, amount, saleId) =>
      ipcRenderer.invoke('mpesa:stkPush', phone, amount, saleId),
    checkStatus: (checkoutRequestId) =>
      ipcRenderer.invoke('mpesa:checkStatus', checkoutRequestId),
    retryQueue: () => ipcRenderer.invoke('mpesa:retryQueue'),
  },

  // Export
  export: {
    salesCsv: (dateFrom, dateTo) =>
      ipcRenderer.invoke('export:salesCsv', dateFrom, dateTo),
  },

  // License
  license: {
    activate: (key) => ipcRenderer.invoke('license:activate', key),
    status: () => ipcRenderer.invoke('license:status'),
  },
});
