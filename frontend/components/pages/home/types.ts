export type QuickStat = {
    value: string;
    label: string;
}

export type MarqueeServices = [
  string,
  string,
  string,
  string,
  ...string[]
];

export type ValueIconName = "award" | "check" | "shield";
export type ValueCard = {
  icon: ValueIconName;
  title: string;
  body: string;
};


export type CredCard = {
  title: string;
  body: string;
};


export type OurStory = {
  eyebrow: string;
  titleLineNormal: string;
  titleLineHighlight: string;
  paragraphs: string[];
  url: string;
}

export type size = 
  | 'small'
  | 'large'

export type category =
  | 'All'
  | 'Decks'
  | 'Driveways'
  | 'Retaining Walls'
  | 'Walkways';

export type Project = {
  id: number,
  title: string,
  category: category,
  location: string,
  size: size,
  img_url: string
}

export type Testimonial = {
  id: number,
  name: string,
  role: string,
  stars: number,
  quote: string,
  project: string,
  featured: boolean
}