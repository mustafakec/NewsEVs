import Image from 'next/image';

interface NewsCardProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  date?: string;
}

export default function NewsCard({
  title = 'Tesla Yeni Model 3 Highland\'ı Tanıttı',
  description = 'Tesla, yenilenen Model 3 Highland versiyonunu resmi olarak duyurdu. Yeni model daha aerodinamik tasarımı ve gelişmiş özellikleriyle dikkat çekiyor.',
  imageUrl = '/tesla-model-3.jpg',
  date = '11 Şubat 2024'
}: NewsCardProps) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-50 transition-colors">
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover rounded-lg"
          unoptimized={true}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate hover:text-[#660566] transition-colors cursor-pointer">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {date}
        </p>
      </div>
    </div>
  );
} 