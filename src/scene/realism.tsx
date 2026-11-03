/**
 * Realism toolkit — shared by all high-detail part models.
 *
 * CONTRACT: every visible surface uses <PMat/> (meshStandardMaterial with
 * emissive = its own color, transparent). The selection system (PartGroup)
 * animates opacity/emissiveIntensity on every material it finds, so plain
 * non-emissive or opaque materials would break hover/select/dim behaviour.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import type { GroupProps, MeshProps } from '@react-three/fiber'

export { RoundedBox as RBox }

/* -------------------------------- materials ------------------------------- */

export const MATS = {
  /** sand-cast aluminum (block, head, housings) */
  castAlu: { color: '#9aa2ac', metalness: 0.85, roughness: 0.55, env: 0.7 },
  /** machined aluminum (decks, piston crowns, covers) */
  machAlu: { color: '#c7ccd4', metalness: 0.9, roughness: 0.25, env: 1.0 },
  /** general machined steel */
  steel: { color: '#aab0ba', metalness: 0.95, roughness: 0.32, env: 1.0 },
  /** polished / ground steel (journals, pins, rods of dampers) */
  polSteel: { color: '#d9dde3', metalness: 1.0, roughness: 0.12, env: 1.4 },
  /** forged steel, shot-peened (cranks, rods) */
  forged: { color: '#7c828c', metalness: 0.9, roughness: 0.48, env: 0.8 },
  /** gray cast iron (flywheel, liners, discs) */
  iron: { color: '#595e66', metalness: 0.75, roughness: 0.6, env: 0.5 },
  /** black crinkle paint / powder coat (cam covers, pans) */
  blackCast: { color: '#2b2f35', metalness: 0.55, roughness: 0.7, env: 0.45 },
  /** yellow-zinc plated fasteners */
  zincGold: { color: '#cfae58', metalness: 1.0, roughness: 0.28, env: 1.2 },
  brass: { color: '#c7a76a', metalness: 1.0, roughness: 0.32, env: 1.1 },
  copper: { color: '#b57347', metalness: 1.0, roughness: 0.35, env: 1.0 },
  rubber: { color: '#17191d', metalness: 0.0, roughness: 0.95, env: 0.15 },
  /** oil-soaked nylon (chain guides) */
  nylon: { color: '#c3b48c', metalness: 0.05, roughness: 0.75, env: 0.3 },
  /** gasket composite / coated MLS */
  gasket: { color: '#8f9aa8', metalness: 0.7, roughness: 0.4, env: 0.7 },
} as const

export type MatName = keyof typeof MATS

export interface PMatProps {
  m?: MatName
  color?: string
  e?: number
  opacity?: number
  rough?: number
  metal?: number
  env?: number
  side?: THREE.Side
  depthWrite?: boolean
}

export function PMat({
  m = 'steel',
  color,
  e = 0.03,
  opacity = 1,
  rough,
  metal,
  env,
  side,
  depthWrite = true,
}: PMatProps) {
  const def = MATS[m]
  const c = color ?? def.color
  return (
    <meshStandardMaterial
      color={c}
      emissive={c}
      emissiveIntensity={e}
      metalness={metal ?? def.metalness}
      roughness={rough ?? def.roughness}
      envMapIntensity={env ?? def.env}
      transparent
      opacity={opacity}
      side={side}
      depthWrite={depthWrite}
    />
  )
}

/* -------------------------------- geometry -------------------------------- */

export interface LatheProps extends Omit<MeshProps, 'children'> {
  /** [radius, y] pairs bottom→top; radius 0 allowed at tips */
  pts: [number, number][]
  seg?: number
  /** sweep angle — less than 2π gives a cutaway (pair with DoubleSide + cap plates) */
  phi?: number
  children?: ReactNode
}

/** Rotational solid from a profile — pistons, journals, pulleys, filters… */
export function Lathe({ pts, seg = 48, phi, children, ...rest }: LatheProps) {
  const geo = useMemo(() => {
    const v = pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 1e-4), y))
    const g = new THREE.LatheGeometry(v, seg, 0, phi ?? Math.PI * 2)
    g.computeVertexNormals()
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <mesh geometry={geo} {...rest}>
      {children}
    </mesh>
  )
}

export interface TubeProps extends Omit<MeshProps, 'children'> {
  path: [number, number, number][]
  r?: number
  seg?: number
  radial?: number
  closed?: boolean
  children?: ReactNode
}

