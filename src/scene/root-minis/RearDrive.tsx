/**
 * RearDrive.tsx — compact REAL minis for the ROOT car view: transmission,
 * driveshaft, differential and the full exhaust path. Each component keeps
 * the exact PartGroup id + explode vector of the schematic it replaces and
 * sits at the same car coordinates.
 *
 * Budget: whole file ≈ 20k triangles — segments ≤ 20, tube radial ≤ 10.
 * Every visible surface is <PMat/> so PartGroup hover/select/dim works.
 */
import * as THREE from 'three'
import type { GroupProps } from '@react-three/fiber'
import { PartGroup } from '../lib'
import { Lathe, PMat, RBox, Tube } from '../realism'

const TAU = Math.PI * 2

/* ------------------------------ tiny helpers ------------------------------ */

/** U-joint cross: two crossing trunnion cylinders + 4 visible bearing caps. */
function UCross(props: GroupProps) {
  return (
    <group {...props}>
      {/* trunnions along local Y and Z */}
      <mesh>
        <cylinderGeometry args={[0.011, 0.011, 0.1, 8]} />
        <PMat m="forged" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.1, 8]} />
        <PMat m="forged" />
      </mesh>
      {/* 4 bearing caps */}
      {([1, -1] as const).map((s) => (
        <mesh key={`y${s}`} position={[0, s * 0.05, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.014, 10]} />
          <PMat m="polSteel" />
        </mesh>
      ))}
      {([1, -1] as const).map((s) => (
        <mesh key={`z${s}`} position={[0, 0, s * 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.014, 10]} />
          <PMat m="polSteel" />
        </mesh>
      ))}
    </group>
  )
}

