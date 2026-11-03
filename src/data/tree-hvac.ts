import type { Part } from './parts'

/** same reference constant pattern as tree-powertrain.ts */
const GUPTA =
  'S.K. Gupta — A Textbook of Automobile Engineering (S. Chand): Engine Construction, Engine Components & Valve Mechanism chapters'

/* ========================== COMPRESSOR SUBTREE ============================ */

const COMPRESSOR_KIDS: Part[] = [
  {
    id: 'cmp-scroll',
    code: 'CMP-01',
    name: 'SCROLL SET',
    system: 'thermal',
    mass: '740 g',
    summary:
      'Two aluminum spirals nested into each other. One never moves; the other orbits — circles without ever rotating — and the crescent of gas trapped between them has nowhere to go but smaller.',
    operation: [
      'The orbiting scroll rides a 5 mm eccentric on the shaft; an Oldham coupling lets it circle but never spin.',
      'Gas pockets seal at the spiral mouths at 3 bar, then shrink continuously as they ride the spiral inward.',
      'By the center port the same gas fills ~1/6 the volume: 17 bar, ~80°C — no valves did any work, the geometry IS the compression.',
      'Spring-loaded tip seals in machined grooves ride the opposite wall, keeping pockets apart with almost no friction — which is why a scroll hums where old piston compressors knocked.',
    ],
    refs: [GUPTA],
    materials: [
      {
        name: 'A390 HYPEREUTECTIC ALUMINUM',
        cls: 'High-silicon aluminum · both scrolls',
        composition: [
          { element: 'Al', pct: 77.0 },
          { element: 'Si', pct: 17.0 },
          { element: 'Cu', pct: 4.5 },
          { element: 'Mg', pct: 0.55 },
          { element: 'Fe', pct: 0.5 },
        ],
        process:
          'Precision die cast, spiral flanks CNC-milled to 10 µm tolerance, tip-seal grooves machined into the wrap crowns',
        why: 'Above 12.6% silicon, hard primary Si crystals freeze out of the melt — ceramic islands in the aluminum that let two scrolls rub for 200,000 km on a mist of oil.',
        props: [
          { label: 'FLANK TOLERANCE', value: '10 µm' },
          { label: 'COMPRESSION', value: '3 → 17 bar' },
          { label: 'ORBIT', value: '5 mm eccentric' },
        ],
      },
    ],
  },
  {
    id: 'cmp-clutch',
    code: 'CMP-02',
    name: 'MAGNETIC CLUTCH',
    system: 'thermal',
    mass: '1.9 kg',
    summary:
      'A 12-volt electromagnet deciding whether the belt’s spin reaches the scrolls. The pulley always turns; the compressor only when half a millimetre of air gap snaps shut.',
    operation: [
      'A/C off: the pulley freewheels on its sealed double-row bearing — the compressor costs the engine nothing.',
      'Energize the coil: its field reaches straight through the steel pulley face and yanks the spring-steel drive plate across a 0.5 mm air gap in ~50 ms.',
      'Friction faces lock, the shaft spins, the dash clicks — that click IS the plate landing.',
      'The gap is the life of the part: too tight and it drags, worn past ~0.8 mm and the coil can’t pull — the clutch slips, and slip is heat, and heat is death.',
    ],
    fasteners: 'M6 shaft nut, 14 Nm, with shim washers — the shims SET the 0.5 mm air gap',
    materials: [
      {
        name: 'ENAMELED COPPER WINDINGS, EPOXY POTTED',
        cls: 'Copper windings · clutch coil',
        composition: [
          { element: 'Cu wire', pct: 62 },
          { element: 'Fe field core', pct: 24 },
          { element: 'Epoxy potting', pct: 10 },
          { element: 'PA bobbin', pct: 4 },
        ],
        process:
          '~400 turns of 0.6 mm enameled wire wound into a steel field shell, vacuum-potted against vibration',
        why: '3.5 amps through 400 turns makes a magnet that pulls 60 Nm of drive across an air gap — switched on and off by a transistor the size of a fingernail.',
        props: [
          { label: 'DRAW', value: '~3.5 A @ 12 V' },
          { label: 'PULL', value: 'across 0.5 mm' },
          { label: 'ENGAGE', value: '~50 ms' },
        ],
      },
      {
        name: '65Mn SPRING-STEEL DRIVE PLATE',
        cls: 'Spring steel · armature + leaf springs',
        composition: [
          { element: 'Fe', pct: 97.9 },
          { element: 'Mn', pct: 1.1 },
          { element: 'C', pct: 0.65 },
          { element: 'Si', pct: 0.25 },
        ],
        process:
          'Stamped armature riveted to the hub through three leaf springs — the springs carry torque AND pull the plate back when the coil drops',
        why: 'The plate must fly 0.5 mm forward a hundred thousand times and always spring home — leaf springs are the return mechanism and the drive coupling in one part.',
        props: [
          { label: 'AIR GAP', value: '0.35–0.65 mm' },
          { label: 'TORQUE', value: '60 Nm locked' },
        ],
      },
    ],
  },
]

