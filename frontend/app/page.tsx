import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import About from '@/components/pages/home/About';
import Contact from '@/components/pages/home/Contact';
import Credentials from '@/components/pages/home/Credentials';
import Gallery from '@/components/pages/home/Gallery';
import Hero from '@/components/pages/home/Hero';
import MarqueeStrip from '@/components/pages/home/MarqueeStrip';
import Testimonials from '@/components/pages/home/Testimonials';
import Values from '@/components/pages/home/Values';

import {
  ABOUT_US,
  ABOUT_VALUES,
  CREDENTIAL_VALUES,
} from '@/components/pages/home/constants';

import { getCompanyStats } from '@/features/company-stats/api';
import { createQuickStats } from '@/features/company-stats/utils';
import { getHomepageFeaturedProjects } from '@/features/projects/api';
import { getHomepageReviews } from '@/features/reviews/api';
import { getServiceNames } from '@/features/services/api';

export default async function HomePage() {
  const [
    companyStats,
    featuredProjects,
    serviceNames,
    homepageReviews,
  ] = await Promise.all([
    getCompanyStats(),
    getHomepageFeaturedProjects(),
    getServiceNames(),
    getHomepageReviews(),
  ]);

  const quickStats = createQuickStats(companyStats);

  return (
    <div className="grain overflow-x-clip">
      <Header />

      <main id="main-content">
        <Hero quickStats={quickStats} />

        <MarqueeStrip services={serviceNames} />

        <About
          about={ABOUT_US}
          quickStats={quickStats}
        />

        <Values values={ABOUT_VALUES} />

        <Credentials credentials={CREDENTIAL_VALUES} />

        {featuredProjects.length > 0 && (
          <Gallery projects={featuredProjects} />
        )}

        {homepageReviews.length > 0 && (
          <Testimonials testimonials={homepageReviews} />
        )}

        <Contact />
      </main>

      <Footer />
    </div>
  );
}