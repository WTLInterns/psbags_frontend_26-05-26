'use client';

import Image from 'next/image';

const TrustedBrandsFinal = () => {
  // Brand logos with fallback styling
  const brandLogos = [
    {
      name: 'Brand One',
      logo: '/images/brands/brand1.png',
      fallback: 'BRAND ONE'
    },
    {
      name: 'Brand Two',
      logo: '/images/brands/brand2.png', 
      fallback: 'BRAND TWO'
    },
    {
      name: 'Brand Three',
      logo: '/images/brands/brand3.png',
      fallback: 'BRAND THREE'
    },
    {
      name: 'Brand Four',
      logo: '/images/brands/brand4.png',
      fallback: 'BRAND FOUR'
    },
    {
      name: 'Brand Five',
      logo: '/images/brands/brand5.png',
      fallback: 'BRAND FIVE'
    },
    {
      name: 'Brand Six',
      logo: '/images/brands/brand6.png',
      fallback: 'BRAND SIX'
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center mb-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Trusted By Countless{' '}
            <span className="text-amber-600">Brands</span>
          </h2>
        </div>

        {/* Subheading */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xl sm:text-2xl text-gray-600 font-medium">
            500 Clients | 1000+ Happy Customer
          </p>
        </div>

        {/* Brand Logos Row - Desktop: Single Row, Mobile: Responsive Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {brandLogos.map((brand, index) => (
            <div 
              key={index}
              className="flex items-center justify-center group cursor-pointer"
            >
              {/* Image Logo */}
              <div className="relative">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} Logo`}
                  width={200}
                  height={70}
                  className="h-11 sm:h-16 lg:h-18 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                  onError={(e) => {
                    // Hide image and show fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.parentElement?.nextElementSibling;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                      fallback.classList.add('flex');
                    }
                  }}
                />
              </div>
              
              {/* Fallback Styled Logo */}
              <div className="hidden items-center justify-center h-11 lg:h-18 w-32 lg:w-40 bg-gray-100 border border-gray-200 rounded-lg group-hover:bg-gray-50 group-hover:shadow-md transition-all duration-300">
                <span className="text-gray-700 text-xs lg:text-sm font-bold tracking-wide">
                  {brand.fallback}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsFinal;