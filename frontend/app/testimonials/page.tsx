import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import LeaveReview from '@/components/pages/testimonials/LeaveReview';
import PlatformRatings from '@/components/pages/testimonials/PlatformRatings';
import ReviewsGrid from '@/components/pages/testimonials/ReviewsGrid';
import TestimonialsCTA from '@/components/pages/testimonials/TestimonialsCTA';
import TestimonialsHero from '@/components/pages/testimonials/TestimonialsHero';
import TrustBar from '@/components/pages/testimonials/TrustBar';
import { getReviews } from '@/features/reviews/api';
import { getCompanyStats } from '@/features/company-stats/api';

export const metadata: Metadata = {
  title: "Client Testimonials | Grayson's Services",
  description:
    "Read client reviews for Grayson's Services and learn what property owners say about our work, communication, and service.",
};

export default async function TestimonialsPage() {
  const [reviews, companyStats] = await Promise.all([
      getReviews(),
      getCompanyStats(),
    ]);

  return (
    <>
      <Header />

      <main className="grain overflow-x-clip">
        <TestimonialsHero />
        <PlatformRatings reviews={reviews} />
        <ReviewsGrid reviews={reviews} />
        <TrustBar reviews = {reviews} companyStats={companyStats} />
        <LeaveReview />
        <TestimonialsCTA />
      </main>

      <Footer />
    </>
  );
}