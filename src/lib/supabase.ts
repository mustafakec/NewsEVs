import { createClient } from '@supabase/supabase-js';

// Supabase istemcisi oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase yapılandırma değişkenleri eksik. Lütfen .env dosyasını kontrol edin.');
}

if (!supabaseUrl) {
  console.error('Supabase URL çevresel değişkeni tanımlanmamış.');
}

if (!supabaseKey) {
  console.error('Supabase anonim anahtar çevresel değişkeni tanımlanmamış.');
}

// Veritabanı tipini tanımla
export type SupabaseDatabase = {
  public: {
    Tables: {
      electric_vehicles: {
        Row: SupabaseElectricVehicle;
        Insert: Omit<SupabaseElectricVehicle, 'id'>;
        Update: Partial<SupabaseElectricVehicle>;
      };
    };
  };
};

export const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseKey);

// Elektrikli araç tablosu için tipler ve helper fonksiyonlar
export type SupabaseElectricVehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  range: number;
  battery_capacity: number;
  charging_time: {
    ac: number;
    dc: number;
    fastCharging: {
      power: number;
      time10to80: number;
    };
  };
  performance: {
    acceleration: number;
    topSpeed: number;
    power: number;
    torque: number;
    driveType?: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
    cargoCapacity?: number;
    groundClearance?: number;
  };
  efficiency: {
    consumption: number;
    regenerativeBraking?: boolean;
    ecoMode?: boolean;
    energyRecovery?: number;
  };
  comfort?: {
    seatingCapacity?: number;
    screens?: number;
    soundSystem?: string;
    autonomousLevel?: number;
    parkAssist?: boolean;
    climateControl?: boolean;
    heatedSeats?: boolean;
    navigation?: boolean;
    parkingSensors?: boolean;
  };
  price: {
    base: number;
    currency: string;
    withOptions?: number;
    leasing?: {
      monthly: number;
      duration: number;
      downPayment: number;
    };
  };
  images: string[];
  features: string[];
  extra_features?: string[];
  warranty: {
    battery: number;
    vehicle: number;
    maxKm?: number;
  };
  environmental_impact?: {
    co2Savings?: number;
    recyclableMaterials?: number;
    greenEnergyPartnership?: boolean;
  };
  heat_pump?: 'yes' | 'no' | 'optional';
  v2l?: 'yes' | 'no' | 'optional';
  turkey_status?: {
    available: boolean;
    comingSoon?: boolean;
    estimatedArrival?: string;
  };
  created_at?: string;
  updated_at?: string;
}

// Tip tanımlamaları
export type Tables<T extends keyof SupabaseDatabase['public']['Tables']> =
  SupabaseDatabase['public']['Tables'][T]['Row'];

// Elektrikli araçlar için yardımcı fonksiyonlar
export const getElectricVehicles = async () => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('*');

  if (error) {
    console.error('Elektrikli araçlar yüklenirken hata oluştu:', error);
    return [];
  }

  return data || [];
};

export const getElectricVehicleById = async (id: string) => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`ID ${id} olan araç yüklenirken hata oluştu:`, error);
    return null;
  }

  return data;
};

// Typescript için veritabanı tip tanımları - daha sonra gerçek şemaya göre güncellenecek
interface Database {
  public: {
    Tables: {
      electric_vehicles: {
        Row: {
          id: string;
          brand: string;
          model: string;
          year: number;
          type: string;
          range: number;
          battery_capacity: number;
          charging_time: number;
          features?: string[];
          // Buraya diğer alanları ekleyebilirsiniz
        };
      };
    };
  };
} 