/* ============================ HVAC CHILDREN =============================== */

const HVAC_KIDS: Part[] = [
  {
    id: 'hvc-compressor',
    code: 'HVC-02',
    name: 'A/C COMPRESSOR',
    system: 'thermal',
    mass: '6.3 kg',
    summary:
      'The heart of the cold loop. A belt-driven scroll pump squeezing R-1234yf vapor from 3 to 17 bar — the one place in the whole cycle where work goes in.',
    operation: [
      'The magnetic clutch couples the belt pulley to the shaft on ECU command — otherwise the pulley freewheels at zero drag.',
      'The scroll set inhales cold 3-bar vapor from the evaporator and discharges it at 17 bar and ~80°C.',
      'Compression is the price of the trick: heat only flows hot → cold, so cabin heat can leave only if the refrigerant is first made HOTTER than the summer air outside.',
      'PAG oil mist rides along with the refrigerant, lubricating the scrolls on the fly — the system has no sump; the whole loop is the sump.',
    ],
    fasteners: 'M8×1.25 class 8.8 through-bolts to the block bracket, 22 Nm',
    refs: [GUPTA],
    materials: [
      {
        name: 'ADC12 DIE-CAST ALUMINUM',
        cls: 'Aluminum · front + rear housings',
        composition: [
          { element: 'Al', pct: 86.5 },
          { element: 'Si', pct: 10.5 },
          { element: 'Cu', pct: 2.0 },
          { element: 'Fe', pct: 0.8 },
        ],
        process: 'High-pressure die cast halves, O-ring sealed, bolted through to the scroll set',
        why: 'The housing bolts to a vibrating engine and holds 17 bar for 15 years — thin-wall aluminum keeps 6 kg from becoming 10 on the end of a bracket.',
        props: [
          { label: 'DISCHARGE', value: '17 bar / ~80°C' },
          { label: 'SUCTION', value: '3 bar' },
        ],
      },
      {
        name: 'PAG 46 COMPRESSOR OIL',
        cls: 'Polyalkylene glycol · circulating lubricant',
        composition: [
          { element: 'PAG base stock', pct: 95 },
          { element: 'Anti-wear additives', pct: 5 },
        ],
        process: '120 ml charged with the refrigerant — fully miscible, it travels the entire loop and comes home',
        why: 'The oil must dissolve into the refrigerant to survive the trip through the condenser and evaporator — mineral oil would pool in the cold side and starve the scrolls.',
        props: [{ label: 'CHARGE', value: '120 ml' }],
      },
    ],
    children: COMPRESSOR_KIDS,
  },
  {
    id: 'hvc-condenser',
    code: 'HVC-03',
    name: 'CONDENSER',
    system: 'thermal',
    mass: '2.9 kg (dry)',
    summary:
      'The exit door for cabin heat. Superheated 80°C vapor enters the top header; ram air strips its heat, and by the bottom it drips out as warm liquid — the phase change does the heavy lifting.',
    operation: [
      'Hot 17-bar vapor from the compressor enters the top of the core, ahead of the radiator in the airstream.',
      'Gas threads through dozens of flat microchannel tubes — each extruded with ~20 sub-millimetre ports — while louvered fins hand the heat to passing air.',
      'Mid-core the vapor crosses its dew point and condenses: the phase change releases ~5× more heat than merely cooling the gas ever could.',
      'The receiver-drier bottle at the outlet stores liquid and its desiccant strips water — a single drop of moisture reacts into acid inside the loop.',
    ],
    refs: [GUPTA],
    materials: [
      {
        name: 'AA3102 MICROCHANNEL ALUMINUM',
        cls: 'Extruded aluminum · tubes + fins + headers',
        composition: [
          { element: 'Al', pct: 99.1 },
          { element: 'Mn', pct: 0.3 },
          { element: 'Fe', pct: 0.5 },
          { element: 'Cu', pct: 0.1 },
        ],
        process:
          'Flat tubes extruded with ~20 internal ports each, stacked with louvered fins, whole core furnace-brazed in one shot',
        why: 'Microchannels put every molecule of refrigerant within 0.4 mm of a wall — triple the heat transfer of old round-tube cores on half the refrigerant charge.',
        props: [
          { label: 'HEAT REJECT', value: '~7 kW' },
          { label: 'PORT SIZE', value: '~0.8 mm' },
          { label: 'VS ROUND TUBE', value: '-50% charge' },
        ],
      },
      {
        name: 'XH-9 MOLECULAR SIEVE',
        cls: 'Zeolite desiccant · receiver-drier fill',
        composition: [
          { element: 'Zeolite 3A beads', pct: 90 },
          { element: 'Clay binder', pct: 10 },
        ],
        process: 'Beads bagged in felt inside the drier can — pores sized to trap water molecules but pass refrigerant',
        why: 'Water + refrigerant + heat = hydrofluoric acid chewing the loop from inside. The sieve’s 3-ångström pores are a water-only jail.',
        props: [{ label: 'HOLDS', value: '~6 g H₂O' }],
      },
    ],
  },
  {
    id: 'hvc-evaporator',
    code: 'HVC-04',
    name: 'EVAPORATOR + TXV',
    system: 'thermal',
    mass: '2.4 kg',
    summary:
      'The cold maker — a radiator running backwards. Liquid refrigerant sprays through a pinhole into low pressure and boils at 3°C, and boiling liquid devours heat; cabin air is what feeds it.',
    operation: [
      'The TXV pinhole drops liquid refrigerant from 17 bar to 3 bar — the pressure collapse alone flashes it into a frigid mist.',
      'The mist boils through the plate passages at 3°C; its latent heat of vaporization comes straight out of the blower air passing the fins.',
      'Held at 3°C, never 0°C: the fins run wet with condensed cabin moisture, and at 0°C that film freezes into an airflow-blocking iceberg — cold, but no air.',
      'The TXV’s sensing bulb clamps to the outlet pipe: liquid sneaking through unboiled chills the bulb, the bulb throttles the valve. A self-balancing loop with zero electronics.',
      'The puddle under a parked car in summer is the cabin’s humidity — dehumidified air is a free side effect.',
    ],
    refs: [GUPTA],
    materials: [
      {
        name: 'BRAZED ALUMINUM PLATE-FIN',
        cls: 'Laminated aluminum · evaporator body',
        composition: [
          { element: 'Al', pct: 96.6 },
          { element: 'Mn', pct: 1.2 },
          { element: 'Si (braze clad)', pct: 2.2 },
        ],
        process:
          'Stamped plate pairs stacked with fins between, furnace-brazed into one block; hydrophilic coating sheds condensate',
        why: 'The whole brick cycles wet–dry thousands of times — brazed aluminum with a hydrophilic skin drains the water before mold can move in.',
        props: [
          { label: 'SURFACE', value: '3°C held' },
          { label: 'COOLING', value: '~5 kW' },
        ],
      },
      {
        name: 'CW614N BRASS TXV BODY',
        cls: 'Machining brass · expansion valve',
        composition: [
          { element: 'Cu', pct: 58 },
          { element: 'Zn', pct: 39 },
          { element: 'Pb', pct: 3 },
        ],
        process: 'Machined block valve; diaphragm chamber charged with its own refrigerant dose, sealed for life',
        why: 'The valve meters the entire cooling system through an orifice smaller than a grain of rice — brass machines to that precision and never corrodes in refrigerant.',
        props: [
          { label: 'DROP', value: '17 → 3 bar' },
          { label: 'ORIFICE', value: '~1.5 mm' },
        ],
      },
    ],
  },
  {
    id: 'hvc-blower',
    code: 'HVC-05',
    name: 'BLOWER + CABIN FILTER',
    system: 'thermal',
    mass: '1.7 kg',
    summary:
      'A squirrel cage, not a propeller: forty little scoops moving 450 m³ of air an hour almost silently — through a pleated filter that stops pollen dead at 5 µm first.',
    operation: [
      'The cage’s forward-curved vanes each grab a sip of air and sling it outward; the scroll housing turns the spin into one smooth stream.',
      'Forty small bites beat four big ones — that is why a cage whispers where a blade fan of the same flow would roar.',
      'A PWM-driven motor slides the speed smoothly from whisper to gale instead of the old resistor-pack steps.',
      'Upstream, the cabin filter’s electrostatic pleats snag particles down to 5 µm — pollen runs 10–100 µm, so it never reaches your nose.',
    ],
    materials: [
      {
        name: 'PP-GF20 POLYPROPYLENE CAGE',
        cls: 'Glass-filled polypropylene · fan wheel + scroll housing',
        composition: [
          { element: 'Polypropylene', pct: 80 },
          { element: 'Glass fiber', pct: 20 },
        ],
        process: 'Injection molded in one shot, spin-balanced with clip weights to <0.5 g·cm',
        why: 'Forty thin vanes must stay identical for 15 years an arm’s length from your ear — glass-filled PP molds them perfectly and never rings like metal.',
        props: [
          { label: 'FLOW', value: '450 m³/h max' },
          { label: 'BALANCE', value: '<0.5 g·cm' },
        ],
      },
      {
        name: 'ELECTRET PP + CELLULOSE PLEATS',
        cls: 'Electrostatic meltblown polypropylene on cellulose · filter media',
        composition: [
          { element: 'Meltblown PP (electret)', pct: 45 },
          { element: 'Cellulose backing', pct: 40 },
          { element: 'Activated carbon', pct: 15 },
        ],
        process:
          'Fibers corona-charged during meltblowing — the frozen-in static charge grabs particles finer than the mesh could sieve',
        why: 'Sieving alone would choke airflow; electrostatics catch 5 µm dust in a web with 50 µm holes. The carbon layer eats exhaust odors on top.',
        props: [
          { label: 'CAPTURE', value: 'to 5 µm' },
          { label: 'SERVICE', value: '15,000 km' },
        ],
      },
    ],
  },
  {
    id: 'hvc-heater',
    code: 'HVC-06',
    name: 'HEATER CORE',
    system: 'thermal',
    mass: '1.1 kg (wet)',
    summary:
      'Free heat. A hand-sized radiator plumbed into the engine’s 90°C coolant loop — the cabin warms on energy the engine was about to throw away anyway.',
    operation: [
      'Two EPDM hoses tee off the cylinder-head coolant jacket, through the firewall, into the core — the engine never notices the theft.',
      'Blower air forced through the fins picks up to 8 kW of heat the radiator would otherwise have dumped to the street.',
      'Nothing until the engine warms: the heater shares the thermostat’s short loop, which is why winter mornings start cold for the first five minutes.',
    ],
    refs: [GUPTA],
    materials: [
      {
        name: 'AA3003 BRAZED ALUMINUM CORE',
        cls: 'Manganese aluminum · tubes + fins',
        composition: [
          { element: 'Al', pct: 97.8 },
          { element: 'Mn', pct: 1.2 },
          { element: 'Cu', pct: 0.12 },
        ],
        process: 'Furnace-brazed tube-and-fin block — the radiator’s little sibling, built on the same line',
        why: 'Same alloy, same process, same job as the radiator at one-tenth the size — heat exchange is heat exchange, only the direction of profit changes.',
        props: [
          { label: 'OUTPUT', value: '~8 kW' },
          { label: 'COOLANT', value: '90°C feed' },
        ],
      },
      {
        name: 'EPDM HEATER HOSES',
        cls: 'Peroxide-cured EPDM rubber · supply + return',
        composition: [
          { element: 'EPDM rubber', pct: 55 },
          { element: 'Carbon black', pct: 25 },
          { element: 'Aramid knit', pct: 10 },
          { element: 'Oils + cure', pct: 10 },
        ],
        process: 'Extruded over aramid knit reinforcement, cured, spring-clamped at both ends',
        why: 'EPDM shrugs off hot glycol, ozone and engine-bay heat for 15 years — natural rubber would be mush in one summer.',
        props: [{ label: 'RATING', value: '-40°C → 135°C' }],
      },
    ],
  },
  {
    id: 'hvc-ducts',
    code: 'HVC-07',
    name: 'AIR DISTRIBUTION — BLEND DOORS',
    system: 'thermal',
    mass: '3.8 kg',
    summary:
      'The temperature knob is a lie. The box makes 3°C air and 60°C air at the same time — a servo-driven flap decides the mix, and more flaps decide where it hits you.',
    operation: [
      'ALL blower air crosses the evaporator first — cooled and dried no matter what temperature you dialed.',
      'The BLEND door splits the stream: part through the heater core, part around it. Its angle IS the temperature setting.',
      'MODE doors downstream route the mix to face vents, footwells, or the windshield.',
      'Defrost aims the driest air at the glass — dry beats hot for killing fog, which is why defrost runs the A/C even in winter.',
      'Each door sits on a stepper servo with position feedback; the recirculation door upstream chooses cabin air or outside air.',
    ],
    materials: [
      {
        name: 'PP-T20 TALC-FILLED POLYPROPYLENE',
        cls: 'Talc-filled polypropylene · case halves + doors',
        composition: [
          { element: 'Polypropylene', pct: 78 },
          { element: 'Talc', pct: 20 },
          { element: 'Pigment + UV pack', pct: 2 },
        ],
        process: 'Injection molded clamshell halves, vibration-welded, doors snapped onto molded hinge pins',
        why: 'Talc stiffens PP enough to stop the box drumming with blower pulses, and the whole labyrinth molds in two shots — a sheet-metal version would need fifty parts.',
        props: [
          { label: 'DOORS', value: '1 blend + 3 mode + recirc' },
          { label: 'WALL', value: '2.5 mm' },
        ],
      },
      {
        name: 'EPDM FOAM DOOR SEALS',
        cls: 'Closed-cell EPDM foam · door edges + flanges',
        composition: [
          { element: 'EPDM rubber', pct: 75 },
          { element: 'Carbon black', pct: 15 },
          { element: 'Blowing agent residue', pct: 10 },
        ],
        process: 'Die-cut foam strips bonded to every door edge and case joint',
        why: 'A blend door that leaks 10% ruins the temperature math on both sides — soft foam seals the gap through thousands of door sweeps.',
        props: [{ label: 'LEAKAGE', value: '<2% past doors' }],
      },
    ],
  },
]

