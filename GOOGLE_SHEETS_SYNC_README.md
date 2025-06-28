# Google Sheets - Supabase Senkronizasyon Sistemi

Bu sistem, Google Sheets'teki elektrikli araç verilerini Supabase veritabanına otomatik olarak senkronize etmenizi sağlar. Sistem çoklu sheet yapısını destekler ve her bir veri kategorisi için ayrı sheet kullanır.

## 🚀 Özellikler

- **Çoklu Sheet Desteği**: 12 farklı sheet'ten veri çekme ve birleştirme
- **Hızlı Senkronizasyon**: Sadece yeni eklenen araçları senkronize eder
- **Tam Senkronizasyon**: Tüm araçları senkronize eder ve mevcut olanları günceller
- **Belirli Araç Senkronizasyonu**: Tek bir araç ID'si ile senkronizasyon
- **Web Arayüzü**: Kullanıcı dostu web arayüzü ile senkronizasyon yönetimi
- **Komut Satırı Desteği**: Script ile otomatik senkronizasyon
- **Hata Yönetimi**: Detaylı hata raporlama ve loglama
- **Gerçek Zamanlı Loglama**: İşlem durumunu canlı olarak takip etme

## 📋 Kurulum

### 1. Google Sheets API Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni bir proje oluşturun veya mevcut projeyi seçin
3. Google Sheets API'yi etkinleştirin
4. Service Account oluşturun:
   - IAM & Admin > Service Accounts
   - "Create Service Account" tıklayın
   - JSON anahtar dosyasını indirin

### 2. Google Sheets Hazırlığı

Sistem aşağıdaki 12 sheet'i kullanır:

| Sheet Adı | ID | Açıklama |
|-----------|----|----------|
| electric_vehicles | `1S-uScup7RnP0U5KYqVXtyy3I4Kpp4XrhxrpJOM_AD8I` | Ana araç bilgileri |
| charging_times | `1csLVfoSM2GLq_8uXFQdRuDJQccXHdoRmwKIUxm4iOSQ` | Şarj süreleri |
| performances | `18z9sGvc-UyGA7leQo4VtpLD-gMC1v1ZZIN-mfdn4A4A` | Performans verileri |
| dimensions | `1_4tVPtVcjsx5cnHli7w_xaeLqgDJ8CS1OonJOJ-Scd4` | Boyut bilgileri |
| efficiencies | `1Pkpmp4R0PncKkM-m6RGAoT4CzQSaVWNR1PV2c1dExKg` | Verimlilik verileri |
| comforts | `12uljuqeCpG8QTWXsiSILlnq_5MHu4He20hCx5-WJFYE` | Konfor özellikleri |
| features | `1D2_-KSv9Gy7u-_99D57I_KG2KILWEXKHG2rqlNjxqFk` | Özellikler listesi |
| prices | `1P9bLuVXS8xMtq0VJfwp8EsklTEeZVBJeu8skoIZY4UE` | Fiyat bilgileri |
| turkey_statutes | `1sKjfaCHsa75SSkSChFFzmpa2dfF8oTQu021KCH23VoE` | Türkiye durumu |
| images | `12pcSBV6cKon0ciTL4yKINHSHw8xav8OO0XMY3kWhUyA` | Görsel URL'leri |
| environmental_impacts | `16wmYF-VOCGmU3ckwaKsT9LvwoZ3T_2ScjiNhW2gKomc` | Çevresel etki |
| warranties | `1obFECRDBwYxalbuB8cuHXZtk_gVBSE2yBWuzxdWGTVA` | Garanti bilgileri |

Her sheet'in ilk sütunu araç ID'si olmalıdır.

### 3. Çevresel Değişkenler

`.env.local` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_EMAIL=supabase-sync@sheet-sb-464214.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Supabase (mevcut)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🎯 Kullanım

### Web Arayüzü

1. `/sync-sheets` sayfasına gidin
2. İstediğiniz senkronizasyon türünü seçin:
   - **Hızlı Senkronizasyon**: Yeni araçları ekler
   - **Tam Senkronizasyon**: Tüm araçları senkronize eder
   - **Belirli Araç**: Tek araç senkronizasyonu

### Komut Satırı

```bash
# Hızlı senkronizasyon (sadece yeni araçlar)
npm run sync-sheets-latest

# Tam senkronizasyon (tüm araçlar)
npm run sync-sheets-all

# Belirli araç senkronizasyonu
npm run sync-sheets sync-vehicle <vehicle-id>

# Manuel script kullanımı
node scripts/sync-sheets.js sync-latest
node scripts/sync-sheets.js sync-all
node scripts/sync-sheets.js sync-vehicle tesla-model-3-2024
```

### API Endpoint

```javascript
// Hızlı senkronizasyon
fetch('/api/sync-sheets', { method: 'GET' })

// Tam senkronizasyon
fetch('/api/sync-sheets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'sync-all' })
})

// Belirli araç senkronizasyonu
fetch('/api/sync-sheets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'sync-vehicle', 
    vehicleId: 'tesla-model-3-2024' 
  })
})
```

## 📊 Google Sheets Sütun Yapıları

