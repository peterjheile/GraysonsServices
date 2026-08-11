import Image from 'next/image';
import { FiMail, FiPhone } from 'react-icons/fi';

import { getSiteSettings } from '@/features/site-settings/api';

export default async function CareersCTA() {
  const { email, phone } = await getSiteSettings();
  const phoneHref = phone
    ? `tel:${phone.replace(/[^\d+]/g, '')}`
    : null;
  const contactMethods = [
    {
      label: 'Call Us',
      value: phone,
      href: phoneHref,
      icon: FiPhone,
    },
    {
      label: 'Email Us',
      value: email,
      href: email ? `mailto:${email}` : null,
      icon: FiMail,
    },
  ].filter(
    (
      method,
    ): method is {
      label: string;
      value: string;
      href: string;
      icon: typeof FiPhone;
    } => Boolean(method.value && method.href),
  );

  return (
    <section
      aria-labelledby="careers-cta-heading"
      className="relative overflow-hidden bg-[#faf8f5] py-16 sm:py-20 lg:py-36"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-1/2 bg-[#1a1714] lg:block"
      >
        <Image
          src="/services/Driveway1.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-l from-[#1a1714]/5 via-[#faf8f5]/10 to-[#faf8f5]" />
      </div>

      <div className="relative z-10 mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="lg:w-1/2 lg:pr-16">
          <div className="reveal-left">
            <div className="mb-7 flex items-center gap-4 sm:mb-8">
              <div aria-hidden="true" className="h-px w-8 bg-[#b8975a]" />

              <p className="text-[11px] font-medium tracking-[0.35em] text-[#b8975a] uppercase">
                Ready to Get Started?
              </p>
            </div>

            <h2
              id="careers-cta-heading"
              className="mb-7 font-['Cormorant_Garamond'] text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] font-light text-[#1a1714] sm:mb-8"
            >
              Come Build
              <br />
              <em className="text-[#b8975a] italic">With Us.</em>
            </h2>

            <p className="mb-9 max-w-md text-base leading-relaxed font-light text-[#5c5550] sm:mb-10">
              Explore our current openings and find a place where dependable
              work, practical skill, and pride in a job well done are valued.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a href="#positions" className="btn-primary justify-center">
                <span>View Open Roles</span>

                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  className="relative z-10"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 11V2M3 5l3.5-3.5L10 5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="btn-outline justify-center"
                >
                  <FiMail
                    aria-hidden="true"
                    className="relative z-10 size-3.5"
                  />
                  <span>Email Your Resume</span>
                </a>
              )}
            </div>

            {contactMethods.length > 0 && (
              <div className="mt-8 border-t border-[#1a1714]/10 pt-7">
                <p className="mb-5 text-sm leading-relaxed font-light text-[#5c5550]">
                  Questions about joining the team?
                </p>

                <address className="flex flex-col gap-4 not-italic sm:flex-row sm:flex-wrap sm:gap-x-8">
                  {contactMethods.map(
                    ({ label, value, href, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        className="group flex min-w-0 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b8975a]"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center border border-[#b8975a]/35 text-[#b8975a] transition-colors group-hover:border-[#b8975a] group-hover:bg-[#b8975a] group-hover:text-white">
                          <Icon aria-hidden="true" className="size-4" />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-[10px] font-medium tracking-[0.18em] text-[#8d837b] uppercase">
                            {label}
                          </span>
                          <span className="mt-0.5 block break-words text-sm text-[#1a1714] transition-colors group-hover:text-[#b8975a]">
                            {value}
                          </span>
                        </span>
                      </a>
                    ),
                  )}
                </address>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}