/** One yoke half straddling a cross at local x: collar + two ears along y|z. */
function YokeHalf({ x, dir, axis }: { x: number; dir: 1 | -1; axis: 'y' | 'z' }) {
  return (
    <group>
      <mesh position={[x + dir * 0.085, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.044, 0.044, 0.04, 12]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      {([1, -1] as const).map((s) => (
        <mesh
          key={s}
          position={axis === 'y' ? [x + dir * 0.04, s * 0.034, 0] : [x + dir * 0.04, 0, s * 0.034]}
        >
          <boxGeometry args={axis === 'y' ? [0.095, 0.016, 0.028] : [0.095, 0.028, 0.016]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
      ))}
    </group>
  )
}

/* ============================== TRANSMISSION =============================== */
/** Bell joint ≈ (1.02, 0.40, 0), tail/output yoke ends at world x ≈ 0.25. */
export function TransmissionMini() {
  return (
    <PartGroup id="transmission" explode={[0, 0.8, 0.6]}>
      <group position={[-1.7, 0.35, 0]} scale={0.85}>
        {/* bellhousing — tapered, mating face toward the engine (+X) */}
        <Lathe
          pts={[
            [0.205, 0],
            [0.215, 0.012],
            [0.21, 0.045],
            [0.176, 0.125],
            [0.17, 0.14],
          ]}
          seg={20}
          rotation={[0, 0, Math.PI / 2]}
        >
          <PMat m="castAlu" e={0.05} />
        </Lathe>
        {/* mating flange ring at the engine joint */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.208, 0.008, 6, 20]} />
          <PMat m="machAlu" e={0.05} />
        </mesh>
        {/* ribbed main case (3 rib rings) tapering into the tail housing */}
        <Lathe
          pts={[
            [0.165, 0.14],
            [0.159, 0.2],
            [0.173, 0.208],
            [0.173, 0.228],
            [0.155, 0.236],
            [0.146, 0.32],
            [0.16, 0.328],
            [0.16, 0.348],
            [0.142, 0.356],
            [0.134, 0.44],
            [0.147, 0.448],
            [0.147, 0.468],
            [0.128, 0.476],
            [0.124, 0.56],
            [0.12, 0.62],
            [0.085, 0.7],
            [0.06, 0.745],
            [0.056, 0.762],
            [0.04, 0.766],
            [0.032, 0.77],
          ]}
          seg={20}
          rotation={[0, 0, Math.PI / 2]}
        >
          <PMat m="castAlu" e={0.05} />
        </Lathe>
        {/* output yoke stub out of the tail housing (slip-yoke seat) */}
        <mesh position={[-0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.06, 10]} />
          <PMat m="polSteel" />
        </mesh>
        {/* two side mount pads */}
        {([1, -1] as const).map((s) => (
          <RBox
            key={s}
            args={[0.1, 0.05, 0.05]}
            radius={0.012}
            smoothness={2}
            position={[-0.42, -0.1, s * 0.17]}
          >
            <PMat m="blackCast" e={0.04} />
          </RBox>
        ))}
        {/* drain plug hex dot under the case */}
        <mesh position={[-0.35, -0.152, 0]}>
          <cylinderGeometry args={[0.016, 0.016, 0.016, 6]} />
          <PMat m="zincGold" e={0.06} />
        </mesh>
        {/* shifter stub on top */}
        <mesh position={[-0.6, 0.19, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
          <PMat m="steel" />
        </mesh>
        <mesh position={[-0.6, 0.275, 0]}>
          <sphereGeometry args={[0.022, 10, 8]} />
          <PMat m="rubber" e={0.04} />
        </mesh>
      </group>
    </PartGroup>
  )
}

/* =============================== DRIVESHAFT ================================ */
/** Front u-joint at (0.25, 0.40, 0), rear u-joint at (−1.18, 0.35, 0). */
const DS_LEN = Math.hypot(1.43, 0.05)
const DS_TILT = Math.atan2(0.05, 1.43)

export function DriveshaftMini() {
  return (
    <PartGroup id="driveshaft" explode={[0, 0.6, -0.6]}>
      <group position={[-1.18, 0.3, 0]} rotation={[0, 0, DS_TILT]} scale={0.4}>
        {/* polished main tube */}
        <mesh position={[-0.725, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.25, 14]} />
          <PMat m="polSteel" e={0.05} />
        </mesh>
        {/* weld rings at both tube ends */}
        {[-0.105, -1.345].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.043, 0.006, 6, 16]} />
            <PMat m="steel" rough={0.5} />
          </mesh>
        ))}
        {/* balance weight plate tacked to the tube */}
        <mesh position={[-1.05, 0.042, 0]}>
          <boxGeometry args={[0.055, 0.008, 0.05]} />
          <PMat m="steel" rough={0.45} />
        </mesh>
        {/* front u-joint: shaft yoke + slip yoke into the transmission */}
        <UCross />
        <YokeHalf x={0} dir={-1} axis="y" />
        <YokeHalf x={0} dir={1} axis="z" />
        {/* rear u-joint: shaft yoke + pinion-flange yoke */}
        <UCross position={[-DS_LEN, 0, 0]} />
        <YokeHalf x={-DS_LEN} dir={1} axis="y" />
        <YokeHalf x={-DS_LEN} dir={-1} axis="z" />
      </group>
    </PartGroup>
  )
}

