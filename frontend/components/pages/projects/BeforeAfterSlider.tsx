'use client';

import { useId, useState } from 'react';

import Image from 'next/image';

export type ComparisonImage = Readonly<{
  src: string;
  alt: string;
}>;

interface BeforeAfterSliderProps {
  before: ComparisonImage;
  after: ComparisonImage;
  beforeLabel?: string;
  afterLabel?: string;
  sizes?: string;
  className?: string;
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className = '',
}: BeforeAfterSliderProps) {
  const rangeId = useId();
  const [position, setPosition] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);

  const beforePercentage = Math.round(position);

  return (
    <div
      className={`relative overflow-hidden bg-stone-pale select-none ${className}`}
      role="group"
      aria-label={`${beforeLabel} and ${afterLabel} image comparison`}
    >
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_16px_rgba(0,0,0,0.5)]"
        style={{ left: `${position}%` }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-darkest shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
        style={{ left: `${position}%` }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >
          <path
            d="M8 11H3m0 0 2.5-2.5M3 11l2.5 2.5M14 11h5m0 0-2.5-2.5M19 11l-2.5 2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <input
        id={rangeId}
        type="range"
        min="0"
        max="100"
        step="1"
        value={position}
        aria-label={`Adjust the ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()} comparison`}
        aria-valuetext={`${beforePercentage}% ${beforeLabel.toLowerCase()} image visible`}
        onChange={(event) => {
          setPosition(Number(event.currentTarget.value));
          setHasInteracted(true);
        }}
        onPointerDown={() => setHasInteracted(true)}
        className="peer absolute inset-0 z-20 size-full touch-pan-y cursor-ew-resize opacity-0 focus-visible:outline-none"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 ring-inset peer-focus-visible:ring-2 peer-focus-visible:ring-gold"
      />

      <ComparisonLabel
        label={beforeLabel}
        className="left-4 bg-stone-darkest/80 text-white backdrop-blur-sm"
      />

      <ComparisonLabel
        label={afterLabel}
        className="right-4 bg-gold text-stone-darkest"
      />

      {!hasInteracted && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-stone-darkest/75 px-4 py-2 text-[9px] font-medium tracking-[0.18em] text-white/90 uppercase backdrop-blur-sm sm:text-[10px]"
        >
          Drag or use arrow keys
        </p>
      )}
    </div>
  );
}

function ComparisonLabel({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-4 z-10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.25em] uppercase ${className}`}
    >
      {label}
    </span>
  );
}