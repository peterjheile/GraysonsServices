import Link from 'next/link';

import type { Services } from '@/features/services/types';

import ServiceBlock from './ServiceBlock';

interface ServicesGridProps {
  services: Services;
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <section
        aria-labelledby="services-unavailable-heading"
        className="bg-white px-6 py-24 text-center sm:py-28"
      >
        <h2
          id="services-unavailable-heading"
          className="font-['Cormorant_Garamond'] text-3xl font-light text-stone-darkest"
        >
          Service information is temporarily unavailable
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 font-light text-stone-mid">
          Please check back shortly, or contact us and we&apos;ll help you find
          the right service for your project.
        </p>

        <Link
          href="/contact"
          className="btn-primary mt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <span>Contact Us</span>
        </Link>
      </section>
    );
  }

  return (
    <div className="overflow-hidden">
      {services.map((service, index) => (
        <ServiceBlock
          key={service.slug}
          service={service}
          index={index + 1}
          flip={index % 2 !== 0}
        />
      ))}
    </div>
  );
}