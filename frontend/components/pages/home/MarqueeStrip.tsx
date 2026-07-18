import type { ServiceNames } from "@/features/services/types";

type MarqueeStripProps = {
  services: ServiceNames;
};

export default function MarqueeStrip({ services }: MarqueeStripProps) {
  const doubled = [...services, ...services, ...services].slice(0,12);

  return (
    <div className="relative z-10 overflow-hidden bg-gold py-4">
      <div className="marquee-track">
        <div className="flex shrink-0 whitespace-nowrap">
          {doubled.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-6 px-6"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-darkest">
                {item.name}
              </span>
              <span className="text-lg text-stone-darkest/40">◆</span>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 whitespace-nowrap" aria-hidden="true">
          {doubled.map((item, i) => (
            <div
              key={`${item}-${i}-duplicate`}
              className="flex shrink-0 items-center gap-6 px-6"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-darkest">
                {item.name}
              </span>
              <span className="text-lg text-stone-darkest/40">◆</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}