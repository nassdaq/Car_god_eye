/**
 * HeadInternals.tsx — photoreal-feeling valvetrain for the blown-up HeadView
 * interior stage (NOT the engine stage).
 *
 * Exports four components, all plain <group>s at absolute stage coordinates:
 *   ValvesReal()  — 8 poppet valves, each a single lathe profile + seat band
 *   SpringsReal() — 8 valve springs with seat washer, retainer and keepers
 *   CamsReal()    — 2 DOHC camshafts: journals, extruded egg lobes, caps
 *   PlugsReal()   — 4 spark plugs with electrodes, threads and ceramic body
 *
 * Stage layout (matches HeadView): stations x = ±0.45, ±0.15; intake row
 * z = +0.18, exhaust z = −0.18, both splayed ±0.22 rad; cams at y 1.3,
 * z = ±0.26; plugs vertical on the centerline around y 0.72.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PMat, RBox, Bolt } from '../realism'
import { useSpringGeo } from '../lib'

/** Cylinder station centerlines. */
const VX = [-0.45, -0.15, 0.15, 0.45]
/** Cam bearing journal positions along the shaft. */
const JX = [-0.575, -0.3, 0, 0.3, 0.575]
/** Lobe clocking per cylinder, degrees (exhaust shaft adds +110°). */
const CLOCK = [-20, 100, 190, 280]
const D2R = Math.PI / 180

/** Build a lathe geometry from [radius, y] pairs, bottom→top. */
function latheGeo(pts: [number, number][], seg: number): THREE.LatheGeometry {
  const g = new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-4), y)),
    seg,
  )
  g.computeVertexNormals()
  return g
}

/* ================================ VALVES ================================= */

/**
 * One-piece poppet valve profile, bottom→top: flat face, margin band,
 * 45° seat bevel, back fillet into the stem, long stem, two collet
 * groove cuts, chamfered tip. Stem r 0.013, face y 0.48, tip y 0.928
 * (≈0.42 long, centered near y 0.72 in the valve group).
 */
function valveProfile(rHead: number): [number, number][] {
  const rs = 0.013 // stem radius
  return [
    [0.0004, 0.48], // face center
    [rHead * 0.55, 0.48],
    [rHead, 0.48], // face edge
    [rHead, 0.4895], // margin (cylindrical band)
    [rHead - 0.015, 0.5045], // 45° seat bevel band
    [rHead - 0.026, 0.515], // start of back fillet
    [rs + 0.013, 0.538],
    [rs + 0.005, 0.566],
    [rs, 0.6], // fillet blends into stem
    [rs, 0.868], // long stem
    [rs - 0.0035, 0.871], // collet groove 1
    [rs - 0.0035, 0.877],
    [rs, 0.88],
    [rs, 0.886],
    [rs - 0.0035, 0.889], // collet groove 2
    [rs - 0.0035, 0.895],
    [rs, 0.898],
    [rs, 0.922],
    [rs - 0.004, 0.928], // tip chamfer
    [0.0004, 0.928],
  ]
}

export function ValvesReal() {
  const inGeo = useMemo(() => latheGeo(valveProfile(0.075), 36), [])
  const exGeo = useMemo(() => latheGeo(valveProfile(0.062), 36), [])
  return (
    <group>
      {VX.flatMap((x) =>
        [0.18, -0.18].map((z) => {
          const intake = z > 0
          const rHead = intake ? 0.075 : 0.062
          return (
            <group
              key={`v-${x}-${z}`}
              position={[x, 0, z]}
              rotation={[Math.sign(z) * 0.22, 0, 0]}
            >
              {/* valve body — intake steel-bright, exhaust heat-tinted */}
              <mesh geometry={intake ? inGeo : exGeo}>
                <PMat
                  m="steel"
                  color={intake ? '#c6cdd8' : '#9a7a60'}
                  rough={intake ? 0.22 : 0.34}
                />
              </mesh>
              {/* ground 45° seat band, a hair proud of the lathe bevel */}
              <mesh position={[0, 0.497, 0]}>
                <cylinderGeometry
                  args={[rHead - 0.014, rHead + 0.0012, 0.015, 32, 1, true]}
                />
                <PMat m="polSteel" side={THREE.DoubleSide} />
              </mesh>
            </group>
          )
        }),
      )}
    </group>
  )
}

/* ================================ SPRINGS ================================ */

