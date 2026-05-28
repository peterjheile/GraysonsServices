import Image from "next/image";

import { PrimaryButton } from "@/components/ui/buttons";

const navItems = [
  { name: "HOME", href: "/" },
  { name: "SERVICES", href: "/services" },
  { name: "CONTACT", href: "/contact" },
  { name: "FAQS", href: "/faqs" },
  { name: "REVIEWS", href: "/testimonies" },
  { name: "CAREERS", href: "/careers" },
];

export function Header() {
  return (
    <header className="absolute left-0 top-0 z-50 h-20 w-full px-5 md:h-24 md:px-8">
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center">

        {/* Left Logo */}
        <a href="/" className="z-10 flex items-center">
          <Image
            src="/logo.png"
            width={1600}
            height={900}
            alt="Grayson's Services Logo"
            className="h-auto w-[105px] md:w-[135px] lg:w-[150px]"
            priority
          />
        </a>

        {/* Centered Desktop Nav */}
        <nav className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border border-white/15 bg-black/15 px-2 py-2 text-[12px] font-medium tracking-[0.08em] text-white shadow-sm backdrop-blur-md lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-white/15 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile Nav */}
        <div className="ml-auto flex items-center lg:hidden">
          <PrimaryButton
            text="Menu"
            className="h-8 px-4 text-[11px] uppercase tracking-wide"
          />
        </div>

        {/* Right CTA */}
        <div className="ml-auto hidden items-center lg:flex">
          <PrimaryButton
            text="Request a Quote"
            className="h-9 px-5 text-[11px] uppercase tracking-wide"
          />
        </div>

      </div>
    </header>
  );
}