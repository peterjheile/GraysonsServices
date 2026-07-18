import ServiceBlock from './ServiceBlock';

const services = [
  {
    id: 'decks',
    index: 1,
    eyebrow: 'Outdoor Living',
    title: 'Wooden Decks',
    subtitle: 'Catchy Subititle Will go Here',
    description: [
      'Description of what a wooden deck is for, and how it transforms your home/living space - should be longer than this.',
      'A small paragraph about the process of installing the wooden deck, and a few small assurances that people look for (such as stain to protect against water damage, etc.',
    ],
    features: [
      '5 year warranty',
      'Design Preview?',
      'Cleanup, etc',
      'What is included 1',
      'What is included 2',
      'What is included ...',
    ],
    startingAt: '$12/sq ft',
    images: [
      '/services/Wooden-Decks/d1.jpg',
      '/services/Wooden-Decks/d2.jpg',
      '/services/Wooden-Decks/d3.jpg',
    ],
    flip: false,
  },
  {
    id: 'walls',
    index: 1,
    eyebrow: 'Strcutural & Protection',
    title: 'Retaining Walls',
    subtitle: 'Catchy Subititle Will go Here',
    description: [
      'Description of what a retaining wall is for, and how it protects your yard/home - should be longer than this.',
      'A small paragraph about the process of installing the wooden deck, and a few small assurances that people look for (such as stain to protect against water damage, etc.',
    ],
    features: [
      '5 year warranty',
      'Design Preview?',
      'Cleanup, etc',
      'What is included 1',
      'What is included 2',
      'What is included ...',
    ],
    startingAt: '$12/sq ft',
    images: [
      '/services/Retaining-Walls/w1.jpg',
      '/services/Retaining-Walls/w2.jpg',
      '/services/Retaining-Walls/w3.jpg',
    ],
    flip: true,
  },
];

export default function ServicesGrid() {
  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      {services.map((s) => (
        <ServiceBlock key={s.id} {...s} />
      ))}
    </div>
  );
}
