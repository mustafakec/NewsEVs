import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { fetchVehicles } from '@/hooks/useVehicles';
import VehicleClientContent from '@/components/VehicleClientContent';
import 
 {ElectricVehicle} from '@/models/ElectricVehicle';
import { toSlug } from '@/utils/vehicleUtils';

// Statik parametre oluşturma (SSG için)
export async function generateStaticParams() {
  const vehicles = await fetchVehicles();
  
  return vehicles.map((vehicle) => {
    // Her araç için slug oluştur
    const slug = toSlug(`${vehicle.brand}-${vehicle.model}`);
    
    return {
      id: slug,
    };
  });
}

// Dinamik meta verileri oluştur
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ana metadata'yı yükle
  const parentMetadata = await parent;
  
  // Aracı getir
  const vehicle = await getVehicleData(params.id);
  
  // Eğer araç bulunamazsa, varsayılan meta verileri kullan
  if (!vehicle) {
    return {
      title: 'Araç Bulunamadı | Elektrikliyiz',
      description: 'Aradığınız elektrikli araç bulunamadı.'
    };
  }
  
  // Dinamik meta verilerini oluştur
  return {
    title: `${vehicle.brand} ${vehicle.model} | Elektrikliyiz`,
    description: `${vehicle.brand} ${vehicle.model} hakkında teknik özellikler, performans verileri, fiyat bilgisi ve daha fazlasını keşfedin.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    openGraph: {
      images: vehicle.images && vehicle.images.length > 0 
        ? [{ url: vehicle.images[0] }] 
        : [{ url: '/images/car-placeholder.jpg' }],
    },
  };
}

// Sunucu taraflı veri çekme (SSR)
async function getVehicleData(id: string): Promise<ElectricVehicle | null> {
  try {
    const vehicles = await fetchVehicles();
    
    // 1. Sayısal ID kontrolü (geriye uyumluluk için)
    if (/^\d+$/.test(id)) {
      const vehicle = vehicles.find((v) => v.id === id);
      if (vehicle) return vehicle;
    }
    
    // 2. Gelen ID parametresini normalize et
    const normalizedId = toSlug(id);
    
    // 3. Slug eşleşme kontrolü
    let matchedVehicle = vehicles.find((v) => {
      // Araç için slug oluştur
      const vehicleSlug = toSlug(`${v.brand}-${v.model}`);
      // Eşleşme kontrolü
      return vehicleSlug === normalizedId;
    });
    
    // 4. Özel durumlar için kontrol
    if (!matchedVehicle) {
      // Volkswagen ID.4 gibi özel durumlar için
      if (normalizedId === 'volkswagen-id4' || normalizedId.includes('id4')) {
        matchedVehicle = vehicles.find((v) => 
          v.brand.toLowerCase() === 'volkswagen' && v.model.toLowerCase().includes('id.4')
        );
      }
      // BMW i4 eDrive 40 gibi özel durumlar için
      else if (normalizedId.includes('bmw-i4')) {
        matchedVehicle = vehicles.find((v) => 
          v.brand.toLowerCase() === 'bmw' && v.model.toLowerCase().includes('i4')
        );
      }
    }
    
    return matchedVehicle || null;
  } catch (error) {
    console.error('Araç bilgisi alınırken hata oluştu:', error);
    return null;
  }
}

// Ana sayfa bileşeni
export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleData(params.id);
  
  // Eğer araç bulunamazsa 404 sayfasına yönlendir
  if (!vehicle) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-white">
      <VehicleClientContent initialVehicle={vehicle} />
    </div>
  );
} 