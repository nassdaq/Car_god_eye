/**
 * Timing drive + oil pump — high-detail procedural models.
 *
 * Absolute stage coordinates. Front of engine = -X; the whole chain drive
 * lives in a vertical YZ plane at x ≈ -0.56, just ahead of the block front
 * face (x = -0.52). Crank axis along X at y 0.32; cam sprockets at y 1.30,
 * z ∓0.20. Oil pump sits inside the crankcase front around (-0.42, 0.26, 0.18).
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PMat, Lathe, Tube, Gear, Bolt, BoltCircle, RBox } from '../realism'

/** Timing plane x */
const TX = -0.56

/* ------------------------------ chain links ------------------------------ */

interface ChainLink {
  pos: [number, number, number]
  /** rotation about X aligning the link with the local tangent in YZ */
  rx: number
  /** every second link gets the wider outer plate */
  outer: boolean
}

/** [y, z] control points of the closed chain path (crank → exhaust → intake). */
const CHAIN_CTRL: [number, number][] = [
  [0.245, 0], // under the crank sprocket
  [0.3, -0.072], // crank wrap, -z exit
  [0.8, -0.21], // mid of fixed-guide run
  [1.295, -0.335], // exhaust cam, outer -z
  [1.435, -0.2], // over the exhaust sprocket
  [1.44, 0], // top span middle
  [1.435, 0.2], // over the intake sprocket
  [1.295, 0.335], // intake cam, outer +z
  [0.8, 0.19], // mid of tensioner run (shoe pushes it in)
  [0.3, 0.072], // crank wrap, +z entry
]

const LINK_COUNT = 76

function useChainLinks(): ChainLink[] {
  return useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      CHAIN_CTRL.map(([y, z]) => new THREE.Vector3(TX, y, z)),
      true,
      'catmullrom',
      0.5,
    )
    const pts = curve.getSpacedPoints(LINK_COUNT) // closed → last === first
    const links: ChainLink[] = []
    for (let i = 0; i < LINK_COUNT; i++) {
      const p = pts[i]
      const q = pts[i + 1]
      links.push({
        pos: [TX, p.y, p.z],
        rx: Math.atan2(q.z - p.z, q.y - p.y),
        outer: i % 2 === 1,
      })
    }
    return links
  }, [])
}

/* ------------------------------ timing drive ----------------------------- */

