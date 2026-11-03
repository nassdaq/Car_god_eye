/**
 * lattice-lib — procedural atomic-structure library for the deepest zoom level.
 *
 * Visual language copied from deep-views' Lattice: small sphere atoms, thin
 * translucent teal cell-edge cylinders, one unit cell highlighted with glowing
 * cyan edges, accent-colored solutes/interstitials. Everything is static and
 * deterministic (useMemo, seeded pseudo-random), every material is <PMat/>,
 * and each sample is centered at x≈0 / z≈0 spanning roughly y 0.25–1.5.
 *
 * Budget: ≤ ~15k triangles per kind (sphere segs ≤ 12, stick cylinders 5–6
 * radial segments, open-ended).
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PMat } from './realism'

export type LatKind = 'fcc' | 'bcc' | 'hcp' | 'diamond' | 'chain' | 'network' | 'ionic'

type V3 = THREE.Vector3
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
const UP = new THREE.Vector3(0, 1, 0)

/* deterministic pseudo-random (stable across renders) */
const rnd = (n: number) => (((Math.sin(n * 127.1) * 43758.5453) % 1) + 1) % 1

/* ------------------------------ shared pieces ------------------------------ */

function Atoms({
  pts,
  r,
  color,
  e = 0.05,
  metal = 0.85,
  rough = 0.3,
  w = 8,
  h = 6,
}: {
  pts: V3[]
  r: number
  color: string
  e?: number
  metal?: number
  rough?: number
  w?: number
  h?: number
}) {
  return (
    <group>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[r, w, h]} />
          <PMat color={color} e={e} metal={metal} rough={rough} />
        </mesh>
      ))}
    </group>
  )
}

/** Thin cylinders between point pairs — cell edges, bonds, guide lines. */
function Sticks({
  pairs,
  r = 0.005,
  seg = 5,
  color,
  e = 0.3,
  opacity = 0.5,
  solid = false,
}: {
  pairs: [V3, V3][]
  r?: number
  seg?: number
  color: string
  e?: number
  opacity?: number
  /** true for real bonds (depth-written), false for glowy overlay lines */
  solid?: boolean
}) {
  const items = useMemo(
    () =>
      pairs.map(([a, b]) => {
        const d = b.clone().sub(a)
        return {
          mid: a.clone().add(b).multiplyScalar(0.5),
          quat: new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()),
          len: Math.max(d.length(), 1e-4),
        }
      }),
    [pairs],
  )
  return (
    <group>
      {items.map((s, i) => (
        <mesh key={i} position={s.mid} quaternion={s.quat}>
          <cylinderGeometry args={[r, r, s.len, seg, 1, true]} />
          <PMat
            color={color}
            e={e}
            metal={solid ? 0.3 : 0}
            rough={solid ? 0.5 : 0.4}
            opacity={opacity}
            depthWrite={solid}
          />
        </mesh>
      ))}
    </group>
  )
}

/** All edge lines of an N×N×N grid of cubic cells with spacing A. */
function gridEdges(N: number, A: number): [V3, V3][] {
  const edges: [V3, V3][] = []
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N; j++)
      for (let k = 0; k <= N; k++) {
        if (i < N) edges.push([v3(i * A, j * A, k * A), v3((i + 1) * A, j * A, k * A)])
        if (j < N) edges.push([v3(i * A, j * A, k * A), v3(i * A, (j + 1) * A, k * A)])
        if (k < N) edges.push([v3(i * A, j * A, k * A), v3(i * A, j * A, (k + 1) * A)])
      }
  return edges
}

/** The 12 edges of one cube: lower corner `lo`, side `s`. */
function cubeEdges(lo: V3, s: number): [V3, V3][] {
  const edges: [V3, V3][] = []
  for (const a of [0, s])
    for (const b of [0, s]) {
      edges.push([v3(lo.x + a, lo.y + b, lo.z), v3(lo.x + a, lo.y + b, lo.z + s)])
      edges.push([v3(lo.x + a, lo.y, lo.z + b), v3(lo.x + a, lo.y + s, lo.z + b)])
      edges.push([v3(lo.x, lo.y + a, lo.z + b), v3(lo.x + s, lo.y + a, lo.z + b)])
    }
  return edges
}

/* =================================== FCC =================================== */

