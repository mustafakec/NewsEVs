import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Electric Vehicle List SSR | NewsEVs',
  description: 'List of electric vehicles fetched from Supabase database with Server-Side Rendering',
};

// Server component for SSR
async function getElectricVehicles() {
  const { data, error } = await supabase
    .from('electric_vehicles')
    .select('*');
  
  if (error) {
    console.error('Error loading electric vehicles:', error);
    return [];
  }
  
  return data || [];
}

export default async function SSRSupabaseVehiclesPage() {
  const vehicles = await getElectricVehicles();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Electric Vehicle List (SSR)</h1>
        <Link 
          href="/electric-vehicles/supabase" 
          className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          Go to Client Side Version →
        </Link>
      </div>
      
      <p className="text-gray-600 mb-6">
        This page displays information about electric vehicles fetched from the Supabase database using Server Side Rendering (SSR). This method is more SEO-friendly and improves initial load performance.
      </p>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Electric Vehicles</h2>
          <p className="text-sm text-gray-600">Data fetched from Supabase with Server Side Rendering</p>
        </div>

        {vehicles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No vehicle data available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Range (km)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery (kWh)
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
        <h3 className="text-lg font-medium text-green-800 mb-2">Advantages of Server Side Rendering</h3>
        <ul className="list-disc pl-5 text-green-700 space-y-2">
          <li>All content is ready when the page loads, so the initial page load speed is higher</li>
          <li>More SEO-friendly for search engines, as content is already present in the HTML before JavaScript loads</li>
          <li>Basic content can be viewed even if JavaScript is disabled</li>
          <li>API calls are made on the server side, not the client side, which increases user data privacy</li>
        </ul>
      </div>
    </div>
  );
} 