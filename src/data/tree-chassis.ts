import type { Part } from './parts'
import { DISC_CHAIN } from './tree-deep'

/* ========================== DRIVETRAIN SUBTREES ========================== */

export const TRANSMISSION_KIDS: Part[] = [
  {
    id: 'trn-gears',
    code: 'TRN-01',
    name: 'GEAR SETS — 6 PAIRS',
    system: 'drivetrain',
    mass: '14 kg',
    summary:
      'Six pairs of helical gears in constant mesh. Helical teeth engage gradually — that is the whole difference between a whine and silence.',
    operation: [
      'All pairs spin constantly; only the pair locked to the shaft carries torque.',
      'Helix angle (~30°) means 2–3 teeth share load at any instant.',
      'Tooth flanks are crowned microns to center the contact as shafts flex under load.',
    ],
    materials: [
      {
        name: '20MnCr5 CASE-HARDENED STEEL',
        cls: 'Carburizing gear steel',
        composition: [
          { element: 'Fe', pct: 97.3 },
          { element: 'Mn', pct: 1.25 },
          { element: 'Cr', pct: 1.15 },
          { element: 'C', pct: 0.2 },
        ],
        process: 'Hobbed, shaved, carburized to 0.8 mm case, then honed after hardening',
        why: 'Tooth contact stress hits 1.5 GPa — only a glass-hard carburized skin over a tough core survives both pitting and shock.',
        props: [
          { label: 'SURFACE', value: '60 HRC' },
          { label: 'CONTACT', value: '1.5 GPa' },
        ],
      },
    ],
  },
  {
    id: 'trn-synchro',
    code: 'TRN-02',
    name: 'SYNCHRONIZER RINGS',
    system: 'drivetrain',
    mass: '120 g each',
    summary:
      'Tiny cone clutches that match gear speed to shaft speed in 0.1 seconds — the reason you can shift without grinding and double-clutching like it’s 1935.',
    operation: [
      'Sliding the shift sleeve first presses the brass ring’s cone onto the gear’s cone.',
      'Friction drags the gear to exactly shaft speed.',
      'Only when speeds match do the blocker teeth rotate clear and let the sleeve lock through.',
    ],
    materials: [
      {
        name: 'CuZn39 BRASS + Mo COATING',
        cls: 'Forged brass · friction cone',
        composition: [
          { element: 'Cu', pct: 58.5 },
          { element: 'Zn', pct: 39.0 },
          { element: 'Mn+Al', pct: 1.5 },
          { element: 'Mo spray', pct: 1.0 },
        ],
        process: 'Forged ring, machined threads on the cone face (oil-wiping grooves), molybdenum flame-sprayed',
        why: 'Brass bites steel smoothly without galling, and the micro-threads squeegee oil off the cone — friction where you need it, in an oil bath.',
        props: [
          { label: 'SYNC TIME', value: '~0.1 s' },
          { label: 'CONE ANGLE', value: '6.5°' },
        ],
      },
    ],
  },
  {
    id: 'trn-clutch',
    code: 'TRN-03',
    name: 'CLUTCH DISC & PRESSURE PLATE',
    system: 'drivetrain',
    mass: '6.8 kg',
    summary:
      'The handshake between engine and gearbox: a friction disc squeezed by 6,000 N of spring, engineered to slip smoothly on launch and never slip after.',
    operation: [
      'Diaphragm spring clamps the disc to the flywheel — pedal effort just unclamps it.',
      'Marcel springs between the facings give the first few mm of engagement its softness.',
      'Hub springs absorb the engine’s torque pulses so the gearbox doesn’t rattle.',
    ],
    materials: [
      {
        name: 'ORGANIC FACING COMPOSITE',
        cls: 'Woven friction material · disc facings',
        composition: [
          { element: 'Glass/aramid yarn', pct: 45 },
          { element: 'Phenolic resin', pct: 25 },
          { element: 'Rubber', pct: 15 },
          { element: 'Cu/brass wire', pct: 10 },
          { element: 'Friction dust', pct: 5 },
        ],
        process: 'Yarn wound into a spiral mat, resin-impregnated, hot-pressed, riveted to the marcel',
        why: 'Must grab predictably from 0 to 300°C, slip a million launches, and never grab suddenly — a friction recipe tuned like espresso.',
        props: [
          { label: 'CLAMP', value: '6,000 N' },
          { label: 'µ', value: '0.28 stable' },
        ],
      },
    ],
  },
  {
    id: 'trn-case',
    code: 'TRN-04',
    name: 'GEARBOX HOUSING',
    system: 'drivetrain',
    mass: '13 kg',
    summary:
      'A thin-wall aluminum shell holding two shafts parallel to 0.02 mm under half a tonne of gear separation force.',
    operation: [
      'Ribbing patterns follow the load paths between bearing bores — computed, not styled.',
      'Internal oil guides catch splash and gravity-feed it to the input shaft bearings.',
    ],
    materials: [
      {
        name: 'ADC12 DIE-CAST ALUMINUM',
        cls: 'Al-Si die casting alloy · case',
        composition: [
          { element: 'Al', pct: 86.5 },
          { element: 'Si', pct: 10.5 },
          { element: 'Cu', pct: 2.0 },
          { element: 'Fe', pct: 0.8 },
        ],
        process: 'High-pressure die cast, bearing bores line-bored in one setup for true alignment',
        why: 'Gears forced 0.05 mm out of parallel whine like a supermarket trolley — the case IS the gear alignment.',
        props: [
          { label: 'BORE ALIGNMENT', value: '0.02 mm' },
          { label: 'WALL', value: '4 mm' },
        ],
      },
    ],
  },
]

