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
    title: 'Senior Hardscape Installer',
    department: 'Field Operations',
    type: 'Full-Time',
    level: 'Senior',
    location: 'Greater Ohio Region (Field)',
    pay: '$28–$38 / hr',
    posted: 'May 2025',
    urgent: true,
    summary:
      'Lead the installation of premium hardscape projects — stone patios, retaining walls, pavers, and more — with a crew of 2–4 installers. You own the quality of the finished product from sub-base to final seal.',
    responsibilities: [
      'Lead daily installation work on residential and commercial hardscape projects',
      'Set layout, grades, and patterns to design specifications',
      'Oversee sub-base preparation, compaction, and drainage installation',
      'Guide and mentor junior crew members on technique and standards',
      'Communicate daily progress and flag issues to the project manager',
      'Ensure jobsite is clean, organized, and safe at all times',
      'Perform final quality checks before project sign-off',
    ],
    requirements: [
      '4+ years of hands-on hardscape or masonry installation experience',
      'Proficiency with laser levels, plate compactors, and cut-off saws',
      'Strong understanding of drainage principles and sub-base systems',
      'Valid driver\'s license and clean driving record',
      'Ability to lift 80+ lbs and work outdoors in all weather conditions',
      'Reliable transportation to our yard in Greenfield, OH',
    ],
    niceToHave: [
      'ICPI (Interlocking Concrete Pavement Institute) certification',
      'Experience with natural stone — bluestone, travertine, flagstone',
      'Prior crew lead or foreman experience',
    ],
  },
  {
    id: 'hardscape-installer',
    title: 'Hardscape Installer',
    department: 'Field Operations',
    type: 'Full-Time',
    level: 'Mid Level',
    location: 'Greater Ohio Region (Field)',
    pay: '$20–$28 / hr',
    posted: 'May 2025',
    urgent: true,
    summary:
      'Join a skilled crew installing stone patios, pavers, retaining walls, and outdoor features on residential and commercial sites across the region. You\'ll develop real craft under experienced leads.',
    responsibilities: [
      'Assist with excavation, grading, and sub-base preparation',
      'Install interlocking pavers, flagstone, and natural stone to layout specs',
      'Operate compaction equipment and hand tools',
      'Load, unload, and handle materials safely',
      'Maintain a clean and organized job site daily',
      'Follow direction from senior installers and project leads',
    ],
    requirements: [
      '1–3 years of hardscape, landscaping, or construction experience',
      'Comfortable working outdoors, full-time, in all conditions',
      'Physical ability to lift 80+ lbs repeatedly throughout the workday',
      'Valid driver\'s license',
      'Punctual, reliable, and a strong team player',
    ],
    niceToHave: [
      'Experience with pavers, stone, or concrete work',
      'Basic familiarity with levels and layout strings',
      'OSHA 10 certification',
    ],
  },
  {
    id: 'project-manager',
    title: 'Project Manager',
    department: 'Operations',
    type: 'Full-Time',
    level: 'Lead',
    location: 'Greenfield, OH (Hybrid)',
    pay: '$55,000–$75,000 / yr',
    posted: 'April 2025',
    urgent: false,
    summary:
      'Own the full lifecycle of 8–15 concurrent residential and commercial hardscape projects — from pre-construction planning and scheduling through crew coordination, client communication, and final delivery.',
    responsibilities: [
      'Manage project schedules, materials procurement, and crew deployment',
      'Serve as the primary client contact from contract signing to punch-list',
      'Conduct pre-construction site walks and document conditions',
      'Coordinate with suppliers for material lead times and delivery windows',
      'Track project budgets and flag cost variances weekly',
      'Review and approve daily site photos from crew leads',
      'Handle warranty callbacks and post-project follow-ups',
      'Participate in estimating on complex or large-scope projects',
    ],
    requirements: [
      '3+ years of project management experience in construction or trades',
      'Strong organizational and communication skills — you juggle a lot',
      'Proficiency with project management software (Buildertrend, CoConstruct, or similar)',
      'Ability to read and interpret basic site plans and specs',
      'Valid driver\'s license — frequent site visits required',
    ],
    niceToHave: [
      'Prior experience in hardscaping, landscaping, or outdoor construction',
      'PMP or similar certification',
      'Experience managing crews of 8–20 people',
    ],
  },
  {
    id: 'design-estimator',
    title: 'Design & Estimating Specialist',
    department: 'Sales & Design',
    type: 'Full-Time',
    level: 'Mid Level',
    location: 'Greenfield, OH (Hybrid + Field)',
    pay: '$50,000–$68,000 / yr + bonus',
    posted: 'May 2025',
    urgent: false,
    summary:
      'Meet with prospective clients, design their outdoor space, and build the estimate that turns a conversation into a project. You\'re the face of Grayson\'s at the proposal stage — equal parts creative and analytical.',
    responsibilities: [
      'Conduct in-home and on-site consultations with prospective clients',
      'Develop project layouts and material selections using design software',
      'Build detailed line-item estimates with material, labor, and equipment costs',
      'Present proposals and answer client questions with confidence',
      'Manage your pipeline and follow up with leads in a timely manner',
      'Hand off signed projects to the project management team with full documentation',
      'Stay current on material pricing, supplier offerings, and design trends',
    ],
    requirements: [
      '2+ years of estimating or sales experience in construction or trades',
      'Strong spatial reasoning and design sense',
      'Comfortable with spreadsheets, estimating software, and CRM tools',
      'Excellent written and verbal communication',
      'Valid driver\'s license — client visits are a core part of this role',
    ],
    niceToHave: [
      'Experience with SketchUp, DynaSCAPE, or similar design tools',
      'Background in landscape design, architecture, or a related field',
      'Existing familiarity with hardscape materials and installation methods',
    ],
  },
  {
    id: 'equipment-operator',
    title: 'Equipment Operator',
    department: 'Field Operations',
    type: 'Full-Time',
    level: 'Mid Level',
    location: 'Greater Ohio Region (Field)',
    pay: '$24–$32 / hr',
    posted: 'March 2025',
    urgent: false,
    summary:
      'Operate mini-excavators, skid steers, and dump trucks on hardscape job sites — handling excavation, grading, material movement, and site prep with precision and care for surrounding property.',
    responsibilities: [
      'Operate mini-excavator and skid steer for excavation and grading',
      'Transport and position materials on site',
      'Perform preventive maintenance checks on all equipment',
      'Coordinate machine work with the hand crew to maintain efficient workflow',
      'Maintain equipment logs and report any issues immediately',
    ],
    requirements: [
      '2+ years of experience operating compact excavators and skid steers',
      'CDL Class B or higher (preferred) or valid standard driver\'s license',
      'Clean MVR — equipment transport on trailer required',
      'Strong awareness of underground utilities and safe dig practices',
    ],
    niceToHave: [
      'CDL Class A license',
      'Experience with trailer towing of equipment up to 18,000 lbs',
      'OSHA 30 certification',
    ],
  },
  {
    id: 'laborer-seasonal',
    title: 'Seasonal Laborer',
    department: 'Field Operations',
    type: 'Seasonal',
    level: 'Entry Level',
    location: 'Greater Ohio Region (Field)',
    pay: '$17–$20 / hr',
    posted: 'May 2025',
    urgent: false,
    summary:
      'Start your career in the trades with a crew that will actually teach you something. Seasonal laborers support our installation crews from April through November — and the best ones convert to full-time.',
    responsibilities: [
      'Support installation crews with material handling, site prep, and cleanup',
      'Operate hand tools and small power equipment under supervision',
      'Load and unload materials from trucks and trailers',
      'Keep job sites clean and organized throughout the workday',
      'Follow safety protocols and wear required PPE at all times',
    ],
    requirements: [
      'No prior experience required — eagerness to learn is everything',
      'Physical ability to perform demanding outdoor labor daily',
      'Reliable transportation to our yard in Greenfield, OH',
      'Valid driver\'s license',
      'Available full-time, April – November',
    ],
    niceToHave: [
      'Any construction, landscaping, or manual labor experience',
      'Interest in turning this into a full-time career in the trades',
    ],
  },
];

