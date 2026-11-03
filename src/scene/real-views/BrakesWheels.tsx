/**
 * BrakesWheels.tsx — photoreal brake / caliper / wheel / tire teardown views.
 *
 * Drop-in upgrades of the schematic BrakesView / CaliperView / WheelsView /
 * TireView in assemblies-rest.tsx. Stage layouts, PartGroup ids and explode
 * directions are a hard contract with the camera presets and the data tree
 * (brk-disc also hosts deep-zoom children) — do not rename or move them.
 *
 * Every material is <PMat/> (or GhostMat for context ghosts). No textures,
 * no useFrame; heavy placement arrays and geometries are memoized.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { Ghost, GhostMat, PartGroup } from '../lib'
import { Bolt, Lathe, PMat, RBox, Tube } from '../realism'

const TAU = Math.PI * 2
/** painted caliper body color */
const PAINT = '#c0345a'

/* ================================= BRAKES ================================ */

/** friction plate: square-section annulus r 0.30→0.55, 0.025 thick */
const PLATE_PTS: [number, number][] = [
  [0.3, -0.0125],
  [0.55, -0.0125],
  [0.55, 0.0125],
  [0.3, 0.0125],
  [0.3, -0.0125],
]

/** disc hat: stud face, skirt, rivet flange onto the front plate (axis → +Z) */
const HAT_PTS: [number, number][] = [
  [0.085, 0.135],
  [0.185, 0.135],
  [0.2, 0.122],
  [0.2, 0.072],
  [0.3, 0.072],
  [0.3, 0.048],
  [0.185, 0.048],
  [0.185, 0.118],
  [0.085, 0.118],
]

/** rounded caliper end cap, swept half-profile (phi = π bulges toward +X) */
const CAL_END_PTS: [number, number][] = [
  [0.001, -0.12],
  [0.1, -0.11],
  [0.14, -0.05],
  [0.14, 0.05],
  [0.1, 0.1],
  [0.001, 0.11],
]

