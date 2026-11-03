/**
 * Crank.tsx — photoreal forged crankshaft + flywheel for the teardown engine.
 *
 * Stage frame: crank axis along X at y=0.32, z=0. FRONT = -X (damper), REAR = +X
 * (flywheel). Rod journal x positions (-0.375, -0.125, +0.125, +0.375) and their
 * ±0.09 y offsets are a hard contract with the piston/rod models — do not move.
 *
 * Plain <group> geometry, absolute stage coordinates, every material is <PMat/>.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { Bolt, BoltCircle, Gear, Lathe, PMat } from '../realism'

const CRANK_Y = 0.32
const deg = THREE.MathUtils.degToRad

/* ------------------------------ crank layout ------------------------------ */

const MAIN_X = [-0.5, -0.25, 0, 0.25, 0.5]
const THROWS: { x: number; up: 1 | -1 }[] = [
  { x: -0.375, up: 1 },
  { x: -0.125, up: -1 },
  { x: 0.125, up: -1 },
  { x: 0.375, up: 1 },
]

/** Main journal: r 0.045 raised center band, fillet steps at the web ends. */
const MAIN_PTS: [number, number][] = [
  [0.001, -0.04],
  [0.0405, -0.04],
  [0.0405, -0.036],
  [0.045, -0.03],
  [0.045, 0.03],
  [0.0405, 0.036],
  [0.0405, 0.04],
  [0.001, 0.04],
]

/** Rod journal: r 0.04, width 0.07, filleted into the flanking webs. */
const ROD_PTS: [number, number][] = [
  [0.001, -0.035],
  [0.036, -0.035],
  [0.036, -0.031],
  [0.04, -0.026],
  [0.04, 0.026],
  [0.036, 0.031],
  [0.036, 0.035],
  [0.001, 0.035],
]

/**
 * Nose stepped shaft, local y → world x (group at x=-0.58, rot z=-90°):
 * bolt stub r0.015 → damper seat r0.020 → sprocket seat r0.026 → seal journal
 * r0.034, butting main #1 at world x=-0.54.
 */
const NOSE_PTS: [number, number][] = [
  [0.001, -0.026],
  [0.015, -0.026],
  [0.015, -0.016],
  [0.02, -0.014],
  [0.02, 0.012],
  [0.026, 0.014],
  [0.026, 0.026],
  [0.034, 0.028],
  [0.034, 0.04],
  [0.001, 0.04],
]

/** Damper hub: bolt boss + web disc out to r 0.080 (rubber bond face). */
const DAMPER_HUB_PTS: [number, number][] = [
  [0.019, -0.027],
  [0.034, -0.027],
  [0.036, -0.017],
  [0.076, -0.017],
  [0.08, -0.013],
  [0.08, 0.013],
  [0.076, 0.017],
  [0.02, 0.017],
]

/** Damper inertia ring: r 0.086→0.112 with 3 shallow belt-groove ridges. */
const DAMPER_RING_PTS: [number, number][] = [
  [0.086, -0.021],
  [0.11, -0.021],
  [0.112, -0.017],
  [0.112, -0.012],
  [0.107, -0.009],
  [0.112, -0.006],
  [0.107, -0.003],
  [0.112, 0],
  [0.107, 0.003],
  [0.112, 0.006],
  [0.112, 0.017],
  [0.11, 0.021],
  [0.086, 0.021],
]

/** Rear flange: boss off main #5 then disc r 0.075, rear face at world x=0.60. */
const FLANGE_PTS: [number, number][] = [
  [0.001, -0.04],
  [0.042, -0.04],
  [0.042, -0.004],
  [0.075, -0.002],
  [0.075, 0.02],
  [0.001, 0.02],
]

/**
 * Counterweight web silhouette in the YZ plane (shape built with the rod-journal
 * boss at +y, counterweight lobe at -y; down-throws flip the group by π on X).
 * Fat ~140° sector lobe (outer r 0.14) merged with a narrow cheek boss (r 0.055)
 * wrapping the rod journal at (0, 0.09); straight flanks connect the two arcs.
 */
function useWebGeo() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.absarc(0, 0, 0.14, deg(200), deg(340), false) // counterweight lobe
    s.absarc(0, 0.09, 0.055, deg(-20), deg(200), false) // journal cheek boss
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 1,
      curveSegments: 20,
    })
    g.translate(0, 0, -0.035 / 2) // center along the extrusion (crank) axis
    return g
  }, [])
}

/* ------------------------------- CrankReal -------------------------------- */

