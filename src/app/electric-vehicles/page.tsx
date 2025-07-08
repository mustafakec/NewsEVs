import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Electric Vehicles Client component - dynamically imported
const ElectricVehiclesClient = dynamic(
  () => import('@/components/elektrikli-araclar/ElectricVehiclesClient'),
  {
    loading: () => <PageLoading />,
    ssr: true,
  }
);

// Page metadata
export const metadata: Metadata = {
  title: 'Electric Vehicles | Latest Electric Vehicle Models',
  description: "Compare all electric vehicle models sold in Turkey and learn about technology, charging time, range and other details.",
  openGraph: {
    title: 'Electric Vehicles | Latest Electric Vehicle Models',
    description: "Compare all electric vehicle models sold in Turkey and learn about technology, charging time, range and other details."
  }
};

// Loading component shown while page is loading
function PageLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="lg:w-full flex-shrink-0">
              <div className="sticky top-4">
                <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 bg-gray-200 rounded w-3/4 mt-3 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            {/* Vehicle List */}
            <div className="md:col-span-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="w-full h-48 bg-purple-100 rounded-lg mb-4"></div>
                    <div className="h-6 bg-purple-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-purple-100 rounded w-1/2 mb-4"></div>
                    <div className="grid grid-cols-2 gap-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-8 bg-purple-100 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Electric Vehicles Page - Server Component
export default function ElectricVehiclesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <ElectricVehiclesClient />
    </Suspense>
  );
}
