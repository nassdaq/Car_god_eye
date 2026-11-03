/**
 * AirFuelThermal.tsx — photoreal-feeling procedural upgrades for the
 * air / fuel / thermal teardown stages. Replaces the schematic views:
 *
 *   TurboViewReal()    — snail volutes, twisted wheels, CHRA ¾-cutaway, wastegate linkage
 *   IntakeViewReal()   — plenum half-cutaway w/ bell-mouths, rail + injectors, throttle, airbox
 *   ExhaustViewReal()  — braided flex downpipe, cat cutaway w/ honeycomb, muffler cutaway
 *   FuelTankViewReal() — translucent shell w/ visible fuel, pump module, baffles + swirl pot
 *   RadiatorViewReal() — tube-and-fin core, crimped tanks + pressure cap, curved fan, coolant loop
 *
 * Same PartGroup ids + explode vectors as the schematic views they replace.
 * Every material is <PMat/>; segments ≤ 48; no textures, no useFrame.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { PMat, Lathe, Tube, RBox, Bolt, BoltCircle } from '../realism'

type V3 = [number, number, number]

/* --------------------------------- palette -------------------------------- */
const HEAT_IRON = '#6f5748' // heat-browned turbine housing
const INCONEL = '#d8c49a' // turbine wheel superalloy
const PA = '#2e2a26' // glass-filled nylon moldings
const PLEAT = '#e8e2d4' // filter paper
const AMBER = '#e5a33c' // oil film
const FUEL = '#d99a2b' // gasoline
const CYAN = '#36e6ff' // teaching coolant
const BRAID = '#b7c0c9' // steel braid
const CERAMIC = '#b9a98c' // cat substrate
const MAT_WHITE = '#e9e4d6' // expansion mat / glass wool
const TANK_PA = '#1d3a45' // radiator tank plastic
const SHELL_ORANGE = '#e06a38' // fuel tank shell tint

const YUP = new THREE.Vector3(0, 1, 0)
const ZUP = new THREE.Vector3(0, 0, 1)
const quatY = (d: V3) =>
  new THREE.Quaternion().setFromUnitVectors(YUP, new THREE.Vector3(...d).normalize())
const quatZ = (d: V3) =>
  new THREE.Quaternion().setFromUnitVectors(ZUP, new THREE.Vector3(...d).normalize())

/* ================================= TURBO ================================== */

/** tapering scroll segments wrapped one turn around the volute torus */
const SCROLL_SEGS = [
  { a0: Math.PI * 0.5, a1: Math.PI * 1.18, r: 0.125 },
  { a0: Math.PI * 1.18, a1: Math.PI * 1.84, r: 0.098 },
  { a0: Math.PI * 1.84, a1: Math.PI * 2.46, r: 0.074 },
] as const

function VoluteScroll({ iron }: { iron?: boolean }) {
  const segs = useMemo(
    () =>
      SCROLL_SEGS.map(({ a0, a1, r }) => ({
        r,
        path: Array.from({ length: 8 }, (_, i) => {
          const a = a0 + ((a1 - a0) * i) / 7
          return [0, 0.28 * Math.sin(a), 0.28 * Math.cos(a)] as V3
        }),
      })),
    [],
  )
  const skin = iron ? (
    <PMat m="iron" color={HEAT_IRON} e={0.04} />
  ) : (
    <PMat m="machAlu" />
  )
  return (
    <group>
      {/* torus body the snail wraps around */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.28, 0.07, 10, 40]} />
        {skin}
      </mesh>
      {segs.map((s, i) => (
        <Tube key={i} path={s.path} r={s.r} seg={22} radial={12}>
          {iron ? <PMat m="iron" color={HEAT_IRON} e={0.04} /> : <PMat m="machAlu" />}
        </Tube>
      ))}
    </group>
  )
}

const BLADES_11 = Array.from({ length: 11 }, (_, i) => (i / 11) * Math.PI * 2)
const BLADES_8 = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

/** 11 twisted inconel blades + inducer cone, axis X */
function TurbineWheel() {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.085, 0.17, 20]} />
        <PMat color={INCONEL} metal={0.95} rough={0.35} />
      </mesh>
      {BLADES_11.map((a, i) => (
        <group key={i} rotation={[a, 0, 0]}>
          {/* box twisted about its radial (y) axis + tilted */}
          <mesh position={[0.005, 0.125, 0]} rotation={[0.16, 0.58, 0]}>
            <boxGeometry args={[0.1, 0.12, 0.009]} />
            <PMat color={INCONEL} metal={0.95} rough={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.03, 0.07, 16]} />
        <PMat m="polSteel" />
      </mesh>
    </group>
  )
}

/** 8 full + 8 splitter blades (alternating lengths) + machined hub nut, axis X */
function CompWheel() {
  return (
    <group>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.09, 0.16, 20]} />
        <PMat m="machAlu" />
      </mesh>
      {BLADES_8.map((a, i) => (
        <group key={`f${i}`} rotation={[a, 0, 0]}>
          <mesh position={[0.01, 0.12, 0]} rotation={[-0.15, -0.6, 0]}>
            <boxGeometry args={[0.095, 0.13, 0.008]} />
            <PMat m="machAlu" rough={0.22} />
          </mesh>
        </group>
      ))}
      {BLADES_8.map((a, i) => (
        <group key={`s${i}`} rotation={[a + Math.PI / 8, 0, 0]}>
          <mesh position={[0.035, 0.145, 0]} rotation={[-0.12, -0.55, 0]}>
            <boxGeometry args={[0.055, 0.08, 0.007]} />
            <PMat m="machAlu" rough={0.22} />
          </mesh>
        </group>
      ))}
      {/* machined hub nut + nose */}
      <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.028, 6]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[0.118, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.012, 0.016, 12]} />
        <PMat m="polSteel" />
      </mesh>
    </group>
  )
}

