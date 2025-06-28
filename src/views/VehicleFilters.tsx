"use client";

import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { useElectricVehicleStore, CurrencyType } from '@/viewmodels/useElectricVehicles';
import { useVehicles } from '@/hooks/useVehicles';
import type { ElectricVehicle } from '@/models/ElectricVehicle';
import { useUserStore } from '@/stores/useUserStore';
import { log } from 'console';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Debounce hook'u - yazma işlemini geciktirir
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

// Giriş alanlarında önerileri engellemek için global stil
const NoAutocompleteStyles = () => (
  <style jsx global>{`
    /* Tüm tarayıcılarda otomatik tamamlama önerilerini devre dışı bırakma */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px #f9fafb inset !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    
    /* Chrome, Safari, Edge için öneri göstergelerini gizleme */
    input::-webkit-calendar-picker-indicator,
    input::-webkit-list-button,
    input::-webkit-clear-button,
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      display: none !important;
    }
    
    /* Firefox için sayı girişlerini özelleştirme */
    input[type="number"] {
      -moz-appearance: textfield;
    }
    
    /* Dataist önerilerini devre dışı bırakma */
    input::-webkit-contacts-auto-fill-button {
      visibility: hidden;
      display: none !important;
      pointer-events: none;
      height: 0;
      width: 0;
      margin: 0;
    }

    /* Checkbox tick rengini mor yapma */
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

// Accordion bileşeni (açılır/kapanır başlık)
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

// Min-Max input bileşeni (sayısal değerler için)
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
  // Lokal state yönetimi (autocomplete sorununu çözmek için)
  const [minInputValue, setMinInputValue] = useState('');
  const [maxInputValue, setMaxInputValue] = useState('');

  // Binlik ayırıcı nokta ile formatlama fonksiyonu
  const formatWithThousandsSeparator = (value: string): string => {
    if (!formatThousands) return value;

    // Noktaları temizle, sadece sayıları al
    const cleanValue = value.replace(/\D/g, '');

    // Boş string ise boş string döndür
    if (cleanValue === '') return '';

    // Sayıyı parseInt ile çevir
    const number = parseInt(cleanValue, 10);

    // Binlik ayraç kullanarak formatlı string oluştur
    return number.toLocaleString('tr-TR');
  };

  // Formatlı stringi sayıya çevirme fonksiyonu
  const parseFormattedValue = (value: string): string => {
    if (!formatThousands) return value;

    // Tüm nokta ve virgülleri kaldır, sadece sayıları al
    return value.replace(/\D/g, '');
  };

  // Props değiştiğinde state'i güncelle
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

  // Min değerini sadece lokalde güncelle
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (formatThousands) {
      // Noktaları temizle, sonra formatlı hale getir
      const cleanValue = rawValue.replace(/\D/g, '');
      setMinInputValue(formatWithThousandsSeparator(cleanValue));
    } else {
      // Formatlamayı kullanma, sadece sayıları izin ver
      const value = rawValue.replace(/[^0-9]/g, '');
      setMinInputValue(value);
    }
  };

  // Max değerini sadece lokalde güncelle
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (formatThousands) {
      // Noktaları temizle, sonra formatlı hale getir
      const cleanValue = rawValue.replace(/\D/g, '');
      setMaxInputValue(formatWithThousandsSeparator(cleanValue));
    } else {
      // Formatlamayı kullanma, sadece sayıları izin ver
      const value = rawValue.replace(/[^0-9]/g, '');
      setMaxInputValue(value);
    }
  };

  // Input alanından çıkıldığında (blur) değeri aktar
  const handleMinBlur = () => {
    const parsedValue = parseFormattedValue(minInputValue);

    if (parsedValue !== String(minValue)) {
      onChangeMin(parsedValue);
    }
  };

  // Input alanından çıkıldığında (blur) değeri aktar
  const handleMaxBlur = () => {
    const parsedValue = parseFormattedValue(maxInputValue);

    if (parsedValue !== String(maxValue)) {
      onChangeMax(parsedValue);
    }
  };

  // Enter tuşuna basıldığında form gönderimi
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isMin: boolean) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const parsedValue = isMin
        ? parseFormattedValue(minInputValue)
        : parseFormattedValue(maxInputValue);

      if (isMin && parsedValue !== String(minValue)) {
        onChangeMin(parsedValue);
      } else if (!isMin && parsedValue !== String(maxValue)) {
        onChangeMax(parsedValue);
      }

      // Input odağını kaldır
      (e.target as HTMLInputElement).blur();
    }
  };

  // Rastgele id'ler oluştur (her render için benzersiz olacak)
  const minId = React.useMemo(() => `min-${Math.random().toString(36).substring(2, 9)}`, []);
  const maxId = React.useMemo(() => `max-${Math.random().toString(36).substring(2, 9)}`, []);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          id={minId}
          name={minId}
          type="text"
          inputMode="numeric"
          placeholder="Min"
          value={minInputValue}
          onChange={handleMinChange}
          onBlur={handleMinBlur}
          onKeyDown={(e) => handleKeyDown(e, true)}
          className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                  placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/20 
                  focus:border-purple-500/30 transition-all duration-200 text-sm"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          role="presentation"
          aria-autocomplete="none"
        />
        {unit && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xs">{unit}</span>
          </div>
        )}
      </div>
      <span className="text-gray-400">-</span>
      <div className="relative flex-1">
        <input
          id={maxId}
          name={maxId}
          type="text"
          inputMode="numeric"
          placeholder="Max"
          value={maxInputValue}
          onChange={handleMaxChange}
          onBlur={handleMaxBlur}
          onKeyDown={(e) => handleKeyDown(e, false)}
          className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                  placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/20 
                  focus:border-purple-500/30 transition-all duration-200 text-sm"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          role="presentation"
          aria-autocomplete="none"
        />
        {unit && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <span className="text-gray-400 text-xs">{unit}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Buton seçenek grubu bileşeni
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
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`py-2 px-2 rounded-lg text-sm font-medium border transition-colors duration-150 ${selectedOption === option.value
            ? 'bg-purple-100 border-purple-300 text-purple-800'
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          onClick={() => onChange(option.value === selectedOption ? '' : option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Para Birimi Seçici Bileşeni
const CurrencySelector = ({
  selectedCurrency,
  onChange
}: {
  selectedCurrency: CurrencyType,
  onChange: (currency: CurrencyType) => void
}) => {
  const currencies: { value: CurrencyType, label: string, symbol: string }[] = [
    { value: 'TRY', label: 'TL', symbol: '₺' },
    { value: 'USD', label: 'USD', symbol: '$' },
    { value: 'EUR', label: 'EUR', symbol: '€' },
    { value: 'CNY', label: 'CNY', symbol: '¥' },
  ];

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
      <div className="grid grid-cols-4 gap-2">
        {currencies.map((currency) => (
          <button
            key={currency.value}
            onClick={() => onChange(currency.value)}
            className={`px-2 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${selectedCurrency === currency.value
              ? 'bg-[#660566] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {currency.symbol} {currency.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Arama yapılabilen dropdown bileşeni
const SearchableDropdown = ({
  options,
  selectedValue,
  onChange,
  placeholder = "Seçiniz..."
}: {
  options: string[],
  selectedValue: string | undefined,
  onChange: (value: string | undefined) => void,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapat
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

  // Filtrelenmiş seçenekler
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Seçenek seçildiğinde
  const handleSelect = (value: string) => {
    onChange(value === selectedValue ? undefined : value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Seçim kutusu */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg
                text-left text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/20 
                focus:border-purple-500/30 transition-all duration-200 text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`truncate ${!selectedValue ? 'text-gray-400' : 'text-gray-700'}`}>
          {selectedValue || placeholder}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menü */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-hidden flex flex-col">
          {/* Arama kutusu */}
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg
                      placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500/20 
                      focus:border-purple-500/30 transition-all duration-200 text-sm"
              placeholder="Marka ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Seçenekler listesi */}
          <div className="overflow-y-auto max-h-60 py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedValue === option
                    ? 'bg-purple-50 text-purple-800'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={() => handleSelect(option)}
                  aria-selected={selectedValue === option}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="text-sm text-gray-500 py-2 text-center">
                Sonuç bulunamadı
              </div>
            )}
          </div>

          {/* Tümünü seç butonu */}
          <div className="p-2 border-t border-gray-100 sticky bottom-0 bg-white">
            <button
              type="button"
              className="w-full flex items-center justify-center px-3 py-2 text-sm 
                      bg-gray-50 border border-gray-200 rounded-lg text-gray-500 
                      hover:bg-gray-100 transition-colors"
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              Tüm Markalar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Supabase'den araç markalarını çeken fonksiyon
const fetchBrands = async () => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('brand')
    .order('brand');

  if (error) {
    console.error('Marka verileri çekilirken hata oluştu:', error);
    return [];
  }

  // Benzersiz markaları al
  const uniqueBrands = Array.from(new Set(data.map(item => item.brand)));
  return uniqueBrands;
};

// Supabase'den araç tiplerini çeken fonksiyon
const fetchVehicleTypes = async () => {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('type')
    .order('type');

  if (error) {
    console.error('Araç tipleri çekilirken hata oluştu:', error);
    return [];
  }

  // Benzersiz tipleri al
  const uniqueTypes = Array.from(new Set(data.map(item => item.type)));
  return uniqueTypes;
};

// Ana Filtre Bileşeni
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
    turkeyStatuses: false,
  });

  const [brandSearch, setBrandSearch] = useState('');

  // Markalar ve araç tipleri için React Query kullanımı
  const { data: brands = [] } = useQuery({
    queryKey: ['vehicleBrands'],
    queryFn: fetchBrands,
    staleTime: Infinity, // Marka listesi değişmediği için süresiz önbelleğe alınabilir
  });

  const { data: vehicleTypes = [] } = useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: fetchVehicleTypes,
    staleTime: Infinity, // Tip listesi değişmediği için süresiz önbelleğe alınabilir
  });

  // Filter panel durumlarını tutan state ve toggle fonksiyonu
  const toggleFilterPanel = (panel: keyof typeof filterPanels) => {
    setFilterPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  // Marka filtresini değiştiren fonksiyon
  const handleBrandChange = (brand: string) => {
    if (temporaryFilters.brand === brand) {
      // Aynı markaya tekrar tıklanırsa filtreyi kaldır
      setTemporaryFilters({ brand: undefined });
    } else {
      // Yeni marka seçilirse filtreye ekle
      setTemporaryFilters({ brand });
    }
    // Anında uygula
    applyFilters();
  };

  // Araç tipi filtresini değiştiren fonksiyon
  const handleVehicleTypeChange = (vehicleType: string) => {
    if (temporaryFilters.vehicleType === vehicleType) {
      // Aynı tipe tekrar tıklanırsa filtreyi kaldır
      setTemporaryFilters({ vehicleType: undefined });
    } else {
      // Yeni tip seçilirse filtreye ekle
      setTemporaryFilters({ vehicleType });
    }
    // Anında uygula
    applyFilters();
  };

  // Range (değer aralığı) filtrelerini değiştiren fonksiyon
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

  // Checkbox filterlarını değiştiren fonksiyon
  const handleCheckboxFilterChange = (type: string, value: string | boolean) => {
    switch (type) {
      case 'heatPump':
        setTemporaryFilters({ heatPump: value ? 'yes' : undefined });
        break;
      case 'v2l':
        setTemporaryFilters({ v2l: value ? 'yes' : undefined });
        break;
      case 'turkeyStatuses':
        setTemporaryFilters({ turkeyStatuses: value ? 'available' : undefined });
        break;
      case 'comingSoon':
        setTemporaryFilters({ comingSoon: value === true });
        break;
    }
  };

  // Filtre formunun gönderilmesi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  // Tüm filtreleri sıfırlama
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
      turkeyStatuses: undefined,
      comingSoon: undefined,
    });
    // Anında uygula
    applyFilters();
  };

  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-gray-800">Filtreler</h2>
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-sm text-[#660566] hover:text-[#4d044d] transition-colors"
        >
          Sıfırla
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Marka Filtresi */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('brand')}
          >
            <h3 className="font-medium">Markalar</h3>
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
                placeholder="Marka ara..."
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

        {/* Araç Tipi Filtresi */}
        <div>
          <h3 className="font-medium mb-2">Araç Tipi</h3>
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleVehicleTypeChange(type)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${temporaryFilters.vehicleType === type
                  ? 'bg-[#660566] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Fiyat Aralığı */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('price')}
          >
            <h3 className="font-medium">Fiyat Aralığı</h3>
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
                  Min (TL)
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
                  Max (TL)
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

        {/* Batarya Kapasitesi */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('battery')}
          >
            <h3 className="font-medium">Batarya Kapasitesi</h3>
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

        {/* Menzil */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('range')}
          >
            <h3 className="font-medium">Menzil</h3>
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

        {/* Diğer Özellikler */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('specs')}
          >
            <h3 className="font-medium">Diğer Özellikler</h3>
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
              {/* Isı Pompası */}
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
                  Isı Pompası Var
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
                  V2L Var
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Türkiye Durumu */}
        <div>
          <div
            className="flex justify-between items-center mb-2 cursor-pointer"
            onClick={() => toggleFilterPanel('turkeyStatuses')}
          >
            <h3 className="font-medium">Türkiye Durumu</h3>
            <svg
              className={`w-5 h-5 transition-transform ${filterPanels.turkeyStatuses ? 'transform rotate-180' : ''
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

          {filterPanels.turkeyStatuses && (
            <div className="mt-2 space-y-2">
              {/* Türkiye'de Satışta */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="turkeyAvailable"
                  checked={temporaryFilters.turkeyStatuses === 'available'}
                  onChange={(e) => handleCheckboxFilterChange('turkeyStatuses', e?.target?.checked ? 'available' : false)}
                  className="w-4 h-4 accent-[#660566] rounded border-gray-300"
                  style={{ accentColor: '#660566' }}
                />
                <label
                  htmlFor="turkeyAvailable"
                  className="ml-2 text-sm text-gray-700"
                >
                  Türkiye'de Satışta
                </label>
              </div>

              {/* Yakında Türkiye'de */}
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="comingSoon"
                  checked={temporaryFilters.comingSoon === true}
                  onChange={(e) => handleCheckboxFilterChange('comingSoon', e.target.checked)}
                  className="w-4 h-4 text-[#660566] rounded border-gray-300 focus:ring-[#660566]"
                />
                <label
                  htmlFor="comingSoon"
                  className="ml-2 text-sm text-gray-700"
                >
                  Yakında Türkiye'de
                </label>
              </div> */}
            </div>
          )}
        </div>

        {/* Filtreleri Uygula Butonu */}
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-[#660566] to-[#330233] text-white rounded-md text-sm font-medium hover:opacity-90 transition-colors duration-200"
        >
          Filtreleri Uygula
        </button>
      </form>
    </div>
  );
};

/* CSS Animasyon stilini ekle */
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