import { 
  AiFillCar, 
  AiFillThunderbolt, 
  AiFillSetting 
} from 'react-icons/ai';
import { 
  BsFillLightningFill 
} from 'react-icons/bs';
import { 
  IoMdBus 
} from 'react-icons/io';
import { 
  RiMotorbikeFill 
} from 'react-icons/ri';

const vehicleTypes = [
  {
    title: 'Elektrikli Otomobil',
    icon: <AiFillCar className="text-4xl mb-2" />,
    description: 'Şehir içi kullanıma uygun elektrikli araçlar'
  },
  {
    title: 'Elektrikli Kamyon',
    icon: <BsFillLightningFill className="text-4xl mb-2" />,
    description: 'Ağır yük taşımacılığı için elektrikli çözümler'
  },
  {
    title: 'Elektrikli Otobüs',
    icon: <IoMdBus className="text-4xl mb-2" />,
    description: 'Toplu taşıma için elektrikli alternatifler'
  },
  {
    title: 'Elektrikli Motosiklet',
    icon: <RiMotorbikeFill className="text-4xl mb-2" />,
    description: 'İki tekerlekli elektrikli ulaşım araçları'
  },
  {
    title: 'Elektrikli Bisiklet',
    icon: <AiFillThunderbolt className="text-4xl mb-2" />,
    description: 'Çevre dostu mikro mobilite çözümleri'
  },
  {
    title: 'Elektrikli Minibüs',
    icon: <AiFillSetting className="text-4xl mb-2" />,
    description: 'Orta ölçekli yolcu taşımacılığı'
  }
];

export default function VehicleTypes() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Popüler Elektrikli Araçlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicleTypes.map((type, index) => (
            <div 
              key={index}
              className="group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 text-center"
            >
              <div className="flex justify-center">
                {type.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
              <p className="text-gray-600">{type.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
