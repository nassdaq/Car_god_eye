import type { Part } from './parts'

/* =========================== RADIATOR SUBTREE =========================== */

export const RADIATOR_KIDS: Part[] = [
  {
    id: 'rad-core',
    code: 'RAD-01',
    name: 'BRAZED CORE',
    system: 'thermal',
    mass: '3.1 kg',
    summary:
      'Two thousand aluminum joints made simultaneously in one furnace pass. Flat micro-tubes and louvered fins packing 8 m² of cooling surface into a briefcase.',
    operation: [
      'Coolant threads through 40 flat tubes — flat because thin streams shed heat faster.',
      'Louvers cut into every fin trip the airflow, breaking the insulating boundary layer.',
      'The whole 60 kW of engine waste heat crosses 0.25 mm aluminum walls.',
    ],
    materials: [
      {
        name: 'AA3003 + AA4045 CLAD',
        cls: 'Mn-aluminum core · Si-clad braze skin',
        composition: [
          { element: 'Al', pct: 96.6 },
          { element: 'Mn', pct: 1.2 },
          { element: 'Si clad', pct: 2.0 },
          { element: 'Cu', pct: 0.12 },
        ],
        process: 'Tubes and fins stacked, run through a nitrogen furnace at 600°C — the clad skin melts and brazes every joint at once',
        why: 'The 4045 cladding melts 60°C below the 3003 core — the sheet brazes itself without a gram of filler added by hand.',
        props: [
          { label: 'SURFACE', value: '~8 m²' },
          { label: 'REJECTION', value: '60 kW max' },
        ],
      },
    ],
  },
  {
    id: 'rad-tanks',
    code: 'RAD-02',
    name: 'END TANKS + CAP',
    system: 'thermal',
    mass: '1.2 kg',
    summary:
      'Plastic manifolds crimped onto the core — and a pressure cap that is secretly a control valve, raising the system’s boiling point 20°C by bottling it at 1.4 bar.',
    operation: [
      'Tanks distribute flow across all tubes evenly; a baffle forces a two-pass U-flow.',
      'Cap spring holds 1.4 bar: pressurized water boils at 126°C, not 100°C.',
      'Overflow valve burps expansion coolant to the reservoir and sips it back on cooldown.',
    ],
    materials: [
      {
        name: 'PA66-GF30 + EPDM GASKET',
        cls: 'Glass nylon tanks · rubber seal',
        composition: [
          { element: 'PA66', pct: 60 },
          { element: 'Glass fiber', pct: 30 },
          { element: 'EPDM gasket', pct: 10 },
        ],
        process: 'Molded tanks crimped over the header plate with the gasket compressed 30%',
        why: 'Nylon survives 130°C glycol for 15 years; the crimp joint flexes with thermal growth where a glued joint would crack.',
        props: [
          { label: 'CAP PRESSURE', value: '1.4 bar' },
          { label: 'BOIL POINT', value: '126°C' },
        ],
      },
    ],
  },
  {
    id: 'rad-fan',
    code: 'RAD-03',
    name: 'ELECTRIC FAN',
    system: 'thermal',
    mass: '2.3 kg',
    summary:
      'The traffic-jam lifesaver. A 300-watt brushless motor pulling air through the core when the car can’t move fast enough to feed itself.',
    operation: [
      'ECU ramps fan speed with coolant temp — PWM-controlled, not just on/off.',
      'Unequal blade spacing scatters the acoustic signature so it hums instead of whines.',
      'Shroud makes the fan pull through the WHOLE core, not just a fan-sized circle.',
    ],
    materials: [
      {
        name: 'PP-GF30 BLADES + BLDC MOTOR',
        cls: 'Glass polypropylene · brushless drive',
        composition: [
          { element: 'PP-GF30', pct: 55 },
          { element: 'Cu windings', pct: 20 },
          { element: 'Ferrite magnets', pct: 15 },
          { element: 'Steel', pct: 10 },
        ],
        process: 'One-shot molded 7-blade ring fan; motor sealed IP68',
        why: 'The blade ring ties tips together so thin blades can’t flutter; brushless means no brush dust and silent PWM speed control.',
        props: [
          { label: 'POWER', value: '300 W' },
          { label: 'FLOW', value: '2,500 m³/h' },
        ],
      },
    ],
  },
  {
    id: 'rad-coolant',
    code: 'RAD-04',
    name: 'COOLANT — OAT 50/50',
    system: 'thermal',
    mass: '6.5 L',
    summary:
      'Water is the best coolant known — and an aluminum engine’s worst enemy. This is water, chemically disarmed: glycol against freezing, organic acids against corrosion.',
    operation: [
      'Carries heat block → radiator at 150 L/min; water does the carrying, glycol the protecting.',
      'OAT inhibitors form a molecular film ONLY where bare metal appears — self-healing armor.',
      'Rated -37°C to +126°C pressurized, 10 years.',
    ],
    materials: [
      {
        name: 'ETHYLENE GLYCOL OAT BLEND',
        cls: 'Working fluid',
        composition: [
          { element: 'Water', pct: 50 },
          { element: 'Ethylene glycol', pct: 47 },
          { element: 'OAT acids', pct: 2.5 },
          { element: 'Dye + antifoam', pct: 0.5 },
        ],
        process: 'Deionized water only — tap-water minerals plate out as scale exactly where heat flux is highest',
        why: 'Old silicate coolants coated everything and wore out in 2 years; organic-acid films rebuild themselves and last 10.',
        props: [
          { label: 'RANGE', value: '-37°C → 126°C' },
          { label: 'FLOW', value: '150 L/min' },
        ],
      },
    ],
  },
]