export function CrankReal() {
  const webGeo = useWebGeo()
  return (
    <group position={[0, CRANK_Y, 0]}>
      {/* 5 main journals on the axis */}
      {MAIN_X.map((x) => (
        <Lathe key={`main${x}`} pts={MAIN_PTS} rotation={[0, 0, -Math.PI / 2]} position={[x, 0, 0]}>
          <PMat m="polSteel" />
        </Lathe>
      ))}

      {/* 4 throws: rod journal + flanking counterweight webs + oil drilling */}
      {THROWS.map(({ x, up }) => (
        <group key={`throw${x}`}>
          <Lathe pts={ROD_PTS} rotation={[0, 0, -Math.PI / 2]} position={[x, up * 0.09, 0]}>
            <PMat m="polSteel" />
          </Lathe>
          {/* oil hole drilled at an angle across the journal face */}
          <mesh position={[x, up * 0.09, 0]} rotation={[0.3, 0, 0.66]}>
            <cylinderGeometry args={[0.006, 0.006, 0.11, 10]} />
            <PMat m="blackCast" color="#111317" rough={0.9} e={0.02} />
          </mesh>
          {/* twin webs — counterweight mass opposite the journal offset */}
          {[-0.06, 0.06].map((dx) => (
            <group
              key={`web${dx}`}
              position={[x + dx, 0, 0]}
              rotation={[up > 0 ? 0 : Math.PI, 0, 0]}
            >
              <mesh geometry={webGeo} rotation={[0, Math.PI / 2, 0]}>
                <PMat m="forged" />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* nose: stepped seal journal / sprocket seat / damper seat / bolt stub */}
      <Lathe pts={NOSE_PTS} rotation={[0, 0, -Math.PI / 2]} position={[-0.58, 0, 0]}>
        <PMat m="polSteel" />
      </Lathe>
      {/* keyway block on the sprocket seat */}
      <mesh position={[-0.56, 0.0285, 0]}>
        <boxGeometry args={[0.011, 0.007, 0.009]} />
        <PMat m="steel" />
      </mesh>

      {/* harmonic damper pulley */}
      <group position={[-0.585, 0, 0]}>
        <Lathe pts={DAMPER_HUB_PTS} rotation={[0, 0, -Math.PI / 2]}>
          <PMat m="iron" />
        </Lathe>
        <Lathe pts={DAMPER_RING_PTS} rotation={[0, 0, -Math.PI / 2]}>
          <PMat m="iron" />
        </Lathe>
        {/* elastomer bond ring in the hub/ring gap */}
        <mesh position={[-0.002, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.083, 0.005, 8, 48]} />
          <PMat m="rubber" />
        </mesh>
      </group>
      {/* center damper bolt, head facing front (-X) */}
      <Bolt position={[-0.61, 0, 0]} rotation={[0, 0, Math.PI / 2]} r={0.012} len={0.05} m="zincGold" />

      {/* rear flange with flywheel bolt-hole hints */}
      <Lathe pts={FLANGE_PTS} rotation={[0, 0, -Math.PI / 2]} position={[0.58, 0, 0]}>
        <PMat m="polSteel" />
      </Lathe>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh
            key={`fh${i}`}
            position={[0.5995, Math.cos(a) * 0.052, Math.sin(a) * 0.052]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.008, 0.008, 0.008, 14]} />
            <PMat m="blackCast" color="#111317" rough={0.9} e={0.02} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ------------------------------ FlywheelReal ------------------------------ */

/**
 * Flywheel body, local y → world x (group at x=0.66, rot z=-90°):
 * long hub boss toward the crank flange, thin web, thick outer rim (width
 * 0.055, outer r 0.290 = ring-gear bore), flat rear friction side.
 */
const FLYWHEEL_PTS: [number, number][] = [
  [0.001, -0.055],
  [0.088, -0.055],
  [0.088, -0.012],
  [0.23, -0.01],
  [0.23, -0.0275],
  [0.29, -0.0275],
  [0.29, 0.0275],
  [0.001, 0.0275],
]

/** Ground clutch friction ring, slightly proud of the rear face, r 0.14→0.27. */
const FRICTION_PTS: [number, number][] = [
  [0.14, 0.0272],
  [0.27, 0.0272],
  [0.27, 0.032],
  [0.14, 0.032],
  [0.14, 0.0272],
]

export function FlywheelReal() {
  return (
    <group position={[0.66, CRANK_Y, 0]}>
      {/* stepped cast-iron disc */}
      <Lathe pts={FLYWHEEL_PTS} rotation={[0, 0, -Math.PI / 2]}>
        <PMat m="iron" />
      </Lathe>

      {/* polished clutch friction face on the +X side */}
      <Lathe pts={FRICTION_PTS} rotation={[0, 0, -Math.PI / 2]}>
        <PMat m="polSteel" rough={0.1} />
      </Lathe>

      {/* shrink-fit starter ring gear around the rim */}
      <Gear teeth={60} rRoot={0.295} rTip={0.315} h={0.03} hole={0.29} rotation={[0, Math.PI / 2, 0]}>
        <PMat m="zincGold" color="#b5a06a" rough={0.35} env={0.9} />
      </Gear>

      {/* 6 crank bolts on the rear hub face, heads facing +X */}
      <BoltCircle
        n={6}
        radius={0.08}
        r={0.012}
        len={0.03}
        m="zincGold"
        position={[0.0275, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      />

      {/* 6 drilled lightening holes on the front web */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((i + 0.5) / 6) * Math.PI * 2
        return (
          <mesh
            key={`lh${i}`}
            position={[0.002, Math.cos(a) * 0.185, Math.sin(a) * 0.185]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.031, 20]} />
            <PMat m="blackCast" color="#15181d" rough={0.9} e={0.02} />
          </mesh>
        )
      })}
    </group>
  )
}