function FccSample() {
  const A = 0.44
  const N = 3
  const { hosts, solutes, edges, cell } = useMemo(() => {
    const seen = new Set<string>()
    const all: V3[] = []
    const add = (x: number, y: number, z: number) => {
      const key = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`
      if (seen.has(key)) return
      seen.add(key)
      all.push(v3(x, y, z))
    }
    // corners
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++) add(i * A, j * A, k * A)
    // face centers
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
    // substitutional solutes sit ON lattice sites, replacing hosts
    const solutes = [v3(A, A, A), v3(2 * A, 2 * A, A), v3(A, 2 * A, 3 * A)]
    const hosts = all.filter((p) => !solutes.some((s) => s.distanceTo(p) < 0.01))
    return { hosts, solutes, edges: gridEdges(N, A), cell: cubeEdges(v3(A, A, A), A) }
  }, [])
  const o = (-A * N) / 2
  return (
    <group position={[o, 0.22, o]}>
      <Atoms pts={hosts} r={0.068} color="#c7ccd4" w={7} h={5} />
      <Atoms pts={solutes} r={0.078} color="#ff9a4d" e={0.45} metal={0.6} w={12} h={8} />
      <Sticks pairs={edges} r={0.005} color="#1d6a7a" e={0.3} opacity={0.5} />
      <Sticks pairs={cell} r={0.009} seg={6} color="#36e6ff" e={0.9} opacity={0.9} />
    </group>
  )
}

/* =================================== BCC =================================== */

function BccSample() {
  const A = 0.44
  const N = 3
  const { hosts, carbons, edges, cell } = useMemo(() => {
    const hosts: V3[] = []
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++) hosts.push(v3(i * A, j * A, k * A))
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        for (let k = 0; k < N; k++) hosts.push(v3((i + 0.5) * A, (j + 0.5) * A, (k + 0.5) * A))
    // interstitial carbon in octahedral sites (edge midpoints)
    const carbons = [
      v3(1.5 * A, A, A),
      v3(2 * A, 2.5 * A, 2 * A),
      v3(A, 2 * A, 2.5 * A),
      v3(2.5 * A, A, 2 * A),
    ]
    return { hosts, carbons, edges: gridEdges(N, A), cell: cubeEdges(v3(A, A, A), A) }
  }, [])
  const o = (-A * N) / 2
  return (
    <group position={[o, 0.22, o]}>
      <Atoms pts={hosts} r={0.068} color="#949aa6" w={8} h={6} />
      <Atoms pts={carbons} r={0.034} color="#22262e" e={0.3} metal={0.6} />
      <Sticks pairs={edges} r={0.005} color="#1d6a7a" e={0.3} opacity={0.5} />
      <Sticks pairs={cell} r={0.009} seg={6} color="#36e6ff" e={0.9} opacity={0.9} />
    </group>
  )
}

/* =================================== HCP =================================== */

function HcpSample() {
  const a = 0.4
  const c = 0.65
  const { atoms, prism, guides } = useMemo(() => {
    const atoms: V3[] = []
    // A layer: hexagon ring + center
    const hex = (y: number) => {
      atoms.push(v3(0, y, 0))
      for (let k = 0; k < 6; k++) {
        const t = (k / 6) * Math.PI * 2
        atoms.push(v3(Math.cos(t) * a, y, Math.sin(t) * a))
      }
    }
    // B layer: 3 atoms nested in alternating triangular hollows
    const mid = (y: number) => {
      const r = a / Math.sqrt(3)
      for (let k = 0; k < 3; k++) {
        const t = Math.PI / 6 + (k * Math.PI * 2) / 3
        atoms.push(v3(Math.cos(t) * r, y, Math.sin(t) * r))
      }
    }
    hex(0)
    mid(c / 2)
    hex(c)
    mid(1.5 * c)
    hex(2 * c) // ABAB stacking, two repeats
    // hexagonal prism of one cell (y: 0..c) + full-height corner guides
    const corner = (k: number, y: number) => {
      const t = (k / 6) * Math.PI * 2
      return v3(Math.cos(t) * a, y, Math.sin(t) * a)
    }
    const prism: [V3, V3][] = []
    const guides: [V3, V3][] = []
    for (let k = 0; k < 6; k++) {
      prism.push([corner(k, 0), corner((k + 1) % 6, 0)])
      prism.push([corner(k, c), corner((k + 1) % 6, c)])
      prism.push([corner(k, 0), corner(k, c)])
      guides.push([corner(k, 0), corner(k, 2 * c)])
    }
    return { atoms, prism, guides }
  }, [])
  return (
    <group position={[0, 0.25, 0]}>
      <Atoms pts={atoms} r={0.068} color="#bdc4cf" w={12} h={8} />
      <Sticks pairs={guides} r={0.005} color="#1d6a7a" e={0.3} opacity={0.5} />
      <Sticks pairs={prism} r={0.009} seg={6} color="#36e6ff" e={0.9} opacity={0.9} />
    </group>
  )
}

/* ============================== DIAMOND CUBIC ============================== */

function DiamondSample() {
  const A = 0.55
  const N = 2
  const { atoms, bonds, hot } = useMemo(() => {
    const seen = new Set<string>()
    const atoms: V3[] = []
    const add = (x: number, y: number, z: number) => {
      const key = `${x.toFixed(3)}|${y.toFixed(3)}|${z.toFixed(3)}`
      if (seen.has(key)) return
      seen.add(key)
      atoms.push(v3(x, y, z))
    }
    // fcc sublattice
    for (let i = 0; i <= N; i++)
      for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++) add(i * A, j * A, k * A)
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
    // second sublattice: 4 tetrahedral interior sites per cell, offset (¼,¼,¼)a family
    const offsets: [number, number, number][] = [
      [0.25, 0.25, 0.25],
      [0.75, 0.75, 0.25],
      [0.75, 0.25, 0.75],
      [0.25, 0.75, 0.75],
    ]
    const inner: V3[] = []
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        for (let k = 0; k < N; k++)
          for (const [ox, oy, oz] of offsets) {
            const p = v3((i + ox) * A, (j + oy) * A, (k + oz) * A)
            inner.push(p)
            atoms.push(p)
          }
    // covalent bonds: all pairs under the nearest-neighbor cutoff (nn = a·√3/4 ≈ 0.433a)
    const maxD = A * 0.45
    const all: [V3, V3][] = []
    for (let x = 0; x < atoms.length; x++)
      for (let y = x + 1; y < atoms.length; y++)
        if (atoms[x].distanceTo(atoms[y]) < maxD) all.push([atoms[x], atoms[y]])
    // highlight the tetrahedron of the interior atom nearest the grid center
    const center = v3(A, A, A)
    let hotAtom = inner[0]
    for (const p of inner) if (p.distanceTo(center) < hotAtom.distanceTo(center) - 1e-6) hotAtom = p
    const hot = all.filter(([p, q]) => p === hotAtom || q === hotAtom)
    const bonds = all.filter(([p, q]) => p !== hotAtom && q !== hotAtom)
    return { atoms, bonds, hot }
  }, [])
  const o = (-A * N) / 2
  return (
    <group position={[o, 0.32, o]}>
      <Atoms pts={atoms} r={0.058} color="#8a93a0" w={8} h={6} />
      <Sticks pairs={bonds} r={0.009} color="#36e6ff" e={0.25} opacity={0.6} />
      <Sticks pairs={hot} r={0.013} seg={6} color="#36e6ff" e={0.95} opacity={0.95} />
    </group>
  )
}

/* ============================== POLYMER CHAIN ============================== */

function ChainSample() {
  const { carbons, hyds, cBonds, hBonds } = useMemo(() => {
    const n = 14
    const dx = 0.1
    const dy = 0.0715 // gives ~110° zig-zag bond angle
    const carbons: V3[] = []
    const hyds: V3[] = []
    const cBonds: [V3, V3][] = []
    const hBonds: [V3, V3][] = []
    for (let i = 0; i < n; i++) {
      const up = i % 2 === 0 ? 1 : -1
      const p = v3((i - (n - 1) / 2) * dx, up * dy, 0)
      carbons.push(p)
      if (i > 0) cBonds.push([carbons[i - 1], p])
      // hydrogen pair hanging off each carbon, away from the backbone plane
      for (const s of [-1, 1]) {
        const hp = v3(p.x, p.y + up * 0.05, s * 0.075)
        hyds.push(hp)
        hBonds.push([p, hp])
      }
    }
    return { carbons, hyds, cBonds, hBonds }
  }, [])
  // middle chain: 3 highlighted backbone bonds
  const hotBonds = useMemo(() => cBonds.slice(6, 9), [cBonds])
  const coolBonds = useMemo(() => [...cBonds.slice(0, 6), ...cBonds.slice(9)], [cBonds])
  // loosely packed: offset in z, slightly in y, two chains rotated a few degrees
  const chains: { pos: [number, number, number]; rot: [number, number, number]; mid: boolean }[] = [
    { pos: [0.04, 1.18, -0.3], rot: [0, 0.16, 0.05], mid: false },
    { pos: [0, 0.85, 0], rot: [0, 0, 0], mid: true },
    { pos: [-0.03, 0.52, 0.3], rot: [0.04, -0.1, -0.03], mid: false },
  ]
  return (
    <group>
      {chains.map((ch, i) => (
        <group key={i} position={ch.pos} rotation={ch.rot}>
          <Atoms pts={carbons} r={0.055} color="#2e333c" metal={0.3} rough={0.65} w={10} h={7} />
          <Atoms pts={hyds} r={0.03} color="#dfe3e9" e={0.08} metal={0.1} rough={0.55} w={8} h={5} />
          <Sticks
            pairs={ch.mid ? coolBonds : cBonds}
            r={0.016}
            color="#9aa1ad"
            e={0.08}
            opacity={1}
            solid
          />
          {ch.mid && (
            <Sticks pairs={hotBonds} r={0.02} seg={6} color="#36e6ff" e={0.9} opacity={0.9} />
          )}
          <Sticks pairs={hBonds} r={0.007} color="#9aa1ad" e={0.05} opacity={0.7} solid />
        </group>
      ))}
    </group>
  )
}

/* ========================= CROSSLINKED NETWORK ============================= */

function NetworkSample() {
  const { atoms, links, bridges, sulfur } = useMemo(() => {
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    let seed = 1
    const R = () => rnd(seed++)
    const chains: V3[][] = []
    const atoms: V3[] = []
    const links: [V3, V3][] = []
    // 5 meandering chains of 8 atoms — a drift direction plus random wobble
    for (let c = 0; c < 5; c++) {
      const pts: V3[] = []
      let x = (R() - 0.5) * 1.0
      let y = 0.45 + R() * 0.8
      let z = (R() - 0.5) * 0.8
      const th = R() * Math.PI * 2
      const drift = [Math.cos(th) * 0.13, (R() - 0.5) * 0.1, Math.sin(th) * 0.13]
      for (let i = 0; i < 8; i++) {
        if (i > 0) {
          x = clamp(x + drift[0] + (R() - 0.5) * 0.14, -0.62, 0.62)
          y = clamp(y + drift[1] + (R() - 0.5) * 0.16, 0.34, 1.44)
          z = clamp(z + drift[2] + (R() - 0.5) * 0.14, -0.5, 0.5)
        }
        const p = v3(x, y, z)
        pts.push(p)
        atoms.push(p)
        if (i > 0) links.push([pts[i - 1], p])
      }
      chains.push(pts)
    }
    // sulfur crosslinks: closest pairs ACROSS chains, each atom used once
    const cand: { a: V3; b: V3; d: number }[] = []
    for (let c1 = 0; c1 < chains.length; c1++)
      for (let c2 = c1 + 1; c2 < chains.length; c2++)
        for (const a of chains[c1])
          for (const b of chains[c2]) {
            const d = a.distanceTo(b)
            if (d > 0.12 && d < 0.8) cand.push({ a, b, d })
          }
    cand.sort((p, q) => p.d - q.d)
    const used = new Set<V3>()
    const bridges: [V3, V3][] = []
    for (const { a, b } of cand) {
      if (used.has(a) || used.has(b)) continue
      used.add(a)
      used.add(b)
      bridges.push([a, b])
      if (bridges.length === 6) break
    }
    // short S–S pair beads along each bridge
    const sulfur: V3[] = []
    for (const [a, b] of bridges) sulfur.push(a.clone().lerp(b, 0.35), a.clone().lerp(b, 0.65))
    return { atoms, links, bridges, sulfur }
  }, [])
  // no cell edges, no highlighted cell: the absence of order is the lesson
  return (
    <group>
      <Atoms pts={atoms} r={0.052} color="#3c424c" metal={0.25} rough={0.7} w={10} h={7} />
      <Sticks pairs={links} r={0.014} color="#6b7280" e={0.06} opacity={1} solid />
      <Sticks pairs={bridges} r={0.011} seg={6} color="#ffd24d" e={0.5} opacity={0.95} solid />
      <Atoms pts={sulfur} r={0.026} color="#ffd24d" e={0.5} metal={0.3} rough={0.5} w={8} h={5} />
    </group>
  )
}

/* ============================ IONIC (ROCK SALT) ============================ */

function IonicSample() {
  const S = 0.33 // ion spacing; rock-salt cell edge = 2S
  const { big, small, edges, cell } = useMemo(() => {
    const big: V3[] = []
    const small: V3[] = []
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
          ((i + j + k) % 2 === 0 ? big : small).push(v3(i * S, j * S, k * S))
    // conventional cell: 2S cube with anions at its corners and face centers
    return { big, small, edges: gridEdges(3, S), cell: cubeEdges(v3(0, 0, 0), 2 * S) }
  }, [])
  const o = (-S * 3) / 2
  return (
    <group position={[o, 0.38, o]}>
      <Atoms pts={big} r={0.085} color="#d6d0c2" metal={0.4} rough={0.5} w={10} h={7} />
      <Atoms pts={small} r={0.045} color="#8a93a0" />
      <Sticks pairs={edges} r={0.005} color="#1d6a7a" e={0.3} opacity={0.5} />
      <Sticks pairs={cell} r={0.009} seg={6} color="#36e6ff" e={0.9} opacity={0.9} />
    </group>
  )
}

/* ================================== export ================================= */

export function LatticeSample({ kind }: { kind: LatKind }) {
  switch (kind) {
    case 'bcc':
      return <BccSample />
    case 'hcp':
      return <HcpSample />
    case 'diamond':
      return <DiamondSample />
    case 'chain':
      return <ChainSample />
    case 'network':
      return <NetworkSample />
    case 'ionic':
      return <IonicSample />
    case 'fcc':
    default:
      return <FccSample />
  }
}
