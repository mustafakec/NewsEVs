'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaShareAlt, FaCopy, FaTwitter, FaFacebook, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useElectricVehicleStore } from '@/viewmodels/useElectricVehicles';
import FavoriteButton from '@/components/FavoriteButton';
import { ElectricVehicle } from '@/models/ElectricVehicle';
import { cloudinaryUtils } from '@/lib/cloudinary';
import { customPrices } from '@/constants/customPrices';
import { customNames } from '@/constants/customPrices';

// Props için arayüz
interface VehicleClientContentProps {
  vehicle?: ElectricVehicle;
  initialVehicle?: ElectricVehicle;
}

// Formats
// Sabit kur: 1 USD = 32 TL (güncel kur için API entegrasyonu eklenebilir)
const EXCHANGE_RATE = 32; // 1 USD = 32 TL
export const formatCurrency = (price: number, currency: string = "$") => {
  let displayPrice = price;
  let displayCurrency = "$";
  if (currency === "TRY" || currency === "TL" || currency === "₺") {
    displayPrice = Math.round((price / EXCHANGE_RATE) * 100) / 100;
    displayCurrency = "$";
  } else if (currency === "$" || currency === "USD") {
    displayCurrency = "$";
  }
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(displayPrice) + " " + displayCurrency;
};

// Türkçe -> İngilizce çeviri map'i
const translationMap: Record<string, string> = {
  'Var': 'Available',
  'Yok': 'Not Available',
  'Opsiyonel': 'Optional',
  'Seviye': 'Level',
  'Elektrikli': 'Electric',
  'Araç': 'Vehicle',
  'Çıkış Tarihi': 'Release Date',
  'Otonom Sürüş': 'Autonomous Driving',
  'Isı Pompası': 'Heat Pump',
  'Bagaj Hacmi': 'Cargo Volume',
  'Ağırlık': 'Weight',
  'Uzunluk': 'Length',
  'Genişlik': 'Width',
  'Yükseklik': 'Height',
  'Motor Gücü': 'Motor Power',
  'Tork': 'Torque',
  'Azami Hız': 'Top Speed',
  'Sürüş Sistemi': 'Drive System',
  'Türkiye\'de Satışta': 'Available in Turkey',
  'saat': 'hours',
  'litre': 'liters',
  'km/s': 'km/h',
  '0-100 km/s': '0-100 km/h',
  '0-100 kmh': '0-100 km/h',
  // ... gerekirse eklenebilir ...
};

const translate = (value: string) => {
  if (!value) return value;
  // Eğer "Seviye X" gibi bir şeyse
  if (value.startsWith('Seviye ')) {
    return value.replace('Seviye', 'Level');
  }
  // Map'te varsa çevir
  return translationMap[value] || value;
};

// Standardize vehicle type
const normalizeVehicleType = (type: string): string => {
  // First make the incoming value case insensitive
  const lowerType = type.toLowerCase().trim();

  // Create a simple mapping table
  const typeMapping: Record<string, string> = {
    'suv': 'SUV',
    'crossover': 'SUV',
    'cuv': 'SUV',
    'coupe': 'Sports',
    'sportback': 'Sports',
    'sports': 'Sports',
    'spor': 'Sports',
    'cabrio': 'Sports',
    'roadster': 'Sports',
    'sedan': 'Sedan',
    'hatchback': 'Hatchback',
    'van': 'Commercial',
    'ticari': 'Commercial',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'stationwagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Bus',
    'minibus': 'Bus',
    'bus': 'Bus',
    'otobüs': 'Bus',
    'otobus': 'Bus',
    'truck': 'Truck',
    'kamyonet': 'Truck',
    'motosiklet': 'Motorcycle',
    'motorcycle': 'Motorcycle',
    'moto': 'Motorcycle',
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter'
  };

  // If there's a match, return the matching type
  if (typeMapping[lowerType]) {
    return typeMapping[lowerType];
  }

  // If no match is found, format with first letter uppercase and rest lowercase
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

// Helper function to get the correct suffix in English
const getTypeSuffix = (type: string): string => {
  const lastLetter = type.slice(-1).toLowerCase();

  // Determine suffix based on vowel harmony and last letter
  // According to English grammar rules, the suffix depends on the last sound
  const vowels = 'aeiou';
  if (vowels.includes(lastLetter)) {
    // If the word ends with a vowel, add 's' suffix
    return type.toLowerCase().endsWith('suv') ? "s" : "s";
  } else {
    // If the word ends with a consonant, add 's' suffix
    return "s";
  }
};

// Function to add the correct suffix based on vehicle type
const getTypeWithSuffix = (type: string, suffix: string = ""): string => {
  const normalizedType = normalizeVehicleType(type);

  switch (suffix) {
    case "accusative": // -ı -i -u -ü (accusative case)
      return normalizedType + getTypeSuffix(normalizedType);
    case "simple_plural": // -lar -ler (plural)
      return normalizedType + "s";
    default:
      return normalizedType;
  }
};

// Function to ensure correct formatting of vehicle types
const formatVehicleType = (type: string): string => {
  // Special formatting
  if (type.toLowerCase() === 'suv') return 'SUV';
  if (type.toLowerCase() === 'mpv') return 'MPV';

  return type;
};

// X (Twitter) Logo komponenti
const XLogo = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H5.01l4.73 6.243 8.504-6.243z"></path>
  </svg>
);