/* =========================== BATTERY SUBTREE ============================ */

export const BATTERY_KIDS: Part[] = [
  {
    id: 'bat-plates',
    code: 'BAT-01',
    name: 'PLATE STACK',
    system: 'electrical',
    mass: '11 kg',
    summary:
      'Where the chemistry lives: lead-dioxide and sponge-lead plates interleaved like a deck of cards, trading electrons through acid 760 amps at a time.',
    operation: [
      'Discharge: both plate types convert toward lead sulfate, pushing electrons out.',
      'Charge: the alternator runs the reaction backwards.',
      'Deep discharge lets sulfate crystals harden permanently — that’s how batteries die.',
    ],
    materials: [
      {
        name: 'Pb-Ca-Sn GRID + PASTE',
        cls: 'Lead-calcium alloy · active mass',
        composition: [
          { element: 'Pb', pct: 98.9 },
          { element: 'Sn', pct: 0.9 },
          { element: 'Ca', pct: 0.1 },
        ],
        process: 'Grids expanded from rolled strip, pasted with PbO₂/sponge-Pb oxide, cured 3 days in humidity ovens',
        why: 'Calcium instead of old antimony cuts water electrolysis ~90% — the whole reason sealed maintenance-free batteries exist.',
        props: [
          { label: 'CCA', value: '760 A @ -18°C' },
          { label: 'PLATES/CELL', value: '13' },
        ],
      },
    ],
  },
  {
    id: 'bat-mat',
    code: 'BAT-02',
    name: 'AGM SEPARATOR',
    system: 'electrical',
    mass: '1.8 kg',
    summary:
      'Glass wool finer than spider silk holding ALL the acid in its pores — no liquid to spill, and the plates can be squeezed tight enough to survive washboard roads.',
    operation: [
      'Capillary action locks acid against the plates at any angle, even upside down.',
      '20% of pores stay gas-open: oxygen from charging migrates to the negative plate and recombines into water — the battery drinks its own emissions.',
      'Compression (20%) pins the active mass so vibration can’t shed it.',
    ],
    materials: [
      {
        name: 'BOROSILICATE MICROFIBER MAT',
        cls: 'Absorbed glass mat · separator',
        composition: [
          { element: 'Glass microfiber', pct: 95 },
          { element: 'Organic binder', pct: 5 },
        ],
        process: 'Wet-laid like paper from 0.5–3 µm fibers, compressed between plates at assembly',
        why: 'Only glass stands in battery acid for 10 years while holding 6× its weight of it — and its springiness maintains plate pressure for life.',
        props: [
          { label: 'ACID HELD', value: '6× own weight' },
          { label: 'RECOMBINATION', value: '>99%' },
        ],
      },
    ],
  },
  {
    id: 'bat-case',
    code: 'BAT-03',
    name: 'CASE & LID',
    system: 'electrical',
    mass: '2.1 kg',
    summary:
      'A six-room acid apartment. Polypropylene walls isolating six 2.1-volt cells, with buried lead bridges welded through the walls connecting them in series.',
    operation: [
      'Six cells × 2.1 V = 12.7 V resting voltage.',
      'Through-wall welds connect cells with millivolt-level resistance.',
      'The labyrinth lid condenses acid mist and drains it back; a flame arrestor frit blocks external sparks.',
    ],
    materials: [
      {
        name: 'PP COPOLYMER CASE',
        cls: 'Impact polypropylene · container',
        composition: [
          { element: 'PP copolymer', pct: 97 },
          { element: 'Carbon black', pct: 3 },
        ],
        process: 'Injection molded, lid heat-plate welded on — a hermetic joint with no adhesive',
        why: 'PP shrugs off acid forever and keeps impact strength at -30°C, when a cold-cracked case means acid on your garage floor.',
        props: [
          { label: 'CELLS', value: '6 × 2.1 V' },
          { label: 'WALL', value: '2.5 mm' },
        ],
      },
    ],
  },
  {
    id: 'bat-terminals',
    code: 'BAT-04',
    name: 'TERMINALS',
    system: 'electrical',
    mass: '0.4 kg',
    summary:
      'Two lead cones carrying up to 760 amps — more current than 30 houses — through a clamp joint you tighten with a 10 mm spanner.',
    operation: [
      'Tapered SAE posts: the clamp wedges tighter as it’s drawn down.',
      'At 760 A, one milliohm of corrosion film = 580 W of heat AT the joint — why dirty terminals melt.',
      'Positive post is deliberately fatter so cables can’t be reversed.',
    ],
    materials: [
      {
        name: 'Pb-Sb CAST POSTS',
        cls: 'Lead-antimony alloy · terminals',
        composition: [
          { element: 'Pb', pct: 97.0 },
          { element: 'Sb', pct: 2.75 },
          { element: 'Sn', pct: 0.25 },
        ],
        process: 'Cast around the internal strap, burned (lead-welded) to the lid bushing for a gas-tight seam',
        why: 'Soft lead cold-flows into the clamp’s grip, making a gas-tight joint that oxygen can’t creep into — self-sealing conductivity.',
        props: [
          { label: 'CURRENT', value: '760 A peak' },
          { label: 'TORQUE', value: '5 Nm max' },
        ],
      },
    ],
  },
]

