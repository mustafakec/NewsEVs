// Environment variables'ları yükle
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase bağlantısı
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables eksik!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// toSlug fonksiyonu - vehicleUtils.ts'den alındı
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')      // Boşlukları tire ile değiştir
    .replace(/\./g, '')        // Noktaları kaldır
    .normalize('NFD')          // Aksanlı karakterleri ayır
    .replace(/[\u0300-\u036f]/g, '') // Aksan işaretlerini kaldır
    .replace(/[^a-z0-9-]/g, ''); // Alfanümerik olmayan karakterleri kaldır
}

// URL slug oluşturma fonksiyonu - brand ve model'i birleştirip slug yapar
function createSlug(brand, model) {
  return toSlug(`${brand}-${model}`);
}

// Sitemap XML oluşturma fonksiyonu
function generateSitemapXML(urls) {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';
  
  urls.forEach(url => {
    xml += `  <url>\n`;
    xml += `    <loc>https://elektrikliyiz.com${url.path}</loc>\n`;
    xml += `    <lastmod>${url.lastmod || today}</lastmod>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '\n</urlset>';
  return xml;
}

async function generateSitemap() {
  try {
    console.log('🚀 Sitemap oluşturuluyor...');
    
    // Supabase'den tüm araçları çek
    console.log('📊 Supabase\'den araçlar çekiliyor...');
    const { data: vehicles, error } = await supabase
      .from('electric_vehicles')
      .select('brand, model, year')
      .order('brand', { ascending: true });

    if (error) {
      console.error('Araçlar çekilirken hata:', error);
      return;
    }

    console.log(`✅ ${vehicles.length} araç bulundu`);

    // Ana sayfalar
    const staticPages = [
      { path: '/', priority: '1.0' },
      { path: '/elektrikli-araclar', priority: '0.9' },
      { path: '/karsilastir', priority: '0.9' },
      { path: '/sarj', priority: '0.8' },
      { path: '/blog', priority: '0.7' },
      { path: '/borsa', priority: '0.7' },
      { path: '/hakkimizda', priority: '0.5' },
      { path: '/iletisim', priority: '0.5' },
      { path: '/reklam', priority: '0.4' },
      { path: '/gizlilik-politikasi', priority: '0.4' },
      { path: '/cerez-politikasi', priority: '0.4' },
      { path: '/kvkk', priority: '0.4' },
      { path: '/kullanim-kosullari', priority: '0.4' }
    ];

    // Araç sayfalarını oluştur
    const vehiclePages = vehicles.map(vehicle => ({
      path: `/elektrikli-araclar/${createSlug(vehicle.brand, vehicle.model)}`,
      priority: '0.8'
    }));

    // Tüm URL'leri birleştir
    const allUrls = [...staticPages, ...vehiclePages];

    // Sitemap XML'ini oluştur
    const sitemapXML = generateSitemapXML(allUrls);

    // Dosyayı kaydet
    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');

    console.log(`✅ Sitemap başarıyla oluşturuldu: ${sitemapPath}`);
    console.log(`📊 Toplam URL sayısı: ${allUrls.length}`);
    console.log(`🚗 Araç sayfası: ${vehiclePages.length}`);
    console.log(`📄 Statik sayfa: ${staticPages.length}`);

    // İstatistikler
    const brandStats = {};
    vehicles.forEach(vehicle => {
      brandStats[vehicle.brand] = (brandStats[vehicle.brand] || 0) + 1;
    });

    console.log('\n📈 Marka dağılımı:');
    Object.entries(brandStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([brand, count]) => {
        console.log(`  ${brand}: ${count} araç`);
      });

  } catch (error) {
    console.error('❌ Sitemap oluşturulurken hata:', error);
  }
}

// Scripti çalıştır
generateSitemap(); 