import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { customPrices } from '@/constants/customPrices';

// SEO için metadata dinamik olarak oluşturuluyor
export async function generateMetadata({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  
  if (!vehicle) {
    return {
      title: 'Araç Bulunamadı | Elektrikliyiz',
      description: 'Aradığınız elektrikli araç bulunamadı.',
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    };
  }
  
  return {
    title: `${vehicle.brand} ${vehicle.model} Fiyatı, Özellikleri ve Karşılaştırma | elektrikliyiz`,
    description: `${vehicle.brand} ${vehicle.model} elektrikli aracın detaylı incelemesi, özellikleri ve performans değerleri.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  };
}

// ID'ye göre araç bilgisi çekme
async function getVehicleById(id: string) {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`ID ${id} olan araç yüklenirken hata oluştu:`, error);
    return null;
  }
  
  return data;
}


// ID'ye göre araç bilgisi çekme
async function getVehiclePriceById(id: string) {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('vehicle_id', id)
    .single();
  
  if (error) {
    console.error(`ID ${id} olan araç yüklenirken hata oluştu:`, error);
    return null;
  }
  
  return data;
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  
  if (!vehicle) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/elektrikli-araclar/supabase" 
          className="text-blue-600 hover:text-blue-800 transition-colors duration-150 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tüm Araçlara Dön
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">{vehicle.brand} {vehicle.model}</h1>
          <p className="text-lg text-gray-600">{vehicle.year} • {vehicle.type}</p>
          <p className="text-xl font-bold text-blue-700 mt-2">
            {typeof customPrices[vehicle.id] === 'number'
              ? `$${customPrices[vehicle.id].toLocaleString('en-US')}`
              : vehicle.price?.base
                ? `$${vehicle.price.base.toLocaleString('en-US')}`
                : 'Fiyat Bilgisi Yok'}
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Temel Bilgiler</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Menzil</span>
                  <span className="font-medium">{vehicle.range} km</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Batarya Kapasitesi</span>
                  <span className="font-medium">{vehicle.battery_capacity} kWh</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">10-80% Şarj Süresi</span>
                  <span className="font-medium">
                    {vehicle.charging_time && typeof vehicle.charging_time === 'object' && 'fastCharging' in vehicle.charging_time
                      ? vehicle.charging_time.fastCharging.time10to80
                      : '?'} dakika
                  </span>
                </div>
                
                {vehicle.features && (
                  <div className="pt-2">
                    <h3 className="text-gray-600 mb-2">Özellikler</h3>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.features.map((feature: string, index: number) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Performans Değerleri</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Menzil (km)</div>
                  <div className="text-2xl font-bold text-blue-600">{vehicle.range}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Batarya (kWh)</div>
                  <div className="text-2xl font-bold text-blue-600">{vehicle.battery_capacity}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Üretim Yılı</div>
                  <div className="text-2xl font-bold text-blue-600">{vehicle.year}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Araç Tipi</div>
                  <div className="text-2xl font-bold text-blue-600">{vehicle.type}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Diğer Seçenekler</h2>
        <p className="text-gray-600 mb-6">
          Bu sayfada {vehicle.brand} {vehicle.model} için Supabase veritabanından çekilen verileri görüntülüyorsunuz.
          Supabase, Next.js ile birlikte kullanıldığında hem client-side hem de server-side rendering için mükemmel bir çözüm sunar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/elektrikli-araclar/supabase">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border-l-4 border-blue-600">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Tüm Elektrikli Araçlar</h3>
              <p className="text-gray-600">
                Tüm elektrikli araç modellerini görüntülemek için buraya tıklayın.
              </p>
            </div>
          </Link>
          
          <Link href="/elektrikli-araclar/supabase/ssr">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer border-l-4 border-green-600">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">SSR ile Araçlar</h3>
              <p className="text-gray-600">
                Server-Side Rendering ile oluşturulmuş araç listesini görüntülemek için buraya tıklayın.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 