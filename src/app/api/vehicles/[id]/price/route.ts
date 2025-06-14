import { NextResponse } from 'next/server';
import { ElectricVehicleService } from '@/services/ElectricVehicleService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vehicleId = await params.id;
    
    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Araç ID\'si gerekli' },
        { status: 400 }
      );
    }

    const price = await ElectricVehicleService.getVehiclePriceById(vehicleId);
    
    if (!price) {
      return NextResponse.json(
        { error: 'Fiyat bilgisi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(price);
  } catch (error) {
    console.error('Fiyat bilgisi alınırken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Fiyat bilgisi alınamadı' },
      { status: 500 }
    );
  }
} 