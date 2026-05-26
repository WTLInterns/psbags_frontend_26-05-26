'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import LiveDateTime from '@/components/LiveDateTime';
import { productService } from '@/services/productService';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import TrustedBrandsSlider from '@/components/TrustedBrandsSlider';
import FounderSection from '@/components/FounderSection';
import '../styles/footer.css';

// Quote Form Component
function QuoteForm({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Quote request submitted successfully!');
    if (onClose) {
      onClose();
    }
  };

  const formClass = isModal ? 'space-y-3 sm:space-y-4' : 'space-y-4 sm:space-y-5';
  const inputClass = isModal 
    ? 'w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm'
    : 'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all duration-200';
  const labelClass = isModal ? 'block text-xs font-semibold text-gray-700 mb-1' : 'block text-sm font-semibold text-gray-700 mb-2';
  const gapClass = isModal ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-5';
  const buttonClass = isModal
    ? 'w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg'
    : 'w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg';

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gapClass}`}>
        <div>
          <label className={labelClass}>Full Name *</label>
          <input
            type="text"
            required
            className={inputClass}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className={labelClass}>Mobile Number *</label>
          <input
            type="tel"
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
            className={inputClass}
            placeholder="Enter your mobile number"
          />
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gapClass}`}>
        <div>
          <label className={labelClass}>Company Name *</label>
          <input
            type="text"
            required
            className={inputClass}
            placeholder="Enter your company name"
          />
        </div>

        <div>
          <label className={labelClass}>Product Requirement*</label>
          <input
            type="text"
            required
            className={inputClass}
            placeholder="Enter your requirements"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Location *</label>
        <input
          type="text"
          required
          className={inputClass}
          placeholder="Enter your location"
        />
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gapClass}`}>
        <div>
          <label className={labelClass}>Product Type *</label>
          <select
            required
            className={inputClass + ' cursor-pointer'}
            defaultValue="SHOP ONLINE"
          >
            <option value="SHOP ONLINE">SHOP ONLINE</option>
            <option value="NEW YEAR GIFTS">NEW YEAR GIFTS</option>
            <option value="DIWALI GIFTS">DIWALI GIFTS</option>
            <option value="CORPORATE GIFTS">CORPORATE GIFTS</option>
            <option value="CUSTOM GIFTS">CUSTOM GIFTS</option>
            <option value="BULK ORDERS">BULK ORDERS</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Product Count *</label>
          <select
            required
            className={inputClass + ' cursor-pointer'}
            defaultValue="25 - 50"
          >
            <option value="25 - 50">25 - 50</option>
            <option value="1 - 25">1 - 25</option>
            <option value="50 - 100">50 - 100</option>
            <option value="100 - 250">100 - 250</option>
            <option value="250+">250 - 500</option>
            <option value="250+">500+</option>
          </select>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="submit"
          className={buttonClass}
        >
          SUBMIT INQUIRY FORM
        </button>
      </div>
    </form>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [tshirtProducts, setTshirtProducts] = useState<Product[]>([]);
  const [hoodieProducts, setHoodieProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showQuotePopup, setShowQuotePopup] = useState(false);
  const tshirtScrollRef = useRef<HTMLDivElement | null>(null);
  const hoodieScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollTshirtsLeft, setCanScrollTshirtsLeft] = useState(false);
  const [canScrollTshirtsRight, setCanScrollTshirtsRight] = useState(false);
  const [isTshirtScrollAtEnd, setIsTshirtScrollAtEnd] = useState(false);
  const [canScrollHoodiesLeft, setCanScrollHoodiesLeft] = useState(false);
  const [canScrollHoodiesRight, setCanScrollHoodiesRight] = useState(false);
  const [isHoodieScrollAtEnd, setIsHoodieScrollAtEnd] = useState(false);

  const heroSlides = [
    {
      image: '/psbags/hero-bg-1.webp',
      // title: 'ELEVATE YOUR STYLE',
      // subtitle: 'Discover the perfect blend of comfort, quality, and sophistication',
      // buttonText: 'Shop Now',
      overlayColor: 'from-black/60 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/psbags/slide-img2.png',
      // title: 'PREMIUM COLLECTION',
      // subtitle: 'Curated pieces that define modern masculinity',
      // buttonText: 'Explore Collection',
      overlayColor: 'from-gray-900/70 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/psbags/slide-img3.png',
      // title: 'TIMELESS ELEGANCE',
      // subtitle: 'Where classic meets contemporary in every stitch',
      // buttonText: 'Discover More',
      overlayColor: 'from-black/50 to-transparent',
      position: 'bottom-left'
    },
    {
      image: '/psbags/slide-img1.png',
      // title: 'LUXURY REDEFINED',
      // subtitle: 'Experience fashion that speaks without words',
      // buttonText: 'Shop Luxury',
      overlayColor: 'from-gray-800/60 to-transparent',
      position: 'right'
    },
    // {
    //   image: '/images/hero5.jpg',
    //   // title: 'BOLD & CONFIDENT',
    //   // subtitle: 'Step into your power with every outfit choice',
    //   // buttonText: 'Be Bold',
    //   overlayColor: 'from-black/70 to-transparent',
    //   position: 'bottom-left'
    // }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3200); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto-trigger popup after 2 seconds (once per session)
  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('quotePopupShown');
    console.log('Popup trigger check - hasShownPopup:', hasShownPopup);
    // Temporarily disabled sessionStorage check for testing
    const timer = setTimeout(() => {
      console.log('Triggering popup after 2 seconds');
      setShowQuotePopup(true);
      sessionStorage.setItem('quotePopupShown', 'true');
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Disable body scroll when popup is open
  useEffect(() => {
    console.log('Popup state changed:', showQuotePopup);
    if (showQuotePopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuotePopup]);

  // ESC key to close popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQuotePopup) {
        setShowQuotePopup(false);
      }
    };

    if (showQuotePopup) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showQuotePopup]);

  // Format price helper
  const formatPrice = (n: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));
  const getDiscountPercent = (price?: number, originalPrice?: number, existing?: number) => {
    if (typeof existing === 'number' && isFinite(existing)) return existing;
    if (typeof price === 'number' && typeof originalPrice === 'number' && isFinite(price) && isFinite(originalPrice) && originalPrice > 0) {
      const pct = Math.max(0, Math.min(100, ((originalPrice - price) / originalPrice) * 100));
      return Math.round(pct);
    }
    return undefined;
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch latest products
        const latest = await productService.getLatestProducts();
        setLatestProducts(latest.slice(0, 4)); // Get first 4 latest products

        // Fetch t-shirt products
        const tshirts = await productService.getProductsByCategory('t-shirts');
        setTshirtProducts(tshirts); // Show all t-shirts in the horizontal scroller

        // Fetch hoodie products
        const hoodies = await productService.getProductsByCategory('hoodies');
        setHoodieProducts(hoodies); // Show all hoodies in the horizontal scroller
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const updateScrollState = (
    container: HTMLDivElement | null,
    setCanScrollLeft: (value: boolean) => void,
    setCanScrollRight: (value: boolean) => void,
    setIsAtEnd: (value: boolean) => void,
  ) => {
    if (!container) return;

    const { scrollLeft, clientWidth, scrollWidth } = container;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
    const tolerance = 8;

    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < maxScrollLeft - tolerance);
    setIsAtEnd(maxScrollLeft <= tolerance || scrollLeft >= maxScrollLeft - tolerance);
  };

  const scrollProductRow = (container: HTMLDivElement | null, direction: 'left' | 'right') => {
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>('[data-scroll-card="true"]');
    const cardWidth = firstCard?.offsetWidth ?? 280;
    const gap = window.innerWidth >= 640 ? 32 : 20;
    const cardsPerClick = window.innerWidth >= 1536 ? 2 : window.innerWidth >= 1024 ? 2 : 1;
    const scrollAmount = (cardWidth + gap) * cardsPerClick;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const updateTshirtScrollState = () => {
    updateScrollState(
      tshirtScrollRef.current,
      setCanScrollTshirtsLeft,
      setCanScrollTshirtsRight,
      setIsTshirtScrollAtEnd,
    );
  };

  const updateHoodieScrollState = () => {
    updateScrollState(
      hoodieScrollRef.current,
      setCanScrollHoodiesLeft,
      setCanScrollHoodiesRight,
      setIsHoodieScrollAtEnd,
    );
  };

  const scrollTshirtProducts = (direction: 'left' | 'right') => {
    scrollProductRow(tshirtScrollRef.current, direction);
  };

  const scrollHoodieProducts = (direction: 'left' | 'right') => {
    scrollProductRow(hoodieScrollRef.current, direction);
  };

  useEffect(() => {
    const container = tshirtScrollRef.current;
    if (!container) return;

    updateTshirtScrollState();

    const handleScroll = () => updateTshirtScrollState();
    const handleResize = () => updateTshirtScrollState();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, tshirtProducts.length]);

  useEffect(() => {
    const container = hoodieScrollRef.current;
    if (!container) return;

    updateHoodieScrollState();

    const handleScroll = () => updateHoodieScrollState();
    const handleResize = () => updateHoodieScrollState();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, hoodieProducts.length]);

  return (
    <div>
      <Header />
      <main id="main-content" className="min-h-screen">

        {/* Hero Section */}
        <section className="relative h-screen sm:h-[80vh] lg:h-screen overflow-hidden">
          {/* Image Carousel */}
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <Image
                src={slide.image}
                alt={`Hero ${index + 1}`}
                fill
                className="object-top object-cover"
                priority={index === 0}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlayColor}`}></div>

              {/* Content Overlay */}
              {/* {slide?.title && (
              <div className="absolute inset-0 flex items-end justify-end">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="ml-auto max-w-sm sm:max-w-md lg:max-w-lg text-right mb-8 sm:mb-12 lg:mb-16 mr-2 sm:mr-4 lg:mr-6 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-[0.08em] mb-3 sm:mb-4 leading-tight drop-shadow-2xl">
                      {slide?.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 font-light leading-relaxed drop-shadow-lg">
                      {slide?.subtitle}
                    </p>
                    <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                      {slide?.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            )} */}
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Arrows - Hidden on mobile */}
          <button
            onClick={() => goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
            className="hidden sm:block absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-300"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => goToSlide((currentSlide + 1) % heroSlides.length)}
            className="hidden sm:block absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors duration-300"
          >
            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* What's New Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left Side - Text and CTA */}
              <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">
                  WHAT'S NEW TODAY
                </h2>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-none">
                  <LiveDateTime />
                </div>
                <p className="text-base sm:text-lg md:text-xl text-black font-light leading-relaxed">
                  Discover what just landed at PS BAGS
                </p>
                <button className="bg-black text-white px-6 py-3 text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                  Shop Now
                </button>
              </div>

              {/* Right Side - Latest Products (dynamic) */}
              <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-8 justify-center">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-40 sm:w-48">
                      <div className="bg-gray-200 h-48 sm:h-64 lg:h-80 animate-pulse" />
                      <div className="h-4 bg-gray-200 mt-2 w-3/4 mx-auto animate-pulse" />
                    </div>
                  ))
                ) : latestProducts.length > 0 ? (
                  latestProducts.slice(0, 3).map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer hover:scale-105 transition-all duration-300 w-40 sm:w-48">
                      <div className="bg-white shadow-md overflow-hidden mb-2 border border-gray-200">
                        <Image
                          src={product.images[0] || '/images/placeholder.jpg'}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                        />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-black text-center truncate px-2">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-[11px] sm:text-xs text-gray-900 font-bold">₹{formatPrice(product.price)}</span>
                        {typeof product.originalPrice === 'number' && (
                          <span className="text-[11px] sm:text-xs text-red-500 line-through">₹{formatPrice(product.originalPrice)}</span>
                        )}
                        {(() => {
                          const pct = getDiscountPercent(product.price, product.originalPrice, (product as any).discountPercent);
                          return typeof pct === 'number' && pct > 0 ? (
                            <span className="text-[10px] sm:text-[11px] text-green-700 bg-green-100 px-1.5 py-0.5 rounded font-semibold">{pct}% off</span>
                          ) : null;
                        })()}
                      </div>

                    </Link>
                  ))
                ) : (
                  // Fallback static thumbnails
                  ['psbags/bag1', 'psbags/bag2', 'psbags/bag4'].map((img, idx) => (
                    <div key={idx} className="group cursor-pointer hover:scale-105 transition-all duration-300 w-40 sm:w-48">
                      <div className="bg-white shadow-md overflow-hidden mb-2">
                        <Image src={`/${img}.jpeg`} alt={`New Arrival ${idx + 1}`} width={400} height={300} className="w-full h-48 sm:h-64 lg:h-80 object-cover" />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-black text-center">New Arrival</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> 
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight"> 
                      FORMAL STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> 
                  </div>
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/formal.jpg"
                      alt="Formal Collection"
                      width={1400} 
                      height={800}
                      className="w-full max-w-7xl h-auto object-cover shadow-2xl" 
                    />
                  </div>
                  
              
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_shirt.jpg"
                          alt="Formal Shirts"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Formal Shirts
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹499
                        </p>
                      </div>
                    </div>

                   
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_pant.jpg"
                          alt="Formal Pants"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Formal Pants
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹499
                        </p>
                      </div>
                    </div>

                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/formal_cotton_shirt.jpg"
                          alt="Cotton Shirts"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Cotton Shirts
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹599
                        </p>
                      </div>
                    </div>

                 
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                        <Image
                          src="/images/tie.jpg"
                          alt="Ties"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Ties
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹599
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}

        {/* T-Shirt Collection Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12"> {/* Left-aligned title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                DESIGNER BAGS STORE
              </h2>
              <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
            </div>

            {/* Hero T-Shirt Image with Quote and Button */}
            <div className="flex justify-center mb-12 sm:mb-16">
              <div className="relative w-full max-w-6xl h-[400px] sm:h-[450px] lg:h-[500px]">
                <Image
                  src="/psbags/home-img21.jpg"
                  alt="T-Shirt Collection"
                  fill
                  className="object-cover shadow-2xl"
                />
                {/* Overlay with Quote and Button */}
                <div className="absolute inset-0 bg-black/30 flex items-end justify-start">
                  <div className="text-left text-white p-4 sm:p-6 lg:p-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-2 sm:mb-4 tracking-[0.08em] drop-shadow-2xl">
                      COMFORT MEETS STYLE
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-light leading-relaxed drop-shadow-lg max-w-md">
                      Discover the perfect blend of comfort and contemporary fashion in our premium bags collection
                    </p>
                    <Link href="/products?category=t-shirts">
                      <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                        Shop Now
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

            {/* T-Shirt Product Row - Manual horizontal scroll */}
            <div className="relative">
              <button
                type="button"
                aria-label="Scroll products left"
                onClick={() => scrollTshirtProducts('left')}
                disabled={!canScrollTshirtsLeft}
                className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/75 text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl disabled:pointer-events-none disabled:opacity-0 sm:-left-3 sm:h-11 sm:w-11 lg:-left-4"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="mx-auto w-[78vw] max-w-full overflow-hidden sm:w-[calc(18rem*2+2rem)] lg:w-[calc(16rem*4+6rem)] 2xl:w-[calc(15rem*5+8rem)]">
                <div
                  ref={tshirtScrollRef}
                  className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 sm:gap-8"
                >
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        data-scroll-card="true"
                        className="w-[78vw] shrink-0 snap-start animate-pulse sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <div className="bg-gray-200 rounded-xl h-48 sm:h-64 lg:h-96"></div>
                        <div className="mt-3 sm:mt-4 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                      </div>
                    ))
                  ) : tshirtProducts.length > 0 ? (
                    // Display real products using reusable card
                    tshirtProducts.map((product) => (
                      <div
                        key={product.id}
                        data-scroll-card="true"
                        className="w-[78vw] shrink-0 snap-start sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    // Fallback to static content if no products
                    ['psbags/bag1', 'psbags/bag2', 'psbags/bag3', 'psbags/bag4'].map((img, index) => (
                      <div
                        key={index}
                        data-scroll-card="true"
                        className="group w-[78vw] shrink-0 snap-start cursor-pointer hover:scale-105 transition-all duration-300 sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                          <Image
                            src={`/${img}.jpeg`}
                            alt={`Premium Bag ${index + 1}`}
                            width={300}
                            height={400}
                            className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="mt-3 sm:mt-4 text-center">
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                            Premium Bags
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">
                            From ₹299
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {!loading && (
                    <Link
                      href="/products?category=t-shirts"
                      data-scroll-card="true"
                      className={`flex w-[78vw] shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all duration-300 sm:w-72 lg:w-64 2xl:w-60 ${
                        isTshirtScrollAtEnd
                          ? 'border-black bg-black text-white shadow-xl'
                          : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-black hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-current">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold">See More Products</h3>
                        <p className={`mt-2 text-sm ${isTshirtScrollAtEnd ? 'text-white/80' : 'text-gray-600'}`}>
                          View the full designer bags collection
                        </p>
                      </div>
                    </Link>
                  )}

                  <div aria-hidden="true" className="w-1 shrink-0 sm:w-6 lg:w-8" />
                </div>
              </div>

              <button
                type="button"
                aria-label="Scroll products right"
                onClick={() => scrollTshirtProducts('right')}
                disabled={!canScrollTshirtsRight}
                className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/75 text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl disabled:pointer-events-none disabled:opacity-0 sm:-right-3 sm:h-11 sm:w-11 lg:-right-4"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Hoodie Collection Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12"> {/* Left-aligned title */}
              <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                TRAVEL BAGS STORE
              </h2>
              <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
            </div>

            {/* Hero Hoodie Image with Quote and Button */}
            <div className="flex justify-center mb-16">
              <div className="relative w-full max-w-6xl h-[500px]">
                <Image
                  src="/psbags/hero-bg-1.webp"
                  alt="Hoodie Collection"
                  fill
                  className="object-cover shadow-2xl"
                />
                {/* Overlay with Quote and Button */}
                <div className="absolute inset-0 bg-black/30 flex items-end justify-start">
                  <div className="text-left text-white p-8">
                    <h3 className="text-3xl md:text-4xl font-light mb-4 tracking-[0.08em] drop-shadow-2xl">
                      COZY COMFORT AWAITS
                    </h3>
                    <p className="text-base md:text-lg mb-6 font-light leading-relaxed drop-shadow-lg max-w-md">
                      Wrap yourself in warmth and style with our premium bags collection designed for ultimate comfort
                    </p>
                    <Link href="/products?category=hoodies">
                      <button className="bg-white text-black px-6 py-3 text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 tracking-wide shadow-lg hover:shadow-xl hover:shadow-white/20 border border-white/20">
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Hoodie Product Row - Manual horizontal scroll */}
            <div className="relative">
              <button
                type="button"
                aria-label="Scroll hoodie products left"
                onClick={() => scrollHoodieProducts('left')}
                disabled={!canScrollHoodiesLeft}
                className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/75 text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl disabled:pointer-events-none disabled:opacity-0 sm:-left-3 sm:h-11 sm:w-11 lg:-left-4"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="mx-auto w-[78vw] max-w-full overflow-hidden sm:w-[calc(18rem*2+2rem)] lg:w-[calc(16rem*4+6rem)] 2xl:w-[calc(15rem*5+8rem)]">
                <div
                  ref={hoodieScrollRef}
                  className="hide-scrollbar flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 sm:gap-8"
                >
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        data-scroll-card="true"
                        className="w-[78vw] shrink-0 snap-start animate-pulse sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <div className="bg-gray-200 rounded-xl h-96"></div>
                        <div className="mt-3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                      </div>
                    ))
                  ) : hoodieProducts.length > 0 ? (
                    hoodieProducts.map((product) => (
                      <div
                        key={product.id}
                        data-scroll-card="true"
                        className="w-[78vw] shrink-0 snap-start sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <ProductCard product={product} />
                      </div>
                    ))
                  ) : (
                    ['psbags/bag11', 'psbags/bag12', 'psbags/bag13', 'psbags/bag15'].map((img, idx) => (
                      <div
                        key={idx}
                        data-scroll-card="true"
                        className="group w-[78vw] shrink-0 snap-start cursor-pointer hover:scale-105 transition-all duration-300 sm:w-72 lg:w-64 2xl:w-60"
                      >
                        <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                          <Image src={`/${img}.jpeg`} alt={`Travel Bag ${idx + 1}`} width={300} height={400} className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="mt-4 text-center">
                          <h3 className="text-lg font-semibold text-black mb-2">Premium Travel Bags</h3>
                          <p className="text-sm text-gray-600 font-medium">From ₹899</p>
                        </div>
                      </div>
                    ))
                  )}

                  {!loading && (
                    <Link
                      href="/products?category=hoodies"
                      data-scroll-card="true"
                      className={`flex w-[78vw] shrink-0 snap-start items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-all duration-300 sm:w-72 lg:w-64 2xl:w-60 ${
                        isHoodieScrollAtEnd
                          ? 'border-black bg-black text-white shadow-xl'
                          : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-black hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      <div>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-current">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold">See More Products</h3>
                        <p className={`mt-2 text-sm ${isHoodieScrollAtEnd ? 'text-white/80' : 'text-gray-600'}`}>
                          View the full travel bags collection
                        </p>
                      </div>
                    </Link>
                  )}

                  <div aria-hidden="true" className="w-1 shrink-0 sm:w-6 lg:w-8" />
                </div>
              </div>

              <button
                type="button"
                aria-label="Scroll hoodie products right"
                onClick={() => scrollHoodieProducts('right')}
                disabled={!canScrollHoodiesRight}
                className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/75 text-gray-900 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:shadow-xl disabled:pointer-events-none disabled:opacity-0 sm:-right-3 sm:h-11 sm:w-11 lg:-right-4"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Jeans Collection Section */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-8 sm:mb-12"> 
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black tracking-tight">
                      JEANS STORE
                    </h2>
                    <div className="w-18 h-1 bg-gray-400 mt-2"></div> 
                  </div>
                  
                 
                  <div className="flex justify-center mb-12 sm:mb-16">
                    <Image
                      src="/images/jeans.jpg"
                      alt="Jeans Collection"
                      width={1400}
                      height={800}
                      className="w-full max-w-6xl h-auto object-cover shadow-2xl"
                    />
                  </div>
                  
                 
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans1.jpg"
                          alt="Jeans 1"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Classic Blue Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹799
                        </p>
                      </div>
                    </div>

                    
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans2.jpg"
                          alt="Jeans 2"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Slim Fit Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹899
                        </p>
                      </div>
                    </div>

                   
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans3.jpg"
                          alt="Jeans 3"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Dark Wash Jeans
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹999
                        </p>
                      </div>
                    </div>

                  
                    <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src="/images/jeans4.jpg"
                          alt="Jeans 4"
                          width={300}
                          height={400}
                          className="w-full h-48 sm:h-64 lg:h-96 object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 text-center">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-black mb-1 sm:mb-2">
                          Premium Denim
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          From ₹1199
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section> */}



        {/* New Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12"> {/* Left-aligned title */}
              <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">
                EXPLORE MORE BAGS
              </h2>
              <div className="w-18 h-1 bg-gray-400 mt-2"></div> {/* Gray underline */}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Shirt Category */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src="/psbags/bag9.jpeg"
                    alt="Bag Collection 1"
                    width={300}
                    height={400}
                    className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    LUXURY BAGS
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-4">
                    Premium luxury bags for elegant style
                  </p>
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Sweater Category */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src="/psbags/bag1.jpeg"
                    alt="Bag Collection 2"
                    width={300}
                    height={400}
                    className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    DESIGNER BAGS
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-4">
                    Stylish designer bags for fashion lovers
                  </p>
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Jacket Category */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src="/psbags/bag11.jpeg"
                    alt="Bag Collection 3"
                    width={300}
                    height={400}
                    className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    TRAVEL BAGS
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-4">
                    Durable travel bags for all journeys
                  </p>
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Sweatshirt Category */}
              <div className="group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src="/psbags/bag17.jpeg"
                    alt="Bag Collection 4"
                    width={300}
                    height={400}
                    className="w-full h-96 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    CASUAL BAGS
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-4">
                    Comfortable casual bags for everyday use
                  </p>
                  <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Get A Quick Quote Now Section - Inquiry Form */}
        <section className="relative bg-gradient-to-br from-sky-50 to-teal-50 py-12 sm:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Get A Quick Quote Now</h2>
              <p className="text-gray-600 mx-auto mb-6 max-w-2xl text-sm sm:text-base">Fill out our form, and one of our team members will quickly get back to you with a great price.</p>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-amber-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Left Side: Enquiry Image */}
              <div className="relative flex justify-center lg:justify-end order-2 lg:order-1">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-amber-400 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
                  <img
                    src="/images/enquiry.png"
                    alt="One Stop Solutions For Corporate Gifting"
                    className="relative w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 order-1 lg:order-2">
                <QuoteForm />
              </div>
            </div>
          </div>
        </section>

        {/* Brands That Celebrate With Us Section */}
        <section className="relative bg-gradient-to-br from-teal-50 to-sky-50 py-12 sm:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Brands That Celebrate With Us</h2>
              <p className="text-gray-600 mx-auto mb-6 max-w-2xl text-sm sm:text-base">Trusted by leading companies worldwide for premium quality and exceptional service</p>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-teal-500 mx-auto rounded-full"></div>
            </div>

            {/* First Row - Moving Right */}
            <div className="relative h-40 sm:h-48 mb-3 sm:mb-4 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex animate-marquee-right">
                  {[
                    { id: 1, src: "/images/home-img12.jpeg", alt: "Brand 1" },
                    { id: 2, src: "/images/home-img-9.jpeg", alt: "Brand 2" },
                    { id: 3, src: "/images/home-img-10.jpeg", alt: "Brand 3" },
                    { id: 4, src: "/images/home-img11.jpeg", alt: "Brand 4" },
                    { id: 5, src: "/images/home-img14.jpg", alt: "Brand 5" },
                    { id: 6, src: "/images/home-img12.jpeg", alt: "Brand 1" },
                    { id: 7, src: "/images/home-img-9.jpeg", alt: "Brand 2" },
                    { id: 8, src: "/images/home-img-10.jpeg", alt: "Brand 3" },
                    { id: 9, src: "/images/home-img11.jpeg", alt: "Brand 4" },
                    { id: 10, src: "/images/home-img14.jpg", alt: "Brand 5" },
                  ].map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => setShowBrandForm(true)}
                      className="flex items-center justify-center w-56 sm:w-64 h-28 sm:h-32 mx-3 sm:mx-4 flex-shrink-0 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border border-gray-100 group"
                    >
                      <img
                        src={brand.src}
                        alt={brand.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Row - Moving Left */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex animate-marquee-left">
                  {[
                    { id: 11, src: "/images/home-img17.jpg", alt: "Brand 6" },
                    { id: 12, src: "/images/home-img18.jpg", alt: "Brand 7" },
                    { id: 13, src: "/images/home-img19.jpg", alt: "Brand 8" },
                    { id: 14, src: "/images/home-img20.jpg", alt: "Brand 9" },
                    { id: 15, src: "/images/home-img21.jpg", alt: "Brand 10" },
                    { id: 16, src: "/images/home-img17.jpg", alt: "Brand 6" },
                    { id: 17, src: "/images/home-img18.jpg", alt: "Brand 7" },
                    { id: 18, src: "/images/home-img19.jpg", alt: "Brand 8" },
                    { id: 19, src: "/images/home-img20.jpg", alt: "Brand 9" },
                    { id: 20, src: "/images/home-img21.jpg", alt: "Brand 10" },
                  ].map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => setShowBrandForm(true)}
                      className="flex items-center justify-center w-56 sm:w-64 h-28 sm:h-32 mx-3 sm:mx-4 flex-shrink-0 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border border-gray-100 group"
                    >
                      <img
                        src={brand.src}
                        alt={brand.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Countless Brands Section */}
        <TrustedBrandsSlider />

        <FounderSection />

        {/* Services Section */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight mb-3 sm:mb-4">
                WHY CHOOSE PS BAGS?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing you with the best shopping experience and premium quality bags
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
             
              <div className="text-center group">
                <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Free Shipping</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Free shipping on all orders above ₹999. Fast and reliable delivery across India.
                </p>
              </div>

             
              <div className="text-center group">
                <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Easy Returns</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  7-day hassle-free returns. Exchange or refund with no questions asked.
                </p>
              </div>

              
              <div className="text-center group">
                <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">Size Guide</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Detailed size charts and fitting guides to help you find the perfect fit.
                </p>
              </div>

             
              <div className="text-center group">
                <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-black transition-colors duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-3">24/7 Support</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  Round-the-clock customer support via chat, email, and phone.
                </p>
              </div>
            </div>

          
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
              
              <div className="text-center">
                <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Premium Quality</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Handpicked fabrics and materials for lasting comfort and style
                </p>
              </div>

             
              <div className="text-center">
                <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Secure Payment</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  100% secure payment gateway with multiple payment options
                </p>
              </div>

            
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="bg-gray-50 rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-black mb-2">Style Consultation</h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Free personal styling advice from our fashion experts
                </p>
              </div>
            </div>

          
            <div className="text-center mt-12 sm:mt-16">
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-3 sm:mb-4">
                  Ready to Elevate Your Style?
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Join thousands of satisfied customers who trust PS BAGS for their fashion needs.
                  Experience premium quality, exceptional service, and unbeatable style.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button className="bg-black text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 tracking-wide">
                    Shop Now
                  </button>
                  <button className="border border-black text-black px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-black hover:text-white transition-all duration-300 tracking-wide">
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}

      <Footer />

      {/* Brand Form Modal */}
      {showBrandForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
            <button
              onClick={() => setShowBrandForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get in Touch</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your interest! We will get back to you soon.');
                setShowBrandForm(false);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input type="tel" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your mobile number" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                    <input type="text" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your company name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" required className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter your email" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={3} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Tell us about your requirements"></textarea>
                </div>
                <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors font-semibold">
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quote Popup Modal */}
      {showQuotePopup && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300"
          onClick={() => setShowQuotePopup(false)}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg relative overflow-hidden animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuotePopup(false)}
              className="absolute top-3 right-3 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Get A Quick Quote Now</h2>
                <p className="text-gray-600 text-xs sm:text-sm">Fill out our form, and one of our team members will quickly get back to you with a great price.</p>
                <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-amber-500 mx-auto rounded-full mt-3"></div>
              </div>
              <QuoteForm isModal={true} onClose={() => setShowQuotePopup(false)} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
