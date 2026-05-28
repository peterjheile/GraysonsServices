'use client';

import { useEffect, useRef } from 'react';

export default function ProjectsHero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative h-[72vh] min-h-[580px] max-h-[860px] overflow-hidden flex items-end bg-[#1a1714]">
      {/* BG collage — three overlapping images */}
      <div ref={imgRef} className="absolute inset-0 -top-[15%] -bottom-[15%] grid grid-cols-3">
        {[
          'services/Deck1.jpg',
          'services/Driveway1.jpg',
          'services/Walkway1.jpg',
        ].map((src, i) => (
          <div
            key={i}
            className="bg-cover bg-center"
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/65 to-[#1a1714]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/70 via-[#1a1714]/20 to-transparent" />

      {/* Vertical rule */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b8975a]/25 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8" style={{ animation: 'hero-word-in 0.8s 0.1s both' }}>
          <a href="/" className="text-[10px] tracking-[0.3em] uppercase text-[#5c5550] hover:text-[#b8975a] transition-colors">Home</a>
          <span className="text-[#3d3632]">/</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a]">Projects</span>
        </div>

        <h1 className="font-['Cormorant_Garamond'] font-light text-[#faf8f5] leading-[0.95] mb-8 max-w-4xl">
          <div className="overflow-hidden">
            <span className="inline-block text-[clamp(48px,7vw,108px)]" style={{ animation: 'hero-word-in 1.1s 0.25s both' }}>
              Our
            </span>
            {' '}
            <span className="inline-block italic text-[#b8975a] text-[clamp(48px,7vw,108px)]" style={{ animation: 'hero-word-in 1.1s 0.4s both' }}>
              Portfolio
            </span>
          </div>
        </h1>

        <p
          className="text-[#a39890] text-base lg:text-lg font-light max-w-xl leading-relaxed mb-12"
          style={{ animation: 'hero-word-in 1s 0.65s both' }}
        >
          A short description goes here, such as: Every project is a before and an after. Should be a little longer and more thought out.
        </p>

        {/* Inline stat strip */}
        <div
          className="flex flex-wrap gap-x-12 gap-y-4"
          style={{ animation: 'hero-word-in 1s 0.85s both' }}
        >
          {[
            { n: 'xxx', label: 'Projects Completed' },
            { n: 'xxx', label: 'Years in Business' },
            { n: '100%', label: 'Client Satisfaction' },
            { n: '4', label: 'Service Categories' },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <span className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-semibold text-[#b8975a]">{s.n}</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#a39890]">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
