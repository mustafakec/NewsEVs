import { supabase } from '../lib/supabase';
import { getCompleteVehicleData, getLatestVehiclesFromSheet } from '../lib/google-sheets';

export interface SyncResult {
  success: boolean;
  message: string;
  addedCount: number;
  updatedCount: number;
  errors: string[];
}

// Yardımcı fonksiyon: Upsert (insert or update) for sub-tables
async function upsertSubTable(table: string, vehicle_id: string, data: any, errors: string[]) {
  if (!data || Object.keys(data).length === 0) return;
  try {
    // Boş string olan alanları null'a çevir
    const filteredData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value === "") {
        // Eğer alan timestamp ise null yap, diğerlerini de null yap
        filteredData[key] = null;
      } else {
        filteredData[key] = value;
      }
    });
    // Her tabloda vehicle_id foreign key olarak var
    const { error } = await supabase
      .from(table)
      .upsert({ vehicle_id, ...filteredData }, { onConflict: 'vehicle_id' });
    if (error) {
      errors.push(`${table} tablosuna eklenirken hata (${vehicle_id}): ${error.message}`);
    }
  } catch (err: any) {
    errors.push(`${table} tablosuna eklenirken hata (${vehicle_id}): ${err.message}`);
  }
}

// Images tablosu için özel fonksiyon - her resim için ayrı satır
async function upsertImages(vehicle_id: string, images: string[], errors: string[]) {
  if (!images || images.length === 0) return;
  
  try {
    // Önce bu araç için mevcut resimleri sil
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('vehicle_id', vehicle_id);
    
    if (deleteError) {
      errors.push(`Images silinirken hata (${vehicle_id}): ${deleteError.message}`);
      return;
    }
    
    // Her resim için yeni satır ekle
    const imageRows = images.map(url => ({
      vehicle_id,
      url: url.trim()
    }));
    
    const { error: insertError } = await supabase
      .from('images')
      .insert(imageRows);
    
    if (insertError) {
      errors.push(`Images eklenirken hata (${vehicle_id}): ${insertError.message}`);
    }
  } catch (err: any) {
    errors.push(`Images işlenirken hata (${vehicle_id}): ${err.message}`);
  }
}

