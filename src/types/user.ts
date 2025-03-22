export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  isPremium: boolean;
  premiumExpiry: string;
  savedVehicles: number;
  comparisons: number;
  lastLogin: string;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: string;
} 