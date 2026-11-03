import type { Part } from './parts'

const CALLISTER =
  'W.D. Callister & D.G. Rethwisch — Materials Science and Engineering: An Introduction (Wiley)'

/* ================= PISTON CROWN — DOWN TO THE ABSOLUTE LIMIT ================ */

export const CROWN_CHAIN: Part[] = [
  {
    id: 'crn-section',
    code: 'SEC-01',
    name: 'CROSS-SECTION — PISTON CROWN',
    system: 'powertrain',
    mass: 'cut plane · full size',
    summary:
      'The piston sawn in half. Now the design logic is visible: a 7 mm deck carrying the explosion, thin ring lands metering heat into the rings, a 2 mm skirt wall carrying almost nothing — material exactly where the loads are, nowhere else.',
    operation: [
      'DECK (top, thick): takes the combustion punch and the 350°C face — the under-crown dome is shaped for the cooling oil jet to splash across.',
      'HEAT PATH (follow the glowing arrows): ~60% of the crown’s heat escapes sideways THROUGH THE RINGS into the cylinder wall — the rings are heat bridges first, seals second.',
      'TOP LAND: deliberately clearanced wide — it grows hotter and expands more than anything below it.',
      'RING LANDS: the thin shelves between grooves — the second land is the piston’s most common failure site under detonation.',
      'SKIRT: just 2 mm — it only guides. Every gram here reverses direction 120 times a second.',
    ],
    materials: [
      {
        name: 'SECTION ZONES',
        cls: 'What the cut reveals · wall thickness map',
        composition: [
          { element: 'Deck 7 mm', pct: 35 },
          { element: 'Ring lands 4 mm', pct: 20 },
          { element: 'Pin boss 8 mm', pct: 25 },
          { element: 'Skirt 2 mm', pct: 15 },
          { element: 'Anodized layer 15 µm', pct: 5 },
        ],
        process: 'Thickness follows load: forged blank starts uniform, CNC removes everything the stress analysis says is loafing',
        why: 'A piston is a lesson in material placement — dismantle again to zoom INTO the metal itself: the microstructure is the next level down.',
        props: [
          { label: 'DECK TEMP', value: '350°C' },
          { label: 'SKIRT TEMP', value: '~150°C' },
          { label: 'HEAT VIA RINGS', value: '~60%' },
        ],
      },
    ],
    children: [
      {
        id: 'crn-micro',
        code: 'MIC-01',
        name: 'MICROSTRUCTURE — 2618 FORGED ×500',
        system: 'powertrain',
        mass: 'field of view ≈ 0.3 mm',
        summary:
          'Inside the metal, ×500. The alloy is not uniform: pancaked aluminum grains flattened by the forging blow, their boundaries pinned by hard intermetallic particles — this texture, not the recipe alone, is why a forged piston survives.',
        operation: [
          'GRAINS: each pale region is one crystal. Forging squashed them into pancakes aligned with the metal flow — cracks must zig-zag across thousands of boundaries.',
          'FINER = STRONGER: every boundary is a wall that blocks slip (the Hall-Petch law) — forging strength is mostly grain-boundary count.',
          'DARK PARTICLES: Al₉FeNi intermetallics — ceramic-hard specks that pin the boundaries in place at 350°C, so the grains cannot grow back and soften.',
          'At this scale the piston is a city: grains are the blocks, boundaries the walls, particles the pillars.',
        ],
        refs: [CALLISTER],
        materials: [
          {
            name: 'PHASE MAP AT ×500',
            cls: 'What each feature is',
            composition: [
              { element: 'α-Al grains', pct: 88 },
              { element: 'Al₉FeNi particles', pct: 7 },
              { element: 'Al₂Cu / Al₂CuMg', pct: 4 },
              { element: 'Porosity', pct: 1 },
            ],
            process: 'Sample cut, polished to a mirror, etched with Keller’s reagent — the acid attacks boundaries first, which is why they appear as lines',
            why: 'Heat treatment dissolved the copper into the grains, then re-precipitated it as billions of nano-particles — dismantle once more to see the atoms it happens between.',
            props: [
              { label: 'GRAIN SIZE', value: '~40 µm' },
              { label: 'SCALE BAR', value: '100 µm' },
            ],
          },
        ],
        children: [
          {
            id: 'crn-lattice',
            code: 'LAT-01',
            name: 'CRYSTAL LATTICE — FCC ALUMINUM',
            system: 'powertrain',
            mass: 'a = 0.405 nm',
            summary:
              'The absolute limit. Every aluminum grain is this, repeated: atoms stacked face-centered-cubic, 0.4 nanometres per cell, ~10²² of them in one piston. Everything above — strength, heat flow, the whole engine — is these spheres holding hands.',
            operation: [
              'FCC PACKING: an atom at each cube corner + one on each face — the densest way equal spheres stack. Aluminum, copper and gold all choose it.',
              'ORANGE ATOMS: copper, dissolved into the lattice. A copper atom is the wrong size — it strains the lattice around it, and that strain field snags passing dislocations. That IS alloy strengthening.',
              'BENDING = dislocations (missing half-planes of atoms) gliding through this lattice. Block the glide — with solutes, particles, boundaries — and the metal is "strong".',
              'HEAT in this picture is just the atoms vibrating; conduction is the vibration passing hand-to-hand. Nothing below this level exists to engineer.',
            ],
            refs: [CALLISTER],
            materials: [
              {
                name: 'FCC UNIT CELL, Al + Cu SOLUTE',
                cls: 'The crystal itself',
                composition: [
                  { element: 'Al atoms', pct: 97.7 },
                  { element: 'Cu substitutional', pct: 2.3 },
                ],
                process: 'Nothing is manufactured here — this is what every process upstream (casting, forging, heat treat) was really arranging',
                why: 'END OF THE LINE: you are looking at the atoms. The god eye closes here.',
                props: [
                  { label: 'CELL EDGE', value: '0.405 nm' },
                  { label: 'ATOMS / CELL', value: '4' },
                  { label: 'IN ONE PISTON', value: '~10²² atoms' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

/* ================== BRAKE DISC — DOWN TO THE ABSOLUTE LIMIT ================= */

export const DISC_CHAIN: Part[] = [
  {
    id: 'dsc-section',
    code: 'SEC-02',
    name: 'CROSS-SECTION — VENTED DISC',
    system: 'brakes',
    mass: 'cut plane · full size',
    summary:
      'The disc sawn through. Two 9 mm friction plates held apart by curved vanes — the gap between them is a centrifugal air pump that runs whenever the wheel turns, drawing cool air from the hub and flinging it out hot at the rim.',
    operation: [
      'FRICTION PLATES: 9 mm each when new. The glowing wear-limit line sits at 7.5 mm — past it the disc can no longer soak a panic stop without warping.',
      'VANES (follow the air arrows): rotation slings air from the center outward between the plates — the disc is its own cooling fan, moving ~10 L of air per revolution.',
      'The plates heat and grow; the vanes let each plate expand on its own — a solid disc would dish like a saucer.',
      'HAT SECTION: offsets the friction plates from the hub so heat has a long, thin path to the wheel bearing.',
    ],
    materials: [
      {
        name: 'SECTION ZONES',
        cls: 'What the cut reveals',
        composition: [
          { element: 'Friction plates 2×9 mm', pct: 55 },
          { element: 'Vane gap 8 mm', pct: 25 },
          { element: 'Hat section', pct: 20 },
        ],
        process: 'Cast in one pour around sand vane-cores; both faces ground flat together to 0.01 mm',
        why: 'Dismantle again to zoom into the iron itself — the graphite flakes you’ll see are the whole reason brake discs are made of this metal.',
        props: [
          { label: 'NEW / LIMIT', value: '9 / 7.5 mm' },
          { label: 'AIR PUMPED', value: '~10 L/rev' },
        ],
      },
    ],
    children: [
      {
        id: 'dsc-micro',
        code: 'MIC-02',
        name: 'MICROSTRUCTURE — GRAY IRON ×200',
        system: 'brakes',
        mass: 'field of view ≈ 0.6 mm',
        summary:
          'Inside the iron, ×200: dark graphite flakes threaded through a steel-like pearlite matrix. The flakes look like defects — they are the feature. They conduct the heat, damp the squeal, and lubricate the pad.',
        operation: [
          'FLAKES: pure carbon, grown as curved plates while the iron froze. Graphite conducts heat better than the iron around it — the flakes are a built-in heat-pipe network.',
          'DAMPING: vibration energy dies crossing the soft flakes — why cast-iron discs hum where steel ones would scream.',
          'THE TRADE: every flake tip is a micro-crack waiting to open in tension. Gray iron is weak in tension, mighty in compression — exactly a brake disc’s load case.',
          'MATRIX: pearlite — alternating nano-layers of soft ferrite and hard cementite, the composite steel builds for itself.',
        ],
        refs: [CALLISTER],
        materials: [
          {
            name: 'PHASE MAP AT ×200',
            cls: 'What each feature is',
            composition: [
              { element: 'Pearlite matrix', pct: 83 },
              { element: 'Graphite flakes', pct: 12 },
              { element: 'Ferrite halos', pct: 4 },
              { element: 'MnS inclusions', pct: 1 },
            ],
            process: 'Polished and etched with nital — the graphite needs no etch, it is simply dark',
            why: 'One more level down: the matrix is iron atoms in a body-centered cube, with carbon squeezed into the gaps.',
            props: [
              { label: 'FLAKE LENGTH', value: '50–300 µm' },
              { label: 'SCALE BAR', value: '200 µm' },
            ],
          },
        ],
        children: [
          {
            id: 'dsc-lattice',
            code: 'LAT-02',
            name: 'CRYSTAL LATTICE — BCC IRON + C',
            system: 'brakes',
            mass: 'a = 0.287 nm',
            summary:
              'The absolute limit of the brake disc: iron atoms in a body-centered cube — one atom at each corner, one in the middle — with carbon atoms jammed into gaps never meant to hold them. That misfit is the entire story of steel and iron.',
            operation: [
              'BCC: less tightly packed than aluminum’s FCC — the center atom props the corners apart. This openness is why iron is stiff but can still be tough.',
              'DARK SMALL ATOMS: carbon, squeezed interstitially into octahedral holes ~40% too small for it. Each one bulges the lattice — a built-in roadblock for dislocations.',
              'Heat the iron past 912°C and the same atoms re-stack as FCC; quench and they trap carbon into martensite. Every heat treatment in this app is choreography of exactly this cube.',
              'THE FLOOR: below this there is only physics — electrons and nuclei. Engineering stops here.',
            ],
            refs: [CALLISTER],
            materials: [
              {
                name: 'BCC UNIT CELL, Fe + INTERSTITIAL C',
                cls: 'The crystal itself',
                composition: [
                  { element: 'Fe atoms', pct: 98.7 },
                  { element: 'C interstitial', pct: 1.3 },
                ],
                process: 'This cube, repeated ~10²³ times, is the brake disc',
                why: 'END OF THE LINE: the god eye closes here.',
                props: [
                  { label: 'CELL EDGE', value: '0.287 nm' },
                  { label: 'ATOMS / CELL', value: '2' },
                  { label: 'PACKING', value: '68%' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]
