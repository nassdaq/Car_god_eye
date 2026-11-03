/**
 * BodyMechView.tsx — body mechanisms teardown stage (wipers, washer, door
 * latch, window regulator, hinges + check strap, power mirror).
 *
 * Six PartGroups (bdm-wiper, bdm-washer, bdm-latch, bdm-regulator,
 * bdm-hinges, bdm-mirror) laid out on a ±1.2 stage, exploding radially.
 * Grandchildren (wpr-*) need no geometry yet — the wiper station carries them.
 *
 * Contract: every visible surface is <PMat/>, segments ≤ 40, no textures,
 * no useFrame. ≈45k tris.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { PMat, Tube, Gear, RBox } from '../realism'

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

/** Straight link/shaft between two points (cylinder, local Y aligned). */
function Rod({
  from,
  to,
  r = 0.02,
  seg = 12,
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

/** Ball stud joint: sphere in a shallow socket cup. */
function BallJoint({ at }: { at: P3 }) {
  return (
    <group position={at}>
      <mesh>
        <sphereGeometry args={[0.02, 12, 8]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[0, -0.012, 0]}>
        <cylinderGeometry args={[0.026, 0.02, 0.018, 12, 1, true]} />
        <PMat m="blackCast" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/* -------------------------------- constants -------------------------------- */

const POM = '#d8cfae'
const FLUID = '#35a7dd'
const BOTTLE = '#cfe4ec'
const GLASS = '#8adcf2'
const HEAT = '#ff8f5a'

/** linkage key points (stage coords) */
const CRANK_BALL: P3 = [-0.72, 0.47, -0.57]
const ROCKER_A: P3 = [-0.33, 0.5, -0.62]
const ROCKER_B: P3 = [0.33, 0.5, -0.62]
const BALL_A: P3 = [-0.26, 0.55, -0.57]
const BALL_B: P3 = [0.4, 0.55, -0.57]

/** blade claw positions along the spine */
const CLAW_X = [-0.36, -0.22, -0.08, 0.08, 0.22, 0.36]

/** mirror heater serpentine (local to the mirror glass back) */
const HEAT_MIRROR: P3[] = (() => {
  const pts: P3[] = []
  const ys = [-0.07, -0.023, 0.023, 0.07]
  ys.forEach((y, i) => {
    pts.push([i % 2 ? 0.12 : -0.12, y, 0], [i % 2 ? -0.12 : 0.12, y, 0])
  })
  return pts
})()

export function BodyMechViewReal() {
  return (
    <group>
      {/* ============================ WIPER DRIVE =========================== */}
      <PartGroup id="bdm-wiper" explode={[-0.6, 0.3, -0.7]}>
        {/* --- motor + worm gearbox --- */}
        <group position={[-0.85, 0.5, -0.6]}>
          {/* motor can along X */}
          <mesh position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 24]} />
            <PMat m="blackCast" />
          </mesh>
          <mesh position={[-0.265, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.082, 0.082, 0.018, 24]} />
            <PMat m="machAlu" />
          </mesh>
          {/* thermal fuse pod on the can */}
          <RBox args={[0.05, 0.02, 0.028]} radius={0.005} smoothness={2} position={[-0.16, 0.088, 0]}>
            <PMat color="#8c3030" metal={0.2} rough={0.7} e={0.1} />
          </RBox>
          {/* worm shaft exiting the can, with thread rings */}
          <mesh position={[0.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 14]} />
            <PMat m="polSteel" />
          </mesh>
          {[-0.05, -0.02, 0.01, 0.04].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.02, 0.005, 6, 14]} />
              <PMat m="polSteel" e={0.06} />
            </mesh>
          ))}
          {/* gear chamber: open-face housing showing the POM worm wheel */}
          <group position={[0.02, -0.1, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.115, 0.115, 0.055, 28, 1, true, 0.7, Math.PI * 2 - 1.4]} />
              <PMat m="castAlu" side={THREE.DoubleSide} />
            </mesh>
            {/* back cover plate */}
            <mesh position={[0, 0, -0.036]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.118, 0.118, 0.012, 28]} />
              <PMat m="castAlu" />
            </mesh>
            {/* 60:1 worm wheel in acetal */}
            <Gear teeth={24} rRoot={0.078} rTip={0.095} h={0.028} hole={0.016}>
              <PMat color={POM} metal={0.1} rough={0.6} env={0.3} e={0.05} />
            </Gear>
            {/* park-position contact disc + wiper finger */}
            <mesh position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.006, 20]} />
              <PMat m="copper" e={0.08} />
            </mesh>
            <RBox args={[0.05, 0.008, 0.006]} radius={0.002} smoothness={2} position={[0.035, 0.03, 0.024]} rotation={[0, 0, -0.5]}>
              <PMat m="brass" e={0.1} />
            </RBox>
            {/* output shaft + crank arm to the first ball */}
            <mesh position={[0, 0, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.045, 12]} />
              <PMat m="steel" />
            </mesh>
            <RBox args={[0.16, 0.026, 0.012]} radius={0.005} smoothness={2} position={[0.065, 0.015, 0.055]} rotation={[0, 0, 0.25]}>
              <PMat m="forged" />
            </RBox>
          </group>
          {/* mounting cradle bar */}
          <RBox args={[0.3, 0.018, 0.04]} radius={0.005} smoothness={2} position={[-0.08, -0.17, 0]}>
            <PMat m="blackCast" />
          </RBox>
        </group>

        {/* --- 4-bar linkage: two pivot stanchions + links --- */}
        {[ROCKER_A, ROCKER_B].map((p, i) => (
          <group key={i} position={p}>
            {/* pivot tube */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.024, 0.028, 0.14, 16]} />
              <PMat m="castAlu" />
            </mesh>
            {/* mount plate */}
            <RBox args={[0.1, 0.014, 0.08]} radius={0.004} smoothness={2} position={[0, -0.015, 0]}>
              <PMat m="blackCast" />
            </RBox>
            {/* rocker arm from the pivot to its ball stud */}
            <RBox
              args={[0.11, 0.022, 0.012]}
              radius={0.004}
              smoothness={2}
              position={[i === 0 ? 0.045 : 0.045, 0.045, 0.028]}
              rotation={[0, 0.5, 0]}
            >
              <PMat m="forged" />
            </RBox>
            {/* splined output taper up to the wiper arm */}
            <mesh position={[0, 0.145, 0]}>
              <cylinderGeometry args={[0.009, 0.015, 0.03, 12]} />
              <PMat m="polSteel" />
            </mesh>
          </group>
        ))}
        {/* drive link: motor crank → rocker A */}
        <Rod from={CRANK_BALL} to={BALL_A} r={0.013}>
          <PMat m="steel" rough={0.45} />
        </Rod>
        {/* cross link: rocker A → rocker B */}
        <Rod from={BALL_A} to={BALL_B} r={0.013}>
          <PMat m="steel" rough={0.45} />
        </Rod>
        <BallJoint at={CRANK_BALL} />
        <BallJoint at={BALL_A} />
        <BallJoint at={BALL_B} />

        {/* --- wiper arm from rocker B up to the blade --- */}
        <Rod from={[0.33, 0.65, -0.62]} to={[0.05, 0.72, -0.3]} r={0.013} seg={10}>
          <PMat m="blackCast" />
        </Rod>
        {/* spring-loaded arm head over the pivot */}
        <RBox args={[0.06, 0.035, 0.035]} radius={0.008} smoothness={2} position={[0.33, 0.66, -0.62]}>
          <PMat m="blackCast" />
        </RBox>

        {/* --- one full blade: spine + 6 claws + rubber strip + micro lip --- */}
        <group position={[0.0, 0.72, -0.26]} rotation={[0.3, 0.1, 0.04]}>
          {/* bowed spring-steel spine */}
          <Tube
            path={[
              [-0.45, 0, 0],
              [-0.22, 0.028, 0],
              [0, 0.038, 0],
              [0.22, 0.028, 0],
              [0.45, 0, 0],
            ]}
            r={0.011}
            seg={32}
            radial={8}
          >
            <PMat m="blackCast" />
          </Tube>
          {/* center attachment clip to the arm */}
          <RBox args={[0.07, 0.03, 0.03]} radius={0.007} smoothness={2} position={[0.03, 0.04, -0.01]}>
            <PMat m="blackCast" />
          </RBox>
          {/* 6 claws gripping the rubber */}
          {CLAW_X.map((x) => (
            <group key={x} position={[x, -0.012, 0]}>
              <RBox args={[0.036, 0.022, 0.01]} radius={0.003} smoothness={2} position={[0, 0, 0.012]} rotation={[0.35, 0, 0]}>
                <PMat m="steel" rough={0.4} />
              </RBox>
              <RBox args={[0.036, 0.022, 0.01]} radius={0.003} smoothness={2} position={[0, 0, -0.012]} rotation={[-0.35, 0, 0]}>
                <PMat m="steel" rough={0.4} />
              </RBox>
            </group>
          ))}
          {/* rubber strip body */}
          <RBox args={[0.88, 0.02, 0.013]} radius={0.004} smoothness={2} position={[0, -0.035, 0]}>
            <PMat m="rubber" />
          </RBox>
          {/* the 0.01 mm wiping lip (graphite-coated — faint sheen) */}
          <RBox args={[0.88, 0.014, 0.004]} radius={0.001} smoothness={2} position={[0, -0.051, 0.003]} rotation={[0.25, 0, 0]}>
            <PMat color="#2e3238" metal={0.3} rough={0.6} env={0.3} e={0.04} />
          </RBox>
        </group>
      </PartGroup>

      {/* ============================== WASHER ============================== */}
      <PartGroup id="bdm-washer" explode={[0.9, 0, -0.75]}>
        <group position={[0.9, 0.35, -0.6]} rotation={[0, 0.35, 0]}>
          {/* translucent bottle */}
          <RBox args={[0.26, 0.4, 0.2]} radius={0.035} smoothness={3} position={[0, 0, 0]}>
            <PMat color={BOTTLE} metal={0} rough={0.25} env={0.9} opacity={0.3} depthWrite={false} />
          </RBox>
          {/* fluid level inside */}
          <RBox args={[0.23, 0.2, 0.17]} radius={0.03} smoothness={2} position={[0, -0.085, 0]}>
            <PMat color={FLUID} metal={0} rough={0.3} env={0.6} opacity={0.5} depthWrite={false} e={0.12} />
          </RBox>
          {/* filler neck + cap */}
          <mesh position={[-0.07, 0.24, 0]}>
            <cylinderGeometry args={[0.028, 0.032, 0.09, 16]} />
            <PMat color={BOTTLE} metal={0} rough={0.3} env={0.7} opacity={0.45} depthWrite={false} />
          </mesh>
          <mesh position={[-0.07, 0.295, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.022, 16]} />
            <PMat color="#1f5f8a" metal={0.2} rough={0.6} e={0.08} />
          </mesh>
          {/* pump pod plugged into the wall through a rubber grommet */}
          <group position={[0.145, -0.1, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.03, 0.008, 6, 14]} />
              <PMat m="rubber" />
            </mesh>
            <mesh position={[0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.026, 0.026, 0.08, 16]} />
              <PMat m="blackCast" />
            </mesh>
            {/* impeller volute + outlet barb */}
            <mesh position={[0.085, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.032, 0.032, 0.025, 16]} />
              <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
            </mesh>
            <mesh position={[0.085, 0.03, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.03, 8]} />
              <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
            </mesh>
          </group>
          {/* hose up to the jets */}
          <Tube
            path={[
              [0.23, -0.07, 0],
              [0.27, 0.12, 0.02],
              [0.22, 0.34, 0.04],
              [0.12, 0.42, 0.04],
            ]}
            r={0.008}
            seg={20}
            radial={8}
          >
            <PMat m="rubber" />
          </Tube>
          {/* twin jet nozzles + spray ghosts */}
          {[-0.07, 0.07].map((z) => (
            <group key={z} position={[0.08, 0.44, z + 0.04]}>
              <RBox args={[0.055, 0.02, 0.032]} radius={0.005} smoothness={2}>
                <PMat m="blackCast" />
              </RBox>
              <mesh position={[-0.02, 0.012, 0]}>
                <sphereGeometry args={[0.008, 8, 6]} />
                <PMat m="brass" e={0.1} />
              </mesh>
              {/* spray fan ghost */}
              <mesh position={[-0.1, 0.07, 0]} rotation={[0, 0, -1.0]} scale={[1, 1, 0.45]}>
                <coneGeometry args={[0.075, 0.2, 12, 1, true]} />
                <PMat color="#aee2ff" metal={0} rough={0.3} env={0.4} opacity={0.12} depthWrite={false} e={0.3} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </group>
      </PartGroup>

      {/* ============================ DOOR LATCH ============================ */}
      <PartGroup id="bdm-latch" explode={[0.75, 0.15, 0.7]}>
        <group position={[0.78, 0.5, 0.52]} rotation={[0, -0.6, 0]}>
          {/* latch backplate, stood open toward the viewer */}
          <RBox args={[0.3, 0.34, 0.016]} radius={0.008} smoothness={2}>
            <PMat m="steel" rough={0.4} />
          </RBox>
          {/* fish-mouth entry slot: dark throat + two flared lips */}
          <RBox args={[0.045, 0.17, 0.02]} radius={0.006} smoothness={2} position={[0.04, -0.09, 0.008]}>
            <PMat color="#0e1116" metal={0.2} rough={0.9} e={0.02} />
          </RBox>
          <RBox args={[0.1, 0.028, 0.026]} radius={0.006} smoothness={2} position={[-0.02, -0.16, 0.012]} rotation={[0, 0, 0.45]}>
            <PMat m="machAlu" />
          </RBox>
          <RBox args={[0.1, 0.028, 0.026]} radius={0.006} smoothness={2} position={[0.1, -0.16, 0.012]} rotation={[0, 0, -0.45]}>
            <PMat m="machAlu" />
          </RBox>
          {/* ratchet wheel (fork plate) on its rivet pivot */}
          <group position={[0.04, 0.02, 0.025]}>
            <Gear teeth={8} rRoot={0.055} rTip={0.075} h={0.018} hole={0.011}>
              <PMat m="polSteel" e={0.05} />
            </Gear>
            <mesh position={[0, 0, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.016, 10]} />
              <PMat m="zincGold" />
            </mesh>
          </group>
          {/* pawl biting the ratchet, on its own pivot */}
          <RBox args={[0.1, 0.028, 0.016]} radius={0.005} smoothness={2} position={[-0.075, 0.075, 0.025]} rotation={[0, 0, -0.4]}>
            <PMat m="steel" />
          </RBox>
          <mesh position={[-0.115, 0.095, 0.025]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.02, 10]} />
            <PMat m="zincGold" />
          </mesh>
          {/* pawl return spring (coil hint) */}
          {[0, 0.008, 0.016].map((dz) => (
            <mesh key={dz} position={[-0.115, 0.095, 0.038 + dz]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.02, 0.0035, 6, 14]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* release lever down to the handle rod */}
          <Tube
            path={[
              [-0.115, 0.095, 0.05],
              [-0.17, 0.03, 0.055],
              [-0.18, -0.08, 0.055],
            ]}
            r={0.008}
            seg={16}
            radial={8}
          >
            <PMat m="blackCast" />
          </Tube>
          <mesh position={[-0.18, -0.085, 0.055]}>
            <sphereGeometry args={[0.014, 10, 8]} />
            <PMat m="blackCast" />
          </mesh>
          {/* striker: steel U-loop on its body-side plate, entering the mouth */}
          <group position={[0.04, -0.21, 0.04]}>
            <RBox args={[0.13, 0.016, 0.06]} radius={0.004} smoothness={2} position={[0, -0.02, 0]}>
              <PMat m="machAlu" />
            </RBox>
            <Tube
              path={[
                [-0.035, -0.01, 0],
                [-0.035, 0.05, 0],
                [0.035, 0.05, 0],
                [0.035, -0.01, 0],
              ]}
              r={0.009}
              seg={20}
              radial={8}
            >
              <PMat m="polSteel" />
            </Tube>
          </group>
        </group>
      </PartGroup>

      {/* ========================== WINDOW REGULATOR ======================== */}
      <PartGroup id="bdm-regulator" explode={[-0.8, 0.15, 0.7]}>
        <group position={[-0.75, 0.45, 0.55]} rotation={[0, 0.5, 0]}>
          {/* glass pane edge riding on the lift channel */}
          <RBox args={[0.5, 0.3, 0.012]} radius={0.006} smoothness={2} position={[0, 0.42, 0]} rotation={[-0.06, 0, 0]}>
            <PMat color={GLASS} metal={0} rough={0.05} env={1.4} opacity={0.3} depthWrite={false} />
          </RBox>
          <RBox args={[0.46, 0.03, 0.032]} radius={0.008} smoothness={2} position={[0, 0.265, 0]}>
            <PMat m="machAlu" />
          </RBox>
          {/* anti-pinch hint: sensing strip glowing on the channel */}
          <RBox args={[0.42, 0.008, 0.01]} radius={0.002} smoothness={2} position={[0, 0.285, 0.018]}>
            <PMat color="#ffd24a" e={0.45} metal={0.2} rough={0.5} />
          </RBox>
          {/* crossed scissor arms with center pivot + end rollers */}
          <RBox args={[0.56, 0.036, 0.013]} radius={0.005} smoothness={2} position={[0, 0.06, 0.012]} rotation={[0, 0, 0.62]}>
            <PMat m="steel" rough={0.4} />
          </RBox>
          <RBox args={[0.56, 0.036, 0.013]} radius={0.005} smoothness={2} position={[0, 0.06, -0.012]} rotation={[0, 0, -0.62]}>
            <PMat m="steel" rough={0.4} />
          </RBox>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
            <PMat m="zincGold" />
          </mesh>
          {/* rollers where the arms meet channel / base */}
          {([
            [-0.155, 0.245, 0.012],
            [0.155, 0.245, -0.012],
            [0.155, -0.125, 0.012],
          ] as P3[]).map((p, i) => (
            <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.018, 12]} />
              <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
            </mesh>
          ))}
          {/* quadrant gear on the main arm, driven by the motor pinion */}
          <group position={[-0.16, -0.1, 0.012]}>
            <Gear teeth={20} rRoot={0.085} rTip={0.102} h={0.015} hole={0.012}>
              <PMat m="steel" e={0.05} />
            </Gear>
            <Gear teeth={8} rRoot={0.026} rTip={0.038} h={0.017} hole={0.006} position={[-0.125, -0.04, 0]}>
              <PMat m="polSteel" e={0.06} />
            </Gear>
            {/* motor pod behind the pinion */}
            <mesh position={[-0.125, -0.04, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.075, 18]} />
              <PMat m="blackCast" />
            </mesh>
          </group>
          {/* cable drum + bowden loop up the guide rail */}
          <group position={[0.24, -0.1, 0.012]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.05, 18]} />
              <PMat color={POM} metal={0.1} rough={0.55} e={0.05} />
            </mesh>
            {[-0.012, 0.012].map((dz) => (
              <mesh key={dz} position={[0, 0, dz]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.046, 0.004, 6, 18]} />
                <PMat m="polSteel" />
              </mesh>
            ))}
          </group>
          {/* vertical guide rail + slider shoe */}
          <RBox args={[0.032, 0.6, 0.014]} radius={0.005} smoothness={2} position={[0.36, 0.1, 0]}>
            <PMat m="blackCast" />
          </RBox>
          <RBox args={[0.045, 0.06, 0.024]} radius={0.007} smoothness={2} position={[0.36, 0.26, 0.008]}>
            <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
          </RBox>
          {/* pulley at rail top, cables drum→pulley→shoe */}
          <mesh position={[0.36, 0.385, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.014, 12]} />
            <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
          </mesh>
          <Rod from={[0.27, -0.065, 0.024]} to={[0.345, 0.37, 0.016]} r={0.004} seg={6}>
            <PMat m="polSteel" e={0.08} />
          </Rod>
          <Rod from={[0.365, 0.37, 0.016]} to={[0.36, 0.29, 0.016]} r={0.004} seg={6}>
            <PMat m="polSteel" e={0.08} />
          </Rod>
          <Rod from={[0.25, -0.145, 0.012]} to={[0.355, 0.23, 0.012]} r={0.004} seg={6}>
            <PMat m="polSteel" e={0.08} />
          </Rod>
        </group>
      </PartGroup>

      {/* ======================== HINGES + CHECK STRAP ====================== */}
      <PartGroup id="bdm-hinges" explode={[0, 0.1, 0.95]}>
        <group position={[0.05, 0.45, 0.95]} rotation={[0, -0.3, 0]}>
          {/* upper / lower forged hinges, door leaf swung open */}
          {[0.17, -0.17].map((y) => (
            <group key={y} position={[0, y, 0]}>
              <RBox args={[0.085, 0.1, 0.022]} radius={0.006} smoothness={2} position={[-0.06, 0, 0]}>
                <PMat m="forged" />
              </RBox>
              <group rotation={[0, -0.7, 0]}>
                <RBox args={[0.085, 0.1, 0.022]} radius={0.006} smoothness={2} position={[0.06, 0, 0]}>
                  <PMat m="forged" />
                </RBox>
              </group>
              {/* hinge pin + bronze bushings */}
              <mesh>
                <cylinderGeometry args={[0.013, 0.013, 0.15, 12]} />
                <PMat m="zincGold" />
              </mesh>
              {[0.055, -0.055].map((by) => (
                <mesh key={by} position={[0, by, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
                  <PMat m="brass" />
                </mesh>
              ))}
              {/* leaf bolts */}
              {[0.028, -0.028].map((by) => (
                <mesh key={by} position={[-0.085, by, 0.013]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.009, 0.009, 0.014, 6]} />
                  <PMat m="zincGold" />
                </mesh>
              ))}
            </group>
          ))}
          {/* check strap between the hinges */}
          <group position={[0.02, 0, 0]}>
            {/* housing with roller window */}
            <RBox args={[0.1, 0.075, 0.07]} radius={0.01} smoothness={2} position={[-0.05, 0, 0]}>
              <PMat m="blackCast" />
            </RBox>
            {/* detent arm running out through the housing */}
            <RBox args={[0.34, 0.015, 0.038]} radius={0.004} smoothness={2} position={[0.1, 0, 0]}>
              <PMat m="steel" rough={0.4} />
            </RBox>
            {/* molded detent waves on the arm */}
            {[0.04, 0.12, 0.2].map((x) => (
              <mesh key={x} position={[x, 0.011, 0]} scale={[1.6, 0.8, 1]}>
                <sphereGeometry args={[0.014, 10, 6]} />
                <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
              </mesh>
            ))}
            {/* spring-loaded rollers riding the waves */}
            {[0.017, -0.017].map((y) => (
              <mesh key={y} position={[-0.035, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.034, 12]} />
                <PMat m="polSteel" />
              </mesh>
            ))}
            {/* end stop block with rubber pad */}
            <RBox args={[0.028, 0.05, 0.05]} radius={0.006} smoothness={2} position={[0.275, 0, 0]}>
              <PMat m="steel" rough={0.4} />
            </RBox>
            <RBox args={[0.012, 0.044, 0.044]} radius={0.004} smoothness={2} position={[0.293, 0, 0]}>
              <PMat m="rubber" />
            </RBox>
            {/* anchor eye at the body end */}
            <mesh position={[-0.11, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.05, 10]} />
              <PMat m="zincGold" />
            </mesh>
          </group>
        </group>
      </PartGroup>

      {/* ============================ POWER MIRROR ========================== */}
      <PartGroup id="bdm-mirror" explode={[0.85, 0.55, -0.25]}>
        <group position={[0.85, 0.85, -0.15]} rotation={[0, -2.2, 0]}>
          {/* housing shell, cut open (wedge missing) to show the works */}
          <mesh rotation={[0, Math.PI, 0]} scale={[1.4, 1, 0.9]}>
            <sphereGeometry args={[0.16, 24, 12, 0.6, Math.PI * 2 - 1.2, 0, Math.PI * 0.55]} />
            <PMat m="blackCast" side={THREE.DoubleSide} />
          </mesh>
          {/* mounting stalk */}
          <RBox args={[0.1, 0.05, 0.07]} radius={0.012} smoothness={2} position={[-0.24, -0.06, 0]}>
            <PMat m="blackCast" />
          </RBox>
          <RBox args={[0.12, 0.035, 0.05]} radius={0.01} smoothness={2} position={[-0.16, -0.03, 0]} rotation={[0, 0, 0.3]}>
            <PMat m="blackCast" />
          </RBox>
          {/* backing plate on its center ball pivot */}
          <mesh position={[0, 0, -0.045]} rotation={[Math.PI / 2, 0, 0]} scale={[1.3, 1, 1]}>
            <cylinderGeometry args={[0.115, 0.115, 0.012, 24]} />
            <PMat m="blackCast" color="#30353c" />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <sphereGeometry args={[0.03, 12, 8]} />
            <PMat m="polSteel" />
          </mesh>
          {/* two gear-motor pods (tilt + swivel) with jackscrews to the plate */}
          {[[-0.062, -0.045], [0.062, 0.03]].map(([x, y], i) => (
            <group key={i} position={[x, y, 0.025]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.026, 0.026, 0.055, 14]} />
                <PMat color="#23262b" metal={0.3} rough={0.7} e={0.04} />
              </mesh>
              <Gear teeth={8} rRoot={0.014} rTip={0.021} h={0.01} position={[0, 0, -0.035]}>
                <PMat color={POM} metal={0.1} rough={0.6} e={0.06} />
              </Gear>
              <mesh position={[0, 0, -0.052]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.006, 0.006, 0.025, 8]} />
                <PMat m="polSteel" />
              </mesh>
            </group>
          ))}
          {/* heater serpentine printed on the glass back */}
          <group position={[0, 0, -0.06]}>
            <Tube path={HEAT_MIRROR} r={0.0045} seg={40} radial={6}>
              <PMat color={HEAT} e={0.45} metal={0.2} rough={0.5} />
            </Tube>
          </group>
          {/* mirror glass (elliptical) + electrochromic tint film */}
          <mesh position={[0, 0, -0.075]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 1, 1]}>
            <cylinderGeometry args={[0.135, 0.135, 0.008, 28]} />
            <PMat color="#c9edf8" metal={0.9} rough={0.06} env={1.6} e={0.06} />
          </mesh>
          <mesh position={[0, 0, -0.082]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 1, 1]}>
            <cylinderGeometry args={[0.132, 0.132, 0.003, 28]} />
            <PMat color="#28527a" metal={0.2} rough={0.2} env={0.8} opacity={0.3} depthWrite={false} />
          </mesh>
        </group>
      </PartGroup>
    </group>
  )
}
