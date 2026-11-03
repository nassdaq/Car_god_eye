/**
 * Drivetrain.tsx — photoreal procedural teardowns for the transmission,
 * driveshaft and differential stages. Replaces the schematic views in
 * assemblies-rest.tsx while keeping the exact PartGroup ids, explode vectors
 * and stage layout (shaft heights, case centers, u-joint positions).
 *
 * Every visible surface is <PMat/> (or GhostMat) so PartGroup's selection
 * animation (emissive/opacity) works on all of it. segments ≤ 48 everywhere.
 */
import * as THREE from 'three'
import type { GroupProps } from '@react-three/fiber'
import { GhostMat, PartGroup } from '../lib'
import { Bolt, BoltCircle, Gear, Lathe, PMat, Ribs, Tube, type MatName } from '../realism'

const TAU = Math.PI * 2

/* ------------------------------ tiny helpers ------------------------------ */

/** Ring of n axial ridge boxes around a shaft running along world X — splines. */
function SplineRing({
  n = 12,
  radius,
  len,
  w = 0.01,
  h = 0.008,
  m = 'polSteel' as MatName,
  ...rest
}: GroupProps & { n?: number; radius: number; len: number; w?: number; h?: number; m?: MatName }) {
  return (
    <group {...rest}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * TAU
        return (
          <mesh key={i} position={[0, Math.cos(a) * radius, Math.sin(a) * radius]} rotation={[a, 0, 0]}>
            <boxGeometry args={[len, h, w]} />
            <PMat m={m} />
          </mesh>
        )
      })}
    </group>
  )
}

/** Dog-tooth engagement ring: base collar + axial dog teeth, axis along X. */
function DogRing({
  face = 1,
  ...rest
}: GroupProps & { face?: 1 | -1 }) {
  return (
    <group {...rest}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.024, 36]} />
        <PMat m="steel" rough={0.28} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * TAU
        return (
          <mesh
            key={i}
            position={[face * 0.017, Math.cos(a) * 0.063, Math.sin(a) * 0.063]}
            rotation={[a, 0, 0]}
          >
            <boxGeometry args={[0.02, 0.015, 0.016]} />
            <PMat m="polSteel" />
          </mesh>
        )
      })}
    </group>
  )
}

/** Brass synchro blocker cone — tapered ring with fine OD groove hints. */
const SYNCHRO_CONE_PTS: [number, number][] = [
  [0.095, -0.022],
  [0.148, -0.022],
  [0.144, -0.015],
  [0.149, -0.011],
  [0.144, -0.007],
  [0.149, -0.003],
  [0.144, 0.001],
  [0.128, 0.022],
  [0.095, 0.022],
  [0.095, -0.022],
]

/** Synchro slider sleeve with central shift-fork groove. */
const SLEEVE_PTS: [number, number][] = [
  [0.128, -0.034],
  [0.168, -0.034],
  [0.168, -0.012],
  [0.157, -0.008],
  [0.157, 0.008],
  [0.168, 0.012],
  [0.168, 0.034],
  [0.128, 0.034],
  [0.128, -0.034],
]

/* ============================ TRANSMISSION ================================ */

/** shaft center distance (input y 0.88 / counter y 0.56) and common module */
const TRN_C = 0.32
const TRN_MOD = (TRN_C * 2) / 47 // every pair sums to 47 teeth
const ADD = TRN_MOD * 0.55
const DED = TRN_MOD * 0.7

const TRN_PAIRS = [
  { x: -0.35, t1: 15, t2: 32 }, // 1st
  { x: -0.1, t1: 19, t2: 28 }, // 2nd
  { x: 0.15, t1: 23, t2: 24 }, // 3rd
  { x: 0.42, t1: 27, t2: 20 }, // 4th
]

const rPitch = (t: number) => (t * TRN_MOD) / 2
const HELIX = 0.05 // slight axis tilt fakes a helical cut

