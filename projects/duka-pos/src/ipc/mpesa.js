// Placeholder MPESA IPC scaffolding
function registerMpesaHandlers(ipc, db){
  ipc.handle('mpesa:stkPush', async (_, phone, amount, saleId) => {
    // Placeholder: immediately return a fake checkout id
    return { success: true, checkoutRequestID: 'DEF-TEST-0001' };
  });
  ipc.handle('mpesa:checkStatus', async (__, checkoutRequestId) => {
    return { status: 'SUCCESS' };
  });
  ipc.handle('mpesa:retryQueue', async () => {
    // no-op for MVP
    return { ok: true };
  });
}
module.exports = { registerMpesaHandlers };
