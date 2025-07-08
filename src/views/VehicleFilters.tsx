"use client";

import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { useElectricVehicleStore, CurrencyType, normalizeVehicleType } from '@/viewmodels/useElectricVehicles';
import { useVehicles } from '@/hooks/useVehicles';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import { useUserStore } from '@/stores/useUserStore';
import { log } from 'console';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Debounce hook - delays writing operation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Global style to prevent suggestions in input fields
const NoAutocompleteStyles = () => (
  <style jsx global>{`
    /* Disable automatic completion suggestions in all browsers */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #f9fafb inset !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    
    /* Hide suggestion indicators for Chrome, Safari, Edge */
    input::-webkit-calendar-picker-indicator,
    input::-webkit-list-button,
    input::-webkit-clear-button,
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      display: none !important;
    }
    
    /* Customize number inputs for Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
    
    /* Disable datalist suggestions */
    input::-webkit-contacts-auto-fill-button {
      visibility: hidden;
      display: none !important;
      pointer-events: none;
      height: 0;
      width: 0;
      margin: 0;
    }

    /* Make checkbox tick color purple */
    input[type="checkbox"]:checked {
      background-color: #660566 !important;
      border-color: #660566 !important;
    }
    
    input[type="checkbox"]:checked::before {
      color: white !important;
    }
    
    input[type="checkbox"]:checked::after {
      color: white !important;
    }
  `}</style>
);

