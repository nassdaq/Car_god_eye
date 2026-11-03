import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { hasChildren, pathOf } from '../data/tree'
import { useGodEye } from '../state'

/** live registry of part groups for camera framing */
export const groupRegistry = new Map<string, THREE.Group>()
;(window as unknown as { __reg?: unknown }).__reg = groupRegistry

const tmp = new THREE.Vector3()
const noRaycast = () => null

/* --------------------------------- materials ------------------------------ */

interface MatProps {
  color: string
  e?: number
  metal?: number
  rough?: number
  opacity?: number
  depthWrite?: boolean
  side?: THREE.Side
}

export function Mat({
  color,
  e = 0.12,
  metal = 0.7,
  rough = 0.38,
  opacity = 1,
  depthWrite = true,
  side,
}: MatProps) {
  const base = useMemo(() => new THREE.Color(color).multiplyScalar(0.3), [color])
  return (
    <meshStandardMaterial
      color={base}
      emissive={color}
      emissiveIntensity={e}
      metalness={metal}
      roughness={rough}
      transparent
      opacity={opacity}
      depthWrite={depthWrite}
      side={side}
    />
  )
}

/** translucent hologram material for context housings; fades further in x-ray */
export function GhostMat({
  opacity = 0.12,
  color = '#0a2733',
}: {
  opacity?: number
  color?: string
}) {
  const { xray } = useGodEye()
  return (
    <meshPhysicalMaterial
      color={color}
      emissive="#00f0ff"
      emissiveIntensity={0.05}
      metalness={0.1}
      roughness={0.3}
      transparent
      opacity={xray ? 0.04 : opacity}
      depthWrite={false}
      side={THREE.DoubleSide}
    />
  )
}

/** non-interactive decor wrapper (context geometry that is not a node) */
export function Ghost({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null!)
  useEffect(() => {
    ref.current?.traverse((o) => {
      ;(o as THREE.Mesh).raycast = noRaycast
    })
  })
  return <group ref={ref}>{children}</group>
}

/* --------------------------------- part group ----------------------------- */

interface PartGroupProps {
  id: string
  children: ReactNode
  /** explode direction for the whole group */
  explode?: [number, number, number]
  /** children carry userData.explode — explode per child instead of group */
  perChild?: boolean
  /** pointer events pass through (used by outer shells) */
  passThrough?: boolean
  renderOrder?: number
}

export function PartGroup({
  id,
  children,
  explode = [0, 0, 0],
  perChild = false,
  passThrough = false,
  renderOrder,
}: PartGroupProps) {
  const ref = useRef<THREE.Group>(null!)
  const {
    selectedId,
    hoverId,
    select,
    setHover,
    setPath,
    path,
    explode: slider,
  } = useGodEye()
  // in the root teardown field (slider ≥ 0.5 at car level) the stations start
  // ASSEMBLED at 50% and explode internally toward 100%
  const k0 = path.length === 0 && slider >= 0.5 ? (slider - 0.5) * 2 : slider

  useEffect(() => {
    groupRegistry.set(id, ref.current)
    return () => {
      groupRegistry.delete(id)
    }
  }, [id])

  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    const k = 1 - Math.exp(-6 * Math.min(dt, 0.1))

    if (perChild) {
      // rest positions are cached on the PartGroup's own group, keyed by
      // child uuid — NOT on child.userData: components re-render with inline
      // userData={{explode}} literals, r3f re-applies the prop and wipes
      // anything stored there, so bases captured mid-explode froze children
      // at displaced positions after a slider round trip
      const bases = (g.userData.__bases ??= {}) as Record<string, THREE.Vector3>
      for (const c of g.children) {
        const ex = c.userData.explode as [number, number, number] | undefined
        if (!ex) continue
        const b = (bases[c.uuid] ??= c.position.clone())
        tmp.set(b.x + ex[0] * k0, b.y + ex[1] * k0, b.z + ex[2] * k0)
        c.position.lerp(tmp, k)
      }
    } else {
      tmp.set(explode[0] * k0, explode[1] * k0, explode[2] * k0)
      g.position.lerp(tmp, k)
    }

    const isSel = selectedId === id
    const isHov = hoverId === id
    const dimmed = selectedId !== null && !isSel

    g.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.raycast = passThrough ? noRaycast : THREE.Mesh.prototype.raycast
      const m = mesh.material as THREE.MeshStandardMaterial
      if (!m || !('emissiveIntensity' in m)) return
      if (m.userData.baseO === undefined) {
        m.userData.baseO = m.opacity
        m.userData.baseE = m.emissiveIntensity
      }
      let oT = m.userData.baseO as number
      let eT = m.userData.baseE as number
      if (dimmed) {
        oT = Math.min(oT * 0.15, 0.09)
        eT *= 0.15
      } else if (isSel) {
        eT = Math.max(eT, 0.45)
      } else if (isHov) {
        eT = Math.max(eT, 0.28)
      }
      m.opacity += (oT - m.opacity) * k
      m.emissiveIntensity += (eT - m.emissiveIntensity) * k
    })
  })

  return (
    <group
      ref={ref}
      onClick={(ev) => {
        if (passThrough) return
        if (ev.delta > 5) return // it was an orbit drag, not a click
        ev.stopPropagation()
        select(id)
      }}
      onDoubleClick={(ev) => {
        if (passThrough) return
        if (ev.delta > 5) return
        ev.stopPropagation()
        if (hasChildren(id)) setPath(pathOf(id))
      }}
      onPointerOver={(ev) => {
        if (passThrough) return
        ev.stopPropagation()
        setHover(id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        if (passThrough) return
        setHover(null)
        document.body.style.cursor = 'default'
      }}
      renderOrder={renderOrder}
    >
      {children}
    </group>
  )
}

/* ---------------------------------- helpers ------------------------------- */

export function Pipe({
  from,
  to,
  r = 0.04,
  color,
  e,
}: {
  from: [number, number, number]
  to: [number, number, number]
  r?: number
  color: string
  e?: number
}) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const d = b.clone().sub(a)
    const len = d.length()
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      d.normalize(),
    )
    const pos = a.add(b).multiplyScalar(0.5)
    return { pos, quat, len }
  }, [from, to])
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 12]} />
      <Mat color={color} e={e} />
    </mesh>
  )
}

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private r: number,
    private h: number,
    private turns: number,
  ) {
    super()
  }
  getPoint(t: number) {
    const a = this.turns * Math.PI * 2 * t
    return new THREE.Vector3(Math.cos(a) * this.r, t * this.h, Math.sin(a) * this.r)
  }
}

export function useSpringGeo(r = 0.08, h = 0.3, turns = 6, tube = 0.012) {
  return useMemo(
    () => new THREE.TubeGeometry(new HelixCurve(r, h, turns), 48 * turns > 240 ? 240 : 48 * turns, tube, 6),
    [r, h, turns, tube],
  )
}
