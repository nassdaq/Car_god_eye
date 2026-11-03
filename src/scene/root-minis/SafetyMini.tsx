/**
 * SafetyMini.tsx — compact REAL miniature of the SRS restraints system at car
 * coordinates for the root view. The driver airbag pad already exists
 * visually on the steering wheel (RunningGear SteeringMini), so this mini
 * adds:
 *
 *   - SRS control unit: small finned box on the tunnel at (0.15, 0.33, 0)
 *   - two belt retractors at the B-pillar bases (−0.62, 0.55, ±0.62), webbing
 *     ribbons up to the D-ring points (−0.75, 1.05, ±0.58) and down across
 *     the seats to buckle stubs by the tunnel
 *   - passenger airbag slab inside the dash at (0.55, 0.72, −0.3)
 *
 * One PartGroup id="safety", explode [0, 1.2, 0.4]. Everything stays under
 * the roof line. Every material is <PMat/>; segments ≤ 16; no textures,
 * no useFrame. Budget ≈ 4k triangles.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { PMat, RBox } from '../realism'

type V3 = [number, number, number]

const WEBBING = '#23262c'
const YUP = new THREE.Vector3(0, 1, 0)

/** thin flat webbing ribbon between two points */
function MiniRibbon({ from, to, w = 0.048 }: { from: V3; to: V3; w?: number }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    const len = d.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(YUP, d.normalize())
    return { pos: a.add(b).multiplyScalar(0.5), quat, len }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <RBox args={[w, len, 0.006]} radius={0.002} smoothness={1} position={pos} quaternion={quat}>
      <PMat color={WEBBING} metal={0.05} rough={0.9} e={0.05} />
    </RBox>
  )
}

/** one belt station: retractor at the B-pillar base, webbing up and across */
function BeltStation({ s }: { s: 1 | -1 }) {
  const z = s * 0.62
  return (
    <group>
      {/* retractor: frame box + webbing-wrapped spool + pretensioner tube */}
      <RBox args={[0.09, 0.15, 0.07]} radius={0.01} smoothness={1} position={[-0.62, 0.55, z]}>
        <PMat m="steel" color="#5a626d" rough={0.5} />
      </RBox>
      <mesh position={[-0.62, 0.59, z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.055, 12]} />
        <PMat color={WEBBING} metal={0.05} rough={0.9} e={0.05} />
      </mesh>
      <mesh position={[-0.675, 0.52, z - s * 0.01]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.012, 0.012, 0.12, 8]} />
        <PMat m="steel" color="#7d858f" rough={0.4} />
      </mesh>
      {/* webbing up the pillar to the D-ring */}
      <MiniRibbon from={[-0.64, 0.62, z]} to={[-0.75, 1.05, s * 0.58]} />
      {/* D-ring loop at the top anchor */}
      <mesh position={[-0.75, 1.05, s * 0.58]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.028, 0.008, 6, 14]} />
        <PMat m="blackCast" color="#2d3138" />
      </mesh>
      {/* webbing down across the seat to the buckle */}
      <MiniRibbon from={[-0.74, 1.02, s * 0.56]} to={[-0.38, 0.47, s * 0.26]} />
      {/* buckle stub + stalk beside the tunnel */}
      <RBox args={[0.035, 0.06, 0.028]} radius={0.007} smoothness={1} position={[-0.38, 0.45, s * 0.25]}>
        <PMat color="#1f2329" metal={0.15} rough={0.7} e={0.05} />
      </RBox>
      <mesh position={[-0.38, 0.4, s * 0.24]} rotation={[0.25 * s, 0, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.07, 6]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
    </group>
  )
}

export function SafetyMini() {
  return (
    <PartGroup id="safety" explode={[0, 1.2, 0.4]}>
      {/* SRS control unit on the tunnel: alloy box, connector, forward arrow */}
      <group position={[0.15, 0.33, 0]}>
        <RBox args={[0.14, 0.05, 0.1]} radius={0.01} smoothness={1}>
          <PMat m="castAlu" />
        </RBox>
        <RBox args={[0.03, 0.035, 0.075]} radius={0.006} smoothness={1} position={[-0.08, -0.002, 0]}>
          <PMat color="#262b33" metal={0.2} rough={0.7} e={0.05} />
        </RBox>
        <mesh position={[0.035, 0.028, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.013, 0.03, 3]} />
          <PMat color="#d9dde3" metal={0.6} rough={0.35} e={0.15} />
        </mesh>
      </group>

      {/* belt stations at both B-pillar bases */}
      <BeltStation s={1} />
      <BeltStation s={-1} />

      {/* passenger airbag slab hidden inside the dash, tear seam up */}
      <group position={[0.55, 0.72, -0.3]} rotation={[0, 0, -0.12]}>
        <RBox args={[0.3, 0.09, 0.15]} radius={0.018} smoothness={1}>
          <PMat color="#2b2e35" metal={0.1} rough={0.78} e={0.05} />
        </RBox>
        {/* molded tear seam on the top face */}
        <mesh position={[0, 0.047, 0]}>
          <boxGeometry args={[0.26, 0.003, 0.012]} />
          <PMat color="#4a4f58" metal={0.05} rough={0.85} e={0.08} />
        </mesh>
        {/* inflator can slung underneath */}
        <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
      </group>
    </PartGroup>
  )
}
