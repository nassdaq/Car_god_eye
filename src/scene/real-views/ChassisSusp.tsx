/**
 * ChassisSusp.tsx — photoreal upgrades for the Chassis / Suspension / Damper
 * teardown stages. Drop-in replacements for ChassisView / SuspensionView /
 * DamperView in assemblies-rest.tsx.
 *
 * Contract: PartGroup IDs + explode vectors match the schematic views exactly
 * (chs-cell, chs-rails [perChild], chs-floor, chs-joints / sus-spring,
 * sus-damper, sus-arms, sus-balljoint, sus-arb / dmp-rod, dmp-pistonvalve,
 * dmp-oil, dmp-seals). Every surface uses <PMat/>; heavy geometry is memoized.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { Ghost, PartGroup, useSpringGeo } from '../lib'
import { Bolt, Lathe, PMat, RBox, Ribs, Tube } from '../realism'

const BORON = '#b84a4a'
const CHS = '#8ea2c6'
const SUS = '#b388ff'
const ARB_PINK = '#d4768f'
const ADHESIVE = '#ffd27a'

type V2 = [number, number]
type V3 = [number, number, number]

/* ------------------------------ small helpers ----------------------------- */

/** Straight cylinder between two points (PMat-friendly Pipe). */
function Strut({
  from,
  to,
  r = 0.014,
  seg = 14,
  children,
}: {
  from: V3
  to: V3
  r?: number
  seg?: number
  children: ReactNode
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    const len = d.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      d.normalize(),
    )
    return { pos: a.add(b).multiplyScalar(0.5), quat, len }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, seg]} />
      {children}
    </mesh>
  )
}

/* =============================== CHASSIS ================================= */

/**
 * Cut end of a boron member: nested two-layer section — bright outer-panel
 * edge, inner-panel edge behind it, dark hollow core + internal web hints.
 * Cut face normal along ±X (dir).
 */
function CutEnd({
  position,
  dir,
  w,
  h,
}: {
  position: V3
  dir: 1 | -1
  w: number
  h: number
}) {
  return (
    <group position={position}>
      {/* outer panel edge (bare steel, slightly proud of the section) */}
      <RBox args={[0.01, h + 0.012, w + 0.012]} radius={0.004} smoothness={2} position={[dir * 0.004, 0, 0]}>
        <PMat m="machAlu" color="#dcc6c6" e={0.05} />
      </RBox>
      {/* inner panel edge */}
      <RBox args={[0.008, h * 0.82, w * 0.82]} radius={0.003} smoothness={2} position={[dir * 0.01, 0, 0]}>
        <PMat m="steel" color="#caa0a0" e={0.04} />
      </RBox>
      {/* dark hollow core */}
      <RBox args={[0.006, h * 0.62, w * 0.62]} radius={0.003} smoothness={2} position={[dir * 0.015, 0, 0]}>
        <PMat m="iron" color="#191114" e={0} rough={0.92} />
      </RBox>
      {/* internal web hints (vertical + horizontal) */}
      <RBox args={[0.004, h * 0.58, 0.011]} radius={0.001} smoothness={1} position={[dir * 0.019, 0, 0]}>
        <PMat m="steel" color="#b98f8f" e={0.04} />
      </RBox>
      <RBox args={[0.004, 0.011, w * 0.58]} radius={0.001} smoothness={1} position={[dir * 0.019, 0, 0]}>
        <PMat m="steel" color="#b98f8f" e={0.04} />
      </RBox>
    </group>
  )
}

