/**
 * PistonsReal — all four piston + connecting-rod assemblies, photoreal-feeling
 * procedural geometry at absolute stage coordinates.
 *
 * Stage facts (fixed by the engine layout):
 *  - crank axis along X at y=0.32; bores at x = ±0.375, ±0.125; bore r 0.105
 *  - rod journals: cyls 1&4 at y=0.41, cyls 2&3 at y=0.23 (r 0.04, w 0.07)
 *  - rod c-to-c 0.42 → pin centers at y=0.83 (1&4) and y=0.65 (2&3)
 *  - piston r 0.1, crown top ≤ 0.95, pin axis along Z
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { Bolt, Lathe, PMat, RBox } from '../realism'

/* ------------------------------ cylinder map ------------------------------ */

const ROD_LEN = 0.42

const CYLS: { x: number; pinY: number }[] = [
  { x: -0.375, pinY: 0.83 }, // cyl 1 — near TDC
  { x: -0.125, pinY: 0.65 }, // cyl 2 — mid-stroke
  { x: 0.125, pinY: 0.65 }, // cyl 3 — mid-stroke
  { x: 0.375, pinY: 0.83 }, // cyl 4 — near TDC
]

/* ------------------------- piston lathe profile --------------------------- */
/* Local frame: origin at the wrist-pin center, piston axis = +Y.
 * Bottom→top: open skirt (taper r0.097→r0.1), oil groove (wider), land,
 * 2nd compression groove, land, top compression groove, top land,
 * chamfered edge, flat rim, shallow crown dish.
 * Crown top local y = 0.115 → absolute 0.945 for cyls 1&4 (≤ 0.95). */
const PISTON_PTS: [number, number][] = [
  [0.097, -0.09], // skirt bottom (open)
  [0.0995, -0.03], // skirt taper
  [0.1, 0.03], // skirt → oil-groove bottom land
  [0.092, 0.03], // oil groove in
  [0.092, 0.045],
  [0.1, 0.045], // oil groove out
  [0.1, 0.06], // 2nd land
  [0.092, 0.06], // 2nd groove in
  [0.092, 0.07],
  [0.1, 0.07], // 2nd groove out
  [0.1, 0.085], // land
  [0.092, 0.085], // top groove in
  [0.092, 0.095],
  [0.1, 0.095], // top groove out
  [0.1, 0.112], // top land
  [0.096, 0.115], // crown edge chamfer
  [0.072, 0.115], // flat rim
  [0.035, 0.1105], // dish slope
  [0.0001, 0.11], // dish center
]

/* ------------------------- connecting rod geometry ------------------------ */
/* 2D silhouette in the XY plane (y = rod axis, small end at origin, big end
 * at y=-ROD_LEN), extruded 0.022 along Z with a 0.004 bevel → total ~0.03. */
function buildRodGeometry(): THREE.ExtrudeGeometry {
  const SMALL_R = 0.045
  const BIG_R = 0.07
  const wTop = 0.02 // shank half-width at small end
  const wBot = 0.0275 // shank half-width at big end
  const aS = Math.acos(wTop / SMALL_R)
  const aB = Math.acos(wBot / BIG_R)

  const s = new THREE.Shape()
  s.moveTo(Math.cos(-aS) * SMALL_R, Math.sin(-aS) * SMALL_R)
  // around the small end, over the top
  s.absarc(0, 0, SMALL_R, -aS, Math.PI + aS, false)
  // left shank flank down to the big end
  s.lineTo(-wBot, -ROD_LEN + Math.sin(aB) * BIG_R)
  // around the big end, under the bottom
  s.absarc(0, -ROD_LEN, BIG_R, Math.PI - aB, Math.PI * 2 + aB, false)
  s.closePath() // right shank flank back up

  // eyes (slightly oversize so the bevel's mid-depth shrink stays clear-ish)
  const pinEye = new THREE.Path()
  pinEye.absarc(0, 0, 0.0315, 0, Math.PI * 2, true)
  const journalEye = new THREE.Path()
  journalEye.absarc(0, -ROD_LEN, 0.0445, 0, Math.PI * 2, true)
  s.holes.push(pinEye, journalEye)

  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.022,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2,
    curveSegments: 24,
  })
  g.translate(0, 0, -0.011) // center on z=0
  return g
}

