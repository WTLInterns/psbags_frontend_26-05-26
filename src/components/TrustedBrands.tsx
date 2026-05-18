'use client';

import Image from 'next/image';

const TrustedBrands = () => {
  // Brand logos data - you can replace these with actual brand logo paths
  const brandLogos = [
    {
      name: 'Brand 1',
      logo: '/images/brands/brand1.png',
      alt: 'Brand 1 Logo'
    },
    {
      name: 'Brand 2', 
      logo: '/images/brands/brand2.png',
      alt: 'Brand 2 Logo'
    },
    {
      name: 'Brand 3',
      logo: '/images/brands/brand3.png', 
      alt: 'Brand 3 Logo'
    },
    {
      name: 'Brand 4',
      logo: '/images/brands/brand4.png',
      alt: 'Brand 4 Logo'
    },
    {
      name: 'Brand 5',
      logo: '/images/brands/brand5.png',
      alt: 'Brand 5 Logo'
    },
    {
      name: 'Brand 6',
      logo: '/images/brands/brand6.png',
      alt: 'Brand 6 Logo'
    }
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Trusted By Countless{' '}
            <span className="text-amber-600">Brands</span>
          </h2>
        </div>

        {/* Subheading */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            500 Clients | 1000+ Happy Customer
          </p>
        </div>

        {/* Brand Logos Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {brandLogos.map((brand, index) => (
            <div 
              key={index}
              className="flex items-center justify-center hover:scale-105 transition-all duration-300 opacity-70 hover:opacity-100"
            >
              <Image
                src={brand.logo}
                alt={brand.alt}
                width={200}
                height={70}
                className="h-12 sm:h-16 lg:h-18 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                  if (fallback) {
                    fallback.style.display = 'flex';
                  }
                }}
              />
              {/* Fallback placeholder */}
              <div className="hidden h-12 sm:h-16 lg:h-18 w-24 sm:w-32 bg-gray-200 rounded-lg items-center justify-center">
                <span className="text-gray-500 text-xs sm:text-sm font-medium">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;