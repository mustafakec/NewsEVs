import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import ElectricVehicle from '@/models/ElectricVehicle';

interface ElectricVehicleStore {
  selectedVehicle: ElectricVehicle | null;
  setSelectedVehicle: (vehicle: ElectricVehicle | null) => void;
  filters: {
    brand?: string;
    minRange?: number;
    maxPrice?: number;
  };
  setFilters: (filters: Partial<ElectricVehicleStore['filters']>) => void;
}

// Zustand store
export const useElectricVehicleStore = create<ElectricVehicleStore>((set) => ({
  selectedVehicle: null,
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  filters: {},
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
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
  const { data: vehicles, isLoading, error } = useElectricVehicles();
  const filters = useElectricVehicleStore((state) => state.filters);

  const filteredVehicles = vehicles?.filter((vehicle) => {
    if (filters.brand && vehicle.brand !== filters.brand) return false;
    if (filters.minRange && vehicle.range < filters.minRange) return false;
    if (filters.maxPrice && vehicle.price.base > filters.maxPrice) return false;
    return true;
  });

  return {
    vehicles: filteredVehicles,
    isLoading,
    error,
  };
}; 