import { PrimaryButton } from "@/components/ui/buttons";

export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[450px] w-full overflow-hidden">
      {/* Hero Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Hero Video Visibility Overlay */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.65)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_32%,rgba(0,0,0,0)_62%,rgba(0,0,0,0.65)_100%)]" />

      {/* Center CTA */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="translate-y-4 text-center text-white md:translate-y-6">
          <p className="font-highlight text-4xl leading-none drop-shadow-md md:text-5xl">
            We Make It Happen
          </p>

          <PrimaryButton
            text="View Our Services"
            className="mt-6 px-5 py-1.5 text-xs md:text-sm"
          />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-6 md:px-8 md:pb-8">
        <div className="mx-auto flex max-w-7xl justify-center lg:justify-start">
          <div
            className="
              w-full max-w-md 
              px-5 py-4 text-center text-white
              sm:max-w-lg
              lg:max-w-2xl lg:px-0 lg:py-0
              lg:text-left
            "
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] md:text-xs lg:text-sm">
              Landscaping • Hardscaping • Outdoor Living
            </p>

            <div className="mx-auto mt-3 h-px w-14 bg-white/45 lg:mx-0" />


            <p className="mt-4 hidden max-w-xl text-base leading-relaxed text-white/90 lg:block">
              We help homeowners improve their yards with landscaping,
              hardscaping, patios, retaining walls, grading, and cleanups—done
              right from start to finish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}