export function TransmissionViewReal() {
  return (
    <group>
      {/* ------------------------- half-shell case -------------------------- */}
      <PartGroup id="trn-case" explode={[0, 0.9, 0]} renderOrder={5}>
        {/* open sand-cast half shell */}
        <mesh position={[0.1, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.44, 0.44, 1.26, 48, 1, true, 0, Math.PI]} />
          <PMat m="castAlu" e={0.05} opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {/* external stiffening ribs over the crown */}
        <Ribs n={6} pitch={0.17} w={0.012} h={0.05} depth={0.3} position={[0.08, 1.15, 0]} />
        {/* bellhousing flare at the input end */}
        <Lathe
          pts={[
            [0.36, -0.11],
            [0.375, -0.1],
            [0.42, -0.012],
            [0.47, -0.012],
            [0.47, 0],
            [0.42, 0],
          ]}
          rotation={[0, 0, -Math.PI / 2]}
          position={[-0.53, 0.72, 0]}
        >
          <PMat m="castAlu" opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
        </Lathe>
        {/* bellhousing bolt ring, heads toward the engine (-X) */}
        <BoltCircle
          n={8}
          radius={0.445}
          r={0.013}
          len={0.04}
          position={[-0.645, 0.72, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {/* tail housing cone */}
        <Lathe
          pts={[
            [0.44, 0],
            [0.42, 0.02],
            [0.17, 0.115],
            [0.14, 0.14],
            [0.12, 0.14],
          ]}
          rotation={[0, 0, -Math.PI / 2]}
          position={[0.73, 0.72, 0]}
        >
          <PMat m="castAlu" opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
        </Lathe>
      </PartGroup>

      {/* ----------------------- gear clusters + shafts --------------------- */}
      <PartGroup id="trn-gears" explode={[0, 0, 0]}>
        {/* input (main) shaft */}
        <mesh position={[0.1, 0.88, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 1.15, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {/* counter (output) shaft */}
        <mesh position={[0.1, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 1.15, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {/* output flange stub */}
        <mesh position={[0.695, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 28]} />
          <PMat m="steel" />
        </mesh>

        {/* four meshed gear pairs — common module, tooth tips nearly touching */}
        {TRN_PAIRS.map(({ x, t1, t2 }) => (
          <group key={x}>
            {/* input gear: a tooth gap faces straight down toward the mesh */}
            <Gear
              teeth={t1}
              rRoot={rPitch(t1) - DED}
              rTip={rPitch(t1) + ADD}
              h={0.055}
              hole={0.037}
              position={[x, 0.88, 0]}
              rotation={[0, Math.PI / 2 + HELIX, -Math.PI / 2]}
            >
              <PMat m="steel" rough={0.25} />
            </Gear>
            {/* counter gear: phased half a pitch so teeth interleave */}
            <Gear
              teeth={t2}
              rRoot={rPitch(t2) - DED}
              rTip={rPitch(t2) + ADD}
              h={0.055}
              hole={0.042}
              position={[x, 0.56, 0]}
              rotation={[0, Math.PI / 2 + HELIX, Math.PI / 2 - Math.PI / t2]}
            >
              <PMat m="zincGold" color="#b5a06a" rough={0.3} env={0.9} />
            </Gear>
          </group>
        ))}

        {/* dog-teeth engagement rings beside 2nd and 4th counter gears */}
        <DogRing position={[-0.055, 0.56, 0]} face={1} />
        <DogRing position={[0.38, 0.56, 0]} face={-1} />

        {/* ball bearing hints at the shaft ends */}
        {[
          [-0.45, 0.88],
          [0.65, 0.88],
          [-0.45, 0.56],
          [0.65, 0.56],
        ].map(([bx, by], i) => (
          <group key={i} position={[bx, by, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.075, 0.075, 0.045, 32]} />
              <PMat m="polSteel" rough={0.18} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.058, 0.012, 8, 32]} />
              <PMat m="blackCast" color="#15181d" rough={0.85} e={0.02} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ----------------------- synchro cones + sleeves -------------------- */}
      <PartGroup id="trn-synchro" explode={[0.3, 0, 0.85]}>
        {[0.02, 0.29].map((x) => (
          <Lathe key={x} pts={SYNCHRO_CONE_PTS} rotation={[0, 0, Math.PI / 2]} position={[x, 0.56, 0]}>
            <PMat m="brass" rough={0.3} />
          </Lathe>
        ))}
        {[0.075, 0.34].map((x) => (
          <Lathe key={x} pts={SLEEVE_PTS} rotation={[0, 0, Math.PI / 2]} position={[x, 0.56, 0]}>
            <PMat m="machAlu" rough={0.22} />
          </Lathe>
        ))}
      </PartGroup>

      {/* ------------------------------ clutch ------------------------------ */}
      <PartGroup id="trn-clutch" explode={[-0.9, 0, 0]}>
        {/* friction disc: lined annulus + rivets */}
        <Lathe
          pts={[
            [0.185, -0.012],
            [0.3, -0.012],
            [0.3, 0.012],
            [0.185, 0.012],
            [0.185, -0.012],
          ]}
          rotation={[0, 0, Math.PI / 2]}
          position={[-0.78, 0.72, 0]}
        >
          <PMat m="iron" color="#6e4a33" metal={0.3} rough={0.8} />
        </Lathe>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * TAU
          return (
            <mesh
              key={i}
              position={[-0.78, 0.72 + Math.cos(a) * 0.24, Math.sin(a) * 0.24]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.007, 0.007, 0.026, 10]} />
              <PMat m="steel" />
            </mesh>
          )
        })}
        {/* hub damper plate + 4 damper springs (brass cylinders, tangential) */}
        <mesh position={[-0.78, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.145, 0.145, 0.018, 36]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * TAU + Math.PI / 4
          return (
            <mesh
              key={i}
              position={[-0.78, 0.72 + Math.cos(a) * 0.1, Math.sin(a) * 0.1]}
              rotation={[a + Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.075, 12]} />
              <PMat m="brass" rough={0.35} />
            </mesh>
          )
        })}
        {/* splined hub */}
        <mesh position={[-0.78, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.07, 24]} />
          <PMat m="polSteel" />
        </mesh>
        <SplineRing n={10} radius={0.053} len={0.07} w={0.012} position={[-0.78, 0.72, 0]} />

        {/* pressure plate ring */}
        <Lathe
          pts={[
            [0.19, -0.016],
            [0.305, -0.016],
            [0.305, 0.016],
            [0.19, 0.016],
            [0.19, -0.016],
          ]}
          rotation={[0, 0, Math.PI / 2]}
          position={[-0.725, 0.72, 0]}
        >
          <PMat m="iron" />
        </Lathe>
        {/* stamped cover shell + 6 cover bolts (heads toward engine) */}
        <Lathe
          pts={[
            [0.315, 0],
            [0.315, 0.01],
            [0.24, 0.035],
            [0.175, 0.055],
            [0.16, 0.055],
          ]}
          rotation={[0, 0, -Math.PI / 2]}
          position={[-0.71, 0.72, 0]}
        >
          <PMat m="steel" rough={0.4} side={THREE.DoubleSide} />
        </Lathe>
        <BoltCircle
          n={6}
          radius={0.285}
          r={0.009}
          len={0.025}
          position={[-0.715, 0.72, 0]}
          rotation={[0, 0, Math.PI / 2]}
        />
        {/* diaphragm spring: 16 radial wedge fingers in a shallow cone fan */}
        <group position={[-0.66, 0.72, 0]}>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * TAU
            return (
              <group key={i} rotation={[a, 0, 0]}>
                <mesh position={[0, 0.1075, 0]} rotation={[0, 0, 0.22]}>
                  <boxGeometry args={[0.012, 0.115, 0.024]} />
                  <PMat m="polSteel" rough={0.2} />
                </mesh>
              </group>
            )
          })}
          {/* fulcrum wire rings + finger tip ring */}
          {[-0.015, 0.012].map((dx) => (
            <mesh key={dx} position={[dx, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.155, 0.005, 8, 40]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          <mesh position={[0.015, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.052, 0.006, 8, 28]} />
            <PMat m="polSteel" />
          </mesh>
        </group>
        {/* release bearing */}
        <mesh position={[-0.62, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 28]} />
          <PMat m="polSteel" rough={0.15} />
        </mesh>
        <mesh position={[-0.6, 0.72, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.048, 0.008, 8, 28]} />
          <PMat m="rubber" />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ============================== DRIVESHAFT ================================ */

/** One u-joint: cross, 4 needle caps + snap rings, outboard yoke, zerk. */
function UJoint({ sign }: { sign: 1 | -1 }) {
  return (
    <group position={[sign * 0.95, 0.75, 0]} userData={{ explode: [sign * 0.7, 0, 0] }}>
      {/* trunnion cross */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.24, 16]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.24, 16]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.046, 18, 14]} />
        <PMat m="forged" />
      </mesh>
      {/* grease zerk dot on the cross body */}
      <group position={[0, 0.034, 0.034]} rotation={[-Math.PI / 4, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.007, 0.007, 0.026, 8]} />
          <PMat m="zincGold" />
        </mesh>
        <mesh position={[0, 0.016, 0]}>
          <sphereGeometry args={[0.009, 10, 8]} />
          <PMat m="zincGold" />
        </mesh>
      </group>
      {/* 4 needle bearing caps + snap rings */}
      {([1, -1] as const).map((s) => (
        <group key={`y${s}`}>
          <mesh position={[0, s * 0.145, 0]}>
            <cylinderGeometry args={[0.047, 0.047, 0.05, 20]} />
            <PMat m="steel" rough={0.28} />
          </mesh>
          <mesh position={[0, s * 0.157, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.0045, 8, 24]} />
            <PMat m="polSteel" />
          </mesh>
        </group>
      ))}
      {([1, -1] as const).map((s) => (
        <group key={`z${s}`}>
          <mesh position={[0, 0, s * 0.145]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.047, 0.047, 0.05, 20]} />
            <PMat m="steel" rough={0.28} />
          </mesh>
          <mesh position={[0, 0, s * 0.157]}>
            <torusGeometry args={[0.05, 0.0045, 8, 24]} />
            <PMat m="polSteel" />
          </mesh>
        </group>
      ))}
      {/* outboard yoke: two ears gripping the Y caps + stub + flange */}
      {([1, -1] as const).map((s) => (
        <mesh key={`ear${s}`} position={[sign * 0.07, s * 0.13, 0]}>
          <boxGeometry args={[0.16, 0.04, 0.095]} />
          <PMat m="forged" />
        </mesh>
      ))}
      <mesh position={[sign * 0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.065, 0.065, 0.09, 24]} />
        <PMat m="forged" />
      </mesh>
      <mesh position={[sign * 0.225, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 0.028, 32]} />
        <PMat m="steel" />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => {
        const a = (i / 4) * TAU + Math.PI / 4
        return (
          <Bolt
            key={i}
            position={[sign * 0.24, Math.cos(a) * 0.09, Math.sin(a) * 0.09]}
            rotation={[0, 0, -sign * (Math.PI / 2)]}
            r={0.008}
            len={0.03}
          />
        )
      })}
    </group>
  )
}