export function TimingReal() {
  const links = useChainLinks()

  // slope of the two straight runs (for shoe / backing-strip tilt)
  const runNeg = Math.atan2(-0.263, 0.995) // fixed-guide side (-z)
  const runPos = Math.atan2(0.248, 0.995) // tensioner side (+z)

  return (
    <group>
      {/* ------- crank sprocket (19T) ------- */}
      <Gear
        teeth={19}
        rRoot={0.055}
        rTip={0.068}
        h={0.022}
        hole={0.03}
        position={[TX, 0.32, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="polSteel" />
      </Gear>
      {/* crank nose hub through the sprocket */}
      <mesh position={[TX, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.029, 0.029, 0.05, 24]} />
        <PMat m="steel" />
      </mesh>

      {/* ------- exhaust cam sprocket (-z, 38T) ------- */}
      <Gear
        teeth={38}
        rRoot={0.115}
        rTip={0.128}
        h={0.022}
        hole={0.04}
        position={[TX, 1.3, -0.2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="steel" />
      </Gear>
      {/* exhaust cam hub + retaining bolt */}
      <mesh position={[-0.575, 1.3, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.038, 0.025, 24]} />
        <PMat m="machAlu" />
      </mesh>
      <Bolt position={[-0.588, 1.3, -0.2]} rotation={[0, 0, Math.PI / 2]} r={0.009} len={0.03} />

      {/* ------- intake cam sprocket (+z, 38T) with VVT phaser ------- */}
      <Gear
        teeth={38}
        rRoot={0.115}
        rTip={0.128}
        h={0.022}
        hole={0.04}
        position={[TX, 1.3, 0.2]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="steel" />
      </Gear>
      {/* phaser drum on the sprocket's front face (machined aluminum) */}
      <Lathe
        pts={[
          [0.001, 0],
          [0.085, 0],
          [0.085, 0.008],
          [0.078, 0.008],
          [0.078, 0.037],
          [0.085, 0.037],
          [0.085, 0.045],
          [0.03, 0.045],
          [0.001, 0.045],
        ]}
        position={[-0.616, 1.3, 0.2]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <PMat m="machAlu" />
      </Lathe>
      {/* 5 phaser cover bolts, heads facing front (-X) */}
      <BoltCircle
        n={5}
        radius={0.055}
        r={0.006}
        len={0.025}
        position={[-0.614, 1.3, 0.2]}
        rotation={[0, 0, Math.PI / 2]}
      />
      {/* central cam bolt */}
      <Bolt position={[-0.618, 1.3, 0.2]} rotation={[0, 0, Math.PI / 2]} r={0.009} len={0.035} />
      {/* 3 shallow radial slots hinting the vane mechanism */}
      {[Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3].map(
        (a, i) => (
          <RBox
            key={i}
            args={[0.004, 0.045, 0.012]}
            radius={0.0015}
            smoothness={1}
            position={[-0.619, 1.3 + Math.cos(a) * 0.052, 0.2 + Math.sin(a) * 0.052]}
            rotation={[a, 0, 0]}
          >
            <PMat color="#14161a" metal={0.3} rough={0.8} env={0.2} />
          </RBox>
        ),
      )}

      {/* ------- chain: ~76 individual links on the closed path ------- */}
      {links.map((l, i) => (
        <RBox
          key={i}
          args={l.outer ? [0.012, 0.022, 0.012] : [0.012, 0.02, 0.008]}
          radius={0.002}
          smoothness={1}
          position={l.pos}
          rotation={[l.rx, 0, 0]}
        >
          <PMat m={l.outer ? 'forged' : 'steel'} />
        </RBox>
      ))}

      {/* ------- fixed guide, -z run: nylon rail + steel backing strip ------- */}
      <Tube
        path={[
          [TX, 0.38, -0.08],
          [TX, 0.7, -0.163],
          [TX, 1.0, -0.242],
          [TX, 1.25, -0.305],
        ]}
        r={0.012}
        seg={32}
        radial={10}
      >
        <PMat m="nylon" />
      </Tube>
      <RBox
        args={[0.018, 0.95, 0.008]}
        radius={0.003}
        smoothness={1}
        position={[TX, 0.815, -0.188]}
        rotation={[runNeg, 0, 0]}
      >
        <PMat m="machAlu" />
      </RBox>
      {/* guide mounting bolts into the block face */}
      <Bolt position={[-0.545, 0.46, -0.1]} rotation={[0, 0, Math.PI / 2]} r={0.007} len={0.03} />
      <Bolt position={[-0.545, 1.18, -0.285]} rotation={[0, 0, Math.PI / 2]} r={0.007} len={0.03} />

      {/* ------- tensioner side, +z run: nylon shoe + hydraulic tensioner ------- */}
      <RBox
        args={[0.024, 0.85, 0.02]}
        radius={0.004}
        smoothness={1}
        position={[TX, 0.8, 0.175]}
        rotation={[runPos, 0, 0]}
      >
        <PMat m="nylon" />
      </RBox>
      {/* hydraulic tensioner body, bolted to the block face, axis along Z */}
      <Lathe
        pts={[
          [0.001, 0],
          [0.03, 0],
          [0.03, 0.07],
          [0.024, 0.07],
          [0.024, 0.09],
          [0.001, 0.09],
        ]}
        position={[-0.54, 0.75, 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <PMat m="castAlu" />
      </Lathe>
      {/* polished piston pressing the shoe */}
      <mesh position={[-0.54, 0.75, 0.195]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.055, 14]} />
        <PMat m="polSteel" />
      </mesh>
      {/* tensioner mounting flange + bolts */}
      <RBox
        args={[0.022, 0.085, 0.025]}
        radius={0.004}
        smoothness={1}
        position={[-0.541, 0.75, 0.302]}
      >
        <PMat m="castAlu" />
      </RBox>
      <Bolt position={[-0.552, 0.714, 0.302]} rotation={[0, 0, Math.PI / 2]} r={0.006} len={0.025} />
      <Bolt position={[-0.552, 0.786, 0.302]} rotation={[0, 0, Math.PI / 2]} r={0.006} len={0.025} />

      {/* ------- top span damper rail between the cam sprockets ------- */}
      <RBox args={[0.03, 0.014, 0.3]} radius={0.004} smoothness={1} position={[TX, 1.458, 0]}>
        <PMat m="nylon" />
      </RBox>
      <RBox args={[0.024, 0.008, 0.3]} radius={0.003} smoothness={1} position={[TX, 1.469, 0]}>
        <PMat m="steel" />
      </RBox>
    </group>
  )
}

/* -------------------------------- oil pump ------------------------------- */

export function OilPumpReal() {
  return (
    <group>
      {/* ------- pump housing: cast disc, axis along X, recessed front bore ------- */}
      <Lathe
        pts={[
          [0.001, 0.012],
          [0.08, 0.012],
          [0.08, 0],
          [0.09, 0],
          [0.095, 0.01],
          [0.095, 0.06],
          [0.085, 0.07],
          [0.001, 0.07],
        ]}
        position={[-0.455, 0.26, 0.18]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <PMat m="castAlu" />
      </Lathe>
      {/* cover ring (open center shows the gerotor), 5 zinc bolts along X */}
      <Lathe
        pts={[
          [0.075, 0],
          [0.095, 0],
          [0.095, 0.012],
          [0.075, 0.012],
          [0.075, 0],
        ]}
        position={[-0.467, 0.26, 0.18]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <PMat m="machAlu" />
      </Lathe>
      <BoltCircle
        n={5}
        radius={0.085}
        r={0.005}
        len={0.02}
        position={[-0.467, 0.26, 0.18]}
        rotation={[0, 0, Math.PI / 2]}
      />

      {/* ------- visible gerotor: inner 6-lobe rotor eccentric in outer ring ------- */}
      <Gear
        teeth={6}
        rRoot={0.045}
        rTip={0.062}
        h={0.03}
        hole={0.014}
        position={[-0.457, 0.272, 0.18]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="polSteel" />
      </Gear>
      <Lathe
        pts={[
          [0.07, 0],
          [0.078, 0],
          [0.078, 0.03],
          [0.07, 0.03],
          [0.07, 0],
        ]}
        position={[-0.472, 0.26, 0.18]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <PMat m="steel" side={THREE.DoubleSide} />
      </Lathe>

      {/* ------- pressure-relief: brass hex plug on the housing edge ------- */}
      <mesh position={[-0.42, 0.155, 0.18]}>
        <cylinderGeometry args={[0.014, 0.014, 0.02, 6]} />
        <PMat m="brass" />
      </mesh>
      <mesh position={[-0.42, 0.168, 0.18]}>
        <cylinderGeometry args={[0.017, 0.017, 0.006, 16]} />
        <PMat m="brass" />
      </mesh>

      {/* ------- pickup tube curving down/back to the strainer ------- */}
      <Tube
        path={[
          [-0.42, 0.22, 0.18],
          [-0.4, 0.14, 0.17],
          [-0.28, 0.1, 0.155],
          [-0.12, 0.09, 0.14],
        ]}
        r={0.016}
        seg={32}
        radial={12}
      >
        <PMat m="steel" />
      </Tube>
      {/* strainer: flat drum with a dark mesh face looking down into the pan */}
      <Lathe
        pts={[
          [0.001, 0],
          [0.065, 0],
          [0.07, 0.008],
          [0.07, 0.025],
          [0.001, 0.025],
        ]}
        position={[-0.12, 0.065, 0.14]}
      >
        <PMat m="steel" />
      </Lathe>
      <mesh position={[-0.12, 0.063, 0.14]}>
        <cylinderGeometry args={[0.06, 0.06, 0.004, 32]} />
        <PMat color="#101216" metal={0.4} rough={0.85} env={0.2} />
      </mesh>

      {/* ------- spin-on oil filter on the block side, axis along Z ------- */}
      <Lathe
        pts={[
          [0.001, 0],
          [0.045, 0],
          [0.052, 0.01],
          [0.052, 0.085],
          [0.045, 0.1],
          [0.03, 0.108],
          [0.001, 0.11],
        ]}
        position={[-0.25, 0.45, 0.315]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <PMat color="#2a5c9e" metal={0.6} rough={0.35} env={0.8} />
      </Lathe>
      {/* knurl ring near the base (low-seg torus reads as grip ridges) */}
      <mesh position={[-0.25, 0.45, 0.345]}>
        <torusGeometry args={[0.054, 0.005, 6, 12]} />
        <PMat color="#234e87" metal={0.6} rough={0.4} env={0.8} />
      </mesh>
      {/* base sealing ring against the block */}
      <mesh position={[-0.25, 0.45, 0.317]}>
        <torusGeometry args={[0.046, 0.004, 8, 24]} />
        <PMat m="rubber" />
      </mesh>
    </group>
  )
}
