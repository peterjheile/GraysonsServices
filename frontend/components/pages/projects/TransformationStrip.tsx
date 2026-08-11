'use client';

import { useEffect, useRef } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';

export default function TransformationStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.15 }
    );
    const els = ref.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#1a1714] py-20 lg:py-28">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="text-center mb-12 reveal">
          <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">The Grayson's Difference</span>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(32px,4vw,52px)] font-light text-[#faf8f5] mt-3">
            See the Transformation
          </h2>
          <p className="text-[#5c5550] text-sm font-light mt-3 max-w-md mx-auto">
            Drag the slider to reveal what was there before — and what we built in its place.
          </p>
        </div>

        {/* Wide slider */}
        <div className="reveal">

        </div>

        {/* Caption */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 reveal">
          <div>
            <div className="font-['Cormorant_Garamond'] text-xl text-[#faf8f5] font-light">Bloomington, IN</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#c9b9ad] mt-1">Short Form Description - 1 week</div>
          </div>
          <a href="#patios" className="text-[10px] tracking-[0.25em] uppercase text-[#b8975a] font-medium flex items-center gap-2 hover:gap-4 transition-all duration-300">
            View full project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
