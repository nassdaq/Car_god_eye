export type SystemId =
  | 'powertrain'
  | 'drivetrain'
  | 'chassis'
  | 'suspension'
  | 'brakes'
  | 'wheels'
  | 'thermal'
  | 'electrical'
  | 'body'
  | 'interior'

export interface SystemInfo {
  id: SystemId
  label: string
  color: string
}

export const SYSTEMS: SystemInfo[] = [
  { id: 'powertrain', label: 'POWERTRAIN', color: '#ff6b35' },
  { id: 'drivetrain', label: 'DRIVETRAIN', color: '#ffc53d' },
  { id: 'thermal', label: 'THERMAL', color: '#38d9f5' },
  { id: 'electrical', label: 'ELECTRICAL', color: '#ffe94d' },
  { id: 'chassis', label: 'CHASSIS', color: '#8ea2c6' },
  { id: 'suspension', label: 'SUSPENSION', color: '#b388ff' },
  { id: 'brakes', label: 'BRAKES', color: '#ff2d7a' },
  { id: 'wheels', label: 'WHEELS', color: '#6ee7b7' },
  { id: 'body', label: 'BODY', color: '#00f0ff' },
  { id: 'interior', label: 'INTERIOR', color: '#cfd8e3' },
]

export const systemColor = (id: SystemId) =>
  SYSTEMS.find((s) => s.id === id)!.color

export interface MaterialLayer {
  name: string
  cls: string
  composition: { element: string; pct: number }[]
  process: string
  why: string
  props: { label: string; value: string }[]
}

export interface Part {
  id: string
  code: string
  name: string
  system: SystemId
  mass: string
  summary: string
  operation: string[]
  fasteners?: string
  materials: MaterialLayer[]
  /** legacy top-level view hints (views own layout now) */
  focus?: [number, number, number]
  camDist?: number
  explode?: [number, number, number]
  children?: Part[]
  /** reference literature this node's breakdown follows */
  refs?: string[]
  /** generated deep-zoom view selector, e.g. 'micro:pearlite' or 'lat:bcc' */
  viewKind?: string
}

