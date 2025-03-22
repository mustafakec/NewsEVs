'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import VehicleFilters from '@/views/VehicleFilters';
import { useFilteredVehicles, useElectricVehicleStore } from '@/viewmodels/useElectricVehicles';
import type ElectricVehicle from '@/models/ElectricVehicle';
import PremiumModal from '@/components/PremiumModal';
import { useUserStore } from '@/stores/useUserStore';

// Araç kartını lazy loading ile yükle
const VehicleCard = dynamic(() => import('@/views/VehicleCard'), {
  loading: () => (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
      <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="h-8 bg-purple-100 rounded"></div>
        ))}
      </div>
    </div>
  ),
  ssr: true,
});

// Araç tipini standartlaştır fonksiyonu ayrı bir yardımcı modüle taşındı
import { normalizeVehicleType } from '@/utils/vehicleUtils';

export default function ElectricVehiclesPage() {
  const searchParams = useSearchParams();
  const setFilters = useElectricVehicleStore((state) => state.setFilters);
  const vehicleType = searchParams.get('tip'); // Anasayfadan gelen tip parametresini al
  
  // Ana PremiumModal için state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  
  // Sayfa ilk yüklendiğinde ve URL parametreleri değiştiğinde çalışır
  useEffect(() => {
    console.log('Elektrikli araçlar sayfası yüklendi veya URL parametreleri değişti');
    console.log('Filtreler sıfırlanıyor...');
    
    // Önce tüm filtreleri temizle
    setFilters({});
    
    // URL'de tip parametresi varsa, sadece o filtreyi uygula
    if (vehicleType) {
      console.log('URL Parametresi:', vehicleType);
      
      // Tipi normalize et
      const normalizedType = normalizeVehicleType(vehicleType);
      console.log('Normalize Edilmiş Tip:', normalizedType);
      
      // Sadece araç tipi filtresini ayarla (setTimeout kullanımı kaldırıldı)
      setFilters({ vehicleType: normalizedType });
      console.log('Filtre ayarlandı:', { vehicleType: normalizedType });
    }
  }, [vehicleType, searchParams, setFilters]); // vehicleType veya searchParams değiştiğinde yeniden çalışır
  
  // Başlık için kullanılacak formatlama
  const getPageTitle = (type: string | null): string => {
    if (!type) return 'Elektrikli Araçlar';
    
    const normalizedType = normalizeVehicleType(type);
    
    // Özel başlık formatları
    if (normalizedType === 'Motosiklet') return 'Elektrikli Motosikletler';
    if (normalizedType === 'Scooter') return 'Elektrikli Scooterlar';
    
    // Diğer araç tipleri için standart format
    return `Elektrikli ${normalizedType} Araçlar`;
  };
  
  // Sayfa açıklaması için kullanılacak formatlama
  const getPageDescription = (type: string | null): string => {
    if (!type) return 'Elektrikli araç modellerini inceleyin, karşılaştırın ve size en uygun olanı bulun.';
    
    const normalizedType = normalizeVehicleType(type);
    
    // Özel açıklama formatları
    if (normalizedType === 'Motosiklet') 
      return 'Elektrikli motosiklet modellerini inceleyin, karşılaştırın ve size en uygun olanı bulun.';
    if (normalizedType === 'Scooter') 
      return 'Elektrikli scooter modellerini inceleyin, karşılaştırın ve size en uygun olanı bulun.';
    
    // Diğer araç tipleri için standart format
    return 'Elektrikli araç modellerini inceleyin, karşılaştırın ve size en uygun olanı bulun.';
  };
  
  // Sayfa başlığı
  const pageTitle = getPageTitle(vehicleType);
  
  // Sayfa açıklaması
  const pageDescription = getPageDescription(vehicleType);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-[#660566] via-[#330233] to-black">
              {pageTitle}
            </h1>
            <p className="text-gray-600 mt-2">
              {pageDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filtreler */}
            <div className="lg:w-full flex-shrink-0">
              <div className="sticky top-4">
                <VehicleFilters />
              </div>
            </div>

            {/* Araç Listesi */}
            <div className="md:col-span-3">
              <Suspense
                fallback={
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                        <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
                        <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
                        <div className="grid grid-cols-2 gap-2">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="h-8 bg-purple-100 rounded"></div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <VehicleListWithFilters openPremiumModal={() => setIsPremiumModalOpen(true)} />
              </Suspense>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 max-w-4xl mx-auto text-center flex flex-col items-center">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Bu sayfadaki tüm markalar ve logolar bilgilendirme amaçlıdır. Firmalarla iş birliğimiz veya bağlantımız yoktur.
              </span>
              <span className="mt-1">Fiyatlar ve bilgiler değişiklik gösterebilir. Tüm bilgiler aylık güncellenir.</span>
            </p>
          </div>
          
          {/* Ana Premium Modal */}
          <PremiumModal 
            isOpen={isPremiumModalOpen} 
            onClose={() => setIsPremiumModalOpen(false)}
            aria-label="Premium üyelik"
          />
        </div>
      </div>
    </div>
  );
}

// VehicleListWithFilters bileşeni ana dosyadan ayrıldı
function VehicleListWithFilters({ openPremiumModal }: { openPremiumModal: () => void }) {
  const { vehicles, isLoading, error, isComingSoonActive } = useFilteredVehicles();
  const setFilters = useElectricVehicleStore((state) => state.setFilters);
  const { user } = useUserStore();
  const isPremium = user?.isPremium || false;
  
  // Premium Üye Ol butonuna tıklandığında ana Premium modalı açacak fonksiyon
  const handlePremiumClick = () => {
    // Önce comingSoon filtresini kapat
    setFilters({ comingSoon: false });
    // Ana Premium modalını aç
    openPremiumModal();
  };

  const handleCancelPremium = () => {
    setFilters({ comingSoon: false });
  };

  // Erken dönüş (early return) yaparak daha iyi performans sağlıyoruz
  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
            <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-8 bg-purple-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Araçlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</span>
        </div>
      </div>
    );
  }

  if (!vehicles?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500">Araç bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle: ElectricVehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
          />
        ))}
      </div>

      {/* Premium overlay - sadece içerik alanına uygulanıyor */}
      {isComingSoonActive && !isPremium && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          {/* Blur efekti */}
          <div className="absolute inset-0 premium-blur" onClick={handleCancelPremium}></div>
          
          {/* Premium modal */}
          <div className="relative z-40 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300">
            {/* Kapatma butonu */}
            <button 
              onClick={handleCancelPremium}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* İkon */}
            <div className="flex justify-center pt-8 pb-4">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  />
                </svg>
              </div>
            </div>
            
            {/* Başlık */}
            <h3 className="text-center text-xl font-semibold text-gray-900 px-6">Premium İçerik</h3>
            
            {/* Açıklama */}
            <div className="p-6 pt-3">
              <p className="text-center text-gray-600 mb-8">
                Bu içerik premium üyelere özeldir. Premium üyelik ile Türkiye'de yakın zamanda satışa sunulacak olan elektrikli araçları görüntüleyebilirsiniz.
              </p>
              
              {/* Premium buton */}
              <button 
                onClick={handlePremiumClick}
                className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white font-medium py-3 px-4 rounded-md hover:opacity-90 transition-all duration-180"
                aria-label="Premium üye ol"
              >
                Premium Üye Ol
              </button>
              
              {/* Daha sonra butonu */}
              <button 
                onClick={handleCancelPremium}
                className="w-full mt-3 bg-white text-gray-600 font-medium py-3 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-all duration-180"
                aria-label="Daha sonra"
              >
                Daha Sonra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 