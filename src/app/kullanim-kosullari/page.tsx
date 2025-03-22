export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Kullanım Koşulları
          </h1>

          <div className="prose prose-purple max-w-none">
            <p className="text-gray-600 mb-6">
              elektrikliyiz.com web sitesini kullanmadan önce lütfen aşağıdaki kullanım koşullarını dikkatlice okuyunuz. 
              Siteyi kullanarak bu koşulları kabul etmiş sayılırsınız.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. Hizmet Kullanım Şartları
            </h2>
            <p className="text-gray-600 mb-6">
              elektrikliyiz.com, elektrikli araçlar hakkında bilgi ve karşılaştırma platformudur. 
              Sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Site içeriğini yalnızca bilgi edinme amaçlı kullanabilirsiniz</li>
              <li>İçerikleri kopyalama, çoğaltma ve dağıtma hakkına sahip değilsiniz</li>
              <li>Siteyi kötüye kullanmak veya hizmetlerimizi engellemek yasaktır</li>
              <li>Üyelik gerektiren bölümlerde doğru ve güncel bilgiler kullanmalısınız</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Fikri Mülkiyet Hakları
            </h2>
            <p className="text-gray-600 mb-6">
              Site içeriğinde yer alan tüm metin, grafik, logo, simge, resim, ses ve video dosyaları 
              elektrikliyiz.com'un mülkiyetindedir ve telif hakları kanunu ile korunmaktadır:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Tüm içerik hakları saklıdır</li>
              <li>İçeriklerin izinsiz kullanımı yasaktır</li>
              <li>Tarafımıza ait logo veya görsel kullanımı için izin alınmalıdır</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Sorumluluk Reddi
            </h2>
            <p className="text-gray-600 mb-6">
              elektrikliyiz.com içeriğinin doğruluğu ve güncelliği konusunda azami özen gösterilmektedir, ancak:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>İçerikler bilgilendirme amaçlıdır, tavsiye niteliği taşımaz</li>
              <li>Verilen bilgilerin kullanımından doğacak sonuçlardan sorumlu değiliz</li>
              <li>Üçüncü taraf bağlantılarının içeriğinden sorumlu değiliz</li>
              <li>Site kullanımından doğabilecek dolaylı veya dolaysız zararlardan sorumlu değiliz</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Üyelik ve Hesap Güvenliği
            </h2>
            <p className="text-gray-600 mb-6">
              Sitemize üye olurken ve üyeliğinizi kullanırken dikkat etmeniz gereken hususlar:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz</li>
              <li>Şüpheli bir durumda hesabınızı koruma altına almalısınız</li>
              <li>Başkalarının hesap bilgilerini kullanmak yasaktır</li>
              <li>Hesap işlemleriniz kayıt altına alınmaktadır</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              5. Değişiklikler ve Güncellemeler
            </h2>
            <p className="text-gray-600 mb-6">
              elektrikliyiz.com, kullanım koşullarında değişiklik yapma hakkını saklı tutar:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Değişiklikler sitede yayınlandığı anda yürürlüğe girer</li>
              <li>Önemli değişiklikler için kullanıcılar bilgilendirilir</li>
              <li>Güncel koşulları takip etmek kullanıcının sorumluluğundadır</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
