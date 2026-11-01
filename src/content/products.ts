/**
 * Product range data.
 *
 * Category names come from the brief (the five categories on the reference
 * website). Descriptions of how each pump type works are general engineering
 * facts about the pump type, not claims about a specific product.
 *
 * Every model-specific value (power, head, flow, voltage, sizes, materials)
 * is `null` until verified from the business's catalogue or the reference
 * website. Null values render as "To be confirmed". Do not fill them with
 * estimates.
 */

export type SpecRow = {
  label: string;
  value: string | null;
  hint?: string;
};

export type Feature = { title: string; body: string };

export type TechDocument = { title: string; href: string; format: string; size?: string };

export type ProductCategory = {
  slug: string;
  index: string;
  name: string;
  /** One-line positioning used in lists and metadata. */
  summary: string;
  /** Where the pump sits relative to the water. General to the pump type. */
  position: string;
  waterSource: string;
  priming: string;
  overview: string[];
  construction: { title: string; body: string }[];
  features: Feature[];
  /** Application slugs, see applications.ts */
  applications: string[];
  specs: SpecRow[];
  /** Inputs the engineering team needs to size this pump type. */
  selectionInputs: string[];
  documents: TechDocument[];
  related: string[];
  schematic: 'submersible' | 'borewell' | 'openwell' | 'agriculture' | 'monoblock';
};

/** Specification rows shared by every category. Values pending verification. */
const pendingSpecs = (extra: SpecRow[] = []): SpecRow[] => [
  { label: 'Power rating', value: null, hint: 'HP / kW range offered' },
  { label: 'Supply', value: null, hint: 'Phase, voltage, frequency' },
  { label: 'Head range', value: null, hint: 'Metres' },
  { label: 'Flow range', value: null, hint: 'LPM or m³/h' },
  { label: 'Outlet size', value: null, hint: 'mm / inch' },
  ...extra,
  { label: 'Pump materials', value: null, hint: 'Casing, impeller, shaft' },
  { label: 'Motor', value: null, hint: 'Type, insulation class, protection' },
  { label: 'Warranty', value: null, hint: 'Period and terms' },
];

