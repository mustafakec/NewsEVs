"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PremiumModal from '@/components/PremiumModal';

const blogPosts = [
  // En son eklenenler en başta
  {
    title: 'Şarj Maliyeti Optimizasyonu',
    description: 'Şarj maliyetlerini düşürmek için stratejiler ve öneriler.',
    category: 'Şarj İpuçları',
    readTime: '7 dk',
    slug: 'sarj-maliyeti-optimizasyonu',
    publishDate: '24 Şubat 2025',
    premium: false,
  },
  {
    title: 'Hızlı Şarj Teknolojileri ve Kullanımı',
    description: 'Hızlı şarj teknolojilerini anlama ve doğru kullanma rehberi.',
    category: 'Şarj İpuçları',
    readTime: '9 dk',
    slug: 'hizli-sarj-teknolojileri',
    publishDate: '17 Şubat 2025',
    premium: false,
  },
  {
    title: 'Halka Açık Şarj İstasyonları Rehberi',
    description: 'Halka açık şarj istasyonlarını verimli kullanma kılavuzu.',
    category: 'Şarj İpuçları',
    readTime: '8 dk',
    slug: 'halka-acik-sarj-istasyonlari',
    publishDate: '10 Şubat 2025',
    premium: false,
  },
  {
    title: 'Ev Şarj İstasyonu Kurulumu',
    description: 'Ev şarj istasyonu kurulumu için gereksinimler ve süreç hakkında bilgiler.',
    category: 'Şarj İpuçları',
    readTime: '10 dk',
    slug: 'ev-sarj-istasyonu-kurulumu',
    publishDate: '3 Şubat 2025',
    premium: false,
  },
  {
    title: 'Mevsim Geçişlerinde Adaptasyon Rehberi',
    description: 'Mevsim değişikliklerinde elektrikli araç kullanımı için adaptasyon önerileri.',
    category: 'Mevsimsel Rehber',
    readTime: '9 dk',
    slug: 'mevsim-gecislerinde-adaptasyon',
    publishDate: '27 Ocak 2025',
    premium: false,
  },
  {
    title: 'Bahar Aylarında Elektrikli Araç Kullanımı',
    description: 'Bahar mevsiminde elektrikli araç kullanımı için öneriler.',
    category: 'Mevsimsel Rehber',
    readTime: '6 dk',
    slug: 'bahar-aylarinda-elektrikli-arac',
    publishDate: '20 Ocak 2025',
    premium: false,
  },
  {
    title: 'Yaz Sıcaklarında Batarya Yönetimi',
    description: 'Sıcak havalarda batarya performansını koruma yöntemleri.',
    category: 'Mevsimsel Rehber',
    readTime: '7 dk',
    slug: 'yaz-sicaklarinda-batarya-yonetimi',
    publishDate: '13 Ocak 2025',
    premium: false,
  },
  {
    title: 'Soğuk Havalarda Menzil Kaybını Minimize Etme',
    description: 'Kış aylarında elektrikli araç kullanımı ve menzil optimizasyonu.',
    category: 'Mevsimsel Rehber',
    readTime: '8 dk',
    slug: 'soguk-havalarda-menzil-kaybi',
    publishDate: '6 Ocak 2025',
    premium: false,
  },
  {
    title: 'Akıllı Şarj Stratejileri',
    description: 'Elektrikli aracınızı daha verimli şarj etmek için akıllı stratejiler.',
    category: 'Verimlilik',
    readTime: '8 dk',
    slug: 'akilli-sarj-stratejileri',
    publishDate: '30 Aralık 2024',
    premium: false,
  },
  {
    title: 'Batarya Ömrünü Uzatma Rehberi',
    description: 'Elektrikli araç bataryasının ömrünü uzatmak için bakım ve kullanım tavsiyeleri.',
    category: 'Verimlilik',
    readTime: '10 dk',
    slug: 'batarya-omru-uzatma',
    publishDate: '23 Aralık 2024',
    premium: false,
  },
  {
    title: 'Enerji Tasarrufu: Akıllı Kullanım Taktikleri',
    description: 'Elektrikli araç kullanımında enerji tasarrufu için pratik öneriler.',
    category: 'Verimlilik',
    readTime: '7 dk',
    slug: 'enerji-tasarrufu-taktikleri',
    publishDate: '16 Aralık 2024',
    premium: false,
  },
  {
    title: 'Menzil Optimizasyonu: Her Şarjdan Maksimum Verim',
    description: 'Elektrikli aracınızdan maksimum menzil alma teknikleri ve önerileri.',
    category: 'Verimlilik',
    readTime: '8 dk',
    slug: 'menzil-optimizasyonu',
    publishDate: '9 Aralık 2024',
    premium: false,
  },
  {
    title: 'Elektrikli Araç Sürüş Teknikleri',
    description: 'Elektrikli araçlar için özel sürüş teknikleri ve verimlilik ipuçları.',
    category: 'Kullanım Rehberi',
    readTime: '9 dk',
    slug: 'elektrikli-arac-surus-teknikleri',
    publishDate: '2 Aralık 2024',
    premium: false,
  },
  {
    title: 'Rejeneratif Frenleme: Verimli Kullanım Rehberi',
    description: 'Rejeneratif frenleme teknolojisinden maksimum verim alma yöntemleri.',
    category: 'Kullanım Rehberi',
    readTime: '7 dk',
    slug: 'regeneratif-frenleme-kullanimi',
    publishDate: '25 Kasım 2024',
    premium: false,
  },
  {
    title: 'İlk Elektrikli Aracınız İçin Kapsamlı Rehber',
    description: 'Elektrikli araç dünyasına yeni adım atanlar için temel bilgiler ve öneriler.',
    category: 'Kullanım Rehberi',
    readTime: '12 dk',
    slug: 'ilk-elektrikli-arac-rehberi',
    publishDate: '18 Kasım 2024',
    premium: false,
  },
  {
    title: 'Elektrikli Araç Bakımı',
    description: 'Elektrikli araçlar için temel bakım ve kontrol noktaları rehberi.',
    category: 'Kullanım Rehberi',
    readTime: '6 dk',
    slug: 'elektrikli-arac-bakimi',
    publishDate: '11 Kasım 2024',
    premium: false,
  },
  {
    title: 'Elektrikli Araç Satış Verileri - Q1 2025',
    description: 'Türkiye ve dünya genelinde elektrikli araç satış verilerinin detaylı analizi.',
    category: 'Satışlar ve Raporlar',
    readTime: '12 dk',
    slug: 'elektrikli-arac-satis-verileri-q1-2025',
    publishDate: '30 Mart 2025',
    premium: true,
  },
  {
    title: 'Avrupa Elektrikli Araç Pazar Raporu',
    description: 'Avrupa elektrikli araç pazarındaki trendler ve Türkiye pazarına etkileri.',
    category: 'Satışlar ve Raporlar',
    readTime: '15 dk',
    slug: 'avrupa-elektrikli-arac-pazar-raporu',
    publishDate: '15 Mart 2025',
    premium: true,
  }
];

