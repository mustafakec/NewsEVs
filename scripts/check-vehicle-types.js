const { createClient } = require('@supabase/supabase-js');

// Supabase client oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variables are not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVehicleTypes() {
  try {
    console.log('=== VEHICLE TYPES IN DATABASE ===');
    
    // Tüm araç tiplerini al
    const { data, error } = await supabase
      .from('electric_vehicles')
      .select('type')
      .order('type');

    if (error) {
      console.error('Error fetching vehicle types:', error);
      return;
    }

    // Benzersiz tipleri al ve sayılarını göster
    const uniqueTypes = {};
    data.forEach(vehicle => {
      const type = vehicle.type;
      uniqueTypes[type] = (uniqueTypes[type] || 0) + 1;
    });

    console.log('Unique vehicle types in database:');
    Object.entries(uniqueTypes).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} vehicles`);
    });

    console.log('\n=== ANASAYFA TİPLERİ ===');
    const homepageTypes = [
      'sedan', 'hatchback', 'suv', 'commercial', 'station wagon', 
      'pickup', 'mpv', 'sports', 'van', 'bus', 'motorcycle', 'scooter'
    ];

    console.log('Anasayfada gönderilen tipler:');
    homepageTypes.forEach(type => {
      console.log(`- ${type}`);
    });

    console.log('\n=== NORMALIZE EDİLMİŞ TİPLER ===');
    homepageTypes.forEach(type => {
      const normalized = normalizeVehicleType(type);
      console.log(`- ${type} -> ${normalized}`);
    });

  } catch (error) {
    console.error('Script error:', error);
  }
}

// normalizeVehicleType fonksiyonu
function normalizeVehicleType(type) {
  const lowerType = type.toLowerCase().trim();
  
  const typeMapping = {
    'suv': 'SUV',
    'crossover': 'SUV',
    'cuv': 'SUV',
    'coupe': 'Sports',
    'sportback': 'Sports',
    'sports': 'Sports',
    'spor': 'Sports',
    'cabrio': 'Sports',
    'roadster': 'Sports',
    'sedan': 'Sedan',
    'hatchback': 'Hatchback',
    'van': 'Van',
    'ticari': 'Commercial',
    'commercial': 'Commercial',
    'kamyonet': 'Truck',
    'truck': 'Truck',
    'minivan': 'MPV',
    'mpv': 'MPV',
    'station wagon': 'Station Wagon',
    'stationwagon': 'Station Wagon',
    'pickup': 'Pickup',
    'minibüs': 'Bus',
    'minibus': 'Bus',
    'otobüs': 'Bus',
    'otobus': 'Bus',
    'bus': 'Bus',
    'motosiklet': 'Motorcycle',
    'motorcycle': 'Motorcycle',
    'moto': 'Motorcycle',
    'scooter': 'Scooter',
    'elektrikli scooter': 'Scooter',
    'e-scooter': 'Scooter'
  };

  return typeMapping[lowerType] || type;
}

checkVehicleTypes(); 