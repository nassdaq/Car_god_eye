/**
 * Engine electrics subtrees — internals of the alternator (ENG-12) and the
 * starter motor (ENG-13). Wired under eng-alternator / eng-starter by tree.ts.
 */
import type { Part } from './parts'

const GUPTA =
  'S.K. Gupta — A Textbook of Automobile Engineering (S. Chand): Engine Construction, Engine Components & Valve Mechanism chapters'

/* ========================== ALTERNATOR SUBTREE =========================== */

export const ALTERNATOR_KIDS: Part[] = [
  {
    id: 'alt-rotor',
    code: 'ALT-01',
    name: 'CLAW-POLE ROTOR',
    system: 'electrical',
    mass: '2.3 kg',
    summary:
      'Twelve iron fingers interleaved around ONE spinning coil. Two amps fed in through the slip rings control 150 amps coming out — the highest leverage ratio in the car.',
    operation: [
      'DC field current enters through two copper slip rings — the only sliding contact in the whole machine.',
      'The single field coil magnetizes the core; the interleaved claws route that flux so north and south poles alternate 12 times around the rim. One coil, twelve poles — the geometry of the iron does the work.',
      'The belt spins it at ~2.5× crank speed; every claw sweeping past a stator slot is a flux reversal, and every reversal induces voltage.',
      'Turn the 2 A field up or down and the 150 A output follows — this tiny current is the regulator’s handle on the whole electrical system.',
    ],
    materials: [
      {
        name: 'FORGED LOW-CARBON IRON CLAWS',
        cls: 'Soft magnetic iron · claw-pole halves',
        composition: [
          { element: 'Fe', pct: 99.2 },
          { element: 'Mn', pct: 0.45 },
          { element: 'Si', pct: 0.15 },
          { element: 'C', pct: 0.04 },
        ],
        process: 'Two star-shaped halves cold-forged, pressed onto the shaft so their fingers interleave around the coil',
        why: 'Almost-pure iron saturates at the highest flux density of any cheap material — carbon would pin the magnetic domains and leave remanent magnetism the regulator could not switch off.',
        props: [
          { label: 'POLES', value: '12' },
          { label: 'SPEED', value: 'up to 18,000 RPM' },
        ],
      },
      {
        name: 'Cu FIELD COIL — MAGNET WIRE',
        cls: 'Enameled copper · single field winding',
        composition: [
          { element: 'Cu', pct: 96 },
          { element: 'Enamel coat', pct: 4 },
        ],
        process: 'One bobbin-wound coil (~400 turns), varnish-impregnated, clamped between the claw halves',
        why: 'All the rotor’s magnetism comes from this one coil: 2–4 A through 400 turns gives the field; the claws multiply it into 12 poles for free.',
        props: [
          { label: 'FIELD CURRENT', value: '2–4 A' },
          { label: 'CONTROLS', value: '150 A output' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'alt-stator',
    code: 'ALT-02',
    name: 'STATOR — 3-PHASE',
    system: 'electrical',
    mass: '2.1 kg',
    summary:
      'A ring of stacked steel sheets with 36 slots and three windings laid 120° apart. The rotor’s spinning field drags electrons through these coils — this is where the 150 amps is actually made.',
    operation: [
      'The rotor’s 12 poles sweep past each slot, flipping the flux north-south-north — every flip pushes current through the wire sitting there.',
      'Three windings spaced 120° apart give three overlapping AC waves: by the time one phase crosses zero, the next is near its peak. Output never dies.',
      'LAMINATIONS: the core is ~100 insulated 0.35 mm sheets, not solid iron. A solid core would be a one-turn short circuit — the changing flux would drive eddy currents swirling around it, cooking the machine. Slicing the iron chops those current loops to nothing.',
    ],
    materials: [
      {
        name: 'M330-35A SILICON STEEL LAMINATIONS',
        cls: 'Electrical steel · slotted core stack',
        composition: [
          { element: 'Fe', pct: 96.6 },
          { element: 'Si', pct: 3.0 },
          { element: 'Al', pct: 0.4 },
        ],
        process: 'Sheets stamped with all 36 slots in one hit, oxide-insulated, stacked and welded; the three phases are wound into the slots and varnish-dipped',
        why: '3% silicon multiplies the steel’s electrical resistance ~4× — eddy currents lose twice: cut short by the laminations, then strangled by the silicon.',
        props: [
          { label: 'SLOTS', value: '36' },
          { label: 'PHASES', value: '3 × 120°' },
          { label: 'SHEET', value: '0.35 mm' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'alt-rectifier',
    code: 'ALT-03',
    name: 'RECTIFIER BRIDGE',
    system: 'electrical',
    mass: '280 g',
    summary:
      'The stator makes AC; the car runs on DC. Six fat diodes on a heatsink plate — one-way valves for electrons — fold three alternating phases into one DC rail. Each carries 50 amps.',
    operation: [
      'Each phase gets a diode pair: one passes its positive half-waves to the B+ terminal, the other passes the negative halves to ground.',
      'Three phases overlapped and rectified leave only ~5% ripple — the battery soaks up the rest as a giant capacitor.',
      'Every diode drops ~0.6 V while passing 50 A — that is 30 W of heat EACH. Hence the finned plate; rectifiers die of heat, never of current.',
      'The diodes also block the battery from draining backwards through the stator when the engine stops — no relay needed.',
    ],
    materials: [
      {
        name: 'Si POWER DIODES ON COPPER SLUGS',
        cls: 'Press-fit junctions · copper heat path',
        composition: [
          { element: 'Cu slugs', pct: 50 },
          { element: 'Al heatsink plate', pct: 42 },
          { element: 'Si dies', pct: 8 },
        ],
        process: 'Diode pellets soldered into copper buttons, press-fit into the finned plate — the plate itself is one electrical terminal',
        why: 'The junction must dump 30 W from a chip the size of a fingernail: copper pulls the heat out, the plate spreads it, the fins hand it to the fan’s airflow.',
        props: [
          { label: 'DIODES', value: '6 × 50 A' },
          { label: 'DROP', value: '~0.6 V each' },
          { label: 'HEAT', value: '~180 W peak' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'alt-regulator',
    code: 'ALT-04',
    name: 'VOLTAGE REGULATOR + BRUSHES',
    system: 'electrical',
    mass: '95 g',
    summary:
      'Holds the whole car at 14.4 V from idle to redline by chopping the rotor’s field current on and off hundreds of times a second — fed in through two carbon blocks skating on the spinning slip rings.',
    operation: [
      'It watches B+ voltage: above 14.4 V the field switches OFF, below it switches ON — hundreds of times per second. The on/off duty cycle IS the control.',
      'Idle with headlights and heated screen: field near 100% duty. Redline with nothing on: a few percent. Same 14.4 V either way.',
      'The brushes ride the slip rings under spring pressure, carrying only the small field current — which is exactly why the field goes through brushes and the 150 A output does not.',
      'Cold mornings it aims higher (~14.8 V): a cold battery needs more push to accept charge.',
    ],
    materials: [
      {
        name: 'COPPER-GRAPHITE BRUSHES',
        cls: 'Sintered sliding contact · brush pair',
        composition: [
          { element: 'Graphite', pct: 55 },
          { element: 'Cu powder', pct: 42 },
          { element: 'Binder', pct: 3 },
        ],
        process: 'Powder pressed and sintered with the pigtail wire molded in; spring-loaded in a holder beside the control die',
        why: 'Graphite lubricates its own sliding contact while the copper carries current — the brush grinds itself away over 150,000 km so the slip rings never have to.',
        props: [
          { label: 'SET POINT', value: '14.4 V' },
          { label: 'FIELD', value: '2–4 A, chopped' },
          { label: 'BRUSH LIFE', value: '~150,000 km' },
        ],
      },
    ],
    refs: [GUPTA],
  },
]

/* ============================ STARTER SUBTREE ============================ */

export const STARTER_KIDS: Part[] = [
  {
    id: 'sta-armature',
    code: 'STA-01',
    name: 'ARMATURE + COMMUTATOR',
    system: 'electrical',
    mass: '1.1 kg',
    summary:
      'The spinning heart: lap-wound copper bars in an iron lamination stack, fed 300 amps through a copper-bar commutator — a rotary switch that reverses every coil at exactly the right angle, every revolution.',
    operation: [
      'Current through windings sitting in the magnet field puts a sideways force on every wire — hundreds of wires, all pushing the same way around: torque.',
      'The commutator’s copper segments flip each coil’s current direction just as it swings past a pole — so the push never turns into a pull.',
      'Lap winding puts many coil paths in parallel — that is how 12 volts can shove 300 amps through it.',
      'Those 300 A heat the copper ~30°C per cranking attempt. Ten seconds is a rating, not a suggestion.',
    ],
    materials: [
      {
        name: 'LAP-WOUND Cu + COMMUTATOR BARS',
        cls: 'Hard-drawn copper · windings + segments',
        composition: [
          { element: 'Cu', pct: 68 },
          { element: 'Fe laminations', pct: 28 },
          { element: 'Mica insulation', pct: 4 },
        ],
        process: 'Hard-drawn copper bars formed into lap coils and hot-staked to the commutator risers; segments separated by undercut mica',
        why: 'Only copper has the conductivity to survive 300 A in this volume — and hard-drawn bars, not round wire, pack the slots to 70% copper fill.',
        props: [
          { label: 'DRAW', value: '~300 A' },
          { label: 'SEGMENTS', value: '25' },
          { label: 'DUTY', value: '10 s bursts' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'sta-solenoid',
    code: 'STA-02',
    name: 'SOLENOID — TWO JOBS',
    system: 'electrical',
    mass: '720 g',
    summary:
      'An electromagnet with two jobs in one stroke: its plunger levers the pinion into the flywheel AND slams a copper disc across the 300-amp contacts. Gear first, power second — enforced by geometry, not electronics.',
    operation: [
      'Key-on energizes BOTH coils: the pull-in (heavy wire, brutal force) and the hold-in (fine wire, frugal).',
      'The plunger strokes in; the fork lever throws the pinion into mesh. Only at the END of the stroke does the disc bridge the two studs — an unmeshed pinion can never see full power.',
      'The instant the main contacts close they short out the pull-in coil — the hold-in alone keeps the plunger seated on a tenth of the current.',
      'Key released: hold-in drops, the return spring snaps the pinion back out of mesh.',
    ],
    materials: [
      {
        name: 'DUAL Cu COILS + STEEL PLUNGER',
        cls: 'Copper windings · soft iron magnetic circuit',
        composition: [
          { element: 'Fe plunger + case', pct: 48 },
          { element: 'Cu wire', pct: 46 },
          { element: 'Cu contact disc', pct: 6 },
        ],
        process: 'Two concentric windings on one bobbin; the case, plunger and end plate form the closed magnetic loop',
        why: 'The copper disc is the only contact geometry that survives switching 300 A: a flat face that wipes itself clean on every slam, with enough mass not to weld shut.',
        props: [
          { label: 'CONTACTS', value: '300 A' },
          { label: 'COILS', value: 'pull-in + hold-in' },
          { label: 'STROKE', value: '~12 mm' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'sta-planetary',
    code: 'STA-03',
    name: 'PLANETARY REDUCTION',
    system: 'electrical',
    mass: '340 g',
    summary:
      'Three small gears walking around inside a ring gear — ~4:1 reduction in a package no wider than the motor itself. It is what lets a 3 kg motor crank an engine forty times its mass.',
    operation: [
      'The sun gear on the armature shaft drives three planets; the ring gear is fixed in the housing.',
      'The planets roll around inside the ring, dragging their carrier at a quarter of the speed with four times the torque.',
      'The load splits three ways — each planet tooth carries only a third of it. That sharing is why the gearset can be this small.',
      'Motor at 20,000 RPM → ~5,000 at the pinion → ~300 at the crank through the flywheel ring gear: ~45:1 total.',
    ],
    materials: [
      {
        name: '16MnCr5 CASE-HARDENED GEAR STEEL',
        cls: 'Carburized steel · sun + planets',
        composition: [
          { element: 'Fe', pct: 97.5 },
          { element: 'Mn', pct: 1.1 },
          { element: 'Cr', pct: 0.95 },
          { element: 'C', pct: 0.17 },
        ],
        process: 'Hobbed, carburized to ~0.4 mm case, honed — the ring gear is cold-formed internally toothed',
        why: 'Starter teeth see full shock torque from a dead stop, thousands of times: a glass-hard carburized skin resists pitting while the soft core absorbs the impact without snapping.',
        props: [
          { label: 'RATIO', value: '~4 : 1' },
          { label: 'PLANETS', value: '3' },
        ],
      },
    ],
    refs: [GUPTA],
  },
  {
    id: 'sta-overrun',
    code: 'STA-04',
    name: 'OVERRUN CLUTCH',
    system: 'electrical',
    mass: '260 g',
    summary:
      'A one-way bearing between motor and pinion: drives in one direction, freewheels the instant the engine fires and outruns it. Without it, the running engine would spin the starter to 60,000 RPM through its own gearing — and burst it.',
    operation: [
      'Rollers sit in ramped pockets between the outer race and the pinion’s inner race, tiny springs nudging each toward the narrow end.',
      'Starter driving: the races try to slip, the rollers wedge up the ramps — locked solid, torque flows to the pinion.',
      'Engine fires: the pinion suddenly outruns the motor, rolling the rollers back to the wide end — freewheeling within one degree of rotation.',
      'This save happens on EVERY start — in the lazy half-second you hold the key after the engine catches, this clutch is all that stands between the armature and 60,000 RPM.',
    ],
    materials: [
      {
        name: '100Cr6 BEARING STEEL RACES + ROLLERS',
        cls: 'Through-hardened steel · ramp-and-roller clutch',
        composition: [
          { element: 'Fe', pct: 96.8 },
          { element: 'Cr', pct: 1.5 },
          { element: 'C', pct: 1.0 },
          { element: 'Mn', pct: 0.35 },
        ],
        process: 'Races machined, through-hardened to 62 HRC, ramps ground; rollers are standard bearing rollers',
        why: 'The entire cranking torque passes through five line contacts the width of a pencil lead — only bearing-grade steel at full hardness takes that contact stress without denting the ramps.',
        props: [
          { label: 'LOCK-UP', value: '<1° rotation' },
          { label: 'PINION', value: '9T' },
          { label: 'SAVES MOTOR AT', value: '60,000 RPM' },
        ],
      },
    ],
    refs: [GUPTA],
  },
]
