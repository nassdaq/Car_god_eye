/**
 * InteriorBody.tsx — photoreal-feeling interior + body teardown views.
 *
 * Exports SeatsViewReal / SteeringViewReal / BodyViewReal as drop-in upgrades
 * for the schematic views in assemblies-rest.tsx. PartGroup ids and explode
 * directions are kept identical so camera framing / selection keep working.
 *
 * Contract: every visible surface is <PMat/> (or GhostMat for context
 * shells), segments ≤ 48, no textures, no useFrame.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PartGroup, GhostMat } from '../lib'
import { PMat, Lathe, Tube, Gear, RBox } from '../realism'

type P3 = [number, number, number]

/* ------------------------------ tiny helpers ------------------------------ */

function aim(from: P3, to: P3) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const d = b.clone().sub(a)
  const len = d.length()
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    d.normalize(),
  )
  return { quat, len, mid: a.clone().add(b).multiplyScalar(0.5) }
}

const lerp3 = (a: P3, b: P3, t: number): P3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

/** Straight shaft/rod between two points (cylinder, local Y aligned). */
function Rod({
  from,
  to,
  r = 0.03,
  seg = 16,
  children,
}: {
  from: P3
  to: P3
  r?: number
  seg?: number
  children: ReactNode
}) {
  const { quat, len, mid } = useMemo(() => aim(from, to), [from, to])
  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, seg]} />
      {children}
    </mesh>
  )
}

/** Mini universal joint: cross + 4 trunnion caps + two yokes. */
function UJoint({ at, toward }: { at: P3; toward: P3 }) {
  const quat = useMemo(() => aim(at, toward).quat, [at, toward])
  return (
    <group position={at} quaternion={quat}>
      {/* spider cross */}
      <mesh>
        <boxGeometry args={[0.1, 0.024, 0.024]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh>
        <boxGeometry args={[0.024, 0.024, 0.1]} />
        <PMat m="polSteel" />
      </mesh>
      {/* needle-bearing caps */}
      {([[0.052, 0, 0], [-0.052, 0, 0], [0, 0, 0.052], [0, 0, -0.052]] as P3[]).map((p, i) => (
        <mesh key={i} position={p} rotation={i < 2 ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.019, 0.019, 0.022, 12]} />
          <PMat m="zincGold" />
        </mesh>
      ))}
      {/* lower yoke (grips X trunnions) */}
      {[-1, 1].map((s) => (
        <RBox
          key={`ly${s}`}
          args={[0.024, 0.07, 0.05]}
          radius={0.007}
          smoothness={2}
          position={[s * 0.056, -0.034, 0]}
        >
          <PMat m="forged" />
        </RBox>
      ))}
      <mesh position={[0, -0.068, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.028, 14]} />
        <PMat m="forged" />
      </mesh>
      {/* upper yoke (grips Z trunnions) */}
      {[-1, 1].map((s) => (
        <RBox
          key={`uy${s}`}
          args={[0.05, 0.07, 0.024]}
          radius={0.007}
          smoothness={2}
          position={[0, 0.034, s * 0.056]}
        >
          <PMat m="forged" />
        </RBox>
      ))}
      <mesh position={[0, 0.068, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.028, 14]} />
        <PMat m="forged" />
      </mesh>
    </group>
  )
}

/* ================================== SEATS ================================= */

const FOAM_SOFT = '#e2c377'
const FOAM_FIRM = '#9a7524'
const FOAM_GROOVE = '#6b5418'
const FABRIC = '#9fb2c8'
const SEAM = '#3c4656'
const HEAT = '#ff8f5a'

/** cushion perimeter tube (closed loop, corners rounded by catmull-rom) */
const CUSHION_LOOP: P3[] = [
  [-0.3, 0.3, -0.25],
  [0.3, 0.3, -0.25],
  [0.3, 0.3, 0.25],
  [-0.3, 0.3, 0.25],
]

/** one continuous bent backrest hoop: up one side, across the top, down */
const BACK_HOOP: P3[] = [
  [-0.26, 0.34, -0.24],
  [-0.36, 0.7, -0.25],
  [-0.48, 1.04, -0.22],
  [-0.5, 1.12, -0.12],
  [-0.5, 1.12, 0.12],
  [-0.48, 1.04, 0.22],
  [-0.36, 0.7, 0.25],
  [-0.26, 0.34, 0.24],
]

/** front adjuster bar: drops down, runs across, back up */
const ADJUSTER: P3[] = [
  [0.37, 0.17, -0.22],
  [0.47, 0.13, -0.1],
  [0.47, 0.13, 0.1],
  [0.37, 0.17, 0.22],
]

/** recliner release lever (bent plastic arm along the seat side) */
const LEVER: P3[] = [
  [-0.24, 0.35, 0.31],
  [-0.05, 0.3, 0.32],
  [0.08, 0.34, 0.32],
]

const RAIL_Z = [-0.22, 0.22]
const BALL_X = [-0.24, -0.09, 0.09, 0.24]

/** serpentine heater wire over the cushion (zig-zag lanes along X) */
const HEAT_SEAT: P3[] = (() => {
  const pts: P3[] = []
  const zs = [-0.14, -0.07, 0, 0.07, 0.14]
  zs.forEach((z, i) => {
    pts.push([i % 2 ? 0.24 : -0.24, 0.505, z], [i % 2 ? -0.24 : 0.24, 0.505, z])
  })
  return pts
})()

