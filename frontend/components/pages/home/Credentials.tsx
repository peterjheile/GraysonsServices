import RevealObserver from './RevealObserverClient';
import type { CredCard } from './view-types';

type CredentialsProps = {
  credentials: [CredCard, CredCard, CredCard, CredCard];
};

export default function Credentials({
  credentials,
}: CredentialsProps) {
  return (
    <RevealObserver>
      <section
        id="credentials"
        className="bg-white py-28 lg:pb-40"
      >
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="reveal-left text-center lg:w-80 lg:shrink-0 lg:text-left">
              <span className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
                Trust &amp; Credentials
              </span>

              <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(30px,8vw,44px)] leading-tight font-light text-stone-darkest">
                Licensed, Certified &amp;{' '}
                <em className="text-gold italic">Accountable</em>
              </h2>
            </div>

            <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:gap-6">
              {credentials.map((credential, index) => (
                <article
                  key={credential.title}
                  className="
                    reveal flex flex-col items-center gap-4
                    border border-stone-pale bg-white/60 p-5 text-center
                    transition-colors duration-300
                    hover:border-gold/40 hover:bg-white
                    sm:p-6 lg:flex-row lg:items-start lg:text-left
                  "
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50">
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
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
                    <h3 className="text-sm font-semibold tracking-wide text-stone-darkest">
                      {credential.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed font-light text-stone-light">
                      {credential.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </RevealObserver>
  );
}