export const departments = ['All', 'Field Operations', 'Operations', 'Sales & Design'];
export const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Seasonal'];

export type Perk = {
  icon: string;
  title: string;
  description: string;
};

export const perks: Perk[] = [
  {
    icon: 'health',
    title: 'Health & Dental',
    description: 'Full medical, dental, and vision coverage for full-time employees — with 70% of premiums covered by Grayson\'s.',
  },
  {
    icon: 'pay',
    title: 'Competitive Pay',
    description: 'We pay above-market rates across every role. Skilled tradespeople deserve skilled-tradesperson wages.',
  },
  {
    icon: 'growth',
    title: 'Real Growth Paths',
    description: 'Most of our project managers and leads started on the tools. We promote from within and invest in the people who invest in us.',
  },
  {
    icon: 'training',
    title: 'Paid Training & Certs',
    description: 'We cover ICPI certification, OSHA courses, equipment licenses, and other professional development — 100% company-paid.',
  },
  {
    icon: 'tools',
    title: 'Top-Grade Equipment',
    description: 'You won\'t fight old, broken tools here. Our equipment is maintained, modern, and ready for the work.',
  },
  {
    icon: 'schedule',
    title: 'Consistent Schedule',
    description: 'Monday–Friday with predictable hours. We respect your time off and don\'t make a habit of last-minute weekend calls.',
  },
  {
    icon: 'bonus',
    title: 'Performance Bonuses',
    description: 'Project completion bonuses, referral rewards, and year-end recognition for crews and individuals who go above and beyond.',
  },
  {
    icon: 'culture',
    title: 'Crew Culture',
    description: 'Small enough that you know everyone. Big enough to offer real stability. Team lunches, seasonal events, and a crew that has your back.',
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
