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
        turkeyStatuses: vehicle.turkey_statuses ? {
          available: vehicle.turkey_statuses.available,
          comingSoon: vehicle.turkey_statuses.coming_soon,
          estimatedArrival: vehicle.turkey_statuses.estimated_arrival
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
        chargingTime: vehicle.charging_times ? {
          ac: vehicle.charging_times.ac,
          dc: vehicle.charging_times.dc,
          fastCharging: {
            power: vehicle.charging_times.fast_charging_power,
            time10to80: vehicle.charging_times.fast_charging_time_10_to_80,
          },
          acTime: vehicle.charging_times.ac_time,
        } : undefined,
        efficiency: vehicle.efficiencies ? {
          consumption: vehicle.efficiencies.consumption,
          regenerativeBraking: vehicle.efficiencies.regenerative_braking,
          ecoMode: vehicle.efficiencies.eco_mode,
          energyRecovery: vehicle.efficiencies.energy_recovery
        } : undefined,
        comfort: vehicle.comforts ? {
          seatingCapacity: vehicle.comforts.seating_capacity,
          screens: vehicle.comforts.screens,
          soundSystem: vehicle.comforts.sound_system,
          autonomousLevel: vehicle.comforts.autonomous_level,
          parkAssist: vehicle.comforts.park_assist,
          climateControl: vehicle.comforts.climate_control,
          heatedSeats: vehicle.comforts.heated_seats,
          navigation: vehicle.comforts.navigation,
          parkingSensors: vehicle.comforts.parking_sensors
        } : undefined,
        price: vehicle.prices ? {
          base: vehicle.prices.base,
          currency: vehicle.prices.currency,
          withOptions: vehicle.prices.with_options,
          leasingMonthly: vehicle.prices.leasing_monthly,
          leasingDuration: vehicle.prices.leasing_duration,
          leasingDownPayment: vehicle.prices.leasing_down_payment
        } : undefined,
        images: vehicle.images?.map((img: any) => img.url),
        warranty: vehicle.warranties,
        heatPump: vehicle.heat_pump?.toLowerCase(),
        v2l: vehicle.v2l,
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
    refetchOnWindowFocus: false, // Pencere odağı değiştiğinde yeniden çekme 
  });
} 
