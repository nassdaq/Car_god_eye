import type { Part } from './parts'

export const GUPTA =
  'S.K. Gupta — A Textbook of Automobile Engineering (S. Chand): Engine Construction, Engine Components & Valve Mechanism chapters'

/* ========================== AIRBAG MODULE SUBTREE ========================= */

const AIRBAG_KIDS: Part[] = [
  {
    id: 'bag-inflator',
    code: 'ABG-01',
    name: 'PYROTECHNIC INFLATOR',
    system: 'interior',
    mass: '480 g',
    summary:
      'A solid-fuel gas factory the size of a tuna can: a stack of pressed propellant discs that goes from cold storage to a full bag in 30 milliseconds. The first generation burned sodium azide — toxic enough that scrap modules were handled as hazmat; these discs are guanidine nitrate, which burns to little more than hot nitrogen, steam and CO₂.',
    operation: [
      'The squib flashes into the center of the disc stack; every disc face lights at once — stacked discs are a burn-rate dial: more exposed surface, faster gas.',
      'Combustion jumps the chamber to ~200 bar in milliseconds; gas blasts radially out through the perforated steel drum.',
      'A knitted wire filter screen catches slag and strips heat — the gas that meets the nylon is hot, but not burning.',
      'The bag takes its full charge of gas while the deployment recoil hits the steering column at up to 60 g — 0 → full bag in 30 ms.',
    ],
    fasteners: 'Crimped and inertia-welded shut — a pressure vessel with no serviceable parts, by design',
    materials: [
      {
        name: 'GUANIDINE-NITRATE PROPELLANT',
        cls: 'Gas generant · pressed disc stack',
        composition: [
          { element: 'Guanidine nitrate', pct: 62 },
          { element: 'Basic Cu nitrate oxidizer', pct: 30 },
          { element: 'Binder + coolant', pct: 8 },
        ],
        process: 'Powder pressed into wafer discs, stacked around the igniter tube, hermetically sealed with a burst foil',
        why: 'Sodium azide made cyanide-adjacent waste and sodium-hydroxide smoke; guanidine nitrate burns to nitrogen, steam and CO₂ — and stays stable from -40°C to +90°C for 15 years.',
        props: [
          { label: 'FULL BAG', value: '30 ms' },
          { label: 'GAS OUT', value: '~60 L @ 60 g produced' },
          { label: 'SHELF LIFE', value: '15 years' },
        ],
      },
      {
        name: 'DEEP-DRAWN STEEL CHAMBER',
        cls: 'Low-carbon steel · combustion drum + filter screen',
        composition: [
          { element: 'Fe', pct: 98.6 },
          { element: 'Mn', pct: 0.9 },
          { element: 'C', pct: 0.1 },
          { element: 'Knitted SS wire screen', pct: 0.4 },
        ],
        process: 'Two deep-drawn cups inertia-welded rim to rim; exit ports punched on the equator; knitted wire mesh ring packed inside the ports',
        why: 'The drum holds a 200-bar internal explosion with your hands 30 cm away — and the igniter bridge wire threads through its heart, so the weld seam is proof-tested on every single unit.',
        props: [
          { label: 'BURST MARGIN', value: '>2× working pressure' },
          { label: 'SLAG CAUGHT', value: 'filter screen, ~100%' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'bag-cushion',
    code: 'ABG-02',
    name: 'NYLON CUSHION',
    system: 'interior',
    mass: '240 g',
    summary:
      'Sixty litres of ripstop fabric origami-folded into a fist-sized block — with holes cut in the back on purpose. The bag is already DEFLATING by the time your head arrives, because a sealed bag would be a trampoline: it has to leak to catch you.',
    operation: [
      'Inflator gas slams the folds open; the pleated pack unfurls along creases rehearsed at the factory.',
      'Internal tethers stop the face panel at ~30 cm — a bag without tethers balloons into a sphere aimed at your chin.',
      'Two vent holes in the rear panel start bleeding gas the instant pressure peaks.',
      'Your head lands at ~50 ms and rides the venting gas down — the controlled leak is the crumple zone; peak head deceleration drops by half.',
    ],
    materials: [
      {
        name: 'NYLON 6,6 RIPSTOP',
        cls: 'Polyamide fabric · 470 dtex cushion + tethers',
        composition: [
          { element: 'PA66 yarn', pct: 93 },
          { element: 'Coating (bag side)', pct: 7 },
        ],
        process: 'Woven with a ripstop grid, one-piece-woven or sewn with PA66 thread, thin silicone coating on the gas side, vacuum-folded and heat-set',
        why: 'Nylon 6,6 holds tear strength at the 90°C a parked dashboard reaches and absorbs the 500°C gas gulp without melting through; the coating meters porosity so the venting math stays exact for 15 years folded.',
        props: [
          { label: 'VOLUME', value: '~60 L driver bag' },
          { label: 'VENTS', value: '2 × ~40 mm' },
          { label: 'HEAD ARRIVES', value: '~50 ms — bag deflating' },
        ],
      },
    ],
  },
  {
    id: 'bag-igniter',
    code: 'ABG-03',
    name: 'SQUIB INITIATOR',
    system: 'interior',
    mass: '4 g',
    summary:
      'The smallest part in the car with the biggest job: a hair-thin bridge wire buried in a pinch of ZPP flash charge. Feed it 1.75 amps and it fires in 2 milliseconds — the single electrical event the whole SRS exists to deliver, exactly once.',
    operation: [
      'The SRS ECU dumps its firing capacitor through the bridge wire: 1.75 A minimum, all-fire.',
      'The wire reaches ignition temperature in under a millisecond; the ZPP charge pressed around it flashes at ~4,000°C.',
      'That spit of flame lights the booster, which lights the propellant disc stack — total squib delay: ~2 ms.',
      'A shorting clip bridges both pins whenever the connector is open, so static or a stray probe cannot fire it on the bench.',
    ],
    fasteners: 'Keyed 2-pin connector with integral shorting clip — the pins are shorted together until the plug is fully seated',
    materials: [
      {
        name: 'ZPP FLASH CHARGE',
        cls: 'Zirconium–potassium-perchlorate pyrotechnic · initiator',
        composition: [
          { element: 'Zr fuel', pct: 48 },
          { element: 'KClO₄ oxidizer', pct: 48 },
          { element: 'Binder', pct: 4 },
        ],
        process: 'Milligrams of ZPP pressed directly over the bridge wire inside a hermetic charge cup',
        why: 'ZPP fires from a tiny energy input, works from -40°C to +100°C, and its output is a repeatable flame spit — initiator chemistry chosen for statistics, not power.',
        props: [
          { label: 'ALL-FIRE', value: '1.75 A / 2 ms' },
          { label: 'NO-FIRE', value: '<0.4 A guaranteed safe' },
        ],
      },
      {
        name: 'BRIDGE WIRE + CERAMIC HEADER',
        cls: 'NiCr resistance wire · glass-to-metal sealed ceramic base',
        composition: [
          { element: 'Ceramic/glass header', pct: 60 },
          { element: 'Pins + weld cup', pct: 38 },
          { element: 'NiCr bridge wire', pct: 2 },
        ],
        process: '20 µm nichrome wire welded across two pins fused through a glass-to-metal seal — a hermetic feed-through rated for the chamber pressure',
        why: 'The firing current must enter a sealed pressure vessel: the ceramic header carries the circuit through the wall and still holds 200 bar while the propellant burns.',
        props: [
          { label: 'BRIDGE', value: '~2 Ω' },
          { label: 'FUNCTION TIME', value: '2 ms' },
        ],
      },
    ],
  },
]

/* ============================ SEATBELT SUBTREE ============================ */

const BELT_KIDS: Part[] = [
  {
    id: 'blt-webbing',
    code: 'BLT-01',
    name: 'POLYESTER WEBBING',
    system: 'interior',
    mass: '280 g',
    summary:
      'A 48 mm ribbon that out-pulls the cable holding a small elevator: 300-plus warp yarns rated to 28 kN — about three tonnes hanging from a strip you can roll up in your hand. And it stretches ~10% on purpose: the strap itself is a damper.',
    operation: [
      'Over 300 high-tenacity warp yarns run the length of the strap; fine weft yarns just hold the ranks in formation — the warp does all the work.',
      'Under crash load the weave elongates ~10%, stretching your stopping distance by centimetres — every centimetre shaves g’s off your chest.',
      'The woven edge is the wear zone: it drags through the D-ring every single trip, so the selvage is woven denser than the body.',
      'UV stabilizers matter more than strength — a sun-rotted strap tests at half its rating with no visible change.',
    ],
    materials: [
      {
        name: 'HIGH-TENACITY POLYESTER WEAVE',
        cls: 'Polyester (PET) yarn · 2/2 twill webbing',
        composition: [
          { element: 'PET warp yarn', pct: 88 },
          { element: 'PET weft yarn', pct: 10 },
          { element: 'UV + dye package', pct: 2 },
        ],
        process: 'Needle-loom woven at ~300 warp ends, dyed, heat-set under tension to lock width and stretch behaviour',
        why: 'Polyester beat nylon for belts because it stretches less when wet, shrugs off UV longer, and its 10% controlled elongation is tuned — enough give to damp the load spike, not enough to let you reach the wheel.',
        props: [
          { label: 'RATED', value: '28 kN (~2.9 t)' },
          { label: 'STRETCH', value: '~10% @ limit' },
          { label: 'WIDTH', value: '48 mm' },
        ],
      },
    ],
  },
  {
    id: 'blt-retractor',
    code: 'BLT-02',
    name: 'INERTIA RETRACTOR',
    system: 'interior',
    mass: '950 g',
    summary:
      'The mechanism that lets the belt ignore you until the moment it must not: a spool that pays out freely for a lifetime of reaching for the radio, then locks dead in a quarter turn — triggered by the belt moving too fast OR the car tilting, two watchdogs, zero electronics.',
    operation: [
      'A clock-type return spring keeps gentle tension; the spool spins free in normal use.',
      'Webbing-sensitive lock: yank the belt and a centrifugal pawl on the spool flies outward, jamming into the toothed lock wheel — the spool arrests in ~25° of rotation.',
      'Vehicle-sensitive lock: a steel ball in a tilt cup rolls off-center under deceleration or roll angle and levers a second pawl into the same teeth — the belt locks even if you never moved.',
      'Both paths are purely mechanical: a dead battery, a fire, a 20-year-old car — the lock still works.',
    ],
    fasteners: 'Single M10 shoulder bolt into the B-pillar base, 7/16-20 UNF anchor thread, 45 Nm — crash hardware, never reused',
    materials: [
      {
        name: 'CASE-HARDENED LOCK HARDWARE',
        cls: 'Case-hardened steel · pawl, lock wheel, frame',
        composition: [
          { element: 'Fe', pct: 97.8 },
          { element: 'C', pct: 0.2 },
          { element: 'Mn', pct: 1.2 },
          { element: 'Cr', pct: 0.8 },
        ],
        process: 'Lock wheel and pawl fine-blanked, case-hardened; frame stamped from HSLA plate; spool die-cast around a steel torsion core',
        why: 'The pawl tip meets the lock wheel tooth carrying 28 kN through a contact patch the size of a grain of rice — only a glass-hard case on a tough core takes that hit without shattering or smearing.',
        props: [
          { label: 'LOCKS IN', value: '~25° spool rotation' },
          { label: 'TRIGGERS', value: 'belt-speed + tilt ball' },
        ],
      },
    ],
  },
  {
    id: 'blt-pretensioner',
    code: 'BLT-03',
    name: 'PYRO PRETENSIONER',
    system: 'interior',
    mass: '320 g',
    summary:
      'Before the crash reaches you, the belt gets there first: a pyrotechnic piston that reels in 10 cm of slack in 10 milliseconds. Your winter coat, your slouch, the slack that would become a head start for your body — gone before you know the crash has begun.',
    operation: [
      'The SRS ECU fires the pretensioner squib in the same decision as the airbags — around 15 ms into the crash.',
      'Gas drives a piston; its rack (or a string of steel balls in a tube) engages a pinion on the spool and spins it backwards.',
      'Up to 10 cm of webbing is wound back in ~10 ms — faster than any human reflex, pinning you to the seatback.',
      'Why it matters: slack lets your body free-fly before the belt engages. Removing it means the belt decelerates you over the whole crash, not the second half.',
    ],
    materials: [
      {
        name: 'MICRO GAS GENERATOR + STEEL TUBE',
        cls: 'Pyrotechnic piston drive · seamless steel tube + rack',
        composition: [
          { element: 'Steel tube + piston', pct: 70 },
          { element: 'Drive balls / rack', pct: 24 },
          { element: 'Propellant charge', pct: 6 },
        ],
        process: 'Cold-drawn seamless tube, piston with ball-chain or molded rack, micro gas generator crimped into the tube end',
        why: 'The tube is both the combustion chamber and the gun barrel — seamless drawn steel because a seam that splits at 100 bar turns a restraint into shrapnel beside your hip.',
        props: [
          { label: 'PULL', value: '~10 cm slack' },
          { label: 'TIME', value: '~10 ms' },
        ],
      },
    ],
  },
  {
    id: 'blt-loadlimiter',
    code: 'BLT-04',
    name: 'LOAD LIMITER',
    system: 'interior',
    mass: '180 g',
    summary:
      'The belt that LETS GO — deliberately. A torsion bar hidden inside the spool twists like taffy once chest load passes ~4 kN, paying out webbing at a controlled force. An unyielding belt saves you from the windshield and then breaks your ribs itself; this one knows when to stop squeezing.',
    operation: [
      'During the first milliseconds the pretensioner and lock hold the spool rigid — full restraint while the crash pulse builds.',
      'When belt tension hits ~4 kN, the torsion bar linking spool to lock wheel reaches its yield point and begins to twist plastically.',
      'The spool rotates against the locked wheel, feeding out webbing at near-constant force — a mechanical fuse that converts crash energy into twisted metal.',
      'Load limiting is controlled yielding: the same engineering idea as the crumple zone, shrunk to a 10 mm bar beside your shoulder.',
    ],
    materials: [
      {
        name: 'TORSION BAR — Q&T STEEL',
        cls: 'Quenched & tempered steel · sacrificial torsion core',
        composition: [
          { element: 'Fe', pct: 98.2 },
          { element: 'C', pct: 0.35 },
          { element: 'Mn', pct: 0.9 },
          { element: 'Cr', pct: 0.55 },
        ],
        process: 'Ground bar with splined ends pressed into spool and lock wheel, quenched and tempered to a precise, repeatable yield torque',
        why: 'The tempering temperature IS the calibration: it sets the exact torque where elastic twist becomes plastic flow, turning a steel bar into a force regulator rated in newtons of chest load.',
        props: [
          { label: 'YIELD', value: '~4 kN belt force' },
          { label: 'PAYOUT', value: 'up to ~15 cm, constant force' },
        ],
      },
    ],
  },
]

/* ============================ TOP-LEVEL SRS NODE ========================== */

export const SAFETY_PART: Part = {
  id: 'safety',
  code: 'SRS-01',
  name: 'SAFETY RESTRAINTS — SRS',
  system: 'interior',
  mass: '~14 kg total',
  summary:
    'The only system in the car built to work exactly once. It sleeps through 15 years of potholes without a false move, then does its entire life’s work inside 50 milliseconds — sensing, deciding, firing, inflating and catching you before your head has crossed half the distance to the wheel.',
  operation: [
    't = 0 ms — the bumper touches. Nothing in the cabin has moved; you are still travelling at road speed.',
    't ≈ 15 ms — MEMS accelerometers have seen enough: the deceleration signature says crash, not curb. The SRS ECU commits and fires.',
    't ≈ 17 ms — pretensioners reel in 10 cm of belt slack; squibs light the airbag propellant.',
    't ≈ 30 ms — the driver bag is fully inflated and already venting.',
    't ≈ 50 ms — your head arrives into a bag deflating on purpose, while torsion-bar load limiters let the belt pay out at ~4 kN. Everything that catches you is yielding in a controlled way — that is the whole trick.',
  ],
  fasteners:
    'Every SRS anchor is torque-controlled crash hardware: 7/16-20 UNF belt anchors @ 45 Nm, M8 ECU bolts to the tunnel, squib connectors with shorting clips — single-use, never reused after deployment',
  materials: [
    {
      name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
      cls: 'Pyrotechnics · webbing · sensors',
      composition: [
        { element: 'Belt + retractor hardware', pct: 45 },
        { element: 'Airbag modules', pct: 35 },
        { element: 'ECU + sensors + wiring', pct: 20 },
      ],
      process: 'Airbag module, belt assembly, control unit and clock spring — each a node below',
      why: 'A restraint system is a choreographed sequence, not a part: the belt holds first, the pretensioner tightens, the bag catches, and then — the counterintuitive genius — both belt and bag deliberately give way.',
      props: [
        { label: 'DECISION', value: '~15 ms' },
        { label: 'FULL DEPLOY', value: '30 ms' },
        { label: 'OCCUPANT', value: 'arrives ~50 ms' },
      ],
    },
  ],
  refs: [GUPTA],
  children: [
    {
      id: 'srs-airbag',
      code: 'SRS-02',
      name: 'DRIVER AIRBAG MODULE',
      system: 'interior',
      mass: '1.3 kg',
      summary:
        'A folded parachute, a solid-fuel gas generator and an electric detonator, all hiding under the horn button you lean on in traffic. From cold and folded to a full 60-litre cushion in 30 milliseconds — roughly ten times faster than a blink.',
      operation: [
        'The ECU’s firing pulse reaches the squib through the clock spring: 1.75 A, decision to detonation in 2 ms.',
        'The inflator’s guanidine-nitrate discs burn; filtered gas floods the folded nylon at ~60 g of gas produced.',
        'The cushion bursts the tear-seamed pad cover along molded weak lines and reaches full shape at ~30 ms.',
        'Vent holes begin dumping gas immediately — by the time your head lands at ~50 ms the bag is a softening, leaking pillow, not a drum.',
      ],
      fasteners:
        'Two spring-wire clips through the wheel armature (release with a T30 from behind) + keyed squib connector with shorting clip',
      materials: [
        {
          name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
          cls: 'Inflator · cushion · initiator',
          composition: [
            { element: 'Inflator can', pct: 55 },
            { element: 'Folded cushion', pct: 25 },
            { element: 'Housing + pad cover', pct: 20 },
          ],
          process: 'Pyrotechnic inflator, nylon cushion and squib initiator — each a node below',
          why: 'Three disciplines in one can: interior trim that must look good for 15 years, textile engineering folded like origami, and rocket-motor chemistry waiting for one 2-millisecond command.',
          props: [
            { label: '0 → FULL', value: '30 ms' },
            { label: 'RECOIL', value: 'up to 60 g at the column' },
          ],
        },
      ],
      children: AIRBAG_KIDS,
    },
    {
      id: 'srs-belt',
      code: 'SRS-03',
      name: 'SEATBELT + RETRACTOR',
      system: 'interior',
      mass: '2.9 kg / seat',
      summary:
        'Statistically the single most effective safety device ever put in a car — and secretly four machines in one strap: a 28 kN ribbon, a mechanical lock with two independent triggers, a pyrotechnic winch, and a torsion-bar fuse that knows when to let go.',
      operation: [
        'Normal driving: the spool pays out and reels in freely; you forget the belt exists. That is the design goal.',
        'Crash onset: centrifugal pawl or tilt-ball lock jams the spool within ~25° of rotation.',
        'At ~15 ms the pretensioner fires, winding back 10 cm of slack in 10 ms — you are coupled to the seat before you have moved.',
        'As chest load passes ~4 kN the load-limiter torsion bar yields, paying webbing back out at constant force while the airbag takes its share.',
      ],
      fasteners:
        '7/16-20 UNF anchor bolts @ 45 Nm at pillar, floor and buckle stalk — class-marked crash hardware, replaced after any deployment',
      materials: [
        {
          name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
          cls: 'Webbing · retractor · pyrotechnics',
          composition: [
            { element: 'Retractor + pretensioner', pct: 55 },
            { element: 'Webbing + buckle + D-ring', pct: 45 },
          ],
          process: 'Webbing, inertia retractor, pretensioner and load limiter — each a node below',
          why: 'The belt’s genius is sequencing: free, then locked, then tightened, then deliberately yielding — four behaviours from one strap, three of them purely mechanical.',
          props: [
            { label: 'HOLDS', value: '28 kN webbing' },
            { label: 'THEN YIELDS', value: '~4 kN limiter' },
          ],
        },
      ],
      children: BELT_KIDS,
    },
    {
      id: 'srs-ecu',
      code: 'SRS-04',
      name: 'SRS CONTROL UNIT + CRASH SENSORS',
      system: 'interior',
      mass: '620 g',
      summary:
        'The 30-millisecond judge. Micro-machined silicon accelerometers watch every bump of the car’s life, and this box must tell a 60 km/h wall from a sledgehammered pothole — then fire explosives at your chest, correctly, even with the battery already destroyed by the crash.',
      operation: [
        'MEMS accelerometers — silicon combs that flex femtometres per g — stream deceleration to the ECU at kilohertz rates; satellite sensors at the crash rails report impact direction.',
        'The algorithm integrates the pulse: a pothole spikes and vanishes, a real crash keeps delivering. The fire/no-fire decision lands inside ~15 ms, deployment choreography within 30 ms.',
        'Firing energy comes from onboard capacitors charged during normal driving — the front of the car, battery included, can be destroyed and the squibs still fire.',
        'It is bolted to the tunnel at the car’s rigid heart, because the sensing reference must be the passenger cell, not a crumpling fender — and it writes the crash to EEPROM as it happens.',
      ],
      fasteners:
        'Three M8 bolts to the tunnel cross-brace — the arrow on the lid must point forward; the case orientation IS the sensor calibration',
      materials: [
        {
          name: 'MEMS SILICON SENSOR DIES',
          cls: 'MEMS semiconductor · micro-machined accelerometers',
          composition: [
            { element: 'Si proof mass + combs', pct: 35 },
            { element: 'Cap wafer', pct: 30 },
            { element: 'ASIC die', pct: 20 },
            { element: 'Package', pct: 15 },
          ],
          process: 'Comb-finger proof mass etched from silicon, capped at wafer level, self-test actuator built in — the ECU wiggles the mass electrostatically at every ignition-on to prove it still moves',
          why: 'A crash sensor that cannot be tested is a guess: MEMS combs can be deflected electrically on demand, so the system verifies its own senses every time you start the car.',
          props: [
            { label: 'RANGE', value: '±50 g sensing' },
            { label: 'DECISION', value: '~15 ms fire call' },
          ],
        },
        {
          name: 'FIRING CAPACITOR BANK + FR-4',
          cls: 'Glass epoxy laminate board · energy reserve',
          composition: [
            { element: 'Glass fabric + resin board', pct: 55 },
            { element: 'Electrolytic reserve caps', pct: 30 },
            { element: 'Cu traces + ASICs', pct: 15 },
          ],
          process: 'Reserve capacitors float-charged to ~25 V; dedicated deployment ASICs switch each squib loop and monitor its resistance continuously',
          why: 'The crash that needs the airbag is the crash that rips the battery cable — the capacitors hold enough energy to fire every squib and run the ECU for ~150 ms with no car left around it.',
          props: [
            { label: 'AUTONOMY', value: '~150 ms post-power' },
            { label: 'LOOPS', value: 'every squib Ω-monitored' },
          ],
        },
      ],
    },
    {
      id: 'srs-clockspring',
      code: 'SRS-05',
      name: 'CLOCK SPRING',
      system: 'interior',
      mass: '310 g',
      summary:
        'The puzzle nobody thinks about: the airbag’s firing wire must cross a joint that rotates five full turns lock to lock — and a sliding contact that sparks or oxidizes is unthinkable in a detonator circuit. The answer is a flat copper ribbon coiled like a watch spring, winding and unwinding inside a drum behind the wheel.',
      operation: [
        'A flat-flex ribbon spirals loosely inside the drum: turning the wheel right coils it tighter, left unwinds it — several wraps of spare ribbon give ~5 turns of travel with zero sliding contact.',
        'The squib circuit, horn and wheel buttons all ride the same ribbon — one continuous conductor from column to wheel hub, no brushes, no wipers.',
        'It must be installed centered: clocked one turn off, the ribbon reaches its end at full steering lock and tears — the classic cause of an airbag warning light after a careless wheel-off repair.',
        'A cancel-cam pin locks the rotor to the steering wheel hub, so the ribbon can never be wound without the wheel.',
      ],
      fasteners:
        'Snap-locked to the column switch housing; transport lock pin holds it centered until the wheel is torqued on',
      materials: [
        {
          name: 'Cu FLAT-FLEX RIBBON',
          cls: 'Rolled-annealed copper conductors · film-jacketed spiral',
          composition: [
            { element: 'RA copper traces', pct: 40 },
            { element: 'Insulating film jacket', pct: 45 },
            { element: 'Adhesive', pct: 15 },
          ],
          process: 'Rolled-annealed copper (grain flattened along the bend axis) laminated between films, coiled into the rotor drum with slack wraps both ways',
          why: 'Rolled-annealed copper survives millions of coil-uncoil flexes where ordinary drawn copper work-hardens and cracks — the ribbon bends a lifetime of steering and still carries the one 1.75 A pulse that matters.',
          props: [
            { label: 'TRAVEL', value: '~5 turns lock-to-lock' },
            { label: 'FLEX LIFE', value: '>10⁶ wheel cycles' },
          ],
        },
      ],
    },
  ],
}
