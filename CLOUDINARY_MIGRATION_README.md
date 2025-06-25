# Cloudinary Görsel Optimizasyonu Migration Rehberi

Bu rehber, mevcut Supabase'deki görselleri Cloudinary'ye taşıyarak Vercel'in image optimization limitini aşma sorununu çözer.

## Kurulum Adımları

### 1. Cloudinary Hesabı Oluşturma
1. [Cloudinary](https://cloudinary.com/) sitesine gidin
2. Ücretsiz hesap oluşturun
3. Dashboard'dan aşağıdaki bilgileri alın:
   - Cloud Name
   - API Key
   - API Secret

### 2. Environment Değişkenleri
`.env.local` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Migration Script'ini Çalıştırma

```bash
npm run migrate-images
```

Bu script:
- Supabase'deki tüm araç görsellerini çeker
- Her görseli Cloudinary'ye yükler
- Supabase'deki URL'leri Cloudinary URL'leri ile günceller
- Rate limiting uygular (API limitlerini aşmamak için)

## Özellikler

### Otomatik Optimizasyon
- Görseller otomatik olarak optimize edilir
- WebP formatına dönüştürülür
- Responsive boyutlar oluşturulur
- Kalite otomatik ayarlanır

### Performans İyileştirmeleri
- Lazy loading
- Progressive loading
- CDN üzerinden dağıtım
- Otomatik format seçimi

### Güvenlik
- Güvenli URL'ler (HTTPS)
- API key'ler environment değişkenlerinde
- Rate limiting koruması

## Kullanım

### Bileşenlerde Kullanım
```tsx
import { cloudinaryUtils } from '@/lib/cloudinary';

// Görseli optimize et
const optimizedUrl = cloudinaryUtils.optimizeImage(imageUrl, {
  width: 800,
  height: 600,
  quality: 'auto:good'
});

// Responsive görseller
const responsiveImages = cloudinaryUtils.createResponsiveImages(imageUrl);
```

### Next.js Image Component
```tsx
<Image
  src={optimizedImageUrl}
  alt="Araç görseli"
  width={800}
  height={600}
  className="object-cover"
/>
```

## Monitoring

Migration sırasında console'da şu bilgileri göreceksiniz:
- Yüklenen görsel sayısı
- Başarılı/başarısız işlemler
- Hata mesajları
- İlerleme durumu

## Sorun Giderme

### Yaygın Hatalar

1. **API Key Hatası**
   - Environment değişkenlerini kontrol edin
   - Cloudinary dashboard'dan API key'leri doğrulayın

2. **Rate Limiting**
   - Script otomatik olarak rate limiting uygular
   - Çok fazla görsel varsa script'i birkaç kez çalıştırın

3. **Upload Hatası**
   - İnternet bağlantısını kontrol edin
   - Cloudinary hesap limitlerini kontrol edin

### Manuel Migration

Eğer script çalışmazsa, görselleri manuel olarak Cloudinary'ye yükleyebilirsiniz:

1. Cloudinary Dashboard'a gidin
2. Upload bölümünden görselleri yükleyin
3. Supabase'de URL'leri manuel olarak güncelleyin

## Maliyet

- Cloudinary ücretsiz planı: 25 kredi/ay
- Her görsel yükleme: ~1 kredi
- Optimizasyon: ücretsiz
- CDN: ücretsiz

## Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Cloudinary dashboard'ı kontrol edin
3. Environment değişkenlerini doğrulayın
4. Supabase bağlantısını test edin 