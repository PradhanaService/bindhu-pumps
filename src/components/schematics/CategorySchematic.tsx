import type { ProductCategory } from '@/content/products';
import styles from './CategorySchematic.module.css';

type Kind = ProductCategory['schematic'];

/**
 * Installation schematics for each pump category. They show where the pump
 * sits relative to the water source. They are generic diagrams of the pump
 * type, not drawings of a specific product, and are labelled "not to scale".
 */
export function CategorySchematic({ kind, title, compact = false }: { kind: Kind; title: string; compact?: boolean }) {
  return (
    <figure className={`${styles.figure} ${compact ? styles.compact : ''}`}>
      <svg viewBox="0 0 480 360" role="img" aria-labelledby={`sch-${kind}-t`} className={styles.svg}>
        <title id={`sch-${kind}-t`}>{title}</title>
        <defs>
          <pattern id={`hatch-${kind}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" className={styles.hatch} />
          </pattern>
        </defs>
        {kind === 'submersible' && <Submersible id={kind} />}
        {kind === 'borewell' && <Borewell id={kind} />}
        {kind === 'openwell' && <Openwell id={kind} />}
        {kind === 'agriculture' && <Agriculture id={kind} />}
        {kind === 'monoblock' && <Monoblock id={kind} />}
      </svg>
      {!compact && <figcaption className={styles.caption}>Schematic. Not to scale.</figcaption>}
    </figure>
  );
}

function Ground({ id, y, x1 = 0, x2 = 480, gaps = [] as [number, number][] }: { id: string; y: number; x1?: number; x2?: number; gaps?: [number, number][] }) {
  // Draw ground line and hatch band, skipping gaps (wells, bores).
  const segs: [number, number][] = [];
  let start = x1;
  for (const [a, b] of gaps) {
    segs.push([start, a]);
    start = b;
  }
  segs.push([start, x2]);
  return (
    <g>
      {segs.map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={y} width={b - a} height={14} fill={`url(#hatch-${id})`} />
          <line x1={a} y1={y} x2={b} y2={y} className={styles.ground} />
        </g>
      ))}
    </g>
  );
}

function Label({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'end' | 'middle' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={styles.text}>
      {children}
    </text>
  );
}

function Leader({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={styles.leader} />
      <circle cx={x1} cy={y1} r={2.2} className={styles.leaderDot} />
    </g>
  );
}

function WaterLevel({ x1, x2, y, label }: { x1: number; x2: number; y: number; label?: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} className={styles.wl} />
      <path d={`M${x2 - 18} ${y - 9} l5 8 l5 -8 z`} className={styles.wlMark} />
      {label && (
        <text x={x2 - 24} y={y - 4} textAnchor="end" className={styles.textWater}>
          {label}
        </text>
      )}
    </g>
  );
}

function Submersible({ id }: { id: string }) {
  return (
    <g>
      <Ground id={id} y={110} gaps={[[150, 330]]} />
      {/* Sump walls */}
      <path d="M150 110 V300 H330 V110" className={styles.wall} />
      <path d="M142 110 V308 H338 V110" className={styles.wallOuter} />
      {/* Water */}
      <rect x={150} y={150} width={180} height={150} className={styles.water} />
      <WaterLevel x1={150} x2={330} y={150} label="WATER LEVEL" />
      {/* Pump on floor */}
      <rect x={170} y={232} width={56} height={60} className={styles.pump} />
      <rect x={176} y={222} width={44} height={10} className={styles.pump} />
      <line x1={170} y1={252} x2={226} y2={252} className={styles.thin} />
      {/* Intake marks */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={180 + i * 12} y1={292} x2={180 + i * 12} y2={286} className={styles.thin} />
      ))}
      {/* Delivery */}
      <path d="M198 222 V70 H420" className={styles.pipe} />
      <path d="M420 62 v16" className={styles.pipe} />
      <path d="M300 70 l-8 -5 v10 z" className={styles.flow} />
      {/* Cable */}
      <path d="M220 226 C 250 200, 290 150, 312 112" className={styles.cable} />
      <Leader x1={226} y1={262} x2={380} y2={262} />
      <Label x={386} y={258}>SUBMERSIBLE</Label>
      <Label x={386} y={272}>PUMP SET</Label>
      <Leader x1={198} y1={170} x2={100} y2={190} />
      <Label x={94} y={186} anchor="end">DELIVERY</Label>
      <Label x={94} y={200} anchor="end">PIPE</Label>
      <Label x={424} y={58}>OUTLET</Label>
      <Label x={20} y={100}>GROUND LEVEL</Label>
    </g>
  );
}

