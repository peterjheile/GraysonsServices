'use client';

import { useEffect, useState } from 'react';

const items = [
  { id: 'decks', label: 'Wooden Decks' },
  { id: 'walls', label: 'Retaining Walls' },
  { id: 'Driveways', label: 'Driveways & Pavers' },
  { id: 'Walkways', label: 'Walkways & Steps' },
];

export default function ServicesNav() {
  const [active, setActive] = useState(items[0].id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection) {
          setActive(visibleSection.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-23 z-30 w-full border-b border-[#e8e2da] bg-[#faf8f5]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl justify-center overflow-x-auto px-6">
        <div className="flex items-center">
          {items.map((item) => {
            const isActive = active === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-4 text-[10px] font-medium uppercase tracking-[0.2em] transition-all duration-200 ${
                  isActive
                    ? 'border-[#b8975a] text-[#b8975a]'
                    : 'border-transparent text-[#a39890] hover:text-[#5c5550]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}