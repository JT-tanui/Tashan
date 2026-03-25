// TS Printer IPC wrapper
export function registerPrinterHandlers(ipc: any) {
  ipc.on('printer:test', () => {
    // Implement test print through ESC/POS if needed
  });
  ipc.handle('printer:printReceipt', async (_, saleId) => {
    // Placeholder: return success
    return { ok: true, saleId };
  });
}