/** One side's pair of crush rails: multi-cell end face, pre-fold rings, tow boss. */
function RailPair({ s }: { s: 1 | -1 }) {
  return (
    <group>
      {[-0.35, 0.35].map((z) => (
        <group key={z}>
          {/* extruded aluminum rail body */}
          <RBox args={[0.9, 0.13, 0.11]} radius={0.014} smoothness={2} position={[s * 1.25, 0.42, z]}>
            <PMat m="steel" color={CHS} rough={0.4} />
          </RBox>
          {/* accordion pre-fold bulge rings */}
          {[1.33, 1.46, 1.59].map((x) => (
            <RBox key={x} args={[0.028, 0.142, 0.122]} radius={0.013} smoothness={2} position={[s * x, 0.42, z]}>
              <PMat m="steel" color="#a4b6d6" rough={0.38} />
            </RBox>
          ))}
          {/* machined end face */}
          <RBox args={[0.01, 0.135, 0.115]} radius={0.005} smoothness={2} position={[s * 1.705, 0.42, z]}>
            <PMat m="machAlu" />
          </RBox>
          {/* 3×2 multi-cell extrusion holes */}
          {[-0.028, 0.028].map((dy) =>
            [-0.034, 0, 0.034].map((dz) => (
              <RBox
                key={`${dy}${dz}`}
                args={[0.006, 0.042, 0.025]}
                radius={0.002}
                smoothness={1}
                position={[s * 1.712, 0.42 + dy, z + dz]}
              >
                <PMat m="iron" color="#15181d" e={0} rough={0.9} />
              </RBox>
            )),
          )}
        </group>
      ))}
      {/* tow hook thread boss on the +z rail end */}
      <group position={[s * 1.726, 0.42, 0.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.033, 0.045, 24]} />
          <PMat m="machAlu" />
        </mesh>
        <mesh position={[s * 0.024, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.021, 0.0045, 6, 24]} />
          <PMat m="zincGold" />
        </mesh>
        <mesh position={[s * 0.024, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
          <PMat m="iron" color="#15181d" e={0} rough={0.9} />
        </mesh>
      </group>
    </group>
  )
}

/** magnified self-pierce rivet profile for the callout */
const RIVET_PTS: V2[] = [
  [0.045, 0],
  [0.05, 0.01],
  [0.05, 0.13],
  [0.062, 0.142],
  [0.1, 0.165],
  [0.11, 0.19],
  [0.1, 0.215],
  [0.06, 0.235],
  [0.02, 0.242],
  [0.0001, 0.243],
]

export function ChassisViewReal() {
  return (
    <group>
      {/* ------------------------- safety cell (boron) ------------------------ */}
      <PartGroup id="chs-cell" explode={[0, 0.8, 0]}>
        {/* rocker sills with two-layer cut ends + web hints */}
        {[-0.55, 0.55].map((z) => (
          <group key={`sill${z}`}>
            <RBox args={[1.48, 0.11, 0.1]} radius={0.016} smoothness={2} position={[0, 0.3, z]}>
              <PMat m="steel" color={BORON} rough={0.42} />
            </RBox>
            {([1, -1] as const).map((s) => (
              <CutEnd key={s} position={[s * 0.74, 0.3, z]} dir={s} w={0.1} h={0.11} />
            ))}
          </group>
        ))}
        {/* B pillars */}
        {[-0.55, 0.55].map((z) => (
          <RBox key={`pil${z}`} args={[0.1, 0.86, 0.08]} radius={0.014} smoothness={2} position={[0, 0.75, z]}>
            <PMat m="steel" color={BORON} rough={0.42} />
          </RBox>
        ))}
        {/* roof rails with cut ends */}
        {[-0.55, 0.55].map((z) => (
          <group key={`rail${z}`}>
            <RBox args={[1.28, 0.075, 0.075]} radius={0.012} smoothness={2} position={[0, 1.18, z]}>
              <PMat m="steel" color={BORON} rough={0.42} />
            </RBox>
            {([1, -1] as const).map((s) => (
              <CutEnd key={s} position={[s * 0.64, 1.18, z]} dir={s} w={0.075} h={0.075} />
            ))}
          </group>
        ))}
        {/* roof crossmembers */}
        {[-0.6, 0.6].map((x) => (
          <RBox key={`cross${x}`} args={[0.075, 0.06, 1.1]} radius={0.012} smoothness={2} position={[x, 1.18, 0]}>
            <PMat m="steel" color={BORON} rough={0.42} />
          </RBox>
        ))}
      </PartGroup>

      {/* --------------------------- crush rails ----------------------------- */}
      <PartGroup id="chs-rails" perChild>
        {([-1, 1] as const).map((s) => (
          <group key={s} userData={{ explode: [s * 0.8, 0, 0] }}>
            <RailPair s={s} />
          </group>
        ))}
      </PartGroup>

      {/* ------------------------------ floor --------------------------------- */}
      <PartGroup id="chs-floor" explode={[0, -0.6, 0]}>
        <RBox args={[1.5, 0.02, 1.05]} radius={0.006} smoothness={2} position={[0, 0.26, 0]}>
          <PMat m="steel" color="#93a5c2" rough={0.45} />
        </RBox>
        {/* stamped stiffening beads */}
        {[-0.3, 0.3].map((z) => (
          <Ribs key={z} n={4} pitch={0.3} w={0.04} h={0.012} depth={0.34} m="steel" position={[0, 0.276, z]} />
        ))}
        {/* transmission tunnel hump */}
        <mesh position={[0, 0.268, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.095, 0.095, 1.5, 24, 1, true, 0, Math.PI]} />
          <PMat m="steel" color="#9fb0cc" rough={0.45} side={THREE.DoubleSide} />
        </mesh>
        {/* seat crossmembers (hat sections) */}
        {[-0.33, 0.33].map((x) => (
          <group key={x}>
            <RBox args={[0.09, 0.05, 1.0]} radius={0.01} smoothness={2} position={[x, 0.295, 0]}>
              <PMat m="steel" color="#7f93b5" rough={0.45} />
            </RBox>
            <RBox args={[0.13, 0.012, 1.0]} radius={0.004} smoothness={2} position={[x, 0.323, 0]}>
              <PMat m="machAlu" />
            </RBox>
          </group>
        ))}
      </PartGroup>

      {/* --------------------------- joining tech ----------------------------- */}
      <PartGroup id="chs-joints" explode={[0, 0.35, 0.95]}>
        {/* joint flange */}
        <RBox args={[1.5, 0.014, 0.11]} radius={0.004} smoothness={2} position={[0, 0.352, 0.55]}>
          <PMat m="steel" color="#9fb0cc" rough={0.4} />
        </RBox>
        {/* 14 dome rivets along the flange */}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-0.68 + i * (1.36 / 13), 0.361, 0.525]} scale={[1, 0.5, 1]}>
            <sphereGeometry args={[0.018, 14, 10]} />
            <PMat m="zincGold" e={0.08} />
          </mesh>
        ))}
        {/* continuous glowing structural-adhesive bead */}
        <Tube
          path={[
            [-0.72, 0.363, 0.578],
            [-0.36, 0.363, 0.578],
            [0, 0.363, 0.578],
            [0.36, 0.363, 0.578],
            [0.72, 0.363, 0.578],
          ]}
          r={0.012}
          seg={32}
          radial={10}
        >
          <PMat color={ADHESIVE} e={0.55} metal={0.1} rough={0.35} opacity={0.9} />
        </Tube>
        {/* 2 clinch-joint dimples */}
        {[-0.78, 0.78].map((x) => (
          <group key={x} position={[x, 0.3595, 0.55]}>
            <mesh>
              <cylinderGeometry args={[0.02, 0.024, 0.006, 20]} />
              <PMat m="machAlu" />
            </mesh>
            <mesh position={[0, 0.004, 0]}>
              <cylinderGeometry args={[0.011, 0.011, 0.004, 14]} />
              <PMat m="iron" color="#20242b" e={0} rough={0.9} />
            </mesh>
          </group>
        ))}
        {/* magnified rivet callout floating at the side */}
        <group position={[1.05, 0.72, 0.55]} rotation={[0, 0, -0.15]}>
          <Lathe pts={RIVET_PTS} seg={36}>
            <PMat m="zincGold" side={THREE.DoubleSide} />
          </Lathe>
          <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.17, 0.004, 8, 40]} />
            <PMat color={ADHESIVE} e={0.4} metal={0.2} rough={0.4} opacity={0.55} />
          </mesh>
        </group>
      </PartGroup>
    </group>
  )
}

