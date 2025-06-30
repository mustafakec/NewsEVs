'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    addedCount: number;
    updatedCount: number;
    errors: string[];
  };
}

interface DebugResult {
  success: boolean;
  message: string;
  data?: {
    basicVehicles: number;
    completeVehicles: number;
    sampleVehicles: Array<{ id: string; brand: string; model: string }>;
    allIds: string[];
  };
}

export default function SheetSyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [debugResult, setDebugResult] = useState<DebugResult | null>(null);
  const [vehicleId, setVehicleId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Auth kontrolü
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('sync-auth');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
        router.push('/st77xrLm00');
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  const handleSync = async (action: string) => {
    setIsLoading(true);
    setResult(null);
    setDebugResult(null);

    try {
      const response = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sync-auth-token',
        },
        body: JSON.stringify({ action, vehicleId }),
      });

      const data = await response.json();
      
      if (action === 'debug-sheets') {
        setDebugResult(data);
      } else {
        setResult(data);
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: 'API isteği başarısız oldu',
        data: { addedCount: 0, updatedCount: 0, errors: [error.message] }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Session storage'dan temizle
    sessionStorage.removeItem('sync-auth');
    
    // Cookie'den temizle
    document.cookie = 'sync-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Login sayfasına yönlendir
    router.push('/st77xrLm00');
  };

  // Auth kontrolü yapılırken loading göster
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamış kullanıcılar için boş sayfa (zaten yönlendirme yapıldı)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center relative">
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Çıkış Yap
        </button>
        <h1 className="text-3xl font-bold mb-2">Google Sheets Senkronizasyon</h1>
        <p className="text-gray-600">
          Google Sheets'ten elektrikli araç verilerini Supabase'e senkronize edin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Debug Kartı */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">🐛 Debug Sheets</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Google Sheets'teki verileri kontrol edin
          </p>
          <button 
            onClick={() => handleSync('debug-sheets')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? '⏳ Yükleniyor...' : '🐛 Debug Sheets'}
          </button>
        </div>

        {/* Hızlı Senkronizasyon */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">⚡ Hızlı Senkronizasyon</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Sadece yeni eklenen araçları senkronize edin
          </p>
          <button 
            onClick={() => handleSync('sync-latest')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Yükleniyor...' : '⚡ Hızlı Senkronizasyon'}
          </button>
        </div>

        {/* Tam Senkronizasyon */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold">🔄 Tam Senkronizasyon</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Tüm araçları yeniden senkronize edin
          </p>
          <button 
            onClick={() => handleSync('sync-all')}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Yükleniyor...' : '🔄 Tam Senkronizasyon'}
          </button>
        </div>
      </div>

      {/* Belirli Araç Senkronizasyonu */}
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-2">Belirli Araç Senkronizasyonu</h2>
        <p className="text-sm text-gray-600 mb-4">
          Belirli bir araç ID'si ile senkronizasyon yapın
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="vehicleId" className="block text-sm font-medium mb-1">Araç ID</label>
            <input
              id="vehicleId"
              type="text"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              placeholder="Örnek: tesla-model-3-2024"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => handleSync('sync-vehicle')}
            disabled={isLoading || !vehicleId}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? '⏳ Yükleniyor...' : '✅ Araç Senkronize Et'}
          </button>
        </div>
      </div>

      {/* Sonuçlar */}
      {result && (
        <div className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.success ? '✅' : '❌'}
            <span className="font-semibold">{result.message}</span>
          </div>
          {result.data && (
            <div className="mt-2 text-sm">
              <div>Eklenen: {result.data.addedCount}</div>
              <div>Güncellenen: {result.data.updatedCount}</div>
              {result.data.errors.length > 0 && (
                <div className="mt-2">
                  <div className="font-semibold text-red-500">Hatalar:</div>
                  <ul className="list-disc list-inside">
                    {result.data.errors.map((error, index) => (
                      <li key={index} className="text-red-500">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Debug Sonuçları */}
      {debugResult && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🐛 Debug Sonuçları
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Temel Araçlar</label>
                <div className="text-2xl font-bold">{debugResult.data?.basicVehicles || 0}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Tam Araçlar</label>
                <div className="text-2xl font-bold">{debugResult.data?.completeVehicles || 0}</div>
              </div>
            </div>
            
            {debugResult.data?.sampleVehicles && debugResult.data.sampleVehicles.length > 0 && (
              <div>
                <label className="text-sm font-medium">Örnek Araçlar</label>
                <div className="mt-2 space-y-1">
                  {debugResult.data.sampleVehicles.map((vehicle, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-100 rounded">
                      <strong>ID:</strong> {vehicle.id} | <strong>Marka:</strong> {vehicle.brand} | <strong>Model:</strong> {vehicle.model}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {debugResult.data?.allIds && debugResult.data.allIds.length > 0 && (
              <div>
                <label className="text-sm font-medium">Tüm Araç ID'leri (İlk 10)</label>
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  {debugResult.data.allIds.slice(0, 10).join(', ')}
                  {debugResult.data.allIds.length > 10 && '...'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 