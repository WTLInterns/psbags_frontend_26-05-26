'use client';

import Image from 'next/image';

const TrustedBrandsPremium = () => {
  // Premium brand showcase data
  const premiumBrands = [
    {
      name: 'Amazon',
      logo: '/images/brands/amazon-logo.png',
      fallbackBg: 'bg-orange-500',
      fallbackText: 'AMAZON'
    },
    {
      name: 'Google',
      logo: '/images/brands/google-logo.png', 
      fallbackBg: 'bg-blue-500',
      fallbackText: 'GOOGLE'
    },
    {
      name: 'Microsoft',
      logo: '/images/brands/microsoft-logo.png',
      fallbackBg: 'bg-blue-600',
      fallbackText: 'MICROSOFT'
    },
    {
      name: 'Apple',
      logo: '/images/brands/apple-logo.png',
      fallbackBg: 'bg-gray-800',
      fallbackText: 'APPLE'
    },
    {
      name: 'Samsung',
      logo: '/images/brands/samsung-logo.png',
      fallbackBg: 'bg-blue-700',
      fallbackText: 'SAMSUNG'
    },
    {
      name: 'Nike',
      logo: '/images/brands/nike-logo.png',
      fallbackBg: 'bg-black',
      fallbackText: 'NIKE'
    }
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center mb-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Trusted By Countless{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Brands
            </span>
          </h2>
        </div>

        {/* Subheading */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            500 Clients | 1000+ Happy Customer
          </p>
        </div>

        {/* Brand Logos Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-8 lg:py-12">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
            {premiumBrands.map((brand, index) => (
              <div 
                key={index}
                className="group relative flex items-center justify-center hover:scale-105 transition-all duration-300"
              >
                {/* Image Logo */}
                <div className="relative">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} Logo`}
                    width={160}
                    height={70}
                    className="h-12 sm:h-16 lg:h-18 w-auto object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 filter grayscale group-hover:grayscale-0"
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
                <div className={`
                  hidden items-center justify-center
                  ${brand.fallbackBg}
                  h-12 sm:h-16 lg:h-18 
                  w-28 sm:w-36 lg:w-40
                  rounded-lg
                  shadow-md group-hover:shadow-lg
                  transition-all duration-300
                  opacity-70 group-hover:opacity-100
                `}>
                  <span className="text-white text-xs sm:text-sm lg:text-base font-bold tracking-wider">
                    {brand.fallbackText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Verified Partners</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Global Reach</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsPremium;