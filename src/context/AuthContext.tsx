import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { useToast } from '../components/ui/Toast.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (email?: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ayaan_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  // Load current user on initial mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('ayaan_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user session', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to login', 'error');
        return false;
      }

      localStorage.setItem('ayaan_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}`, 'success');
      return true;
    } catch (err) {
      showToast('Connection error during login', 'error');
      return false;
    }
  };

  const loginWithGoogle = async (email?: string, name?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email || 'sahil@example.com',
          name: name || 'Google Verified Customer',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Google login failed', 'error');
        return false;
      }

      localStorage.setItem('ayaan_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Signed in with Google as ${data.user.name}`, 'success');
      return true;
    } catch (err) {
      showToast('Connection error during Google authentication', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'error');
        return false;
      }

      localStorage.setItem('ayaan_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast('Welcome to the Ayaan NX collective', 'success');
      return true;
    } catch (err) {
      showToast('Connection error during registration', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ayaan_token');
    setToken(null);
    setUser(null);
    showToast('Signed out of Ayaan NX', 'info');
  };

  const updateProfile = async (
    data: Partial<User> & { currentPassword?: string; newPassword?: string }
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        showToast(result.error || 'Failed to update profile', 'error');
        return false;
      }

      setUser(result.user);
      showToast('Profile updated successfully', 'success');
      return true;
    } catch (err) {
      showToast('Error updating profile', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
