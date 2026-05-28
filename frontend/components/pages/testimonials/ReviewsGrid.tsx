'use client';

import { useState, useEffect, useRef } from 'react';
import { testimonials, testimonialCategories, platforms } from './testimonialsData';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 12 12" fill="#b8975a">
          <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

const platformIcon: Record<string, React.ReactNode> = {
  Google: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Houzz: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#7BB242">
      <path d="M12 2L2 8v14h8v-7h4v7h8V8L12 2z"/>
    </svg>
  ),
  Facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  ),
  Direct: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b8975a" strokeWidth="2" strokeLinecap="round">
      <path d="M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34"/>
      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
    </svg>
  ),
};

export default function ReviewsGrid() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = testimonials.filter((t) => {
    const catMatch = activeCategory === 'All' || t.category === activeCategory;
    const platMatch = activePlatform === 'All' || t.platform === activePlatform;
    return catMatch && platMatch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Re-run reveal on filter change
  useEffect(() => {
    setVisibleCount(8);
    setTimeout(() => {
      ref.current?.querySelectorAll('.reveal-scale').forEach((el) => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), 50);
      });
    }, 50);
  }, [activeCategory, activePlatform]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll('.reveal, .reveal-scale').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [visible.length]);

  return (
    <section ref={ref} className="bg-[#faf8f5] py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="reveal">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">All Reviews</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(32px,4vw,52px)] font-light text-[#1a1714] mt-2">
              Every Voice, <em className="italic text-[#b8975a]">Unfiltered</em>
            </h2>
          </div>
          <div className="reveal text-xs text-[#a39890] font-light">
            Showing {visible.length} of {filtered.length} reviews
          </div>
        </div>

        {/* Filter row */}
        <div className="reveal flex flex-col sm:flex-row gap-4 mb-10 pb-10 border-b border-[#e8e2da]">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {testimonialCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-[#b8975a] border-[#b8975a] text-[#1a1714]'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#b8975a]/40 hover:text-[#5c5550]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-[#e8e2da] self-stretch" />

          {/* Platform filters */}
          <div className="flex gap-2 flex-wrap">
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => setActivePlatform(plat)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-200 border ${
                  activePlatform === plat
                    ? 'border-[#1a1714] bg-[#1a1714] text-[#faf8f5]'
                    : 'border-[#e8e2da] text-[#a39890] hover:border-[#1a1714]/30 hover:text-[#5c5550]'
                }`}
              >
                {plat !== 'All' && platformIcon[plat]}
                {plat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style cards grid */}
        {visible.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {visible.map((t, i) => (
              <div
                key={t.id}
                className="reveal-scale break-inside-avoid bg-white border border-[#e8e2da] p-7 group hover:border-[#b8975a]/30 hover:shadow-[0_8px_40px_rgba(26,23,20,0.08)] transition-all duration-400"
                style={{ transitionDelay: `${(i % 8) * 60}ms` }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Stars count={t.stars} />
                  <div className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-[#c5bdb5]">
                    {platformIcon[t.platform]}
                    {t.platform}
                  </div>
                </div>

                {/* Project tag */}
                <div className="inline-flex items-center gap-1.5 mb-5">
                  <span className="w-1 h-1 rounded-full bg-[#b8975a]" />
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#b8975a] font-medium">{t.category}</span>
                </div>

                {/* Quote */}
                <blockquote className="font-['Cormorant_Garamond'] text-[17px] leading-[1.6] italic text-[#2d2926] mb-6 font-light">
                  "{t.quote}"
                </blockquote>

                {/* Project name */}
                <div className="text-[10px] text-[#a39890] font-light mb-5 leading-snug">
                  {t.project}
                </div>

                {/* Author row */}
                <div className="flex items-center gap-3 pt-5 border-t border-[#f0ece6]">
                  <div className="w-9 h-9 rounded-full bg-[#1a1714] flex items-center justify-center shrink-0">
                    <span className="font-['Cormorant_Garamond'] text-sm font-semibold text-[#b8975a]">{t.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#1a1714] tracking-wide truncate">{t.name}</div>
                    <div className="text-[10px] text-[#a39890] mt-0.5">{t.role} · {t.location}</div>
                  </div>
                  <div className="ml-auto text-[10px] text-[#c5bdb5] shrink-0">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-['Cormorant_Garamond'] text-3xl text-[#a39890] font-light">No reviews match these filters.</p>
            <button
              onClick={() => { setActiveCategory('All'); setActivePlatform('All'); }}
              className="mt-6 btn-outline text-sm"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="text-center mt-14 reveal">
            <button
              onClick={() => setVisibleCount((c) => c + 6)}
              className="btn-outline"
            >
              <span>Load More Reviews</span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 2v9M3 8l3.5 3.5L10 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="text-[10px] text-[#a39890] mt-4">
              {filtered.length - visibleCount} more reviews
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
