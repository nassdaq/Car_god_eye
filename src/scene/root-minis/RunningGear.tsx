/**
 * RunningGear.tsx — root-view miniature upgrades for Steering / Suspension /
 * Brakes. Drop-in replacements for the schematic Steering(), Suspension() and
 * Brakes() in CarModel.tsx.
 *
 * HARD CONTRACT (matches CarModel exactly — camera presets + explode logic):
 *   - SteeringMini:   PartGroup id="steering"  explode=[0.3, 1.0, 0.5]
 *   - SuspensionMini: PartGroup id="suspension" perChild; corners at
 *     x ∈ {1.35,-1.35}, z ∈ {0.62,-0.62}, each corner group
 *     userData.explode = [sign(x)*0.5, 0.55, sign(z)*0.85]
 *   - BrakesMini:     PartGroup id="brakes" perChild; corners at
 *     x ∈ {1.35,-1.35}, z ∈ {0.64,-0.64}, userData.explode = [0,0,sign(z)*0.8]
 *
 * Every material is <PMat/>; no textures, no useFrame. Renders alongside the
 * whole car, so segment counts stay low and per-corner geometry is shared
 * through useMemo (budget ≈ 22k triangles for the whole file).
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PartGroup, useSpringGeo } from '../lib'
import { Lathe, PMat, RBox, Tube } from '../realism'

type V2 = [number, number]
type V3 = [number, number, number]

/** spring / suspension accent */
const SUS = '#b388ff'
/** painted caliper brake-red */
const PAINT = '#c23b4e'

/* ------------------------------ small helpers ----------------------------- */

/** straight (optionally tapered) cylinder between two points, PMat child */
function Strut({
  from,
  to,
  r = 0.014,
  r2,
  seg = 12,
  children,
}: {
  from: V3
  to: V3
  r?: number
  /** radius at the `to` end (taper); defaults to r */
  r2?: number
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
      <cylinderGeometry args={[r2 ?? r, r, len, seg]} />
      {children}
    </mesh>
  )
}

/** flat rounded-box bar between two points (forged arm sections) */
function Bar({
  from,
  to,
  w,
  t,
  children,
}: {
  from: V3
  to: V3
  /** horizontal width of the slab */
  w: number
  /** vertical thickness of the slab */
  t: number
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
    <RBox
      args={[w, len, t]}
      radius={Math.min(w, t) * 0.32}
      smoothness={1}
      position={pos}
      quaternion={quat}
    >
      {children}
    </RBox>
  )
}

/* ================================ STEERING ================================ */

/** 3-ring rubber rack bellows profile (axis +Y, revolved) */
const BELLOWS_PTS: V2[] = [
  [0.034, 0],
  [0.058, 0.02],
  [0.036, 0.04],
  [0.058, 0.06],
  [0.036, 0.08],
  [0.058, 0.1],
  [0.03, 0.115],
  [0.024, 0.125],
]

/** u-joint knuckle between the two column pieces */
const COL_JOINT: V3 = [0.62, 0.645, 0.35]
/** top of the rack input shaft stub */
const COL_INPUT: V3 = [0.98, 0.46, 0.3]

