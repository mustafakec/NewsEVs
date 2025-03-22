import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import ElectricVehicle from '@/models/ElectricVehicle';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

// Araç tipini standartlaştır
const normalizeVehicleType = (type: string): string => {
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
    'bus': 'Otobüs',
    'otobüs': 'Otobüs',
    'truck': 'Kamyonet',
    'kamyonet': 'Kamyonet',
    'motosiklet': 'Motosiklet',
    'motorcycle': 'Motosiklet',
    'moto': 'Motosiklet',
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter'
  };
  
  // Eşleşme varsa, eşleşen tipi döndür
  if (typeMapping[lowerType]) {
    console.log(`Tip normalleştiriliyor: "${type}" => "${typeMapping[lowerType]}"`);
    return typeMapping[lowerType];
  }
  
  // Eşleşme bulunamazsa, ilk harf büyük gerisi küçük tipinde format
  console.log(`Tip değişmedi: "${type}" (eşleşme bulunamadı)`);
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

// Para birimi tipleri için tip tanımı
export type CurrencyType = 'TRY' | 'USD' | 'EUR' | 'CNY';

interface ElectricVehicleStore {
  selectedVehicle: ElectricVehicle | null;
  setSelectedVehicle: (vehicle: ElectricVehicle | null) => void;
  currency: CurrencyType; // Para birimi seçimi
  setCurrency: (currency: CurrencyType) => void; // Para birimi güncelleme fonksiyonu
  filters: {
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
  };
  temporaryFilters: {
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
    heatPump?: string;
    v2l?: string;
    turkeyStatus?: string;
    comingSoon?: boolean;
  };
  setTemporaryFilters: (filters: Partial<ElectricVehicleStore['temporaryFilters']>) => void;
  applyFilters: () => void;
  setFilters: (filters: Partial<ElectricVehicleStore['filters']>) => void;
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

// React Query hook
export const useElectricVehicles = () => {
  return useQuery({
    queryKey: ['electricVehicles'],
    queryFn: async () => {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/vehicles`);
      if (!response.ok) {
        throw new Error('Araçlar yüklenirken bir hata oluştu');
      }
      return response.json() as Promise<ElectricVehicle[]>;
    },
  });
};

export const useFilteredVehicles = () => {
  const { data: vehicles = [], isLoading, error } = useElectricVehicles();
  const searchParams = useSearchParams();
  const filters = useElectricVehicleStore((state) => state.filters);
  
  const urlVehicleType = searchParams.get('tip');
  const searchTerm = searchParams.get('search');
  
  // URL'den gelen araç tipi filtresini state'e uygula
  useEffect(() => {
    if (urlVehicleType) {
      useElectricVehicleStore.getState().setFilters({ 
        vehicleType: normalizeVehicleType(urlVehicleType) 
      });
    }
  }, [urlVehicleType]);
  
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    
    let filtered = [...vehicles];
    
    // Arama terimine göre filtreleme
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(searchLower) || 
        vehicle.model.toLowerCase().includes(searchLower) ||
        vehicle.type.toLowerCase().includes(searchLower) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchLower)
      );
    }
    
    // Diğer filtreler
    if (filters.brand) {
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    
    // Araç tipi filtreleme
    if (filters.vehicleType) {
      const normalizedFilterType = normalizeVehicleType(filters.vehicleType);
      
      filtered = filtered.filter(vehicle => {
        const normalizedVehicleType = normalizeVehicleType(vehicle.type);
        return normalizedVehicleType === normalizedFilterType;
      });
    }
    
    // Premium araçlar ve Türkiye'de yakında
    filtered = filtered.filter(vehicle => {
      // "Yakında Türkiye'de" filtresi aktif ise, SADECE comingSoon özelliği true olan araçları göster
      if (filters.comingSoon === true) {
        return vehicle.turkeyStatus?.comingSoon === true;
      }
      
      // ComingSoon filtresi aktif değilse, comingSoon=true olan araçları filtreleme
      if (vehicle.turkeyStatus?.comingSoon === true && !filters.comingSoon) {
        return false;
      }
      
      // Fiyat filtreleme
      if (filters.minPrice && vehicle.price.base < filters.minPrice) return false;
      if (filters.maxPrice && vehicle.price.base > filters.maxPrice) return false;
      
      // Batarya kapasitesi filtreleme
      if (filters.minBatteryCapacity && vehicle.batteryCapacity < filters.minBatteryCapacity) return false;
      if (filters.maxBatteryCapacity && vehicle.batteryCapacity > filters.maxBatteryCapacity) return false;
      
      // Menzil filtreleme
      if (filters.minRange && vehicle.range < filters.minRange) return false;
      if (filters.maxRange && vehicle.range > filters.maxRange) return false;
      
      // Tüketim filtreleme
      if (filters.minConsumption && vehicle.efficiency.consumption < filters.minConsumption) return false;
      if (filters.maxConsumption && vehicle.efficiency.consumption > filters.maxConsumption) return false;
      
      // Şarj hızı filtreleme
      if (filters.minChargeSpeed && vehicle.chargingTime.fastCharging.power < filters.minChargeSpeed) return false;
      if (filters.maxChargeSpeed && vehicle.chargingTime.fastCharging.power > filters.maxChargeSpeed) return false;
      
      // Isı pompası filtreleme
      if (filters.heatPump && vehicle.heatPump !== filters.heatPump) return false;
      
      // V2L filtreleme
      if (filters.v2l && vehicle.v2l !== filters.v2l) return false;
      
      // Türkiye'de satışta mı filtreleme
      if (filters.turkeyStatus) {
        if (filters.turkeyStatus === 'available' && (!vehicle.turkeyStatus || !vehicle.turkeyStatus.available)) {
          return false;
        }
        if (filters.turkeyStatus === 'unavailable' && vehicle.turkeyStatus && vehicle.turkeyStatus.available) {
          return false;
        }
      }
      
      return true;
    });
    
    return filtered;
  }, [vehicles, filters, searchTerm]);
  
  return {
    vehicles: filteredVehicles,
    isLoading,
    error,
    isComingSoonActive: !!filters.comingSoon,
  };
}; 