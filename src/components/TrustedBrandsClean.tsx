'use client';

const TrustedBrandsClean = () => {
  // Clean brand logos - using text-based logos for immediate implementation
  const brands = [
    'ADIDAS',
    'NIKE', 
    'PUMA',
    'REEBOK',
    'UNDER ARMOUR',
    'NEW BALANCE'
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading - Exact Reference Style */}
        <div className="text-center mb-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Trusted By Countless{' '}
            <span className="text-amber-600">Brands</span>
          </h2>
        </div>

        {/* Subheading - Exact Reference Style */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xl sm:text-2xl text-gray-600 font-medium">
            250+ Clients | 1600+ Happy Customers
          </p>
        </div>

        {/* Brand Logos Row - Single Horizontal Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
          {brands.map((brand, index) => (
            <div 
              key={index}
              className="group flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Text-based Logo Placeholder */}
              <div className="
                h-16 sm:h-18 lg:h-20
                w-32 sm:w-40 lg:w-44
                bg-gray-100 
                border-2 border-gray-200
                rounded-lg
                flex items-center justify-center
                group-hover:bg-gray-50
                group-hover:border-gray-300
                group-hover:shadow-md
                transition-all duration-300
                opacity-80 group-hover:opacity-100
              ">
                <span className="text-gray-700 text-sm sm:text-base lg:text-lg font-bold tracking-wider">
                  {brand}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsClean;