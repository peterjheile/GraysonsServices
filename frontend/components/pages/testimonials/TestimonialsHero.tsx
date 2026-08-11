import PageHero from '@/components/ui/page-hero';

import { TESTIMONIALS_HERO } from './constants';

export default function TestimonialsHero() {
  return (
    <PageHero
      imageUrl={TESTIMONIALS_HERO.imageUrl}
      backgroundPosition={TESTIMONIALS_HERO.backgroundPosition}
      eyebrow={TESTIMONIALS_HERO.eyebrow}
      titleNorm={TESTIMONIALS_HERO.title}
      titleHighlight={TESTIMONIALS_HERO.highlight}
      subtitle={TESTIMONIALS_HERO.subtitle}
      explore={TESTIMONIALS_HERO.exploreLabel}
    />
  );
}