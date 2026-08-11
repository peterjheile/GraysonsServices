type CareerPerk = {
  title: string;
  description: string;
};

/*
 * Keep this list empty until the owner confirms the benefits that can be
 * advertised. Adding the first confirmed item automatically enables the
 * section; no page-level change is required.
 */
const CAREER_PERKS: readonly CareerPerk[] = [];

export default function PerksGrid() {
  if (CAREER_PERKS.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="perks-heading"
      className="bg-[#f5f1eb] py-24 sm:py-28 lg:py-36"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="mb-14 grid items-end gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-24">
          <div className="reveal-left">
            <div className="mb-6 flex items-center gap-4">
              <div aria-hidden="true" className="h-px w-8 bg-[#b8975a]" />

              <p className="text-[11px] font-medium tracking-[0.35em] text-[#b8975a] uppercase">
                Why Grayson&apos;s
              </p>
            </div>

            <h2
              id="perks-heading"
              className="font-['Cormorant_Garamond'] text-[clamp(2.125rem,4vw,3.5rem)] leading-[1.1] font-light text-[#1a1714]"
            >
              What You Get
              <br />
              <em className="text-[#b8975a] italic">When You Join Us</em>
            </h2>
          </div>

          <p className="reveal max-w-md text-sm leading-relaxed font-light text-[#5c5550]">
            A straightforward look at the benefits available to members of the
            Grayson&apos;s Services team.
          </p>
        </div>

        <div className="grid gap-px bg-[#e8e2da] sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_PERKS.map((perk, index) => (
            <article
              key={perk.title}
              className="reveal-scale group bg-[#f5f1eb] p-8 transition-colors duration-500 hover:bg-[#1a1714] motion-reduce:transition-none lg:p-10"
              style={{ transitionDelay: `${Math.min(index, 5) * 60}ms` }}
            >
              <div
                aria-hidden="true"
                className="mb-7 flex h-12 w-12 items-center justify-center border border-[#e8e2da] text-[#b8975a] transition-colors duration-500 group-hover:border-[#b8975a]/30 motion-reduce:transition-none"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="m5 10 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="mb-3 font-['Cormorant_Garamond'] text-xl font-semibold text-[#1a1714] transition-colors duration-500 group-hover:text-[#faf8f5] motion-reduce:transition-none">
                {perk.title}
              </h3>

              <p className="text-sm leading-relaxed font-light text-[#5c5550] transition-colors duration-500 group-hover:text-[#b9aca2] motion-reduce:transition-none">
                {perk.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}