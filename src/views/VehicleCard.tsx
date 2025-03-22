"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type ElectricVehicle from '@/models/ElectricVehicle';

interface VehicleCardProps {
  vehicle: ElectricVehicle;
  onClick?: () => void;
}

const VehicleCard = memo(({ vehicle, onClick }: VehicleCardProps) => {
  const router = useRouter();
  // isPremium kontrolünü sadece stil sınıfları için kullanacağız
  const isPremium = vehicle.turkeyStatus?.comingSoon;

  // Marka ve modelden URL oluştur - özel karakterleri ve boşlukları doğru şekilde işle
  const getVehicleUrl = (vehicle: ElectricVehicle): string => {
    const brand = vehicle.brand.toLowerCase().trim();
    const model = vehicle.model.toLowerCase().trim().replace(/\s+/g, '-');
    const url = `/elektrikli-araclar/${brand}-${model}`;
    console.log(`URL oluşturuldu: ${vehicle.brand} ${vehicle.model} -> ${url}`);
    return url;
  };

  // Araç kartına tıklandığında detay sayfasına yönlendir
  const handleCardClick = () => {
    const url = getVehicleUrl(vehicle);
    router.push(url);
  };

  // Karşılaştırmaya araç ekleme fonksiyonu
  const handleAddToCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Parent div'in onClick'ini engelle
    
    try {
      // LocalStorage'da karşılaştırma verilerini kontrol et
      const storedVehicles = localStorage.getItem('compareVehicles');
      let compareVehicles: string[] = [];
      
      if (storedVehicles) {
        compareVehicles = JSON.parse(storedVehicles);
        
        // Eğer araç zaten karşılaştırma listesindeyse tekrar ekleme
        if (compareVehicles.includes(vehicle.id)) {
          console.log('Bu araç zaten karşılaştırma listenizde');
          router.push('/karsilastir');
          return;
        }
        
        // Maksimum 3 araç kontrolü
        if (compareVehicles.length >= 3) {
          // İlk aracı çıkar, yenisini ekle (1. araç yerine güncelleme)
          compareVehicles.shift();
        }
      }
      
      // Yeni aracı ekle
      compareVehicles.push(vehicle.id);
      
      // Güncellenmiş listeyi localStorage'a kaydet
      localStorage.setItem('compareVehicles', JSON.stringify(compareVehicles));
      console.log(`${vehicle.brand} ${vehicle.model} karşılaştırma listenize eklendi`);
      
      // Karşılaştırma sayfasına yönlendir
      router.push('/karsilastir');
    } catch (error) {
      console.error('Karşılaştırma listesi güncellenirken hata oluştu:', error);
    }
  };

  return (
    <div 
      onClick={handleCardClick} 
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200
                  hover:shadow-lg group cursor-pointer relative ${isPremium ? 'premium-vehicle' : ''}`}
    >
      {/* Resim Alanı */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          width={800}
          height={450}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Bilgi Alanı */}
      <div className="p-4">
        {/* Başlık ve Fiyat Bilgisi */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">
              {vehicle.year}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg text-gray-900">
              {new Intl.NumberFormat('tr-TR').format(vehicle.price.base)} {vehicle.price.currency === "TRY" ? "TL" : vehicle.price.currency}
            </p>
            <p className="text-xs text-gray-500">Başlangıç Fiyatı</p>
          </div>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Menzil</p>
            <p className="font-medium text-sm">{vehicle.range} km</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Şarj Süresi</p>
            <p className="font-medium text-sm">{vehicle.chargingTime.fastCharging.time10to80} dk</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Hızlanma</p>
            <p className="font-medium text-sm">{vehicle.performance.acceleration}s</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Maksimum Hız</p>
            <p className="font-medium text-sm">{vehicle.performance.topSpeed} km/s</p>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="flex items-center justify-between mt-4">
          <a 
            href={getVehicleUrl(vehicle)}
            className="z-10 inline-block bg-[#660566] hover:bg-[#4d0d4d] text-white text-center text-sm px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label={`${vehicle.brand} ${vehicle.model} aracını incele`}
            onClick={(e) => {
              e.stopPropagation(); // Parent div'in onClick'ini engelle
            }}
          >
            İncele
          </a>
          <button 
            className="border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            onClick={handleAddToCompare}
            aria-label={`${vehicle.brand} ${vehicle.model} aracını karşılaştırma listesine ekle`}
          >
            Karşılaştır
          </button>
        </div>
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard; 