/* ============================== DIFFERENTIAL =============================== */
/** Housing at (−1.35, 0.34, 0); axle tubes out to z ±0.62. */
export function DifferentialMini() {
  return (
    <PartGroup id="differential" explode={[-1.0, 0.3, 0]}>
      <group position={[-1.35, 0.34, 0]}>
        {/* sphere-ish housing; 4 cooling fin rings on the rear cover (−X) */}
        <Lathe
          pts={[
            [0.03, -0.14],
            [0.08, -0.13],
            [0.125, -0.09],
            [0.15, -0.03],
            [0.153, 0.02],
            [0.148, 0.045],
            [0.16, 0.052],
            [0.132, 0.06],
            [0.154, 0.07],
            [0.126, 0.078],
            [0.148, 0.088],
            [0.118, 0.096],
            [0.14, 0.106],
            [0.105, 0.115],
            [0.07, 0.13],
            [0.02, 0.135],
          ]}
          seg={20}
          rotation={[0, 0, Math.PI / 2]}
        >
          <PMat m="iron" e={0.05} />
        </Lathe>
        {/* 8-bolt cover circle on the rear-cover flange */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * TAU
          return (
            <mesh
              key={i}
              position={[-0.045, Math.cos(a) * 0.145, Math.sin(a) * 0.145]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.011, 0.011, 0.024, 6]} />
              <PMat m="zincGold" e={0.06} />
            </mesh>
          )
        })}
        {/* pinion nose toward the driveshaft (+X) with companion flange */}
        <mesh position={[0.15, 0.005, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.052, 0.042, 0.1, 14]} />
          <PMat m="iron" e={0.05} />
        </mesh>
        <mesh position={[0.21, 0.005, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.062, 0.062, 0.018, 14]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
        {/* axle tubes to z ±0.62 with CV/flange hints at the hubs */}
        {([1, -1] as const).map((s) => (
          <group key={s}>
            <mesh position={[0, 0, s * 0.37]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={s === 1 ? [0.03, 0.034, 0.5, 10] : [0.034, 0.03, 0.5, 10]} />
              <PMat m="iron" e={0.04} />
            </mesh>
            <mesh position={[0, 0, s * 0.585]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.044, 0.044, 0.03, 12]} />
              <PMat m="machAlu" e={0.05} />
            </mesh>
            <mesh position={[0, 0, s * 0.613]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.052, 0.052, 0.012, 12]} />
              <PMat m="steel" rough={0.35} />
            </mesh>
          </group>
        ))}
        {/* breather nub on top */}
        <mesh position={[0, 0.158, 0.04]}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 6]} />
          <PMat m="brass" e={0.06} />
        </mesh>
      </group>
    </PartGroup>
  )
}

/* ================================= EXHAUST ================================= */
/** Full pollution path: turbo (1.28, 0.51, 0.25) → downpipe + flex → cat →
 *  mid pipe → resonator → muffler → twin polished tips at x −2.25. */
