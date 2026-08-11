'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hamburger from 'hamburger-react';

import type { NavItem } from './view-data';

type HeaderClientProps = {
  navItems: readonly NavItem[];
  logoUrl: string | null;
  businessName: string;
  phone: string | null;
  phoneHref: string | null;
};

export default function HeaderClient({
  navItems,
  logoUrl,
  businessName,
  phone,
  phoneHref,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let animationFrame: number | null = null;
    let wasScrolled = false;

    const updateScrolledState = () => {
      animationFrame = null;

      const isScrolled = window.scrollY > 40;

      if (isScrolled !== wasScrolled) {
        wasScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };

    const handleScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateScrolledState);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia('(min-width: 80rem)');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-50
          transition-[background-color,box-shadow] duration-500
          ${
            scrolled || menuOpen
              ? 'bg-stone-dark shadow-[0_1px_0_rgba(184,151,90,0.2)]'
              : 'bg-transparent'
          }
        `}
      >
        <div className="mx-auto max-w-(--max-content-width) px-4 lg:px-6 2xl:px-10">
          <div className="flex h-16 items-center justify-between md:h-24">
            <Link
              href="/"
              className="group flex items-center"
              onClick={closeMenu}
            >
              <Image
                src={logoUrl || '/images/fallbacks/logo.png'}
                alt={`${businessName} home`}
                width={1600}
                height={413}
                sizes="(min-width: 768px) 180px, 140px"
                loading="eager"
                className="
                  h-auto w-35 transition-opacity duration-300
                  group-hover:opacity-80 md:w-45
                "
              />
            </Link>

            <div className="xl:hidden">
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

            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-5 xl:flex 2xl:gap-8"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    nav-link whitespace-nowrap text-xs font-medium
                    tracking-[0.08em] text-stone-pale/90 uppercase
                    transition-colors duration-200 hover:text-white
                    2xl:text-sm
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden shrink-0 items-center gap-6 xl:flex">
              {phone && phoneHref && (
                <a
                  href={phoneHref}
                  className="
                    hidden whitespace-nowrap text-sm font-medium
                    tracking-wide text-gold min-[1500px]:block
                  "
                >
                  {phone}
                </a>
              )}

              <Link
                href="/contact"
                className="btn-primary max-h-14 shrink-0 whitespace-nowrap text-xs"
              >
                <span>Free Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={`
          fixed inset-0 z-40 flex flex-col overflow-y-auto
          bg-stone-darkest transition-opacity duration-500 xl:hidden
          ${
            menuOpen
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      >
        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col gap-4 px-6 pt-30 pb-12"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
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
          {phone && phoneHref && (
            <a
              href={phoneHref}
              className="text-sm tracking-widest text-gold uppercase"
            >
              {phone}
            </a>
          )}

          <Link
            href="/contact"
            className="btn-primary self-start"
            onClick={closeMenu}
          >
            <span>Get a Free Quote</span>
          </Link>
        </div>
      </div>
    </>
  );
}