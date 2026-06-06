import Header from "@/components/layout/Header"
import Hero from '@/components/pages/home/Hero'
import MarqueeStrip from '@/components/pages/home/MarqueeStrip';
import About from '@/components/pages/home/About';
import Gallery from '@/components/pages/home/Gallery';
import Testimonials from '@/components//pages/home/Testimonials';
import Contact from '@/components/pages/home/Contact';
import Footer from '@/components/layout/Footer';
 
export default function Home() {
  return (
    <main className="grain h-500">
      <Header />
      <Hero />
      {/* <MarqueeStrip />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer /> */}
    </main>
  );
}
 
