import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import ElectricVehicle from '@/models/ElectricVehicle';
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
  turkeyStatus?: string; // 'available' | 'unavailable'
  comingSoon?: boolean; // Türkiye'de yakında satışa sunulacak
  searchTerm?: string; // Arama terimi
};

// Supabase'den araç verilerini çeken ve filtreleme yapan fonksiyon
async function fetchVehiclesFromSupabase(filters: Filters = {}): Promise<ElectricVehicle[]> {
  try {
    // Temel sorgu
    let query = supabase
      .from('electric_vehicles')
      .select('*');
    
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
    const vehicles: ElectricVehicle[] = data.map(vehicle => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      range: vehicle.range,
      batteryCapacity: vehicle.battery_capacity,
      chargingTime: vehicle.charging_time as any,
      performance: vehicle.performance as any,
      dimensions: vehicle.dimensions as any,
      efficiency: vehicle.efficiency as any,
      comfort: vehicle.comfort as any,
      price: vehicle.price as any,
      images: vehicle.images,
      features: vehicle.features,
      extraFeatures: vehicle.extra_features || undefined,
      warranty: vehicle.warranty as any,
      environmentalImpact: vehicle.environmental_impact as any,
      heatPump: vehicle.heat_pump,
      v2l: vehicle.v2l,
      turkeyStatus: vehicle.turkey_status as any
    }));
    
    return vehicles;
  } catch (error) {
    console.error('Araç verileri çekilirken hata oluştu:', error);
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
    query = query.gte('price->base', filters.minPrice);
  }
  if (filters.maxPrice) {
    query = query.lte('price->base', filters.maxPrice);
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
    query = query.gte('efficiency->consumption', filters.minConsumption);
  }
  if (filters.maxConsumption) {
    query = query.lte('efficiency->consumption', filters.maxConsumption);
  }
  
  // Şarj hızı filtreleri
  if (filters.minChargeSpeed) {
    query = query.gte('charging_time->fastCharging->power', filters.minChargeSpeed);
  }
  if (filters.maxChargeSpeed) {
    query = query.lte('charging_time->fastCharging->power', filters.maxChargeSpeed);
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
  if (filters.turkeyStatus) {
    query = query.eq('turkey_status->available', filters.turkeyStatus === 'available');
  }
  
  // Yakında geliyor filtresi
  if (filters.comingSoon !== undefined) {
    if (filters.comingSoon) {
      query = query.eq('turkey_status->comingSoon', true);
    } else {
      // comingSoon=false ise, comingSoon=true olan araçları hariç tut
      query = query.or('turkey_status->comingSoon.is.null,turkey_status->comingSoon.eq.false');
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