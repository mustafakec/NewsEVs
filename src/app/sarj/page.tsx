"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useUserStore } from '@/stores/useUserStore';

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface Connection {
  type: string;
  power: number;
  status: string;
  isOperational: boolean;
  currentType: string;
}

interface ChargingStation {
  id: number;
  name: string;
  address: {
    title: string;
    line1: string;
    town: string;
    province: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  connections: Connection[];
  status: {
    title: string;
    isOperational: boolean;
  };
  totalPoints: number;
  cost: string;
  lastVerified: string;
  operator: {
    name: string;
    phone: string;
    website: string;
  };
}

// Mock veri
const mockStations: ChargingStation[] = [
  {
    id: 1,
    name: 'Zorlu Center Şarj İstasyonu',
    address: {
      title: 'Zorlu Center',
      line1: 'Levazım, Koru Sokağı No:2',
      town: 'Beşiktaş',
      province: 'İstanbul'
    },
    location: { lat: 41.0677, lng: 29.0178 },
    connections: [
      { type: 'CCS2', power: 180, status: 'Meşgul', isOperational: true, currentType: 'DC' },
      { type: 'CHAdeMO', power: 120, status: 'Aktif', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Meşgul', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Çalışıyor', isOperational: true },
    totalPoints: 3,
    cost: '7.5 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'ZES',
      phone: '0850 399 73 73',
      website: 'https://zes.net'
    }
  },
  {
    id: 2,
    name: 'İstinye Park Şarj İstasyonu',
    address: {
      title: 'İstinye Park AVM',
      line1: 'İstinye, Derebahçe Cd No:6',
      town: 'Sarıyer',
      province: 'İstanbul'
    },
    location: { lat: 41.1123, lng: 29.0244 },
    connections: [
      { type: 'CCS2', power: 150, status: 'Arızalı', isOperational: false, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Aktif', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Kısmi Arıza', isOperational: true },
    totalPoints: 2,
    cost: '8.0 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Eşarj',
      phone: '0850 277 27 27',
      website: 'https://esarj.com'
    }
  },
  {
    id: 3,
    name: 'Kanyon AVM Şarj İstasyonu',
    address: {
      title: 'Kanyon AVM',
      line1: 'Esentepe, Büyükdere Cd. No:185',
      town: 'Şişli',
      province: 'İstanbul'
    },
    location: { lat: 41.0789, lng: 29.0114 },
    connections: [
      { type: 'CCS2', power: 120, status: 'Meşgul', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 11, status: 'Meşgul', isOperational: true, currentType: 'AC' },
      { type: 'Type 2', power: 11, status: 'Meşgul', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Tüm Soketler Meşgul', isOperational: true },
    totalPoints: 3,
    cost: '7.0 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Sharz',
      phone: '0850 222 74 27',
      website: 'https://sharz.net'
    }
  },
  {
    id: 4,
    name: 'Ataşehir Watergarden Şarj İstasyonu',
    address: {
      title: 'Watergarden AVM',
      line1: 'Barbaros, Barbaros Cd.',
      town: 'Ataşehir',
      province: 'İstanbul'
    },
    location: { lat: 40.9953, lng: 29.1276 },
    connections: [
      { type: 'CCS2', power: 90, status: 'Aktif', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Meşgul', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Çalışıyor', isOperational: true },
    totalPoints: 2,
    cost: '7.2 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Eşarj',
      phone: '0850 277 27 27',
      website: 'https://esarj.com'
    }
  },
  {
    id: 5,
    name: 'Maltepe Piazza Şarj İstasyonu',
    address: {
      title: 'Piazza AVM',
      line1: 'Cevizli, Tugay Yolu Cd. No:71',
      town: 'Maltepe',
      province: 'İstanbul'
    },
    location: { lat: 40.9219, lng: 29.1361 },
    connections: [
      { type: 'CCS2', power: 120, status: 'Arızalı', isOperational: false, currentType: 'DC' },
      { type: 'CHAdeMO', power: 120, status: 'Arızalı', isOperational: false, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Arızalı', isOperational: false, currentType: 'AC' }
    ],
    status: { title: 'Arızalı', isOperational: false },
    totalPoints: 3,
    cost: '7.8 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'ZES',
      phone: '0850 399 73 73',
      website: 'https://zes.net'
    }
  },
  {
    id: 6,
    name: 'Kadıköy Şarj İstasyonu',
    address: {
      title: 'Kadıköy Meydanı',
      line1: 'Caferağa, Mühürdar Cd.',
      town: 'Kadıköy',
      province: 'İstanbul'
    },
    location: { lat: 40.9906, lng: 29.0255 },
    connections: [
      { type: 'CCS2', power: 150, status: 'Aktif', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Meşgul', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Çalışıyor', isOperational: true },
    totalPoints: 2,
    cost: '7.5 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Sharz',
      phone: '0850 222 74 27',
      website: 'https://sharz.net'
    }
  },
  {
    id: 7,
    name: 'Bakırköy Capacity Şarj İstasyonu',
    address: {
      title: 'Capacity AVM',
      line1: 'Osmaniye, Çırpıcı Cd.',
      town: 'Bakırköy',
      province: 'İstanbul'
    },
    location: { lat: 40.9797, lng: 28.8729 },
    connections: [
      { type: 'CCS2', power: 180, status: 'Meşgul', isOperational: true, currentType: 'DC' },
      { type: 'CHAdeMO', power: 120, status: 'Meşgul', isOperational: true, currentType: 'DC' }
    ],
    status: { title: 'Tüm Soketler Meşgul', isOperational: true },
    totalPoints: 2,
    cost: '7.3 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'ZES',
      phone: '0850 399 73 73',
      website: 'https://zes.net'
    }
  },
  {
    id: 8,
    name: 'Beylikdüzü Marmara Park Şarj İstasyonu',
    address: {
      title: 'Marmara Park AVM',
      line1: 'Beylikdüzü OSB, Marmara Cd.',
      town: 'Beylikdüzü',
      province: 'İstanbul'
    },
    location: { lat: 40.9772, lng: 28.6485 },
    connections: [
      { type: 'CCS2', power: 150, status: 'Aktif', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Aktif', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Çalışıyor', isOperational: true },
    totalPoints: 2,
    cost: '7.0 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Eşarj',
      phone: '0850 277 27 27',
      website: 'https://esarj.com'
    }
  },
  {
    id: 9,
    name: 'Üsküdar Şarj İstasyonu',
    address: {
      title: 'Üsküdar Meydanı',
      line1: 'Mimar Sinan, Hakimiyet-i Milliye Cd.',
      town: 'Üsküdar',
      province: 'İstanbul'
    },
    location: { lat: 41.0285, lng: 29.0153 },
    connections: [
      { type: 'CCS2', power: 120, status: 'Bakımda', isOperational: false, currentType: 'DC' },
      { type: 'Type 2', power: 22, status: 'Bakımda', isOperational: false, currentType: 'AC' }
    ],
    status: { title: 'Bakımda', isOperational: false },
    totalPoints: 2,
    cost: '7.4 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'Sharz',
      phone: '0850 222 74 27',
      website: 'https://sharz.net'
    }
  },
  {
    id: 10,
    name: 'Kartal Şarj İstasyonu',
    address: {
      title: 'Kartal Metro',
      line1: 'Kordonboyu, İstasyon Cd.',
      town: 'Kartal',
      province: 'İstanbul'
    },
    location: { lat: 40.8896, lng: 29.1892 },
    connections: [
      { type: 'CCS2', power: 90, status: 'Aktif', isOperational: true, currentType: 'DC' },
      { type: 'Type 2', power: 11, status: 'Aktif', isOperational: true, currentType: 'AC' }
    ],
    status: { title: 'Çalışıyor', isOperational: true },
    totalPoints: 2,
    cost: '7.1 TL/kWh',
    lastVerified: new Date().toLocaleString('tr-TR'),
    operator: {
      name: 'ZES',
      phone: '0850 399 73 73',
      website: 'https://zes.net'
    }
  }
];

