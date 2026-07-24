import {
  FiAward,
  FiMessageCircle,
  FiShield,
  FiTool,
} from 'react-icons/fi';

import RevealObserver from './RevealObserverClient';
import type { ValueCard } from './view-types';

const ICONS = {
  craftsmanship: FiTool,
  communication: FiMessageCircle,
  commitment: FiAward,
  dependable: FiShield,
};

type ValuesProps = {
  values: [ValueCard, ValueCard, ValueCard, ValueCard];
};

export default function Values({ values }: ValuesProps) {
  return (
    <RevealObserver>
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
          <div className="py-28">
            <div className="reveal mb-16 text-center">
              <span className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
                What Defines Us
              </span>

              <h2 className="mt-3 font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-stone-darkest">
                The Values Behind Our Work
              </h2>
            </div>

            <div className="grid overflow-hidden border border-gold/20 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = ICONS[value.icon];

                return (
                  <article
                    key={value.title}
                    className={`
                      group reveal p-8 text-center
                      transition-colors duration-500 hover:bg-stone-darkest
                      lg:border-r lg:p-10 lg:last:border-r-0
                      ${index < 3 ? 'border-b border-gold/20' : ''}
                      ${
                        index < 2
                          ? 'sm:border-b sm:border-gold/20'
                          : 'sm:border-b-0'
                      }
                      ${index % 2 === 0 ? 'sm:border-r sm:border-gold/20' : ''}
                      lg:border-b-0
                    `}
                    style={{
                      transitionDelay: `${index * 80}ms`,
                    }}
                  >
                    <div className="mb-6 flex justify-center">
                      <Icon
                        aria-hidden="true"
                        className="h-7 w-7 text-gold"
                      />
                    </div>

                    <h3 className="mb-3 font-['Cormorant_Garamond'] text-xl font-semibold text-stone-darkest transition-colors group-hover:text-white">
                      {value.title}
                    </h3>

                    <p className="text-sm leading-relaxed font-light text-stone-mid transition-colors group-hover:text-stone-light">
                      {value.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div aria-hidden="true" className="section-rule" />
        </div>
      </section>
    </RevealObserver>
  );
}