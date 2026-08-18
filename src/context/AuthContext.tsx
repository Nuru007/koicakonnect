'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/lib/types';

interface AuthResponse {
  success: boolean;
  error?: string;
  code?: string;
  redirectUrl?: string;
  message?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const userData = json.data?.user || json.user || null;
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const userData = json.data?.user || json.user;
        setUser(userData);
        return {
          success: true,
          redirectUrl: json.data?.redirectUrl || (userData?.status === 'published' ? '/dashboard' : '/profile/edit'),
        };
      }
      return {
        success: false,
        error: json.error?.message || json.error || 'Unable to sign in. Please check your credentials.',
        code: json.error?.code,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }
  };

  const register = async (formData: any): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const userData = json.data?.user || json.user;
        setUser(userData);
        return { success: true };
      }
      return {
        success: false,
        error: json.error?.message || json.error || 'Failed to create account.',
        code: json.error?.code,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Unable to connect to the server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          message: json.data?.message || 'If an account exists, a password reset link has been sent.',
        };
      }
      return {
        success: false,
        error: json.error?.message || 'Failed to process request.',
        code: json.error?.code,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Network error. Please try again.',
        code: 'NETWORK_ERROR',
      };
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return {
          success: true,
          message: json.data?.message || 'Password successfully updated.',
        };
      }
      return {
        success: false,
        error: json.error?.message || 'Failed to reset password.',
        code: json.error?.code,
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Network error. Please try again.',
        code: 'NETWORK_ERROR',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
