'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hamburger from 'hamburger-react';

import type { NavItem } from './view-types';

type HeaderClientProps = {
  navItems: NavItem[];
  logoUrl: string | null;
};

export default function HeaderClient({
  navItems,
  logoUrl,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 left-0 z-50
          transition-all duration-500
          ${
            scrolled || menuOpen
              ? 'bg-stone-dark shadow-[0_1px_0_rgba(184,151,90,0.2)] backdrop-blur-md'
              : 'bg-transparent'
          }
        `}
      >
        <div
          className={`
            max-w-(--max-content-width) min-w-(--min-content-width)
            mx-auto px-4
            lg:px-10
          `}
        >
          <div
            className={`
              flex h-16 items-center justify-between
              md:h-24
            `}
          >
            <Link href="/" className="group flex items-center">
              <Image
                src={logoUrl ?? '/images/fallbacks/logo.png'}
                alt="Grayson's Services logo"
                width={1600}
                height={413}
                priority
                className={`
                  h-auto w-35
                  transition-opacity duration-300
                  group-hover:opacity-80
                  md:w-45
                `}
              />
            </Link>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <Hamburger
                toggled={menuOpen}
                toggle={setMenuOpen}
                rounded
                color="var(--color-white)"
                label={
                  menuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-10 px-5 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="
                    nav-link text-stone-pale/90 text-sm font-medium
                    tracking-[0.08em] uppercase
                    transition-colors duration-200 hover:text-white
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-8 lg:flex">
              <a
                href="tel:+18123690711"
                className="
                  hidden text-sm font-medium tracking-wide text-gold
                  transition-colors hover:text-gold
                  min-[1275px]:block
                "
              >
                (812) 369-0711
              </a>

              <Link href="/contact" className="btn-primary max-h-14 text-xs">
                <span>Free Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 flex flex-col overflow-y-auto
          bg-stone-darkest transition-all duration-500
          ${
            menuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      >
        <nav className="flex flex-1 flex-col gap-4 px-6 pt-30 pb-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="
                border-b border-stone-dark pb-4
                font-['Cormorant_Garamond'] text-4xl font-light text-white
                transition-colors duration-300 hover:text-gold
              "
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4 px-8 pb-12">
          <a
            href="tel:+18123690711"
            className="text-sm tracking-widest text-gold uppercase"
          >
            (812) 369-0711
          </a>

          <Link
            href="/contact"
            className="btn-primary self-start"
            onClick={() => setMenuOpen(false)}
          >
            <span>Get a Free Quote</span>
          </Link>
        </div>
      </div>
    </>
  );
}