/** Smooth tube along a Catmull-Rom path — pipes, hoses, chain runs… */
export function Tube({
  path,
  r = 0.03,
  seg = 48,
  radial = 12,
  closed = false,
  children,
  ...rest
}: TubeProps) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      path.map((p) => new THREE.Vector3(...p)),
      closed,
      'catmullrom',
      0.5,
    )
    return new THREE.TubeGeometry(curve, seg, r, radial, closed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <mesh geometry={geo} {...rest}>
      {children}
    </mesh>
  )
}

/** Trapezoid-tooth gear/sprocket outline (good enough at schematic distance). */
export function gearShape(teeth: number, rRoot: number, rTip: number): THREE.Shape {
  const s = new THREE.Shape()
  const pt = (r: number, a: number): [number, number] => [Math.cos(a) * r, Math.sin(a) * r]
  for (let i = 0; i < teeth; i++) {
    const a = (k: number) => ((i + k) / teeth) * Math.PI * 2
    if (i === 0) s.moveTo(...pt(rRoot, a(0)))
    else s.lineTo(...pt(rRoot, a(0)))
    s.lineTo(...pt(rRoot, a(0.25)))
    s.lineTo(...pt(rTip, a(0.42)))
    s.lineTo(...pt(rTip, a(0.58)))
    s.lineTo(...pt(rRoot, a(0.75)))
  }
  s.closePath()
  return s
}

export interface GearProps extends Omit<MeshProps, 'children'> {
  teeth: number
  rRoot: number
  rTip: number
  /** thickness along local Z */
  h: number
  /** center hole radius */
  hole?: number
  children?: ReactNode
}

/** Extruded gear / sprocket, thickness along local Z, centered. */
export function Gear({ teeth, rRoot, rTip, h, hole = 0, children, ...rest }: GearProps) {
  const geo = useMemo(() => {
    const sh = gearShape(teeth, rRoot, rTip)
    if (hole > 0) {
      const p = new THREE.Path()
      p.absarc(0, 0, hole, 0, Math.PI * 2, true)
      sh.holes.push(p)
    }
    const g = new THREE.ExtrudeGeometry(sh, {
      depth: h,
      bevelEnabled: true,
      bevelThickness: h * 0.12,
      bevelSize: h * 0.1,
      bevelSegments: 1,
      curveSegments: 2,
    })
    g.translate(0, 0, -h / 2)
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <mesh geometry={geo} {...rest}>
      {children}
    </mesh>
  )
}

export interface BoltProps extends GroupProps {
  /** shank radius */
  r?: number
  /** shank length (extends -Y from the washer plane) */
  len?: number
  /** hex head height */
  head?: number
  washer?: boolean
  m?: MatName
}

/** Hex-head bolt, head up (+Y). Origin at the clamped-face plane. */
export function Bolt({
  r = 0.014,
  len = 0.07,
  head,
  washer = true,
  m = 'zincGold',
  ...rest
}: BoltProps) {
  const hh = head ?? r * 0.9
  return (
    <group {...rest}>
      <mesh position={[0, hh / 2 + 0.004, 0]}>
        <cylinderGeometry args={[r * 1.75, r * 1.75, hh, 6]} />
        <PMat m={m} />
      </mesh>
      {washer && (
        <mesh position={[0, 0.002, 0]}>
          <cylinderGeometry args={[r * 2.2, r * 2.2, 0.005, 20]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
      )}
      <mesh position={[0, -len / 2, 0]}>
        <cylinderGeometry args={[r, r, len, 14]} />
        <PMat m="steel" rough={0.45} />
      </mesh>
    </group>
  )
}

/** Ring of bolts on a circle in the XZ plane (heads up unless flipped). */
export function BoltCircle({
  n,
  radius,
  r = 0.012,
  len = 0.05,
  m = 'zincGold',
  ...rest
}: GroupProps & { n: number; radius: number; r?: number; len?: number; m?: MatName }) {
  return (
    <group {...rest}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        return (
          <Bolt
            key={i}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            r={r}
            len={len}
            m={m}
          />
        )
      })}
    </group>
  )
}

/** Row of thin cooling/stiffening ribs along local X, standing in +Y. */
export function Ribs({
  n,
  pitch,
  w = 0.008,
  h = 0.03,
  depth = 0.3,
  m = 'castAlu',
  ...rest
}: GroupProps & {
  n: number
  pitch: number
  w?: number
  h?: number
  depth?: number
  m?: MatName
}) {
  const span = (n - 1) * pitch
  return (
    <group {...rest}>
      {Array.from({ length: n }, (_, i) => (
        <RoundedBox
          key={i}
          args={[w, h, depth]}
          radius={Math.min(w, h) * 0.3}
          smoothness={2}
          position={[-span / 2 + i * pitch, 0, 0]}
        >
          <PMat m={m} />
        </RoundedBox>
      ))}
    </group>
  )
}
