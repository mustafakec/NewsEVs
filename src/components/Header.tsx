"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="elektrikliyiz Logo" width={32} height={32} priority quality={100} className="object-contain" />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233]">elektrikliyiz</span>
            </Link>

            {/* Ana Menü */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/elektrikli-araclar" className="text-gray-600 hover:text-[#660566] transition-colors">
                Elektrikli Araçlar
              </Link>
              <Link href="/karsilastir" className="text-gray-600 hover:text-[#660566] transition-colors">
                Karşılaştır
              </Link>
              <Link href="/sarj-haritasi" className="text-gray-600 hover:text-[#660566] transition-colors">
                Şarj Haritası
              </Link>
              <Link href="/haberler" className="text-gray-600 hover:text-[#660566] transition-colors">
                Haberler
              </Link>
              <Link href="/borsa" className="text-gray-600 hover:text-[#660566] transition-colors">
                Borsa
              </Link>
            </nav>

            {/* Giriş/Kayıt Butonları */}
            <div className="hidden md:flex items-center gap-3">
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
            </div>

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

          {/* Mobil Menü */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 px-4">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/elektrikli-araclar"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Elektrikli Araçlar
                </Link>
                <Link
                  href="/karsilastir"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Karşılaştır
                </Link>
                <Link
                  href="/sarj-haritasi"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Şarj Haritası
                </Link>
                <Link
                  href="/haberler"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Haberler
                </Link>
                <Link
                  href="/borsa"
                  className="text-gray-600 hover:text-[#660566] transition-colors"
                >
                  Borsa
                </Link>
              </nav>
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="w-full text-left text-sm text-gray-600 hover:text-[#660566] font-medium transition-colors"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="w-full text-left text-sm bg-gradient-to-r from-[#660566] to-[#330233] text-white px-3 py-1.5 rounded-lg font-medium
                         hover:opacity-90 transition-all duration-200"
                >
                  Kayıt Ol
                </button>
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
    </>
  );
};

export default Header; 