export const DRIVESHAFT_KIDS: Part[] = [
  {
    id: 'dsh-tube',
    code: 'DSH-01',
    name: 'SHAFT TUBE',
    system: 'drivetrain',
    mass: '5.1 kg',
    summary:
      'A hollow steel tube — hollow because torsion lives entirely in the outer skin. The middle of a solid shaft is dead weight along for the ride.',
    operation: [
      'Carries 450 Nm of torque as pure shear in a 2.1 mm wall.',
      'Spin-balanced with welded weights: at 7,000 RPM, 10 grams off-center shakes the whole car.',
      'Diameter sets the critical whirl speed — it must stay above anything the engine can reach.',
    ],
    materials: [
      {
        name: 'E355 DOM STEEL TUBE',
        cls: 'Drawn-over-mandrel steel',
        composition: [
          { element: 'Fe', pct: 98.3 },
          { element: 'C', pct: 0.22 },
          { element: 'Mn', pct: 1.3 },
        ],
        process: 'Cold-drawn seamless, friction-welded end yokes, balanced to <10 g·cm',
        why: 'DOM drawing work-hardens the tube and holds wall thickness within 5% — balance starts at the mill, not the balancer.',
        props: [
          { label: 'OD × WALL', value: '75 × 2.1 mm' },
          { label: 'CRITICAL SPEED', value: '9,400 RPM' },
        ],
      },
    ],
  },
  {
    id: 'dsh-ujoints',
    code: 'DSH-02',
    name: 'UNIVERSAL JOINTS',
    system: 'drivetrain',
    mass: '650 g each',
    summary:
      'A steel cross with four needle-bearing caps — the 500-year-old Cardan mechanism still letting a spinning shaft bend around suspension travel.',
    operation: [
      'Each yoke grips opposite arms of the cross; the cross pivots both ways at once.',
      'Needle rollers in each cap turn pivoting into rolling — grease-packed for life.',
      'Single joints pulse speed twice per rev at an angle; the two joints are phased to cancel each other.',
    ],
    materials: [
      {
        name: '100Cr6 BEARING STEEL CROSS',
        cls: 'Through-hardening bearing steel',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'Cr', pct: 1.5 },
          { element: 'C', pct: 1.0 },
          { element: 'Mn', pct: 0.35 },
        ],
        process: 'Forged cross, trunnions ground, 60 HRC; caps run 23 needle rollers each',
        why: 'Needle bearings concentrate load on a line of contact — only full-hard bearing steel takes 2 GPa on a line without denting.',
        props: [
          { label: 'MAX ANGLE', value: '~8°' },
          { label: 'ROLLERS/CAP', value: '23' },
        ],
      },
    ],
  },
]

export const DIFF_KIDS: Part[] = [
  {
    id: 'dif-ringpinion',
    code: 'DIF-01',
    name: 'RING & PINION — HYPOID',
    system: 'drivetrain',
    mass: '9.5 kg',
    summary:
      'The 90° turn. Hypoid gears mesh BELOW the ring gear’s centerline — teeth that slide as they roll, carrying the harshest contact in the entire car.',
    operation: [
      'Pinion (13 teeth) drives the ring (48 teeth): 3.69:1 final reduction.',
      'The hypoid offset lowers the driveshaft tunnel — your cabin floor height comes from this gear.',
      'Lapped as a pair; the contact pattern is set with 0.05 mm shims at assembly.',
    ],
    materials: [
      {
        name: 'SAE 8620 Ni-Cr-Mo STEEL',
        cls: 'Carburizing steel · gear pair',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'Mn', pct: 0.8 },
          { element: 'Ni', pct: 0.55 },
          { element: 'Cr', pct: 0.5 },
          { element: 'Mo', pct: 0.2 },
        ],
        process: 'Forged, spiral teeth cut, carburized, lapped together under load — married for life',
        why: 'Hypoid sliding would weld plain steel teeth together; carburized 8620 plus extreme-pressure GL-5 oil survives 2.5 GPa with sliding.',
        props: [
          { label: 'RATIO', value: '3.69 : 1' },
          { label: 'CONTACT', value: '2.5 GPa sliding' },
        ],
      },
    ],
  },
  {
    id: 'dif-spiders',
    code: 'DIF-02',
    name: 'SPIDER GEAR SET',
    system: 'drivetrain',
    mass: '2.8 kg',
    summary:
      'The actual "differential": four small bevel gears in a cross that let the outside wheel run faster in a corner while both still push.',
    operation: [
      'Straight ahead: the whole set orbits as one locked lump — nothing rotates internally.',
      'In a turn: spiders walk between the side gears, adding speed to one wheel, subtracting from the other — always summing to cage speed ×2.',
    ],
    materials: [
      {
        name: '8620 FORGED BEVEL GEARS',
        cls: 'Carburized steel · spiders + side gears',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'Mn', pct: 0.8 },
          { element: 'Ni', pct: 0.55 },
          { element: 'Cr', pct: 0.5 },
        ],
        process: 'Net-forged teeth (unmachined!), spherical backs lapped to the case',
        why: 'Spiders idle 99% of life then suddenly take full torque split — forged teeth with uncut grain take the shock.',
        props: [
          { label: 'IDLE TIME', value: '~99% of life' },
          { label: 'THRUST WASHERS', value: 'bronze' },
        ],
      },
    ],
  },
  {
    id: 'dif-lsd',
    code: 'DIF-03',
    name: 'LSD CLUTCH PACK',
    system: 'drivetrain',
    mass: '1.9 kg',
    summary:
      'The traction referee. Stacked friction discs that progressively lock both wheels together when you floor it — open cruising, locked under power.',
    operation: [
      'Ramped pressure rings convert drive torque into axial squeeze on the pack.',
      'More throttle → more squeeze → more lock, up to 40%.',
      'Alternating discs: one splined to the case, the next to the axle — friction between them is the lock.',
    ],
    materials: [
      {
        name: 'STEEL + PAPER-CARBON FRICTION DISCS',
        cls: 'Sintered friction pack',
        composition: [
          { element: 'Steel discs', pct: 70 },
          { element: 'Cellulose-carbon lining', pct: 22 },
          { element: 'Resin', pct: 8 },
        ],
        process: 'Friction paper saturated, cured onto steel cores; grooved for oil flow',
        why: 'Must bite progressively without chatter (the shudder cheap LSDs make in parking lots) — the carbon-paper lining and friction-modified oil are a matched pair.',
        props: [
          { label: 'LOCK-UP', value: '0–40%' },
          { label: 'DISCS', value: '8 per side' },
        ],
      },
    ],
  },
  {
    id: 'dif-case',
    code: 'DIF-04',
    name: 'DIFF HOUSING + GL-5 OIL',
    system: 'drivetrain',
    mass: '14 kg + 1.2 L',
    summary:
      'A nodular iron vault holding the gears rigid, filled with oil whose sulfur additives chemically weld a sacrificial film onto sliding teeth.',
    operation: [
      'Case flex is gear misalignment — iron’s stiffness holds the hypoid mesh under 8 kN of separation force.',
      'GL-5 oil’s sulfur-phosphorus compounds react with hot steel to form a solid film exactly where contact would weld.',
    ],
    materials: [
      {
        name: 'GJS-500 DUCTILE IRON + 75W-90 GL-5',
        cls: 'Nodular iron casting · hypoid oil',
        composition: [
          { element: 'Fe (casting)', pct: 93.0 },
          { element: 'C spheroids', pct: 3.5 },
          { element: 'Si', pct: 2.5 },
          { element: 'Mg trace', pct: 0.05 },
        ],
        process: 'Magnesium-treated melt makes graphite form spheres, not flakes — iron with steel-like ductility',
        why: 'Gray iron would crack at the first pothole shock through the wheels; spheroidal graphite bends instead of breaking.',
        props: [
          { label: 'ELONGATION', value: '7% (vs ~0 gray)' },
          { label: 'OIL', value: '75W-90 GL-5' },
        ],
      },
    ],
  },
]

/* ============================ CHASSIS SUBTREE ============================ */

export const CHASSIS_KIDS: Part[] = [
  {
    id: 'chs-cell',
    code: 'CHS-01',
    name: 'SAFETY CELL — BORON STEEL',
    system: 'chassis',
    mass: '41 kg',
    summary:
      'The part that must never bend. Hot-stamped boron steel at 1,500 MPa forms the cage around the occupants — three times stronger than regular car steel.',
    operation: [
      'A-pillars, B-pillars, roof rails and sills form a ring that keeps its shape while everything around it crushes.',
      'In a side impact there is no crumple distance — the B-pillar must simply refuse.',
    ],
    materials: [
      {
        name: '22MnB5 HOT-STAMPED BORON STEEL',
        cls: 'Press-hardened steel · cell members',
        composition: [
          { element: 'Fe', pct: 97.6 },
          { element: 'Mn', pct: 1.25 },
          { element: 'C', pct: 0.23 },
          { element: 'B', pct: 0.003 },
        ],
        process: 'Blank heated to 930°C, stamped and quenched in the water-cooled die at 50°C/s — martensite forms in-shape',
        why: '30 ppm of boron delays softening just long enough for the die-quench to catch full martensite. Three atoms per ten thousand, tripling the strength.',
        props: [
          { label: 'TENSILE', value: '1,500 MPa' },
          { label: 'B-PILLAR INTRUSION', value: '<120 mm' },
        ],
      },
    ],
  },
  {
    id: 'chs-rails',
    code: 'CHS-02',
    name: 'CRUSH RAILS',
    system: 'chassis',
    mass: '18 kg',
    summary:
      'Designed to die. Multi-cell aluminum extrusions that fold like origami in a programmed sequence, eating crash energy so the cell doesn’t have to.',
    operation: [
      'Triggered folds (pre-stamped dimples) start the collapse at the front tip.',
      'Each fold absorbs energy over ~40 mm — a 64 km/h crash fits in 600 mm of folding.',
      'The multi-cell cross-section folds at near-constant force, keeping deceleration flat.',
    ],
    materials: [
      {
        name: '6061-T6 MULTI-CELL EXTRUSION',
        cls: 'Aluminum extrusion · rails',
        composition: [
          { element: 'Al', pct: 97.3 },
          { element: 'Mg', pct: 1.0 },
          { element: 'Si', pct: 0.6 },
          { element: 'Cu', pct: 0.28 },
        ],
        process: 'Extruded through a bridge die (internal webs in one shot), stretch-straightened, fold initiators coined in',
        why: 'Aluminum folding absorbs ~25 kJ/kg — more than steel per kilogram — and extrusion makes complex internal webs essentially free.',
        props: [
          { label: 'ABSORPTION', value: '25 kJ/kg' },
          { label: 'CRUSH FORCE', value: '~250 kN flat' },
        ],
      },
    ],
  },
  {
    id: 'chs-floor',
    code: 'CHS-03',
    name: 'FLOOR PAN',
    system: 'chassis',
    mass: '22 kg',
    summary:
      'The shear web. A stamped steel sheet that turns the frame from a wobbly ladder into a torsion box — most of the car’s stiffness is this flat panel.',
    operation: [
      'Carries shear between the rails — like the skin of a wing.',
      'Beads and swages stamped into it raise panel stiffness 5× and stop it drumming like a speaker cone.',
    ],
    materials: [
      {
        name: 'HC340LA MICRO-ALLOY STEEL',
        cls: 'High-strength low-alloy sheet',
        composition: [
          { element: 'Fe', pct: 98.6 },
          { element: 'Mn', pct: 1.0 },
          { element: 'Nb+Ti', pct: 0.1 },
          { element: 'C', pct: 0.08 },
        ],
        process: 'Stamped 0.75 mm sheet, zinc-coated, seam-sealed',
        why: 'Niobium micro-alloying doubles strength at the same stamping cost — thinner floor, same stiffness, less mass.',
        props: [
          { label: 'THICKNESS', value: '0.75 mm' },
          { label: 'SHARE OF TORSION', value: '~30%' },
        ],
      },
    ],
  },
  {
    id: 'chs-joints',
    code: 'CHS-04',
    name: 'JOINTS — RIVETS + ADHESIVE',
    system: 'chassis',
    mass: '6 kg total',
    summary:
      'You can’t weld aluminum to steel — so this body is glued and riveted: 120 metres of structural adhesive plus 2,400 self-piercing rivets.',
    operation: [
      'Self-piercing rivets punch through the top sheet and flare inside the bottom one — no hole, no heat.',
      'The adhesive bead carries load along the ENTIRE flange, not just at spot joints — stiffness up 20%.',
      'The glue also separates the metals: aluminum touching steel in salt water is a battery that eats the aluminum.',
    ],
    materials: [
      {
        name: '2K EPOXY + BORON STEEL SPR',
        cls: 'Structural adhesive · rivets',
        composition: [
          { element: 'Epoxy resin', pct: 55 },
          { element: 'Toughener (CTBN)', pct: 25 },
          { element: 'Glass beads', pct: 10 },
          { element: 'Hardener', pct: 10 },
        ],
        process: 'Robot-applied bead, cured in the paint oven (the paint bake is the glue’s cure cycle); rivets set at 50 kN',
        why: 'Rubber-toughened epoxy stops cracks at 25 MPa shear; glass beads hold the gap at 0.2 mm so the bond-line is never starved.',
        props: [
          { label: 'ADHESIVE LENGTH', value: '120 m' },
          { label: 'RIVET COUNT', value: '~2,400' },
        ],
      },
    ],
  },
]

/* ========================== SUSPENSION SUBTREES ========================== */