/** Spring seat washer under the coil (local y 0 = bottom of spring). */
const SEAT_PTS: [number, number][] = [
  [0.016, -0.01],
  [0.054, -0.01],
  [0.054, -0.002],
  [0.05, 0.002],
  [0.017, 0.002],
]

/** Retainer: flat disc with a conical center rising to grip the keepers. */
const RETAINER_PTS: [number, number][] = [
  [0.014, 0.15],
  [0.05, 0.15],
  [0.05, 0.158],
  [0.03, 0.162],
  [0.025, 0.163],
  [0.018, 0.182],
  [0.012, 0.186],
]

export function SpringsReal() {
  const springGeo = useSpringGeo(0.042, 0.15, 5, 0.0085)
  const seatGeo = useMemo(() => latheGeo(SEAT_PTS, 24), [])
  const retainerGeo = useMemo(() => latheGeo(RETAINER_PTS, 24), [])
  return (
    <group>
      {VX.flatMap((x) =>
        [0.225, -0.225].map((z) => (
          <group
            key={`s-${x}-${z}`}
            position={[x, 0.82, z]}
            rotation={[Math.sign(z) * 0.22, 0, 0]}
          >
            {/* coil */}
            <mesh geometry={springGeo}>
              <PMat m="steel" color="#b9bfd0" rough={0.3} />
            </mesh>
            {/* seat washer */}
            <mesh geometry={seatGeo}>
              <PMat m="steel" rough={0.42} />
            </mesh>
            {/* retainer */}
            <mesh geometry={retainerGeo}>
              <PMat m="zincGold" color="#c9ad64" />
            </mesh>
            {/* split keeper wedges gripping the stem */}
            {[0.008, -0.008].map((dz) => (
              <mesh key={dz} position={[0, 0.172, dz]}>
                <cylinderGeometry args={[0.0055, 0.0105, 0.028, 10]} />
                <PMat m="zincGold" />
              </mesh>
            ))}
          </group>
        )),
      )}
    </group>
  )
}

/* ================================= CAMS ================================== */

export function CamsReal() {
  /** Egg-profile lobe: 270° of base circle + two quadratic flanks to the nose. */
  const lobeGeo = useMemo(() => {
    const rb = 0.06 // base circle
    const a0 = Math.PI * 0.75
    const a1 = Math.PI * 0.25
    const s = new THREE.Shape()
    s.absarc(0, 0, rb, a0, a1, false) // 270° CCW, nose window at the top
    s.quadraticCurveTo(0.054, 0.082, 0, 0.1) // flank out to the nose (r 0.1)
    s.quadraticCurveTo(-0.054, 0.082, Math.cos(a0) * rb, Math.sin(a0) * rb)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 20,
    })
    g.translate(0, 0, -0.0275) // center along the extrusion axis
    return g
  }, [])
  const journalGeo = useMemo(
    () => new THREE.CylinderGeometry(0.042, 0.042, 0.065, 24),
    [],
  )
  return (
    <group>
      {[0.26, -0.26].map((z) => {
        const exhaust = z < 0
        return (
          <group key={`shaft-${z}`}>
            {/* shaft core */}
            <mesh position={[0, 1.3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.034, 0.034, 1.25, 24]} />
              <PMat m="steel" rough={0.38} />
            </mesh>

            {/* ground bearing journals */}
            {JX.map((jx) => (
              <mesh
                key={`j-${jx}`}
                geometry={journalGeo}
                position={[jx, 1.3, z]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <PMat m="polSteel" />
              </mesh>
            ))}

            {/* lobes, clocked per cylinder (exhaust shaft offset +110°) */}
            {VX.map((x, i) => (
              <group
                key={`l-${x}`}
                position={[x, 1.3, z]}
                rotation={[(CLOCK[i] + (exhaust ? 110 : 0)) * D2R, 0, 0]}
              >
                <mesh geometry={lobeGeo} rotation={[0, Math.PI / 2, 0]}>
                  <PMat m="polSteel" />
                </mesh>
              </group>
            ))}

            {/* front (−X) sprocket bolt flange */}
            <mesh position={[-0.634, 1.3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.055, 0.055, 0.018, 28]} />
              <PMat m="machAlu" />
            </mesh>
            {[0, 1, 2, 3].map((k) => {
              const a = (k / 4) * Math.PI * 2 + Math.PI / 4
              return (
                <mesh
                  key={`fb-${k}`}
                  position={[-0.646, 1.3 + Math.cos(a) * 0.034, z + Math.sin(a) * 0.034]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.006, 0.006, 0.01, 6]} />
                  <PMat m="zincGold" />
                </mesh>
              )
            })}

            {/* rear (+X) plain stub */}
            <mesh position={[0.636, 1.3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.03, 16]} />
              <PMat m="steel" />
            </mesh>

            {/* cam caps bridging each journal, 2 bolts each */}
            {JX.map((jx) => (
              <group key={`cap-${jx}`}>
                <RBox
                  args={[0.055, 0.05, 0.14]}
                  radius={0.01}
                  smoothness={2}
                  position={[jx, 1.317, z]}
                >
                  <PMat m="machAlu" />
                </RBox>
                {[0.052, -0.052].map((dz) => (
                  <Bolt
                    key={dz}
                    position={[jx, 1.342, z + dz]}
                    r={0.0055}
                    len={0.03}
                    washer={false}
                  />
                ))}
              </group>
            ))}
          </group>
        )
      })}
    </group>
  )
}

/* ================================= PLUGS ================================= */

/** Threaded steel shell with 3 shallow thread rings (local y, plug at y 0.72). */
const THREAD_PTS: [number, number][] = [
  [0.011, -0.132],
  [0.02, -0.126],
  [0.02, -0.118],
  [0.0218, -0.112], // thread ring 1
  [0.02, -0.106],
  [0.02, -0.098],
  [0.0218, -0.092], // thread ring 2
  [0.02, -0.086],
  [0.02, -0.078],
  [0.0218, -0.072], // thread ring 3
  [0.02, -0.066],
  [0.02, -0.048],
  [0.0205, -0.044],
  [0.013, -0.042],
]

/** White ceramic insulator with corrugation ribs, tapering to the terminal. */
const INSULATOR_PTS: [number, number][] = [
  [0.0205, -0.008],
  [0.0235, 0.004],
  [0.0205, 0.014], // rib valley 1
  [0.0235, 0.024],
  [0.0205, 0.034], // rib valley 2
  [0.0235, 0.044],
  [0.0205, 0.052], // rib valley 3
  [0.019, 0.066],
  [0.0135, 0.09],
  [0.0115, 0.108],
  [0.0105, 0.116],
  [0.0065, 0.119],
]

export function PlugsReal() {
  const threadGeo = useMemo(() => latheGeo(THREAD_PTS, 24), [])
  const insulatorGeo = useMemo(() => latheGeo(INSULATOR_PTS, 32), [])
  return (
    <group>
      {VX.map((x) => (
        <group key={`p-${x}`} position={[x, 0.72, 0]}>
          {/* center electrode pin (spark gap below its tip) */}
          <mesh position={[0, -0.136, 0]}>
            <cylinderGeometry args={[0.004, 0.004, 0.028, 10]} />
            <PMat m="polSteel" />
          </mesh>
          {/* ground electrode hook — L of two small boxes off the shell rim */}
          <mesh position={[0, -0.142, 0.0175]}>
            <boxGeometry args={[0.006, 0.03, 0.0045]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh position={[0, -0.1555, 0.0085]}>
            <boxGeometry args={[0.006, 0.0045, 0.023]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          {/* threaded shell */}
          <mesh geometry={threadGeo}>
            <PMat m="steel" rough={0.3} />
          </mesh>
          {/* copper crush washer */}
          <mesh position={[0, -0.045, 0]}>
            <cylinderGeometry args={[0.0245, 0.0245, 0.006, 24]} />
            <PMat m="copper" />
          </mesh>
          {/* steel hex */}
          <mesh position={[0, -0.024, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.036, 6]} />
            <PMat m="steel" rough={0.35} />
          </mesh>
          {/* ceramic insulator */}
          <mesh geometry={insulatorGeo}>
            <PMat color="#e9e6dd" metal={0.05} rough={0.35} env={0.5} e={0.04} />
          </mesh>
          {/* terminal nut + dome */}
          <mesh position={[0, 0.123, 0]}>
            <cylinderGeometry args={[0.0095, 0.0095, 0.012, 6]} />
            <PMat m="steel" rough={0.3} />
          </mesh>
          <mesh position={[0, 0.132, 0]}>
            <sphereGeometry args={[0.0068, 10, 6]} />
            <PMat m="steel" rough={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