export function SteeringMini() {
  /* wheel plane faces along the upper column (tilted up/back at the driver) */
  const wheelQuat = useMemo(() => {
    const dir = new THREE.Vector3(
      0.35 - COL_JOINT[0],
      0.78 - COL_JOINT[1],
      0.38 - COL_JOINT[2],
    ).normalize()
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)
  }, [])

  return (
    <PartGroup id="steering" explode={[0.3, 1.0, 0.5]}>
      {/* ------------------------------- rack -------------------------------- */}
      {/* housing tube across the nose */}
      <mesh position={[1.15, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.9, 16]} />
        <PMat m="castAlu" />
      </mesh>
      {/* center pinion bulge */}
      <mesh position={[1.15, 0.385, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.066, 0.062, 0.15, 16]} />
        <PMat m="castAlu" color="#a8b0ba" />
      </mesh>
      {/* input shaft stub angled up/back toward the column */}
      <Strut from={[1.14, 0.39, 0.27]} to={COL_INPUT} r={0.022} seg={10}>
        <PMat m="steel" />
      </Strut>
      {/* rubber bellows both ends + tie rods with ball-end knuckles */}
      {([1, -1] as const).map((s) => (
        <group key={s}>
          <Lathe
            pts={BELLOWS_PTS}
            seg={14}
            position={[1.15, 0.38, s * 0.45]}
            rotation={[(s * Math.PI) / 2, 0, 0]}
          >
            <PMat m="rubber" side={THREE.DoubleSide} />
          </Lathe>
          {/* tie rod reaching toward the front wheel */}
          <Strut from={[1.15, 0.38, s * 0.56]} to={[1.33, 0.35, s * 0.8]} r={0.013} seg={10}>
            <PMat m="polSteel" rough={0.2} />
          </Strut>
          {/* ball-end knuckle: ball + boot ring + tapered stud */}
          <mesh position={[1.33, 0.35, s * 0.8]}>
            <sphereGeometry args={[0.026, 10, 7]} />
            <PMat m="polSteel" />
          </mesh>
          <mesh position={[1.33, 0.342, s * 0.8]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.024, 0.009, 5, 12]} />
            <PMat m="rubber" />
          </mesh>
          <mesh position={[1.33, 0.315, s * 0.8]}>
            <cylinderGeometry args={[0.009, 0.013, 0.045, 6]} />
            <PMat m="zincGold" />
          </mesh>
        </group>
      ))}

      {/* ------------------------------ column ------------------------------- */}
      {/* two-piece shaft with one u-joint knuckle at the junction */}
      <Strut from={COL_INPUT} to={COL_JOINT} r={0.019} seg={12}>
        <PMat m="polSteel" rough={0.15} />
      </Strut>
      <Strut from={COL_JOINT} to={[0.37, 0.77, 0.375]} r={0.022} seg={12}>
        <PMat m="steel" color="#9aa3af" />
      </Strut>
      <group position={COL_JOINT}>
        <mesh>
          <sphereGeometry args={[0.032, 10, 7]} />
          <PMat m="polSteel" />
        </mesh>
        {/* trunnion cross pins */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.085, 8]} />
          <PMat m="zincGold" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2 - 0.47]}>
          <cylinderGeometry args={[0.011, 0.011, 0.085, 8]} />
          <PMat m="zincGold" />
        </mesh>
      </group>
      {/* EPS motor cylinder hanging inboard off the lower column */}
      <group position={[0.84, 0.532, 0.319]}>
        <mesh position={[0, 0, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
          <PMat m="blackCast" color="#2f3a52" e={0.08} />
        </mesh>
        <mesh position={[0, 0, -0.138]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.02, 12]} />
          <PMat m="machAlu" />
        </mesh>
      </group>
      {/* worm-gear collar where the motor meets the shaft */}
      <Strut from={[0.875, 0.514, 0.314]} to={[0.805, 0.55, 0.324]} r={0.035} seg={12}>
        <PMat m="castAlu" />
      </Strut>

      {/* the steering WHEEL itself is the real one in the glb cockpit —
          drawing a second rim here put two wheels in the car */}

      {/* ---------------------------- pedal box ----------------------------- */}
      <group position={[0.95, 0.3, 0.37]}>
        {/* brake pedal: arm + wide pad */}
        <group rotation={[0, 0, -0.25]}>
          <mesh position={[0, 0.09, -0.04]} rotation={[0, 0, 0.12]}>
            <boxGeometry args={[0.018, 0.2, 0.014]} />
            <PMat m="steel" color="#3a4049" />
          </mesh>
          <RBox args={[0.022, 0.07, 0.09]} radius={0.006} smoothness={2} position={[0.004, -0.015, -0.04]}>
            <PMat m="rubber" color="#1d2026" />
          </RBox>
        </group>
        {/* throttle: organ-style slim pedal */}
        <group position={[0.02, 0, 0.09]} rotation={[0, 0, -0.38]}>
          <RBox args={[0.016, 0.15, 0.055]} radius={0.006} smoothness={2}>
            <PMat m="machAlu" e={0.05} />
          </RBox>
        </group>
        {/* dead pedal footrest */}
        <RBox args={[0.02, 0.12, 0.06]} radius={0.006} smoothness={2} position={[0.01, 0.0, -0.17]} rotation={[0, 0, -0.3]}>
          <PMat m="machAlu" color="#6a7077" e={0.04} />
        </RBox>
        {/* pivot shaft across the pedal arms */}
        <mesh position={[0, 0.19, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2, 10]} />
          <PMat m="polSteel" />
        </mesh>
      </group>
    </PartGroup>
  )
}

/* =============================== SUSPENSION =============================== */

