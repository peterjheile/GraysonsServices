import Header from "@/components/layout/Header"
import Hero from '@/components/pages/home/Hero'
import MarqueeStrip from '@/components/pages/home/MarqueeStrip';
import About from '@/components/pages/home/About';
import Gallery from '@/components/pages/home/Gallery';
import Testimonials from '@/components//pages/home/Testimonials';
import Contact from '@/components/pages/home/Contact';
import Footer from '@/components/layout/Footer';

import { ABOUT_VALUES, ABOUT_US, CRENTIAL_VALUES, TESTIMONIALS } from "@/components/pages/home/view-data";

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
      <Hero quickStats = {quickStats} />

      {serviceNames.length > 3 && (
        <MarqueeStrip services={serviceNames} />
      )}


      <About 
        values = {ABOUT_VALUES}
        about = {ABOUT_US}
        credentials={CRENTIAL_VALUES}
        quickStats = {quickStats}
      />

      <Gallery images={projectImages} />

      
      <Testimonials testimonials = {testimonials}/>
      <Contact />
      <Footer />
     
    </main>
  );
}
 
