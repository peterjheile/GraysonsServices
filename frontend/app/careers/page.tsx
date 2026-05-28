import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CareersHero from '@/components/pages/careers/CareersHero';
import CultureSection from '@/components/pages/careers/CultureSection';
import PerksGrid from '@/components/pages/careers/PerksGrid';
import GrowthPath from '@/components/pages/careers/GrowthPath';
import JobBoard from '@/components/pages/careers/JobBoard';
import CareersCTA from '@/components/pages/careers/CareersCTA';

export const metadata: Metadata = {
  title: "Careers | Grayson's Services",
  description:
    "Join the Grayson's Services team — hardscaping careers in the Greater Ohio Region. View open positions in field operations, project management, and design. Competitive pay, real growth paths, full benefits.",
};

export default function CareersPage() {
  return (
    <main className="grain">
      <Header />
      <CareersHero />
      <CultureSection />
      <PerksGrid />
      <GrowthPath />
      <JobBoard />
      <CareersCTA />
      <Footer />
    </main>
  );
}
