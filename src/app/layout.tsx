import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import  Providers  from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import Script from "next/script";
import AdHorizontal from "@/components/AdHorizontal";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Elektrikliyiz',
    default: 'Elektrikliyiz – Elektrikli Otomobil ve Elektrikli Araç Modelleri, Fiyatlar, Özellikler ve Karşılaştırmalar',
  },
  description: "Elektrikli otomobil ve elektrikli araç modellerine dair tüm bilgiler burada! Fiyatlar, teknik özellikler, menzil karşılaştırmaları ve en güncel elektrikli araç rehberi elektrikliyiz.com'da.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {/* Google AdSense - normal script tag kullanıyoruz */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7739465360112931"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Providers>
          <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover />
          <Header />
          <AdHorizontal />
          <main className="flex-grow">
            {children}
          </main>
          <AdHorizontal />
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
} 
