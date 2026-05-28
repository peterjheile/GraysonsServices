'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        const y = window.scrollY * 0.35;
        imgRef.current.style.transform = `translateY(${y}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden flex items-end"
    >
      {/* Background Image with Parallax */}
      <div
        ref={imgRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%] parallax-img"
        style={{
          backgroundImage: `url('/HomeHero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/50 to-[#1a1714]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/60 via-transparent to-transparent" />

      {/* Floating quality badge */}
      <div className="absolute top-1/3 right-12 lg:right-24 float-badge hidden md:flex flex-col items-center justify-center w-28 h-28 lg:w-36 lg:h-36 rounded-full border border-[#b8975a]/60 bg-[#1a1714]/40 backdrop-blur-sm">
        <span className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-light text-[#faf8f5] leading-none">5+</span>
        <span className="text-[9px] lg:text-[10px] tracking-[0.2em] uppercase text-[#b8975a] text-center mt-1 font-medium leading-tight">Years<br/>Experience</span>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-[1px] bg-[#b8975a]" />
          <span
            className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium"
            style={{ animation: 'hero-word-in 0.8s 0.1s both' }}
          >
            Hardscaping
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-['Cormorant_Garamond'] font-light text-[#faf8f5] leading-[0.95] mb-8 max-w-5xl">
          <div className="overflow-hidden">
            <span className="hero-word text-[clamp(52px,8vw,120px)]" style={{ animationDelay: '0.2s' }}>
              Crafting
            </span>
            {' '}
            <span className="hero-word text-[clamp(52px,8vw,120px)] italic text-[#b8975a]" style={{ animationDelay: '0.35s' }}>
              Outdoor
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-word text-[clamp(52px,8vw,120px)]" style={{ animationDelay: '0.5s' }}>
              Spaces That Last
            </span>
          </div>
        </h1>

        {/* Subtext & CTA row */}
        <div
          className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16"
          style={{ animation: 'hero-word-in 1s 0.8s both' }}
        >
          <p className="text-[#a39890] text-base lg:text-lg leading-relaxed max-w-md font-light">
            Some small sleek description will go here. Not too long, not decided yet.
          </p>
          <div className="flex items-center gap-4">
            <a href="#gallery" className="btn-primary">
              <span>View Our Work</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative z-10">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className="btn-outline">
              <span>Free Estimate</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'hero-word-in 1s 1.2s both' }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#a39890]">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#b8975a] to-transparent" />
      </div>

      {/* Bottom stats bar */}
      <div
        className="absolute bottom-0 right-0 hidden lg:flex"
        style={{ animation: 'hero-word-in 1s 1s both' }}
      >
        {[
          { value: '100+', label: '"Wow" stat one here.' },
          { value: '98%', label: 'Another, such as Client Satisfaction' },
          { value: '5', label: 'Final Stat goes here' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="w-44 px-6 py-5 border-l border-t border-[#b8975a]/20 bg-[#1a1714]/70 backdrop-blur-sm"
          >
            <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#b8975a]">
              {stat.value}
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[#a39890] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
