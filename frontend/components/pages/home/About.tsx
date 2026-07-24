import Image from 'next/image';
import Link from 'next/link';

import type { QuickStats } from '@/features/company-stats/types';

import RevealObserver from './RevealObserverClient';
import type { AboutUs } from './view-types';

type AboutProps = {
  about: AboutUs;
  quickStats: QuickStats | null;
};

export default function About({
  about,
  quickStats,
}: AboutProps) {
  return (
    <RevealObserver>
      <section
        id="about"
        className="bg-white pt-28 lg:pt-40"
      >
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          <div className="grid items-center gap-16 pb-28 lg:grid-cols-2 lg:gap-28">
            {/* Image block */}
            <div className="reveal-left relative mx-auto w-full max-w-112">
              <div className="relative aspect-4/5 w-full overflow-hidden lg:aspect-3/4">
                <Image
                  src={about.url}
                  alt="Grayson’s Services team at work"
                  fill
                  sizes="(min-width: 496px) 448px, calc(100vw - 48px)"
                  className="object-cover object-center"
                />

                {/* Subtle edge vignette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(
                        ellipse at center,
                        transparent 55%,
                        rgba(26, 23, 20, 0.08) 78%,
                        rgba(26, 23, 20, 0.25) 100%
                      )
                    `,
                  }}
                />
              </div>

              {/* Floating information chip */}
              {quickStats && (
                <div className="absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 bg-stone-darkest px-6 py-5 text-center shadow-xl lg:left-0 lg:-translate-x-12">
                  <div className="font-['Cormorant_Garamond'] text-4xl font-semibold text-gold">
                    {quickStats.years_in_business.value}
                    {quickStats.years_in_business.suffix}
                  </div>

                  <div className="mt-1 text-[10px] tracking-[0.2em] text-stone-light uppercase">
                    Years of Excellence
                  </div>
                </div>
              )}
            </div>

            {/* Text block */}
            <div className="reveal-right text-center lg:text-left">
              <div
                aria-hidden="true"
                className="gold-line mx-auto flex justify-center lg:mx-0 lg:block"
              />

              <span className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
                {about.eyebrow}
              </span>

              <h2 className="mt-4 mb-8 font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] leading-[1.1] font-light text-stone-darkest">
                {about.titleLineNormal}
                <br />

                <em className="text-gold italic">
                  {about.titleLineHighlight}
                </em>
              </h2>

              <div className="space-y-5 text-base leading-relaxed font-light text-stone-mid">
                {about.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mx-auto max-w-100 lg:mx-0 lg:max-w-full"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10 flex justify-center lg:justify-start">
                <Link href="/services" className="btn-primary">
                  <span>See Our Services</span>
                </Link>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="section-rule"
          />
        </div>
      </section>
    </RevealObserver>
  );
}