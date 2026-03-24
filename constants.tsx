
import { Product, ProcessStep } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Olive River Dining Table',
    description: 'A masterpiece of natural contrast. Hand-selected olive wood slabs with complex grain patterns meet a flowing electric blue resin river.',
    image: 'https://i.postimg.cc/xjgBcrW7/custom-blue-epoxy-resin-olive-wood-dining-table.webp',
    startingPrice: 'JMD $99,750',
    basePriceNum: 99750,
    category: 'furniture',
    leadTimeWeeks: 3,
    options: [
      { label: '4-Seater (5ft)', priceModifier: 0 },
      { label: '6-Seater (7ft)', priceModifier: 40250 },
      { label: '8-Seater (9ft)', priceModifier: 140250 }
    ]
  },
  {
    id: '10',
    name: 'Artisan Epoxy Entrance Door',
    description: 'The ultimate first impression. A solid hardwood door featuring a massive vertical epoxy rift that lets natural light filter through.',
    image: 'https://i.postimg.cc/KvcdxT2y/jwood-epoxy-door.jpg',
    startingPrice: 'JMD $125,000',
    basePriceNum: 125000,
    category: 'custom',
    leadTimeWeeks: 4,
    options: [
      { label: 'Standard Single', priceModifier: 0 },
      { label: 'Grand Double', priceModifier: 110000 }
    ]
  },
  {
    id: '9',
    name: 'Emerald Flow Countertop',
    description: 'A seamless integration of functionality and high-art. Custom-fitted hardwood countertops featuring a deep emerald resin flow.',
    image: 'https://i.postimg.cc/gc1ZPVRR/jwood-counter-top.jpg',
    startingPrice: 'JMD $224,000',
    basePriceNum: 224000,
    category: 'custom',
    leadTimeWeeks: 4,
    options: [
      { label: 'Kitchen Island (8x4)', priceModifier: 0 },
      { label: 'Full Kitchen (Custom Inquiry)', priceModifier: 0 }
    ]
  },
  {
    id: '8',
    name: 'Decorative Wall Pieces',
    description: 'Bespoke wall-mounted art. Choose between a pure organic timber slab (52x24") or a grand masterpiece infused with liquid elegance (84x48"). Resin-infused pieces feature deep-pour artistry and hand-polished clarity.',
    image: 'https://i.postimg.cc/VLSSNDnB/wall-piece-jwood.jpg',
    additionalImages: ['https://i.postimg.cc/8zQnKXby/wall-piece-jwood-2.jpg'],
    startingPrice: 'JMD $86,000',
    basePriceNum: 86000,
    category: 'decor',
    leadTimeWeeks: 2,
    options: [
      { label: '52x24" - Without Resin', priceModifier: 0 },
      { label: '84x48" - With Resin Flow', priceModifier: 80000 }
    ]
  },
  {
    id: '7',
    name: 'Deep Sea Coffee Table',
    description: 'A stunning center-piece featuring a deep cobalt resin canyon between two rugged slabs of reclaimed hardwood.',
    image: 'https://i.postimg.cc/zB99q28s/jwood-5.jpg',
    startingPrice: 'JMD $22,000',
    basePriceNum: 22000,
    category: 'furniture',
    leadTimeWeeks: 3,
    options: [
      { label: 'Standard Circular', priceModifier: 0 },
      { label: 'Large Circular', priceModifier: 53000 }
    ]
  },
  {
    id: '3',
    name: 'Sapphire Valley Bench',
    description: 'A striking functional art piece featuring reclaimed local timber with a vibrant sapphire epoxy vein.',
    image: 'https://i.postimg.cc/HxprBzfq/jwood-7.jpg',
    startingPrice: 'JMD $38,000',
    basePriceNum: 38000,
    category: 'furniture',
    leadTimeWeeks: 3,
    options: [
      { label: '2-Person (4ft)', priceModifier: 0 },
      { label: '3-Person (6ft)', priceModifier: 15000 }
    ]
  },
  {
    id: '4',
    name: 'Artisan Ocean Cutting Board',
    description: 'A functional piece of art for your kitchen. Crafted from premium hardwood with a unique epoxy design.',
    image: 'https://i.postimg.cc/LXbmLVR0/jwood-cutting-board.jpg',
    startingPrice: 'JMD $9,500',
    basePriceNum: 9500,
    category: 'decor',
    leadTimeWeeks: 1,
    options: [
      { label: 'Standard (12x10")', priceModifier: 0 },
      { label: 'Extra Large (18x12")', priceModifier: 6500 }
    ]
  },
  {
    id: '6',
    name: 'Artisan Resin Candle Bases',
    description: 'Architectural candle holders sculpted from reclaimed Jamaican hardwood and stabilized with liquid resin. A minimalist centerpiece designed to hold your favorite pillars within a frame of natural wood grain and translucent epoxy.',
    image: 'https://i.postimg.cc/d04cF0Tw/jwood-4.jpg',
    startingPrice: 'JMD $2,100',
    basePriceNum: 2100,
    category: 'decor',
    leadTimeWeeks: 1,
    options: [
      { label: 'Single Pillar Base', priceModifier: 0 },
      { label: 'Set of 3 Bases', priceModifier: 3800 }
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Source & Select',
    description: 'We salvage fallen logs from across the island, looking for cracks and knots where epoxy can create art.'
  },
  {
    number: 2,
    title: 'Precision Pour',
    description: 'After moisture stabilization, we execute multi-day resin pours using UV-stable, high-clarity industrial polymers.'
  },
  {
    number: 3,
    title: 'Diamond Polishing',
    description: 'Each piece undergoes a 12-stage sanding and polishing process to achieve a mirror-like finish on the resin.'
  }
];
