'use client';

import { useState, useEffect } from 'react';
import { event } from '@/utils/analytics';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check cookie preference
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
    
    // Google Analytics olayını gönder
    event({
      action: 'cookie_consent',
      category: 'engagement',
      label: 'accepted',
    });
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
    
    // Google Analytics olayını gönder
    event({
      action: 'cookie_consent',
      category: 'engagement',
      label: 'rejected',
    });
  };

  // Function to reset cookie preference for testing
  const handleReset = () => {
    localStorage.removeItem('cookieConsent');
    setShowConsent(true);
  };

  return (
    <>
      {/* Cookie Notification */}
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
                <h3 className="text-base font-semibold text-gray-900 mb-1">Cookie Notice</h3>
                <p className="text-gray-600 text-sm">
                  This website uses cookies to provide you with the best experience.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-1.5 rounded-lg
                       text-sm font-medium hover:opacity-90 transition-all duration-200"
              >
                Accept All
              </button>
              <button
                onClick={handleReject}
                className="px-6 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm
                       font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 