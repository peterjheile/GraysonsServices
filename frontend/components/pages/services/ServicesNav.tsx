'use client';

import { useEffect, useState } from 'react';
import RevealObserver from '../home/RevealObserverClient';

const items = [
  { id: 'decks', label: 'Wooden Decks' },
  { id: 'walls', label: 'Retaining Walls' },
  { id: 'Driveways', label: 'Driveways & Pavers' },
  { id: 'Walkways', label: 'Walkways & Steps' },
];

export default function ServicesNav() {
  const [active, setActive] = useState(items[0].id);

  return (
      <nav className="sticky top-16 md:top-23 z-30 w-full border-b border-[#e8e2da] bg-[#faf8f5]/95 backdrop-blur-sm">
        <RevealObserver>
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6">
          <div className="no-scrollbar flex gap-2 overflow-x-auto py-3 md:hidden">
            {items.map((item) => {
              const isActive = active === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActive(item.id)}
                  className={`
                    shrink-0 rounded-full border px-4 py-2.5
                    text-[10px] font-medium uppercase tracking-[0.14em]
                    transition-all duration-200
                    ${
                      isActive
                        ? 'border-gold bg-gold text-stone-darkest'
                        : 'border-stone-pale bg-[#faf8f5] text-stone-light hover:border-gold/50 hover:text-stone-darkest'
                    }
                  `}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden justify-center overflow-x-auto md:flex">
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
        </div>
      </RevealObserver>
    </nav>
  );
}