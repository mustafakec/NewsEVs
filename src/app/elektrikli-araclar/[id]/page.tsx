import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import VehicleClientContent from '@/components/VehicleClientContent';
import type ElectricVehicle from '@/models/ElectricVehicle';

// Static olarak oluşturulacak parametre listesini belirleme
export async function generateStaticParams() {
  try {
    // API üzerinden tüm araçları çek
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vehicles`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      console.error('generateStaticParams: API hatası:', response.status);
      // Hata durumunda temel ID'leri ve yaygın slug formatlarını döndür
      return [
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
        { id: "tesla-model-3" },
        { id: "tesla-model-y" },
        { id: "bmw-i4" },
        { id: "porsche-taycan" },
        { id: "volkswagen-id.4" },  // Noktalı format
        { id: "volkswagen-id4" }    // Noktasız format
      ];
    }
    
    const vehicles = await response.json();
    console.log(`generateStaticParams: ${vehicles.length} araç bulundu`);
    
    // Tüm olası formatlar için parametreler oluştur
    const params = [];
    
    vehicles.forEach((vehicle: ElectricVehicle) => {
      // ID formatı
      params.push({ id: vehicle.id });
      
      // Standart slug formatı (marka-model)
      const standardSlug = `${vehicle.brand}-${vehicle.model}`.toLowerCase().replace(/\s+/g, '-');
      params.push({ id: standardSlug });
      
      // Alternatif slug formatı (marka model her türlü karakter)
      const alternativeSlug = `${vehicle.brand}-${vehicle.model}`.toLowerCase();
      params.push({ id: alternativeSlug });
      
      // Noktalı modeller için nokta bırakılmış format
      if (vehicle.model.includes('.')) {
        // Nokta korunmuş format (örn: volkswagen-id.4)
        const withDotSlug = `${vehicle.brand}-${vehicle.model}`.toLowerCase().replace(/\s+/g, '-');
        params.push({ id: withDotSlug });
        
        // Nokta kaldırılmış format (örn: volkswagen-id4)
        const noDotSlug = `${vehicle.brand}-${vehicle.model}`.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
        params.push({ id: noDotSlug });
      }
    });
    
    // Volkswagen ID.4 için özel durumlar
    params.push({ id: "volkswagen-id.4" });
    params.push({ id: "volkswagen-id4" });
    
    // Benzersiz parametreleri döndür
    const uniqueParams = Array.from(new Set(params.map(p => p.id))).map(id => ({ id }));
    
    console.log(`generateStaticParams: ${uniqueParams.length} benzersiz parametre oluşturuldu`);
    return uniqueParams;
  } catch (error) {
    console.error('generateStaticParams hatası:', error);
    // Hata durumunda temel ID'leri ve yaygın slug formatlarını döndür
    return [
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
      { id: "5" },
      { id: "tesla-model-3" },
      { id: "tesla-model-y" },
      { id: "bmw-i4" }, 
      { id: "porsche-taycan" },
      { id: "volkswagen-id.4" },  // Noktalı format
      { id: "volkswagen-id4" }    // Noktasız format
    ];
  }
}

// Sayfa metadatası oluşturma
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    console.log('generateMetadata: İstek alındı, ID/slug:', params.id);
    
    // Önce ID formatı mı, yoksa slug formatı mı olduğunu belirle
    const isIdFormat = /^\d+$/.test(params.id);
    let vehicle;
    
    if (isIdFormat) {
      // ID formatı ise direkt API çağrısı yap
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vehicles/${params.id}`, { 
        cache: 'no-store' 
      });
      
      if (!response.ok) {
        return getDefaultMetadata();
      }
      
      vehicle = await response.json();
    } else {
      // Slug formatı ise, tüm araçları çekip slug eşleşmesini kontrol et
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vehicles`, { 
        cache: 'no-store' 
      });
      
      if (!response.ok) {
        return getDefaultMetadata();
      }
      
      const vehicles = await response.json();
      
      // Slug temizleme - nokta gibi karakterleri koruyarak ve kaldırarak iki versiyonu da kontrol et
      const slugLower = params.id.toLowerCase();
      const slugNoDot = params.id.toLowerCase().replace(/\./g, '');
      
      // Tüm olası eşleşme formatlarını kontrol et
      let matchedVehicle = vehicles.find((v: ElectricVehicle) => {
        const standardSlug = `${v.brand}-${v.model}`.toLowerCase().replace(/\s+/g, '-');
        const alternativeSlug = `${v.brand}-${v.model}`.toLowerCase();
        const noDotSlug = `${v.brand}-${v.model}`.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
        
        return standardSlug === slugLower || 
               alternativeSlug === slugLower || 
               noDotSlug === slugNoDot;
      });
      
      // Özel durum: Volkswagen ID.4 kontrolü
      if (!matchedVehicle && (slugLower === 'volkswagen-id.4' || slugNoDot === 'volkswagen-id4')) {
        matchedVehicle = vehicles.find((v: ElectricVehicle) => v.id === '2'); // Volkswagen ID.4 için
      }
      
      if (!matchedVehicle) {
        return getDefaultMetadata();
      }
      
      vehicle = matchedVehicle;
    }
    
    // Araç bulunduysa özel metadata oluştur
    return {
      title: `${vehicle.brand} ${vehicle.model} - Elektrikli Araç İncelemesi | Elektrikliyiz`,
      description: `${vehicle.brand} ${vehicle.model} elektrikli aracının özellikleri, menzili, batarya kapasitesi ve fiyatı hakkında detaylı bilgiler.`,
      openGraph: {
        title: `${vehicle.brand} ${vehicle.model} - Elektrikli Araç`,
        description: `${vehicle.range} km menzil, ${vehicle.batteryCapacity} kWh batarya`,
        images: vehicle.images && vehicle.images.length > 0 ? [vehicle.images[0]] : [],
      },
    };
  } catch (error) {
    console.error('generateMetadata hatası:', error);
    return getDefaultMetadata();
  }
}

// Varsayılan metadata
function getDefaultMetadata(): Metadata {
  return {
    title: 'Elektrikli Araç Detayı | Elektrikliyiz',
    description: 'Elektrikli araç detayları',
  };
}

// Basit yükleniyor componenti
function LoadingComponent() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="animate-spin w-12 h-12 border-4 border-[#660566] border-t-transparent rounded-full"></div>
      <p className="mt-4 text-lg text-[#660566]">Araç bilgileri yükleniyor...</p>
    </div>
  );
}

// Hata componenti
function ErrorComponent({ error }: { error: string }) {
  return (
    <div className="bg-red-50 p-8 rounded-xl shadow-sm">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Araç bilgileri alınamadı</h2>
        <p className="text-gray-600 mb-6">{error || 'Araç bilgilerini yüklerken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'}</p>
        <Link 
          href="/elektrikli-araclar"
          className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg transition-colors hover:bg-purple-700"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Tüm elektrikli araçlara dön
        </Link>
      </div>
    </div>
  );
}

// String'i slug formatına dönüştüren yardımcı fonksiyon
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')      // Boşlukları tire ile değiştir
    .replace(/\./g, '')        // Noktaları kaldır
    .normalize('NFD')          // Aksanlı karakterleri ayır
    .replace(/[\u0300-\u036f]/g, '') // Aksan işaretlerini kaldır
    .replace(/[^a-z0-9-]/g, ''); // Alfanümerik olmayan karakterleri kaldır
}

// Ana sayfa bileşeni
export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  try {
    console.log('VehicleDetailPage: İstek alındı, ID/slug:', params.id);
    
    // Önce ID formatı mı, yoksa slug formatı mı olduğunu belirle
    const isIdFormat = /^\d+$/.test(params.id);
    
    if (isIdFormat) {
      // Doğrudan ID formatı ise, direkt API çağrısı yap
      return await renderWithId(params.id);
    } else {
      // Slug formatı, tüm araçları çekip slug eşleşmesini kontrol et
      return await renderWithSlug(params.id);
    }
  } catch (error) {
    console.error('VehicleDetailPage hatası:', error);
    return <ErrorComponent error={(error as Error).message} />;
  }
}

// ID ile render fonksiyonu
async function renderWithId(id: string) {
  // API'den ID'ye göre araç bilgilerini çek
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vehicles/${id}`, { 
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error('renderWithId: API hatası:', response.status);
    throw new Error('Araç bilgileri alınamadı');
  }
  
  const vehicle = await response.json();
  
  if (!vehicle) {
    console.error('renderWithId: API yanıt verdi ama araç verisi yok');
    throw new Error('Araç bilgileri eksik');
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingComponent />}>
          <VehicleClientContent vehicle={vehicle} />
        </Suspense>
      </div>
    </div>
  );
}

