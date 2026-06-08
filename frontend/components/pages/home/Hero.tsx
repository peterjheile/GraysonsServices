import type { QuickStat } from "./types";
import ParallaxHero from "@/components/ui/parallax-hero";


type HeroClientProps = {
  quickStats: [QuickStat, QuickStat, QuickStat];
}



export default function Hero({quickStats}: HeroClientProps) {


  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1100px] overflow-hidden flex items-end">
      
      {/* Background Image with Parallax */}
      <ParallaxHero
        imageUrl = "/home/hero.jpg"
        backgroundPosition = "center 0%"
      />

      {/* Readability Gradient Overlays */}
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-stone-darkest via-stone-darkest/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-stone-darkest/70 via-stone-darkest/20 to-transparent" />

        {/* Floating Quality Badge */}
        <div className = "absolute left-1/2 -translate-x-1/2 h-full w-full max-w-(--max-content-width) min-w-(--min-content-width)">
          <div className="absolute top-7/16 right-12 lg:right-24 float-badge hidden md:flex h-28 w-28 lg:h-36 lg:w-36 flex-col items-center justify-center rounded-full border border-gold/60 bg-stone-darkest/40 backdrop-blur-sm will-change-transform transform-gpu shadow-[0_0_0_1px_rgba(184,151,90,0.25)]">
            <span className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-light text-white leading-none">
              5+
            </span>
            <span className="mt-1 text-center text-[9px] lg:text-[10px] font-medium uppercase leading-tight tracking-[0.2em] text-gold">
              Years<br />Experience
            </span>
        </div>
      </div>



      {/* Main Content */}
      <div className="relative z-10 w-full max-w-(--max-content-width) min-w-(--min-content-width) mx-auto px-6 lg:px-12 pb-30 lg:pb-28 lg:mb-10">
        

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-6" style={{ animation: 'hero-word-in 0.8s 0.1s both' }}>
          <div className="w-6 md:w-10 h-px bg-gold" />
          <span
            className="text-xs tracking-[0.35em] uppercase text-gold font-medium"
            
          >
            Hardscaping
          </span>
        </div>


        {/* Headline */}
        <h1 className="font-['Cormorant_Garamond'] font-light text-white leading-[0.95] max-w-5xl">
          <div className="overflow-hidden">
            <span className="hero-word text-[clamp(52px,8vw,120px)]" style={{ animationDelay: '0.2s' }}>
              Crafting
            </span>
            {' '}
            <span className="hero-word text-[clamp(52px,8vw,120px)] italic text-gold" style={{ animationDelay: '0.35s' }}>
              Outdoor
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-word text-[clamp(52px,8vw,120px)]" style={{ animationDelay: '0.5s' }}>
              Spaces That Last
            </span>
          </div>
        </h1>



        {/* Subtext & CTA row */}
        <div className="mt-5 lg:mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="/gallery"
            className="btn-primary min-w-[230px] lg:w-1/4 lg:h-15 justify-center"
          >
            <span>View Our Work</span>
            <svg
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
          </a>

          <a
            href="/contact"
            className="btn-outline justify-center lg:w-1/5 lg:h-15 min-w-[230px]"
          >
            <span>Free Estimate</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'hero-word-in 1s 1.2s both' }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/80">Scroll</span>
        <div className="w-px h-10 bg-linear-to-b from-gold to-transparent" />
      </div>



      {/* Bottom Stats Bar */}
      <div className = "absolute left-1/2 -translate-x-1/2 h-full w-full max-w-(--max-content-width) min-w-(--min-content-width)">
        <div
          className="absolute bottom-0 right-0 hidden lg:flex max-w-110 border-r border-gold/20"
          style={{ animation: "hero-word-in 1s 1s both" }}
        >
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="
                w-44
                px-6 py-5
                border-l border-t border-gold/20
                bg-stone-darkest/70
                backdrop-blur-sm
              "
            >
              <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-gold">
                {stat.value}
              </div>

              <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-stone-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