/** serpentine heater for the backrest (local coords of the backrest group) */
const HEAT_BACK: P3[] = (() => {
  const pts: P3[] = []
  const ys = [-0.32, -0.16, 0, 0.16, 0.32]
  ys.forEach((y, i) => {
    pts.push([-0.05, y, i % 2 ? 0.18 : -0.18], [-0.05, y, i % 2 ? -0.18 : 0.18])
  })
  return pts
})()

const SEAM_Z = [-0.16, -0.08, 0, 0.08, 0.16]
const SEAM_BACK_Z = [-0.2, -0.12, -0.04, 0.04, 0.12, 0.2]

export function SeatsViewReal() {
  return (
    <group>
      {/* ------------------------------ FRAME ------------------------------ */}
      <PartGroup id="st-frame" explode={[-0.8, 0, 0]}>
        {/* bent-tube skeleton */}
        <Tube path={CUSHION_LOOP} closed r={0.024} seg={48} radial={10}>
          <PMat m="steel" rough={0.4} />
        </Tube>
        <Tube path={BACK_HOOP} r={0.022} seg={48} radial={10}>
          <PMat m="steel" rough={0.4} />
        </Tube>
        {/* backrest cross brace */}
        <Rod from={[-0.42, 0.88, -0.21]} to={[-0.42, 0.88, 0.21]} r={0.013} seg={12}>
          <PMat m="steel" rough={0.5} />
        </Rod>

        {/* recliner — toothed sector gear on the +Z side */}
        <group position={[-0.26, 0.35, 0.285]}>
          <Gear teeth={24} rRoot={0.06} rTip={0.078} h={0.022} hole={0.012}>
            <PMat m="machAlu" e={0.05} />
          </Gear>
          {/* hex pivot nut */}
          <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.022, 6]} />
            <PMat m="zincGold" />
          </mesh>
        </group>
        {/* locking pawl biting the sector teeth */}
        <RBox
          args={[0.055, 0.024, 0.02]}
          radius={0.006}
          smoothness={2}
          position={[-0.19, 0.42, 0.285]}
          rotation={[0, 0, -0.5]}
        >
          <PMat m="steel" />
        </RBox>
        {/* release lever + knob */}
        <Tube path={LEVER} r={0.011} seg={24} radial={8}>
          <PMat m="blackCast" />
        </Tube>
        <RBox args={[0.055, 0.032, 0.026]} radius={0.01} smoothness={2} position={[0.1, 0.345, 0.32]}>
          <PMat m="blackCast" />
        </RBox>
        {/* plain pivot disc on the -Z side */}
        <mesh position={[-0.26, 0.35, -0.275]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.024, 24]} />
          <PMat m="steel" />
        </mesh>
        {/* recliner side brackets */}
        {[0.262, -0.262].map((z) => (
          <RBox key={z} args={[0.1, 0.08, 0.014]} radius={0.006} smoothness={2} position={[-0.27, 0.34, z]}>
            <PMat m="blackCast" />
          </RBox>
        ))}

        {/* floor rails — two-channel sliders */}
        {RAIL_Z.map((z) => (
          <group key={z} position={[0, 0, z]}>
            {/* outer channel: base + two upturned lips */}
            <RBox args={[0.74, 0.016, 0.08]} radius={0.004} smoothness={2} position={[0, 0.13, 0]}>
              <PMat m="steel" rough={0.5} />
            </RBox>
            {[-0.034, 0.034].map((lz) => (
              <RBox key={lz} args={[0.74, 0.032, 0.012]} radius={0.004} smoothness={2} position={[0, 0.152, lz]}>
                <PMat m="steel" rough={0.5} />
              </RBox>
            ))}
            {/* inner sliding rail */}
            <RBox args={[0.6, 0.028, 0.044]} radius={0.006} smoothness={2} position={[0, 0.168, 0]}>
              <PMat m="polSteel" />
            </RBox>
            {/* bearing-ball dots in the channel gap */}
            {BALL_X.map((x, i) => (
              <mesh key={x} position={[x, 0.152, i % 2 ? 0.028 : -0.028]}>
                <sphereGeometry args={[0.011, 8, 6]} />
                <PMat m="polSteel" e={0.08} />
              </mesh>
            ))}
            {/* riser brackets up to the cushion frame */}
            {[-0.26, 0.26].map((x) => (
              <RBox key={x} args={[0.05, 0.13, 0.04]} radius={0.008} smoothness={2} position={[x, 0.24, 0]}>
                <PMat m="blackCast" />
              </RBox>
            ))}
          </group>
        ))}
        {/* height/slide adjuster bar across the front */}
        <Tube path={ADJUSTER} r={0.014} seg={32} radial={8}>
          <PMat m="blackCast" />
        </Tube>
      </PartGroup>

      {/* ------------------------------- FOAM ------------------------------ */}
      <PartGroup id="st-foam" explode={[0, 0.15, 0]}>
        {/* cushion: recessed center channel between raised side bolsters */}
        <RBox args={[0.52, 0.12, 0.3]} radius={0.04} smoothness={3} position={[0, 0.43, 0]}>
          <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
        </RBox>
        {[-1, 1].map((s) => (
          <RBox
            key={s}
            args={[0.44, 0.16, 0.16]}
            radius={0.05}
            smoothness={3}
            position={[-0.03, 0.455, s * 0.225]}
            rotation={[-s * 0.15, 0, 0]}
          >
            <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
          </RBox>
        ))}
        {/* front thigh roll */}
        <mesh position={[0.28, 0.44, -0.03]} scale={[0.7, 0.5, 1.8]}>
          <sphereGeometry args={[0.1, 16, 12]} />
          <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
        </mesh>
        {/* channel grooves between center pad and bolsters */}
        {[-0.15, 0.15].map((z) => (
          <RBox key={z} args={[0.44, 0.01, 0.014]} radius={0.003} smoothness={2} position={[-0.03, 0.492, z]}>
            <PMat color={FOAM_GROOVE} metal={0} rough={0.95} env={0.15} />
          </RBox>
        ))}
        {/* CUT corner: dual density — lighter soft layer over darker firm core */}
        <RBox args={[0.13, 0.07, 0.13]} radius={0.015} smoothness={2} position={[0.25, 0.4, 0.2]}>
          <PMat color={FOAM_FIRM} metal={0} rough={0.95} env={0.2} />
        </RBox>
        <RBox args={[0.13, 0.05, 0.13]} radius={0.015} smoothness={2} position={[0.21, 0.46, 0.16]}>
          <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
        </RBox>

        {/* backrest foam (tilted like the frame hoop) */}
        <group position={[-0.42, 0.95, 0]} rotation={[0, 0, -0.25]}>
          <RBox args={[0.14, 0.82, 0.3]} radius={0.04} smoothness={3} position={[0.01, 0, 0]}>
            <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
          </RBox>
          {[-1, 1].map((s) => (
            <RBox
              key={s}
              args={[0.16, 0.78, 0.15]}
              radius={0.05}
              smoothness={3}
              position={[0.035, 0, s * 0.21]}
              rotation={[0, -s * 0.18, 0]}
            >
              <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
            </RBox>
          ))}
          {/* shoulder roll */}
          <RBox args={[0.15, 0.12, 0.4]} radius={0.05} smoothness={3} position={[0.02, 0.44, 0]}>
            <PMat color={FOAM_SOFT} metal={0} rough={0.95} env={0.2} />
          </RBox>
          {/* vertical channel grooves */}
          {[-0.135, 0.135].map((z) => (
            <RBox key={z} args={[0.012, 0.72, 0.012]} radius={0.003} smoothness={2} position={[0.105, 0, z]}>
              <PMat color={FOAM_GROOVE} metal={0} rough={0.95} env={0.15} />
            </RBox>
          ))}
        </group>
      </PartGroup>

      {/* ------------------------------- COVER ----------------------------- */}
      <PartGroup id="st-cover" explode={[0.85, 0.25, 0]}>
        {/* draped cushion shell + skirts */}
        <RBox args={[0.68, 0.05, 0.62]} radius={0.02} smoothness={3} position={[0, 0.55, 0]}>
          <PMat color={FABRIC} metal={0} rough={0.85} env={0.25} opacity={0.82} />
        </RBox>
        <RBox args={[0.03, 0.1, 0.6]} radius={0.01} smoothness={2} position={[0.35, 0.5, 0]}>
          <PMat color={FABRIC} metal={0} rough={0.85} env={0.25} opacity={0.82} />
        </RBox>
        {[-0.3, 0.3].map((z) => (
          <RBox key={z} args={[0.68, 0.1, 0.03]} radius={0.01} smoothness={2} position={[0, 0.5, z]}>
            <PMat color={FABRIC} metal={0} rough={0.85} env={0.25} opacity={0.82} />
          </RBox>
        ))}
        {/* flute seam grooves on the cushion (run front→back) */}
        {SEAM_Z.map((z) => (
          <RBox key={z} args={[0.56, 0.006, 0.01]} radius={0.002} smoothness={2} position={[0, 0.578, z]}>
            <PMat color={SEAM} metal={0} rough={0.9} env={0.15} />
          </RBox>
        ))}
        {/* heater mat — glowing serpentine floating between foam and cover */}
        <Tube path={HEAT_SEAT} r={0.007} seg={48} radial={6}>
          <PMat color={HEAT} e={0.5} metal={0.2} rough={0.5} />
        </Tube>

        {/* backrest shell */}
        <group position={[-0.36, 0.98, 0]} rotation={[0, 0, -0.25]}>
          <RBox args={[0.06, 0.96, 0.62]} radius={0.02} smoothness={3}>
            <PMat color={FABRIC} metal={0} rough={0.85} env={0.25} opacity={0.82} />
          </RBox>
          {/* vertical flute seams */}
          {SEAM_BACK_Z.map((z) => (
            <RBox key={z} args={[0.008, 0.82, 0.01]} radius={0.002} smoothness={2} position={[0.036, 0, z]}>
              <PMat color={SEAM} metal={0} rough={0.9} env={0.15} />
            </RBox>
          ))}
          {/* backrest heater serpentine */}
          <Tube path={HEAT_BACK} r={0.007} seg={48} radial={6}>
            <PMat color={HEAT} e={0.5} metal={0.2} rough={0.5} />
          </Tube>
        </group>
      </PartGroup>
    </group>
  )
}

