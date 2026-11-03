/**
 * Electrics.tsx — ignition coils, alternator + serpentine belt, starter motor.
 *
 * Stage frame: crank axis along X at y=0.32, z=0. FRONT = -X, REAR = +X.
 * Cylinder stations x = -0.375 … +0.375; cam-cover top y ≈ 1.36 with plug
 * recesses (r 0.028) at the stations; damper belt plane x = -0.585; flywheel
 * ring gear at x = 0.66, tip r 0.315.
 *
 * Plain <group> geometry, absolute stage coordinates, every material <PMat/>.
 */
import { useMemo } from 'react'
import { Bolt, Gear, Lathe, PMat, RBox, Tube } from '../realism'

/** Spark-plug / coil stations along the crank axis. */
const STATIONS = [-0.375, -0.125, 0.125, 0.375] as const

type P3 = [number, number, number]

/* ================================ COILS ================================== */

/** Corrugation-ring x positions along the main loom. */
const LOOM_RINGS = [-0.36, -0.22, -0.05, 0.1, 0.24, 0.38] as const

export function CoilsReal() {
  /** Main loom along the cover top at z ≈ 0.118, ending at the rear connector. */
  const loomPath = useMemo<P3[]>(
    () => [
      [-0.45, 1.372, 0.118],
      [-0.3, 1.375, 0.118],
      [0, 1.3755, 0.118],
      [0.3, 1.375, 0.118],
      [0.45, 1.373, 0.118],
    ],
    [],
  )

  /** Short branches curving from the loom down to each coil connector. */
  const branchPaths = useMemo<P3[][]>(
    () =>
      STATIONS.map((x) => [
        [x + 0.05, 1.374, 0.118],
        [x + 0.028, 1.383, 0.104],
        [x + 0.008, 1.389, 0.09],
        [x, 1.389, 0.084],
      ]),
    [],
  )

  return (
    <group>
      {STATIONS.map((x, i) => (
        <group key={`coil-${x}`}>
          {/* puck head sitting on the cover */}
          <RBox args={[0.07, 0.05, 0.09]} radius={0.01} smoothness={2} position={[x, 1.388, 0]}>
            <PMat m="blackCast" />
          </RBox>

          {/* rubber boot dropping into the plug-tube recess (recess r 0.028) */}
          <mesh position={[x, 1.315, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.1, 20]} />
            <PMat m="rubber" />
          </mesh>
          {/* boot seal bulge where it enters the cover */}
          <mesh position={[x, 1.366, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.024, 0.004, 6, 24]} />
            <PMat m="rubber" />
          </mesh>

          {/* connector block on the +z (loom) side */}
          <RBox
            args={[0.036, 0.03, 0.04]}
            radius={0.006}
            smoothness={2}
            position={[x, 1.388, 0.062]}
          >
            <PMat m="blackCast" />
          </RBox>
          {/* molded clip ridge on top of the connector */}
          <RBox args={[0.03, 0.005, 0.03]} radius={0.002} smoothness={2} position={[x, 1.4055, 0.062]}>
            <PMat m="blackCast" />
          </RBox>
          {/* 2 tiny terminal pin dots in the connector face */}
          {[-0.011, 0.011].map((dx) => (
            <mesh key={`pin-${dx}`} position={[x + dx, 1.385, 0.083]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.0025, 0.0025, 0.008, 8]} />
              <PMat m="zincGold" />
            </mesh>
          ))}

          {/* small steel hold-down bolt beside the coil */}
          <Bolt position={[x + 0.048, 1.362, -0.018]} r={0.007} len={0.025} m="steel" />

          {/* harness branch to this coil */}
          <Tube path={branchPaths[i]} r={0.009} seg={20} radial={8}>
            <PMat m="rubber" />
          </Tube>
        </group>
      ))}

      {/* main harness loom along the cover */}
      <Tube path={loomPath} r={0.014} seg={40} radial={10}>
        <PMat m="rubber" />
      </Tube>

      {/* corrugated-conduit look: thin rings spaced along the loom */}
      {LOOM_RINGS.map((rx) => (
        <mesh key={`ring-${rx}`} position={[rx, 1.3748, 0.118]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.0145, 0.0035, 6, 20]} />
          <PMat m="rubber" />
        </mesh>
      ))}

      {/* gray main connector block at the rear end of the loom */}
      <RBox args={[0.05, 0.04, 0.05]} radius={0.008} smoothness={2} position={[0.47, 1.382, 0.118]}>
        <PMat m="castAlu" color="#777d85" metal={0.4} rough={0.6} />
      </RBox>
      <Bolt position={[0.458, 1.402, 0.105]} r={0.005} len={0.018} m="steel" />
      <Bolt position={[0.482, 1.402, 0.131]} r={0.005} len={0.018} m="steel" />
    </group>
  )
}

