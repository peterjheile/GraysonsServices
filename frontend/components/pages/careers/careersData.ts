export type JobListing = {
  id: string;
  title: string;
  department: string;
  type: 'Full-Time' | 'Part-Time' | 'Seasonal' | 'Contract';
  level: 'Entry Level' | 'Mid Level' | 'Senior' | 'Lead' | 'Management';
  location: string;
  pay: string;
  posted: string;
  urgent: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
};

export const jobs: JobListing[] = [
  {
    id: 'senior-hardscape-installer',
    title: 'Senior Concrete Installer',
    department: 'Field Operations',
    type: 'Full-Time',
    level: 'Senior',
    location: 'Bloomington, IN',
    pay: '$xx–$xx / hr',
    posted: 'May 2026',
    urgent: true,
    summary:
      'Lead the installation of concrete products. You will lead a crew of 2-4 people . . . rest of description',
    responsibilities: [
      'Responsibility 1 will go here',
      'Responsibility 2 will go here',
      'Responsibility 3 will go here',
      'Responsibility 4 will go here',
      'There can be as many responsilbilites as we want.',
    ],
    requirements: [
      '4+ years of hands-on concrete experience',
      'Requirement 2 will go here',
      'Requirement 3 will go here',
      'Requirement 4 will go here',
      'Requirement 5 will go here',
      'As many requirements as wanted.'
    ],
    niceToHave: [
      'Can also have a few nice to haves here.',
      'Another Nice to Have',
    ],
  },
    {
    id: 'Junior Lawn Technician. ',
    title: 'Junior Lawn Technician.',
    department: 'Field Operations',
    type: 'Part-Time',
    level: 'Entry Level',
    location: 'Bloomington, IN',
    pay: '$xx–$xx / hr',
    posted: 'May 2026',
    urgent: false,
    summary:
      'Lead the installation of concrete products. You will lead a crew of 2-4 people . . . rest of description',
    responsibilities: [
      'Responsibility 1 will go here',
      'Responsibility 2 will go here',
      'Responsibility 3 will go here',
      'Responsibility 4 will go here',
      'There can be as many responsilbilites as we want.',
    ],
    requirements: [
      '4+ years of hands-on concrete experience',
      'Requirement 2 will go here',
      'Requirement 3 will go here',
      'Requirement 4 will go here',
      'Requirement 5 will go here',
      'As many requirements as wanted.'
    ],
    niceToHave: [
      'Can also have a few nice to haves here.',
      'Another Nice to Have',
    ],
  },
  
];

export const departments = ['All', 'Field', 'Operations', 'Marketing'];
export const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Seasonal'];

export type Perk = {
  icon: string;
  title: string;
  description: string;
};

export const perks: Perk[] = [
  {
    icon: 'pay',
    title: 'Competitive Pay',
    description: 'Something about how pay is competitive, and this specific perk',
  },
  {
    icon: 'training',
    title: 'Perk 2',
    description: 'Perk 2 Description will go here.',
  },
  {
    icon: 'tools',
    title: 'Perk 3',
    description: 'Perk 3 description will go here.',
  },
  {
    icon: 'culture',
    title: 'Perk 4',
    description: 'Perk 4 description will go here.',
  },
];

export type TeamQuote = {
  name: string;
  initials: string;
  title: string;
  years: string;
  quote: string;
  image: string;
};

export const teamQuotes: TeamQuote[] = [
  {
    name: 'Marcus T.',
    initials: 'MT',
    title: 'Senior Installer → Lead Foreman',
    years: '7 years',
    quote:
      "I started as a laborer right out of high school. Seven years later I'm running crews on our biggest commercial sites. They actually teach you here — and they actually promote you.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
  },
  {
    name: 'Rachel D.',
    initials: 'RD',
    title: 'Design Estimator',
    years: '3 years',
    quote:
      "I came from a landscape architecture background and wasn't sure a hardscaping company would value design thinking. Grayson's proved me wrong — the quality we're expected to deliver matches the quality of the work environment.",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80',
  },
  {
    name: 'Devon K.',
    initials: 'DK',
    title: 'Project Manager',
    years: '4 years',
    quote:
      "The pace is real — we run a tight operation. But so is the support. I've never once felt like I was being set up to fail. The leadership here is actually invested in the outcomes.",
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80',
  },
];