export function BrakesViewReal() {
  /* curved internal vanes: 3 leaning segments each, between the two plates */
  const vanes = useMemo(() => {
    const out: { pos: [number, number, number]; rot: number }[] = []
    for (let i = 0; i < 18; i++) {
      const a0 = (i / 18) * TAU
      for (let j = 0; j < 3; j++) {
        const r = 0.335 + j * 0.065
        const a = a0 + j * 0.1
        out.push({
          pos: [Math.cos(a) * r, 0.75 + Math.sin(a) * r, 0],
          rot: a + 0.28 + j * 0.08,
        })
      }
    }
    return out
  }, [])

  /* 24 drilled holes on a 4-start spiral across the face */
  const holes = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * TAU
        const r = 0.345 + (i % 4) * 0.05
        return [Math.cos(a) * r, 0.75 + Math.sin(a) * r, 0] as [number, number, number]
      }),
    [],
  )

  /* braided hose: tube path + ~10 braid rings oriented along the tangent */
  const hosePath: [number, number, number][] = [
    [0.31, 1.32, 0],
    [0.44, 1.37, 0.09],
    [0.54, 1.46, 0.17],
    [0.6, 1.53, 0.22],
  ]
  const braidRings = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      hosePath.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    )
    const z = new THREE.Vector3(0, 0, 1)
    return Array.from({ length: 10 }, (_, i) => {
      const t = 0.08 + (i / 9) * 0.84
      return {
        p: curve.getPointAt(t),
        q: new THREE.Quaternion().setFromUnitVectors(z, curve.getTangentAt(t)),
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <group>
      <PartGroup id="brk-disc" explode={[0, 0, -0.7]}>
        {/* two friction plates */}
        {[0.045, -0.045].map((z) => (
          <Lathe
            key={z}
            pts={PLATE_PTS}
            seg={48}
            position={[0, 0.75, z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <PMat m="iron" color="#70767f" rough={0.42} />
          </Lathe>
        ))}
        {/* curved cooling vanes between the plates */}
        {vanes.map((v, i) => (
          <mesh key={i} position={v.pos} rotation={[0, 0, v.rot]}>
            <boxGeometry args={[0.07, 0.02, 0.062]} />
            <PMat m="iron" color="#4a4f57" rough={0.6} />
          </mesh>
        ))}
        {/* spiral-drilled holes, flush through both faces */}
        {holes.map((p, i) => (
          <mesh key={i} position={p} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.1, 12]} />
            <PMat m="blackCast" color="#0c0f14" rough={0.9} e={0.02} />
          </mesh>
        ))}
        {/* 4 curved (angled) slots */}
        {Array.from({ length: 4 }, (_, i) => {
          const a = (i / 4) * TAU + 0.4
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.44, 0.75 + Math.sin(a) * 0.44, 0]}
              rotation={[0, 0, a + 0.5]}
            >
              <boxGeometry args={[0.17, 0.016, 0.1]} />
              <PMat m="blackCast" color="#0c0f14" rough={0.9} e={0.02} />
            </mesh>
          )
        })}
        {/* hat with 5 stud holes */}
        <Lathe pts={HAT_PTS} seg={48} position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <PMat m="blackCast" color="#33383f" side={THREE.DoubleSide} />
        </Lathe>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * TAU
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.13, 0.75 + Math.sin(a) * 0.13, 0.127]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.02, 0.02, 0.035, 12]} />
              <PMat m="blackCast" color="#0c0f14" rough={0.9} e={0.02} />
            </mesh>
          )
        })}
        {/* balance clip on the hat skirt */}
        <RBox
          args={[0.014, 0.04, 0.05]}
          radius={0.004}
          smoothness={2}
          position={[Math.cos(1.1) * 0.2, 0.75 + Math.sin(1.1) * 0.2, 0.1]}
          rotation={[0, 0, 1.1]}
        >
          <PMat m="polSteel" />
        </RBox>
      </PartGroup>

      <PartGroup id="brk-pads" explode={[0, 0.55, 0.55]}>
        {[0.1, -0.1].map((z) => {
          const s = Math.sign(z)
          return (
            <group key={z} position={[0, 1.05, z]}>
              {/* friction block with edge chamfers */}
              <RBox args={[0.4, 0.17, 0.034]} radius={0.012} smoothness={2}>
                <PMat color="#4b4238" metal={0.15} rough={0.85} env={0.3} />
              </RBox>
              {/* center wear slot */}
              <mesh>
                <boxGeometry args={[0.014, 0.175, 0.04]} />
                <PMat color="#17191d" metal={0} rough={0.9} e={0.02} />
              </mesh>
              {/* steel backing plate + 2 ears */}
              <mesh position={[0, 0, s * 0.023]}>
                <boxGeometry args={[0.44, 0.19, 0.012]} />
                <PMat m="steel" rough={0.45} />
              </mesh>
              {[-0.245, 0.245].map((x) => (
                <mesh key={x} position={[x, -0.02, s * 0.023]}>
                  <boxGeometry args={[0.05, 0.07, 0.012]} />
                  <PMat m="steel" rough={0.45} />
                </mesh>
              ))}
              {/* anti-rattle shim layer */}
              <mesh position={[0, 0.005, s * 0.0315]}>
                <boxGeometry args={[0.41, 0.165, 0.004]} />
                <PMat m="polSteel" e={0.06} />
              </mesh>
              {/* wear-indicator finger on the inner pad */}
              {z > 0 && (
                <group position={[0.17, -0.095, -0.012]}>
                  <mesh>
                    <boxGeometry args={[0.012, 0.045, 0.006]} />
                    <PMat m="steel" />
                  </mesh>
                  <mesh position={[0, -0.025, -0.014]} rotation={[0.9, 0, 0]}>
                    <boxGeometry args={[0.012, 0.035, 0.004]} />
                    <PMat m="steel" />
                  </mesh>
                </group>
              )}
            </group>
          )
        })}
      </PartGroup>

      <PartGroup id="brk-caliper" explode={[0, 0.8, 0]}>
        {/* two-piece stacked body */}
        <RBox args={[0.46, 0.16, 0.33]} radius={0.05} smoothness={2} position={[0, 1.21, 0]}>
          <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} />
        </RBox>
        <RBox args={[0.5, 0.09, 0.37]} radius={0.035} smoothness={2} position={[0, 1.3, 0]}>
          <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} />
        </RBox>
        {[0.155, -0.155].map((z) => (
          <RBox
            key={z}
            args={[0.5, 0.27, 0.075]}
            radius={0.03}
            smoothness={2}
            position={[0, 1.06, z]}
          >
            <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} />
          </RBox>
        ))}
        {/* rounded end radii via half-lathes */}
        {[0.25, -0.25].map((x) => (
          <Lathe
            key={x}
            pts={CAL_END_PTS}
            phi={Math.PI}
            seg={28}
            position={[x, 1.19, 0]}
            rotation={[0, x > 0 ? 0 : Math.PI, 0]}
          >
            <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} side={THREE.DoubleSide} />
          </Lathe>
        ))}
        {/* bridge bolts ×2 */}
        {[0.13, -0.13].map((x) => (
          <Bolt key={x} position={[x, 1.35, 0]} r={0.016} len={0.11} m="zincGold" />
        ))}
        {/* banjo fitting + braided line */}
        <group position={[0.28, 1.315, 0]}>
          <mesh>
            <cylinderGeometry args={[0.034, 0.034, 0.032, 16]} />
            <PMat m="brass" />
          </mesh>
          <Bolt position={[0, 0.018, 0]} r={0.012} len={0.05} washer={false} m="zincGold" />
        </group>
        <mesh position={[0.325, 1.325, 0.005]} rotation={[0.2, 0, 1.2]}>
          <cylinderGeometry args={[0.024, 0.024, 0.05, 10]} />
          <PMat m="brass" />
        </mesh>
        <Tube path={hosePath} r={0.02} seg={32} radial={10}>
          <PMat m="polSteel" color="#c8ccd4" rough={0.35} />
        </Tube>
        {braidRings.map((ring, i) => (
          <mesh key={i} position={ring.p} quaternion={ring.q}>
            <torusGeometry args={[0.027, 0.0045, 6, 16]} />
            <PMat m="polSteel" e={0.06} />
          </mesh>
        ))}
        {/* bleed nipple with rubber cap */}
        <group position={[-0.3, 1.33, 0.08]} rotation={[0.4, 0, 0.3]}>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.025, 6]} />
            <PMat m="steel" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.013, 0.018, 0.09, 10]} />
            <PMat m="steel" rough={0.4} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.019, 0.019, 0.035, 10]} />
            <PMat m="rubber" />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup id="brk-fluid" explode={[0.8, 0.4, 0.4]}>
        {/* feed stub to the reservoir */}
        <Tube
          path={[
            [0.6, 1.52, 0.22],
            [0.66, 1.51, 0.24],
            [0.68, 1.527, 0.25],
          ]}
          r={0.016}
          seg={12}
          radial={8}
        >
          <PMat m="steel" rough={0.4} />
        </Tube>
        <group position={[0.68, 1.6, 0.25]}>
          {/* translucent reservoir body */}
          <mesh>
            <cylinderGeometry args={[0.07, 0.065, 0.15, 20]} />
            <PMat color="#efe6c0" metal={0} rough={0.25} opacity={0.35} depthWrite={false} />
          </mesh>
          {/* fluid level */}
          <mesh position={[0, -0.015, 0]}>
            <cylinderGeometry args={[0.058, 0.055, 0.1, 18]} />
            <PMat color="#c9a227" metal={0} rough={0.2} opacity={0.55} depthWrite={false} e={0.1} />
          </mesh>
          {/* MAX / MIN lines */}
          {[0.045, -0.045].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.0705, 0.003, 6, 24]} />
              <PMat color="#e8ecf4" metal={0.2} rough={0.4} e={0.15} />
            </mesh>
          ))}
          {/* cap */}
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.05, 0.046, 0.03, 20]} />
            <PMat m="blackCast" />
          </mesh>
          <mesh position={[0, 0.108, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.012, 12]} />
            <PMat m="blackCast" color="#3a3f46" />
          </mesh>
          {/* neck */}
          <mesh position={[0, -0.085, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.03, 12]} />
            <PMat color="#efe6c0" metal={0} rough={0.3} opacity={0.5} depthWrite={false} />
          </mesh>
        </group>
      </PartGroup>
    </group>
  )
}