/* ============================= ECU SUBTREE ============================== */

export const ECU_KIDS: Part[] = [
  {
    id: 'ecu-pcb',
    code: 'ECU-01',
    name: '6-LAYER PCB',
    system: 'electrical',
    mass: '180 g',
    summary:
      'A six-storey copper city. Signal traces on the outside, power and ground planes buried inside shielding them — all varnished against a lifetime of salt fog.',
    operation: [
      'Inner ground planes sandwich signal layers, shielding microvolt sensor lines from ignition noise.',
      'Thermal vias — plated holes under hot chips — pipe heat straight through the board to the case.',
      'Conformal coating seals every trace against condensation each cold morning.',
    ],
    materials: [
      {
        name: 'FR-4 GLASS EPOXY + Cu',
        cls: 'Laminate · 6-layer board',
        composition: [
          { element: 'Glass fabric', pct: 55 },
          { element: 'Epoxy resin', pct: 37 },
          { element: 'Cu layers', pct: 6 },
          { element: 'Acrylic coat', pct: 2 },
        ],
        process: 'Layers laminated at 180°C, through-holes plated, acrylic conformal coat sprayed after assembly',
        why: 'AEC-Q automotive spec: -40°C to +125°C, 15 years, 15 g vibration. Consumer-grade boards crack their solder in months on an engine.',
        props: [
          { label: 'LAYERS', value: '6' },
          { label: 'RATING', value: 'AEC-Q100 Grade 1' },
        ],
      },
    ],
  },
  {
    id: 'ecu-cpu',
    code: 'ECU-02',
    name: 'LOCKSTEP MCU',
    system: 'electrical',
    mass: '12 g',
    summary:
      'Two processor cores running the SAME instructions in parallel, a comparator checking every single result — because a bit flipped by cosmic radiation must not open your throttle.',
    operation: [
      'Dual cores execute in lockstep; any disagreement triggers reset to a safe state within microseconds.',
      'ECC memory corrects single-bit errors on the fly.',
      'Recalculates fuel and spark for every cylinder event — 240 decisions a second at 7,200 RPM, each in under 500 µs.',
    ],
    materials: [
      {
        name: 'Si DIE + Cu LEADFRAME',
        cls: 'Semiconductor · 40 nm automotive node',
        composition: [
          { element: 'Epoxy package', pct: 70 },
          { element: 'Cu leadframe', pct: 20 },
          { element: 'Si die', pct: 8 },
          { element: 'Au bond wires', pct: 2 },
        ],
        process: '300 MHz tri-core (2 lockstep + 1 I/O), die attached, gold-wire bonded, overmolded',
        why: 'Automotive silicon is built on older, larger process nodes on purpose: bigger transistors hold their state against heat and radiation.',
        props: [
          { label: 'CORES', value: '2 lockstep + 1' },
          { label: 'DECISION TIME', value: '<500 µs' },
        ],
      },
    ],
  },
  {
    id: 'ecu-case',
    code: 'ECU-03',
    name: 'HOUSING + VENT',
    system: 'electrical',
    mass: '650 g',
    summary:
      'A die-cast Faraday vault with a Gore-Tex pore for breathing — it equalizes altitude pressure while blocking a pressure-washer jet.',
    operation: [
      'Shields the board from ignition EMI; the case is the ground reference.',
      'Spreads chip heat into the airstream via fins.',
      'The ePTFE vent passes air molecules but not water droplets — IP6K9K sealed yet breathing.',
    ],
    materials: [
      {
        name: 'A380 DIE-CAST + ePTFE VENT',
        cls: 'Aluminum enclosure · membrane',
        composition: [
          { element: 'Al', pct: 85.5 },
          { element: 'Si', pct: 8.5 },
          { element: 'Cu', pct: 3.5 },
          { element: 'Zn', pct: 2.0 },
        ],
        process: 'Die cast, silicone-beaded lid, laser-welded vent patch',
        why: 'Without the vent, every cold rain after a hot run would vacuum moisture past the seals — breathing beats sealing.',
        props: [
          { label: 'SEALING', value: 'IP6K9K' },
          { label: 'EMI', value: '>60 dB shielding' },
        ],
      },
    ],
  },
  {
    id: 'ecu-connector',
    code: 'ECU-04',
    name: '154-PIN CONNECTOR',
    system: 'electrical',
    mass: '140 g',
    summary:
      'The spinal cord socket: 154 gold-flashed pins carrying everything from 0.5 mV knock-sensor whispers to 10-amp injector hammers, sealed per-wire against water.',
    operation: [
      'Every sensor and actuator wire in the engine bay terminates here.',
      'Each pin’s silicone single-wire seal keeps spray out of the shell.',
      'Gold flash on signal pins stops fretting corrosion — vibration micro-wear that turns tin contacts to static.',
    ],
    materials: [
      {
        name: 'CuSn4 PINS + GOLD FLASH',
        cls: 'Phosphor bronze contacts · PBT shell',
        composition: [
          { element: 'PBT-GF30 shell', pct: 55 },
          { element: 'CuSn4 pins', pct: 35 },
          { element: 'Silicone seals', pct: 9.8 },
          { element: 'Au flash', pct: 0.2 },
        ],
        process: 'Pins stamped and selectively gold-plated only on contact zones (0.4 µm), lever-assisted 150 N mating',
        why: 'A knock sensor signal is half a millivolt — one oxidized tin contact buries it in noise. Gold doesn’t oxidize. Ever.',
        props: [
          { label: 'PINS', value: '154' },
          { label: 'CYCLES', value: '50 matings' },
        ],
      },
    ],
  },
]

