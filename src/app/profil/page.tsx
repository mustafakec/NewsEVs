"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import VehicleCard from '@/views/VehicleCard';

// Karşılaştırma için tip tanımlamaları
interface SavedVehicle {
  id: string;
  brand: string;
  model: string;
  image?: string;
}

interface Comparison {
  id: string;
  date: string;
  vehicles: SavedVehicle[];
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

// Yükleme ekranı bileşeni
function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Ana içerik bileşeni
function ProfileContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profil';
  const { user, isLoggedIn, logout } = useUserStore();
  const { favorites, removeFavorite } = useFavoritesStore();
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    color: string;
    text: string;
    feedback: string[];
  }>({
    score: 0,
    color: 'gray',
    text: '',
    feedback: []
  });
  const [savedComparisons, setSavedComparisons] = useState<Comparison[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı giriş yapmışsa kaydedilen karşılaştırmaları yükle
    if (isLoggedIn && typeof window !== 'undefined') {
      const savedData = localStorage.getItem('savedComparisons');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setSavedComparisons(parsedData);
        } catch (error) {
          console.error('Kaydedilen karşılaştırmalar yüklenirken hata:', error);
        }
      }
    }
  }, [isLoggedIn]); // isLoggedIn değiştiğinde tekrar çalıştır

  const formatPrice = (price: { base: number; currency: string }) => {
    // TL para birimi kodunu TRY'ye dönüştür
    const currencyCode = price.currency === 'TL' ? 'TRY' : price.currency;
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price.base);
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback: string[] = [];

    // En az 6 karakter
    if (password.length >= 6) {
      score += 1;
      feedback.push('✓ En az 6 karakter');
    } else {
      feedback.push('× En az 6 karakter');
    }

    // En az bir büyük harf
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push('✓ En az bir büyük harf');
    } else {
      feedback.push('× En az bir büyük harf');
    }

    // En az bir küçük harf
    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push('✓ En az bir küçük harf');
    } else {
      feedback.push('× En az bir küçük harf');
    }

    // En az bir rakam
    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push('✓ En az bir rakam');
    } else {
      feedback.push('× En az bir rakam');
    }

    // Şifre gücü renk ve metin belirleme
    let color = 'gray';
    let text = '';

    if (score === 0) {
      color = 'gray';
      text = 'Boş';
    } else if (score === 1) {
      color = 'red';
      text = 'Zayıf';
    } else if (score === 2) {
      color = 'yellow';
      text = 'Orta';
    } else if (score === 3) {
      color = 'blue';
      text = 'İyi';
    } else {
      color = 'green';
      text = 'Güçlü';
    }

    return { score, color, text, feedback };
  };

  const renderFavorites = () => {
    if (favorites.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Favorite Vehicles Added Yet</h3>
          <p className="text-gray-500 mb-6">You can view your favorite vehicles here.</p>
          <Link
            href="/elektrikli-araclar"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#660566] hover:bg-[#4d044d]"
          >
            Browse Vehicles
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    );
  };

  const handleDeleteComparison = (comparisonId: string) => {
    // Karşılaştırmayı listeden sil
    const updatedComparisons = savedComparisons.filter(comp => comp.id !== comparisonId);
    setSavedComparisons(updatedComparisons);

    // LocalStorage'ı güncelle
    localStorage.setItem('savedComparisons', JSON.stringify(updatedComparisons));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'favoriler':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorite Vehicles</h2>
            {renderFavorites()}
          </div>
        );
      case 'karsilastirmalar':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Comparisons</h2>

            {savedComparisons.length > 0 ? (
              <div className="space-y-6">
                {savedComparisons.map((comparison) => (
                  <div key={comparison.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {comparison.vehicles.map(v => `${v.brand} ${v.model}`).join(' vs ')}
                        </h3>
                        <p className="text-sm text-gray-500">{formatDate(comparison.date)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href="/karsilastir"
                          onClick={(e) => {
                            e.preventDefault();
                            // Karşılaştırma sayfasına yönlendirmeden önce seçilen araçları ayarla
                            localStorage.setItem('compareVehicles', JSON.stringify(comparison.vehicles.map(v => v.id)));
                            router.push('/karsilastir');
                          }}
                          className="px-3 py-1.5 text-sm bg-[#660566] text-white rounded-lg hover:bg-[#4d044d] transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteComparison(comparison.id)}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {comparison.vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="flex items-center gap-3">
                          <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {vehicle.image && (
                              <img
                                src={vehicle.image}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Comparisons Found</h3>
                <p className="text-gray-500 mb-6">You haven't saved any comparisons yet.</p>
                <Link
                  href="/karsilastir"
                  className="px-4 py-2 bg-[#660566] text-white rounded-lg hover:bg-[#4d044d] transition-colors inline-block"
                >
                  Compare Vehicles
                </Link>
              </div>
            )}
          </div>
        );
      case 'guvenlik':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
            <div className="max-w-2xl">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null)
                  setSuccess(null)
                  const formData = new FormData(e.currentTarget);
                  const currentPassword = formData.get('currentPassword') as string;
                  const newPassword = formData.get('newPassword') as string;
                  const confirmPassword = formData.get('confirmPassword') as string;

                  const { error } = await supabase.auth.signInWithPassword({
                    email: user?.email!,
                    password: currentPassword
                  })

                  const strength = checkPasswordStrength(newPassword);

                  if (strength.score < 3) {
                    setError('Lütfen daha güçlü bir şifre belirleyin!');
                    return;
                  } else if (error?.code === "validation_failed") {
                    setError('Lütfen mevcut şifrenizi kontrol edin!');
                  } else if (newPassword !== confirmPassword) {
                    setError('Yeni şifreler eşleşmiyor!');
                    return;
                  } else {
                    const { data, error: resetPasswordError } = await supabase.auth.updateUser({
                      password: newPassword
                    })

                    if (data?.user?.id) {
                      setSuccess("Şifreniz başarıyla güncellenmiştir.")
                    }

                    if (resetPasswordError?.code === "same_password") {
                      setError("Yeni şifreniz eskisi ile aynı olamaz!")
                    } else if (resetPasswordError) {
                      setError("İşlem sırasında bir hata oluştu! Lütfen tekrar deneyin.")
                    }
                  }

                  // TODO: API'ye şifre değiştirme isteği gönderilecek
                }}>
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#660566] focus:border-[#660566] sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      required
                      minLength={6}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#660566] focus:border-[#660566] sm:text-sm"
                      onChange={(e) => {
                        const result = checkPasswordStrength(e.target.value);
                        setPasswordStrength(result);
                      }}
                    />
                    {/* Şifre Gücü Göstergesi */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color === 'gray' ? 'w-0 bg-gray-300' :
                              passwordStrength.color === 'red' ? 'w-1/4 bg-red-500' :
                                passwordStrength.color === 'yellow' ? 'w-2/4 bg-yellow-500' :
                                  passwordStrength.color === 'blue' ? 'w-3/4 bg-blue-500' :
                                    'w-full bg-green-500'
                              }`}
                          />
                        </div>
                        <span className={`text-sm font-medium ${passwordStrength.color === 'gray' ? 'text-gray-500' :
                          passwordStrength.color === 'red' ? 'text-red-500' :
                            passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                              passwordStrength.color === 'blue' ? 'text-blue-500' :
                                'text-green-500'
                          }`}>
                          {passwordStrength.text}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {passwordStrength.feedback?.map((item, index) => (
                          <p key={index} className={`text-xs ${item.startsWith('✓') ? 'text-green-600' : 'text-gray-500'}`}>
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (Confirm)
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      required
                      minLength={6}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#660566] focus:border-[#660566] sm:text-sm"
                    />
                  </div>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                      {success}
                    </div>
                  )}
                  <div className="flex items-center justify-end pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#660566] to-[#330233] rounded-lg hover:opacity-90 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </form>

                {/* <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">İki Faktörlü Doğrulama</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-900 font-medium">Hesap Güvenliğini Artırın</p>
                      <p className="text-sm text-gray-500 mt-1">
                        İki faktörlü doğrulama ile hesabınızı daha güvenli hale getirin
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-[#660566] bg-white border border-[#660566] rounded-lg hover:bg-[#660566] hover:text-white transition-colors">
                      Aktifleştir
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ana Profil Kartı */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#660566] flex items-center justify-center text-white text-2xl font-medium">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                      <p className="text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Membership Status</h4>
                      <div className="flex items-center gap-2">
                        {user?.isPremium ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#660566] to-[#330233] text-white">
                              Premium
                            </span>
                            <p className="text-sm text-gray-600">Your premium membership is active</p>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Standard
                            </span>
                            <p className="text-sm text-gray-600">Standard membership</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Phone</h4>
                      <p className="text-gray-900">{user?.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Premium Üye İstatistikleri */}
                {user?.isPremium && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Favorite Vehicles</div>
                      <div className="text-2xl font-semibold text-gray-900">{favorites.length}</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Comparisons</div>
                      <div className="text-2xl font-semibold text-gray-900">0</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="text-sm font-medium text-gray-500 mb-1">Premium Days</div>
                      <div className="text-2xl font-semibold text-gray-900">30</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Üyelik Kartı - Sağ Taraf */}
              <div className="lg:col-span-1">
                {user?.isPremium ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#660566] to-[#330233] px-6 py-4">
                      <h3 className="text-lg font-semibold text-white mb-1">Premium Membership</h3>
                      <p className="text-sm text-gray-200">Your active membership plan</p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Plan</h4>
                          <p className="text-gray-900 font-medium">Annual Premium</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Renewal Date</h4>
                          <p className="text-gray-900">May 15, 2024</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                          <div className="flex items-center gap-2">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                              <rect x="2" y="5" width="20" height="14" rx="2" className="stroke-current" strokeWidth="2" />
                              <path d="M2 10H22" className="stroke-current" strokeWidth="2" />
                            </svg>
                            <span className="text-gray-900">•••• 4242</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <button className="w-full px-4 py-2 text-sm font-medium text-[#660566] bg-white border border-[#660566] rounded-lg hover:bg-[#660566] hover:text-white transition-colors">
                          Change Payment Method
                        </button>
                        <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          Billing History
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  //   <div className="p-6 text-center">
                  //     <div className="w-16 h-16 mx-auto mb-4">
                  //       <svg className="w-full h-full text-[#660566]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  //       </svg>
                  //     </div>
                  //     <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium'a Yükseltin</h3>
                  //     <p className="text-gray-500 mb-6">Tüm özelliklere erişim kazanın ve premium avantajlarından yararlanın.</p>
                  //     <button
                  //       onClick={() => window.dispatchEvent(new Event('show-premium-modal'))}
                  //       className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#660566] to-[#330233] rounded-lg hover:opacity-90 transition-colors"
                  //     >
                  //       Premium'a Geç
                  //     </button>
                  //   </div>
                  // </div>
                  null
                )}
              </div>

              {/* Premium Üye Ödeme Geçmişi */}
              {user?.isPremium && (
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Annual Premium Membership</p>
                          <p className="text-sm text-gray-500">May 15, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₺1.199,00</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Successful
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Monthly Premium Membership</p>
                          <p className="text-sm text-gray-500">April 15, 2023</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₺129,00</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Successful
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">You Need to Log In</h1>
            <p className="text-gray-600 mb-8">Please log in to view this page.</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#660566] hover:bg-[#4d044d]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <Link
              href="/profil"
              className={`px-4 py-2 -mb-px text-sm font-medium ${activeTab === 'profil'
                ? 'text-[#660566] border-b-2 border-[#660566]'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              My Profile
            </Link>
            <Link
              href="/profil?tab=favoriler"
              className={`px-4 py-2 -mb-px text-sm font-medium ${activeTab === 'favoriler'
                ? 'text-[#660566] border-b-2 border-[#660566]'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              My Favorites
            </Link>
            <Link
              href="/profil?tab=karsilastirmalar"
              className={`px-4 py-2 -mb-px text-sm font-medium ${activeTab === 'karsilastirmalar'
                ? 'text-[#660566] border-b-2 border-[#660566]'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              My Comparisons
            </Link>
            <Link
              href="/profil?tab=guvenlik"
              className={`px-4 py-2 -mb-px text-sm font-medium ${activeTab === 'guvenlik'
                ? 'text-[#660566] border-b-2 border-[#660566]'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Security
            </Link>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 