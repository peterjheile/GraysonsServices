'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 1600, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

const stats = [
  { value: 15, suffix: '+', label: 'Years in Business' },
  { value: 42,  suffix: '',  label: 'Team Members' },
  { value: 94,  suffix: '%', label: 'Retention Rate' },
  { value: 8, suffix: '',  label: 'Open Positions' },
];

export default function CareersHero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsActive(true); },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const s0 = useCountUp(stats[0].value, 1400, statsActive);
  const s1 = useCountUp(stats[1].value, 1600, statsActive);
  const s2 = useCountUp(stats[2].value, 1800, statsActive);
  const s3 = useCountUp(stats[3].value, 1200, statsActive);
  const counts = [s0, s1, s2, s3];

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row bg-[#1a1714] overflow-hidden">

      {/* ── LEFT: Editorial copy panel ── */}
      <div className="relative z-10 flex flex-col justify-between w-full lg:w-[52%] px-6 lg:px-16 xl:px-20 pt-40 pb-16 lg:pb-20">

        {/* Vertical accent rule */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#b8975a]/20 to-transparent hidden lg:block" />

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-12" style={{ animation: 'hero-word-in 0.7s 0.1s both' }}>
            <a href="/" className="text-[10px] tracking-[0.3em] uppercase text-[#5c5550] hover:text-[#b8975a] transition-colors">Home</a>
            <span className="text-[#3d3632]">/</span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a]">Careers</span>
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6" style={{ animation: 'hero-word-in 0.8s 0.2s both' }}>
            <div className="w-8 h-px bg-[#b8975a]" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Join the Crew</span>
          </div>

          {/* Headline */}
          <div className="mb-8">
            <div className="overflow-hidden">
              <h1
                className="inline-block font-['Cormorant_Garamond'] font-light text-[#faf8f5] text-[clamp(52px,6.5vw,96px)] leading-[0.92]"
                style={{ animation: 'hero-word-in 1.1s 0.3s both' }}
              >
                Build
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1
                className="inline-block font-['Cormorant_Garamond'] italic text-[#b8975a] text-[clamp(52px,6.5vw,96px)] leading-[0.92]"
                style={{ animation: 'hero-word-in 1.1s 0.48s both' }}
              >
                Something
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1
                className="inline-block font-['Cormorant_Garamond'] font-light text-[#faf8f5] text-[clamp(52px,6.5vw,96px)] leading-[0.92]"
                style={{ animation: 'hero-word-in 1.1s 0.64s both' }}
              >
                Real.
              </h1>
            </div>
          </div>

          <p
            className="text-[#a39890] text-base lg:text-lg font-light leading-relaxed max-w-md mb-10"
            style={{ animation: 'hero-word-in 1s 0.8s both' }}
          >
            Grayson's Services is a hardscaping company on the rise. We're looking for the kind of people who take pride in physical craft — who want to leave work every day and see exactly what they built.
          </p>

          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'hero-word-in 1s 0.95s both' }}
          >
            <a href="#positions" className="btn-primary">
              <span>View Open Positions</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="relative z-10">
                <path d="M6.5 2v9M3 8l3.5 3.5L10 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#culture" className="btn-outline">
              <span>Our Culture</span>
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-px bg-[#2d2926] mt-16 border-t border-[#2d2926]"
          style={{ animation: 'hero-word-in 1s 1.1s both' }}
        >
          {stats.map((s, i) => (
            <div key={s.label} className="bg-[#1a1714] px-5 py-6">
              <div className="font-['Cormorant_Garamond'] text-[clamp(28px,3.5vw,42px)] font-semibold text-[#b8975a] leading-none">
                {counts[i]}{s.suffix}
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase text-[#5c5550] mt-2 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Full-bleed photo collage ── */}
      <div className="relative w-full lg:w-[48%] min-h-[50vh] lg:min-h-full overflow-hidden">
        <div
          ref={imgRef}
          className="absolute inset-0 -top-[12%] -bottom-[12%]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-[#1a1714]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/60 via-transparent to-transparent lg:hidden" />

        {/* Floating "Now Hiring" badge */}
        <div className="absolute top-1/3 right-8 lg:right-12 flex flex-col items-center justify-center w-32 h-32 lg:w-40 lg:h-40 border-2 border-[#b8975a] bg-[#1a1714]/60 backdrop-blur-sm float-badge">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#b8975a] font-medium text-center leading-tight">Now</span>
          <span className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl text-[#faf8f5] font-light leading-none my-1">Hiring</span>
          <div className="w-6 h-px bg-[#b8975a] mt-1" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#b8975a] font-medium mt-1">8 Roles</span>
        </div>

        {/* Bottom image caption */}
        <div className="absolute bottom-6 right-6 text-right">
          <div className="text-[9px] tracking-[0.25em] uppercase text-[#5c5550]">Greenfield, OH · Est. 2009</div>
        </div>
      </div>
    </section>
  );
}
