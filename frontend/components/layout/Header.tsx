import Image from "next/image";

import { PrimaryButton } from "@/components/ui/buttons";

export function Header() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full h-16 px-6 md:h-24">
      <div className="relative flex items-center justify-between w-full h-full max-w-7xl mx-auto">

        {/* Left Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            width={1600}
            height={900}
            alt="Grayson's Services Logo"
            className="w-[100px] h-[75px] md:w-[150px] md:h-[110px]"
            priority
          />
        </div>

        {/* Right Nav Mobile (placeholder) */}
        <nav className="lg:hidden flex items-center justify-center rounded-full h-6 w-16">
            <PrimaryButton text="Menu" className = "w-full h-full text-[10px]"/>
        </nav>

        {/* Right View Nav md+ */}
        <nav className="hidden items-center gap-9 text-sm font-medium tracking-wide text-white md:flex">
          <a className="transition hover:text-white/75" href="/">HOME</a>
          <a className="transition hover:text-white/75" href="/services">SERVICES</a>
          <a className="transition hover:text-white/75" href="/contact">CONTACT</a>
          <a className="transition hover:text-white/75" href="/faqs">FAQS</a>
          <a className="transition hover:text-white/75" href="/testimonies">TESTIMONIES</a>
          <a className="transition hover:text-white/75" href="/careers">CAREERS</a>
        </nav>

      </div>
    </header>
  );
}

