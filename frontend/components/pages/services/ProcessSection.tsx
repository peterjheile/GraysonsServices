import { PROCESS_SECTION, PROCESS_STEPS } from './constants';

export default function ProcessSection() {
  return (
    <section
      aria-labelledby="process-heading"
      className="bg-stone-darkest py-24 sm:py-28 lg:py-40"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="mb-16 grid items-end gap-8 md:grid-cols-2 md:gap-12 lg:mb-20 lg:gap-24">
          <div className="reveal">
            <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
              {PROCESS_SECTION.eyebrow}
            </p>

            <h2
              id="process-heading"
              className="mt-3 font-['Cormorant_Garamond'] text-[clamp(2.25rem,4.5vw,3.75rem)] leading-tight font-light text-white"
            >
              <span className="block">{PROCESS_SECTION.title}</span>
              <em className="block text-gold">{PROCESS_SECTION.highlight}</em>
            </h2>
          </div>

          <div className="reveal">
            <p className="max-w-2xl text-sm leading-7 font-light text-[#d6c8b2] sm:text-base">
              {PROCESS_SECTION.description}
            </p>
          </div>
        </div>

        <ol className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.number}
              className="reveal"
              style={{
                transitionDelay: `${Math.min(index, 3) * 80}ms`,
              }}
            >
              <div className="group relative h-full min-h-72 overflow-hidden bg-stone-darkest p-8 transition-colors duration-300 hover:bg-[#211d19] motion-reduce:transition-none lg:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -bottom-4 select-none font-['Cormorant_Garamond'] text-[100px] leading-none font-bold text-white/[0.04] transition-colors group-hover:text-white/[0.06] motion-reduce:transition-none"
                >
                  {step.number}
                </span>

                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-4">
                    <span className="font-['Cormorant_Garamond'] text-4xl font-semibold text-gold">
                      {step.number}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-white/10"
                    />
                  </div>

                  <h3 className="mb-3 font-['Cormorant_Garamond'] text-2xl font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 font-light text-[#d6c8b2]">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}