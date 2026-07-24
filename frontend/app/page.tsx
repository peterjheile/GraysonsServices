import Header from "@/components/layout/Header"
import Hero from '@/components/pages/home/Hero'
import MarqueeStrip from '@/components/pages/home/MarqueeStrip';
import Gallery from '@/components/pages/home/Gallery';
import Testimonials from '@/components//pages/home/Testimonials';
import Contact from '@/components/pages/home/Contact';
import Footer from '@/components/layout/Footer';
import About from '@/components/pages/home/About';
import Credentials from '@/components/pages/home/Credentials';
import Values from '@/components/pages/home/Values';

import { ABOUT_VALUES, ABOUT_US, CRENTIAL_VALUES } from "@/components/pages/home/view-data";

import { createQuickStats } from '@/features/company-stats/utils'

import { getCompanyStats } from '@/features/company-stats/api';
import { getServiceNames } from '@/features/services/api'
import { getHomepageProjectImages } from "@/features/projects/api";
import { getHomepageReviews } from "@/features/reviews/api";


export default async function Home() {

  const companyStats = await getCompanyStats();
  const projectImages = await getHomepageProjectImages();
  const serviceNames = await getServiceNames();
  const testimonials = await getHomepageReviews();


  const quickStats = createQuickStats(companyStats);
  

  return (
    <main className="grain overflow-x-hidden">
      <Header />
      <Hero quickStats={quickStats} />

      {serviceNames.length > 3 && (
        <MarqueeStrip services={serviceNames} />
      )}

      <About
        about={ABOUT_US}
        quickStats={quickStats}
      />

      <Values values={ABOUT_VALUES} />

      <Credentials credentials={CRENTIAL_VALUES} />

      <Gallery images={projectImages} />

      <Testimonials testimonials={testimonials} />

      <Contact />

      <Footer />
    </main>
  );
}
 
