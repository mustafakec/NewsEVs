"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useUserStore } from '@/stores/useUserStore';
import type ElectricVehicle from '@/models/ElectricVehicle';

interface FavoriteButtonProps {
  vehicle: ElectricVehicle;
}

export default function FavoriteButton({ vehicle }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { isLoggedIn } = useUserStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      // AuthModal'ı göster
      const event = new Event('show-auth-modal');
      window.dispatchEvent(event);
      return;
    }

    setIsAnimating(true);
    const isFav = isFavorite(vehicle.id);
    
    if (isFav) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const isFav = isFavorite(vehicle.id);

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-200
        ${isFav 
          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
    >
      <motion.div
        animate={isAnimating ? { rotate: [0, 360] } : {}}
        transition={{ duration: 0.3 }}
      >
        {isFav ? <FaStar className="w-4 h-4" /> : <FaRegStar className="w-4 h-4" />}
      </motion.div>
      <span className="text-sm font-medium">
        {isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
      </span>
    </motion.button>
  );
} 