"use client";

import { useState } from 'react';
import { useElectricVehicleStore } from '@/viewmodels/useElectricVehicles';

const VehicleFilters = () => {
  const { filters, setFilters } = useElectricVehicleStore();
  const [isOpen, setIsOpen] = useState(true);

  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters({ [key]: value === '' ? undefined : value });
  };

  const handleApplyFilters = () => {
    // Implementation of handleApplyFilters
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Araç Filtreleri</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Marka */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Marka
            </label>
            <input
              type="text"
              placeholder="Marka ara..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                       focus:border-transparent transition-all duration-200"
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              value={filters.brand || ''}
            />
          </div>

          {/* Minimum Menzil */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Menzil
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                         focus:border-transparent transition-all duration-200"
                onChange={(e) => handleFilterChange('minRange', Number(e.target.value))}
                value={filters.minRange || ''}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-500">km</span>
              </div>
            </div>
          </div>

          {/* Maksimum Fiyat */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Maksimum Fiyat
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 
                         focus:border-transparent transition-all duration-200"
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                value={filters.maxPrice || ''}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-gray-500">TRY</span>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Özellikler
            </label>
            <div className="space-y-2">
              {[
                'Hızlı Şarj',
                'Pilot Sürüş',
                'Panoramik Cam Tavan',
                'Deri Koltuk'
              ].map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer
                           hover:bg-gray-100 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 border-gray-300 rounded text-purple-600 
                             focus:ring-purple-500/20 cursor-pointer"
                  />
                  <span className="text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtre Butonları */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleApplyFilters}
              className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-6 py-2 rounded-lg
                     hover:opacity-90 transition-all duration-200 font-medium"
            >
              Uygula
            </button>
            <button
              type="button"
              className="px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 
                       transition-colors duration-200 font-medium focus:outline-none 
                       focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2"
              onClick={() => {
                setFilters({});
              }}
            >
              Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleFilters; 