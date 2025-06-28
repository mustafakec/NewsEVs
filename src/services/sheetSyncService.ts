import { supabase } from '../lib/supabase';
import { getCompleteVehicleData, getLatestVehiclesFromSheet } from '../lib/google-sheets';
import { SupabaseElectricVehicle } from '../lib/supabase';

export interface SyncResult {
  success: boolean;
  message: string;
  addedCount: number;
  updatedCount: number;
  errors: string[];
}

// Google Sheets'ten Supabase'e tam senkronizasyon
export const syncAllVehiclesFromSheet = async (): Promise<SyncResult> => {
  const result: SyncResult = {
    success: false,
    message: '',
    addedCount: 0,
    updatedCount: 0,
    errors: []
  };

  try {
    console.log('🔄 Tam senkronizasyon başlatılıyor...');
    
    // Google Sheets'ten tüm verileri çek (çoklu sheet)
    const sheetVehicles = await getCompleteVehicleData();
    
    if (sheetVehicles.length === 0) {
      result.message = 'Google Sheets\'te veri bulunamadı';
      return result;
    }

    console.log(`📊 ${sheetVehicles.length} araç verisi işleniyor...`);

    // Supabase'deki mevcut araçları çek
    const { data: existingVehicles, error: fetchError } = await supabase
      .from('electric_vehicles')
      .select('id, brand, model, year');

    if (fetchError) {
      result.errors.push(`Mevcut araçlar çekilirken hata: ${fetchError.message}`);
      return result;
    }

    const existingVehicleIds = new Set(existingVehicles?.map(v => v.id) || []);

    // Yeni araçları ekle, mevcut olanları güncelle
    for (const vehicle of sheetVehicles) {
      try {
        if (!vehicle.id || !vehicle.brand || !vehicle.model) {
          result.errors.push(`Geçersiz araç verisi: ${JSON.stringify(vehicle)}`);
          continue;
        }

        const vehicleData: Omit<SupabaseElectricVehicle, 'id'> = {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year || 2024,
          type: vehicle.type || 'Sedan',
          range: vehicle.range || 0,
          battery_capacity: vehicle.battery_capacity || 0,
          charging_time: vehicle.charging_time || {
            ac: 0,
            dc: 0,
            fastCharging: {
              power: 0,
              time10to80: 0
            },
            acTime: 0
          },
          performance: vehicle.performance || {
            acceleration: 0,
            topSpeed: 0,
            power: 0,
            torque: 0
          },
          dimensions: vehicle.dimensions || {
            length: 0,
            width: 0,
            height: 0,
            weight: 0
          },
          efficiency: vehicle.efficiency || {
            consumption: 0
          },
          comfort: vehicle.comfort || {},
          price: vehicle.price || {
            base: 0,
            currency: 'TRY'
          },
          images: vehicle.images || [],
          features: vehicle.features || [],
          extra_features: vehicle.extra_features || [],
          warranty: vehicle.warranty || {
            battery: 0,
            vehicle: 0
          },
          environmental_impact: vehicle.environmental_impact || {},
          heat_pump: vehicle.heat_pump || 'no',
          v2l: vehicle.v2l || 'no',
          turkey_status: vehicle.turkey_status || {
            available: false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (existingVehicleIds.has(vehicle.id)) {
          // Mevcut aracı güncelle
          const { error: updateError } = await supabase
            .from('electric_vehicles')
            .update({
              ...vehicleData,
              updated_at: new Date().toISOString()
            })
            .eq('id', vehicle.id);

          if (updateError) {
            result.errors.push(`Araç güncellenirken hata (${vehicle.id}): ${updateError.message}`);
          } else {
            result.updatedCount++;
            console.log(`✅ ${vehicle.brand} ${vehicle.model} güncellendi`);
          }
        } else {
          // Yeni araç ekle
          const { error: insertError } = await supabase
            .from('electric_vehicles')
            .insert({
              id: vehicle.id,
              ...vehicleData
            });

          if (insertError) {
            result.errors.push(`Araç eklenirken hata (${vehicle.id}): ${insertError.message}`);
          } else {
            result.addedCount++;
            console.log(`➕ ${vehicle.brand} ${vehicle.model} eklendi`);
          }
        }
      } catch (error) {
        result.errors.push(`Araç işlenirken hata (${vehicle.id}): ${error}`);
      }
    }

    result.success = true;
    result.message = `${result.addedCount} yeni araç eklendi, ${result.updatedCount} araç güncellendi`;

    console.log(`🎉 Senkronizasyon tamamlandı: ${result.message}`);

  } catch (error) {
    result.errors.push(`Genel senkronizasyon hatası: ${error}`);
    console.error('❌ Senkronizasyon hatası:', error);
  }

  return result;
};

// Sadece yeni eklenen araçları senkronize et
export const syncLatestVehiclesFromSheet = async (): Promise<SyncResult> => {
  const result: SyncResult = {
    success: false,
    message: '',
    addedCount: 0,
    updatedCount: 0,
    errors: []
  };

  try {
    console.log('⚡ Hızlı senkronizasyon başlatılıyor...');
    
    // Google Sheets'ten son verileri çek
    const sheetVehicles = await getLatestVehiclesFromSheet();
    
    if (sheetVehicles.length === 0) {
      result.message = 'Google Sheets\'te yeni veri bulunamadı';
      return result;
    }

    console.log(`📊 ${sheetVehicles.length} araç verisi kontrol ediliyor...`);

    // Supabase'deki mevcut araçları çek
    const { data: existingVehicles, error: fetchError } = await supabase
      .from('electric_vehicles')
      .select('id');

    if (fetchError) {
      result.errors.push(`Mevcut araçlar çekilirken hata: ${fetchError.message}`);
      return result;
    }

    const existingVehicleIds = new Set(existingVehicles?.map(v => v.id) || []);

    // Sadece yeni araçları ekle
    for (const vehicle of sheetVehicles) {
      try {
        if (!vehicle.id || !vehicle.brand || !vehicle.model) {
          result.errors.push(`Geçersiz araç verisi: ${JSON.stringify(vehicle)}`);
          continue;
        }

        // Eğer araç zaten varsa atla
        if (existingVehicleIds.has(vehicle.id)) {
          continue;
        }

        const vehicleData: Omit<SupabaseElectricVehicle, 'id'> = {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year || 2024,
          type: vehicle.type || 'Sedan',
          range: vehicle.range || 0,
          battery_capacity: vehicle.battery_capacity || 0,
          charging_time: vehicle.charging_time || {
            ac: 0,
            dc: 0,
            fastCharging: {
              power: 0,
              time10to80: 0
            },
            acTime: 0
          },
          performance: vehicle.performance || {
            acceleration: 0,
            topSpeed: 0,
            power: 0,
            torque: 0
          },
          dimensions: vehicle.dimensions || {
            length: 0,
            width: 0,
            height: 0,
            weight: 0
          },
          efficiency: vehicle.efficiency || {
            consumption: 0
          },
          comfort: vehicle.comfort || {},
          price: vehicle.price || {
            base: 0,
            currency: 'TRY'
          },
          images: vehicle.images || [],
          features: vehicle.features || [],
          extra_features: vehicle.extra_features || [],
          warranty: vehicle.warranty || {
            battery: 0,
            vehicle: 0
          },
          environmental_impact: vehicle.environmental_impact || {},
          heat_pump: vehicle.heat_pump || 'no',
          v2l: vehicle.v2l || 'no',
          turkey_status: vehicle.turkey_status || {
            available: false
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Yeni araç ekle
        const { error: insertError } = await supabase
          .from('electric_vehicles')
          .insert({
            id: vehicle.id,
            ...vehicleData
          });

        if (insertError) {
          result.errors.push(`Araç eklenirken hata (${vehicle.id}): ${insertError.message}`);
        } else {
          result.addedCount++;
          console.log(`➕ ${vehicle.brand} ${vehicle.model} eklendi`);
        }
      } catch (error) {
        result.errors.push(`Araç işlenirken hata (${vehicle.id}): ${error}`);
      }
    }

    result.success = true;
    result.message = `${result.addedCount} yeni araç eklendi`;

    console.log(`🎉 Hızlı senkronizasyon tamamlandı: ${result.message}`);

  } catch (error) {
    result.errors.push(`Genel senkronizasyon hatası: ${error}`);
    console.error('❌ Hızlı senkronizasyon hatası:', error);
  }

  return result;
};

// Belirli bir aracı ID'ye göre senkronize et
export const syncVehicleById = async (vehicleId: string): Promise<SyncResult> => {
  const result: SyncResult = {
    success: false,
    message: '',
    addedCount: 0,
    updatedCount: 0,
    errors: []
  };

  try {
    console.log(`🔍 Araç senkronizasyonu başlatılıyor: ${vehicleId}`);
    
    // Google Sheets'ten tüm verileri çek
    const sheetVehicles = await getCompleteVehicleData();
    
    // Belirli ID'ye sahip aracı bul
    const targetVehicle = sheetVehicles.find(v => v.id === vehicleId);
    
    if (!targetVehicle) {
      result.message = `ID ${vehicleId} ile araç Google Sheets'te bulunamadı`;
      return result;
    }

    // Supabase'de araç var mı kontrol et
    const { data: existingVehicle, error: fetchError } = await supabase
      .from('electric_vehicles')
      .select('id')
      .eq('id', vehicleId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found
      result.errors.push(`Araç kontrol edilirken hata: ${fetchError.message}`);
      return result;
    }

    const vehicleData: Omit<SupabaseElectricVehicle, 'id'> = {
      brand: targetVehicle.brand,
      model: targetVehicle.model,
      year: targetVehicle.year || 2024,
      type: targetVehicle.type || 'Sedan',
      range: targetVehicle.range || 0,
      battery_capacity: targetVehicle.battery_capacity || 0,
      charging_time: targetVehicle.charging_time || {
        ac: 0,
        dc: 0,
        fastCharging: {
          power: 0,
          time10to80: 0
        },
        acTime: 0
      },
      performance: targetVehicle.performance || {
        acceleration: 0,
        topSpeed: 0,
        power: 0,
        torque: 0
      },
      dimensions: targetVehicle.dimensions || {
        length: 0,
        width: 0,
        height: 0,
        weight: 0
      },
      efficiency: targetVehicle.efficiency || {
        consumption: 0
      },
      comfort: targetVehicle.comfort || {},
      price: targetVehicle.price || {
        base: 0,
        currency: 'TRY'
      },
      images: targetVehicle.images || [],
      features: targetVehicle.features || [],
      extra_features: targetVehicle.extra_features || [],
      warranty: targetVehicle.warranty || {
        battery: 0,
        vehicle: 0
      },
      environmental_impact: targetVehicle.environmental_impact || {},
      heat_pump: targetVehicle.heat_pump || 'no',
      v2l: targetVehicle.v2l || 'no',
      turkey_status: targetVehicle.turkey_status || {
        available: false
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingVehicle) {
      // Mevcut aracı güncelle
      const { error: updateError } = await supabase
        .from('electric_vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId);

      if (updateError) {
        result.errors.push(`Araç güncellenirken hata: ${updateError.message}`);
      } else {
        result.updatedCount = 1;
        result.success = true;
        result.message = 'Araç başarıyla güncellendi';
        console.log(`✅ ${targetVehicle.brand} ${targetVehicle.model} güncellendi`);
      }
    } else {
      // Yeni araç ekle
      const { error: insertError } = await supabase
        .from('electric_vehicles')
        .insert({
          id: vehicleId,
          ...vehicleData
        });

      if (insertError) {
        result.errors.push(`Araç eklenirken hata: ${insertError.message}`);
      } else {
        result.addedCount = 1;
        result.success = true;
        result.message = 'Araç başarıyla eklendi';
        console.log(`➕ ${targetVehicle.brand} ${targetVehicle.model} eklendi`);
      }
    }

  } catch (error) {
    result.errors.push(`Araç senkronizasyon hatası: ${error}`);
    console.error('❌ Araç senkronizasyon hatası:', error);
  }

  return result;
}; 