const providers = [
  {
    name: 'Tesla',
    logo: '/icons/tesla.png',
    rates: [
      { type: 'AC', power: '11-22 kW', price: '7.50 ₺/kWh' },
      { type: 'DC', power: '150-250 kW', price: '12.50 ₺/kWh' }
    ]
  },
  {
    name: 'Trugo',
    logo: '/icons/trugo.png',
    rates: [
      { type: 'AC', power: '≤ 22 kW', price: '8,49 ₺/kWh' },
      { type: 'DC', power: '60-180 kW', price: '13.00 ₺/kWh' }
    ]
  }
];

export default function SarjPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const isMapInitialized = useRef(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const currentInfoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [stations, setStations] = useState<ChargingStation[]>(mockStations);
  const [googlePlacesMarkers, setGooglePlacesMarkers] = useState<google.maps.Marker[]>([]);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batteryCapacity, setBatteryCapacity] = useState<number>(0);
  const [currentCharge, setCurrentCharge] = useState<number>(0);
  const [targetCharge, setTargetCharge] = useState<number>(0);
  const [kwhPrice, setKwhPrice] = useState<number>(0);

  // Rota oluşturma için gerekli state'ler
  const [isRouteMode, setIsRouteMode] = useState(false);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [showRouteInputs, setShowRouteInputs] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<google.maps.DirectionsRoute | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const [nearbyStationsOnRoute, setNearbyStationsOnRoute] = useState<ChargingStation[]>([]);
  const [showPremiumRouteModal, setShowPremiumRouteModal] = useState(false);

  const [calculationResult, setCalculationResult] = useState<{
    energyToAdd: number;
    totalCost: number;
    chargingTime50kW: string;
    chargingTime150kW: string;
    kwhPrice: number;
    estimatedRange: number;
    acChargingTime: string;
    dcChargingTime: string;
    superChargerTime: string;
  } | null>(null);

  // Kullanıcı bilgilerini al
  const { user, isLoggedIn } = useUserStore();
  const isPremiumUser = isLoggedIn && (user?.isPremium || user?.email === "test@test.com");

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          // En yakın istasyonları bul ve sırala
          const stationsWithDistance = stations.map(station => ({
            ...station,
            distance: calculateDistance(
              location.lat,
              location.lng,
              station.location.lat,
              station.location.lng
            )
          }));

          const sortedStations = stationsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .map(({ distance, ...station }) => station);

          setStations(sortedStations);
          setIsLoading(false);
        },
        () => {
          // Konum alınamazsa İstanbul merkezi göster
          const defaultLocation = { lat: 41.0082, lng: 28.9784 };
          setUserLocation(defaultLocation);
          setIsLoading(false);
        }
      );
    } else {
      const defaultLocation = { lat: 41.0082, lng: 28.9784 };
      setUserLocation(defaultLocation);
      setIsLoading(false);
    }
  };

  // İki nokta arasındaki mesafeyi hesapla (Haversine formülü)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number) => {
    return (value * Math.PI) / 180;
  };

  const searchNearbyChargingStations = () => {
    if (!mapInstance.current || !userLocation) return;

    // Önceki Google Places markerlarını temizle
    googlePlacesMarkers.forEach(marker => marker.setMap(null));
    setGooglePlacesMarkers([]);

    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const request = {
      location: userLocation,
      radius: 5000, // 5km yarıçap
      keyword: 'elektrikli araç şarj istasyonu',
      type: 'point_of_interest'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const newMarkers: google.maps.Marker[] = [];

        results.forEach(place => {
          if (place.geometry && place.geometry.location) {
            const marker = new window.google.maps.Marker({
              map: mapInstance.current,
              position: place.geometry.location,
              title: place.name,
              icon: {
                url: '/charging-station.svg',
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-4 max-w-sm">
                  <h3 class="font-semibold text-lg mb-2">${place.name}</h3>
                  <p class="text-sm text-gray-600 mb-3">${place.vicinity}</p>
                  ${place.rating ? `
                    <div class="flex items-center gap-1 text-sm">
                      <span class="text-yellow-500">★</span>
                      <span>${place.rating}</span>
                      <span class="text-gray-500">(${place.user_ratings_total} değerlendirme)</span>
                    </div>
                  ` : ''}
                </div>
              `
            });

            marker.addListener('click', () => {
              if (currentInfoWindow.current) {
                currentInfoWindow.current.close();
              }
              infoWindow.open(mapInstance.current, marker);
              currentInfoWindow.current = infoWindow;
            });

            newMarkers.push(marker);
          }
        });

        setGooglePlacesMarkers(newMarkers);
      }
    });
  };

  const initMap = () => {
    if (!mapRef.current || isMapInitialized.current || !userLocation || !window.google) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        // Tam ekran kontrolünü etkinleştir ve konumunu sol üste yerleştir
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_TOP
        },
        // Harita tipini (uydu/normal) seçme kontrolünü etkinleştir ve sol üste yerleştir
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.LEFT_TOP
        },
        // Diğer kontrollerin konumlarını da ayarla
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_CENTER
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: window.google.maps.ControlPosition.LEFT_BOTTOM
        }
      });

      mapInstance.current = map;

      // Kullanıcı konumunu göster
      new window.google.maps.Marker({
        map,
        position: userLocation,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Şarj istasyonlarını göster
      stations.forEach(station => {
        const marker = new window.google.maps.Marker({
          map,
          position: station.location,
          icon: {
            url: '/charging-station.svg',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        const availableConnections = station.connections.filter(conn =>
          conn.isOperational && conn.status === 'Aktif'
        ).length;

        let statusColor, statusText;
        if (!station.status.isOperational) {
          statusColor = 'text-red-600';
          statusText = station.status.title;
        } else if (availableConnections === 0) {
          statusColor = 'text-orange-600';
          statusText = 'Tüm Soketler Meşgul';
        } else {
          statusColor = 'text-green-600';
          statusText = `Müsait (${availableConnections}/${station.totalPoints} Port)`;
        }

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-4 max-w-sm">
              <h3 class="font-semibold text-lg mb-2">${station.name}</h3>
              <p class="text-sm text-gray-600 mb-3">${station.address.line1}, ${station.address.town}</p>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Durum:</span>
                  <span class="${statusColor} font-medium">${statusText}</span>
                </div>

                <div class="space-y-1">
                  <span class="text-sm font-medium">Konnektörler:</span>
                  ${station.connections.map(conn => `
                    <div class="text-sm text-gray-600 ml-2">
                      • ${conn.type} (${conn.power}kW) - ${conn.status}
                    </div>
                  `).join('')}
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium">Ücret:</span>
                  <span class="text-gray-900">${station.cost}</span>
                </div>

                <div class="text-xs text-gray-500 mt-2">
                  Son güncelleme: ${station.lastVerified}
                </div>

                <div class="mt-3 pt-3 border-t border-gray-200">
                  <div class="text-sm">
                    <strong>Operatör:</strong> ${station.operator.name}<br>
                    <strong>İletişim:</strong> ${station.operator.phone}<br>
                    ${station.operator.website ?
              `<a href="${station.operator.website}" target="_blank" class="text-purple-600 hover:text-purple-800">
                        Website
                      </a>` : ''}
                  </div>
                </div>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          if (currentInfoWindow.current) {
            currentInfoWindow.current.close();
          }
          infoWindow.open(map, marker);
          currentInfoWindow.current = infoWindow;
        });
      });

      // Haritaya tıklandığında açık info window'u kapat
      map.addListener('click', () => {
        if (currentInfoWindow.current) {
          currentInfoWindow.current.close();
          currentInfoWindow.current = null;
        }
      });

      // Otomatik olarak yakındaki şarj istasyonlarını ara
      searchNearbyChargingStations();

      isMapInitialized.current = true;
    } catch (error) {

      console.error('Harita yüklenirken bir hata oluştu:', error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation && isScriptLoaded) {
      initMap();
    }
  }, [userLocation, isScriptLoaded]);

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
    setIsLoading(false);
  };

  const handleScriptError = () => {
    setError('Harita yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    setIsLoading(false);
  };

  // Şarj maliyeti hesaplama fonksiyonu
  const calculateChargingCost = () => {
    if (batteryCapacity <= 0 || currentCharge >= targetCharge || kwhPrice <= 0) {
      alert('Lütfen geçerli değerler giriniz');
      return;
    }

    // Eklenecek enerji (kWh)
    const energyToAdd = batteryCapacity * (targetCharge - currentCharge) / 100;

    // Toplam maliyet
    const totalCost = energyToAdd * kwhPrice;

    // Şarj süreleri
    const hours50kW = energyToAdd / 50;
    const minutes50kW = Math.round(hours50kW * 60);
    const chargingTime50kW = minutes50kW >= 60
      ? `${Math.floor(minutes50kW / 60)} saat ${minutes50kW % 60} dakika`
      : `${minutes50kW} dakika`;

    const hours150kW = energyToAdd / 150;
    const minutes150kW = Math.round(hours150kW * 60);
    const chargingTime150kW = minutes150kW >= 60
      ? `${Math.floor(minutes150kW / 60)} saat ${minutes150kW % 60} dakika`
      : `${minutes150kW} dakika`;

    // Tahmini menzil artışı (yaklaşık 6 km/kWh varsayımı ile)
    const estimatedRange = Math.round(energyToAdd * 6);

    // Detaylı şarj maliyeti hesaplamalarını ekleyelim
    const acChargingHours = energyToAdd / 11; // 11 kW AC şarj için
    const dcChargingHours = energyToAdd / 50; // 50 kW DC şarj için
    const superChargerHours = energyToAdd / 250;

    setCalculationResult({
      energyToAdd,
      totalCost,
      chargingTime50kW,
      chargingTime150kW,
      kwhPrice,
      estimatedRange,
      acChargingTime: acChargingHours >= 1
        ? `${Math.floor(acChargingHours)} saat ${Math.round((acChargingHours % 1) * 60)} dakika`
        : `${Math.round(acChargingHours * 60)} dakika`,
      dcChargingTime: dcChargingHours >= 1
        ? `${Math.floor(dcChargingHours)} saat ${Math.round((dcChargingHours % 1) * 60)} dakika`
        : `${Math.round(dcChargingHours * 60)} dakika`,
      superChargerTime: superChargerHours >= 1
        ? `${Math.floor(superChargerHours)} saat ${Math.round((superChargerHours % 1) * 60)} dakika`
        : `${Math.round(superChargerHours * 60)} dakika`,
    });
  };

  // Rota oluşturma butonu tıklandığında gösterilen modal 
  const handleRouteButtonClick = () => {
    // Kullanıcı premium ise rota oluşturma özelliğini göster
    if (isPremiumUser) {
      setIsRouteMode(true);
      setShowRouteInputs(true);
    } else {
      // Premium değilse premium modalını göster
      setShowPremiumRouteModal(true);
    }
  };

  // Premium modal kapatma
  const handleCloseRouteModal = () => {
    setShowPremiumRouteModal(false);
  };

  // Rota oluşturma
  const createRoute = () => {
    if (!window.google || !mapInstance.current || !startLocation || !endLocation) return;

    const directionsService = new window.google.maps.DirectionsService();

    if (!directionsRenderer.current) {
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        map: mapInstance.current,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#660566',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });
    } else {
      directionsRenderer.current.setMap(mapInstance.current);
    }

    directionsService.route({
      origin: startLocation,
      destination: endLocation,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false,
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.current?.setDirections(result);
        setCurrentRoute(result.routes[0]);

        // Rota üzerindeki şarj istasyonlarını bul
        findChargingStationsOnRoute(result.routes[0]);
      } else {
        alert('Rota oluşturulamadı. Lütfen geçerli başlangıç ve bitiş noktaları girin.');
      }
    });
  };

  // Rota üzerindeki şarj istasyonlarını bulma
  const findChargingStationsOnRoute = (route: google.maps.DirectionsRoute) => {
    if (!route || !route.legs || route.legs.length === 0 || !mapInstance.current) return;

    // Önceki markerları temizle
    googlePlacesMarkers.forEach(marker => marker.setMap(null));

    // Rota üzerinden stratejik noktaları ayarla (her 20-30 km'de bir)
    const routePoints: { lat: number, lng: number }[] = [];

    // Her bacak için adım adım noktaları topla
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        const distance = step.distance?.value || 5000;
        // Daha uzun mesafeler için daha az nokta al
        const samplingDistance = distance > 50000 ? 30000 : 20000; // 20-30 km'de bir nokta örnekle
        const numPoints = Math.max(2, Math.floor(distance / samplingDistance));

        for (let i = 0; i < numPoints; i++) {
          const progress = i / (numPoints - 1);
          const lat = step.start_location.lat() + (step.end_location.lat() - step.start_location.lat()) * progress;
          const lng = step.start_location.lng() + (step.end_location.lng() - step.start_location.lng()) * progress;

          routePoints.push({ lat, lng });
        }
      });
    });


    // Places API'si ile şarj istasyonlarını ara
    const newMarkers: google.maps.Marker[] = [];
    let foundStations: any[] = [];
    let processedPoints = 0;

    // Arama sonuçlarını işleme fonksiyonu
    const processSearchResults = (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus, searchPoint: { lat: number, lng: number }) => {
      processedPoints++;

      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          // Zaten eklenmiş istasyonu tekrar ekleme (place_id kontrolü)
          if (foundStations.some(station => station.place_id === place.place_id)) {
            return;
          }

          if (place.geometry && place.geometry.location) {
            foundStations.push(place);

            const marker = new window.google.maps.Marker({
              map: mapInstance.current!,
              position: place.geometry.location,
              icon: {
                url: '/charging-station.svg',
                scaledSize: new window.google.maps.Size(32, 32)
              },
              zIndex: 10 // Rotanın üzerinde göster
            });

            // Marker için bilgi penceresi oluştur
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-4 max-w-sm">
                  <h3 class="font-semibold text-lg mb-2">${place.name}</h3>
                  <p class="text-sm text-gray-600 mb-3">${place.vicinity || ''}</p>
                  <div class="text-xs font-medium text-purple-600 mb-1">Rota Üzerinde</div>
                  
                  ${place.rating ? `
                    <div class="flex items-center gap-1 text-sm mb-2">
                      <span class="text-yellow-500">★</span>
                      <span>${place.rating}</span>
                      <span class="text-gray-500">(${place.user_ratings_total || 0} değerlendirme)</span>
                    </div>
                  ` : ''}
                  
                  ${place.opening_hours?.isOpen ? `
                    <div class="text-sm text-green-600 font-medium mb-2">Şu anda açık</div>
                  ` : ''}
                </div>
              `
            });

            marker.addListener('click', () => {
              if (currentInfoWindow.current) {
                currentInfoWindow.current.close();
              }
              infoWindow.open(mapInstance.current!, marker);
              currentInfoWindow.current = infoWindow;
            });

            newMarkers.push(marker);
          }
        });
      }

      // Tüm noktalar işlendiğinde işlemi tamamla
      if (processedPoints === routePoints.length) {

        if (foundStations.length === 0) {
          alert('Rota üzerinde şarj istasyonu bulunamadı. Farklı bir rota deneyin veya daha geniş bir arama yapın.');
        }

        setGooglePlacesMarkers(newMarkers);
        setNearbyStationsOnRoute(foundStations);
      }
    };

    // Rota üzerindeki her stratejik noktada arama yap
    const service = new window.google.maps.places.PlacesService(mapInstance.current);

    routePoints.forEach(point => {
      const request = {
        location: point,
        radius: 5000, // 5km yarıçap
        keyword: 'elektrikli araç şarj istasyonu',
        type: 'point_of_interest'
      };

      // Arama isteklerini bir süre farkıyla gönder (rate limiting)
      setTimeout(() => {
        service.nearbySearch(request, (results, status) =>
          processSearchResults(results, status, point)
        );
      }, 300 * routePoints.indexOf(point)); // Her nokta için 300ms bekle
    });
  };

  // Rota modunu iptal et
  const cancelRouteMode = () => {
    setShowRouteInputs(false);
    setStartLocation("");
    setEndLocation("");
    setCurrentRoute(null);
    setNearbyStationsOnRoute([]);

    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(null);
    }

    // Orjinal haritayı göster
    initMap();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          {/* <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                        bg-gradient-to-r from-[#660566] via-[#330233] to-black mb-4">
              Şarj Haritası
            </h1>
            <p className="text-lg text-gray-600">
              Size en yakın şarj istasyonlarını bulun.
            </p>
          </div> */}

          {/* Harita */}
          {/* <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {isLoading ? (
                <div className="w-full h-[600px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#660566] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Harita yükleniyor...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="w-full h-[600px] flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button
                      onClick={searchNearbyChargingStations}
                      className="bg-white px-4 py-2 rounded-lg shadow-md
                             text-[#660566] font-medium hover:bg-[#660566] hover:text-white
                               transition-colors duration-200 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      Yakındaki Şarj İstasyonlarını Bul
                    </button>

                    {!showRouteInputs ? (
                      <button
                        onClick={handleRouteButtonClick}
                        className="bg-white px-4 py-2 rounded-lg shadow-md
                                 text-[#660566] font-medium hover:bg-[#660566] hover:text-white
                                 transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <div className="flex items-center">
                          Rota Oluştur
                          <span className="ml-2 bg-[#660566] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">Premium</span>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={cancelRouteMode}
                        className="bg-white px-4 py-2 rounded-lg shadow-md
                                 text-red-600 font-medium hover:bg-red-50 hover:text-red-700
                                 transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rotayı İptal Et
                      </button>
                    )}
                  </div>

                  {showRouteInputs && (
                    <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-md w-72">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Rota Oluştur</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="start-location" className="block text-xs text-gray-600 mb-1">Başlangıç Noktası</label>
                          <input
                            type="text"
                            id="start-location"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            placeholder="ör. Ankara, Türkiye"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="end-location" className="block text-xs text-gray-600 mb-1">Varış Noktası</label>
                          <input
                            type="text"
                            id="end-location"
                            value={endLocation}
                            onChange={(e) => setEndLocation(e.target.value)}
                            placeholder="ör. İstanbul, Türkiye"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <button
                          onClick={createRoute}
                          disabled={!startLocation || !endLocation}
                          className="w-full bg-[#660566] text-white font-medium py-2 px-4 rounded-md hover:bg-[#550455] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Rota Oluştur
                        </button>
                      </div>
                    </div>
                  )}

                  <div ref={mapRef} className="w-full h-[600px]"></div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center">
              <div className="text-center text-xs text-gray-400 max-w-2xl px-4 py-1.5">
                <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Veriler yoğunluk durumuna bağlı olarak gecikebilir. Şarj istasyonlarının yoğunluk/bakım/arıza gibi durumları değişiklik gösterebilir. Google'ın güncelleme takvimine göre veriler güncellenir.</span>
              </div>
            </div>
          </div> */}

          {/* Güncel Şarj Ücretleri ve Şarj Maliyeti Hesaplayıcı */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* SOL TARAF: Güncel Şarj Ücretleri */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Şarj İstasyonu Ücretleri</h3>
                  <p className="text-gray-700 text-sm mb-0">Şarj istasyonlarının ücret ve detaylarını inceleyin.</p>
                </div>

                <div className="p-6 pt-8">
                  {/* Tesla */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="/icons/tesla.png" alt="Tesla Logo" className="h-8" />
                      <h3 className="text-lg font-semibold text-gray-900">Tesla</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">DC Şarj (250 kW)</span>
                        <span className="text-[#660566] font-semibold">8,8₺ / kWh</span>
                      </div>
                    </div>
                  </div>

                  {/* Trugo */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <img src="/icons/trugo.png" alt="Trugo Logo" className="h-8" />
                      <h3 className="text-lg font-semibold text-gray-900">Trugo</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">AC Şarj (≤ 22 kW)</span>
                          <span className="text-[#660566] font-semibold">8,49₺ / kWh</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">DC Şarj ({'<'} 150 kW)</span>
                          <span className="text-[#660566] font-semibold">10,60₺ / kWh</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600">DC Şarj (≥ 150 kW)</span>
                          <span className="text-[#660566] font-semibold">11,82₺ / kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bilgilendirme */}
                  <div className="mt-6 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Diğer şarj istasyonları çok yakında.</span>
                    </div>
                    <div className="text-center text-xs text-gray-400 px-3 py-1.5">
                      <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Fiyatlar ve bilgiler değişiklik gösterebilir. Bu sayfadaki tüm markalar ve logolar bilgilendirme amaçlıdır. Firmalarla iş birliğimiz veya bağlantımız yoktur.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAĞ TARAF: Şarj Maliyeti Hesaplayıcı */}

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                {/* <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-[#660566] to-[#330233] rounded-full">
                    Premium
                  </span>
                </div> */}

                <div className="bg-gradient-to-r from-[#660566]/10 via-purple-50 to-[#660566]/5 p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Şarj Maliyeti Hesaplayıcı</h3>
                  <p className="text-gray-700 text-sm mb-0">Aracınızın şarj maliyetini hesaplayın.</p>
                </div>

                {/* {!isPremiumUser && (
                  <div className="absolute inset-x-0 top-[104px] bottom-0 z-10 flex items-center justify-center bg-white">
                    <div className="p-6 max-w-md text-center">
                      <div className="w-16 h-16 bg-[#660566]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#660566]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3">Premium Özellik</h2>
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-2">
                          Bu içerik sadece premium üyelere özeldir. Premium üyelik ile tüm özel içeriklere sınırsız erişim sağlayabilirsiniz.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const event = new Event('show-premium-modal');
                            window.dispatchEvent(event);
                          }}
                          className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-3 rounded-lg font-medium
                                hover:opacity-90 transition-all duration-200 hover:shadow-lg"
                        >
                          Premium'a Geç
                        </button>
                      </div>
                    </div>
                  </div>
                )} */}

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="batteryCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Batarya Kapasitesi (kWh)
                      </label>
                      <input
                        type="number"
                        id="batteryCapacity"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="Örn: 70"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          setBatteryCapacity(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Mevcut Şarj (%)
                        </label>
                        <input
                          type="number"
                          id="currentCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="Örn: 20"
                          min="0"
                          max="100"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setCurrentCharge(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
                          }}
                        />
                      </div>

                      <div>
                        <label htmlFor="targetCharge" className="block text-sm font-medium text-gray-700 mb-1">
                          Hedef Şarj (%)
                        </label>
                        <input
                          type="number"
                          id="targetCharge"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                          placeholder="Örn: 80"
                          min="0"
                          max="100"
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            setTargetCharge(isNaN(value) ? 0 : Math.min(100, Math.max(0, value)));
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="kwhPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Şarj Ücreti (₺/kWh)
                      </label>
                      <input
                        type="number"
                        id="kwhPrice"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#660566]/20 focus:border-[#660566]/30 transition-colors"
                        placeholder="Örn: 8.8"
                        step="0.01"
                        onChange={(e) => {
                          const value = e.target.valueAsNumber;
                          setKwhPrice(isNaN(value) ? 0 : value);
                        }}
                      />
                    </div>

                    <div className="mt-2">
                      <button
                        onClick={calculateChargingCost}
                        className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white 
                               rounded-lg px-4 py-2 font-medium hover:opacity-90 
                               transition-all duration-200"
                      >
                        Hesapla
                      </button>
                    </div>
                  </div>

                  {calculationResult !== null && (
                    <div className="mt-6 p-5 bg-[#660566]/5 rounded-xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Hesaplama Sonucu</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Eklenecek Enerji:</span>
                          <span className="font-medium">{calculationResult.energyToAdd.toFixed(2)} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Şarj Süresi (50 kW):</span>
                          <span className="font-medium">{calculationResult.chargingTime50kW}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Şarj Süresi (150 kW):</span>
                          <span className="font-medium">{calculationResult.chargingTime150kW}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tahmini Menzil Artışı:</span>
                          <span className="font-medium">~{calculationResult.estimatedRange} km</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2 border-t border-purple-100">
                          <span className="text-gray-800 font-medium">Toplam Maliyet:</span>
                          <span className="text-[#660566] font-bold">{calculationResult.totalCost.toFixed(2)} ₺</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Google Maps API */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="afterInteractive"
            onLoad={handleScriptLoad}
            onError={handleScriptError}
          />

          {/* Premium Rota Modal */}
          {showPremiumRouteModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div></div>
                  <button
                    onClick={handleCloseRouteModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <div className="w-16 h-16 bg-[#660566]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#660566]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 text-center mb-3">Premium Özellik</h2>

                  <p className="text-gray-600 text-center">
                    Rota oluşturma ve rota üzerindeki şarj istasyonlarını görüntüleme özelliği Premium üyelere özeldir.
                  </p>

                  <div className="mt-6 space-y-4">
                    <button
                      onClick={() => {
                        // Premium modal'ı açacak eventi tetikle
                        const event = new Event('show-premium-modal');
                        window.dispatchEvent(event);
                        handleCloseRouteModal();
                      }}
                      className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-colors hover:shadow-lg"
                    >
                      Premium Üyelik Al
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 