export const DAMPER_KIDS: Part[] = [
  {
    id: 'dmp-rod',
    code: 'DMP-01',
    name: 'PISTON ROD',
    system: 'suspension',
    mass: '480 g',
    summary:
      'A mirror-polished chrome rod sliding through the seal two metres per second, a million cycles a year — its surface finish IS the seal’s lifespan.',
    operation: [
      'Transmits wheel motion to the damper piston.',
      'Surface ground and polished to 0.05 µm — any scratch becomes a leak path within weeks.',
    ],
    materials: [
      {
        name: 'C45 + 20 µm HARD CHROME',
        cls: 'Induction-hardened steel · plated rod',
        composition: [
          { element: 'Fe', pct: 98.2 },
          { element: 'C', pct: 0.45 },
          { element: 'Mn', pct: 0.65 },
          { element: 'Cr plate', pct: 0.7 },
        ],
        process: 'Induction-hardened, ground, hard-chrome plated, super-finished to 0.05 µm Ra',
        why: 'Chrome is both corrosion armor and a low-friction running face — a rust pit here saws the seal open every stroke.',
        props: [
          { label: 'FINISH', value: '0.05 µm Ra' },
          { label: 'SPEED', value: '2 m/s peak' },
        ],
      },
    ],
  },
  {
    id: 'dmp-pistonvalve',
    code: 'DMP-02',
    name: 'PISTON & SHIM STACK',
    system: 'suspension',
    mass: '140 g',
    summary:
      'The brain of the damper is a stack of spring-steel discs thinner than paper. Their thicknesses ARE the damping curve — tuning a damper means swapping shims.',
    operation: [
      'Oil forced through the piston’s ports bends the shim stack open.',
      'Thin shims open early (soft over small bumps); thick backups resist (firm in big hits).',
      'Rebound and compression each get their own stack on opposite faces.',
    ],
    materials: [
      {
        name: 'SINTERED PISTON + C-STEEL SHIMS',
        cls: 'Powder-metal piston · spring shims',
        composition: [
          { element: 'Fe sintered', pct: 82 },
          { element: 'Cu infiltrant', pct: 10 },
          { element: 'Shim steel', pct: 7 },
          { element: 'PTFE band', pct: 1 },
        ],
        process: 'Piston pressed from powder (ports molded in, zero machining); shims stamped 0.10–0.30 mm, deburred, stacked in a tuned recipe',
        why: 'A 0.05 mm shim thickness change is the difference between plush and harsh — this is where ride engineers live.',
        props: [
          { label: 'SHIM RANGE', value: '0.10–0.30 mm' },
          { label: 'FORCE @1 m/s', value: '~1,800 N' },
        ],
      },
    ],
  },
  {
    id: 'dmp-oil',
    code: 'DMP-03',
    name: 'DAMPER OIL + N₂ GAS',
    system: 'suspension',
    mass: '320 g',
    summary:
      'The working fluid — plus a cushion of nitrogen at 25 bar behind a floating piston, there to stop the oil literally boiling into foam on a washboard road.',
    operation: [
      'Every bump forces oil through the valves, turning motion into heat — the damper body hits 120°C on rough roads.',
      'Without gas pressure, low-pressure zones behind the piston cavitate (vacuum-boil) and the damping vanishes — "fade".',
      'The floating piston keeps gas and oil separated but pressure-coupled.',
    ],
    materials: [
      {
        name: 'SYNTHETIC 5W + NITROGEN CHARGE',
        cls: 'Low-viscosity ester oil · inert gas',
        composition: [
          { element: 'Ester base oil', pct: 93 },
          { element: 'Anti-foam', pct: 3 },
          { element: 'Anti-wear', pct: 2 },
          { element: 'VI improver', pct: 2 },
        ],
        process: 'Vacuum-filled (zero dissolved air), gas side charged to 25 bar N₂',
        why: 'Viscosity must barely change from -30°C to +120°C or the car rides differently in winter — ester bases have the flattest curve.',
        props: [
          { label: 'GAS PRECHARGE', value: '25 bar N₂' },
          { label: 'OPERATING', value: '-30°C → 120°C' },
        ],
      },
    ],
  },
  {
    id: 'dmp-seals',
    code: 'DMP-04',
    name: 'ROD SEAL & GUIDE',
    system: 'suspension',
    mass: '60 g',
    summary:
      'The gatekeeper: keeps 25 bar of oil in while a rod slides through it at 2 m/s. Allowed leakage: a molecular film that evaporates off the rod.',
    operation: [
      'The main lip rides the rod with a controlled 0.1 µm oil film — true zero-leak would run dry and burn.',
      'A dust lip outside blocks grit; a PTFE-bronze guide bushing takes the side loads.',
      'Garter spring keeps lip pressure constant as the rubber ages.',
    ],
    materials: [
      {
        name: 'NBR LIP + PTFE-BRONZE GUIDE',
        cls: 'Nitrile seal · composite bushing',
        composition: [
          { element: 'NBR rubber', pct: 55 },
          { element: 'Steel case', pct: 25 },
          { element: 'PTFE liner', pct: 12 },
          { element: 'Bronze mesh', pct: 8 },
        ],
        process: 'Rubber bonded to steel insert, lip edge molded knife-sharp; garter spring fitted',
        why: 'The lip geometry pumps oil BACK inward on each stroke — a seal that actively returns what leaks past it.',
        props: [
          { label: 'HOLDS', value: '25 bar dynamic' },
          { label: 'FRICTION', value: '<15 N' },
        ],
      },
    ],
  },
]

