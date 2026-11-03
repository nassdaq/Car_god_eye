import type { Part } from './parts'
import { CROWN_CHAIN } from './tree-deep'

export const GUPTA =
  'S.K. Gupta — A Textbook of Automobile Engineering (S. Chand): Engine Construction, Engine Components & Valve Mechanism chapters'

/* ============================ ENGINE SUBTREE ============================ */

const RING_PACK: Part[] = [
  {
    id: 'rng-top',
    code: 'RNG-01',
    name: 'TOP COMPRESSION RING',
    system: 'powertrain',
    mass: '14 g',
    summary:
      'A 1.0 mm sliver of spring steel holding back 100 bar of burning gas, 0.5 mm from the flame. The hardest-working millimetre in the car.',
    operation: [
      'Combustion pressure sneaks BEHIND the ring and presses it outward — the ring seals harder exactly when the explosion is biggest.',
      'Barrel-shaped face rides a 1 µm oil film; it never actually touches the liner when healthy.',
      'The end gap (0.3 mm cold) closes as it heats — gap too small and the ring ends butt, seize, and destroy the bore.',
    ],
    materials: [
      {
        name: 'NITRIDED 17% Cr STEEL + PVD CrN',
        cls: 'Martensitic stainless · ring body + face coating',
        composition: [
          { element: 'Fe', pct: 80.6 },
          { element: 'Cr', pct: 17.0 },
          { element: 'C', pct: 0.9 },
          { element: 'Si', pct: 0.4 },
          { element: 'Mn', pct: 0.3 },
        ],
        process: 'Coiled from profiled wire, gas-nitrided, then PVD chromium-nitride on the running face',
        why: 'Nitriding hardens the whole surface to 1,100 HV; the CrN face coat survives 300°C with near-zero wear for 300,000 km.',
        props: [
          { label: 'SEALS', value: '100+ bar' },
          { label: 'FACE TEMP', value: '~300°C' },
          { label: 'RADIAL WALL', value: '3.2 mm' },
        ],
      },
    ],
  },
  {
    id: 'rng-second',
    code: 'RNG-02',
    name: 'SECOND RING — SCRAPER',
    system: 'powertrain',
    mass: '15 g',
    summary:
      'The clean-up crew. Taper-faced so its lower edge scrapes oil down on every downstroke, while backing up the top ring on gas that leaks past.',
    operation: [
      'Taper face (1° angle) acts like a squeegee — oil goes down, never up.',
      'Napier hook step on the lower edge collects and drains the scraped film.',
      'Catches the ~5% of combustion gas that blows past the top ring.',
    ],
    materials: [
      {
        name: 'GG25 GRAY IRON, TAPER FACE',
        cls: 'Flake-graphite cast iron · ring body',
        composition: [
          { element: 'Fe', pct: 93.4 },
          { element: 'C', pct: 3.3 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Individually cast oversize cam-turned rings, phosphate coated',
        why: 'Runs cooler than the top ring, so cheap graphite iron works — and its graphite self-lubricates during cold starts.',
        props: [
          { label: 'FACE ANGLE', value: '1° taper' },
          { label: 'END GAP', value: '0.4 mm' },
        ],
      },
    ],
  },
  {
    id: 'rng-oil',
    code: 'RNG-03',
    name: 'OIL CONTROL RING — 3-PIECE',
    system: 'powertrain',
    mass: '13 g',
    summary:
      'Not one ring — three. Two thin chrome rails squeeze against the bore with a corrugated spring between them, metering the oil film to two thousandths of a millimetre.',
    operation: [
      'The expander spring forces both rails outward with calibrated tension.',
      'Rails leave exactly ~2 µm of oil for the compression rings to ride on.',
      'Excess oil escapes through slots back into the piston and drains to the sump.',
    ],
    materials: [
      {
        name: 'CHROME-FACED STEEL RAILS + SS EXPANDER',
        cls: 'Carbon steel rails · stainless spacer spring',
        composition: [
          { element: 'Steel rail', pct: 62 },
          { element: 'Cr plating', pct: 8 },
          { element: 'SS304 expander', pct: 30 },
        ],
        process: 'Rails stamped from strip and hard-chromed; expander corrugated and nitrided',
        why: 'Too much oil film = blue smoke and fouled plugs. Too little = scuffed bore. This 3-piece design holds the window either way.',
        props: [
          { label: 'OIL FILM', value: '~2 µm' },
          { label: 'TENSION', value: '18 N' },
        ],
      },
    ],
  },
]

const PISTON_KIDS: Part[] = [
  {
    id: 'pst-crown',
    code: 'PST-01',
    name: 'PISTON CROWN & SKIRT',
    system: 'powertrain',
    mass: '410 g',
    summary:
      'The surface the explosion pushes on. Crown at 350°C, skirt sliding at 20 m/s, the whole thing reversing direction with 3,000 g at redline.',
    operation: [
      'Crown takes the combustion punch; valve pockets stop valve-to-piston contact at overlap.',
      'Ring grooves carry the ring pack; the top groove is anodized against micro-welding.',
      'Skirt (graphite coated) guides the piston — its profile is oval and barrelled by microns, machined to be round only at operating temperature.',
      'Oil jet from below cools the underside of the crown.',
    ],
    materials: [
      {
        name: '2618-T6 FORGED ALUMINUM',
        cls: 'Low-silicon forging alloy · piston body',
        composition: [
          { element: 'Al', pct: 93.7 },
          { element: 'Cu', pct: 2.3 },
          { element: 'Mg', pct: 1.6 },
          { element: 'Ni', pct: 1.1 },
          { element: 'Fe', pct: 1.1 },
        ],
        process: 'Forged slug, CNC finished; hard-anodized top groove; screen-printed graphite skirt coat',
        why: 'Low-silicon 2618 is tougher and more ductile at 350°C than cast alloys — it survives detonation events that crack cast pistons.',
        props: [
          { label: 'CROWN TEMP', value: '350°C' },
          { label: 'PEAK ACCEL', value: '~3,000 g' },
          { label: 'CLEARANCE', value: '0.035 mm' },
        ],
      },
    ],
    children: CROWN_CHAIN,
  },
  {
    id: 'pst-rings',
    code: 'PST-02',
    name: 'RING PACK',
    system: 'powertrain',
    mass: '42 g',
    summary:
      'Three rings, three different jobs: seal the explosion, scrape the wall, meter the oil. 42 grams doing the sealing work of the whole engine.',
    operation: [
      'TOP RING seals combustion gas — pressure-energized from behind.',
      'SECOND RING scrapes oil downward and backs up the top ring.',
      'OIL RING meters the film both of them ride on to ~2 µm.',
    ],
    materials: [
      {
        name: 'SEE INDIVIDUAL RINGS',
        cls: 'Composite set · nitrided steel / gray iron / chrome rails',
        composition: [
          { element: 'Steel', pct: 55 },
          { element: 'Cast iron', pct: 35 },
          { element: 'Coatings', pct: 10 },
        ],
        process: 'Dismantle further — each ring is its own node',
        why: 'Blow-by past a healthy ring pack is under 1% of charge. Worn rings are why old engines burn oil.',
        props: [
          { label: 'BLOW-BY', value: '<1%' },
          { label: 'SET LIFE', value: '300,000 km' },
        ],
      },
    ],
    children: RING_PACK,
  },
  {
    id: 'pst-pin',
    code: 'PST-03',
    name: 'WRIST PIN',
    system: 'powertrain',
    mass: '92 g',
    summary:
      'The hinge between piston and rod. A hollow, glass-hard steel tube carrying 2 tonnes of combustion load through an oil film thinner than cling wrap.',
    operation: [
      'Full-floating: the pin rotates in both the piston bosses and the rod small-end bushing, spreading wear.',
      'Circlips at each end stop it walking out and scoring the bore.',
    ],
    materials: [
      {
        name: '16MnCr5 CASE-HARDENED TUBE',
        cls: 'Carburizing steel · pin',
        composition: [
          { element: 'Fe', pct: 97.4 },
          { element: 'Mn', pct: 1.15 },
          { element: 'Cr', pct: 0.95 },
          { element: 'C', pct: 0.16 },
        ],
        process: 'Seamless tube, carburized to 62 HRC case, bore-ground to 0.001 mm roundness; DLC coating on sport builds',
        why: 'Hollow cuts reciprocating mass 40% — and every gram here shakes the whole engine twice per revolution.',
        props: [
          { label: 'SURFACE', value: '62 HRC' },
          { label: 'LOAD', value: '~20 kN' },
        ],
      },
    ],
  },
  {
    id: 'pst-rod',
    code: 'PST-04',
    name: 'CONNECTING ROD',
    system: 'powertrain',
    mass: '585 g',
    summary:
      'The lever that turns the piston’s punch into crank rotation. Fracture-split: the big end is deliberately snapped in two so the halves mate with atomic precision.',
    operation: [
      'Compression: carries ~2 tonnes down the I-beam shank every power stroke.',
      'Tension: at TDC on overlap it holds the piston back against 3,000 g — the load that actually breaks rods at over-rev.',
      'Big end bolts stretch into their elastic limit to clamp the bearing shells round.',
    ],
    fasteners: 'M9×1.0 rod bolts, 36NiCrMo16, angle-torqued 30 Nm + 90° — single use',
    materials: [
      {
        name: '36MnVS4 MICRO-ALLOY FORGED STEEL',
        cls: 'Vanadium micro-alloy steel · rod body',
        composition: [
          { element: 'Fe', pct: 97.3 },
          { element: 'Mn', pct: 1.4 },
          { element: 'Si', pct: 0.6 },
          { element: 'C', pct: 0.37 },
          { element: 'V', pct: 0.1 },
        ],
        process: 'Drop-forged, air-cooled (no quench needed), big end FRACTURE-SPLIT by hydraulic wedge',
        why: 'The fractured faces interlock like a fingerprint — the cap can only ever sit in its exact original position, keeping the bearing bore perfectly round.',
        props: [
          { label: 'TENSILE', value: '900 MPa' },
          { label: 'BEAM LOAD', value: '±20 kN' },
        ],
      },
    ],
  },
  {
    id: 'pst-bearing',
    code: 'PST-05',
    name: 'ROD BEARING SHELLS',
    system: 'powertrain',
    mass: '38 g / pair',
    summary:
      'Two half-moons of layered metal that the crank journal floats on. Metal never touches metal — the engine rides on 5 microns of pressurized oil.',
    operation: [
      'Hydrodynamic wedge: journal rotation drags oil into a converging gap, generating 500+ bar of film pressure — no pump could do that.',
      'Soft top layer embeds dirt particles so they can’t score the crank.',
      'Crush height: shells stand slightly proud so the cap bolts clamp them into perfect roundness.',
    ],
    materials: [
      {
        name: 'TRI-LAYER AlSn20Cu ON STEEL',
        cls: 'Bimetal bearing strip · shells',
        composition: [
          { element: 'Steel back', pct: 75 },
          { element: 'Al matrix', pct: 19 },
          { element: 'Sn (tin)', pct: 5 },
          { element: 'Cu', pct: 1 },
        ],
        process: 'Aluminum-tin roll-bonded to steel strip, formed, bored to 3 µm tolerance',
        why: 'Tin islands in aluminum act as a solid lubricant for the 0.3 seconds after cold start before oil pressure arrives — when 80% of engine wear happens.',
        props: [
          { label: 'OIL FILM', value: '5 µm' },
          { label: 'FILM PRESSURE', value: '500 bar' },
        ],
      },
    ],
  },
]

const HEAD_KIDS: Part[] = [
  {
    id: 'hd-valves',
    code: 'HED-01',
    name: 'VALVES — INTAKE / EXHAUST',
    system: 'powertrain',
    mass: '48 g each',
    summary:
      'Sixteen steel tulips opening and closing 60 times a second at redline. Exhaust valves run at 750°C — they are hollow and filled with sodium that sloshes heat away.',
    operation: [
      'Cam lobe presses the valve open against its spring through a bucket tappet.',
      'Intake valves (larger, 33 mm) let the charge in; exhaust valves (28 mm) release the burn.',
      'The valve SEAT contact is the main cooling path — 75% of valve heat leaves through 1.5 mm of seat contact each closing.',
    ],
    materials: [
      {
        name: '21-4N AUSTENITIC VALVE STEEL, Na-FILLED',
        cls: 'High-Cr-Mn steel · exhaust valve',
        composition: [
          { element: 'Fe', pct: 65.3 },
          { element: 'Cr', pct: 21.0 },
          { element: 'Mn', pct: 9.0 },
          { element: 'Ni', pct: 3.8 },
          { element: 'C+N', pct: 0.9 },
        ],
        process: 'Friction-welded two-piece: wear-resistant tip + hot-strength head; stem gun-drilled, 60% filled with metallic sodium, sealed',
        why: 'Sodium melts at 98°C and sloshes up and down the hollow stem, pumping heat from the 750°C head to the guide — dropping valve temp ~100°C.',
        props: [
          { label: 'HEAD TEMP', value: '750°C' },
          { label: 'EVENTS', value: '60/s @ redline' },
        ],
      },
    ],
  },
  {
    id: 'hd-springs',
    code: 'HED-02',
    name: 'VALVE SPRINGS',
    system: 'powertrain',
    mass: '62 g each',
    summary:
      'The only thing stopping the valves from kissing the pistons. Must slam each valve shut in 4 milliseconds, a billion times, without ever losing tension.',
    operation: [
      'Compressed ~10 mm at full lift, storing the energy to snap the valve closed behind the cam lobe.',
      'If the spring can’t keep up, the valve "floats" — and meets the piston. Terminal.',
      'Ovate (egg-section) wire puts more material where bending stress peaks.',
    ],
    materials: [
      {
        name: 'Cr-Si OVATE-WIRE SPRING STEEL',
        cls: 'Super-clean valve spring steel',
        composition: [
          { element: 'Fe', pct: 96.3 },
          { element: 'Si', pct: 1.45 },
          { element: 'Cr', pct: 0.7 },
          { element: 'C', pct: 0.56 },
          { element: 'V', pct: 0.15 },
        ],
        process: 'Vacuum-degassed melt (zero inclusions), drawn, coiled, nitrided, double shot-peened',
        why: 'A single microscopic inclusion in the wire becomes a fatigue crack by 10⁸ cycles. Valve spring steel is the cleanest mass-produced steel on earth.',
        props: [
          { label: 'CYCLES', value: '>10⁹' },
          { label: 'CLOSE TIME', value: '4 ms' },
        ],
      },
    ],
  },
  {
    id: 'hd-cams',
    code: 'HED-03',
    name: 'CAMSHAFTS — DOHC',
    system: 'powertrain',
    mass: '3.4 kg each',
    summary:
      'Two shafts of precisely ground bumps — the engine’s sheet music. Every lobe’s profile encodes exactly when, how fast, and how far each valve moves.',
    operation: [
      'Chain-driven at half crank speed (valves act once per two crank turns).',
      'Lobe ramps are ground to accelerate the valve at up to 2,000 g without launching it off the follower.',
      'Cam phaser on the intake shaft rotates it ±25° — the ECU retunes valve timing on the fly.',
    ],
    materials: [
      {
        name: 'CHILLED CAST IRON, INDUCTION LOBES',
        cls: 'White-iron lobe surface · hollow cast shaft',
        composition: [
          { element: 'Fe', pct: 92.6 },
          { element: 'C', pct: 3.2 },
          { element: 'Si', pct: 2.0 },
          { element: 'Cr', pct: 1.1 },
          { element: 'Mo', pct: 0.5 },
        ],
        process: 'Cast against steel chills so lobes solidify as carbide-rich white iron; lobes ground to ±2 µm profile',
        why: 'Chilling turns just the lobe skin into 55 HRC carbide — glass-hard where the follower rubs, tough iron everywhere else.',
        props: [
          { label: 'LOBE ACCURACY', value: '±2 µm' },
          { label: 'SPEED', value: '½ crank RPM' },
        ],
      },
    ],
  },
  {
    id: 'hd-plugs',
    code: 'HED-04',
    name: 'SPARK PLUGS — IRIDIUM',
    system: 'powertrain',
    mass: '45 g each',
    summary:
      'A 0.6 mm iridium needle throwing a 30,000-volt arc across a 1 mm gap, 30 times a second, inside an explosion. For 100,000 km.',
    operation: [
      'Coil charges to ~30 kV; the gap ionizes and a plasma channel at 60,000°C ignites the mix.',
      'The ceramic insulator must hold off the same 30 kV from leaking to ground.',
      'Heat range = how fast the tip sheds heat: too hot pre-ignites, too cold fouls with carbon.',
    ],
    materials: [
      {
        name: 'IRIDIUM TIP + ALUMINA BODY',
        cls: 'Precious-metal electrode · ceramic insulator',
        composition: [
          { element: 'Al₂O₃ ceramic', pct: 93.5 },
          { element: 'Steel shell', pct: 5.5 },
          { element: 'Ir-Rh tip', pct: 0.5 },
          { element: 'Cu core', pct: 0.5 },
        ],
        process: 'Iridium pad laser-welded to the center electrode; alumina fired at 1,600°C; shell crimp-sealed',
        why: 'Iridium melts at 2,446°C — the only affordable metal that survives spark erosion at a 0.6 mm tip size, which needs less voltage to fire.',
        props: [
          { label: 'SPARK', value: '30 kV' },
          { label: 'TIP Ø', value: '0.6 mm' },
          { label: 'LIFE', value: '100,000 km' },
        ],
      },
    ],
  },
]

export const ENGINE_KIDS: Part[] = [
  {
    id: 'eng-block',
    code: 'ENG-01',
    name: 'CYLINDER BLOCK',
    system: 'powertrain',
    mass: '38 kg',
    summary:
      'The engine’s skeleton: four bores honed to 0.005 mm roundness, wrapped in water jackets, with the crankshaft slung in five main bearing saddles underneath.',
    operation: [
      'Bores guide the pistons; a plateau-honed cross-hatch pattern holds oil in microscopic valleys.',
      'Water jacket channels coolant tight around the hottest upper third of each bore.',
      'Main bearing caps bolt across the bottom, clamping the crank in a rigid ladder.',
    ],
    fasteners: 'M10×1.25 main cap bolts, class 12.9, 60 Nm + 60° angle',
    materials: [
      {
        name: 'A356-T6 CAST ALUMINUM',
        cls: 'Aluminum-silicon alloy · block casting',
        composition: [
          { element: 'Al', pct: 91.1 },
          { element: 'Si', pct: 7.0 },
          { element: 'Mg', pct: 0.35 },
          { element: 'Fe', pct: 0.2 },
        ],
        process: 'Low-pressure die cast around iron liners, T6 heat treated, decks milled flat to 0.02 mm',
        why: 'Half the weight of iron with 3× the thermal conductivity — the block is also the engine’s biggest heat sink.',
        props: [
          { label: 'BORE ROUNDNESS', value: '5 µm' },
          { label: 'DECK FLATNESS', value: '0.02 mm' },
        ],
      },
      {
        name: 'GG25 GRAY IRON LINERS',
        cls: 'Flake-graphite iron · bore sleeves',
        composition: [
          { element: 'Fe', pct: 93.4 },
          { element: 'C', pct: 3.3 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Centrifugally cast, cast-in during block pour, plateau honed at 45° cross-hatch',
        why: 'Graphite flakes are built-in dry lubricant for the ring faces — aluminum bores would gall without coating.',
        props: [{ label: 'WEAR', value: '<1 µm / 10,000 km' }],
      },
    ],
  },
  {
    id: 'eng-crank',
    code: 'ENG-02',
    name: 'CRANKSHAFT',
    system: 'powertrain',
    mass: '14.8 kg',
    summary:
      'The spine. Four offset rod journals turn the pistons’ hammer blows into smooth rotation; eight counterweights cancel the shaking forces.',
    operation: [
      'Each rod journal is offset 45 mm from the main axis — that offset IS the 90 mm stroke.',
      'Drilled oil passages feed pressurized oil from the mains out to each rod journal.',
      'Counterweights balance the rotating mass; the damper pulley kills torsional ringing at 300 Hz.',
      'At 7,200 RPM the crank twists and springs back 2° — 120 times per second.',
    ],
    materials: [
      {
        name: '42CrMo4 FORGED STEEL, NITRIDED',
        cls: 'Chromium-moly steel · crankshaft',
        composition: [
          { element: 'Fe', pct: 96.9 },
          { element: 'C', pct: 0.42 },
          { element: 'Cr', pct: 1.1 },
          { element: 'Mn', pct: 0.75 },
          { element: 'Mo', pct: 0.22 },
        ],
        process: 'Drop-forged (grain follows the throws), journals induction-hardened + nitrided, micro-polished to 0.05 µm Ra, balanced to 0.5 g·cm',
        why: 'Forging flows the steel grain around each crank throw like wood grain around a knot — cast cranks snap where forged ones fatigue-proof.',
        props: [
          { label: 'TENSILE', value: '1,000 MPa' },
          { label: 'JOURNAL FINISH', value: '0.05 µm Ra' },
          { label: 'BALANCE', value: '0.5 g·cm' },
        ],
      },
    ],
  },
  {
    id: 'eng-piston',
    code: 'ENG-03',
    name: 'PISTON ASSEMBLY ×4',
    system: 'powertrain',
    mass: '1.1 kg each',
    summary:
      'The moving wall of the combustion chamber. Takes a 2-tonne punch 60 times a second, reverses direction with 3,000 g, and seals fire from oil with three thin rings.',
    operation: [
      'Explosion drives the crown down; the rod converts the push to crank torque.',
      'Ring pack seals pressure above and meters oil below.',
      'Underside oil jet keeps the crown from melting.',
    ],
    materials: [
      {
        name: 'ASSEMBLY — DISMANTLE FOR DETAIL',
        cls: 'Forged aluminum + steel + iron set',
        composition: [
          { element: 'Al (crown)', pct: 38 },
          { element: 'Steel (rod/pin)', pct: 58 },
          { element: 'Rings/bearings', pct: 4 },
        ],
        process: 'Crown, rings, pin, rod, bearing shells — each a node below',
        why: 'The full stack: crown takes the fire, rings seal it, pin hinges it, rod carries it, bearings let it spin.',
        props: [
          { label: 'PEAK LOAD', value: '~20 kN' },
          { label: 'SPEED', value: '20 m/s mean' },
        ],
      },
    ],
    children: PISTON_KIDS,
  },
  {
    id: 'eng-head',
    code: 'ENG-04',
    name: 'CYLINDER HEAD',
    system: 'powertrain',
    mass: '16 kg',
    summary:
      'The breathing apparatus. Ports shaped by airflow simulation, sixteen valves, two camshafts — everything above the pistons that decides how the engine breathes.',
    operation: [
      'Intake ports accelerate and swirl the charge for a fast, even burn.',
      'Combustion chambers are machined wedges that squish the mix toward the plug.',
      'Cams, buckets, valves and springs choreograph 32 opening events per revolution pair.',
    ],
    materials: [
      {
        name: 'AlSi7MgCu HEAD CASTING',
        cls: 'Aluminum alloy · head body',
        composition: [
          { element: 'Al', pct: 90.4 },
          { element: 'Si', pct: 7.0 },
          { element: 'Cu', pct: 0.5 },
          { element: 'Mg', pct: 0.35 },
        ],
        process: 'Gravity cast with sand cores forming ports and water jacket; seats and guides press-fit frozen in liquid nitrogen',
        why: 'The head sees the worst thermal cycling in the car — copper addition keeps strength at 250°C between the valve seats.',
        props: [
          { label: 'SEAT INTERFERENCE', value: '0.08 mm' },
          { label: 'PORT FLOW', value: '280 CFM' },
        ],
      },
    ],
    children: HEAD_KIDS,
  },
  {
    id: 'eng-gasket',
    code: 'ENG-05',
    name: 'HEAD GASKET — MLS',
    system: 'powertrain',
    mass: '320 g',
    summary:
      'Three sheets of embossed spring steel sealing three different things at once: 100-bar combustion, 1.4-bar coolant, and 5-bar oil — all crossing the same joint.',
    operation: [
      'Embossed beads around each bore act as springs, following the head as it lifts microns under firing pressure.',
      'Stopper layers around the bores limit compression and focus clamp load where pressure is highest.',
      'The elastomer coating fills machining scratches smaller than the steel can follow.',
    ],
    materials: [
      {
        name: '301 STAINLESS MLS, FKM COATED',
        cls: 'Multi-layer spring steel · gasket',
        composition: [
          { element: 'Fe', pct: 72.8 },
          { element: 'Cr', pct: 17.0 },
          { element: 'Ni', pct: 7.0 },
          { element: 'FKM coat', pct: 3.2 },
        ],
        process: '3 layers of 0.25 mm full-hard 301 stainless, embossed, coated 25 µm fluoroelastomer per face',
        why: 'The old single-sheet composite gaskets crushed once and died. Spring steel beads keep sealing force alive through a million thermal cycles.',
        props: [
          { label: 'SEALS', value: '100 bar / 1.4 bar / 5 bar' },
          { label: 'BEAD SPRING', value: '~50 µm travel' },
        ],
      },
    ],
  },
  {
    id: 'eng-bolts',
    code: 'ENG-06',
    name: 'HEAD BOLTS — TTY',
    system: 'powertrain',
    mass: '1.9 kg / set of 10',
    summary:
      'Ten bolts stretched deliberately past their yield point — torque-to-yield. Each one becomes a calibrated spring clamping the head down with 8 tonnes.',
    operation: [
      'Torqued to 30 Nm, then rotated 90° + 90° — angle, not torque, sets the stretch.',
      'Stretched into yield, every bolt clamps identically regardless of thread friction.',
      'Combined clamp: ~80 tonnes across the head — combustion pushes back with 10.',
    ],
    materials: [
      {
        name: 'ARP2000-CLASS Cr-Mo STEEL',
        cls: 'Quenched & tempered alloy steel · bolts',
        composition: [
          { element: 'Fe', pct: 96.6 },
          { element: 'Cr', pct: 1.2 },
          { element: 'Mn', pct: 0.9 },
          { element: 'C', pct: 0.45 },
          { element: 'Mo', pct: 0.35 },
        ],
        process: 'Cold-headed, thread-rolled AFTER heat treat (rolled threads resist fatigue 10×), phosphate coated',
        why: 'Rolling the threads after hardening leaves the thread roots in compression — fatigue cracks can’t start in compressed material.',
        props: [
          { label: 'CLAMP / BOLT', value: '~80 kN' },
          { label: 'REUSE', value: 'NEVER (yielded)' },
        ],
      },
    ],
  },
  {
    id: 'eng-pan',
    code: 'ENG-07',
    name: 'OIL PAN + 5W-30',
    system: 'powertrain',
    mass: '3.1 kg + 4.5 L',
    summary:
      'The reservoir and the lifeblood. 4.5 litres of engineered fluid that is simultaneously a lubricant, a coolant, a detergent, and a hydraulic medium.',
    operation: [
      'Windage tray shields the sump from the crank’s 7,200 RPM hurricane.',
      'Baffles keep the pickup submerged at 1 g cornering.',
      'Oil does 4 jobs: separates metal, carries 10% of engine heat, suspends soot, and powers the cam phasers.',
    ],
    materials: [
      {
        name: 'SAE 5W-30 FULL SYNTHETIC',
        cls: 'PAO/ester base + additive package · oil',
        composition: [
          { element: 'Base oils', pct: 80 },
          { element: 'VI improver', pct: 8 },
          { element: 'Detergents', pct: 5 },
          { element: 'Dispersants', pct: 4 },
          { element: 'ZDDP anti-wear', pct: 1.5 },
          { element: 'Other', pct: 1.5 },
        ],
        process: 'Synthesized base stock; ZDDP forms a sacrificial glass film on hot steel contacts',
        why: '5W = flows at -30°C cold start; 30 = holds film strength at 120°C. The polymer VI improvers uncoil when hot to fight thinning.',
        props: [
          { label: 'FILM', value: '>1 µm @ 120°C' },
          { label: 'HEAT CARRIED', value: '~10% of total' },
        ],
      },
      {
        name: 'DC04 STAMPED STEEL PAN',
        cls: 'Deep-draw steel · sump',
        composition: [
          { element: 'Fe', pct: 99.5 },
          { element: 'Mn', pct: 0.4 },
          { element: 'C', pct: 0.08 },
        ],
        process: 'Deep drawn, e-coated; magnetic drain plug catches ferrous wear debris',
        why: 'Steel survives speed-bump strikes that crack cast aluminum pans.',
        props: [{ label: 'CAPACITY', value: '4.5 L' }],
      },
    ],
  },
  {
    id: 'eng-timing',
    code: 'ENG-08',
    name: 'TIMING DRIVE',
    system: 'powertrain',
    mass: '2.8 kg',
    summary:
      'The contract between crank and cams: a roller chain that guarantees the valves and pistons — missing each other by millimetres — never, ever meet. One skipped tooth bends sixteen valves.',
    operation: [
      'Crank sprocket drives the cam sprockets at exactly half crank speed — 2:1, enforced by tooth count.',
      'A hydraulic tensioner (oil-pressure fed, with a no-return ratchet) keeps slack out of the chain as it wears.',
      'Curved nylon guides rail the chain runs so they can’t whip at 7,000 RPM.',
      'The VVT phaser on the intake sprocket rotates the cam ±25° against the chain — retiming the valves while they run.',
    ],
    fasteners: 'Cam sprocket bolts M10×1.0 class 10.9, 20 Nm + 60°, left-hand thread-locked',
    refs: [GUPTA],
    materials: [
      {
        name: 'ROLLER CHAIN — 100Cr6 PINS',
        cls: 'Bearing-steel pin/bushing chain',
        composition: [
          { element: 'Fe (plates)', pct: 78 },
          { element: '100Cr6 pins', pct: 15 },
          { element: 'Bushings/rollers', pct: 7 },
        ],
        process: 'Plates fine-blanked, pins through-hardened and chrome-nitrided, pre-stretched at the factory',
        why: 'Every pin is a tiny bearing articulating 50 times a second for 250,000 km — pin wear is chain "stretch", and stretch is retarded cam timing.',
        props: [
          { label: 'ELONGATION LIMIT', value: '0.5% = replace' },
          { label: 'RATIO', value: '2:1 locked' },
        ],
      },
      {
        name: 'PA66 + GF CHAIN GUIDES',
        cls: 'Nylon wear rails · guides + tensioner shoe',
        composition: [
          { element: 'PA66', pct: 82 },
          { element: 'Glass fiber', pct: 15 },
          { element: 'PTFE', pct: 3 },
        ],
        process: 'Injection molded wear face on aluminum carriers, oil-lubricated contact',
        why: 'Steel-on-steel chain contact would scream — nylon rails run silent and sacrifice themselves over 20 years instead of the chain.',
        props: [{ label: 'WEAR BUDGET', value: '~1.5 mm / life' }],
      },
    ],
  },
  {
    id: 'eng-oilpump',
    code: 'ENG-09',
    name: 'OIL PUMP & LUBRICATION',
    system: 'powertrain',
    mass: '3.4 kg',
    summary:
      'The engine’s heart in the literal sense: a gerotor pump pushing 40 litres a minute through drilled galleries, building the oil films every bearing in the engine lives on.',
    operation: [
      'Crank-driven gerotor: an inner rotor with one tooth less than the outer — the gap between them carries oil around and squeezes it out at up to 5 bar.',
      'Relief valve bypasses excess at high RPM so cold, thick oil doesn’t burst the filter.',
      'Full-flow filter catches particles >20 µm; a bypass valve guarantees flow even if the filter clogs.',
      'Spray jets aimed at each piston underside double as crown cooling.',
    ],
    refs: [GUPTA],
    materials: [
      {
        name: 'SINTERED Fe-Cu GEROTOR SET',
        cls: 'Powder metal · pump rotors',
        composition: [
          { element: 'Fe powder', pct: 93 },
          { element: 'Cu infiltrant', pct: 5 },
          { element: 'C + lubricant', pct: 2 },
        ],
        process: 'Pressed and sintered to net shape — the tooth profile needs zero machining; faces lapped to 3 µm clearance',
        why: 'The pump must survive a lifetime of cold starts pumping 20°C-below-zero sludge — porous sintered steel holds oil in its own pores as a boundary film.',
        props: [
          { label: 'FLOW', value: '40 L/min @ 6k' },
          { label: 'PRESSURE', value: '5 bar relief' },
        ],
      },
    ],
  },
  {
    id: 'eng-flywheel',
    code: 'ENG-10',
    name: 'FLYWHEEL & RING GEAR',
    system: 'powertrain',
    mass: '9.6 kg',
    summary:
      'A disc of stored rotation. Four power pulses per two turns would shake the car apart — the flywheel’s inertia irons them into smooth spin, and its rim teeth are how the starter wakes the engine.',
    operation: [
      'Stores each power stroke’s kick as rotational inertia, releasing it through the dead strokes — crank speed ripples ±150 RPM instead of stalling.',
      'Its machined face IS the clutch’s friction surface.',
      'The shrink-fitted ring gear meshes with the starter pinion: 9 teeth driving 132 — a 15:1 torque multiplication to crack the engine over.',
    ],
    fasteners: 'M11×1.25 class 12.9 crank bolts ×8, 60 Nm + 90°, single use — these carry every Nm the engine makes',
    refs: [GUPTA],
    materials: [
      {
        name: 'GG25 GRAY IRON DISC',
        cls: 'Flake-graphite iron · flywheel',
        composition: [
          { element: 'Fe', pct: 93.4 },
          { element: 'C', pct: 3.3 },
          { element: 'Si', pct: 2.1 },
          { element: 'Mn', pct: 0.7 },
        ],
        process: 'Cast, face ground flat to 0.05 mm, spin-balanced with the crank as a matched pair',
        why: 'Iron’s density is the point for once — inertia is the job. Graphite flakes also damp clutch judder and survive 350°C slip events.',
        props: [
          { label: 'INERTIA', value: '~0.15 kg·m²' },
          { label: 'SPEED RIPPLE', value: '±150 RPM' },
        ],
      },
      {
        name: 'C45 INDUCTION-HARDENED RING GEAR',
        cls: 'Carbon steel · starter teeth',
        composition: [
          { element: 'Fe', pct: 98.5 },
          { element: 'C', pct: 0.45 },
          { element: 'Mn', pct: 0.65 },
        ],
        process: 'Heated to 200°C and shrink-fitted over the iron rim — it clamps itself on cooling, no bolts',
        why: 'The starter pinion slams into these teeth thousands of times; induction-hardened flanks take the impact that would chew soft iron teeth bald.',
        props: [
          { label: 'TEETH', value: '132' },
          { label: 'START RATIO', value: '~15:1' },
        ],
      },
    ],
  },
  {
    id: 'eng-coils',
    code: 'ENG-11',
    name: 'IGNITION COILS & HARNESS',
    system: 'electrical',
    mass: '1.6 kg',
    summary:
      'Four pencil transformers, one per plug, each stepping 12 volts up to 45,000 — then the harness: the engine’s nervous system, carrying everything from coil triggers to sensor whispers.',
    operation: [
      'ECU grounds the coil primary; current ramps in the windings for ~3 ms (dwell), storing energy in the iron core.',
      'The ECU cuts the current — the field collapses and the secondary’s 15,000 turns multiply the kick to 45 kV.',
      'Coil-on-plug: no HT leads to leak or crossfire — the coil sits directly on the plug it fires.',
      'The loom bundles every circuit in crosslinked insulation rated for 150°C on-engine life.',
    ],
    materials: [
      {
        name: 'Cu WINDINGS + Fe-Si CORE, EPOXY POTTED',
        cls: 'Magnet wire transformer · coil',
        composition: [
          { element: 'Ferrite/Fe-Si core', pct: 45 },
          { element: 'Cu windings', pct: 30 },
          { element: 'Epoxy potting', pct: 15 },
          { element: 'PBT housing', pct: 10 },
        ],
        process: 'Secondary wound with 0.05 mm wire (15,000 turns), vacuum-potted in epoxy — one air void becomes an internal arc and a dead coil',
        why: 'The potting is the real engineering: 45 kV will find any bubble. Vacuum impregnation leaves it nowhere to arc.',
        props: [
          { label: 'OUTPUT', value: '45 kV' },
          { label: 'DWELL', value: '~3 ms' },
          { label: 'SPARKS/MIN', value: '14,400 @ 7,200' },
        ],
      },
      {
        name: 'XLPE HARNESS, TINNED Cu',
        cls: 'Crosslinked polyethylene loom',
        composition: [
          { element: 'Tinned Cu strands', pct: 60 },
          { element: 'XLPE insulation', pct: 30 },
          { element: 'Corrugated conduit', pct: 10 },
        ],
        process: 'Electron-beam crosslinked insulation; tin plating stops copper corroding at 150°C under-hood',
        why: 'Ordinary PVC insulation slumps off hot wires in months — crosslinking turns the polymer into a thermoset that holds shape for 15 years.',
        props: [{ label: 'RATING', value: '150°C · 15 yr' }],
      },
    ],
  },
  {
    id: 'eng-alternator',
    code: 'ENG-12',
    name: 'ALTERNATOR & BELT DRIVE',
    system: 'electrical',
    mass: '6.2 kg',
    summary:
      'The power station: a claw-pole generator making up to 150 amps — everything electrical in the car runs on this, not the battery. The battery is just its buffer.',
    operation: [
      'The serpentine belt spins the rotor ~2.5× crank speed off the damper pulley.',
      'A small DC field current magnetizes the claw-pole rotor; spinning it sweeps the field past the stator’s three windings.',
      'Six diodes rectify the three-phase output to DC; the regulator trims field current to hold 14.4 V from idle to redline.',
      'EPDM belt ribs grip through friction alone — tensioned to ~400 N by the spring arm.',
    ],
    materials: [
      {
        name: 'Cu STATOR + Fe CLAW ROTOR',
        cls: 'Electrical machine · generator',
        composition: [
          { element: 'Steel laminations', pct: 45 },
          { element: 'Cu windings', pct: 25 },
          { element: 'Al housings', pct: 22 },
          { element: 'Si diodes + regulator', pct: 8 },
        ],
        process: 'Stator wound as three phases 120° apart; claw poles forged and interleaved around the field coil',
        why: 'The claw-pole trick builds a 12-pole machine from ONE simple coil — the geometry of the iron does what 12 separate coils would.',
        props: [
          { label: 'OUTPUT', value: '150 A @ 14.4 V' },
          { label: 'SPEED', value: '~2.5× crank' },
        ],
      },
      {
        name: 'EPDM 6-RIB BELT, ARAMID CORDS',
        cls: 'Serpentine belt',
        composition: [
          { element: 'EPDM rubber', pct: 70 },
          { element: 'Aramid tension cords', pct: 20 },
          { element: 'Fiber loading', pct: 10 },
        ],
        process: 'Cords wound helically, rubber molded over, ribs ground to profile',
        why: 'The aramid cords carry the tension; the EPDM ribs only transmit friction. Stretch lives in the cord — which barely stretches at all.',
        props: [
          { label: 'TENSION', value: '~400 N' },
          { label: 'LIFE', value: '100,000 km' },
        ],
      },
    ],
  },
  {
    id: 'eng-starter',
    code: 'ENG-13',
    name: 'STARTER MOTOR',
    system: 'electrical',
    mass: '3.1 kg',
    summary:
      'The strongest motor in the car for its size: 1.4 kW for ten seconds at a time, throwing a 9-tooth pinion into the flywheel to spin 112 kg of engine from dead cold.',
    operation: [
      'Key-on: the solenoid does two jobs at once — its plunger levers the pinion forward into the ring gear AND closes the 300-amp main contacts.',
      'Pinion (9T) drives the ring gear (132T): ~15:1 torque multiplication; with the internal planetary reduction, ~45:1 total.',
      'One-way overrun clutch in the drive: the instant the engine fires and outruns the starter, the clutch freewheels — otherwise the engine would spin the motor to destruction.',
      'Rated for 10-second bursts: at 300 A the windings heat ~30°C per crank attempt.',
    ],
    fasteners: 'M10×1.5 class 10.9 mount bolts ×2 — they also carry the full cranking reaction torque',
    materials: [
      {
        name: 'Cu-WOUND DC MOTOR, NdFeB FIELD',
        cls: 'Permanent-magnet gear-reduction starter',
        composition: [
          { element: 'Steel frame + gears', pct: 50 },
          { element: 'Cu windings', pct: 25 },
          { element: 'NdFeB magnets', pct: 10 },
          { element: 'Al drive housing', pct: 15 },
        ],
        process: 'Planetary reduction gearset between motor and pinion lets a small fast motor replace the old heavy direct-drive units',
        why: 'Neodymium magnets replaced field windings — a kilogram lighter, and full torque the instant current flows, exactly when the engine is hardest to turn.',
        props: [
          { label: 'POWER', value: '1.4 kW' },
          { label: 'DRAW', value: '~300 A' },
          { label: 'DUTY', value: '10 s bursts' },
        ],
      },
    ],
  },
  {
    id: 'eng-exhman',
    code: 'ENG-14',
    name: 'EXHAUST MANIFOLD',
    system: 'powertrain',
    mass: '7.8 kg',
    summary:
      'Four cast runners collecting 900°C pulses into one stream for the turbo. The hottest structural part on the car — it glows dull red on a hard run, and is designed to.',
    operation: [
      'Each runner catches its cylinder’s exhaust pulse; lengths are matched so pulses arrive at the collector evenly spaced — uneven spacing starves the turbine.',
      'The manifold grows ~1.5 mm in length at full heat; slotted mounting holes and the gasket let it slide instead of cracking.',
      'The heat shield above it protects the wiring harness and stops under-hood temps cooking everything else.',
    ],
    fasteners: 'M8 copper-plated nuts on studs (not bolts) — studs survive the thermal cycling that snaps bolts',
    materials: [
      {
        name: 'SiMo DUCTILE IRON',
        cls: 'Silicon-molybdenum iron · manifold casting',
        composition: [
          { element: 'Fe', pct: 90.5 },
          { element: 'Si', pct: 4.5 },
          { element: 'C', pct: 3.2 },
          { element: 'Mo', pct: 0.8 },
        ],
        process: 'Sand cast with internal cores, machined flanges, allowed to oxidize — the brown scale IS the protective layer',
        why: 'Silicon pushes the iron’s oxidation limit past 800°C and molybdenum keeps it creep-strong — stainless fatigue-cracks here, this iron just turns brown and shrugs.',
        props: [
          { label: 'GAS TEMP', value: '900–950°C' },
          { label: 'THERMAL GROWTH', value: '~1.5 mm' },
        ],
      },
    ],
  },
  {
    id: 'eng-waterpump',
    code: 'ENG-15',
    name: 'WATER PUMP & THERMOSTAT',
    system: 'thermal',
    mass: '2.4 kg',
    summary:
      'The circulator and the gatekeeper: a chain-driven impeller pushing 150 litres a minute, and a wax pellet that decides — mechanically, with no electronics — when the radiator gets any of it.',
    operation: [
      'The impeller slings coolant outward by centrifugal force — ~150 L/min at speed, recirculating the engine’s whole water content 20 times a minute.',
      'Cold start: the thermostat is shut, coolant short-circuits around the engine only — fastest possible warm-up.',
      'At 88°C the wax pellet melts and expands ~15%, shoving the valve open against its spring — radiator flow begins.',
      'The mechanical seal (carbon ring on ceramic) runs on a film of the coolant itself.',
    ],
    materials: [
      {
        name: 'PPS IMPELLER + WAX PELLET BRASS',
        cls: 'Polymer impeller · thermostat capsule',
        composition: [
          { element: 'PPS-GF40 impeller', pct: 30 },
          { element: 'Al housing', pct: 45 },
          { element: 'Brass + wax capsule', pct: 15 },
          { element: 'Carbon/ceramic seal', pct: 10 },
        ],
        process: 'Impeller molded in glass-filled PPS (cavitation-resistant, zero corrosion); wax charge blended to melt at exactly 88°C',
        why: 'A blob of wax is still the most reliable temperature actuator ever made: no sensor, no power, no code — physics opens the valve at 88°C every time for 15 years.',
        props: [
          { label: 'FLOW', value: '150 L/min' },
          { label: 'OPENS', value: '88°C ±2' },
        ],
      },
    ],
  },
  {
    id: 'eng-coolpath',
    code: 'ENG-16',
    name: 'COOLANT GALLERIES — WATER JACKET',
    system: 'thermal',
    mass: '~4 L in engine',
    summary:
      'The hidden rivers. Cast-in passages wrap every cylinder and valve seat — follow the glowing trace: in at the pump, rear through the block, UP through the deck holes, forward across the head, out at the thermostat.',
    operation: [
      'IN — the pump pushes coolant into the block’s jacket at the front.',
      'BLOCK — flow runs rearward BETWEEN the cylinders; the thin webs between bores are the hottest, most critical millimetres of the casting.',
      'UP — drilled deck holes (you can see them on the gasket) meter flow up into the head. Their sizes are tuned: rear holes bigger, forcing flow to travel the full block length first.',
      'HEAD — coolant sweeps forward across the exhaust valve seats and plug bosses — the hottest metal in the engine gets the flow LAST in the block but FIRST in the head.',
      'OUT — collected at the thermostat housing; 88°C+ coolant leaves for the radiator.',
    ],
    materials: [
      {
        name: 'CAST-IN PASSAGES (SAND CORES)',
        cls: 'Negative space · the jacket itself',
        composition: [
          { element: 'Coolant volume', pct: 100 },
        ],
        process: 'The jacket is formed by sand cores inside the casting molds — baked sand shapes standing where water will be, shaken out through the freeze-plug holes after pouring',
        why: 'The freeze plugs on the block sides are literally the holes the core sand came out of. The jacket is the one component that is made of nothing.',
        props: [
          { label: 'ΔT ACROSS ENGINE', value: '~8°C' },
          { label: 'HEAT REMOVED', value: 'up to 60 kW' },
        ],
      },
    ],
  },
  {
    id: 'eng-oilpath',
    code: 'ENG-17',
    name: 'OIL GALLERIES — LUBRICATION CIRCUIT',
    system: 'powertrain',
    mass: '4.5 L circuit',
    summary:
      'Follow the amber trace: sump → pump → filter → the main gallery drilled end-to-end through the block → down to every crank bearing, up to the cams — then everything rains back to the sump and goes again. Twenty seconds per lap.',
    operation: [
      'PICKUP — the strainer drinks from the sump’s deepest point.',
      'PUMP → FILTER — pressurized to ~4 bar, filtered to 20 microns. Full flow goes through the filter, every lap.',
      'MAIN GALLERY — one long drilled bore running the block’s length: the aorta. Every drilling in the engine branches off it.',
      'DOWN — five feeds drop to the main bearings; the crank’s internal drillings sling oil onward to the rod bearings.',
      'UP — a riser climbs through the deck to the head: cam bearings and the spray bar that oils the lobes.',
      'BACK — no return pipes: oil simply rains down the drain-back passages by gravity, is cooled in the sump, and is picked up again. Full lap ≈ 20 seconds.',
    ],
    materials: [
      {
        name: 'GUN-DRILLED BORES + CAST DRAINS',
        cls: 'Negative space · the circuit itself',
        composition: [
          { element: 'Oil volume', pct: 100 },
        ],
        process: 'Main gallery gun-drilled in one pass end-to-end; cross-drillings meet it at each bearing; drilling mouths sealed with pressed-in ball plugs you can spot on the block ends',
        why: 'Every bearing in the engine is fed from this one drilled line — a blocked gallery kills a bearing in under a minute, which is why the filter sits upstream of everything.',
        props: [
          { label: 'PRESSURE', value: '~4 bar hot' },
          { label: 'FULL LAP', value: '~20 s' },
        ],
      },
    ],
  },
]

/* ============================= TURBO SUBTREE ============================= */

export const TURBO_KIDS: Part[] = [
  {
    id: 'trb-turbine',
    code: 'TRB-01',
    name: 'TURBINE WHEEL — HOT SIDE',
    system: 'powertrain',
    mass: '280 g',
    summary:
      'An 11-blade superalloy windmill living in 950°C exhaust gas at 180,000 RPM. Tip speed: 560 m/s — faster than a rifle bullet leaves the muzzle.',
    operation: [
      'The volute nozzles exhaust gas onto the blade tips tangentially.',
      'Blades extract ~70 kW of pulse energy and feed it down the shaft.',
      'Inconel holds full strength where normal steel would flow like taffy.',
    ],
    materials: [
      {
        name: 'INCONEL 713C',
        cls: 'Nickel superalloy · cast wheel',
        composition: [
          { element: 'Ni', pct: 74.0 },
          { element: 'Cr', pct: 12.5 },
          { element: 'Al', pct: 6.1 },
          { element: 'Mo', pct: 4.2 },
          { element: 'Nb', pct: 2.0 },
        ],
        process: 'Investment cast (lost wax), friction-welded to the 4140 shaft, spin-tested to 110% overspeed',
        why: 'Gamma-prime precipitates in the nickel matrix actually get STRONGER as temperature rises toward 800°C — backwards from every normal metal.',
        props: [
          { label: 'GAS TEMP', value: '950°C' },
          { label: 'SPEED', value: '180,000 RPM' },
        ],
      },
    ],
  },
  {
    id: 'trb-comp',
    code: 'TRB-02',
    name: 'COMPRESSOR WHEEL — COLD SIDE',
    system: 'powertrain',
    mass: '95 g',
    summary:
      'The payoff wheel. Machined from a single aluminum forging, it rams 20 cubic metres of air per minute into the engine at 1.4 bar boost.',
    operation: [
      'Full blades + splitter blades grab air axially and fling it radially at near-sonic speed.',
      'The diffuser converts that velocity into pressure.',
      'Low inertia is everything: half the mass = half the lag.',
    ],
    materials: [
      {
        name: '2618-T6 BILLET ALUMINUM',
        cls: 'Forged aluminum · machined wheel',
        composition: [
          { element: 'Al', pct: 93.7 },
          { element: 'Cu', pct: 2.3 },
          { element: 'Mg', pct: 1.6 },
          { element: 'Ni', pct: 1.1 },
        ],
        process: '5-axis CNC from forged bar — forged grain survives 10× the fatigue cycles of a casting',
        why: 'Each blade flexes slightly on every one of 3,000 rotations per second. Billet 2618 shrugs off the hum that cracks cast wheels.',
        props: [
          { label: 'FLOW', value: '20 m³/min' },
          { label: 'OUTLET TEMP', value: '~160°C' },
        ],
      },
    ],
  },
  {
    id: 'trb-chra',
    code: 'TRB-03',
    name: 'BEARING CARTRIDGE (CHRA)',
    system: 'powertrain',
    mass: '2.1 kg',
    summary:
      'The core between the wheels. The shaft doesn’t ride on bearings — it surfs on two spinning films of engine oil inside floating bronze sleeves.',
    operation: [
      'Journal bearings FLOAT: they spin at half shaft speed, splitting 180,000 RPM across two oil films.',
      'Engine oil at 4 bar feeds the films and carries away ~2 kW of friction heat.',
      'Piston-ring seals at each end keep oil out of the hot and cold housings.',
    ],
    materials: [
      {
        name: 'C93200 BEARING BRONZE',
        cls: 'Tin bronze · floating sleeves',
        composition: [
          { element: 'Cu', pct: 83.0 },
          { element: 'Sn', pct: 7.0 },
          { element: 'Pb', pct: 7.0 },
          { element: 'Zn', pct: 3.0 },
        ],
        process: 'Continuous cast tube, bored with 0.04 mm oil clearance each side',
        why: 'Bronze survives the daily ritual murder of hot shutdowns — when oil stops flowing and the shaft cooks at 300°C in residual heat.',
        props: [
          { label: 'FILM EACH SIDE', value: '~20 µm' },
          { label: 'OIL FLOW', value: '2 L/min' },
        ],
      },
    ],
  },
  {
    id: 'trb-wastegate',
    code: 'TRB-04',
    name: 'WASTEGATE ACTUATOR',
    system: 'powertrain',
    mass: '420 g',
    summary:
      'The boost governor. A spring-loaded diaphragm that cracks open a bypass valve when boost hits 1.4 bar — without it the turbo would spiral until the engine grenades.',
    operation: [
      'Boost pressure plumbed to the diaphragm fights a calibrated spring.',
      'At 1.4 bar the diaphragm wins, the rod swings the flap, exhaust bypasses the turbine.',
      'The ECU bleeds the signal line with a solenoid to electronically raise or drop boost.',
    ],
    materials: [
      {
        name: 'VMQ SILICONE DIAPHRAGM, FABRIC CORE',
        cls: 'High-temp elastomer · diaphragm',
        composition: [
          { element: 'Silicone', pct: 68 },
          { element: 'Aramid fabric', pct: 24 },
          { element: 'Fillers', pct: 8 },
        ],
        process: 'Fabric-reinforced molding, crimped into a plated steel can',
        why: 'Lives bolted to a 900°C housing while flexing 1M+ cycles — silicone keeps its stretch from -40°C to 230°C.',
        props: [
          { label: 'CRACK PRESSURE', value: '1.4 bar' },
          { label: 'RESPONSE', value: '<100 ms' },
        ],
      },
    ],
  },
]

/* ============================ INTAKE SUBTREE ============================ */

export const INTAKE_KIDS: Part[] = [
  {
    id: 'int-plenum',
    code: 'INT-01',
    name: 'PLENUM CHAMBER',
    system: 'powertrain',
    mass: '1.8 kg',
    summary:
      'The air reservoir. A calm 3-litre volume that lets each cylinder gulp without starving its neighbors.',
    operation: [
      'Smooths the violent suction pulses of four cylinders into steady flow.',
      'Volume is tuned: too small and cylinders rob each other, too big and throttle response dies.',
    ],
    materials: [
      {
        name: 'PA66-GF35 NYLON',
        cls: 'Glass-filled polyamide · molding',
        composition: [
          { element: 'PA66', pct: 65 },
          { element: 'Glass fiber', pct: 35 },
        ],
        process: 'Two injection-molded halves vibration-welded — the weld bead is visible as a seam ridge',
        why: 'Plastic walls don’t heat-soak like aluminum: intake air stays ~15°C cooler, worth ~2% power.',
        props: [
          { label: 'VOLUME', value: '3.0 L' },
          { label: 'BURST', value: '>6 bar' },
        ],
      },
    ],
  },
  {
    id: 'int-runners',
    code: 'INT-02',
    name: 'TUNED RUNNERS ×4',
    system: 'powertrain',
    mass: '0.9 kg',
    summary:
      'Four pipes whose exact length is an acoustic instrument. Pressure waves bounce back and forth and arrive — supercharging each cylinder for free.',
    operation: [
      'When the intake valve slams shut, the moving air column piles up as a pressure wave.',
      'The wave reflects off the plenum and returns in ~3 ms.',
      'At 320 mm length, it arrives exactly as the valve re-opens at 4,500 RPM — ram effect, +8% cylinder fill.',
    ],
    materials: [
      {
        name: 'PA66-GF35 NYLON',
        cls: 'Glass-filled polyamide · runners',
        composition: [
          { element: 'PA66', pct: 65 },
          { element: 'Glass fiber', pct: 35 },
        ],
        process: 'Molded with the plenum; internal bores slip-polished for attached flow',
        why: 'The tuning only works if the walls are smooth and the length is exact — molding holds ±0.5 mm.',
        props: [
          { label: 'LENGTH', value: '320 mm tuned' },
          { label: 'RAM EFFECT', value: '+8% fill @ 4,500' },
        ],
      },
    ],
  },
  {
    id: 'int-throttle',
    code: 'INT-03',
    name: 'THROTTLE BODY',
    system: 'powertrain',
    mass: '1.1 kg',
    summary:
      'The air tap. A 60 mm butterfly plate turned by a motor — your pedal is just a suggestion the ECU interprets.',
    operation: [
      'Pedal sensor reports demand; the ECU commands the throttle motor.',
      'Dual redundant position sensors cross-check — a disagreement forces limp mode.',
      'At idle it holds a crack of ~1° open, metering air to the gram.',
    ],
    materials: [
      {
        name: 'ADC12 DIE-CAST + BRUSHLESS DC',
        cls: 'Aluminum housing · motorized valve',
        composition: [
          { element: 'Al', pct: 86.5 },
          { element: 'Si', pct: 10.5 },
          { element: 'Cu', pct: 2.0 },
          { element: 'Motor/brass', pct: 1.0 },
        ],
        process: 'Die cast, bore diamond-turned so the plate seals to 0.05 mm',
        why: 'The bore and plate must nearly touch without sticking across -40°C to 120°C — matched thermal expansion is the trick.',
        props: [
          { label: 'BORE', value: '60 mm' },
          { label: 'FULL SWEEP', value: '120 ms' },
        ],
      },
    ],
  },
  {
    id: 'int-injectors',
    code: 'INT-04',
    name: 'FUEL INJECTORS ×4',
    system: 'powertrain',
    mass: '45 g each',
    summary:
      'Electromagnetic needles pulsing open for 2–15 milliseconds, shattering fuel into a 60-micron fog aimed at the back of the intake valves.',
    operation: [
      'Coil energizes, lifting the needle 0.1 mm off its seat.',
      'Fuel at 5 bar atomizes through 6 laser-drilled holes.',
      'The ECU times the pulse width to hold the mix within ±2% of 14.7:1.',
    ],
    materials: [
      {
        name: '430F STAINLESS + Cu COIL',
        cls: 'Magnetic stainless body · solenoid',
        composition: [
          { element: 'Fe', pct: 79.5 },
          { element: 'Cr', pct: 17.0 },
          { element: 'Cu windings', pct: 3.0 },
          { element: 'Mn+S', pct: 0.5 },
        ],
        process: 'Needle and seat lapped as a matched pair; spray holes laser-drilled at 60 µm',
        why: 'The body IS the magnetic circuit — 430F is stainless that a solenoid can still pull through.',
        props: [
          { label: 'PULSE', value: '2–15 ms' },
          { label: 'DROPLETS', value: '~60 µm' },
          { label: 'FLOW', value: '350 cc/min' },
        ],
      },
    ],
  },
  {
    id: 'int-aircleaner',
    code: 'INT-05',
    name: 'AIR CLEANER & MAF SENSOR',
    system: 'powertrain',
    mass: '1.9 kg',
    summary:
      'The lungs’ gatekeeper: pleated paper stopping everything above 5 microns from sandblasting the bores, and a heated wire so precise it weighs the air the engine breathes.',
    operation: [
      'The pleats pack ~0.5 m² of filter paper into a shoebox — dust loads the SURFACE while air passes through.',
      'A dirty filter actually filters BETTER (the dust cake catches finer dust) — until it chokes flow.',
      'MAF: a platinum wire held exactly 100°C above intake temp; the current needed to keep it there IS the mass of air flowing past — the ECU’s most important number.',
      'The corrugated duct after it decouples engine shake from the airbox.',
    ],
    materials: [
      {
        name: 'RESIN-IMPREGNATED CELLULOSE PLEATS',
        cls: 'Filter media · element',
        composition: [
          { element: 'Cellulose fiber', pct: 85 },
          { element: 'Phenolic resin', pct: 12 },
          { element: 'PU end seals', pct: 3 },
        ],
        process: 'Paper pleated ~60 folds, resin-cured for wet strength, potted into polyurethane sealing frames',
        why: 'Paper beats foam and gauze where it counts: 99.8% capture at 5 µm. Engines wear out through their air before their oil.',
        props: [
          { label: 'CAPTURE', value: '99.8% @ 5 µm' },
          { label: 'MEDIA AREA', value: '~0.5 m²' },
        ],
      },
      {
        name: 'Pt HOT-FILM MAF ELEMENT',
        cls: 'Sensor · mass airflow',
        composition: [
          { element: 'Si/glass substrate', pct: 60 },
          { element: 'Pt film', pct: 5 },
          { element: 'PBT housing', pct: 35 },
        ],
        process: 'Platinum film on a micro-machined diaphragm; a reference sensor beside it cancels temperature drift',
        why: 'Measuring MASS (not volume) means altitude and heat are automatically accounted for — the fueling math starts from this one sensor.',
        props: [
          { label: 'RANGE', value: '2–400 kg/h' },
          { label: 'RESPONSE', value: '<15 ms' },
        ],
      },
    ],
  },
]

/* ============================ EXHAUST SUBTREE ============================ */

export const EXHAUST_KIDS: Part[] = [
  {
    id: 'exh-downpipe',
    code: 'EXH-01',
    name: 'DOWNPIPE',
    system: 'powertrain',
    mass: '4.2 kg',
    summary:
      'The post-turbine escape route. The faster gas clears the turbine, the faster the turbo spools — every bend here costs boost response.',
    operation: [
      'Takes 600°C post-turbine gas and dives under the floor.',
      'Flex joint (braided bellows) absorbs engine rock so pipes don’t crack.',
    ],
    materials: [
      {
        name: 'SS409 FERRITIC STAINLESS',
        cls: 'Stainless steel · mandrel-bent tube',
        composition: [
          { element: 'Fe', pct: 87.4 },
          { element: 'Cr', pct: 11.2 },
          { element: 'Ti', pct: 0.5 },
        ],
        process: 'Mandrel-bent (no crushed bends), TIG welded, with a double-wall heat shield section',
        why: 'Ferritic stainless expands 30% less than austenitic per degree — fewer cracked welds over 10,000 heat cycles.',
        props: [
          { label: 'GAS IN', value: '~600°C' },
          { label: 'Ø', value: '70 mm' },
        ],
      },
    ],
  },
  {
    id: 'exh-cat',
    code: 'EXH-02',
    name: 'CATALYTIC CONVERTER',
    system: 'powertrain',
    mass: '5.8 kg',
    summary:
      'A chemistry plant in a can: 4 grams of platinum-group metal spread over a ceramic honeycomb with the internal surface area of a football pitch.',
    operation: [
      'CO + unburnt fuel oxidize to CO₂ and water over platinum/palladium.',
      'NOx reduces to N₂ over rhodium — simultaneously, in the same gas stream.',
      'Only works within ±1% of the perfect 14.7:1 ratio — which is the real reason the O₂ sensor exists.',
    ],
    materials: [
      {
        name: 'CORDIERITE + Pt·Pd·Rh WASHCOAT',
        cls: 'Ceramic honeycomb · catalyst brick',
        composition: [
          { element: 'Cordierite', pct: 97.8 },
          { element: 'Pt', pct: 0.9 },
          { element: 'Pd', pct: 0.9 },
          { element: 'Rh', pct: 0.4 },
        ],
        process: '600-cell/in² extruded honeycomb, dipped in alumina slurry carrying nano-dispersed precious metal, wrapped in intumescent mat',
        why: 'The metals are catalysts — never consumed. They just hold molecules in place long enough to react, 10,000 times a second.',
        props: [
          { label: 'SURFACE AREA', value: '~5,000 m²' },
          { label: 'LIGHT-OFF', value: '250°C' },
          { label: 'CONVERSION', value: '>98%' },
        ],
      },
    ],
  },
  {
    id: 'exh-muffler',
    code: 'EXH-03',
    name: 'MUFFLER',
    system: 'powertrain',
    mass: '7.4 kg',
    summary:
      'An acoustic maze. Kills 30 decibels of combustion blast using physics only — reflected waves cancelling themselves, no moving parts.',
    operation: [
      'Perforated tubes leak pulses into chambers sized so reflections return anti-phase — destructive interference.',
      'A quarter-wave side branch is cut to exactly kill the 110 Hz boom frequency.',
      'E-glass packing absorbs what reflection can’t cancel, as heat.',
    ],
    materials: [
      {
        name: 'SS409 SHELL + E-GLASS ROVING',
        cls: 'Stainless shell · absorptive fill',
        composition: [
          { element: 'SS409 steel', pct: 82 },
          { element: 'E-glass fiber', pct: 16 },
          { element: 'SS mesh', pct: 2 },
        ],
        process: 'Spun-locked shell; continuous glass roving texturized to a wool around the perforated core',
        why: 'Glass fiber turns sound energy into microscopic friction heat and survives 700°C where polymer foam would burn.',
        props: [
          { label: 'ATTENUATION', value: '~30 dB' },
          { label: 'BACKPRESSURE', value: '<0.15 bar' },
        ],
      },
    ],
  },
]

/* =========================== FUEL TANK SUBTREE =========================== */

export const FUELTANK_KIDS: Part[] = [
  {
    id: 'tnk-shell',
    code: 'TNK-01',
    name: 'TANK SHELL — 6-LAYER',
    system: 'powertrain',
    mass: '7.2 kg',
    summary:
      'A blow-molded sandwich with a buried barrier layer 0.1 mm thick — the only thing between 52 litres of gasoline and the atmosphere.',
    operation: [
      'HDPE structure carries the fuel load and crash deformation.',
      'The EVOH layer blocks hydrocarbon molecules that walk straight through plain polyethylene.',
    ],
    materials: [
      {
        name: 'HDPE / EVOH CO-EXTRUSION',
        cls: 'Six-layer polymer · shell',
        composition: [
          { element: 'HDPE', pct: 92 },
          { element: 'EVOH barrier', pct: 3 },
          { element: 'Adhesive tie', pct: 3 },
          { element: 'Regrind', pct: 2 },
        ],
        process: 'Co-extruded parison blow-molded in one piece; pinch weld forms the seam',
        why: 'Plain HDPE loses ~20 g of fuel a day through its own walls as vapor. The EVOH layer cuts that 200-fold.',
        props: [
          { label: 'PERMEATION', value: '<0.1 g/day' },
          { label: 'WALL', value: '4–6 mm' },
        ],
      },
    ],
  },
  {
    id: 'tnk-pump',
    code: 'TNK-02',
    name: 'FUEL PUMP MODULE',
    system: 'powertrain',
    mass: '1.4 kg',
    summary:
      'An electric motor that lives submerged in gasoline — which is exactly what keeps it alive. The fuel it pumps is also its coolant and lubricant.',
    operation: [
      'Turbine impeller stages pressurize fuel to 5 bar at 150 L/h.',
      'Brushless design: no commutator sparks (and none would ignite anyway — no oxygen in the tank).',
      'The swirl pot around it stays full even when the tank runs low in corners.',
    ],
    materials: [
      {
        name: 'POM IMPELLER + SS SHELL',
        cls: 'Acetal turbine · stainless can',
        composition: [
          { element: 'POM acetal', pct: 40 },
          { element: 'SS304', pct: 35 },
          { element: 'Cu windings', pct: 15 },
          { element: 'Ferrite', pct: 10 },
        ],
        process: 'Micro-molded 40-vane impeller, 0.03 mm side clearance to the pump ring',
        why: 'POM doesn’t swell in gasoline or ethanol blends — the vane clearances that make pressure stay exact for 15 years.',
        props: [
          { label: 'PRESSURE', value: '5.0 bar' },
          { label: 'FLOW', value: '150 L/h' },
        ],
      },
    ],
  },
  {
    id: 'tnk-baffles',
    code: 'TNK-03',
    name: 'BAFFLES + SWIRL POT',
    system: 'powertrain',
    mass: '0.6 kg',
    summary:
      'Anti-slosh architecture. In a 1 g corner, 30 kg of fuel tries to climb the tank wall — these walls and the pump’s cup keep the pickup drinking.',
    operation: [
      'Welded internal walls break the wave before it builds momentum.',
      'The swirl pot is a cup around the pump pickup, refilled by a venturi jet — a fuel-powered fuel pump with no moving parts.',
    ],
    materials: [
      {
        name: 'HDPE WELDED INTERNALS',
        cls: 'Polyethylene · baffle set',
        composition: [
          { element: 'HDPE', pct: 100 },
        ],
        process: 'Spin-welded to the shell interior through the service aperture before final closing',
        why: 'Same polymer as the shell = same expansion, and the welds are as strong as the parent material.',
        props: [
          { label: 'HOLDS PICKUP FED', value: '1.2 g lateral' },
          { label: 'NOISE', value: 'kills slosh boom' },
        ],
      },
    ],
  },
]
