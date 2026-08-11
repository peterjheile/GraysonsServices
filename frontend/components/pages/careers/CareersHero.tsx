import PageHero from '@/components/ui/page-hero';

import { CAREERS_HERO } from './constants';

export default function CareersHero() {
  return (
    <PageHero
      imageUrl={CAREERS_HERO.imageUrl}
      backgroundPosition={CAREERS_HERO.backgroundPosition}
      eyebrow={CAREERS_HERO.eyebrow}
      titleNorm={CAREERS_HERO.title}
      titleHighlight={CAREERS_HERO.highlight}
      subtitle={CAREERS_HERO.subtitle}
      explore={CAREERS_HERO.exploreLabel}
    />
  );
}