/* ================================ CALIPER ================================ */

/** piston cup: closed crown at +y (pad side), rolled lip at -y (axis → ±Z) */
const PISTON_PTS: [number, number][] = [
  [0.001, 0.068],
  [0.088, 0.068],
  [0.096, 0.058],
  [0.096, -0.052],
  [0.086, -0.062],
  [0.078, -0.07],
  [0.07, -0.062],
  [0.08, -0.052],
  [0.08, 0.05],
  [0.001, 0.05],
]

/** rolled dust boot: small bellows around the exposed piston lip */
const BOOT_PTS: [number, number][] = [
  [0.1, 0.012],
  [0.126, 0.022],
  [0.102, 0.032],
  [0.128, 0.044],
  [0.104, 0.054],
  [0.118, 0.064],
]

/** banjo bolt cutaway: closed profile incl. the hollow core wall at r 0.011 */
const BANJO_PTS: [number, number][] = [
  [0.011, -0.065],
  [0.026, -0.065],
  [0.026, -0.008],
  [0.044, -0.008],
  [0.044, 0.024],
  [0.011, 0.024],
  [0.011, -0.065],
]

export function CaliperViewReal() {
  return (
    <group>
      <PartGroup id="cal-body" perChild>
        {[0.26, -0.26].map((z) => {
          const s = Math.sign(z)
          return (
            <group key={z} userData={{ explode: [0, 0, s * 0.7] }}>
              {/* cast half */}
              <RBox args={[0.85, 0.42, 0.24]} radius={0.06} smoothness={2} position={[0, 0.75, z]}>
                <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} />
              </RBox>
              {/* bridge arm */}
              <RBox
                args={[0.7, 0.18, 0.09]}
                radius={0.03}
                smoothness={2}
                position={[0, 0.99, z * 0.55]}
                rotation={[s * -0.6, 0, 0]}
              >
                <PMat color={PAINT} metal={0.4} rough={0.45} env={0.8} />
              </RBox>
              {/* machined gasket face */}
              <mesh position={[0, 0.75, z - s * 0.116]}>
                <boxGeometry args={[0.78, 0.36, 0.008]} />
                <PMat m="machAlu" />
              </mesh>
              {/* pad abutment rails */}
              {[-0.345, 0.345].map((x) => (
                <RBox
                  key={x}
                  args={[0.07, 0.36, 0.03]}
                  radius={0.01}
                  smoothness={2}
                  position={[x, 0.75, z - s * 0.1]}
                >
                  <PMat m="machAlu" rough={0.3} />
                </RBox>
              ))}
              {/* crossover drilling tubes, meeting at the parting line */}
              {[0.3, -0.3].map((x) => (
                <group key={x}>
                  <Tube
                    path={[
                      [x, 0.88, z],
                      [x, 1.02, z * 0.5],
                      [x, 1.07, s * 0.01],
                    ]}
                    r={0.02}
                    seg={20}
                    radial={8}
                  >
                    <PMat m="steel" rough={0.4} />
                  </Tube>
                  {/* hex fitting at the half, union flange at the joint */}
                  <mesh position={[x, 0.88, z]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.028, 0.028, 0.03, 6]} />
                    <PMat m="steel" />
                  </mesh>
                  <mesh position={[x, 1.07, s * 0.012]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.012, 12]} />
                    <PMat m="machAlu" />
                  </mesh>
                </group>
              ))}
            </group>
          )
        })}
      </PartGroup>

      <PartGroup id="cal-pistons" perChild>
        {[-0.22, 0.22].flatMap((x) =>
          [0.12, -0.12].map((z) => {
            const rot: [number, number, number] = [(-Math.sign(z) * Math.PI) / 2, 0, 0]
            return (
              <group key={`${x}${z}`} userData={{ explode: [0, 0, Math.sign(z) * 1.1] }}>
                {/* phenolic piston cup */}
                <Lathe pts={PISTON_PTS} seg={36} position={[x, 0.75, z]} rotation={rot}>
                  <PMat color="#46413a" metal={0.1} rough={0.65} env={0.3} />
                </Lathe>
                {/* rolled dust boot bellows around the lip */}
                <Lathe pts={BOOT_PTS} seg={36} position={[x, 0.75, z]} rotation={rot}>
                  <PMat m="rubber" side={THREE.DoubleSide} />
                </Lathe>
              </group>
            )
          }),
        )}
      </PartGroup>

      <PartGroup id="cal-seals" explode={[0.85, 0.35, 0]}>
        {[-0.22, 0.22].flatMap((x) =>
          [0.2, -0.2].map((z) => (
            <group key={`${x}${z}`} position={[x, 0.75, z]}>
              {/* square-section seal: 4-segment torus squashed flat */}
              <mesh scale={[1, 1, 0.55]}>
                <torusGeometry args={[0.102, 0.017, 4, 28]} />
                <PMat m="rubber" color="#14171d" />
              </mesh>
              {/* machined groove recess behind it */}
              <mesh position={[0, 0, Math.sign(z) * 0.018]} scale={[1, 1, 0.3]}>
                <torusGeometry args={[0.104, 0.024, 6, 28]} />
                <PMat color="#0a0d12" metal={0.2} rough={0.9} e={0.02} />
              </mesh>
            </group>
          )),
        )}
      </PartGroup>

      <PartGroup id="cal-bleed" explode={[0, 0.75, 0.5]}>
        {/* bleed screw: hex + taper seat + nipple with drilling dot */}
        <group position={[0.3, 1.0, 0.26]} rotation={[-0.4, 0, 0]}>
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.03, 6]} />
            <PMat m="steel" />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <cylinderGeometry args={[0.012, 0.018, 0.07, 10]} />
            <PMat m="steel" rough={0.4} />
          </mesh>
          <mesh position={[0, 0.048, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.035, 8]} />
            <PMat m="steel" />
          </mesh>
          <mesh position={[0, 0.067, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.005, 8]} />
            <PMat color="#0a0d12" metal={0.2} rough={0.9} e={0.02} />
          </mesh>
        </group>

        {/* banjo bolt cutaway: half-lathe shows the hollow core */}
        <group position={[-0.3, 0.98, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <Lathe pts={BANJO_PTS} phi={Math.PI} seg={24}>
            <PMat m="zincGold" side={THREE.DoubleSide} />
          </Lathe>
          {/* dark hollow core + cross-drilling */}
          <mesh position={[0, -0.025, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.08, 10]} />
            <PMat color="#0a0d12" metal={0.1} rough={0.9} e={0.02} />
          </mesh>
          <mesh position={[0.02, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.02, 8]} />
            <PMat color="#0a0d12" metal={0.1} rough={0.9} e={0.02} />
          </mesh>
          {/* copper crush washers */}
          {[-0.014, -0.052].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.4]}>
              <torusGeometry args={[0.045, 0.009, 6, 20]} />
              <PMat m="copper" />
            </mesh>
          ))}
        </group>
      </PartGroup>
    </group>
  )
}

