"use client";

import React, { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ElectricVehicle } from '@/models/ElectricVehicle';
import { toSlug } from '@/utils/vehicleUtils';
import { cloudinaryUtils } from '@/lib/cloudinary';
import { useVehicleCardImage } from '@/hooks/useCloudinaryImage';
import { formatCurrency } from '@/components/VehicleClientContent';
import { customPrices } from '@/constants/customPrices';
import { customNames } from '@/constants/customPrices';

interface VehicleCardProps {
  vehicle: ElectricVehicle;
  onClick?: () => void;
}

const VehicleCard = memo(({ vehicle, onClick }: VehicleCardProps) => {
  const router = useRouter();
  const [price, setPrice] = useState<{ base: number; currency: string } | null>(null);
  
  // Cloudinary optimization
  const { optimizedUrl } = useVehicleCardImage(vehicle.images?.[0]);

  // Check if it's a Cloudinary URL
  const isCloudinaryUrl = vehicle.images?.[0]?.includes('cloudinary.com') || false;

  // Fiyatı customPrices ile override et
  const customPrice = customPrices[vehicle.id];

  // Fetch price information
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicle.id}/price`);
        if (response.ok) {
          const priceData = await response.json();
          setPrice(priceData);
        }
      } catch (error) {
        console.error('Error fetching price information:', error);
      }
    };

    if (vehicle.id) {
      fetchPrice();
    }
  }, [vehicle.id]);

  // Create URL from brand and model - handle special characters and spaces correctly
  const getVehicleUrl = (vehicle: ElectricVehicle): string => {
    const slug = toSlug(`${vehicle.brand}-${vehicle.model}`);
    const url = `/electric-vehicles/${slug}`;
    return url;
  };

  // Navigate to detail page when vehicle card is clicked
  const handleCardClick = () => {
    const url = getVehicleUrl(vehicle);
    router.push(url);
  };

  // Direct navigation when View button is clicked
  const handleViewClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getVehicleUrl(vehicle);
    router.push(url);
  };

  // Function to add vehicle to comparison
  const handleAddToCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent div's onClick

    try {
      // Check comparison data in localStorage
      const storedVehicles = localStorage.getItem('compareVehicles');
      let compareVehicles: string[] = [];

      if (storedVehicles) {
        compareVehicles = JSON.parse(storedVehicles);

        // Don't add again if vehicle is already in comparison list
        if (compareVehicles.includes(vehicle.id)) {
          router.push('/compare');
          return;
        }

        // Maximum 3 vehicles check
        if (compareVehicles.length >= 3) {
          // Remove first vehicle, add new one (update instead of first vehicle)
          compareVehicles.shift();
        }
      }

      // Add new vehicle
      compareVehicles.push(vehicle.id);

      // Save updated list to localStorage
      localStorage.setItem('compareVehicles', JSON.stringify(compareVehicles));

      // Navigate to comparison page
      router.push('/compare');
    } catch (error) {
      console.error('Error updating comparison list:', error);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer group hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300"
      >
        {/* Image Area */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={optimizedUrl?.trim() || '/images/car-placeholder.jpg'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            width={800}
            height={450}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
            loading="lazy"
            unoptimized={isCloudinaryUrl}
          />
          
 
        </div>

        {/* Information Area */}
        <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
          {/* Title and Price Information */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {vehicle.brand} {customNames[vehicle.id] || vehicle.model}
              </h3>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg text-gray-900">
                {typeof customPrice === 'number' ? (
                  `$${customPrice.toLocaleString('en-US')}`
                ) : price?.base ? (
                  formatCurrency(price.base, price.currency)
                ) : (
                  'No Price Information'
                )}
              </p>
              <p className="text-xs text-gray-500">Starting Price</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Range</p>
              <p className="font-medium text-sm">
                {vehicle.range
                  ? `${vehicle.range} km`
                  : 'Not Specified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Torque</p>
              <p className="font-medium text-sm">
                {vehicle.performance?.torque
                  ? `${vehicle.performance.torque} Nm`
                  : 'Not Specified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Drive Type</p>
              <p className="font-medium text-sm">
                {vehicle.performance?.driveType || 'Not Specified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Top Speed</p>
              <p className="font-medium text-sm">
                {vehicle.performance?.topSpeed
                  ? `${vehicle.performance.topSpeed} km/h`
                  : 'Not Specified'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">0-100 km/h</p>
              <p className="font-medium text-sm">
                {vehicle.performance?.acceleration
                  ? `${vehicle.performance.acceleration}s`
                  : 'Not Specified'}
              </p>
            </div>
          </div>

          {/* Features List */}
          {/* <div className="mt-4">
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
          </div> */}

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between mt-4">
            <a
              href={getVehicleUrl(vehicle)}
              className="z-10 inline-block bg-[#660566] hover:bg-[#4d0d4d] text-white text-center text-sm px-5 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
              aria-label={`View ${vehicle.brand} ${vehicle.model} vehicle`}
              onClick={handleViewClick}
            >
              View
            </a>
            <button
              className="border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              onClick={handleAddToCompare}
              aria-label={`Add ${vehicle.brand} ${vehicle.model} vehicle to comparison list`}
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