/* ============================== SUSPENSION =============================== */

/** knurled adjuster collar */
function Collar({ y, color }: { y: number; color: string }) {
  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[0.112, 0.112, 0.036, 32]} />
        <PMat m="steel" color={color} rough={0.35} />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.112, 0, Math.sin(a) * 0.112]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.006, 0.032, 0.009]} />
            <PMat m="steel" color={color} rough={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

/** forged control-arm slab: rounded triangle silhouette with lightening pocket */
function useArmGeo(a: V2, b: V2, c: V2, depth: number) {
  return useMemo(() => {
    const corners = [a, b, c]
    const cx = (a[0] + b[0] + c[0]) / 3
    const cz = (a[1] + b[1] + c[1]) / 3
    const outline = (pts: V2[], into: THREE.Shape | THREE.Path) => {
      const n = pts.length
      const at = (i: number) => pts[(i + n) % n]
      const lerp = (p: V2, q: V2, t: number): V2 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
      const T = 0.18
      for (let i = 0; i < n; i++) {
        const p = at(i)
        const pin = lerp(p, at(i - 1), T)
        const pout = lerp(p, at(i + 1), T)
        if (i === 0) into.moveTo(pin[0], pin[1])
        else into.lineTo(pin[0], pin[1])
        into.quadraticCurveTo(p[0], p[1], pout[0], pout[1])
      }
      into.closePath()
    }
    const sh = new THREE.Shape()
    outline(corners, sh)
    const inset = corners.map(([x, z]): V2 => [cx + (x - cx) * 0.45, cz + (z - cz) * 0.45])
    const hole = new THREE.Path()
    outline([inset[0], inset[2], inset[1]], hole) // reversed winding
    sh.holes.push(hole)
    const g = new THREE.ExtrudeGeometry(sh, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 1,
      curveSegments: 6,
    })
    g.rotateX(Math.PI / 2) // shape (x, z-ish) → flat slab in XZ
    g.translate(0, depth / 2 + 0.008, 0)
    g.computeVertexNormals()
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function ForgedArm({ a, b, c, depth, y }: { a: V2; b: V2; c: V2; depth: number; y: number }) {
  const geo = useArmGeo(a, b, c, depth)
  const flash = useMemo<V3[]>(() => {
    const cx = (a[0] + b[0] + c[0]) / 3
    const cz = (a[1] + b[1] + c[1]) / 3
    const out = (x: number, z: number): V3 => [cx + (x - cx) * 1.05, y, cz + (z - cz) * 1.05]
    const corners = [a, b, c]
    const pts: V3[] = []
    for (let i = 0; i < 3; i++) {
      const p = corners[i]
      const q = corners[(i + 1) % 3]
      pts.push(out(p[0], p[1]), out((p[0] + q[0]) / 2, (p[1] + q[1]) / 2))
    }
    return pts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <group>
      <mesh geometry={geo} position={[0, y, 0]}>
        <PMat m="machAlu" color="#b9a7e0" rough={0.35} />
      </mesh>
      {/* polished forging flash line along the parting edge */}
      <Tube path={flash} closed r={0.0045} seg={48} radial={8}>
        <PMat m="polSteel" e={0.08} />
      </Tube>
    </group>
  )
}

/** press-in bushing: steel shell, visible rubber, polished inner sleeve (axis X) */
function Bushing({ position }: { position: V3 }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.055, 0.055, 0.08, 20]} />
        <PMat m="steel" rough={0.35} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.044, 0.044, 0.092, 20]} />
        <PMat m="rubber" />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, 0.106, 14]} />
        <PMat m="polSteel" />
      </mesh>
    </group>
  )
}

