/**
 * Head.tsx — photoreal-feeling cylinder head stack for the teardown engine.
 *
 * Exports three components, all returning plain <group>s at absolute stage
 * coordinates (crank axis along X at y=0.32, FRONT = -X):
 *   HeadReal()      — aluminum head casting + black cam cover
 *   GasketReal()    — MLS head gasket with bore fire-rings
 *   HeadBoltsReal() — 10 torque-to-yield head bolts (12-point style)
 */
import * as THREE from 'three'
import { PMat, Lathe, RBox, Bolt } from '../realism'

/** Bore centerlines along the crank axis. */
const BORES = [-0.375, -0.125, 0.125, 0.375] as const

/** Head-bolt columns (5 per bank). */
const BOLT_XS = [-0.44, -0.22, 0, 0.22, 0.44] as const

/* ================================ HEAD ================================== */

export function HeadReal() {
  return (
    <group>
      {/* -------- machined lower deck edge (bright milled band at y 0.98) -------- */}
      <RBox args={[1.045, 0.012, 0.625]} radius={0.004} smoothness={2} position={[0, 0.986, 0]}>
        <PMat m="machAlu" />
      </RBox>

      {/* -------- main casting: wide lower body, slightly narrower upper -------- */}
      {/* casting tiers — holographic shells so the valvetrain inside stays visible */}
      <RBox args={[1.04, 0.17, 0.62]} radius={0.015} smoothness={3} position={[0, 1.075, 0]}>
        <PMat m="castAlu" opacity={0.3} depthWrite={false} />
      </RBox>
      <RBox args={[1.0, 0.1, 0.58]} radius={0.015} smoothness={3} position={[0, 1.195, 0]}>
        <PMat m="castAlu" opacity={0.3} depthWrite={false} />
      </RBox>

      {/* -------- intake side (+Z): 4 oval port stubs with manifold flanges ----- */}
      {BORES.map((x) => (
        <group key={`in-${x}`} position={[x, 1.08, 0]}>
          {/* oval runner stub — squashed cylinder, axis along Z */}
          <mesh position={[0, 0, 0.34]} rotation={[Math.PI / 2, 0, 0]} scale={[1.4, 1, 1]}>
            <cylinderGeometry args={[0.045, 0.048, 0.1, 24]} />
            <PMat m="castAlu" />
          </mesh>
          {/* machined manifold flange at the stub tip */}
          <RBox args={[0.16, 0.12, 0.016]} radius={0.008} smoothness={2} position={[0, 0, 0.386]}>
            <PMat m="machAlu" />
          </RBox>
          {/* dark open port mouth */}
          <mesh position={[0, 0, 0.3951]} scale={[1.4, 1, 1]}>
            <circleGeometry args={[0.036, 24]} />
            <PMat color="#121419" rough={0.9} metal={0.1} e={0.02} />
          </mesh>
        </group>
      ))}

      {/* -------- exhaust side (-Z): 4 round stubs, machined rims --------------- */}
      {BORES.map((x) => (
        <group key={`ex-${x}`} position={[x, 1.05, 0]}>
          <mesh position={[0, 0, -0.335]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.038, 0.041, 0.08, 24]} />
            <PMat m="castAlu" />
          </mesh>
          {/* machined sealing rim */}
          <mesh position={[0, 0, -0.372]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.044, 0.044, 0.014, 24]} />
            <PMat m="machAlu" />
          </mesh>
          {/* dark open port mouth */}
          <mesh position={[0, 0, -0.3801]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.03, 24]} />
            <PMat color="#121419" rough={0.9} metal={0.1} e={0.02} />
          </mesh>
        </group>
      ))}

      {/* -------- head-bolt spot-face wells on the head top shoulder ----------- */}
      {BOLT_XS.map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`well-${x}-${z}`} position={[x, 1.247, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.008, 20]} />
            <PMat color="#3b4149" rough={0.6} metal={0.6} e={0.02} />
          </mesh>
        )),
      )}

      {/* -------- front face (-X): cam bearing bosses where sprockets meet ----- */}
      {[-0.2, 0.2].map((z) => (
        <group key={`boss-${z}`} position={[-0.49, 1.3, z]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.054, 0.06, 28]} />
            <PMat m="castAlu" />
          </mesh>
          {/* machined thrust face + polished cam nose */}
          <mesh position={[-0.032, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.008, 28]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.012, 20]} />
            <PMat m="polSteel" />
          </mesh>
        </group>
      ))}

      {/* ============================ CAM COVER ============================ */}
      <RBox args={[0.94, 0.1, 0.42]} radius={0.02} smoothness={3} position={[0, 1.31, 0]}>
        <PMat m="blackCast" opacity={0.35} depthWrite={false} />
      </RBox>

      {/* lengthwise stiffening ribs on the cover top (run along X) */}
      {[-0.17, -0.09, 0.09, 0.17].map((z) => (
        <RBox
          key={`rib-${z}`}
          args={[0.82, 0.012, 0.02]}
          radius={0.005}
          smoothness={2}
          position={[0, 1.363, z]}
        >
          <PMat m="blackCast" />
        </RBox>
      ))}

      {/* spark-plug tube recesses along the centerline */}
      {BORES.map((x) => (
        <group key={`plug-${x}`} position={[x, 0, 0]}>
          {/* raised boss ring around the hole */}
          <mesh position={[0, 1.364, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.032, 0.005, 8, 32]} />
            <PMat m="blackCast" />
          </mesh>
          {/* dark open tube, sunk into the cover */}
          <mesh position={[0, 1.33, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.08, 24, 1, true]} />
            <PMat color="#101216" rough={0.9} metal={0.1} e={0.01} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 1.292, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.028, 24]} />
            <PMat color="#0b0d10" rough={0.95} metal={0.05} e={0.01} />
          </mesh>
        </group>
      ))}

      {/* oil filler cap — knurled machined aluminum, rear +z corner */}
      <group position={[0.33, 1.358, 0.14]}>
        <Lathe
          seg={32}
          pts={[
            [0.032, 0],
            [0.032, 0.014],
            [0.044, 0.016],
            [0.044, 0.042],
            [0.037, 0.05],
            [0.0, 0.052],
          ]}
        >
          <PMat m="machAlu" />
        </Lathe>
        {/* hex grip ridge on top fakes the knurl */}
        <mesh position={[0, 0.054, 0]}>
          <cylinderGeometry args={[0.03, 0.033, 0.012, 6]} />
          <PMat m="machAlu" />
        </mesh>
      </group>
    </group>
  )
}

