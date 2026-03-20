import { AuthResponse } from '@/types';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isUser: boolean;
  isProvider: boolean;

  // Actions
  login: (data: AuthResponse) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isUser: false,
  isProvider: false,

  login: (data: AuthResponse) => {
    // Store token + user in cookies (persists across page refresh)
    Cookies.set('token', data.token, { expires: 1 }); // 1 day
    Cookies.set('user', JSON.stringify(data), { expires: 1 });

    set({
      user: data,
      isAuthenticated: true,
      isUser: data.role === 'USER',
      isProvider: data.role === 'PROVIDER',
    });
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    set({
      user: null,
      isAuthenticated: false,
      isUser: false,
      isProvider: false,
    });
  },

  // Called on app load — restores auth state from cookies
  initialize: () => {
    const userCookie = Cookies.get('user');
    const token = Cookies.get('token');

    if (userCookie && token) {
      try {
        const user = JSON.parse(userCookie) as AuthResponse;
        set({
          user,
          isAuthenticated: true,
          isUser: user.role === 'USER',
          isProvider: user.role === 'PROVIDER',
        });
      } catch {
        // Corrupted cookie — clear it
        Cookies.remove('token');
        Cookies.remove('user');
      }
    }
  },
}));