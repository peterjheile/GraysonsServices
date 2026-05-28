'use client';

import { useEffect, useRef } from 'react';

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={ref} className="bg-[#faf8f5] py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: copy */}
          <div className="reveal-left">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Start Today</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(36px,4vw,56px)] font-light text-[#1a1714] mt-3 leading-tight mb-8">
              Call to Action Goes<br />
              <em className="italic text-[#b8975a]">Here</em>
            </h2>

            <p className="text-[#5c5550] text-base font-light leading-relaxed mb-10 max-w-md">
              Short description follow by something such as: Tell us about your vision and we'll provide a detailed, no-obligation estimate within 48 hours.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 3h12a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#b8975a" strokeWidth="1.3"/>
                      <path d="M2 4l7 5.5L16 4" stroke="#b8975a" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  ),
                  label: 'Email Us',
                  value: 'wisnigra0@yahoo.com',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3.5 2h3l1.5 4-2 1.5a11 11 0 004.5 4.5L12 10l4 1.5V15a1 1 0 01-1 1C7 16 2 11 2 4a1 1 0 011-1.5h.5z" stroke="#b8975a" strokeWidth="1.3" strokeLinejoin="round"/>
                    </svg>
                  ),
                  label: 'Call Us',
                  value: '(555) 123-4567',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 2a5 5 0 015 5c0 4-5 9-5 9S4 11 4 7a5 5 0 015-5z" stroke="#b8975a" strokeWidth="1.3"/>
                      <circle cx="9" cy="7" r="2" stroke="#b8975a" strokeWidth="1.3"/>
                    </svg>
                  ),
                  label: 'Service Area',
                  value: 'Southern, IN & Greater Midwest Region',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-5">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center border border-[#e8e2da]">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.2em] uppercase text-[#a39890] font-medium">{item.label}</div>
                    <div className="text-[#1a1714] text-sm mt-0.5">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="reveal-right">
            <div className="bg-[#1a1714] p-8 lg:p-12">
              <h3 className="font-['Cormorant_Garamond'] text-2xl font-medium text-[#faf8f5] mb-8">
                Request a Free Estimate
              </h3>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {['First Name', 'Last Name'].map((f) => (
                    <div key={f} className="flex flex-col gap-2">
                      <label className="text-[10px] tracking-[0.2em] uppercase text-[#a39890]">{f}</label>
                      <input
                        type="text"
                        className="bg-[#2d2926] border border-[#3d3632] text-[#faf8f5] text-sm px-4 py-3 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#5c5550]"
                        placeholder={f}
                      />
                    </div>
                  ))}
                </div>

                {[
                  { label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Phone Number', type: 'tel', placeholder: '(555) 000-0000' },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-[#a39890]">{f.label}</label>
                    <input
                      type={f.type}
                      className="bg-[#2d2926] border border-[#3d3632] text-[#faf8f5] text-sm px-4 py-3 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#5c5550]"
                      placeholder={f.placeholder}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#a39890]">Service Type</label>
                  <select className="bg-[#2d2926] border border-[#3d3632] text-[#a39890] text-sm px-4 py-3 outline-none focus:border-[#b8975a] transition-colors duration-200 appearance-none cursor-pointer">
                    <option>Select a service...</option>
                    <option>Patio Installation</option>
                    <option>Retaining Wall</option>
                    <option>Driveway Pavers</option>
                    <option>Outdoor Kitchen / Fire Feature</option>
                    <option>Walkway / Steps</option>
                    <option>Commercial Project</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#a39890]">Project Details</label>
                  <textarea
                    rows={4}
                    className="bg-[#2d2926] border border-[#3d3632] text-[#faf8f5] text-sm px-4 py-3 outline-none focus:border-[#b8975a] transition-colors duration-200 placeholder:text-[#5c5550] resize-none"
                    placeholder="Tell us about your project, timeline, and any specific requirements..."
                  />
                </div>

                <button
                  type="button"
                  className="btn-primary w-full justify-center mt-2"
                >
                  <span>Submit Request</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="relative z-10">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <p className="text-[10px] text-[#5c5550] text-center leading-relaxed">
                  We respond within 24–48 business hours. No spam, no pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
