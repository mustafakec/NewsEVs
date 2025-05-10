"use client";

import React, { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ElectricVehicle } from '@/models/ElectricVehicle';
import { toSlug } from '@/utils/vehicleUtils';

interface VehicleCardProps {
  vehicle: ElectricVehicle;
  onClick?: () => void;
}

const VehicleCard = memo(({ vehicle, onClick }: VehicleCardProps) => {
  const router = useRouter();
  const [price, setPrice] = useState<{ base: number; currency: string } | null>(null);

  // Fiyat bilgisini çek
  useEffect(() => {
    const fetchPrice = async () => {
      if (!vehicle?.id) return;

      try {
        const response = await fetch(`/api/vehicles/${vehicle.id}/price`);
        if (!response.ok) throw new Error('Fiyat bilgisi alınamadı');

        const data = await response.json();
        setPrice(data);
      } catch (error) {
        console.error('Fiyat bilgisi çekilirken hata oluştu:', error);
      }
    };

    fetchPrice();
  }, [vehicle?.id]);

  // isPremium kontrolünü sadece stil sınıfları için kullanacağız
  const isPremium = vehicle.turkeyStatus?.comingSoon;

  // Marka ve modelden URL oluştur - özel karakterleri ve boşlukları doğru şekilde işle
  const getVehicleUrl = (vehicle: ElectricVehicle): string => {
    const slug = toSlug(`${vehicle.brand}-${vehicle.model}`);
    const url = `/elektrikli-araclar/${slug}`;
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
          src={vehicle.images && vehicle.images.length > 0
            ? vehicle.images[0]?.url
            : '/images/car-placeholder.jpg'}
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
              {price?.base ? (
                <>
                  {new Intl.NumberFormat('tr-TR').format(price.base)} {price.currency === "TRY" ? "TL" : price.currency}
                </>
              ) : (
                'Fiyat Bilgisi Yok'
              )}
            </p>
            <p className="text-xs text-gray-500">Başlangıç Fiyatı</p>
          </div>
        </div>

        {/* Özellikler */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Motor Gücü</p>
            <p className="font-medium text-sm">
              {vehicle.performance?.power
                ? `${vehicle.performance.power} HP`
                : 'Belirtilmemiş'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tork</p>
            <p className="font-medium text-sm">
              {vehicle.performance?.torque
                ? `${vehicle.performance.torque} Nm`
                : 'Belirtilmemiş'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Sürüş Sistemi</p>
            <p className="font-medium text-sm">
              {vehicle.performance?.driveType || 'Belirtilmemiş'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Azami Hız</p>
            <p className="font-medium text-sm">
              {vehicle.performance?.topSpeed
                ? `${vehicle.performance.topSpeed} km/s`
                : 'Belirtilmemiş'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">0-100 km/s</p>
            <p className="font-medium text-sm">
              {vehicle.performance?.acceleration
                ? `${vehicle.performance.acceleration}s`
                : 'Belirtilmemiş'}
            </p>
          </div>
        </div>

        {/* Özellikler Listesi */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {vehicle.features?.map((feature: { name: string; isExtra: boolean }, index: number) => (
              <span
                key={`feature-${index}`}
                className={`text-xs px-2 py-1 rounded-full ${feature.isExtra
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {feature.name}
              </span>
            ))}
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