### 1. electric_vehicles (Ana Araç Bilgileri)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Benzersiz araç ID'si | `tesla-model-3-2024` |
| `brand` / `marka` | Araç markası | `Tesla` |
| `model` | Araç modeli | `Model 3` |
| `year` / `yıl` | Üretim yılı | `2024` |
| `type` / `tip` | Araç tipi | `Sedan` |
| `range` / `menzil` | Menzil (km) | `560` |
| `battery_capacity` / `batarya_kapasitesi` | Batarya kapasitesi (kWh) | `75` |
| `heat_pump` / `ısı_pompası` | Isı pompası | `yes`, `no`, `optional` |
| `v2l` | Vehicle-to-Load | `yes`, `no`, `optional` |

### 2. charging_times (Şarj Süreleri)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `ac` | AC şarj süresi (saat) | `8` |
| `dc` | DC şarj süresi (saat) | `1.5` |
| `fastCharging` | Hızlı şarj bilgileri (JSON) | `{"power": 250, "time10to80": 30}` |
| `acTime` | AC şarj süresi | `8` |

### 3. performances (Performans)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `acceleration` | 0-100 km/s (saniye) | `3.1` |
| `topSpeed` | Azami hız (km/s) | `261` |
| `power` | Motor gücü (HP) | `450` |
| `torque` | Tork (Nm) | `660` |

### 4. dimensions (Boyutlar)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `length` | Uzunluk (mm) | `4694` |
| `width` | Genişlik (mm) | `1850` |
| `height` | Yükseklik (mm) | `1443` |
| `weight` | Ağırlık (kg) | `1844` |
| `cargoCapacity` | Bagaj kapasitesi (L) | `425` |

### 5. efficiencies (Verimlilik)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `consumption` | Tüketim (kWh/100km) | `14.9` |
| `regenerativeBraking` | Rejeneratif fren | `true` |
| `ecoMode` | Ekonomi modu | `true` |

### 6. comforts (Konfor)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `seatingCapacity` | Koltuk kapasitesi | `5` |
| `screens` | Ekran sayısı | `1` |
| `soundSystem` | Ses sistemi | `Premium Audio` |
| `autonomousLevel` | Otonom seviye | `2` |

### 7. features (Özellikler)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `features` | Temel özellikler | `Autopilot, Premium Audio, Glass Roof` |
| `extra_features` | Ek özellikler | `Performance Package, FSD` |

### 8. prices (Fiyatlar)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `base` | Temel fiyat (TL) | `1500000` |
| `currency` | Para birimi | `TRY` |
| `withOptions` | Seçenekli fiyat | `1800000` |
| `leasing` | Leasing bilgileri (JSON) | `{"monthly": 25000, "duration": 36}` |

### 9. turkey_statutes (Türkiye Durumu)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `available` | Satışta mı? | `true` |
| `comingSoon` | Yakında gelecek mi? | `false` |
| `estimatedArrival` | Tahmini geliş | `2024-06` |

### 10. images (Görseller)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `images` | Görsel URL'leri | `url1,url2,url3` |

### 11. environmental_impacts (Çevresel Etki)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `co2Savings` | CO2 tasarrufu (kg/yıl) | `2500` |
| `recyclableMaterials` | Geri dönüştürülebilir oran (%) | `85` |
| `greenEnergyPartnership` | Yeşil enerji ortaklığı | `true` |

### 12. warranties (Garantiler)

| Sütun | Açıklama | Örnek |
|-------|----------|-------|
| `id` | Araç ID'si | `tesla-model-3-2024` |
| `battery` | Batarya garantisi (yıl) | `8` |
| `vehicle` | Araç garantisi (yıl) | `4` |
| `maxKm` | Maksimum garanti km | `160000` |

## 🔧 Gelişmiş Yapılandırma

### Otomatik Senkronizasyon

Cron job ile otomatik senkronizasyon için:

```bash
# Her saat başı hızlı senkronizasyon
0 * * * * cd /path/to/project && npm run sync-sheets-latest

# Her gün gece yarısı tam senkronizasyon
0 0 * * * cd /path/to/project && npm run sync-sheets-all
```

### Webhook Entegrasyonu

Google Apps Script ile webhook oluşturabilirsiniz:

```javascript
function onEdit(e) {
  // Google Sheets'e veri eklendiğinde webhook tetikle
  const webhookUrl = 'https://your-domain.com/api/sync-sheets';
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
```

## 🚨 Hata Yönetimi

### Yaygın Hatalar

1. **Google Sheets API Hatası**
   - Service Account izinlerini kontrol edin
   - API anahtarının doğru olduğundan emin olun
   - Sheet ID'lerinin doğru olduğunu kontrol edin

2. **Supabase Bağlantı Hatası**
   - Supabase URL ve anahtarını kontrol edin
   - RLS (Row Level Security) ayarlarını kontrol edin

3. **Veri Format Hatası**
   - Google Sheets sütun başlıklarını kontrol edin
   - JSON formatındaki verilerin geçerli olduğundan emin olun
   - Araç ID'lerinin tüm sheet'lerde aynı olduğunu kontrol edin

### Loglama

Tüm senkronizasyon işlemleri konsola loglanır:

```bash
# Detaylı loglar için
DEBUG=* npm run sync-sheets-latest
```

## 📈 Performans

- **Hızlı Senkronizasyon**: ~5-15 saniye (12 sheet'ten veri çekme)
- **Tam Senkronizasyon**: Araç sayısına bağlı (100 araç için ~30-60 saniye)
- **Tek Araç Senkronizasyonu**: ~3-5 saniye

## 🔒 Güvenlik

- Service Account anahtarlarını güvenli tutun
- API endpoint'lerini production'da koruyun
- Rate limiting uygulayın
- Input validation yapın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 