export const PARTS: Part[] = [
  {
    id: 'engine',
    code: 'PWR-01',
    name: 'ENGINE BLOCK — INLINE-4 TURBO',
    system: 'powertrain',
    mass: '112 kg',
    summary:
      'Converts fuel into rotation. Four pistons fire in sequence 1-3-4-2, spinning the crankshaft up to 7,200 RPM.',
    operation: [
      'INTAKE — piston drops, pulling compressed air from the turbo through open intake valves.',
      'COMPRESSION — piston rises, squeezing the air/fuel mix to ~10:1 before the spark.',
      'POWER — spark plug ignites the charge; expanding gas slams the piston down with ~2 tonnes of force.',
      'EXHAUST — piston rises again, pushing burnt gas out toward the turbine.',
    ],
    fasteners: 'M11×1.5 head bolts, ARP2000 steel, torque-to-yield 30Nm + 90°+90°',
    materials: [
      {
        name: 'A356-T6 CAST ALUMINUM',
        cls: 'Aluminum–silicon alloy · block casting',
        composition: [
          { element: 'Al', pct: 91.1 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
          { element: 'Fe', pct: 0.2 },
          { element: 'Ti', pct: 0.2 },
        ],
        process: 'Low-pressure die cast → T6 heat treat (solution 540°C, age 155°C)',
        why: 'Half the weight of cast iron with 3× the thermal conductivity — pulls heat out of the combustion chambers fast.',
        props: [
          { label: 'DENSITY', value: '2.68 g/cm³' },
          { label: 'TENSILE', value: '310 MPa' },
          { label: 'MELTING PT', value: '615°C' },
        ],
      },
      {
        name: 'GG25 GRAY CAST IRON',
        cls: 'Flake-graphite iron · cylinder liners',
        composition: [
          { element: 'Fe', pct: 93.4 },
          { element: 'C', pct: 3.3 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Centrifugally cast sleeves, press-fit into the aluminum bores',
        why: 'Graphite flakes act as built-in dry lubricant — the piston rings need a surface that survives 100 million strokes.',
        props: [
          { label: 'HARDNESS', value: '200 HB' },
          { label: 'WEAR RATE', value: '<1 µm / 10,000 km' },
        ],
      },
      {
        name: '42CrMo4 FORGED STEEL',
        cls: 'Chromium-moly steel · crankshaft',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'C', pct: 0.42 },
          { element: 'Cr', pct: 1.1 },
          { element: 'Mo', pct: 0.22 },
          { element: 'Mn', pct: 0.75 },
        ],
        process: 'Drop-forged, nitrided journals, dynamically balanced to 0.5 g·cm',
        why: 'Each power stroke hammers the crank with tonnes of load — forged grain flow follows the crank throws for fatigue life.',
        props: [
          { label: 'TENSILE', value: '1,000 MPa' },
          { label: 'FATIGUE LIMIT', value: '10⁸ cycles' },
        ],
      },
    ],
    focus: [1.25, 0.62, 0],
    camDist: 2.6,
    explode: [0, 1.1, 0],
  },
  {
    id: 'turbo',
    code: 'PWR-02',
    name: 'TURBOCHARGER',
    system: 'powertrain',
    mass: '8.4 kg',
    summary:
      'A windmill driven by exhaust gas. Spins to 180,000 RPM and force-feeds the engine 2× the air it could breathe alone.',
    operation: [
      'Hot exhaust gas (up to 950°C) blasts the turbine wheel into rotation.',
      'A shared shaft spins the compressor wheel on the cold side.',
      'Compressor rams intake air to ~1.4 bar boost before the intercooler.',
      'Wastegate bleeds exhaust past the turbine to cap boost pressure.',
    ],
    fasteners: 'M8 Inconel locknuts on turbine housing — standard steel would creep at 950°C',
    materials: [
      {
        name: 'INCONEL 713C',
        cls: 'Nickel superalloy · turbine wheel',
        composition: [
          { element: 'Ni', pct: 74.0 },
          { element: 'Cr', pct: 12.5 },
          { element: 'Al', pct: 6.1 },
          { element: 'Mo', pct: 4.2 },
          { element: 'Nb', pct: 2.0 },
        ],
        process: 'Investment cast (lost wax), friction-welded to the shaft',
        why: 'The only affordable material family that holds strength at 950°C while spinning at 180,000 RPM.',
        props: [
          { label: 'MAX SERVICE', value: '980°C' },
          { label: 'TIP SPEED', value: '560 m/s' },
        ],
      },
      {
        name: '2618-T6 ALUMINUM',
        cls: 'Forged aluminum · compressor wheel',
        composition: [
          { element: 'Al', pct: 93.7 },
          { element: 'Cu', pct: 2.3 },
          { element: 'Mg', pct: 1.6 },
          { element: 'Ni', pct: 1.1 },
          { element: 'Fe', pct: 1.1 },
        ],
        process: '5-axis CNC milled from forging — billet wheels survive higher cycle fatigue than cast',
        why: 'Low inertia = fast spool. The cold side only sees ~200°C, so aluminum works and cuts lag.',
        props: [
          { label: 'DENSITY', value: '2.76 g/cm³' },
          { label: 'SPOOL TIME', value: '<0.8 s to full boost' },
        ],
      },
    ],
    focus: [1.0, 0.45, -0.52],
    camDist: 1.9,
    explode: [0, 0.75, -0.9],
  },
  {
    id: 'intake',
    code: 'PWR-03',
    name: 'INTAKE MANIFOLD',
    system: 'powertrain',
    mass: '4.1 kg',
    summary:
      'Splits one stream of boosted air into four equal runners — each tuned in length so pressure waves arrive exactly when a valve opens.',
    operation: [
      'Boosted air from the intercooler fills the plenum chamber.',
      'Four runners feed each cylinder; their length is tuned for resonance at peak torque RPM.',
      'Pressure pulses reflect inside the runners and "supercharge" each intake stroke.',
    ],
    fasteners: 'M6×1.0 class 8.8 flange bolts, 10 Nm, with NBR O-ring seals',
    materials: [
      {
        name: 'PA66-GF35 NYLON',
        cls: 'Glass-filled polyamide · plenum + runners',
        composition: [
          { element: 'PA66', pct: 65 },
          { element: 'Glass fiber', pct: 35 },
        ],
        process: 'Vibration-welded injection moldings — two halves fused without adhesive',
        why: '40% lighter than aluminum, smooth internal surfaces for airflow, and it insulates heat — cooler air is denser air.',
        props: [
          { label: 'MAX TEMP', value: '180°C continuous' },
          { label: 'BURST', value: '>6 bar' },
        ],
      },
    ],
    focus: [1.3, 0.85, 0.3],
    camDist: 1.8,
    explode: [0, 1.5, 0.6],
  },
  {
    id: 'exhaust',
    code: 'PWR-04',
    name: 'EXHAUST SYSTEM',
    system: 'powertrain',
    mass: '19 kg',
    summary:
      'Carries 900°C gas out, strips toxins in the catalyst, and kills 30 dB of noise — while stealing as little power as possible.',
    operation: [
      'Post-turbine gas enters the catalytic converter at ~600°C.',
      'Platinum/palladium/rhodium surfaces convert CO, NOx and hydrocarbons to CO₂, N₂, H₂O.',
      'The muffler cancels sound: chambers reflect pressure waves back onto themselves out of phase.',
    ],
    fasteners: 'M10 copper-plated flange nuts — copper plating stops them seizing after heat cycles',
    materials: [
      {
        name: 'SS409 FERRITIC STAINLESS',
        cls: 'Stainless steel · piping',
        composition: [
          { element: 'Fe', pct: 87.4 },
          { element: 'Cr', pct: 11.2 },
          { element: 'Ti', pct: 0.5 },
          { element: 'C', pct: 0.08 },
        ],
        process: 'Mandrel-bent tube, TIG welded joints',
        why: 'Just enough chromium to survive road salt and condensation acids for 15 years, at a third the cost of 304.',
        props: [
          { label: 'MAX TEMP', value: '815°C' },
          { label: 'WALL', value: '1.2 mm' },
        ],
      },
      {
        name: 'Pt·Pd·Rh WASHCOAT',
        cls: 'Precious-metal catalyst · converter core',
        composition: [
          { element: 'Cordierite', pct: 97.8 },
          { element: 'Pt', pct: 0.9 },
          { element: 'Pd', pct: 0.9 },
          { element: 'Rh', pct: 0.4 },
        ],
        process: 'Ceramic honeycomb (600 cells/in²) dipped in precious-metal slurry',
        why: 'About 4 grams of platinum-group metal does the chemistry — the honeycomb packs a football field of surface area into a can.',
        props: [
          { label: 'LIGHT-OFF', value: '250°C' },
          { label: 'SURFACE AREA', value: '~5,000 m²' },
        ],
      },
    ],
    focus: [-0.6, 0.22, 0.38],
    camDist: 2.6,
    explode: [-0.2, 0.45, 1.2],
  },
  {
    id: 'fueltank',
    code: 'PWR-05',
    name: 'FUEL TANK',
    system: 'powertrain',
    mass: '9 kg (dry)',
    summary:
      '52 litres of fuel in a blow-molded plastic shell, with an in-tank pump pressurizing the line to 5 bar.',
    operation: [
      'In-tank electric pump feeds the engine at ~5 bar through a filter.',
      'Internal baffles stop fuel sloshing away from the pickup in corners.',
      'Carbon canister captures evaporating vapors instead of venting them.',
    ],
    materials: [
      {
        name: 'HDPE 6-LAYER COEX',
        cls: 'Co-extruded polymer · tank shell',
        composition: [
          { element: 'HDPE', pct: 92 },
          { element: 'EVOH barrier', pct: 3 },
          { element: 'Adhesive tie', pct: 3 },
          { element: 'Regrind', pct: 2 },
        ],
        process: 'Blow-molded in one piece; the EVOH layer blocks hydrocarbon permeation',
        why: 'Plastic conforms to leftover space in the floor, never rusts, and crumples without sparking in a crash.',
        props: [
          { label: 'CAPACITY', value: '52 L' },
          { label: 'PERMEATION', value: '<0.1 g/day' },
        ],
      },
    ],
    focus: [-0.85, 0.3, 0],
    camDist: 2.1,
    explode: [-0.4, 0.8, 0.5],
  },
  {
    id: 'transmission',
    code: 'DRV-01',
    name: 'TRANSMISSION — 6-SPEED',
    system: 'drivetrain',
    mass: '48 kg',
    summary:
      'A box of lever arms made of gears. Trades engine speed for wheel torque — 1st gear multiplies torque ×3.6.',
    operation: [
      'Clutch couples the engine to the input shaft.',
      'Synchro rings match gear speeds before dog teeth engage — that is what stops grinding.',
      'Selected gear pair sets the ratio; output shaft feeds the driveshaft.',
    ],
    fasteners: 'M10×1.25 class 10.9 bellhousing bolts, 45 Nm',
    materials: [
      {
        name: '20MnCr5 CASE-HARDENED STEEL',
        cls: 'Gear steel · all gear pairs',
        composition: [
          { element: 'Fe', pct: 97.3 },
          { element: 'Mn', pct: 1.25 },
          { element: 'Cr', pct: 1.15 },
          { element: 'C', pct: 0.2 },
        ],
        process: 'Hobbed, then carburized to 0.8 mm case depth — glass-hard skin, tough core',
        why: 'Gear teeth need two contradictory things: a surface hard enough to resist pitting, a core soft enough not to snap. Case hardening gives both.',
        props: [
          { label: 'SURFACE', value: '60 HRC' },
          { label: 'CORE', value: '36 HRC' },
        ],
      },
      {
        name: 'ADC12 DIE-CAST ALUMINUM',
        cls: 'Aluminum · housing',
        composition: [
          { element: 'Al', pct: 86.5 },
          { element: 'Si', pct: 10.5 },
          { element: 'Cu', pct: 2.0 },
          { element: 'Fe', pct: 0.8 },
        ],
        process: 'High-pressure die cast with integral ribbing for stiffness',
        why: 'Thin-wall casting keeps 48 kg from becoming 70 — and conducts gear heat out to the airstream.',
        props: [{ label: 'WALL', value: '4 mm min' }],
      },
    ],
    focus: [0.55, 0.42, 0],
    camDist: 2.0,
    explode: [0, 0.8, 0.6],
  },
  {
    id: 'driveshaft',
    code: 'DRV-02',
    name: 'DRIVESHAFT',
    system: 'drivetrain',
    mass: '7.2 kg',
    summary:
      'A spinning tube sending up to 450 Nm rearward at 7,000 RPM, with U-joints flexing as the suspension moves.',
    operation: [
      'Transmission output spins the front yoke.',
      'Universal joints let the shaft angle change as the rear axle travels.',
      'Balanced to <10 g·cm — an unbalanced shaft at 7,000 RPM vibrates like a paint shaker.',
    ],
    materials: [
      {
        name: 'E355 DOM STEEL TUBE',
        cls: 'Drawn-over-mandrel steel · shaft body',
        composition: [
          { element: 'Fe', pct: 98.3 },
          { element: 'C', pct: 0.22 },
          { element: 'Mn', pct: 1.3 },
        ],
        process: 'Cold-drawn seamless tube, friction-welded yokes, spin balanced',
        why: 'A hollow tube carries torque almost as well as a solid bar at a quarter of the weight — torsion lives in the outer skin.',
        props: [
          { label: 'OD × WALL', value: '75 × 2.1 mm' },
          { label: 'CRITICAL SPEED', value: '9,400 RPM' },
        ],
      },
    ],
    focus: [-0.4, 0.3, 0],
    camDist: 2.2,
    explode: [0, 0.6, -0.6],
  },
  {
    id: 'differential',
    code: 'DRV-03',
    name: 'REAR DIFFERENTIAL',
    system: 'drivetrain',
    mass: '31 kg',
    summary:
      'Turns the driveshaft 90° toward the wheels and lets the outside wheel spin faster in corners — otherwise tires would scrub and hop.',
    operation: [
      'Hypoid pinion gear drives the ring gear at a 3.73:1 reduction.',
      'Spider gears inside the carrier let left/right wheels rotate at different speeds.',
      'Limited-slip clutch pack locks both wheels together under hard throttle.',
    ],
    fasteners: 'M12×1.25 ring-gear bolts, class 12.9, thread-locked, 95 Nm',
    materials: [
      {
        name: 'SAE 8620 NICKEL-CHROME STEEL',
        cls: 'Carburizing steel · hypoid gearset',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'Ni', pct: 0.55 },
          { element: 'Cr', pct: 0.5 },
          { element: 'Mn', pct: 0.8 },
          { element: 'Mo', pct: 0.2 },
        ],
        process: 'Lapped in matched pairs — pinion and ring are married for life',
        why: 'Hypoid teeth slide as they roll, the harshest gear contact in the car. Needs carburized nickel steel plus extreme-pressure oil.',
        props: [
          { label: 'RATIO', value: '3.73 : 1' },
          { label: 'CONTACT STRESS', value: '2.5 GPa' },
        ],
      },
    ],
    focus: [-1.35, 0.34, 0],
    camDist: 1.9,
    explode: [-1.0, 0.3, 0],
  },
  {
    id: 'chassisframe',
    code: 'CHS-01',
    name: 'CHASSIS FRAME',
    system: 'chassis',
    mass: '87 kg',
    summary:
      'The skeleton. Every force in the car — engine torque, cornering load, crash energy — eventually passes through these rails.',
    operation: [
      'Front/rear crumple zones fold in programmed stages, absorbing crash energy.',
      'The passenger cell stays rigid: ultra-high-strength steel refuses to deform.',
      'Torsional stiffness (~28,000 Nm/deg) is what makes steering feel precise.',
    ],
    fasteners: 'Self-piercing rivets + 120 m of structural adhesive bond the mixed metals',
    materials: [
      {
        name: '22MnB5 HOT-STAMPED BORON STEEL',
        cls: 'Ultra-high-strength steel · safety cell',
        composition: [
          { element: 'Fe', pct: 97.6 },
          { element: 'Mn', pct: 1.25 },
          { element: 'C', pct: 0.23 },
          { element: 'B', pct: 0.003 },
        ],
        process: 'Heated to 930°C, stamped, quenched in the die at 50°C/s — forms martensite in shape',
        why: '1,500 MPa after quench — three times normal steel. The cage around you is the one part that must never bend.',
        props: [
          { label: 'TENSILE', value: '1,500 MPa' },
          { label: 'THICKNESS', value: '1.6 mm' },
        ],
      },
      {
        name: '6061-T6 EXTRUDED ALUMINUM',
        cls: 'Aluminum · crush rails',
        composition: [
          { element: 'Al', pct: 97.3 },
          { element: 'Mg', pct: 1.0 },
          { element: 'Si', pct: 0.6 },
          { element: 'Cu', pct: 0.28 },
        ],
        process: 'Multi-cell extrusions designed to fold like an accordion under axial load',
        why: 'Aluminum absorbs more crash energy per kilogram than steel when it crumples — and these rails are built to crumple.',
        props: [
          { label: 'ENERGY ABSORB', value: '25 kJ/kg' },
        ],
      },
    ],
    focus: [0, 0.3, 0],
    camDist: 3.4,
    explode: [0, 0, 0],
  },
  {
    id: 'suspension',
    code: 'SUS-01',
    name: 'FRONT SUSPENSION — COILOVER',
    system: 'suspension',
    mass: '14 kg / corner',
    summary:
      'Spring stores the bump; damper burns it as heat. Together they keep the tire pressed to the road over every ripple.',
    operation: [
      'Wishbone arms locate the wheel, allowing only vertical travel.',
      'Coil spring compresses over bumps, storing energy.',
      'Damper piston forces oil through tuned valves — converting motion to heat, stopping the bounce.',
      'Anti-roll bar ties left to right, resisting body lean in corners.',
    ],
    fasteners: 'M14×1.5 class 10.9 lower ball joint, castellated nut + cotter pin, 110 Nm',
    materials: [
      {
        name: '54SiCr6 SPRING STEEL',
        cls: 'Silicon-chrome steel · coil spring',
        composition: [
          { element: 'Fe', pct: 96.4 },
          { element: 'Si', pct: 1.45 },
          { element: 'Cr', pct: 0.65 },
          { element: 'C', pct: 0.55 },
        ],
        process: 'Hot-coiled, shot-peened, preset — surface compression stops fatigue cracks starting',
        why: 'Silicon lets the steel store enormous elastic energy and spring back a million times without sagging.',
        props: [
          { label: 'SPRING RATE', value: '55 N/mm' },
          { label: 'FATIGUE LIFE', value: '>10⁶ cycles' },
        ],
      },
      {
        name: '7075-T6 FORGED ALUMINUM',
        cls: 'Aerospace aluminum · control arms',
        composition: [
          { element: 'Al', pct: 90.0 },
          { element: 'Zn', pct: 5.6 },
          { element: 'Mg', pct: 2.5 },
          { element: 'Cu', pct: 1.6 },
        ],
        process: 'Closed-die forged — grain flows along the wishbone arms',
        why: 'Unsprung weight is the enemy: every gram the wheel carries fights the damper. 7075 matches steel strength at 1/3 the density.',
        props: [
          { label: 'TENSILE', value: '572 MPa' },
          { label: 'VS STEEL ARM', value: '-42% mass' },
        ],
      },
    ],
    focus: [1.35, 0.42, 0.72],
    camDist: 1.9,
    explode: [0.4, 0.8, 0.8],
  },
  {
    id: 'brakes',
    code: 'BRK-01',
    name: 'BRAKE SYSTEM',
    system: 'brakes',
    mass: '11 kg / corner',
    summary:
      'Converts 100 km/h into heat in under 3 seconds. The discs briefly glow at 600°C doing it — braking power is ~10× engine power.',
    operation: [
      'Pedal force is multiplied ~4× by the booster, pressurizing brake fluid to 80+ bar.',
      'Caliper pistons clamp the pads onto the spinning disc.',
      'Friction converts kinetic energy to heat; vanes inside the disc pump air to shed it.',
      'ABS releases/reapplies pressure 15×/sec if a wheel starts to lock.',
    ],
    fasteners: 'M12×1.5 class 10.9 caliper bracket bolts, 118 Nm, thread-locked',
    materials: [
      {
        name: 'G3000 GRAY CAST IRON',
        cls: 'High-carbon iron · ventilated disc',
        composition: [
          { element: 'Fe', pct: 93.0 },
          { element: 'C', pct: 3.4 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
          { element: 'Cu', pct: 0.4 },
        ],
        process: 'Sand cast with internal cooling vanes, CNC faced to 0.01 mm runout',
        why: 'Graphite flakes conduct heat and damp squeal. Iron is heavy — but it soaks heat like nothing else at the price.',
        props: [
          { label: 'MAX TEMP', value: '650°C service' },
          { label: 'HEAT CAPACITY', value: '460 J/kg·K' },
        ],
      },
      {
        name: 'SEMI-METALLIC FRICTION PAD',
        cls: 'Composite · brake pads',
        composition: [
          { element: 'Steel fiber', pct: 30 },
          { element: 'Graphite', pct: 15 },
          { element: 'Phenolic resin', pct: 20 },
          { element: 'Barite filler', pct: 20 },
          { element: 'Cu/brass chips', pct: 10 },
          { element: 'Aramid', pct: 5 },
        ],
        process: 'Hot-pressed at 160°C, then scorched to pre-burn surface resins',
        why: 'A friction recipe: steel bites, graphite smooths, resin binds, barite stabilizes the friction coefficient from -20°C to 600°C.',
        props: [
          { label: 'FRICTION µ', value: '0.42 ±0.05' },
          { label: 'PAD LIFE', value: '~50,000 km' },
        ],
      },
      {
        name: 'A356-T6 ALUMINUM CALIPER',
        cls: 'Aluminum · 4-piston caliper',
        composition: [
          { element: 'Al', pct: 92.0 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
        ],
        process: 'Gravity cast, hard-anodized bores, EPDM seals',
        why: 'Unsprung and rotating with the wheel assembly — aluminum keeps clamp stiffness without the mass penalty.',
        props: [{ label: 'CLAMP FORCE', value: '45 kN' }],
      },
    ],
    focus: [1.35, 0.34, -0.72],
    camDist: 1.6,
    explode: [0.3, 0.3, -1.0],
  },
  {
    id: 'wheels',
    code: 'WHL-01',
    name: 'WHEEL + TIRE',
    system: 'wheels',
    mass: '21 kg / corner',
    summary:
      'Four contact patches, each the size of your palm. Every force the car makes — accelerating, braking, turning — passes through them.',
    operation: [
      'Tire carcass flexes so the contact patch stays flat on the road.',
      'Tread blocks interlock with road texture; silica compound grips even wet asphalt.',
      'Steel belts stop the tread squirming; the bead clamps the rim air-tight.',
    ],
    fasteners: 'M14×1.5 wheel studs, class 10.9, conical seat nuts @ 130 Nm — star pattern',
    materials: [
      {
        name: 'SILICA TREAD COMPOUND',
        cls: 'Elastomer blend · tire tread',
        composition: [
          { element: 'SBR rubber', pct: 40 },
          { element: 'Natural rubber', pct: 15 },
          { element: 'Silica', pct: 25 },
          { element: 'Carbon black', pct: 10 },
          { element: 'Oils + sulfur', pct: 10 },
        ],
        process: 'Mixed, extruded, vulcanized in a mold at 170°C — sulfur cross-links the chains',
        why: 'Silica replaced carbon black for wet grip: it keeps the rubber flexible at low temperature so it can key into wet-road texture.',
        props: [
          { label: 'WET GRIP µ', value: '~1.0' },
          { label: 'TREAD LIFE', value: '40,000 km' },
        ],
      },
      {
        name: 'STEEL BELT PACKAGE',
        cls: 'Brass-coated steel cord · under tread',
        composition: [
          { element: 'Steel cord', pct: 70 },
          { element: 'Brass coating', pct: 2 },
          { element: 'Skim rubber', pct: 28 },
        ],
        process: '0.25 mm wires twisted into cord, laid at ±22° crossed plies',
        why: 'Crossed steel plies form a stiff ring that keeps the tread flat under cornering load — brass makes rubber bond to steel.',
        props: [{ label: 'BURST MARGIN', value: '>8 bar' }],
      },
      {
        name: 'A356-T6 FLOW-FORMED WHEEL',
        cls: 'Aluminum · rim',
        composition: [
          { element: 'Al', pct: 92.0 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
        ],
        process: 'Cast center, then rollers stretch the barrel — flow-forming aligns grain like forging',
        why: 'Rotating mass counts double: a kilogram off the rim is worth two off the body for acceleration.',
        props: [
          { label: 'SIZE', value: '19 × 8.5 J' },
          { label: 'MASS', value: '9.8 kg' },
        ],
      },
    ],
    focus: [-1.35, 0.34, 0.78],
    camDist: 1.8,
    explode: [0, 0, 1.2],
  },
  {
    id: 'radiator',
    code: 'THM-01',
    name: 'RADIATOR + COOLING',
    system: 'thermal',
    mass: '6.8 kg (wet)',
    summary:
      'The engine wastes two-thirds of fuel energy as heat. This aluminum lung dumps up to 60 kW of it into passing air.',
    operation: [
      'Water pump circulates coolant through the block at ~150 L/min.',
      'Thermostat holds coolant at 90°C — opens only when warm.',
      'Hot coolant threads through flat micro-tubes; louvered fins strip the heat into airflow.',
      'Electric fan forces airflow when the car is stationary.',
    ],
    materials: [
      {
        name: 'AA3003 BRAZED ALUMINUM',
        cls: 'Manganese aluminum · core',
        composition: [
          { element: 'Al', pct: 97.8 },
          { element: 'Mn', pct: 1.2 },
          { element: 'Cu', pct: 0.12 },
        ],
        process: 'Entire core furnace-brazed in one shot at 600°C — 2,000 joints simultaneously',
        why: 'Corrosion-resistant without coatings, light, and brazing clads every tube-to-fin joint for full thermal contact.',
        props: [
          { label: 'HEAT REJECT', value: '60 kW max' },
          { label: 'FIN DENSITY', value: '18 fins/inch' },
        ],
      },
      {
        name: 'ETHYLENE GLYCOL 50/50',
        cls: 'Working fluid · coolant',
        composition: [
          { element: 'Water', pct: 50 },
          { element: 'Ethylene glycol', pct: 48 },
          { element: 'OAT inhibitors', pct: 2 },
        ],
        process: 'Pressurized to 1.4 bar — raising the boiling point to 126°C',
        why: 'Pure water boils and freezes; glycol shifts both limits (-37°C to +126°C) and the inhibitors stop the aluminum corroding.',
        props: [{ label: 'RANGE', value: '-37°C → 126°C' }],
      },
    ],
    focus: [1.95, 0.5, 0],
    camDist: 1.9,
    explode: [1.1, 0.2, 0],
  },
  {
    id: 'battery',
    code: 'ELE-01',
    name: '12V AGM BATTERY',
    system: 'electrical',
    mass: '18 kg',
    summary:
      'A 200-year-old chemistry, still here because nothing else delivers 760 cranking amps at -18°C for the price.',
    operation: [
      'Lead dioxide + sponge lead plates in sulfuric acid: 2.1V per cell, six cells in series.',
      'Discharge converts both plates toward lead sulfate, releasing electrons.',
      'The alternator reverses the reaction while driving — recharging the plates.',
    ],
    fasteners: 'M6 clamp bolt on tapered posts — SAE terminal, 5 Nm max or the post deforms',
    materials: [
      {
        name: 'Pb-Ca GRID ALLOY',
        cls: 'Lead alloy · plates',
        composition: [
          { element: 'Pb', pct: 99.0 },
          { element: 'Ca', pct: 0.08 },
          { element: 'Sn', pct: 0.9 },
        ],
        process: 'Grids cast, pasted with PbO₂ / sponge Pb active mass',
        why: 'Calcium (not antimony) in the grid cuts water loss to near zero — that is what makes it sealed and maintenance-free.',
        props: [
          { label: 'CCA', value: '760 A @ -18°C' },
          { label: 'CAPACITY', value: '70 Ah' },
        ],
      },
      {
        name: 'AGM GLASS MAT',
        cls: 'Absorbed glass separator',
        composition: [
          { element: 'Borosilicate microfiber', pct: 95 },
          { element: 'Organic binder', pct: 5 },
        ],
        process: 'Acid fully absorbed in the mat — no free liquid',
        why: 'Spill-proof at any angle, and plates can be compressed tight, so it shrugs off vibration that kills flooded batteries.',
        props: [{ label: 'MOUNT', value: 'any orientation' }],
      },
    ],
    focus: [1.62, 0.68, -0.5],
    camDist: 1.5,
    explode: [0.4, 0.9, -0.7],
  },
  {
    id: 'ecu',
    code: 'ELE-02',
    name: 'ENGINE CONTROL UNIT',
    system: 'electrical',
    mass: '0.9 kg',
    summary:
      'The brain. Reads 30+ sensors and recalculates fuel, spark and boost for every single combustion event — 60 times a second per cylinder.',
    operation: [
      'Crank sensor reports piston position to 0.1° accuracy.',
      'ECU computes air mass per intake stroke from MAP + temperature sensors.',
      'Injector pulse width and spark timing are set per cylinder, per cycle.',
      'Oxygen sensor feedback trims fuel within ±2% of the ideal 14.7:1 ratio.',
    ],
    fasteners: 'M6 flanged bolts to body ground plane — the case IS the ground reference',
    materials: [
      {
        name: 'FR-4 6-LAYER PCB',
        cls: 'Glass epoxy laminate · board',
        composition: [
          { element: 'Glass fabric', pct: 60 },
          { element: 'Epoxy resin', pct: 38 },
          { element: 'Cu traces', pct: 2 },
        ],
        process: 'Conformal-coated in acrylic — survives condensation, salt mist, 15g vibration',
        why: 'Automotive grade means -40°C to +125°C for 15 years while the engine shakes it. Consumer electronics would die in a month.',
        props: [
          { label: 'CPU', value: '32-bit, 300 MHz lockstep' },
          { label: 'RATING', value: 'AEC-Q100 Grade 1' },
        ],
      },
      {
        name: 'A380 DIE-CAST HOUSING',
        cls: 'Aluminum · enclosure',
        composition: [
          { element: 'Al', pct: 85.5 },
          { element: 'Si', pct: 8.5 },
          { element: 'Cu', pct: 3.5 },
          { element: 'Zn', pct: 2.0 },
        ],
        process: 'Die cast with Gore-Tex vent — equalizes pressure, blocks water',
        why: 'A Faraday cage against ignition noise, a heat sink for the drivers, and IP6K9K sealed against pressure washing.',
        props: [{ label: 'SEALING', value: 'IP6K9K' }],
      },
    ],
    focus: [1.58, 0.68, 0.48],
    camDist: 1.4,
    explode: [0.4, 0.9, 0.7],
  },
  {
    id: 'headlights',
    code: 'ELE-03',
    name: 'LED MATRIX HEADLIGHTS',
    system: 'electrical',
    mass: '3.2 kg each',
    summary:
      '24 individually-switched LED segments per side. High beam stays on while the exact pixels covering oncoming cars switch off.',
    operation: [
      'Camera tracks oncoming headlights and taillights.',
      'Controller maps each vehicle to the LED segments covering it.',
      'Those segments dim in ~10 ms; the rest of the road stays in full high beam.',
    ],
    materials: [
      {
        name: 'InGaN LED DIES',
        cls: 'Semiconductor · emitters',
        composition: [
          { element: 'GaN', pct: 88 },
          { element: 'InGaN wells', pct: 7 },
          { element: 'Phosphor (YAG:Ce)', pct: 5 },
        ],
        process: 'Blue dies + yellow phosphor = white; flip-chip mounted on ceramic',
        why: 'LEDs convert 40% of power to light (halogen: 3%) and switch in nanoseconds — which is what makes matrix beams possible.',
        props: [
          { label: 'OUTPUT', value: '1,400 lm/side' },
          { label: 'COLOR TEMP', value: '5,500 K' },
        ],
      },
      {
        name: 'PC LENS, HARDCOATED',
        cls: 'Polycarbonate · outer lens',
        composition: [
          { element: 'Polycarbonate', pct: 98 },
          { element: 'Siloxane hardcoat', pct: 2 },
        ],
        process: 'Injection molded, plasma-deposited UV hardcoat',
        why: 'Glass shatters on gravel impact; PC takes a stone at 120 km/h. The hardcoat stops it yellowing in sunlight.',
        props: [{ label: 'IMPACT', value: '250× glass' }],
      },
    ],
    focus: [2.12, 0.55, 0.55],
    camDist: 1.5,
    explode: [1.1, 0.35, 0],
  },
  {
    id: 'bodyshell',
    code: 'BDY-01',
    name: 'BODY SHELL',
    system: 'body',
    mass: '96 kg (panels)',
    summary:
      'The skin. Shaped by aerodynamics — at 120 km/h the car spends more energy pushing air than rolling. Cd 0.29.',
    operation: [
      'Nose splits airflow; hood line keeps it attached to the glass.',
      'Underbody panels smooth the floor — hidden drag is floor drag.',
      'Rear spoiler lip trips the air cleanly, shrinking the turbulent wake.',
    ],
    fasteners: 'Panels bonded with 2k polyurethane adhesive + clinch joints — almost no visible bolts',
    materials: [
      {
        name: 'AA6016 ALUMINUM SKIN',
        cls: 'Aluminum sheet · outer panels',
        composition: [
          { element: 'Al', pct: 97.9 },
          { element: 'Si', pct: 1.1 },
          { element: 'Mg', pct: 0.4 },
        ],
        process: 'Stamped at 0.95 mm, bake-hardens during paint oven cure — the paint shop doubles as heat treatment',
        why: 'Dent-resistant enough for a door skin, light enough to matter: aluminum closures save ~40 kg over steel.',
        props: [
          { label: 'THICKNESS', value: '0.95 mm' },
          { label: 'VS STEEL', value: '-45% mass' },
        ],
      },
      {
        name: 'PP-EPDM BUMPER FASCIA',
        cls: 'Thermoplastic olefin · bumpers',
        composition: [
          { element: 'Polypropylene', pct: 70 },
          { element: 'EPDM rubber', pct: 20 },
          { element: 'Talc', pct: 10 },
        ],
        process: 'Injection molded, flame-treated so paint can stick to polypropylene',
        why: 'Bounces back from a 8 km/h parking hit with zero damage. Metal would be bent; this flexes and returns.',
        props: [{ label: 'RECOVERY', value: 'full @ 8 km/h' }],
      },
    ],
    focus: [0, 0.75, 0],
    camDist: 3.6,
    explode: [0, 1.6, 0],
  },
  {
    id: 'seats',
    code: 'INT-01',
    name: 'SPORT SEATS',
    system: 'interior',
    mass: '19 kg each',
    summary:
      'A crash structure you sit on. The frame must hold a 3-tonne belt load while the foam holds your spine at the right angle for hours.',
    operation: [
      'High-strength steel frame anchors the belt loads in a crash.',
      'Side bolsters brace your torso against cornering force.',
      'Dual-density foam: soft surface for comfort, firm core for support.',
    ],
    fasteners: 'M10×1.25 class 10.9 floor bolts, 55 Nm — these carry crash loads, never reuse',
    materials: [
      {
        name: 'DP800 DUAL-PHASE STEEL',
        cls: 'AHSS · seat frame',
        composition: [
          { element: 'Fe', pct: 97.9 },
          { element: 'Mn', pct: 1.5 },
          { element: 'C', pct: 0.15 },
          { element: 'Si', pct: 0.25 },
        ],
        process: 'Roll-formed tube + stampings, laser welded',
        why: 'Martensite islands in soft ferrite: stamps easily, then work-hardens exactly where a crash bends it.',
        props: [{ label: 'BELT LOAD', value: '30 kN held' }],
      },
      {
        name: 'HR MOLDED PU FOAM',
        cls: 'Polyurethane · cushions',
        composition: [
          { element: 'Polyol', pct: 62 },
          { element: 'MDI isocyanate', pct: 35 },
          { element: 'Additives', pct: 3 },
        ],
        process: 'Poured as liquid into molds, rises and cures in 90 seconds',
        why: 'High-resilience foam pushes back proportionally to load — that is what keeps pressure off your sciatic nerve on long drives.',
        props: [
          { label: 'DENSITY', value: '55 kg/m³' },
          { label: 'SAG FACTOR', value: '2.8' },
        ],
      },
    ],
    focus: [-0.25, 0.6, 0.4],
    camDist: 1.9,
    explode: [0, 1.3, 0.3],
  },
  {
    id: 'steering',
    code: 'INT-02',
    name: 'STEERING SYSTEM',
    system: 'interior',
    mass: '12 kg',
    summary:
      'Your hands command wheel angle through a 15:1 rack — with an electric motor adding exactly the assist torque the ECU decides you need.',
    operation: [
      'Torsion bar in the column twists slightly under your effort — a sensor reads the twist.',
      'EPS motor adds assist torque proportional to twist, speed-sensitive.',
      'Rack and pinion converts rotation to the sideways push that angles the wheels.',
      'In a crash, the column collapses telescopically instead of spearing the cabin.',
    ],
    materials: [
      {
        name: 'C45 INDUCTION-HARDENED RACK',
        cls: 'Carbon steel · steering rack',
        composition: [
          { element: 'Fe', pct: 98.5 },
          { element: 'C', pct: 0.45 },
          { element: 'Mn', pct: 0.65 },
        ],
        process: 'Teeth broached, then induction-hardened only on the toothed face',
        why: 'The rack teeth carry your life. Induction hardening makes the teeth glass-hard while the shaft stays tough.',
        props: [
          { label: 'RATIO', value: '15.0 : 1' },
          { label: 'ASSIST', value: '0–80 Nm' },
        ],
      },
      {
        name: 'MG-ALLOY WHEEL ARMATURE',
        cls: 'Magnesium AM60B · wheel core',
        composition: [
          { element: 'Mg', pct: 93.4 },
          { element: 'Al', pct: 6.0 },
          { element: 'Mn', pct: 0.35 },
        ],
        process: 'Die cast, wrapped in PU foam and leather',
        why: 'Lightest structural metal there is — and it crushes progressively if your chest hits it before the airbag fully fires.',
        props: [{ label: 'DENSITY', value: '1.78 g/cm³' }],
      },
    ],
    focus: [0.35, 0.78, 0.38],
    camDist: 1.6,
    explode: [0.3, 1.0, 0.5],
  },
]

export const partById = (id: string | null) =>
  id ? PARTS.find((p) => p.id === id) ?? null : null
