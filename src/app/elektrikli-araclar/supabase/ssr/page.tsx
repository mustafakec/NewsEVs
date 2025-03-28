import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Elektrikli Araç Listesi SSR | Elektrikliyiz',
  description: 'Server-Side Rendering ile Supabase veritabanından çekilen elektrikli araçların listesi',
};

// Sunucu bileşeni, SSR için
async function getElectricVehicles() {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('*');
  
  if (error) {
    console.error('Elektrikli araçlar yüklenirken hata oluştu:', error);
    return [];
  }
  
  return data || [];
}

export default async function SSRSupabaseVehiclesPage() {
  const vehicles = await getElectricVehicles();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Elektrikli Araç Listesi (SSR)</h1>
        <Link 
          href="/elektrikli-araclar/supabase" 
          className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          Client Side Versiyona Git →
        </Link>
      </div>
      
      <p className="text-gray-600 mb-6">
        Bu sayfa Server Side Rendering (SSR) kullanarak Supabase veritabanından çekilen elektrikli araçların 
        bilgilerini göstermektedir. Bu yöntem SEO için daha avantajlıdır ve ilk yükleme performansını iyileştirir.
      </p>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Elektrikli Araçlar</h2>
          <p className="text-sm text-gray-600">Server Side Rendering ile Supabase'den çekilen veriler</p>
        </div>

        {vehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Henüz araç verisi bulunmuyor.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yıl
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menzil (km)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batarya (kWh)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-all duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.battery_capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 mb-2">Server Side Rendering Avantajları</h3>
        <ul className="list-disc pl-5 text-green-700 space-y-2">
          <li>Sayfa yüklendiğinde tüm içerik hazır gelir, bu yüzden sayfa ilk görüntülenme hızı daha yüksektir</li>
          <li>Arama motorları için daha SEO dostu, çünkü içerik JavaScript yüklenmeden önce zaten HTML'de bulunur</li>
          <li>JavaScript devre dışı bırakılmış olsa bile temel içerik görüntülenebilir</li>
          <li>API çağrıları client tarafında değil, sunucu tarafında yapılır, bu da kullanıcı verilerinin gizliliğini artırır</li>
        </ul>
      </div>
    </div>
  );
} 