export const products: ProductCategory[] = [
  {
    slug: 'submersible-pumps',
    index: '01',
    name: 'Submersible Pumps',
    summary: 'Sealed motor and pump units that operate fully under water and push water to the surface.',
    position: 'Below water level',
    waterSource: 'Sumps, tanks, wells, bores',
    priming: 'Not required',
    overview: [
      'A submersible pump combines a sealed electric motor and a pump end in a single unit that is lowered into the water it moves. Because the pump sits below the water level, water flows into the intake under its own pressure and the pump pushes it up the delivery pipe rather than pulling it.',
      'This arrangement avoids the suction lift limit of surface pumps, needs no priming, and keeps operating noise below ground or under water. Submersible designs are produced in several forms, including slim borewell sets and wider openwell units, which are listed as separate categories in this range.',
    ],
    construction: [
      { title: 'Sealed motor', body: 'The motor is enclosed in a watertight housing. The surrounding water carries heat away from the motor during operation.' },
      { title: 'Pump end', body: 'An impeller inside the pump casing accelerates water drawn through the intake screen. The casing converts that velocity into pressure and directs it to the discharge.' },
      { title: 'Shaft and seals', body: 'The motor shaft drives the impeller directly. Shaft seals keep water out of the motor compartment.' },
      { title: 'Power cable', body: 'A submersible cable runs from the motor through a sealed cable entry to the control panel or starter at the surface.' },
    ],
    features: [
      { title: 'No priming', body: 'The pump is flooded at all times, so it does not need to be primed before starting.' },
      { title: 'No suction lift limit', body: 'Water is pushed from below, so depth to water is not restricted by atmospheric suction limits.' },
      { title: 'Quiet at the surface', body: 'Noise and vibration are contained under water, which suits residential installations.' },
      { title: 'Compact installation', body: 'No pump house or foundation is needed at the surface for the pump itself.' },
    ],
    applications: ['apartments', 'villas', 'housing-societies', 'borewell-overhead-tank', 'construction', 'process-water'],
    specs: pendingSpecs([{ label: 'Installation', value: 'Fully submerged', hint: 'Pump type characteristic' }]),
    selectionInputs: [
      'Water source: sump, tank, open well or borewell',
      'Depth to water and total height to the delivery point',
      'Required flow at the point of use',
      'Available power supply: single phase or three phase',
      'Water quality: clear, sandy or containing solids',
    ],
    documents: [],
    related: ['borewell-pumps', 'openwell-pumps', 'monoblock-pumps'],
    schematic: 'submersible',
  },
  {
    slug: 'borewell-pumps',
    index: '02',
    name: 'Borewell Pumps',
    summary: 'Slim multistage submersible pump sets built to fit inside a borewell casing.',
    position: 'Inside the bore, below water level',
    waterSource: 'Borewells and tubewells',
    priming: 'Not required',
    overview: [
      'Borewell pumps are submersible pump sets with a narrow outer diameter so they can be lowered into a drilled bore. The motor sits at the bottom of the set and drives a stack of pump stages above it.',
      'Each stage adds head, so a borewell set is configured with the number of stages needed to lift water from the pumping level in the bore to the delivery point. Correct selection depends on the bore diameter, the water level during pumping and the yield of the bore.',
    ],
    construction: [
      { title: 'Submersible motor', body: 'A water-filled or oil-filled motor at the base of the set, cooled by water flowing past it toward the intake.' },
      { title: 'Suction interconnector', body: 'The intake screen between motor and pump, where water enters the first stage.' },
      { title: 'Multistage pump', body: 'Stacked impellers and diffusers. Head increases with each stage added.' },
      { title: 'Non-return valve and riser', body: 'A non-return valve at the pump outlet holds the water column in the riser pipe when the pump stops.' },
    ],
    features: [
      { title: 'Sized to the bore', body: 'Sets are specified by the internal diameter of the bore casing they must pass through.' },
      { title: 'Configurable head', body: 'The number of stages is matched to the total head of the installation.' },
      { title: 'Deep water levels', body: 'Pushing water from below allows operation where the water level is far below ground.' },
      { title: 'Surface control', body: 'Starting, stopping and protection are handled by a control panel at the surface.' },
    ],
    applications: ['borewell-overhead-tank', 'apartments', 'villas', 'housing-societies', 'drip-irrigation', 'sprinkler-systems', 'flood-irrigation'],
    specs: pendingSpecs([
      { label: 'Bore size', value: null, hint: 'Minimum casing ID' },
      { label: 'Number of stages', value: null, hint: 'Per model' },
    ]),
    selectionInputs: [
      'Bore diameter and total depth',
      'Static and pumping water level',
      'Bore yield, if a yield test is available',
      'Height and distance to the tank or delivery point',
      'Available power supply: single phase or three phase',
    ],
    documents: [],
    related: ['submersible-pumps', 'agriculture-pumps', 'openwell-pumps'],
    schematic: 'borewell',
  },
  {
    slug: 'openwell-pumps',
    index: '03',
    name: 'Openwell Pumps',
    summary: 'Submersible pumps for open wells, sumps and tanks where the water source is wide and accessible.',
    position: 'Submerged in the well or sump',
    waterSource: 'Open wells, sumps, tanks, ponds',
    priming: 'Not required',
    overview: [
      'Openwell pumps are submersible units designed for wide water sources such as dug wells, sumps and storage tanks. They are not constrained by a bore casing, so the motor and pump can be built to a larger diameter.',
      'They are installed below the water surface, either standing on the floor of the well or suspended, and deliver water to the surface through a delivery pipe. Because the water level in an open well varies through the year, selection takes the lowest expected level into account.',
    ],
    construction: [
      { title: 'Submersible motor', body: 'A sealed motor cooled by the surrounding water.' },
      { title: 'Pump end', body: 'One or more impellers in a casing with an intake screen to keep out debris.' },
      { title: 'Mounting', body: 'Horizontal or vertical arrangements depending on the model and the depth of water available.' },
      { title: 'Delivery', body: 'A delivery pipe or hose from the outlet to the surface, with a non-return valve where required.' },
    ],
    features: [
      { title: 'No priming', body: 'The pump starts flooded, avoiding the priming problems of surface pumps on deep wells.' },
      { title: 'Varying water levels', body: 'The pump can follow the water level down as the well draws down through the season.' },
      { title: 'Protected from weather', body: 'The pump set is not exposed at the surface.' },
      { title: 'Low noise', body: 'Operation is under water.' },
    ],
    applications: ['flood-irrigation', 'sprinkler-systems', 'drip-irrigation', 'canal-lifting', 'villas', 'construction'],
    specs: pendingSpecs([{ label: 'Mounting', value: null, hint: 'Horizontal / vertical' }]),
    selectionInputs: [
      'Well diameter and depth',
      'Lowest expected water level in the well',
      'Height and distance to the delivery point',
      'Required flow for the irrigation method or use',
      'Available power supply',
    ],
    documents: [],
    related: ['submersible-pumps', 'agriculture-pumps', 'monoblock-pumps'],
    schematic: 'openwell',
  },
  {
    slug: 'agriculture-pumps',
    index: '04',
    name: 'Agriculture Pumps',
    summary: 'Pumps selected for irrigation duty, matched to the water source and the irrigation method.',
    position: 'Depends on water source',
    waterSource: 'Borewells, open wells, canals, farm ponds',
    priming: 'Depends on pump type',
    overview: [
      'Agricultural pumping is defined by two things: where the water comes from and how it is applied to the field. A borewell, an open well, a canal and a farm pond each call for a different pump type, and drip, sprinkler and flood irrigation each need a different balance of pressure and flow.',
      'This category brings together the borewell, openwell and monoblock pumps used for irrigation, selected for the duty of the individual farm rather than by power rating alone.',
    ],
    construction: [
      { title: 'Borewell submersible sets', body: 'For drilled bores. Multistage, installed below the pumping water level.' },
      { title: 'Openwell submersibles', body: 'For dug wells and farm ponds with a wide, accessible water surface.' },
      { title: 'Monoblock surface pumps', body: 'For canals, ponds and shallow sources close to the pump, installed above water.' },
      { title: 'Controls', body: 'Starters and control panels sized to the motor and the site power supply.' },
    ],
    features: [
      { title: 'Drip irrigation', body: 'Steady, moderate pressure at the emitters with filtration upstream.' },
      { title: 'Sprinkler systems', body: 'Higher pressure to achieve the design throw and spacing of the sprinklers.' },
      { title: 'Flood irrigation', body: 'High volume at low head to fill channels and basins quickly.' },
      { title: 'Canal lifting', body: 'Lifting water a short height from a canal or channel onto the field.' },
    ],
    applications: ['drip-irrigation', 'sprinkler-systems', 'flood-irrigation', 'canal-lifting'],
    specs: pendingSpecs(),
    selectionInputs: [
      'Water source and depth to water',
      'Irrigation method: drip, sprinkler or flood',
      'Field area and crop',
      'Distance and height from source to field',
      'Available power supply and supply hours',
    ],
    documents: [],
    related: ['borewell-pumps', 'openwell-pumps', 'monoblock-pumps'],
    schematic: 'agriculture',
  },
  {
    slug: 'monoblock-pumps',
    index: '05',
    name: 'Monoblock Pumps',
    summary: 'Surface centrifugal pumps with motor and pump on one shaft in a single compact unit.',
    position: 'Above water, at the surface',
    waterSource: 'Sumps, tanks, canals, shallow sources',
    priming: 'Required',
    overview: [
      'In a monoblock pump the pump impeller is mounted directly on the extended shaft of the motor, so the motor and pump form a single block with no separate coupling. The unit is installed on a level base at the surface and draws water through a suction pipe.',
      'Because a surface pump lifts water by suction, the suction lift it can achieve is physically limited, so a monoblock pump is installed close to the water level. It needs to be primed before starting, and a foot valve on the suction pipe keeps it primed between runs.',
    ],
    construction: [
      { title: 'Motor', body: 'A surface motor, accessible for inspection and maintenance.' },
      { title: 'Common shaft', body: 'The impeller is fitted to the motor shaft, removing the need for coupling alignment.' },
      { title: 'Volute casing', body: 'Collects water from the impeller and directs it to the delivery branch.' },
      { title: 'Suction and delivery', body: 'Suction pipe with foot valve and strainer, and a delivery pipe to the point of use.' },
    ],
    features: [
      { title: 'Compact unit', body: 'Motor and pump in one block simplify installation on a small base.' },
      { title: 'Accessible', body: 'Installed at the surface, so inspection and servicing do not require lifting the pump out of the water.' },
      { title: 'No coupling alignment', body: 'The shared shaft avoids alignment work between motor and pump.' },
      { title: 'Short suction lines', body: 'Suited to sources close to the pump, such as sumps, tanks and canals.' },
    ],
    applications: ['canal-lifting', 'flood-irrigation', 'apartments', 'manufacturing', 'process-water', 'cooling-systems', 'firefighting'],
    specs: pendingSpecs([{ label: 'Suction / delivery size', value: null, hint: 'mm / inch' }]),
    selectionInputs: [
      'Vertical distance from water level to the pump (suction lift)',
      'Height and distance to the delivery point',
      'Required flow and pressure',
      'Liquid and temperature, for industrial duties',
      'Available power supply',
    ],
    documents: [],
    related: ['agriculture-pumps', 'openwell-pumps', 'submersible-pumps'],
    schematic: 'monoblock',
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const productOptions = products.map((p) => ({ value: p.slug, label: p.name }));
