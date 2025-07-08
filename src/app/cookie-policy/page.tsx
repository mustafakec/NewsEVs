'use client';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white via-[#660566]/5 to-white border-b border-[#660566]/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent 
                      bg-gradient-to-r from-[#660566] via-[#330233] to-black
                      mb-4 text-center">
            Cookie Policy
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Information about cookies used on our website
          </p>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Giriş */}
          <section className="prose prose-lg max-w-none">
            <p>
              At NewsEVs, we use cookies on our website. This policy explains which cookies we use and how they are managed.
            </p>
          </section>

          {/* Bölümler */}
          <section className="space-y-8">
            {/* Çerez Nedir */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What is a Cookie?</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Cookies are small text files placed on your browser when you visit our website. These files:
                </p>
                <ul>
                  <li>Manage sessions</li>
                  <li>Remember your site preferences</li>
                  <li>Provide a secure experience</li>
                  <li>Analyze site performance</li>
                </ul>
              </div>
            </div>

            {/* Çerez Türleri */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="prose prose-gray max-w-none">
                <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the basic functions of our website. Without them, the site will not function properly.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">Performance Cookies</h3>
                <p>
                  Analytics cookies that help us understand how visitors use the site.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">Functionality Cookies</h3>
                <p>
                  Cookies that remember your preferences, such as language, and provide you with a personalized experience.
                </p>

                <h3 className="text-xl font-medium mb-2 mt-6">Targeting/Advertising Cookies</h3>
                <p>
                  Cookies used to deliver ads relevant to your interests.
                </p>
              </div>
            </div>

            {/* Çerez Yönetimi */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Management</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  You can manage cookies from your browser settings:
                </p>
                <ul>
                  <li>You can accept all cookies</li>
                  <li>You can customize cookie settings</li>
                  <li>You can reject all cookies</li>
                </ul>
                <p className="mt-4">
                  If you reject cookies, some site features may not function properly.
                </p>
              </div>
            </div>

            {/* Üçüncü Taraf Çerezleri */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Our website also uses cookies from third-party service providers:
                </p>
                <ul>
                  <li>Google Analytics - for visitor analytics</li>
                  <li>Social media platforms - for sharing features</li>
                  <li>Advertising networks - for personalized ads</li>
                </ul>
              </div>
            </div>

            {/* Veri Koruma */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
              <div className="prose prose-gray max-w-none">
                <p>
                  Data collected via cookies:
                </p>
                <ul>
                  <li>Is stored in secure systems</li>
                  <li>Is protected against unauthorized access</li>
                  <li>Is retained in accordance with legal requirements</li>
                  <li>Is processed in accordance with GDPR principles</li>
                </ul>
                <p className="mt-4">
                  For more information, please review our <a href="/privacy-policy" className="text-[#660566] hover:text-[#330233]">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 