/* ============================== ALTERNATOR =============================== */

const ALT_C: P3 = [-0.47, 0.88, 0.42]

/** Front end shell (local y → world x via rot z=-90°): nose toward the pulley. */
const ALT_FRONT_PTS: [number, number][] = [
  [0.001, -0.085],
  [0.028, -0.085],
  [0.034, -0.078],
  [0.052, -0.062],
  [0.07, -0.048],
  [0.076, -0.034],
  [0.076, -0.015],
  [0.001, -0.015],
]

/** Rear end shell. */
const ALT_REAR_PTS: [number, number][] = [
  [0.001, 0.02],
  [0.076, 0.02],
  [0.076, 0.042],
  [0.068, 0.056],
  [0.052, 0.068],
  [0.03, 0.075],
  [0.001, 0.075],
]

/** Rear black plastic cap dome. */
const ALT_CAP_PTS: [number, number][] = [
  [0.001, 0.072],
  [0.062, 0.072],
  [0.06, 0.085],
  [0.045, 0.098],
  [0.02, 0.105],
  [0.001, 0.105],
]

/** 3-groove pulley, r 0.045 with ridge/groove ripple. */
const ALT_PULLEY_PTS: [number, number][] = [
  [0.001, -0.015],
  [0.045, -0.015],
  [0.045, -0.011],
  [0.037, -0.008],
  [0.045, -0.005],
  [0.037, -0.002],
  [0.045, 0.001],
  [0.037, 0.004],
  [0.045, 0.007],
  [0.045, 0.012],
  [0.014, 0.015],
  [0.001, 0.015],
]

/** Smooth flanged idler, r 0.035. */
const IDLER_PTS: [number, number][] = [
  [0.001, -0.012],
  [0.032, -0.012],
  [0.035, -0.008],
  [0.035, 0.008],
  [0.032, 0.012],
  [0.001, 0.012],
]

/**
 * Serpentine-belt waypoints in the YZ plane (x = -0.585), each lying just
 * outside its pulley radius + belt radius:
 *   crank damper (0.32, 0)   wrap r ≈ 0.121
 *   alternator  (0.88, 0.42) wrap r ≈ 0.053
 *   idler       (0.55, 0.24) back-side deflection r ≈ 0.045
 */
const BELT_YZ: [number, number][] = [
  [0.38, 0.105], // crank arrival, +z side
  [0.235, 0.085],
  [0.199, 0.0], // crank bottom
  [0.235, -0.085],
  [0.39, -0.095], // crank exit
  [0.66, 0.135], // straight run up to the alternator
  [0.912, 0.378], // alternator arrival
  [0.932, 0.425], // alternator outer
  [0.879, 0.472], // alternator top
  [0.843, 0.458], // alternator exit
  [0.68, 0.372], // return span
  [0.575, 0.277], // idler back-side contact
  [0.52, 0.272],
  [0.43, 0.17], // run-in back to the crank
]

