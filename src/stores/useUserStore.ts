import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PaymentHistory } from '@/types/user';

interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    isPremium: boolean;
  } | null;
  isLoggedIn: boolean;
  paymentHistory: PaymentHistory[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserState['user']) => void;
  setPaymentHistory: (history: PaymentHistory[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

// Örnek kullanıcı verisi
const defaultUser: User = {
  id: "123456",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  phone: "5301234567",
  avatar: "/avatar-placeholder.png",
  memberSince: "2024-01-15",
  isPremium: true,
  premiumExpiry: "2025-01-15",
  savedVehicles: 12,
  comparisons: 8,
  lastLogin: "2024-03-20"
};

// Örnek ödeme geçmişi
const defaultPaymentHistory: PaymentHistory[] = [
  {
    id: "p1",
    date: "2024-01-15",
    amount: "599.00",
    plan: "Yıllık Premium",
    status: "Başarılı"
  },
  {
    id: "p2",
    date: "2023-01-15",
    amount: "499.00",
    plan: "Yıllık Premium",
    status: "Başarılı"
  }
];

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      paymentHistory: defaultPaymentHistory,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setPaymentHistory: (history) => set({ paymentHistory: history }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      updateUserProfile: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      logout: () => set({ user: null, paymentHistory: [], error: null, isLoggedIn: false })
    }),
    {
      name: 'user-storage'
    }
  )
); 