// Placeholder printer IPC
function registerPrinterHandlers(ipc){
  ipc.on('printer:test', () => {
    console.log('Test print requested');
  });
}
module.exports = { registerPrinterHandlers };
