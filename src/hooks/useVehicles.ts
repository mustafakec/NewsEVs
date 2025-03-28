import { useQuery } from '@tanstack/react-query';
import type ElectricVehicle from '@/models/ElectricVehicle';
import { supabase, SupabaseElectricVehicle } from '@/lib/supabase';
import vehiclesData from '@/data/electric-vehicles.json';

export interface UseVehiclesReturn {
  data: ElectricVehicle[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Sunucu taraflı olarak araç verilerini çekme fonksiyonu
 * SSR için kullanılabilir
 */
export async function fetchVehicles(): Promise<ElectricVehicle[]> {
  try {
    // Supabase'den verileri çek
    const { data, error } = await supabase
      .from('electric_vehicles')
      .select('*');
    
    if (error) {
      console.error('Supabase veri çekme hatası:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('Supabase\'den veri çekilemedi, yerel veriyi kullanıyorum.');
      return vehiclesData as ElectricVehicle[];
    }
    
    // Supabase verilerini uygulama modeline dönüştür - camelCase ve diğer dönüşümler için
    // Bu örnek için tip zorlama (as) kullanıyoruz, gerçek uygulamada daha ayrıntılı bir eşleme gerekebilir
    return data.map(vehicle => {
      // Alan isimlerini camelCase'e dönüştürme
      const result = {
        ...vehicle,
        batteryCapacity: vehicle.battery_capacity,
        extraFeatures: vehicle.extra_features,
        environmentalImpact: vehicle.environmental_impact,
        turkeyStatus: vehicle.turkey_status
      } as unknown as ElectricVehicle;
      
      return result;
    });
  } catch (error) {
    console.warn('Veri alınamadı, yerel veriyi kullanıyorum:', error);
    // Herhangi bir hata durumunda yerel veriyi kullan
    return vehiclesData as ElectricVehicle[];
  }
}

/**
 * İstemci taraflı araç verilerini çekmek için React Query hook'u
 */
export function useVehicles(): UseVehiclesReturn {
  return useQuery<ElectricVehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 5 * 60 * 1000, // 5 dakika boyunca verileri önbellekte tut
    refetchOnWindowFocus: false, // Pencere odağı değiştiğinde yeniden çekme 
  });
} 
