'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const FOUNDER_IMAGE_PATH = '/psbags/pranitshah2.jpeg';  

export default function FounderSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-stone-50/30 to-white py-20 sm:py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16 xl:gap-20">
          {/* Founder Image - Left Column */}
          <div
            className={`relative mx-auto w-full max-w-[340px] transition-all duration-1000 sm:max-w-[380px] lg:mx-0 lg:max-w-none ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Premium Frame Effect */}
              <div className="overflow-hidden rounded-[18px] border-[6px] border-stone-100/80">
                <div className="group relative overflow-hidden">
                  <Image
                    src={FOUNDER_IMAGE_PATH}
                    alt="Pranit Shah, Founder and CEO of PS BAGS"
                    width={900}
                    height={1100}
                    className={`h-[380px] w-full object-cover transition-all duration-[1400ms] ease-out sm:h-[440px] lg:h-[500px] ${
                      isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    } group-hover:scale-105`}
                    priority={false}
                  />
                </div>
              </div>
          </div>

          {/* Founder Content - Right Column */}
          <div
            className={`flex flex-col justify-center transition-all delay-150 duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Small Label */}
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-500">
              Meet The Founder
            </div>

            {/* Role */}
            <div className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
              Founder &amp; CEO
            </div>

            {/* Founder Name */}
            <h3 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-stone-900 sm:text-6xl lg:text-6xl">
              Pranit Girish Shah
            </h3>

            {/* Biography Paragraphs */}
            <div className="space-y-6 text-base leading-[1.8] text-stone-600 sm:text-[17px] sm:leading-[1.85]">
              <p>
                Mr. Pranit Girish Shah is the Founder &amp; CEO of Regaloo by PS, a growing name in the corporate gifting and wholesale industry.
              </p>
              <p>
                With over 5 years of experience, he has built the brand with a vision to deliver premium quality products, creative customization, and exceptional customer service.
              </p>
              <p>
                Under his leadership, Regaloo by PS has become known for its premium customized products and high quality WILD ADVENTURE bags.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
