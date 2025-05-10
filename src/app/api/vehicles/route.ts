import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import vehiclesData from '@/data/electric-vehicles.json';

// API rotaları prerender yapılmayacak şekilde ayarlıyoruz
export const dynamic = 'force-dynamic';

// Tüm araçları getir
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Eğer spesifik bir ID isteniyorsa, sadece o aracı döndür
    if (id) {
      const vehicle = (vehiclesData as unknown as ElectricVehicle[]).find(v => v.id === id);

      if (!vehicle) {
        return NextResponse.json(
          { error: 'Araç bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json(vehicle);
    }

    // Tüm araçları döndür
    return NextResponse.json(vehiclesData);
  } catch (error) {
    console.error('Araçlar yüklenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 