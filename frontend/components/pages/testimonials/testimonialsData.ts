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
    name: 'Margaret & Tom Hollis',
    initials: 'MH',
    role: 'Homeowners',
    location: 'Greenfield, OH',
    stars: 5,
    quote:
      "Grayson's transformed our backyard into something we genuinely didn't think was possible at our budget. The attention to detail — every stone laid perfectly, every joint cleaned, every edge sealed — is something neighbors still comment on two years later. We had three quotes before choosing them and it was the clearest decision we've ever made.",
    shortQuote:
      "Every stone laid perfectly. Neighbors still comment on it two years later.",
    project: 'Bluestone Patio & Outdoor Kitchen',
    category: 'Patios',
    platform: 'Google',
    date: 'March 2024',
    featured: true,
    projectImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=700&q=80',
  },
  {
    id: 2,
    name: 'Derek Avery',
    initials: 'DA',
    role: 'Property Developer',
    location: 'Westlake, OH',
    stars: 5,
    quote:
      "We've used Grayson's on three commercial developments now. Their ability to hit deadlines without compromising quality is genuinely rare in this trade. When you're coordinating seven subcontractors on a phased build, you need a hardscape crew that shows up, communicates, and delivers. That's them. They're our first call every single time.",
    shortQuote:
      "Their ability to hit deadlines without compromising quality is rare in this trade.",
    project: 'Pinehurst Commons Plaza — Multi-Unit Entry Pavers',
    category: 'Commercial',
    platform: 'Direct',
    date: 'January 2024',
    featured: true,
    projectImage: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=700&q=80',
  },
  {
    id: 3,
    name: 'Sandra Okonkwo',
    initials: 'SO',
    role: 'Homeowner',
    location: 'Cedar Falls, OH',
    stars: 5,
    quote:
      'The retaining wall they built not only solved our drainage nightmare — it genuinely looks incredible. We went from a muddy, unusable slope to three flat usable terraces with a beautiful dry-stack stone wall connecting them. The crew was professional, the site was cleaned up every day, and they finished two days ahead of schedule. I cannot recommend them enough.',
    shortQuote:
      'From a muddy slope to three beautiful usable terraces. Finished two days early.',
    project: 'Ridgeline Tiered Retaining Wall System',
    category: 'Retaining Walls',
    platform: 'Houzz',
    date: 'November 2023',
    featured: false,
    projectImage: 'https://images.unsplash.com/photo-1591588582259-e675bd2e6088?w=700&q=80',
  },
  {
    id: 4,
    name: 'James & Carol Whitmore',
    initials: 'JW',
    role: 'Homeowners',
    location: 'Oakmont, OH',
    stars: 5,
    quote:
      "From the consultation to the final walkthrough, Grayson's made the whole process effortless. The fire pit area they designed has become the undisputed centerpiece of our summers. We're out there almost every evening. The design they proposed was actually better than what we came in asking for — and it cost less. Worth every penny and then some.",
    shortQuote:
      "The design they proposed was better than what we asked for — and it cost less.",
    project: 'Creekside Natural Stone Fire Lounge',
    category: 'Fire Features',
    platform: 'Google',
    date: 'September 2023',
    featured: false,
    projectImage: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=700&q=80',
  },
  {
    id: 5,
    name: 'Patricia Nguyen',
    initials: 'PN',
    role: 'Homeowner',
    location: 'Lakeview, OH',
    stars: 5,
    quote:
      "I was nervous about having such a large project done — a full pool deck replacement — but the team put me at ease from day one. They were transparent about every decision, kept me updated daily, and the travertine result is absolutely stunning. Our pool area went from embarrassing to the nicest thing about our home. I've already referred three neighbors.",
    shortQuote:
      "Our pool area went from embarrassing to the nicest thing about our home.",
    project: 'Harborview Travertine Pool Deck',
    category: 'Patios',
    platform: 'Houzz',
    date: 'August 2023',
    featured: true,
    projectImage: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=700&q=80',
  },
  {
    id: 6,
    name: 'Robert & Anne Fitzgerald',
    initials: 'RF',
    role: 'Homeowners',
    location: 'Briar Hill, OH',
    stars: 5,
    quote:
      "The front walkway Grayson's installed transformed our home's curb appeal overnight. We'd been meaning to replace the old concrete for years and kept putting it off. The natural flagstone path they designed — curved, with those beautiful moss joints — looks like it's always been there. The whole street looks better. Our house finally matches the garden.",
    shortQuote:
      "Looks like it's always been there. The whole street looks better.",
    project: 'Kensington Entry Walkway & Steps',
    category: 'Walkways',
    platform: 'Facebook',
    date: 'June 2024',
    featured: false,
  },
  {
    id: 7,
    name: 'Marcus Webb',
    initials: 'MW',
    role: 'Homeowner',
    location: 'Greenfield, OH',
    stars: 5,
    quote:
      "Hired Grayson's for our driveway after seeing their work at a neighbor's house. The herringbone paver pattern with the contrasting border is something I get compliments on constantly. The install was incredibly clean — they protected my lawn, cleaned up completely every day, and the finished product is flawless. This is the kind of craftsmanship you don't find easily.",
    shortQuote:
      "I get compliments on the driveway constantly. Craftsmanship you don't find easily.",
    project: 'Ashford Drive Herringbone Paver Driveway',
    category: 'Driveways',
    platform: 'Google',
    date: 'April 2024',
    featured: false,
  },
  {
    id: 8,
    name: 'Diane & Paul Sorenson',
    initials: 'DS',
    role: 'Homeowners',
    location: 'Oakmont, OH',
    stars: 5,
    quote:
      "We've had a lot of contractors work on our home over the years. Grayson's is the only one we've ever proactively recommended without being asked. The outdoor kitchen they built is better constructed than parts of our actual house. The granite countertop is perfect, the gas connection was done by a licensed plumber they coordinated themselves, and it all came in under the quote. That never happens.",
    shortQuote:
      "Better constructed than parts of our actual house. Came in under quote. That never happens.",
    project: 'Cedarbrook Outdoor Kitchen & Pergola',
    category: 'Outdoor Kitchens',
    platform: 'Houzz',
    date: 'July 2023',
    featured: false,
  },
  {
    id: 9,
    name: 'Linda Marchetti',
    initials: 'LM',
    role: 'HOA Board Chair',
    location: 'Westlake, OH',
    stars: 5,
    quote:
      "Managing a community of 240 units means every vendor decision is scrutinized. Grayson's handled our common area hardscape project with more professionalism than any contractor we've worked with. They attended our board meeting to present the plan, accommodated our phased budget, and had zero complaints from residents during construction. Our community looks completely transformed.",
    shortQuote:
      "More professionalism than any contractor we've worked with. Zero complaints during construction.",
    project: 'Westlake Commons Entry & Amenity Hardscape',
    category: 'Commercial',
    platform: 'Direct',
    date: 'February 2024',
    featured: false,
  },
  {
    id: 10,
    name: 'Theo & Becca Harmon',
    initials: 'TH',
    role: 'Homeowners',
    location: 'Cedar Falls, OH',
    stars: 5,
    quote:
      "We were skeptical about the investment at first — a stone patio felt like a luxury we weren't sure we needed. A year later, it's the room we spend the most time in. We've hosted more dinners outside this year than inside. Grayson's walked us through every decision, never once made us feel rushed, and the quality of the finished patio is something we're genuinely proud of.",
    shortQuote:
      "A year later, it's the room we spend the most time in. We're genuinely proud of it.",
    project: 'Cedar Falls Bluestone Entertaining Patio',
    category: 'Patios',
    platform: 'Google',
    date: 'May 2024',
    featured: false,
  },
  {
    id: 11,
    name: 'Greg Osei',
    initials: 'GO',
    role: 'Homeowner',
    location: 'Lakeview, OH',
    stars: 5,
    quote:
      "Had Grayson's install a set of natural stone steps down a steep grade in my backyard. The design they proposed was far better than what I'd sketched out. They sourced beautiful Pennsylvania fieldstone, the steps are rock solid, and they ran conduit for lighting at the same time without even charging extra. Small details like that show you're working with professionals who actually care.",
    shortQuote:
      "They ran conduit for lighting without even charging extra. Professionals who actually care.",
    project: 'Lakeside Grade Steps & Pathway',
    category: 'Walkways',
    platform: 'Facebook',
    date: 'October 2023',
    featured: false,
  },
  {
    id: 12,
    name: 'Carolyn Ashby',
    initials: 'CA',
    role: 'Interior Designer',
    location: 'Greenfield, OH',
    stars: 5,
    quote:
      "As a designer I refer Grayson's to my clients for outdoor hardscaping without hesitation. They understand design intent, they bring material samples, and they execute with precision. The collaboration is seamless. They've become the outdoor extension of my practice — clients who work with us inside and Grayson's outside get a cohesive result that's genuinely special.",
    shortQuote:
      "They've become the outdoor extension of my practice. The collaboration is seamless.",
    project: 'Multiple Residential Projects (Referral Partner)',
    category: 'Patios',
    platform: 'Direct',
    date: 'March 2024',
    featured: false,
  },
];

export const testimonialCategories = [
  'All',
  'Patios',
  'Retaining Walls',
  'Fire Features',
  'Driveways',
  'Walkways',
  'Outdoor Kitchens',
  'Commercial',
];

export const platforms = ['All', 'Google', 'Houzz', 'Facebook', 'Direct'];

export const platformStats = [
  { platform: 'Google', rating: 4.9, count: 87, color: '#4285F4' },
  { platform: 'Houzz', rating: 5.0, count: 63, color: '#7BB242' },
  { platform: 'Facebook', rating: 4.8, count: 41, color: '#1877F2' },
];
