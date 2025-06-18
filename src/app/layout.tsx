'use client';

import React, { useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Providers from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import Script from 'next/script'; // Sadece Analytics için

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Elektrikliyiz',
    default:
      'Elektrikliyiz – Elektrikli Otomobil ve Elektrikli Araç Modelleri, Fiyatlar, Özellikler ve Karşılaştırmalar',
  },
  description:
    'Elektrikli otomobil ve elektrikli araç modellerine dair tüm bilgiler burada! Fiyatlar, teknik özellikler, menzil karşılaştırmaları ve en güncel elektrikli araç rehberi elektrikliyiz.com’da.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // ✅ Adsense script manuel eklendi — CSP sorunlarına takılmaz
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7739465360112931';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  }, []);

  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        {/* ✅ Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P7PN1BEVEG"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P7PN1BEVEG');
          `}
        </Script>

        <Providers>
          <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}