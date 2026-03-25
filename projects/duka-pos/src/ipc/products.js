// Products IPC handlers scaffold
function registerProductHandlers(ipc, db){
  ipc.handle('products:list', () => {
    // placeholder: return empty list
    return [];
  });
}
module.exports = { registerProductHandlers };
