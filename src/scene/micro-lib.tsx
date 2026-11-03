/**
 * Microstructure sample library — procedural "under the microscope at
 * ×200–×500" views for every material family in the teardown app.
 *
 * Visual contract (matches deep-views.tsx `Microstructure` exactly):
 *   - polished sample slab: RBox [1.3, 0.22, 0.95] at y 0.5 (top face y 0.61)
 *   - features scattered deterministically on the top face (y ≈ 0.61–0.64,
 *     x within ±0.6, z within ±0.44)
 *   - glowing scale bar hovering at the front-right corner
 *   - every material is <PMat/>, plain <group> geometry, no interaction
 *
 * Budget: ≤ 8k triangles per kind (sphere segs ≤ 12, torus segs ≤ 20,
 * shared geometries via useMemo where one shape repeats many times).
 */
import { useMemo, type ReactElement } from 'react'
import * as THREE from 'three'
import { PMat, RBox } from './realism'

/* deterministic pseudo-random (same recipe as deep-views — stable renders) */
const rnd = (n: number) => (((Math.sin(n * 127.1) * 43758.5453) % 1) + 1) % 1

export type MicroKind =
  | 'cast-al'
  | 'martensite'
  | 'pearlite'
  | 'nodular'
  | 'stainless'
  | 'copper'
  | 'polymer'
  | 'rubber'
  | 'composite'
  | 'ceramic'
  | 'glass'
  | 'superalloy'
  | 'semiconductor'
  | 'foam'
  | 'lead'

/* ------------------------------ shared pieces ------------------------------ */

/** polished sample slab — the mounted, ground + etched specimen */
function Slab({
  color,
  metal = 0.6,
  rough = 0.5,
  e = 0.04,
  opacity = 1,
}: {
  color: string
  metal?: number
  rough?: number
  e?: number
  opacity?: number
}) {
  return (
    <RBox args={[1.3, 0.22, 0.95]} radius={0.02} smoothness={2} position={[0, 0.5, 0]}>
      <PMat color={color} metal={metal} rough={rough} e={e} opacity={opacity} />
    </RBox>
  )
}

