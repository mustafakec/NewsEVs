import { NextRequest, NextResponse } from 'next/server';
import { syncAllVehiclesFromSheet, syncLatestVehiclesFromSheet, syncVehicleById } from '../../../services/sheetSyncService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, vehicleId } = body;

    let result;

    switch (action) {
      case 'sync-all':
        result = await syncAllVehiclesFromSheet();
        break;
      
      case 'sync-latest':
        result = await syncLatestVehiclesFromSheet();
        break;
      
      case 'sync-vehicle':
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'vehicleId parametresi gerekli' },
            { status: 400 }
          );
        }
        result = await syncVehicleById(vehicleId);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Geçersiz action. Kullanılabilir: sync-all, sync-latest, sync-vehicle' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          addedCount: result.addedCount,
          updatedCount: result.updatedCount,
          errors: result.errors
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        errors: result.errors
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Senkronizasyon API hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // GET isteği ile sadece son eklenen araçları senkronize et
    const result = await syncLatestVehiclesFromSheet();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          addedCount: result.addedCount,
          updatedCount: result.updatedCount,
          errors: result.errors
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        errors: result.errors
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Senkronizasyon API hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
} 