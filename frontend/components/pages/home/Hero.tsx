import Link from 'next/link';

import ParallaxHero from '@/components/ui/parallax-hero';
import type { QuickStats } from '@/features/company-stats/types';

type HeroProps = {
  quickStats: QuickStats | null;
};

export default function Hero({ quickStats }: HeroProps) {
  const orderedStats = quickStats
    ? [
        quickStats.projects_completed,
        quickStats.client_satisfaction,
        quickStats.years_in_business,
      ]
    : [];

  return (
    <section className="relative isolate flex h-svh min-h-175 max-h-275 w-full items-end overflow-hidden bg-stone-darkest">
      {/* Background */}
      <ParallaxHero
        imageUrl="/images/defaults/home/hero.jpg"
        backgroundPosition="center 40%"
      />

      {/* Readability overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/80 via-black/40 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-stone-darkest via-stone-darkest/40 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-stone-darkest/70 via-stone-darkest/20 to-transparent"
      />

      {/* Medium-screen quality badge; desktop uses the stats bar below. */}
      {quickStats && (
        <div className="pointer-events-none absolute left-1/2 z-10 h-full w-full min-w-(--min-content-width) max-w-(--max-content-width) -translate-x-1/2">
          <div
            className="float-badge absolute top-7/16 right-12 hidden h-28 w-28 transform-gpu flex-col items-center justify-center rounded-full border border-gold/60 bg-stone-darkest/40 shadow-[0_0_0_1px_rgba(184,151,90,0.25)] backdrop-blur-sm motion-reduce:animate-none! md:flex lg:hidden"
          >
            <span className="font-['Cormorant_Garamond'] text-3xl leading-none font-light text-white">
              {quickStats.years_in_business.value}
              {quickStats.years_in_business.suffix}
            </span>

            <span className="mt-2 text-center text-[9px] leading-tight font-medium tracking-[0.2em] text-gold uppercase">
              Years
              <br />
              Experience
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full min-w-(--min-content-width) max-w-(--max-content-width) px-6 pb-30 lg:px-12 lg:pb-38">
        {/* Eyebrow */}
        <div
          className="mb-6 flex items-center gap-4 motion-reduce:animate-none!"
          style={{ animation: 'hero-word-in 0.8s 0.1s both' }}
        >
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gold md:w-10"
          />

          <span className="text-xs font-medium tracking-[0.35em] text-gold uppercase">
            Outdoor Property Services
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl font-['Cormorant_Garamond'] text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] font-light text-white">
          <span className="block overflow-hidden">
            <span
              className="hero-word motion-reduce:animate-none!"
              style={{ animationDelay: '0.2s' }}
            >
              Crafting
            </span>{' '}

            <span
              className="hero-word text-gold italic motion-reduce:animate-none!"
              style={{ animationDelay: '0.35s' }}
            >
              Outdoor
            </span>
          </span>

          <span className="block overflow-hidden">
            <span
              className="hero-word motion-reduce:animate-none!"
              style={{ animationDelay: '0.5s' }}
            >
              Spaces That Last
            </span>
          </span>
        </h1>

        {/* Calls to action */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10">
          <Link
            href="/projects"
            className="btn-primary min-w-57.5 justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none! motion-reduce:before:transition-none! lg:h-15 lg:w-1/4"
          >
            <span>View Our Work</span>

            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="relative z-10"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link
            href="/contact"
            className="btn-outline min-w-57.5 justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none! lg:h-15 lg:w-1/5"
          >
            <span>Free Estimate</span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 motion-reduce:animate-none!"
        style={{ animation: 'hero-word-in 1s 1.2s both' }}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/80 uppercase">
          Scroll
        </span>

        <span className="h-10 w-px bg-linear-to-b from-gold to-transparent" />
      </div>

      {/* Bottom stats bar */}
      {quickStats && (
        <div className="pointer-events-none absolute left-1/2 z-10 h-full w-full min-w-(--min-content-width) max-w-(--max-content-width) -translate-x-1/2">
          <div
            className="absolute right-0 bottom-0 hidden max-w-110 border-r border-gold/20 motion-reduce:animate-none! lg:flex"
            style={{ animation: 'hero-word-in 1s 1s both' }}
          >
            {orderedStats.map((stat) => (
              <div
                key={stat.label}
                className="w-44 border-t border-l border-gold/20 bg-stone-darkest/70 px-6 py-5 backdrop-blur-sm"
              >
                <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-gold">
                  {stat.value}
                  {stat.suffix}
                </div>

                <div className="mt-1 text-[10px] tracking-[0.15em] text-stone-light uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}