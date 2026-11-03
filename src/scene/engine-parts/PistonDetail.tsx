/**
 * PistonDetail — photoreal-feeling procedural geometry for the single-piston
 * blow-up view (CrownReal, PistonRingPackReal, PinReal, RodReal,
 * RodBearingsReal) and the giant ring-pack view (TopRingXL, SecondRingXL,
 * OilRingXL).
 *
 * All coordinates are absolute stage coordinates copied from the crude
 * PistonView / RingsView layouts in assemblies-powertrain.tsx:
 *  - piston axis vertical at x=z=0, crown centered ~(0, 1.0, 0), outer r 0.32
 *  - ring grooves at y 1.19 / 1.13 / 1.06, seated rings r ≈ 0.335
 *  - wrist pin along Z at (0, 0.9, 0); big end / journal at (0, 0.18, 0)
 *  - XL rings r 0.55 at y 1.15 / 0.75 / 0.4 (ghost bore r 0.66 lives in the view)
 *
 * Plain <group> geometry only — no PartGroup, no pointer events, no useFrame,
 * no textures. Every visible surface uses <PMat/>.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { Bolt, Lathe, PMat, RBox } from '../realism'

/* ------------------------- crown + ring-belt lathe ------------------------- */
/* One revolve, bottom→top. Three grooves genuinely cut as radius steps
 * (land 0.32 → floor 0.295). The lowest (oil) groove is taller (0.035 vs
 * 0.025). Crown: top land → chamfer → flat rim → shallow dish. */
const CROWN_PTS: [number, number][] = [
  [0.14, 1.02], // underside annulus (inner)
  [0.316, 1.02], // bottom face out
  [0.32, 1.034], // lower land
  [0.32, 1.043],
  [0.295, 1.043], // oil groove floor (taller groove)
  [0.295, 1.078],
  [0.32, 1.078],
  [0.32, 1.1175], // land 2
  [0.295, 1.1175], // 2nd compression groove
  [0.295, 1.1425],
  [0.32, 1.1425],
  [0.32, 1.1775], // land 1
  [0.295, 1.1775], // top compression groove
  [0.295, 1.2025],
  [0.32, 1.2025],
  [0.32, 1.236], // top land
  [0.306, 1.252], // chamfered crown edge
  [0.235, 1.252], // flat rim
  [0.12, 1.238], // dish slope
  [0.0001, 1.234], // shallow dish center
]

/* ring end-gap clocking — each gap 120° from the last */
const GAP0 = 0.3
const GAP1 = GAP0 + (Math.PI * 2) / 3
const GAP2 = GAP0 + (Math.PI * 4) / 3

/* ============================= PISTON VIEW ================================ */

