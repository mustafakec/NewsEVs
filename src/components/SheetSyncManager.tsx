'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    addedCount: number;
    updatedCount: number;
    errors: string[];
  };
  errors?: string[];
}

export default function SheetSyncManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState('');
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [syncProgress, setSyncProgress] = useState<string>('');

  const handleSync = async (action: 'sync-all' | 'sync-latest' | 'sync-vehicle') => {
    setIsLoading(true);
    setSyncProgress('Senkronizasyon başlatılıyor...');
    
    try {
      const response = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          vehicleId: action === 'sync-vehicle' ? vehicleId : undefined
        }),
      });

      const result: SyncResult = await response.json();
      setLastSyncResult(result);
      setSyncProgress('');

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Senkronizasyon başarısız');
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Senkronizasyon hatası:', error);
      toast.error('Senkronizasyon sırasında hata oluştu');
      setSyncProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSync = async () => {
    setIsLoading(true);
    setSyncProgress('12 Google Sheets\'ten veri çekiliyor...');
    
    try {
      const response = await fetch('/api/sync-sheets', {
        method: 'GET',
      });

      const result: SyncResult = await response.json();
      setLastSyncResult(result);
      setSyncProgress('');

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Senkronizasyon başarısız');
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Hızlı senkronizasyon hatası:', error);
      toast.error('Senkronizasyon sırasında hata oluştu');
      setSyncProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🚗 Google Sheets - Supabase Senkronizasyon Yöneticisi
        </h2>
        <p className="text-gray-600 text-lg">
          12 farklı Google Sheets'ten elektrikli araç verilerini Supabase'e senkronize edin
        </p>
      </div>

      {/* İlerleme Durumu */}
      {syncProgress && (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800 font-medium">{syncProgress}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Hızlı Senkronizasyon */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">⚡</span>
            <h3 className="text-xl font-semibold text-blue-900">
              Hızlı Senkronizasyon
            </h3>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Sadece yeni eklenen araçları 12 sheet'ten çekip Supabase'e aktarır
          </p>
          <button
            onClick={handleQuickSync}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Senkronize Ediliyor...
              </>
            ) : (
              '🚀 Hızlı Senkronizasyon'
            )}
          </button>
        </div>

        {/* Tam Senkronizasyon */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">📋</span>
            <h3 className="text-xl font-semibold text-green-900">
              Tam Senkronizasyon
            </h3>
          </div>
          <p className="text-green-700 text-sm mb-4">
            Tüm araçları 12 sheet'ten çekip senkronize eder ve günceller
          </p>
          <button
            onClick={() => handleSync('sync-all')}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Senkronize Ediliyor...
              </>
            ) : (
              '🔄 Tam Senkronizasyon'
            )}
          </button>
        </div>
      </div>

      {/* Belirli Araç Senkronizasyonu */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 mb-8">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">🎯</span>
          <h3 className="text-xl font-semibold text-purple-900">
            Belirli Araç Senkronizasyonu
          </h3>
        </div>
        <p className="text-purple-700 text-sm mb-4">
          Belirli bir araç ID'si ile 12 sheet'ten veri çekip senkronizasyon yapın
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            placeholder="Araç ID'si girin (örn: tesla-model-3-2024)"
            className="flex-1 px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={() => handleSync('sync-vehicle')}
            disabled={isLoading || !vehicleId.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Senkronize Ediliyor...
              </>
            ) : (
              '🎯 Senkronize Et'
            )}
          </button>
        </div>
      </div>

      {/* Son Senkronizasyon Sonucu */}
      {lastSyncResult && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">📊</span>
            Son Senkronizasyon Sonucu
          </h3>
          
          <div className={`p-4 rounded-md mb-4 ${
            lastSyncResult.success 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <p className="font-medium text-lg">{lastSyncResult.message}</p>
          </div>

          {lastSyncResult.data && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-blue-600 font-medium">➕ Eklenen Araç</p>
                <p className="text-2xl font-bold text-blue-800">
                  {lastSyncResult.data.addedCount}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-600 font-medium">🔄 Güncellenen Araç</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {lastSyncResult.data.updatedCount}
                </p>
              </div>
            </div>
          )}

          {lastSyncResult.errors && lastSyncResult.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <p className="text-sm font-medium text-red-800 mb-3 flex items-center">
                <span className="text-lg mr-2">❌</span>
                Hatalar:
              </p>
              <ul className="text-sm text-red-700 space-y-2">
                {lastSyncResult.errors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span className="flex-1">{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Google Sheets Bilgileri */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
        <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📋</span>
          Kullanılan Google Sheets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Ana Araç Bilgileri', id: '1S-uScup7RnP0U5KYqVXtyy3I4Kpp4XrhxrpJOM_AD8I' },
            { name: 'Şarj Süreleri', id: '1csLVfoSM2GLq_8uXFQdRuDJQccXHdoRmwKIUxm4iOSQ' },
            { name: 'Performans Verileri', id: '18z9sGvc-UyGA7leQo4VtpLD-gMC1v1ZZIN-mfdn4A4A' },
            { name: 'Boyut Bilgileri', id: '1_4tVPtVcjsx5cnHli7w_xaeLqgDJ8CS1OonJOJ-Scd4' },
            { name: 'Verimlilik Verileri', id: '1Pkpmp4R0PncKkM-m6RGAoT4CzQSaVWNR1PV2c1dExKg' },
            { name: 'Konfor Özellikleri', id: '12uljuqeCpG8QTWXsiSILlnq_5MHu4He20hCx5-WJFYE' },
            { name: 'Özellikler Listesi', id: '1D2_-KSv9Gy7u-_99D57I_KG2KILWEXKHG2rqlNjxqFk' },
            { name: 'Fiyat Bilgileri', id: '1P9bLuVXS8xMtq0VJfwp8EsklTEeZVBJeu8skoIZY4UE' },
            { name: 'Türkiye Durumu', id: '1sKjfaCHsa75SSkSChFFzmpa2dfF8oTQu021KCH23VoE' },
            { name: 'Görsel URL\'leri', id: '12pcSBV6cKon0ciTL4yKINHSHw8xav8OO0XMY3kWhUyA' },
            { name: 'Çevresel Etki', id: '16wmYF-VOCGmU3ckwaKsT9LvwoZ3T_2ScjiNhW2gKomc' },
            { name: 'Garanti Bilgileri', id: '1obFECRDBwYxalbuB8cuHXZtk_gVBSE2yBWuzxdWGTVA' }
          ].map((sheet, index) => (
            <div key={index} className="bg-white p-3 rounded-md border border-blue-200">
              <p className="text-sm font-medium text-blue-900">{sheet.name}</p>
              <p className="text-xs text-blue-600 font-mono">{sheet.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kullanım Talimatları */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📖</span>
          Kullanım Talimatları
        </h3>
        <ul className="text-green-700 text-sm space-y-2">
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span><strong>Hızlı Senkronizasyon:</strong> Sadece Google Sheets'e yeni eklenen araçları 12 sheet'ten çekip Supabase'e aktarır</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span><strong>Tam Senkronizasyon:</strong> Tüm araçları 12 sheet'ten çekip senkronize eder ve mevcut olanları günceller</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span><strong>Belirli Araç:</strong> Belirli bir araç ID'si ile tek araç senkronizasyonu yapar</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span>Her sheet'in ilk sütunu araç ID'si olmalıdır</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span>Senkronizasyon işlemi sırasında sayfayı kapatmayın</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">•</span>
            <span>Service Account: <code className="bg-green-100 px-1 rounded">supabase-sync@sheet-sb-464214.iam.gserviceaccount.com</code></span>
          </li>
        </ul>
      </div>
    </div>
  );
} 