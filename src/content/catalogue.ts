/**
 * Product catalogue (items for sale).
 *
 * SAMPLE DATA. Every item below is a placeholder created so the shop layout
 * can be reviewed. Names, prices and specifications are examples, not real
 * offers, and are shown on the site with a visible "Sample" tag while
 * `isSample` is true. Replace each item with real catalogue data, then set
 * `isSample: false`.
 *
 * Images: put product photos in /public/images/products/ and list them in
 * `images`. Until then a drawn placeholder is shown.
 *
 * 3D: `model` selects the interactive model. Only the reference model from the
 * supplied STEP file exists today; add more GLB files in /public/models/.
 */

export type CatalogueImage = { src: string; alt: string };

export type CatalogueItem = {
  slug: string;
  sku: string;
  name: string;
  /** Product category slug from products.ts */
  category: string;
  /** Short line for cards */
  tagline: string;
  /** Price in Indian rupees, before any discount. */
  price: number;
  description: string[];
  highlights: string[];
  specs: { label: string; value: string }[];
  images: CatalogueImage[];
  model: 'reference' | null;
  featured: boolean;
  isSample: boolean;
};

export const catalogue: CatalogueItem[] = [
  {
    slug: 'borewell-submersible-1hp-4in',
    sku: 'SMP-BW-100',
    name: 'Borewell Submersible Pump Set, 1 HP',
    category: 'borewell-pumps',
    tagline: '4 inch bore, single phase, for domestic supply',
    price: 14500,
    description: [
      'A slim multistage submersible set for 4 inch borewells, sized for lifting water from the bore to an overhead tank in a house or villa.',
      'Supplied as a pump and motor set. Cable, control panel and riser pipe are selected for the installation depth.',
    ],
    highlights: ['Fits 4 inch bore casing', 'Single phase supply', 'Multistage pump end'],
    specs: [
      { label: 'Power', value: '1 HP / 0.75 kW' },
      { label: 'Supply', value: 'Single phase, 230 V, 50 Hz' },
      { label: 'Bore size', value: '4 inch (100 mm)' },
      { label: 'Stages', value: '10' },
      { label: 'Outlet', value: '1.25 inch' },
    ],
    images: [],
    model: 'reference',
    featured: true,
    isSample: true,
  },
  {
    slug: 'openwell-submersible-1-5hp',
    sku: 'SMP-OW-150',
    name: 'Openwell Submersible Pump, 1.5 HP',
    category: 'openwell-pumps',
    tagline: 'Horizontal, for open wells and farm ponds',
    price: 16800,
    description: [
      'A horizontal openwell submersible pump for dug wells, sumps and farm ponds, where a wide water source allows a larger pump end.',
      'It operates under water, so no priming is needed even as the well level falls through the season.',
    ],
    highlights: ['Horizontal mounting', 'No priming needed', 'Intake screen fitted'],
    specs: [
      { label: 'Power', value: '1.5 HP / 1.1 kW' },
      { label: 'Supply', value: 'Single phase, 230 V, 50 Hz' },
      { label: 'Mounting', value: 'Horizontal' },
      { label: 'Outlet', value: '2 inch' },
    ],
    images: [],
    model: 'reference',
    featured: true,
    isSample: true,
  },
  {
    slug: 'compact-sump-submersible-0-5hp',
    sku: 'SMP-SB-050',
    name: 'Compact Sump Submersible Pump, 0.5 HP',
    category: 'submersible-pumps',
    tagline: 'For sumps, tanks and water transfer',
    price: 6900,
    description: [
      'A compact submersible pump for transferring clear water from sumps and storage tanks. The sealed motor runs under water and is cooled by it.',
      'Suited to small residential transfer duties and drainage of tanks.',
    ],
    highlights: ['Sealed motor', 'Threaded vertical outlet', 'Perforated intake screen'],
    specs: [
      { label: 'Power', value: '0.5 HP / 0.37 kW' },
      { label: 'Supply', value: 'Single phase, 230 V, 50 Hz' },
      { label: 'Outlet', value: '1 inch' },
    ],
    images: [],
    model: 'reference',
    featured: true,
    isSample: true,
  },
  {
    slug: 'monoblock-pump-1hp',
    sku: 'SMP-MB-100',
    name: 'Monoblock Pump, 1 HP',
    category: 'monoblock-pumps',
    tagline: 'Surface pump for sump to overhead tank',
    price: 7800,
    description: [
      'A surface centrifugal monoblock pump with the impeller on the motor shaft. Installed close to the water level on a level base.',
      'Common for lifting water from an underground sump to an overhead tank.',
    ],
    highlights: ['Motor and pump on one shaft', 'Surface installation', 'Needs priming and a foot valve'],
    specs: [
      { label: 'Power', value: '1 HP / 0.75 kW' },
      { label: 'Supply', value: 'Single phase, 230 V, 50 Hz' },
      { label: 'Suction × delivery', value: '1 × 1 inch' },
    ],
    images: [],
    model: 'reference',
    featured: true,
    isSample: true,
  },
  {
    slug: 'agricultural-borewell-5hp-6in',
    sku: 'SMP-AG-500',
    name: 'Agricultural Borewell Pump Set, 5 HP',
    category: 'agriculture-pumps',
    tagline: '6 inch bore, three phase, for irrigation',
    price: 38500,
    description: [
      'A three phase borewell set for irrigation from 6 inch bores, configured with the stages needed for drip or sprinkler duty.',
      'Final stage count is matched to the pumping water level and the pressure required at the field.',
    ],
    highlights: ['Fits 6 inch bore casing', 'Three phase supply', 'Configured for irrigation duty'],
    specs: [
      { label: 'Power', value: '5 HP / 3.7 kW' },
      { label: 'Supply', value: 'Three phase, 415 V, 50 Hz' },
      { label: 'Bore size', value: '6 inch (150 mm)' },
      { label: 'Outlet', value: '2.5 inch' },
    ],
    images: [],
    model: 'reference',
    featured: false,
    isSample: true,
  },
  {
    slug: 'monoblock-pump-3hp-three-phase',
    sku: 'SMP-MB-300',
    name: 'Monoblock Pump, 3 HP',
    category: 'monoblock-pumps',
    tagline: 'Three phase, for canal lifting and flood irrigation',
    price: 19900,
    description: [
      'A larger surface monoblock pump for lifting water from canals, ponds and channels onto the field.',
      'High volume at moderate head, installed at the bank close to the water level.',
    ],
    highlights: ['Three phase supply', 'Surface installation', 'For high-volume duties'],
    specs: [
      { label: 'Power', value: '3 HP / 2.2 kW' },
      { label: 'Supply', value: 'Three phase, 415 V, 50 Hz' },
      { label: 'Suction × delivery', value: '2.5 × 2.5 inch' },
    ],
    images: [],
    model: 'reference',
    featured: false,
    isSample: true,
  },
];

export function getItem(slug: string) {
  return catalogue.find((i) => i.slug === slug);
}

export const hasSamples = catalogue.some((i) => i.isSample);

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export function formatPrice(value: number) {
  return inr.format(value);
}
