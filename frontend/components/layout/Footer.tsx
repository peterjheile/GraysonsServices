const footerLinks = {
  Services: ['Stone Patios', 'Retaining Walls', 'Outdoor Kitchens', 'Fire Features', 'Driveway Pavers', 'Walkways & Steps'],
  Company: ['About Us', 'Our Team', 'Portfolio', 'Testimonials', 'Blog', 'Careers'],
  Contact: ['Get a Quote', '(555) 123-4567', 'hello@graysonsservices.com', 'Greater Ohio Region'],
};

export default function Footer() {
  return (
    <footer className="bg-[#1a1714] border-t border-[#2d2926]">

      {/* Main footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#faf8f5] tracking-wide">
                Grayson's
              </div>
              <div className="text-[10px] tracking-[0.35em] uppercase text-[#b8975a] font-medium mt-0.5">
                Services
              </div>
            </div>

            <p className="text-[#5c5550] text-sm leading-relaxed font-light mb-8 max-w-xs">
              Premium hardscaping built to last — for homeowners and developers who demand the very best in craftsmanship and design.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {['FB', 'IG', 'HZ', 'LI'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 border border-[#2d2926] flex items-center justify-center text-[10px] font-semibold tracking-wide text-[#5c5550] hover:border-[#b8975a] hover:text-[#b8975a] transition-all duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-[#b8975a] font-medium mb-6">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#5c5550] hover:text-[#a39890] transition-colors duration-200 font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2d2926]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#3d3632] tracking-wide">
            © {new Date().getFullYear()} Grayson's Services. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link) => (
              <a key={link} href="#" className="text-[11px] text-[#3d3632] hover:text-[#5c5550] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
