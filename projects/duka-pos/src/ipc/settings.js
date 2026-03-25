// Settings IPC scaffold
function registerSettingsHandlers(ipc){
  ipc.handle('settings:get', () => {
    return { taxRate: 0.0 };
  });
}
module.exports = { registerSettingsHandlers };
