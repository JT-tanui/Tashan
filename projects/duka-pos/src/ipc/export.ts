// TS Export IPC wrapper
export function registerExportHandlers(ipc: any, db: any) {
  ipc.handle('export:salesCsv', (_, dateFrom, dateTo) => {
    // Build CSV from sales within date range; placeholder for MVP
    return { path: '/path/to/sales.csv' };
  });
}