export function AlternatorReal() {
  const beltPath = useMemo<P3[]>(() => BELT_YZ.map(([y, z]) => [-0.585, y, z]), [])

  return (
    <group>
      {/* ------------------------------ body ------------------------------ */}
      <group position={ALT_C}>
        <Lathe pts={ALT_FRONT_PTS} seg={40} rotation={[0, 0, -Math.PI / 2]}>
          <PMat m="castAlu" />
        </Lathe>
        <Lathe pts={ALT_REAR_PTS} seg={40} rotation={[0, 0, -Math.PI / 2]}>
          <PMat m="castAlu" />
        </Lathe>

        {/* radial cooling-fin ring behind the front shell nose */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <group key={`fin-${i}`} rotation={[a, 0, 0]}>
              <RBox args={[0.014, 0.04, 0.008]} radius={0.002} smoothness={2} position={[-0.075, 0.055, 0]}>
                <PMat m="castAlu" />
              </RBox>
            </group>
          )
        })}

        {/* steel stator band between the shells */}
        <mesh position={[0.002, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.079, 0.079, 0.04, 36]} />
          <PMat m="steel" rough={0.4} />
        </mesh>

        {/* rear black plastic cap with 3 vent rib arcs */}
        <Lathe pts={ALT_CAP_PTS} seg={40} rotation={[0, 0, -Math.PI / 2]}>
          <PMat m="blackCast" />
        </Lathe>
        {[
          [0.052, 0.092],
          [0.04, 0.098],
          [0.028, 0.103],
        ].map(([r, lx]) => (
          <mesh key={`vent-${r}`} position={[lx, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[r, 0.0035, 6, 24, 4]} />
            <PMat m="blackCast" />
          </mesh>
        ))}

        {/* B+ terminal: copper stud + rubber boot nub on the rear cap */}
        <mesh position={[0.108, 0.02, 0.025]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.03, 12]} />
          <PMat m="copper" />
        </mesh>
        <mesh position={[0.118, 0.02, 0.025]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.013, 0.013, 0.016, 12]} />
          <PMat m="rubber" />
        </mesh>
      </group>

      {/* shaft stub from the nose out to the pulley */}
      <mesh position={[-0.57, 0.88, 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 14]} />
        <PMat m="polSteel" />
      </mesh>

      {/* 3-groove pulley in the belt plane x = -0.585 */}
      <Lathe pts={ALT_PULLEY_PTS} seg={40} rotation={[0, 0, -Math.PI / 2]} position={[-0.585, 0.88, 0.42]}>
        <PMat m="polSteel" />
      </Lathe>
      {/* shaft nut on the pulley face */}
      <mesh position={[-0.604, 0.88, 0.42]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.012, 6]} />
        <PMat m="zincGold" />
      </mesh>

      {/* idler pulley + mounting stud back to the block front face */}
      <Lathe pts={IDLER_PTS} seg={36} rotation={[0, 0, -Math.PI / 2]} position={[-0.585, 0.55, 0.24]}>
        <PMat m="polSteel" />
      </Lathe>
      <mesh position={[-0.5525, 0.55, 0.24]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.01, 0.01, 0.065, 12]} />
        <PMat m="steel" />
      </mesh>
      <Bolt position={[-0.599, 0.55, 0.24]} rotation={[0, 0, Math.PI / 2]} r={0.008} len={0.02} m="zincGold" />

      {/* serpentine belt — closed loop wrapping damper / idler / alternator */}
      <Tube path={beltPath} r={0.011} seg={72} radial={10} closed>
        <PMat m="rubber" rough={0.9} />
      </Tube>

      {/* -------------------------- mounting ------------------------------ */}
      {/* foot pad on the block front face (x -0.52, y 0.75, z 0.3) */}
      <RBox args={[0.03, 0.08, 0.06]} radius={0.008} smoothness={2} position={[-0.51, 0.76, 0.31]}>
        <PMat m="castAlu" />
      </RBox>
      {/* cast bracket arm up to the alternator body */}
      <RBox
        args={[0.05, 0.2, 0.045]}
        radius={0.01}
        smoothness={2}
        position={[-0.5, 0.815, 0.36]}
        rotation={[0.74, 0, -0.26]}
      >
        <PMat m="castAlu" />
      </RBox>
      <Bolt position={[-0.505, 0.755, 0.332]} rotation={[Math.PI / 2, 0, 0]} r={0.009} len={0.04} m="zincGold" />
      <Bolt position={[-0.487, 0.875, 0.452]} rotation={[Math.PI / 2, 0, 0]} r={0.009} len={0.04} m="zincGold" />

      {/* slotted tension arm hint, alternator nose down toward the idler */}
      <RBox
        args={[0.016, 0.24, 0.045]}
        radius={0.006}
        smoothness={2}
        position={[-0.575, 0.715, 0.33]}
        rotation={[0.5, 0, 0]}
      >
        <PMat m="castAlu" />
      </RBox>
      <RBox
        args={[0.004, 0.15, 0.016]}
        radius={0.0015}
        smoothness={2}
        position={[-0.5835, 0.715, 0.33]}
        rotation={[0.5, 0, 0]}
      >
        <PMat color="#15171b" metal={0.2} rough={0.85} e={0.02} />
      </RBox>
      <Bolt position={[-0.586, 0.755, 0.352]} rotation={[0, 0, Math.PI / 2]} r={0.007} len={0.022} m="zincGold" />
    </group>
  )
}

/* ================================ STARTER ================================ */

/**
 * Starter axis along X at y 0.215, z -0.325 (nudged up from y 0.2 to clear
 * the pan flange plate at y 0.195). Pinion center (0.645, 0.215, -0.325):
 * distance to the flywheel axis = sqrt(0.105² + 0.325²) ≈ 0.342, so the
 * 9-tooth pinion (tip r 0.04) interleaves the ring-gear teeth (tip r 0.315)
 * without root interference.
 */
const STARTER_Y = 0.215
const STARTER_Z = -0.325

