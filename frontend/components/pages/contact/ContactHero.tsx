'use client';

import { useEffect, useRef } from 'react';

export default function ContactHero() {
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
    <section className="relative h-[65vh] min-h-[520px] max-h-[780px] overflow-hidden flex items-end bg-[#1a1714]">
      {/* Parallax BG */}
      <div
        ref={imgRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1800&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/55 to-[#1a1714]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/75 via-transparent to-transparent" />

      {/* Vertical accent line */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b8975a]/25 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8" style={{ animation: 'hero-word-in 0.8s 0.1s both' }}>
          <a href="/" className="text-[10px] tracking-[0.3em] uppercase text-[#5c5550] hover:text-[#b8975a] transition-colors">Home</a>
          <span className="text-[#3d3632]">/</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a]">Contact</span>
        </div>

        {/* Headline */}
        <h1 className="font-['Cormorant_Garamond'] font-light text-[#faf8f5] leading-[0.95] mb-8 max-w-4xl">
          <div className="overflow-hidden">
            <span className="inline-block text-[clamp(48px,7vw,108px)]" style={{ animation: 'hero-word-in 1.1s 0.25s both' }}>
              Let's Start
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="inline-block italic text-[#b8975a] text-[clamp(48px,7vw,108px)]" style={{ animation: 'hero-word-in 1.1s 0.45s both' }}>
              Something Great
            </span>
          </div>
        </h1>

        <p
          className="text-[#a39890] text-base lg:text-lg font-light max-w-lg leading-relaxed"
          style={{ animation: 'hero-word-in 1s 0.7s both' }}
        >
          A free, no-obligation estimate and consultation — delivered within 48 hours. No pressure, no runaround.
        </p>
      </div>

      {/* Bottom-right response promise badge */}
      <div
        className="absolute bottom-8 right-12 hidden lg:flex flex-col items-end gap-1"
        style={{ animation: 'hero-word-in 1s 1s both' }}
      >
        <span className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#b8975a]">48hr</span>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#5c5550]">Guaranteed Response</span>
      </div>
    </section>
  );
}
