import {
  FiAward,
  FiMessageCircle,
  FiShield,
  FiTool,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

import type { ValueCard } from './types';

const VALUE_ICONS = {
  craftsmanship: FiTool,
  communication: FiMessageCircle,
  commitment: FiAward,
  dependable: FiShield,
} satisfies Record<ValueCard['icon'], IconType>;

type ValuesProps = {
  values: readonly ValueCard[];
};

export default function Values({ values }: ValuesProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <section
      id="values"
      aria-labelledby="values-heading"
      className="scroll-mt-24 bg-white"
    >
      <div className="mx-auto max-w-(--max-content-width) px-6 lg:px-12">
        <div className="py-24 lg:py-28">
          <header className="reveal mb-12 text-center sm:mb-16">
            <p className="text-[11px] font-medium tracking-[0.35em] text-gold uppercase">
              What Defines Us
            </p>

            <h2
              id="values-heading"
              className="mt-3 text-balance font-['Cormorant_Garamond'] text-[clamp(34px,4vw,52px)] font-light text-stone-darkest"
            >
              The Values Behind Our Work
            </h2>
          </header>

          <div className="grid gap-px border border-gold/20 bg-gold/20 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = VALUE_ICONS[value.icon];

              return (
                <div
                  key={value.title}
                  className="reveal h-full"
                  style={{
                    transitionDelay: `${index * 80}ms`,
                  }}
                >
                  <article className="group h-full bg-white p-8 text-center transition-colors duration-500 hover:bg-stone-darkest lg:p-10">
                    <div className="mb-6 flex justify-center">
                      <Icon
                        aria-hidden="true"
                        className="h-7 w-7 text-gold"
                      />
                    </div>

                    <h3 className="mb-3 font-['Cormorant_Garamond'] text-xl font-semibold text-stone-darkest transition-colors duration-500 group-hover:text-white">
                      {value.title}
                    </h3>

                    <p className="text-sm leading-relaxed font-light text-stone-mid transition-colors duration-500 group-hover:text-stone-light">
                      {value.body}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        <div aria-hidden="true" className="section-rule" />
      </div>
    </section>
  );
}