export const SUSPENSION_KIDS: Part[] = [
  {
    id: 'sus-spring',
    code: 'SUS-01',
    name: 'COIL SPRING',
    system: 'suspension',
    mass: '2.6 kg',
    summary:
      'A torsion bar in disguise — the wire actually TWISTS as the coil compresses. It carries the car’s whole corner weight while cycling a million times a year.',
    operation: [
      'Stores bump energy as elastic twist in the wire, releases it on rebound.',
      'Spring rate (55 N/mm) with corner mass sets the ride frequency: ~1.4 Hz, just below walking rhythm.',
      'Side-load geometry: the coil is wound slightly barrel-shaped to cancel damper bending.',
    ],
    materials: [
      {
        name: '54SiCr6 SPRING STEEL',
        cls: 'Silicon-chrome steel · hot coiled',
        composition: [
          { element: 'Fe', pct: 96.4 },
          { element: 'Si', pct: 1.45 },
          { element: 'Cr', pct: 0.65 },
          { element: 'C', pct: 0.55 },
        ],
        process: 'Hot coiled, quenched + tempered, shot-peened, preset (compressed solid once), epoxy powder-coated',
        why: 'Silicon raises the elastic limit so far the wire can store 2× the energy of plain steel per kg without taking a set.',
        props: [
          { label: 'RATE', value: '55 N/mm' },
          { label: 'STRESS', value: '1,100 MPa peak' },
        ],
      },
    ],
  },
  {
    id: 'sus-damper',
    code: 'SUS-02',
    name: 'MONOTUBE DAMPER',
    system: 'suspension',
    mass: '3.8 kg',
    summary:
      'The spring’s veto. Without it the car would pogo down the road for half a kilometre after one bump — the damper burns that bounce as heat in a single stroke.',
    operation: [
      'Rod drives a valved piston through pressurized oil.',
      'Oil forced through shim-covered ports converts motion to heat.',
      'Nitrogen charge behind a floating piston stops cavitation fade.',
    ],
    materials: [
      {
        name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
        cls: 'Steel tube · oil · gas · valves',
        composition: [
          { element: 'Steel body', pct: 70 },
          { element: 'Oil', pct: 9 },
          { element: 'Rod + piston', pct: 18 },
          { element: 'Seals', pct: 3 },
        ],
        process: 'Rod, piston + shims, oil + gas, seals — each a node below',
        why: 'A damper is 4 technologies in a tube: a polished rod, a tunable valve, an engineered fluid, and a seal doing the impossible.',
        props: [
          { label: 'FORCE @1 m/s', value: '~1,800 N' },
          { label: 'BODY TEMP', value: 'to 120°C' },
        ],
      },
    ],
    children: DAMPER_KIDS,
  },
  {
    id: 'sus-arms',
    code: 'SUS-03',
    name: 'CONTROL ARMS',
    system: 'suspension',
    mass: '3.2 kg each',
    summary:
      'The geometry police. Forged aluminum wishbones that allow exactly one path of wheel motion and lock every other direction to fractions of a millimetre.',
    operation: [
      'Upper + lower arms define camber gain as the body rolls — the tire leans INTO the corner.',
      'Longitudinal stiffness vs lateral compliance is tuned via bushing hardness at each end.',
    ],
    materials: [
      {
        name: '7075-T6 FORGED ALUMINUM',
        cls: 'Zn-Mg-Cu aerospace alloy · arms',
        composition: [
          { element: 'Al', pct: 90.0 },
          { element: 'Zn', pct: 5.6 },
          { element: 'Mg', pct: 2.5 },
          { element: 'Cu', pct: 1.6 },
        ],
        process: 'Closed-die forged, solution treated, aged; grain flow follows the wishbone’s V',
        why: 'Unsprung mass fights the damper on every bump — 7075 matches steel’s strength at a third the density.',
        props: [
          { label: 'TENSILE', value: '572 MPa' },
          { label: 'VS STEEL', value: '-42% mass' },
        ],
      },
    ],
  },
  {
    id: 'sus-balljoint',
    code: 'SUS-04',
    name: 'BALL JOINTS',
    system: 'suspension',
    mass: '450 g each',
    summary:
      'The knuckle’s shoulder socket: a hardened steel ball in a polymer cup, swiveling every direction at once under half a tonne — greased once, sealed forever.',
    operation: [
      'Ball stud swivels ±30° and rotates freely while carrying wheel loads.',
      'POM polymer race is pre-loaded to zero clearance — play here becomes wander you can feel in the wheel.',
      'The rubber boot is the real lifespan: grit ingress kills the joint in months.',
    ],
    materials: [
      {
        name: '41Cr4 BALL + POM RACE',
        cls: 'Hardened steel · acetal bearing cup',
        composition: [
          { element: 'Fe (stud)', pct: 77 },
          { element: 'POM race', pct: 12 },
          { element: 'CR boot', pct: 8 },
          { element: 'Grease', pct: 3 },
        ],
        process: 'Ball induction-hardened and polished; race molded, spring-loaded; boot crimped with stainless rings',
        why: 'POM on polished steel runs at µ=0.04 unlubricated — the grease is for corrosion, the polymer is the bearing.',
        props: [
          { label: 'ARTICULATION', value: '±30°' },
          { label: 'PLAY', value: '0 (preloaded)' },
        ],
      },
    ],
  },
  {
    id: 'sus-arb',
    code: 'SUS-05',
    name: 'ANTI-ROLL BAR',
    system: 'suspension',
    mass: '4.1 kg',
    summary:
      'A U-shaped torsion spring tying left and right wheels. It does nothing over speed bumps — and everything in corners, where it lends the loaded wheel the other side’s stiffness.',
    operation: [
      'Both wheels up together: the bar just rotates, zero force.',
      'One wheel up (body roll): the bar twists along its length and fights the difference.',
      'Front/rear bar balance tunes understeer vs oversteer — the cheapest handling dial in the car.',
    ],
    materials: [
      {
        name: '34MnB5 HOLLOW TUBE BAR',
        cls: 'Boron steel tube · formed bar',
        composition: [
          { element: 'Fe', pct: 97.9 },
          { element: 'Mn', pct: 1.3 },
          { element: 'C', pct: 0.34 },
          { element: 'B', pct: 0.003 },
        ],
        process: 'Tube cold-bent, induction hardened through, shot-peened; hollow saves 45% vs solid',
        why: 'Torsion stress lives at the surface — the removed core was barely working. Same roll rate, half the steel.',
        props: [
          { label: 'ROLL RATE ADD', value: '+600 Nm/deg' },
          { label: 'VS SOLID', value: '-45% mass' },
        ],
      },
    ],
  },
]

/* ============================ BRAKES SUBTREES ============================ */