/* ------------------------------- component -------------------------------- */

export function PistonsReal() {
  const rodGeo = useMemo(buildRodGeometry, [])

  return (
    <group>
      {CYLS.map(({ x, pinY }, i) => (
        <group key={i} position={[x, pinY, 0]}>
          {/* ============================ PISTON ============================ */}
          <Lathe pts={PISTON_PTS} seg={40}>
            <PMat m="machAlu" side={THREE.DoubleSide} />
          </Lathe>

          {/* compression rings seated in the top two grooves */}
          {[0.09, 0.065].map((ry) => (
            <mesh key={ry} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.098, 0.004, 8, 40]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* oil control ring — slightly wider */}
          <mesh position={[0, 0.0375, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.0975, 0.005, 8, 40]} />
            <PMat m="polSteel" rough={0.2} />
          </mesh>

          {/* valve pockets — shallow dark discs on the crown */}
          {[-0.038, 0.038].map((vx) => (
            <mesh key={vx} position={[vx, 0.1115, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.007, 24]} />
              <PMat m="blackCast" color="#23262b" rough={0.6} />
            </mesh>
          ))}

          {/* graphite skirt coating — partial shells facing ±X (pin is on Z) */}
          {[Math.PI / 2 - 0.8, -Math.PI / 2 - 0.8].map((th) => (
            <mesh key={th} position={[0, -0.04, 0]}>
              <cylinderGeometry args={[0.1005, 0.0985, 0.09, 16, 1, true, th, 1.6]} />
              <PMat m="blackCast" color="#3a3f45" rough={0.75} metal={0.4} side={THREE.DoubleSide} />
            </mesh>
          ))}

          {/* wrist pin — open tube along Z through the pin bosses */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.14, 24, 1, true]} />
            <PMat m="polSteel" side={THREE.DoubleSide} />
          </mesh>
          {/* circlips at the pin ends */}
          {[-0.0685, 0.0685].map((cz) => (
            <mesh key={cz} position={[0, 0, cz]}>
              <torusGeometry args={[0.0265, 0.0018, 6, 32]} />
              <PMat m="polSteel" rough={0.25} />
            </mesh>
          ))}

          {/* ======================== CONNECTING ROD ======================== */}
          {/* vertical here: small end at the pin (local 0,0), big end wraps the
              journal at local y = -0.42 */}
          <mesh geometry={rodGeo}>
            <PMat m="forged" />
          </mesh>

          {/* I-beam flange plates on the ±z faces of the shank */}
          {[-0.0165, 0.0165].map((fz) => (
            <RBox
              key={fz}
              args={[0.05, 0.29, 0.007]}
              radius={0.0025}
              smoothness={2}
              position={[0, -0.2, fz]}
            >
              <PMat m="forged" />
            </RBox>
          ))}

          {/* bronze bushing hint at the small-end eye, both faces */}
          {[-0.0155, 0.0155].map((bz) => (
            <mesh key={bz} position={[0, 0, bz]}>
              <torusGeometry args={[0.0295, 0.0022, 6, 32]} />
              <PMat m="copper" />
            </mesh>
          ))}

          {/* big end: dark parting-line ring around the eye rim */}
          <mesh position={[0, -ROD_LEN, 0]}>
            <torusGeometry args={[0.0745, 0.0016, 6, 40]} />
            <PMat m="rubber" color="#1d2024" />
          </mesh>

          {/* bearing cap block under the journal, anchoring the rod bolts */}
          <RBox args={[0.046, 0.05, 0.102]} radius={0.01} smoothness={2} position={[0, -0.468, 0]}>
            <PMat m="forged" rough={0.52} />
          </RBox>

          {/* rod bolts — parallel to the rod axis, heads down, up into the cap */}
          {[-0.045, 0.045].map((bz) => (
            <Bolt
              key={bz}
              position={[0, -0.493, bz]}
              rotation={[Math.PI, 0, 0]}
              r={0.008}
              len={0.035}
              m="steel"
            />
          ))}
        </group>
      ))}
    </group>
  )
}