/* ================================= WHEELS ================================ */

/** rim barrel with drop-center dip (axis → +Z) */
const RIM_PTS: [number, number][] = [
  [0.47, -0.175],
  [0.43, -0.16],
  [0.405, -0.12],
  [0.405, -0.05],
  [0.36, -0.005],
  [0.405, 0.045],
  [0.405, 0.1],
  [0.43, 0.15],
  [0.47, 0.17],
]

/** rim center face: bore 0.072 out to r 0.28, slightly dished */
const RIM_CENTER_PTS: [number, number][] = [
  [0.072, 0.075],
  [0.28, 0.06],
  [0.28, 0.085],
  [0.072, 0.115],
  [0.072, 0.075],
]

/** hub: locating nose + flange (axis → +Z) */
const HUB_PTS: [number, number][] = [
  [0.03, -0.005],
  [0.255, -0.005],
  [0.255, 0.035],
  [0.064, 0.035],
  [0.064, 0.11],
  [0.03, 0.115],
]

/** 5 twin-spoke pairs */
const SPOKE_ANGLES: number[] = Array.from({ length: 10 }, (_, i) => {
  const base = (Math.floor(i / 2) / 5) * TAU
  return base + (i % 2 ? 0.13 : -0.13)
})

const LUG_ANGLES: number[] = Array.from({ length: 5 }, (_, i) => (i / 5) * TAU)

