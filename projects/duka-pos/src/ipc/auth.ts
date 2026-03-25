// TS Authentication IPC handlers
import { Database } from 'better-sqlite3';
import type { User, Role, AuthState } from '@/shared/types/auth';
import { logger } from '@/utils/logger';

export function registerAuthHandlers(ipc: any, db: Database) {
  // Authenticate user with PIN
  ipc.handle('auth:login', (_, pin: string): { success: boolean; token?: string; error?: string; user?: User } => {
    if (!/^\d{4}$/.test(pin)) {
      return { success: false, error: 'PIN must be 4 digits.' };
    }
    try {
      // Fetch user based on PIN (simplistic, real app might use hashed PINs and user tables)
      // In this basic setup, we'll just check for a known PIN mapping to a user.
      const user = db.prepare('SELECT id, username, role FROM users WHERE pin = ?').get(pin) as User | undefined;
      if (user) {
        // TODO: Generate a JWT token or session ID in a real app
        const token = `fake-jwt-token-for-${user.username}`;
        logger.info(`User authenticated: ${user.username}`);
        return { success: true, token, user };
      } else {
        return { success: false, error: 'Invalid PIN or user not found.' };
      }
    } catch (err: any) {
      logger.error('auth:login error:', err);
      throw new Error(`Database error during login: ${err.message}`);
    }
  });

  // Get roles and permissions
  ipc.handle('auth:roles', (): Role[] => {
    // Mock roles. In a real app, this would come from DB or config.
    return [
      { id: 'admin', name: 'Administrator', permissions: ['read', 'write', 'delete', 'configure'] },
      { id: 'cashier', name: 'Cashier', permissions: ['read', 'write:sales'] },
    ];
  });

  // Get current user state (e.g., logged in user, role)
  ipc.handle('auth:state', (): AuthState => {
    // In a real app, this would check for a valid token, session, or stored user data.
    // For now, always return logged out.
    return { isAuthenticated: false, user: null, token: null };
  });
}
