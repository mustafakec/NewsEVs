const fs = require('fs');
const path = require('path');

// Araç verilerini oku
const vehiclesPath = path.join(__dirname, '../src/data/electric-vehicles.json');
const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf8'));

console.log(`✅ ${vehicles.length} araç bulundu.`);

function turkishToSlug(str) {
  return str
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'C')
    .replace(/İ/g, 'I')
    .replace(/Ş/g, 'S')
    .replace(/Ğ/g, 'G')
    .replace(/Ü/g, 'U')
    .replace(/Ö/g, 'O');
}

function createSlug(brand, model) {
  // Modelde parantezli yıl veya varyant varsa, onu slug'a ekle
  const parenMatch = model.match(/^(.*) \(([^)]+)\)$/);
  if (parenMatch) {
    const base = turkishToSlug(parenMatch[1].toLowerCase()).replace(/\s+/g, '-').replace(/\./g, '').replace(/[^a-z0-9-]/g, '');
    const variant = turkishToSlug(parenMatch[2].toLowerCase()).replace(/\s+/g, '-').replace(/\./g, '').replace(/[^a-z0-9-]/g, '');
    return `${turkishToSlug(brand.toLowerCase())}-${base}-${variant}`;
  }
  // Standart slug
  return `${turkishToSlug(brand.toLowerCase())}-${turkishToSlug(model.toLowerCase())}`
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[^a-z0-9-]/g, '');
}

// Sitemap başlangıcı
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Ana Sayfa -->
  <url>
    <loc>https://newsevs.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Elektrikli Araçlar Ana Sayfa -->
  <url>
    <loc>https://newsevs.com/electric-vehicles</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>



  <!-- Karşılaştırma Sayfası -->
  <url>
    <loc>https://newsevs.com/compare</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>



  <!-- Şarj İstasyonları -->
  <url>
    <loc>https://newsevs.com/charging</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>







  <!-- Blog -->
  <url>
    <loc>https://newsevs.com/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Hakkımızda -->
  <url>
    <loc>https://newsevs.com/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>



  <!-- İletişim -->
  <url>
    <loc>https://newsevs.com/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>



  <!-- Reklam -->
  <url>
    <loc>https://newsevs.com/advertising</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>



  <!-- Gizlilik Politikası -->
  <url>
    <loc>https://newsevs.com/privacy-policy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>



  <!-- Kullanım Koşulları -->
  <url>
    <loc>https://newsevs.com/terms-of-use</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>



  <!-- Cookie Politikası -->
  <url>
    <loc>https://newsevs.com/cookie-policy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>





  <!-- GDPR -->
  <url>
    <loc>https://newsevs.com/gdpr</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

// Araç detay sayfalarını ekle
// vehicles.forEach(vehicle => {
//   const vehicleSlug = createSlug(vehicle.brand, vehicle.model);
//   const lastmod = new Date().toISOString().split('T')[0];
//   sitemap += `
//   <url>
//     <loc>https://newsevs.com/electric-vehicles/${vehicleSlug}</loc>
//     <lastmod>${lastmod}</lastmod>
//     <changefreq>weekly</changefreq>
//     <priority>0.8</priority>
//   </url>`;
// });

