import { useQuery } from '@tanstack/react-query';
import { supabase, SupabaseElectricVehicle } from '@/lib/supabase';
import vehiclesData from '@/data/electric-vehicles.json';
import { ElectricVehicle } from '@/models/ElectricVehicle';

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
      .select(`*,
        features(*),
        environmental_impacts!inner(*),
        turkey_statuses!inner(*),
        performances!inner(*),
        charging_times!inner(*),
        dimensions!inner(*),
        comforts!inner(*),
        efficiencies!inner(*),
        images!inner(*),
        prices!inner!inner(*),
        warranties!inner(*)
        `);


    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return vehiclesData as unknown as ElectricVehicle[];
    }

    // Supabase verilerini uygulama modeline dönüştür - camelCase ve diğer dönüşümler için
    // Bu örnek için tip zorlama (as) kullanıyoruz, gerçek uygulamada daha ayrıntılı bir eşleme gerekebilir

    return data.map((vehicle: any) => {

      // Alan isimlerini camelCase'e dönüştürme
      const result = {
        ...vehicle,
        batteryCapacity: vehicle.battery_capacity,
        extraFeatures: vehicle.features,
        environmentalImpact: vehicle.environmental_impact,
        turkeyStatus: vehicle.turkey_status,
        performance: vehicle.performances ? {
          power: vehicle.performances.power, // Motor Gücü (HP)
          torque: vehicle.performances.torque, // Tork (Nm)
          driveType: vehicle.performances.drive_type, // Sürüş Sistemi
          topSpeed: vehicle.performances.top_speed, // Azami Hız (km/s)
          acceleration: vehicle.performances.acceleration // 0-100 km/s (saniye)
        } : undefined,
        chargingTime: vehicle.charging_times,
        efficiency: vehicle.efficiencies,
        comfort: vehicle.comforts,
        price: vehicle.prices,
        images: vehicle.images?.map((img: any) => img.url),
        warranty: vehicle.warranties,
      } as unknown as ElectricVehicle;

      return result;
    });
  } catch (error) {
    console.warn('Veri alınamadı, yerel veriyi kullanıyorum:', error);
    // Herhangi bir hata durumunda yerel veriyi kullan
    return vehiclesData as unknown as ElectricVehicle[];
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
