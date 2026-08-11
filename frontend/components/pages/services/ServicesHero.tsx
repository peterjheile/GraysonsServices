import PageHero from '@/components/ui/page-hero';

import { SERVICES_HERO } from './constants';

export default function ServicesHero() {
  return (
    <PageHero
      imageUrl={SERVICES_HERO.imageUrl}
      backgroundPosition={SERVICES_HERO.backgroundPosition}
      eyebrow={SERVICES_HERO.eyebrow}
      titleNorm={SERVICES_HERO.title}
      titleHighlight={SERVICES_HERO.highlight}
      subtitle={SERVICES_HERO.subtitle}
      explore={SERVICES_HERO.exploreLabel}
    />
  );
}