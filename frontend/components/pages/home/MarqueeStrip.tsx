const services = [
  'Stone Patios',
  'Retaining Walls',
  'driveways',
  'other service 2',
  'other service 3',
  'other service 4',
  'other service 5',
  'other service 6',
];

export default function MarqueeStrip() {
  const doubled = [...services, ...services];

  return (
    <div className="bg-[#b8975a] py-4 overflow-hidden relative z-10">
      <div className="flex marquee-track whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-6 px-6 shrink-0">
            <span className="text-[11px] tracking-[0.3em] uppercase font-semibold text-[#1a1714]">
              {item}
            </span>
            <span className="text-[#1a1714]/40 text-lg">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
