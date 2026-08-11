'use client';

import {
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
} from 'react';

import type { ServiceNames } from '@/features/services/types';

type MarqueeStripProps = {
  services: ServiceNames;
  pixelsPerSecond?: number;
};

type MarqueeLayout = {
  sequenceCopies: number;
  durationSeconds: number;
};

const DEFAULT_PIXELS_PER_SECOND = 60;
const INITIAL_SEQUENCE_COPIES = 4;
const INITIAL_DURATION_SECONDS = 40;
const MIN_SEQUENCE_COPIES = 1;

export default function MarqueeStrip({
  services,
  pixelsPerSecond = DEFAULT_PIXELS_PER_SECOND,
}: MarqueeStripProps) {
  const containerRef = useRef<HTMLElement>(null);
  const sequenceRef = useRef<HTMLDivElement>(null);

  const [layout, setLayout] = useState<MarqueeLayout>({
    sequenceCopies: INITIAL_SEQUENCE_COPIES,
    durationSeconds: INITIAL_DURATION_SECONDS,
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const sequence = sequenceRef.current;

    if (!container || !sequence) {
      return;
    }

    const speed = Math.max(1, pixelsPerSecond);

    const updateLayout = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const sequenceWidth = sequence.getBoundingClientRect().width;

      if (containerWidth === 0 || sequenceWidth === 0) {
        return;
      }

      const sequenceCopies = Math.max(
        MIN_SEQUENCE_COPIES,
        Math.ceil(containerWidth / sequenceWidth),
      );

      const durationSeconds =
        (sequenceWidth * sequenceCopies) / speed;

      setLayout((currentLayout) => {
        if (
          currentLayout.sequenceCopies === sequenceCopies &&
          Math.abs(
            currentLayout.durationSeconds - durationSeconds,
          ) < 0.01
        ) {
          return currentLayout;
        }

        return {
          sequenceCopies,
          durationSeconds,
        };
      });
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(updateLayout);

    resizeObserver.observe(container);
    resizeObserver.observe(sequence);

    return () => resizeObserver.disconnect();
  }, [pixelsPerSecond, services]);

  if (services.length === 0) {
    return null;
  }

  return (
    <section
      ref={containerRef}
      aria-label="Services we offer"
      className="relative z-10 overflow-hidden bg-gold py-4"
    >
      <p className="sr-only">
        Services we offer:{' '}
        {services.map((service) => service.name).join(', ')}.
      </p>

      <div
        aria-hidden="true"
        className="marquee-track"
        style={{
          animationDuration: `${layout.durationSeconds}s`,
        }}
      >
        <MarqueeGroup
          services={services}
          sequenceCopies={layout.sequenceCopies}
          sequenceRef={sequenceRef}
        />

        <MarqueeGroup
          services={services}
          sequenceCopies={layout.sequenceCopies}
        />
      </div>
    </section>
  );
}

type MarqueeGroupProps = {
  services: ServiceNames;
  sequenceCopies: number;
  sequenceRef?: Ref<HTMLDivElement>;
};

function MarqueeGroup({
  services,
  sequenceCopies,
  sequenceRef,
}: MarqueeGroupProps) {
  return (
    <div className="flex shrink-0">
      {Array.from(
        { length: sequenceCopies },
        (_, copyIndex) => (
          <MarqueeSequence
            key={copyIndex}
            ref={copyIndex === 0 ? sequenceRef : undefined}
            services={services}
          />
        ),
      )}
    </div>
  );
}

type MarqueeSequenceProps = {
  ref?: Ref<HTMLDivElement>;
  services: ServiceNames;
};

function MarqueeSequence({
  ref,
  services,
}: MarqueeSequenceProps) {
  return (
    <div
      ref={ref}
      className="flex shrink-0 whitespace-nowrap"
    >
      {services.map((service) => (
        <div
          key={service.slug}
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