/** valve stem angular position on the barrel */
const VA = Math.atan2(0.29, 0.3)

export function WheelsViewReal() {
  /* tapered twin-spoke silhouette, extruded with a soft bevel */
  const spokeGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.03, 0.24)
    s.quadraticCurveTo(-0.027, 0.33, -0.016, 0.405)
    s.lineTo(0.016, 0.405)
    s.quadraticCurveTo(0.027, 0.33, 0.03, 0.24)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 1,
      curveSegments: 5,
    })
    return g
  }, [])

  /* shoulder tread blocks for the fitted-tire look */
  const shoulderBlocks = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * TAU
        return a
      }),
    [],
  )

  return (
    <group>
      <PartGroup id="whl-tire" explode={[0, 0, 0.9]}>
        <mesh position={[0, 0.85, 0]}>
          <torusGeometry args={[0.6, 0.22, 22, 48]} />
          <PMat m="rubber" color="#15181e" rough={0.95} />
        </mesh>
        {/* shoulder tread blocks */}
        {shoulderBlocks.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.79, 0.85 + Math.sin(a) * 0.79, 0]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[0.045, 0.055, 0.16]} />
            <PMat color="#1d2229" metal={0.05} rough={0.95} env={0.15} e={0.03} />
          </mesh>
        ))}
        {/* circumferential grooves */}
        {[0, 0.08, -0.08].map((z) => (
          <mesh key={z} position={[0, 0.85, z]}>
            <torusGeometry args={[0.812, 0.008, 6, 48]} />
            <PMat color="#0a0d12" metal={0} rough={0.95} e={0.02} />
          </mesh>
        ))}
        {/* sidewall lettering bands */}
        {[0.185, -0.185].map((z) => (
          <mesh key={z} position={[0, 0.85, z]} scale={[1, 1, 0.35]}>
            <torusGeometry args={[0.67, 0.01, 6, 48]} />
            <PMat color="#2c323b" metal={0.05} rough={0.9} e={0.05} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="whl-rim" explode={[0, 0, -0.75]}>
        {/* barrel with drop center */}
        <Lathe pts={RIM_PTS} seg={48} position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <PMat m="castAlu" side={THREE.DoubleSide} />
        </Lathe>
        {/* machined lip ring */}
        <mesh position={[0, 0.85, 0.165]} scale={[1, 1, 0.5]}>
          <torusGeometry args={[0.45, 0.012, 8, 48]} />
          <PMat m="polSteel" e={0.06} />
        </mesh>
        {/* twin-5-spoke face with back-pads */}
        {SPOKE_ANGLES.map((ang, i) => (
          <group key={i} position={[0, 0.85, 0]} rotation={[0, 0, ang]}>
            <mesh geometry={spokeGeo} position={[0, 0, 0.07]}>
              <PMat m="machAlu" color="#ccd3da" />
            </mesh>
            <mesh position={[0, 0.39, 0.052]}>
              <boxGeometry args={[0.075, 0.05, 0.028]} />
              <PMat m="castAlu" />
            </mesh>
          </group>
        ))}
        {/* center face with lug bores + bore ring */}
        <Lathe pts={RIM_CENTER_PTS} seg={40} position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <PMat m="machAlu" />
        </Lathe>
        {LUG_ANGLES.map((a, i) => (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.22, 0.85 + Math.sin(a) * 0.22, 0.09]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.034, 0.034, 0.05, 14]} />
            <PMat color="#1a1e25" metal={0.4} rough={0.6} e={0.02} />
          </mesh>
        ))}
        <mesh position={[0, 0.85, 0.112]} scale={[1, 1, 0.5]}>
          <torusGeometry args={[0.075, 0.006, 6, 28]} />
          <PMat m="polSteel" />
        </mesh>
        {/* valve bore through the barrel */}
        <mesh
          position={[Math.cos(VA) * 0.405, 0.85 + Math.sin(VA) * 0.405, 0.05]}
          rotation={[0, 0, VA - Math.PI / 2]}
        >
          <cylinderGeometry args={[0.013, 0.013, 0.05, 10]} />
          <PMat color="#1a1e25" metal={0.4} rough={0.6} e={0.02} />
        </mesh>
      </PartGroup>

      <PartGroup id="whl-valve" explode={[0.8, 0.45, 0]}>
        <group position={[0.3, 1.14, 0.06]} rotation={[0, 0, -0.5]}>
          {/* stem */}
          <mesh>
            <cylinderGeometry args={[0.014, 0.014, 0.1, 10]} />
            <PMat m="polSteel" />
          </mesh>
          {/* retaining nut */}
          <mesh position={[0, -0.035, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.018, 6]} />
            <PMat m="steel" />
          </mesh>
          {/* cap + knurl */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.017, 0.017, 0.03, 10]} />
            <PMat m="blackCast" />
          </mesh>
          <mesh position={[0, 0.048, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.0175, 0.003, 4, 12]} />
            <PMat m="blackCast" color="#3a3f46" />
          </mesh>
          {/* TPMS sensor body */}
          <RBox args={[0.07, 0.045, 0.05]} radius={0.012} smoothness={2} position={[0, -0.08, 0]}>
            <PMat color="#9aa3ad" metal={0.5} rough={0.5} />
          </RBox>
        </group>
      </PartGroup>

      <PartGroup id="whl-lugs" explode={[0, 0, -1.3]}>
        {/* hub with rotor-locating ring */}
        <group position={[0, 0.85, -0.05]}>
          <Lathe pts={HUB_PTS} seg={36} rotation={[Math.PI / 2, 0, 0]}>
            <PMat m="iron" />
          </Lathe>
          <mesh position={[0, 0, 0.04]} scale={[1, 1, 0.6]}>
            <torusGeometry args={[0.068, 0.006, 6, 28]} />
            <PMat m="polSteel" />
          </mesh>
        </group>
        {/* 5 wheel studs */}
        {LUG_ANGLES.map((a, i) => (
          <Bolt
            key={i}
            position={[Math.cos(a) * 0.22, 0.85 + Math.sin(a) * 0.22, -0.07]}
            rotation={[-Math.PI / 2, 0, 0]}
            r={0.015}
            len={0.19}
            head={0.025}
            washer={false}
            m="polSteel"
          />
        ))}
        {/* 60° cone-seat lug nuts */}
        {LUG_ANGLES.map((a, i) => (
          <group
            key={i}
            position={[Math.cos(a) * 0.22, 0.85 + Math.sin(a) * 0.22, 0.125]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.036, 0.019, 0.028, 20]} />
              <PMat m="polSteel" rough={0.2} />
            </mesh>
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.031, 0.031, 0.034, 6]} />
              <PMat m="polSteel" />
            </mesh>
            <mesh position={[0, 0.036, 0]}>
              <cylinderGeometry args={[0.02, 0.028, 0.012, 12]} />
              <PMat m="polSteel" />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================== TIRE ================================= */

