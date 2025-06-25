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

// Props için arayüz
interface VehicleClientContentProps {
  vehicle?: ElectricVehicle;
  initialVehicle?: ElectricVehicle;
}

// Formatlar
export const formatCurrency = (price: number, currency: string = "₺") => {
  // TRY yerine TL göster
  const displayCurrency = currency === "TRY" ? "TL" : currency;
  return new Intl.NumberFormat('tr-TR').format(price) + " " + displayCurrency;
};

// Araç tipini standartlaştır
const normalizeVehicleType = (type: string): string => {
  // Önce gelen değeri büyük-küçük harf duyarsız hale getir
  const lowerType = type.toLowerCase().trim();

  // Basit bir eşleşme tablosu oluştur
  const typeMapping: Record<string, string> = {
    'suv': 'SUV',
    'crossover': 'SUV',
    'cuv': 'SUV',
    'coupe': 'Spor',
    'sportback': 'Spor',
    'sports': 'Spor',
    'spor': 'Spor',
    'cabrio': 'Spor',
    'roadster': 'Spor',
    'sedan': 'Sedan',
    'hatchback': 'Hatchback',
    'van': 'Ticari',
    'ticari': 'Ticari',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'stationwagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Otobüs',
    'minibus': 'Otobüs',
    'bus': 'Otobüs',
    'otobüs': 'Otobüs',
    'otobus': 'Otobüs',
    'truck': 'Kamyonet',
    'kamyonet': 'Kamyonet',
    'motosiklet': 'Motosiklet',
    'motorcycle': 'Motosiklet',
    'moto': 'Motosiklet',
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter'
  };

  // Eşleşme varsa, eşleşen tipi döndür
  if (typeMapping[lowerType]) {
    return typeMapping[lowerType];
  }

  // Eşleşme bulunamazsa, ilk harf büyük gerisi küçük tipinde format
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

// Türkçe'de doğru eki getirmek için yardımcı fonksiyon
const getTypeSuffix = (type: string): string => {
  const lastLetter = type.slice(-1).toLowerCase();

  // Ünlü uyumu ve son harfe göre ek belirleme
  // Türkçe dilbilgisi kurallarına göre son sese bağlı olarak -lar/-ler veya -ları/-leri eki gelir
  const vowels = 'aeıioöuü';
  if (vowels.includes(lastLetter)) {
    // Eğer kelime ünlü ile bitiyorsa 'lar' veya 'ler' eki gelir
    return type.toLowerCase().endsWith('suv') ? "ları" : "leri";
  } else {
    // Eğer kelime ünsüz ile bitiyorsa son hecedeki ünlüye göre ek belirlenir
    // Basitleştirilmiş kural: son harf ünsüz ise genellikle 'ları' veya 'leri' eki gelir
    const vowelsInWord = Array.from(type.toLowerCase()).filter(char => vowels.includes(char));
    if (vowelsInWord.length > 0) {
      const lastVowel = vowelsInWord[vowelsInWord.length - 1];
      // Kalın ünlüler: a, ı, o, u - İnce ünlüler: e, i, ö, ü
      if (['a', 'ı', 'o', 'u'].includes(lastVowel)) {
        return "ları";
      } else {
        return "leri";
      }
    }
    // Eğer kelimede hiç ünlü yoksa (pek mümkün değil)
    return "ları";
  }
};

// Araç tipine göre doğru eki ekleyen fonksiyon
const getTypeWithSuffix = (type: string, suffix: string = ""): string => {
  const normalizedType = normalizeVehicleType(type);

  switch (suffix) {
    case "accusative": // -ı -i -u -ü (belirtme durumu)
      return normalizedType + getTypeSuffix(normalizedType);
    case "simple_plural": // -lar -ler (çoğul)
      return normalizedType + (getTypeSuffix(normalizedType).startsWith("lar") ? "lar" : "ler");
    default:
      return normalizedType;
  }
};

// Araç tiplerinin doğru formatlanmasını sağlayan fonksiyon
const formatVehicleType = (type: string): string => {
  // Özel formatlamalar
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

  // Fiyat bilgisini çek
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/vehicles/${vehicleData.id}/price`);
        if (response.ok) {
          const priceData = await response.json();
          setPrice(priceData);
        }
      } catch (error) {
        console.error('Fiyat bilgisi çekilirken hata:', error);
      }
    };

    if (vehicleData.id) {
      fetchPrice();
    }
  }, [vehicleData.id]);

  // Paylaşım menüsü dışına tıklandığında menüyü kapat
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

  // Debug bilgileri
  console.log('=== VEHICLE CLIENT CONTENT DEBUG ===');
  console.log('Vehicle Data:', vehicleData);
  console.log('Available:', vehicleData.turkeyStatuses?.available);
  console.log('Available Type:', typeof vehicleData.turkeyStatuses?.available);
  console.log('Raw Turkey Status:', vehicleData.turkeyStatuses);
  console.log('===========================');

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

  // Önceki görsel
  const handlePrevImage = () => {
    if (!vehicleData.images || vehicleData.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? vehicleData.images?.length ?? 0 - 1 : prev - 1));
  };

  // Sonraki görsel
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

      router.push(`/elektrikli-araclar?tip=${urlType}`);
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
    router.push('/elektrikli-araclar');
  };

  // Paylaşım işlevleri
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

    // Paylaşım URL'sini yeni pencerede aç
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // İncele butonunda Rewarded Video Reklam gösterilmeyecek
  const handleInceleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    router.push(url);
  };

  // Görsel URL'ini optimize et
  const getOptimizedImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return '/images/car-placeholder.jpg';
    
    // Cloudinary URL'i ise optimize et
    if (imageUrl.includes('cloudinary.com')) {
      return cloudinaryUtils.optimizeImage(imageUrl, {
        width: 1200,
        height: 900,
        quality: 'auto:good'
      });
    }
    
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/elektrikli-araclar" className="hover:text-[#660566]">
                Elektrikli Araçlar
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">
                {vehicleData.brand} {vehicleData.model}
              </span>
            </div>
          </div>

          {/* Araç Üst Bilgileri */}
          <div className="border-b border-gray-200 pb-8 mb-10">
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{vehicleData.brand} {vehicleData.model}</h1>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                    {getTypeWithSuffix(vehicleData.type)}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {vehicleData.year}
                  </span>
                  {vehicleData.turkeyStatuses && vehicleData.turkeyStatuses.available === true && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                      🇹🇷 Türkiye'de Satışta
                    </span>
                  )}    
                </div>
                <FavoriteButton vehicle={vehicleData} />
              </div>
            </div>
          </div>

          {/* Araç Görseli ve Öne Çıkan Bilgiler */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
            {/* Görsel */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {vehicleData.images && vehicleData.images.length > 0 ? (
                  <Image
                    src={getOptimizedImageUrl(vehicleData.images[currentImageIndex])}
                    alt={`${vehicleData.brand} ${vehicleData.model}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400">Görsel bulunamadı</span>
                  </div>
                )}

                {/* Görsel Geçiş Butonları */}
                {vehicleData.images && vehicleData.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Önceki görsel"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      aria-label="Sonraki görsel"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Görsel İndikatörler */}
              {vehicleData.images && vehicleData.images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  {vehicleData.images.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-[#660566]' : 'bg-gray-300'
                        }`}
                      aria-label={`Görsel ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Öne Çıkan Bilgiler */}
            <div className="lg:col-span-2">
              {/* Fiyat */}
              <div className="mb-4">
                <span className="block text-gray-500 text-sm">Fiyat</span>
                <span className="block text-2xl font-bold text-[#660566]">
                  {price?.base ? formatCurrency(price.base, price.currency) : 'Belirtilmemiş'}
                </span>
              </div>

              {/* Öne Çıkan Özellikler */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-gray-500 text-sm">Menzil</span>
                  <span className="block font-bold">{vehicleData.range} km</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Tüketim</span>
                  <span className="block font-bold">{vehicleData.efficiency?.consumption || 'Belirtilmemiş'} kWh/100 km</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Batarya</span>
                  <span className="block font-bold">{vehicleData.batteryCapacity} kWh</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Motor</span>
                  <span className="block font-bold">{vehicleData.performance?.power || 'Belirtilmemiş'} {vehicleData.performance?.power ? 'HP' : ''}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm">Şarj</span>
                  <span className="block font-bold">%20-%80: {vehicleData.chargingTime?.fastCharging?.time10to80 || 'Belirtilmemiş'} {vehicleData.chargingTime?.fastCharging?.time10to80 ? 'dakika' : ''}</span>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleAddToCompare}
                  className="w-full bg-[#660566] hover:bg-[#4d044d] text-white text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Karşılaştırmaya Ekle
                </button>
                <a
                  href={`/elektrikli-araclar?tip=${formatVehicleType(normalizeVehicleType(vehicleData.type)).toLowerCase()}`}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Diğer Elektrikli {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "accusative")} İncele
                </a>

                {/* Paylaşım Butonu */}
                <div className="relative" ref={shareMenuRef}>
                  <button
                    onClick={handleToggleShareOptions}
                    className="w-full bg-white border border-[#660566] hover:bg-[#660566]/5 text-[#660566] text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex justify-center items-center gap-2"
                    aria-label="Araç detaylarını paylaş"
                  >
                    <FaShareAlt className="text-[#660566]" />
                    <span>Paylaş</span>
                  </button>

                  {showShareOptions && (
                    <div className="absolute left-0 right-0 mt-2 p-3 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-full whitespace-nowrap animate-fade-in">
                      <div className="text-sm text-gray-500 mb-2 font-medium">Bu aracı paylaş</div>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <span className="text-black w-5 h-5 flex items-center justify-center">
                            <XLogo />
                          </span>
                          <span>X'de Paylaş</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaFacebook className="text-[#4267B2]" />
                          <span>Facebook'ta Paylaş</span>
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaWhatsapp className="text-[#25D366]" />
                          <span>WhatsApp'ta Paylaş</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaLinkedin className="text-[#0077B5]" />
                          <span>LinkedIn'de Paylaş</span>
                        </button>
                        <button
                          onClick={() => handleShare('instagram')}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaInstagram className="text-[#E1306C]" />
                          <span>Instagram Story'de Paylaş</span>
                        </button>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg w-full transition-colors text-left hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <FaCopy className={copySuccess ? "text-green-500" : "text-gray-500"} />
                          <span>{copySuccess ? "Kopyalandı!" : "Bağlantıyı Kopyala"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detaylı Bilgiler */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Performans Bilgileri */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Güç ve Hız</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Motor Gücü</span>
                  <span className="font-medium">{vehicleData.performance?.power || 'Belirtilmemiş'} {vehicleData.performance?.power ? 'HP' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Tork</span>
                  <span className="font-medium">{vehicleData.performance?.torque || 'Belirtilmemiş'} {vehicleData.performance?.torque ? 'Nm' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Azami Hız</span>
                  <span className="font-medium">{vehicleData.performance?.topSpeed || 'Belirtilmemiş'} {vehicleData.performance?.topSpeed ? 'km/s' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">0-100 km/s</span>
                  <span className="font-medium">{vehicleData.performance?.acceleration || 'Belirtilmemiş'} {vehicleData.performance?.acceleration ? 's' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Sürüş Sistemi</span>
                  <span className="font-medium">{vehicleData.performance?.driveType || '-'}</span>
                </div>
              </div>
            </div>

            {/* Batarya ve Şarj */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Batarya ve Şarj</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Batarya</span>
                  <span className="font-medium">{vehicleData.batteryCapacity || 'Belirtilmemiş'} {vehicleData.batteryCapacity ? 'kWh' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Menzil</span>
                  <span className="font-medium">{vehicleData.range || 'Belirtilmemiş'} {vehicleData.range ? 'km' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">DC Şarj Hızı</span>
                  <span className="font-medium">{vehicleData.chargingTime?.fastCharging?.power || 'Belirtilmemiş'} {vehicleData.chargingTime?.fastCharging?.power ? 'kW' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">AC Şarj Hızı</span>
                  <span className="font-medium">{vehicleData.chargingTime?.ac || 'Belirtilmemiş'} {vehicleData.chargingTime?.ac ? 'kW' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">DC Şarj Süresi</span>
                  <span className="font-medium">{vehicleData.chargingTime?.fastCharging?.time10to80 || 'Belirtilmemiş'} {vehicleData.chargingTime?.fastCharging?.time10to80 ? 'dakika' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">AC Şarj Süresi</span>
                  <span className="font-medium">{vehicleData.chargingTime?.acTime || 'Belirtilmemiş'} {vehicleData.chargingTime?.acTime ? 'saat' : ''}</span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Ortalama Tüketim</span>
                  <span className="font-medium">{vehicleData.efficiency?.consumption || 'Belirtilmemiş'} kWh / 100 km</span>
                </div>
              </div>
            </div>

            {/* Araç Ölçüleri */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Araç Ölçüleri</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Ağırlık</span>
                  <span className="font-medium">
                    {vehicleData.dimensions?.weight ? `${vehicleData.dimensions.weight.toLocaleString('tr-TR')} kg` : 'Belirtilmemiş'}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Uzunluk</span>
                  <span className="font-medium">
                    {vehicleData.dimensions?.length ? `${vehicleData.dimensions.length.toLocaleString('tr-TR')} mm` : 'Belirtilmemiş'}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Genişlik</span>
                  <span className="font-medium">
                    {vehicleData.dimensions?.width ? `${vehicleData.dimensions.width.toLocaleString('tr-TR')} mm` : 'Belirtilmemiş'}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Yükseklik</span>
                  <span className="font-medium">
                    {vehicleData.dimensions?.height ? `${vehicleData.dimensions.height.toLocaleString('tr-TR')} mm` : 'Belirtilmemiş'}
                  </span>
                </div>
                <div className="px-4 py-3 flex justify-between">
                  <span className="text-gray-600">Bagaj Hacmi</span>
                  <span className="font-medium">
                    {vehicleData.dimensions?.cargoCapacity ? `${vehicleData.dimensions.cargoCapacity.toLocaleString('tr-TR')} litre` : 'Belirtilmemiş'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-16">
            <div className="bg-gradient-to-r from-purple-50 to-white p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Diğer Özellikler</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-t border-gray-100">
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Araç Tipi</div>
                    <div className="w-1/2 text-right font-medium">{getTypeWithSuffix(vehicleData.type)}</div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Çıkış Tarihi</div>
                    <div className="w-1/2 text-right font-medium">{vehicleData.year}</div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Otonom Sürüş</div>
                    <div className="w-1/2 text-right font-medium">
                      {vehicleData.comfort?.autonomousLevel ? 'Seviye ' + vehicleData.comfort.autonomousLevel : '-'}
                    </div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">Isı Pompası</div>
                    <div className="w-1/2 text-right font-medium">
                      {vehicleData.heatPump === 'yes' ? 'Var' : vehicleData.heatPump === 'optional' ? 'Opsiyonel' : 'Yok'}
                    </div>
                  </div>
                  <div className="flex py-3 border-b border-gray-100">
                    <div className="w-1/2 text-gray-700">V2L</div>
                    <div className="w-1/2 text-right font-medium">
                      {vehicleData.v2l === 'yes' ? 'Var' : vehicleData.v2l === 'optional' ? 'Opsiyonel' : 'Yok'}
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

          {/* Alt CTA */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Diğer Elektrikli {getTypeWithSuffix(normalizeVehicleType(vehicleData.type))} Araçlar</h2>
                <p className="text-gray-600">Elektrikli {getTypeWithSuffix(normalizeVehicleType(vehicleData.type))} araçları inceleyebilir ve karşılaştırabilirsiniz.</p>
              </div>
              <div className="flex gap-4">
                <a
                  href={`/elektrikli-araclar?tip=${formatVehicleType(normalizeVehicleType(vehicleData.type)).toLowerCase()}`}
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-center py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Diğer Elektrikli {getTypeWithSuffix(normalizeVehicleType(vehicleData.type), "accusative")} İncele
                </a>
                <a
                  href="/elektrikli-araclar"
                  onClick={handleAllVehiclesClick}
                  className="bg-[#660566] hover:bg-[#4d044d] text-white py-3 px-6 rounded-xl transition-colors duration-200 font-medium focus:outline-none"
                >
                  Tüm Elektrikli Araçlar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}