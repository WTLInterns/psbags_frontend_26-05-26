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
      className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-white to-amber-50/60 py-10 sm:py-12 lg:py-14"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-stone-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 text-center sm:mb-8">
          <span className="inline-flex items-center rounded-full border border-stone-200 bg-white/80 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-700 shadow-sm backdrop-blur">
            Founder Story
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-[0.06em] text-stone-900 sm:text-3xl md:text-4xl">
            Meet The Founder
          </h2>
        </div>

        <div className="grid items-center gap-5 rounded-[1.75rem] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(17,24,39,0.08)] backdrop-blur-sm sm:p-5 lg:grid-cols-[0.92fr_1fr] lg:gap-8 lg:p-6 xl:gap-10 xl:p-7">
          <div
            className={`relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[1.5rem] border border-white/70 bg-stone-100 shadow-[0_20px_45px_rgba(15,23,42,0.16)] transition-all duration-1000 sm:max-w-[360px] lg:max-w-[400px] ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/75 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur sm:left-5 sm:top-5">
              Founder &amp; CEO
            </div>
            <div className="group relative overflow-hidden">
              <Image
                src={FOUNDER_IMAGE_PATH}
                alt="Pranit Shah, Founder and CEO of PS BAGS"
                width={900}
                height={1100}
                className={`h-[280px] w-full object-cover transition-all duration-[1400ms] ease-out sm:h-[340px] lg:h-[400px] ${
                  isVisible ? 'scale-[1.02] opacity-100' : 'scale-[0.96] opacity-0'
                } group-hover:scale-[1.06]`}
                priority={false}
              />
            </div>
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:inset-x-5 sm:bottom-5">
              <p className="text-xs font-medium tracking-[0.12em] text-white/85 sm:text-sm">Driven by vision, powered by passion.</p>
            </div>
          </div>

          <div
            className={`transition-all delay-150 duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-xs">
              Founder &amp; CEO
            </div>

            <h3 className="mt-4 text-3xl font-semibold tracking-[0.05em] text-stone-900 sm:text-4xl">
              Pranit Girish Shah
            </h3>

            {/* <p className="mt-3 text-base font-medium italic tracking-[0.02em] text-stone-700 sm:text-lg">
              “Driven by vision, powered by passion.”
            </p> */}

            <div className="mt-5 space-y-4 text-sm leading-7 tracking-[0.01em] text-stone-600 sm:text-base sm:leading-7">
              <p>
                Mr. Pranit Girish Shah is the Founder & CEO of Regaloo by PS, a growing &amp; name in the corporate gifting and wholesale industry.
              </p>
              <p>
                With over 5 years of experience, he has built the brand with a vision to deliver premium-quality products, creative customization, and exceptional customer service.
              </p>
              <p>
                Under his leadership, Regaloo by PS has become known for its premium customized products and high-quality WILD ADVENTURE bags.
              </p>
              <p>
                The company is committed to delivering quality innovation, and professionalism in every product.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200/80 bg-stone-50/80 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Leadership</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Building with clarity, discipline, and a premium-first mindset.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">Vision</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Elevating everyday utility into refined brand experiences through innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
