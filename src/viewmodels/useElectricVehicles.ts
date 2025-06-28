import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { ElectricVehicle } from '@/models/ElectricVehicle';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// Araç tipini standartlaştır - dışa aktardık, utils içerisinde kullanılıyor
export const normalizeVehicleType = (type: string): string => {
  // Önce gelen değeri büyük-küçük harf duyarsız hale getir
  const lowerType = type.toLowerCase().trim();

  // Basit bir eşleşme tablosu oluştur
  const typeMapping: Record<string, string> = {
    'suv': 'SUV',
    'crossover': 'SUV',
    'cuv': 'SUV',
    'coupe': 'Spor',
    'sportback': 'Spor',
    'sports': 'Spor',
    'spor': 'Spor',
    'cabrio': 'Spor',
    'roadster': 'Spor',
    'sedan': 'Sedan',
    'hatchback': 'Hatchback',
    'van': 'Ticari',
    'ticari': 'Ticari',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Otobüs',
    'otobüs': 'Otobüs',
    'bus': 'Otobüs',
    // Motosiklet varyasyonları
    'motosiklet': 'Motosiklet',
    'motor': 'Motosiklet',
    'motorcycle': 'Motosiklet',
    'moto': 'Motosiklet',
    // Scooter varyasyonları
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter',
  };

  // Eşleşme varsa standart değeri döndür, yoksa orijinal değeri kullan
  return typeMapping[lowerType] || type;
};

// Filtre tipi tanımı
type Filters = {
  brand?: string;
  vehicleType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBatteryCapacity?: number;
  maxBatteryCapacity?: number;
  minRange?: number;
  maxRange?: number;
  minConsumption?: number;
  maxConsumption?: number;
  minChargeSpeed?: number;
  maxChargeSpeed?: number;
  heatPump?: string; // 'yes' | 'no' | 'optional'
  v2l?: string; // 'yes' | 'no' | 'optional'
  turkeyStatuses?: string; // 'available' | 'unavailable'
  comingSoon?: boolean; // Türkiye'de yakında satışa sunulacak
  searchTerm?: string; // Arama terimi
};

// Supabase'den araç verilerini çeken ve filtreleme yapan fonksiyon
async function fetchVehiclesFromSupabase(filters: Filters = {}): Promise<ElectricVehicle[]> {
  try {
    // Temel sorgu
    let query = supabase
      .from('electric_vehicles')
      .select(`*,
        features(*),
        environmental_impacts!inner(*),
        turkey_statuses!inner(*),
        performances!inner(*),
        charging_times!inner(*),
        dimensions!left(*),
        comforts!inner(*),
        efficiencies!inner(*),
        images!inner(*),
        prices!inner!inner(*),
        warranties!inner(*)
        `);

    // Filtreler uygulanıyor
    query = applyFiltersToQuery(query, filters);

    // Sorguyu çalıştır
    const { data, error } = await query;

    if (error) {
      console.error('Supabase veri çekme hatası:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase\'den veri çekilemedi veya filtrelere uygun sonuç yok.');
      return [];
    }

    // Supabase'den gelen veriyi ElectricVehicle formatına dönüştür
    const vehicles: ElectricVehicle[] = data.map((vehicle: any) => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      range: vehicle.range,
      batteryCapacity: vehicle.battery_capacity,
      chargingTime: vehicle.charging_times ? {
        ac: vehicle.charging_times.ac,
        dc: vehicle.charging_times.dc,
        fastCharging: {
          power: vehicle.charging_times.fast_charging_power,
          time10to80: vehicle.charging_times.fast_charging_time_10_to_80,
        },
        acTime: vehicle.charging_times.ac_time,
      } : undefined,
      performance: vehicle.performances ? {
        power: vehicle.performances.power, // Motor Gücü (HP)
        torque: vehicle.performances.torque, // Tork (Nm)
        driveType: vehicle.performances.drive_type, // Sürüş Sistemi
        topSpeed: vehicle.performances.top_speed, // Azami Hız (km/s)
        acceleration: vehicle.performances.acceleration // 0-100 km/s (saniye)
      } : undefined,
      dimensions: vehicle.dimensions ? {
        length: vehicle.dimensions.length,
        width: vehicle.dimensions.width,
        height: vehicle.dimensions.height,
        weight: vehicle.dimensions.weight,
        cargoCapacity: vehicle.dimensions.cargo_capacity,
        groundClearance: vehicle.dimensions.ground_clearance
      } : undefined,
      efficiency: vehicle.efficiencies ? {
        consumption: vehicle.efficiencies.consumption,
        regenerativeBraking: vehicle.efficiencies.regenerative_braking,
        ecoMode: vehicle.efficiencies.eco_mode,
        energyRecovery: vehicle.efficiencies.energy_recovery
      } : undefined,
      comfort: vehicle.comfort as any,
      price: vehicle.prices ? {
        base: vehicle.prices.base,
        currency: vehicle.prices.currency,
        withOptions: vehicle.prices.with_options,
        leasingMonthly: vehicle.prices.leasing_monthly,
        leasingDuration: vehicle.prices.leasing_duration,
        leasingDownPayment: vehicle.prices.leasing_down_payment
      } : undefined,
      images: vehicle.images?.map((img: any) => img.url),
      features: vehicle.features,
      extraFeatures: vehicle.features || undefined,
      warranty: vehicle.warranty as any,
      environmentalImpact: vehicle.environmental_impact as any,
      heatPump: vehicle.heat_pump?.toLowerCase(),
      v2l: vehicle.v2l,
      turkeyStatuses: vehicle.turkey_statuses ? {
        available: vehicle.turkey_statuses.available,
        comingSoon: vehicle.turkey_statuses.coming_soon,
        estimatedArrival: vehicle.turkey_statuses.estimated_arrival
      } : undefined
    }));

    return vehicles;
  } catch (error) {
    return [];
  }
}

