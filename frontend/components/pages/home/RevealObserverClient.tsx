'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type RevealObserverProps = {
  children: ReactNode;
};

const REVEAL_SELECTOR =
  '.reveal, .reveal-left, .reveal-right, .reveal-scale';

export default function RevealObserver({
  children,
}: RevealObserverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const elements = container.querySelectorAll(REVEAL_SELECTOR);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}