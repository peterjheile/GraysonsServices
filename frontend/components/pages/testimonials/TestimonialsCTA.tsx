import Link from 'next/link';

export default function TestimonialsCTA() {
  return (
    <section
      aria-labelledby="testimonials-cta-heading"
      className="relative isolate overflow-hidden bg-stone-darkest py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(184,151,90,0.15),transparent_42%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-b from-transparent to-stone-darkest"
      />

      <div className="mx-auto w-full max-w-(--max-content-width) px-5 sm:px-6 lg:px-12">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium tracking-[0.35em] text-gold uppercase sm:text-[11px]">
            Start the Conversation
          </p>

          <h2
            id="testimonials-cta-heading"
            className="mt-4 font-['Cormorant_Garamond'] text-[clamp(2.25rem,7vw,4.25rem)] leading-[1.04] font-light text-white"
          >
            Ready to Plan Your
            <span className="block text-gold italic">Next Project?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-light text-stone-pale/70 sm:text-base">
            Tell us what you would like to improve, and we will help you take
            the next step with a clear, straightforward conversation.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href="/contact"
              className="btn-primary w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none motion-reduce:before:transition-none sm:w-auto"
            >
              <span>Request a Free Estimate</span>
            </Link>

            <Link
              href="/projects"
              className="btn-outline w-full justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold motion-reduce:transition-none sm:w-auto"
            >
              <span>Explore Our Work</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}