/* ========================== HEADLIGHTS SUBTREE ========================== */

export const LED_KIDS: Part[] = [
  {
    id: 'led-die',
    code: 'LED-01',
    name: 'InGaN DIE',
    system: 'electrical',
    mass: '2 mg',
    summary:
      'A millimetre of crystal where electricity becomes light — electrons and holes meeting in quantum wells five atoms thick, each union releasing exactly one blue photon.',
    operation: [
      'Current crosses the junction; carriers fall into indium-gallium-nitride wells.',
      'Each recombination emits a 450 nm blue photon — 40%+ of the electrical energy becomes light.',
      'Flip-chip mounting puts the hot junction microns from the heatsink.',
    ],
    materials: [
      {
        name: 'GaN-ON-SAPPHIRE EPITAXY',
        cls: 'III-V semiconductor · emitter',
        composition: [
          { element: 'Sapphire substrate', pct: 88 },
          { element: 'GaN layers', pct: 11 },
          { element: 'InGaN wells', pct: 0.7 },
          { element: 'Electrodes', pct: 0.3 },
        ],
        process: 'Grown atom-by-atom by MOCVD at 1,050°C — 5 µm of crystal deposited over 6 hours, then diced into dies',
        why: 'The indium fraction in each well sets the photon’s color by bandgap engineering — light tuned by alloy chemistry.',
        props: [
          { label: 'WAVELENGTH', value: '450 nm blue' },
          { label: 'EFFICIENCY', value: '>40%' },
        ],
      },
    ],
  },
  {
    id: 'led-phosphor',
    code: 'LED-02',
    name: 'PHOSPHOR PLATE',
    system: 'electrical',
    mass: '8 mg',
    summary:
      'The blue-to-white alchemist: a ceramic wafer of cerium-doped garnet that swallows blue photons and re-emits yellow — blue plus yellow reading as white to your eye.',
    operation: [
      'Converts ~70% of blue photons to a broad yellow spectrum; the rest leak through.',
      'The mix ratio sets color temperature — thicker phosphor, warmer light.',
      'Running at 200°C, only a sintered ceramic plate survives; powder-in-silicone would cook brown.',
    ],
    materials: [
      {
        name: 'YAG:Ce CERAMIC',
        cls: 'Yttrium-aluminum garnet · converter',
        composition: [
          { element: 'Y₃Al₅O₁₂', pct: 97 },
          { element: 'Ce³⁺ dopant', pct: 3 },
        ],
        process: 'Sintered into a translucent 100 µm plate, glued to the die with transparent silicone',
        why: 'Cerium ions absorb blue and fluoresce yellow in nanoseconds, a billion billion times a second, without degrading for 10,000 hours.',
        props: [
          { label: 'CONVERSION', value: '~70%' },
          { label: 'OUTPUT', value: '5,500 K white' },
        ],
      },
    ],
  },
  {
    id: 'led-board',
    code: 'LED-03',
    name: 'CERAMIC BOARD + HEATSINK',
    system: 'electrical',
    mass: '240 g',
    summary:
      'The LED’s life support. The die converts 40% to light — the other 60% is heat in a square millimetre, and silicon dies at 150°C. This path is the headlight’s real engineering.',
    operation: [
      'Aluminum-nitride ceramic insulates electrically but conducts heat like metal.',
      'Copper spreader widens the 1 mm² hotspot into a 25 mm² footprint.',
      'Finned aluminum dumps it to air — junction to ambient in three materials.',
    ],
    materials: [
      {
        name: 'AlN CERAMIC + Cu + Al FINS',
        cls: 'Thermal stack · substrate',
        composition: [
          { element: 'Al heatsink', pct: 78 },
          { element: 'Cu spreader', pct: 15 },
          { element: 'AlN ceramic', pct: 6 },
          { element: 'Solder/TIM', pct: 1 },
        ],
        process: 'Die soldered to AlN tile, tile to copper, copper to fins with phase-change interface film',
        why: 'AlN conducts heat 10× better than alumina while isolating 48 volts — the one ceramic that does both jobs.',
        props: [
          { label: 'JUNCTION MAX', value: '150°C' },
          { label: 'PATH ΔT', value: '~60°C total' },
        ],
      },
    ],
  },
]

