"use client";

import React, { useEffect, useRef, useState } from 'react';

interface RewardedVideoAdProps {
  onAdComplete: () => void;
  onAdError: () => void;
  onAdClose: () => void;
  isVisible: boolean;
}

declare global {
  interface Window {
    googletag: any;
  }
}

const RewardedVideoAd: React.FC<RewardedVideoAdProps> = ({
  onAdComplete,
  onAdError,
  onAdClose,
  isVisible
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adSlot, setAdSlot] = useState<any>(null);
  const [loadingText, setLoadingText] = useState('Reklam yükleniyor...');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mobil cihaz kontrolü
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isVisible || isInitialized) return;

    const loadGoogleAdSense = () => {
      if (window.googletag) {
        initializeAd();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = initializeAd;
      script.onerror = () => {
        console.error('Failed to load Google AdSense script');
        onAdError();
      };
      document.head.appendChild(script);
    };

    const initializeAd = () => {
      try {
        window.googletag = window.googletag || { cmd: [] };
        
        window.googletag.cmd.push(() => {
          // Rewarded video ad slot'unu tanımla
          const slot = window.googletag.defineOutOfPageSlot(
            '/23307685224/incele_reward_01',
            window.googletag.enums.OutOfPageFormat.REWARDED
          );

          if (slot) {
            setAdSlot(slot);
            setIsInitialized(true);
            
            // Event listener'ları ekle
            window.googletag.pubads().addEventListener('slotRenderEnded', (event: any) => {
              if (event.slot === slot) {
                setIsAdLoaded(true);
                setLoadingText('Reklam hazır! İzlemek için tıklayın.');
              }
            });

            window.googletag.pubads().addEventListener('rewardedSlotReady', (event: any) => {
              if (event.slot === slot) {
                // Rewarded video hazır, oynat
                window.googletag.pubads().show(event.slot);
                setIsAdPlaying(true);
                setLoadingText('Reklam oynatılıyor...');
              }
            });

            window.googletag.pubads().addEventListener('rewardedSlotClosed', (event: any) => {
              if (event.slot === slot) {
                setIsAdPlaying(false);
                onAdClose();
              }
            });

            window.googletag.pubads().addEventListener('rewardedSlotGranted', (event: any) => {
              if (event.slot === slot) {
                // Kullanıcı reklamı tamamladı, ödül ver
                setLoadingText('Reklam tamamlandı! Yönlendiriliyorsunuz...');
                setTimeout(() => {
                  onAdComplete();
                }, 1000);
              }
            });

            window.googletag.pubads().addEventListener('slotRequested', (event: any) => {
              if (event.slot === slot) {
                console.log('Rewarded video ad requested');
                setLoadingText('Reklam isteniyor...');
              }
            });

            window.googletag.pubads().addEventListener('slotResponseReceived', (event: any) => {
              if (event.slot === slot) {
                console.log('Rewarded video ad response received');
                setLoadingText('Reklam yükleniyor...');
              }
            });

            // AdSense servislerini etkinleştir (sadece bir kez)
            if (!window.googletag.pubads().isInitialized()) {
              window.googletag.pubads().enableSingleRequest();
              window.googletag.pubads().collapseEmptyDivs();
              window.googletag.enableServices();
            }

            // Reklamı yükle
            window.googletag.pubads().refresh([slot]);
          } else {
            console.error('Failed to create ad slot');
            onAdError();
          }
        });
      } catch (error) {
        console.error('Error initializing ad:', error);
        onAdError();
      }
    };

    loadGoogleAdSense();

    return () => {
      // Cleanup
      if (adSlot) {
        try {
          window.googletag?.cmd.push(() => {
            window.googletag.destroySlots([adSlot]);
          });
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, [isVisible, onAdComplete, onAdError, onAdClose, adSlot, isInitialized]);

  // Loading progress animasyonu
  useEffect(() => {
    if (isVisible && !isAdLoaded && !isAdPlaying) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isVisible, isAdLoaded, isAdPlaying]);

  // Timeout kontrolü - 15 saniye sonra hata ver
  useEffect(() => {
    if (isVisible && !isAdLoaded && !isAdPlaying) {
      const timeout = setTimeout(() => {
        console.log('Ad loading timeout - redirecting user');
        onAdError();
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, isAdLoaded, isAdPlaying, onAdError]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
      <div className={`bg-white rounded-xl p-4 sm:p-6 ${isMobile ? 'w-full max-w-sm' : 'max-w-md w-full'} mx-auto shadow-2xl`}>
        <div className="text-center">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {isAdPlaying ? 'Reklam İzleniyor' : 'Reklam'}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {isAdPlaying 
                ? 'Reklamı tamamlayın ve detayları görün'
                : ''
              }
            </p>
          </div>

          {/* Loading/Ad Container */}
          <div className="mb-4 sm:mb-6">
            {!isAdLoaded && !isAdPlaying && (
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
                <div className="mb-3 sm:mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(loadingProgress, 90)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-600 mx-auto mb-2 sm:mb-3"></div>
                <p className="text-xs sm:text-sm text-gray-600">{loadingText}</p>
              </div>
            )}

            {isAdPlaying && (
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="animate-pulse">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{loadingText}</p>
              </div>
            )}

            {/* Ad container */}
            <div 
              ref={adContainerRef}
              id="rewarded-video-ad-container"
              className={`w-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${
                isMobile ? 'h-32 sm:h-40' : 'h-48'
              }`}
            >
              <div className="text-center">
                <svg className={`text-gray-400 mx-auto mb-2 ${
                  isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-12 h-12'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-xs sm:text-sm">Reklam alanı</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onAdClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              İptal
            </button>
            {isAdLoaded && !isAdPlaying && (
              <button
                onClick={() => {
                  try {
                    window.googletag?.cmd.push(() => {
                      window.googletag.pubads().show(adSlot);
                    });
                  } catch (error) {
                    console.error('Error showing ad:', error);
                    onAdError();
                  }
                }}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
              >
                Reklamı İzle
              </button>
            )}
          </div>

          {/* Info */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 Reklamı tamamladıktan sonra araç detaylarına otomatik olarak yönlendirileceksiniz.
            </p>
          </div>

          {/* Mobil için ek bilgi */}
          {isMobile && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-700">
                📱 Mobil cihazınızda reklam izleme deneyimi optimize edilmiştir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardedVideoAd; 