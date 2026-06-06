'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";

import type { NavItem } from "./types";

import Hamburger from 'hamburger-react'





type HeaderClientProps = {
    navItems: NavItem[];
}


export default function HeaderClient({navItems}: HeaderClientProps){
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect( () => {
      const onScroll = () => {
          setScrolled (window.scrollY > 40);
      }
      window.addEventListener('scroll', onScroll, {passive: true});
      return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  




  return (
    <>
      <header
          className = {`
              fixed top-0 left-0 right-0 z-50 transition-all duration-500
              ${scrolled || menuOpen
                  ?'bg-stone-dark backdrop-blur-md shadow-[0_1px_0_rgba(184,151,90,0.2)]'
                  : 'bg-transparent'
              }
          `}
      >

          <div className = {`
              max-w-(--max-content-width) min-w-(--min-content-width)
              mx-auto px-4 

              lg:px-10
          `}>
          

            <div className={`
              flex items-center justify-between 
              h-16 
              md:h-24
            `}>
              
              <Link href = "/" className = "group flex items-center">
                <Image
                  src = "/logo.png"
                  alt = "Grayson's Services Logo"
                  width={1600}
                  height={413}
                  priority
                  className={`
                    h-auto w-[140px] md:w-[180px]
                    transition-opacity duration-300
                    group-hover:opacity-80
                  `}/>
              </Link>


              {/* Mobile Hamburger */}
              <div className = "lg:hidden">
                <Hamburger
                  toggled={menuOpen}
                  toggle={setMenuOpen}
                  rounded
                  color="var(--color-white)"
                  label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-10 px-5">
                {navItems.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="nav-link text-sm tracking-[0.08em] uppercase font-medium text-stone-pale/90 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>


              {/* CTA */}
              <div className="hidden lg:flex items-center gap-8">
                <a href="tel:+18123690711" className="hidden min-[1275px]:block text-sm text-gold tracking-wide font-medium hover:text-gold transition-colors">
                  (812) 369-0711
                </a>
                <a href="/contact" className="btn-primary max-h-14 text-xs">
                  <span>Free Quote</span>
                </a>
              </div>
            </div>
          </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      <div className = {`
          fixed inset-0 z-40 bg-stone-darkest flex flex-col transition-all duration-500
          overflow-y-auto

        ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }
      `}>
          
        <div className="flex-1 flex flex-col px-6 pt-30 pb-12 gap-4">
          {navItems.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-['Cormorant_Garamond'] text-4xl font-light text-white hover:text-gold transition-colors duration-300 border-b border-stone-dark pb-4"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="px-8 pb-12 flex flex-col gap-4">
          <a href="tel:+1369-0711" className="text-gold tracking-widest text-sm uppercase">
            (812) 369-0711
          </a>
          <a href="#contact" className="btn-primary self-start" onClick={() => setMenuOpen(false)}>
            <span>Get a Free Quote</span>
          </a>
        </div>

      </div>
    </>
  )
}