'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

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

export default function ChargingMapPage() {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Şarj İstasyonları Haritası
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Size en yakın elektrikli araç şarj istasyonlarını bulun
          </p>
        </div>
      </div>

      {/* Harita */}
      <div className="container mx-auto px-4 py-8">
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
              <button
                onClick={searchNearbyChargingStations}
                className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded-lg shadow-md
                         text-[#660566] font-medium hover:bg-[#660566] hover:text-white
                         transition-colors duration-200"
              >
                Yakındaki Şarj İstasyonlarını Bul
              </button>
              <div ref={mapRef} className="w-full h-[600px]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Google Maps API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
    </div>
  );
} 