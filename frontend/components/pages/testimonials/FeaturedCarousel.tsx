'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { testimonials } from './testimonialsData';

const featured = testimonials.filter((t) => t.featured);

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="#b8975a">
          <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function FeaturedCarousel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  const go = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setActive(idx);
        setAnimating(false);
      }, 350);
    },
    [animating]
  );

  const next = useCallback(() => go((active + 1) % featured.length), [active, go]);
  const prev = useCallback(() => go((active - 1 + featured.length) % featured.length), [active, go]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(next, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next, paused]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed.current) {
          revealed.current = true;
          ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => el.classList.add('visible'));
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const t = featured[active];

  return (
    <section
      ref={ref}
      className="bg-[#1a1714] py-28 lg:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center justify-between mb-16">
          <div className="reveal flex items-center gap-4">
            <div className="w-6 h-[1px] bg-[#b8975a]" />
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">
              Featured Reviews
            </span>
          </div>
          <div className="reveal text-[10px] tracking-[0.2em] uppercase text-[#3d3632]">
            {active + 1} / {featured.length}
          </div>
        </div>

        {/* Main carousel area */}
        <div className="grid lg:grid-cols-5 gap-3 lg:gap-4 items-stretch min-h-[480px]">

          {/* Quote panel */}
          <div
            className={`lg:col-span-3 bg-[#f5f1eb] relative overflow-hidden flex flex-col justify-between p-10 lg:p-16 reveal-left transition-opacity duration-350 ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            {/* Decorative giant quote mark */}
            <div
              className="absolute -top-6 -left-2 font-['Cormorant_Garamond'] text-[220px] leading-none text-[#1a1714]/6 select-none pointer-events-none font-bold"
              aria-hidden
            >
              "
            </div>

            {/* Top: stars + platform */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <Stars count={t.stars} />
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#a39890] border border-[#e8e2da] px-3 py-1.5">
                  via {t.platform}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="font-['Cormorant_Garamond'] text-[clamp(20px,2.2vw,30px)] font-light text-[#1a1714] italic leading-[1.5] mb-10">
                "{t.quote}"
              </blockquote>
            </div>

            {/* Bottom: author + project */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-[#1a1714] flex items-center justify-center shrink-0">
                  <span className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#b8975a]">{t.initials}</span>
                </div>
                <div>
                  <div className="font-semibold text-[#1a1714] text-sm tracking-wide">{t.name}</div>
                  <div className="text-[11px] text-[#a39890] mt-0.5">{t.role} · {t.location}</div>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <div className="text-[9px] tracking-[0.25em] uppercase text-[#b8975a] mb-1">Project</div>
                  <div className="text-xs text-[#5c5550] font-light leading-snug max-w-[180px]">{t.project}</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-[2px] bg-[#e8e2da] w-full overflow-hidden">
                <div
                  key={`${active}-${paused}`}
                  className="h-full bg-[#b8975a]"
                  style={{
                    animation: paused ? 'none' : 'progress-bar 6s linear forwards',
                    width: paused ? `${((active) / featured.length) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: project image + navigation */}
          <div className="lg:col-span-2 flex flex-col gap-3 reveal-right">
            {/* Project image */}
            {t.projectImage && (
              <div
                className={`flex-1 relative overflow-hidden transition-opacity duration-350 ${animating ? 'opacity-0' : 'opacity-100'}`}
                style={{
                  backgroundImage: `url('${t.projectImage}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '280px',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="inline-block px-3 py-1.5 bg-[#b8975a] text-[9px] tracking-[0.25em] uppercase font-semibold text-[#1a1714]">
                    {t.category}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation controls */}
            <div className="flex items-center justify-between bg-[#1e1b18] border border-[#2d2926] p-5">
              <button
                onClick={prev}
                className="w-10 h-10 border border-[#2d2926] flex items-center justify-center text-[#a39890] hover:border-[#b8975a] hover:text-[#b8975a] transition-all duration-200"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="flex gap-2">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`transition-all duration-300 ${
                      i === active
                        ? 'w-6 h-1.5 bg-[#b8975a]'
                        : 'w-1.5 h-1.5 rounded-full bg-[#3d3632] hover:bg-[#5c5550]'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 border border-[#2d2926] flex items-center justify-center text-[#a39890] hover:border-[#b8975a] hover:text-[#b8975a] transition-all duration-200"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .transition-opacity { transition-property: opacity; }
        .duration-350 { transition-duration: 350ms; }
      `}</style>
    </section>
  );
}
