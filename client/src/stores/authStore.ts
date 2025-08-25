import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  isVerified: boolean;
  role: string;
  preferences: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.warn('localStorage not available:', error);
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

const removeLocalStorageItem = (key: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getLocalStorageItem('token'),
  isAuthenticated: !!getLocalStorageItem('token'),
  isLoading: false,
  isDemoMode: getLocalStorageItem('demoMode') === 'true',
  login: (userData, token) => {
    console.log('🔐 AuthStore: Login called with userData:', userData);
    console.log('🔐 AuthStore: Token:', token);
    setLocalStorageItem('token', token);
    removeLocalStorageItem('demoMode'); // Remove demo mode when logging in with real user
    console.log('🔐 AuthStore: Demo mode removed from localStorage');
    set({ user: userData, token, isAuthenticated: true, isDemoMode: false });
    console.log('🔐 AuthStore: State updated - isDemoMode: false');
  },
  logout: () => {
    removeLocalStorageItem('token');
    removeLocalStorageItem('demoMode');
    set({ user: null, token: null, isAuthenticated: false, isDemoMode: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  enableDemoMode: () => {
    const demoUser: User = {
      id: 'demo-1',
      username: 'demo_user',
      email: 'demo@tipper.com',
      displayName: 'Demo User',
      bio: 'This is a demo account for testing the application',
      avatar: 'https://via.placeholder.com/150/8B5CF6/FFFFFF?text=D',
      isVerified: true,
      role: 'user',
      preferences: {}
    };
    setLocalStorageItem('demoMode', 'true');
    setLocalStorageItem('token', 'demo-token');
    set({ 
      user: demoUser, 
      token: 'demo-token', 
      isAuthenticated: true, 
      isDemoMode: true 
    });
  },
  disableDemoMode: () => {
    removeLocalStorageItem('demoMode');
    removeLocalStorageItem('token');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      isDemoMode: false 
    });
  },
})); 