/** mini spherical rod end (for ARB drop links) */
function RodEnd({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.02, 0.013, 10, 24]} />
        <PMat m="steel" rough={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.016, 14, 10]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[0, -0.028, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.012, 6]} />
        <PMat m="zincGold" />
      </mesh>
    </group>
  )
}

/** chassis clamp bracket with rubber bush (bar axis along Z) */
function ArbClamp({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.07, 20]} />
        <PMat m="rubber" />
      </mesh>
      <RBox args={[0.13, 0.05, 0.085]} radius={0.012} smoothness={2} position={[0, 0.035, 0]}>
        <PMat m="steel" rough={0.4} />
      </RBox>
      <RBox args={[0.15, 0.012, 0.095]} radius={0.004} smoothness={2} position={[0, -0.055, 0]}>
        <PMat m="steel" rough={0.4} />
      </RBox>
      {[-0.062, 0.062].map((x) => (
        <Bolt key={x} position={[x, 0.02, 0]} r={0.007} len={0.065} />
      ))}
    </group>
  )
}

const BUMPSTOP_PTS: V2[] = [
  [0.034, 0],
  [0.052, 0.015],
  [0.037, 0.03],
  [0.052, 0.045],
  [0.037, 0.06],
  [0.052, 0.075],
  [0.037, 0.09],
  [0.034, 0.1],
]

