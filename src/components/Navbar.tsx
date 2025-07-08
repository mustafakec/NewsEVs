import Link from 'next/link';

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-[#660566] transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/electric-vehicles" className="text-gray-600 hover:text-[#660566] transition-colors">
              Elektrikli Araçlar
            </Link>
            <Link href="/haberler" className="text-gray-600 hover:text-[#660566] transition-colors">
              Haberler
            </Link>
            <Link href="/borsa" className="text-gray-600 hover:text-[#660566] transition-colors">
              Borsa
            </Link>
          </nav> 