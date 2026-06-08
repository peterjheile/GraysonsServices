import RevealObserver from './RevealObserverClient';
import ContactFormClient from './ContactFormClient';

import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const contactItems = [
  {
    label: 'Email Us',
    value: 'wisnigra0@yahoo.com',
    icon: FiMail,
  },
  {
    label: 'Call Us',
    value: '(555) 123-4567',
    icon: FiPhone,
  },
  {
    label: 'Service Area',
    value: 'Southern, IN & Greater Midwest Region',
    icon: FiMapPin,
  },
];

export default function Contact() {
  return (
    <RevealObserver>
      <section id="contact" className="bg-white py-24 lg:py-40">
        <div className="mx-auto max-w-(--max-content-width) px-4 sm:px-6 lg:px-12">
          <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-24">
            <div className="reveal-left min-w-0">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold sm:tracking-[0.35em]">
                Start Today
              </span>

              <h2 className="mt-3 mb-7 font-['Cormorant_Garamond'] text-[clamp(34px,11vw,56px)] font-light leading-tight text-stone-darkest">
                Call to Action Goes
                <br />
                <em className="italic text-gold">Here</em>
              </h2>

              <p className="mb-9 max-w-md text-sm font-light leading-relaxed text-stone-mid sm:text-base">
                Short description follow by something such as: Tell us about your
                vision and we'll provide a detailed, no-obligation estimate within
                48 hours.
              </p>

              <div className="space-y-6">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-start gap-4 sm:gap-5"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-stone-pale">
                        <Icon className="h-4 w-4 text-gold" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone-light">
                          {item.label}
                        </div>

                        <div className="mt-0.5 break-words text-sm text-stone-darkest">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="reveal-right w-full min-w-0">
              <ContactFormClient />
            </div>
          </div>
        </div>
      </section>
    </RevealObserver>
  );
}