const ARC = Math.PI * 1.45
const A0 = Math.PI * 0.55

export function TireViewReal() {
  /* tread blocks: two rows around the arc, with alternating sipe offsets */
  const treadBlocks = useMemo(() => {
    const out: { a: number; z: number; sip: number }[] = []
    for (let i = 0; i < 40; i++) {
      const a = A0 + ((i + 0.5) / 40) * ARC
      for (const z of [0.048, -0.048])
        out.push({ a, z, sip: (i % 2 ? 1 : -1) * 0.012 })
    }
    return out
  }, [])

  /* belt cord lines at ±22°, carcass cords radial (0°) */
  const beltCords = useMemo(() => {
    const out: { a: number; r: number; z: number; tilt: number; c: string }[] = []
    for (let b = 0; b < 2; b++) {
      for (let i = 0; i < 34; i++) {
        const a = A0 + ((i + 0.5) / 34) * ARC
        out.push({
          a,
          r: b ? 0.571 : 0.591,
          z: b ? -0.018 : 0.018,
          tilt: (b ? -1 : 1) * 0.384,
          c: b ? '#d7dbe2' : '#e3c687',
        })
      }
    }
    return out
  }, [])

  const carcassCords = useMemo(
    () => Array.from({ length: 30 }, (_, i) => A0 + ((i + 0.5) / 30) * ARC),
    [],
  )

  /* bead sections at both arc ends: 4×4 wire grid in a rubber block */
  const bead = useMemo(() => {
    const ends: { a: number; z: number }[] = []
    for (const a of [A0 + 0.012, A0 + ARC - 0.012])
      for (const z of [0.14, -0.14]) ends.push({ a, z })
    const grid: [number, number][] = []
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) grid.push([(i - 1.5) * 0.011, (j - 1.5) * 0.011])
    return { ends, grid }
  }, [])

  /* apex wedge: triangular prism tapering radially outward off the bead */
  const apexGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.016)
    s.lineTo(0.095, 0)
    s.lineTo(0, 0.016)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false })
    g.translate(0, 0, -0.025)
    return g
  }, [])

  return (
    <group>
      {/* ghost rim profile */}
      <Ghost>
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 32, 1, true]} />
          <GhostMat opacity={0.07} />
        </mesh>
      </Ghost>

      <PartGroup id="tir-tread" explode={[0, 0.55, 0]}>
        {/* tread rubber arc */}
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.62, 0.11, 14, 48, ARC]} />
          <PMat m="rubber" color="#15181e" rough={0.95} />
        </mesh>
        {/* tread blocks + sipes */}
        {treadBlocks.map((b, i) => (
          <group key={i} position={[0, 0.85, 0]} rotation={[0, 0, b.a]}>
            <mesh position={[0.722, 0, b.z]}>
              <boxGeometry args={[0.032, 0.052, 0.072]} />
              <PMat color="#1c2128" metal={0.05} rough={0.95} env={0.15} e={0.03} />
            </mesh>
            <mesh position={[0.732, b.sip, b.z]}>
              <boxGeometry args={[0.03, 0.006, 0.076]} />
              <PMat color="#05070a" metal={0} rough={0.95} e={0.02} />
            </mesh>
          </group>
        ))}
        {/* groove channels */}
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.712, 0.014, 6, 48, ARC]} />
          <PMat color="#0a0d12" metal={0} rough={0.95} e={0.02} />
        </mesh>
        {[0.1, -0.1].map((z) => (
          <mesh key={z} position={[0, 0.85, z]} rotation={[0, 0, A0]}>
            <torusGeometry args={[0.7, 0.01, 6, 48, ARC]} />
            <PMat color="#0a0d12" metal={0} rough={0.95} e={0.02} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="tir-belts" explode={[0, 0.25, 0.5]}>
        {/* steel belt arcs */}
        <mesh position={[0, 0.85, 0.018]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.565, 0.026, 8, 48, ARC]} />
          <PMat m="brass" rough={0.35} />
        </mesh>
        <mesh position={[0, 0.85, -0.018]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.545, 0.026, 8, 48, ARC]} />
          <PMat m="steel" rough={0.35} />
        </mesh>
        {/* cord direction: bright lines laid at ±22° */}
        {beltCords.map((l, i) => (
          <group key={i} position={[0, 0.85, 0]} rotation={[0, 0, l.a]}>
            <mesh position={[l.r, 0, l.z]} rotation={[l.tilt, 0, 0]}>
              <boxGeometry args={[0.005, 0.006, 0.07]} />
              <PMat m="polSteel" color={l.c} e={0.08} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      <PartGroup id="tir-carcass" explode={[0, -0.1, 0.85]}>
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.49, 0.05, 10, 48, ARC]} />
          <PMat color="#e8e1cf" metal={0.1} rough={0.7} env={0.3} />
        </mesh>
        {/* radial cord lines */}
        {carcassCords.map((a, i) => (
          <group key={i} position={[0, 0.85, 0]} rotation={[0, 0, a]}>
            <mesh position={[0.541, 0, 0]}>
              <boxGeometry args={[0.005, 0.005, 0.095]} />
              <PMat color="#f0ead9" metal={0.1} rough={0.6} e={0.06} />
            </mesh>
          </group>
        ))}
        {/* inner liner, darker */}
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, A0]}>
          <torusGeometry args={[0.445, 0.028, 8, 48, ARC]} />
          <PMat color="#232833" metal={0.05} rough={0.85} e={0.03} />
        </mesh>
      </PartGroup>

      <PartGroup id="tir-bead" explode={[0, -0.6, 0]}>
        {/* bead wire rings + chafer */}
        {[0.14, -0.14].map((z) => (
          <group key={z}>
            <mesh position={[0, 0.85, z]}>
              <torusGeometry args={[0.33, 0.028, 10, 40]} />
              <PMat m="copper" />
            </mesh>
            <mesh position={[0, 0.85, z]}>
              <torusGeometry args={[0.37, 0.018, 8, 40]} />
              <PMat m="rubber" color="#1a1d23" />
            </mesh>
          </group>
        ))}
        {/* sectioned bundles at both arc ends: 4×4 wires + apex wedge */}
        {bead.ends.map((e, k) => (
          <group key={k} position={[0, 0.85, 0]} rotation={[0, 0, e.a]}>
            <group position={[0.33, 0, e.z]}>
              <RBox args={[0.075, 0.05, 0.07]} radius={0.012} smoothness={2}>
                <PMat m="rubber" color="#1b1e24" />
              </RBox>
              {bead.grid.map(([dx, dz], gi) => (
                <mesh key={gi} position={[dx, 0, dz]}>
                  <cylinderGeometry args={[0.0045, 0.0045, 0.056, 8]} />
                  <PMat m="polSteel" e={0.1} />
                </mesh>
              ))}
              <mesh geometry={apexGeo} position={[0.036, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <PMat m="rubber" color="#23262d" />
              </mesh>
            </group>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}
