// TS Auth IPC wrappers (PIN-based cashier login, roles)
export function registerAuthHandlers(ipc: any, db: any) {
  ipc.handle('auth:login', (_, pin: string) => {
    // Placeholder: accept any 4-digit PIN for MVP
    const ok = /^\d{4}$/.test(pin);
    return { ok };
  });
  ipc.handle('auth:roles', () => {
    // Simple role map
    return { admin: ['alice'], cashier: ['bob','charlie'] };
  });
}