const LOWER_PERCH_PTS: V2[] = [
  [0.088, 0],
  [0.23, 0],
  [0.245, 0.018],
  [0.235, 0.04],
  [0.16, 0.035],
  [0.09, 0.028],
]

const UPPER_SEAT_PTS: V2[] = [
  [0.035, 0],
  [0.235, 0],
  [0.245, 0.02],
  [0.1, 0.035],
  [0.035, 0.03],
]

const BJ_HOUSING_PTS: V2[] = [
  [0.02, 0],
  [0.07, 0.005],
  [0.085, 0.03],
  [0.088, 0.08],
  [0.08, 0.11],
  [0.07, 0.115],
]

const BOOT_PTS: V2[] = [
  [0.085, 0],
  [0.095, 0.015],
  [0.07, 0.03],
  [0.09, 0.045],
  [0.065, 0.06],
  [0.082, 0.075],
  [0.055, 0.09],
  [0.04, 0.105],
  [0.032, 0.115],
]

const ARB_PATH: V3[] = [
  [-0.45, 0.28, -0.95],
  [-0.75, 0.33, -0.83],
  [-0.85, 0.35, -0.6],
  [-0.85, 0.35, -0.1],
  [-0.85, 0.35, 0.15],
  [-0.8, 0.34, 0.3],
  [-0.45, 0.28, 0.55],
]

