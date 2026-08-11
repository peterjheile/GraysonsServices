import PageHero from '@/components/ui/page-hero';

import { PROJECTS_HERO } from './constants';

export default function ProjectsHero() {
  return (
    <PageHero
      imageUrl={PROJECTS_HERO.imageUrl}
      backgroundPosition={PROJECTS_HERO.backgroundPosition}
      eyebrow={PROJECTS_HERO.eyebrow}
      titleNorm={PROJECTS_HERO.title}
      titleHighlight={PROJECTS_HERO.highlight}
      subtitle={PROJECTS_HERO.subtitle}
      explore={PROJECTS_HERO.exploreLabel}
    />
  );
}