export function TurboViewReal() {
  /* wastegate actuator frame: can at `can`, local -Y aims at the lever */
  const wg = useMemo(() => {
    const can = new THREE.Vector3(-0.3, 1.0, 0.42)
    const lever = new THREE.Vector3(-0.5, 0.74, 0.16)
    const d = lever.clone().sub(can)
    return {
      can,
      len: d.length(),
      q: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, -1, 0),
        d.clone().normalize(),
      ),
    }
  }, [])
  /* hose bead at the compressor outlet stub */
  const beadQ = useMemo(() => quatZ([0, 0.5, 0.45]), [])

  return (
    <group>
      {/* ------------------- turbine side (heat-browned iron) ------------------ */}
      <PartGroup id="trb-turbine" explode={[-0.9, 0, 0]}>
        <group position={[-0.55, 0.75, 0]}>
          <VoluteScroll iron />
          {/* back plate toward the CHRA */}
          <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.29, 0.29, 0.018, 36]} />
            <PMat m="iron" color={HEAT_IRON} e={0.04} />
          </mesh>
          {/* inlet stub rising off the big end of the scroll + rect flange */}
          <Tube
            path={[
              [0, 0.3, 0.02],
              [0, 0.42, 0],
              [0, 0.52, -0.02],
            ]}
            r={0.105}
            seg={12}
            radial={14}
          >
            <PMat m="iron" color={HEAT_IRON} e={0.04} />
          </Tube>
          <RBox args={[0.26, 0.022, 0.2]} radius={0.006} smoothness={2} position={[0, 0.545, -0.02]}>
            <PMat m="iron" color={HEAT_IRON} e={0.04} />
          </RBox>
          {([-0.095, 0.095] as const).map((dx) =>
            ([-0.065, 0.065] as const).map((dz) => (
              <Bolt
                key={`st${dx}${dz}`}
                position={[dx, 0.556, -0.02 + dz]}
                r={0.008}
                len={0.02}
                washer={false}
                m="steel"
              />
            )),
          )}
          {/* axial outlet (-X) + v-band ring + dark exit */}
          <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.13, 0.1, 28]} />
            <PMat m="iron" color={HEAT_IRON} e={0.04} />
          </mesh>
          <mesh position={[-0.175, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.125, 0.012, 8, 32]} />
            <PMat m="polSteel" />
          </mesh>
          <mesh position={[-0.172, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.1, 24]} />
            <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
          </mesh>
          <group position={[-0.02, 0, 0]}>
            <TurbineWheel />
          </group>
        </group>
      </PartGroup>

      {/* --------------------- compressor side (machined alu) ------------------ */}
      <PartGroup id="trb-comp" explode={[0.9, 0, 0]}>
        <group position={[0.55, 0.75, 0]}>
          <VoluteScroll />
          <mesh position={[-0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.29, 0.29, 0.018, 36]} />
            <PMat m="machAlu" />
          </mesh>
          {/* outlet stub off the scroll + hose bead + rubber coupler */}
          <Tube
            path={[
              [0, 0.3, 0],
              [0, 0.43, 0.06],
              [0, 0.5, 0.12],
            ]}
            r={0.095}
            seg={12}
            radial={14}
          >
            <PMat m="machAlu" />
          </Tube>
          <mesh position={[0, 0.5, 0.12]} quaternion={beadQ}>
            <torusGeometry args={[0.098, 0.008, 8, 28]} />
            <PMat m="machAlu" />
          </mesh>
          {/* open inlet bell (+X) with the wheel visible inside */}
          <Lathe
            seg={32}
            position={[0.12, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            pts={[
              [0.1, 0],
              [0.105, 0.02],
              [0.1, 0.05],
              [0.095, 0.08],
              [0.11, 0.12],
              [0.14, 0.155],
            ]}
          >
            <PMat m="machAlu" side={THREE.DoubleSide} />
          </Lathe>
          <group position={[0.02, 0, 0]}>
            <CompWheel />
          </group>
        </group>
      </PartGroup>

      {/* ------------- CHRA: ¾ lathe cutaway exposing the rotating group -------- */}
      <PartGroup id="trb-chra" explode={[0, -0.55, 0]}>
        <group position={[0, 0.75, 0]}>
          {/* housing, axis X, window (missing quarter) spun to face up-front */}
          <group rotation={[0, 0, -Math.PI / 2]}>
            <Lathe
              seg={40}
              phi={Math.PI * 1.5}
              rotation={[0, 0.14, 0]}
              pts={[
                [0.1, -0.26],
                [0.14, -0.22],
                [0.16, -0.12],
                [0.16, 0.12],
                [0.14, 0.22],
                [0.1, 0.26],
              ]}
            >
              <PMat m="castAlu" side={THREE.DoubleSide} />
            </Lathe>
          </group>
          {/* shaft through both wheels */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.027, 0.027, 1.14, 16]} />
            <PMat m="polSteel" />
          </mesh>
          {/* two floating bronze bearings */}
          {([-0.1, 0.1] as const).map((x) => (
            <mesh key={`brg${x}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.07, 18, 1, true]} />
              <PMat m="brass" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* oil film gap rings, inner + outer film per bearing */}
          {([-0.1, 0.1] as const).map((x) => (
            <group key={`film${x}`} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <mesh>
                <torusGeometry args={[0.042, 0.0035, 6, 24]} />
                <PMat color={AMBER} e={0.4} metal={0.2} rough={0.3} opacity={0.85} />
              </mesh>
              <mesh>
                <torusGeometry args={[0.062, 0.0035, 6, 24]} />
                <PMat color={AMBER} e={0.4} metal={0.2} rough={0.3} opacity={0.85} />
              </mesh>
            </group>
          ))}
          {/* piston-ring seals at the housing ends */}
          {([-0.245, 0.245] as const).map((x) => (
            <mesh key={`seal${x}`} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.034, 0.005, 6, 20]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* oil slinger */}
          <mesh position={[0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.048, 0.048, 0.012, 20]} />
            <PMat m="steel" />
          </mesh>
          {/* oil feed banjo on top + hard line */}
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.025, 16]} />
            <PMat m="brass" />
          </mesh>
          <Bolt position={[0, 0.185, 0]} r={0.008} len={0.03} m="zincGold" />
          <Tube
            path={[
              [0, 0.2, 0],
              [0, 0.28, 0.02],
              [0.03, 0.34, 0.06],
            ]}
            r={0.008}
            seg={10}
            radial={8}
          >
            <PMat m="steel" />
          </Tube>
          {/* oil drain below */}
          <RBox args={[0.06, 0.012, 0.045]} radius={0.004} smoothness={2} position={[0, -0.168, 0]}>
            <PMat m="steel" />
          </RBox>
          <Tube
            path={[
              [0, -0.17, 0],
              [0, -0.26, 0.03],
              [0.02, -0.35, 0.07],
            ]}
            r={0.018}
            seg={10}
            radial={10}
          >
            <PMat m="rubber" />
          </Tube>
        </group>
      </PartGroup>

      {/* ------------------- wastegate: can, rod, lever, flap ------------------- */}
      <PartGroup id="trb-wastegate" explode={[0, 0.6, 0.8]}>
        <group position={wg.can} quaternion={wg.q}>
          {/* actuator can halves + crimped lip */}
          <mesh position={[0, 0.016, 0]}>
            <cylinderGeometry args={[0.078, 0.082, 0.034, 28]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh position={[0, -0.016, 0]}>
            <cylinderGeometry args={[0.082, 0.078, 0.034, 28]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.084, 0.006, 6, 28]} />
            <PMat m="polSteel" />
          </mesh>
          {/* boost nipple */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.028, 10]} />
            <PMat m="brass" />
          </mesh>
          {/* rod with adjuster + lock nut */}
          <mesh position={[0, -wg.len / 2, 0]}>
            <cylinderGeometry args={[0.006, 0.006, wg.len - 0.08, 10]} />
            <PMat m="polSteel" />
          </mesh>
          <mesh position={[0, -wg.len * 0.55, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.045, 12]} />
            <PMat m="steel" rough={0.5} />
          </mesh>
          <mesh position={[0, -wg.len * 0.66, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.012, 6]} />
            <PMat m="zincGold" />
          </mesh>
          {/* mounting bracket plate */}
          <RBox args={[0.11, 0.014, 0.05]} radius={0.004} smoothness={2} position={[0.03, -0.05, 0]}>
            <PMat m="steel" rough={0.5} />
          </RBox>
        </group>
        {/* lever arm + pivot pin on the turbine housing */}
        <RBox args={[0.018, 0.09, 0.02]} radius={0.005} smoothness={2} position={[-0.5, 0.72, 0.14]} rotation={[0.5, 0.2, 0.1]}>
          <PMat m="steel" />
        </RBox>
        <mesh position={[-0.51, 0.68, 0.12]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
          <PMat m="steel" />
        </mesh>
        {/* flap peeking from the turbine housing */}
        <mesh position={[-0.53, 0.655, 0.1]} rotation={[0.9, 0.4, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.008, 20]} />
          <PMat m="iron" color={HEAT_IRON} e={0.05} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================= INTAKE ================================= */

/** runner stations along the plenum (world z) */
const SZ = [-0.42, -0.14, 0.14, 0.42] as const
/** pleat plate x centers of the floating filter cartridge */
const AC_PLEATS = Array.from({ length: 12 }, (_, i) => -0.915 + i * 0.03)

const INTAKE_RUNNER = (z: number): V3[] => [
  [-0.2, 0.83, z],
  [0.05, 0.8, z],
  [0.3, 0.68, z],
  [0.43, 0.575, z],
]

/** corrugated duct: MAF outlet down to the throttle inlet */
const MAF_DUCT: V3[] = [
  [-0.57, 1.12, 0.38],
  [-0.5, 1.1, 0.6],
  [-0.42, 1.0, 0.78],
  [-0.36, 0.9, 0.8],
  [-0.35, 0.86, 0.78],
]

function InjectorReal({ z }: { z: number }) {
  return (
    <group position={[0.42, 0.72, z]} rotation={[0, 0, -0.5]}>
      {/* body */}
      <mesh>
        <cylinderGeometry args={[0.024, 0.02, 0.14, 14]} />
        <PMat m="blackCast" color="#2a2f3a" />
      </mesh>
      {/* 2 o-rings */}
      <mesh position={[0, 0.062, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.021, 0.005, 6, 18]} />
        <PMat m="rubber" />
      </mesh>
      <mesh position={[0, -0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.018, 0.0045, 6, 18]} />
        <PMat m="rubber" />
      </mesh>
      {/* connector */}
      <RBox args={[0.05, 0.028, 0.034]} radius={0.005} smoothness={2} position={[0.035, 0.012, 0]} rotation={[0, 0, -0.35]}>
        <PMat m="rubber" color="#23262b" />
      </RBox>
      {/* retaining clip up to the rail */}
      <RBox args={[0.032, 0.022, 0.03]} radius={0.004} smoothness={2} position={[0, 0.095, 0]}>
        <PMat m="polSteel" />
      </RBox>
      {/* pintle tip + spray cone ghost */}
      <mesh position={[0, -0.082, 0]}>
        <cylinderGeometry args={[0.004, 0.008, 0.022, 10]} />
        <PMat m="steel" />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <coneGeometry args={[0.05, 0.11, 16, 1, true]} />
        <PMat color="#ffd27a" e={0.5} opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function IntakeViewReal() {
  /* o-ring pose at each runner's flange end (axis ≈ runner exit tangent) */
  const oringQ = useMemo(() => quatZ([0.78, -0.63, 0]), [])

  return (
    <group>
      {/* --------- plenum: half-cutaway lathe showing 4 bell-mouths inside ------ */}
      <PartGroup id="int-plenum" explode={[-0.8, 0.25, 0]}>
        <group position={[-0.35, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {/* shell, axis = world Z; gap spun to face up/+X */}
          <Lathe
            seg={44}
            phi={Math.PI * 1.3}
            rotation={[0, -2.83, 0]}
            pts={[
              [0.14, -0.56],
              [0.175, -0.52],
              [0.175, 0.5],
              [0.15, 0.54],
              [0.1, 0.56],
            ]}
          >
            <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} side={THREE.DoubleSide} />
          </Lathe>
          {/* rear end cap */}
          <mesh position={[0, -0.552, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.014, 32]} />
            <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
          </mesh>
          {/* 4 runner bell-mouth trumpets inside (flare faces into the plenum) */}
          {SZ.map((s) => (
            <Lathe
              key={`bell${s}`}
              seg={24}
              position={[0.1, s, 0]}
              rotation={[0, 0, Math.PI / 2]}
              pts={[
                [0.03, 0],
                [0.032, 0.02],
                [0.04, 0.04],
                [0.055, 0.055],
                [0.07, 0.062],
              ]}
            >
              <PMat m="machAlu" color="#8d8578" side={THREE.DoubleSide} />
            </Lathe>
          ))}
          {/* external hoop ribs */}
          {([-0.3, 0, 0.3] as const).map((s) => (
            <mesh key={`rib${s}`} position={[0, s, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18, 0.008, 6, 36]} />
              <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
            </mesh>
          ))}
          {/* throttle flange + studs at the front end (world +Z) */}
          <mesh position={[0, 0.565, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
            <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
          </mesh>
          <BoltCircle n={4} radius={0.12} r={0.006} len={0.015} m="steel" position={[0, 0.578, 0]} />
        </group>
      </PartGroup>

      {/* ------------- runners with flanges + o-ring grooves ------------------- */}
      <PartGroup id="int-runners" explode={[0.3, -0.2, 0]}>
        {SZ.map((z) => (
          <group key={`run${z}`}>
            <Tube path={INTAKE_RUNNER(z)} r={0.052} seg={24} radial={12}>
              <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
            </Tube>
            {/* port flange + gasket plate */}
            <RBox args={[0.045, 0.17, 0.15]} radius={0.008} smoothness={2} position={[0.47, 0.545, z]} rotation={[0, 0, -0.6]}>
              <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
            </RBox>
            <RBox args={[0.012, 0.15, 0.13]} radius={0.004} smoothness={2} position={[0.495, 0.528, z]} rotation={[0, 0, -0.6]}>
              <PMat m="gasket" />
            </RBox>
            {/* o-ring grooves near the flange */}
            {([0, 0.026] as const).map((s) => (
              <mesh
                key={`or${s}`}
                position={[0.4 + 0.78 * s, 0.6 - 0.63 * s, z]}
                quaternion={oringQ}
              >
                <torusGeometry args={[0.055, 0.0045, 6, 22]} />
                <PMat m="rubber" />
              </mesh>
            ))}
          </group>
        ))}
      </PartGroup>

      {/* ---------- throttle body: open bore, butterfly half-open -------------- */}
      <PartGroup id="int-throttle" explode={[0, 0.5, 0.9]}>
        <group position={[-0.35, 0.85, 0.68]}>
          {/* machined barrel, bore axis Z */}
          <Lathe
            seg={36}
            rotation={[Math.PI / 2, 0, 0]}
            pts={[
              [0.1, -0.09],
              [0.125, -0.075],
              [0.13, -0.02],
              [0.13, 0.02],
              [0.125, 0.075],
              [0.1, 0.09],
            ]}
          >
            <PMat m="machAlu" />
          </Lathe>
          {([-0.09, 0.09] as const).map((dz) => (
            <mesh key={`tf${dz}`} position={[0, 0, dz]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.015, 36]} />
              <PMat m="machAlu" />
            </mesh>
          ))}
          {/* dark open bore */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.095, 0.095, 0.19, 28, 1, true]} />
            <PMat color="#14161a" e={0.01} rough={0.9} metal={0.1} side={THREE.DoubleSide} />
          </mesh>
          {/* butterfly half-open about the X shaft */}
          <group rotation={[0.9, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.006, 28]} />
              <PMat m="brass" />
            </mesh>
          </group>
          {/* throttle shaft across the bore */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.34, 10]} />
            <PMat m="polSteel" />
          </mesh>
          {/* TPS box on one shaft end */}
          <RBox args={[0.07, 0.08, 0.055]} radius={0.01} smoothness={2} position={[-0.185, 0, 0]}>
            <PMat m="blackCast" />
          </RBox>
          <RBox args={[0.035, 0.03, 0.03]} radius={0.005} smoothness={2} position={[-0.23, 0.02, 0]}>
            <PMat m="rubber" color="#23262b" />
          </RBox>
          {/* idle air control motor */}
          <RBox args={[0.07, 0.055, 0.05]} radius={0.01} smoothness={2} position={[0.15, -0.06, 0.02]}>
            <PMat m="blackCast" />
          </RBox>
          <mesh position={[0.105, -0.06, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 14]} />
            <PMat m="steel" />
          </mesh>
        </group>
      </PartGroup>

      {/* -------- air cleaner: box + latches, floating pleated cartridge -------- */}
      <PartGroup id="int-aircleaner" explode={[-0.5, 0.75, 0.5]}>
        {/* tray */}
        <RBox args={[0.46, 0.24, 0.36]} radius={0.025} smoothness={3} position={[-0.75, 1.12, 0.3]}>
          <PMat m="blackCast" />
        </RBox>
        {/* translucent lid */}
        <RBox args={[0.46, 0.1, 0.36]} radius={0.02} smoothness={3} position={[-0.75, 1.3, 0.3]}>
          <PMat m="blackCast" color="#3d434c" opacity={0.3} depthWrite={false} />
        </RBox>
        {/* 4 spring latches */}
        {([-0.88, -0.62] as const).map((x) =>
          ([0.485, 0.115] as const).map((z) => (
            <RBox key={`lt${x}${z}`} args={[0.045, 0.07, 0.016]} radius={0.005} smoothness={2} position={[x, 1.22, z]}>
              <PMat m="polSteel" />
            </RBox>
          )),
        )}
        {/* removable filter cartridge floating above: seal frame + pleats */}
        <RBox args={[0.4, 0.026, 0.3]} radius={0.008} smoothness={2} position={[-0.75, 1.5, 0.3]}>
          <PMat m="rubber" />
        </RBox>
        {AC_PLEATS.map((x) => (
          <mesh key={`pl${x}`} position={[x, 1.558, 0.3]}>
            <boxGeometry args={[0.013, 0.085, 0.26]} />
            <PMat color={PLEAT} e={0.05} rough={0.9} metal={0} env={0.25} />
          </mesh>
        ))}
        {/* MAF: body, visible sensing window + element, connector */}
        <group position={[-0.57, 1.12, 0.38]}>
          <RBox args={[0.09, 0.075, 0.075]} radius={0.01} smoothness={2}>
            <PMat m="blackCast" color="#32373e" />
          </RBox>
          <RBox args={[0.045, 0.014, 0.034]} radius={0.004} smoothness={2} position={[0, 0.042, 0]}>
            <PMat color="#9fd8e8" e={0.2} metal={0.1} rough={0.2} opacity={0.5} depthWrite={false} />
          </RBox>
          <mesh position={[0, 0.042, 0]}>
            <boxGeometry args={[0.03, 0.006, 0.006]} />
            <PMat m="brass" />
          </mesh>
          <RBox args={[0.035, 0.025, 0.03]} radius={0.004} smoothness={2} position={[0.058, 0.01, 0]}>
            <PMat m="rubber" color="#23262b" />
          </RBox>
        </group>
        {/* corrugated duct down to the throttle */}
        <Tube path={MAF_DUCT} r={0.05} seg={28} radial={12}>
          <PMat m="rubber" color="#1b1e22" rough={0.9} />
        </Tube>
        {([0.3, 0.55, 0.8] as const).map((t) => (
          <mesh
            key={`cl${t}`}
            position={[
              MAF_DUCT[0][0] + (MAF_DUCT[4][0] - MAF_DUCT[0][0]) * t,
              MAF_DUCT[0][1] + (MAF_DUCT[4][1] - MAF_DUCT[0][1]) * t,
              MAF_DUCT[0][2] + (MAF_DUCT[4][2] - MAF_DUCT[0][2]) * t,
            ]}
            rotation={[0.5, 0.3, 0]}
          >
            <torusGeometry args={[0.054, 0.008, 6, 20]} />
            <PMat m="rubber" />
          </mesh>
        ))}
      </PartGroup>

      {/* ------------- fuel rail above with 4 injectors clipped in ------------- */}
      <PartGroup id="int-injectors" explode={[0.85, -0.35, 0]}>
        {/* machined rail */}
        <mesh position={[0.472, 0.845, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 1.02, 20]} />
          <PMat m="machAlu" />
        </mesh>
        {([-0.52, 0.52] as const).map((z) => (
          <mesh key={`rc${z}`} position={[0.472, 0.845, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.033, 0.033, 0.022, 20]} />
            <PMat m="machAlu" />
          </mesh>
        ))}
        {/* feed fitting + hex */}
        <mesh position={[0.472, 0.845, -0.555]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.05, 12]} />
          <PMat m="steel" />
        </mesh>
        <mesh position={[0.472, 0.845, -0.545]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.021, 0.021, 0.014, 6]} />
          <PMat m="zincGold" />
        </mesh>
        {SZ.map((z) => (
          <InjectorReal key={`inj${z}`} z={z} />
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ EXHAUST ================================= */

/** honeycomb dot rings on the cat brick faces: [radius, count] */
const HEX_RINGS: Array<[number, number]> = [
  [0, 1],
  [0.05, 6],
  [0.095, 10],
  [0.14, 14],
]

/** ~31 tiny 6-seg dark cylinders = honeycomb face (local axis Y) */
function HexDots({ y }: { y: number }) {
  const pts = useMemo(() => {
    const out: V3[] = []
    for (const [r, n] of HEX_RINGS)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r * 7
        out.push([Math.cos(a) * r, y, Math.sin(a) * r])
      }
    return out
  }, [y])
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.014, 0.014, 0.01, 6]} />
          <PMat color="#1b1916" e={0.01} metal={0.2} rough={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/** perforated muffler tube along X with rings of fake holes */
function PerfTube({ pos, len }: { pos: V3; len: number }) {
  const dots = useMemo(() => {
    const out: { p: V3; rot: V3 }[] = []
    for (let s = 0; s < 5; s++) {
      const x = -len / 2 + 0.08 + (s * (len - 0.16)) / 4
      for (let k = 0; k < 4; k++) {
        const a = k * (Math.PI / 2) + s * 0.45
        out.push({
          p: [x, Math.sin(a) * 0.052, Math.cos(a) * 0.052],
          rot: [-a, 0, 0],
        })
      }
    }
    return out
  }, [len])
  return (
    <group position={pos}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, len, 20]} />
        <PMat m="steel" color="#788089" rough={0.45} />
      </mesh>
      {dots.map((d, i) => (
        <mesh key={i} position={d.p} rotation={d.rot}>
          <circleGeometry args={[0.009, 8]} />
          <PMat color="#17191d" e={0.01} rough={0.9} metal={0.1} />
        </mesh>
      ))}
    </group>
  )
}

/** glass-wool packing blobs inside the muffler shell */
const WOOL: { p: V3; s: V3; r: V3 }[] = [
  { p: [0.68, 0.68, -0.05], s: [1.6, 0.9, 1.2], r: [0.3, 0.8, 0] },
  { p: [0.88, 0.72, 0.1], s: [1.2, 0.8, 1.4], r: [0.9, 0.2, 0.4] },
  { p: [1.05, 0.66, -0.12], s: [1.5, 1.0, 1.0], r: [0.1, 1.4, 0.7] },
  { p: [1.2, 0.7, 0.04], s: [1.3, 0.85, 1.25], r: [0.6, 0.4, 1.1] },
  { p: [0.78, 0.6, 0.14], s: [1.1, 0.7, 1.0], r: [1.2, 0.9, 0.2] },
  { p: [1.12, 0.56, 0.12], s: [1.25, 0.75, 1.1], r: [0.4, 1.8, 0.5] },
]

export function ExhaustViewReal() {
  /* braided flex rings: ~8 tori with slightly varying radius */
  const flex = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: -0.84 + i * 0.033,
        r: 0.097 + Math.sin(i * 1.7) * 0.005,
      })),
    [],
  )
  const flangeQ = useMemo(() => quatY([0.42, -0.67, 0]), [])

  return (
    <group>
      {/* -------------- downpipe: flange, braided flex, v-band ----------------- */}
      <PartGroup id="exh-downpipe" explode={[-0.85, 0, 0]}>
        {/* turbo-side flange disc perpendicular to the pipe */}
        <mesh position={[-1.26, 1.12, 0]} quaternion={flangeQ}>
          <cylinderGeometry args={[0.13, 0.13, 0.024, 28]} />
          <PMat m="steel" rough={0.45} />
        </mesh>
        <Tube
          path={[
            [-1.25, 1.1, 0],
            [-1.05, 0.78, 0],
            [-0.95, 0.66, 0],
            [-0.87, 0.64, 0],
          ]}
          r={0.085}
          seg={24}
          radial={14}
        >
          <PMat m="steel" color="#8d99ae" />
        </Tube>
        {/* flex liner + braid torus stack */}
        <mesh position={[-0.72, 0.635, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.078, 0.078, 0.3, 20]} />
          <PMat color="#4a4f57" e={0.02} rough={0.7} metal={0.6} />
        </mesh>
        {flex.map(({ x, r }, i) => (
          <mesh key={i} position={[x, 0.635, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[r, 0.016, 8, 28]} />
            <PMat color={BRAID} metal={0.8} rough={0.5} e={0.03} />
          </mesh>
        ))}
        <Tube
          path={[
            [-0.58, 0.63, 0],
            [-0.5, 0.615, 0],
            [-0.44, 0.6, 0],
          ]}
          r={0.085}
          seg={10}
          radial={14}
        >
          <PMat m="steel" color="#8d99ae" />
        </Tube>
        {/* v-band clamp ring + lug */}
        <mesh position={[-0.43, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.105, 0.016, 8, 36]} />
          <PMat m="polSteel" />
        </mesh>
        <RBox args={[0.028, 0.05, 0.022]} radius={0.005} smoothness={2} position={[-0.43, 0.715, 0]}>
          <PMat m="steel" />
        </RBox>
        <Bolt position={[-0.43, 0.745, 0]} r={0.006} len={0.02} washer={false} m="zincGold" />
      </PartGroup>

      {/* ------- catalytic converter: cutaway can, honeycomb brick + mat -------- */}
      <PartGroup id="exh-cat" explode={[0, 0, 0]}>
        <group position={[0, 0.6, 0]} rotation={[0, 0, -Math.PI / 2]}>
          {/* outer can half-lathe (axis = world X), gap spun up-front */}
          <Lathe
            seg={44}
            phi={Math.PI * 1.25}
            rotation={[0, 0.6, 0]}
            pts={[
              [0.085, -0.42],
              [0.2, -0.3],
              [0.21, -0.28],
              [0.21, 0.28],
              [0.2, 0.3],
              [0.085, 0.42],
            ]}
          >
            <PMat m="steel" color="#9aa3ad" side={THREE.DoubleSide} />
          </Lathe>
          {/* ceramic honeycomb brick */}
          <mesh>
            <cylinderGeometry args={[0.155, 0.155, 0.46, 32]} />
            <PMat color={CERAMIC} metal={0.05} rough={0.9} e={0.04} />
          </mesh>
          {/* hex-dot honeycomb faces */}
          <HexDots y={0.236} />
          <HexDots y={-0.236} />
          {/* expansion mat wrap (white ring) */}
          <mesh>
            <cylinderGeometry args={[0.168, 0.168, 0.44, 32, 1, true]} />
            <PMat color={MAT_WHITE} metal={0} rough={0.95} e={0.05} side={THREE.DoubleSide} />
          </mesh>
          {/* dark throat ends */}
          <mesh position={[0, 0.426, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 20]} />
            <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
          </mesh>
          <mesh position={[0, -0.426, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 20]} />
            <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
          </mesh>
        </group>
        {/* O2 sensor boss + wire */}
        <group position={[0.28, 0.79, 0.06]} rotation={[0.4, 0, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.016, 0.016, 0.05, 12]} />
            <PMat m="steel" />
          </mesh>
          <mesh position={[0, 0.032, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.016, 6]} />
            <PMat m="zincGold" />
          </mesh>
        </group>
        <Tube
          path={[
            [0.29, 0.845, 0.08],
            [0.34, 0.9, 0.14],
            [0.44, 0.92, 0.2],
          ]}
          r={0.006}
          seg={10}
          radial={8}
        >
          <PMat m="rubber" />
        </Tube>
      </PartGroup>

      {/* --------- muffler: cutaway shell, perf tubes, baffles, wool, tips ------ */}
      <PartGroup id="exh-muffler" explode={[0.9, 0, 0]}>
        {/* shell with a missing quarter opening up-front */}
        <mesh position={[0.95, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.8, 36, 1, true, Math.PI / 2, Math.PI * 1.5]} />
          <PMat m="steel" color="#8d99ae" side={THREE.DoubleSide} />
        </mesh>
        {/* end caps */}
        {([-0.39, 0.39] as const).map((dx) => (
          <mesh key={`cap${dx}`} position={[0.95 + dx, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.278, 0.278, 0.016, 36]} />
            <PMat m="steel" color="#7f8a99" />
          </mesh>
        ))}
        {/* 2 perforated tubes */}
        <PerfTube pos={[0.93, 0.56, 0.09]} len={0.72} />
        <PerfTube pos={[0.97, 0.52, -0.11]} len={0.72} />
        {/* 2 baffle plates */}
        {([0.78, 1.12] as const).map((x) => (
          <mesh key={`baf${x}`} position={[x, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.265, 0.265, 0.014, 32]} />
            <PMat m="steel" color="#6f7884" />
          </mesh>
        ))}
        {/* glass-wool packing blobs */}
        {WOOL.map((w, i) => (
          <mesh key={`wl${i}`} position={w.p} scale={w.s} rotation={w.r}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <PMat color={MAT_WHITE} metal={0} rough={0.95} e={0.06} opacity={0.35} depthWrite={false} />
          </mesh>
        ))}
        {/* polished double tips */}
        <Tube
          path={[
            [1.3, 0.56, 0.09],
            [1.42, 0.565, 0.1],
            [1.5, 0.57, 0.11],
          ]}
          r={0.042}
          seg={10}
          radial={14}
        >
          <PMat m="polSteel" />
        </Tube>
        <Tube
          path={[
            [1.3, 0.52, -0.11],
            [1.42, 0.53, -0.09],
            [1.5, 0.54, -0.07],
          ]}
          r={0.042}
          seg={10}
          radial={14}
        >
          <PMat m="polSteel" />
        </Tube>
        {([[1.53, 0.571, 0.112], [1.53, 0.542, -0.066]] as V3[]).map((p, i) => (
          <group key={`tip${i}`} position={p}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.052, 0.046, 0.06, 24]} />
              <PMat m="polSteel" />
            </mesh>
            <mesh position={[0.032, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.044, 20]} />
              <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* =============================== FUEL TANK ================================ */

export function FuelTankViewReal() {
  const capQ = useMemo(() => quatY([0.45, 0.72, -0.11]), [])
  /* internal hose coil wrapped around the pump column */
  const coil = useMemo(() => {
    const pts: V3[] = []
    for (let i = 0; i <= 14; i++) {
      const a = (i / 14) * Math.PI * 4
      pts.push([0.3 + Math.cos(a) * 0.088, 0.75 - i * 0.012, 0.2 + Math.sin(a) * 0.088])
    }
    return pts
  }, [])
  /* lock ring teeth around the pump flange */
  const teeth = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return { p: [0.3 + Math.cos(a) * 0.138, 0.805, 0.2 + Math.sin(a) * 0.138] as V3, a }
      }),
    [],
  )

  return (
    <group>
      {/* ------ translucent shell w/ visible fuel, filler neck, straps --------- */}
      <PartGroup id="tnk-shell" explode={[0, 0.85, 0]} renderOrder={5}>
        <RBox args={[1.25, 0.5, 0.9]} radius={0.07} smoothness={3} position={[0, 0.55, 0]}>
          <PMat color={SHELL_ORANGE} metal={0.2} rough={0.5} e={0.06} opacity={0.22} depthWrite={false} />
        </RBox>
        {/* fuel at ~40% fill with a flat, brighter top surface */}
        <mesh position={[0, 0.41, 0]}>
          <boxGeometry args={[1.16, 0.2, 0.82]} />
          <PMat color={FUEL} metal={0.1} rough={0.3} e={0.15} opacity={0.4} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.512, 0]}>
          <boxGeometry args={[1.16, 0.004, 0.82]} />
          <PMat color="#f0b84a" metal={0.1} rough={0.2} e={0.3} opacity={0.55} depthWrite={false} />
        </mesh>
        {/* filler neck + cap */}
        <Tube
          path={[
            [0.45, 0.74, -0.28],
            [0.58, 0.92, -0.33],
            [0.66, 1.04, -0.35],
          ]}
          r={0.045}
          seg={14}
          radial={12}
        >
          <PMat m="steel" />
        </Tube>
        <group position={[0.66, 1.05, -0.35]} quaternion={capQ}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.058, 0.058, 0.028, 24]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0, 0.038, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.007, 6, 24]} />
            <PMat m="blackCast" />
          </mesh>
        </group>
        {/* 2 steel mounting straps under the tank */}
        {([-0.33, 0.33] as const).map((x) => (
          <group key={`strap${x}`}>
            <mesh position={[x, 0.287, 0]}>
              <boxGeometry args={[0.06, 0.012, 1.0]} />
              <PMat m="steel" rough={0.4} />
            </mesh>
            {([-1, 1] as const).map((s) => (
              <mesh key={`ss${s}`} position={[x, 0.42, s * 0.485]} rotation={[-s * 0.12, 0, 0]}>
                <boxGeometry args={[0.06, 0.28, 0.014]} />
                <PMat m="steel" rough={0.4} />
              </mesh>
            ))}
          </group>
        ))}
      </PartGroup>

      {/* ------ pump module: flange + lock ring, sender, sock, hose coil -------- */}
      <PartGroup id="tnk-pump" explode={[0.75, 0, 0.55]}>
        {/* flange disc + lock ring with teeth */}
        <mesh position={[0.3, 0.805, 0.2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 32]} />
          <PMat m="machAlu" />
        </mesh>
        <mesh position={[0.3, 0.81, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.128, 0.011, 8, 32]} />
          <PMat m="steel" />
        </mesh>
        {teeth.map(({ p, a }, i) => (
          <mesh key={`th${i}`} position={p} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.03, 0.022, 0.025]} />
            <PMat m="steel" />
          </mesh>
        ))}
        {/* outlet elbow + electrical connector on the flange */}
        <Tube
          path={[
            [0.34, 0.815, 0.24],
            [0.36, 0.86, 0.26],
            [0.4, 0.885, 0.28],
          ]}
          r={0.013}
          seg={10}
          radial={8}
        >
          <PMat m="steel" />
        </Tube>
        <RBox args={[0.05, 0.028, 0.04]} radius={0.005} smoothness={2} position={[0.25, 0.828, 0.15]}>
          <PMat m="rubber" color="#23262b" />
        </RBox>
        {/* pump column */}
        <mesh position={[0.3, 0.55, 0.2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.28, 20]} />
          <PMat color="#e3cf45" metal={0.4} rough={0.5} e={0.1} />
        </mesh>
        {/* pale mesh pre-filter sock */}
        <Lathe
          seg={24}
          position={[0.3, 0.355, 0.2]}
          pts={[
            [0.025, 0],
            [0.09, 0.012],
            [0.11, 0.032],
            [0.09, 0.052],
            [0.035, 0.062],
          ]}
        >
          <PMat color="#ddd6bf" metal={0.05} rough={0.95} e={0.05} opacity={0.85} side={THREE.DoubleSide} />
        </Lathe>
        {/* sender arm + float ball */}
        <RBox args={[0.03, 0.04, 0.02]} radius={0.005} smoothness={2} position={[0.36, 0.77, 0.14]}>
          <PMat m="blackCast" />
        </RBox>
        <Tube
          path={[
            [0.36, 0.77, 0.14],
            [0.48, 0.62, 0.06],
            [0.55, 0.47, 0.01],
          ]}
          r={0.006}
          seg={12}
          radial={8}
        >
          <PMat m="steel" />
        </Tube>
        <mesh position={[0.56, 0.445, 0]}>
          <sphereGeometry args={[0.045, 16, 12]} />
          <PMat color="#3a342c" metal={0.05} rough={0.85} e={0.05} />
        </mesh>
        {/* internal hose coil around the column */}
        <Tube path={coil} r={0.011} seg={44} radial={8}>
          <PMat m="rubber" />
        </Tube>
      </PartGroup>

      {/* ----------------- baffles + swirl pot with jet pipe -------------------- */}
      <PartGroup id="tnk-baffles" explode={[-0.75, 0, -0.5]}>
        {([-0.25, 0.1] as const).map((x) => (
          <group key={`bf${x}`}>
            <mesh position={[x, 0.52, -0.05]}>
              <boxGeometry args={[0.025, 0.4, 0.72]} />
              <PMat color="#c05a2a" metal={0.3} rough={0.6} e={0.08} opacity={0.9} />
            </mesh>
            {/* lightening holes */}
            {([-0.22, 0.14] as const).map((z) => (
              <mesh key={`bh${z}`} position={[x + 0.014, 0.55, z]} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[0.05, 16]} />
                <PMat color="#17191d" e={0.01} rough={0.9} metal={0.1} />
              </mesh>
            ))}
          </group>
        ))}
        <mesh position={[-0.08, 0.52, 0.28]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.025, 0.4, 0.46]} />
          <PMat color="#c05a2a" metal={0.3} rough={0.6} e={0.08} opacity={0.9} />
        </mesh>
        {/* swirl pot: open-top cup */}
        <Lathe
          seg={28}
          position={[-0.42, 0.33, -0.2]}
          pts={[
            [0.03, 0],
            [0.085, 0.01],
            [0.09, 0.09],
            [0.088, 0.17],
          ]}
        >
          <PMat m="steel" rough={0.45} side={THREE.DoubleSide} />
        </Lathe>
        {/* jet pipe curling over the pot rim */}
        <Tube
          path={[
            [-0.18, 0.36, 0.08],
            [-0.3, 0.32, -0.04],
            [-0.4, 0.33, -0.16],
            [-0.42, 0.42, -0.2],
          ]}
          r={0.013}
          seg={20}
          radial={8}
        >
          <PMat m="steel" />
        </Tube>
        <mesh position={[-0.42, 0.44, -0.2]}>
          <cylinderGeometry args={[0.008, 0.016, 0.03, 10]} />
          <PMat m="brass" />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================ RADIATOR ================================ */

/** 24 vertical fin lines between 8 horizontal tube strips */
const FIN_XS = Array.from({ length: 24 }, (_, i) => -0.517 + i * 0.045)
const TUBE_YS = Array.from({ length: 8 }, (_, i) => -0.301 + i * 0.086)
/** 16 crimp tabs folding over each core edge */
const TAB_XS = Array.from({ length: 16 }, (_, i) => -0.525 + i * 0.07)
const FAN_AS = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2)

/** teaching coolant loop (closed) */
const COOL_LOOP: V3[] = [
  [-0.45, 1.2, 0.14],
  [-0.82, 1.02, 0.34],
  [-0.92, 0.6, 0.38],
  [-0.55, 0.3, 0.34],
  [0.55, 0.28, 0.34],
  [0.92, 0.6, 0.38],
  [0.82, 1.05, 0.34],
  [0.45, 1.22, 0.14],
]

export function RadiatorViewReal() {
  /* flow arrows seated on the loop curve */
  const arrows = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      COOL_LOOP.map((p) => new THREE.Vector3(...p)),
      true,
      'catmullrom',
      0.5,
    )
    return [0.06, 0.3, 0.56, 0.8].map((t) => ({
      p: curve.getPointAt(t),
      q: new THREE.Quaternion().setFromUnitVectors(YUP, curve.getTangentAt(t)),
    }))
  }, [])

  return (
    <group>
      {/* -------- core: dense tube-and-fin texture + side brackets -------------- */}
      <PartGroup id="rad-core" explode={[0, 0, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.1, 0.7, 0.05]} />
          <PMat color="#232a33" metal={0.6} rough={0.6} e={0.02} />
        </mesh>
        {/* 24 vertical fin lines */}
        {FIN_XS.map((x) => (
          <mesh key={`fin${x}`} position={[x, 0.75, 0]}>
            <boxGeometry args={[0.007, 0.66, 0.056]} />
            <PMat color="#8f99a4" metal={0.85} rough={0.5} e={0.03} />
          </mesh>
        ))}
        {/* 8 flat bright horizontal tube strips */}
        {TUBE_YS.map((y) => (
          <mesh key={`tub${y}`} position={[0, 0.75 + y, 0]}>
            <boxGeometry args={[1.09, 0.02, 0.062]} />
            <PMat m="machAlu" e={0.06} />
          </mesh>
        ))}
        {/* side brackets */}
        {([-0.575, 0.575] as const).map((x) => (
          <RBox key={`brk${x}`} args={[0.035, 0.74, 0.09]} radius={0.008} smoothness={2} position={[x, 0.75, 0]}>
            <PMat m="blackCast" />
          </RBox>
        ))}
      </PartGroup>

      {/* -------- tanks (perChild) with crimp tabs, stubs, drain, cap ----------- */}
      <PartGroup id="rad-tanks" perChild>
        {/* top tank */}
        <group userData={{ explode: [0, 0.6, 0] }}>
          <RBox args={[1.12, 0.16, 0.14]} radius={0.03} smoothness={3} position={[0, 1.2, 0]}>
            <PMat color={TANK_PA} metal={0.15} rough={0.6} e={0.06} />
          </RBox>
          {TAB_XS.map((x) => (
            <mesh key={`tt${x}`} position={[x, 1.117, 0]} rotation={[0.3, 0, 0]}>
              <boxGeometry args={[0.028, 0.03, 0.02]} />
              <PMat m="machAlu" rough={0.4} />
            </mesh>
          ))}
          {/* inlet stub + hose bead */}
          <Tube
            path={[
              [-0.45, 1.24, 0.02],
              [-0.52, 1.3, 0.1],
              [-0.58, 1.32, 0.18],
            ]}
            r={0.045}
            seg={12}
            radial={12}
          >
            <PMat color={TANK_PA} metal={0.15} rough={0.6} e={0.06} />
          </Tube>
          <mesh position={[-0.58, 1.32, 0.18]} rotation={[1.2, 0.2, 0]}>
            <torusGeometry args={[0.047, 0.007, 6, 22]} />
            <PMat color={TANK_PA} metal={0.15} rough={0.6} e={0.06} />
          </mesh>
          {/* filler neck the cap jewel floats above */}
          <mesh position={[0.4, 1.29, 0]}>
            <cylinderGeometry args={[0.052, 0.052, 0.07, 24]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0.4, 1.325, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.008, 6, 24]} />
            <PMat m="machAlu" />
          </mesh>
        </group>

        {/* bottom tank */}
        <group userData={{ explode: [0, -0.6, 0] }}>
          <RBox args={[1.12, 0.16, 0.14]} radius={0.03} smoothness={3} position={[0, 0.3, 0]}>
            <PMat color={TANK_PA} metal={0.15} rough={0.6} e={0.06} />
          </RBox>
          {TAB_XS.map((x) => (
            <mesh key={`bt${x}`} position={[x, 0.383, 0]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.028, 0.03, 0.02]} />
              <PMat m="machAlu" rough={0.4} />
            </mesh>
          ))}
          {/* outlet stub */}
          <Tube
            path={[
              [0.45, 0.26, 0.02],
              [0.55, 0.22, 0.12],
              [0.62, 0.2, 0.2],
            ]}
            r={0.045}
            seg={12}
            radial={12}
          >
            <PMat color={TANK_PA} metal={0.15} rough={0.6} e={0.06} />
          </Tube>
          {/* drain plug with wing */}
          <mesh position={[-0.45, 0.215, 0.04]}>
            <cylinderGeometry args={[0.018, 0.018, 0.026, 6]} />
            <PMat m="zincGold" />
          </mesh>
          <mesh position={[-0.45, 0.2, 0.04]}>
            <boxGeometry args={[0.05, 0.008, 0.012]} />
            <PMat m="zincGold" />
          </mesh>
        </group>

        {/* pressure cap jewel, exploded slightly above the neck */}
        <group userData={{ explode: [0.5, 0.75, 0] }}>
          {/* gasket 1 (large, seals the neck seat) */}
          <mesh position={[0.4, 1.37, 0]}>
            <cylinderGeometry args={[0.044, 0.044, 0.008, 24]} />
            <PMat m="rubber" />
          </mesh>
          {/* inner spring: stacked coil tori */}
          {([0, 1, 2, 3] as const).map((i) => (
            <mesh key={`sp${i}`} position={[0.4, 1.395 + i * 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.021, 0.004, 6, 16]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* gasket 2 (small, vacuum valve) */}
          <mesh position={[0.4, 1.448, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.007, 20]} />
            <PMat m="rubber" />
          </mesh>
          {/* cap body lathe + lever ears */}
          <Lathe
            seg={28}
            position={[0.4, 1.465, 0]}
            pts={[
              [0.03, 0],
              [0.062, 0.004],
              [0.065, 0.02],
              [0.05, 0.03],
              [0.028, 0.035],
            ]}
          >
            <PMat m="machAlu" />
          </Lathe>
          {([-0.057, 0.057] as const).map((dx) => (
            <mesh key={`ear${dx}`} position={[0.4 + dx, 1.482, 0]} rotation={[0, 0, dx > 0 ? -0.35 : 0.35]}>
              <boxGeometry args={[0.032, 0.008, 0.022]} />
              <PMat m="machAlu" />
            </mesh>
          ))}
        </group>
      </PartGroup>

      {/* ------------ fan: shroud, motor + pigtail, 7 curved blades ------------- */}
      <PartGroup id="rad-fan" explode={[0, 0, -0.9]}>
        {/* shroud ring */}
        <mesh position={[0, 0.75, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.37, 0.37, 0.1, 40, 1, true]} />
          <PMat m="blackCast" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.75, -0.2]}>
          <torusGeometry args={[0.375, 0.01, 8, 40]} />
          <PMat m="blackCast" />
        </mesh>
        {/* hub + motor + end bump */}
        <mesh position={[0, 0.75, -0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 24]} />
          <PMat color="#355a74" metal={0.2} rough={0.6} e={0.08} />
        </mesh>
        <mesh position={[0, 0.75, -0.235]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.09, 24]} />
          <PMat m="steel" color="#5e6670" />
        </mesh>
        <mesh position={[0, 0.75, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
          <PMat m="steel" color="#5e6670" />
        </mesh>
        {/* wire pigtail + connector */}
        <Tube
          path={[
            [0.05, 0.71, -0.27],
            [0.14, 0.62, -0.3],
            [0.22, 0.5, -0.28],
          ]}
          r={0.008}
          seg={14}
          radial={8}
        >
          <PMat m="rubber" />
        </Tube>
        <RBox args={[0.036, 0.022, 0.03]} radius={0.004} smoothness={2} position={[0.23, 0.48, -0.28]}>
          <PMat m="rubber" color="#23262b" />
        </RBox>
        {/* 7 curved blades: 2 segments each with a slight pitch step */}
        {FAN_AS.map((a, i) => (
          <group key={`bl${i}`} position={[0, 0.75, -0.17]} rotation={[0, 0, a]}>
            <mesh position={[0.01, 0.15, 0]} rotation={[0, 0.5, 0]}>
              <boxGeometry args={[0.1, 0.13, 0.012]} />
              <PMat color="#355a74" metal={0.2} rough={0.6} e={0.08} />
            </mesh>
            <mesh position={[0.04, 0.265, 0.005]} rotation={[0, 0.78, 0.15]}>
              <boxGeometry args={[0.11, 0.13, 0.012]} />
              <PMat color="#355a74" metal={0.2} rough={0.6} e={0.08} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      {/* ------------ coolant: translucent glow loop with flow arrows ----------- */}
      <PartGroup id="rad-coolant" explode={[0, 0.35, 0.85]}>
        <Tube path={COOL_LOOP} closed r={0.03} seg={48} radial={10}>
          <PMat color={CYAN} e={0.8} metal={0.1} rough={0.4} opacity={0.5} depthWrite={false} />
        </Tube>
        {arrows.map(({ p, q }, i) => (
          <mesh key={`ar${i}`} position={p} quaternion={q}>
            <coneGeometry args={[0.055, 0.11, 12]} />
            <PMat color={CYAN} e={0.8} metal={0.1} rough={0.4} opacity={0.75} depthWrite={false} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}
