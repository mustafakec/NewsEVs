'use client';

import { Suspense } from 'react';
import { useGoogleAnalytics } from '@/hooks/useGoogleAnalytics';

function AnalyticsTestContent() {
  const { trackEvent } = useGoogleAnalytics();

  const handleTestClick = () => {
    trackEvent('button_click', 'test', 'analytics_test_button', 1);
    alert('Event tracked! Check Google Analytics.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Google Analytics Test Sayfası</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Test Butonları</h2>
        
        <div className="space-y-4">
          <button
            onClick={handleTestClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Test Event Gönder
          </button>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Test Adımları:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Bu sayfayı açın</li>
              <li>Butona tıklayın</li>
              <li>Google Analytics Real-Time raporunu kontrol edin</li>
              <li>Event'lerin görünüp görünmediğini kontrol edin</li>
            </ol>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-100 rounded">
            <h3 className="font-semibold mb-2">Kontrol Edilecekler:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Sayfa görüntüleme (Page View)</li>
              <li>Buton tıklama event'i</li>
              <li>Sayfa geçişleri</li>
              <li>Kullanıcı davranışları</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsTestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyticsTestContent />
    </Suspense>
  );
} 