export const HEADLIGHT_KIDS: Part[] = [
  {
    id: 'hl-lens',
    code: 'HLT-01',
    name: 'OUTER LENS',
    system: 'electrical',
    mass: '640 g',
    summary:
      'Optical-grade polycarbonate that takes a stone at highway speed and shrugs — wearing a 10-micron glass-like coat so the sun can’t turn it yellow.',
    operation: [
      'Pure protection — modern lenses are optically neutral; the beam is shaped behind it.',
      'The siloxane hardcoat blocks UV and scratches; once it wears through, the PC beneath hazes in a year.',
    ],
    materials: [
      {
        name: 'PC + SILOXANE HARDCOAT',
        cls: 'Polycarbonate · coated lens',
        composition: [
          { element: 'Polycarbonate', pct: 98 },
          { element: 'Siloxane coat', pct: 2 },
        ],
        process: 'Injection-compression molded (zero flow lines), flow-coated, UV-cured',
        why: 'PC has 250× the impact strength of glass at half the weight — it just can’t face sunlight without its coat.',
        props: [
          { label: 'IMPACT', value: '250× glass' },
          { label: 'COAT', value: '10 µm' },
        ],
      },
    ],
  },
  {
    id: 'hl-led',
    code: 'HLT-02',
    name: 'LED MODULE',
    system: 'electrical',
    mass: '0.9 kg',
    summary:
      'The light factory: 24 emitters, each an individually-switched pixel. Dive deeper — there’s a crystal, a phosphor, and a thermal stack inside every one.',
    operation: [
      'Each LED segment covers ~1.5° of road; the controller addresses them one by one.',
      'Camera spots an oncoming car → exactly its pixels dim in 10 ms, high beam stays everywhere else.',
    ],
    materials: [
      {
        name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
        cls: 'Die · phosphor · thermal stack',
        composition: [
          { element: 'Heatsink stack', pct: 90 },
          { element: 'Optics', pct: 9 },
          { element: 'Semiconductor', pct: 1 },
        ],
        process: 'Die, phosphor plate, ceramic board — each a node below',
        why: 'A headlight died when its filament broke. This one is 24 semiconductors with a thermal management problem.',
        props: [
          { label: 'SEGMENTS', value: '24 / side' },
          { label: 'RESPONSE', value: '10 ms' },
        ],
      },
    ],
    children: LED_KIDS,
  },
  {
    id: 'hl-reflector',
    code: 'HLT-03',
    name: 'REFLECTOR OPTICS',
    system: 'electrical',
    mass: '480 g',
    summary:
      'Computed freeform mirrors — thermoset plastic wearing 80 nanometres of pure aluminum, each facet aiming one LED’s light at its own strip of road.',
    operation: [
      'Each of 24 facets is a separately computed freeform surface — the beam pattern is sculpted, not focused.',
      'The sharp horizontal cutoff that stops you dazzling oncoming drivers is drawn by these surfaces.',
    ],
    materials: [
      {
        name: 'BMC + VACUUM ALUMINUM',
        cls: 'Bulk molding compound · metallized',
        composition: [
          { element: 'BMC thermoset', pct: 97 },
          { element: 'Base lacquer', pct: 2.9 },
          { element: 'Al layer', pct: 0.1 },
        ],
        process: 'Molded (holds shape at 180°C near the LEDs), lacquered mirror-smooth, aluminum vapor-deposited at 80 nm',
        why: 'BMC doesn’t creep with heat — a reflector that sags 0.1 mm points the beam into oncoming traffic.',
        props: [
          { label: 'REFLECTANCE', value: '~92%' },
          { label: 'Al THICKNESS', value: '80 nm' },
        ],
      },
    ],
  },
  {
    id: 'hl-housing',
    code: 'HLT-04',
    name: 'HOUSING + VENT',
    system: 'electrical',
    mass: '1.1 kg',
    summary:
      'The weatherproof theatre. Holds optics aligned to a tenth of a degree through potholes and car washes — and breathes through a membrane so it never fogs permanently.',
    operation: [
      'Aiming adjusters tilt the whole optical block; auto-leveling compensates for trunk load.',
      'Gore vents equalize thermal pressure cycles; light morning fog clears by design through the vent path.',
    ],
    materials: [
      {
        name: 'PP-GF30 HOUSING',
        cls: 'Glass polypropylene · shell',
        composition: [
          { element: 'PP', pct: 68 },
          { element: 'Glass fiber', pct: 30 },
          { element: 'ePTFE vents', pct: 2 },
        ],
        process: 'Molded shell, lens attached by hot-melt butyl in a labyrinth groove',
        why: 'The butyl lane flexes with 100°C swings for 15 years — rigid glue would crack and let the theatre flood.',
        props: [
          { label: 'AIM STABILITY', value: '±0.1°' },
          { label: 'SEAL', value: 'IP5K4K' },
        ],
      },
    ],
  },
]

/* ============================= BODY SUBTREE ============================= */

