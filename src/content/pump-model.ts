/**
 * Interactive reference model data.
 *
 * Geometry source: the supplied SolidWorks 2023 STEP file (AP214, 7 solid
 * bodies), tessellated with OpenCascade and exported to GLB with meshopt
 * compression. See scripts/cad/README.md.
 *
 * Units: the GLB is in metres. The viewer scales it by 10, so 1 scene unit = 100 mm.
 * All coordinates below are scene units measured from the CAD:
 *   origin = centre of the housing footprint, y = 0 at the housing base,
 *   +z = pump end (front), -z = cable (rear).
 *
 * The supplied CAD is an exterior model. It contains the housing, pump end,
 * four cover screws and the power cord. Internal parts (motor, shaft,
 * impeller, seals) are not part of the file. They are described in text and
 * are never drawn, so no internal geometry is invented.
 */

export type Vec3 = [number, number, number];

export type ModelPart = {
  id: string;
  name: string;
  /** GLB node names that belong to this part. */
  nodes: string[];
  /** Direction and distance (scene units) the part moves in exploded view. */
  explode: Vec3;
  material: 'housing' | 'polymer' | 'rubber' | 'steel';
};

export type Hotspot = {
  id: string;
  label: string;
  /** Part the hotspot belongs to; the hotspot follows it in exploded view. */
  part: string;
  anchor: Vec3;
  /** Short measured label, from the CAD. */
  measure?: string;
  summary: string;
  detail: string;
  /** Camera view that frames this component. */
  view: ViewId;
};

export type ViewId = 'iso' | 'front' | 'side' | 'top' | 'rear';

export const MODEL_URL = '/models/reference-pump.glb';
export const MODEL_SCALE = 10;

export const parts: ModelPart[] = [
  { id: 'housing', name: 'Motor housing', nodes: ['housing'], explode: [0, 0, 0], material: 'housing' },
  { id: 'pump_end', name: 'Pump end', nodes: ['pump_end'], explode: [0, 0, 1.1], material: 'polymer' },
  { id: 'fasteners', name: 'Cover screws', nodes: ['screw_1', 'screw_2', 'screw_3', 'screw_4'], explode: [0, 0.75, 0], material: 'steel' },
  { id: 'cord', name: 'Power cord', nodes: ['cord'], explode: [0, 0, -1.1], material: 'rubber' },
];

export const hotspots: Hotspot[] = [
  {
    id: 'housing',
    label: 'Motor housing',
    part: 'housing',
    anchor: [-0.52, 0.66, -0.25],
    measure: '112.5 × 139 × 124.5 mm',
    summary: 'Sealed enclosure for the motor, with a bolted top cover.',
    detail:
      'In a submersible pump the motor runs inside a watertight enclosure and the surrounding water carries heat away from it. The housing on this model tapers toward the base and carries the top cover, which is secured at four corners. The motor itself is not part of the supplied CAD.',
    view: 'side',
  },
  {
    id: 'pump_end',
    label: 'Pump end and volute',
    part: 'pump_end',
    anchor: [-0.45, 0.42, 0.98],
    measure: '90 mm wide',
    summary: 'Casing that contains the impeller and guides water to the outlet.',
    detail:
      'The impeller, driven by the motor shaft, spins inside this casing. Water entering at the centre is thrown outward and collected by the volute, which converts velocity into pressure and directs it to the discharge. The impeller and shaft are inside the casing and are not included in the supplied CAD.',
    view: 'iso',
  },
  {
    id: 'intake',
    label: 'Intake screen',
    part: 'pump_end',
    anchor: [0, 0.52, 1.257],
    measure: '70 × 70 mm face',
    summary: 'Perforated face where water enters the pump.',
    detail:
      'The perforated face plate lets water into the pump end while limiting the size of solids that can reach the impeller. Keeping the screen clear maintains flow; a blocked screen starves the pump.',
    view: 'front',
  },
  {
    id: 'discharge',
    label: 'Discharge outlet',
    part: 'pump_end',
    anchor: [-0.335, 1.177, 0.787],
    measure: 'Ø21.6 mm over thread',
    summary: 'Threaded spigot for the delivery pipe or hose.',
    detail:
      'Pressurised water leaves the volute through this vertical threaded spigot. The delivery pipe or hose adaptor screws onto it. The thread diameter shown is measured from the CAD; the thread standard is not specified in the file.',
    view: 'iso',
  },
  {
    id: 'fasteners',
    label: 'Cover screws',
    part: 'fasteners',
    anchor: [-0.483, 1.134, 0.543],
    measure: '4 corner screws',
    summary: 'Truss-head screws securing the top cover.',
    detail:
      'Four screws sit in recessed corners of the top cover and clamp it to the housing body. In exploded view they lift clear to show their position. The CAD names them as extra-wide truss head Phillips screws.',
    view: 'top',
  },
  {
    id: 'cord',
    label: 'Power cord and plug',
    part: 'cord',
    anchor: [0, 1.2, -0.68],
    measure: 'Exits at rear',
    summary: 'Supply cable leaving the rear of the housing.',
    detail:
      'The cable leaves the housing through a sealed entry at the rear. The reference model is fitted with a three-pin North American plug. Supply cable, plug and voltage are specified for the market and site where a pump is installed.',
    view: 'rear',
  },
];

export const notModelled = [
  { name: 'Motor stator and rotor', note: 'Inside the sealed housing.' },
  { name: 'Shaft', note: 'Connects the motor rotor to the impeller.' },
  { name: 'Impeller', note: 'Inside the pump end, behind the intake screen.' },
  { name: 'Shaft seal', note: 'Separates the pump end from the motor compartment.' },
];

/** Camera presets: position and target in scene units. */
export const views: Record<ViewId, { label: string; position: Vec3; target: Vec3 }> = {
  iso: { label: 'Three-quarter', position: [-3.1, 2.6, 3.6], target: [0, 0.62, -0.4] },
  front: { label: 'Front', position: [0, 0.75, 4.4], target: [0, 0.62, 0.2] },
  side: { label: 'Side', position: [-4.8, 1.3, -0.6], target: [0, 0.62, -0.6] },
  top: { label: 'Top', position: [0.01, 5.2, 0.2], target: [0, 0.6, -0.4] },
  rear: { label: 'Rear', position: [2.6, 2.2, -5.2], target: [0, 0.62, -1.1] },
};

export const modelFacts = [
  { label: 'Source', value: 'Supplied STEP file, SolidWorks 2023' },
  { label: 'Bodies', value: '7 solids' },
  { label: 'Housing', value: '112.5 W × 139 H × 124.5 D mm' },
  { label: 'Length, housing and pump end', value: '188 mm' },
  { label: 'Web mesh', value: '≈52,000 triangles, 420 KB' },
];
