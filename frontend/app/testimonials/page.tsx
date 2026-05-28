import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TestimonialsHero from '@/components/pages/testimonials/TestimonialsHero';
import FeaturedCarousel from '@/components/pages/testimonials/FeaturedCarousel';
import PlatformRatings from '@/components/pages/testimonials/PlatformRatings';
import ReviewsGrid from '@/components/pages/testimonials/ReviewsGrid';
import TrustBar from '@/components/pages/testimonials/TrustBar';
import LeaveReview from '@/components/pages/testimonials/LeaveReview';
import TestimonialsCTA from '@/components/pages/testimonials/TestimonialsCTA';

export const metadata: Metadata = {
  title: "Client Testimonials | Grayson's Services",
  description:
    'Read 191+ verified client reviews for Grayson\'s Services — rated 4.9 stars across Google, Houzz, and Facebook. See what Ohio homeowners and developers say about our hardscaping work.',
};

export default function TestimonialsPage() {
  return (
    <main className="grain">
      <Header />
      <TestimonialsHero />
      <FeaturedCarousel />
      <PlatformRatings />
      <ReviewsGrid />
      <TrustBar />
      <LeaveReview />
      <TestimonialsCTA />
      <Footer />
    </main>
  );
}
