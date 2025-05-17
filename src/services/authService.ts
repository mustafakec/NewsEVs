import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

// Örnek kullanıcı veritabanı (gerçek uygulamada bu bir veritabanında olacak)
const users = [
  {
    id: "123456",
    name: "Ahmet Yılmaz",
    email: "test@test.com", // Test için basit bir email
    password: "test123", // Test için basit bir şifre
    phone: "5301234567",
    avatar: "/avatar-placeholder.png",
    memberSince: "2024-01-15",
    isPremium: true, // Premium kullanıcı
    premiumExpiry: "2025-01-15",
    savedVehicles: 12,
    comparisons: 9,
    lastLogin: new Date().toISOString()
  },
  {
    id: "789012",
    name: "Ayşe Demir",
    email: "standart@test.com", // Standart kullanıcı test emaili
    password: "test123", // Test için basit bir şifre
    phone: "5309876543",
    avatar: "/avatar-placeholder.png",
    memberSince: "2024-03-15",
    isPremium: false,
    premiumExpiry: "",
    savedVehicles: 3,
    comparisons: 1,
    lastLogin: new Date().toISOString()
  }
];

export const authService = {
  login: async (email: string, password: string): Promise<User | null | any> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (!data) {
      throw new Error('Geçersiz email veya şifre');
    }

    if (error?.message == "Email not confirmed") {
      throw new Error('Lütfen e-posta adresinizi doğrulayın');
    }

    // Local storage'a kullanıcı bilgilerini kaydet
    localStorage.setItem('user', JSON.stringify(data?.user));

    return data?.user;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');

    if (!userStr) return null;

    return JSON.parse(userStr);
  }
}; 