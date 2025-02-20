export default function KVKKPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Kişisel Verilerin Korunması</h1>
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold mt-4 mb-2">Veri Sorumlusu</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, kişisel verileriniz 
          veri sorumlusu olarak Elektrikliyiz tarafından işlenmektedir.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Kişisel Verilerin İşlenme Amacı</h2>
        <p>
          Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Hizmetlerimizin iyileştirilmesi ve geliştirilmesi</li>
          <li>Yasal yükümlülüklerimizin yerine getirilmesi</li>
          <li>İletişim faaliyetlerinin yürütülmesi</li>
          <li>Web sitesi analizi ve güvenliğinin sağlanması</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4 mb-2">Haklarınız</h2>
        <p>
          KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>Kişisel verilerinize erişim ve düzeltme talep etme</li>
          <li>Kişisel verilerinizin silinmesini talep etme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
        </ul>
      </div>
    </div>
  );
}