// --- SADECE MANUEL 217 ARAÇ ---
const manualVehicles = [
  { id: 'ev0001', brand: 'Togg', model: 'T10X' },
  { id: 'ev0002', brand: 'Tesla', model: 'Model Y (2024)' },
  { id: 'ev0003', brand: 'Citroen', model: 'Ami Pops' },
  { id: 'ev0004', brand: 'Citroen', model: 'Ami Peps' },
  { id: 'ev0005', brand: 'Tesla', model: 'Model Y SR (2025)' },
  { id: 'ev0006', brand: 'Ford', model: 'Capri' },
  { id: 'ev0007', brand: 'Ford', model: 'Puma Gen-E' },
  { id: 'ev0008', brand: 'Skoda', model: 'Elroq EV' },
  { id: 'ev0009', brand: 'Mercedes', model: 'EQE 280' },
  { id: 'ev0010', brand: 'Opel', model: 'Grandland' },
  { id: 'ev0011', brand: 'Citroen', model: 'e-C4 (2025)' },
  { id: 'ev0012', brand: 'Citroen', model: 'e-C4 X (2025)' },
  { id: 'ev0013', brand: 'Microlino', model: 'Lite' },
  { id: 'ev0014', brand: 'Tesla', model: 'Model Y LR (2025)' },
  { id: 'ev0015', brand: 'KGM', model: 'Torres EVX' },
  { id: 'ev0016', brand: 'Tesla', model: 'Cybertruck (Tek motor)' },
  { id: 'ev0017', brand: 'Tesla', model: 'Cybertruck (Çift motor)' },
  { id: 'ev0018', brand: 'Tesla', model: 'Cybertruck (Tri motor)' },
  { id: 'ev0019', brand: 'MINI', model: 'Countryman SE ALL4' },
  { id: 'ev0020', brand: 'BMW', model: 'iX1 eDrive30' },
  { id: 'ev0021', brand: 'Citroen', model: 'e-C3' },
  { id: 'ev0022', brand: 'Audi', model: 'Q6 e-tron' },
  { id: 'ev0023', brand: 'BYD', model: 'Atto 3' },
  { id: 'ev0024', brand: 'BYD', model: 'Dolphin' },
  { id: 'ev0025', brand: 'BYD', model: 'Tang' },
  { id: 'ev0026', brand: 'BYD', model: 'Han' },
  { id: 'ev0027', brand: 'BYD', model: 'Seal AWD' },
  { id: 'ev0028', brand: 'BYD', model: 'Seal Design' },
  { id: 'ev0029', brand: 'BYD', model: 'Seal U' },
  { id: 'ev0030', brand: 'Kia', model: 'EV3' },
  { id: 'ev0031', brand: 'Opel', model: 'Corsa Elektrik' },
  { id: 'ev0032', brand: 'Opel', model: 'Astra Elektrik' },
  { id: 'ev0033', brand: 'Opel', model: 'Grandland Elektrik' },
  { id: 'ev0034', brand: 'Opel', model: 'Frontera Elektrik' },
  { id: 'ev0035', brand: 'Opel', model: 'Mokka Elektrik' },
  { id: 'ev0036', brand: 'Hyundai', model: 'Kona Elektrik' },
  { id: 'ev0037', brand: 'Hyundai', model: 'INSTER' },
  { id: 'ev0038', brand: 'Hyundai', model: 'IONIQ 5' },
  { id: 'ev0039', brand: 'Hyundai', model: 'IONIQ 5 N' },
  { id: 'ev0040', brand: 'Hyundai', model: 'IONIQ 6' },
  { id: 'ev0041', brand: 'Renault', model: 'Megane E-Tech' },
  { id: 'ev0042', brand: 'Renault', model: '5 E-Tech' },
  { id: 'ev0043', brand: 'Renault', model: 'Kangoo E-Tech' },
  { id: 'ev0044', brand: 'Volvo', model: 'EX30' },
  { id: 'ev0045', brand: 'Volvo', model: 'EX40' },
  { id: 'ev0046', brand: 'Volvo', model: 'EC40 (Single)' },
  { id: 'ev0047', brand: 'Volvo', model: 'EC40 (Twin)' },
  { id: 'ev0048', brand: 'Peugeot', model: 'e-208 GT' },
  { id: 'ev0049', brand: 'Peugeot', model: 'e-308 GT' },
  { id: 'ev0050', brand: 'Peugeot', model: 'e-2008' },
  { id: 'ev0051', brand: 'Peugeot', model: 'e-3008' },
  { id: 'ev0052', brand: 'Peugeot', model: 'e-5008' },
  { id: 'ev0053', brand: 'BMW', model: 'iX M60' },
  { id: 'ev0054', brand: 'BMW', model: 'i5 eDrive40' },
  { id: 'ev0055', brand: 'BMW', model: 'i4 eDrive40' },
  { id: 'ev0056', brand: 'BMW', model: 'iX2 eDrive20' },
  { id: 'ev0057', brand: 'BMW', model: 'i7 xDrive60' },
  { id: 'ev0058', brand: 'Alpine', model: 'A390' },
  { id: 'ev0059', brand: 'Alpine', model: 'A290' },
  { id: 'ev0060', brand: 'Fiat', model: 'Topolino' },
  { id: 'ev0061', brand: 'Fiat', model: '500e' },
  { id: 'ev0062', brand: 'Renault', model: '4 E-Tech' },
  { id: 'ev0063', brand: 'Volkswagen', model: 'ID.3' },
  { id: 'ev0064', brand: 'Volkswagen', model: 'ID.4 Pure' },
  { id: 'ev0065', brand: 'Volkswagen', model: 'ID.7 Pro S' },
  { id: 'ev0066', brand: 'Mercedes', model: 'G 580 Heritage' },
  { id: 'ev0067', brand: 'Mercedes', model: 'EQS 53 4MATIC+' },
  { id: 'ev0068', brand: 'Mercedes', model: 'EQE 53 4MATIC+' },
  { id: 'ev0069', brand: 'Mercedes', model: 'EQV 300' },
  { id: 'ev0070', brand: 'Mercedes', model: 'EQE 280' },
  { id: 'ev0071', brand: 'Mercedes', model: 'EQB 250+' },
  { id: 'ev0072', brand: 'Mercedes', model: 'EQA 250+' },
  { id: 'ev0073', brand: 'Jeep', model: 'Avenger' },
  { id: 'ev0074', brand: 'Renault', model: 'Zoe' },
  { id: 'ev0075', brand: 'Porsche', model: 'Macan 4' },
  { id: 'ev0076', brand: 'Porsche', model: 'Taycan' },
  { id: 'ev0077', brand: 'NIO', model: 'ET7' },
  { id: 'ev0078', brand: 'NIO', model: 'ES6' },
  { id: 'ev0079', brand: 'NIO', model: 'ET5' },
  { id: 'ev0080', brand: 'NIO', model: 'EC7' },
  { id: 'ev0081', brand: 'NIO', model: 'ES8' },
  { id: 'ev0082', brand: 'Lucid', model: 'Air Pure' },
  { id: 'ev0083', brand: 'Lucid', model: 'Air Touring' },
  { id: 'ev0084', brand: 'Lucid', model: 'Air Grand Touring' },
  { id: 'ev0085', brand: 'Lucid', model: 'Gravity' },
  { id: 'ev0086', brand: 'Lucid', model: 'Air Sapphire' },
  { id: 'ev0087', brand: 'Zeekr', model: '1' },
  { id: 'ev0088', brand: 'Zeekr', model: '7' },
  { id: 'ev0089', brand: 'Zeekr', model: 'X' },
  { id: 'ev0090', brand: 'Zeekr', model: '7X' },
  { id: 'ev0091', brand: 'Zeekr', model: '9' },
  { id: 'ev0092', brand: 'Smart', model: '#1' },
  { id: 'ev0093', brand: 'Subaru', model: 'Solterra' },
  { id: 'ev0094', brand: 'Alfa Romeo', model: 'Junior Elettrica' },
  { id: 'ev0095', brand: 'XPENG', model: 'G6' },
  { id: 'ev0096', brand: 'XPENG', model: 'P7' },
  { id: 'ev0097', brand: 'XPENG', model: 'G9' },
  { id: 'ev0098', brand: 'XPENG', model: 'P5' },
  { id: 'ev0099', brand: 'XPENG', model: 'X9' },
  { id: 'ev0100', brand: 'Chery', model: 'eQ7' },
  { id: 'ev0101', brand: 'Chery', model: 'Arrizo 5e' },
  { id: 'ev0102', brand: 'Chery', model: 'eQ5' },
  { id: 'ev0103', brand: 'Geely', model: 'Geometry C' },
  { id: 'ev0104', brand: 'Geely', model: 'Geometry A' },
  { id: 'ev0105', brand: 'Geely', model: 'Panda Mini' },
  { id: 'ev0106', brand: 'MG', model: '4 Electric' },
  { id: 'ev0107', brand: 'MG', model: 'ZS EV' },
  { id: 'ev0108', brand: 'MG', model: 'Marvel R Electric' },
  { id: 'ev0109', brand: 'MG', model: '5 Electric' },
  { id: 'ev0110', brand: 'MG', model: 'Cyberster' },
  { id: 'ev0111', brand: 'Li Auto', model: 'L7' },
  { id: 'ev0112', brand: 'Li Auto', model: 'L8' },
  { id: 'ev0113', brand: 'Li Auto', model: 'L9' },
  { id: 'ev0114', brand: 'Li Auto', model: 'Mega' },
  { id: 'ev0115', brand: 'Aion', model: 'LX Plus' },
  { id: 'ev0116', brand: 'Aion', model: 'Y Plus' },
  { id: 'ev0117', brand: 'Aion', model: 'S Plus' },
  { id: 'ev0118', brand: 'Hycan', model: 'Z03' },
  { id: 'ev0119', brand: 'Hycan', model: '7' },
  { id: 'ev0120', brand: 'Aion', model: 'V Plus' },
  { id: 'ev0121', brand: 'NETA', model: 'V' },
  { id: 'ev0122', brand: 'NETA', model: 'U' },
  { id: 'ev0123', brand: 'NETA', model: 'S' },
  { id: 'ev0124', brand: 'NETA', model: 'GT' },
  { id: 'ev0125', brand: 'NETA', model: 'Aya' },
  { id: 'ev0126', brand: 'Dacia', model: 'Spring Extreme' },
  { id: 'ev0127', brand: 'Jaguar', model: 'I-PACE' },
  { id: 'ev0128', brand: 'DS', model: '3 E-TENSE' },
  { id: 'ev0129', brand: 'DS', model: '4 E-TENSE' },
  { id: 'ev0130', brand: 'DS', model: '7 E-TENSE' },
  { id: 'ev0131', brand: 'Kia', model: 'Niro EV' },
  { id: 'ev0132', brand: 'Kia', model: 'Soul EV' },
  { id: 'ev0133', brand: 'Kia', model: 'EV9' },
  { id: 'ev0134', brand: 'Kia', model: 'EV5' },
  { id: 'ev0135', brand: 'Kia', model: 'EV4' },
  { id: 'ev0136', brand: 'Kia', model: 'EV6' },
  { id: 'ev0137', brand: 'Honda', model: 'e:NS1' },
  { id: 'ev0138', brand: 'Honda', model: 'e:NY1' },
  { id: 'ev0139', brand: 'Honda', model: 'E' },
  { id: 'ev0140', brand: 'Toyota', model: 'bZ4X' },
  { id: 'ev0141', brand: 'Toyota', model: 'bZ3' },
  { id: 'ev0142', brand: 'Toyota', model: 'bZ' },
  { id: 'ev0143', brand: 'Toyota', model: 'Proace' },
  { id: 'ev0144', brand: 'Toyota', model: 'Urban SUV' },
  { id: 'ev0145', brand: 'Mazda', model: 'MX-30' },
  { id: 'ev0146', brand: 'Mazda', model: 'e-TPV' },
  { id: 'ev0147', brand: 'Lexus', model: 'RZ 450e' },
  { id: 'ev0148', brand: 'Lexus', model: 'UX 300e' },
  { id: 'ev0149', brand: 'Lexus', model: 'LF-ZC' },
  { id: 'ev0150', brand: 'Lexus', model: 'LF-ZL' },
  { id: 'ev0151', brand: 'Lexus', model: 'ES Electric' },
  { id: 'ev0152', brand: 'Mitsubishi', model: 'i-MiEV' },
  { id: 'ev0153', brand: 'Mitsubishi', model: 'Minicab-MiEV' },
  { id: 'ev0154', brand: 'Mitsubishi', model: 'eK X EV' },
  { id: 'ev0155', brand: 'Mitsubishi', model: 'Airtrek' },
  { id: 'ev0156', brand: 'Mitsubishi', model: 'Delica Mini EV' },
  { id: 'ev0157', brand: 'Nissan', model: 'Leaf' },
  { id: 'ev0158', brand: 'Nissan', model: 'Ariya' },
  { id: 'ev0159', brand: 'Nissan', model: 'Sakura' },
  { id: 'ev0160', brand: 'Nissan', model: 'Townstar EV' },
  { id: 'ev0161', brand: 'Nissan', model: 'Chill-Out' },
  { id: 'ev0162', brand: 'CUPRA', model: 'Born' },
  { id: 'ev0163', brand: 'SEAT', model: 'Mii Electric' },
  { id: 'ev0164', brand: 'CUPRA', model: 'Tavascan' },
  { id: 'ev0165', brand: 'CUPRA', model: 'Raval' },
  { id: 'ev0166', brand: 'Maxus', model: 'eDeliver 3' },
  { id: 'ev0167', brand: 'Maxus', model: 'eDeliver 5' },
  { id: 'ev0168', brand: 'Maxus', model: 'eDeliver 7' },
  { id: 'ev0169', brand: 'Maxus', model: 'eDeliver 9' },
  { id: 'ev0170', brand: 'Volta', model: 'G3' },
  { id: 'ev0171', brand: 'Polestar', model: '2' },
  { id: 'ev0172', brand: 'Polestar', model: '3' },
  { id: 'ev0173', brand: 'Polestar', model: '4' },
  { id: 'ev0174', brand: 'VinFast', model: 'VF 8' },
  { id: 'ev0175', brand: 'VinFast', model: 'VF 9' },
  { id: 'ev0176', brand: 'ORA', model: 'Cat' },
  { id: 'ev0177', brand: 'ORA', model: 'Lightning Cat' },
  { id: 'ev0178', brand: 'ORA', model: 'Ballet Cat' },
  { id: 'ev0179', brand: 'Leapmotor', model: 'C01' },
  { id: 'ev0180', brand: 'Leapmotor', model: 'T03' },
  { id: 'ev0181', brand: 'Seres', model: '3' },
  { id: 'ev0182', brand: 'Seres', model: '5' },
  { id: 'ev0183', brand: 'Seres', model: '7' },
  { id: 'ev0184', brand: 'Seres', model: 'SF5' },
  { id: 'ev0185', brand: 'Chevrolet', model: 'Bolt EV' },
  { id: 'ev0186', brand: 'Chevrolet', model: 'Bolt EUV' },
  { id: 'ev0187', brand: 'Chevrolet', model: 'Silverado EV' },
  { id: 'ev0188', brand: 'Rivian', model: 'R1T' },
  { id: 'ev0189', brand: 'Rivian', model: 'R1S' },
  { id: 'ev0190', brand: 'Genesis', model: 'GV60' },
  { id: 'ev0191', brand: 'Genesis', model: 'G80' },
  { id: 'ev0192', brand: 'Lotus', model: 'Eletre' },
  { id: 'ev0193', brand: 'Lotus', model: 'Emira' },
  { id: 'ev0194', brand: 'Tesla', model: 'Semi' },
  { id: 'ev0195', brand: 'Volvo', model: 'FH Electric' },
  { id: 'ev0196', brand: 'Mercedes', model: 'eActros' },
  { id: 'ev0197', brand: 'Ford', model: 'F-150 Lightning' },
  { id: 'ev0198', brand: 'GMC', model: 'Hummer EV' },
  { id: 'ev0199', brand: 'BYD', model: 'Q3M' },
  { id: 'ev0200', brand: 'Nikola', model: 'TRE' },
  { id: 'ev0201', brand: 'BMW', model: 'CE 04' },
  { id: 'ev0202', brand: 'Vespa', model: 'Elettrica' },
  { id: 'ev0203', brand: 'Honda', model: 'EM1E' },
  { id: 'ev0204', brand: 'Yamaha', model: 'E01' },
  { id: 'ev0205', brand: 'Xiaomi', model: 'Mi Electric Scooter 4 Pro' },
  { id: 'ev0206', brand: 'Segway', model: 'Ninebot Max G30LP' },
  { id: 'ev0207', brand: 'Lamborghini', model: 'AL EXT' },
  { id: 'ev0208', brand: 'Maserati', model: 'MC-ES852-G' },
  { id: 'ev0209', brand: 'Opel', model: 'Grandland AWD' },
  { id: 'ev0210', brand: 'Karsan', model: 'OTONOM e-Atak' },
  { id: 'ev0211', brand: 'Xiaomi', model: 'YU7 Max' },
  { id: 'ev0212', brand: 'Xiaomi', model: 'YU7 Pro' },
  { id: 'ev0213', brand: 'Xiaomi', model: 'YU7' },
  { id: 'ev0214', brand: 'Leapmotor', model: 'B01' },
  { id: 'ev0215', brand: 'Togg', model: 'T10F AWD (Tek Motor)' },
  { id: 'ev0216', brand: 'Togg', model: 'T10F RWD (Çift Motor)' },
  { id: 'ev0217', brand: 'XPENG', model: 'G7' },
];

manualVehicles.forEach(vehicle => {
  const vehicleSlug = createSlug(vehicle.brand, vehicle.model);
  const lastmod = new Date().toISOString().split('T')[0];
  sitemap += `\n  <url>\n    <loc>https://newsevs.com/electric-vehicles/${vehicleSlug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
});

sitemap += '\n</urlset>';

// Sitemap'i kaydet
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✅ Manuel 217 araç ile sitemap oluşturuldu!`);
console.log(`📁 Dosya konumu: ${sitemapPath}`); 