export const CALIPER_KIDS: Part[] = [
  {
    id: 'cal-body',
    code: 'CAL-01',
    name: 'CALIPER BODY',
    system: 'brakes',
    mass: '2.9 kg',
    summary:
      'A stiff aluminum C-clamp. Under full braking it tries to open like a book with 45 kN inside — every micron it flexes is pedal travel you feel.',
    operation: [
      'Two body halves bolted across the disc carry 4 opposed pistons.',
      'Internal drillings route fluid to all pistons equally.',
      'Stiffness budget: <0.15 mm opening at 80 bar.',
    ],
    materials: [
      {
        name: 'A356-T6 GRAVITY CAST',
        cls: 'Aluminum · caliper halves',
        composition: [
          { element: 'Al', pct: 92.0 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
        ],
        process: 'Cast halves, bores hard-anodized, crossover drillings gun-drilled, bridge bolts 12.9',
        why: 'Unsprung and next to a 600°C disc — aluminum sheds pad heat fast enough to protect the fluid behind the pistons.',
        props: [
          { label: 'FLEX @80 bar', value: '<0.15 mm' },
          { label: 'PISTONS', value: '4 opposed' },
        ],
      },
    ],
  },
  {
    id: 'cal-pistons',
    code: 'CAL-02',
    name: 'CALIPER PISTONS',
    system: 'brakes',
    mass: '120 g each',
    summary:
      'The fingers that press the pads — made of phenolic plastic on purpose: they are thermal firewalls between a 400°C pad and the fluid that must not boil.',
    operation: [
      'Hydraulic pressure × piston area = clamp force: 80 bar over 4 pistons → 45 kN.',
      'Hollow crown minimizes the heat path from pad back to fluid.',
    ],
    materials: [
      {
        name: 'PHENOLIC COMPOSITE',
        cls: 'Glass-filled thermoset · pistons',
        composition: [
          { element: 'Phenolic resin', pct: 55 },
          { element: 'Glass fiber', pct: 35 },
          { element: 'Graphite', pct: 10 },
        ],
        process: 'Compression molded, ground to 20 µm bore fit',
        why: 'Phenolic conducts 1/40th the heat of steel pistons — fluid behind it runs 50°C cooler. Boiled fluid = no pedal.',
        props: [
          { label: 'CONDUCTIVITY', value: '0.5 W/mK' },
          { label: 'SERVICE', value: '200°C continuous' },
        ],
      },
    ],
  },
  {
    id: 'cal-seals',
    code: 'CAL-03',
    name: 'PISTON SEALS',
    system: 'brakes',
    mass: '8 g each',
    summary:
      'Square-section rubber rings that are secretly a mechanism: they deform as the piston moves, then spring back — retracting the pads. Your brakes self-adjust forever with zero parts.',
    operation: [
      'Seal sits in a groove, gripping the piston; applying brakes rolls its square section over.',
      'Released, the rubber un-rolls, pulling the piston back ~0.15 mm — the running clearance.',
      'Pad wear? The piston simply slides through the seal’s grip to a new home position.',
    ],
    materials: [
      {
        name: 'EPDM SQUARE-SECTION',
        cls: 'Ethylene-propylene rubber · seal',
        composition: [
          { element: 'EPDM', pct: 72 },
          { element: 'Carbon black', pct: 22 },
          { element: 'Cure system', pct: 6 },
        ],
        process: 'Molded square profile, groove geometry machined at a precise taper that sets rollback',
        why: 'EPDM is the one common rubber glycol brake fluid doesn’t attack — and its stiffness barely changes to -40°C.',
        props: [
          { label: 'ROLLBACK', value: '~0.15 mm' },
          { label: 'RANGE', value: '-40°C → 150°C' },
        ],
      },
    ],
  },
  {
    id: 'cal-bleed',
    code: 'CAL-04',
    name: 'BLEED SCREW & BANJO',
    system: 'brakes',
    mass: '45 g',
    summary:
      'The humble service points: the banjo bolt feeds fluid in through its own hollow core, and the bleed screw at the top lets trapped air — the enemy of pedal feel — escape.',
    operation: [
      'Air compresses 1,000× more than fluid: one bubble turns a firm pedal to sponge.',
      'Bleed screw sits at the caliper’s highest point because bubbles rise.',
      'Banjo’s copper crush washers seal by yielding — single use, like tiny gaskets.',
    ],
    materials: [
      {
        name: 'ZINC-PLATED STEEL + Cu WASHERS',
        cls: 'Carbon steel fittings',
        composition: [
          { element: 'Fe', pct: 93 },
          { element: 'Zn plate', pct: 3 },
          { element: 'Cu washers', pct: 4 },
        ],
        process: 'Cold-headed, gun-drilled cores, conical seat lapped',
        why: 'Dead-soft copper washers flow into surface scratches at 25 Nm — sealing 100 bar with no sealant at all.',
        props: [
          { label: 'SEAT', value: 'metal cone, re-seats' },
          { label: 'WASHERS', value: 'anneal to reuse' },
        ],
      },
    ],
  },
]

export const BRAKES_KIDS: Part[] = [
  {
    id: 'brk-disc',
    code: 'BRK-01',
    name: 'VENTILATED DISC',
    system: 'brakes',
    mass: '7.8 kg',
    summary:
      'A cast-iron flywheel of heat storage. One 100→0 km/h stop dumps ~0.5 MJ into it — enough to boil a kettle — and the vanes inside pump it back out as hot air.',
    operation: [
      'Pads clamp both faces; friction converts speed to heat at up to 1 MW peak.',
      '48 internal vanes act as a centrifugal air pump — the disc cools itself by spinning.',
      'Faces wear mirror-flat together; 0.03 mm of runout becomes steering-wheel shudder.',
    ],
    materials: [
      {
        name: 'G3000 GRAY CAST IRON',
        cls: 'High-carbon flake iron · disc',
        composition: [
          { element: 'Fe', pct: 93.0 },
          { element: 'C', pct: 3.4 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Sand cast around vane cores, double-disc ground to 10 µm flatness, balanced',
        why: 'Graphite flakes triple thermal conductivity and damp the squeal frequencies — iron is heavy, but nothing matches its heat appetite per euro.',
        props: [
          { label: 'ONE STOP', value: '~0.5 MJ' },
          { label: 'PEAK FACE', value: '600°C' },
        ],
      },
    ],
    children: DISC_CHAIN,
  },
  {
    id: 'brk-pads',
    code: 'BRK-02',
    name: 'BRAKE PADS',
    system: 'brakes',
    mass: '320 g each',
    summary:
      'A baked brick of twenty ingredients — steel wool for bite, graphite for smoothness, barite for stability — engineered to grip identically at -20°C and 600°C.',
    operation: [
      'Friction coefficient must stay ~0.42 across the whole temperature range — the recipe, not one material, does that.',
      'The scorched surface layer prevents green fade on day one.',
      'A worn pad transfers a film onto the disc — you brake on pad-on-film, not pad-on-iron.',
    ],
    materials: [
      {
        name: 'SEMI-METALLIC FRICTION COMPOUND',
        cls: 'Bonded composite · pad',
        composition: [
          { element: 'Steel fiber', pct: 30 },
          { element: 'Phenolic resin', pct: 20 },
          { element: 'Barite', pct: 20 },
          { element: 'Graphite', pct: 15 },
          { element: 'Cu/brass', pct: 10 },
          { element: 'Aramid', pct: 5 },
        ],
        process: 'Powder blend hot-pressed at 160°C onto the backing plate, post-baked, surface scorched at 600°C',
        why: 'Every ingredient fixes another’s flaw: steel bites but squeals, graphite silences but fades, resin binds but gasses — the blend is the product.',
        props: [
          { label: 'µ', value: '0.42 ±0.05' },
          { label: 'LIFE', value: '~50,000 km' },
        ],
      },
    ],
  },
  {
    id: 'brk-caliper',
    code: 'BRK-03',
    name: 'CALIPER — 4 PISTON',
    system: 'brakes',
    mass: '3.6 kg',
    summary:
      'The hydraulic fist. Converts 80 bar of fluid pressure into 45 kN of clamp — and hides a self-adjusting mechanism inside a rubber ring.',
    operation: [
      'Opposed pistons squeeze the pads evenly from both sides.',
      'Seal rollback retracts pads 0.15 mm — zero drag, instant bite.',
    ],
    materials: [
      {
        name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
        cls: 'Aluminum body · phenolic pistons · EPDM seals',
        composition: [
          { element: 'Al body', pct: 80 },
          { element: 'Pistons', pct: 13 },
          { element: 'Seals/fittings', pct: 7 },
        ],
        process: 'Body, pistons, seals, bleed hardware — each a node below',
        why: 'Four materials in one fist: aluminum for heat, phenolic for insulation, EPDM for the hidden retraction mechanism.',
        props: [
          { label: 'CLAMP', value: '45 kN' },
          { label: 'LINE PRESSURE', value: '80+ bar' },
        ],
      },
    ],
    children: CALIPER_KIDS,
  },
  {
    id: 'brk-fluid',
    code: 'BRK-04',
    name: 'DOT 4 FLUID + LINES',
    system: 'brakes',
    mass: '0.9 L system',
    summary:
      'The incompressible messenger. Pedal to caliper in 3 milliseconds through steel veins — with one fatal flaw: it drinks water from the air and lowers its own boiling point every year.',
    operation: [
      'Fluid transmits pressure essentially instantly and identically to all four corners.',
      'Hygroscopic by design — it absorbs moisture SO THAT water never pools and freezes or rusts a line.',
      'At 3% water (≈2 years), wet boiling point drops from 230°C to 155°C — then one mountain descent makes vapor, and vapor compresses. No pedal.',
    ],
    materials: [
      {
        name: 'BORATE-ESTER GLYCOL + Cu-BRAZED STEEL LINES',
        cls: 'Hydraulic fluid · double-wall tubing',
        composition: [
          { element: 'Glycol ethers', pct: 60 },
          { element: 'Borate esters', pct: 30 },
          { element: 'Inhibitors', pct: 10 },
        ],
        process: 'Lines: double-wrapped steel strip, copper-brazed through, zinc-aluminum coated, double-flared ends',
        why: 'Borate esters chemically bind absorbed water, holding boiling point high for longer — the difference between DOT 3 and DOT 4.',
        props: [
          { label: 'DRY BOIL', value: '230°C' },
          { label: 'WET BOIL', value: '155°C' },
          { label: 'CHANGE', value: 'every 2 years' },
        ],
      },
    ],
  },
]

/* ============================ WHEELS SUBTREES ============================ */

export const TIRE_KIDS: Part[] = [
  {
    id: 'tir-tread',
    code: 'TIR-01',
    name: 'TREAD + SIDEWALL',
    system: 'wheels',
    mass: '3.2 kg',
    summary:
      'The only part of the car that touches the world. Silica-filled rubber whose grip comes from literally interlocking with the road’s texture, molecule by molecule.',
    operation: [
      'Tread blocks squirm into road asperities; sipes (razor cuts) give wet-road bite edges.',
      'Circumferential grooves pump 30 litres of water per second aside at highway speed.',
      'The sidewall is a different compound entirely — tuned for flex fatigue, not grip.',
    ],
    materials: [
      {
        name: 'SILICA-SBR TREAD COMPOUND',
        cls: 'Functionalized elastomer blend',
        composition: [
          { element: 'SBR rubber', pct: 40 },
          { element: 'Natural rubber', pct: 15 },
          { element: 'Silica', pct: 25 },
          { element: 'Carbon black', pct: 10 },
          { element: 'Oils + sulfur', pct: 10 },
        ],
        process: 'Silane coupling agents chemically bond silica to rubber during mixing; vulcanized at 170°C in the tread mold',
        why: 'Silica keeps the rubber soft and grippy at 5°C where carbon-black compounds go glassy — the wet-braking revolution of the last 30 years.',
        props: [
          { label: 'WET µ', value: '~1.0' },
          { label: 'GLASS TEMP', value: '-25°C' },
        ],
      },
    ],
  },
  {
    id: 'tir-belts',
    code: 'TIR-02',
    name: 'STEEL BELT PACKAGE',
    system: 'wheels',
    mass: '2.1 kg',
    summary:
      'Two plies of brass-coated steel cords crossed at ±22° under the tread — a flexible hoop that keeps the contact patch flat while cornering at 1 g.',
    operation: [
      'Crossed plies form a shear-stiff lattice: flexible to roll, rigid against squirm.',
      'Restricts tread movement so blocks don’t wiggle — squirm is heat, and heat is wear.',
      'A nylon cap ply over the belts stops them lifting at 250 km/h centrifugal load.',
    ],
    materials: [
      {
        name: 'BRASS-PLATED STEEL CORD',
        cls: 'High-tensile wire · belt plies',
        composition: [
          { element: 'Steel cord', pct: 70 },
          { element: 'Skim rubber', pct: 28 },
          { element: 'Brass coat', pct: 2 },
        ],
        process: '0.25 mm wires (3,400 MPa!) twisted 2+2, calendered into rubber sheet, cut at angle',
        why: 'The brass isn’t decoration: copper in it reacts with the rubber’s sulfur during cure, forming the only reliable rubber-to-steel chemical bond known.',
        props: [
          { label: 'WIRE TENSILE', value: '3,400 MPa' },
          { label: 'PLY ANGLE', value: '±22°' },
        ],
      },
    ],
  },
  {
    id: 'tir-carcass',
    code: 'TIR-03',
    name: 'CARCASS + INNER LINER',
    system: 'wheels',
    mass: '2.4 kg',
    summary:
      'The pressure vessel. Radial polyester cords carry the 2.5-bar inflation that actually holds the car up — the air carries the car, the tire just contains the air.',
    operation: [
      'Radial cords run bead-to-bead at 90°; inflation tensions them like spokes of force.',
      'The inner liner is the tube you think tubeless tires don’t have — a butyl rubber skin bonded inside.',
      'Flex without fatigue: the sidewall cords bend 8 times a second for 60,000 km.',
    ],
    materials: [
      {
        name: 'PET CORD + HALOBUTYL LINER',
        cls: 'Polyester ply · air-barrier rubber',
        composition: [
          { element: 'PET cords', pct: 45 },
          { element: 'Casing rubber', pct: 30 },
          { element: 'Halobutyl liner', pct: 25 },
        ],
        process: 'Cords dipped in RFL adhesive, calendered; liner laminated first onto the building drum',
        why: 'Halobutyl rubber is 10× less air-permeable than natural rubber — it IS the reason you check pressure monthly instead of daily.',
        props: [
          { label: 'HOLDS', value: '2.5 bar for months' },
          { label: 'FLEX CYCLES', value: '~5×10⁷' },
        ],
      },
    ],
  },
  {
    id: 'tir-bead',
    code: 'TIR-04',
    name: 'BEAD BUNDLE + APEX',
    system: 'wheels',
    mass: '1.1 kg',
    summary:
      'The anchor. A hoop of high-carbon wires that clamps the tire to the rim air-tight and transmits every Newton of drive, brake and cornering force — through friction alone.',
    operation: [
      'The inextensible wire hoop seats against the rim’s bead ledge at 2.5+ bar.',
      'Everything the engine and brakes do crosses this rubber-on-metal friction joint.',
      'The apex (stiff rubber wedge above the bead) tunes steering response — taller apex, sharper car.',
    ],
    materials: [
      {
        name: '0.96 mm HT BEAD WIRE',
        cls: 'High-carbon steel · wound hoop',
        composition: [
          { element: 'Steel wire', pct: 80 },
          { element: 'Apex rubber', pct: 15 },
          { element: 'Bronze coat', pct: 5 },
        ],
        process: 'Single wire wound 4×4 into a square bundle, wrapped, with hard apex extrusion on top',
        why: 'The bead must never stretch — if it grows 1%, the tire leaves the rim in a corner. High-carbon wire at 2,000 MPa doesn’t.',
        props: [
          { label: 'HOOP STRENGTH', value: '~18 kN' },
          { label: 'SEATS AT', value: '2.5–4 bar pop' },
        ],
      },
    ],
  },
]

export const WHEELS_KIDS: Part[] = [
  {
    id: 'whl-tire',
    code: 'WHL-01',
    name: 'TIRE — RADIAL',
    system: 'wheels',
    mass: '9.4 kg',
    summary:
      'The most underrated component on the car: a composite pressure vessel of rubber, steel, and polyester with more patents behind it than the engine.',
    operation: [
      'Carries the car on compressed air, grips via molecular interlock, steers via sidewall twist.',
      'Four distinct structures laminated into one: tread, belts, carcass, bead.',
    ],
    materials: [
      {
        name: 'ASSEMBLY — DISMANTLE FOR LAYERS',
        cls: 'Laminated composite · 4 structures',
        composition: [
          { element: 'Rubber compounds', pct: 55 },
          { element: 'Steel', pct: 25 },
          { element: 'Textile', pct: 15 },
          { element: 'Bead wire', pct: 5 },
        ],
        process: 'Built flat on a drum, then blown into shape and cooked in the mold — tread, belts, carcass, bead each a node below',
        why: 'Peel a tire open and it’s an onion of specialized layers, each solving one problem the others create.',
        props: [
          { label: 'CONTACT PATCH', value: '~palm-sized' },
          { label: 'PRESSURE', value: '2.5 bar' },
        ],
      },
    ],
    children: TIRE_KIDS,
  },
  {
    id: 'whl-rim',
    code: 'WHL-02',
    name: 'FLOW-FORMED RIM',
    system: 'wheels',
    mass: '9.8 kg',
    summary:
      'Cast where shape matters, forged where strength matters: the barrel is rolled out under pressure until its grain flows like a forging. Rotating mass counts double.',
    operation: [
      'Spokes carry the car’s weight in rotation — each spoke loads and unloads every revolution.',
      'The barrel seals the tire beads and takes pothole rim-strikes.',
      'Every kg removed here is worth 2 kg off the body for acceleration (and 1.5 for ride).',
    ],
    materials: [
      {
        name: 'A356-T6 FLOW-FORMED',
        cls: 'Aluminum · cast + spun barrel',
        composition: [
          { element: 'Al', pct: 92.0 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
        ],
        process: 'Low-pressure cast center; barrel then spun against rollers at 350°C, stretching it 30% — grain elongates like forging',
        why: 'Flow-forming gives the barrel forged-grade strength at 2.5 mm thin — pure casting that thin would crack on the first pothole.',
        props: [
          { label: 'BARREL WALL', value: '2.5 mm' },
          { label: 'SIZE', value: '19 × 8.5J' },
        ],
      },
    ],
  },
  {
    id: 'whl-valve',
    code: 'WHL-03',
    name: 'TPMS VALVE',
    system: 'wheels',
    mass: '38 g',
    summary:
      'A pressure lab inside the tire: sensor, battery, and radio bolted to the valve stem, screaming its reading to the car every 60 seconds for ten years on one coin cell.',
    operation: [
      'Piezoresistive die reads absolute pressure ±0.1 bar and temperature.',
      'Wakes on centrifugal switch when rolling; sleeps parked to save the cell.',
      'Transmits 433 MHz bursts; the car learns which corner by phase correlation with wheel-speed sensors.',
    ],
    materials: [
      {
        name: 'Si MEMS + Li COIN CELL',
        cls: 'Silicon sensor · electronics module',
        composition: [
          { element: 'PA66 housing', pct: 45 },
          { element: 'Li cell', pct: 25 },
          { element: 'PCB + Si', pct: 20 },
          { element: 'Al stem', pct: 10 },
        ],
        process: 'MEMS die wire-bonded, potted in epoxy, module clamped to the aluminum stem',
        why: 'The module lives through 3,000 g of centrifugal load at speed while its silicon diaphragm resolves hundredths of a bar.',
        props: [
          { label: 'ACCURACY', value: '±0.1 bar' },
          { label: 'BATTERY', value: '~10 years' },
        ],
      },
    ],
  },
  {
    id: 'whl-lugs',
    code: 'WHL-04',
    name: 'WHEEL STUDS & NUTS',
    system: 'wheels',
    mass: '720 g / corner',
    summary:
      'Five stretched steel pins holding each wheel on — not by the studs’ shear strength, but by the friction their 50 kN of clamp creates between wheel and hub.',
    operation: [
      'Torqued to 130 Nm, each stud stretches ~0.1 mm, storing clamp like a spring.',
      'The wheel is held by FRICTION at the hub face — the studs never feel the driving loads if torqued right.',
      '60° conical nut seats self-center the wheel to 0.05 mm.',
    ],
    materials: [
      {
        name: 'CLASS 10.9 COLD-FORGED STUDS',
        cls: 'Medium-carbon boron steel · studs',
        composition: [
          { element: 'Fe', pct: 97.9 },
          { element: 'Mn', pct: 0.9 },
          { element: 'C', pct: 0.35 },
          { element: 'B', pct: 0.003 },
        ],
        process: 'Cold-forged head, rolled threads, knurled press-fit shoulder into the hub flange',
        why: 'Rolled (not cut) threads leave compressive skin in the roots — the difference between a million load cycles and a wheel in the ditch.',
        props: [
          { label: 'CLAMP / STUD', value: '~50 kN' },
          { label: 'TORQUE', value: '130 Nm, star pattern' },
        ],
      },
    ],
  },
]
