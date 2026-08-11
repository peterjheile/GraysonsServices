import type { Metadata } from 'next';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ProjectsCTA from '@/components/pages/projects/ProjectsCTA';
import ProjectsHero from '@/components/pages/projects/ProjectsHero';
import ProjectsSection from '@/components/pages/projects/ProjectsSection';

import {
  getFeaturedProjects,
  getProjects,
} from '@/features/projects/api';
import TransformationStrip from '@/components/pages/projects/TransformationStrip';

export const metadata: Metadata = {
  title: "Projects | Grayson's Services",
  description:
    "Explore completed outdoor projects from Grayson's Services, including decks, walkways, driveways, landscaping, drainage, and exterior improvements.",
};

export default async function ProjectsPage() {
  const [projects, featuredProjects] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <Header />

      <main className="grain">
        <ProjectsHero />
        <ProjectsSection
          projects={projects}
          featuredProjects={featuredProjects}
        />
        <ProjectsCTA />
      </main>

      <Footer />
    </>
  );
}