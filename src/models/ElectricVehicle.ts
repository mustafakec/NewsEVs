export interface ElectricVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string; // Araç tipi: Sedan, SUV, Hatchback, vb.
  range: number; // km cinsinden menzil
  batteryCapacity: number; // kWh cinsinden batarya kapasitesi
  heatPump: 'yes' | 'no' | 'optional';
  v2l: 'yes' | 'no' | 'optional';
  chargingTime?: {
    ac: number; // saat cinsinden AC şarj süresi
    dc: number; // saat cinsinden DC şarj süresi
    fastCharging: { // Hızlı şarj özellikleri
      power: number; // kW cinsinden maksimum şarj gücü
      time10to80: number; // 10%'dan 80%'e şarj süresi (dakika)
    };
  };

  performance?: {
    power: number; // Motor Gücü (HP)
    torque: number; // Tork (Nm)
    driveType: string; // Sürüş Sistemi
    topSpeed: number; // Azami Hız (km/s)
    acceleration: number; // 0-100 km/s (saniye)
  };

  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
    cargoCapacity: number;
    groundClearance: number;
  };

  efficiency?: {
    consumption: number; // kWh/100km
    regenerativeBraking: boolean; // Rejeneratif fren sistemi
    ecoMode: boolean; // Ekonomi modu
    energyRecovery: number; // Enerji geri kazanım oranı (%)
  };

  comfort?: {
    seatingCapacity: number;
    screens: number;
    soundSystem: string;
    autonomousLevel: number; // 0-5 arası otonom sürüş seviyesi
    parkAssist: boolean;
    climateControl: boolean; // Klima
    heatedSeats: boolean; // Isıtmalı koltuklar
    navigation: boolean; // Navigasyon
    parkingSensors: boolean; // Park sensörleri
  };

  price?: {
    base: number;
    currency: string;
    withOptions: number;
    leasingMonthly: number;
    leasingDuration: number;
    leasingDownPayment: number;
  };

  images?: string[];
  features?: Array<{
    name: string;
    isExtra: boolean;
  }>;

  warranty?: {
    battery: number; // Yıl cinsinden batarya garantisi
    vehicle: number; // Yıl cinsinden araç garantisi
    maxKm: number; // Maksimum garanti kilometresi
  };

  environmentalImpact?: {
    co2Savings: number; // kg/yıl CO2 tasarrufu
    recyclableMaterials: number; // Geri dönüştürülebilir malzeme oranı (%)
    greenEnergyPartnership: boolean; // Yeşil enerji ortaklığı
  };

  // Türkiye'deki satış durumu
  turkeyStatus?: {
    available: boolean; // Türkiye'de satışta mı?
    comingSoon: boolean; // Yakında Türkiye'de satışa sunulacak mı?
    estimatedArrival?: string; // Tahmini geliş tarihi
  };
} 