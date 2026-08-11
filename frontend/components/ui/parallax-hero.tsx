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

const MAX_PARALLAX_SPEED = 0.5;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function ParallaxHero({
  imageUrl,
  className = '',
  imageClassName = '',
  backgroundPosition = 'center',
  speed = 0.35,
}: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const normalizedSpeed = clamp(
    speed,
    0,
    MAX_PARALLAX_SPEED,
  );

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    let frameId: number | null = null;
    let isNearViewport = true;

    const updatePosition = () => {
      frameId = null;

      if (reducedMotion.matches || normalizedSpeed === 0) {
        image.style.transform = 'none';
        return;
      }

      const bounds = container.getBoundingClientRect();

      if (bounds.height === 0) return;

      const progress = clamp(
        -bounds.top / bounds.height,
        0,
        1,
      );

      const offset =
        (progress - 0.5) *
        bounds.height *
        normalizedSpeed;

      image.style.transform =
        `translate3d(0, ${offset}px, 0)`;
    };

    const scheduleUpdate = () => {
      if (!isNearViewport || frameId !== null) return;

      frameId = window.requestAnimationFrame(updatePosition);
    };

    const handleMotionPreferenceChange = () => {
      scheduleUpdate();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry?.isIntersecting ?? false;

        if (isNearViewport) {
          scheduleUpdate();
        }
      },
      { rootMargin: '100px 0px' },
    );

    const resizeObserver = new ResizeObserver(scheduleUpdate);

    updatePosition();
    intersectionObserver.observe(container);
    resizeObserver.observe(container);

    window.addEventListener('scroll', scheduleUpdate, {
      passive: true,
    });

    reducedMotion.addEventListener(
      'change',
      handleMotionPreferenceChange,
    );

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);

      reducedMotion.removeEventListener(
        'change',
        handleMotionPreferenceChange,
      );

      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [normalizedSpeed]);

  const overscan = normalizedSpeed * 50;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={imageRef}
        className="absolute inset-x-0 transform-gpu will-change-transform"
        style={{
          top: `-${overscan}%`,
          bottom: `-${overscan}%`,
        }}
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