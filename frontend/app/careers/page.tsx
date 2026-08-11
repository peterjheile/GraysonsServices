import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CareersHero from '@/components/pages/careers/CareersHero';
import CultureSection from '@/components/pages/careers/CultureSection';
import PerksGrid from '@/components/pages/careers/PerksGrid';
import JobBoard from '@/components/pages/careers/JobBoard';
import CareersCTA from '@/components/pages/careers/CareersCTA';
import { fetchJobPostings } from '@/features/careers/api';

export const metadata: Metadata = {
  title: "Careers | Grayson's Services",
  description:
    "Explore career opportunities with Grayson's Services. View current openings and learn about our hands-on team, work environment, and opportunities to grow.",
};

export default async function CareersPage() {
  const jobPostings = await fetchJobPostings().catch(() => []);

  return (
    <main className="grain overflow-x-clip">
      <Header />
      <CareersHero />
      <CultureSection />
      <JobBoard jobPostings={jobPostings} />
      <PerksGrid />
      <CareersCTA />
      <Footer />
    </main>
  );
}