export const BODY_KIDS: Part[] = [
  {
    id: 'bdy-panels',
    code: 'BDY-01',
    name: 'ALUMINUM SKIN PANELS',
    system: 'body',
    mass: '52 kg',
    summary:
      'Sheet metal with a scheduled personality change: soft enough to stamp into compound curves, it then hardens 50% in the paint oven. The paint bake IS its heat treatment.',
    operation: [
      'Outer skins carry aero loads and define every reflection line you see.',
      'Hemmed edges fold the skin over inner frames — no visible welds anywhere.',
      'Bake hardening: solute copper pins stamping dislocations at 180°C for 20 min in the paint oven.',
    ],
    materials: [
      {
        name: 'AA6016-T4 → BAKE HARDENED',
        cls: 'Al-Mg-Si sheet · closures',
        composition: [
          { element: 'Al', pct: 97.9 },
          { element: 'Si', pct: 1.1 },
          { element: 'Mg', pct: 0.4 },
        ],
        process: 'Stamped at T4 (soft), gains ~50% yield strength during the 180°C paint bake',
        why: 'You can’t stamp hard sheet and you can’t dent-proof soft sheet — so the alloy is designed to be both, sequentially.',
        props: [
          { label: 'THICKNESS', value: '0.95 mm' },
          { label: 'BAKE GAIN', value: '+50% yield' },
        ],
      },
    ],
  },
  {
    id: 'bdy-bumpers',
    code: 'BDY-02',
    name: 'BUMPER FASCIAS',
    system: 'body',
    mass: '8.2 kg',
    summary:
      'Rubber-toughened plastic skin over crushable foam — designed to take a pedestrian’s knee gently, then spring back from a parking tap like nothing happened.',
    operation: [
      'EPP foam block behind the skin crushes progressively for leg-impact scores.',
      'The fascia flexes through 50 mm and returns at parking speeds.',
      'Hidden crash-cans behind do the real work above 15 km/h.',
    ],
    materials: [
      {
        name: 'PP-EPDM-T10 TPO',
        cls: 'Thermoplastic olefin · fascia',
        composition: [
          { element: 'Polypropylene', pct: 70 },
          { element: 'EPDM rubber', pct: 20 },
          { element: 'Talc', pct: 10 },
        ],
        process: 'Injection molded in one 1.8 m shot, flame-treated so paint can grip nonpolar PP',
        why: 'EPDM domains in the PP matrix blunt crack tips — the skin bends 90° at -30°C without shattering.',
        props: [
          { label: 'RECOVERY', value: 'full @ 8 km/h' },
          { label: 'COLD FLEX', value: '-30°C no crack' },
        ],
      },
    ],
  },
  {
    id: 'bdy-glass',
    code: 'BDY-03',
    name: 'GLAZING — LAMINATED + TEMPERED',
    system: 'body',
    mass: '28 kg',
    summary:
      'Two kinds of engineered failure: the windshield cracks but holds together on a plastic interlayer; the side glass explodes into harmless gravel. Both on purpose.',
    operation: [
      'Windshield: PVB interlayer glues two glass sheets — stones star it, but nothing comes through, and it’s a stressed structural panel (~30% of roof-crush strength).',
      'Side windows: tempered — surface squeezed in compression; break the skin anywhere and the stored energy shatters the whole pane to blunt dice.',
      'Acoustic PVB grade cuts wind noise 3 dB.',
    ],
    materials: [
      {
        name: 'SODA-LIME GLASS + PVB',
        cls: 'Float glass · polyvinyl butyral laminate',
        composition: [
          { element: 'SiO₂', pct: 62 },
          { element: 'Na₂O + CaO', pct: 24 },
          { element: 'PVB interlayer', pct: 9 },
          { element: 'Other oxides', pct: 5 },
        ],
        process: 'Float glass bent in matched pairs, laminated with 0.76 mm PVB in an autoclave at 140°C / 12 bar',
        why: 'PVB stretches 200% before tearing — it catches both glass layers AND your unbelted head at 40 g.',
        props: [
          { label: 'WINDSHIELD', value: '2.1+0.76+2.1 mm' },
          { label: 'TEMPER STRESS', value: '~100 MPa skin' },
        ],
      },
    ],
  },
  {
    id: 'bdy-paint',
    code: 'BDY-04',
    name: 'PAINT SYSTEM — 4 LAYERS',
    system: 'body',
    mass: '~4 kg',
    summary:
      'Thinner than a human hair, engineered like a circuit board: an electro-deposited rust shield, a stone-impact damper, 15 microns of color, and a glass-hard clear roof.',
    operation: [
      'E-COAT (20 µm): the body is dipped and charged; paint particles electroplate into every seam a sprayer could never reach.',
      'PRIMER (30 µm): the flexible middle that absorbs stone-chip energy before it reaches metal.',
      'BASECOAT (15 µm): all of the color, aluminum flakes aligned flat for the metallic flip.',
      'CLEARCOAT (40 µm): UV filter and scratch armor — the gloss is all here.',
    ],
    materials: [
      {
        name: 'CATHODIC EPOXY E-COAT',
        cls: 'Layer 1 · corrosion barrier',
        composition: [
          { element: 'Epoxy resin', pct: 80 },
          { element: 'Blocked isocyanate', pct: 15 },
          { element: 'Pigment', pct: 5 },
        ],
        process: 'Body submerged, 300 V applied — deposition is self-limiting: coated zones insulate, forcing paint into bare recesses',
        why: 'Electro-deposition reaches inside box sections and seams — the places rust actually starts.',
        props: [
          { label: 'THICKNESS', value: '20 µm' },
          { label: 'SALT SPRAY', value: '>1,000 h' },
        ],
      },
      {
        name: 'ACRYLIC-MELAMINE CLEARCOAT',
        cls: 'Layer 4 · gloss + armor',
        composition: [
          { element: 'Acrylic polyol', pct: 70 },
          { element: 'Melamine crosslink', pct: 25 },
          { element: 'UV absorbers', pct: 5 },
        ],
        process: 'Wet-on-wet over basecoat, cross-linked at 140°C into a single thermoset network',
        why: 'The UV package sacrifices itself protecting the color below — clearcoat failure is why 20-year-old cars go chalky.',
        props: [
          { label: 'TOTAL STACK', value: '~105 µm' },
          { label: 'GLOSS', value: '>90 GU' },
        ],
      },
    ],
  },
]