/** Piston crown + ring belt + cut-away skirt exposing the pin bosses. */
export function CrownReal() {
  return (
    <group>
      {/* crown + ring belt — one lathe, grooves cut into the profile */}
      <Lathe pts={CROWN_PTS} seg={44}>
        <PMat m="machAlu" side={THREE.DoubleSide} />
      </Lathe>

      {/* anodized hint — thin dark ring above the top groove */}
      <mesh position={[0, 1.219, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3205, 0.0045, 6, 44]} />
        <PMat m="blackCast" color="#262b31" rough={0.5} metal={0.6} />
      </mesh>

      {/* two tiny oil drain holes below the oil-ring groove */}
      {[0.55, Math.PI + 0.55].map((a) => (
        <mesh key={a} position={[Math.cos(a) * 0.3165, 1.031, Math.sin(a) * 0.3165]}>
          <sphereGeometry args={[0.008, 8, 6]} />
          <PMat m="blackCast" color="#14171b" rough={0.8} metal={0.2} />
        </mesh>
      ))}

      {/* skirt — two partial shells facing ±X (cut away on ±Z), graphite-dark,
          tapering in with a rolled-in bottom edge */}
      {[Math.PI / 2 - 0.95, -Math.PI / 2 - 0.95].map((th) => (
        <group key={th}>
          <mesh position={[0, 0.89, 0]}>
            <cylinderGeometry args={[0.318, 0.308, 0.26, 28, 1, true, th, 1.9]} />
            <PMat m="blackCast" color="#3b4046" rough={0.72} metal={0.45} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.745, 0]}>
            <cylinderGeometry args={[0.308, 0.296, 0.03, 28, 1, true, th, 1.9]} />
            <PMat m="blackCast" color="#3b4046" rough={0.72} metal={0.45} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* pin bosses — short thick open tubes along Z, visible through the
          skirt cut-outs, each braced to the crown underside by two gussets */}
      {[-0.165, 0.165].map((z) => (
        <group key={z} position={[0, 0.9, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 24, 1, true]} />
            <PMat m="machAlu" side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.124, 24, 1, true]} />
            <PMat m="machAlu" color="#aab2bc" rough={0.3} side={THREE.DoubleSide} />
          </mesh>
          {[-0.062, 0.062].map((fz) => (
            <mesh key={fz} position={[0, 0, fz]}>
              <ringGeometry args={[0.085, 0.1, 24]} />
              <PMat m="machAlu" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {[-0.055, 0.055].map((gx) => (
            <RBox
              key={gx}
              args={[0.026, 0.13, 0.1]}
              radius={0.004}
              smoothness={1}
              position={[gx, 0.085, 0]}
            >
              <PMat m="machAlu" rough={0.35} />
            </RBox>
          ))}
        </group>
      ))}
    </group>
  )
}

/** The three rings seated at groove height, gaps clocked 120° apart. */
export function PistonRingPackReal() {
  return (
    <group>
      {/* top ring — barrel face, faint CrN gray, visible end gap */}
      <mesh position={[0, 1.19, 0]} rotation={[Math.PI / 2, 0, GAP0]}>
        <torusGeometry args={[0.335, 0.016, 10, 44, 6.1]} />
        <PMat m="polSteel" color="#cfd6de" />
      </mesh>

      {/* second ring — taper face + thin Napier lip below its lower edge */}
      <mesh position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, GAP1]}>
        <torusGeometry args={[0.335, 0.013, 10, 44, 6.1]} />
        <PMat m="steel" color="#8c96a4" rough={0.3} />
      </mesh>
      <mesh position={[0, 1.114, 0]} rotation={[Math.PI / 2, 0, GAP1]}>
        <torusGeometry args={[0.339, 0.0045, 6, 44, 6.1]} />
        <PMat m="steel" color="#7d8894" rough={0.3} />
      </mesh>

      {/* oil ring — two bright rails + corrugated expander between them */}
      {[1.074, 1.046].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, GAP2 + i * 0.55]}>
          <torusGeometry args={[0.335, 0.006, 8, 44, 6.15]} />
          <PMat m="polSteel" color="#e3e8ee" rough={0.1} />
        </mesh>
      ))}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r = i % 2 ? 0.342 : 0.329
        return (
          <RBox
            key={i}
            args={[0.012, 0.02, 0.042]}
            radius={0.003}
            smoothness={1}
            position={[Math.cos(a) * r, 1.06, Math.sin(a) * r]}
            rotation={[0, -a, 0]}
          >
            <PMat m="steel" color="#99a2ad" rough={0.35} />
          </RBox>
        )
      })}
    </group>
  )
}

