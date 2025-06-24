"use client";

// @ts-ignore
// eslint-disable-next-line
declare module 'videojs-vast-vpaid';
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
// import 'video.js/dist/video-js.css'; // Bunu global CSS'e taşı
// import 'videojs-vast-vpaid'; // Dinamik import ile yükleyeceğiz

interface RewardedVideoAdProps {
  onAdComplete: () => void;
  onAdError: () => void;
  onAdClose: () => void;
  isVisible: boolean;
}

const VAST_URL =
  'https://pubads.g.doubleclick.net/gampad/ads?sz=300x600|1024x768|728x90|320x50|160x600|640x480|300x250|970x250|336x280|320x480|400x300&iu=/23307685224/incele_reward_01&ciu_szs=300x250,300x600,320x100,320x480,336x280,728x90&env=vp&impl=s&gdfp_req=1&output=vast&unviewed_position_start=1&url=[referrer_url]&description_url=[description_url]&correlator=[timestamp]';

const RewardedVideoAd: React.FC<RewardedVideoAdProps> = ({
  onAdComplete,
  onAdError,
  onAdClose,
  isVisible
}) => {
  const videoNode = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [loadingText, setLoadingText] = useState('Reklam yükleniyor...');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Mobil cihaz kontrolü
  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isVisible) return;
    if (!videoNode.current) return;

    let isMounted = true;
    let playerInstance: any = null;

    // videojs'i global window'a ata
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.videojs = videojs;
    }

    import('videojs-vast-vpaid').then(() => {
      if (!isMounted) return;
      playerInstance = videojs(videoNode.current!, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        width: isMobile ? 320 : 480,
        height: isMobile ? 180 : 270,
      });
      playerRef.current = playerInstance;

      playerInstance.vastClient({
        adTagUrl: VAST_URL,
        playAdAlways: true,
        verbosity: 4,
        width: isMobile ? 320 : 480,
        height: isMobile ? 180 : 270,
        vpaidFlashLoaderPath: '',
      });

      playerInstance.on('adsready', () => {
        setIsAdLoaded(true);
        setLoadingText('Reklam hazır! İzlemek için tıklayın.');
      });
      playerInstance.on('adstart', () => {
        setIsAdPlaying(true);
        setLoadingText('Reklam oynatılıyor...');
      });
      playerInstance.on('adend', () => {
        setIsAdPlaying(false);
        setLoadingText('Reklam tamamlandı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onAdComplete();
        }, 1000);
      });
      playerInstance.on('adserror', () => {
        setIsAdPlaying(false);
        setLoadingText('Reklam yüklenemedi.');
        onAdError();
      });
    });

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isVisible, onAdComplete, onAdError]);

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
        setLoadingText('Reklam yüklenemedi.');
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

            {/* Video.js player */}
            <div 
              className={`w-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 ${
                isMobile ? 'h-32 sm:h-40' : 'h-48'
              }`}
            >
              <video
                ref={videoNode}
                className="video-js vjs-default-skin"
                playsInline
                style={{ width: isMobile ? 320 : 480, height: isMobile ? 180 : 270 }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onAdClose}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Reklamı Geç
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 Bu bölüm şu anda test aşamasındadır. Reklamı Geç diyerek araç sayfasına ulaşabilirsiniz.
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