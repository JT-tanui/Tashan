// Placeholder export IPC
function registerExportHandlers(ipc){
  ipc.handle('export:csv', async () => {
    return { path: '/path/to/export.csv' };
  });
}
module.exports = { registerExportHandlers };
