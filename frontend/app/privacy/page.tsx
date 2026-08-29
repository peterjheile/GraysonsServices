import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getSiteSettings } from '@/features/site-settings/api';

export const metadata: Metadata = {
  title: "Privacy Policy | Grayson's Services",
  description:
    "Learn how Grayson's Services collects, uses, stores, and protects information submitted through this website.",
  alternates: {
    canonical: '/privacy',
  },
};

const LAST_UPDATED = 'August 29, 2026';

export default async function PrivacyPage() {
  const siteSettings = await getSiteSettings();

  const locality = [siteSettings.city, siteSettings.state]
    .filter(Boolean)
    .join(', ');

  const addressLines = [
    siteSettings.address_line_1,
    siteSettings.address_line_2,
    [locality, siteSettings.zip_code].filter(Boolean).join(' '),
  ].filter(Boolean);

  const phoneHref = siteSettings.phone
    ? `tel:${siteSettings.phone.replace(/[^\d+]/g, '')}`
    : null;

  return (
    <div className="grain min-h-screen bg-white">
      <Header />

      <main>
        <section className="border-b border-stone-dark bg-stone-darkest px-4 pt-32 pb-16 sm:px-6 md:pt-44 md:pb-20 lg:px-10">
          <div className="mx-auto max-w-(--max-content-width)">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">
              Legal
            </p>

            <h1 className="mt-4 max-w-3xl font-['Cormorant_Garamond'] text-5xl leading-[0.95] font-light text-white sm:text-6xl lg:text-7xl">
              Privacy Policy
            </h1>

            <p className="mt-6 text-sm font-light text-stone-pale/60">
              Last updated {LAST_UPDATED}
            </p>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <article className="mx-auto max-w-4xl text-[#5c5550]">
            <p className="text-base leading-8 font-light sm:text-lg sm:leading-9">
              {siteSettings.business_name} respects your privacy. This Privacy
              Policy explains what information we collect through{' '}
              <Link
                href="/"
                className="font-medium text-[#80652f] underline decoration-gold/50 underline-offset-4 hover:text-stone-darkest"
              >
                graysonsservices.com
              </Link>{' '}
              (the “Site”), how we use and share it, and the choices available
              to you.
            </p>

            <div className="mt-14 space-y-14">
              <PolicySection number="01" title="Information We Collect">
                <p>We may collect information you choose to provide when you:</p>

                <ul>
                  <li>
                    Send a message, including your name, email address, phone
                    number, subject, and message.
                  </li>
                  <li>
                    Request an estimate, including your contact information,
                    property address, requested services, project size, budget,
                    timeline, project description, referral source, and any
                    project photos you upload.
                  </li>
                  <li>
                    Apply for a job, including your contact information, city,
                    experience, availability, pay-range response, written
                    responses, the position selected, and any résumé you upload.
                  </li>
                  <li>
                    Contact us by phone, email, social media, or another method.
                  </li>
                </ul>

                <p>
                  Our hosting, network, and security providers may also process
                  limited technical information automatically, such as your IP
                  address, browser and device type, requested pages, timestamps,
                  and security or diagnostic logs.
                </p>
              </PolicySection>

              <PolicySection number="02" title="How We Use Information">
                <p>We use information to:</p>

                <ul>
                  <li>Respond to questions and communicate with you.</li>
                  <li>
                    Review estimate requests, understand a project, schedule a
                    visit, and provide requested services.
                  </li>
                  <li>
                    Review job applications and consider applicants for current
                    or future openings when permission has been provided.
                  </li>
                  <li>
                    Operate, maintain, troubleshoot, and protect the Site and our
                    systems.
                  </li>
                  <li>
                    Keep appropriate business records, prevent misuse, enforce
                    our rights, and comply with legal obligations.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection number="03" title="Cookies and Site Technology">
                <p>
                  We do not currently use advertising cookies, behavioral
                  advertising pixels, or public-site analytics tools. The Site
                  and its service providers may use essential cookies or similar
                  technical data when needed to deliver and secure the Site.
                </p>

                <p>
                  The Site loads font files through Google Fonts. When your
                  browser requests those files, Google may receive technical
                  request information such as your IP address, browser details,
                  and the requested resource. You can control or delete cookies
                  through your browser settings, although blocking essential
                  technology may affect site operation.
                </p>
              </PolicySection>

              <PolicySection number="04" title="How We Share Information">
                <p>
                  We do not sell or rent personal information, and we do not use
                  it for targeted advertising. We may disclose information only
                  as reasonably necessary to:
                </p>

                <ul>
                  <li>
                    Service providers that support website hosting, network
                    delivery and security, database and file storage, email
                    delivery, business email, and font delivery. These may
                    include Cloudflare, DigitalOcean, Resend, Google Workspace,
                    and Google Fonts.
                  </li>
                  <li>
                    Professional advisers, insurers, contractors, or other
                    parties assisting with legitimate business operations and
                    bound by appropriate obligations.
                  </li>
                  <li>
                    Government authorities or other parties when required by
                    law, legal process, or a good-faith need to protect rights,
                    safety, property, or the integrity of our services.
                  </li>
                  <li>
                    A successor or relevant participant in a merger, sale,
                    financing, reorganization, or transfer of all or part of the
                    business, subject to applicable law.
                  </li>
                </ul>
              </PolicySection>

              <PolicySection number="05" title="Data Retention">
                <p>
                  We retain information only for as long as reasonably necessary
                  for the purposes described in this policy. Retention depends on
                  the type of record, the status of an inquiry, project, or job
                  application, whether future communication was requested, and
                  applicable accounting, insurance, dispute-resolution, and legal
                  requirements. When information is no longer needed, we may
                  delete, anonymize, or securely dispose of it.
                </p>
              </PolicySection>

              <PolicySection number="06" title="Security">
                <p>
                  We use reasonable administrative, technical, and organizational
                  safeguards designed to protect personal information. Project
                  photos and job-application résumés submitted through the Site
                  are stored separately from publicly accessible website media.
                  However, no online transmission or storage system can be
                  guaranteed completely secure.
                </p>
              </PolicySection>

              <PolicySection number="07" title="Your Choices and Rights">
                <p>
                  Depending on where you live and subject to applicable law, you
                  may be able to request access to, correction of, deletion of,
                  or a copy of personal information we hold about you. You may
                  also withdraw consent for future communications or ask us to
                  stop considering an application for future openings.
                </p>

                <p>
                  Submit a request using the contact information below. We may
                  need to verify your identity before acting on a request. If we
                  deny a request, you may appeal by contacting us again with the
                  subject “Privacy Appeal” and explaining your concern. We will
                  respond as required by applicable law.
                </p>

                <p>
                  Because we do not sell personal information or use it for
                  targeted advertising, there is no sale or targeted-advertising
                  opt-out required for our current practices.
                </p>
              </PolicySection>

              <PolicySection number="08" title="Children’s Privacy">
                <p>
                  The Site is intended for a general audience and is not directed
                  to children under 13. We do not knowingly collect personal
                  information from children under 13. If you believe a child has
                  provided personal information through the Site, please contact
                  us so we can review and, when appropriate, delete it.
                </p>
              </PolicySection>

              <PolicySection number="09" title="Third-Party Links">
                <p>
                  The Site may link to social networks, review platforms, or
                  other third-party websites. Their privacy practices are
                  governed by their own policies, and we are not responsible for
                  the content or practices of those services.
                </p>
              </PolicySection>

              <PolicySection number="10" title="Changes to This Policy">
                <p>
                  We may update this Privacy Policy when our services, technology,
                  or legal obligations change. We will post the revised policy on
                  this page and update the “Last updated” date above. Material
                  changes will be communicated when required by law.
                </p>
              </PolicySection>

              <PolicySection number="11" title="Contact Us">
                <p>
                  To ask a privacy question or submit a privacy request, contact:
                </p>

                <address className="not-italic">
                  {/* <strong className="font-medium text-stone-darkest">
                    {siteSettings.business_name}
                  </strong>

                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))} */}

                  {siteSettings.email && (
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="mt-2 block font-medium text-[#80652f] underline decoration-gold/50 underline-offset-4 hover:text-stone-darkest"
                    >
                      {siteSettings.email}
                    </a>
                  )}

                  {siteSettings.phone && phoneHref && (
                    <a
                      href={phoneHref}
                      className="mt-1 block font-medium text-[#80652f] underline decoration-gold/50 underline-offset-4 hover:text-stone-darkest"
                    >
                      {siteSettings.phone}
                    </a>
                  )}

                  <Link
                    href="/#contact"
                    className="mt-4 inline-block font-medium text-[#80652f] underline decoration-gold/50 underline-offset-4 hover:text-stone-darkest"
                  >
                    Use our contact page
                  </Link>
                </address>
              </PolicySection>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}

type PolicySectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

function PolicySection({ number, title, children }: PolicySectionProps) {
  return (
    <section aria-labelledby={`privacy-section-${number}`}>
      <div className="mb-5 flex items-center gap-4 border-b border-[#e8e2da] pb-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-gold">
          {number}
        </span>

        <h2
          id={`privacy-section-${number}`}
          className="font-['Cormorant_Garamond'] text-3xl font-semibold text-stone-darkest sm:text-4xl"
        >
          {title}
        </h2>
      </div>

      <div className="space-y-5 text-sm leading-7 font-light sm:text-base sm:leading-8 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}