/** glowing micron scale bar — same instrument, same corner, every sample */
function ScaleBar() {
  return (
    <group position={[0.45, 0.68, 0.55]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 0.3, 8]} />
        <PMat color="#eafcff" e={0.8} metal={0} depthWrite={false} />
      </mesh>
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.008, 0.045, 0.008]} />
          <PMat color="#eafcff" e={0.8} metal={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------- the kinds -------------------------------- */

/** 'cast-al' — A356 cast aluminum: pale α-Al dendrite arms with dark
 *  interdendritic eutectic-silicon needles between them. */
function CastAl() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  return (
    <group>
      <Slab color="#525a66" />
      {/* dendrite arms: clusters of 2–3 overlapping flattened pale blobs */}
      {[...Array(12)].map((_, i) => {
        const n = 2 + (i % 2)
        return (
          <group
            key={i}
            position={[(rnd(i + 3) - 0.5) * 1.1, 0.615, (rnd(i + 51) - 0.5) * 0.78]}
            rotation={[0, rnd(i + 97) * Math.PI, 0]}
          >
            {[...Array(n)].map((_, k) => (
              <mesh
                key={k}
                geometry={sph}
                position={[(k - (n - 1) / 2) * 0.055, 0, (rnd(i * 7 + k + 1) - 0.5) * 0.035]}
                scale={[
                  0.05 + rnd(i * 11 + k + 2) * 0.03,
                  0.014,
                  0.035 + rnd(i * 13 + k + 3) * 0.02,
                ]}
              >
                <PMat color="#aeb6c2" metal={0.7} rough={0.5} e={0.04} env={0.5} />
              </mesh>
            ))}
          </group>
        )
      })}
      {/* eutectic silicon: small dark needles in the interdendritic spaces */}
      {[...Array(28)].map((_, i) => (
        <mesh
          key={i}
          position={[(rnd(i + 201) - 0.5) * 1.2, 0.618, (rnd(i + 261) - 0.5) * 0.86]}
          rotation={[0, rnd(i + 321) * Math.PI, 0]}
        >
          <boxGeometry args={[0.05 + rnd(i + 381) * 0.05, 0.008, 0.008]} />
          <PMat color="#3c424c" metal={0.4} rough={0.7} e={0.02} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'martensite' — quenched steel: sheaves of hard thin laths in packets,
 *  each packet at its own contrasting angle, plus retained-austenite dots. */
function Martensite() {
  const dot = useMemo(() => new THREE.SphereGeometry(1, 6, 4), [])
  return (
    <group>
      <Slab color="#464b55" />
      {/* 6 lath packets × 7 laths — one shared rotation per packet */}
      {[...Array(6)].map((_, p) => {
        const a = (p * Math.PI) / 2.6 + rnd(p + 63) * 0.35
        return (
          <group
            key={p}
            position={[(rnd(p + 7) - 0.5) * 1.0, 0.615, (rnd(p + 31) - 0.5) * 0.7]}
            rotation={[0, a, 0]}
          >
            {[...Array(7)].map((_, k) => (
              <mesh
                key={k}
                position={[(rnd(p * 9 + k + 5) - 0.5) * 0.04, 0, (k - 3) * 0.021]}
                rotation={[0, (rnd(p * 13 + k + 9) - 0.5) * 0.14, 0]}
              >
                <boxGeometry args={[0.16 + rnd(p * 17 + k + 13) * 0.1, 0.01, 0.013]} />
                <PMat color={k % 2 ? '#9aa1ad' : '#7d8591'} metal={0.85} rough={0.4} e={0.04} />
              </mesh>
            ))}
          </group>
        )
      })}
      {/* tiny retained-austenite islands between the sheaves */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          geometry={dot}
          position={[(rnd(i + 141) - 0.5) * 1.15, 0.62, (rnd(i + 181) - 0.5) * 0.82]}
          scale={0.009 + rnd(i + 221) * 0.005}
        >
          <PMat color="#d3d9e2" metal={0.7} rough={0.3} e={0.08} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'pearlite' — mild steel: colonies of alternating ferrite/cementite
 *  lamellae, each colony's stripes sharing one rotation, plus ferrite patches. */
function Pearlite() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  return (
    <group>
      <Slab color="#4c525b" />
      {/* 8 lamellar colonies × 6 alternating plates */}
      {[...Array(8)].map((_, c) => (
        <group
          key={c}
          position={[(rnd(c + 17) - 0.5) * 1.05, 0.614, (rnd(c + 47) - 0.5) * 0.74]}
          rotation={[0, rnd(c + 77) * Math.PI, 0]}
        >
          {[...Array(6)].map((_, k) => (
            <mesh key={k} position={[0, 0, (k - 2.5) * 0.017]}>
              <boxGeometry args={[0.13 + rnd(c * 7 + k + 107) * 0.07, 0.01, 0.011]} />
              <PMat
                color={k % 2 ? '#2e333c' : '#a7aeb9'}
                metal={k % 2 ? 0.5 : 0.8}
                rough={k % 2 ? 0.7 : 0.4}
                e={0.03}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* a few plain proeutectoid ferrite patches between colonies */}
      {[...Array(6)].map((_, i) => (
        <mesh
          key={i}
          geometry={sph}
          position={[(rnd(i + 211) - 0.5) * 1.15, 0.612, (rnd(i + 251) - 0.5) * 0.82]}
          rotation={[0, rnd(i + 291) * Math.PI, 0]}
          scale={[0.06 + rnd(i + 331) * 0.04, 0.011, 0.045 + rnd(i + 371) * 0.03]}
        >
          <PMat color="#b0b7c1" metal={0.8} rough={0.4} e={0.04} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'nodular' — ductile (spheroidal-graphite) iron: round dark graphite
 *  spheroids, each ringed by a pale ferrite halo, in a pearlitic matrix. */
function Nodular() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  return (
    <group>
      <Slab color="#565c66" />
      {[...Array(18)].map((_, i) => {
        const x = (rnd(i + 9) - 0.5) * 1.15
        const z = (rnd(i + 63) - 0.5) * 0.84
        const r = 0.02 + rnd(i + 123) * 0.02
        return (
          <group key={i} position={[x, 0, z]}>
            {/* ferrite halo (bull's-eye) under the nodule */}
            <mesh geometry={sph} position={[0, 0.612, 0]} scale={[r * 2.1, 0.01, r * 2.1]}>
              <PMat color="#b4bac4" metal={0.75} rough={0.45} e={0.04} />
            </mesh>
            {/* graphite spheroid */}
            <mesh geometry={sph} position={[0, 0.615, 0]} scale={[r, r * 0.6, r]}>
              <PMat color="#16181d" metal={0.2} rough={0.8} e={0.02} />
            </mesh>
          </group>
        )
      })}
      <ScaleBar />
    </group>
  )
}

/** 'stainless' — austenitic stainless: clean equiaxed grains in close silvery
 *  tones, crossed by thin straight annealing-twin bands. */
function Stainless() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  const tones = ['#aab2bd', '#9ba3af', '#b8bfc9']
  return (
    <group>
      <Slab color="#4f565f" />
      {/* equiaxed austenite grains (6 × 5 jittered grid) */}
      {[...Array(30)].map((_, i) => {
        const c = i % 6
        const r = Math.floor(i / 6)
        return (
          <mesh
            key={i}
            geometry={sph}
            position={[
              -0.5 + c * 0.2 + (rnd(i + 19) - 0.5) * 0.07,
              0.613,
              -0.34 + r * 0.17 + (rnd(i + 59) - 0.5) * 0.06,
            ]}
            rotation={[0, rnd(i + 99) * Math.PI, 0]}
            scale={[0.08 + rnd(i + 139) * 0.04, 0.012, 0.06 + rnd(i + 179) * 0.03]}
          >
            <PMat color={tones[i % 3]} metal={0.85} rough={0.35} e={0.04} />
          </mesh>
        )
      })}
      {/* annealing twins: thin straight pale bands crossing several grains */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[(rnd(i + 219) - 0.5) * 1.0, 0.625, (rnd(i + 259) - 0.5) * 0.75]}
          rotation={[0, rnd(i + 299) * Math.PI, 0]}
        >
          <boxGeometry args={[0.22 + rnd(i + 339) * 0.14, 0.005, 0.015]} />
          <PMat color="#ccd3dc" metal={0.85} rough={0.3} e={0.07} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'copper' — annealed copper: equiaxed grains in warm copper tones with
 *  straight annealing-twin bands. */
function Copper() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  const tones = ['#b57347', '#c68155', '#a66840']
  return (
    <group>
      <Slab color="#5f4636" />
      {/* equiaxed grains (7 × 4 jittered grid) */}
      {[...Array(28)].map((_, i) => {
        const c = i % 7
        const r = Math.floor(i / 7)
        return (
          <mesh
            key={i}
            geometry={sph}
            position={[
              -0.51 + c * 0.17 + (rnd(i + 23) - 0.5) * 0.06,
              0.613,
              -0.31 + r * 0.205 + (rnd(i + 67) - 0.5) * 0.07,
            ]}
            rotation={[0, rnd(i + 111) * Math.PI, 0]}
            scale={[0.075 + rnd(i + 155) * 0.045, 0.012, 0.06 + rnd(i + 199) * 0.035]}
          >
            <PMat color={tones[i % 3]} metal={1.0} rough={0.38} e={0.04} env={0.9} />
          </mesh>
        )
      })}
      {/* twin bands */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[(rnd(i + 243) - 0.5) * 1.0, 0.625, (rnd(i + 283) - 0.5) * 0.75]}
          rotation={[0, rnd(i + 323) * Math.PI, 0]}
        >
          <boxGeometry args={[0.2 + rnd(i + 363) * 0.14, 0.005, 0.014]} />
          <PMat color="#d99a6e" metal={1.0} rough={0.3} e={0.07} env={1.0} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'polymer' — semicrystalline PP/PA: spherulites — radial fans of thin
 *  lamellae growing out from nucleation sites in an amorphous matrix. */
function Polymer() {
  return (
    <group>
      <Slab color="#58503e" metal={0.1} rough={0.6} />
      {/* 10 spherulites × 6 plates (each plate = 2 spokes through center) */}
      {[...Array(10)].map((_, s) => {
        const r = 0.07 + rnd(s + 171) * 0.05
        return (
          <group
            key={s}
            position={[(rnd(s + 5) - 0.5) * 1.1, 0.615, (rnd(s + 45) - 0.5) * 0.8]}
            rotation={[0, rnd(s + 85) * Math.PI, 0]}
          >
            {[...Array(6)].map((_, k) => (
              <mesh key={k} rotation={[0, (k * Math.PI) / 6, 0]}>
                <boxGeometry args={[r * 2, 0.007, 0.015]} />
                <PMat
                  color={k % 2 ? '#b7a67e' : '#cbb98f'}
                  metal={0.05}
                  rough={0.55}
                  e={0.05}
                  env={0.3}
                />
              </mesh>
            ))}
          </group>
        )
      })}
      <ScaleBar />
    </group>
  )
}

/** 'rubber' — filled elastomer: near-black matrix packed with carbon-black
 *  aggregates, a few ZnO specks, and faint wavy crosslink hint lines. */
function Rubber() {
  const dot = useMemo(() => new THREE.SphereGeometry(1, 6, 4), [])
  return (
    <group>
      <Slab color="#1e2126" metal={0.05} rough={0.9} e={0.02} />
      {/* carbon-black aggregates: clusters of 2–3 tiny dark spheres */}
      {[...Array(16)].map((_, i) => {
        const n = 2 + (i % 2)
        return (
          <group
            key={i}
            position={[(rnd(i + 13) - 0.5) * 1.15, 0.615, (rnd(i + 53) - 0.5) * 0.82]}
            rotation={[0, rnd(i + 93) * Math.PI, 0]}
          >
            {[...Array(n)].map((_, k) => (
              <mesh
                key={k}
                geometry={dot}
                position={[(k - (n - 1) / 2) * 0.016, 0, (rnd(i * 5 + k + 7) - 0.5) * 0.012]}
                scale={0.008 + rnd(i * 7 + k + 133) * 0.006}
              >
                <PMat color="#101216" metal={0.1} rough={0.9} e={0.02} />
              </mesh>
            ))}
          </group>
        )
      })}
      {/* ZnO activator specks */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={i}
          geometry={dot}
          position={[(rnd(i + 401) - 0.5) * 1.1, 0.618, (rnd(i + 441) - 0.5) * 0.8]}
          scale={0.007 + rnd(i + 481) * 0.004}
        >
          <PMat color="#cdd3da" metal={0.3} rough={0.5} e={0.1} />
        </mesh>
      ))}
      {/* wavy crosslink hint lines: zig-zag triplets of thin boxes */}
      {[...Array(2)].map((_, w) => (
        <group
          key={w}
          position={[(rnd(w + 521) - 0.5) * 0.8, 0.617, (rnd(w + 561) - 0.5) * 0.6]}
          rotation={[0, rnd(w + 601) * Math.PI, 0]}
        >
          {[...Array(3)].map((_, k) => (
            <mesh
              key={k}
              position={[(k - 1) * 0.06, 0, k % 2 ? 0.012 : -0.012]}
              rotation={[0, k % 2 ? 0.5 : -0.5, 0]}
            >
              <boxGeometry args={[0.07, 0.004, 0.006]} />
              <PMat color="#3a3f45" metal={0.1} rough={0.8} e={0.05} opacity={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'composite' — glass-fiber reinforced polymer: straight fiber rods at two
 *  dominant orientations in amber resin, some fibers seen end-on as dots. */
function Composite() {
  const fib = useMemo(() => new THREE.CylinderGeometry(0.012, 0.012, 1, 6), [])
  return (
    <group>
      <Slab color="#8a7a55" metal={0.1} rough={0.5} />
      {/* fiber rods lying in-plane, two dominant orientations */}
      {[...Array(34)].map((_, i) => {
        const a = (i % 2 ? 0.35 : 1.75) + (rnd(i + 77) - 0.5) * 0.22
        const len = 0.2 + rnd(i + 117) * 0.25
        return (
          <mesh
            key={i}
            geometry={fib}
            position={[(rnd(i + 157) - 0.5) * 1.05, 0.616, (rnd(i + 197) - 0.5) * 0.76]}
            rotation={[0, a, Math.PI / 2]}
            scale={[1, len, 1]}
          >
            <PMat color="#dfe3e9" metal={0.2} rough={0.3} e={0.06} env={0.6} />
          </mesh>
        )
      })}
      {/* fiber ends seen end-on: bright circular dots */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[(rnd(i + 237) - 0.5) * 1.1, 0.616, (rnd(i + 277) - 0.5) * 0.8]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
          <PMat color="#f0f3f8" metal={0.2} rough={0.25} e={0.1} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'ceramic' — sintered alumina: tightly packed angular faceted grains in
 *  bone tones with occasional dark pores at the junctions. */
function Ceramic() {
  const facets = useMemo(
    () => [5, 6, 7].map((s) => new THREE.CylinderGeometry(1, 0.92, 1, s)),
    [],
  )
  return (
    <group>
      <Slab color="#b3ac9c" metal={0.05} rough={0.6} />
      {/* faceted grains (7 × 5 jittered grid, low radial segs read angular) */}
      {[...Array(35)].map((_, i) => {
        const c = i % 7
        const r = Math.floor(i / 7)
        const rad = 0.055 + rnd(i + 139) * 0.025
        return (
          <mesh
            key={i}
            geometry={facets[i % 3]}
            position={[
              -0.51 + c * 0.17 + (rnd(i + 29) - 0.5) * 0.05,
              0.612,
              -0.32 + r * 0.16 + (rnd(i + 69) - 0.5) * 0.05,
            ]}
            rotation={[0, rnd(i + 109) * Math.PI, 0]}
            scale={[rad, 0.018, rad]}
          >
            <PMat color={i % 2 ? '#ddd7c9' : '#cfc8b8'} metal={0.05} rough={0.55} e={0.04} />
          </mesh>
        )
      })}
      {/* residual porosity: small dark dots */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[(rnd(i + 309) - 0.5) * 1.1, 0.623, (rnd(i + 349) - 0.5) * 0.8]}
        >
          <sphereGeometry args={[0.006 + rnd(i + 389) * 0.003, 6, 4]} />
          <PMat color="#2b2822" metal={0} rough={0.9} e={0.02} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'glass' — amorphous glass: a featureless polished slab. The point is the
 *  ABSENCE of grains — only faint conchoidal arc ripples and tiny bubbles. */
function Glass() {
  return (
    <group>
      <Slab color="#aebfc7" metal={0.1} rough={0.1} e={0.03} opacity={0.9} />
      {/* two faint conchoidal fracture-ripple arcs, barely lighter */}
      <mesh position={[-0.12, 0.612, 0.06]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <torusGeometry args={[0.2, 0.0045, 6, 20, Math.PI * 0.75]} />
        <PMat color="#bfccd4" metal={0.1} rough={0.2} e={0.05} opacity={0.7} />
      </mesh>
      <mesh position={[0.1, 0.612, -0.08]} rotation={[-Math.PI / 2, 0, 2.6]}>
        <torusGeometry args={[0.3, 0.004, 6, 20, Math.PI * 0.6]} />
        <PMat color="#bfccd4" metal={0.1} rough={0.2} e={0.05} opacity={0.7} />
      </mesh>
      {/* a couple of tiny trapped bubbles under the surface */}
      {[
        [-0.3, 0.57, -0.15, 0.01],
        [0.25, 0.55, 0.18, 0.012],
        [0.02, 0.59, 0.3, 0.008],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 8, 6]} />
          <PMat color="#d7e3e9" metal={0} rough={0.15} e={0.06} opacity={0.75} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'superalloy' — Inconel γ/γ′: an ordered array of tiny pale γ′ cuboids on
 *  a slightly darker γ matrix — rows and columns, unmistakably regular. */
function Superalloy() {
  return (
    <group>
      <Slab color="#7e8693" metal={0.8} rough={0.45} />
      {/* γ′ precipitate cuboids: 9 × 5 grid with only tiny jitter */}
      {[...Array(45)].map((_, i) => {
        const c = i % 9
        const r = Math.floor(i / 9)
        return (
          <RBox
            key={i}
            args={[0.03, 0.013, 0.03]}
            radius={0.004}
            smoothness={1}
            position={[
              -0.48 + c * 0.12 + (rnd(i + 11) - 0.5) * 0.012,
              0.615,
              -0.26 + r * 0.13 + (rnd(i + 61) - 0.5) * 0.012,
            ]}
          >
            <PMat color="#c9cfd8" metal={0.85} rough={0.35} e={0.05} />
          </RBox>
        )
      })}
      <ScaleBar />
    </group>
  )
}

/** 'semiconductor' — silicon die: mirror-black slab with a faint rectangular
 *  circuit grid of thin glowing traces and a few gold bond pads. */
function Semiconductor() {
  return (
    <group>
      <Slab color="#14161c" metal={0.3} rough={0.05} e={0.02} />
      {/* metallization grid: rows */}
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[0, 0.612, -0.33 + i * 0.11]}>
          <boxGeometry args={[1.12, 0.005, 0.01]} />
          <PMat color="#2a6a7a" metal={0.3} rough={0.3} e={0.3} />
        </mesh>
      ))}
      {/* metallization grid: columns */}
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[-0.45 + i * 0.15, 0.612, 0]}>
          <boxGeometry args={[0.01, 0.005, 0.8]} />
          <PMat color="#2a6a7a" metal={0.3} rough={0.3} e={0.3} />
        </mesh>
      ))}
      {/* short grid-aligned bus stubs (brighter cells) */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            -0.45 + Math.floor(rnd(i + 71) * 6.99) * 0.15,
            0.614,
            -0.33 + Math.floor(rnd(i + 91) * 6.99) * 0.11 + 0.055,
          ]}
        >
          <boxGeometry args={[0.1, 0.006, 0.02]} />
          <PMat color="#3b8296" metal={0.3} rough={0.3} e={0.35} />
        </mesh>
      ))}
      {/* gold bond pads */}
      {[
        [-0.52, -0.38],
        [0.52, -0.38],
        [0.52, 0.38],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.614, z]}>
          <boxGeometry args={[0.06, 0.008, 0.06]} />
          <PMat color="#cfae58" metal={1.0} rough={0.3} e={0.08} env={1.1} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'foam' — PU seat foam: open cells — rings packed across the surface, some
 *  overlapping, with deeper dark dots inside a few cells. */
function Foam() {
  const ring = useMemo(() => new THREE.TorusGeometry(1, 0.16, 6, 16), [])
  const dot = useMemo(() => new THREE.SphereGeometry(1, 6, 4), [])
  return (
    <group>
      <Slab color="#a08451" metal={0.05} rough={0.75} />
      {/* open cell windows: 6 × 5 jittered grid of struts (tori) */}
      {[...Array(30)].map((_, i) => {
        const c = i % 6
        const r = Math.floor(i / 6)
        const rad = 0.03 + rnd(i + 151) * 0.03
        return (
          <mesh
            key={i}
            geometry={ring}
            position={[
              -0.5 + c * 0.2 + (rnd(i + 31) - 0.5) * 0.08,
              0.615,
              -0.34 + r * 0.17 + (rnd(i + 71) - 0.5) * 0.07,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={rad}
          >
            <PMat color="#8a7544" metal={0.05} rough={0.8} e={0.03} />
          </mesh>
        )
      })}
      {/* deeper dark throats inside a few cells */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          geometry={dot}
          position={[(rnd(i + 311) - 0.5) * 1.05, 0.609, (rnd(i + 351) - 0.5) * 0.76]}
          scale={0.012 + rnd(i + 391) * 0.008}
        >
          <PMat color="#3a2f1c" metal={0} rough={0.95} e={0.01} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/** 'lead' — battery grid Pb-Ca/Sn alloy: very large soft grains with wide
 *  dark boundaries and one or two bright tin specks. */
function Lead() {
  const sph = useMemo(() => new THREE.SphereGeometry(1, 12, 8), [])
  return (
    <group>
      <Slab color="#3a3d44" metal={0.5} rough={0.6} />
      {/* ~9 very large soft grains (3 × 3) — gaps read as wide boundaries */}
      {[...Array(9)].map((_, i) => {
        const c = i % 3
        const r = Math.floor(i / 3)
        return (
          <mesh
            key={i}
            geometry={sph}
            position={[
              -0.42 + c * 0.42 + (rnd(i + 37) - 0.5) * 0.05,
              0.611,
              -0.28 + r * 0.28 + (rnd(i + 83) - 0.5) * 0.04,
            ]}
            rotation={[0, rnd(i + 127) * Math.PI, 0]}
            scale={[0.2 + rnd(i + 167) * 0.08, 0.018, 0.14 + rnd(i + 207) * 0.06]}
          >
            <PMat color={i % 2 ? '#8a8d96' : '#7b7e88'} metal={0.7} rough={0.55} e={0.04} />
          </mesh>
        )
      })}
      {/* bright tin specks on the boundaries */}
      {[
        [-0.2, 0.14],
        [0.22, -0.13],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.622, z]}>
          <sphereGeometry args={[0.012, 8, 6]} />
          <PMat color="#e9edf3" metal={0.9} rough={0.2} e={0.2} />
        </mesh>
      ))}
      <ScaleBar />
    </group>
  )
}

/* --------------------------------- export ---------------------------------- */

const KINDS: Record<MicroKind, () => ReactElement> = {
  'cast-al': CastAl,
  martensite: Martensite,
  pearlite: Pearlite,
  nodular: Nodular,
  stainless: Stainless,
  copper: Copper,
  polymer: Polymer,
  rubber: Rubber,
  composite: Composite,
  ceramic: Ceramic,
  glass: Glass,
  superalloy: Superalloy,
  semiconductor: Semiconductor,
  foam: Foam,
  lead: Lead,
}

/** One polished microscope sample slab per material family. */
export function MicroSample({ kind }: { kind: MicroKind }): ReactElement {
  const Impl = KINDS[kind]
  return <Impl />
}
