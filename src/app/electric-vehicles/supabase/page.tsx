import SupabaseVehicles from '@/components/SupabaseVehicles';

export const metadata = {
  title: 'Electric Vehicle List | NewsEVs',
  description: 'List of electric vehicles fetched from Supabase database',
};

export default function SupabaseVehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Electric Vehicle List</h1>
      <p className="text-gray-600 mb-6">
        This page displays information about electric vehicles fetched from the Supabase database.
        The data shown here is loaded from the database in CSV format.
      </p>
      
      {/* Client Component */}
      <SupabaseVehicles />
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Data Source</h3>
        <p className="text-blue-700">
          This data is stored in the Supabase database and served in real time.
          Vehicle information was uploaded to the database from a CSV file.
        </p>
      </div>
    </div>
  );
} 