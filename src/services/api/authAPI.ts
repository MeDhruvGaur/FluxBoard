import { User, LoginCredentials } from '../../types/auth.types';

export const AuthAPI = {
  login: async (credentials: LoginCredentials): Promise<{ data: { user: User; token: string } }> => {
    await new Promise((res) => setTimeout(res, 300));
    const role = credentials.role || 'Admin';
    const user: User = {
      id: 'usr-enterprise-01',
      name: credentials.email.split('@')[0] ? credentials.email.split('@')[0].toUpperCase() : 'ALEX MORGAN',
      email: credentials.email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role,
      department: 'Global Cloud Architecture',
      lastLogin: new Date().toISOString()
    };
    return {
      data: {
        user,
        token: 'jwt-flux-token-enterprise-9938'
      }
    };
  },

  getCurrentUser: async (): Promise<{ data: User }> => {
    await new Promise((res) => setTimeout(res, 100));
    return {
      data: {
        id: 'usr-enterprise-01',
        name: 'Alex Morgan',
        email: 'alex.morgan@fluxboard.io',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Admin',
        department: 'Global Cloud Architecture',
        lastLogin: new Date().toISOString()
      }
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 100));
  }
};
