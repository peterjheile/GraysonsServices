import { Testimonial } from './types';
import RevealObserver from './RevealObserverClient';

type TestimonialsProps = {
  testimonials: Testimonial[];
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#b8975a">
          <path d="M6 1l1.5 3.1L11 4.6 8.5 7l.6 3.5L6 9l-3.1 1.5.6-3.5L1 4.6l3.5-.5L6 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const featured = testimonials.filter((t) => t.featured);
  const cards = testimonials.filter((t) => !t.featured);

  return (
    <RevealObserver>
      <section id="testimonials" className="bg-stone-cream py-28 lg:py-40">
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          {/* Header */}
          <div className="mb-20 text-center reveal">
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
              Client Testimonials
            </span>

            <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-stone-darkest">
              What Clients Say
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-base font-light text-stone-mid">
              Over xxx completed projects. Over xxx stories we're proud to be part of.
            </p>
          </div>

          {/* Featured testimonials */}
          {featured.length > 0 && (
            <div className="mb-6 grid gap-3 lg:grid-cols-5">
              <div className="space-y-3 lg:col-span-3">
                {featured.map((t, i) => (
                  <div
                    key={t.id}
                    className="relative overflow-hidden bg-stone-darkest p-10 reveal-left lg:p-16"
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <div
                      className="pointer-events-none absolute -left-4 -top-4 select-none font-['Cormorant_Garamond'] text-[200px] leading-none text-gold/10"
                      aria-hidden
                    >
                      "
                    </div>

                    <div className="relative z-10">
                      <Stars count={t.stars} />

                      <blockquote className="my-6 font-['Cormorant_Garamond'] text-[clamp(22px,2.5vw,32px)] font-light italic leading-[1.45] text-white lg:mb-8">
                        "{t.quote}"
                      </blockquote>

                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 font-['Cormorant_Garamond'] text-lg font-semibold text-gold">
                          {t.name[0]}
                        </div>

                        <div>
                          <div className="text-sm font-medium text-white">
                            {t.name}
                          </div>

                          <div className="mt-0.5 text-xs text-stone-light">
                            {t.role}
                          </div>
                        </div>

                        <div className="ml-auto hidden text-right sm:block">
                          <div className="text-[10px] uppercase tracking-[0.15em] text-gold">
                            Project
                          </div>

                          <div className="mt-0.5 max-w-40 text-xs text-stone-light">
                            {t.project}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side image */}
              <div
                className="relative min-h-70 bg-cover bg-center reveal-right lg:col-span-2"
                style={{
                  backgroundImage:
                    "url('/services/after.jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gold/20" />

                <div className="absolute bottom-6 left-6 bg-stone-darkest/80 px-5 py-3 backdrop-blur-sm">
                  <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
                    5-Star Rated
                  </div>

                  <div className="font-['Cormorant_Garamond'] text-2xl font-semibold text-gold">
                    Google & Facebook
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((t, i) => (
              <div
                key={t.id}
                className="testimonial-card border border-stone-pale bg-white p-8 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Stars count={t.stars} />

                <blockquote className="mb-6 mt-5 text-sm font-light italic leading-relaxed text-stone-mid">
                  "{t.quote}"
                </blockquote>

                <div className="flex items-center gap-3 border-t border-stone-pale pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 font-['Cormorant_Garamond'] text-base font-semibold text-gold">
                    {t.name[0]}
                  </div>

                  <div>
                    <div className="text-xs font-medium tracking-wide text-stone-darkest">
                      {t.name}
                    </div>

                    <div className="mt-0.5 text-[10px] text-stone-light">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA card */}
            <div
              className="flex flex-col justify-between bg-gold p-8 reveal"
              style={{ transitionDelay: `${cards.length * 100}ms` }}
            >
              <div>
                <div className="mb-4 font-['Cormorant_Garamond'] text-4xl font-light leading-tight text-stone-darkest">
                  Ready to Start Your Project?
                </div>

                <p className="text-sm font-light text-stone-darkest/70">
                  Join satisfied homeowners. Get your free estimate today.
                </p>
              </div>

              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-darkest"
              >
                <span>Get a Quote</span>

                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M2 8h12M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </RevealObserver>
  );
}