"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useElectricVehicleStore, CurrencyType } from '@/viewmodels/useElectricVehicles';
import { useVehicles } from '@/hooks/useVehicles';
import type ElectricVehicle from '@/models/ElectricVehicle';
import { useUserStore } from '@/stores/useUserStore';
import { log } from 'console';

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
          className={`py-2 px-2 rounded-lg text-sm font-medium border transition-colors duration-150 ${
            selectedOption === option.value
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
            className={`px-2 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${
              selectedCurrency === currency.value
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
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedValue === option
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

// Ana Filtre Bileşeni
const VehicleFilters = () => {
  // Zustand store'dan filtreleri ve fonksiyonları al
  const { 
    filters, 
    setFilters, 
    temporaryFilters,
    setTemporaryFilters, 
    applyFilters,
    currency,
    setCurrency
  } = useElectricVehicleStore();
  
  // Kullanıcı bilgilerini al
  const { user, isLoggedIn } = useUserStore();
  const isPremiumUser = isLoggedIn && (user?.isPremium);
  
  // Vehicles data'yı al
  const { data: vehicles = [] } = useVehicles();
  
  // Sayfa her açıldığında filtreleri sıfırla (premium özellikler hariç)
  useEffect(() => {
    // Varsayılan boş filtre objesi
    const defaultFilters = {};
    
    // Tüm filtreleri sıfırla
    setFilters(defaultFilters);
    setTemporaryFilters(defaultFilters);
    
    // Filtreleri hemen uygula
    setTimeout(() => {
      applyFilters();
    }, 100);
    
    console.log('Elektrikli araçlar sayfası yüklendi, filtreler sıfırlandı');
  }, []); // Boş bağımlılık dizisi, sadece bileşen monte edildiğinde çalışır
  
  // Tüm markaları çıkart ve benzersiz yap
  const allBrands = React.useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    
    // Marka isimlerini al ve tekrarsız bir dizi oluştur
    const uniqueBrands = Array.from(new Set(vehicles.map((vehicle: ElectricVehicle) => vehicle.brand)))
      .sort((a: string, b: string) => a.localeCompare(b)); // Alfabetik sırala
    
    return uniqueBrands;
  }, [vehicles]);
  
  // Filtrelenmiş markalar
  const filteredBrands = React.useMemo(() => {
    if (!temporaryFilters.brand) return allBrands;
    
    // Arama terimini küçük harfe çevir
    const term = temporaryFilters.brand.toLowerCase();
    
    return allBrands.filter((brand: string) => {
      return brand.toLowerCase().includes(term);
    });
  }, [allBrands, temporaryFilters.brand]);

  // Her filtre grubu için açılıp kapanma durumunu tut
  const [openSections, setOpenSections] = useState({
    marka: true,        // Varsayılan olarak marka filtresi açık olsun
    aracTipi: false,
    fiyat: false,
    batarya: false,
    menzil: false,
    tuketim: false,
    sarj: false,
    iciIsitma: false,
    vsl: false,
    turkiyeDurumu: false,
    yakindaSatista: false,
  });

  // Mobil görünüm için filtreler paneli görünürlüğü
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Filtreler değiştiğinde geçici filtreleri güncelle
  useEffect(() => {
    setTemporaryFilters({...filters});
  }, [filters]);

  // Araç tipleri
  const vehicleTypes = [
    'Sedan', 
    'Hatchback', 
    'SUV', 
    'Ticari', 
    'Station Wagon', 
    'Pickup', 
    'MPV', 
    'Spor', 
    'Kamyonet', 
    'Otobüs',
    'Motosiklet',
    'Scooter'
  ];

  // Filtre başlığını aç/kapat
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
  };

  // Filtre değerini değiştir (geçici olarak)
  const handleFilterChange = (key: string, value: any) => {
    // Güncellenmiş value değeri
    const updatedValue = value === '' ? undefined : value;
    
    // Zustand store'un setTemporaryFilters fonksiyonunu kullan
    setTemporaryFilters({
      [key]: updatedValue
    });
  };

  // Min-max değerleri değiştir (geçici olarak)
  const handleMinMaxChange = (key: string, minKey: string, maxKey: string, minValue: string | number | undefined, maxValue: string | number | undefined) => {
    const updates: any = {};
    
    if (minValue !== undefined) {
      updates[minKey] = minValue === '' ? undefined : Number(minValue);
    }
    
    if (maxValue !== undefined) {
      updates[maxKey] = maxValue === '' ? undefined : Number(maxValue);
    }
    
    // Zustand store'un setTemporaryFilters fonksiyonunu kullan
    setTemporaryFilters(updates);
  };

  // Tüm filtreleri temizle
  const handleClearFilters = () => {
    // Boş filtre objesi oluşturalım
    const emptyFilters = {};
    
    // ComingSoon filtresini özellikle false yaparak görünürlüğünü garantiyelim
    setTemporaryFilters({
      ...emptyFilters,
      comingSoon: false
    });
    
    setFilters({
      ...emptyFilters,
      comingSoon: false
    });
    
    // Direkt window.location.reload() kullanmak yerine
    // useElectricVehicleStore'un state'ini doğrudan sıfırlayalım
    // ve applyFilters fonksiyonunu çağıralım
    
    console.log('Tüm filtreler temizleniyor...');
    
    // Filtreleri direkt uygula, gecikmesiz
    applyFilters();
    
    // Mobil filtreyi kapat
    setIsMobileFiltersOpen(false);
  };
  
  // Geçici filtreleri uygula
  const handleApplyFilters = () => {
    // Zustand store'un applyFilters fonksiyonunu kullan
    applyFilters();
    
    console.log('Filtreler uygulandı:', temporaryFilters);
    setIsMobileFiltersOpen(false);
  };

  // Filtre içerik bileşeni
  const FiltersContent = () => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Otomatik tamamlama önerilerini engellemek için stil */}
      <NoAutocompleteStyles />
      
      {/* Marka */}
      <FilterAccordion 
        title="Marka" 
        isOpen={openSections.marka} 
        onToggle={() => toggleSection('marka')}
      >
        <div className="space-y-2">
          <SearchableDropdown
            options={allBrands}
            selectedValue={temporaryFilters.brand}
            onChange={(value) => {
              setTemporaryFilters({
                ...temporaryFilters,
                brand: value
              });
            }}
            placeholder="Marka seçin veya arayın..."
          />
        </div>
      </FilterAccordion>

      {/* Araç Tipi */}
      <FilterAccordion 
        title="Araç Tipi" 
        isOpen={openSections.aracTipi} 
        onToggle={() => toggleSection('aracTipi')}
      >
        <div className="grid grid-cols-2 gap-2">
          {vehicleTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange('vehicleType', temporaryFilters.vehicleType === type ? '' : type)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left flex items-center ${
                temporaryFilters.vehicleType === type
                  ? 'bg-[#660566] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
            </div>
      </FilterAccordion>

      {/* Fiyat */}
      <FilterAccordion 
        title="Fiyat" 
        isOpen={openSections.fiyat} 
        onToggle={() => toggleSection('fiyat')}
      >
        {/* Para birimi seçici */}
        <CurrencySelector 
          selectedCurrency={currency} 
          onChange={(newCurrency) => setCurrency(newCurrency)} 
        />
        
        <MinMaxInput
          minValue={temporaryFilters.minPrice}
          maxValue={temporaryFilters.maxPrice}
          onChangeMin={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('price', 'minPrice', 'maxPrice', value, temporaryFilters.maxPrice);
          }}
          onChangeMax={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('price', 'minPrice', 'maxPrice', temporaryFilters.minPrice, value);
          }}
          unit={
            currency === 'TRY' ? '₺' : 
            currency === 'USD' ? '$' : 
            currency === 'EUR' ? '€' : 
            currency === 'CNY' ? '¥' : '₺'
          }
          formatThousands={true}
        />
      </FilterAccordion>

      {/* Batarya */}
      <FilterAccordion 
        title="Batarya Kapasitesi" 
        isOpen={openSections.batarya} 
        onToggle={() => toggleSection('batarya')}
      >
        <MinMaxInput
          minValue={temporaryFilters.minBatteryCapacity}
          maxValue={temporaryFilters.maxBatteryCapacity}
          onChangeMin={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('batteryCapacity', 'minBatteryCapacity', 'maxBatteryCapacity', value, temporaryFilters.maxBatteryCapacity);
          }}
          onChangeMax={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('batteryCapacity', 'minBatteryCapacity', 'maxBatteryCapacity', temporaryFilters.minBatteryCapacity, value);
          }}
          unit="kWh"
        />
      </FilterAccordion>

      {/* Menzil */}
      <FilterAccordion 
        title="Menzil" 
        isOpen={openSections.menzil} 
        onToggle={() => toggleSection('menzil')}
      >
        <MinMaxInput
          minValue={temporaryFilters.minRange}
          maxValue={temporaryFilters.maxRange}
          onChangeMin={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('range', 'minRange', 'maxRange', value, temporaryFilters.maxRange);
          }}
          onChangeMax={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('range', 'minRange', 'maxRange', temporaryFilters.minRange, value);
          }}
          unit="km"
        />
      </FilterAccordion>

      {/* Tüketim */}
      <FilterAccordion 
        title="Tüketim" 
        isOpen={openSections.tuketim} 
        onToggle={() => toggleSection('tuketim')}
      >
        <MinMaxInput
          minValue={temporaryFilters.minConsumption}
          maxValue={temporaryFilters.maxConsumption}
          onChangeMin={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('consumption', 'minConsumption', 'maxConsumption', value, temporaryFilters.maxConsumption);
          }}
          onChangeMax={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('consumption', 'minConsumption', 'maxConsumption', temporaryFilters.minConsumption, value);
          }}
          unit="kWh/100km"
          placeholder=""
        />
      </FilterAccordion>

      {/* Şarj Hızı */}
      <FilterAccordion 
        title="Hızlı Şarj Gücü" 
        isOpen={openSections.sarj} 
        onToggle={() => toggleSection('sarj')}
      >
        <MinMaxInput
          minValue={temporaryFilters.minChargeSpeed}
          maxValue={temporaryFilters.maxChargeSpeed}
          onChangeMin={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('chargeSpeed', 'minChargeSpeed', 'maxChargeSpeed', value, temporaryFilters.maxChargeSpeed);
          }}
          onChangeMax={(value) => {
            // Sadece geçici filtreleri güncelle, gerçek filtreleri güncelleme
            handleMinMaxChange('chargeSpeed', 'minChargeSpeed', 'maxChargeSpeed', temporaryFilters.minChargeSpeed, value);
          }}
          unit="kW"
        />
      </FilterAccordion>

      {/* Isı Pompası */}
      <FilterAccordion 
        title="Isı Pompası" 
        isOpen={openSections.iciIsitma} 
        onToggle={() => toggleSection('iciIsitma')}
      >
        <ButtonOptions
          options={[
            { label: 'Var', value: 'yes' },
            { label: 'Yok', value: 'no' }
          ]}
          selectedOption={temporaryFilters.heatPump || ''}
          onChange={(value) => {
            // Sadece geçici filtreleri güncelle
            setTemporaryFilters({
              ...temporaryFilters,
              heatPump: value === '' ? undefined : value
            });
          }}
        />
        <div className="mt-2 text-xs text-gray-500">
          Isı pompası, elektrikli araçlarda enerji verimli ısıtma/soğutma sağlar ve kış aylarında menzili korur.
              </div>
      </FilterAccordion>

      {/* V2L */}
      <FilterAccordion 
        title="V2L (Vehicle-to-Load)" 
        isOpen={openSections.vsl} 
        onToggle={() => toggleSection('vsl')}
      >
        <ButtonOptions
          options={[
            { label: 'Var', value: 'yes' },
            { label: 'Yok', value: 'no' }
          ]}
          selectedOption={temporaryFilters.v2l || ''}
          onChange={(value) => {
            // Sadece geçici filtreleri güncelle
            setTemporaryFilters({
              ...temporaryFilters,
              v2l: value === '' ? undefined : value
            });
          }}
        />
        <div className="mt-2 text-xs text-gray-500">
          V2L, aracın bataryasından harici cihazlara elektrik sağlama özelliğidir.
            </div>
      </FilterAccordion>

      {/* Türkiye Durumu */}
      <FilterAccordion 
        title="Türkiye'de Satışta" 
        isOpen={openSections.turkiyeDurumu} 
        onToggle={() => toggleSection('turkiyeDurumu')}
      >
        <ButtonOptions
          options={[
            { label: 'Evet', value: 'available' },
            { label: 'Hayır', value: 'unavailable' }
          ]}
          selectedOption={temporaryFilters.turkeyStatus || ''}
          onChange={(value) => {
            // Sadece geçici filtreleri güncelle
            console.log('Türkiye Durumu değiştiriliyor:', value);
            setTemporaryFilters({
              ...temporaryFilters,
              turkeyStatus: value === '' ? undefined : value
            });
          }}
        />
      </FilterAccordion>

      {/* Yakında Türkiye'de - Premium Filtre - Tamamen yeniden tasarlandı */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div 
                className={`relative w-10 h-5 transition-colors duration-200 ease-in-out rounded-full ${
                  temporaryFilters.comingSoon ? 'bg-gradient-to-r from-[#660566] to-[#330233]' : 'bg-gray-200'
                } ${!isPremiumUser ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={(e) => {
                  // Olayı durdurarak üst katmana geçişini engelle
                  e.stopPropagation();
                  
                  if (isPremiumUser) {
                    // Premium kullanıcılar için sadece filtreleme işlemlerini yap
                    // Modal açma
                    console.log("Premium kullanıcı - filtre uygulanıyor, modal açılmıyor");
                    const newValue = !temporaryFilters.comingSoon;
                    
                    // Filtreleri güncelle
                    setTemporaryFilters({
                      ...temporaryFilters,
                      comingSoon: newValue
                    });
                    
                    setFilters({
                      ...filters,
                      comingSoon: newValue
                    });
                    
                    // Hemen uygula
                    applyFilters();
                  } else {
                    // Premium olmayan kullanıcılar için modal aç
                    console.log("Premium olmayan kullanıcı - premium modal açılıyor");
                    const event = new CustomEvent('show-premium-modal');
                    window.dispatchEvent(event);
                  }
                }}
              >
                <span 
                  className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-in-out transform bg-white rounded-full ${
                    temporaryFilters.comingSoon ? 'translate-x-5' : ''
                  }`}
                ></span>
              </div>
              <span className="text-sm font-medium text-gray-800">Yakında Türkiye'de</span>
            </div>
            
            {!isPremiumUser && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-[#660566] to-[#330233] rounded-full">
                Premium
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            Türkiye pazarına yakın zamanda girmesi beklenen elektrikli araçları gösterir.
          </p>
        </div>
      </div>

          {/* Filtre Butonları */}
      <div className="p-4 flex flex-col gap-3 border-t border-gray-200">
        <div className="flex gap-3">
            <button
              onClick={handleApplyFilters}
              className="bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-3 rounded-lg
                    hover:opacity-90 transition-colors duration-200 text-sm font-medium flex-1 whitespace-nowrap"
            >
              Filtreleri Uygula
            </button>
            <button
              onClick={handleClearFilters}
              className="text-gray-600 bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 
                     transition-colors duration-200 text-sm font-medium flex-1 whitespace-nowrap"
            >
              Filtreleri Sil
            </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobil Görünüm için Filtreler Butonu */}
      <div className="lg:hidden p-4">
        <button
          className="flex items-center justify-center w-full bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm text-gray-700"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtreleri Göster
        </button>
      </div>

      {/* Mobil Filtre Paneli */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)}></div>
          <div className="relative w-full max-w-xs bg-white h-full overflow-y-auto shadow-xl p-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium text-gray-900">Araç Filtreleri</h2>
            <button
              type="button"
                className="-mr-2 w-10 h-10 flex items-center justify-center text-gray-500"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <span className="sr-only">Kapat</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}

      {/* Masaüstü Görünüm */}
      <div className="hidden lg:block">
        <FiltersContent />
    </div>
    </>
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