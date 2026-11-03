/**
 * The deep-zoom ladder: cross-section → microstructure → crystal lattice.
 * Each view renders its level's single child node, full size.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PartGroup } from './lib'
import { Lathe, PMat, RBox } from './realism'

/* deterministic pseudo-random (stable across renders) */
const rnd = (n: number) => (((Math.sin(n * 127.1) * 43758.5453) % 1) + 1) % 1

/* ------------------------------- glow helpers ------------------------------ */

function GlowArrow({
  from,
  to,
  color,
  r = 0.014,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  r?: number
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    const len = d.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      d.clone().normalize(),
    )
    return { pos: a.clone().add(b).multiplyScalar(0.5), quat, len }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <group>
      <mesh position={pos} quaternion={quat}>
        <cylinderGeometry args={[r, r, len, 8]} />
        <PMat color={color} e={0.9} metal={0} rough={0.4} opacity={0.85} depthWrite={false} />
      </mesh>
      <mesh position={to} quaternion={quat}>
        <coneGeometry args={[r * 2.6, r * 5, 10]} />
        <PMat color={color} e={1.0} metal={0} rough={0.4} opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ============================ SECTIONED CROWN ============================== */

const CROWN_OUTER: [number, number][] = [
  [0.54, 0.55],
  [0.545, 0.9],
  [0.55, 1.055],
  [0.49, 1.06],
  [0.49, 1.095],
  [0.55, 1.1],
  [0.55, 1.135],
  [0.5, 1.14],
  [0.5, 1.165],
  [0.55, 1.17],
  [0.55, 1.205],
  [0.5, 1.21],
  [0.5, 1.235],
  [0.55, 1.24],
  [0.55, 1.29],
  [0.52, 1.32],
  [0.3, 1.3],
  [0.001, 1.305],
]

const CROWN_INNER: [number, number][] = [
  [0.5, 0.55],
  [0.5, 1.02],
  [0.42, 1.12],
  [0.25, 1.2],
  [0.001, 1.23],
]

function useCrownCap() {
  return useMemo(() => {
    const s = new THREE.Shape()
    const path: [number, number][] = [
      ...[...CROWN_OUTER].reverse(), // from axis-top down the outside
      ...CROWN_INNER.slice().reverse().reverse(), // then up the inside
    ]
    // outer path: axis top → outer → bottom
    const seq: [number, number][] = [...CROWN_OUTER].reverse()
    s.moveTo(seq[0][0], seq[0][1])
    for (const [r, y] of seq.slice(1)) s.lineTo(r, y)
    // across the bottom edge to the inner wall, then up the inside to the axis
    for (const [r, y] of CROWN_INNER) s.lineTo(r, y)
    s.closePath()
    void path
    return new THREE.ShapeGeometry(s, 4)
  }, [])
}

function SectionedCrown() {
  const cap = useCrownCap()
  return (
    <group>
      {/* outer + inner half surfaces */}
      <Lathe pts={CROWN_OUTER} seg={40} phi={Math.PI}>
        <PMat m="machAlu" side={THREE.DoubleSide} />
      </Lathe>
      <Lathe pts={CROWN_INNER} seg={40} phi={Math.PI}>
        <PMat m="castAlu" rough={0.5} side={THREE.DoubleSide} />
      </Lathe>
      {/* the cut faces — bright machined section plane */}
      {[1, -1].map((m) => (
        <mesh key={m} geometry={cap} rotation={[0, (m * Math.PI) / 2, 0]}>
          <PMat color="#e3e8ef" metal={0.9} rough={0.18} e={0.06} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* rings seated in the grooves (half arcs) */}
      {[
        { y: 1.2225, t: 0.014 },
        { y: 1.1525, t: 0.013 },
        { y: 1.0775, t: 0.016 },
      ].map((g) => (
        <mesh key={g.y} position={[0, g.y, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
          <torusGeometry args={[0.545, g.t, 10, 40, Math.PI]} />
          <PMat m="polSteel" />
        </mesh>
      ))}
      {/* anodized top-groove band — glow hint */}
      <mesh position={[0, 1.265, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.552, 0.006, 6, 40, Math.PI]} />
        <PMat color="#36e6ff" e={0.7} metal={0} opacity={0.8} depthWrite={false} />
      </mesh>
      {/* heat path arrows: crown → out through the ring belt */}
      <GlowArrow from={[0.15, 1.34, 0.2]} to={[0.45, 1.3, 0.2]} color="#ff7a45" />
      <GlowArrow from={[0.48, 1.26, 0.25]} to={[0.72, 1.14, 0.3]} color="#ff7a45" />
      <GlowArrow from={[0.42, 1.3, -0.22]} to={[0.68, 1.16, -0.3]} color="#ff7a45" />
      {/* some heat down the skirt */}
      <GlowArrow from={[0.56, 1.0, 0.1]} to={[0.6, 0.65, 0.12]} color="#ff7a45" r={0.01} />
      {/* oil jet splashing the under-crown */}
      <GlowArrow from={[0.18, 0.62, -0.15]} to={[0.22, 1.12, -0.08]} color="#ffb347" />
      <GlowArrow from={[-0.1, 0.6, 0.18]} to={[-0.12, 1.14, 0.1]} color="#ffb347" />
    </group>
  )
}

/* ============================= SECTIONED DISC ============================== */

function SectionedDisc() {
  return (
    <group position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* two friction plates (half annuli) */}
      {[0.075, -0.075].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.05, 40, 1, false, 0, Math.PI]} />
            <PMat m="iron" />
          </mesh>
          {/* cut-face caps */}
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[0.004, 0.052, 1.1]} />
            <PMat color="#aeb6c2" metal={0.9} rough={0.2} e={0.06} />
          </mesh>
        </group>
      ))}
      {/* vanes in the gap */}
      {[...Array(7)].map((_, i) => {
        const a = (i + 0.5) * (Math.PI / 7)
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.35, 0, Math.cos(a) * 0.35]}
            rotation={[0, a, 0]}
          >
            <boxGeometry args={[0.03, 0.1, 0.32]} />
            <PMat m="iron" rough={0.7} />
          </mesh>
        )
      })}
      {/* hub hat (half) + cap */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.2, 0.22, 0.13, 28, 1, false, 0, Math.PI]} />
        <PMat m="iron" />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.004, 0.13, 0.42]} />
        <PMat color="#aeb6c2" metal={0.9} rough={0.2} e={0.06} />
      </mesh>
      {/* wear-limit lines on both plate cut faces */}
      {[0.075, -0.075].map((y) => (
        <mesh key={y} position={[0.004, y + (y > 0 ? 0.019 : -0.019), 0]}>
          <boxGeometry args={[0.004, 0.003, 1.1]} />
          <PMat color="#ff2d7a" e={0.9} metal={0} opacity={0.9} depthWrite={false} />
        </mesh>
      ))}
      {/* air path through the vanes: hub → rim */}
      {[0.35, 1.2, 2.2].map((a) => (
        <GlowArrow
          key={a}
          from={[Math.sin(a) * 0.16, 0, Math.cos(a) * 0.16]}
          to={[Math.sin(a + 0.35) * 0.58, 0, Math.cos(a + 0.35) * 0.58]}
          color="#36e6ff"
        />
      ))}
    </group>
  )
}

