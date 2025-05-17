"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import PremiumModal from './PremiumModal';
import { motion } from 'framer-motion';
import { useElectricVehicleStore } from '@/viewmodels/useElectricVehicles';
import { useUserStore } from '@/stores/useUserStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isVisible, setIsVisible] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const router = useRouter();
  const setFilters = useElectricVehicleStore((state) => state.setFilters);
  const setTemporaryFilters = useElectricVehicleStore((state) => state.setTemporaryFilters);
  const { user, isLoggedIn, logout } = useUserStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Premium butonunu arada gizleyip tekrar göstererek dikkat çekici hale getiriyoruz
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 5000); // 5 saniyede bir değişim

    return () => clearInterval(interval);
  }, []);

  // Premium modalını açmak için özel event dinleyicisi
  useEffect(() => {
    const handleOpenPremiumModal = () => {
      // Premium kullanıcılara modalı gösterme
      if (isLoggedIn && (user?.isPremium || user?.email === "test@test.com")) {
        return;
      }

      // Premium olmayan kullanıcılara modalı göster
      setIsPremiumModalOpen(true);
    };

    // Global event dinleyicisi ekleme
    window.addEventListener('show-premium-modal', handleOpenPremiumModal);

    // Component unmount olduğunda temizle
    return () => {
      window.removeEventListener('show-premium-modal', handleOpenPremiumModal);
    };
  }, [isLoggedIn, user]);

  // Auth modalını açmak için özel event dinleyicisi
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setAuthMode('login');
      setIsAuthModalOpen(true);
    };

    // Global event dinleyicisi ekleme
    window.addEventListener('show-auth-modal', handleOpenAuthModal);

    // Component unmount olduğunda temizle
    return () => {
      window.removeEventListener('show-auth-modal', handleOpenAuthModal);
    };
  }, []);

  // Profil menüsü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handlePremiumClick = () => {
    setIsPremiumModalOpen(true);
  };

  // Elektrikli araçlar sayfasına yönlendiren ve filtreleri sıfırlayan fonksiyon
  const handleElectricVehiclesClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Tüm filtreleri boş obje ile sıfırlama
    const emptyFilters = {};
    setFilters(emptyFilters);
    setTemporaryFilters(emptyFilters);

    // Filtreleri uygula - değişikliklerin anında etkili olması için

    // Elektrikli araçlar sayfasına yönlendirme
    router.push('/elektrikli-araclar');

    // Eğer halihazırda elektrikli araçlar sayfasındaysak sayfayı yenile
    if (window.location.pathname === '/elektrikli-araclar') {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] h-16 w-full">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="elektrikliyiz Logo" width={32} height={32} priority quality={100} className="object-contain" />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233]">elektrikliyiz</span>
            </Link>

            {/* Ana Menü */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/elektrikli-araclar"
                onClick={handleElectricVehiclesClick}
                className="text-gray-600 hover:text-[#660566] transition-colors cursor-pointer">
                Elektrikli Araçlar
              </a>
              <Link href="/karsilastir" className="text-gray-600 hover:text-[#660566] transition-colors">
                Karşılaştır
              </Link>
              <Link href="/sarj" className="text-gray-600 hover:text-[#660566] transition-colors">
                Şarj
              </Link>
              <Link href="/borsa" className="text-gray-600 hover:text-[#660566] transition-colors">
                Borsa
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-[#660566] transition-colors">
                Blog
              </Link>

              {/* Premium butonu - Premium kullanıcılar için gizlenecek */}
              {/* {!(isLoggedIn && user?.isPremium) && (
                <motion.button
                  onClick={handlePremiumClick}
                  className="text-xs bg-gradient-to-r from-[#660566] to-[#330233] text-white px-3 py-1.5 rounded-full font-medium
                         hover:opacity-90 transition-all duration-200 flex items-center shadow-sm"
                  animate={{
                    scale: isVisible ? 1 : 0.95,
                    opacity: isVisible ? 1 : 0.9,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 8px rgba(102, 5, 102, 0.3)"
                  }}
                >
                  <span className="mr-1">⚡</span>
                  Premium
                </motion.button>
              )} */}
            </nav>

            {/* Giriş/Kayıt veya Profil Menüsü */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#660566] flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <Link
                        href="/profil"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profilim
                      </Link>
                      <Link
                        href="/profil?tab=favoriler"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Favorilerim
                      </Link>
                      <Link
                        href="/profil?tab=karsilastirmalar"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Karşılaştırmalarım
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-sm text-gray-600 hover:text-[#660566] font-medium transition-colors"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => handleAuthClick('register')}
                    className="text-sm bg-gradient-to-r from-[#660566] to-[#330233] text-white px-3 py-1.5 rounded-lg font-medium
                           hover:opacity-90 transition-all duration-200"
                  >
                    Kayıt Ol
                  </button>
                </>
              )}
            </div>

            {/* Mobil Menü Butonu */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobil Premium Butonu - Premium kullanıcılar için gizlenecek */}
              {!(isLoggedIn && user?.isPremium) && (
                <motion.button
                  onClick={handlePremiumClick}
                  className="text-xs bg-gradient-to-r from-[#660566] to-[#330233] text-white px-2 py-1 rounded-full font-medium
                         hover:opacity-90 transition-all duration-200 flex items-center shadow-sm"
                  animate={{
                    scale: isVisible ? 1 : 0.95,
                    opacity: isVisible ? 1 : 0.9,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <span className="mr-0.5">⚡</span>
                  Premium
                </motion.button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobil Menü */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 px-4">
              <nav className="flex flex-col gap-4">
                <a
                  href="/elektrikli-araclar"
                  onClick={handleElectricVehiclesClick}
                  className="text-gray-600 hover:text-[#660566] transition-colors cursor-pointer"
                >
                  Elektrikli Araçlar
                </a>
                <Link
                  href="/karsilastir"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Karşılaştır
                </Link>
                <Link
                  href="/sarj"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Şarj
                </Link>
                <Link
                  href="/borsa"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Borsa
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Blog
                </Link>
              </nav>
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/profil"
                      className="flex items-center gap-2 text-gray-700 hover:text-[#660566] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#660566] flex items-center justify-center text-white font-medium">
                        {user?.name?.charAt(0)}
                      </div>
                      <span className="font-medium">{user?.name}</span>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/profil?tab=favoriler"
                        className="text-sm text-gray-600 hover:text-[#660566] transition-colors"
                      >
                        Favorilerim
                      </Link>
                      <Link
                        href="/profil?tab=karsilastirmalar"
                        className="text-sm text-gray-600 hover:text-[#660566] transition-colors"
                      >
                        Karşılaştırmalarım
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors text-left"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="text-sm text-gray-600 hover:text-[#660566] font-medium transition-colors"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => handleAuthClick('register')}
                      className="py-1.5 px-3 bg-gradient-to-r from-[#660566] to-[#330233] text-white text-sm font-medium rounded-lg
                             hover:opacity-90 transition-all duration-200"
                    >
                      Kayıt Ol
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </>
  );
};

export default Header; 
