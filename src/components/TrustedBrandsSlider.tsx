'use client';

import Image from 'next/image';
import { brands, trustedBrandsConfig } from '@/config/brands';

const TrustedBrandsSlider = () => {
  // Duplicate brands array for smooth infinite loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight mb-2 sm:mb-3">
            {trustedBrandsConfig.title}
          </h2>
        </div>

        {/* Section Subtitle */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium">
            {trustedBrandsConfig.subtitle}
          </p>
        </div>

        {/* Auto-scrolling Brand Logos */}
        <div className="relative w-full overflow-hidden">
          {/* Scrolling Container */}
          <div 
            className="flex items-center gap-8 sm:gap-12 lg:gap-16 animate-scroll"
            style={{
              animationDuration: `${trustedBrandsConfig.scrollSpeed}s`,
            }}
          >
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 group cursor-pointer"
                title={brand.name}
              >
                <div className="relative w-32 sm:w-40 lg:w-48 h-16 sm:h-20 lg:h-24 flex items-center justify-center">
                  <Image
                    src={brand.image}
                    alt={`${brand.name} Logo`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsSlider;