// Supabase sorgusuna filtreleri uygulayan yardımcı fonksiyon
function applyFiltersToQuery(query: any, filters: Filters) {
  // Marka filtresi
  if (filters.brand) {
    query = query.ilike('brand', `%${filters.brand}%`);
  }

  // Araç tipi filtresi
  if (filters.vehicleType) {
    const normalizedType = normalizeVehicleType(filters.vehicleType);
    query = query.eq('type', normalizedType);
  }

  // Fiyat filtreleri
  if (filters.minPrice) {
    query = query.gte('prices.base', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('prices.base', filters.maxPrice);
  }

  // Batarya kapasitesi filtreleri
  if (filters.minBatteryCapacity) {
    query = query.gte('battery_capacity', filters.minBatteryCapacity);
  }
  if (filters.maxBatteryCapacity) {
    query = query.lte('battery_capacity', filters.maxBatteryCapacity);
  }

  // Menzil filtreleri
  if (filters.minRange) {
    query = query.gte('range', filters.minRange);
  }
  if (filters.maxRange) {
    query = query.lte('range', filters.maxRange);
  }

  // Tüketim filtreleri
  if (filters.minConsumption) {
    query = query.gte('efficiencies.consumption', filters.minConsumption);
  }
  if (filters.maxConsumption) {
    query = query.lte('efficiencies.consumption', filters.maxConsumption);
  }

  // Şarj hızı filtreleri
  if (filters.minChargeSpeed) {
    query = query.gte('charging_times.fastCharging->power', filters.minChargeSpeed);
  }
  if (filters.maxChargeSpeed) {
    query = query.lte('charging_times.fastCharging->power', filters.maxChargeSpeed);
  }

  // Isı pompası filtresi
  if (filters.heatPump) {
    query = query.eq('heat_pump', filters.heatPump);
  }

  // V2L filtresi
  if (filters.v2l) {
    query = query.eq('v2l', filters.v2l);
  }

  // Türkiye durumu filtresi
  if (filters.turkeyStatuses) {
    query = query.eq('turkey_statuses.available', filters.turkeyStatuses === 'available');
  }

  // Yakında geliyor filtresi
  if (filters.comingSoon !== undefined) {
    if (filters.comingSoon) {
      query = query.eq('turkey_statuses.comingSoon', true);
    } else {
      // comingSoon=false ise, comingSoon=true olan araçları hariç tut
      query = query.or('turkey_statuses.comingSoon.is.null,turkey_statuses.comingSoon.eq.false');
    }
  }

  // Arama terimi filtresi
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    query = query.or(
      `brand.ilike.%${searchLower}%,model.ilike.%${searchLower}%,type.ilike.%${searchLower}%`
    );
  }

  return query;
}

// Para birimi tipleri için tip tanımı
export type CurrencyType = 'TRY' | 'USD' | 'EUR' | 'CNY';

interface ElectricVehicleStore {
  selectedVehicle: ElectricVehicle | null;
  setSelectedVehicle: (vehicle: ElectricVehicle | null) => void;
  currency: CurrencyType; // Para birimi seçimi
  setCurrency: (currency: CurrencyType) => void; // Para birimi güncelleme fonksiyonu
  filters: Filters;
  temporaryFilters: Filters;
  setTemporaryFilters: (filters: Partial<Filters>) => void;
  applyFilters: () => void;
  setFilters: (filters: Partial<Filters>) => void;
}

// Zustand store
export const useElectricVehicleStore = create<ElectricVehicleStore>((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  currency: 'TRY', // Varsayılan para birimi: Türk Lirası
  setCurrency: (currency) => set({ currency }),
  filters: {},
  temporaryFilters: {},
  setTemporaryFilters: (newFilters) => set((state) => ({
    temporaryFilters: { ...state.temporaryFilters, ...newFilters }
  })),
  applyFilters: () => set((state) => ({
    filters: { ...state.temporaryFilters }
  })),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
    temporaryFilters: { ...state.filters, ...newFilters }
  })),
}));

// React Query hook - Supabase'den filtreli verileri çeker
export const useElectricVehicles = () => {
  const filters = useElectricVehicleStore((state) => state.filters);

  return useQuery({
    queryKey: ['electricVehicles', filters],
    queryFn: () => fetchVehiclesFromSupabase(filters),
    staleTime: 5 * 60 * 1000, // 5 dakika önbellek
    refetchOnWindowFocus: false, // Pencere odağı değiştiğinde yeniden veri çekme
  });
};

export const useFilteredVehicles = () => {
  const { data: vehicles = [], isLoading, error } = useElectricVehicles();
  const searchParams = useSearchParams();
  const filters = useElectricVehicleStore((state) => state.filters);
  const setFilters = useElectricVehicleStore((state) => state.setFilters);

  const urlVehicleType = searchParams.get('tip');
  const searchTerm = searchParams.get('search');

  // URL'den gelen araç tipi filtresini state'e uygula
  useEffect(() => {
    if (urlVehicleType) {
      setFilters({
        vehicleType: normalizeVehicleType(urlVehicleType)
      });
    }
  }, [urlVehicleType, setFilters]);

  // Arama terimi varsa, filtrelere ekle
  useEffect(() => {
    if (searchTerm) {
      setFilters({ searchTerm });
    }
  }, [searchTerm, setFilters]);

  // Yakında geliyor kontrolü
  const isComingSoonActive = useMemo(() => {
    return filters.comingSoon === true;
  }, [filters.comingSoon]);

  return {
    vehicles,
    isLoading,
    error,
    isComingSoonActive
  };
}; 