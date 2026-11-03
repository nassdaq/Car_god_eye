import type { Part } from './parts'

const GUPTA =
  'S.K. Gupta — A Textbook of Automobile Engineering (S. Chand): Engine Construction, Engine Components & Valve Mechanism chapters'

/* ========================= WIPER DRIVE SUBTREE ========================== */

const WIPER_KIDS: Part[] = [
  {
    id: 'wpr-motor',
    code: 'WPR-01',
    name: 'WIPER MOTOR + WORM',
    system: 'body',
    mass: '1.6 kg',
    summary:
      'A small DC motor spinning 3,000 RPM into a 60:1 worm gear — and the worm is a one-way street: the motor can drive the blades, but a gale hammering the blades can never back-drive the motor.',
    operation: [
      'Armature spins a hardened steel worm; the worm walks a plastic wheel around 60× slower with 60× the torque.',
      'SELF-LOCKING: the worm’s lead angle is below its friction angle — torque flows motor→wheel only. Wind load on the parked blades just wedges the worm tighter.',
      'Park-position switch: a contact disc on the wheel keeps the motor powered past your OFF until the blades reach their hiding spot at the hood line.',
      'A thermal fuse in the windings opens before a snow-jammed motor cooks itself.',
    ],
    fasteners: 'M6 flange bolts through rubber isolators — the body panel must not become a loudspeaker',
    materials: [
      {
        name: 'Cu WINDINGS + FERRITE MAGNETS',
        cls: 'Copper magnet wire · DC motor',
        composition: [
          { element: 'Steel laminations', pct: 55 },
          { element: 'Cu windings', pct: 25 },
          { element: 'Ferrite magnets', pct: 15 },
          { element: 'Brush graphite', pct: 5 },
        ],
        process: 'Two brush pairs tap the commutator at different angles — that is the two wiper speeds, no electronics',
        why: 'A 60 W motor geared 60:1 delivers ~25 Nm at the arm — enough to drag a frozen blade loose without stripping anything.',
        props: [
          { label: 'REDUCTION', value: '60 : 1' },
          { label: 'ARM TORQUE', value: '~25 Nm' },
        ],
      },
      {
        name: 'POM WORM WHEEL',
        cls: 'Acetal · reduction gear',
        composition: [
          { element: 'POM homopolymer', pct: 97 },
          { element: 'PTFE lube', pct: 3 },
        ],
        process: 'Injection molded in one shot around a knurled steel hub — teeth never machined, never lubricated again',
        why: 'Steel worm on acetal wheel is the quiet pairing: POM self-lubricates, absorbs tooth shock, and shears sacrificially if the blades are ice-locked — the gear dies so the motor lives.',
        props: [
          { label: 'TEETH', value: '60' },
          { label: 'SERVICE', value: 'grease-for-life' },
        ],
      },
    ],
  },
  {
    id: 'wpr-linkage',
    code: 'WPR-02',
    name: 'LINKAGE — 4-BAR',
    system: 'body',
    mass: '1.4 kg',
    summary:
      'The crank spins in circles; the blades must sweep an arc and come back. A four-bar linkage does the translation — and its link lengths ARE the wipe pattern, frozen in stamped steel.',
    operation: [
      'Motor crank (full rotation) drives a connecting link to two rocker arms — rotation in, oscillation out.',
      'The geometry is the program: link lengths and pivot positions set sweep angle, overlap, and where each blade parks. Change a link 5 mm and the pattern on the glass changes.',
      'Ball studs in plastic sockets at every joint — zero-lash pivots that snap together on the assembly line.',
      'Near the stroke ends the crank geometry slows the blade naturally — the gentle reversal you hear as a soft tick, not a slap.',
    ],
    materials: [
      {
        name: 'DC04 STAMPED STEEL LINKS',
        cls: 'Deep-draw steel · cranks + rockers',
        composition: [
          { element: 'Fe', pct: 99.3 },
          { element: 'Mn', pct: 0.4 },
          { element: 'C', pct: 0.08 },
        ],
        process: 'Stamped with ribs for stiffness, ball studs riveted in, e-coated against 15 winters of salt spray',
        why: 'A flat strap would flex and smear the wipe pattern; one stamped rib triples bending stiffness for free.',
        props: [
          { label: 'SWEEP', value: '~67° driver side' },
          { label: 'CYCLES', value: '>1.5M wipes' },
        ],
      },
    ],
  },
  {
    id: 'wpr-blade',
    code: 'WPR-03',
    name: 'BLADE + RUBBER EDGE',
    system: 'body',
    mass: '0.3 kg',
    summary:
      'All of it exists to press a 0.01 mm rubber lip against the glass. Watch closely: the lip FLIPS over at every reversal — it wipes leaning one way, then folds to lean the other.',
    operation: [
      'A spring steel spine (or 6-claw frame) bends the blade to the windshield’s curve, spreading arm force evenly along 60 cm of edge.',
      'The micro-edge squeegees water by riding a thin lubricating film — stick-slip is the enemy: too dry and the rubber grabs-releases-grabs, which is wiper chatter.',
      'THE FLIP: the lip trails the stroke like a brush. At reversal the whole edge rolls over its neck to trail the other way — a blade that can’t flip (aged, stiff) judders instead of gliding.',
      'Graphite coating on the rubber halves friction on dry glass and buys the first silent wipe.',
    ],
    materials: [
      {
        name: 'NR/EPDM DUAL-COMPOUND RUBBER',
        cls: 'Elastomer · wiping lip',
        composition: [
          { element: 'Natural rubber core', pct: 55 },
          { element: 'EPDM skin', pct: 35 },
          { element: 'Graphite coat', pct: 7 },
          { element: 'Cure package', pct: 3 },
        ],
        process: 'Co-extruded as twin blades joined edge-to-edge, vulcanized, then sliced apart — the cut IS the 0.01 mm wiping edge',
        why: 'Natural rubber stays supple at -30°C for the flip; the EPDM skin shields it from UV and ozone that would crack it in one summer.',
        props: [
          { label: 'EDGE RADIUS', value: '~0.01 mm' },
          { label: 'LIFE', value: '~1 year of flips' },
        ],
      },
      {
        name: 'SPRING STEEL FLEXOR SPINE',
        cls: 'Hardened strip steel · beam blade',
        composition: [
          { element: 'Fe', pct: 98.5 },
          { element: 'C', pct: 0.75 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Rolled strip pre-curved tighter than any windshield — pressing it flat is what loads the edge',
        why: 'The spine is a leaf spring shaped backwards: its built-in overbend turns one arm force into even pressure at every point of the glass.',
        props: [
          { label: 'PRESSURE', value: '~15 g/cm of edge' },
          { label: 'CURVE', value: 'pre-bent < glass R' },
        ],
      },
    ],
  },
]

/* ======================= BODY MECHANISMS TOP NODE ======================= */

export const BODYMECH_PART: Part = {
  id: 'bodymech',
  code: 'BDM-01',
  name: 'BODY MECHANISMS — WIPERS, DOORS',
  system: 'body',
  mass: '~19 kg',
  summary:
    'The machines hiding in the skin: wipers that flip a hair-thin rubber edge twice a second, latches that catch a door twice so one failure never opens it, windows that sense a trapped finger.',
  operation: [
    'Wiper drive: motor → self-locking worm → 4-bar linkage → a 0.01 mm rubber lip on the glass.',
    'Washer: a centrifugal micro pump throws chemistry (water + alcohol + surfactant) at two jets.',
    'Doors: 2-stage latches catch twice, check straps hold positions in detents, regulators lift 6 kg of glass and stop for a fingertip.',
    'Mirrors: two gear motors aim the glass, a heater film clears it, electrochromic dimming tames headlights behind you.',
  ],
  fasteners: 'M6–M8 flange bolts into cage nuts in the door shell; latch screws are torque-controlled safety fasteners',
  materials: [
    {
      name: 'STEEL + ACETAL + RUBBER MIX',
      cls: 'Assembly · six mechanisms',
      composition: [
        { element: 'Stamped/forged steel', pct: 62 },
        { element: 'POM + PP polymers', pct: 20 },
        { element: 'Cu motors', pct: 10 },
        { element: 'Rubber + glass', pct: 8 },
      ],
      process: 'Every mechanism repeats one recipe: steel where it must not break, acetal where it must slide quietly, rubber where it meets weather',
      why: 'These are the parts you touch ten times a day and never think about — each one engineered to work 100,000 times and fail safe, not fail open.',
      props: [
        { label: 'MECHANISMS', value: '6 families' },
        { label: 'DESIGN LIFE', value: '10⁵ cycles each' },
      ],
    },
  ],
  focus: [0.6, 0.7, 0.4],
  camDist: 2.6,
  explode: [0.2, 1.1, -0.4],
  refs: [GUPTA],
  children: [
    {
      id: 'bdm-wiper',
      code: 'BDM-02',
      name: 'WIPER DRIVE',
      system: 'body',
      mass: '3.3 kg',
      summary:
        'One motor, one worm, four bars, two blades — a rain computer made of geometry. Dive in: the worm that can’t be back-driven, the linkage that IS the wipe pattern, the edge that flips.',
      operation: [
        'Motor torque multiplies 60:1 through the worm, then the 4-bar linkage turns circles into the sweep arc.',
        'Park switch logic hides the blades below the hood line after your last wipe.',
        'At the glass, everything funnels into a 0.01 mm rubber edge flipping over at each reversal.',
      ],
      materials: [
        {
          name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
          cls: 'Motor · linkage · blade',
          composition: [
            { element: 'Motor + gearbox', pct: 48 },
            { element: 'Steel linkage', pct: 42 },
            { element: 'Arms + blades', pct: 10 },
          ],
          process: 'Pre-assembled on a steel cradle, dropped into the cowl as one module — three nodes below',
          why: 'A wiper is three machines in series: an electromagnetic one, a kinematic one, and a tribological one. Each is a node.',
          props: [
            { label: 'SPEEDS', value: '2 + intermittent' },
            { label: 'WIPE RATE', value: '~45/min low' },
          ],
        },
      ],
      children: WIPER_KIDS,
    },
    {
      id: 'bdm-washer',
      code: 'BDM-03',
      name: 'WASHER PUMP & JETS',
      system: 'body',
      mass: '1.1 kg (dry)',
      summary:
        'A thumb-sized centrifugal pump at the bottom of a plastic bottle, throwing engineered water 2 metres against a 100 km/h headwind — the chemistry matters as much as the pump.',
      operation: [
        'A spinning impeller slings fluid outward — centrifugal pressure, ~1 bar from a motor smaller than a cork.',
        'The fluid is a recipe: water carries, isopropanol drops the freezing point and cuts road film grease, surfactant collapses surface tension so drops sheet instead of beading.',
        'Jets atomize or fan the stream; aim is set so drag at speed walks the spray down INTO the wipe zone, not over the roof.',
        'The pickup sits above the bottle floor — the last centimetre of fluid stays behind with the grit.',
      ],
      materials: [
        {
          name: 'PP BOTTLE + POM IMPELLER',
          cls: 'Polypropylene reservoir · acetal pump',
          composition: [
            { element: 'PP bottle', pct: 78 },
            { element: 'POM impeller + body', pct: 12 },
            { element: 'Cu motor windings', pct: 8 },
            { element: 'EPDM grommet seal', pct: 2 },
          ],
          process: 'Pump plugs into a rubber grommet in the bottle wall — no clamps, the grommet is both seal and vibration mount',
          why: 'PP shrugs off alcohol and -30°C; the POM impeller runs dry without seizing when the bottle is empty — which it always eventually is.',
          props: [
            { label: 'PRESSURE', value: '~1 bar' },
            { label: 'THROW', value: '~2 m' },
          ],
        },
        {
          name: 'WASHER FLUID — H₂O + IPA + SURFACTANT',
          cls: 'Solvent blend · consumable',
          composition: [
            { element: 'Water', pct: 65 },
            { element: 'Isopropanol', pct: 30 },
            { element: 'Surfactant + dye', pct: 5 },
          ],
          process: 'Winter mix pushes alcohol past 50% — pure water would burst the bottle and freeze as armor on the glass',
          why: 'Surface tension is the real enemy: surfactant makes water wet the glass in sheets the blade can clear in one pass.',
          props: [
            { label: 'FREEZE PT', value: 'to -30°C (winter)' },
            { label: 'CAPACITY', value: '4.5 L' },
          ],
        },
      ],
    },
    {
      id: 'bdm-latch',
      code: 'BDM-04',
      name: 'DOOR LATCH — 2-STAGE',
      system: 'body',
      mass: '0.9 kg',
      summary:
        'The unsung lifesaver. A ratchet that catches the striker TWICE — half-latch, then full latch — so no single bump, wear spot or sloppy slam can ever let a door fly open mid-corner.',
      operation: [
        'The striker (a steel loop on the body) enters the latch’s fish-mouth slot and pushes a forked ratchet plate around.',
        'STAGE 1 — half latch: the pawl drops into the first notch. The door looks shut and CANNOT blow open, even from a lazy slam.',
        'STAGE 2 — full latch: a firmer shut rotates the ratchet to the second notch, compressing the door seals. Two independent catches between you and the road.',
        'Pulling the handle just lifts the pawl — spring energy and the seals pop the ratchet open. In a crash, the latch must hold ~30× the door’s weight and still open afterwards by hand.',
      ],
      fasteners: 'Three torque-controlled screws into the door shut-face — a safety joint, marked for inspection',
      refs: [GUPTA],
      materials: [
        {
          name: 'FINE-BLANKED STEEL RATCHET + PAWL',
          cls: 'Case-hardened steel · the catch',
          composition: [
            { element: 'Fe', pct: 98.4 },
            { element: 'C', pct: 0.45 },
            { element: 'Mn', pct: 0.8 },
            { element: 'Cr', pct: 0.35 },
          ],
          process: 'Fine-blanked (sheared to a glass-smooth edge in one stroke), case-hardened, then overmolded in soft plastic everywhere except the working faces — the quiet click is the overmold',
          why: 'The pawl face carries the whole crash load on a few square millimetres — hardened steel or nothing. FMVSS 206 demands the latch hold ~11 kN fully latched.',
          props: [
            { label: 'HOLD (FULL)', value: '~11 kN' },
            { label: 'STAGES', value: '2 notches' },
          ],
        },
        {
          name: 'STEEL WIRE STRIKER LOOP',
          cls: 'High-tensile wire · body-side anchor',
          composition: [
            { element: 'Fe', pct: 98.2 },
            { element: 'C', pct: 0.6 },
            { element: 'Mn', pct: 1.0 },
          ],
          process: 'Cold-headed U-loop welded to an adjustable plate — slotted holes let the line worker tune door flushness in seconds',
          why: 'The loop is deliberately the simple, massive half of the pair: all the cleverness lives in the latch, all the strength in the striker.',
          props: [
            { label: 'WIRE Ø', value: '8 mm' },
            { label: 'ADJUST', value: '±2 mm slots' },
          ],
        },
      ],
    },
    {
      id: 'bdm-regulator',
      code: 'BDM-05',
      name: 'WINDOW REGULATOR',
      system: 'body',
      mass: '2.6 kg',
      summary:
        'A crane inside the door: a motor-wound cable drum (or scissor arm) lifting 6 kg of glass dead straight in guided rails — while watching its own current for a trapped finger.',
      operation: [
        'Cable-drum type: the motor winds a bowden cable around a grooved drum; the cable loops over pulleys and drags a glass-holding slider up each guide rail.',
        'Scissor type: a motor-driven quadrant gear swings crossed arms — the X geometry keeps the glass level as it rises.',
        'ANTI-PINCH: the controller knows the motor’s normal current signature along the whole travel. A trapped wrist spikes the load in milliseconds — current rises, the window instantly reverses. Mandatory on any express-up window.',
        'The last few millimetres press the glass into the seal — the current spike there is expected, mapped, and ignored.',
      ],
      materials: [
        {
          name: 'POM CABLE DRUM + SLIDERS',
          cls: 'Acetal · drum, pulleys, glass shoes',
          composition: [
            { element: 'POM copolymer', pct: 90 },
            { element: 'PTFE fill', pct: 6 },
            { element: 'Glass clamp pads', pct: 4 },
          ],
          process: 'Helical cable groove molded into the drum — the cable must never cross itself under 400 N of lift tension',
          why: 'Every sliding interface is acetal-on-steel: low friction without grease that would gum at -20°C, and quiet enough to hide behind a door panel.',
          props: [
            { label: 'LIFT', value: '~120 N at glass' },
            { label: 'FULL TRAVEL', value: '~4 s' },
          ],
        },
        {
          name: 'HIGH-TENSILE WIRE BOWDEN CABLE',
          cls: 'Stranded steel cable · pull loop',
          composition: [
            { element: 'Steel strands', pct: 92 },
            { element: 'Nylon liner', pct: 5 },
            { element: 'Zn coating', pct: 3 },
          ],
          process: '7×7 stranded wire running in lined conduit — pre-stretched so the window doesn’t sag a millimetre per year',
          why: 'A cable only pulls, so the drum uses two: one winds on while the other pays out — an always-taut loop with zero backlash.',
          props: [
            { label: 'BREAK LOAD', value: '>2 kN' },
            { label: 'ANTI-PINCH', value: '<100 N on obstacle' },
          ],
        },
      ],
    },
    {
      id: 'bdm-hinges',
      code: 'BDM-06',
      name: 'HINGES & CHECK STRAP',
      system: 'body',
      mass: '2.8 kg / door',
      summary:
        'Two forged knuckles carry a 40 kg door for 100,000 slams without sagging a millimetre — and the check strap beside them is why a door HOLDS half-open on a slope instead of swinging at your shins.',
      operation: [
        'Upper and lower hinges share the door’s weight; the lower one takes most of it, which is why old doors sag at the bottom hinge first.',
        'The check strap is a steel arm with molded waves: spring-loaded rollers ride the waves as the door swings.',
        'DETENTS: each valley between waves is a stable parking spot — the rollers must climb a hill to leave it. That climb force is the “notchy” resistance your hand feels at each hold-open position.',
        'The end of the arm is the door stop — a rubber-cushioned wall that keeps the door off the fender.',
      ],
      materials: [
        {
          name: 'DROP-FORGED STEEL HINGE',
          cls: 'Forged steel · knuckles + pin',
          composition: [
            { element: 'Fe', pct: 98.6 },
            { element: 'C', pct: 0.35 },
            { element: 'Mn', pct: 0.8 },
          ],
          process: 'Forged halves with a hardened pin in a bronze bushing — bolted through slotted holes so the door can be aligned to a 4 mm panel gap',
          why: 'The hinge is also a crash load path: in a side impact the door must stay attached and openable — forged grain, not cast, because cast cracks.',
          props: [
            { label: 'DOOR MASS', value: '~40 kg carried' },
            { label: 'SAG SPEC', value: '<1 mm @ 10⁵ cycles' },
          ],
        },
        {
          name: 'SPRING STEEL CHECK ARM',
          cls: 'Hardened strip · detent track',
          composition: [
            { element: 'Fe', pct: 98.0 },
            { element: 'C', pct: 0.6 },
            { element: 'Mn', pct: 0.9 },
          ],
          process: 'Arm stamped with detent waves, overmolded in slick plastic; coil springs press twin rollers onto the track inside a sealed case',
          why: 'The wave profile is a force map you feel: steep flanks = firm hold, round crests = smooth travel. Geometry doing the job of a brake.',
          props: [
            { label: 'DETENTS', value: '2–3 positions' },
            { label: 'HOLD', value: '~80 N at handle' },
          ],
        },
      ],
    },
    {
      id: 'bdm-mirror',
      code: 'BDM-07',
      name: 'POWER MIRROR',
      system: 'body',
      mass: '0.9 kg each',
      summary:
        'Behind the glass: two tiny gear motors aiming it on two axes, a printed heater film cooking off frost, and — on the dimming kind — a gel that darkens electrically when headlights glare behind you.',
      operation: [
        'Two motor pods (one per axis) drive fine-pitch gears against a ball-jointed backing plate — the glass tilts, the housing never moves.',
        'The motors stall harmlessly at travel limits: slipping clutch teeth instead of limit switches, which is the ratcheting buzz you hear at full tilt.',
        'Heater: a printed resistive film laminated to the glass back pulls ~25 W, clearing frost and rain mist.',
        'Electrochromic dimming: an EC gel layer between conductive glass coatings darkens with ~1.2 V when the rear glare sensor trips — no moving parts, just chemistry absorbing the dazzle.',
      ],
      materials: [
        {
          name: 'FLOAT GLASS + ITO HEATER FILM',
          cls: 'Chrome-coated float glass · mirror element',
          composition: [
            { element: 'SiO₂ glass', pct: 88 },
            { element: 'Reflective Cr/Al coat', pct: 2 },
            { element: 'Heater film + PSA', pct: 10 },
          ],
          process: 'First-surface safety-backed glass; the heater is a serpentine conductive print bonded with pressure-sensitive adhesive',
          why: 'Convex or aspheric curvature is ground into the glass itself — the wide field of view (and the “objects are closer” warning) is optics, not electronics.',
          props: [
            { label: 'HEATER', value: '~25 W' },
            { label: 'DIM RANGE', value: '70% → 10% reflect' },
          ],
        },
        {
          name: 'Cu-WOUND GEAR MOTOR PODS',
          cls: 'Micro DC motors · 2-axis actuator',
          composition: [
            { element: 'PBT housing', pct: 45 },
            { element: 'Steel gears + shafts', pct: 30 },
            { element: 'Cu windings', pct: 20 },
            { element: 'Ferrite magnets', pct: 5 },
          ],
          process: 'Each pod: motor → multi-stage gear train → jackscrew pushing one edge of the glass plate',
          why: 'Huge reduction in a tiny space means the mirror holds its aim against 120 km/h buffeting with the motors unpowered — gearing as a brake, same trick as the wiper worm.',
          props: [
            { label: 'AXES', value: '2 (±10°)' },
            { label: 'HOLD', value: 'self-locking train' },
          ],
        },
      ],
    },
  ],
}
