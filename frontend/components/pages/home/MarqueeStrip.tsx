import type { ServiceNames } from '@/features/services/types';

type MarqueeStripProps = {
  services: ServiceNames;
};

const LIST_REPETITIONS = 4;

export default function MarqueeStrip({
  services,
}: MarqueeStripProps) {
  if (services.length === 0) {
    return null;
  }

  const repeatedServices = Array.from(
    { length: LIST_REPETITIONS },
    () => services,
  ).flat();

  return (
    <div
      aria-label="Services we offer"
      className="relative z-10 overflow-hidden bg-gold py-4"
    >
      <div className="marquee-track">
        <MarqueeItems services={repeatedServices} />

        <div aria-hidden="true">
          <MarqueeItems services={repeatedServices} />
        </div>
      </div>
    </div>
  );
}

type MarqueeItemsProps = {
  services: ServiceNames;
};

function MarqueeItems({
  services,
}: MarqueeItemsProps) {
  return (
    <div className="flex shrink-0 whitespace-nowrap">
      {services.map((service, index) => (
        <div
          key={`${service.name}-${index}`}
          className="flex shrink-0 items-center gap-6 px-6"
        >
          <span className="text-[11px] font-semibold tracking-[0.3em] text-stone-darkest uppercase">
            {service.name}
          </span>

          <span
            aria-hidden="true"
            className="text-lg text-stone-darkest/40"
          >
            ◆
          </span>
        </div>
      ))}
    </div>
  );
}