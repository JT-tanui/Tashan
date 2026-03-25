// Sales IPC handlers scaffold
function registerSalesHandlers(ipc, db){
  ipc.handle('sales:create', async (_, sale) => {
    // placeholder: pretend to create sale
    return { id: 1, status: 'ok' };
  });
}
module.exports = { registerSalesHandlers };
