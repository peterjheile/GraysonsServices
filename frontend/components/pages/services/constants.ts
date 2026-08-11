import type {
  ProcessSectionContent,
  ProcessStep,
  ServicesHeroContent,
} from './types';

export const SERVICES_HERO = {
  imageUrl: '/images/defaults/services/hero.jpg',
  backgroundPosition: 'center',
  eyebrow: 'Services',
  title: 'Practical Work,',
  highlight: 'Lasting Results',
  subtitle:
    'From outdoor construction and repairs to cleaning, drainage, and property care, every service is completed with dependable workmanship and careful attention to detail.',
  exploreLabel: 'Explore services',
} satisfies ServicesHeroContent;

export const PROCESS_SECTION = {
  eyebrow: 'Our Process',
  title: 'A Clear Path From',
  highlight: 'First Contact to Final Walkthrough',
  description:
    'Every property and project is different, but the experience should always feel straightforward. We keep you informed, set clear expectations, and make sure the finished work reflects what we agreed on together.',
} satisfies ProcessSectionContent;

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Start the Conversation',
    description:
      'Tell us what you would like to improve, what matters most to you, and any concerns you already have about the property.',
  },
  {
    number: '02',
    title: 'Assess the Property',
    description:
      'We review the work area, existing conditions, access, drainage, materials, and other details that may shape the project.',
  },
  {
    number: '03',
    title: 'Define the Plan',
    description:
      'We turn the conversation and site findings into a practical scope of work, with clear recommendations and expectations.',
  },
  {
    number: '04',
    title: 'Review the Estimate',
    description:
      'You receive a written estimate to review, and we answer questions or adjust the scope before any work is scheduled.',
  },
  {
    number: '05',
    title: 'Complete the Work',
    description:
      'Our team arrives prepared, works carefully, and keeps the site as orderly as the project allows from start to finish.',
  },
  {
    number: '06',
    title: 'Walk Through Together',
    description:
      'We review the completed work with you, address final questions, and make sure you understand any recommended care or next steps.',
  },
] as const satisfies readonly ProcessStep[];