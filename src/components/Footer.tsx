"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cloudinaryUtils } from '@/lib/cloudinary';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png"
                alt="NewsEVs Logo" 
                width={150}
                height={150}
                quality={100} 
                className="object-contain"
                unoptimized={true}
              />
            </Link>
            <p className="text-gray-600 text-sm">
              Explore the electric vehicle world, follow the latest developments closely.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Corporate</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#660566] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/advertising" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Advertising
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-600 hover:text-[#660566] transition-colors">
                  GDPR Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="text-gray-600 hover:text-[#660566] transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://youtube.com/@NewsEVs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#660566] text-gray-600 hover:text-white rounded-lg transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.207 0 12 0 12s0 3.793.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.793 24 12 24 12s0-3.793-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@news.evs"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-[#660566] text-gray-600 hover:text-white rounded-lg transition-all duration-200"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.75 2v14.25a2.25 2.25 0 1 1-2.25-2.25h1.5a.75.75 0 0 0 0-1.5h-1.5A3.75 3.75 0 1 0 14.25 17V8.25a5.25 5.25 0 0 0 4.5 0V6.75a3.75 3.75 0 0 1-3-3.75h-3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NewsEVs. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
