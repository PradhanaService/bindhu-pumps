/**
 * Application sectors from the brief. Each application lists the pump
 * categories commonly considered for that duty and the reason. These are
 * starting points for a conversation, not a recommendation: final selection
 * depends on a duty assessment of the specific site.
 */

export type Application = {
  slug: string;
  name: string;
  duty: string;
  categories: { slug: string; reason: string }[];
  note?: string;
};

export type Sector = {
  slug: string;
  name: string;
  intro: string;
  applications: Application[];
};

export const sectors: Sector[] = [
  {
    slug: 'agriculture',
    name: 'Agriculture',
    intro:
      'Irrigation pumps are chosen by the water source and by the irrigation method. Each method needs a different balance of pressure and flow.',
    applications: [
      {
        slug: 'drip-irrigation',
        name: 'Drip irrigation',
        duty: 'Steady pressure at the emitters across the field, with filtration upstream of the drip lines.',
        categories: [
          { slug: 'borewell-pumps', reason: 'Where the farm draws from a bore.' },
          { slug: 'openwell-pumps', reason: 'Where the farm draws from a dug well or pond.' },
          { slug: 'agriculture-pumps', reason: 'Selection by source and method.' },
        ],
      },
      {
        slug: 'sprinkler-systems',
        name: 'Sprinkler systems',
        duty: 'Higher pressure at the sprinkler heads to reach the design throw and spacing.',
        categories: [
          { slug: 'borewell-pumps', reason: 'Multistage sets can be configured for higher head.' },
          { slug: 'openwell-pumps', reason: 'For open wells and farm ponds.' },
          { slug: 'agriculture-pumps', reason: 'Selection by source and method.' },
        ],
      },
      {
        slug: 'flood-irrigation',
        name: 'Flood irrigation',
        duty: 'High volume at low head to fill channels and field basins.',
        categories: [
          { slug: 'openwell-pumps', reason: 'Wide sources that can supply high volume.' },
          { slug: 'monoblock-pumps', reason: 'Surface sources close to the field.' },
          { slug: 'borewell-pumps', reason: 'Where the bore yield supports the flow.' },
        ],
      },
      {
        slug: 'canal-lifting',
        name: 'Canal lifting',
        duty: 'Lifting water a short height from a canal or channel onto higher ground.',
        categories: [
          { slug: 'monoblock-pumps', reason: 'Surface installation at the canal bank.' },
          { slug: 'openwell-pumps', reason: 'Submerged installation in the channel or a sump.' },
        ],
      },
    ],
  },
  {
    slug: 'residential',
    name: 'Residential',
    intro:
      'Domestic and building water supply, usually lifting water from a bore or sump to an overhead tank.',
    applications: [
      {
        slug: 'apartments',
        name: 'Apartments',
        duty: 'Filling overhead tanks for multiple floors from a sump or borewell.',
        categories: [
          { slug: 'monoblock-pumps', reason: 'Sump to overhead tank transfer.' },
          { slug: 'borewell-pumps', reason: 'Where the building has its own bore.' },
          { slug: 'submersible-pumps', reason: 'Submerged in the sump.' },
        ],
      },
      {
        slug: 'villas',
        name: 'Villas',
        duty: 'Single-dwelling supply from a bore, open well or sump.',
        categories: [
          { slug: 'borewell-pumps', reason: 'Bore to tank supply.' },
          { slug: 'openwell-pumps', reason: 'Dug well supply.' },
          { slug: 'submersible-pumps', reason: 'Quiet operation in a sump.' },
        ],
      },
      {
        slug: 'housing-societies',
        name: 'Housing societies',
        duty: 'Shared supply across several buildings, often from multiple bores and a central sump.',
        categories: [
          { slug: 'borewell-pumps', reason: 'Multiple bores feeding a common sump.' },
          { slug: 'monoblock-pumps', reason: 'Transfer from the central sump.' },
          { slug: 'submersible-pumps', reason: 'Submerged transfer from the sump.' },
        ],
      },
      {
        slug: 'borewell-overhead-tank',
        name: 'Borewell to overhead tank',
        duty: 'Lifting water from the pumping level in the bore to a tank on the roof.',
        categories: [
          { slug: 'borewell-pumps', reason: 'Designed for this duty.' },
          { slug: 'submersible-pumps', reason: 'General submersible range.' },
        ],
      },
    ],
  },
  {
    slug: 'industrial',
    name: 'Industrial and infrastructure',
    intro:
      'Water transfer and circulation duties on industrial sites and construction projects. Industrial duties are assessed case by case.',
    applications: [
      {
        slug: 'manufacturing',
        name: 'Manufacturing',
        duty: 'General water transfer and supply within a plant.',
        categories: [{ slug: 'monoblock-pumps', reason: 'Surface transfer from tanks and sumps.' }],
      },
      {
        slug: 'process-water',
        name: 'Process water',
        duty: 'Supplying water to process equipment at a defined flow and pressure.',
        categories: [
          { slug: 'monoblock-pumps', reason: 'Surface installation near the process.' },
          { slug: 'submersible-pumps', reason: 'Transfer from a sump or tank.' },
        ],
      },
      {
        slug: 'cooling-systems',
        name: 'Cooling systems',
        duty: 'Circulating water between equipment and a cooling tower or heat exchanger.',
        categories: [{ slug: 'monoblock-pumps', reason: 'Circulation at the surface.' }],
        note: 'Liquid temperature and quality must be stated in the enquiry.',
      },
      {
        slug: 'construction',
        name: 'Construction',
        duty: 'Site water supply and removal of water from excavations and sumps.',
        categories: [
          { slug: 'submersible-pumps', reason: 'Submerged in the excavation or sump.' },
          { slug: 'openwell-pumps', reason: 'Wide, temporary water sources.' },
        ],
      },
      {
        slug: 'firefighting',
        name: 'Firefighting applications',
        duty: 'Water supply for fire protection systems.',
        categories: [{ slug: 'monoblock-pumps', reason: 'Surface pump sets, subject to approval.' }],
        note: 'Fire pump installations are governed by local fire-safety codes and approval requirements. Contact us with the system specification so the requirement can be reviewed.',
      },
    ],
  },
];

export const allApplications = sectors.flatMap((s) => s.applications.map((a) => ({ ...a, sector: s.slug })));

export const applicationOptions = sectors.map((s) => ({
  group: s.name,
  options: s.applications.map((a) => ({ value: a.slug, label: a.name })),
}));

export function getApplication(slug: string) {
  return allApplications.find((a) => a.slug === slug);
}
