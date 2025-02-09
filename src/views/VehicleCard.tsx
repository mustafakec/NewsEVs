"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import type ElectricVehicle from '@/models/ElectricVehicle';

interface VehicleCardProps {
  vehicle: ElectricVehicle;
  onClick?: () => void;
}

const VehicleCard = memo(({ vehicle, onClick }: VehicleCardProps) => {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200
                  hover:shadow-lg group cursor-pointer">
      {/* Resim */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={800}
          height={450}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* İçerik */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
            <p className="text-sm text-gray-500">{vehicle.year}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {new Intl.NumberFormat('tr-TR').format(vehicle.price.base)} {vehicle.price.currency}
            </p>
            <p className="text-sm text-gray-500">Başlangıç Fiyatı</p>
          </div>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Menzil</p>
            <p className="text-base font-medium text-gray-900">{vehicle.range} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Şarj Süresi</p>
            <p className="text-base font-medium text-gray-900">{vehicle.chargingTime.fastCharging.time10to80} dk</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Hızlanma</p>
            <p className="text-base font-medium text-gray-900">{vehicle.performance.acceleration}s</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Maksimum Hız</p>
            <p className="text-base font-medium text-gray-900">{vehicle.performance.topSpeed} km/s</p>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button className="flex-1 bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-2 rounded-lg
                         font-medium hover:opacity-90 transition-all duration-200">
            İncele
          </button>
          <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 
                         transition-colors duration-200 font-medium">
            Karşılaştır
          </button>
        </div>
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard; 