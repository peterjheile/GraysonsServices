export type ServicesHeroContent = Readonly<{
  imageUrl: string;
  backgroundPosition: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  exploreLabel: string;
}>;

export type ProcessSectionContent = Readonly<{
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}>;

export type ProcessStep = Readonly<{
  number: string;
  title: string;
  description: string;
}>;