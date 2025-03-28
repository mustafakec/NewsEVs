import SupabaseVehicles from '@/components/SupabaseVehicles';

export const metadata = {
  title: 'Elektrikli Araç Listesi | Elektrikliyiz',
  description: 'Supabase veritabanından çekilen elektrikli araçların listesi',
};

export default function SupabaseVehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Elektrikli Araç Listesi</h1>
      <p className="text-gray-600 mb-6">
        Bu sayfa Supabase veritabanından çekilen elektrikli araçların bilgilerini göstermektedir.
        Veritabanına CSV formatında yüklenen veriler burada gösterilir.
      </p>
      
      {/* Client Component */}
      <SupabaseVehicles />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Veri Kaynağı</h3>
        <p className="text-blue-700">
          Bu veriler Supabase veritabanında saklanmaktadır ve gerçek zamanlı olarak sunulmaktadır.
          Araç bilgileri CSV dosyasından veritabanına yüklenmiştir.
        </p>
      </div>
    </div>
  );
} 