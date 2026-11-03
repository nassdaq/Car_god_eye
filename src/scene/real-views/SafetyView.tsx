/**
 * SafetyView.tsx — photoreal-feeling procedural teardown of the SRS safety
 * restraints stage: opened driver airbag module, seatbelt + retractor
 * assembly, SRS control unit with satellite crash sensors, and clock spring.
 *
 * Stage fits ±1.2 around center y ≈ 0.7. PartGroup ids are load-bearing
 * (srs-airbag, srs-belt, srs-ecu, srs-clockspring carry data subtrees; the
 * grandchildren nodes need no geometry yet). Explodes are radial from the
 * stage center.
 *
 * Every visible surface uses <PMat/>; segments ≤ 40, no textures, no
 * useFrame. Budget ≈ 45k triangles.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { Bolt, BoltCircle, Gear, Lathe, PMat, RBox, Tube } from '../realism'

type V3 = [number, number, number]

/* --------------------------------- palette -------------------------------- */
const NYLON_BAG = '#e9e5da' // folded cushion fabric
const WEBBING = '#23262c' // black polyester webbing
const PROPELLANT = '#cfc9a8' // pressed guanidine-nitrate discs
const HOUSING_PU = '#2b2e35' // steering-pad urethane
const CU_RIBBON = '#b57347' // clock-spring flat-flex

const YUP = new THREE.Vector3(0, 1, 0)

/* ------------------------------ small helpers ----------------------------- */

