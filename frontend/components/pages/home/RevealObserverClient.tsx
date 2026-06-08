// components/pages/home/RevealObserver.tsx
'use client';

import { useEffect, useRef } from 'react';

type RevealObserverProps = {
  children: React.ReactNode;
};

export default function RevealObserver({ children }: RevealObserverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 },
    );

    const els = ref.current?.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale',
    );

    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}