/** per-corner geometry, built once and shared by all four corners */
function useSuspGeos() {
  return useMemo(
    () => ({
      body: new THREE.CylinderGeometry(0.042, 0.048, 0.26, 16),
      rod: new THREE.CylinderGeometry(0.015, 0.015, 0.22, 10),
      perch: new THREE.TorusGeometry(0.056, 0.01, 5, 12),
      hat: new THREE.CylinderGeometry(0.052, 0.06, 0.018, 14),
      nut: new THREE.CylinderGeometry(0.018, 0.018, 0.026, 6),
      ball: new THREE.SphereGeometry(0.03, 10, 7),
      boot: new THREE.TorusGeometry(0.028, 0.011, 5, 12),
      stud: new THREE.CylinderGeometry(0.012, 0.012, 0.08, 8),
      bush: new THREE.CylinderGeometry(0.026, 0.026, 0.08, 10),
      hub: new THREE.CylinderGeometry(0.06, 0.06, 0.022, 16),
    }),
    [],
  )
}

function SuspensionCornerMini({
  x,
  z,
  spring,
  g,
}: {
  x: number
  z: number
  spring: THREE.TubeGeometry
  g: ReturnType<typeof useSuspGeos>
}) {
  const sz = Math.sign(z)
  /** balljoint boss at the wishbone apex */
  const bj: V3 = [x, 0.265, sz * 0.6]
  return (
    <group userData={{ explode: [Math.sign(x) * 0.5, 0.55, sz * 0.85] }}>
      {/* ------------------------------ coilover ------------------------------ */}
      <group position={[x, 0.3, z * 0.82]} rotation={[sz * -0.28, 0, 0]}>
        {/* damper body with 2 perch rings */}
        <mesh geometry={g.body} position={[0, 0.13, 0]}>
          <PMat m="blackCast" color="#3b3542" rough={0.5} />
        </mesh>
        {[0.06, 0.155].map((y) => (
          <mesh key={y} geometry={g.perch} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <PMat m="machAlu" e={0.05} />
          </mesh>
        ))}
        {/* bright rod */}
        <mesh geometry={g.rod} position={[0, 0.34, 0]}>
          <PMat m="polSteel" rough={0.07} />
        </mesh>
        {/* chunky coil */}
        <mesh geometry={spring} position={[0, 0.085, 0]}>
          <PMat m="steel" color={SUS} rough={0.38} e={0.14} />
        </mesh>
        {/* top hat washer + nut */}
        <mesh geometry={g.hat} position={[0, 0.435, 0]}>
          <PMat m="machAlu" />
        </mesh>
        <mesh geometry={g.nut} position={[0, 0.452, 0]}>
          <PMat m="zincGold" />
        </mesh>
      </group>

      {/* ------------- lower wishbone: two tapered legs, A-shape -------------- */}
      {[-0.18, 0.18].map((dx) => (
        <group key={dx}>
          {/* wide inner section, narrower outer section (taper) */}
          <Bar
            from={[x + dx, 0.24, sz * 0.5]}
            to={[x + dx * 0.45, 0.255, sz * 0.555]}
            w={0.055}
            t={0.034}
          >
            <PMat m="forged" color="#857b94" />
          </Bar>
          <Bar from={[x + dx * 0.5, 0.253, sz * 0.55]} to={bj} w={0.038} t={0.028}>
            <PMat m="forged" color="#857b94" />
          </Bar>
          {/* inner bushing cylinder at the chassis rail */}
          <mesh geometry={g.bush} position={[x + dx, 0.24, sz * 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <PMat m="rubber" color="#1d2026" />
          </mesh>
        </group>
      ))}
      {/* balljoint boss: ball + boot ring + stud up into the knuckle */}
      <mesh geometry={g.ball} position={bj}>
        <PMat m="polSteel" />
      </mesh>
      <mesh geometry={g.boot} position={[x, 0.29, sz * 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <PMat m="rubber" />
      </mesh>
      <mesh geometry={g.stud} position={[x, 0.325, sz * 0.6]}>
        <PMat m="polSteel" />
      </mesh>

      {/* ------------- upright / knuckle plate + hub flange disc -------------- */}
      <RBox args={[0.06, 0.26, 0.04]} radius={0.012} smoothness={1} position={[x, 0.39, sz * 0.585]}>
        <PMat m="forged" />
      </RBox>
      <mesh geometry={g.hub} position={[x, 0.34, sz * 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <PMat m="machAlu" e={0.05} />
      </mesh>
    </group>
  )
}

export function SuspensionMini() {
  const springGeo = useSpringGeo(0.085, 0.3, 6, 0.014)
  const geos = useSuspGeos()
  return (
    <PartGroup id="suspension" perChild>
      {[1.35, -1.35].flatMap((x) =>
        [0.62, -0.62].map((z) => (
          <SuspensionCornerMini key={`${x}${z}`} x={x} z={z} spring={springGeo} g={geos} />
        )),
      )}
    </PartGroup>
  )
}

/* ================================= BRAKES ================================= */

/** caliper clock position: clamped over the top-rear edge of the disc */
const CAL_A = 2.25

function useBrakeGeos() {
  return useMemo(
    () => ({
      plate: new THREE.CylinderGeometry(0.21, 0.21, 0.016, 24),
      vane: new THREE.BoxGeometry(0.095, 0.026, 0.02),
      hat: new THREE.CylinderGeometry(0.084, 0.084, 0.05, 18),
      stud: new THREE.CylinderGeometry(0.011, 0.011, 0.016, 6),
      bolt: new THREE.CylinderGeometry(0.014, 0.014, 0.02, 6),
    }),
    [],
  )
}

function BrakeCornerMini({
  x,
  z,
  g,
  vanes,
  studs,
}: {
  x: number
  z: number
  g: ReturnType<typeof useBrakeGeos>
  vanes: number[]
  studs: number[]
}) {
  const sz = Math.sign(z)
  const cx = x + Math.cos(CAL_A) * 0.19
  const cy = 0.34 + Math.sin(CAL_A) * 0.19
  /* tangent direction at the caliper */
  const tx = -Math.sin(CAL_A)
  const ty = Math.cos(CAL_A)
  return (
    <group userData={{ explode: [0, 0, sz * 0.8] }}>
      {/* ------------- vented disc: two plates + 8 vane blocks ---------------- */}
      {[-0.018, 0.018].map((dz) => (
        <mesh key={dz} geometry={g.plate} position={[x, 0.34, z + dz]} rotation={[Math.PI / 2, 0, 0]}>
          <PMat m="iron" color="#747a84" rough={0.4} e={0.05} />
        </mesh>
      ))}
      {vanes.map((a) => (
        <mesh
          key={a}
          geometry={g.vane}
          position={[x + Math.cos(a) * 0.155, 0.34 + Math.sin(a) * 0.155, z]}
          rotation={[0, 0, a]}
        >
          <PMat m="iron" color="#4a4f57" rough={0.6} />
        </mesh>
      ))}
      {/* hat + 5 stud dots on the outboard face */}
      <mesh geometry={g.hat} position={[x, 0.34, z + sz * 0.028]} rotation={[Math.PI / 2, 0, 0]}>
        <PMat m="blackCast" color="#33383f" />
      </mesh>
      {studs.map((a) => (
        <mesh
          key={a}
          geometry={g.stud}
          position={[x + Math.cos(a) * 0.048, 0.34 + Math.sin(a) * 0.048, z + sz * 0.055]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <PMat m="polSteel" e={0.06} />
        </mesh>
      ))}

      {/* ----------- radial caliper over the top-rear edge + line ------------- */}
      <RBox
        args={[0.22, 0.1, 0.1]}
        radius={0.03}
        smoothness={2}
        position={[cx, cy, z]}
        rotation={[0, 0, CAL_A + Math.PI / 2]}
      >
        <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} e={0.1} />
      </RBox>
      {/* 2 bridge-bolt dots on the outboard face */}
      {[-0.07, 0.07].map((d) => (
        <mesh
          key={d}
          geometry={g.bolt}
          position={[cx + tx * d, cy + ty * d, z + sz * 0.052]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <PMat m="zincGold" />
        </mesh>
      ))}
      {/* braided brake line running up and inboard */}
      <Tube
        path={[
          [cx + Math.cos(CAL_A) * 0.05, cy + Math.sin(CAL_A) * 0.05, z],
          [cx - 0.03, cy + 0.09, z - sz * 0.08],
          [cx - 0.05, cy + 0.13, z - sz * 0.2],
        ]}
        r={0.009}
        seg={10}
        radial={6}
      >
        <PMat m="polSteel" color="#c8ccd4" rough={0.35} />
      </Tube>
    </group>
  )
}

export function BrakesMini() {
  const geos = useBrakeGeos()
  const vaneAngles = useMemo(
    () => Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2 + 0.3),
    [],
  )
  const studAngles = useMemo(
    () => Array.from({ length: 5 }, (_, i) => (i / 5) * Math.PI * 2),
    [],
  )
  return (
    <PartGroup id="brakes" perChild>
      {[1.35, -1.35].flatMap((x) =>
        [0.64, -0.64].map((z) => (
          <BrakeCornerMini key={`${x}${z}`} x={x} z={z} g={geos} vanes={vaneAngles} studs={studAngles} />
        )),
      )}
    </PartGroup>
  )
}
