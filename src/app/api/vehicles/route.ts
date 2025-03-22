import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type ElectricVehicle from '@/models/ElectricVehicle';
import fs from 'fs/promises';
import path from 'path';

// Örnek veri - gerçek projede bu /data klasöründen gelecek
const vehicles: Partial<ElectricVehicle>[] = [
  {
    id: "tesla-model-3",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    type: "Sedan",
    range: 510,
    batteryCapacity: 60,
    chargingTime: {
      ac: 6,
      dc: 1.2,
      fastCharging: {
        power: 250,
        time10to80: 28
      }
    },
    performance: {
      acceleration: 3.3,
      topSpeed: 261,
      power: 325,
      torque: 450,
      driveType: "RWD"
    },
    dimensions: {
      length: 4694,
      width: 2088,
      height: 1443,
      weight: 1830,
      cargoCapacity: 561
    },
    efficiency: {
      consumption: 14.5
    },
    price: {
      base: 53990,
      currency: "TRY"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "Autopilot",
      "Panoramik Cam Tavan",
      "15\" Dokunmatik Ekran",
      "Kablosuz Şarj"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 1,
      autonomousLevel: 2,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 4,
      maxKm: 160000
    },
    heatPump: "yes",
    v2l: "no",
    turkeyStatus: {
      available: true
    }
  },
  {
    id: "volkswagen-id-4",
    brand: "Volkswagen",
    model: "ID.4",
    year: 2023,
    type: "SUV",
    range: 520,
    batteryCapacity: 77,
    chargingTime: {
      ac: 7.5,
      dc: 1.7,
      fastCharging: {
        power: 135,
        time10to80: 30
      }
    },
    performance: {
      acceleration: 6.2,
      topSpeed: 160,
      power: 204,
      torque: 310,
      driveType: "RWD"
    },
    dimensions: {
      length: 4584,
      width: 1852,
      height: 1640,
      weight: 2049,
      cargoCapacity: 543
    },
    efficiency: {
      consumption: 16.8
    },
    price: {
      base: 62990,
      currency: "TRY"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "IQ.Light LED Matrix Farlar",
      "ID. Işık Konsepti",
      "12\" Dokunmatik Ekran",
      "Kablosuz App-Connect"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 2,
      autonomousLevel: 2,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 4,
      maxKm: 160000
    },
    heatPump: "yes",
    v2l: "no",
    turkeyStatus: {
      available: true
    }
  },
  {
    id: "hyundai-ioniq-5",
    brand: "Hyundai",
    model: "IONIQ 5",
    year: 2023,
    type: "SUV",
    range: 507,
    batteryCapacity: 72.6,
    chargingTime: {
      ac: 6,
      dc: 1.1,
      fastCharging: {
        power: 230,
        time10to80: 18
      }
    },
    performance: {
      acceleration: 5.2,
      topSpeed: 185,
      power: 217,
      torque: 350,
      driveType: "RWD"
    },
    dimensions: {
      length: 4635,
      width: 1890,
      height: 1605,
      weight: 1830,
      cargoCapacity: 527
    },
    efficiency: {
      consumption: 16.8
    },
    price: {
      base: 65990,
      currency: "TRY"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "Vehicle-to-Load (V2L)",
      "12.3\" Dokunmatik Ekran",
      "Bose Premium Ses Sistemi",
      "Çift Motor AWD (Seçili Modellerde)"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 2,
      autonomousLevel: 2,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 5,
      maxKm: 200000
    },
    heatPump: "yes",
    v2l: "yes",
    turkeyStatus: {
      available: true
    }
  },
  {
    id: "bmw-i4",
    brand: "BMW",
    model: "i4",
    year: 2024,
    type: "Sedan",
    range: 590,
    batteryCapacity: 83.9,
    chargingTime: {
      ac: 8.5,
      dc: 1.5,
      fastCharging: {
        power: 200,
        time10to80: 31
      }
    },
    performance: {
      acceleration: 5.7,
      topSpeed: 190,
      power: 340,
      torque: 430,
      driveType: "RWD"
    },
    dimensions: {
      length: 4783,
      width: 1852,
      height: 1448,
      weight: 2125,
      cargoCapacity: 470
    },
    efficiency: {
      consumption: 16.1
    },
    price: {
      base: 92990,
      currency: "TRY"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "BMW İşletim Sistemi 8.0",
      "BMW Curved Display",
      "Harman Kardon Surround Ses Sistemi",
      "BMW Efficient Dynamics"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 2,
      autonomousLevel: 2,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 3,
      maxKm: 160000
    },
    heatPump: "yes",
    v2l: "no",
    turkeyStatus: {
      available: true
    }
  },
  {
    id: "opel-mokka-e",
    brand: "Opel",
    model: "Mokka-e",
    year: 2023,
    type: "SUV",
    range: 520,
    batteryCapacity: 73,
    chargingTime: {
      ac: 4.5,
      dc: 1.5,
      fastCharging: {
        power: 100,
        time10to80: 30
      }
    },
    performance: {
      acceleration: 9,
      topSpeed: 170,
      power: 210,
      torque: 345,
      driveType: "FWD"
    },
    dimensions: {
      length: 4650,
      width: 2108,
      height: 1661,
      weight: 2700,
      cargoCapacity: 650
    },
    efficiency: {
      consumption: 17.3
    },
    price: {
      base: 1804000,
      currency: "₺"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "LED Farlar",
      "Isıtmalı Koltuklar",
      "Dijital Gösterge Paneli",
      "360 Derece Kamera"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 2,
      autonomousLevel: 2,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 3,
      maxKm: 160000
    },
    heatPump: "yes",
    v2l: "no",
    turkeyStatus: {
      available: true
    }
  },
  {
    id: "tesla-model-y",
    brand: "Tesla",
    model: "Model Y",
    year: 2023,
    type: "SUV",
    range: 533,
    batteryCapacity: 75,
    chargingTime: {
      ac: 6.5,
      dc: 1.2,
      fastCharging: {
        power: 250,
        time10to80: 25
      }
    },
    performance: {
      acceleration: 5.0,
      topSpeed: 217,
      power: 340,
      torque: 510,
      driveType: "AWD"
    },
    dimensions: {
      length: 4750,
      width: 2129,
      height: 1624,
      weight: 2000,
      cargoCapacity: 854
    },
    efficiency: {
      consumption: 16.9
    },
    price: {
      base: 2150000,
      currency: "₺"
    },
    images: [
      "/electric.png",
      "/logo.png"
    ],
    features: [
      "Autopilot",
      "Panoramik Cam Tavan",
      "15\" Dokunmatik Ekran",
      "Kablosuz Şarj"
    ],
    comfort: {
      seatingCapacity: 5,
      screens: 1,
      autonomousLevel: 3,
      parkAssist: true,
      climateControl: true,
      heatedSeats: true,
      navigation: true
    },
    warranty: {
      battery: 8,
      vehicle: 4,
      maxKm: 200000
    },
    heatPump: "yes",
    v2l: "optional",
    turkeyStatus: {
      available: true
    }
  }
];

/**
 * Çekilen verileri yükler veya yoksa mock verileri döndürür
 */
async function loadVehicles(): Promise<ElectricVehicle[]> {
  try {
    // Veri dosyasının yolu
    const dataPath = path.join(process.cwd(), 'src', 'data', 'electric-vehicles.json');
    
    // Dosya var mı kontrol et
    await fs.access(dataPath);
    
    // Dosyayı oku
    const fileContent = await fs.readFile(dataPath, 'utf8');
    const vehicles = JSON.parse(fileContent) as ElectricVehicle[];
    
    console.log(`Toplam ${vehicles.length} araç verisi yüklendi.`);
    return vehicles;
  } catch (error) {
    console.error('Veri dosyası yüklenemedi, mock veriler kullanılıyor:', error instanceof Error ? error.message : error);
    return vehicles as ElectricVehicle[];
  }
}

export async function GET(request: NextRequest) {
  try {
    const vehicles = await loadVehicles();
    return NextResponse.json(vehicles, { status: 200 });
  } catch (error) {
    console.error('Araç verileri hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 