// Client Component
export default function VehicleClientContent({ vehicle, initialVehicle }: VehicleClientContentProps) {
  // Hooks'ları component'in en üstünde tanımla
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setFilters = useElectricVehicleStore((state) => state.setFilters);
  const setTemporaryFilters = useElectricVehicleStore((state) => state.setTemporaryFilters);

  // Araç verilerini state'e ata
  const [vehicleData, setVehicleData] = useState<ElectricVehicle>(initialVehicle || vehicle!);
  const [price, setPrice] = useState<{ base: number; currency: string } | null>(null);

  // Fetch price information
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleData.id}/price`);
        if (response.ok) {
          const priceData = await response.json();
          setPrice(priceData);
        }
      } catch (error) {
        console.error('Error fetching price information:', error);
      }
    };

    if (vehicleData.id) {
      fetchPrice();
    }
  }, [vehicleData.id]);

  // Shareım menüsü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Eğer hiçbir araç verisi yoksa hata göster
  if (!vehicleData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Araç Bulunamadı</h1>
          <p className="text-gray-600">Aradığınız elektrikli araç bulunamadı.</p>
        </div>
      </div>
    );
  }

  // Previous image
  const handlePrevImage = () => {
    if (!vehicleData.images || vehicleData.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? vehicleData.images?.length ?? 0 - 1 : prev - 1));
  };

  // Next image
  const handleNextImage = () => {
    if (!vehicleData.images || vehicleData.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === (vehicleData.images?.length ?? 0) - 1 ? 0 : prev + 1));
  };

  // Araç tipi filtrelemesi için fonksiyon
  const handleVehicleTypeClick = (e: React.MouseEvent, vehicleType: string) => {
    e.preventDefault();

    // Önce tüm filtreleri sıfırla
    setFilters({});
    setTemporaryFilters({});

    // Aracın tipini normalleştir
    const normalizedType = normalizeVehicleType(vehicleType);

    // Sadece araç tipi filtresini ayarla
    setTimeout(() => {
      setFilters({ vehicleType: normalizedType });

      // Küçük harflere çevirerek URL'e ekle
      const urlType = normalizedType.toLowerCase();

      router.push(`/electric-vehicles?tip=${urlType}`);
    }, 100);
  };

  // Karşılaştırmaya araç ekleme fonksiyonu
  const handleAddToCompare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // LocalStorage'da karşılaştırma verilerini kontrol et
      const storedVehicles = localStorage.getItem('compareVehicles');
      let compareVehicles: string[] = [];

      if (storedVehicles) {
        compareVehicles = JSON.parse(storedVehicles);

        // Eğer araç zaten karşılaştırma listesindeyse tekrar ekleme
        if (compareVehicles.includes(vehicleData.id)) {
          router.push('/karsilastir');
          return;
        }

        // Maksimum 3 araç kontrolü (premium sınırını dikkate alarak)
        if (compareVehicles.length >= 3) {
          // İlk aracı çıkar, yenisini ekle (1. araç yerine güncelleme)
          compareVehicles.shift();
        }
      }

      // Yeni aracı ekle
      compareVehicles.push(vehicleData.id);

      // Güncellenmiş listeyi localStorage'a kaydet
      localStorage.setItem('compareVehicles', JSON.stringify(compareVehicles));

      // Karşılaştırma sayfasına yönlendir
      router.push('/karsilastir');
    } catch (error) {
      console.error('Karşılaştırma listesi güncellenirken hata oluştu:', error);
    }
  };

  // Tüm araçlar butonuna tıklandığında filtreleri sıfırlama
  const handleAllVehiclesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFilters({});
    setTemporaryFilters({});
    router.push('/electric-vehicles');
  };

  // Shareım işlevleri
  const handleToggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleCopyLink = () => {
    // Mevcut URL'yi al
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('URL kopyalama hatası:', err);
      });
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`${vehicleData.brand} ${vehicleData.model} Elektrikli Araç | elektrikliyiz`);
    const text = encodeURIComponent(`${vehicleData.brand} ${vehicleData.model} elektrikli araç detaylarını keşfet`);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'instagram':
        // Instagram için kullanıcıya kopyalama ve açıklama göster
        navigator.clipboard.writeText(url)
          .then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);

            // Mobil cihazda Instagram uygulamasını açmayı dene
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
              const confirmOpen = window.confirm(
                'Bağlantı kopyalandı! Instagram uygulamasını açmak ister misiniz? Açıldıktan sonra hikayenizde paylaşabilirsiniz.'
              );
              if (confirmOpen) {
                window.location.href = 'instagram://';

                // Eğer Instagram uygulaması açılmazsa 1 saniye sonra web versiyonunu açmayı dene
                setTimeout(() => {
                  window.open('https://instagram.com', '_blank');
                }, 1000);
              }
            } else {
              alert('Bağlantı kopyalandı! Instagram Story\'de paylaşmak için Instagram uygulamasını açıp kopyaladığınız bağlantıyı yapıştırabilirsiniz.');
            }
          })
          .catch(err => {
            console.error('URL kopyalama hatası:', err);
            alert('Instagram Story\'de paylaşmak için ekran görüntüsü alabilirsiniz.');
          });
        return;
    }

    // Shareım URL'sini yeni pencerede aç
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // View butonunda Rewarded Video Reklam gösterilmeyecek
  const handleInceleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    router.push(url);
  };

  // Image URL'ini optimize et
  const getOptimizedImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/images/car-placeholder.jpg';
    
    // Cloudinary URL'i ise optimize et
    if (imageUrl.includes('cloudinary.com')) {
      return cloudinaryUtils.optimizeImage(imageUrl, {
        width: 1200,
        height: 900,
        quality: 'auto:good',
        format: 'auto'
      });
    }
    
    return imageUrl;
  };

  // Cloudinary URL'i kontrol et
  const isCloudinaryUrl = (imageUrl: string | undefined) => {
    return imageUrl?.includes('cloudinary.com') || false;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/electric-vehicles" className="hover:text-[#660566]">
                Electric Vehicles
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">
                {vehicleData.brand} {vehicleData.model}
              </span>
            </div>
          </div>

          {/* Vehicle Top Information */}
          <div className="border-b border-gray-200 pb-8 mb-10">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{vehicleData.brand} {customNames[vehicleData.id] || vehicleData.model}</h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                    {getTypeWithSuffix(vehicleData.type)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {vehicleData.year}
                  </span>
    
                </div>
                <FavoriteButton vehicle={vehicleData} />
              </div>
            </div>
          </div>

          {/* Vehicle Image and Featured Information */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
            {/* Image */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {vehicleData.images && vehicleData.images.length > 0 ? (
                  <Image
                    src={getOptimizedImageUrl(vehicleData.images[currentImageIndex])}
                    alt={`${vehicleData.brand} ${vehicleData.model}`}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={isCloudinaryUrl(vehicleData.images[currentImageIndex])}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Image not found</span>
                  </div>
                )}

                {/* Image Navigation Buttons */}
                {vehicleData.images && vehicleData.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Previous image"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Next image"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Image Indicators */}
              {vehicleData.images && vehicleData.images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {vehicleData.images.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-[#660566]' : 'bg-gray-300'
                        }`}
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Featured Information */}
            <div className="lg:col-span-2">
              {/* Price */}
              <div className="mb-4">
                <span className="block text-gray-500 text-sm">Price</span>
                <span className="block text-2xl font-bold text-[#660566]">
                  {typeof customPrices[vehicleData.id] === 'number'
                    ? `$${customPrices[vehicleData.id].toLocaleString('en-US')}`
                    : price?.base
                      ? formatCurrency(price.base, price.currency)
                      : 'Not Specified'}
                </span>
              </div>

              {/* Featured Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-gray-500 text-sm">Range</span>
                  <span className="block font-bold">{vehicleData.range} km</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Consumption</span>
                  <span className="block font-bold">{vehicleData.efficiency?.consumption || 'Not Specified'} kWh/100 km</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Battery</span>
                  <span className="block font-bold">{vehicleData.batteryCapacity} kWh</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Motor</span>
                  <span className="block font-bold">{vehicleData.performance?.power || 'Not Specified'} {vehicleData.performance?.power ? 'HP' : ''}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Charging</span>
                  <span className="block font-bold">%20-%80: {vehicleData.chargingTime?.fastCharging?.time10to80 || 'Not Specified'} {vehicleData.chargingTime?.fastCharging?.time10to80 ? 'minutes' : ''}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleAddToCompare}
                  className="w-full bg-[#660566] hover:bg-[#4d044d] text-white text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Add to Comparison
                </button>
                <a
                  href={`/electric-vehicles?tip=${formatVehicleType(normalizeVehicleType(vehicleData.type)).toLowerCase()}`}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base sm:text-lg"
                >
                  Other Electric {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "accusative")} View
                </a>

                {/* Share Button */}
                <div className="relative" ref={shareMenuRef}>
                  <button
                    onClick={handleToggleShareOptions}
                    className="w-full bg-white border border-[#660566] hover:bg-[#660566]/5 text-[#660566] text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex justify-center items-center gap-2"
                    aria-label="Share vehicle details"
                  >
                    <FaShareAlt className="text-[#660566]" />
                    <span>Share</span>
                  </button>

                  {showShareOptions && (
                    <div className="absolute left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-full whitespace-nowrap animate-fade-in">
                      <div className="text-sm text-gray-500 mb-2 font-medium">Share this vehicle</div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <span className="text-black w-5 h-5 flex items-center justify-center">
                            <XLogo />
                          </span>
                          <span>Share on X</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaFacebook className="text-[#4267B2]" />
                          <span>Share on Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaWhatsapp className="text-[#25D366]" />
                          <span>Share on WhatsApp</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaLinkedin className="text-[#0077B5]" />
                          <span>Share on LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('instagram')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaInstagram className="text-[#E1306C]" />
                          <span>Share on Instagram Story</span>
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaCopy className={copySuccess ? "text-green-500" : "text-gray-500"} />
                          <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-8 mb-8">
            {/* First two tables: Power and Speed + Battery and Charging */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Information */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Power and Speed</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Motor Power</span>
                    <span className="font-medium">{vehicleData.performance?.power || 'Not Specified'} {vehicleData.performance?.power ? 'HP' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Torque</span>
                    <span className="font-medium">{vehicleData.performance?.torque || 'Not Specified'} {vehicleData.performance?.torque ? 'Nm' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Top Speed</span>
                    <span className="font-medium">{vehicleData.performance?.topSpeed || 'Not Specified'} {vehicleData.performance?.topSpeed ? 'km/h' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">0-100 km/h</span>
                    <span className="font-medium">{vehicleData.performance?.acceleration || 'Not Specified'} {vehicleData.performance?.acceleration ? 's' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Drive System</span>
                    <span className="font-medium">{vehicleData.performance?.driveType || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Battery and Charging */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Battery and Charging</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Battery</span>
                    <span className="font-medium">{vehicleData.batteryCapacity || 'Not Specified'} {vehicleData.batteryCapacity ? 'kWh' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Range</span>
                    <span className="font-medium">{vehicleData.range || 'Not Specified'} {vehicleData.range ? 'km' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">DC Charging Speed</span>
                    <span className="font-medium">{vehicleData.chargingTime?.fastCharging?.power || 'Not Specified'} {vehicleData.chargingTime?.fastCharging?.power ? 'kW' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">AC Charging Speed</span>
                    <span className="font-medium">{vehicleData.chargingTime?.ac || 'Not Specified'} {vehicleData.chargingTime?.ac ? 'kW' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">DC Charging Time</span>
                    <span className="font-medium">{vehicleData.chargingTime?.fastCharging?.time10to80 || 'Not Specified'} {vehicleData.chargingTime?.fastCharging?.time10to80 ? 'minutes' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">AC Charging Time</span>
                    <span className="font-medium">{vehicleData.chargingTime?.acTime || 'Not Specified'} {vehicleData.chargingTime?.acTime ? 'hours' : ''}</span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Average Consumption</span>
                    <span className="font-medium">{vehicleData.efficiency?.consumption || 'Not Specified'} kWh / 100 km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Dimensions table */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Vehicle Dimensions</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">
                      {vehicleData.dimensions?.weight ? `${vehicleData.dimensions.weight.toLocaleString('en-US')} kg` : 'Not Specified'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Length</span>
                    <span className="font-medium">
                      {vehicleData.dimensions?.length ? `${vehicleData.dimensions.length.toLocaleString('en-US')} mm` : 'Not Specified'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Width</span>
                    <span className="font-medium">
                      {vehicleData.dimensions?.width ? `${vehicleData.dimensions.width.toLocaleString('en-US')} mm` : 'Not Specified'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium">
                      {vehicleData.dimensions?.height ? `${vehicleData.dimensions.height.toLocaleString('en-US')} mm` : 'Not Specified'}
                    </span>
                  </div>
                  <div className="px-4 py-3 flex justify-between">
                    <span className="text-gray-600">Cargo Volume</span>
                    <span className="font-medium">
                      {vehicleData.dimensions?.cargoCapacity ? `${vehicleData.dimensions.cargoCapacity.toLocaleString('en-US')} liters` : 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Other Features</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-t border-gray-100">
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Vehicle Type</div>
                    <div className="w-1/2 text-right font-medium">{getTypeWithSuffix(vehicleData.type)}</div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Release Date</div>
                    <div className="w-1/2 text-right font-medium">{vehicleData.year}</div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Autonomous Driving</div>
                    <div className="w-1/2 text-right font-medium">
                      {translate(vehicleData.comfort?.autonomousLevel ? 'Level ' + vehicleData.comfort.autonomousLevel : '-')}
                    </div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Heat Pump</div>
                    <div className="w-1/2 text-right font-medium">
                      {translate(vehicleData.heatPump === 'yes' ? 'Var' : vehicleData.heatPump === 'optional' ? 'Opsiyonel' : 'Yok')}
                    </div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">V2L</div>
                    <div className="w-1/2 text-right font-medium">
                      {translate(vehicleData.v2l === 'yes' ? 'Var' : vehicleData.v2l === 'optional' ? 'Opsiyonel' : 'Yok')}
                    </div>
                  </div>
                </div>

                {/* Özellikler Listesi */}
                {/* <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {vehicleData.features?.map((feature: { name: string; isExtra: boolean }, index: number) => (
                    <li key={`feature-${index}`} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature.name}
                      {feature.isExtra && (
                        <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                          Opsiyonel
                        </span>
                      )}
                    </li>
                  ))}
                </ul> */}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Other Electric {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "simple_plural")}</h2>
                <p className="text-gray-600">You can view and compare electric {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "accusative")}.</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={`/electric-vehicles?tip=${formatVehicleType(normalizeVehicleType(vehicleData.type)).toLowerCase()}`}
                  className="w-full flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base sm:text-lg"
                >
                  View Other Electric {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "accusative")}
                </a>
                <a
                  href="/electric-vehicles"
                  onClick={handleAllVehiclesClick}
                  className="bg-[#660566] hover:bg-[#4d044d] text-white py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none"
                >
                  All Electric Vehicles
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}