/* ================================ STEERING =============================== */

const COL_P0: P3 = [0.08, 0.5, 0.28] // pinion top
const COL_P1: P3 = [-0.18, 0.84, 0.1] // lower U-joint
const COL_P2: P3 = [-0.45, 1.15, -0.1] // upper U-joint
const COL_P3: P3 = [-0.75, 1.42, -0.25] // wheel hub end

const RACK_TEETH_Z = Array.from({ length: 12 }, (_, i) => 0.02 + i * 0.04)
const GRIP_ARCS = [0.75, 1.85, 3.9, 5.0]

export function SteeringViewReal() {
  const worm = useMemo(() => aim(COL_P0, COL_P1), [])
  const clock = useMemo(() => aim(COL_P2, COL_P3), [])
  return (
    <group>
      {/* ------------------------------- RACK ------------------------------ */}
      <PartGroup id="str-rack" explode={[0, -0.5, 0]}>
        {/* ground rack bar */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.048, 0.048, 1.3, 20]} />
          <PMat m="polSteel" />
        </mesh>
        {/* cast half-shell housing under the bar */}
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.8, 28, 1, true, Math.PI * 1.5, Math.PI]} />
          <PMat m="castAlu" side={THREE.DoubleSide} />
        </mesh>
        {/* mount clamps + tabs */}
        {[-0.3, 0.3].map((z) => (
          <group key={z} position={[0, 0.35, z]}>
            <mesh>
              <torusGeometry args={[0.08, 0.013, 8, 28]} />
              <PMat m="blackCast" />
            </mesh>
            <RBox args={[0.045, 0.08, 0.03]} radius={0.006} smoothness={2} position={[0, -0.07, 0]}>
              <PMat m="blackCast" />
            </RBox>
          </group>
        ))}
        {/* machined rack TEETH (angled = helical cut) */}
        {RACK_TEETH_Z.map((z) => (
          <RBox
            key={z}
            args={[0.05, 0.022, 0.026]}
            radius={0.004}
            smoothness={2}
            position={[0.005, 0.398, z]}
            rotation={[0, 0.45, 0]}
          >
            <PMat m="polSteel" e={0.05} />
          </RBox>
        ))}
        {/* pinion gear on its angled shaft, meshing the tooth row */}
        <group position={[0.04, 0.46, 0.25]} rotation={[0.3, 0, 0.3]}>
          <Gear teeth={13} rRoot={0.048} rTip={0.064} h={0.05} hole={0.014} rotation={[Math.PI / 2, 0, 0]}>
            <PMat m="steel" e={0.05} />
          </Gear>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.2, 14]} />
            <PMat m="steel" />
          </mesh>
        </group>
        {/* RUBBER BELLOWS boots, 4 corrugations each */}
        {[1, -1].map((s) => (
          <Lathe
            key={s}
            seg={24}
            pts={[
              [0.052, 0],
              [0.08, 0.028],
              [0.05, 0.055],
              [0.08, 0.082],
              [0.05, 0.11],
              [0.08, 0.137],
              [0.05, 0.165],
              [0.08, 0.192],
              [0.045, 0.22],
              [0.038, 0.24],
            ]}
            position={[0, 0.35, s * 0.42]}
            rotation={[(s * Math.PI) / 2, 0, 0]}
          >
            <PMat m="rubber" side={THREE.DoubleSide} />
          </Lathe>
        ))}
        {/* tie rods with rod ends: ball + socket + jam nut + stud */}
        {[1, -1].map((s) => (
          <group key={s}>
            <Rod from={[0, 0.345, s * 0.64]} to={[0, 0.34, s * 0.85]} r={0.018} seg={12}>
              <PMat m="steel" rough={0.4} />
            </Rod>
            {/* jam nut */}
            <mesh position={[0, 0.34, s * 0.8]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.026, 6]} />
              <PMat m="zincGold" />
            </mesh>
            {/* ball */}
            <mesh position={[0, 0.34, s * 0.88]}>
              <sphereGeometry args={[0.042, 16, 12]} />
              <PMat m="polSteel" />
            </mesh>
            {/* socket cup around the ball */}
            <mesh position={[0, 0.34, s * 0.872]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.056, 0.048, 0.05, 16, 1, true]} />
              <PMat m="blackCast" side={THREE.DoubleSide} />
            </mesh>
            {/* taper stud up to the knuckle */}
            <mesh position={[0, 0.4, s * 0.88]}>
              <cylinderGeometry args={[0.013, 0.02, 0.07, 10]} />
              <PMat m="zincGold" />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ----------------------------- EPS MOTOR --------------------------- */}
      <PartGroup id="str-motor" explode={[0.8, -0.3, 0.6]}>
        {/* motor cylinder */}
        <group position={[0.22, 0.35, 0.42]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.26, 28]} />
            <PMat m="blackCast" />
          </mesh>
          {[0.125, -0.125].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.108, 0.108, 0.022, 28]} />
              <PMat m="machAlu" />
            </mesh>
          ))}
          {/* connector block */}
          <RBox args={[0.07, 0.045, 0.06]} radius={0.008} smoothness={2} position={[0, 0.12, -0.05]}>
            <PMat m="blackCast" />
          </RBox>
          <RBox args={[0.05, 0.018, 0.04]} radius={0.004} smoothness={2} position={[0, 0.148, -0.05]}>
            <PMat color="#d7c64a" e={0.15} metal={0.4} rough={0.5} />
          </RBox>
        </group>
        {/* worm shaft from motor nose into the column housing */}
        <Rod from={[0.22, 0.35, 0.29]} to={[0.11, 0.465, 0.285]} r={0.028} seg={12}>
          <PMat m="polSteel" />
        </Rod>
        {/* WORM housing bulge on the column, with a cutaway gear window */}
        <group position={COL_P0} quaternion={worm.quat}>
          {/* housing shell with a slot cut open (window) */}
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.17, 28, 1, true, 0.5, Math.PI * 2 - 1]} />
            <PMat m="castAlu" side={THREE.DoubleSide} />
          </mesh>
          {/* dark interior behind the window */}
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.068, 0.068, 0.165, 24]} />
            <PMat color="#0e1116" metal={0.2} rough={0.9} e={0.02} />
          </mesh>
          {/* end caps */}
          {[0.005, 0.175].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry args={[0.088, 0.088, 0.016, 28]} />
              <PMat m="machAlu" />
            </mesh>
          ))}
          {/* window frame edges */}
          {[-1, 1].map((s) => (
            <RBox
              key={s}
              args={[0.012, 0.16, 0.012]}
              radius={0.003}
              smoothness={2}
              position={[Math.sin(0.25) * 0.085 * s, 0.09, Math.cos(0.25) * 0.085]}
            >
              <PMat m="machAlu" />
            </RBox>
          ))}
          {/* small worm wheel on the column shaft, visible through the slot */}
          <Gear
            teeth={18}
            rRoot={0.05}
            rTip={0.063}
            h={0.03}
            hole={0.014}
            position={[0, 0.09, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <PMat m="brass" e={0.06} />
          </Gear>
        </group>
      </PartGroup>

      {/* ------------------------------ COLUMN ----------------------------- */}
      <PartGroup id="str-column" explode={[-0.5, 0.45, -0.5]}>
        {/* intermediate shafts */}
        <Rod from={COL_P0} to={COL_P1} r={0.026} seg={14}>
          <PMat m="steel" rough={0.4} />
        </Rod>
        <Rod from={COL_P1} to={COL_P2} r={0.026} seg={14}>
          <PMat m="steel" rough={0.4} />
        </Rod>
        {/* 2 universal joints */}
        <UJoint at={COL_P1} toward={COL_P2} />
        <UJoint at={COL_P2} toward={COL_P3} />
        {/* collapsible section: inner shaft inside a larger outer jacket */}
        <Rod from={COL_P2} to={COL_P3} r={0.026} seg={14}>
          <PMat m="polSteel" />
        </Rod>
        <Rod from={lerp3(COL_P2, COL_P3, 0.08)} to={lerp3(COL_P2, COL_P3, 0.62)} r={0.042} seg={18}>
          <PMat m="blackCast" />
        </Rod>
        {/* 2 shear-pin dots on the jacket */}
        {[0.25, 0.45].map((t) => {
          const p = lerp3(COL_P2, COL_P3, t)
          return (
            <mesh key={t} position={[p[0], p[1] + 0.042, p[2]]}>
              <sphereGeometry args={[0.015, 8, 6]} />
              <PMat color="#ffb347" e={0.5} metal={0.6} rough={0.4} />
            </mesh>
          )
        })}
        {/* CLOCK SPRING disc at the top, with a ribbon slot */}
        <group position={COL_P3} quaternion={clock.quat}>
          <Lathe
            seg={40}
            pts={[
              [0.03, 0],
              [0.108, 0],
              [0.108, 0.045],
              [0.03, 0.045],
              [0.03, 0.004],
            ]}
          >
            <PMat m="blackCast" side={THREE.DoubleSide} />
          </Lathe>
          {/* dark ribbon exit slot on the rim */}
          <RBox
            args={[0.02, 0.032, 0.03]}
            radius={0.004}
            smoothness={2}
            position={[0.074, 0.022, 0.074]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <PMat color="#0e1116" metal={0.2} rough={0.9} e={0.02} />
          </RBox>
          {/* flat yellow ribbon cable peeking out tangentially */}
          <RBox
            args={[0.055, 0.018, 0.006]}
            radius={0.002}
            smoothness={2}
            position={[0.1, 0.022, 0.1]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <PMat color="#e8b84a" e={0.2} metal={0.3} rough={0.5} />
          </RBox>
          {/* hub boss */}
          <mesh position={[0, 0.052, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.02, 16]} />
            <PMat m="machAlu" />
          </mesh>
        </group>
      </PartGroup>

      {/* ------------------------------- WHEEL ----------------------------- */}
      <PartGroup id="str-wheel" explode={[-0.7, 0.75, -0.5]}>
        <group position={[-0.85, 1.52, -0.3]} rotation={[0.45, 0.35, 0]}>
          {/* leather rim */}
          <mesh>
            <torusGeometry args={[0.32, 0.034, 12, 48]} />
            <PMat color="#1c1f26" metal={0} rough={0.8} env={0.2} />
          </mesh>
          {/* 4 subtle thicker grip arcs sculpted into the rim */}
          {GRIP_ARCS.map((a) => (
            <mesh key={a} rotation={[0, 0, a]}>
              <torusGeometry args={[0.32, 0.041, 10, 10, 0.6]} />
              <PMat color="#23262e" metal={0} rough={0.75} env={0.2} />
            </mesh>
          ))}
          {/* 3 spokes */}
          {[0, 2.1, -2.1].map((a) => (
            <group key={a} rotation={[0, 0, a]}>
              <RBox args={[0.055, 0.34, 0.028]} radius={0.01} smoothness={2} position={[0, -0.14, 0]}>
                <PMat m="blackCast" />
              </RBox>
            </group>
          ))}
          {/* button pods on the two upper spokes */}
          {[2.1, -2.1].map((a) => (
            <group key={a} rotation={[0, 0, a]}>
              <RBox args={[0.06, 0.1, 0.025]} radius={0.012} smoothness={2} position={[0, -0.23, 0.026]}>
                <PMat m="blackCast" />
              </RBox>
              {[-0.025, 0.005].map((dy) => (
                <RBox key={dy} args={[0.034, 0.016, 0.008]} radius={0.003} smoothness={2} position={[0, -0.23 + dy, 0.042]}>
                  <PMat color="#8d97a8" e={0.15} metal={0.3} rough={0.4} />
                </RBox>
              ))}
            </group>
          ))}
          {/* hub */}
          <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.1, 0.07, 18]} />
            <PMat m="blackCast" />
          </mesh>
          {/* center AIRBAG pad with seam groove */}
          <RBox args={[0.2, 0.16, 0.06]} radius={0.028} smoothness={3} position={[0, -0.01, 0.045]}>
            <PMat color="#23262d" metal={0} rough={0.7} env={0.25} />
          </RBox>
          {/* U-shaped tear seam */}
          <RBox args={[0.11, 0.005, 0.006]} radius={0.002} smoothness={2} position={[0, 0.035, 0.078]}>
            <PMat color="#0c0e12" metal={0} rough={0.9} env={0.1} />
          </RBox>
          {[-0.055, 0.055].map((x) => (
            <RBox key={x} args={[0.005, 0.08, 0.006]} radius={0.002} smoothness={2} position={[x, 0, 0.078]}>
              <PMat color="#0c0e12" metal={0} rough={0.9} env={0.1} />
            </RBox>
          ))}
        </group>
      </PartGroup>
    </group>
  )
}