export function DriveshaftViewReal() {
  return (
    <group>
      <PartGroup id="dsh-tube" explode={[0, 0, 0]}>
        {/* main tube */}
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.44, 36]} />
          <PMat m="steel" rough={0.35} />
        </mesh>
        {/* weld bead rings at both tube ends */}
        {[-0.71, 0.71].map((x) => (
          <mesh key={x} position={[x, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.093, 0.009, 8, 40]} />
            <PMat m="steel" color="#7d8591" rough={0.55} />
          </mesh>
        ))}
        {/* 2 spot-welded balance weight plates */}
        <mesh position={[0.3, 0.846, 0]}>
          <boxGeometry args={[0.07, 0.012, 0.035]} />
          <PMat m="machAlu" />
        </mesh>
        <mesh
          position={[-0.45, 0.75 + Math.cos(0.9) * 0.0915, Math.sin(0.9) * 0.0915]}
          rotation={[0.9, 0, 0]}
        >
          <boxGeometry args={[0.07, 0.012, 0.035]} />
          <PMat m="machAlu" />
        </mesh>

        {/* slip yoke: exposed spline section + sleeve collar + zerk */}
        <mesh position={[-0.775, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.13, 24]} />
          <PMat m="polSteel" />
        </mesh>
        <SplineRing n={12} radius={0.053} len={0.125} w={0.011} position={[-0.775, 0.75, 0]} />
        <mesh position={[-0.835, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.105, 0.105, 0.07, 28]} />
          <PMat m="forged" />
        </mesh>
        <group position={[-0.835, 0.862, 0]}>
          <mesh>
            <cylinderGeometry args={[0.007, 0.007, 0.022, 8]} />
            <PMat m="zincGold" />
          </mesh>
          <mesh position={[0, 0.014, 0]}>
            <sphereGeometry args={[0.009, 10, 8]} />
            <PMat m="zincGold" />
          </mesh>
        </group>

        {/* tube-side yokes: two ears each, gripping the u-joint Z caps */}
        {([1, -1] as const).map((sign) => (
          <group key={sign}>
            {sign > 0 && (
              <mesh position={[0.75, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.1, 0.09, 0.06, 28]} />
                <PMat m="forged" />
              </mesh>
            )}
            {([1, -1] as const).map((s) => (
              <group key={s}>
                <mesh position={[sign * (sign > 0 ? 0.875 : 0.9), 0.75, s * 0.13]}>
                  <boxGeometry args={[sign > 0 ? 0.17 : 0.12, 0.095, 0.038]} />
                  <PMat m="forged" />
                </mesh>
                {/* rounded ear boss around the cap bore */}
                <mesh position={[sign * 0.95, 0.75, s * 0.13]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.052, 0.052, 0.04, 24]} />
                  <PMat m="forged" />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </PartGroup>

      <PartGroup id="dsh-ujoints" perChild>
        <UJoint sign={-1} />
        <UJoint sign={1} />
      </PartGroup>
    </group>
  )
}

/* ============================= DIFFERENTIAL =============================== */

/** helix path for the LSD preload coil spring (axis along Z) */
const LSD_SPRING_PATH: [number, number, number][] = Array.from({ length: 29 }, (_, k) => {
  const a = (k / 28) * 4 * TAU
  return [Math.cos(a) * 0.1, 0.75 + Math.sin(a) * 0.1, -0.4 - (k / 28) * 0.1]
})

export function DifferentialViewReal() {
  return (
    <group>
      {/* ----------------------- housing (half-ghost) ----------------------- */}
      <PartGroup id="dif-case" explode={[0, 0.95, 0]} renderOrder={5}>
        {/* half-shell carrier housing */}
        <mesh position={[0, 0.75, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <sphereGeometry args={[0.5, 36, 18, 0, Math.PI]} />
          <GhostMat opacity={0.15} />
        </mesh>
        {/* axle tubes */}
        {[0.6, -0.6].map((z) => (
          <mesh key={z} position={[0, 0.75, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 24, 1, true]} />
            <GhostMat opacity={0.18} />
          </mesh>
        ))}
        {/* pinion snout */}
        <mesh position={[-0.56, 0.62, 0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.13, 0.28, 24, 1, true]} />
          <GhostMat opacity={0.15} />
        </mesh>

        {/* main bearing caps + bolts + carrier bearing cones */}
        {([1, -1] as const).map((s) => (
          <group key={s}>
            <mesh position={[0, 0.75, s * 0.34]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.105, 0.105, 0.085, 24, 1, true, Math.PI / 2, Math.PI]} />
              <PMat m="castAlu" side={THREE.DoubleSide} />
            </mesh>
            {([1, -1] as const).map((fx) => (
              <group key={fx}>
                <mesh position={[fx * 0.105, 0.72, s * 0.34]}>
                  <boxGeometry args={[0.06, 0.03, 0.085]} />
                  <PMat m="castAlu" />
                </mesh>
                <Bolt position={[fx * 0.105, 0.735, s * 0.34]} r={0.011} len={0.05} />
              </group>
            ))}
            {/* tapered carrier bearing hint, just inboard of the cap */}
            <Lathe
              pts={[
                [0.055, -0.03],
                [0.095, -0.03],
                [0.095, -0.024],
                [0.062, 0.03],
                [0.055, 0.03],
                [0.055, -0.03],
              ]}
              rotation={[s > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 0]}
              position={[0, 0.75, s * 0.285]}
            >
              <PMat m="polSteel" rough={0.2} />
            </Lathe>
          </group>
        ))}

        {/* axle stubs with inner splines and outboard flanges */}
        {([1, -1] as const).map((s) => (
          <group key={s} rotation={[0, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0]} position={[0, 0.75, s * 0.6]}>
            {/* local X now runs along world ±Z */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.042, 0.042, 0.52, 20]} />
              <PMat m="polSteel" />
            </mesh>
            <SplineRing n={10} radius={0.045} len={0.09} w={0.01} position={[-0.21, 0, 0]} />
            <mesh position={[0.27, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 0.03, 28]} />
              <PMat m="steel" />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ------------------------- hypoid ring + pinion --------------------- */}
      <PartGroup id="dif-ringpinion" explode={[0, 0.3, -0.75]}>
        {/* ring gear — 41 teeth, axis along Z */}
        <Gear teeth={41} rRoot={0.385} rTip={0.425} h={0.065} hole={0.31} position={[0, 0.75, 0.085]}>
          <PMat m="zincGold" color="#b5a06a" rough={0.3} env={0.9} />
        </Gear>
        {/* ring gear web + bolt circle into the carrier flange */}
        <Lathe
          pts={[
            [0.14, -0.02],
            [0.31, -0.02],
            [0.31, 0.02],
            [0.19, 0.02],
            [0.14, 0.055],
            [0.14, -0.02],
          ]}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0.75, 0.085]}
        >
          <PMat m="forged" />
        </Lathe>
        <BoltCircle
          n={8}
          radius={0.23}
          r={0.012}
          len={0.04}
          position={[0, 0.75, 0.125]}
          rotation={[Math.PI / 2, 0, 0]}
        />

        {/* pinion head meshed BELOW the ring centerline (hypoid offset) */}
        <Gear
          teeth={13}
          rRoot={0.082}
          rTip={0.108}
          h={0.13}
          hole={0.03}
          position={[-0.44, 0.62, 0.085]}
          rotation={[0, Math.PI / 2 + 0.06, 0.12]}
        >
          <PMat m="zincGold" color="#b5a06a" rough={0.3} env={0.9} />
        </Gear>
        {/* pinion shaft + two tapered bearing hints + companion flange/nut */}
        <mesh position={[-0.66, 0.62, 0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 0.34, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {[-0.56, -0.74].map((x) => (
          <Lathe
            key={x}
            pts={[
              [0.048, -0.028],
              [0.082, -0.028],
              [0.082, -0.022],
              [0.052, 0.028],
              [0.048, 0.028],
              [0.048, -0.028],
            ]}
            rotation={[0, 0, Math.PI / 2]}
            position={[x, 0.62, 0.085]}
          >
            <PMat m="polSteel" rough={0.2} />
          </Lathe>
        ))}
        <mesh position={[-0.84, 0.62, 0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.095, 0.095, 0.035, 28]} />
          <PMat m="forged" />
        </mesh>
        <mesh position={[-0.875, 0.62, 0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.03, 6]} />
          <PMat m="zincGold" />
        </mesh>
      </PartGroup>

      {/* ---------------- spider + side bevel gears on the cross ------------ */}
      <PartGroup id="dif-spiders" explode={[0, 0, 0.95]}>
        <group position={[0, 0.75, 0.085]}>
          {/* cross shaft */}
          <mesh>
            <cylinderGeometry args={[0.024, 0.024, 0.44, 16]} />
            <PMat m="polSteel" />
          </mesh>
          {/* 2 spider pinions on the cross shaft — toothed cones (2-gear stack) */}
          {([1, -1] as const).map((s) => (
            <group key={`sp${s}`}>
              <Gear
                teeth={11}
                rRoot={0.068}
                rTip={0.086}
                h={0.04}
                hole={0.028}
                position={[0, s * 0.15, 0]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <PMat m="steel" rough={0.25} />
              </Gear>
              <Gear
                teeth={11}
                rRoot={0.046}
                rTip={0.062}
                h={0.034}
                hole={0.028}
                position={[0, s * 0.115, 0]}
                rotation={[Math.PI / 2, 0, Math.PI / 11]}
              >
                <PMat m="steel" rough={0.25} />
              </Gear>
              {/* spherical thrust washer at the back face */}
              <mesh position={[0, s * 0.178, 0]}>
                <cylinderGeometry args={[0.072, 0.06, 0.014, 28]} />
                <PMat m="brass" />
              </mesh>
            </group>
          ))}
          {/* 2 side bevel gears on the axle axis — toothed cones (2-gear stack) */}
          {([1, -1] as const).map((s) => (
            <group key={`sd${s}`}>
              <Gear
                teeth={14}
                rRoot={0.088}
                rTip={0.108}
                h={0.04}
                hole={0.04}
                position={[0, 0, s * 0.15]}
              >
                <PMat m="zincGold" color="#b5a06a" rough={0.3} env={0.9} />
              </Gear>
              <Gear
                teeth={14}
                rRoot={0.06}
                rTip={0.078}
                h={0.034}
                hole={0.04}
                position={[0, 0, s * 0.115]}
                rotation={[0, 0, Math.PI / 14]}
              >
                <PMat m="zincGold" color="#b5a06a" rough={0.3} env={0.9} />
              </Gear>
              {/* splined hub boss behind the big gear */}
              <mesh position={[0, 0, s * 0.19]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.052, 0.052, 0.04, 20]} />
                <PMat m="steel" />
              </mesh>
            </group>
          ))}
        </group>
      </PartGroup>

      {/* ------------------------- LSD clutch pack -------------------------- */}
      <PartGroup id="dif-lsd" explode={[0.85, 0, 0]}>
        {/* pressure ring against the side gear hub */}
        <mesh position={[0, 0.75, -0.135]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.165, 0.165, 0.016, 40]} />
          <PMat m="machAlu" />
        </mesh>
        {/* 8 alternating plates: outer plates tabbed, inner plates splined */}
        {Array.from({ length: 8 }, (_, i) => {
          const z = -0.155 - i * 0.032
          const outer = i % 2 === 0
          return (
            <group key={i} position={[0, 0.75, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[outer ? 0.172 : 0.15, outer ? 0.172 : 0.15, 0.011, 40]} />
                {outer ? (
                  <PMat m="steel" rough={0.3} />
                ) : (
                  <PMat m="iron" color="#8a5a3c" metal={0.4} rough={0.75} />
                )}
              </mesh>
              {outer
                ? // 4 drive tabs out into the case slots
                  Array.from({ length: 4 }, (_, k) => {
                    const a = (k / 4) * TAU + Math.PI / 4
                    return (
                      <mesh
                        key={k}
                        position={[Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0]}
                        rotation={[0, 0, a]}
                      >
                        <boxGeometry args={[0.05, 0.035, 0.011]} />
                        <PMat m="steel" rough={0.3} />
                      </mesh>
                    )
                  })
                : // splined bore ridges
                  Array.from({ length: 8 }, (_, k) => {
                    const a = (k / 8) * TAU
                    return (
                      <mesh
                        key={k}
                        position={[Math.cos(a) * 0.055, Math.sin(a) * 0.055, 0]}
                        rotation={[0, 0, a]}
                      >
                        <boxGeometry args={[0.018, 0.012, 0.011]} />
                        <PMat m="polSteel" />
                      </mesh>
                    )
                  })}
            </group>
          )
        })}
        {/* preload coil spring + seat plate */}
        <Tube path={LSD_SPRING_PATH} r={0.009} seg={48} radial={8}>
          <PMat m="steel" rough={0.3} />
        </Tube>
        <mesh position={[0, 0.75, -0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 32]} />
          <PMat m="steel" />
        </mesh>
      </PartGroup>
    </group>
  )
}
