export type Testimonial = {
  id: number;
  name: string;
  initials: string;
  role: string;
  location: string;
  stars: number;
  quote: string;
  shortQuote: string;
  project: string;
  category: string;
  platform: 'Google' | 'Houzz' | 'Facebook' | 'Direct';
  date: string;
  featured: boolean;
  projectImage?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Decks',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
    {
    id: 2,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Driveways',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
    {
    id: 3,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Retaining Walls',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
    {
    id: 4,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Decks',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
    {
    id: 5,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Decks',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
    {
    id: 6,
    name: 'Featured Review Name',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Bloomington, IN',
    stars: 5,
    quote:
      "Nice Featured Quote Goes Here. It should be a lot longer. This should be a longer curated list rather than just the one on the homepage.",
    shortQuote:
      "Our descriptive short quote to summarize.",
    project: 'Project Name',
    category: 'Walkways',
    platform: 'Google',
    date: 'Month 2026',
    featured: true,
    projectImage: 'services/after.jpg',
  },
];

export const testimonialCategories = [
  'All',
  'Decks',
  'Retaining Walls',
  'Driveways',
  'Walkways',
];

export const platforms = ['All', 'Google', 'Facebook', 'Direct'];

export const platformStats = [
  { platform: 'Google', rating: 4.9, count: 87, color: '#4285F4' },
  { platform: 'Facebook', rating: 4.8, count: 41, color: '#1877F2' },
];
