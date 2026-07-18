'use client';

import { useEffect, useRef } from 'react';

interface ServiceBlockProps {
  id: string;
  index: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string[];
  features: string[];
  startingAt?: string;
  images: string[];
  flip?: boolean;
}

export default function ServiceBlock({
  id,
  index,
  eyebrow,
  title,
  subtitle,
  description,
  features,
  startingAt,
  images,
  flip = false,
}: ServiceBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08 }
    );

    const els = ref.current?.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <article
      id={id}
      ref={ref}
      className="scroll-mt-32 border-b border-stone-pale py-24 last:border-none lg:py-32"
    >
      {/* Centered container with max width */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div
          className={`flex flex-col items-start gap-12 lg:gap-16 ${
            flip ? 'lg:flex-row-reverse' : 'lg:flex-row'
          }`}
        >
          {/* ── Image column ── */}
          <div
            className={`w-full lg:w-1/2 reveal-${flip ? 'right' : 'left'}`}
          >
            {/* Main image */}
            <div className="project-card relative mb-3 aspect-4/3 w-full overflow-hidden">
              <img
                src={images[0]}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Number badge */}
              <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center bg-gold">
                <span className="font-['Cormorant_Garamond'] text-lg font-semibold text-stone-darkest">
                  {String(index).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Secondary image strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {images.slice(1, 3).map((src, i) => (
                  <div
                    key={i}
                    className="project-card relative aspect-3/2 overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`${title} ${i + 2}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Content column ── */}
          <div
            className={`w-full lg:w-1/2 reveal-${flip ? 'left' : 'right'}`}
          >
            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-6 bg-gold" />
              <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold">
                {eyebrow}
              </span>
            </div>

            {/* Title */}
            <h2 className="mb-2 font-['Cormorant_Garamond'] text-[clamp(32px,4vw,52px)] font-light leading-tight text-stone-darkest">
              {title}
            </h2>

            <p className="mb-8 font-['Cormorant_Garamond'] text-xl font-light italic text-stone-light">
              {subtitle}
            </p>

            {/* Description */}
            <div className="mb-10 space-y-4">
              {description.map((para, i) => (
                <p
                  key={i}
                  className="text-sm font-light leading-relaxed text-stone-mid"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Features list */}
            <div className="mb-10">
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-stone-light">
                What's Included
              </p>

              <ul className="space-y-3">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm font-light text-stone-darkest"
                  >
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold/50">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                      >
                        <path
                          d="M1.5 4l2 2 3-3"
                          stroke="#b8975a"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Starting price + CTA */}
            <div className="flex flex-wrap items-center gap-6">
              {/* {startingAt && (
                <div className="border-l-2 border-[#b8975a] pl-4">
                  <div className="text-[9px] uppercase tracking-[0.25em] text-[#a39890]">
                    Starting at
                  </div>

                  <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1a1714]">
                    {startingAt}
                  </div>
                </div>
              )} */}

              <a href="/contact" className="btn-primary">
                <span>Get a Quote</span>

                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="relative z-10"
                >
                  <path
                    d="M1.5 6.5h10M8 3l3.5 3.5L8 10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}