/* =============================== GASKET ================================= */

export function GasketReal() {
  return (
    <group>
      {/* MLS plate */}
      <RBox args={[1.04, 0.012, 0.62]} radius={0.004} smoothness={2} position={[0, 0.955, 0]}>
        <PMat m="gasket" />
      </RBox>

      {/* embossed fire-rings around each bore, just proud of the plate */}
      {BORES.map((x) => (
        <mesh key={`ring-${x}`} position={[x, 0.962, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.108, 0.006, 8, 48]} />
          <PMat m="polSteel" />
        </mesh>
      ))}

      {/* coolant passage holes near the edges */}
      {[-0.25, 0, 0.25].map((x) =>
        [-0.26, 0.26].map((z) => (
          <mesh key={`cool-${x}-${z}`} position={[x, 0.956, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.016, 16]} />
            <PMat color="#1a1d21" rough={0.85} metal={0.2} e={0.02} />
          </mesh>
        )),
      )}

      {/* locating dowel stubs */}
      {[-0.48, 0.48].map((x) => (
        <mesh key={`dowel-${x}`} position={[x, 0.966, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.032, 16]} />
          <PMat m="steel" />
        </mesh>
      ))}
    </group>
  )
}

/* ============================= HEAD BOLTS =============================== */

export function HeadBoltsReal() {
  const hh = 0.016 * 0.9 // hex head height used by the Bolt helper
  return (
    <group>
      {BOLT_XS.map((x) =>
        [-0.22, 0.22].map((z) => (
          <group key={`hb-${x}-${z}`} position={[x, 1.255, z]}>
            <Bolt r={0.016} len={0.11} m="steel" washer />
            {/* second hex rotated 30° over the head fakes a 12-point TTY bolt */}
            <mesh position={[0, hh / 2 + 0.004, 0]} rotation={[0, Math.PI / 6, 0]}>
              <cylinderGeometry args={[0.016 * 1.75, 0.016 * 1.75, hh, 6]} />
              <PMat m="steel" />
            </mesh>
          </group>
        )),
      )}
    </group>
  )
}
