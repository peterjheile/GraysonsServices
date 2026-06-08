import type { QuickStat, MarqueeServices, ValueCard, OurStory, CredCard, Project, category, Testimonial } from "./types";
import {
  FiAward,
  FiCheckSquare,
  FiShield,
} from "react-icons/fi";

export const QUICK_STATS: [QuickStat, QuickStat, QuickStat] = [
    {
        value: "100+",
        label: "Projects Completed",
    },
    {
        value: "98%",
        label: "Client Satisfaction",
    },
    {
        value: "5",
        label: "Years Experience",
    },
]

export const MARQUEE_SERVICES: MarqueeServices = [
  "Patios",
  "Retaining Walls",
  "Outdoor Kitchens",
  "Fire Features",
  "Walkways",
  "Driveways",
];

export const CRENTIAL_VALUES: [CredCard, CredCard, CredCard, CredCard] = [
    {
        title: "Cred 1",
        body: "Liscense of Some sort"
    },
    {
        title: "Cred 2",
        body: "Maybe a warranty"
    },
    {
        title: "Cred 3",
        body: "Another Gov Cred"
    },
    {
        title: "Cred 4",
        body: "Soft Cred"
    }
]



export const ABOUT_VALUES: [ValueCard, ValueCard, ValueCard, ValueCard] = [
    {
        icon: "award",
        title: "Value One Here",
        body: "A short description of the first value goes here.",
    },
    {
        icon: "check",
        title: "Value Two Here",
        body: "A short description of the second value goes here.",
    },
    {
        icon: "shield",
        title: "Value Three Here",
        body: "A short description of the third value goes here.",
    },
    {
        icon: "shield",
        title: "Value Four Here",
        body: "A short description of the third value goes here.",
    },
];


export const OUR_STORY: OurStory = {
    eyebrow: "Our Story",
    titleLineNormal: "Our Story Header,",
    titleLineHighlight: "Goes Right Here",
    paragraphs: [
        `Grayson's Services about us paragraph one will go right here.
         It will talk about the start of the company and the 'core values' derived 
         from that beginning. Should be a tiny bit longer but any length works.`,
         `This paragraph will talk about what these values mean and what they do for 
         the company. No cutting corners, prioritizing client, etc. Should also be a 
         tiny bit longer.`,
         `A small gauruntee of quality and unchanging services likely should go here. 
         Especially as you scale.`
    ],
    url: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80`
}


export const CATEGORIES: category[] = [
    'All', 'Decks', 'Driveways', 'Retaining Walls', "Walkways"
]




export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Simple Wooden Deck',
    category: 'Decks',
    location: 'Bloomington, IN',
    size: 'large',
    img_url: '/services/Deck1.jpg',
  },
  {
    id: 2,
    title: 'Quality Retaining Wall',
    category: 'Retaining Walls',
    location: 'Bloomington, IN',
    size: 'small',
    img_url: '/services/RetainingWall1.jpg',
  },
  {
    id: 3,
    title: 'Curved Walkways',
    category: 'Walkways',
    location: 'Bloomington, IN',
    size: 'small',
    img_url: '/services/Walkway1.jpg',
  },
  {
    id: 4,
    title: 'Gravel Driveway Touch Up',
    category: 'Driveways',
    location: 'Bloomington, IN',
    size: 'small',
    img_url: '/services/Driveway1.jpg',
  },
  {
    id: 6,
    title: 'Layered Stone Retaining Wall',
    category: 'Retaining Walls',
    location: 'Bloomington, IN',
    size: 'large',
    img_url: '/services/RetainingWall2.jpg',
  },
  {
    id: 5,
    title: 'Floating Wooden Deck',
    category: 'Decks',
    location: 'Bloomington, IN',
    size: 'small',
    img_url: '/services/Deck2.jpg',
  },
];


export const TESTIMONIALS: Testimonial[] = [
{
    id: 1,
    name: 'Billy (names here)',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      "Super Good Review will go here. One that is thought out from a client - maybe a trusted member of the community. This is the FEATURED review that will go here.",
    project: 'Project Name in Gallery',
    featured: true,
  },
  {
    id: 2,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: true,
  },
  {
    id: 3,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: false,
  },
  {
    id: 4,
    name: 'Billy Bob',
    role: 'Role goes here, such as: Homeowners, Bloomington',
    stars: 5,
    quote:
      'The review will go here. Again, ioptimally something well thought out, not too long and not too short. Many can go here.',
    project: 'Project Name in Gallery',
    featured: false,
  },
]

