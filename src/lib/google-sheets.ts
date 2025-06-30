import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets API yapılandırması
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Google Service Account bilgileri
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'supabase-sync@sheet-sb-464214.iam.gserviceaccount.com';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Sheet ID'leri
const SHEET_IDS = {
  electric_vehicles: '1S-uScup7RnP0U5KYqVXtyy3I4Kpp4XrhxrpJOM_AD8I',
  charging_times: '1csLVfoSM2GLq_8uXFQdRuDJQccXHdoRmwKIUxm4iOSQ',
  performances: '18z9sGvc-UyGA7leQo4VtpLD-gMC1v1ZZIN-mfdn4A4A',
  dimensions: '1_4tVPtVcjsx5cnHli7w_xaeLqgDJ8CS1OonJOJ-Scd4',
  efficiencies: '1Pkpmp4R0PncKkM-m6RGAoT4CzQSaVWNR1PV2c1dExKg',
  comforts: '12uljuqeCpG8QTWXsiSILlnq_5MHu4He20hCx5-WJFYE',
  features: '1D2_-KSv9Gy7u-_99D57I_KG2KILWEXKHG2rqlNjxqFk',
  prices: '1P9bLuVXS8xMtq0VJfwp8EsklTEeZVBJeu8skoIZY4UE',
  turkey_statutes: '1sKjfaCHsa75SSkSChFFzmpa2dfF8oTQu021KCH23VoE',
  images: '12pcSBV6cKon0ciTL4yKINHSHw8xav8OO0XMY3kWhUyA',
  environmental_impacts: '16wmYF-VOCGmU3ckwaKsT9LvwoZ3T_2ScjiNhW2gKomc',
  warranties: '1obFECRDBwYxalbuB8cuHXZtk_gVBSE2yBWuzxdWGTVA'
};

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  console.error('Google Sheets API yapılandırma değişkenleri eksik');
}

// JWT istemcisi oluştur
const auth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: SCOPES,
});

// Google Sheets API istemcisi
const sheets = google.sheets({ version: 'v4', auth });

// Google Sheets'ten veri çekme fonksiyonu
export const getSheetData = async (sheetId: string, range: string = 'A:Z') => {
  try {
    console.log(`🔍 Google Sheets'ten veri çekiliyor: ${sheetId}`);
    console.log(`📊 Range: ${range}`);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    console.log(`✅ Veri çekildi: ${response.data.values?.length || 0} satır`);
    
    if (response.data.values && response.data.values.length > 0) {
      console.log(`📝 İlk satır (başlıklar): ${response.data.values[0].join(', ')}`);
    }

    return response.data.values;
  } catch (error: any) {
    console.error(`❌ Google Sheets veri çekme hatası (${sheetId}):`, error.message);
    if (error.code) {
      console.error(`🔍 Hata kodu: ${error.code}`);
    }
    if (error.status) {
      console.error(`🔍 HTTP durumu: ${error.status}`);
    }
    throw error;
  }
};

