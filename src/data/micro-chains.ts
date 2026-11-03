/**
 * The "absolute limit" generator — gives every leaf part a deep-zoom chain:
 * MICROSTRUCTURE (×200–×500) → ATOMIC STRUCTURE, selected by material family.
 * Fluids get a single molecular level. Negative-space nodes are skipped.
 */
import type { Part } from './parts'

const CALLISTER =
  'W.D. Callister & D.G. Rethwisch — Materials Science and Engineering: An Introduction (Wiley)'

export interface Family {
  /** micro view kind ('micro:x') — null = no micro level (fluids) */
  micro: string | null
  lat: string
  microName: string
  microSummary: string
  microOps: string[]
  microPhases: { element: string; pct: number }[]
  latName: string
  latSummary: string
  latOps: string[]
  latComp: { element: string; pct: number }[]
  latProps: { label: string; value: string }[]
}

const F = (f: Family) => f

export const FAMILIES: Record<string, Family> = {
  'cast-al': F({
    micro: 'cast-al',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — CAST ALUMINUM ×200',
    microSummary:
      'Inside the casting: pale aluminum dendrites — frozen snowflake arms — with dark silicon needles packed between them where the last liquid solidified.',
    microOps: [
      'DENDRITES: aluminum freezes as branching trees; each cluster grew from one nucleation point until it hit its neighbors.',
      'DARK NEEDLES: eutectic silicon — hard, brittle plates that give the alloy wear resistance and castability but limit ductility.',
      'The finer this structure (faster cooling), the stronger the part — chill plates in the mold are placed exactly where strength is needed.',
    ],
    microPhases: [
      { element: 'α-Al dendrites', pct: 82 },
      { element: 'Eutectic Si', pct: 12 },
      { element: 'Mg₂Si / Fe phases', pct: 5 },
      { element: 'Porosity', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — FCC ALUMINUM',
    latSummary:
      'The absolute limit: aluminum atoms stacked face-centered-cubic, 0.405 nm per cell. Everything this part does is these spheres holding position.',
    latOps: [
      'FCC: an atom at each cube corner plus one on every face — the densest packing equal spheres allow.',
      'Orange atoms: solute (Mg/Cu/Si) dissolved in the lattice — their size misfit strains the crystal and blocks dislocation glide. That IS alloy strength.',
      'Bending metal = dislocations gliding through this lattice. Nothing below this level exists to engineer.',
    ],
    latComp: [
      { element: 'Al', pct: 97 },
      { element: 'Solute atoms', pct: 3 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.405 nm' },
      { label: 'PACKING', value: '74%' },
    ],
  }),
  'forged-al': F({
    micro: 'forgedAl',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — WROUGHT ALUMINUM ×500',
    microSummary:
      'Forged aluminum under the microscope: grains flattened into pancakes by the forging blow, boundaries pinned by hard intermetallic particles.',
    microOps: [
      'GRAINS: flattened and aligned with the metal flow — cracks must zig-zag across thousands of boundaries.',
      'FINER = STRONGER: every boundary blocks dislocation slip (the Hall-Petch law).',
      'DARK PARTICLES: intermetallics that pin boundaries at temperature so the structure cannot coarsen and soften.',
    ],
    microPhases: [
      { element: 'α-Al grains', pct: 88 },
      { element: 'Intermetallics', pct: 8 },
      { element: 'Precipitates', pct: 4 },
    ],
    latName: 'ATOMIC STRUCTURE — FCC ALUMINUM',
    latSummary:
      'The absolute limit: face-centered-cubic aluminum, 0.405 nm per cell, with solute atoms straining the lattice — which is what strength means down here.',
    latOps: [
      'FCC packing: corner + face-center atoms, 74% space-filled.',
      'Solutes (orange) and nano-precipitates snag dislocations as they glide.',
      'Heat treatment is choreography of exactly these atoms: dissolve, quench, re-precipitate.',
    ],
    latComp: [
      { element: 'Al', pct: 96 },
      { element: 'Cu/Mg/Ni solute', pct: 4 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.405 nm' },
      { label: 'ATOMS/CELL', value: '4' },
    ],
  }),
  'steel-hardened': F({
    micro: 'martensite',
    lat: 'bcc',
    microName: 'MICROSTRUCTURE — MARTENSITE ×500',
    microSummary:
      'Hardened steel: sheaves of needle-like martensite laths, formed in milliseconds when the quench trapped carbon inside a crystal trying to change shape.',
    microOps: [
      'LATHS: each packet formed in a single burst — faster than diffusion — when austenite snapped into a carbon-supersaturated structure.',
      'Trapped carbon wedges the lattice: enormous hardness, near-zero ductility — which is why hardened parts are tempered afterward.',
      'Packets at crossing angles stop cracks from running straight through.',
    ],
    microPhases: [
      { element: 'Martensite laths', pct: 90 },
      { element: 'Retained austenite', pct: 6 },
      { element: 'Carbides', pct: 4 },
    ],
    latName: 'ATOMIC STRUCTURE — BCC IRON + C',
    latSummary:
      'The absolute limit: iron atoms in a body-centered cube with carbon jammed into gaps ~40% too small for it. That misfit is the entire story of steel.',
    latOps: [
      'BCC: a corner atom cage with one atom propping the center.',
      'Small dark atoms: interstitial carbon — each one bulges the cell and blocks dislocation glide.',
      'Quenching traps carbon before it can escape; tempering lets just enough out to restore toughness.',
    ],
    latComp: [
      { element: 'Fe', pct: 98.8 },
      { element: 'C interstitial', pct: 1.2 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.287 nm' },
      { label: 'PACKING', value: '68%' },
    ],
  }),
  'steel-mild': F({
    micro: 'pearlite',
    lat: 'bcc',
    microName: 'MICROSTRUCTURE — FERRITE & PEARLITE ×500',
    microSummary:
      'Structural steel: soft ferrite grains and striped pearlite colonies — nature’s own composite, alternating nano-layers of soft iron and hard carbide.',
    microOps: [
      'STRIPES: pearlite — ferrite and cementite layers that grew side-by-side as the steel cooled, a self-assembled laminate.',
      'The soft ferrite yields and work-hardens; the hard cementite plates carry load — strength AND formability from one structure.',
      'More carbon = more pearlite = stronger but less weldable; every steel grade is this dial.',
    ],
    microPhases: [
      { element: 'Ferrite', pct: 62 },
      { element: 'Pearlite colonies', pct: 36 },
      { element: 'Inclusions', pct: 2 },
    ],
    latName: 'ATOMIC STRUCTURE — BCC IRON',
    latSummary:
      'The absolute limit: body-centered-cubic iron, 0.287 nm per cell — the most-produced crystal structure in human history.',
    latOps: [
      'BCC: corner atoms plus a body-center atom — stiff, strong, and magnetic below 770°C.',
      'Carbon atoms (dark) squeeze into interstitial holes, strengthening the lattice.',
      'Heat past 912°C and these same atoms restack as FCC — the transformation every heat treatment exploits.',
    ],
    latComp: [
      { element: 'Fe', pct: 99.5 },
      { element: 'C + Mn', pct: 0.5 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.287 nm' },
      { label: 'ATOMS/CELL', value: '2' },
    ],
  }),
  'gray-iron': F({
    micro: 'grayIron',
    lat: 'bcc',
    microName: 'MICROSTRUCTURE — GRAY IRON ×200',
    microSummary:
      'Gray cast iron: dark graphite flakes threaded through a pearlite matrix. The flakes look like defects — they are the feature.',
    microOps: [
      'FLAKES: pure carbon grown as curved plates while the iron froze — built-in heat pipes and vibration dampers.',
      'Every flake tip is a micro-notch: weak in tension, mighty in compression.',
      'The pearlite matrix between flakes carries the load.',
    ],
    microPhases: [
      { element: 'Pearlite matrix', pct: 84 },
      { element: 'Graphite flakes', pct: 12 },
      { element: 'Ferrite', pct: 4 },
    ],
    latName: 'ATOMIC STRUCTURE — BCC IRON + C',
    latSummary:
      'The absolute limit: body-centered-cubic iron with carbon both dissolved in the gaps and rejected as pure graphite flakes.',
    latOps: [
      'BCC iron cage with interstitial carbon (dark atoms).',
      'Excess carbon that would not fit precipitated as the graphite you saw one level up.',
      'Silicon in the melt is what pushed the carbon out as graphite instead of brittle carbide.',
    ],
    latComp: [
      { element: 'Fe', pct: 96.5 },
      { element: 'C', pct: 3.5 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.287 nm' },
      { label: 'PACKING', value: '68%' },
    ],
  }),
  'ductile-iron': F({
    micro: 'nodular',
    lat: 'bcc',
    microName: 'MICROSTRUCTURE — DUCTILE IRON ×200',
    microSummary:
      'Nodular iron: the same carbon as gray iron, but a trace of magnesium forced it into spheres instead of flakes — and spheres don’t start cracks.',
    microOps: [
      'SPHEROIDS: graphite balls, each ringed by a pale ferrite halo that grew around it.',
      'No flake tips = no built-in notches: this iron bends ~7% before breaking where gray iron snaps at ~0%.',
      'One part per thousand of magnesium in the melt makes the difference.',
    ],
    microPhases: [
      { element: 'Pearlite/ferrite matrix', pct: 86 },
      { element: 'Graphite spheroids', pct: 11 },
      { element: 'Ferrite halos', pct: 3 },
    ],
    latName: 'ATOMIC STRUCTURE — BCC IRON + C',
    latSummary:
      'The absolute limit: body-centered-cubic iron; the magnesium treatment one level up changed only the SHAPE of the rejected carbon, not this lattice.',
    latOps: [
      'BCC iron cage, carbon in the interstitial holes.',
      'Surface energy, altered by magnesium, made the excess carbon ball up instead of flake out.',
      'Same atoms as gray iron — radically different part, purely from microstructure.',
    ],
    latComp: [
      { element: 'Fe', pct: 96.4 },
      { element: 'C', pct: 3.5 },
      { element: 'Mg trace', pct: 0.1 },
    ],
    latProps: [{ label: 'CELL EDGE', value: '0.287 nm' }],
  }),
  stainless: F({
    micro: 'stainless',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — STAINLESS ×500',
    microSummary:
      'Stainless steel: clean equiaxed grains crossed by straight annealing twins — and over every surface, an invisible 2-nanometre chromium-oxide skin that heals itself.',
    microOps: [
      'GRAINS with straight twin bands — the fingerprint of an FCC metal that was annealed.',
      'The stainless part is not in this picture: it is the self-healing Cr₂O₃ film, 10,000× thinner than this field of view.',
      'Scratch the surface and chromium re-oxidizes in milliseconds — the film regrows.',
    ],
    microPhases: [
      { element: 'Austenite/ferrite grains', pct: 95 },
      { element: 'Twins', pct: 4 },
      { element: 'Carbides', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — Fe-Cr LATTICE',
    latSummary:
      'The absolute limit: an iron lattice where roughly one atom in five is chromium — enough that the surface always has chromium ready to oxidize.',
    latOps: [
      'Chromium substitutes directly for iron atoms in the cage.',
      'Above ~11% Cr, the oxide film becomes continuous: that single number defines "stainless".',
      'Nickel additions switch the cage from BCC to FCC — the austenitic grades.',
    ],
    latComp: [
      { element: 'Fe', pct: 78 },
      { element: 'Cr', pct: 17 },
      { element: 'Ni + C', pct: 5 },
    ],
    latProps: [{ label: 'PASSIVE FILM', value: '~2 nm' }],
  }),
  copper: F({
    micro: 'copper',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — COPPER ×200',
    microSummary:
      'Copper: warm equiaxed grains with straight twin bands. Almost nothing else is in the picture — purity IS the engineering, because every foreign atom steals conductivity.',
    microOps: [
      'Electrical copper is 99.9%+ pure: solutes scatter electrons, so alloying is the enemy.',
      'TWINS: straight bands from annealing — soft, ductile metal that can be drawn into hair-thin wire.',
      'Winding wire work-hardens as it bends; annealing resets these grains.',
    ],
    microPhases: [
      { element: 'Cu grains', pct: 99 },
      { element: 'Oxide inclusions', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — FCC COPPER',
    latSummary:
      'The absolute limit: face-centered-cubic copper — and a sea of free electrons drifting through it, which is the current itself.',
    latOps: [
      'One electron per atom roams free: the lattice is a pipe for charge.',
      'Heat = lattice vibration; vibration scatters electrons — why resistance rises with temperature.',
      'Every impurity atom is a pothole in the electron road: purity = conductivity.',
    ],
    latComp: [{ element: 'Cu', pct: 100 }],
    latProps: [
      { label: 'CELL EDGE', value: '0.361 nm' },
      { label: 'FREE e⁻/ATOM', value: '1' },
    ],
  }),
  magnesium: F({
    micro: 'cast-al',
    lat: 'hcp',
    microName: 'MICROSTRUCTURE — DIE-CAST Mg ×200',
    microSummary:
      'Die-cast magnesium: fine dendrites frozen in milliseconds against a steel die — the fastest-solidified structure in the car.',
    microOps: [
      'Die casting quenches the melt so fast the grains have no time to grow: fine structure, decent strength, thin walls.',
      'Interdendritic Mg₁₇Al₁₂ particles strengthen the network.',
      'Magnesium is the lightest structural metal — this structure carries loads at 1.78 g/cm³.',
    ],
    microPhases: [
      { element: 'α-Mg dendrites', pct: 85 },
      { element: 'Mg₁₇Al₁₂', pct: 12 },
      { element: 'Porosity', pct: 3 },
    ],
    latName: 'ATOMIC STRUCTURE — HCP MAGNESIUM',
    latSummary:
      'The absolute limit: hexagonal close packing — layers of atoms stacked like billiard balls, AB-AB-AB. Dense packing, but few directions to slip.',
    latOps: [
      'HCP: hexagonal layers with the next layer nested in the hollows.',
      'Only a few slip planes exist — why magnesium is strong but less formable than aluminum.',
      'Same packing density as FCC (74%) — the difference is only the stacking rhythm.',
    ],
    latComp: [
      { element: 'Mg', pct: 94 },
      { element: 'Al solute', pct: 6 },
    ],
    latProps: [
      { label: 'a / c', value: '0.321 / 0.521 nm' },
      { label: 'STACKING', value: 'AB-AB' },
    ],
  }),
  lead: F({
    micro: 'lead',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — LEAD ALLOY ×100',
    microSummary:
      'Battery lead: huge soft grains — lead recrystallizes at room temperature, so its microstructure slowly anneals itself while the car sits parked.',
    microOps: [
      'Giant grains: lead’s melting point is so low that room temperature is already a "hot working" temperature for it.',
      'Calcium and tin additions stiffen the grid just enough to be handled and cast.',
      'The real action is electrochemical: these grains are merely the scaffolding for the active paste.',
    ],
    microPhases: [
      { element: 'Pb grains', pct: 98 },
      { element: 'Sn/Ca precipitates', pct: 2 },
    ],
    latName: 'ATOMIC STRUCTURE — FCC LEAD',
    latSummary:
      'The absolute limit: face-centered-cubic lead — heavy atoms, weak bonds, which is exactly why it is soft, dense, and electrochemically willing.',
    latOps: [
      'FCC stacking of very heavy atoms: density 11.3 g/cm³.',
      'Weak metallic bonds = low melting point, easy casting, easy recycling (99% of battery lead is recycled).',
      'In acid, these atoms trade electrons reversibly — a battery is this lattice breathing.',
    ],
    latComp: [
      { element: 'Pb', pct: 99 },
      { element: 'Sn/Ca', pct: 1 },
    ],
    latProps: [{ label: 'CELL EDGE', value: '0.495 nm' }],
  }),
  superalloy: F({
    micro: 'superalloy',
    lat: 'fcc',
    microName: 'MICROSTRUCTURE — SUPERALLOY γ/γ′ ×500',
    microSummary:
      'Inconel under the microscope: an ordered army of tiny cuboid γ′ precipitates in a nickel matrix — the structure that gets STRONGER as it gets hotter.',
    microOps: [
      'CUBOIDS: Ni₃(Al,Ti) precipitates, coherently locked to the matrix lattice.',
      'Dislocations must cut through or climb around every cuboid — and the ordered cuboids resist harder at high temperature.',
      'This backwards behavior (strength rising toward 800°C) is why turbines exist.',
    ],
    microPhases: [
      { element: 'γ Ni matrix', pct: 55 },
      { element: 'γ′ cuboids', pct: 42 },
      { element: 'Carbides', pct: 3 },
    ],
    latName: 'ATOMIC STRUCTURE — FCC NICKEL + ORDER',
    latSummary:
      'The absolute limit: FCC nickel, with aluminum atoms taking ORDERED positions — every corner Al, every face Ni — inside the γ′ cuboids.',
    latOps: [
      'The matrix is ordinary FCC nickel solid solution.',
      'Inside γ′, atoms take assigned seats (L1₂ order) — cutting through ordered crystal costs extra energy, at any temperature.',
      'Chromium in the lattice feeds the protective oxide at 950°C.',
    ],
    latComp: [
      { element: 'Ni', pct: 74 },
      { element: 'Cr', pct: 13 },
      { element: 'Al/Ti ordered', pct: 13 },
    ],
    latProps: [{ label: 'ORDER TYPE', value: 'L1₂' }],
  }),
  polymer: F({
    micro: 'polymer',
    lat: 'chain',
    microName: 'MICROSTRUCTURE — SEMICRYSTALLINE POLYMER ×500',
    microSummary:
      'Inside the plastic: spherulites — radial fans of folded chains that crystallized outward from seeds, embedded in amorphous spaghetti.',
    microOps: [
      'SPHERULITES: ordered, crystalline regions — stiffness and chemical resistance live here.',
      'Between them: amorphous tangle — toughness and flexibility live there.',
      'The crystalline/amorphous ratio (set by cooling rate) is the material’s personality dial.',
    ],
    microPhases: [
      { element: 'Crystalline spherulites', pct: 45 },
      { element: 'Amorphous regions', pct: 50 },
      { element: 'Fillers/additives', pct: 5 },
    ],
    latName: 'MOLECULAR STRUCTURE — POLYMER CHAINS',
    latSummary:
      'The absolute limit: carbon backbones thousands of atoms long, zig-zagging at 110° per bond. A polymer part is a bowl of molecular spaghetti holding hands.',
    latOps: [
      'Each chain: C-C bonds at the tetrahedral angle, hydrogens (pale) along the sides.',
      'Strength along a chain is covalent (strong); between chains only van der Waals (weak) — polymers are strong in whatever direction the chains point.',
      'Heat lets chains slide past each other: that is melting, and why thermoplastics can be molded.',
    ],
    latComp: [
      { element: 'C backbone', pct: 40 },
      { element: 'H side atoms', pct: 55 },
      { element: 'N/O groups', pct: 5 },
    ],
    latProps: [
      { label: 'C-C BOND', value: '0.154 nm' },
      { label: 'CHAIN LENGTH', value: '10³–10⁵ units' },
    ],
  }),
  rubber: F({
    micro: 'rubber',
    lat: 'network',
    microName: 'MICROSTRUCTURE — FILLED ELASTOMER ×500',
    microSummary:
      'Inside the rubber: a black-on-black world — nano carbon-black aggregates dispersed through a crosslinked elastomer matrix, each particle gripping dozens of chains.',
    microOps: [
      'CARBON BLACK: fused nano-particle clusters; chains anchor to their surfaces — the reinforcement that turns gum into tire.',
      'The matrix itself is invisible order: coiled chains tied by sulfur crosslinks.',
      'Stretch = chains uncoiling; release = entropy snapping them back. Rubber is thermodynamics you can hold.',
    ],
    microPhases: [
      { element: 'Elastomer matrix', pct: 62 },
      { element: 'Carbon black/silica', pct: 32 },
      { element: 'ZnO + sulfur system', pct: 6 },
    ],
    latName: 'MOLECULAR STRUCTURE — CROSSLINKED NETWORK',
    latSummary:
      'The absolute limit: no crystal at all — coiled chains wander randomly, tied to each other by glowing sulfur bridges. The disorder IS the elasticity.',
    latOps: [
      'Chains take random walks; entropy favors the coiled state.',
      'SULFUR BRIDGES (gold): vulcanization — without them the chains would flow apart like chewing gum.',
      'Crosslink density is the stiffness dial: more bridges = harder rubber.',
    ],
    latComp: [
      { element: 'C-C chains', pct: 92 },
      { element: 'S crosslinks', pct: 3 },
      { element: 'Side groups', pct: 5 },
    ],
    latProps: [
      { label: 'ORDER', value: 'none — amorphous' },
      { label: 'ELASTICITY', value: 'entropy-driven' },
    ],
  }),
  composite: F({
    micro: 'composite',
    lat: 'chain',
    microName: 'MICROSTRUCTURE — FIBER COMPOSITE ×200',
    microSummary:
      'Inside the composite: bright fiber rods in a resin sea. Two materials, each useless alone for this job, splitting the work — fibers carry load, resin holds position.',
    microOps: [
      'FIBERS: glass or aramid, each ~10 µm — carrying tension along their length with ceramic-grade strength.',
      'MATRIX: polymer resin — transfers load between fibers and protects them from scratches that would start fracture.',
      'The interface chemistry (sizing on each fiber) decides whether the pair cooperates or delaminates.',
    ],
    microPhases: [
      { element: 'Reinforcement fibers', pct: 38 },
      { element: 'Polymer matrix', pct: 58 },
      { element: 'Interface sizing', pct: 4 },
    ],
    latName: 'MOLECULAR STRUCTURE — MATRIX CHAINS',
    latSummary:
      'The absolute limit of the matrix: polymer chains — in thermosets, crosslinked into one single molecule the size of the part.',
    latOps: [
      'A cured thermoset is technically ONE molecule: every chain bonded to every neighbor.',
      'That is why thermosets cannot be re-melted — there are no separate chains left to slide.',
      'The fibers inside are a different story: drawn glass (silica network) or aligned aramid chains.',
    ],
    latComp: [
      { element: 'C backbone', pct: 55 },
      { element: 'Crosslinks', pct: 15 },
      { element: 'H/N/O', pct: 30 },
    ],
    latProps: [{ label: 'NETWORK', value: 'one molecule' }],
  }),
  foam: F({
    micro: 'foam',
    lat: 'network',
    microName: 'MICROSTRUCTURE — PU FOAM CELLS ×50',
    microSummary:
      'Inside the foam: open cells — a lattice of polymer struts around bubbles of air. The part is ~95% nothing, and the nothing is the point.',
    microOps: [
      'CELLS: blown by CO₂ generated in the curing chemistry itself; open windows let air flow cell-to-cell.',
      'Comfort physics: compressing the foam pumps air through the windows — a built-in damper.',
      'Strut thickness and cell size set firmness; the polymer itself barely matters at low strain.',
    ],
    microPhases: [
      { element: 'Air (open cells)', pct: 94 },
      { element: 'PU struts', pct: 6 },
    ],
    latName: 'MOLECULAR STRUCTURE — PU NETWORK',
    latSummary:
      'The absolute limit: polyurethane chains — alternating soft and hard segments — lightly crosslinked into an elastic network.',
    latOps: [
      'SOFT SEGMENTS: long flexible polyol chains — the spring.',
      'HARD SEGMENTS: urethane groups hydrogen-bonding into stiff islands — the anchor points.',
      'The soft/hard ratio is the whole recipe: seat foam and skateboard wheels are the same chemistry, different dial.',
    ],
    latComp: [
      { element: 'Polyol soft segments', pct: 65 },
      { element: 'Urethane hard segments', pct: 35 },
    ],
    latProps: [{ label: 'RESILIENCE', value: 'entropy spring' }],
  }),
  ceramic: F({
    micro: 'ceramic',
    lat: 'ionic',
    microName: 'MICROSTRUCTURE — TECHNICAL CERAMIC ×500',
    microSummary:
      'Inside the ceramic: tightly sintered angular grains with almost nothing between them — a structure with no way to bend, which is both its power and its doom.',
    microOps: [
      'GRAINS fused by sintering: powder baked until atoms diffused across the gaps.',
      'No dislocations can glide in these bonds — hence no yielding, no denting: only elastic… then fracture.',
      'Every pore is a stress concentrator: ceramic quality is measured in missing flaws.',
    ],
    microPhases: [
      { element: 'Ceramic grains', pct: 96 },
      { element: 'Grain-boundary glass', pct: 3 },
      { element: 'Pores', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — IONIC LATTICE',
    latSummary:
      'The absolute limit: alternating metal and oxygen ions locked by electrostatic attraction — bonds so strong and directional that the crystal would rather break than bend.',
    latOps: [
      'Big spheres: oxygen ions; small: metal ions — packed by charge balance.',
      'Sliding one plane would force like charges together: the lattice forbids it. No slip = no ductility.',
      'The same rigidity makes it an insulator: electrons are locked to their ions.',
    ],
    latComp: [
      { element: 'O ions', pct: 60 },
      { element: 'Metal ions', pct: 40 },
    ],
    latProps: [
      { label: 'BOND', value: 'ionic/covalent' },
      { label: 'SLIP SYSTEMS', value: '~none' },
    ],
  }),
  glass: F({
    micro: 'glass',
    lat: 'network',
    microName: 'MICROSTRUCTURE — GLASS ×500',
    microSummary:
      'Inside the glass: nothing. No grains, no boundaries, no phases — a frozen liquid. The absence of structure is why you can see through it.',
    microOps: [
      'No grain boundaries exist to scatter light — transparency is the microstructure.',
      'No grains also means no dislocation plasticity: glass cannot dent, only flow (hot) or crack (cold).',
      'Strength is ruled entirely by invisible surface flaws — why tempering pre-compresses the skin.',
    ],
    microPhases: [
      { element: 'Amorphous silica network', pct: 99 },
      { element: 'Bubbles/inclusions', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — SILICA NETWORK',
    latSummary:
      'The absolute limit: silicon-oxygen tetrahedra linked corner to corner in a random network — crystal chemistry without crystal order.',
    latOps: [
      'Each Si bonds 4 oxygens; each oxygen bridges 2 silicons — strong local rules, no long-range order.',
      'Sodium and calcium ions (from soda-lime) break some bridges, lowering the melting point enough to manufacture.',
      'Cooled fast, the liquid’s disorder simply freezes in place: glass is a snapshot of a liquid.',
    ],
    latComp: [
      { element: 'SiO₄ tetrahedra', pct: 75 },
      { element: 'Na/Ca modifiers', pct: 25 },
    ],
    latProps: [{ label: 'ORDER', value: 'short-range only' }],
  }),
  semiconductor: F({
    micro: 'semiconductor',
    lat: 'diamond',
    microName: 'MICROSTRUCTURE — SILICON DIE ×500',
    microSummary:
      'The most perfect solid humans make: a single flawless crystal, mirror-flat, carrying a city of circuits. One grain boundary anywhere would be a defect; there are none.',
    microOps: [
      'SINGLE CRYSTAL: the whole wafer grew from one seed — no grains, no boundaries, 99.9999999% pure.',
      'The faint traces are the circuit: dopant atoms placed by the billion, each one deliberate.',
      'Every other material in this app tolerates defects; this one is defined by their absence.',
    ],
    microPhases: [
      { element: 'Single-crystal Si', pct: 99 },
      { element: 'Doped regions + metal', pct: 1 },
    ],
    latName: 'ATOMIC STRUCTURE — DIAMOND CUBIC Si',
    latSummary:
      'The absolute limit: silicon in the diamond-cubic lattice — every atom covalently bonded to four neighbors in perfect tetrahedra. Electronics is choreography inside this cage.',
    latOps: [
      'Each atom bonds 4 neighbors at 109.5° — the same geometry as diamond.',
      'Swap one atom in a million for phosphorus or boron and the crystal becomes n- or p-type: that substitution IS the transistor.',
      'The bandgap — the energy to free an electron from these bonds — is the number all electronics is built on.',
    ],
    latComp: [
      { element: 'Si', pct: 99.9999 },
      { element: 'Dopants', pct: 0.0001 },
    ],
    latProps: [
      { label: 'CELL EDGE', value: '0.543 nm' },
      { label: 'BONDS/ATOM', value: '4 covalent' },
    ],
  }),
  fluid: F({
    micro: null,
    lat: 'chain',
    microName: '',
    microSummary: '',
    microOps: [],
    microPhases: [],
    latName: 'MOLECULAR VIEW — THE FLUID ITSELF',
    latSummary:
      'The absolute limit of a fluid: free molecules — hydrocarbon chains and small species tumbling past each other with no structure at all. Everything a fluid does is molecules trading places.',
    latOps: [
      'Chains slide freely: that mobility IS viscosity — longer chains, more tangling, thicker fluid.',
      'Heat speeds the tumbling: viscosity falls — why oils are rated at two temperatures.',
      'Additive molecules (friction modifiers, inhibitors) are designed to find surfaces and stick there first.',
    ],
    latComp: [
      { element: 'Base molecules', pct: 85 },
      { element: 'Additive molecules', pct: 15 },
    ],
    latProps: [
      { label: 'ORDER', value: 'none — liquid' },
      { label: 'ACTION', value: 'molecular mobility' },
    ],
  }),
}

/* ------------------------------- classifier -------------------------------- */

type Rule = [string[], string | null]

/** first match wins — scans material name + class strings only */
const RULES: Rule[] = [
  [['negative space'], null],
  [['5w-30', 'glycol', 'borate', 'working fluid', 'ester oil', 'synthetic 5w'], 'fluid'],
  [['inconel', 'superalloy'], 'superalloy'],
  [['semiconductor', 'iii-v', 'mems', 'silicon sensor', 'gan-on', '40 nm'], 'semiconductor'],
  [
    ['rubber', 'epdm', 'nbr', 'silicone', 'elastomer', 'sbr', 'vmq', 'butyl', 'tread'],
    'rubber',
  ],
  [['foam', 'open-cell'], 'foam'],
  [['magnesium', 'am60'], 'magnesium'],
  [['lead-calcium', 'lead-antimony', 'lead alloy', 'pb-ca', 'pb-sb'], 'lead'],
  [
    ['ceramic', 'alumina', 'cordierite', 'garnet', 'porcelain', 'washcoat', 'aln', 'yag'],
    'ceramic',
  ],
  [['soda-lime', 'float glass', 'borosilicate', 'glass mat', 'microfiber'], 'glass'],
  [
    [
      'glass fiber',
      'glass fabric',
      'glass-filled',
      'friction',
      'laminate',
      'cord',
      'e-glass',
      'aramid',
      'cellulose',
      'glass epoxy',
      'gf3',
      'gf4',
      'roving',
      'filter media',
    ],
    'composite',
  ],
  [
    [
      'nylon',
      'polyamide',
      'pa66',
      'hdpe',
      'polypropylene',
      'pp-',
      'pp copolymer',
      'pbt',
      'pom',
      'acetal',
      'polycarbonate',
      'pps',
      'polymer',
      'evoh',
      'epoxy',
      'resin',
      'xlpe',
      'polyester',
      'tpo',
      'e-coat',
      'clearcoat',
      'acrylic',
      'thermoplastic',
      'pvb',
      'pet cord',
    ],
    'polymer',
  ],
  [
    ['stainless', '301', 'ss409', 'ss304', '17% cr', '21-4n', 'valve steel', '430f', 'mls'],
    'stainless',
  ],
  [['ductile', 'nodular', 'spheroid', 'simo', 'gjs'], 'ductile-iron'],
  [['gray cast iron', 'flake-graphite', 'gg25', 'g3000', 'gray iron', 'chilled cast iron', 'flake iron', 'high-carbon iron'], 'gray-iron'],
  [
    ['copper', 'brass', 'bronze', 'cusn', 'cuzn', 'windings', 'magnet wire', 'cu stator', 'cu-wound', 'c93200', 'phosphor bronze'],
    'copper',
  ],
  [['2618', 'forged aluminum', '7075', 'billet', 'forging alloy', 'aerospace alu'], 'forged-al'],
  [
    [
      'case-harden',
      'carburiz',
      'nitrided',
      'bearing steel',
      '100cr6',
      'spring steel',
      '54sicr',
      'boron steel',
      '22mnb5',
      '34mnb5',
      'class 10.9',
      'class 12.9',
      'arp',
      'martensit',
      'induction-harden',
      '42crmo4',
      '8620',
      '20mncr5',
      '16mncr5',
      'hot-stamped',
      'high-carbon steel',
      'hard chrome',
      'q&t',
      'quenched',
      'cr-si',
      'chromium-moly',
      'gear steel',
      'carburizing',
      'press-harden',
      'high-tensile wire',
    ],
    'steel-hardened',
  ],
  [
    ['aluminum', 'a356', 'adc12', 'a380', 'aa30', 'aa60', 'al-si', 'brazed', 'aluminium', 'al matrix', 'alsn', 'al-mg'],
    'cast-al',
  ],
  [
    ['steel', 'iron', 'dc04', 'e355', 'hc340', 'dom', 'dual-phase', 'ahss', 'micro-alloy', 'sintered', 'powder metal'],
    'steel-mild',
  ],
]

export function classifyFamily(part: Part): string | null {
  const text = part.materials
    .map((m) => `${m.name} ${m.cls}`)
    .join(' ')
    .toLowerCase()
  for (const [keys, fam] of RULES) {
    if (keys.some((k) => text.includes(k))) return fam
  }
  return null
}

/* -------------------------------- generator -------------------------------- */

let seq = 0

export function makeChain(leaf: Part): Part[] | null {
  const famName = classifyFamily(leaf)
  if (!famName) return null
  const fam = FAMILIES[famName]
  if (!fam) return null
  seq++

  const latNode: Part = {
    id: `${leaf.id}~lat`,
    code: `LAT-${String(seq).padStart(2, '0')}`,
    name: fam.latName,
    system: leaf.system,
    mass: 'atomic scale',
    summary: fam.latSummary,
    operation: fam.latOps,
    refs: [CALLISTER],
    viewKind: `lat:${fam.lat}`,
    materials: [
      {
        name: 'WHAT YOU ARE LOOKING AT',
        cls: 'The structure itself · end of the zoom',
        composition: fam.latComp,
        process: 'Nothing is manufactured here — every process upstream was arranging exactly this',
        why: 'END OF THE LINE: the god eye closes here.',
        props: fam.latProps,
      },
    ],
  }

  if (!fam.micro) {
    // fluids: single molecular level
    return [latNode]
  }

  const microNode: Part = {
    id: `${leaf.id}~mic`,
    code: `MIC-${String(seq).padStart(2, '0')}`,
    name: fam.microName,
    system: leaf.system,
    mass: 'microscope field',
    summary: fam.microSummary,
    operation: fam.microOps,
    refs: [CALLISTER],
    viewKind: `micro:${fam.micro}`,
    materials: [
      {
        name: 'PHASE MAP',
        cls: 'What each feature in the sample is',
        composition: fam.microPhases,
        process: 'Sample cut from the part, polished to a mirror, etched so the structure stands out',
        why: 'Dismantle once more to reach the atoms themselves — the final level.',
        props: [{ label: 'NEXT LEVEL', value: 'atomic' }],
      },
    ],
    children: [latNode],
  }

  return [microNode]
}
