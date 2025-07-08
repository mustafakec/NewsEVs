"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import PremiumModal from './PremiumModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useElectricVehicleStore } from '@/viewmodels/useElectricVehicles';
import { useUserStore } from '@/stores/useUserStore';
import { cloudinaryUtils } from '@/lib/cloudinary';

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

  // Mobil menü açıkken body scroll'unu engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
    setIsMenuOpen(false); // Mobil menüyü kapat
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
    router.push('/electric-vehicles');

    // Eğer halihazırda elektrikli araçlar sayfasındaysak sayfayı yenile
    if (window.location.pathname === '/electric-vehicles') {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }

    // Mobil menüyü kapat
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false); // Mobil menüyü kapat
    router.push('/');
  };

  const handleMobileNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-[100] h-16 w-full">
        <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png"
              alt="NewsEVs Logo" 
              width={150}
              height={150}
              priority 
              quality={100} 
              className="object-contain"
              unoptimized={true}
            />
          </Link>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors relative z-[300]"
            aria-label="Open/close menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
            </div>
          </button>

          {/* Ana Menü */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/electric-vehicles"
              onClick={handleElectricVehiclesClick}
              className="text-gray-600 hover:text-[#660566] transition-colors cursor-pointer">
              Electric Vehicles
            </a>
            <Link href="/compare" className="text-gray-600 hover:text-[#660566] transition-colors">
              Compare
            </Link>
            <Link href="/charging" className="text-gray-600 hover:text-[#660566] transition-colors">
              Charging
            </Link>
            {/* <Link href="/stocks" className="text-gray-600 hover:text-[#660566] transition-colors">
              Stocks
            </Link> */}
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
                      onClick={(e) => {
                        setIsProfileMenuOpen(false);
                        router.push('/profil?tab=profil');
                        e.preventDefault();
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </Link>
                    <Link
                      href="/profil?tab=favoriler"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        setIsProfileMenuOpen(false);
                        router.push('/profil?tab=favoriler');
                        e.preventDefault();
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      My Favorites
                    </Link>
                    <Link
                      href="/profil?tab=karsilastirmalar"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        setIsProfileMenuOpen(false);
                        router.push('/profil?tab=karsilastirmalar');
                        e.preventDefault();
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      My Comparisons
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
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
                  Login
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="text-sm bg-gradient-to-r from-[#660566] to-[#330233] text-white px-3 py-1.5 rounded-lg font-medium
                         hover:opacity-90 transition-all duration-200"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobil Menü Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-[250] md:hidden"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Mobil Menü Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-80 h-full bg-white z-[300] md:hidden shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/logo.png"
                      alt="NewsEVs Logo" 
                      width={150}
                      height={150}
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col p-6 space-y-4">
                  <motion.a
                    href="/electric-vehicles"
                    onClick={handleElectricVehiclesClick}
                    className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-medium">Electric Vehicles</span>
                  </motion.a>
                  
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/compare"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="font-medium">Compare</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/charging"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Charging</span>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/blog"
                      onClick={handleMobileNavClick}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                      </svg>
                      <span className="font-medium">Blog</span>
                    </Link>
                  </motion.div>
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
                  {isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-[#660566] flex items-center justify-center text-white font-medium">
                          {user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link
                          href="/profil?tab=profil"
                          onClick={(e) => {
                            handleMobileNavClick();
                            router.push('/profil?tab=profil');
                            e.preventDefault();
                          }}
                          className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm">My Profile</span>
                        </Link>
                        <Link
                          href="/profil?tab=favoriler"
                          onClick={(e) => {
                            handleMobileNavClick();
                            router.push('/profil?tab=favoriler');
                            e.preventDefault();
                          }}
                          className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-sm">My Favorites</span>
                        </Link>
                        <Link
                          href="/profil?tab=karsilastirmalar"
                          onClick={(e) => {
                            handleMobileNavClick();
                            router.push('/profil?tab=karsilastirmalar');
                            e.preventDefault();
                          }}
                          className="flex items-center gap-3 text-gray-700 hover:text-[#660566] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm">My Comparisons</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors py-2 px-3 rounded-lg hover:bg-red-50 w-full text-left"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm">Logout</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAuthClick('login')}
                        className="w-full text-center text-gray-700 hover:text-[#660566] font-medium transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleAuthClick('register')}
                        className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white py-3 px-4 rounded-lg font-medium
                               hover:opacity-90 transition-all duration-200"
                      >
                        Register
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
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
