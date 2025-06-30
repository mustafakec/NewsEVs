import { NextRequest, NextResponse } from 'next/server';
import { syncAllVehiclesFromSheet, syncLatestVehiclesFromSheet, syncVehicleById } from '../../../services/sheetSyncService';
import { getCompleteVehicleData, getElectricVehiclesFromSheet } from '../../../lib/google-sheets';

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
      
      case 'debug-sheets':
        // Debug için Google Sheets verilerini kontrol et
        try {
          const vehicles = await getElectricVehiclesFromSheet();
          const completeData = await getCompleteVehicleData();
          
          // Belirli bir araç için detaylı debug - ev0211
          const sampleVehicleId = 'ev0211';
          const sampleImages = completeData.images[sampleVehicleId];
          const sampleFeatures = completeData.features[sampleVehicleId];
          
          // Tüm images ve features verilerini kontrol et
          const allImagesKeys = Object.keys(completeData.images);
          const allFeaturesKeys = Object.keys(completeData.features);
          const firstImagesData = allImagesKeys.length > 0 ? completeData.images[allImagesKeys[0]] : null;
          const firstFeaturesData = allFeaturesKeys.length > 0 ? completeData.features[allFeaturesKeys[0]] : null;
          
          // Images tablosunun yapısını daha detaylı kontrol et
          const sampleVehicleImages = completeData.images[sampleVehicleId];
          const imagesWithVehicleId = Object.entries(completeData.images).filter(([key, data]: [string, any]) => 
            data && data.vehicle_id && data.vehicle_id === sampleVehicleId
          );
          
          return NextResponse.json({
            success: true,
            message: 'Debug bilgileri - ev0211',
            data: {
              basicVehicles: vehicles.length,
              completeVehicles: completeData.vehicles.length,
              targetVehicle: vehicles.find(v => v.id === sampleVehicleId),
              allIds: vehicles.map(v => v.id),
              subTables: {
                chargingTimes: Object.keys(completeData.chargingTimes).length,
                performances: Object.keys(completeData.performances).length,
                dimensions: Object.keys(completeData.dimensions).length,
                efficiencies: Object.keys(completeData.efficiencies).length,
                comforts: Object.keys(completeData.comforts).length,
                features: Object.keys(completeData.features).length,
                prices: Object.keys(completeData.prices).length,
                turkeyStatuses: Object.keys(completeData.turkeyStatuses).length,
                images: Object.keys(completeData.images).length,
                environmentalImpacts: Object.keys(completeData.environmentalImpacts).length,
                warranties: Object.keys(completeData.warranties).length
              },
              ev0211Data: {
                vehicleId: sampleVehicleId,
                images: sampleImages,
                features: sampleFeatures,
                imagesKeys: sampleImages ? Object.keys(sampleImages) : [],
                featuresKeys: sampleFeatures ? Object.keys(sampleFeatures) : [],
                allImagesKeys: allImagesKeys.slice(0, 5),
                allFeaturesKeys: allFeaturesKeys.slice(0, 5),
                firstImagesData: firstImagesData,
                firstFeaturesData: firstFeaturesData,
                sampleVehicleImages: sampleVehicleImages,
                imagesWithVehicleId: imagesWithVehicleId.map(([key, data]) => ({ key, data }))
              }
            }
          });
        } catch (error: any) {
          return NextResponse.json({
            success: false,
            message: 'Debug hatası',
            error: error.message
          }, { status: 500 });
        }
      
      default:
        return NextResponse.json(
          { error: 'Geçersiz action. Kullanılabilir: sync-all, sync-latest, sync-vehicle, debug-sheets' },
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

  } catch (error: any) {
    console.error('Senkronizasyon API hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu', details: error.message },
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

  } catch (error: any) {
    console.error('Senkronizasyon API hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu', details: error.message },
      { status: 500 }
    );
  }
} 