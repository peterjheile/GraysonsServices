'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

type ParallaxHeroProps = {
  imageUrl: string;
  className?: string;
  imageClassName?: string;
  backgroundPosition?: string;
  speed?: number;
};

export default function ParallaxHero({
  imageUrl,
  className = '',
  imageClassName = '',
  backgroundPosition = 'center',
  speed = 0.35,
}: ParallaxHeroProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    let frameId: number | null = null;

    const updatePosition = () => {
      image.style.transform = reducedMotion.matches
        ? 'none'
        : `translate3d(0, ${window.scrollY * speed}px, 0)`;

      frameId = null;
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updatePosition);
      }
    };

    updatePosition();

    window.addEventListener('scroll', handleScroll, { passive: true });
    reducedMotion.addEventListener('change', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      reducedMotion.removeEventListener('change', updatePosition);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [speed]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={imageRef}
        className="absolute inset-x-0 -top-[15%] -bottom-[15%] transform-gpu will-change-transform"
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          preload
          sizes="100vw"
          className={`object-cover ${imageClassName}`}
          style={{ objectPosition: backgroundPosition }}
        />
      </div>
    </div>
  );
}