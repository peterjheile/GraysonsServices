import Link from 'next/link';

const PROJECT_START_STEPS = [
  {
    number: '01',
    title: 'Share Your Goal',
    description:
      'Tell us about the property, what you want to change, and any priorities you already have.',
  },
  {
    number: '02',
    title: 'Review the Details',
    description:
      'We will talk through the scope and arrange a closer look when the project calls for one.',
  },
  {
    number: '03',
    title: 'Plan the Next Step',
    description:
      'You will have a clearer path forward based on the needs of your project and property.',
  },
] as const;

export default function ProjectsCTA() {
  return (
    <section
      aria-labelledby="projects-cta-heading"
      className="relative isolate overflow-hidden bg-stone-darkest pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 [&+footer]:border-t-0"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(184,151,90,0.16),transparent_38%),radial-gradient(circle_at_90%_85%,rgba(184,151,90,0.08),transparent_34%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-stone-darkest"
      />

      <div
        className="
          relative mx-auto grid w-full max-w-(--max-content-width)
          gap-14 px-5
          sm:px-6
          md:px-8
          lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]
          lg:items-center lg:gap-20 lg:px-12
        "
      >
        <div className="reveal-left min-w-0">
          <p className="text-[10px] font-medium tracking-[0.35em] text-gold uppercase sm:text-[11px]">
            Your Project Could Be Next
          </p>

          <h2
            id="projects-cta-heading"
            className="
              mt-4 max-w-2xl
              font-['Cormorant_Garamond']
              text-[clamp(2.25rem,6vw,4rem)]
              leading-[1.04] font-light text-white
            "
          >
            Ready to Improve
            <span className="block text-gold italic">
              Your Property?
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-relaxed font-light text-[#c4bbb4] sm:text-base">
            Whether you know exactly what you need or are still weighing the
            possibilities, start by telling us what you want the property to do
            better.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/contact"
              className="btn-primary w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none motion-reduce:before:transition-none sm:w-auto"
            >
              <span>Request a Free Estimate</span>
            </Link>

            <Link
              href="/services"
              className="btn-outline w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none sm:w-auto"
            >
              <span>Explore Services</span>
            </Link>
          </div>
        </div>

        <div className="reveal-right min-w-0 border-t border-white/10 lg:border-t-0 lg:border-l lg:pl-10 xl:pl-14">
          <p className="mt-8 text-[10px] font-medium tracking-[0.3em] text-[#8f857d] uppercase lg:mt-0">
            A Straightforward Start
          </p>

          <ol className="mt-2 divide-y divide-white/10">
            {PROJECT_START_STEPS.map((step) => (
              <li
                key={step.number}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5 sm:py-6"
              >
                <span
                  aria-hidden="true"
                  className="font-['Cormorant_Garamond'] text-2xl leading-none font-light text-gold sm:text-3xl"
                >
                  {step.number}
                </span>

                <div className="min-w-0">
                  <h3 className="text-xs font-semibold tracking-[0.12em] text-white uppercase">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed font-light text-[#a99f98] sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}