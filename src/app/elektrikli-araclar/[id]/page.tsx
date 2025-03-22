import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { fetchVehicles } from '@/hooks/useVehicles';
import VehicleClientContent from '@/components/VehicleClientContent';
import type ElectricVehicle from '@/models/ElectricVehicle';

// Statik parametre oluşturma (SSG için)
export async function generateStaticParams() {
  const vehicles = await fetchVehicles();
  
  return vehicles.map((vehicle) => ({
    id: vehicle.id,
  }));
}

// Dinamik meta verileri oluştur
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ana metadata'yı yükle
  const parentMetadata = await parent;
  
  // Tüm araçları getir
  const vehicles = await fetchVehicles();
  
  // ID'ye göre aracı bul
  const vehicle = vehicles.find((v) => v.id === params.id);
  
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
    openGraph: {
      images: vehicle.images && vehicle.images.length > 0 ? [vehicle.images[0]] : ['/images/placeholder-car.jpg'],
    },
  };
}

// Sunucu taraflı veri çekme (SSR)
async function getVehicleData(id: string): Promise<ElectricVehicle | null> {
  try {
    const vehicles = await fetchVehicles();
    const vehicle = vehicles.find((v) => v.id === id);
    return vehicle || null;
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