const fs = require('fs');
const path = require('path');

// Elektrikli araçlar verilerini oku
const electricVehiclesPath = path.join(__dirname, '../src/data/electric-vehicles.json');
const vehiclesPath = path.join(__dirname, '../src/data/vehicles.json');

// Mevcut sitemap'i oku
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

function generateVehicleSlug(brand, model, year) {
  return `${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${year}`;
}

async function fetchSupabaseVehicles() {
  try {
    // Environment variables'ları yükle
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
    
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('⚠️ Supabase credentials bulunamadı, sadece yerel veriler kullanılacak');
      return [];
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('electric_vehicles')
      .select('id, brand, model, year');
    
    if (error) {
      console.log('⚠️ Supabase\'den veri çekilemedi:', error.message);
      return [];
    }
    
    console.log(`📊 Supabase'den ${data.length} araç çekildi`);
    return data || [];
  } catch (error) {
    console.log('⚠️ Supabase bağlantısı başarısız:', error.message);
    return [];
  }
}

async function generateSitemap() {
  try {
    // Araç verilerini oku
    const electricVehicles = JSON.parse(fs.readFileSync(electricVehiclesPath, 'utf8'));
    const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));
    
    // Supabase'den araçları çek
    const supabaseVehicles = await fetchSupabaseVehicles();
    
    // Tüm araçları birleştir ve tekrarları önle
    const allVehicles = [...electricVehicles, ...vehicles, ...supabaseVehicles];
    const uniqueVehicles = [];
    const seenSlugs = new Set();
    
    allVehicles.forEach(vehicle => {
      const slug = generateVehicleSlug(vehicle.brand, vehicle.model, vehicle.year);
      if (!seenSlugs.has(slug)) {
        seenSlugs.add(slug);
        uniqueVehicles.push(vehicle);
      }
    });
    
    // Statik sayfalar için temel sitemap oluştur
    const baseUrl = 'https://www.elektrikliyiz.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/elektrikli-araclar</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/karsilastir</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/sarj</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/hakkimizda</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/iletisim</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/reklam</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/gizlilik-politikasi</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/cerez-politikasi</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/kvkk</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>${baseUrl}/kullanim-kosullari</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.4</priority>
  </url>`;
    
    // Araç URL'lerini ekle
    uniqueVehicles.forEach(vehicle => {
      const slug = generateVehicleSlug(vehicle.brand, vehicle.model, vehicle.year);
      sitemapContent += `
  <url>
    <loc>${baseUrl}/elektrikli-araclar/${slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>`;
    });
    
    sitemapContent += `
</urlset>`;
    
    // Güncellenmiş sitemap'i yaz
    fs.writeFileSync(sitemapPath, sitemapContent);
    
    console.log(`✅ Sitemap güncellendi! ${uniqueVehicles.length} benzersiz araç URL'si eklendi.`);
    console.log(`📊 Toplam benzersiz araç sayısı: ${uniqueVehicles.length}`);
    console.log(`🔍 Tekrarlanan araçlar temizlendi.`);
    
    // Kaynak dağılımını göster
    console.log(`📈 Kaynak dağılımı:`);
    console.log(`   - Yerel JSON dosyaları: ${electricVehicles.length + vehicles.length} araç`);
    console.log(`   - Supabase: ${supabaseVehicles.length} araç`);
    console.log(`   - Toplam benzersiz: ${uniqueVehicles.length} araç`);
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

generateSitemap(); 