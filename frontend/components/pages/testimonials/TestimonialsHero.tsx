'use client';

import { useEffect, useRef } from 'react';

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i < count ? '#b8975a' : 'none'} stroke="#b8975a" strokeWidth={i < count ? 0 : 1}>
          <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsHero() {
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
      {/* Parallax BG */}
      <div
        ref={imgRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%]"
        style={{
          backgroundImage: `url('/services/Deck1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/60 to-[#1a1714]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/75 via-transparent to-transparent" />

      {/* Vertical accent */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b8975a]/25 to-transparent hidden lg:block" />

      {/* Floating platform badges — top right */}
      <div
        className="absolute top-32 right-10 lg:right-16 hidden md:flex flex-col gap-3"
        style={{ animation: 'hero-word-in 1s 1s both' }}
      >
        {[
          { label: 'Google', rating: '5.0', count: 'xx reviews' },
        ].map((p) => (
          <div
            key={p.label}
            className="flex items-center gap-3 bg-[#1a1714]/70 backdrop-blur-sm px-4 py-3 border border-[#2d2926]"
          >
            <div>
              <div className="text-[9px] tracking-[0.25em] uppercase text-[#a39890]">{p.label}</div>
              <div className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#b8975a] leading-none mt-0.5">{p.rating}</div>
            </div>
            <div className="w-px h-8 bg-[#2d2926]" />
            <div>
              <Stars count={5} size={10} />
              <div className="text-[9px] text-[#5c5550] mt-1">{p.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8" style={{ animation: 'hero-word-in 0.8s 0.1s both' }}>
          <a href="/" className="text-[10px] tracking-[0.3em] uppercase text-[#5c5550] hover:text-[#b8975a] transition-colors">Home</a>
          <span className="text-[#3d3632]">/</span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a]">Testimonials</span>
        </div>

        {/* Headline */}
        <h1 className="font-['Cormorant_Garamond'] font-light text-[#faf8f5] leading-[0.95] mb-8 max-w-4xl">
          <div className="overflow-hidden">
            <span
              className="inline-block text-[clamp(48px,7vw,108px)]"
              style={{ animation: 'hero-word-in 1.1s 0.25s both' }}
            >
              Words From
            </span>
          </div>
          <div className="overflow-hidden">
            <span
              className="inline-block italic text-[#b8975a] text-[clamp(48px,7vw,108px)]"
              style={{ animation: 'hero-word-in 1.1s 0.45s both' }}
            >
              Our Clients
            </span>
          </div>
        </h1>

        <p
          className="text-[#a39890] text-base lg:text-lg font-light max-w-lg leading-relaxed"
          style={{ animation: 'hero-word-in 1s 0.7s both' }}
        >
          Over xxx completed projects. Short description about take it from our clients, here our there words, etc.
        </p>
      </div>

      {/* Bottom stat strip */}
      <div
        className="absolute bottom-0 right-0 hidden lg:flex"
        style={{ animation: 'hero-word-in 1s 1.1s both' }}
      >
        {[
          { value: '5.0★', label: 'Average Rating' },
          { value: 'xxx+', label: 'Verified Reviews' },
          { value: '100%', label: 'Would Re-hire' },
        ].map((s) => (
          <div key={s.label} className="w-44 px-6 py-5 border-l border-t border-[#b8975a]/20 bg-[#1a1714]/70 backdrop-blur-sm">
            <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#b8975a]">{s.value}</div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-[#a39890] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
