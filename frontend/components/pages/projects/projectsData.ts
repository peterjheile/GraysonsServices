export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
  duration: string;
  sqft?: string;
  tags: string[];
  summary: string;
  challenge: string;
  solution: string;
  result: string;
  materials: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  before: string;   // image URL
  after: string;    // image URL
  gallery: string[]; // additional after images
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: '1',
    slug: 'layered-retaining-wall',
    title: 'Layered Stone Retaining Wall',
    category: 'Retaining Walls',
    location: 'Bloomington, IN',
    year: 2025,
    duration: '1 weeks',
    sqft: 'xxx sqr ft',
    tags: ['stone', 'retaining walls', 'drainage'],
    summary:
      'A short parapgraph summary of what this is and why it was made. Should be a little longer than this. Really going for a "WOW" Factor here.',
    challenge:
      'A short description of the challenge should go here. Maybe it was super super densly covered in foilage, maybe the ground was really sandy, etc.',
    solution:
      'We excavated and terraced the slope into two distinct levels connected by a natural stone staircase. A French drain system was installed before any stone was set.',
    result:
      'A good description of the result, and the benefits derived (such as 365 days water protection or something)',
    materials: ['material 1 here', 'material 2 here', 'not sure if I actually want to list materials.'],
    testimonial: {
      quote: "The clients Testimonial Should go here. Every project image that is added should have a testimonial associated with it as evidence. Remember, we want WOW factor, best of the best.",
      author: 'Testimony Client Names Here',
      role: 'Bloomington, Indiana',
    },
    before: 'services/before.jpg',
    after: 'services/after.jpg',
    gallery: [
      'services/deck1.jpg',
      'services/d9.jpg',
      'services/d8.jpg',
    ],
    featured: true,
  },
];

export const categories = ['All', 'Decks', 'Retaining Walls', "Driveways", "Walkways"];