/** Motor can with rear brush-cap bump (local y → world x). */
const MOTOR_PTS: [number, number][] = [
  [0.001, -0.138],
  [0.03, -0.138],
  [0.042, -0.128],
  [0.042, -0.122],
  [0.068, -0.118],
  [0.07, -0.11],
  [0.07, 0.112],
  [0.066, 0.12],
  [0.001, 0.12],
]

/** Solenoid barrel. */
const SOLENOID_PTS: [number, number][] = [
  [0.001, -0.08],
  [0.04, -0.08],
  [0.042, -0.074],
  [0.042, 0.074],
  [0.04, 0.08],
  [0.001, 0.08],
]

/** Stepped drive nose closing toward +X, into the pinion shaft. */
const DRIVE_NOSE_PTS: [number, number][] = [
  [0.001, 0],
  [0.068, 0],
  [0.062, 0.012],
  [0.046, 0.018],
  [0.042, 0.028],
  [0.026, 0.034],
  [0.022, 0.042],
  [0.001, 0.042],
]

export function StarterReal() {
  /** Battery cable off the solenoid rear stud, dropping down and rearward. */
  const cablePath = useMemo<P3[]>(
    () => [
      [0.37, 0.339, -0.368],
      [0.41, 0.3, -0.4],
      [0.45, 0.18, -0.42],
      [0.5, 0.06, -0.43],
    ],
    [],
  )

  return (
    <group>
      {/* ----------------------------- motor ------------------------------ */}
      <Lathe
        pts={MOTOR_PTS}
        seg={40}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0.47, STARTER_Y, STARTER_Z]}
      >
        <PMat m="blackCast" />
      </Lathe>

      {/* 2 long through-bolt lines on the visible outboard flank */}
      {[0.0506, -0.0506].map((dy) => (
        <mesh
          key={`tb-${dy}`}
          position={[0.465, STARTER_Y + dy, STARTER_Z - 0.0506]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.0045, 0.0045, 0.235, 10]} />
          <PMat m="steel" rough={0.45} />
        </mesh>
      ))}

      {/* --------------------------- solenoid ----------------------------- */}
      <Lathe
        pts={SOLENOID_PTS}
        seg={36}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0.47, STARTER_Y + 0.11, STARTER_Z - 0.025]}
      >
        <PMat m="steel" rough={0.38} />
      </Lathe>

      {/* 2 copper terminal studs + hex nuts on the solenoid rear face */}
      {[-0.028, 0.012].map((dz) => (
        <group key={`stud-${dz}`} position={[0, STARTER_Y + 0.13, STARTER_Z - 0.025 + dz]}>
          <mesh position={[0.3805, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.025, 12]} />
            <PMat m="copper" />
          </mesh>
          <mesh position={[0.374, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0095, 0.0095, 0.008, 6]} />
            <PMat m="brass" />
          </mesh>
        </group>
      ))}

      {/* battery cable off the lower stud */}
      <Tube path={cablePath} r={0.012} seg={28} radial={10}>
        <PMat m="rubber" />
      </Tube>

      {/* -------------------------- drive end ----------------------------- */}
      {/* stepped cast nose closing toward the pinion */}
      <Lathe
        pts={DRIVE_NOSE_PTS}
        seg={40}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0.59, STARTER_Y, STARTER_Z]}
      >
        <PMat m="castAlu" />
      </Lathe>
      {/* pinion shaft stub */}
      <mesh position={[0.634, STARTER_Y, STARTER_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.028, 14]} />
        <PMat m="polSteel" />
      </mesh>
      {/* bendix PINION meshing at the ring-gear rim, same YZ plane as the gear */}
      <Gear
        teeth={9}
        rRoot={0.028}
        rTip={0.04}
        h={0.03}
        rotation={[0, Math.PI / 2, 0]}
        position={[0.645, STARTER_Y, STARTER_Z]}
      >
        <PMat m="polSteel" />
      </Gear>

      {/* -------------------------- mounting ------------------------------ */}
      {/* nose flange disc against the bell-housing plane */}
      <mesh position={[0.592, STARTER_Y, STARTER_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.088, 0.088, 0.016, 36]} />
        <PMat m="castAlu" />
      </mesh>
      {/* 2 mounting bolts, heads rearward (+X), shanks into the block flange */}
      <Bolt
        position={[0.602, STARTER_Y + 0.07, STARTER_Z + 0.045]}
        rotation={[0, 0, -Math.PI / 2]}
        r={0.009}
        len={0.08}
        m="zincGold"
      />
      <Bolt
        position={[0.602, STARTER_Y - 0.07, STARTER_Z - 0.045]}
        rotation={[0, 0, -Math.PI / 2]}
        r={0.009}
        len={0.08}
        m="zincGold"
      />
    </group>
  )
}
