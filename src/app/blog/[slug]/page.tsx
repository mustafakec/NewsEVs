import { notFound } from 'next/navigation';
// import GoogleReaderRevenue from '@/components/GoogleReaderRevenue';

interface BlogPost {
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  content: string;
}

type BlogPosts = {
  [key: string]: BlogPost;
};

// Gerçek uygulamada bu veriler bir CMS veya veritabanından gelecektir
const blogPosts: BlogPosts = {
  // Kullanım Rehberi Kategorisi
  'ev-maintenance': {
    title: 'Electric Vehicle Maintenance',
    category: 'User Guide',
    readTime: '6 min',
    publishDate: 'November 10, 2024',
    content: `
      Electric vehicles require less maintenance than internal combustion engine vehicles, but there are still important points to check regularly:

      ## Basic Maintenance Points

      1. **Battery Health**: Keep charge levels within the optimal range
      2. **Brake System**: Check regenerative braking
      3. **Tires**: Monitor pressure and wear

      ## Periodic Checks

      1. **Monthly**: Tire pressure, brake fluid
      2. **Every 6 Months**: Suspension, steering
      3. **Annually**: Battery diagnostics

      Regular maintenance extends your vehicle's life and preserves performance.
    `,
  },
  'first-ev-guide': {
    title: 'Comprehensive Guide for Your First EV',
    category: 'User Guide',
    readTime: '12 min',
    publishDate: 'November 17, 2024',
    content: `
      A comprehensive guide for those new to the world of electric vehicles. Here are the basics you need to know:

      ## Key Concepts

      1. **kWh (Kilowatt-hour)**: Unit showing battery capacity
      2. **Range**: Distance you can travel on a single charge
      3. **Charging Types**: AC and DC charging options

      ## First Use Tips

      1. **Charging Planning**: Create a charging plan based on your daily routine
      2. **Driving Modes**: Learn and try different driving modes
      3. **Energy Monitoring**: Regularly check energy consumption

      ## Common Concerns

      1. **Range Anxiety**: Overcome with proper planning
      2. **Charging Stations**: Identify stations along your route in advance
      3. **Battery Life**: Extend battery life with optimal use

      After a short adaptation period, driving an electric vehicle becomes very enjoyable.
    `,
  },
  'regenerative-braking-guide': {
    title: 'Regenerative Braking: Efficient Usage Guide',
    category: 'User Guide',
    readTime: '7 min',
    publishDate: 'November 24, 2024',
    content: `
      Regenerative braking is one of the most important features of electric vehicles. Here are tips to maximize its benefits:

      ## What is Regenerative Braking?

      1. **Basic Principle**: Converting braking energy into electricity
      2. **Efficiency**: Can increase range by 10-20%
      3. **System Operation**: The motor acts as a generator

      ## Proper Usage

      1. **Smooth Braking**: Avoid sudden braking
      2. **Anticipatory Driving**: Read traffic flow ahead
      3. **Mode Selection**: Try different regeneration levels

      ## Advanced Techniques

      1. **One Pedal Driving**: Use single pedal for both acceleration and braking
      2. **Downhill**: Maximize energy recovery
      3. **Traffic Following**: Maintain smart distance

      Proper use of regenerative braking can significantly increase your range.
    `,
  },
  'ev-driving-techniques': {
    title: 'Electric Vehicle Driving Techniques',
    category: 'User Guide',
    readTime: '9 min',
    publishDate: 'December 1, 2024',
    content: `
      Driving an electric vehicle requires some different techniques compared to traditional cars. Here are key points for efficient driving:

      ## Basic Driving Techniques

      1. **Smooth Acceleration**: Save energy with controlled acceleration
      2. **Use of Momentum**: Take advantage of the vehicle's inertia
      3. **Distance Control**: Maintain a safe and efficient following distance

      ## Advanced Driving Techniques

      1. **Energy Flow Monitoring**: Use the dashboard efficiently
      2. **Mode Optimization**: Select the right mode for road conditions
      3. **Cruise Control**: Use smart strategies

      ## Safety Tips

      1. **Silent Driving**: Be careful of pedestrians
      2. **Center of Gravity**: Consider the low center of gravity
      3. **Emergencies**: Know EV-specific emergency procedures

      Proper driving techniques increase both safety and efficiency.
    `,
  },

  // Verimlilik Kategorisi
  'range-optimization': {
    title: 'Range Optimization: Get the Most from Every Charge',
    category: 'Efficiency',
    readTime: '8 min',
    publishDate: 'December 8, 2024',
    content: `
      Comprehensive tips for maximizing your EV's range:

      ## Driving Habits

      1. **Speed Control**: Maintain optimal speed range
      2. **Acceleration**: Accelerate and decelerate smoothly
      3. **Route Planning**: Choose energy-efficient routes

      ## Vehicle Settings

      1. **Eco Mode**: Select the right driving mode
      2. **Climate Control**: Use smart climate strategies
      3. **Tire Pressure**: Check and optimize regularly

      ## Advanced Techniques

      1. **Energy Monitor**: Analyze consumption data
      2. **Charging Strategy**: Maintain optimal charge levels
      3. **Aerodynamics**: Avoid unnecessary loads

      Efficient use can increase range by up to 20%.
    `,
  },
  'energy-saving-tactics': {
    title: 'Energy Saving: Smart Usage Tactics',
    category: 'Efficiency',
    readTime: '7 min',
    publishDate: 'December 15, 2024',
    content: `
      Tips to optimize your EV's energy consumption:

      ## Daily Use

      1. **Preconditioning**: Prepare the cabin while charging
      2. **Route Optimization**: Choose energy-efficient routes
      3. **Load Management**: Reduce unnecessary weight

      ## Charging Strategies

      1. **Scheduled Charging**: Use off-peak rates
      2. **Charging Limits**: For optimal battery life
      3. **Charging Planning**: Plan according to your daily routine

      ## Efficiency Tips

      1. **Energy Recovery**: Maximize regeneration
      2. **Driving Modes**: Select mode based on conditions
      3. **Climate Control**: Use smart air conditioning

      These tactics will help you optimize energy consumption.
    `,
  },
  'battery-life-extension': {
    title: 'Battery Life Extension Guide',
    category: 'Efficiency',
    readTime: '10 min',
    publishDate: 'December 22, 2024',
    content: `
      Tips to maximize your EV battery's lifespan:

      ## Charging Habits

      1. **Optimal Charge Range**: Keep between 20-80%
      2. **Prefer Slow Charging**: Use fast charging only when necessary
      3. **Temperature Control**: Avoid extreme heat and cold

      ## Usage Strategies

      1. **Regular Use**: Avoid long-term parking
      2. **Full Charge**: Avoid 100% charge except for long trips
      3. **Deep Discharge**: Avoid dropping below 10%

      ## Maintenance Tips

      1. **Software Updates**: Keep battery management system updated
      2. **Periodic Checks**: Regularly check battery health
      3. **Proper Storage**: Store under suitable conditions for long-term parking

      Proper use can extend battery life by up to 30%.
    `,
  },
  'smart-charging-strategies': {
    title: 'Smart Charging Strategies',
    category: 'Efficiency',
    readTime: '8 min',
    publishDate: 'December 29, 2024',
    content: `
      Smart strategies for more efficient EV charging:

      ## Scheduled Charging

      1. **Night Charging**: Use off-peak rates
      2. **Smart Charging**: Automatic charging planning
      3. **Solar Energy**: Integrate renewable energy

      ## Charging Optimization

      1. **Charging Speed**: Select optimal speed for the situation
      2. **Charging Location**: Choose the best station
      3. **Charging Frequency**: Avoid unnecessary charging

      ## Advanced Techniques

      1. **Bidirectional Charging**: Vehicle-to-home energy transfer
      2. **Grid Stabilization**: Contribute to grid balancing
      3. **Energy Storage**: Smart energy management

      With smart charging strategies, you can save money and help the grid.
    `,
  },

  // Mevsimsel Rehber Kategorisi
  'minimizing-range-loss-cold': {
    title: 'Minimizing Range Loss in Cold Weather',
    category: 'Seasonal Guide',
    readTime: '8 min',
    publishDate: 'January 5, 2025',
    content: `
      How to optimize range and use your EV efficiently in winter:

      ## Cold Weather Effects

      1. **Battery Performance**: Effects of low temperatures
      2. **Heating System**: Increased energy consumption
      3. **Tire Pressure**: Effects of cold weather

      ## Optimization Strategies

      1. **Preconditioning**: Heat the cabin while charging
      2. **Heating Efficiency**: Use smart heating
      3. **Route Planning**: Consider cold weather factors

      ## Practical Tips

      1. **Garage Use**: Park indoors if possible
      2. **Short Trips**: Optimize short trips in cold weather
      3. **Charging Planning**: Charge more frequently in cold weather

      With the right strategies, you can use your EV efficiently even in winter.
    `,
  },
  'summer-battery-management': {
    title: 'Battery Management in Summer Heat',
    category: 'Seasonal Guide',
    readTime: '7 min',
    publishDate: 'January 12, 2025',
    content: `
      How to maintain battery performance in hot weather:

      ## Hot Weather Effects

      1. **Battery Temperature**: Risks of overheating
      2. **Cooling System**: Air conditioning energy consumption
      3. **Charging Performance**: Effects of hot weather

      ## Protection Strategies

      1. **Shade Parking**: Protect from sunlight
      2. **Cooling Optimization**: Use air conditioning efficiently
      3. **Charging Timing**: Charge during cooler hours

      ## Preventive Measures

      1. **Battery Monitor**: Monitor temperature
      2. **Ventilation**: Ensure vehicle ventilation
      3. **Charging Limits**: Set limits in hot weather

      Maintain battery health for efficient use even in hot weather.
    `,
  },
  'spring-ev-tips': {
    title: 'Springtime EV Tips',
    category: 'Seasonal Guide',
    readTime: '6 min',
    publishDate: 'January 19, 2025',
    content: `
      Recommendations for using electric vehicles in spring:

      ## Spring Advantages

      1. **Optimal Temperature**: Ideal conditions for battery performance
      2. **Low Energy Consumption**: Less need for heating/cooling
      3. **Long Range**: Maximum range performance

      ## Spring Maintenance

      1. **Cleaning**: Remove winter dirt
      2. **Tire Check**: Check pressure and condition
      3. **Filter Cleaning**: Check air filters

      ## Efficiency Tips

      1. **Window Use**: Use natural ventilation instead of AC
      2. **Route Optimization**: Choose scenic spring routes
      3. **Charging Planning**: Use optimal charging strategies

      Spring is the best season for EV use.
    `,
  },
  'seasonal-adaptation': {
    title: 'Seasonal Adaptation Guide',
    category: 'Seasonal Guide',
    readTime: '9 min',
    publishDate: 'January 26, 2025',
    content: `
      Tips for adapting electric vehicle use to seasonal changes:

      ## Seasonal Changes

      1. **Temperature Fluctuations**: Sudden changes
      2. **Humidity Levels**: Effects and precautions
      3. **Weather Conditions**: Rain and wind effects

      ## Adaptation Strategies

      1. **Driving Techniques**: Adjust driving for the season
      2. **Energy Management**: Changing energy needs
      3. **Maintenance Routines**: Seasonal maintenance requirements

      ## Long-Term Planning

      1. **Charging Infrastructure**: Seasonal charging needs
      2. **Route Planning**: Plan routes for weather
      3. **Equipment Preparation**: Prepare seasonal equipment

      With the right adaptation, you can use your EV smoothly in all seasons.
    `,
  },

  // Şarj İpuçları Kategorisi
  'home-charging-installation': {
    title: 'Home Charging Station Installation',
    category: 'Charging Tips',
    readTime: '10 min',
    publishDate: 'February 2, 2025',
    content: `
      Requirements and process for installing a home charging station:

      ## Installation Requirements

      1. **Electrical Infrastructure**: Sufficient power capacity
      2. **Parking Area**: Suitable parking and access
      3. **Permits**: Necessary official permits

      ## Installation Process

      1. **Technical Assessment**: Expert inspection
      2. **Equipment Selection**: Choose the right charger
      3. **Installation**: Professional mounting

      ## Usage and Maintenance

      1. **Safety**: Follow safe usage rules
      2. **Maintenance**: Regular checks and cleaning
      3. **Optimization**: Efficient usage strategies

      Home charging stations offer convenient and economical charging.
    `,
  },
  'public-charging-stations': {
    title: 'Public Charging Station Guide',
    category: 'Charging Tips',
    readTime: '8 min',
    publishDate: 'February 9, 2025',
    content: `
      How to efficiently use public charging stations:

      ## Station Types

      1. **AC Stations**: Slow charging options
      2. **DC Stations**: Fast charging options
      3. **Free Stations**: Publicly supported points

      ## Usage Strategies

      1. **Planning**: Plan your route in advance
      2. **App Usage**: Use charging station apps
      3. **Payment Methods**: Different payment options

      ## Practical Tips

      1. **Peak Hours**: Avoid busy times
      2. **Alternative Plans**: Backup charging points
      3. **Safety**: Safe usage recommendations

      Efficient use of public stations ensures a smooth journey.
    `,
  },
  'fast-charging-technologies': {
    title: 'Fast Charging Technologies and Usage',
    category: 'Charging Tips',
    readTime: '9 min',
    publishDate: 'February 16, 2025',
    content: `
      A guide to understanding and using fast charging technologies correctly:

      ## Fast Charging Basics

      1. **DC Charging**: High power transfer
      2. **Power Levels**: Different speed options
      3. **Battery Impact**: Effects of fast charging

      ## Proper Usage

      1. **Temperature Control**: Maintain optimal charging temperature
      2. **Charging Curve**: Power drop-off points
      3. **Usage Frequency**: Recommended intervals

      ## Safety

      1. **Cable Check**: Physical inspections
      2. **Cooling System**: System performance
      3. **Emergencies**: Safety procedures

      Fast charging is very useful when used correctly.
    `,
  },
  'charging-cost-optimization': {
    title: 'Charging Cost Optimization',
    category: 'Charging Tips',
    readTime: '7 min',
    publishDate: 'February 23, 2025',
    content: `
      Strategies to minimize your charging costs:

      ## Cost Analysis

      1. **Tariff Comparison**: Compare electricity tariffs
      2. **Charging Types**: Cost differences
      3. **Subscriptions**: Membership advantages

      ## Saving Strategies

      1. **Home Charging**: Use night tariffs
      2. **Station Selection**: Compare prices
      3. **Campaigns**: Follow special offers

      ## Long-Term Planning

      1. **Solar Energy**: Integrate home systems
      2. **Charging Plan**: Cost-focused planning
      3. **Efficiency**: Optimize consumption

      With smart charging strategies, you can save money.
    `,
  },
  // Satışlar ve Raporlar Kategorisi
  'elektrikli-arac-satis-verileri-q1-2025': {
    title: 'Elektrikli Araç Satış Verileri - Q1 2025',
    category: 'Satışlar ve Raporlar',
    readTime: '12 dk',
    publishDate: '30 Mart 2025',
    content: `
      2025 yılının ilk çeyreğine ait elektrikli araç satış verilerinin detaylı bir analizi:

      ## Küresel Pazar

      1. **Büyüme Oranı**: Bir önceki yıla göre %25 artış
      2. **Pazar Liderleri**: Marka bazında dağılım
      3. **Segment Analizi**: Araç tiplerine göre satış dağılımı

      ## Türkiye Pazarı

      1. **Satış Hacmi**: 15.000 araç (3 ay toplamı)
      2. **Model Dağılımı**: En çok satılan elektrikli modeller
      3. **Şehir Bazlı Analiz**: İl bazında satış oranları

      ## Trend Analizi

      1. **Fiyat Eğilimi**: Fiyat segmentlerine göre satış dağılımı
      2. **Menzil Etkisi**: Tercih edilen menzil aralıkları
      3. **Teşvik Etkisi**: Devlet teşviklerinin satışlara etkisi

      Elektrikli araç pazarı hızla büyümeye devam ediyor. Türkiye'de özellikle orta segment araçlarda önemli bir artış görülmekte.
    `,
  },
  'avrupa-elektrikli-arac-pazar-raporu': {
    title: 'Avrupa Elektrikli Araç Pazar Raporu',
    category: 'Satışlar ve Raporlar',
    readTime: '15 dk',
    publishDate: '15 Mart 2025',
    content: `
      Avrupa elektrikli araç pazarındaki son gelişmeler ve Türkiye pazarına etkileri:

      ## Avrupa Pazarı Genel Görünüm

      1. **Pazar Büyüklüğü**: 800.000 araç (Çeyrek bazlı)
      2. **Lider Ülkeler**: Norveç, Hollanda, Almanya
      3. **Yeni Düzenlemeler**: Avrupa Birliği emisyon hedefleri

      ## Marka Payları

      1. **Premium Segment**: Marka bazlı pazar payları
      2. **Orta Segment**: En çok satılan modeller
      3. **Ekonomik Segment**: Yeni oyuncuların etkisi

      ## Türkiye'ye Etkiler

      1. **İthalat Trendi**: Avrupa'dan gelen modeller
      2. **Fiyat Politikaları**: Avrupa fiyatlarının yansımaları
      3. **Üretim Yatırımları**: Türkiye'deki üretim planları

      Avrupa'daki elektrikli araç pazarı dinamikleri, Türkiye pazarını doğrudan etkilemeye devam ediyor. Özellikle fiyatlandırma ve model çeşitliliğinde Avrupa trendleri belirleyici oluyor.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

const BlogContent = ({ content }: { content: string }) => (
  <div className="prose prose-lg prose-purple max-w-none">
    {content.split('\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ))}
  </div>
);

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* <GoogleReaderRevenue /> */}
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <article className="max-w-3xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-[#660566] mb-3">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.publishDate}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
            </header>

            <BlogContent content={post.content} />
          </article>
        </div>
      </div>
    </>
  );
} 