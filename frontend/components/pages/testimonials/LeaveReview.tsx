const platforms = [
  /*
   * GOOGLE REVIEW CARD
   * Enable this object once the Google Business Profile is live, then replace
   * the placeholder href with the direct "Write a review" URL.
  {
    name: 'Google',
    handle: '@GraysonsServices',
    description: 'Leave a Google review',
    href: 'GOOGLE_REVIEW_URL',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  */
  {
    name: 'Facebook',
    handle: 'GraysonsServicesOH',
    description: 'Rate on Facebook',
    href: 'https://www.facebook.com/GraysonsServicesOH/reviews',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
] as const;

export default function LeaveReview() {
  return (
    <section className="bg-[#f5f1eb] py-20 lg:py-28 border-t border-[#e8e2da]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left copy */}
          <div className="reveal-left">
            <span className="text-[11px] tracking-[0.35em] uppercase text-[#b8975a] font-medium">Share Your Experience</span>
            <h2 className="font-['Cormorant_Garamond'] text-[clamp(32px,4vw,52px)] font-light text-[#1a1714] mt-3 leading-tight mb-6">
              Worked With Us?<br />
              <em className="italic text-[#b8975a]">We'd Love to Hear It.</em>
            </h2>
            <p className="text-[#5c5550] text-sm font-light leading-relaxed max-w-md mb-8">
              Your honest feedback helps other property owners understand what it is like to work with us and choose their next project partner with confidence.
            </p>
            <div className="flex items-start gap-4 py-5 px-5 sm:px-6 bg-white border border-[#e8e2da] max-w-md">
              <span className="text-[#b8975a] text-lg leading-none mt-0.5" aria-hidden="true">✦</span>
              <div>
                <div className="text-sm font-medium text-[#1a1714]">Every review makes a difference</div>
                <div className="text-xs text-[#5c5550] font-light mt-1 leading-relaxed">
                  Thank you for taking a moment to share your experience.
                </div>
              </div>
            </div>
          </div>

          {/* Platform cards */}
          <div className="reveal-right flex flex-col gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.description} (opens in a new tab)`}
                className="reveal-scale group flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-4 min-[420px]:gap-5 bg-white border border-[#e8e2da] px-5 sm:px-7 py-5 sm:py-6 hover:border-[#b8975a]/40 hover:shadow-[0_8px_32px_rgba(26,23,20,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8975a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f1eb] transition-[border-color,box-shadow] duration-300"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#faf8f5] border border-[#e8e2da] shrink-0 group-hover:border-[#b8975a]/30 transition-colors" aria-hidden="true">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-[#1a1714] tracking-wide">{p.name}</div>
                  <div className="text-[11px] text-[#a39890] mt-0.5">{p.handle}</div>
                </div>
                <div className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#b8975a] min-[420px]:ml-auto group-hover:gap-3 transition-[gap] duration-300 shrink-0">
                  <span>Review Us</span>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M1.5 6.5h10M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}