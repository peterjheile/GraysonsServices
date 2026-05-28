import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectsHero from '@/components/pages/projects/ProjectsHero';
import ProjectsGrid from '@/components/pages/projects/ProjectsGrid';
import TransformationStrip from '@/components/pages/projects/TransformationStrip';
import ProjectsCTA from '@/components/pages/projects/ProjectsCTA';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Our Projects | Grayson's Services",
  description:
    'Browse 500+ completed hardscaping projects — patios, retaining walls, outdoor kitchens, driveways, and more. See before and after comparisons across the Greater Ohio Region.',
};

export default function ProjectsPage() {
  return (
    <main className="grain">
      <Header />
      <ProjectsHero />
      <ProjectsGrid />
      <TransformationStrip />
      <ProjectsCTA />
      <Footer />
    </main>
  );
}
