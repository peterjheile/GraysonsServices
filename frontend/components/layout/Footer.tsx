import Link from 'next/link';
import {
  FiFacebook,
  FiHelpCircle,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
  FiFileText,
} from 'react-icons/fi';

import { getServiceNames } from '@/features/services/api';
import { getSiteSettings } from '@/features/site-settings/api';

import { FOOTER_SUMMARY, NAV_ITEMS } from './view-data';

export default async function Footer() {
  const [siteSettings, services] = await Promise.all([
    getSiteSettings(),
    getServiceNames(),
  ]);

  const phoneHref = siteSettings.phone
    ? `tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`
    : null;

  const socialLinks = [
    {
      label: 'Facebook',
      href: siteSettings.facebook_url,
      icon: FiFacebook,
    },
    {
      label: 'Instagram',
      href: siteSettings.instagram_url,
      icon: FiInstagram,
    },
    {
      label: 'LinkedIn',
      href: siteSettings.linkedin_url,
      icon: FiLinkedin,
    },
    {
      label: 'Google Business',
      href: siteSettings.google_business_url,
      icon: FiMapPin,
    },
  ].filter(
    (
      link,
    ): link is {
      label: string;
      href: string;
      icon: typeof FiFacebook;
    } => Boolean(link.href),
  );

  return (
    <footer className="border-t border-stone-dark bg-stone-darkest">
      <div className="mx-auto max-w-(--max-content-width) px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-80"
            >
              <span className="block font-['Cormorant_Garamond'] text-3xl font-semibold tracking-wide text-white">
                {siteSettings.business_name}
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 font-light text-stone-pale/60">
              {FOOTER_SUMMARY}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-8 flex gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="
                      flex size-10 items-center justify-center
                      border border-stone-dark text-stone-pale/60
                      transition-colors duration-200
                      hover:border-gold hover:text-gold
                    "
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          {services.length > 0 && (
            <FooterColumn title="Services">
              {services.map((service) => (
                <FooterLink
                  key={service.slug}
                  label={service.name}
                  href={`/services#${service.slug}`}
                />
              ))}

              <FooterLink label="View All Services" href="/services" />
            </FooterColumn>
          )}

          {/* Company */}
          <FooterColumn
            title="Company"
            className={services.length === 0 ? 'lg:col-start-4' : undefined}
          >
            {NAV_ITEMS.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </FooterColumn>

          {/* Contact */}
          <FooterColumn title="Contact">
            <ContactLink
              label="Ask a Question"
              href="/#contact"
              icon={FiHelpCircle}
            />

            <ContactLink
              label="Request a Quote"
              href="/contact"
              icon={FiFileText}
            />

            {siteSettings.phone && phoneHref && (
              <ContactLink
                label={siteSettings.phone}
                href={phoneHref}
                icon={FiPhone}
              />
            )}

            {siteSettings.email && (
              <ContactLink
                label={siteSettings.email}
                href={`mailto:${siteSettings.email}`}
                icon={FiMail}
              />
            )}

            {siteSettings.service_area && (
              <ContactLink
                label={siteSettings.service_area}
                icon={FiMapPin}
              />
            )}
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-dark">
        <div
          className="
            mx-auto flex max-w-(--max-content-width) flex-col
            items-center justify-between gap-3 px-4 py-5
            sm:flex-row sm:px-6 lg:px-10
          "
        >
          <p className="text-center text-[11px] tracking-wide text-stone-pale/40 sm:text-left">
            © {new Date().getFullYear()} {siteSettings.business_name}. All
            rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-[11px] text-stone-pale/40 transition-colors hover:text-stone-pale/70"
            >
              Privacy Policy
            </Link>

            <a
              href="/sitemap.xml"
              className="text-[11px] text-stone-pale/40 transition-colors hover:text-stone-pale/70"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

function FooterColumn({
  title,
  children,
  className = '',
}: FooterColumnProps) {
  return (
    <div className={className}>
      <h2 className="mb-6 text-[10px] font-medium tracking-[0.3em] text-gold uppercase">
        {title}
      </h2>

      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

type FooterLinkProps = {
  label: string;
  href: string;
};

function FooterLink({ label, href }: FooterLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="
          text-sm font-light text-stone-pale/60
          transition-colors duration-200 hover:text-white
        "
      >
        {label}
      </Link>
    </li>
  );
}

type ContactLinkProps = {
  label: string;
  href?: string;
  icon: React.ComponentType<{
    className?: string;
    'aria-hidden'?: boolean;
  }>;
};

function ContactLink({ label, href, icon: Icon }: ContactLinkProps) {
  const content = (
    <>
      <Icon aria-hidden className="mt-1 size-3.5 shrink-0 text-gold" />
      <span>{label}</span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          className="
            flex items-start gap-2.5 text-sm leading-6
            font-light text-stone-pale/60
            transition-colors duration-200 hover:text-white
          "
        >
          {content}
        </a>
      ) : (
        <span className="flex items-start gap-2.5 text-sm leading-6 font-light text-stone-pale/60">
          {content}
        </span>
      )}
    </li>
  );
}