/* ============================= MICROSTRUCTURE ============================== */

function Microstructure({ kind }: { kind: 'forgedAl' | 'grayIron' }) {
  const isAl = kind === 'forgedAl'
  return (
    <group>
      {/* sample slab — top face dark so boundaries read between grains */}
      <RBox args={[1.3, 0.22, 0.95]} radius={0.02} smoothness={2} position={[0, 0.5, 0]}>
        <PMat color={isAl ? '#5d6670' : '#4a4f58'} metal={0.6} rough={0.5} e={0.04} />
      </RBox>

      {isAl ? (
        <group>
          {/* pancaked forged grains in flow-aligned rows */}
          {[...Array(40)].map((_, i) => {
            const row = Math.floor(i / 8)
            const col = i % 8
            const x = -0.56 + col * 0.155 + (rnd(i) - 0.5) * 0.05
            const z = -0.36 + row * 0.18 + (rnd(i + 40) - 0.5) * 0.05
            const tone = ['#8c95a2', '#7d8694', '#99a1ad'][i % 3]
            return (
              <mesh
                key={i}
                position={[x, 0.615, z]}
                rotation={[0, (rnd(i + 80) - 0.5) * 0.4, 0]}
                scale={[0.085 + rnd(i + 120) * 0.05, 0.016, 0.055 + rnd(i + 160) * 0.03]}
              >
                <sphereGeometry args={[1, 14, 10]} />
                <PMat color={tone} metal={0.7} rough={0.55} e={0.03} env={0.4} />
              </mesh>
            )
          })}
          {/* hard intermetallic particles pinning the boundaries */}
          {[...Array(50)].map((_, i) => (
            <mesh
              key={i}
              position={[(rnd(i + 200) - 0.5) * 1.2, 0.625, (rnd(i + 260) - 0.5) * 0.86]}
            >
              <sphereGeometry args={[0.009 + rnd(i + 320) * 0.007, 8, 6]} />
              <PMat color={i % 4 === 0 ? '#d6a73d' : '#30343c'} e={0.15} metal={0.7} />
            </mesh>
          ))}
        </group>
      ) : (
        <group>
          {/* pearlite matrix patches */}
          {[...Array(26)].map((_, i) => (
            <mesh
              key={i}
              position={[(rnd(i + 11) - 0.5) * 1.18, 0.613, (rnd(i + 57) - 0.5) * 0.84]}
              rotation={[0, rnd(i + 99) * Math.PI, 0]}
              scale={[0.1 + rnd(i + 143) * 0.08, 0.012, 0.08 + rnd(i + 187) * 0.05]}
            >
              <sphereGeometry args={[1, 12, 8]} />
              <PMat color={i % 3 ? '#8d939e' : '#9aa1ab'} metal={0.8} rough={0.4} e={0.05} />
            </mesh>
          ))}
          {/* graphite flakes — thin curved dark plates */}
          {[...Array(42)].map((_, i) => {
            const x = (rnd(i + 301) - 0.5) * 1.15
            const z = (rnd(i + 361) - 0.5) * 0.82
            const a = rnd(i + 421) * Math.PI
            const len = 0.09 + rnd(i + 481) * 0.14
            return (
              <group key={i} position={[x, 0.622, z]} rotation={[0, a, 0]}>
                <mesh rotation={[0, 0.35, 0]} position={[-len / 4, 0, 0]}>
                  <boxGeometry args={[len / 2, 0.014, 0.012]} />
                  <PMat color="#16181d" metal={0.2} rough={0.8} e={0.02} />
                </mesh>
                <mesh rotation={[0, -0.3, 0]} position={[len / 4, 0, 0]}>
                  <boxGeometry args={[len / 2, 0.014, 0.012]} />
                  <PMat color="#16181d" metal={0.2} rough={0.8} e={0.02} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}

      {/* scale bar */}
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
    </group>
  )
}

/* ============================== CRYSTAL LATTICE ============================ */

function Lattice({ kind }: { kind: 'fcc' | 'bcc' }) {
  const A = 0.44
  const N = 3
  const origin = -A * (N / 2)

  const { hosts, solutes, edges } = useMemo(() => {
    const seen = new Set<string>()
    const hosts: THREE.Vector3[] = []
    const add = (x: number, y: number, z: number) => {
      const k = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`
      if (!seen.has(k)) {
        seen.add(k)
        hosts.push(new THREE.Vector3(x, y, z))
      }
    }
    // corners
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++) add(i * A, j * A, k * A)
    if (kind === 'fcc') {
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
          for (let k = 0; k < N; k++) {
            add((i + 0.5) * A, (j + 0.5) * A, k * A)
            add((i + 0.5) * A, (j + 0.5) * A, (k + 1) * A)
            add((i + 0.5) * A, j * A, (k + 0.5) * A)
            add((i + 0.5) * A, (j + 1) * A, (k + 0.5) * A)
            add(i * A, (j + 0.5) * A, (k + 0.5) * A)
            add((i + 1) * A, (j + 0.5) * A, (k + 0.5) * A)
          }
    } else {
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
          for (let k = 0; k < N; k++) add((i + 0.5) * A, (j + 0.5) * A, (k + 0.5) * A)
    }
    // substitutional / interstitial sites
    const solutes: THREE.Vector3[] =
      kind === 'fcc'
        ? [new THREE.Vector3(A, A, A), new THREE.Vector3(2 * A, 2 * A, A), new THREE.Vector3(A, 2 * A, 3 * A)]
        : [
            new THREE.Vector3(1.5 * A, A, A),
            new THREE.Vector3(2 * A, 2.5 * A, 2 * A),
            new THREE.Vector3(A, 2 * A, 2.5 * A),
            new THREE.Vector3(2.5 * A, A, 2 * A),
          ]
    // cell edge lines
    const edges: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++)
        for (let k = 0; k <= N; k++) {
          if (i < N)
            edges.push([new THREE.Vector3(i * A, j * A, k * A), new THREE.Vector3((i + 1) * A, j * A, k * A)])
          if (j < N)
            edges.push([new THREE.Vector3(i * A, j * A, k * A), new THREE.Vector3(i * A, (j + 1) * A, k * A)])
          if (k < N)
            edges.push([new THREE.Vector3(i * A, j * A, k * A), new THREE.Vector3(i * A, j * A, (k + 1) * A)])
        }
    return { hosts, solutes, edges }
  }, [kind])

  const isFcc = kind === 'fcc'
  const hostColor = isFcc ? '#c7ccd4' : '#949aa6'
  const up = new THREE.Vector3(0, 1, 0)

  return (
    <group position={[origin, 0.35 + 0, origin]}>
      {/* host atoms */}
      {hosts.map((p, i) => {
        const isSolute = solutes.some((s) => isFcc && s.distanceTo(p) < 0.01)
        if (isSolute) return null
        return (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.068, 14, 10]} />
            <PMat color={hostColor} metal={0.85} rough={0.3} e={0.05} />
          </mesh>
        )
      })}
      {/* solutes: substitutional Cu (fcc) / interstitial C (bcc) */}
      {solutes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[isFcc ? 0.078 : 0.034, 14, 10]} />
          <PMat color={isFcc ? '#ff9a4d' : '#22262e'} e={isFcc ? 0.45 : 0.3} metal={0.6} />
        </mesh>
      ))}
      {/* cell edges */}
      {edges.map(([a, b], i) => {
        const d = b.clone().sub(a)
        const len = d.length()
        const quat = new THREE.Quaternion().setFromUnitVectors(up, d.clone().normalize())
        const mid = a.clone().add(b).multiplyScalar(0.5)
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.005, 0.005, len, 5]} />
            <PMat color="#1d6a7a" e={0.3} metal={0} opacity={0.5} depthWrite={false} />
          </mesh>
        )
      })}
      {/* highlighted unit cell (center) */}
      {(() => {
        const c = A
        const cellEdges: [THREE.Vector3, THREE.Vector3][] = []
        const pts = [0, A]
        for (const x of pts)
          for (const y of pts) {
            cellEdges.push([new THREE.Vector3(c + x, c + y, c), new THREE.Vector3(c + x, c + y, c + A)])
            cellEdges.push([new THREE.Vector3(c + x, c, c + y), new THREE.Vector3(c + x, c + A, c + y)])
            cellEdges.push([new THREE.Vector3(c, c + x, c + y), new THREE.Vector3(c + A, c + x, c + y)])
          }
        return cellEdges.map(([a, b], i) => {
          const d = b.clone().sub(a)
          const quat = new THREE.Quaternion().setFromUnitVectors(up, d.clone().normalize())
          return (
            <mesh key={`h${i}`} position={a.clone().add(b).multiplyScalar(0.5)} quaternion={quat}>
              <cylinderGeometry args={[0.009, 0.009, d.length(), 6]} />
              <PMat color="#36e6ff" e={0.9} metal={0} opacity={0.9} depthWrite={false} />
            </mesh>
          )
        })
      })()}
    </group>
  )
}

/* ============================ VIEWS PER LEVEL ============================== */

export function CrownZoomView() {
  return (
    <PartGroup id="crn-section">
      <SectionedCrown />
    </PartGroup>
  )
}

export function CrownSectionView() {
  return (
    <PartGroup id="crn-micro">
      <Microstructure kind="forgedAl" />
    </PartGroup>
  )
}

export function CrownMicroView() {
  return (
    <PartGroup id="crn-lattice">
      <Lattice kind="fcc" />
    </PartGroup>
  )
}

export function DiscZoomView() {
  return (
    <PartGroup id="dsc-section">
      <SectionedDisc />
    </PartGroup>
  )
}

export function DiscSectionView() {
  return (
    <PartGroup id="dsc-micro">
      <Microstructure kind="grayIron" />
    </PartGroup>
  )
}

export function DiscMicroView() {
  return (
    <PartGroup id="dsc-lattice">
      <Lattice kind="bcc" />
    </PartGroup>
  )
}