// Ana elektrikli araç verilerini çek
export const getElectricVehiclesFromSheet = async () => {
  try {
    console.log('📊 Ana araç verileri çekiliyor...');
    
    const data = await getSheetData(SHEET_IDS.electric_vehicles);
    
    if (!data || data.length < 2) {
      console.log('❌ Google Sheets\'te veri bulunamadı veya yetersiz');
      return [];
    }

    console.log(`📋 ${data.length} satır veri bulundu`);

    const headers = data[0];
    const rows = data.slice(1);

    console.log('📝 Başlıklar:', headers);

    const vehicles = rows.map((row, index) => {
      const vehicle: any = {};
      
      headers.forEach((header: string, colIndex: number) => {
        const value = row[colIndex] || '';
        
        switch (header.toLowerCase()) {
          case 'id':
          case 'vehicle_id':
            vehicle.id = value;
            break;
          case 'brand':
          case 'marka':
            vehicle.brand = value;
            break;
          case 'model':
            vehicle.model = value;
            break;
          case 'year':
          case 'yıl':
            vehicle.year = parseInt(value) || 2024;
            break;
          case 'type':
          case 'tip':
            vehicle.type = value;
            break;
          case 'range':
          case 'menzil':
            vehicle.range = parseInt(value) || 0;
            break;
          case 'battery_capacity':
          case 'batarya_kapasitesi':
            vehicle.battery_capacity = parseInt(value) || 0;
            break;
          case 'heat_pump':
          case 'ısı_pompası':
            vehicle.heat_pump = value.toLowerCase() as 'yes' | 'no' | 'optional';
            break;
          case 'v2l':
            vehicle.v2l = value.toLowerCase() as 'yes' | 'no' | 'optional';
            break;
          default:
            try {
              if (value && (value.startsWith('{') || value.startsWith('['))) {
                vehicle[header.toLowerCase()] = JSON.parse(value);
              } else {
                vehicle[header.toLowerCase()] = value;
              }
            } catch {
              vehicle[header.toLowerCase()] = value;
            }
        }
      });

      return vehicle;
    });

    // Geçerli araçları filtrele (ID, brand ve model olanlar)
    const validVehicles = vehicles.filter(v => v.id && v.brand && v.model);
    
    console.log(`✅ ${validVehicles.length} geçerli araç bulundu`);
    
    if (validVehicles.length === 0) {
      console.log('⚠️ Hiç geçerli araç bulunamadı. İlk birkaç araç:');
      vehicles.slice(0, 3).forEach((v, i) => {
        console.log(`  ${i + 1}. ID: ${v.id}, Brand: ${v.brand}, Model: ${v.model}`);
      });
    }

    return validVehicles;
  } catch (error) {
    console.error('❌ Elektrikli araç verilerini çekerken hata:', error);
    return [];
  }
};

// Şarj süreleri verilerini çek
export const getChargingTimesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.charging_times);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const chargingTimes: any = {};

    rows.forEach((row) => {
      // İlk sütun araç ID'si olabilir (id veya vehicle_id)
      const vehicleId = row[0]; // İlk sütun araç ID'si
      if (!vehicleId) return;

      const chargingData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            chargingData[header.toLowerCase()] = JSON.parse(value);
          } else {
            chargingData[header.toLowerCase()] = value;
          }
        } catch {
          chargingData[header.toLowerCase()] = value;
        }
      });

      chargingTimes[vehicleId] = chargingData;
    });

    return chargingTimes;
  } catch (error) {
    console.error('Şarj süreleri verilerini çekerken hata:', error);
    return {};
  }
};

// Performans verilerini çek
export const getPerformancesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.performances);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const performances: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const performanceData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            performanceData[header.toLowerCase()] = JSON.parse(value);
          } else {
            performanceData[header.toLowerCase()] = value;
          }
        } catch {
          performanceData[header.toLowerCase()] = value;
        }
      });

      performances[vehicleId] = performanceData;
    });

    return performances;
  } catch (error) {
    console.error('Performans verilerini çekerken hata:', error);
    return {};
  }
};

// Boyut verilerini çek
export const getDimensionsFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.dimensions);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const dimensions: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const dimensionData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            dimensionData[header.toLowerCase()] = JSON.parse(value);
          } else {
            dimensionData[header.toLowerCase()] = value;
          }
        } catch {
          dimensionData[header.toLowerCase()] = value;
        }
      });

      dimensions[vehicleId] = dimensionData;
    });

    return dimensions;
  } catch (error) {
    console.error('Boyut verilerini çekerken hata:', error);
    return {};
  }
};

