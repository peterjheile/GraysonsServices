import Image from 'next/image';

import { CULTURE_CONTENT, CULTURE_IMAGES } from './constants';

export default function CultureSection() {
  return (
    <section
      id="culture"
      aria-labelledby="culture-heading"
      className="bg-[#faf8f5] pt-24 sm:pt-28 lg:pt-40"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="grid items-center gap-16 pb-24 sm:pb-28 lg:grid-cols-2 lg:gap-28">
          <div className="reveal-left relative mx-auto w-full max-w-112">
            <div className="relative aspect-4/5 w-full overflow-hidden lg:aspect-3/4">
              <Image
                src={CULTURE_CONTENT.image.src}
                alt={CULTURE_CONTENT.image.alt}
                fill
                sizes="(min-width: 496px) 448px, calc(100vw - 48px)"
                className="object-cover object-[center_55%]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at center, transparent 55%, rgba(26, 23, 20, 0.08) 78%, rgba(26, 23, 20, 0.25) 100%)',
                }}
              />
            </div>

            <div className="absolute -bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-72 -translate-x-1/2 bg-stone-darkest px-5 py-5 text-center shadow-xl sm:px-6 lg:left-0 lg:w-auto lg:min-w-72 lg:-translate-x-12">
              <p className="text-[10px] font-medium tracking-[0.25em] text-gold uppercase">
                {CULTURE_CONTENT.card.eyebrow}
              </p>

              <p className="mt-2 font-['Cormorant_Garamond'] text-2xl leading-tight text-stone-light">
                {CULTURE_CONTENT.card.title}
              </p>
            </div>
          </div>

          <div className="reveal-right text-center lg:text-left">
            <div
              aria-hidden="true"
              className="gold-line mx-auto flex justify-center lg:mx-0 lg:block"
            />

            <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
              {CULTURE_CONTENT.eyebrow}
            </p>

            <h2
              id="culture-heading"
              className="mt-4 mb-8 font-['Cormorant_Garamond'] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.1] font-light text-stone-darkest"
            >
              {CULTURE_CONTENT.title}
              <br />

              <em className="text-gold italic">
                {CULTURE_CONTENT.highlight}
              </em>
            </h2>

            <div className="space-y-5 text-base leading-relaxed font-light text-stone-mid">
              {CULTURE_CONTENT.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mx-auto max-w-100 lg:mx-0 lg:max-w-full"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="section-rule"
        />
      </div>

      <div
        aria-hidden="true"
        className="grid h-56 grid-cols-2 sm:h-64 lg:h-72 lg:grid-cols-4"
      >
        {CULTURE_IMAGES.map((src) => (
          <div
            key={src}
            className="group relative overflow-hidden bg-stone-darkest"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105 motion-reduce:transition-none"
            />

            <div className="absolute inset-0 bg-stone-darkest/30 transition-colors duration-500 group-hover:bg-stone-darkest/10 motion-reduce:transition-none" />
          </div>
        ))}
      </div>
    </section>
  );
}