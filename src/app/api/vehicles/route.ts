import { NextResponse } from 'next/server';
import type ElectricVehicle from '@/models/ElectricVehicle';

const mockVehicles: ElectricVehicle[] = [
  {
    id: '1',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    range: 637,
    batteryCapacity: 100,
    chargingTime: {
      ac: 10,
      dc: 0.5,
      fastCharging: {
        power: 250,
        time10to80: 27
      }
    },
    performance: {
      acceleration: 2.1,
      topSpeed: 322,
      power: 1020,
      torque: 1424
    },
    dimensions: {
      length: 4970,
      width: 1964,
      height: 1445,
      weight: 2162,
      cargoCapacity: 793,
      groundClearance: 142
    },
    efficiency: {
      consumption: 18.5,
      regenerativeBraking: true,
      ecoMode: true,
      energyRecovery: 92
    },
    comfort: {
      seatingCapacity: 5,
      screens: 3,
      soundSystem: 'Premium Audio',
      autonomousLevel: 3,
      parkAssist: true
    },
    price: {
      base: 2850000,
      currency: 'TRY',
      leasing: {
        monthly: 52000,
        duration: 36,
        downPayment: 855000
      }
    },
    images: [
      'https://placehold.co/800x450/f3f4f6/d1d5db'
    ],
    features: [
      'Full Self-Driving Hazır Donanım',
      'Yoke Direksiyon',
      'Gaming Bilgisayarı',
      'Cam Tavan'
    ],
    warranty: {
      battery: 8,
      vehicle: 4,
      maxKm: 160000
    },
    environmentalImpact: {
      co2Savings: 4200,
      recyclableMaterials: 90,
      greenEnergyPartnership: true
    }
  },
  {
    id: '2',
    brand: 'Porsche',
    model: 'Taycan Turbo S',
    year: 2024,
    range: 510,
    batteryCapacity: 93.4,
    chargingTime: {
      ac: 9,
      dc: 0.4,
      fastCharging: {
        power: 270,
        time10to80: 22
      }
    },
    performance: {
      acceleration: 2.8,
      topSpeed: 260,
      power: 761,
      torque: 1050
    },
    dimensions: {
      length: 4963,
      width: 1966,
      height: 1378,
      weight: 2295,
      cargoCapacity: 366,
      groundClearance: 128
    },
    efficiency: {
      consumption: 21.6,
      regenerativeBraking: true,
      ecoMode: true,
      energyRecovery: 88
    },
    comfort: {
      seatingCapacity: 4,
      screens: 4,
      soundSystem: 'Burmester® 3D',
      autonomousLevel: 2,
      parkAssist: true
    },
    price: {
      base: 3250000,
      currency: 'TRY',
      leasing: {
        monthly: 62000,
        duration: 36,
        downPayment: 975000
      }
    },
    images: [
      'https://placehold.co/800x450/f3f4f6/d1d5db'
    ],
    features: [
      'Porsche Active Suspension Management',
      'Sport Chrono Package',
      'Akıllı Şerit Takip',
      'Gece Görüş Asistanı'
    ],
    warranty: {
      battery: 8,
      vehicle: 3,
      maxKm: 120000
    },
    environmentalImpact: {
      co2Savings: 3800,
      recyclableMaterials: 85,
      greenEnergyPartnership: true
    }
  },
  {
    id: '3',
    brand: 'Lucid',
    model: 'Air Dream Edition',
    year: 2024,
    range: 836,
    batteryCapacity: 118,
    chargingTime: {
      ac: 12,
      dc: 0.45,
      fastCharging: {
        power: 300,
        time10to80: 20
      }
    },
    performance: {
      acceleration: 2.5,
      topSpeed: 270,
      power: 1111,
      torque: 1390
    },
    dimensions: {
      length: 4975,
      width: 1939,
      height: 1410,
      weight: 2375,
      cargoCapacity: 739,
      groundClearance: 135
    },
    efficiency: {
      consumption: 16.8,
      regenerativeBraking: true,
      ecoMode: true,
      energyRecovery: 95
    },
    comfort: {
      seatingCapacity: 5,
      screens: 5,
      soundSystem: 'Surreal Sound',
      autonomousLevel: 3,
      parkAssist: true
    },
    price: {
      base: 3750000,
      currency: 'TRY',
      leasing: {
        monthly: 72000,
        duration: 36,
        downPayment: 1125000
      }
    },
    images: [
      'https://placehold.co/800x450/f3f4f6/d1d5db'
    ],
    features: [
      'DreamDrive Pro',
      'Cam Kokpit',
      'Executive Arka Koltuklar',
      'Micro Lens Array Far Sistemi'
    ],
    warranty: {
      battery: 10,
      vehicle: 5,
      maxKm: 200000
    },
    environmentalImpact: {
      co2Savings: 4500,
      recyclableMaterials: 95,
      greenEnergyPartnership: true
    }
  }
];

export async function GET() {
  return NextResponse.json(mockVehicles);
} 