export function ExhaustMini() {
  return (
    <PartGroup id="exhaust" explode={[-0.2, 0.45, 1.2]}>
      <group position={[-1.05, 0.03, 0]}>
      {/* downpipe off the turbo, curving down and back */}
      <Tube
        path={[
          [1.28, 0.51, 0.25],
          [1.16, 0.4, 0.28],
          [0.98, 0.26, 0.31],
          [0.78, 0.175, 0.34],
          [0.6, 0.16, 0.35],
        ]}
        r={0.042}
        seg={20}
        radial={10}
      >
        <PMat m="steel" color="#9a6a3a" e={0.08} rough={0.38} />
      </Tube>
      {/* connector under the flex section, into the cat inlet */}
      <mesh position={[0.485, 0.16, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, 0.24, 10]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      {/* braided flex section — 5 stacked tori */}
      {[0.56, 0.535, 0.51, 0.485, 0.46].map((x) => (
        <mesh key={x} position={[x, 0.16, 0.35]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.048, 0.009, 6, 14]} />
          <PMat m="machAlu" rough={0.5} e={0.05} />
        </mesh>
      ))}
      {/* catalytic converter — fat oval body (flattened via scale) */}
      <Lathe
        pts={[
          [0.044, 0],
          [0.085, 0.055],
          [0.085, 0.25],
          [0.044, 0.3],
          [0.04, 0.305],
        ]}
        seg={20}
        position={[0.37, 0.16, 0.35]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.75, 1, 1.2]}
      >
        <PMat m="steel" rough={0.42} e={0.05} />
      </Lathe>
      {/* 2 heat-shield bands around the cat */}
      {[0.28, 0.15].map((x) => (
        <mesh
          key={x}
          position={[x, 0.16, 0.35]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[1.2, 0.75, 1]}
        >
          <torusGeometry args={[0.093, 0.007, 6, 18]} />
          <PMat m="machAlu" e={0.06} />
        </mesh>
      ))}
      {/* O2 sensor stub + wire on the cat shoulder */}
      <mesh position={[0.3, 0.245, 0.33]}>
        <cylinderGeometry args={[0.011, 0.011, 0.04, 6]} />
        <PMat m="brass" e={0.08} />
      </mesh>
      <Tube
        path={[
          [0.3, 0.265, 0.33],
          [0.33, 0.3, 0.3],
          [0.32, 0.34, 0.26],
        ]}
        r={0.004}
        seg={8}
        radial={5}
      >
        <PMat m="rubber" color="#23262c" e={0.04} />
      </Tube>
      {/* mid pipe */}
      <mesh position={[-0.2775, 0.16, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.036, 0.036, 0.685, 10]} />
        <PMat m="steel" color="#8d99ae" rough={0.4} e={0.05} />
      </mesh>
      {/* resonator — slim case */}
      <Lathe
        pts={[
          [0.038, 0],
          [0.06, 0.04],
          [0.06, 0.32],
          [0.038, 0.36],
        ]}
        seg={16}
        position={[-0.62, 0.16, 0.35]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <PMat m="steel" color="#8d99ae" rough={0.38} e={0.05} />
      </Lathe>
      {/* over-axle pipe rising into the muffler */}
      <Tube
        path={[
          [-0.97, 0.16, 0.35],
          [-1.2, 0.17, 0.35],
          [-1.5, 0.2, 0.35],
        ]}
        r={0.034}
        seg={10}
        radial={8}
      >
        <PMat m="steel" color="#8d99ae" rough={0.4} e={0.05} />
      </Tube>
      {/* muffler — oval case (flattened via scale) with end cones */}
      <Lathe
        pts={[
          [0.05, 0],
          [0.115, 0.05],
          [0.12, 0.09],
          [0.12, 0.35],
          [0.115, 0.39],
          [0.05, 0.44],
        ]}
        seg={20}
        position={[-1.5, 0.2, 0.35]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.78, 1, 1.25]}
      >
        <PMat m="steel" color="#8d99ae" rough={0.35} e={0.06} />
      </Lathe>
      {/* outlet stubs into the twin tips */}
      <Tube
        path={[
          [-1.92, 0.18, 0.32],
          [-2.02, 0.2, 0.31],
          [-2.13, 0.25, 0.3],
        ]}
        r={0.028}
        seg={10}
        radial={8}
      >
        <PMat m="steel" rough={0.35} e={0.05} />
      </Tube>
      <Tube
        path={[
          [-1.92, 0.18, 0.38],
          [-2.02, 0.2, 0.4],
          [-2.13, 0.25, 0.42],
        ]}
        r={0.028}
        seg={10}
        radial={8}
      >
        <PMat m="steel" rough={0.35} e={0.05} />
      </Tube>
      {/* TWIN polished tips, open ends exiting at x −2.25 */}
      {[0.3, 0.42].map((z) => (
        <Lathe
          key={z}
          pts={[
            [0.034, 0],
            [0.04, 0.004],
            [0.04, 0.12],
            [0.034, 0.12],
            [0.034, 0.01],
          ]}
          seg={14}
          position={[-2.13, 0.25, z]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <PMat m="machAlu" e={0.25} side={THREE.DoubleSide} />
        </Lathe>
      ))}
      {/* 3 rubber hanger hints along the run */}
      {[
        [-0.1, 0.16],
        [-1.1, 0.175],
        [-1.44, 0.2],
      ].map(([x, y]) => (
        <mesh key={x} position={[x, y, 0.35]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.05, 0.009, 5, 12]} />
          <PMat m="rubber" e={0.03} />
        </mesh>
      ))}
      </group>
    </PartGroup>
  )
}
