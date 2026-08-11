import ParallaxHero from '@/components/ui/parallax-hero';

type PageHeroProps = {
  imageUrl: string;
  backgroundPosition?: string;
  eyebrow: string;
  titleNorm: string;
  titleHighlight: string;
  subtitle: string;
  explore: string;
};

export default function PageHero({
  imageUrl,
  backgroundPosition = 'center',
  eyebrow,
  titleNorm,
  titleHighlight,
  subtitle,
  explore,
}: PageHeroProps) {
  return (
    <section className="relative isolate flex h-[62svh] min-h-130 max-h-190 w-full items-end overflow-hidden bg-stone-darkest">
      {/* Background */}
      <ParallaxHero
        imageUrl={imageUrl}
        backgroundPosition={backgroundPosition}
      />

      {/* Readability overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/60 to-transparent"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-stone-darkest via-stone-darkest/60 to-stone-darkest/20"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-stone-darkest/80 via-stone-darkest/25 to-transparent"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full min-w-(--min-content-width) max-w-(--max-content-width) px-6 pb-16 sm:pb-20 lg:px-12 lg:pb-24">
        {/* Eyebrow */}
        <div
          className="mb-5 flex items-center gap-4 motion-reduce:animate-none!"
          style={{ animation: 'hero-word-in 0.8s 0.1s both' }}
        >
          <span
            aria-hidden="true"
            className="h-px w-6 bg-gold md:w-10"
          />

          <span className="text-xs font-medium tracking-[0.35em] text-gold uppercase">
            {eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl font-['Cormorant_Garamond'] text-[clamp(3.25rem,8vw,6.75rem)] leading-[0.92] font-light text-white">
          <span className="block overflow-hidden">
            <span
              className="hero-word motion-reduce:animate-none!"
              style={{ animationDelay: '0.2s' }}
            >
              {titleNorm}
            </span>
          </span>

          <span className="block overflow-hidden">
            <span
              className="hero-word text-gold italic motion-reduce:animate-none!"
              style={{ animationDelay: '0.4s' }}
            >
              {titleHighlight}
            </span>
          </span>
        </h1>

        {/* Supporting copy */}
        <p
          className="mt-6 max-w-xl text-sm leading-relaxed font-light text-stone-light motion-reduce:animate-none! sm:text-base lg:mt-8 lg:text-lg"
          style={{ animation: 'hero-word-in 1s 0.65s both' }}
        >
          {subtitle}
        </p>
      </div>

      {/* Explore indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden motion-reduce:animate-none! lg:block"
        style={{ animation: 'hero-word-in 1s 0.9s both' }}
      >
        <div className="mx-auto flex w-full min-w-(--min-content-width) max-w-(--max-content-width) justify-end px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-[0.3em] text-white/70 uppercase">
              {explore}
            </span>

            <span className="h-px w-8 bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}