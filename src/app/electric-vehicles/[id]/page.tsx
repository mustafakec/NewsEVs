import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { fetchVehicles } from '@/hooks/useVehicles';
import VehicleClientContent from '@/components/VehicleClientContent';
import { ElectricVehicle } from '@/models/ElectricVehicle';
import { toSlug } from '@/utils/vehicleUtils';
import { customNames } from '@/constants/customPrices';

// Static params for SSG
export async function generateStaticParams() {
  const vehicles = await fetchVehicles();
  return vehicles.map((vehicle) => {
    const slug = toSlug(`${vehicle.brand}-${vehicle.model}`);
    return { id: slug };
  });
}

// Generate dynamic metadata
export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;
  const vehicle = await getVehicleData(params.id);
  if (!vehicle) {
    return {
      title: 'Vehicle Not Found | NewsEVs',
      description: 'The electric vehicle you are looking for could not be found.'
    };
  }
  
  // Custom name varsa onu kullan, yoksa model adını kullan
  const displayName = customNames[vehicle.id] || vehicle.model;
  
  return {
    title: `${vehicle.brand} ${displayName} Price, Features and Comparison | NewsEVs`,
    description: `Explore technical specs, performance data, price info and more about ${vehicle.brand} ${displayName}.`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    openGraph: {
      images: vehicle.images && vehicle.images.length > 0
        ? [{ url: vehicle.images[0] }]
        : [{ url: '/images/car-placeholder.jpg' }],
    },
  };
}

// SSR data fetch
async function getVehicleData(id: string): Promise<ElectricVehicle | null> {
  try {
    const vehicles = await fetchVehicles();
    if (/^\d+$/.test(id)) {
      const vehicle = vehicles.find((v) => v.id === id);
      if (vehicle) return vehicle;
    }
    const normalizedId = toSlug(id);
    let matchedVehicle = vehicles.find((v) => {
      const vehicleSlug = toSlug(`${v.brand}-${v.model}`);
      return vehicleSlug === normalizedId;
    });
    if (!matchedVehicle) {
      if (normalizedId === 'volkswagen-id4' || normalizedId.includes('id4')) {
        matchedVehicle = vehicles.find((v) =>
          v.brand.toLowerCase() === 'volkswagen' && v.model.toLowerCase().includes('id.4')
        );
      } else if (normalizedId.includes('bmw-i4')) {
        matchedVehicle = vehicles.find((v) =>
          v.brand.toLowerCase() === 'bmw' && v.model.toLowerCase().includes('i4')
        );
      }
    }
    return matchedVehicle || null;
  } catch (error) {
    console.error('Error fetching vehicle data:', error);
    return null;
  }
}

export default async function VehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleData(params.id);
  if (!vehicle) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-white">
      <VehicleClientContent initialVehicle={vehicle} />
    </div>
  );
} 