/* ============================ INTERIOR SUBTREES =========================== */

export const SEAT_KIDS: Part[] = [
  {
    id: 'st-frame',
    code: 'SEA-01',
    name: 'SEAT FRAME',
    system: 'interior',
    mass: '11 kg',
    summary:
      'A crash structure you never see: high-strength steel that must hold YOU, your belt loads, and a 3-tonne pull — while weighing little enough to recline with one hand.',
    operation: [
      'Belt anchors feed crash loads through the frame into the floor.',
      'Recliner gears are the critical link — hardened teeth hold your torso’s crash moment.',
      'Anti-submarine ramp in the cushion pan stops you sliding under the lap belt.',
    ],
    materials: [
      {
        name: 'DP800 DUAL-PHASE STEEL',
        cls: 'AHSS tube + stampings · frame',
        composition: [
          { element: 'Fe', pct: 97.9 },
          { element: 'Mn', pct: 1.5 },
          { element: 'C', pct: 0.15 },
          { element: 'Si', pct: 0.25 },
        ],
        process: 'Roll-formed tubes + stampings, laser welded; recliner teeth fine-blanked and hardened',
        why: 'Martensite islands in soft ferrite: easy to stamp, then work-hardens exactly where a crash bends it — strength that appears on demand.',
        props: [
          { label: 'BELT LOAD', value: '30 kN held' },
          { label: 'TEST', value: '20 g sled' },
        ],
      },
    ],
  },
  {
    id: 'st-foam',
    code: 'SEA-02',
    name: 'MOLDED FOAM',
    system: 'interior',
    mass: '4.2 kg',
    summary:
      'Chemistry you sit on: two liquids meet in a mold, rise like bread in 90 seconds, and cure into a spring-damper system mapped zone by zone to your anatomy.',
    operation: [
      'High-resilience foam pushes back proportionally — spreading pressure off sciatic hot-spots.',
      'Dual hardness in one pour: firm bolster chemistry injected beside soft center chemistry.',
      'Open cells pump air as you move — the seat breathes.',
    ],
    materials: [
      {
        name: 'HR POLYURETHANE 55 kg/m³',
        cls: 'Open-cell PU · cushions',
        composition: [
          { element: 'Polyol blend', pct: 62 },
          { element: 'MDI isocyanate', pct: 35 },
          { element: 'Water + amines', pct: 3 },
        ],
        process: 'Liquids mixed in-head, poured, mold closed; water-isocyanate reaction makes the CO₂ that foams it',
        why: 'The bubbles ARE the suspension: cell size and wall thickness set firmness, resilience, and 10-year sag — all tuned in the recipe.',
        props: [
          { label: 'DENSITY', value: '55 kg/m³' },
          { label: 'SAG FACTOR', value: '2.8' },
        ],
      },
    ],
  },
  {
    id: 'st-cover',
    code: 'SEA-03',
    name: 'COVER + HEATER MAT',
    system: 'interior',
    mass: '2.8 kg',
    summary:
      'The touchpoint lamination: wear-tested fabric or hide over scrim foam, with a carbon-fiber heating web buried beneath that warms your back in ninety seconds.',
    operation: [
      'Cover is laminated to 3 mm scrim foam so it drapes without wrinkling over curves.',
      'Listing wires pull seams down into foam trenches — the sculpted look is tension.',
      'Heater mat: carbon fiber strands self-regulate near target temperature as resistance rises.',
    ],
    materials: [
      {
        name: 'PES WEAVE / CORRECTED LEATHER',
        cls: 'Textile laminate · trim',
        composition: [
          { element: 'Polyester face', pct: 60 },
          { element: 'PU scrim foam', pct: 25 },
          { element: 'Heater web', pct: 10 },
          { element: 'Nylon backing', pct: 5 },
        ],
        process: 'Flame-laminated sandwich, CNC cut, sewn with bonded nylon thread at 301 lockstitch',
        why: 'Must survive 100,000 entry slides (the "ingress abrasion test") and a decade of UV without the color walking away.',
        props: [
          { label: 'ABRASION', value: '>50k Martindale' },
          { label: 'HEAT-UP', value: '90 s to warm' },
        ],
      },
    ],
  },
]