// Verimlilik verilerini çek
export const getEfficienciesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.efficiencies);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const efficiencies: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const efficiencyData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            efficiencyData[header.toLowerCase()] = JSON.parse(value);
          } else {
            efficiencyData[header.toLowerCase()] = value;
          }
        } catch {
          efficiencyData[header.toLowerCase()] = value;
        }
      });

      efficiencies[vehicleId] = efficiencyData;
    });

    return efficiencies;
  } catch (error) {
    console.error('Verimlilik verilerini çekerken hata:', error);
    return {};
  }
};

// Konfor verilerini çek
export const getComfortsFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.comforts);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const comforts: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const comfortData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            comfortData[header.toLowerCase()] = JSON.parse(value);
          } else {
            comfortData[header.toLowerCase()] = value;
          }
        } catch {
          comfortData[header.toLowerCase()] = value;
        }
      });

      comforts[vehicleId] = comfortData;
    });

    return comforts;
  } catch (error) {
    console.error('Konfor verilerini çekerken hata:', error);
    return {};
  }
};

// Özellikler verilerini çek
export const getFeaturesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.features);
    if (!data || data.length < 2) {
      return {};
    }
    const headers = data[0];
    const rows = data.slice(1);
    const features: any = {};
    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;
      const featureObj: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        featureObj[header.toLowerCase()] = value;
      });
      if (!features[vehicleId]) features[vehicleId] = [];
      features[vehicleId].push(featureObj);
    });
    return features;
  } catch (error) {
    console.error('Özellikler verilerini çekerken hata:', error);
    return {};
  }
};

// Fiyat verilerini çek
export const getPricesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.prices);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const prices: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const priceData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            priceData[header.toLowerCase()] = JSON.parse(value);
          } else {
            priceData[header.toLowerCase()] = value;
          }
        } catch {
          priceData[header.toLowerCase()] = value;
        }
      });

      prices[vehicleId] = priceData;
    });

    return prices;
  } catch (error) {
    console.error('Fiyat verilerini çekerken hata:', error);
    return {};
  }
};

// Türkiye durumu verilerini çek
export const getTurkeyStatusesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.turkey_statutes);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const turkeyStatuses: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const statusData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            statusData[header.toLowerCase()] = JSON.parse(value);
          } else {
            statusData[header.toLowerCase()] = value;
          }
        } catch {
          statusData[header.toLowerCase()] = value;
        }
      });

      turkeyStatuses[vehicleId] = statusData;
    });

    return turkeyStatuses;
  } catch (error) {
    console.error('Türkiye durumu verilerini çekerken hata:', error);
    return {};
  }
};

// Görsel verilerini çek
export const getImagesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.images);
    if (!data || data.length < 2) {
      return {};
    }
    const headers = data[0];
    const rows = data.slice(1);
    const images: any = {};
    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;
      const imageObj: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        imageObj[header.toLowerCase()] = value;
      });
      if (!images[vehicleId]) images[vehicleId] = [];
      images[vehicleId].push(imageObj);
    });
    return images;
  } catch (error) {
    console.error('Görsel verilerini çekerken hata:', error);
    return {};
  }
};

// Çevresel etki verilerini çek
export const getEnvironmentalImpactsFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.environmental_impacts);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const environmentalImpacts: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const impactData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            impactData[header.toLowerCase()] = JSON.parse(value);
          } else {
            impactData[header.toLowerCase()] = value;
          }
        } catch {
          impactData[header.toLowerCase()] = value;
        }
      });

      environmentalImpacts[vehicleId] = impactData;
    });

    return environmentalImpacts;
  } catch (error) {
    console.error('Çevresel etki verilerini çekerken hata:', error);
    return {};
  }
};

