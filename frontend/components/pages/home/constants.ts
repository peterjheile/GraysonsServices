import type {
  AboutUs,
  CredentialCard,
  ValueCard,
} from './types';

export const ABOUT_US = {
  eyebrow: 'Who We Are',
  imageAlt:
    'Grayson’s Services team completing an outdoor property project',
  titleLineNormal: 'Your Outdoor Vision,',
  titleLineHighlight: 'We Make It Happen',
  paragraphs: [
    `At Grayson's Services, we turn outdoor ideas into thoughtfully built spaces that feel like a natural extension of your home. Every project begins by listening to your goals, understanding your property, and creating a plan shaped around how you want to use the space.`,
    `We believe great work comes from quality craftsmanship, honest communication, and careful attention to detail. From the first conversation to the final walkthrough, we keep expectations clear, respect your property, and never cut corners where lasting quality matters.`,
    `As we continue to grow, our commitment remains the same: dependable service, durable results, and a finished project you can enjoy with confidence for years to come.`,
  ],
  url: '/images/defaults/home/about.jpg',
} as const satisfies AboutUs;

export const ABOUT_VALUES = [
  {
    icon: 'craftsmanship',
    title: 'Quality Craftsmanship',
    body: 'We take pride in every detail and build each project to provide lasting beauty, strength, and function.',
  },
  {
    icon: 'communication',
    title: 'Honest Communication',
    body: 'We provide straightforward guidance, clear expectations, and dependable updates throughout every project.',
  },
  {
    icon: 'commitment',
    title: 'Customer Commitment',
    body: 'We listen carefully, respect each property, and treat every customer’s vision as if it were our own.',
  },
  {
    icon: 'dependable',
    title: 'Dependable Service',
    body: 'We show up prepared, follow through on our promises, and work hard to deliver results our customers can trust.',
  },
] as const satisfies readonly ValueCard[];

export const CREDENTIAL_VALUES = [
  {
    title: 'Cred 1',
    body: 'License of some sort',
  },
  {
    title: 'Cred 2',
    body: 'Maybe a warranty',
  },
  {
    title: 'Cred 3',
    body: 'Another government credential',
  },
  {
    title: 'Cred 4',
    body: 'Soft credential',
  },
] as const satisfies readonly CredentialCard[];