const categories = [
  {
    title: 'Kullanım Rehberi',
    description: 'Elektrikli araç kullanımı hakkında temel bilgiler ve ipuçları',
    icon: '📚',
  },
  {
    title: 'Verimlilik',
    description: 'Menzil optimizasyonu ve enerji tasarrufu tavsiyeleri',
    icon: '🔋',
  },
  {
    title: 'Mevsimsel Rehber',
    description: 'Farklı hava koşullarında elektrikli araç kullanımı',
    icon: '🌤️',
  },
  {
    title: 'Şarj İpuçları',
    description: 'Şarj istasyonları ve ev şarjı hakkında bilgiler',
    icon: '🔌',
  },
  {
    title: 'Satışlar ve Raporlar',
    description: 'Elektrikli araç satış verileri ve pazar analizleri',
    icon: '📊',
    isPremium: true,
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [premiumCategory, setPremiumCategory] = useState<string>('');
  
  // Gerçek premium modal için state
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);

  // Kullanıcının premium durumunu kontrol et
  useEffect(() => {
    const checkUserPremium = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // test@test.com kullanıcısının her zaman premium olmasını sağla
          if (user.email === 'test@test.com') {
            setIsPremiumUser(true);
          } else {
            setIsPremiumUser(user.isPremium || false);
          }
        } else {
          setIsPremiumUser(false);
        }
      } catch (error) {
        console.error('Kullanıcı kontrolünde hata:', error);
        setIsPremiumUser(false);
      }
    };
    
    checkUserPremium();
  }, []);

  // Kullanıcı body CSS kontrolü için useEffect ekleyelim
  useEffect(() => {
    if (showPremiumModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup fonksiyonu
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showPremiumModal]);

  const filteredPosts = selectedCategory
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  const handleCategoryClick = (category: typeof categories[0]) => {
    // Premium kontrolü kaldırıldı, tüm kategoriler görüntülenebilir olacak
    setSelectedCategory(
      selectedCategory === category.title ? null : category.title
    );
  };

  // Kategori popup metinleri
  const getPremiumText = (category: string) => {
    switch(category) {
      case 'Satışlar ve Raporlar':
        return 'Bu içerik sadece premium üyelere özeldir. Premium üyelik ile elektrikli araç satış verileri ve pazar analizlerine erişebilirsiniz.';
      case 'Şarj İpuçları':
        return 'Bu içerik sadece premium üyelere özeldir. Premium üyelik ile şarj optimizasyonu ve maliyet tasarrufu stratejilerine erişebilirsiniz.';
      case 'Verimlilik':
        return 'Bu içerik sadece premium üyelere özeldir. Premium üyelik ile menzil optimizasyonu ve enerji tasarrufu tavsiyeleri alabilirsiniz.';
      default:
        return 'Bu içerik sadece premium üyelere özeldir. Premium üyelik ile tüm özel içeriklere sınırsız erişim sağlayabilirsiniz.';
    }
  };

  const openPremiumModal = (category: string) => {
    setPremiumCategory(category);
    setShowPremiumModal(true);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Blog
        </h1>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Kategoriler</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <motion.div 
              key={category.title}
              whileHover={{ scale: 1.03 }}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative 
                        ${selectedCategory === category.title ? 'ring-2 ring-[#660566]' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-6">
                <div className="flex justify-center mb-4 relative">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  {category.isPremium && !isPremiumUser && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#660566] to-[#330233] text-white text-xs px-2 py-0.5 rounded-md">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-center mb-1">{category.title}</h3>
                <p className="text-sm text-gray-500 text-center mb-2">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Kategori Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowPremiumModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#660566]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#660566]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium İçerik</h3>
              <p className="text-gray-600 mb-6">
                {getPremiumText(premiumCategory)}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // İçerik modalını kapat 
                    setShowPremiumModal(false);
                    // Ana premium modalını aç
                    setIsPremiumModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-[#660566] to-[#330233] text-white px-4 py-2 rounded-lg font-medium
                         hover:opacity-90 transition-all duration-200"
                >
                  Premium Üye Ol
                </button>
                <button 
                  onClick={() => setShowPremiumModal(false)}
                  className="w-full text-gray-600 px-4 py-2 rounded-lg font-medium border border-gray-200
                         hover:bg-gray-50 transition-all duration-200"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ana Premium Modal */}
      <PremiumModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />

      {/* All Posts */}
      <section>
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedCategory ? `${selectedCategory} Yazıları` : 'Tüm Yazılar'}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-[#660566] hover:text-[#330233] transition-colors"
            >
              Tümünü Göster
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <Link href={post.premium && !isPremiumUser ? '#' : `/blog/${post.slug}`} 
                    className="group"
                    onClick={(e) => {
                      if (post.premium && !isPremiumUser) {
                        e.preventDefault();
                        openPremiumModal(post.category);
                      }
                    }}
              >
                <article className="bg-white rounded-xl overflow-hidden shadow-sm 
                                  hover:shadow-md transition-all duration-200 h-full relative">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-50 text-[#660566] text-xs font-medium px-2.5 py-1 rounded">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {post.premium && (
                          <span className="bg-gradient-to-r from-[#660566] to-[#330233] text-white text-xs px-2 py-0.5 rounded-md">
                            Premium
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-[#660566] transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-gray-400">{post.publishDate}</time>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
} 