// Garanti verilerini çek
export const getWarrantiesFromSheet = async () => {
  try {
    const data = await getSheetData(SHEET_IDS.warranties);
    
    if (!data || data.length < 2) {
      return {};
    }

    const headers = data[0];
    const rows = data.slice(1);
    const warranties: any = {};

    rows.forEach((row) => {
      const vehicleId = row[0];
      if (!vehicleId) return;

      const warrantyData: any = {};
      headers.slice(1).forEach((header: string, colIndex: number) => {
        const value = row[colIndex + 1] || '';
        
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            warrantyData[header.toLowerCase()] = JSON.parse(value);
          } else {
            warrantyData[header.toLowerCase()] = value;
          }
        } catch {
          warrantyData[header.toLowerCase()] = value;
        }
      });

      warranties[vehicleId] = warrantyData;
    });

    return warranties;
  } catch (error) {
    console.error('Garanti verilerini çekerken hata:', error);
    return {};
  }
};

// Tüm verileri çek ve ayrı ayrı döndür
export const getCompleteVehicleData = async () => {
  try {
    console.log('🔄 Tüm Google Sheets verilerini çekiliyor...');
    
    const [
      vehicles,
      chargingTimes,
      performances,
      dimensions,
      efficiencies,
      comforts,
      features,
      prices,
      turkeyStatuses,
      images,
      environmentalImpacts,
      warranties
    ] = await Promise.all([
      getElectricVehiclesFromSheet(),
      getChargingTimesFromSheet(),
      getPerformancesFromSheet(),
      getDimensionsFromSheet(),
      getEfficienciesFromSheet(),
      getComfortsFromSheet(),
      getFeaturesFromSheet(),
      getPricesFromSheet(),
      getTurkeyStatusesFromSheet(),
      getImagesFromSheet(),
      getEnvironmentalImpactsFromSheet(),
      getWarrantiesFromSheet()
    ]);

    console.log(`✅ ${vehicles.length} araç verisi çekildi`);

    // Ana araç verilerini döndür, alt tablo verilerini ayrı ayrı tut
    return {
      vehicles,
      chargingTimes,
      performances,
      dimensions,
      efficiencies,
      comforts,
      features,
      prices,
      turkeyStatuses,
      images,
      environmentalImpacts,
      warranties
    };
  } catch (error) {
    console.error('Tam araç verilerini çekerken hata:', error);
    return {
      vehicles: [],
      chargingTimes: {},
      performances: {},
      dimensions: {},
      efficiencies: {},
      comforts: {},
      features: {},
      prices: {},
      turkeyStatuses: {},
      images: {},
      environmentalImpacts: {},
      warranties: {}
    };
  }
};

// Son eklenen araçları kontrol etme (basitleştirilmiş)
export const getLatestVehiclesFromSheet = async (lastSyncTime?: string) => {
  try {
    console.log('🔍 Son eklenen araçlar kontrol ediliyor...');
    
    const vehicles = await getCompleteVehicleData();
    
    console.log(`✅ Toplam ${vehicles.vehicles.length} araç bulundu`);
    
    // Eğer son senkronizasyon zamanı varsa, sadece yeni eklenenleri filtrele
    if (lastSyncTime) {
      // Bu kısım gelecekte implement edilebilir
      // Şimdilik tüm verileri döndürüyoruz
      console.log('⚠️ Son senkronizasyon zamanı kontrolü henüz implement edilmedi');
    }
    
    // En az 1 araç varsa döndür
    if (vehicles.vehicles.length > 0) {
      console.log(`✅ ${vehicles.vehicles.length} araç işlenmeye hazır`);
      return vehicles;
    } else {
      console.log('❌ Hiç araç bulunamadı');
      return {
        vehicles: [],
        chargingTimes: {},
        performances: {},
        dimensions: {},
        efficiencies: {},
        comforts: {},
        features: {},
        prices: {},
        turkeyStatuses: {},
        images: {},
        environmentalImpacts: {},
        warranties: {}
      };
    }
  } catch (error) {
    console.error('❌ Son araçları çekerken hata:', error);
    return {
      vehicles: [],
      chargingTimes: {},
      performances: {},
      dimensions: {},
      efficiencies: {},
      comforts: {},
      features: {},
      prices: {},
      turkeyStatuses: {},
      images: {},
      environmentalImpacts: {},
      warranties: {}
    };
  }
}; 