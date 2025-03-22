import { NextResponse } from 'next/server';
import vehiclesData from '@/data/vehicles.json';
import type ElectricVehicle from '@/models/ElectricVehicle';

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log('API çağrısı:', id);
    
    // Tüm araçları al
    const vehicles = vehiclesData as ElectricVehicle[];
    
    // Gelen ID parametresini normalize et
    const normalizedId = toSlug(id);
    
    // 1. Sayısal ID kontrolü (geriye uyumluluk için)
    if (/^\d+$/.test(id)) {
      const vehicle = vehicles.find((v: ElectricVehicle) => v.id === id);
      
      if (vehicle) {
        return NextResponse.json(vehicle);
      }
    }
    
    // 2. Slug eşleşme kontrolü
    let matchedVehicle = vehicles.find((v: ElectricVehicle) => {
      // Araç için slug oluştur
      const vehicleSlug = toSlug(`${v.brand}-${v.model}`);
      
      // Eşleşme kontrolü
      return vehicleSlug === normalizedId;
    });
    
    // 3. Volkswagen ID.4 gibi özel durumlar için ek kontrol
    if (!matchedVehicle && (normalizedId === 'volkswagen-id4' || normalizedId.includes('id4'))) {
      matchedVehicle = vehicles.find((v: ElectricVehicle) => 
        v.brand.toLowerCase() === 'volkswagen' && v.model.toLowerCase().includes('id.4')
      );
    }
    
    // 4. BMW i4 eDrive 40 gibi özel durumlar
    if (!matchedVehicle && normalizedId.includes('bmw-i4')) {
      if (normalizedId.includes('edrive') || normalizedId.includes('edrive40')) {
        matchedVehicle = vehicles.find((v: ElectricVehicle) => 
          v.brand.toLowerCase() === 'bmw' && v.model.toLowerCase().includes('i4')
        );
      }
    }
    
    if (!matchedVehicle) {
      console.error('API: Araç bulunamadı, ID/slug:', id);
      return NextResponse.json(
        { error: 'Araç bulunamadı.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(matchedVehicle);
  } catch (error) {
    console.error('Araç detay API hatası:', error);
    return NextResponse.json(
      { error: 'Araç bilgileri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 