function Borewell({ id }: { id: string }) {
  return (
    <g>
      <Ground id={id} y={96} gaps={[[176, 196]]} />
      {/* Bore casing */}
      <path d="M176 96 V340" className={styles.wall} />
      <path d="M196 96 V340" className={styles.wall} />
      <rect x={176} y={170} width={20} height={170} className={styles.water} />
      <WaterLevel x1={176} x2={196} y={150} />
      <line x1={150} y1={150} x2={176} y2={150} className={styles.dim} />
      <line x1={150} y1={170} x2={176} y2={170} className={styles.dim} />
      <Label x={144} y={154} anchor="end">STATIC LEVEL</Label>
      <Label x={144} y={174} anchor="end">PUMPING LEVEL</Label>
      {/* Pump set: motor at bottom, stages above */}
      <rect x={180} y={290} width={12} height={40} className={styles.pump} />
      <rect x={180} y={248} width={12} height={36} className={styles.pump} />
      {[256, 264, 272].map((y) => (
        <line key={y} x1={180} y1={y} x2={192} y2={y} className={styles.thin} />
      ))}
      <line x1={180} y1={287} x2={192} y2={287} className={styles.thin} />
      {/* Riser */}
      <path d="M186 248 V60 H330 V40" className={styles.pipe} />
      <path d="M260 60 l-8 -5 v10 z" className={styles.flow} />
      {/* Overhead tank */}
      <rect x={300} y={10} width={120} height={50} className={styles.wall} />
      <rect x={300} y={28} width={120} height={32} className={styles.water} />
      <line x1={318} y1={60} x2={318} y2={96} className={styles.wall} />
      <line x1={402} y1={60} x2={402} y2={96} className={styles.wall} />
      <Label x={360} y={2} anchor="middle">OVERHEAD TANK</Label>
      <Leader x1={192} y1={266} x2={260} y2={266} />
      <Label x={266} y={262}>MULTISTAGE PUMP</Label>
      <Leader x1={192} y1={310} x2={260} y2={310} />
      <Label x={266} y={306}>SUBMERSIBLE MOTOR</Label>
      <Leader x1={196} y1={210} x2={260} y2={210} />
      <Label x={266} y={206}>BORE CASING</Label>
      <Label x={266} y={220}>RISER PIPE</Label>
      <Label x={20} y={88}>GROUND LEVEL</Label>
    </g>
  );
}

function Openwell({ id }: { id: string }) {
  return (
    <g>
      <Ground id={id} y={96} gaps={[[110, 370]]} />
      {/* Masonry well walls */}
      <rect x={96} y={96} width={14} height={240} fill={`url(#hatch-${id})`} className={styles.wall} />
      <rect x={370} y={96} width={14} height={240} fill={`url(#hatch-${id})`} className={styles.wall} />
      <line x1={110} y1={336} x2={370} y2={336} className={styles.wall} />
      <rect x={110} y={196} width={260} height={140} className={styles.water} />
      <WaterLevel x1={110} x2={370} y={196} label="LOWEST EXPECTED LEVEL" />
      <line x1={110} y1={166} x2={370} y2={166} className={styles.wlFaint} />
      <Label x={300} y={160} anchor="end">SEASONAL HIGH</Label>
      {/* Horizontal openwell pump */}
      <rect x={150} y={300} width={90} height={30} className={styles.pump} />
      <rect x={240} y={306} width={28} height={18} className={styles.pump} />
      <line x1={190} y1={300} x2={190} y2={330} className={styles.thin} />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={272 + i * 5} y1={308} x2={272 + i * 5} y2={322} className={styles.thin} />
      ))}
      {/* Delivery */}
      <path d="M254 306 V60 H460" className={styles.pipe} />
      <path d="M380 60 l-8 -5 v10 z" className={styles.flow} />
      <path d="M166 300 C 150 250, 130 160, 122 100" className={styles.cable} />
      <Leader x1={196} y1={316} x2={196} y2={350} />
      <Label x={202} y={354}>OPENWELL SUBMERSIBLE</Label>
      <Label x={262} y={140}>DELIVERY</Label>
      <Label x={20} y={88}>GROUND LEVEL</Label>
    </g>
  );
}

