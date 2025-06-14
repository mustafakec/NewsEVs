import { createClient } from '@supabase/supabase-js';
import { ElectricVehicle } from '@/models/ElectricVehicle';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DatabaseImage {
  url: string;
}

interface DatabaseFeature {
  name: string;
  is_extra: boolean;
}

interface DatabasePerformance {
  power: number; // Motor Gücü (HP)
  torque: number; // Tork (Nm)
  drive_type: string; // Sürüş Sistemi
  top_speed: number; // Azami Hız (km/s)
  acceleration: number; // 0-100 km/s (saniye)
}

export const ElectricVehicleService = {
  async getAllVehicles(): Promise<ElectricVehicle[]> {
    const { data: vehicles, error } = await supabase
      .from('electric_vehicles')
      .select(`
        *,
        charging_times (*),
        performances (*),
        dimensions (*),
        efficiencies (*),
        comforts (*),
        prices (*),
        warranties (*),
        turkey_statuses (*),
        environmental_impacts (*),
        images (*),
        features (*)
      `);

    if (error) throw error;

    console.log('=== SUPABASE DEBUG ===');
    console.log('First Vehicle Turkey Status:', vehicles[0]?.turkey_statuses);
    console.log('===========================');

    return vehicles.map(vehicle => {
      console.log('=== VEHICLE MAPPING DEBUG ===');
      console.log('Vehicle ID:', vehicle.id);
      console.log('Raw Turkey Status:', vehicle.turkey_statuses);
      console.log('===========================');

      const mappedVehicle = {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        range: vehicle.range,
        batteryCapacity: vehicle.battery_capacity,
        heatPump: vehicle.heat_pump?.toLowerCase(),
        v2l: vehicle.v2l,
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
          power: vehicle.performances.power,
          torque: vehicle.performances.torque,
          driveType: vehicle.performances.drive_type,
          topSpeed: vehicle.performances.top_speed,
          acceleration: vehicle.performances.acceleration
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
        warranty: vehicle.warranties ? {
          battery: vehicle.warranties.battery,
          vehicle: vehicle.warranties.vehicle,
          maxKm: vehicle.warranties.max_km
        } : undefined,
        turkeyStatuses: {
          available: Boolean(vehicle.turkey_statuses?.available),
          comingSoon: Boolean(vehicle.turkey_statuses?.coming_soon),
          estimatedArrival: vehicle.turkey_statuses?.estimated_arrival || null
        },
        environmentalImpact: vehicle.environmental_impacts ? {
          co2Savings: vehicle.environmental_impacts.co2_savings,
          recyclableMaterials: vehicle.environmental_impacts.recyclable_materials,
          greenEnergyPartnership: vehicle.environmental_impacts.green_energy_partnership
        } : undefined,
        images: vehicle.images?.map((img: DatabaseImage) => img.url),
        features: vehicle.features?.map((feature: DatabaseFeature) => ({
          name: feature.name,
          isExtra: feature.is_extra
        }))
      };

      console.log('=== MAPPED VEHICLE DEBUG ===');
      console.log('Mapped Turkey Status:', mappedVehicle.turkeyStatuses);
      console.log('===========================');

      return mappedVehicle;
    });
  },

  async getVehicleById(id: string): Promise<ElectricVehicle | null> {
    const { data: vehicle, error } = await supabase
      .from('electric_vehicles')
      .select(`
        *,
        charging_times (*),
        performances (*),
        dimensions (*),
        efficiencies (*),
        comforts (*),
        prices (*),
        warranties (*),
        turkey_statuses (*),
        environmental_impacts (*),
        images (*),
        features (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!vehicle) return null;

    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      range: vehicle.range,
      batteryCapacity: vehicle.battery_capacity,
      heatPump: vehicle.heat_pump?.toLowerCase(),
      v2l: vehicle.v2l,
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
      warranty: vehicle.warranties ? {
        battery: vehicle.warranties.battery,
        vehicle: vehicle.warranties.vehicle,
        maxKm: vehicle.warranties.max_km
      } : undefined,
      turkeyStatuses: {
        available: Boolean(vehicle.turkey_statuses?.available),
        comingSoon: Boolean(vehicle.turkey_statuses?.coming_soon),
        estimatedArrival: vehicle.turkey_statuses?.estimated_arrival || null
      },
      environmentalImpact: vehicle.environmental_impacts ? {
        co2Savings: vehicle.environmental_impacts.co2_savings,
        recyclableMaterials: vehicle.environmental_impacts.recyclable_materials,
        greenEnergyPartnership: vehicle.environmental_impacts.green_energy_partnership
      } : undefined,
      images: vehicle.images?.map((img: DatabaseImage) => img.url),
      features: vehicle.features?.map((feature: DatabaseFeature) => ({
        name: feature.name,
        isExtra: feature.is_extra
      }))
    };
  },

  async getVehiclePriceById(id: string): Promise<{ base: number; currency: string } | null> {
    const { data: price, error } = await supabase
      .from('prices')
      .select('base, currency')
      .eq('vehicle_id', id)
      .single();

    if (error) throw error;
    if (!price) return null;

    return {
      base: price.base,
      currency: price.currency
    };
  }
}; 