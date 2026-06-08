import { CredCard, OurStory, ValueCard } from './types';
import { FiAward, FiCheckSquare, FiShield } from 'react-icons/fi';
import RevealObserver from "./RevealObserverClient"

const ICONS = {
  award: FiAward,
  check: FiCheckSquare,
  shield: FiShield,
};

type AboutProps = {
  values: [ValueCard, ValueCard, ValueCard, ValueCard];
  story: OurStory;
  credentials: [CredCard, CredCard, CredCard, CredCard];
};

export default function About({ values, story, credentials }: AboutProps) {
  return (
    <RevealObserver>
      <section id="about" className="bg-white py-28 lg:py-40">
        <div className="max-w-(--max-content-width) mx-auto px-6 lg:px-12">

          {/* Our Story Section */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 mb-28 items-center">

            {/* Image block */}
            <div className="reveal-left relative mx-auto w-full max-w-112">
              <div
                className="w-full aspect-4/5 lg:aspect-3/4 bg-cover bg-center"
                style={{ backgroundImage: `url(${story.url})` }}
              />
                {/* Offset accent box */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gold/10 border border-gold/30 hidden lg:block" />
                {/* Floating info chip */}
                <div className="absolute -bottom-4 left-8 lg:left-0 lg:-translate-x-12 bg-stone-darkest px-6 py-5 shadow-xl">
                  <div className="font-['Cormorant_Garamond'] text-4xl text-gold font-semibold">5+</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-stone-light mt-1">Years of Excellence</div>
                </div>
            </div>

            {/* Text block */}
            <div className="reveal-right">
              <div className="gold-line" />
              <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">Our Story</span>

              <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4.5vw,60px)] font-light text-stone-darkest leading-[1.1] mt-4 mb-8">
                Our Story Header,<br />
                <em className="italic text-gold">Goes Right Here</em>
              </h2>

              <div className="space-y-5 text-stone-mid leading-relaxed text-base font-light">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-10">
                <a href="#contact" className="btn-primary">
                  <span>Meet the Team</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section rule */}
          <div className="section-rule mb-28" />


          {/* Values modules */}
          <div className="mb-28">
            <div className="text-center mb-16 reveal">
              <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">What Drives Us</span>
              <h2 className="font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-stone-darkest mt-3">
                Core Values Title Here
              </h2>
            </div>

            <div className="grid overflow-hidden border border-gold/20 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => {
                const Icon = ICONS[v.icon];

                return (
                  <div
                    key={v.title}
                    className="reveal border-b border-gold/20 p-8 lg:p-10
                      group transition-colors duration-500 hover:bg-stone-darkest
                      sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0
                      text-center
                    "
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="mb-6 flex justify-center">
                      <Icon className="h-7 w-7 text-gold" />
                    </div>

                      <h3 className="mb-3 font-['Cormorant_Garamond'] text-xl font-semibold text-stone-darkest transition-colors group-hover:text-white">
                        {v.title}
                      </h3>

                      <p className="text-sm font-light leading-relaxed text-stone-mid transition-colors group-hover:text-stone-light">
                        {v.body}
                      </p>
                  </div>
                  );
                })}
              </div>
            </div>


            {/* Section rule */}
            <div className="section-rule mb-28" />



            {/* Credentials */}
            <div className="mt-20 lg:mt-28">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
                
                <div className="reveal-left text-center lg:w-80 lg:shrink-0 lg:text-left">
                  <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">
                    Trust & Credentials
                  </span>

                  <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(30px,8vw,44px)] font-light leading-tight text-stone-darkest">
                    Licensed, Certified &{" "}
                    <em className="italic text-gold">Accountable</em>
                  </h2>
                </div>

                <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:gap-6">
                  {credentials.map((c, i) => (
                    <div
                      key={c.title}
                      className="
                        reveal
                        flex flex-col items-center text-center
                        gap-4
                        border border-stone-pale
                        bg-white/60
                        p-5 sm:p-6
                        transition-colors duration-300
                        hover:border-gold/40 hover:bg-white

                        lg:flex-row
                        lg:items-start
                        lg:text-left
                      "
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#b8975a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="text-sm font-semibold tracking-wide text-stone-darkest">
                          {c.title}
                        </div>

                        <div className="mt-1 text-xs font-light leading-relaxed text-stone-light">
                          {c.body}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealObserver>
  );
}