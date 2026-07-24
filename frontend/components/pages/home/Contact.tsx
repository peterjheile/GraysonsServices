import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

import { getSiteSettings } from '@/features/site-settings/api';

import ContactFormClient from './ContactFormClient';
import RevealObserver from './RevealObserverClient';

export default async function Contact() {
  const siteSettings = await getSiteSettings();

  const email = siteSettings.email;
  const phone = siteSettings.phone;
  const serviceArea = siteSettings.service_area;

  const contactItems = [
    {
      label: 'Email Us',
      value: email,
      href: email ? `mailto:${email}` : undefined,
      icon: FiMail,
    },
    {
      label: 'Call Us',
      value: phone,
      href: phone
        ? `tel:${phone.replace(/[^\d+]/g, '')}`
        : undefined,
      icon: FiPhone,
    },
    {
      label: 'Service Area',
      value: serviceArea,
      href: undefined,
      icon: FiMapPin,
    },
  ].filter((item) => item.value);

  return (
    <RevealObserver>
      <section id="contact" className="bg-white py-24 lg:py-40">
        <div className="mx-auto max-w-(--max-content-width) px-4 sm:px-6 lg:px-12">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-24">
            <div className="reveal-left min-w-0 text-center lg:text-left">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold sm:tracking-[0.35em]">
                Get in Touch
              </span>

              <h2 className="mt-3 mb-7 font-['Cormorant_Garamond'] text-[clamp(34px,11vw,56px)] leading-tight font-light text-stone-darkest">
                We&apos;d Love to
                <br />
                <em className="italic text-gold">Hear From You</em>
              </h2>

              <p className="mx-auto mb-9 max-w-md text-sm leading-relaxed font-light text-stone-mid sm:text-base lg:mx-0">
                Have a question or want to learn more about Grayson&apos;s
                Services? Send us a message and our team will get back to you
                as soon as possible.
              </p>

              <div className="mx-auto w-fit space-y-6 text-left lg:mx-0">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-start gap-4 sm:gap-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-stone-pale">
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 text-gold"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-light">
                          {item.label}
                        </div>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-0.5 block break-words text-sm text-stone-darkest transition-colors hover:text-gold"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <div className="mt-0.5 break-words text-sm text-stone-darkest">
                            {item.value}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="reveal-right mx-auto w-full max-w-2xl min-w-0 lg:max-w-none">
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>
    </RevealObserver>
  );
}