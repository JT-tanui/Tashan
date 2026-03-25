// Placeholder MPESA IPC scaffolding
function registerMpesaHandlers(ipc, db){
  ipc.handle('mpesa:stk-push', async () => ({ success: true, checkoutRequestID: 'DEF123' }));
}
module.exports = { registerMpesaHandlers };