function Agriculture({ id }: { id: string }) {
  return (
    <g>
      <Ground id={id} y={190} gaps={[[40, 70]]} />
      <path d="M40 190 V340 M70 190 V340" className={styles.wall} />
      <rect x={40} y={240} width={30} height={100} className={styles.water} />
      <WaterLevel x1={40} x2={70} y={240} />
      <rect x={49} y={290} width={12} height={40} className={styles.pump} />
      <line x1={49} y1={310} x2={61} y2={310} className={styles.thin} />
      <path d="M55 290 V160 H460" className={styles.pipe} />
      <path d="M130 160 l-8 -5 v10 z" className={styles.flow} />
      {/* Filter */}
      <rect x={150} y={148} width={22} height={24} className={styles.thin} fill="none" />
      <Label x={161} y={140} anchor="middle">FILTER</Label>
      {/* Drip laterals */}
      {[220, 260, 300].map((x) => (
        <g key={x}>
          <line x1={x} y1={160} x2={x} y2={186} className={styles.thin} />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={x} cy={186} r={2} className={styles.leaderDot} />
          ))}
          <path d={`M${x - 10} 190 q10 -14 20 0`} className={styles.crop} />
        </g>
      ))}
      <Label x={260} y={226} anchor="middle">DRIP LINES</Label>
      {/* Sprinkler */}
      {[370, 430].map((x) => (
        <g key={x}>
          <line x1={x} y1={160} x2={x} y2={110} className={styles.pipeThin} />
          <path d={`M${x} 108 q-30 -36 -54 6 M${x} 108 q30 -36 54 6`} className={styles.spray} />
        </g>
      ))}
      <Label x={400} y={226} anchor="middle">SPRINKLERS</Label>
      <Leader x1={61} y1={310} x2={110} y2={310} />
      <Label x={116} y={306}>PUMP AT SOURCE</Label>
      <Label x={116} y={320}>BORE, WELL OR POND</Label>
      <Label x={20} y={30}>SOURCE TO FIELD</Label>
    </g>
  );
}

function Monoblock({ id }: { id: string }) {
  return (
    <g>
      <Ground id={id} y={170} gaps={[[260, 420]]} />
      <path d="M260 170 V330 H420 V170" className={styles.wall} />
      <rect x={260} y={220} width={160} height={110} className={styles.water} />
      <WaterLevel x1={260} x2={420} y={220} label="WATER LEVEL" />
      {/* Plinth */}
      <rect x={80} y={150} width={150} height={20} fill={`url(#hatch-${id})`} className={styles.wall} />
      {/* Motor + pump block */}
      <rect x={92} y={96} width={76} height={50} className={styles.pump} />
      {[104, 116, 128, 140, 152].map((x) => (
        <line key={x} x1={x} y1={100} x2={x} y2={142} className={styles.thin} />
      ))}
      <circle cx={192} cy={118} r={26} className={styles.pump} />
      <rect x={168} y={140} width={46} height={10} className={styles.pump} />
      {/* Suction */}
      <path d="M218 118 H340 V300" className={styles.pipe} />
      <rect x={333} y={300} width={14} height={16} className={styles.pump} />
      <path d="M300 200 l0 -8 l-6 4 z" className={styles.flow} transform="rotate(180 297 196)" />
      {/* Delivery */}
      <path d="M192 92 V40 H40" className={styles.pipe} />
      <path d="M110 40 l-8 -5 v10 z" className={styles.flow} transform="rotate(180 106 40)" />
      {/* Suction lift dimension */}
      <line x1={440} y1={118} x2={440} y2={220} className={styles.dim} />
      <path d="M436 124 l4 -6 l4 6 M436 214 l4 6 l4 -6" className={styles.dim} />
      <line x1={430} y1={118} x2={450} y2={118} className={styles.dimFaint} />
      <Label x={452} y={160}>SUCTION</Label>
      <Label x={452} y={174}>LIFT</Label>
      <Leader x1={130} y1={120} x2={60} y2={200} />
      <Label x={20} y={214}>MOTOR</Label>
      <Leader x1={192} y1={124} x2={192} y2={220} />
      <Label x={150} y={234}>VOLUTE</Label>
      <Leader x1={347} y1={308} x2={440} y2={308} />
      <Label x={380} y={300}>FOOT VALVE</Label>
      <Label x={40} y={30}>DELIVERY</Label>
    </g>
  );
}
