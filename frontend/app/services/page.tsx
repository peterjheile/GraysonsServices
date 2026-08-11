import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProcessSection from '@/components/pages/services/ProcessSection';
import ServicesGrid from '@/components/pages/services/ServicesGrid';
import ServicesHero from '@/components/pages/services/ServicesHero';
import ServicesNav from '@/components/pages/services/ServicesNav';

import { getServices } from '@/features/services/api';

export default async function ServicesPage() {
  const services = await getServices();

  const serviceNavItems = services.map(({ name, slug }) => ({
    name,
    slug,
  }));

  return (
    <>
      <Header />

      <main className="grain">
        <ServicesHero />

        <div>
          {services.length > 0 && (
            <ServicesNav services={serviceNavItems} />
          )}

          <ServicesGrid services={services} />
        </div>
        <ProcessSection />
      </main>

      <Footer />
    </>
  );
}