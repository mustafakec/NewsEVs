interface ElectricVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string; // Araç tipi: Sedan, SUV, Hatchback, vb.
  range: number; // km cinsinden menzil
  batteryCapacity: number; // kWh cinsinden batarya kapasitesi
  chargingTime: {
    ac: number; // saat cinsinden AC şarj süresi
    dc: number; // saat cinsinden DC şarj süresi
    fastCharging: { // Hızlı şarj özellikleri
      power: number; // kW cinsinden maksimum şarj gücü
      time10to80: number; // 10%'dan 80%'e şarj süresi (dakika)
    };
  };
  
  performance: {
    acceleration: number; // 0-100 km/s hızlanma (saniye)
    topSpeed: number; // maksimum hız (km/s)
    power: number; // Beygir gücü (HP)
    torque: number; // Tork (Nm)
    driveType?: string; // Sürüş tipi: RWD, FWD, AWD
  };
  
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
    cargoCapacity?: number; // Bagaj hacmi (litre)
    groundClearance?: number; // Yerden yükseklik (mm)
  };
  
  efficiency: {
    consumption: number; // kWh/100km
    regenerativeBraking?: boolean; // Rejeneratif fren sistemi
    ecoMode?: boolean; // Ekonomi modu
    energyRecovery?: number; // Enerji geri kazanım oranı (%)
  };
  
  comfort: {
    seatingCapacity?: number;
    screens?: number; // Ekran sayısı
    soundSystem?: string;
    autonomousLevel?: number; // 0-5 arası otonom sürüş seviyesi
    parkAssist?: boolean;
    climateControl?: boolean; // Klima
    heatedSeats?: boolean; // Isıtmalı koltuklar
    navigation?: boolean; // Navigasyon
    parkingSensors?: boolean; // Park sensörleri
  };
  
  price: {
    base: number;
    currency: string;
    withOptions?: number; // Opsiyonlarla birlikte fiyat
    leasing?: { // Kiralama seçenekleri
      monthly: number;
      duration: number; // Ay cinsinden
      downPayment: number;
    };
  };
  
  images: string[];
  features: string[];
  extraFeatures?: string[]; // Ekstra özellikler
  
  warranty: {
    battery: number; // Yıl cinsinden batarya garantisi
    vehicle: number; // Yıl cinsinden araç garantisi
    maxKm?: number; // Maksimum garanti kilometresi
  };
  
  environmentalImpact?: {
    co2Savings?: number; // kg/yıl CO2 tasarrufu
    recyclableMaterials?: number; // Geri dönüştürülebilir malzeme oranı (%)
    greenEnergyPartnership?: boolean; // Yeşil enerji ortaklığı
  };

  // Ek özellikler
  heatPump?: 'yes' | 'no' | 'optional'; // Isı pompası
  v2l?: 'yes' | 'no' | 'optional'; // Vehicle-to-Load özelliği
  
  // Türkiye'deki satış durumu
  turkeyStatus?: {
    available: boolean; // Türkiye'de satışta mı?
    comingSoon?: boolean; // Yakında Türkiye'de satışa sunulacak mı?
    estimatedArrival?: string; // Tahmini geliş tarihi
  };
}

export default ElectricVehicle; 