export function SuspensionViewReal() {
  const springGeo = useSpringGeo(0.2, 0.62, 7, 0.028)
  return (
    <group>
      {/* ------------------------- damper + top mount ------------------------- */}
      <PartGroup id="sus-damper" explode={[0, 0.3, 0]}>
        {/* threaded body */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.75, 28]} />
          <PMat m="steel" color="#b7a14c" rough={0.3} />
        </mesh>
        {/* fine thread rings */}
        {[0.34, 0.42, 0.5, 0.58, 0.66, 0.74].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.0875, 0.0032, 6, 36]} />
            <PMat m="steel" color="#d8c87e" rough={0.3} />
          </mesh>
        ))}
        {/* chromed rod */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.45, 20]} />
          <PMat m="polSteel" rough={0.06} />
        </mesh>
        {/* bellows bump stop on the rod */}
        <Lathe pts={BUMPSTOP_PTS} seg={32} position={[0, 1.26, 0]}>
          <PMat m="nylon" color="#9a927c" side={THREE.DoubleSide} />
        </Lathe>
        {/* top mount: rubber isolator + bearing plate + 3 studs */}
        <mesh position={[0, 1.415, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 28]} />
          <PMat m="rubber" />
        </mesh>
        <mesh position={[0, 1.447, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.028, 32]} />
          <PMat m="machAlu" />
        </mesh>
        <mesh position={[0, 1.462, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.055, 0.008, 8, 28]} />
          <PMat m="polSteel" />
        </mesh>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2
          return (
            <group key={i} position={[Math.cos(a) * 0.085, 1.49, Math.sin(a) * 0.085]}>
              <mesh>
                <cylinderGeometry args={[0.009, 0.009, 0.06, 10]} />
                <PMat m="zincGold" />
              </mesh>
              <mesh position={[0, 0.012, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.013, 6]} />
                <PMat m="zincGold" />
              </mesh>
            </group>
          )
        })}
      </PartGroup>

      {/* ------------------- coil spring on adjustable perch ------------------- */}
      <PartGroup id="sus-spring" explode={[0.95, 0.1, 0]}>
        <mesh geometry={springGeo} position={[0, 0.44, 0]}>
          <PMat m="steel" color={SUS} rough={0.4} metal={0.75} />
        </mesh>
        {/* flattened + ground end coils */}
        {[0.45, 1.05].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.55]}>
            <torusGeometry args={[0.2, 0.027, 10, 40]} />
            <PMat m="steel" color={SUS} rough={0.35} metal={0.75} />
          </mesh>
        ))}
        {/* lower perch + two knurled adjuster collars */}
        <Lathe pts={LOWER_PERCH_PTS} seg={36} position={[0, 0.385, 0]}>
          <PMat m="machAlu" side={THREE.DoubleSide} />
        </Lathe>
        <Collar y={0.345} color="#8f86c0" />
        <Collar y={0.3} color="#b7a14c" />
        {/* upper seat */}
        <Lathe pts={UPPER_SEAT_PTS} seg={36} position={[0, 1.06, 0]}>
          <PMat m="machAlu" side={THREE.DoubleSide} />
        </Lathe>
      </PartGroup>

      {/* --------------------------- forged arms ------------------------------ */}
      <PartGroup id="sus-arms" explode={[0, -0.55, 0.6]}>
        {/* lower wishbone */}
        <ForgedArm a={[-0.55, -0.38]} b={[0.46, 0.08]} c={[-0.55, 0.48]} depth={0.05} y={0.12} />
        {/* upper arm */}
        <ForgedArm a={[-0.47, -0.27]} b={[0.32, 0.05]} c={[-0.47, 0.37]} depth={0.038} y={1.28} />
        {/* press-in bushings with visible rubber */}
        {(
          [
            [-0.55, 0.12, -0.35],
            [-0.55, 0.12, 0.45],
            [-0.45, 1.3, -0.25],
            [-0.45, 1.3, 0.35],
          ] as V3[]
        ).map((p, i) => (
          <Bushing key={i} position={p} />
        ))}
      </PartGroup>

      {/* ---------------------------- ball joint ------------------------------ */}
      <PartGroup id="sus-balljoint" explode={[0.7, -0.4, 0.7]}>
        <group position={[0.46, 0.12, 0.08]} rotation={[0, 0, -0.25]}>
          {/* housing cup */}
          <Lathe pts={BJ_HOUSING_PTS} seg={32} position={[0, -0.07, 0]}>
            <PMat m="forged" side={THREE.DoubleSide} />
          </Lathe>
          {/* ball */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.065, 24, 16]} />
            <PMat m="polSteel" />
          </mesh>
          {/* rubber bellows boot, 3 corrugations */}
          <Lathe pts={BOOT_PTS} seg={32} position={[0, 0.03, 0]}>
            <PMat m="rubber" side={THREE.DoubleSide} />
          </Lathe>
          {/* tapered stud */}
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.024, 0.035, 0.16, 16]} />
            <PMat m="polSteel" rough={0.2} />
          </mesh>
          {/* washer + castellated nut */}
          <mesh position={[0, 0.225, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.006, 20]} />
            <PMat m="steel" rough={0.35} />
          </mesh>
          <mesh position={[0, 0.245, 0]}>
            <cylinderGeometry args={[0.03, 0.033, 0.034, 6]} />
            <PMat m="zincGold" />
          </mesh>
          {/* castellation slots */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.262, 0]} rotation={[0, (i / 3) * Math.PI, 0]}>
              <boxGeometry args={[0.068, 0.012, 0.012]} />
              <PMat m="iron" color="#23262c" e={0} rough={0.9} />
            </mesh>
          ))}
          {/* split pin hint through the stud */}
          <Tube
            path={[
              [-0.05, 0.26, 0],
              [-0.02, 0.268, 0],
              [0.02, 0.268, 0],
              [0.055, 0.252, 0],
            ]}
            r={0.0045}
            seg={12}
            radial={6}
          >
            <PMat m="steel" rough={0.4} />
          </Tube>
          <mesh position={[-0.052, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.009, 0.0042, 6, 16]} />
            <PMat m="steel" rough={0.4} />
          </mesh>
        </group>
      </PartGroup>

      {/* ------------------------- anti-roll bar ------------------------------ */}
      <PartGroup id="sus-arb" explode={[-0.9, 0, -0.7]}>
        <Tube path={ARB_PATH} r={0.03} seg={48} radial={12}>
          <PMat m="steel" color={ARB_PINK} rough={0.45} />
        </Tube>
        {/* drop links with mini rod ends both ends */}
        {(
          [
            { from: [-0.45, 0.3, 0.55], to: [-0.12, 0.56, 0.32] },
            { from: [-0.45, 0.3, -0.95], to: [-0.12, 0.56, -0.72] },
          ] as { from: V3; to: V3 }[]
        ).map((l, i) => (
          <group key={i}>
            <Strut from={l.from} to={l.to} r={0.012}>
              <PMat m="steel" rough={0.35} />
            </Strut>
            <RodEnd position={l.from} />
            <RodEnd position={l.to} />
          </group>
        ))}
        {/* 2 chassis clamp brackets with rubber bushes */}
        <ArbClamp position={[-0.85, 0.35, -0.4]} />
        <ArbClamp position={[-0.85, 0.35, 0.0]} />
      </PartGroup>
    </group>
  )
}