/* =============================== TOP NODE ================================= */

export const HVAC_PART: Part = {
  id: 'hvac',
  code: 'HVC-01',
  name: 'CLIMATE SYSTEM — A/C & HEAT',
  system: 'thermal',
  mass: '~19 kg (charged)',
  summary:
    'A heat pump bolted into the dash. It cannot make cold — it can only pump heat backwards, moving 5 kW of it from cabin to street with 2 kW of belt power. The refrigeration cycle IS the system.',
  operation: [
    'COMPRESS — the compressor squeezes cold R-1234yf vapor from 3 to 17 bar, forcing it hotter than the summer air outside.',
    'CONDENSE — the condenser hands that heat to the street; the vapor liquefies, releasing its hidden latent heat.',
    'EXPAND — the TXV pinhole drops the warm liquid back to 3 bar; the pressure collapse flashes it into a frigid mist.',
    'EVAPORATE — the mist boils at 3°C in the evaporator, drinking cabin heat; the vapor crawls back to the compressor. Loop closed, forever.',
    'HEAT is the shortcut: a heater core taps the engine’s 90°C coolant, and blend doors mix the two streams to whatever the knob asks.',
  ],
  fasteners:
    'O-ring sealed block fittings on every refrigerant joint, M6 studs, 8 Nm — one nicked O-ring leaks the whole charge in a season',
  refs: [GUPTA],
  materials: [
    {
      name: 'R-1234yf REFRIGERANT (HFO)',
      cls: 'Hydrofluoroolefin working fluid · the loop’s blood',
      composition: [
        { element: 'HFO-1234yf (C₃H₂F₄)', pct: 95 },
        { element: 'PAG oil in circulation', pct: 5 },
      ],
      process:
        '550 g charged through the service ports; boils at -29°C at atmosphere, 3°C at 3 bar — pressure is the thermostat',
      why: 'It replaced R-134a for one number: global warming potential 4 instead of 1,430. It falls apart in the atmosphere in 11 days instead of 13 years — same cold, none of the century of greenhouse debt.',
      props: [
        { label: 'GWP', value: '4 (R-134a: 1,430)' },
        { label: 'CHARGE', value: '550 g' },
        { label: 'BOILS', value: '3°C @ 3 bar' },
      ],
    },
  ],
  children: HVAC_KIDS,
}
