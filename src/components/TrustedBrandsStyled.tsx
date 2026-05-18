'use client';

const TrustedBrandsStyled = () => {
  // Brand data with styled placeholders
  const brands = [
    {
      name: 'TechCorp',
      color: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      name: 'InnovateLab',
      color: 'bg-purple-600',
      textColor: 'text-white'
    },
    {
      name: 'GlobalTech',
      color: 'bg-green-600',
      textColor: 'text-white'
    },
    {
      name: 'FutureSoft',
      color: 'bg-red-600',
      textColor: 'text-white'
    },
    {
      name: 'NextGen',
      color: 'bg-indigo-600',
      textColor: 'text-white'
    },
    {
      name: 'ProBrand',
      color: 'bg-gray-800',
      textColor: 'text-white'
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
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
          {brands.map((brand, index) => (
            <div 
              key={index}
              className="group hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <div className={`
                ${brand.color} 
                ${brand.textColor}
                h-12 sm:h-16 lg:h-18 
                w-24 sm:w-32 lg:w-36 
                rounded-lg 
                flex items-center justify-center 
                shadow-md 
                group-hover:shadow-lg 
                transition-all duration-300
                opacity-80 group-hover:opacity-100
              `}>
                <span className="text-xs sm:text-sm lg:text-base font-bold tracking-wide">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandsStyled;