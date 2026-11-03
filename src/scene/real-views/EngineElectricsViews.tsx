/**
 * EngineElectricsViews.tsx — dedicated teardown stages for the engine's two
 * electrical machines: the claw-pole alternator (eng-alternator children) and
 * the gear-reduction starter (eng-starter children).
 *
 * Big stage ±1.1 along X, machine axis = X at y 0.75. Pulley / case / belt are
 * NOT modeled — they live one level up on the engine station.
 *
 * Every visible surface uses <PMat/> so PartGroup's selection animation
 * (emissive/opacity) works on all of it. segments ≤ 40, no textures,
 * no useFrame; computed point arrays live in module constants.
 */
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { Bolt, Gear, Lathe, PMat, RBox, Tube } from '../realism'

type P3 = [number, number, number]
const TAU = Math.PI * 2

/* =============================== ALTERNATOR =============================== */

/** 6 claws per end plate, interleaved → 12 alternating poles. */
const CLAW_N = 6

/** Lamination-stack look: 4 thin rings, outer radius alternating. */
const STATOR_XS = [-0.14, -0.047, 0.047, 0.14] as const
const RING_A: [number, number][] = [
  [0.46, -0.044],
  [0.62, -0.044],
  [0.62, 0.044],
  [0.46, 0.044],
  [0.46, -0.044],
]
const RING_B: [number, number][] = [
  [0.46, -0.044],
  [0.6, -0.044],
  [0.6, 0.044],
  [0.46, 0.044],
  [0.46, -0.044],
]

const SLOT_N = 36

/** Three phase tails leaving the stator toward the rectifier plate, each in a
 *  different insulation color. */
const PHASE_ANGLES = [1.1, 3.2, 5.3] as const
const PHASE_COLORS = ['#c0453f', '#3f6fb8', '#262b31'] as const
const PHASE_PATHS: P3[][] = PHASE_ANGLES.map((a) => [
  [0.2, 0.75 + Math.cos(a) * 0.54, Math.sin(a) * 0.54],
  [0.36, 0.75 + Math.cos(a) * 0.46, Math.sin(a) * 0.46],
  [0.56, 0.75 + Math.cos(a) * 0.33, Math.sin(a) * 0.33],
])

/** Field feed wire: coil edge → along the shaft → slip rings. */
const FIELD_WIRE: P3[] = [
  [-0.22, 1.02, 0],
  [-0.36, 0.87, 0],
  [-0.46, 0.83, 0],
]

const DIODE_ANGLES = Array.from({ length: 6 }, (_, i) => (i / 6) * TAU + 0.3)
const FIN_ANGLES = Array.from({ length: 8 }, (_, i) => (i / 8) * TAU + 0.2)

export function AlternatorView() {
  return (
    <group>
      {/* -------------------- claw-pole rotor (anchor) --------------------- */}
      <PartGroup id="alt-rotor" explode={[0, 0, 0]}>
        {/* shaft */}
        <mesh position={[-0.05, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 1.5, 24]} />
          <PMat m="polSteel" />
        </mesh>
        {/* copper field coil drum between the claw plates */}
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.42, 36]} />
          <PMat m="copper" rough={0.45} />
        </mesh>
        {/* two end discs, each growing 6 claws toward the other */}
        {[-0.315, 0.315].map((x) => (
          <mesh key={`disc-${x}`} position={[x, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.07, 36]} />
            <PMat m="iron" />
          </mesh>
        ))}
        {/* interleaved trapezoid claws: root box + narrower tip box */}
        {Array.from({ length: CLAW_N }, (_, i) => {
          const aL = (i / CLAW_N) * TAU
          const aR = aL + TAU / (CLAW_N * 2)
          return (
            <group key={`claw-${i}`}>
              <group position={[0, 0.75, 0]} rotation={[aL, 0, 0]}>
                <mesh position={[-0.05, 0.37, 0]}>
                  <boxGeometry args={[0.46, 0.1, 0.17]} />
                  <PMat m="iron" />
                </mesh>
                <mesh position={[0.18, 0.365, 0]}>
                  <boxGeometry args={[0.2, 0.085, 0.11]} />
                  <PMat m="iron" />
                </mesh>
              </group>
              <group position={[0, 0.75, 0]} rotation={[aR, 0, 0]}>
                <mesh position={[0.05, 0.37, 0]}>
                  <boxGeometry args={[0.46, 0.1, 0.17]} />
                  <PMat m="iron" />
                </mesh>
                <mesh position={[-0.18, 0.365, 0]}>
                  <boxGeometry args={[0.2, 0.085, 0.11]} />
                  <PMat m="iron" />
                </mesh>
              </group>
            </group>
          )
        })}
        {/* slip rings on an insulating sleeve at the rear of the shaft */}
        <mesh position={[-0.51, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.075, 0.075, 0.2, 24]} />
          <PMat color="#23272e" metal={0.1} rough={0.8} e={0.03} />
        </mesh>
        {[-0.56, -0.46].map((x) => (
          <mesh key={`ring-${x}`} position={[x, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.095, 0.095, 0.05, 24]} />
            <PMat m="copper" rough={0.2} e={0.08} />
          </mesh>
        ))}
        {/* field feed wire from the coil to the rings */}
        <Tube path={FIELD_WIRE} r={0.012} seg={20} radial={8}>
          <PMat m="copper" />
        </Tube>
      </PartGroup>

      {/* --------------------------- 3-phase stator ------------------------ */}
      <PartGroup id="alt-stator" explode={[0, 0.85, 0]}>
        {/* lamination stack: 4 thin rings, alternating outer radius */}
        {STATOR_XS.map((x, i) => (
          <Lathe
            key={`lam-${x}`}
            pts={i % 2 ? RING_B : RING_A}
            seg={40}
            rotation={[0, 0, -Math.PI / 2]}
            position={[x, 0.75, 0]}
          >
            <PMat m={i % 2 ? 'steel' : 'iron'} rough={0.45} />
          </Lathe>
        ))}
        {/* 36 slot teeth ticks around the bore */}
        {Array.from({ length: SLOT_N }, (_, i) => {
          const a = (i / SLOT_N) * TAU
          return (
            <group key={`slot-${i}`} position={[0, 0.75, 0]} rotation={[a, 0, 0]}>
              <mesh position={[0, 0.48, 0]}>
                <boxGeometry args={[0.37, 0.05, 0.018]} />
                <PMat m="steel" rough={0.5} />
              </mesh>
            </group>
          )
        })}
        {/* copper winding end turns bulging off both faces */}
        {[-0.21, 0.21].map((x) => (
          <mesh key={`endturn-${x}`} position={[x, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.52, 0.045, 10, 36]} />
            <PMat m="copper" rough={0.5} />
          </mesh>
        ))}
        {/* three phase tails in different insulation colors → rectifier */}
        {PHASE_PATHS.map((p, i) => (
          <Tube key={`phase-${i}`} path={p} r={0.022} seg={20} radial={8}>
            <PMat color={PHASE_COLORS[i]} metal={0.1} rough={0.7} e={0.08} />
          </Tube>
        ))}
      </PartGroup>

      {/* ------------------------- rectifier bridge ------------------------ */}
      <PartGroup id="alt-rectifier" explode={[0.5, -0.15, -0.85]}>
        {/* D-shaped heatsink plate: partial disc + flat chord edge */}
        <mesh position={[0.62, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry
            args={[0.46, 0.46, 0.05, 40, 1, false, Math.PI * 1.7, Math.PI * 1.6]}
          />
          <PMat m="machAlu" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.62, 0.378, 0]}>
          <boxGeometry args={[0.05, 0.035, 0.57]} />
          <PMat m="machAlu" />
        </mesh>
        {/* 6 press-fit diode buttons on the front face */}
        {DIODE_ANGLES.map((a, i) => (
          <group key={`diode-${i}`} position={[0.62, 0.75, 0]} rotation={[a, 0, 0]}>
            <mesh position={[-0.052, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.05, 24]} />
              <PMat m="steel" rough={0.4} />
            </mesh>
            <mesh position={[-0.08, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.034, 0.034, 0.012, 20]} />
              <PMat m="polSteel" e={0.08} />
            </mesh>
          </group>
        ))}
        {/* radial cooling fins on the back face */}
        {FIN_ANGLES.map((a, i) => (
          <group key={`fin-${i}`} position={[0.67, 0.75, 0]} rotation={[a, 0, 0]}>
            <mesh position={[0, 0.27, 0]}>
              <boxGeometry args={[0.05, 0.26, 0.014]} />
              <PMat m="machAlu" />
            </mesh>
          </group>
        ))}
        {/* B+ output stud */}
        <Bolt
          position={[0.68, 1.06, 0.18]}
          rotation={[0, 0, -Math.PI / 2]}
          r={0.016}
          len={0.05}
          m="brass"
        />
      </PartGroup>

      {/* --------------------- regulator + brush holder -------------------- */}
      <PartGroup id="alt-regulator" explode={[-0.2, -0.75, 0.6]}>
        {/* potted control block */}
        <RBox args={[0.3, 0.12, 0.22]} radius={0.015} smoothness={2} position={[-0.51, 1.07, 0.04]}>
          <PMat m="blackCast" />
        </RBox>
        {/* spade connector on the block */}
        <RBox args={[0.1, 0.06, 0.08]} radius={0.008} smoothness={2} position={[-0.51, 1.07, 0.18]}>
          <PMat color="#30363f" metal={0.2} rough={0.7} e={0.04} />
        </RBox>
        <mesh position={[-0.51, 1.07, 0.23]}>
          <boxGeometry args={[0.03, 0.004, 0.03]} />
          <PMat m="zincGold" e={0.3} />
        </mesh>
        {/* brush holder side plates */}
        {[0.05, -0.05].map((z) => (
          <RBox
            key={`holder-${z}`}
            args={[0.21, 0.13, 0.02]}
            radius={0.006}
            smoothness={2}
            position={[-0.51, 0.95, z]}
          >
            <PMat m="blackCast" />
          </RBox>
        ))}
        {/* two carbon brushes riding the slip-ring positions */}
        {[-0.56, -0.46].map((x) => (
          <group key={`brush-${x}`}>
            <mesh position={[x, 0.89, 0]}>
              <boxGeometry args={[0.045, 0.09, 0.05]} />
              <PMat color="#1d2024" metal={0.3} rough={0.85} e={0.04} />
            </mesh>
            {/* brush spring above */}
            <mesh position={[x, 0.965, 0]}>
              <cylinderGeometry args={[0.013, 0.013, 0.055, 10]} />
              <PMat color="#c9b86a" metal={0.8} rough={0.4} e={0.06} />
            </mesh>
            {/* copper pigtail into the block */}
            <Tube
              path={[
                [x, 0.93, 0.02],
                [x + 0.02, 0.99, 0.05],
                [x + 0.03, 1.03, 0.06],
              ]}
              r={0.006}
              seg={12}
              radial={6}
            >
              <PMat m="copper" />
            </Tube>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ STARTER ================================= */

const ARM_SLOT_N = 10
const COMM_BAR_N = 12
const RING_TOOTH_N = 14
const PLANET_ANGLES = [TAU / 4, TAU / 4 + TAU / 3, TAU / 4 + (2 * TAU) / 3] as const
const ROLLER_ANGLES = Array.from({ length: 5 }, (_, i) => (i / 5) * TAU + 0.15)

/** Armature lamination seam rings. */
const ARM_SEAM_XS = [-0.62, -0.5, -0.38] as const

/** Planetary ring gear cross-section (internally toothed sleeve). */
const RING_GEAR_PTS: [number, number][] = [
  [0.24, -0.1],
  [0.3, -0.1],
  [0.3, 0.1],
  [0.24, 0.1],
  [0.24, -0.1],
]

/** Overrun drive collar with central shift-fork groove. */
const COLLAR_PTS: [number, number][] = [
  [0.07, -0.06],
  [0.13, -0.06],
  [0.13, -0.025],
  [0.095, -0.02],
  [0.095, 0.02],
  [0.13, 0.025],
  [0.13, 0.06],
  [0.07, 0.06],
  [0.07, -0.06],
]

export function StarterView() {
  return (
    <group>
      {/* --------------------- armature + commutator ----------------------- */}
      <PartGroup id="sta-armature" explode={[0, 0, 0.85]}>
        {/* motor shaft */}
        <mesh position={[-0.45, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 1.15, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {/* lamination stack */}
        <mesh position={[-0.5, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.29, 0.5, 32]} />
          <PMat m="iron" />
        </mesh>
        {/* stack seam rings */}
        {ARM_SEAM_XS.map((x) => (
          <mesh key={`seam-${x}`} position={[x, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.294, 0.294, 0.015, 32]} />
            <PMat color="#6b727c" metal={0.8} rough={0.5} e={0.04} />
          </mesh>
        ))}
        {/* winding slots along the stack */}
        {Array.from({ length: ARM_SLOT_N }, (_, i) => {
          const a = (i / ARM_SLOT_N) * TAU
          return (
            <group key={`slot-${i}`} position={[-0.5, 0.75, 0]} rotation={[a, 0, 0]}>
              <mesh position={[0, 0.292, 0]}>
                <boxGeometry args={[0.5, 0.014, 0.03]} />
                <PMat color="#3a3f46" metal={0.4} rough={0.7} e={0.03} />
              </mesh>
            </group>
          )
        })}
        {/* copper winding end turns at both stack ends */}
        {[-0.77, -0.23].map((x) => (
          <mesh key={`endturn-${x}`} position={[x, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.215, 0.055, 10, 32]} />
            <PMat m="copper" rough={0.5} />
          </mesh>
        ))}
        {/* commutator: dark core + copper bar ring */}
        <mesh position={[-0.92, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.115, 0.115, 0.2, 24]} />
          <PMat color="#2a221d" metal={0.2} rough={0.8} e={0.03} />
        </mesh>
        {Array.from({ length: COMM_BAR_N }, (_, i) => {
          const a = (i / COMM_BAR_N) * TAU
          return (
            <group key={`bar-${i}`} position={[-0.92, 0.75, 0]} rotation={[a, 0, 0]}>
              <mesh position={[0, 0.122, 0]}>
                <boxGeometry args={[0.19, 0.016, 0.045]} />
                <PMat m="copper" rough={0.25} e={0.06} />
              </mesh>
            </group>
          )
        })}
        {/* riser ring where coils hot-stake to the segments */}
        <mesh position={[-0.81, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.14, 0.02, 8, 28]} />
          <PMat m="copper" rough={0.4} />
        </mesh>
      </PartGroup>

      {/* ----------------------- solenoid (cutaway) ------------------------ */}
      <PartGroup id="sta-solenoid" explode={[0, 0.7, 0]}>
        {/* can with a wedge cut toward the viewer (+Z) */}
        <mesh position={[0.02, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 36, 1, false, 0.55, TAU - 1.1]} />
          <PMat m="steel" rough={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* end caps */}
        <mesh position={[0.41, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.205, 0.205, 0.035, 36]} />
          <PMat m="blackCast" />
        </mesh>
        <mesh position={[-0.4, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.205, 0.205, 0.04, 36]} />
          <PMat m="blackCast" />
        </mesh>
        {/* two coil layers visible through the cutaway: pull-in + hold-in */}
        <mesh position={[-0.08, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.165, 0.165, 0.52, 32]} />
          <PMat m="copper" rough={0.5} />
        </mesh>
        <mesh position={[-0.08, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.125, 0.125, 0.54, 28]} />
          <PMat color="#9a5f3a" metal={0.9} rough={0.45} e={0.04} />
        </mesh>
        {/* bobbin tube the plunger slides in */}
        <mesh position={[-0.08, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.098, 0.098, 0.58, 24]} />
          <PMat color="#23272e" metal={0.2} rough={0.75} e={0.03} />
        </mesh>
        {/* plunger with clevis nose out the front */}
        <mesh position={[0.38, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.085, 0.085, 0.5, 24]} />
          <PMat m="polSteel" />
        </mesh>
        {[0.035, -0.035].map((z) => (
          <mesh key={`clevis-${z}`} position={[0.665, 1.22, z]}>
            <boxGeometry args={[0.07, 0.07, 0.014]} />
            <PMat m="steel" />
          </mesh>
        ))}
        <mesh position={[0.665, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.013, 0.013, 0.1, 12]} />
          <PMat m="polSteel" />
        </mesh>
        {/* big copper contact disc at the rear + 2 terminal studs */}
        <mesh position={[-0.26, 1.22, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.025, 28]} />
          <PMat m="copper" rough={0.25} e={0.08} />
        </mesh>
        {[0.1, -0.1].map((z) => (
          <group key={`stud-${z}`}>
            <mesh position={[-0.46, 1.22, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.15, 14]} />
              <PMat m="copper" />
            </mesh>
            <mesh position={[-0.51, 1.22, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.048, 0.048, 0.035, 6]} />
              <PMat m="zincGold" />
            </mesh>
          </group>
        ))}
        {/* fork lever: clevis → pivot → shift collar */}
        {[0.055, -0.055].map((z) => (
          <mesh key={`fork-${z}`} position={[0.56, 1.01, z]} rotation={[0, 0, -0.445]}>
            <boxGeometry args={[0.04, 0.47, 0.025]} />
            <PMat m="forged" />
          </mesh>
        ))}
        <mesh position={[0.57, 1.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.17, 14]} />
          <PMat m="steel" />
        </mesh>
        {[0.1, -0.1].map((z) => (
          <mesh key={`tip-${z}`} position={[0.47, 0.8, z]} rotation={[0, 0, -0.445]}>
            <boxGeometry args={[0.03, 0.08, 0.03]} />
            <PMat m="forged" />
          </mesh>
        ))}
      </PartGroup>

      {/* ------------------------ planetary reduction ---------------------- */}
      <PartGroup id="sta-planetary" explode={[0, -0.75, 0]}>
        {/* fixed ring gear sleeve with internal tooth hints */}
        <Lathe pts={RING_GEAR_PTS} seg={36} rotation={[0, 0, -Math.PI / 2]} position={[0.06, 0.75, 0]}>
          <PMat m="iron" />
        </Lathe>
        {Array.from({ length: RING_TOOTH_N }, (_, i) => {
          const a = (i / RING_TOOTH_N) * TAU
          return (
            <group key={`tooth-${i}`} position={[0.06, 0.75, 0]} rotation={[a, 0, 0]}>
              <mesh position={[0, 0.226, 0]}>
                <boxGeometry args={[0.18, 0.028, 0.03]} />
                <PMat m="steel" rough={0.35} />
              </mesh>
            </group>
          )
        })}
        {/* sun gear on the armature shaft nose */}
        <Gear
          teeth={8}
          rRoot={0.048}
          rTip={0.068}
          h={0.1}
          hole={0.022}
          rotation={[0, Math.PI / 2, 0]}
          position={[0.06, 0.75, 0]}
        >
          <PMat m="polSteel" />
        </Gear>
        {/* 3 planets on carrier pins */}
        {PLANET_ANGLES.map((a, i) => {
          const y = 0.75 + Math.cos(a) * 0.148
          const z = Math.sin(a) * 0.148
          return (
            <group key={`planet-${i}`}>
              <Gear
                teeth={10}
                rRoot={0.072}
                rTip={0.092}
                h={0.085}
                hole={0.02}
                rotation={[0, Math.PI / 2, 0]}
                position={[0.06, y, z]}
              >
                <PMat m="steel" rough={0.3} />
              </Gear>
              <mesh position={[0.12, y, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
                <PMat m="polSteel" />
              </mesh>
            </group>
          )
        })}
        {/* carrier plate + output shaft */}
        <mesh position={[0.19, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.05, 32]} />
          <PMat m="machAlu" />
        </mesh>
        <mesh position={[0.56, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.75, 20]} />
          <PMat m="polSteel" />
        </mesh>
      </PartGroup>

      {/* ---------------------- overrun clutch + pinion -------------------- */}
      <PartGroup id="sta-overrun" explode={[0.55, 0, -0.75]}>
        {/* shift collar with fork groove */}
        <Lathe pts={COLLAR_PTS} seg={32} rotation={[0, 0, -Math.PI / 2]} position={[0.42, 0.75, 0]}>
          <PMat m="steel" rough={0.3} />
        </Lathe>
        {/* outer race shell, wedge cut toward the viewer */}
        <mesh position={[0.58, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.2, 32, 1, false, 0.55, TAU - 1.1]} />
          <PMat m="forged" side={THREE.DoubleSide} />
        </mesh>
        {/* closed rear wall + inner hub running out to the pinion */}
        <mesh position={[0.68, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.158, 0.158, 0.025, 32]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
        <mesh position={[0.7, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.35, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {/* 5 ramp pockets, rollers and nudge springs */}
        {ROLLER_ANGLES.map((a, i) => (
          <group key={`roller-${i}`} position={[0.58, 0.75, 0]} rotation={[a, 0, 0]}>
            {/* ramp block narrowing the pocket */}
            <mesh position={[0, 0.12, 0.052]} rotation={[0.35, 0, 0]}>
              <boxGeometry args={[0.16, 0.05, 0.055]} />
              <PMat m="iron" />
            </mesh>
            {/* roller */}
            <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.027, 0.027, 0.15, 16]} />
              <PMat m="polSteel" e={0.06} />
            </mesh>
            {/* tiny nudge spring on the wide side */}
            <mesh position={[0, 0.105, -0.055]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
              <PMat color="#c9b86a" metal={0.8} rough={0.4} e={0.06} />
            </mesh>
          </group>
        ))}
        {/* 9-tooth pinion + chamfered engagement nose */}
        <Gear
          teeth={9}
          rRoot={0.088}
          rTip={0.118}
          h={0.15}
          hole={0.03}
          rotation={[0, Math.PI / 2, 0]}
          position={[0.82, 0.75, 0]}
        >
          <PMat m="polSteel" rough={0.2} />
        </Gear>
        <mesh position={[0.93, 0.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.09, 0.07, 24]} />
          <PMat m="steel" rough={0.3} />
        </mesh>
      </PartGroup>
    </group>
  )
}
