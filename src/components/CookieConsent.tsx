'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Çerez tercihini kontrol et
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
  };

  // Test için çerez tercihini sıfırlama fonksiyonu
  const handleReset = () => {
    localStorage.removeItem('cookieConsent');
    setShowConsent(true);
  };

  return (
    <>
      {/* Çerez Bildirimi */}
      {showConsent && (
        <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-[#660566] rounded-full p-1.5 shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Çerez Bildirimi</h3>
                <p className="text-gray-600 text-sm">
                  Bu web sitesi, size en iyi deneyimi sunabilmek için çerezleri kullanmaktadır.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-1.5 rounded-lg
                       text-sm font-medium hover:opacity-90 transition-all duration-200"
              >
                Tümünü Kabul Et
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm
                       font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 