import type { CredentialCard } from './types';

type CredentialsProps = {
  readonly credentials: readonly CredentialCard[];
};

export default function Credentials({
  credentials,
}: CredentialsProps) {
  if (credentials.length === 0) {
    return null;
  }

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="scroll-mt-24 bg-white py-28 lg:pb-40"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <div className="reveal-left text-center lg:w-80 lg:shrink-0 lg:text-left">
            <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
              Trust &amp; Credentials
            </p>

            <h2
              id="credentials-heading"
              className="mt-3 font-['Cormorant_Garamond'] text-[clamp(30px,8vw,44px)] leading-tight font-light text-stone-darkest"
            >
              Licensed, Certified &amp;{' '}
              <em className="text-gold italic">
                Accountable
              </em>
            </h2>
          </div>

          <ul className="grid flex-1 gap-4 sm:grid-cols-2 lg:gap-6">
            {credentials.map((credential, index) => (
              <li
                key={`${credential.title}-${index}`}
                className="reveal h-full"
                style={{
                  transitionDelay: `${Math.min(index, 4) * 100}ms`,
                }}
              >
                <div className="flex h-full flex-col items-center gap-4 border border-stone-pale bg-white/60 p-5 text-center transition-colors duration-300 hover:border-gold/40 hover:bg-white motion-reduce:transition-none sm:p-6 lg:flex-row lg:items-start lg:text-left">
                  <div
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/50"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gold"
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}