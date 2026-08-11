import Image from 'next/image';
import Link from 'next/link';

import type { Service } from '@/features/services/types';

interface ServiceBlockProps {
  service: Service;
  index: number;
  flip?: boolean;
}

export default function ServiceBlock({
  service,
  index,
  flip = false,
}: ServiceBlockProps) {
  const formattedIndex = String(index).padStart(2, '0');

  return (
    <article
      id={service.slug}
      aria-labelledby={`${service.slug}-heading`}
      className="
        scroll-mt-31
        border-b border-stone-pale py-16
        last:border-none sm:py-20
        md:scroll-mt-[9.1rem]
        lg:py-28 xl:py-32
      "
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div
            className={`
                ${flip ? 'reveal-right lg:order-2' : 'reveal-left'}
                w-full
              `}
          >
            <div className="mb-5 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-6 shrink-0 bg-gold" />

              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold sm:tracking-[0.35em]">
                {service.category.name}
              </p>
            </div>

            <h2
              id={`${service.slug}-heading`}
              className="font-['Cormorant_Garamond'] text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-light text-stone-darkest"
            >
              {service.name}
            </h2>

            <p className="mt-3 max-w-xl font-['Cormorant_Garamond'] text-lg leading-relaxed font-light italic text-stone-light sm:text-xl">
              {service.subtitle}
            </p>

            <div className="mt-7 max-w-2xl space-y-6 sm:mt-8">
              <p className="whitespace-pre-line text-sm leading-7 font-light text-stone-mid sm:text-[15px]">
                {service.overview}
              </p>

              <div>
                <h3 className="mb-2 text-[10px] font-medium tracking-[0.25em] text-stone-light uppercase">
                  Our Approach
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 font-light text-stone-mid sm:text-[15px]">
                  {service.process_description}
                </p>
              </div>
            </div>

            {service.included_items.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-stone-light">
                  What&apos;s Included
                </h3>

                <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {service.included_items.map((item, itemIndex) => (
                    <li
                      key={`${item.text}-${itemIndex}`}
                      className="flex items-start gap-3 text-sm leading-6 font-light text-stone-darkest"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold"
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path
                            d="M1.5 4l2 2 3-3"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-9 sm:mt-10">
              <Link
                href={`/contact?service=${encodeURIComponent(service.slug)}`}
                className="btn-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                aria-label={`Request a quote for ${service.name}`}
              >
                <span>Get a Quote</span>

                <svg
                  aria-hidden="true"
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
              </Link>
            </div>
          </div>

          <div
            className={`
                ${flip ? 'reveal-left lg:order-1' : 'reveal-right'}
                w-full
              `}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="project-card relative col-span-2 aspect-4/3 overflow-hidden bg-stone-pale">
                <Image
                  src={service.primary_image}
                  alt={service.primary_image_alt}
                  fill
                  sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, calc(100vw - 40px)"
                  className="object-cover motion-reduce:transform-none! motion-reduce:transition-none!"
                />

                <div
                  aria-hidden="true"
                  className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center bg-gold shadow-sm sm:top-5 sm:left-5"
                >
                  <span className="font-['Cormorant_Garamond'] text-lg font-semibold text-stone-darkest">
                    {formattedIndex}
                  </span>
                </div>
              </div>

              <div className="project-card relative aspect-4/3 overflow-hidden bg-stone-pale">
                <Image
                  src={service.supporting_image_one}
                  alt={service.supporting_image_one_alt}
                  fill
                  sizes="(min-width: 1280px) 272px, (min-width: 1024px) 22vw, calc(50vw - 26px)"
                  className="object-cover motion-reduce:transform-none! motion-reduce:transition-none!"
                />
              </div>

              <div className="project-card relative aspect-4/3 overflow-hidden bg-stone-pale">
                <Image
                  src={service.supporting_image_two}
                  alt={service.supporting_image_two_alt}
                  fill
                  sizes="(min-width: 1280px) 272px, (min-width: 1024px) 22vw, calc(50vw - 26px)"
                  className="object-cover motion-reduce:transform-none! motion-reduce:transition-none!"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}