"use client";

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="elektrikliyiz Logo" width={32} height={32} quality={100} className="object-contain" />
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#660566] to-[#330233]">elektrikliyiz</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Elektrikli araç dünyasını keşfedin, en güncel gelişmeleri yakından takip edin.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Kurumsal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/reklam" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Reklam
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-[#660566] transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Yasal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <button className="text-gray-600 hover:text-[#660566] transition-colors">
                  Çerez Ayarları
                </button>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Bizi Takip Edin</h3>
            <div className="flex gap-4">
              <a
                href="https://x.com/elektrikliyiz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#660566] text-gray-600 hover:text-white rounded-lg transition-all duration-200"
                aria-label="X (Twitter) hesabımızı takip edin"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/elektrikliyiz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#660566] text-gray-600 hover:text-white rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@elektrikliyiz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#660566] text-gray-600 hover:text-white rounded-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Elektrikliyiz. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/kullanim-kosullari" className="text-gray-600 hover:text-[#660566] transition-colors text-sm">
                Kullanım Koşulları
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/kvkk" className="text-gray-600 hover:text-[#660566] transition-colors text-sm">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