/* ================================== BODY ================================= */

const PAINT = '#0fb8d4'
const BUMPER_SKIN = '#17333d'

const SLAT_Y = Array.from({ length: 6 }, (_, i) => -0.08 + i * 0.04)
const FRIT_X = Array.from({ length: 15 }, (_, i) => -0.42 + i * 0.06)
/** deterministic metal-flake scatter on the color-coat step */
const FLAKES: [number, number][] = Array.from({ length: 16 }, (_, i) => [
  0.035 + ((i * 37) % 10) * 0.01,
  -0.17 + ((i * 53) % 12) * 0.03,
])

export function BodyViewReal() {
  return (
    <group>
      {/* ------------------------------ PANELS ----------------------------- */}
      <PartGroup id="bdy-panels" explode={[-0.8, 0.2, 0]}>
        {/* door skin with CURVATURE: two angled panels meeting at a crease */}
        <group position={[-0.5, 0.75, 0]} rotation={[0, 0.15, 0]}>
          <RBox args={[0.7, 0.4, 0.022]} radius={0.01} smoothness={3} position={[0, 0.195, 0.01]} rotation={[-0.1, 0, 0]}>
            <PMat color={PAINT} metal={0.75} rough={0.22} env={1.3} e={0.05} />
          </RBox>
          <RBox args={[0.7, 0.4, 0.022]} radius={0.01} smoothness={3} position={[0, -0.195, 0.01]} rotation={[0.12, 0, 0]}>
            <PMat color={PAINT} metal={0.75} rough={0.22} env={1.3} e={0.05} />
          </RBox>
          {/* crease highlight line */}
          <RBox args={[0.68, 0.009, 0.012]} radius={0.003} smoothness={2} position={[0, 0, 0.034]}>
            <PMat color="#bfeffb" metal={0.8} rough={0.12} env={1.5} e={0.1} />
          </RBox>
          {/* hemmed edge strip folded around the bottom */}
          <RBox args={[0.72, 0.028, 0.034]} radius={0.008} smoothness={2} position={[0, -0.4, 0.03]} rotation={[0.12, 0, 0]}>
            <PMat m="machAlu" />
          </RBox>
          {/* door handle scallop */}
          <RBox args={[0.16, 0.035, 0.02]} radius={0.012} smoothness={2} position={[0.18, 0.26, 0.035]}>
            <PMat color="#0b8aa0" metal={0.75} rough={0.3} env={1.0} e={0.04} />
          </RBox>
          {/* inner door frame behind the skin (ghost) */}
          <mesh position={[0, -0.03, -0.075]}>
            <boxGeometry args={[0.68, 0.78, 0.035]} />
            <GhostMat opacity={0.1} />
          </mesh>
          <mesh position={[0, 0.44, -0.07]}>
            <boxGeometry args={[0.62, 0.22, 0.025]} />
            <GhostMat opacity={0.08} />
          </mesh>
          {/* intrusion beam: diagonal UHSS tube with end brackets */}
          <Rod from={[-0.3, -0.22, -0.052]} to={[0.3, 0.1, -0.052]} r={0.024} seg={14}>
            <PMat m="steel" rough={0.35} />
          </Rod>
          {[
            [-0.31, -0.23],
            [0.31, 0.11],
          ].map(([x, y]) => (
            <RBox key={x} args={[0.05, 0.08, 0.03]} radius={0.008} smoothness={2} position={[x, y, -0.052]}>
              <PMat m="blackCast" />
            </RBox>
          ))}
        </group>

        {/* hood with understructure ribs on its underside */}
        <group position={[0.35, 1.0, -0.3]} rotation={[0.3, -0.4, 0.1]}>
          <RBox args={[0.8, 0.022, 0.55]} radius={0.01} smoothness={3}>
            <PMat color={PAINT} metal={0.75} rough={0.22} env={1.3} e={0.05} />
          </RBox>
          {/* subtle power-bulge */}
          <RBox args={[0.32, 0.014, 0.3]} radius={0.007} smoothness={2} position={[0, 0.016, 0]}>
            <PMat color={PAINT} metal={0.75} rough={0.22} env={1.3} e={0.05} />
          </RBox>
          {/* perimeter stiffening frame (visible from below) */}
          {[-0.235, 0.235].map((z) => (
            <RBox key={z} args={[0.72, 0.018, 0.035]} radius={0.005} smoothness={2} position={[0, -0.028, z]}>
              <PMat m="castAlu" rough={0.5} />
            </RBox>
          ))}
          {[-0.355, 0.355].map((x) => (
            <RBox key={x} args={[0.035, 0.018, 0.47]} radius={0.005} smoothness={2} position={[x, -0.028, 0]}>
              <PMat m="castAlu" rough={0.5} />
            </RBox>
          ))}
          {/* crossed diagonal ribs */}
          {[0.52, -0.52].map((a) => (
            <RBox key={a} args={[0.78, 0.015, 0.03]} radius={0.005} smoothness={2} position={[0, -0.028, 0]} rotation={[0, a, 0]}>
              <PMat m="castAlu" rough={0.5} />
            </RBox>
          ))}
          {/* latch striker */}
          <RBox args={[0.08, 0.02, 0.06]} radius={0.006} smoothness={2} position={[0, -0.04, 0.2]}>
            <PMat m="steel" />
          </RBox>
        </group>
      </PartGroup>

      {/* ------------------------------ BUMPERS ---------------------------- */}
      <PartGroup id="bdy-bumpers" explode={[0.9, 0, 0]}>
        <group position={[0.75, 0.5, 0.15]} rotation={[0, -0.5, 0]}>
          {/* fascia: top band + cheeks + lower band (slightly tilted = curvature) */}
          <RBox args={[0.85, 0.12, 0.05]} radius={0.015} smoothness={3} position={[0, 0.21, 0.01]} rotation={[-0.12, 0, 0]}>
            <PMat color={BUMPER_SKIN} metal={0.15} rough={0.6} env={0.5} />
          </RBox>
          {[-0.325, 0.325].map((x) => (
            <RBox key={x} args={[0.2, 0.26, 0.05]} radius={0.015} smoothness={3} position={[x, 0.025, 0]}>
              <PMat color={BUMPER_SKIN} metal={0.15} rough={0.6} env={0.5} />
            </RBox>
          ))}
          <RBox args={[0.85, 0.09, 0.05]} radius={0.015} smoothness={3} position={[0, -0.15, 0.01]} rotation={[0.08, 0, 0]}>
            <PMat color={BUMPER_SKIN} metal={0.15} rough={0.6} env={0.5} />
          </RBox>
          {/* GRILLE: dark backplate + 6 horizontal slats */}
          <RBox args={[0.46, 0.26, 0.012]} radius={0.004} smoothness={2} position={[0, 0.02, -0.015]}>
            <PMat color="#0a0d11" metal={0.1} rough={0.9} env={0.15} />
          </RBox>
          {SLAT_Y.map((y) => (
            <RBox key={y} args={[0.44, 0.02, 0.03]} radius={0.006} smoothness={2} position={[0, y + 0.02, 0.005]}>
              <PMat m="blackCast" />
            </RBox>
          ))}
          {/* fog-lamp recess + lens */}
          <group position={[-0.26, -0.15, 0.02]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.045, 20, 1, true]} />
              <PMat color="#0a0d11" metal={0.1} rough={0.9} env={0.15} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <circleGeometry args={[0.042, 20]} />
              <PMat color="#0a0d11" metal={0.1} rough={0.9} env={0.15} />
            </mesh>
            <mesh position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.031, 0.031, 0.012, 20]} />
              <PMat color="#cfe9ff" metal={0} rough={0.05} env={1.4} opacity={0.45} depthWrite={false} />
            </mesh>
          </group>
          {/* lower lip */}
          <RBox args={[0.8, 0.05, 0.07]} radius={0.015} smoothness={2} position={[0, -0.215, 0]}>
            <PMat m="rubber" />
          </RBox>
          {/* EPP energy-absorber foam block */}
          <RBox args={[0.6, 0.22, 0.09]} radius={0.015} smoothness={2} position={[0, 0.03, -0.08]}>
            <PMat color="#e6e0d2" metal={0} rough={0.95} env={0.2} e={0.03} />
          </RBox>
          {/* steel crash beam (curved: center + swept-back wings) + crush cans */}
          <RBox args={[0.42, 0.16, 0.05]} radius={0.012} smoothness={2} position={[0, 0.05, -0.16]}>
            <PMat m="steel" rough={0.35} />
          </RBox>
          {[-1, 1].map((s) => (
            <RBox key={s} args={[0.24, 0.16, 0.05]} radius={0.012} smoothness={2} position={[s * 0.3, 0.05, -0.19]} rotation={[0, -s * 0.32, 0]}>
              <PMat m="steel" rough={0.35} />
            </RBox>
          ))}
          {[-0.24, 0.24].map((x) => (
            <RBox key={x} args={[0.08, 0.12, 0.07]} radius={0.01} smoothness={2} position={[x, 0.03, -0.24]}>
              <PMat m="blackCast" />
            </RBox>
          ))}
        </group>
      </PartGroup>

      {/* ------------------------------- GLASS ----------------------------- */}
      <PartGroup id="bdy-glass" explode={[0, 0.85, 0]}>
        <group position={[0, 1.25, 0.25]} rotation={[-0.45, 0, 0]}>
          {/* 3-LAYER laminated sandwich, staggered so the edge strata read:
              outer glass / pale PVB interlayer / inner glass */}
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[1.0, 0.66, 0.012]} />
            <PMat color="#8adcf2" metal={0} rough={0.05} env={1.4} opacity={0.3} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[1.0, 0.66, 0.005]} />
            <PMat color="#f0ead8" metal={0} rough={0.4} env={0.4} opacity={0.85} />
          </mesh>
          <mesh position={[0, 0.03, -0.01]}>
            <boxGeometry args={[1.0, 0.66, 0.012]} />
            <PMat color="#8adcf2" metal={0} rough={0.05} env={1.4} opacity={0.3} depthWrite={false} />
          </mesh>
          {/* ceramic frit band around the outer sheet edge */}
          {[0.305, -0.305].map((y) => (
            <mesh key={y} position={[0, y, 0.017]}>
              <boxGeometry args={[1.0, 0.05, 0.004]} />
              <PMat color="#10151d" metal={0.1} rough={0.8} env={0.2} opacity={0.92} />
            </mesh>
          ))}
          {[-0.475, 0.475].map((x) => (
            <mesh key={x} position={[x, 0, 0.017]}>
              <boxGeometry args={[0.05, 0.66, 0.004]} />
              <PMat color="#10151d" metal={0.1} rough={0.8} env={0.2} opacity={0.92} />
            </mesh>
          ))}
          {/* frit dot fade row above the bottom band */}
          {FRIT_X.map((x) => (
            <mesh key={x} position={[x, -0.265, 0.017]}>
              <boxGeometry args={[0.014, 0.014, 0.004]} />
              <PMat color="#10151d" metal={0.1} rough={0.8} env={0.2} opacity={0.9} />
            </mesh>
          ))}
        </group>
      </PartGroup>

      {/* ------------------------------- PAINT ----------------------------- */}
      <PartGroup id="bdy-paint" explode={[0.4, -0.3, 0.9]}>
        <group position={[0.1, 0.3, 0.55]}>
          {/* steel substrate panel */}
          <RBox args={[0.6, 0.04, 0.45]} radius={0.008} smoothness={2} position={[0, 0.02, 0]}>
            <PMat m="steel" rough={0.4} />
          </RBox>
          {/* 4-layer staircase, left-aligned so each layer's top step shows.
              heights: e-coat 0.015 / primer 0.02 / color 0.012 / clear 0.025 */}
          <RBox args={[0.56, 0.015, 0.4]} radius={0.003} smoothness={2} position={[0.1, 0.0475, 0]}>
            <PMat color="#5d6670" metal={0.3} rough={0.6} env={0.4} />
          </RBox>
          <RBox args={[0.44, 0.02, 0.4]} radius={0.003} smoothness={2} position={[0.04, 0.065, 0]}>
            <PMat color="#9aa4ad" metal={0.15} rough={0.7} env={0.3} />
          </RBox>
          <RBox args={[0.32, 0.012, 0.4]} radius={0.003} smoothness={2} position={[-0.02, 0.081, 0]}>
            <PMat color={PAINT} metal={0.85} rough={0.35} env={1.0} e={0.08} />
          </RBox>
          <RBox args={[0.2, 0.025, 0.4]} radius={0.004} smoothness={2} position={[-0.08, 0.0995, 0]}>
            <PMat color="#eafcff" metal={0} rough={0.03} env={1.6} opacity={0.5} depthWrite={false} />
          </RBox>
          {/* metal-flake sparkle dots on the exposed color-coat step */}
          {FLAKES.map(([x, z], i) => (
            <mesh key={i} position={[x, 0.0885, z]}>
              <boxGeometry args={[0.008, 0.003, 0.008]} />
              <PMat m="polSteel" e={0.4} />
            </mesh>
          ))}
        </group>
      </PartGroup>
    </group>
  )
}
