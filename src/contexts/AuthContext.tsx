'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, AuthUser } from '@/services/AuthService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (updates: { fullName?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı oturumunu kontrol et
    checkUser();

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userData = await AuthService.getUser();
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const userData = await AuthService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Kullanıcı kontrolü sırasında hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await AuthService.signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Giriş yapılırken hata:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      await AuthService.signUp(email, password, fullName);
      router.push('/auth/verify-email');
    } catch (error) {
      console.error('Kayıt olurken hata:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      router.push('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await AuthService.resetPassword(email);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await AuthService.updatePassword(newPassword);
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: { fullName?: string; avatarUrl?: string }) => {
    try {
      await AuthService.updateProfile(updates);
      const updatedUser = await AuthService.getUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 