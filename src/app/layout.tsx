import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import  Providers  from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageTracking from '@/components/PageTracking';
import Script from "next/script";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NewsEVs',
    default: 'NewsEVs – Electric Car and Electric Vehicle Models, Prices, Features and Comparisons',
  },
  description: "All information about electric cars and electric vehicle models is here! Prices, technical specifications, range comparisons and the most up-to-date electric vehicle guide at newsevs.com.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  verification: {
    google: 'YTb_cRxaPSim5wJTJehZLGmGrosgIiRzlY5scUCM-_4',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <PageTracking />
        </Suspense>
        <Providers>
          <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
} 