/* ============================ MONOTUBE DAMPER ============================ */

/** half-shell body wall profile (revolved 1.5π) */
const DMP_BODY_PTS: V2[] = [
  [0.04, 0.1],
  [0.21, 0.1],
  [0.222, 0.115],
  [0.226, 0.14],
  [0.226, 1.42],
  [0.21, 1.45],
  [0.145, 1.46],
]

const GUIDE_PTS: V2[] = [
  [0.038, 0],
  [0.2, 0],
  [0.205, 0.01],
  [0.205, 0.055],
  [0.15, 0.06],
  [0.12, 0.045],
  [0.05, 0.045],
  [0.038, 0.02],
]

const WIPER_PTS: V2[] = [
  [0.036, 0],
  [0.08, 0.005],
  [0.085, 0.02],
  [0.06, 0.03],
  [0.04, 0.028],
]

export function DamperViewReal() {
  return (
    <group>
      {/* -------------------- cutaway half-shell body (decor) ------------------ */}
      <Ghost>
        {/* yaw aims the cutaway window toward the camera (+X+Z) */}
        <group rotation={[0, Math.PI / 2, 0]}>
          <Lathe pts={DMP_BODY_PTS} seg={48} phi={Math.PI * 1.5}>
            <PMat m="blackCast" side={THREE.DoubleSide} opacity={0.92} />
          </Lathe>
          {/* bright cut faces showing wall thickness */}
          <mesh position={[0, 0.78, 0.2235]}>
            <boxGeometry args={[0.012, 1.28, 0.014]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[-0.2235, 0.78, 0]}>
            <boxGeometry args={[0.014, 1.28, 0.012]} />
            <PMat m="machAlu" />
          </mesh>
          {/* external thread rings following the shell arc */}
          {[0.24, 0.3, 0.36, 0.42, 0.48, 0.54].map((y) => (
            <group key={y} position={[0, y, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.233, 0.0045, 6, 40, Math.PI * 1.5]} />
                <PMat m="blackCast" color="#3a3f47" />
              </mesh>
            </group>
          ))}
          {/* circlip groove hints inside the top of the body */}
          {[1.28, 1.4].map((y) => (
            <group key={y} position={[0, y, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.213, 0.0035, 6, 40, Math.PI * 1.5]} />
                <PMat m="iron" color="#14161a" e={0} rough={0.9} />
              </mesh>
            </group>
          ))}
          {/* closed base cap */}
          <mesh position={[0, 0.115, 0]}>
            <cylinderGeometry args={[0.228, 0.235, 0.05, 40]} />
            <PMat m="blackCast" />
          </mesh>
        </group>
      </Ghost>

      {/* -------------------- oil / gas / floating piston ---------------------- */}
      <PartGroup id="dmp-oil" explode={[-0.75, 0, 0.45]}>
        {/* translucent amber oil volume */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.72, 36]} />
          <PMat color="#d6a73d" e={0.14} metal={0.1} rough={0.25} opacity={0.45} depthWrite={false} />
        </mesh>
        {/* oil surface meniscus */}
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[0.183, 0.183, 0.004, 36]} />
          <PMat color="#e8bf5e" e={0.3} metal={0.1} rough={0.3} opacity={0.7} depthWrite={false} />
        </mesh>
        {/* polished floating piston with two O-ring bands */}
        <mesh position={[0, 0.325, 0]}>
          <cylinderGeometry args={[0.181, 0.181, 0.05, 36]} />
          <PMat m="polSteel" />
        </mesh>
        {[0.308, 0.342].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.181, 0.005, 6, 36]} />
            <PMat m="rubber" />
          </mesh>
        ))}
        {/* translucent pale-cyan nitrogen section below the floating piston */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.16, 36]} />
          <PMat color="#9fdff0" e={0.22} metal={0} rough={0.2} opacity={0.3} depthWrite={false} />
        </mesh>
        {/* schrader gas-fill valve at the base */}
        <group position={[0, 0.06, 0]}>
          <mesh>
            <cylinderGeometry args={[0.016, 0.016, 0.055, 14]} />
            <PMat m="brass" />
          </mesh>
          <mesh position={[0, -0.032, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.02, 6]} />
            <PMat m="blackCast" />
          </mesh>
        </group>
      </PartGroup>

      {/* ----------------- main piston, band + shim stacks --------------------- */}
      <PartGroup id="dmp-pistonvalve" explode={[0.85, 0.1, 0.3]}>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.172, 0.172, 0.07, 36]} />
          <PMat m="machAlu" color={SUS} rough={0.3} />
        </mesh>
        {/* PTFE piston band */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.179, 0.179, 0.046, 36, 1, true]} />
          <PMat m="nylon" side={THREE.DoubleSide} />
        </mesh>
        {/* valving ports */}
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.1, 0.95, Math.sin(a) * 0.1]}>
              <cylinderGeometry args={[0.02, 0.02, 0.076, 10]} />
              <PMat m="iron" color="#1c2027" e={0} rough={0.85} />
            </mesh>
          )
        })}
        {/* shim stacks BOTH faces — 3 discs each */}
        {[0.052, 0.066, 0.08].map((dy, i) => (
          <mesh key={`lo${i}`} position={[0, 0.95 - dy, 0]}>
            <cylinderGeometry args={[0.13 - i * 0.032, 0.13 - i * 0.032, 0.007, 32]} />
            <PMat m="polSteel" />
          </mesh>
        ))}
        {[0.052, 0.066, 0.08].map((dy, i) => (
          <mesh key={`hi${i}`} position={[0, 0.95 + dy, 0]}>
            <cylinderGeometry args={[0.12 - i * 0.03, 0.12 - i * 0.03, 0.007, 32]} />
            <PMat m="polSteel" />
          </mesh>
        ))}
        {/* piston retaining nut */}
        <mesh position={[0, 0.845, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.03, 6]} />
          <PMat m="zincGold" />
        </mesh>
      </PartGroup>

      {/* ------------------------------ rod ------------------------------------ */}
      <PartGroup id="dmp-rod" explode={[0, 0.75, 0]}>
        <mesh position={[0, 1.38, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 24]} />
          <PMat m="polSteel" rough={0.05} />
        </mesh>
        {/* machined shoulder above the piston */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.03, 20]} />
          <PMat m="polSteel" rough={0.15} />
        </mesh>
        {/* rod-end eye with rubber bush */}
        <mesh position={[0, 1.82, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.05, 0.022, 12, 28]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
        <mesh position={[0, 1.82, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
          <PMat m="rubber" />
        </mesh>
      </PartGroup>

      {/* ---------------- rod guide + seal cartridge at the top ----------------- */}
      <PartGroup id="dmp-seals" explode={[0, 0.4, 0.85]}>
        {/* stepped rod guide */}
        <Lathe pts={GUIDE_PTS} seg={40} position={[0, 1.2, 0]}>
          <PMat m="machAlu" side={THREE.DoubleSide} />
        </Lathe>
        {/* steel cartridge case ring */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <PMat m="steel" rough={0.35} />
        </mesh>
        {/* dark oil-seal ring */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 28]} />
          <PMat m="rubber" />
        </mesh>
        {/* garter spring in the seal groove */}
        <mesh position={[0, 1.318, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.058, 0.006, 8, 32]} />
          <PMat m="polSteel" />
        </mesh>
        {/* wiper lip */}
        <Lathe pts={WIPER_PTS} seg={32} position={[0, 1.355, 0]}>
          <PMat m="rubber" side={THREE.DoubleSide} />
        </Lathe>
        {/* retaining circlip (open ring) */}
        <mesh position={[0, 1.395, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.006, 6, 40, Math.PI * 1.8]} />
          <PMat m="polSteel" />
        </mesh>
      </PartGroup>
    </group>
  )
}
