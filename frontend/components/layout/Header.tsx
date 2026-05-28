'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";

const navLinks = [
  { label: 'About', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
  { label: 'Careers', href: '/careers' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1a1714]/95 backdrop-blur-md shadow-[0_1px_0_rgba(184,151,90,0.2)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">

<Link
  href="/"
  className="group flex items-center"
>
  <Image
    src="/logo.png"
    alt="Grayson's Services"
    width={1600}
    height={413}
    priority
    className="
      h-auto w-[140px] lg:w-[180px]
      transition-opacity duration-300
      group-hover:opacity-80
    "
  />
</Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link text-sm tracking-[0.08em] uppercase font-medium text-[#e8e2da]/80 hover:text-[#faf8f5] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="tel:+15551234567" className="text-sm text-[#b8975a] tracking-wide font-medium hover:text-[#d4b47a] transition-colors">
                (812) 369-0711
              </a>
              <a href="#contact" className="btn-primary text-xs">
                <span>Free Quote</span>
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden flex flex-col gap-[5px] p-2 group"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-[1.5px] bg-[#faf8f5] transition-all duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-[#faf8f5] transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-[1.5px] bg-[#faf8f5] transition-all duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#1a1714] flex flex-col transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col justify-center px-8 pt-28 pb-12 gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-['Cormorant_Garamond'] text-5xl font-light text-[#faf8f5] hover:text-[#b8975a] transition-colors duration-300 border-b border-[#2d2926] pb-4"
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="px-8 pb-12 flex flex-col gap-4">
          <a href="tel:+15551234567" className="text-[#b8975a] tracking-widest text-sm uppercase">
            (555) 123-4567
          </a>
          <a href="#contact" className="btn-primary self-start" onClick={() => setMenuOpen(false)}>
            <span>Get a Free Quote</span>
          </a>
        </div>
      </div>
    </>
  );
}
