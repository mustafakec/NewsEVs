'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SheetSyncManager from '../../components/SheetSyncManager';

export default function SyncSheetsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const isAuth = sessionStorage.getItem('sync-auth') === 'true';
    
    if (!isAuth) {
      router.push('/st77xrLm00');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sync-auth');
    router.push('/st77xrLm00');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router zaten yönlendirme yapacak
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Google Sheets Senkronizasyon
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              ⚠️ Sadece yetkili kullanıcılar için
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
        <SheetSyncManager />
      </div>
    </div>
  );
} 