export const STEERING_KIDS: Part[] = [
  {
    id: 'str-rack',
    code: 'STR-01',
    name: 'RACK & PINION',
    system: 'interior',
    mass: '4.8 kg',
    summary:
      'Rotation becomes translation here: a pinion walking along a toothed bar, teeth induction-hardened because they carry your life through every corner.',
    operation: [
      'Pinion turns ~15° per degree of road wheel — the 15:1 ratio your hands know.',
      'Variable-ratio racks cut teeth at changing pitch: calm on-center, quick at the lock.',
      'A spring-loaded yoke presses the rack into the pinion at zero lash — play here is wander.',
    ],
    materials: [
      {
        name: 'C45 INDUCTION-HARDENED',
        cls: 'Carbon steel · rack bar',
        composition: [
          { element: 'Fe', pct: 98.5 },
          { element: 'C', pct: 0.45 },
          { element: 'Mn', pct: 0.65 },
        ],
        process: 'Teeth broached, then induction coil sweeps ONLY the toothed face — hard teeth, springy shaft',
        why: 'Through-hardening would make the bar brittle as chalk; selective hardening puts glass only where teeth mesh.',
        props: [
          { label: 'RATIO', value: '15:1 variable' },
          { label: 'LASH', value: '~0 (yoke loaded)' },
        ],
      },
    ],
  },
  {
    id: 'str-motor',
    code: 'STR-02',
    name: 'EPS MOTOR + TORQUE SENSOR',
    system: 'interior',
    mass: '3.1 kg',
    summary:
      'The invisible co-driver. A torsion bar measures your effort in twist; a brushless motor with rare-earth magnets adds up to 80 Nm of its own, recalculated a thousand times a second.',
    operation: [
      'Torsion bar twists ~2° per 10 Nm of your effort; magnetic sensor reads the twist.',
      'ECU maps assist against speed: featherlight in parking, firm at autobahn pace.',
      'The same motor nudges for lane-keeping and dampens kickback from potholes.',
    ],
    materials: [
      {
        name: 'NdFeB MAGNETS + Cu WINDINGS',
        cls: 'Rare-earth BLDC · actuator',
        composition: [
          { element: 'Steel laminations', pct: 55 },
          { element: 'Cu windings', pct: 25 },
          { element: 'NdFeB magnets', pct: 12 },
          { element: 'Al housing', pct: 8 },
        ],
        process: 'Neodymium magnets (grade N42SH — the SH suffix survives 150°C) bonded to the rotor, dual-wound redundant stator',
        why: 'Neodymium-iron-boron holds 10× the magnetic energy of old ferrite — the only way 80 Nm fits beside a steering column.',
        props: [
          { label: 'ASSIST', value: '0–80 Nm' },
          { label: 'LOOP RATE', value: '1 kHz' },
        ],
      },
    ],
  },
  {
    id: 'str-column',
    code: 'STR-03',
    name: 'COLLAPSIBLE COLUMN',
    system: 'interior',
    mass: '5.2 kg',
    summary:
      'Designed to get out of your way at the worst moment: telescoping tubes that carry steering torque all your life, then collapse 80 mm under chest load in a crash.',
    operation: [
      'Two tubes slide on calibrated plastic shear pins — rigid for driving, breakaway at ~4 kN.',
      'Universal joints route the column around the pedal box.',
      'Adjustment lever clamps a friction stack for reach and rake.',
    ],
    materials: [
      {
        name: 'E235 TUBES + POM SHEAR PINS',
        cls: 'Steel tubes · engineered fuse',
        composition: [
          { element: 'Steel tubes', pct: 90 },
          { element: 'POM pins', pct: 4 },
          { element: 'Al brackets', pct: 6 },
        ],
        process: 'Molded plastic injected through aligned holes in both tubes — the pins ARE the fuse',
        why: 'POM shears at a precise, repeatable force — a mechanical fuse rated in newtons, molded for pennies.',
        props: [
          { label: 'COLLAPSE', value: '80 mm stroke' },
          { label: 'TRIGGER', value: '~4 kN' },
        ],
      },
    ],
  },
  {
    id: 'str-wheel',
    code: 'STR-04',
    name: 'STEERING WHEEL',
    system: 'interior',
    mass: '2.4 kg',
    summary:
      'The handshake point: a magnesium skeleton — the lightest structural metal there is — wrapped in foam and hide, hiding an airbag and a heater in the rim.',
    operation: [
      'Mg armature carries your inputs and the airbag’s 60 g deployment recoil.',
      'The rim is tuned mass: too light and it buzzes, too heavy and steering feels gluey.',
      'Clock-spring ribbon behind it keeps airbag and buttons wired through endless rotations.',
    ],
    materials: [
      {
        name: 'AM60B MAGNESIUM ARMATURE',
        cls: 'Die-cast magnesium · skeleton',
        composition: [
          { element: 'Mg', pct: 93.4 },
          { element: 'Al', pct: 6.0 },
          { element: 'Mn', pct: 0.35 },
        ],
        process: 'Die cast in one shot, overmolded with PU foam, hand-wrapped in hide',
        why: 'AM60B crushes progressively if your chest meets it pre-airbag — magnesium chosen as much for how it fails as how it holds.',
        props: [
          { label: 'DENSITY', value: '1.78 g/cm³' },
          { label: 'VS ALUMINUM', value: '-33% mass' },
        ],
      },
    ],
  },
]