/** straight cylinder between two points, PMat child */
function Strut({
  from,
  to,
  r = 0.02,
  seg = 12,
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
    const quat = new THREE.Quaternion().setFromUnitVectors(YUP, d.normalize())
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

/** flat webbing strap between two points, with raised warp-yarn weave lines */
function Ribbon({
  from,
  to,
  w = 0.085,
  t = 0.008,
}: {
  from: V3
  to: V3
  w?: number
  t?: number
}) {
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
    <group position={pos} quaternion={quat}>
      <RBox args={[w, len, t]} radius={t * 0.4} smoothness={1}>
        <PMat color={WEBBING} metal={0.05} rough={0.9} e={0.04} />
      </RBox>
      {/* warp-yarn weave lines along the strap */}
      {[-w * 0.3, 0, w * 0.3].map((dx) => (
        <mesh key={dx} position={[dx, 0, t / 2 + 0.0008]}>
          <boxGeometry args={[0.004, len * 0.92, 0.0015]} />
          <PMat color="#3a3f48" metal={0.05} rough={0.85} e={0.05} />
        </mesh>
      ))}
      {/* dense selvage edges */}
      {[-w / 2 + 0.004, w / 2 - 0.004].map((dx) => (
        <mesh key={`edge-${dx}`} position={[dx, 0, t / 2 + 0.0008]}>
          <boxGeometry args={[0.006, len * 0.92, 0.0015]} />
          <PMat color="#15171c" metal={0.05} rough={0.9} e={0.03} />
        </mesh>
      ))}
    </group>
  )
}

/* ============================== AIRBAG MODULE ============================== */

/** module center on the stage floor plan */
const AB: [number, number] = [-0.62, 0.32]

/** inflator drum profile (half-lathe cutaway shows the disc stack) */
const INFLATOR_PTS: [number, number][] = [
  [0.05, 0],
  [0.155, 0],
  [0.17, 0.018],
  [0.17, 0.102],
  [0.155, 0.12],
  [0.05, 0.12],
]

/** 10 exit-port perforations around the drum equator */
const PORT_AS = Array.from({ length: 10 }, (_, i) => 0.45 + (i / 10) * Math.PI * 1.75)

/** 7 pleats of the folded cushion, alternating fold radius */
const PLEAT_YS = [0.555, 0.581, 0.607, 0.633, 0.659, 0.685, 0.711] as const

function AirbagModule() {
  return (
    <PartGroup id="srs-airbag" explode={[-0.85, 0.3, 0.5]}>
      {/* steering-pad housing tray */}
      <RBox args={[0.5, 0.1, 0.44]} radius={0.03} smoothness={2} position={[AB[0], 0.3, AB[1]]}>
        <PMat color={HOUSING_PU} metal={0.1} rough={0.8} e={0.04} />
      </RBox>
      {/* opened pad-cover flaps, burst along the molded tear seam */}
      {([1, -1] as const).map((s) => (
        <group key={`flap-${s}`} position={[AB[0], 0.36, AB[1] + s * 0.21]} rotation={[s * 1.25, 0, 0]}>
          <RBox args={[0.46, 0.025, 0.21]} radius={0.012} smoothness={2} position={[0, 0, s * 0.105]}>
            <PMat color={HOUSING_PU} metal={0.1} rough={0.78} e={0.04} />
          </RBox>
          {/* torn seam edge, lighter where the skin ripped */}
          <mesh position={[0, 0.006, s * 0.008]}>
            <boxGeometry args={[0.44, 0.004, 0.012]} />
            <PMat color="#4a4f58" metal={0.05} rough={0.85} e={0.08} />
          </mesh>
        </group>
      ))}
      {/* mounting flange + 4 fixing bolts */}
      <mesh position={[AB[0], 0.362, AB[1]]}>
        <cylinderGeometry args={[0.205, 0.205, 0.016, 36]} />
        <PMat m="machAlu" />
      </mesh>
      <BoltCircle n={4} radius={0.185} r={0.01} len={0.03} position={[AB[0], 0.372, AB[1]]} />

      {/* inflator can — half-lathe cutaway showing the propellant disc stack */}
      <Lathe
        pts={INFLATOR_PTS}
        seg={40}
        phi={Math.PI * 1.35}
        position={[AB[0], 0.378, AB[1]]}
        rotation={[0, 0.4, 0]}
      >
        <PMat m="steel" side={THREE.DoubleSide} />
      </Lathe>
      {/* exit-port perforations on the intact side of the drum */}
      {PORT_AS.map((a) => (
        <mesh
          key={`port-${a}`}
          position={[AB[0] + Math.cos(a) * 0.172, 0.438, AB[1] + Math.sin(a) * 0.172]}
          rotation={[0, -a, 0]}
        >
          <boxGeometry args={[0.008, 0.024, 0.016]} />
          <PMat color="#0d1015" metal={0.2} rough={0.7} e={0.02} />
        </mesh>
      ))}
      {/* knitted-wire filter screen ring inside the ports */}
      <mesh position={[AB[0], 0.438, AB[1]]}>
        <cylinderGeometry args={[0.132, 0.132, 0.082, 36, 1, true]} />
        <PMat color="#6e6757" metal={0.4} rough={0.92} opacity={0.88} side={THREE.DoubleSide} e={0.05} />
      </mesh>
      {/* pressed propellant disc stack around the igniter tube */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`disc-${i}`} position={[AB[0], 0.398 + i * 0.023, AB[1]]}>
          <cylinderGeometry args={[0.088, 0.088, 0.017, 28]} />
          <PMat color={PROPELLANT} metal={0.05} rough={0.9} e={0.06} />
        </mesh>
      ))}
      {/* igniter tube core */}
      <mesh position={[AB[0], 0.438, AB[1]]}>
        <cylinderGeometry args={[0.024, 0.024, 0.11, 20]} />
        <PMat m="brass" />
      </mesh>

      {/* squib initiator poking out below, with shorting-clip connector */}
      <mesh position={[AB[0], 0.352, AB[1]]}>
        <cylinderGeometry args={[0.03, 0.034, 0.05, 20]} />
        <PMat m="brass" />
      </mesh>
      {[-0.012, 0.012].map((dx) => (
        <mesh key={`pin-${dx}`} position={[AB[0] + dx, 0.318, AB[1]]}>
          <cylinderGeometry args={[0.004, 0.004, 0.026, 8]} />
          <PMat m="zincGold" e={0.35} />
        </mesh>
      ))}
      <RBox args={[0.055, 0.03, 0.04]} radius={0.006} smoothness={2} position={[AB[0], 0.292, AB[1]]}>
        <PMat color="#d8b13c" metal={0.15} rough={0.6} e={0.2} />
      </RBox>

      {/* folded nylon cushion — pleated disc stack above the inflator */}
      {PLEAT_YS.map((y, i) => (
        <mesh key={`pleat-${y}`} position={[AB[0], y, AB[1]]} rotation={[0, i * 0.35, 0]}>
          <cylinderGeometry args={[i % 2 ? 0.15 : 0.185, i % 2 ? 0.155 : 0.178, 0.02, 32]} />
          <PMat color={NYLON_BAG} metal={0.02} rough={0.88} e={0.06} />
        </mesh>
      ))}
      {/* vent holes marked on the top pleat */}
      {[-0.07, 0.07].map((dx) => (
        <mesh key={`vent-${dx}`} position={[AB[0] + dx, 0.7225, AB[1] - 0.04]}>
          <cylinderGeometry args={[0.026, 0.026, 0.003, 18]} />
          <PMat color="#8d8779" metal={0.02} rough={0.9} e={0.04} />
        </mesh>
      ))}
      {/* internal tether straps down to the flange */}
      {([1, -1] as const).map((s) => (
        <Tube
          key={`tether-${s}`}
          path={[
            [AB[0] + s * 0.1, 0.72, AB[1] + 0.06],
            [AB[0] + s * 0.16, 0.56, AB[1] + 0.1],
            [AB[0] + s * 0.19, 0.39, AB[1] + 0.08],
          ]}
          r={0.006}
          seg={16}
          radial={6}
        >
          <PMat color={NYLON_BAG} metal={0.02} rough={0.85} e={0.05} />
        </Tube>
      ))}
    </PartGroup>
  )
}

/* =========================== SEATBELT + RETRACTOR ========================== */

const BX = 0.72

function BeltAssembly() {
  return (
    <PartGroup id="srs-belt" explode={[0.95, 0.15, 0.3]}>
      {/* ------------------------------ retractor ----------------------------- */}
      {/* stamped frame on the pillar base */}
      <RBox args={[0.18, 0.3, 0.13]} radius={0.015} smoothness={2} position={[BX, 0.26, 0.02]}>
        <PMat m="steel" color="#5a626d" rough={0.5} />
      </RBox>
      {/* spool shaft + wound webbing wrap */}
      <mesh position={[BX, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.19, 18]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[BX, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.068, 0.068, 0.1, 24]} />
        <PMat color={WEBBING} metal={0.05} rough={0.9} e={0.04} />
      </mesh>
      {/* toothed lock wheel on the spool end + centrifugal pawl */}
      <Gear teeth={16} rRoot={0.068} rTip={0.085} h={0.018} hole={0.03} position={[BX, 0.32, 0.085]}>
        <PMat m="steel" rough={0.35} />
      </Gear>
      <RBox
        args={[0.065, 0.02, 0.016]}
        radius={0.005}
        smoothness={1}
        position={[BX + 0.08, 0.245, 0.085]}
        rotation={[0, 0, 0.55]}
      >
        <PMat m="zincGold" />
      </RBox>
      {/* vehicle-tilt ball lock: cup + steel ball + lever arm */}
      <mesh position={[BX - 0.085, 0.165, 0.085]}>
        <cylinderGeometry args={[0.028, 0.014, 0.025, 16, 1, true]} />
        <PMat m="steel" rough={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[BX - 0.085, 0.182, 0.085]}>
        <sphereGeometry args={[0.015, 12, 8]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[BX - 0.045, 0.2, 0.085]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.08, 0.008, 0.014]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      {/* pretensioner tube running down the frame side + micro gas generator */}
      <Strut from={[BX - 0.11, 0.42, -0.04]} to={[BX - 0.14, 0.13, -0.05]} r={0.024} seg={14}>
        <PMat m="steel" color="#7d858f" rough={0.4} />
      </Strut>
      <mesh position={[BX - 0.142, 0.112, -0.05]}>
        <cylinderGeometry args={[0.028, 0.028, 0.035, 14]} />
        <PMat m="brass" />
      </mesh>
      {/* drive pinion where the pretensioner rack meets the spool */}
      <Gear teeth={10} rRoot={0.026} rTip={0.038} h={0.014} position={[BX, 0.32, -0.085]}>
        <PMat m="zincGold" />
      </Gear>
      {/* anchor bolt through the frame base */}
      <Bolt position={[BX, 0.1, 0.02]} r={0.013} len={0.04} m="zincGold" />

      {/* ------------------------------- webbing ------------------------------ */}
      {/* vertical run: retractor up to the D-ring */}
      <Ribbon from={[BX, 0.38, 0.03]} to={[BX, 1.17, 0.03]} />
      {/* D-ring loop + pillar-anchor plate and bolt */}
      <mesh position={[BX, 1.2, 0.03]} rotation={[0.25, 0, 0]}>
        <torusGeometry args={[0.055, 0.013, 10, 28]} />
        <PMat m="blackCast" color="#2d3138" />
      </mesh>
      <RBox args={[0.07, 0.09, 0.016]} radius={0.01} smoothness={2} position={[BX, 1.27, 0.015]}>
        <PMat m="steel" rough={0.4} />
      </RBox>
      <Bolt position={[BX, 1.275, 0.005]} rotation={[Math.PI / 2, 0, 0]} r={0.011} len={0.028} m="zincGold" />
      {/* diagonal run: D-ring down across the torso line to the tongue */}
      <Ribbon from={[BX - 0.01, 1.16, 0.06]} to={[0.45, 0.44, 0.5]} />
      {/* lap run: tongue down to the floor anchor */}
      <Ribbon from={[0.45, 0.42, 0.52]} to={[0.63, 0.13, 0.6]} />
      <RBox args={[0.07, 0.03, 0.05]} radius={0.008} smoothness={2} position={[0.64, 0.11, 0.61]}>
        <PMat m="steel" rough={0.45} />
      </RBox>
      <Bolt position={[0.64, 0.125, 0.61]} r={0.011} len={0.03} m="zincGold" />

      {/* ---------------------------- buckle + tongue -------------------------- */}
      {/* latch tongue at the ribbon junction */}
      <group position={[0.44, 0.41, 0.52]} rotation={[0.5, 0.15, 0.6]}>
        <RBox args={[0.068, 0.1, 0.007]} radius={0.004} smoothness={2}>
          <PMat m="polSteel" rough={0.18} />
        </RBox>
        <mesh position={[0, -0.032, 0.0015]}>
          <boxGeometry args={[0.04, 0.016, 0.006]} />
          <PMat color="#0d1015" metal={0.2} rough={0.6} e={0.02} />
        </mesh>
      </group>
      {/* buckle body with red release button, on its stalk */}
      <group position={[0.41, 0.3, 0.56]} rotation={[0.2, 0.1, 0.35]}>
        <RBox args={[0.085, 0.14, 0.05]} radius={0.014} smoothness={2}>
          <PMat color="#1f2329" metal={0.15} rough={0.7} e={0.04} />
        </RBox>
        <RBox args={[0.034, 0.03, 0.012]} radius={0.004} smoothness={2} position={[0, 0.042, 0.028]}>
          <PMat color="#c23b4e" metal={0.1} rough={0.5} e={0.3} />
        </RBox>
      </group>
      <Strut from={[0.405, 0.24, 0.575]} to={[0.385, 0.12, 0.54]} r={0.012} seg={10}>
        <PMat m="steel" rough={0.4} />
      </Strut>
      <Bolt position={[0.385, 0.11, 0.54]} r={0.011} len={0.028} m="zincGold" />
    </PartGroup>
  )
}

/* ====================== SRS ECU + SATELLITE CRASH SENSORS ================== */

/** gold pins of the main connector bay: 2 rows × 6 */
const ECU_PIN_ZS = [-0.075, -0.045, -0.015, 0.015, 0.045, 0.075] as const

function SrsEcu() {
  return (
    <PartGroup id="srs-ecu" explode={[0, -0.25, -0.95]}>
      {/* die-cast body bolted on the tunnel line */}
      <RBox args={[0.4, 0.12, 0.26]} radius={0.016} smoothness={2} position={[0, 0.35, -0.7]}>
        <PMat m="castAlu" />
      </RBox>
      <RBox args={[0.3, 0.012, 0.18]} radius={0.004} smoothness={2} position={[-0.02, 0.414, -0.7]}>
        <PMat m="machAlu" />
      </RBox>
      {/* forward orientation arrow molded into the lid */}
      <mesh position={[0.11, 0.422, -0.7]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.028, 0.06, 3]} />
        <PMat color="#d9dde3" metal={0.6} rough={0.35} e={0.15} />
      </mesh>
      {/* keyed connector bay with two gold pin rows */}
      <RBox args={[0.07, 0.085, 0.2]} radius={0.01} smoothness={2} position={[-0.23, 0.345, -0.7]}>
        <PMat color="#262b33" metal={0.2} rough={0.7} e={0.04} />
      </RBox>
      <mesh position={[-0.262, 0.345, -0.7]}>
        <boxGeometry args={[0.02, 0.06, 0.17]} />
        <PMat color="#0b0e13" metal={0.1} rough={0.8} e={0.02} />
      </mesh>
      {[0.325, 0.365].map((y) =>
        ECU_PIN_ZS.map((dz) => (
          <mesh key={`pin-${y}-${dz}`} position={[-0.263, y, -0.7 + dz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.024, 6]} />
            <PMat m="zincGold" e={0.35} />
          </mesh>
        )),
      )}
      {/* three mounting ears with bolts */}
      {([
        [0.215, -0.58],
        [0.215, -0.82],
        [-0.215, -0.7],
      ] as const).map(([x, z]) => (
        <group key={`ear-${x}-${z}`} position={[x, 0.296, z]}>
          <RBox args={[0.07, 0.016, 0.06]} radius={0.006} smoothness={2}>
            <PMat m="castAlu" />
          </RBox>
          <Bolt position={[0, 0.008, 0]} r={0.009} len={0.03} m="zincGold" />
        </group>
      ))}

      {/* two satellite crash-sensor pucks on bracket stubs, pigtails back in */}
      {([1, -1] as const).map((s) => (
        <group key={`sat-${s}`}>
          <RBox args={[0.05, 0.11, 0.04]} radius={0.008} smoothness={2} position={[s * 0.56, 0.3, -0.98]}>
            <PMat m="steel" color="#5a626d" rough={0.5} />
          </RBox>
          <mesh position={[s * 0.56, 0.37, -0.98]}>
            <cylinderGeometry args={[0.045, 0.045, 0.035, 22]} />
            <PMat m="blackCast" />
          </mesh>
          <RBox args={[0.03, 0.02, 0.035]} radius={0.005} smoothness={2} position={[s * 0.56, 0.37, -0.935]}>
            <PMat color="#d8b13c" metal={0.15} rough={0.6} e={0.2} />
          </RBox>
          <Tube
            path={[
              [s * 0.56, 0.37, -0.915],
              [s * 0.44, 0.34, -0.82],
              [s * 0.28, 0.33, -0.72],
            ]}
            r={0.008}
            seg={16}
            radial={6}
          >
            <PMat m="rubber" />
          </Tube>
        </group>
      ))}
    </PartGroup>
  )
}

/* ================================ CLOCK SPRING ============================= */

const CS: V3 = [-0.6, 0.75, -0.55]
/** flat-flex ribbon wraps, loose spiral inside the drum */
const COIL_RS = [0.085, 0.12, 0.155, 0.19] as const

function ClockSpring() {
  return (
    <PartGroup id="srs-clockspring" explode={[-0.8, 0.4, -0.6]}>
      {/* stator base disc + outer drum wall */}
      <mesh position={[CS[0], CS[1], CS[2]]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 36]} />
        <PMat m="blackCast" color="#262a31" />
      </mesh>
      <mesh position={[CS[0], CS[1] + 0.05, CS[2]]}>
        <cylinderGeometry args={[0.22, 0.22, 0.09, 36, 1, true]} />
        <PMat color="#262a31" metal={0.2} rough={0.7} opacity={0.92} side={THREE.DoubleSide} e={0.04} />
      </mesh>
      {/* splined rotor hub the steering wheel clamps */}
      <mesh position={[CS[0], CS[1] + 0.06, CS[2]]}>
        <cylinderGeometry args={[0.055, 0.055, 0.11, 24]} />
        <PMat color="#3a3f48" metal={0.3} rough={0.6} e={0.05} />
      </mesh>
      <mesh position={[CS[0], CS[1] + 0.118, CS[2]]}>
        <cylinderGeometry args={[0.032, 0.032, 0.012, 16]} />
        <PMat color="#0d1015" metal={0.2} rough={0.7} e={0.02} />
      </mesh>
      {/* copper flat-flex ribbon wraps coiled in the drum */}
      {COIL_RS.map((r) => (
        <mesh key={`coil-${r}`} position={[CS[0], CS[1] + 0.05, CS[2]]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.009, 6, 36]} />
          <PMat color={CU_RIBBON} metal={0.9} rough={0.4} e={0.08} />
        </mesh>
      ))}
      {/* half-open rotor top plate — the coils stay visible */}
      <mesh position={[CS[0], CS[1] + 0.1, CS[2]]}>
        <cylinderGeometry args={[0.21, 0.21, 0.012, 36, 1, false, 0, Math.PI]} />
        <PMat color="#2d3138" metal={0.2} rough={0.65} side={THREE.DoubleSide} e={0.04} />
      </mesh>
      {/* yellow transport-lock pin holding it centered */}
      <mesh position={[CS[0] - 0.1, CS[1] + 0.115, CS[2] - 0.08]}>
        <cylinderGeometry args={[0.009, 0.009, 0.03, 10]} />
        <PMat color="#d8b13c" metal={0.15} rough={0.55} e={0.25} />
      </mesh>
      {/* ribbon slot through the drum wall + flat tail to the squib connector */}
      <RBox args={[0.05, 0.026, 0.085]} radius={0.006} smoothness={2} position={[CS[0] + 0.225, CS[1] + 0.045, CS[2]]}>
        <PMat color="#2d3138" metal={0.2} rough={0.65} e={0.04} />
      </RBox>
      <mesh position={[CS[0] + 0.31, CS[1] + 0.045, CS[2]]}>
        <boxGeometry args={[0.12, 0.004, 0.045]} />
        <PMat color={CU_RIBBON} metal={0.85} rough={0.45} e={0.08} />
      </mesh>
      <RBox args={[0.05, 0.03, 0.06]} radius={0.007} smoothness={2} position={[CS[0] + 0.39, CS[1] + 0.045, CS[2]]}>
        <PMat color="#d8b13c" metal={0.15} rough={0.6} e={0.2} />
      </RBox>
      {/* column stub the stator snaps onto */}
      <mesh position={[CS[0], CS[1] - 0.1, CS[2]]}>
        <cylinderGeometry args={[0.036, 0.04, 0.17, 18]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
    </PartGroup>
  )
}

/* ================================== STAGE ================================== */

export function SafetyViewReal() {
  return (
    <group>
      <AirbagModule />
      <BeltAssembly />
      <SrsEcu />
      <ClockSpring />
    </group>
  )
}
