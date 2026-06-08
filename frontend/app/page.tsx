import Header from "@/components/layout/Header"
import Hero from '@/components/pages/home/Hero'
import MarqueeStrip from '@/components/pages/home/MarqueeStrip';
import About from '@/components/pages/home/About';
import Gallery from '@/components/pages/home/Gallery';
import Testimonials from '@/components//pages/home/Testimonials';
import Contact from '@/components/pages/home/Contact';
import Footer from '@/components/layout/Footer';

import { QUICK_STATS, MARQUEE_SERVICES, ABOUT_VALUES, OUR_STORY, CRENTIAL_VALUES } from "@/components/pages/home/data";
 
export default function Home() {
  return (
    <main className="grain h-500">
      <Header />
      <Hero quickStats = {QUICK_STATS} />
      <MarqueeStrip services={MARQUEE_SERVICES}/>
      <About 
        values = {ABOUT_VALUES}
        story = {OUR_STORY}
        credentials={CRENTIAL_VALUES}
      />
            {/*
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      */}
    </main>
  );
}
 