// Accordion component (expandable/collapsible header)
const FilterAccordion = ({
  title,
  children,
  isOpen,
  onToggle
}: {
  title: string,
  children: React.ReactNode,
  isOpen: boolean,
  onToggle: () => void
}) => {
  return (
    <div className="border-b border-gray-200">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="font-medium text-gray-800">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600 focus:outline-none transition-transform duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div className={`px-4 pb-4 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

// Min-Max input component (for numeric values)
const MinMaxInput = ({
  onChangeMin,
  onChangeMax,
  minValue,
  maxValue,
  unit,
  placeholder = "",
  formatThousands = false
}: {
  onChangeMin: (value: string) => void,
  onChangeMax: (value: string) => void,
  minValue: string | number | undefined,
  maxValue: string | number | undefined,
  unit?: string,
  placeholder?: string,
  formatThousands?: boolean
}) => {
  // Local state management (to solve autocomplete issues)
  const [minInputValue, setMinInputValue] = useState('');
  const [maxInputValue, setMaxInputValue] = useState('');

  // Formatting function with thousands separator dot
  const formatWithThousandsSeparator = (value: string): string => {
    if (!formatThousands) return value;

    // Clear dots, take only numbers
    const cleanValue = value.replace(/\D/g, '');

    // Return empty string if empty
    if (cleanValue === '') return '';

    // Convert number with parseInt
    const number = parseInt(cleanValue, 10);

    // Create formatted string using thousands separator
    return number.toLocaleString('en-US');
  };

  // Function to convert formatted string to number
  const parseFormattedValue = (value: string): string => {
    if (!formatThousands) return value;

    // Remove all dots and commas, take only numbers
    return value.replace(/\D/g, '');
  };

  // Update state when props change
  useEffect(() => {
    if (minValue !== undefined) {
      setMinInputValue(formatThousands ? formatWithThousandsSeparator(String(minValue)) : String(minValue));
    }
  }, [minValue, formatThousands]);

  useEffect(() => {
    if (maxValue !== undefined) {
      setMaxInputValue(formatThousands ? formatWithThousandsSeparator(String(maxValue)) : String(maxValue));
    }
  }, [maxValue, formatThousands]);

  // Update min value only locally
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (formatThousands) {
      // Clear dots, then format
      const cleanValue = rawValue.replace(/\D/g, '');
      setMinInputValue(formatWithThousandsSeparator(cleanValue));
    } else {
      // Don't use formatting, only allow numbers
      const value = rawValue.replace(/[^0-9]/g, '');
      setMinInputValue(value);
    }
  };

  // Update max value only locally
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (formatThousands) {
      // Clear dots, then format
      const cleanValue = rawValue.replace(/\D/g, '');
      setMaxInputValue(formatWithThousandsSeparator(cleanValue));
    } else {
      // Don't use formatting, only allow numbers
      const value = rawValue.replace(/[^0-9]/g, '');
      setMaxInputValue(value);
    }
  };

  // When min input loses focus, send the actual value
  const handleMinBlur = () => {
    const actualValue = formatThousands ? parseFormattedValue(minInputValue) : minInputValue;
    onChangeMin(actualValue);
  };

  // When max input loses focus, send the actual value
  const handleMaxBlur = () => {
    const actualValue = formatThousands ? parseFormattedValue(maxInputValue) : maxInputValue;
    onChangeMax(actualValue);
  };

  // Handle key press for min/max inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isMin: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isMin) {
        handleMinBlur();
      } else {
        handleMaxBlur();
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Min {unit && `(${unit})`}
        </label>
        <input
          type="text"
          value={minInputValue}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          onKeyDown={(e) => handleKeyDown(e, true)}
          className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#660566] focus:border-[#660566]"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Max {unit && `(${unit})`}
        </label>
        <input
          type="text"
          value={maxInputValue}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          onKeyDown={(e) => handleKeyDown(e, false)}
          className="w-full border border-gray-300 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#660566] focus:border-[#660566]"
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

// Button options component
const ButtonOptions = ({
  options,
  selectedOption,
  onChange
}: {
  options: { label: string; value: string }[],
  selectedOption: string,
  onChange: (value: string) => void
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedOption === option.value
              ? 'bg-[#660566] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Currency selector component
const CurrencySelector = ({
  selectedCurrency,
  onChange
}: {
  selectedCurrency: CurrencyType,
  onChange: (currency: CurrencyType) => void
}) => {
  const currencies = [
    { label: 'TRY', value: 'TRY' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {currencies.map((currency) => (
        <button
          key={currency.value}
          type="button"
          onClick={() => onChange(currency.value as CurrencyType)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selectedCurrency === currency.value
              ? 'bg-[#660566] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {currency.label}
        </button>
      ))}
    </div>
  );
};

// Searchable dropdown component
const SearchableDropdown = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Select..."
}: {
  options: string[],
  selectedValue: string | undefined,
  onChange: (value: string | undefined) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    onChange(value === selectedValue ? undefined : value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded p-2 text-left text-sm focus:outline-none focus:ring-1 focus:ring-[#660566] focus:border-[#660566]"
      >
        {selectedValue || placeholder}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border-b border-gray-200 text-sm focus:outline-none"
            autoFocus
          />
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full text-left p-2 text-sm hover:bg-gray-50 ${
                selectedValue === option ? 'bg-[#660566] text-white' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Function to fetch vehicle brands from Supabase
const fetchBrands = async () => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('brand')
    .order('brand');

  if (error) {
    console.error('Error fetching brand data:', error);
    return [];
  }

  // Get unique brands
  const uniqueBrands = Array.from(new Set(data.map(item => item.brand)));
  return uniqueBrands;
};

// Function to fetch vehicle types from Supabase
const fetchVehicleTypes = async () => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('type')
    .order('type');

  if (error) {
    console.error('Error fetching vehicle types:', error);
    return [];
  }

  // Get unique types and filter out Van type
  const uniqueTypes = Array.from(new Set(data.map(item => item.type)));
  const filteredTypes = uniqueTypes.filter(type => type.toLowerCase() !== 'van');
  return filteredTypes;
};

const reverseTypeMapping: Record<string, string> = {
  'Truck': 'Kamyonet',
  'Motorcycle': 'Motosiklet',
  'Bus': 'Otobüs',
  'Sports': 'Spor',
  'Commercial': 'Ticari',
  'Hatchback': 'Hatchback',
  'MPV': 'MPV',
  'Pickup': 'Pickup',
  'Scooter': 'Scooter',
  'Sedan': 'Sedan',
  'Station Wagon': 'Station Wagon',
  'SUV': 'SUV',
};

// İngilizce type mapping (sadece İngilizce değerler)
const typeVariants: Record<string, string[]> = {
  'Truck': ['Truck'],
  'Bus': ['Bus'],
  'Commercial': ['Commercial'],
  'Motorcycle': ['Motorcycle'],
  'Sports': ['Sports'],
  'Van': ['Van'],
  'Hatchback': ['Hatchback'],
  'MPV': ['MPV'],
  'Pickup': ['Pickup'],
  'Scooter': ['Scooter'],
  'Sedan': ['Sedan'],
  'Station Wagon': ['Station Wagon'],
  'SUV': ['SUV'],
};

// Türkçe -> İngilizce araç tipi çeviri tablosu
const vehicleTypeTranslations: Record<string, string> = {
  "Hatchback": "Hatchback",
  "Kamyonet": "Truck",
  "Motosiklet": "Motorcycle",
  "MPV": "MPV",
  "Otobüs": "Bus",
  "Pickup": "Pickup",
  "Scooter": "Scooter",
  "Sedan": "Sedan",
  "Spor": "Sports",
  "Station Wagon": "Station Wagon",
  "SUV": "SUV",
  "Ticari": "Commercial",
  "Van": "Truck",
};

// Main Filter Component
const VehicleFilters = () => {
  const {
    temporaryFilters,
    setTemporaryFilters,
    applyFilters,
    filters
  } = useElectricVehicleStore();

  const [filterPanels, setFilterPanels] = useState({
    brand: false,
    price: false,
    battery: false,
    range: false,
    specs: false,
  });

  const [brandSearch, setBrandSearch] = useState('');

  // URL'den gelen araç tipini al ve temporaryFilters'a senkronize et
  useEffect(() => {
    if (filters.vehicleType && !temporaryFilters.vehicleType) {
      setTemporaryFilters({ vehicleType: filters.vehicleType });
    }
  }, [filters.vehicleType, temporaryFilters.vehicleType, setTemporaryFilters]);

  // Use React Query for brands and vehicle types
  const { data: brands = [] } = useQuery({
    queryKey: ['vehicleBrands'],
    queryFn: fetchBrands,
    staleTime: Infinity, // Can be cached indefinitely since brand list doesn't change
  });

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: fetchVehicleTypes,
    staleTime: Infinity, // Can be cached indefinitely since type list doesn't change
  });

  // State and toggle function for filter panel states
  const toggleFilterPanel = (panel: keyof typeof filterPanels) => {
    setFilterPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  // Function to change brand filter
  const handleBrandChange = (brand: string) => {
    if (temporaryFilters.brand === brand) {
      // Remove filter if same brand is clicked again
      setTemporaryFilters({ brand: undefined });
    } else {
      // Add to filter if new brand is selected
      setTemporaryFilters({ brand });
    }
    // Apply immediately
    applyFilters();
  };

  // Function to change vehicle type filter
  const handleVehicleTypeChange = (vehicleType: string) => {
    const variants = typeVariants[vehicleType] || [vehicleType];
    
    // Seçili filtre kontrolü - hem string hem array için
    const isCurrentlySelected = (() => {
      if (!temporaryFilters.vehicleType) return false;
      
      if (Array.isArray(temporaryFilters.vehicleType)) {
        return temporaryFilters.vehicleType.some(v => typeVariants[vehicleType]?.includes(v));
      } else {
        return typeVariants[vehicleType]?.includes(temporaryFilters.vehicleType) || temporaryFilters.vehicleType === vehicleType;
      }
    })();
    
    if (isCurrentlySelected) {
      setTemporaryFilters({ vehicleType: undefined });
    } else {
      setTemporaryFilters({ vehicleType: variants });
    }
    applyFilters();
  };

  // Function to change range (value range) filters
  const handleRangeFilterChange = (type: string, value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    switch (type) {
      case 'minPrice':
      case 'maxPrice':
      case 'minBatteryCapacity':
      case 'maxBatteryCapacity':
      case 'minRange':
      case 'maxRange':
      case 'minConsumption':
      case 'maxConsumption':
      case 'minChargeSpeed':
      case 'maxChargeSpeed':
        setTemporaryFilters({ [type]: numValue });
        break;
    }
  };

  // Function to change checkbox filters
  const handleCheckboxFilterChange = (type: string, value: string | boolean) => {
    switch (type) {
      case 'heatPump':
        setTemporaryFilters({ heatPump: value ? 'yes' : undefined });
        break;
      case 'v2l':
        setTemporaryFilters({ v2l: value ? 'yes' : undefined });
        break;

      case 'comingSoon':
        setTemporaryFilters({ comingSoon: value === true });
        break;
    }
  };

  // Submit filter form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setTemporaryFilters({
      brand: undefined,
      vehicleType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minBatteryCapacity: undefined,
      maxBatteryCapacity: undefined,
      minRange: undefined,
      maxRange: undefined,
      minConsumption: undefined,
      maxConsumption: undefined,
      minChargeSpeed: undefined,
      maxChargeSpeed: undefined,
      heatPump: undefined,
      v2l: undefined,

      comingSoon: undefined,
    });
    // Apply immediately
    applyFilters();
  };

  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const normalizedVehicleTypes = Array.from(new Set(vehicleTypes.map(type => normalizeVehicleType(type))));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Filters</h2>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-sm text-[#660566] hover:text-[#4d044d] transition-colors"
        >
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Brand Filter */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('brand')}
          >
            <h3 className="font-medium">Brands</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.brand ? 'transform rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {filterPanels.brand && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-100 pr-1">
              <input type="text"
                className="border border-gray-300 h-8 w-full rounded-lg outline-none px-3 text-sm"
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)} />
              {filteredBrands.map((brand) => (
                <div className="flex items-center" key={brand}>
                  <button
                    type="button"
                    onClick={() => handleBrandChange(brand)}
                    className={`w-full text-left py-1 rounded text-sm ${temporaryFilters.brand === brand
                      ? 'bg-purple-100 text-[#660566] font-medium px-2'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    {brand}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Type Filter */}
        <div>
          <h3 className="font-medium mb-2">Vehicle Type</h3>
          <div className="flex flex-wrap gap-2">
            {normalizedVehicleTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleVehicleTypeChange(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${(() => {
                  if (!temporaryFilters.vehicleType) return false;
                  if (Array.isArray(temporaryFilters.vehicleType)) {
                    return temporaryFilters.vehicleType.some(v => typeVariants[type]?.includes(v));
                  } else {
                    return typeVariants[type]?.includes(temporaryFilters.vehicleType) || temporaryFilters.vehicleType === type;
                  }
                })()
                  ? 'bg-[#660566] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {vehicleTypeTranslations[type] || type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('price')}
          >
            <h3 className="font-medium">Price Range</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.price ? 'transform rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {filterPanels.price && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-xs text-gray-500"
                >
                  Min ($)
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={temporaryFilters.minPrice || ''}
                  onChange={(e) => handleRangeFilterChange('minPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Min"
                />
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-xs text-gray-500"
                >
                  Max ($)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={temporaryFilters.maxPrice || ''}
                  onChange={(e) => handleRangeFilterChange('maxPrice', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          )}
        </div>

        {/* Battery Capacity */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('battery')}
          >
            <h3 className="font-medium">Battery Capacity</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.battery ? 'transform rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {filterPanels.battery && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="minBatteryCapacity"
                  className="block text-xs text-gray-500"
                >
                  Min (kWh)
                </label>
                <input
                  type="number"
                  id="minBatteryCapacity"
                  value={temporaryFilters.minBatteryCapacity || ''}
                  onChange={(e) => handleRangeFilterChange('minBatteryCapacity', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Min"
                />
              </div>
              <div>
                <label
                  htmlFor="maxBatteryCapacity"
                  className="block text-xs text-gray-500"
                >
                  Max (kWh)
                </label>
                <input
                  type="number"
                  id="maxBatteryCapacity"
                  value={temporaryFilters.maxBatteryCapacity || ''}
                  onChange={(e) => handleRangeFilterChange('maxBatteryCapacity', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          )}
        </div>

        {/* Range */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('range')}
          >
            <h3 className="font-medium">Range</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.range ? 'transform rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {filterPanels.range && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="minRange"
                  className="block text-xs text-gray-500"
                >
                  Min (km)
                </label>
                <input
                  type="number"
                  id="minRange"
                  value={temporaryFilters.minRange || ''}
                  onChange={(e) => handleRangeFilterChange('minRange', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Min"
                />
              </div>
              <div>
                <label
                  htmlFor="maxRange"
                  className="block text-xs text-gray-500"
                >
                  Max (km)
                </label>
                <input
                  type="number"
                  id="maxRange"
                  value={temporaryFilters.maxRange || ''}
                  onChange={(e) => handleRangeFilterChange('maxRange', e.target.value)}
                  className="w-full border border-gray-300 rounded p-1.5 text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          )}
        </div>

        {/* Other Features */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('specs')}
          >
            <h3 className="font-medium">Other Features</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.specs ? 'transform rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {filterPanels.specs && (
            <div className="mt-2 space-y-2">
              {/* Heat Pump */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="heatPumpYes"
                  checked={temporaryFilters.heatPump === 'yes'}
                  onChange={(e) => handleCheckboxFilterChange('heatPump', e?.target?.checked ? 'yes' : false)}
                  className="w-4 h-4 text-[#660566] rounded border-gray-300 focus:ring-[#660566]"
                />
                <label
                  htmlFor="heatPumpYes"
                  className="ml-2 text-sm text-gray-700"
                >
                  Has Heat Pump
                </label>
              </div>

              {/* V2L */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="v2lYes"
                  checked={temporaryFilters.v2l === 'yes'}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleCheckboxFilterChange('v2l', e.currentTarget.checked ? 'yes' : false)}
                  className="w-4 h-4 text-[#660566] rounded border-gray-300 focus:ring-[#660566]"
                />
                <label
                  htmlFor="v2lYes"
                  className="ml-2 text-sm text-gray-700"
                >
                  Has V2L
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-[#660566] to-[#330233] text-white rounded-md text-sm font-medium hover:opacity-90 transition-colors duration-200"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
};

/* Add CSS Animation style */
<style jsx global>{`
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-shine {
    animation: shine 1.5s infinite;
  }
`}</style>

export default VehicleFilters;
