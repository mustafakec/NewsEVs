"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PremiumModal from '@/components/PremiumModal';

const blogPosts = [
  // En son eklenenler en başta
  {
    title: 'Charging Cost Optimization',
    description: 'Strategies and tips to reduce your charging costs.',
    category: 'Charging Tips',
    readTime: '7 min',
    slug: 'charging-cost-optimization',
    publishDate: 'February 24, 2025',
    premium: false,
  },
  {
    title: 'Fast Charging Technologies and Usage',
    description: 'A guide to understanding and using fast charging technologies correctly.',
    category: 'Charging Tips',
    readTime: '9 min',
    slug: 'fast-charging-technologies',
    publishDate: 'February 17, 2025',
    premium: false,
  },
  {
    title: 'Public Charging Station Guide',
    description: 'How to efficiently use public charging stations.',
    category: 'Charging Tips',
    readTime: '8 min',
    slug: 'public-charging-stations',
    publishDate: 'February 10, 2025',
    premium: false,
  },
  {
    title: 'Home Charging Station Installation',
    description: 'Requirements and process for installing a home charging station.',
    category: 'Charging Tips',
    readTime: '10 min',
    slug: 'home-charging-installation',
    publishDate: 'February 3, 2025',
    premium: false,
  },
  {
    title: 'Seasonal Adaptation Guide',
    description: 'Tips for adapting electric vehicle use to seasonal changes.',
    category: 'Seasonal Guide',
    readTime: '9 min',
    slug: 'seasonal-adaptation',
    publishDate: 'January 27, 2025',
    premium: false,
  },
  {
    title: 'Springtime EV Tips',
    description: 'Recommendations for using electric vehicles in spring.',
    category: 'Seasonal Guide',
    readTime: '6 min',
    slug: 'spring-ev-tips',
    publishDate: 'January 20, 2025',
    premium: false,
  },
  {
    title: 'Battery Management in Summer Heat',
    description: 'How to maintain battery performance in hot weather.',
    category: 'Seasonal Guide',
    readTime: '7 min',
    slug: 'summer-battery-management',
    publishDate: 'January 13, 2025',
    premium: false,
  },
  {
    title: 'Minimizing Range Loss in Cold Weather',
    description: 'How to optimize range and use your EV efficiently in winter.',
    category: 'Seasonal Guide',
    readTime: '8 min',
    slug: 'minimizing-range-loss-cold',
    publishDate: 'January 6, 2025',
    premium: false,
  },
  {
    title: 'Smart Charging Strategies',
    description: 'Smart strategies for more efficient EV charging.',
    category: 'Efficiency',
    readTime: '8 min',
    slug: 'smart-charging-strategies',
    publishDate: 'December 30, 2024',
    premium: false,
  },
  {
    title: 'Battery Life Extension Guide',
    description: 'Tips for maintaining and extending your EV battery life.',
    category: 'Efficiency',
    readTime: '10 min',
    slug: 'battery-life-extension',
    publishDate: 'December 23, 2024',
    premium: false,
  },
  {
    title: 'Energy Saving: Smart Usage Tactics',
    description: 'Practical tips for saving energy while driving your EV.',
    category: 'Efficiency',
    readTime: '7 min',
    slug: 'energy-saving-tactics',
    publishDate: 'December 16, 2024',
    premium: false,
  },
  {
    title: 'Range Optimization: Get the Most from Every Charge',
    description: 'Techniques and tips for maximizing your EV range.',
    category: 'Efficiency',
    readTime: '8 min',
    slug: 'range-optimization',
    publishDate: 'December 9, 2024',
    premium: false,
  },
  {
    title: 'Electric Vehicle Driving Techniques',
    description: 'Special driving techniques and efficiency tips for EVs.',
    category: 'User Guide',
    readTime: '9 min',
    slug: 'ev-driving-techniques',
    publishDate: 'December 2, 2024',
    premium: false,
  },
  {
    title: 'Regenerative Braking: Efficient Usage Guide',
    description: 'How to get the most out of regenerative braking technology.',
    category: 'User Guide',
    readTime: '7 min',
    slug: 'regenerative-braking-guide',
    publishDate: 'November 25, 2024',
    premium: false,
  },
  {
    title: 'Comprehensive Guide for Your First EV',
    description: 'Essential information and tips for new EV owners.',
    category: 'User Guide',
    readTime: '12 min',
    slug: 'first-ev-guide',
    publishDate: 'November 18, 2024',
    premium: false,
  },
  {
    title: 'Electric Vehicle Maintenance',
    description: 'Basic maintenance and inspection points for EVs.',
    category: 'User Guide',
    readTime: '6 min',
    slug: 'ev-maintenance',
    publishDate: 'November 11, 2024',
    premium: false,
  },
  // {
  //   title: 'Elektrikli Araç Satış Verileri - Q1 2025',
  //   description: 'Türkiye ve dünya genelinde elektrikli araç satış verilerinin detaylı analizi.',
  //   category: 'Satışlar ve Raporlar',
  //   readTime: '12 dk',
  //   slug: 'elektrikli-arac-satis-verileri-q1-2025',
  //   publishDate: '30 Mart 2025',
  //   premium: true,
  // },
  // {
  //   title: 'Avrupa Elektrikli Araç Pazar Raporu',
  //   description: 'Avrupa elektrikli araç pazarındaki trendler ve Türkiye pazarına etkileri.',
  //   category: 'Satışlar ve Raporlar',
  //   readTime: '15 dk',
  //   slug: 'avrupa-elektrikli-arac-pazar-raporu',
  //   publishDate: '15 Mart 2025',
  //   premium: true,
  // }
];

const categories = [
  {
    title: 'User Guide',
    description: 'Basic information and tips for using electric vehicles',
    icon: '📚',
  },
  {
    title: 'Efficiency',
    description: 'Range optimization and energy saving advice',
    icon: '🔋',
  },
  {
    title: 'Seasonal Guide',
    description: 'Using electric vehicles in different weather conditions',
    icon: '🌤️',
  },
  {
    title: 'Charging Tips',
    description: 'Information about charging stations and home charging',
    icon: '🔌',
  },
  // {
  //   title: 'Satışlar ve Raporlar',
  //   description: 'Elektrikli araç satış verileri ve pazar analizleri',
  //   icon: '📊',
  //   isPremium: true,
  // },
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
    switch (category) {
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories</h2>
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
            {selectedCategory ? `${selectedCategory} Posts` : 'All Posts'}
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-[#660566] hover:text-[#330233] transition-colors"
            >
              Show All
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