/** Wrist pin — open tube along Z with chamfered bore ends + two circlips. */
export function PinReal() {
  return (
    <group position={[0, 0.9, 0]}>
      {/* outer ground surface + bore wall */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.5, 28, 1, true]} />
        <PMat m="polSteel" side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.064, 0.064, 0.464, 28, 1, true]} />
        <PMat m="polSteel" color="#b9bfc7" rough={0.25} side={THREE.DoubleSide} />
      </mesh>
      {/* chamfered bore ends (cone rings) + flat end-face annuli */}
      <mesh position={[0, 0, 0.241]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.078, 0.064, 0.018, 28, 1, true]} />
        <PMat m="polSteel" rough={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.241]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.064, 0.078, 0.018, 28, 1, true]} />
        <PMat m="polSteel" rough={0.18} side={THREE.DoubleSide} />
      </mesh>
      {[-0.25, 0.25].map((z) => (
        <mesh key={z} position={[0, 0, z]}>
          <ringGeometry args={[0.078, 0.085, 28]} />
          <PMat m="polSteel" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* circlips — open arcs with two tiny ear knobs at the gap */}
      {[
        { z: 0.235, clock: 0.9 },
        { z: -0.235, clock: 3.6 },
      ].map(({ z, clock }) => (
        <group key={z} position={[0, 0, z]} rotation={[0, 0, clock]}>
          <mesh>
            <torusGeometry args={[0.071, 0.0045, 8, 36, 5.2]} />
            <PMat m="polSteel" rough={0.22} />
          </mesh>
          {[0, 5.2].map((a) => (
            <mesh key={a} position={[Math.cos(a) * 0.062, Math.sin(a) * 0.062, 0]}>
              <sphereGeometry args={[0.008, 8, 6]} />
              <PMat m="polSteel" rough={0.22} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/* ------------------------- connecting-rod silhouette ----------------------- */
/* 2D shape in the XY plane at absolute coords: small-end eye r 0.11 at
 * (0, 0.9), big-end eye r 0.16 at (0, 0.18), shank half-width 0.05 → 0.0375,
 * extruded 0.055 along Z, centered. */
function buildRodXLGeometry(): THREE.ExtrudeGeometry {
  const SY = 0.9
  const BY = 0.18
  const SR = 0.11
  const BR = 0.16
  const wTop = 0.05
  const wBot = 0.0375
  const aS = Math.acos(wTop / SR)
  const aB = Math.acos(wBot / BR)

  const s = new THREE.Shape()
  s.moveTo(Math.cos(-aS) * SR, SY + Math.sin(-aS) * SR)
  // around the small end, over the top
  s.absarc(0, SY, SR, -aS, Math.PI + aS, false)
  // left shank flank down to the big end
  s.lineTo(-wBot, BY + Math.sin(aB) * BR)
  // around the big end, under the bottom
  s.absarc(0, BY, BR, Math.PI - aB, Math.PI * 2 + aB, false)
  s.closePath() // right shank flank back up

  const pinEye = new THREE.Path()
  pinEye.absarc(0, SY, 0.088, 0, Math.PI * 2, true)
  const journalEye = new THREE.Path()
  journalEye.absarc(0, BY, 0.127, 0, Math.PI * 2, true)
  s.holes.push(pinEye, journalEye)

  const g = new THREE.ExtrudeGeometry(s, {
    depth: 0.055,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 24,
  })
  g.translate(0, 0, -0.0275) // center on z=0
  return g
}

/** Connecting rod hanging below the pin — fracture-split big end + cap. */
export function RodReal() {
  const rodGeo = useMemo(buildRodXLGeometry, [])
  return (
    <group>
      {/* forged I-beam silhouette */}
      <mesh geometry={rodGeo}>
        <PMat m="forged" />
      </mesh>

      {/* small-end eye around the pin + copper bushing + oil hole on top */}
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.11, 0.042, 12, 36]} />
        <PMat m="forged" rough={0.42} />
      </mesh>
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0905, 0.0905, 0.064, 28, 1, true]} />
        <PMat m="copper" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.051, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.006, 14]} />
        <PMat m="blackCast" color="#15181b" rough={0.8} metal={0.2} />
      </mesh>

      {/* I-beam flange plates on the ±z faces */}
      {[-0.0345, 0.0345].map((z) => (
        <RBox
          key={z}
          args={[0.125, 0.44, 0.012]}
          radius={0.004}
          smoothness={2}
          position={[0, 0.565, z]}
        >
          <PMat m="forged" />
        </RBox>
      ))}
      {/* machined flank highlights — lighter strips down the shank center */}
      {[-0.043, 0.043].map((z) => (
        <RBox
          key={z}
          args={[0.03, 0.4, 0.005]}
          radius={0.002}
          smoothness={1}
          position={[0, 0.565, z]}
        >
          <PMat m="steel" color="#cdd3da" rough={0.2} />
        </RBox>
      ))}

      {/* big-end ring */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[0.16, 0.045, 12, 40]} />
        <PMat m="forged" rough={0.46} />
      </mesh>

      {/* fracture-split parting line — 8 small angled dark chips at the
          cap joint on both sides of the eye */}
      {[-0.2, 0.2].map((x) =>
        Array.from({ length: 4 }, (_, k) => (
          <mesh
            key={`${x}:${k}`}
            position={[x, 0.18 + (k % 2 ? 0.005 : -0.005), -0.033 + k * 0.022]}
            rotation={[k % 2 ? 0.6 : -0.6, 0, 0]}
          >
            <boxGeometry args={[0.008, 0.009, 0.026]} />
            <PMat m="blackCast" color="#1d2126" rough={0.85} metal={0.3} />
          </mesh>
        )),
      )}

      {/* bearing cap below + two 12-point rod bolts pointing up (axis vertical,
          parallel to the rod) */}
      <RBox args={[0.32, 0.07, 0.072]} radius={0.012} smoothness={2} position={[0, 0.045, 0]}>
        <PMat m="forged" rough={0.52} />
      </RBox>
      {[-0.145, 0.145].map((x) => (
        <group key={x}>
          <Bolt position={[x, 0.012, 0]} rotation={[Math.PI, 0, 0]} r={0.013} len={0.13} m="steel" />
          {/* extra hex rotated 30° under the head → 12-point read */}
          <mesh position={[x, -0.004, 0]} rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[0.0208, 0.0208, 0.009, 6]} />
            <PMat m="steel" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Rod-bearing half shells around the implied r 0.125 journal along Z. */
export function RodBearingsReal() {
  return (
    <group position={[0, 0.18, 0]}>
      {[
        { start: Math.PI / 2, tangX: 0.135, tangY: 0.004, hole: true }, // upper
        { start: -Math.PI / 2, tangX: -0.135, tangY: -0.004, hole: false }, // lower
      ].map(({ start, tangX, tangY, hole }) => (
        <group key={start}>
          {/* steel back */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.132, 0.132, 0.09, 28, 1, true, start, Math.PI]} />
            <PMat m="steel" side={THREE.DoubleSide} />
          </mesh>
          {/* bright bearing lining, inset so the two-layer edge reads */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
              args={[0.125, 0.125, 0.08, 28, 1, true, start + 0.07, Math.PI - 0.14]}
            />
            <PMat m="polSteel" color="#dfe3e9" rough={0.18} side={THREE.DoubleSide} />
          </mesh>
          {/* locating tang on the parting edge */}
          <RBox
            args={[0.014, 0.006, 0.018]}
            radius={0.002}
            smoothness={1}
            position={[tangX, tangY, 0.04]}
          >
            <PMat m="steel" />
          </RBox>
          {/* oil hole in the upper shell */}
          {hole && (
            <mesh position={[0, 0.1325, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.004, 14]} />
              <PMat m="blackCast" color="#15181b" rough={0.8} metal={0.2} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

/* ============================= RING PACK VIEW ============================= */

/** Barrel-faced top compression ring, r 0.55, with flat-faced end gap. */
export function TopRingXL() {
  return (
    <group position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0.25]}>
      {/* darker flanks body */}
      <mesh>
        <torusGeometry args={[0.55, 0.035, 14, 56, 6.05]} />
        <PMat m="steel" color="#848e99" rough={0.3} />
      </mesh>
      {/* PVD-gray running face — slightly larger thin torus */}
      <mesh>
        <torusGeometry args={[0.5565, 0.0185, 10, 56, 6.05]} />
        <PMat m="polSteel" color="#ccd3da" rough={0.14} />
      </mesh>
      {/* flat gap faces capping the two ends */}
      {[0, 6.05].map((a) => (
        <group key={a} rotation={[0, 0, a]}>
          <mesh position={[0.55, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.034, 18]} />
            <PMat m="steel" color="#b9c1ca" rough={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Taper-face second ring with a protruding Napier hook lip, gap re-clocked. */
export function SecondRingXL() {
  return (
    <group position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 2.2]}>
      <mesh>
        <torusGeometry args={[0.55, 0.03, 12, 56, 6.05]} />
        <PMat m="steel" color="#78828f" rough={0.32} />
      </mesh>
      {/* Napier hook lip — offset down (local +Z = world −Y) and out */}
      <mesh position={[0, 0, 0.03]}>
        <torusGeometry args={[0.558, 0.008, 8, 56, 6.05]} />
        <PMat m="steel" color="#6b7582" rough={0.3} />
      </mesh>
    </group>
  )
}

/** Three-piece oil control ring: two bright rails + corrugated expander. */
export function OilRingXL() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* rails, gaps clocked apart */}
      {[
        { y: 0.028, clock: 4.2 },
        { y: -0.028, clock: 1.1 },
      ].map(({ y, clock }) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, clock]}>
          <torusGeometry args={[0.55, 0.012, 10, 56, 6.1]} />
          <PMat m="polSteel" color="#dde3ea" rough={0.1} />
        </mesh>
      ))}
      {/* corrugated expander — segments alternating radius form a wavy ring */}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2
        const r = i % 2 ? 0.555 : 0.535
        return (
          <RBox
            key={i}
            args={[0.016, 0.036, 0.05]}
            radius={0.004}
            smoothness={1}
            position={[Math.cos(a) * r, 0, Math.sin(a) * r]}
            rotation={[0, -a, 0]}
          >
            <PMat m="steel" color="#8e97a3" rough={0.35} />
          </RBox>
        )
      })}
    </group>
  )
}