// Features tablosu için özel fonksiyon - her özellik için ayrı satır
async function upsertFeatures(vehicle_id: string, features: string[], extraFeatures: string[], errors: string[]) {
  if ((!features || features.length === 0) && (!extraFeatures || extraFeatures.length === 0)) return;
  
  try {
    // Önce bu araç için mevcut özellikleri sil
    const { error: deleteError } = await supabase
      .from('features')
      .delete()
      .eq('vehicle_id', vehicle_id);
    
    if (deleteError) {
      errors.push(`Features silinirken hata (${vehicle_id}): ${deleteError.message}`);
      return;
    }
    
    // Normal özellikler
    const normalFeatures = features?.map(name => ({
      vehicle_id,
      name: name.trim(),
      is_extra: false
    })) || [];
    
    // Ekstra özellikler
    const extraFeatureRows = extraFeatures?.map(name => ({
      vehicle_id,
      name: name.trim(),
      is_extra: true
    })) || [];
    
    // Tüm özellikleri birleştir
    const allFeatures = [...normalFeatures, ...extraFeatureRows];
    
    if (allFeatures.length > 0) {
      const { error: insertError } = await supabase
        .from('features')
        .insert(allFeatures);
      
      if (insertError) {
        errors.push(`Features eklenirken hata (${vehicle_id}): ${insertError.message}`);
      }
    }
  } catch (err: any) {
    errors.push(`Features işlenirken hata (${vehicle_id}): ${err.message}`);
  }
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
    const sheetData = await getCompleteVehicleData();
    const { vehicles, chargingTimes, performances, dimensions, efficiencies, comforts, features, prices, turkeyStatuses, images, environmentalImpacts, warranties } = sheetData;
    
    if (vehicles.length === 0) {
      result.message = 'Google Sheets\'te veri bulunamadı';
      return result;
    }

    console.log(`📊 ${vehicles.length} araç verisi işleniyor...`);

    // Supabase'deki mevcut araçları çek
    const { data: existingVehicles, error: fetchError } = await supabase
      .from('electric_vehicles')
      .select('id');

    if (fetchError) {
      result.errors.push(`Mevcut araçlar çekilirken hata: ${fetchError.message}`);
      return result;
    }

    const existingVehicleIds = new Set(existingVehicles?.map(v => v.id) || []);

    for (const vehicle of vehicles) {
      try {
        if (!vehicle.id || !vehicle.brand || !vehicle.model) {
          result.errors.push(`Geçersiz araç verisi: ${JSON.stringify(vehicle)}`);
          continue;
        }

        // Ana tabloya ekle/güncelle
        const vehicleData = {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year || 2024,
          type: vehicle.type || 'Sedan',
          range: vehicle.range || 0,
          battery_capacity: vehicle.battery_capacity || 0,
          heat_pump: vehicle.heat_pump || 'no',
          v2l: vehicle.v2l || 'no',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (existingVehicleIds.has(vehicle.id)) {
          // Mevcut aracı güncelle
          const { error: updateError } = await supabase
            .from('electric_vehicles')
            .update({ ...vehicleData, updated_at: new Date().toISOString() })
            .eq('id', vehicle.id);
          if (updateError) {
            result.errors.push(`Araç güncellenirken hata (${vehicle.id}): ${updateError.message}`);
          } else {
            result.updatedCount++;
          }
        } else {
          // Yeni araç ekle
          const { error: insertError } = await supabase
            .from('electric_vehicles')
            .insert({ id: vehicle.id, ...vehicleData });
          if (insertError) {
            result.errors.push(`Araç eklenirken hata (${vehicle.id}): ${insertError.message}`);
          } else {
            result.addedCount++;
          }
        }

        // Alt tablolara ekle/güncelle
        await upsertSubTable('charging_times', vehicle.id, chargingTimes[vehicle.id], result.errors);
        await upsertSubTable('performances', vehicle.id, performances[vehicle.id], result.errors);
        await upsertSubTable('dimensions', vehicle.id, dimensions[vehicle.id], result.errors);
        await upsertSubTable('efficiencies', vehicle.id, efficiencies[vehicle.id], result.errors);
        await upsertSubTable('comforts', vehicle.id, comforts[vehicle.id], result.errors);
        await upsertSubTable('prices', vehicle.id, prices[vehicle.id], result.errors);
        await upsertSubTable('warranties', vehicle.id, warranties[vehicle.id], result.errors);
        await upsertSubTable('turkey_statuses', vehicle.id, turkeyStatuses[vehicle.id], result.errors);
        await upsertSubTable('environmental_impacts', vehicle.id, environmentalImpacts[vehicle.id], result.errors);
        
        // images ve features için özel işleme
        if (images[vehicle.id]?.images && Array.isArray(images[vehicle.id].images)) {
          await upsertImages(vehicle.id, images[vehicle.id].images, result.errors);
        }
        if (features[vehicle.id]?.features && Array.isArray(features[vehicle.id].features)) {
          await upsertFeatures(vehicle.id, features[vehicle.id].features, features[vehicle.id].extra_features || [], result.errors);
        }
      } catch (error) {
        result.errors.push(`Araç işlenirken hata (${vehicle.id}): ${error}`);
      }
    }

    result.success = true;
    result.message = `${result.addedCount} yeni araç eklendi, ${result.updatedCount} araç güncellendi (tüm alt tablolar dahil)`;
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
    const sheetData = await getLatestVehiclesFromSheet();
    const { vehicles, chargingTimes, performances, dimensions, efficiencies, comforts, features, prices, turkeyStatuses, images, environmentalImpacts, warranties } = sheetData;
    
    if (vehicles.length === 0) {
      result.message = 'Google Sheets\'te yeni veri bulunamadı';
      return result;
    }

    console.log(`📊 ${vehicles.length} araç verisi kontrol ediliyor...`);

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
    for (const vehicle of vehicles) {
      try {
        if (!vehicle.id || !vehicle.brand || !vehicle.model) {
          result.errors.push(`Geçersiz araç verisi: ${JSON.stringify(vehicle)}`);
          continue;
        }

        // Sadece yeni araçları ekle
        if (!existingVehicleIds.has(vehicle.id)) {
          const vehicleData = {
            id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year || 2024,
          type: vehicle.type || 'Sedan',
          range: vehicle.range || 0,
          battery_capacity: vehicle.battery_capacity || 0,
          heat_pump: vehicle.heat_pump || 'no',
          v2l: vehicle.v2l || 'no',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('electric_vehicles')
            .insert(vehicleData);

        if (insertError) {
          result.errors.push(`Araç eklenirken hata (${vehicle.id}): ${insertError.message}`);
        } else {
          result.addedCount++;
          console.log(`➕ ${vehicle.brand} ${vehicle.model} eklendi`);
          }

          // Alt tablolara ekle
          await upsertSubTable('charging_times', vehicle.id, chargingTimes[vehicle.id], result.errors);
          await upsertSubTable('performances', vehicle.id, performances[vehicle.id], result.errors);
          await upsertSubTable('dimensions', vehicle.id, dimensions[vehicle.id], result.errors);
          await upsertSubTable('efficiencies', vehicle.id, efficiencies[vehicle.id], result.errors);
          await upsertSubTable('comforts', vehicle.id, comforts[vehicle.id], result.errors);
          await upsertSubTable('prices', vehicle.id, prices[vehicle.id], result.errors);
          await upsertSubTable('warranties', vehicle.id, warranties[vehicle.id], result.errors);
          await upsertSubTable('turkey_statuses', vehicle.id, turkeyStatuses[vehicle.id], result.errors);
          await upsertSubTable('environmental_impacts', vehicle.id, environmentalImpacts[vehicle.id], result.errors);
          
          // images ve features için özel işleme
          if (images[vehicle.id]?.images && Array.isArray(images[vehicle.id].images)) {
            await upsertImages(vehicle.id, images[vehicle.id].images, result.errors);
          }
          if (features[vehicle.id]?.features && Array.isArray(features[vehicle.id].features)) {
            await upsertFeatures(vehicle.id, features[vehicle.id].features, features[vehicle.id].extra_features || [], result.errors);
          }
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
    console.error('❌ Senkronizasyon hatası:', error);
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
    const sheetData = await getCompleteVehicleData();
    const { vehicles, chargingTimes, performances, dimensions, efficiencies, comforts, features, prices, turkeyStatuses, images, environmentalImpacts, warranties } = sheetData;
    
    console.log(`📊 Google Sheets'ten ${vehicles.length} araç çekildi`);
    
    // Belirli ID'ye sahip aracı bul
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    
    if (!targetVehicle) {
      console.log(`❌ ID ${vehicleId} ile araç Google Sheets'te bulunamadı`);
      console.log('📋 Mevcut araç ID\'leri:', vehicles.map(v => v.id).slice(0, 10));
      result.message = `ID ${vehicleId} ile araç Google Sheets'te bulunamadı. Mevcut ID'ler: ${vehicles.map(v => v.id).slice(0, 5).join(', ')}...`;
      return result;
    }

    console.log(`✅ Araç bulundu: ${targetVehicle.brand} ${targetVehicle.model}`);

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

    // Sadece veritabanında mevcut olan sütunları kullan
    const vehicleData = {
      brand: targetVehicle.brand,
      model: targetVehicle.model,
      year: targetVehicle.year || 2024,
      type: targetVehicle.type || 'Sedan',
      range: targetVehicle.range || 0,
      battery_capacity: targetVehicle.battery_capacity || 0,
      heat_pump: targetVehicle.heat_pump || 'no',
      v2l: targetVehicle.v2l || 'no',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingVehicle) {
      console.log(`🔄 Mevcut araç güncelleniyor: ${vehicleId}`);
      // Mevcut aracı güncelle
      const { error: updateError } = await supabase
        .from('electric_vehicles')
        .update({
          ...vehicleData,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId);

      if (updateError) {
        console.error(`❌ Araç güncellenirken hata: ${updateError.message}`);
        result.errors.push(`Araç güncellenirken hata: ${updateError.message}`);
      } else {
        result.updatedCount = 1;
        result.success = true;
        result.message = 'Araç başarıyla güncellendi';
        console.log(`✅ ${targetVehicle.brand} ${targetVehicle.model} güncellendi`);
      }
    } else {
      console.log(`➕ Yeni araç ekleniyor: ${vehicleId}`);
      // Yeni araç ekle
      const { error: insertError } = await supabase
        .from('electric_vehicles')
        .insert({
          id: vehicleId,
          ...vehicleData
        });

      if (insertError) {
        console.error(`❌ Araç eklenirken hata: ${insertError.message}`);
        result.errors.push(`Araç eklenirken hata: ${insertError.message}`);
      } else {
        result.addedCount = 1;
        result.success = true;
        result.message = 'Araç başarıyla eklendi';
        console.log(`➕ ${targetVehicle.brand} ${targetVehicle.model} eklendi`);
      }
    }

    // Alt tablolara ekle/güncelle
    await upsertSubTable('charging_times', vehicleId, chargingTimes[vehicleId], result.errors);
    await upsertSubTable('performances', vehicleId, performances[vehicleId], result.errors);
    await upsertSubTable('dimensions', vehicleId, dimensions[vehicleId], result.errors);
    await upsertSubTable('efficiencies', vehicleId, efficiencies[vehicleId], result.errors);
    await upsertSubTable('comforts', vehicleId, comforts[vehicleId], result.errors);
    await upsertSubTable('prices', vehicleId, prices[vehicleId], result.errors);
    await upsertSubTable('warranties', vehicleId, warranties[vehicleId], result.errors);
    await upsertSubTable('turkey_statuses', vehicleId, turkeyStatuses[vehicleId], result.errors);
    await upsertSubTable('environmental_impacts', vehicleId, environmentalImpacts[vehicleId], result.errors);
    
    // images ve features için özel işleme
    if (Array.isArray(images[vehicleId]) && images[vehicleId].length > 0) {
      // Her image objesinde url varsa, url'leri diziye çevir
      const imageUrls = images[vehicleId].map((img: any) => img.url).filter(Boolean);
      await upsertImages(vehicleId, imageUrls, result.errors);
    }
    if (Array.isArray(features[vehicleId]) && features[vehicleId].length > 0) {
      // Özellikleri is_extra'ya göre ayır
      const normalFeatures = features[vehicleId].filter((f: any) => f.is_extra !== 'true').map((f: any) => f.name).filter(Boolean);
      const extraFeatures = features[vehicleId].filter((f: any) => f.is_extra === 'true').map((f: any) => f.name).filter(Boolean);
      await upsertFeatures(vehicleId, normalFeatures, extraFeatures, result.errors);
    }

  } catch (error) {
    console.error('❌ Araç senkronizasyon hatası:', error);
    result.errors.push(`Araç senkronizasyon hatası: ${error}`);
  }

  return result;
}; 