// Slug ile render fonksiyonu
async function renderWithSlug(slug: string) {
  // Tüm araçları çek
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/vehicles`, { 
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error('renderWithSlug: API hatası:', response.status);
    throw new Error('Araç bilgileri alınamadı');
  }
  
  const vehicles = await response.json();
  
  // Gelen slug parametresini normalize et
  const normalizedSlug = toSlug(slug);
  
  // Tüm olası eşleşme formatlarını kontrol et
  let matchedVehicle = vehicles.find((v: ElectricVehicle) => {
    // Araç için slug oluştur
    const vehicleSlug = toSlug(`${v.brand}-${v.model}`);
    
    // Eşleşme kontrolü
    return vehicleSlug === normalizedSlug;
  });
  
  // Özel durum: Volkswagen ID.4 kontrolü
  if (!matchedVehicle && (normalizedSlug === 'volkswagen-id4' || normalizedSlug.includes('id4'))) {
    matchedVehicle = vehicles.find((v: ElectricVehicle) => 
      v.brand.toLowerCase() === 'volkswagen' && v.model.toLowerCase().includes('id.4')
    );
  }
  
  // Özel durum: BMW i4 eDrive 40 kontrolü
  if (!matchedVehicle && normalizedSlug.includes('bmw-i4')) {
    if (normalizedSlug.includes('edrive') || normalizedSlug.includes('edrive40')) {
      matchedVehicle = vehicles.find((v: ElectricVehicle) => 
        v.brand.toLowerCase() === 'bmw' && v.model.toLowerCase().includes('i4')
      );
    }
  }
  
  if (!matchedVehicle) {
    console.error('renderWithSlug: Slug eşleşmesi bulunamadı:', slug);
    throw new Error('Araç bulunamadı');
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingComponent />}>
          <VehicleClientContent vehicle={matchedVehicle} />
        </Suspense>
      </div>
    </div>
  );
} 