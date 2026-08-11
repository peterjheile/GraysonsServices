export type ProjectsHeroContent = Readonly<{
  imageUrl: string;
  backgroundPosition: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  exploreLabel: string;
}>;

export type ProjectFilter = string;

export type ProjectFilterOption = Readonly<{
  slug: string;
  name: string;
}>;