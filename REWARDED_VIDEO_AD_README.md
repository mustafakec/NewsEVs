# Rewarded Video Reklam Entegrasyonu

Bu proje, elektrikli araçlar sayfasındaki "İncele" butonlarına Google AdSense rewarded video reklam entegrasyonu içerir.

## Özellikler

- **Masaüstü ve Mobil Uyumlu**: Hem masaüstü hem mobilde rewarded video reklam gösterir
- **Google AdSense Entegrasyonu**: Google Publisher Tag (GPT) kullanarak rewarded video reklamları yönetir
- **Kullanıcı Dostu Arayüz**: Modern ve responsive tasarım
- **Hata Yönetimi**: Reklam yüklenemezse otomatik yönlendirme
- **Progress Bar**: Reklam yükleme durumunu gösteren animasyonlu progress bar
- **Mobil Optimizasyonu**: Mobil cihazlar için özel tasarım ve boyutlandırma

## Kurulum

### 1. Google AdSense Hesabı
- Google AdSense hesabınızda rewarded video reklam birimi oluşturun
- Ad unit ID: `/23307685224/incele_reward_01`

### 2. Script Entegrasyonu
Layout dosyasına (`src/app/layout.tsx`) Google Publisher Tag script'i eklenmiştir:

```html
<script
  async
  src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
  crossOrigin="anonymous"
/>
```

### 3. Bileşenler

#### RewardedVideoAd Bileşeni
- **Dosya**: `src/components/RewardedVideoAd.tsx`
- **Özellikler**:
  - Google AdSense rewarded video reklam entegrasyonu
  - Loading states ve progress bar
  - Error handling
  - Responsive tasarım
  - Mobil optimizasyonu

#### VehicleCard Bileşeni
- **Dosya**: `src/views/VehicleCard.tsx`
- **Değişiklikler**:
  - `handleInceleClick` fonksiyonu eklendi
  - Hem mobil hem masaüstünde rewarded video reklam
  - Rewarded video reklam modal entegrasyonu

#### VehicleClientContent Bileşeni
- **Dosya**: `src/components/VehicleClientContent.tsx`
- **Değişiklikler**:
  - `handleInceleClick` fonksiyonu eklendi
  - "İncele" butonları güncellendi
  - Hem mobil hem masaüstünde rewarded video reklam
  - Rewarded video reklam modal entegrasyonu

## Kullanım

### Masaüstü ve Mobil
1. Kullanıcı "İncele" butonuna tıklar
2. Rewarded video reklam modal'ı açılır
3. Reklam yüklenir ve "Reklamı İzle" butonu görünür
4. Kullanıcı reklamı izler
5. Reklam tamamlandığında araç detay sayfasına yönlendirilir

## Teknik Detaylar

### Event Listeners
- `slotRenderEnded`: Reklam yüklendiğinde
- `rewardedSlotReady`: Rewarded video hazır olduğunda
- `rewardedSlotClosed`: Reklam kapatıldığında
- `rewardedSlotGranted`: Reklam tamamlandığında
- `slotError`: Reklam hatası durumunda

### State Management
- `isVisible`: Modal görünürlüğü
- `isAdLoaded`: Reklam yüklendi mi?
- `isAdPlaying`: Reklam oynatılıyor mu?
- `loadingText`: Yükleme mesajı
- `loadingProgress`: Progress bar değeri

### Error Handling
- Reklam yüklenemezse otomatik yönlendirme
- Network hatalarında fallback
- Timeout durumlarında kullanıcı bilgilendirme

### Mobil Optimizasyonu
- Responsive tasarım (sm: breakpoint'leri)
- Mobil-spesifik boyutlandırma
- Touch-friendly butonlar
- Mobil bilgilendirme mesajları

## Test

### Geliştirme Ortamında
1. Projeyi başlatın: `npm run dev`
2. Elektrikli araçlar sayfasına gidin
3. Masaüstü tarayıcıda "İncele" butonuna tıklayın
4. Rewarded video reklam modal'ının açıldığını kontrol edin

### Mobil Test
1. Mobil cihazda veya tarayıcının mobil simülasyonunda test edin
2. "İncele" butonuna tıklayın
3. Rewarded video reklam modal'ının açıldığını kontrol edin
4. Mobil optimizasyonların çalıştığını doğrulayın

## Özelleştirme

### Reklam Birimi Değiştirme
`RewardedVideoAd.tsx` dosyasında ad unit ID'yi değiştirin:

```javascript
const slot = window.googletag.defineOutOfPageSlot(
  '/YOUR_PUBLISHER_ID/YOUR_AD_UNIT_ID',
  window.googletag.enums.OutOfPageFormat.REWARDED
);
```

### Stil Özelleştirme
Tailwind CSS sınıflarını kullanarak tasarımı özelleştirebilirsiniz.

### Mesaj Özelleştirme
`loadingText` state'ini güncelleyerek kullanıcı mesajlarını değiştirebilirsiniz.

### Mobil Özelleştirme
Mobil cihazlar için özel stiller ekleyebilirsiniz:

```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```

## Sorun Giderme

### Reklam Yüklenmiyor
1. Google AdSense hesabınızda rewarded video reklam biriminin aktif olduğunu kontrol edin
2. Ad unit ID'nin doğru olduğunu kontrol edin
3. Tarayıcı konsolunda hata mesajlarını kontrol edin

### Mobilde Reklam Gösterilmiyor
1. User agent kontrolünün doğru çalıştığını kontrol edin
2. Mobil cihaz simülasyonunu test edin
3. Responsive tasarımın doğru çalıştığını kontrol edin

### Yönlendirme Çalışmıyor
1. Router hook'unun doğru import edildiğini kontrol edin
2. URL'lerin doğru formatlandığını kontrol edin

## Performans

- Reklam script'i async olarak yüklenir
- Modal sadece gerektiğinde render edilir
- Cleanup fonksiyonları memory leak'leri önler
- Progress bar animasyonu smooth geçişler sağlar
- Mobil cihazlarda optimize edilmiş boyutlandırma

## Güvenlik

- Cross-origin script yükleme güvenli
- CSP (Content Security Policy) uyumlu
- XSS koruması için input validation
- HTTPS zorunlu (production'da)

## Mobil Özellikler

### Responsive Tasarım
- `sm:` breakpoint'leri ile responsive boyutlandırma
- Mobil cihazlarda daha küçük padding ve margin'ler
- Touch-friendly buton boyutları

### Mobil Optimizasyonları
- Mobil-spesifik modal genişliği (`max-w-sm`)
- Küçük ekranlarda daha kompakt tasarım
- Mobil bilgilendirme mesajları
- Optimize edilmiş font boyutları

### Kullanıcı Deneyimi
- Mobil cihazlarda daha iyi dokunma alanları
- Responsive progress bar
- Mobil-spesifik loading animasyonları

## Lisans

Bu entegrasyon MIT lisansı altında lisanslanmıştır. 