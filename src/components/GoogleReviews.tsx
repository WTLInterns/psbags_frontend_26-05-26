'use client';

import { useState, useEffect, useRef } from 'react';

const reviews = [
  { name: "Rahul Sharma", rating: 5, review: "Amazing quality bags, loved the service! The material is premium and delivery was super fast.", avatar: "RS" },
  { name: "Priya Mehta", rating: 4, review: "Ordered corporate gift bags for our team — everyone was impressed. Excellent branding quality!", avatar: "PM" },
  { name: "Amit Verma", rating: 5, review: "Best bags in this price range! The stitching is top-notch and the design looks premium.", avatar: "AV" },
  { name: "Sneha Patel", rating: 4, review: "Fantastic bulk order experience. They handled 500+ bags with custom branding perfectly.", avatar: "SP" },
  { name: "Vikram Singh", rating: 5, review: "Quality exceeded expectations. Great material, durable build, and responsive customer support.", avatar: "VS" },
  { name: "Neha Gupta", rating: 4, review: "Beautiful collection and fast delivery. The travel bags are spacious and well-designed.", avatar: "NG" },
  { name: "Rajesh Kumar", rating: 5, review: "Ordering from RegaloobyPS for 2 years. Consistent quality and always on-time delivery.", avatar: "RK" },
  { name: "Ananya Reddy", rating: 5, review: "Custom branding options are fantastic! Got bags personalized for Diwali corporate gifting.", avatar: "AR" },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const GoogleReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused) return;

    const interval = setInterval(() => {
      const firstCard = container.firstElementChild as HTMLElement;
      if (!firstCard) return;

      const gap = window.innerWidth >= 640 ? 24 : 20;
      const scrollAmount = firstCard.offsetWidth + gap;

      if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const firstCard = container.firstElementChild as HTMLElement;
    if (!firstCard) return;

    const gap = window.innerWidth >= 640 ? 24 : 20;
    const scrollAmount = firstCard.offsetWidth + gap;

    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="google-reviews"
      className={`py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm sm:text-base font-semibold text-gray-700 ml-1">4.9</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Trusted by Customers | Google Reviews</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">Real feedback from real customers who love our products and service</p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#257463] to-[#34A853] mx-auto rounded-full mt-4"></div>
        </div>

        {/* Carousel */}
        <div className="relative group">
          <button onClick={() => scroll('left')} aria-label="Scroll reviews left"
            className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#257463] hover:shadow-xl hover:border-[#257463]/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div ref={scrollRef} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
            className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
            {reviews.map((review, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]" style={{ scrollSnapAlign: 'start' }}>
                <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-xl border border-gray-100 hover:border-[#257463]/20 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#257463] to-[#1f5f56] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">{review.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{review.name}</h4>
                      <StarRating rating={review.rating} />
                    </div>
                    <svg className="w-5 h-5 flex-shrink-0 opacity-60" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{review.review}&rdquo;</p>
                  <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-50">
                    <svg className="w-4 h-4 text-[#257463]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-400 font-medium">Verified Review</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll('right')} aria-label="Scroll reviews right"
            className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-700 hover:text-[#257463] hover:shadow-xl hover:border-[#257463]/30 transition-all duration-300 opacity-0 group-hover:opacity-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10 sm:mt-14">
          <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-[#257463]">4.9★</p><p className="text-xs sm:text-sm text-gray-500 mt-1">Average Rating</p></div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
          <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-[#257463]">1000+</p><p className="text-xs sm:text-sm text-gray-500 mt-1">Happy Customers</p></div>
          <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>
          <div className="text-center"><p className="text-2xl sm:text-3xl font-bold text-[#257463]">100%</p><p className="text-xs sm:text-sm text-gray-500 mt-1">Satisfaction</p></div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
