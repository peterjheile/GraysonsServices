'use client';

import { useEffect, useRef } from 'react';
import RevealObserver from '../home/RevealObserverClient';
import ParallaxHero from '@/components/ui/parallax-hero';

export default function ServicesHero() {

  return (
    <RevealObserver>
      <section className="relative h-[72vh] min-h-[560px] max-h-[820px] overflow-hidden flex items-end bg-[#1a1714]">
        
        {/* HeroImage + Overlays */}
        <ParallaxHero imageUrl='/ServiceHero.jpg'/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714] via-[#1a1714]/60 to-[#1a1714]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/70 via-transparent to-transparent" />



        {/* Main Content */}
        <div className="relative z-10 w-full max-w-(--max-content-width) mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          {/* Eyebrow */}
          <div
            className="mb-4"
            style={{ animation: 'hero-word-in 0.8s 0.1s both' }}
          >
            <span className="text-[11px] tracking-[0.35em] uppercase text-gold font-medium">
              Services
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Cormorant_Garamond'] font-light text-[#faf8f5] leading-[0.95] mb-8 max-w-4xl">
            <div className="overflow-hidden">
              <span
                className="inline-block text-[clamp(48px,7vw,108px)]"
                style={{ animation: 'hero-word-in 1.1s 0.25s both' }}
              >
                What We
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                className="inline-block text-[clamp(48px,7vw,108px)] italic text-[#b8975a]"
                style={{ animation: 'hero-word-in 1.1s 0.45s both' }}
              >
                Build
              </span>
            </div>
          </h1>

          <p
            className="text-[#a39890] text-base lg:text-lg font-light max-w-lg leading-relaxed"
            style={{ animation: 'hero-word-in 1s 0.7s both' }}
          >
            Every service we offer is backed by 15+ years of mastery, premium materials, and a crew that treats your property like their own.
          </p>
        </div>

        {/* Bottom-right label */}
        <div
          className="absolute bottom-8 right-12 hidden lg:flex items-center gap-4"
          style={{ animation: 'hero-word-in 1s 1s both' }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#5c5550]">Scroll to explore</span>
          <div className="w-8 h-[1px] bg-[#b8975a]" />
        </div>
      </section>
    </RevealObserver>
  );
}
