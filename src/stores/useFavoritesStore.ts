import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type ElectricVehicle from '@/models/ElectricVehicle';

interface FavoritesState {
  favorites: ElectricVehicle[];
  addFavorite: (vehicle: ElectricVehicle) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (vehicle) => {
        const { favorites } = get();
        if (!favorites.find(f => f.id === vehicle.id)) {
          set({ favorites: [...favorites, vehicle] });
        }
      },
      
      removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(f => f.id !== id) });
      },
      
      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some(f => f.id === id);
      }
    }),
    {
      name: 'favorites-storage',
    }
  )
); 