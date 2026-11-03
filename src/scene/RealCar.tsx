/**
 * RealCar — artist-made body shell over the procedural teardown brain.
 *
 * Model: "Ferrari 458 Italia" glTF from the three.js examples
 * (model credit: vicent091036) — the same asset three.js uses for its
 * car-paint configurator demo. Node names there: body, glass, trim,
 * rim_fl/fr/rl/rr inside wheel_fl/fr/rl/rr.
 *
 * The glb is dissected into OUR interactive PartGroups:
 *   body + trim + glass  → PartGroup "bodyshell"  (paint swap + ghosting)
 *   the four wheels      → PartGroup "wheels"     (per-wheel explode)
 * so selection, x-ray, dismantle and the teardown field keep working.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useGodEye } from '../state'
import { Ghost, PartGroup } from './lib'

useGLTF.preload('/ferrari.glb', true)

const HOLO_BODY = new THREE.Color('#071c26')
const HOLO_E = new THREE.Color('#00f0ff')
const GLASS_DARK = new THREE.Color('#0a0d12')

/** fit: glb is Y-up, length along Z; swing nose onto +x, drop to ground */
const FIT_ROT: [number, number, number] = [0, -Math.PI / 2, 0]

export function RealCar() {
  const { scene } = useGLTF('/ferrari.glb', true)
  const ao = useTexture('/ferrari_ao.png')
  const { selectedId, xray, path, explode, paint } = useGodEye()
  const tint = useMemo(() => new THREE.Color(paint), [paint])

  const mats = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      metalness: 1.0,
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      transparent: true,
      emissive: 0x000000,
      emissiveIntensity: 0.02,
    })
    const details = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.5,
      transparent: true,
      emissive: 0x111111,
      emissiveIntensity: 0.02,
    })
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x111418,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.92,
      emissive: 0x2ad8e8,
      emissiveIntensity: 0.0,
    })
    return { body, details, glass }
  }, [])

  /** split the glb once: re-material the known nodes, make EVERY other
   *  material transparent-capable (clone shared mats once), keep the whole
   *  scene as the body shell and pull only the wheels out of it */
  const kit = useMemo(() => {
    const root = scene
    const grab = (n: string) => root.getObjectByName(n) ?? null
    const wheels = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']
      .map(grab)
      .filter(Boolean) as THREE.Object3D[]
    const wheelSet = new Set<THREE.Object3D>()
    for (const w of wheels) w.traverse((o) => wheelSet.add(o))

    const assign = (name: string, mat: THREE.Material) => {
      const n = grab(name)
      n?.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh) m.material = mat
      })
    }
    assign('body', mats.body)
    assign('trim', mats.details)
    assign('glass', mats.glass)
    for (const rim of ['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr']) assign(rim, mats.details)

    // every remaining material → transparent-capable clone (shared mats once)
    const cloneMap = new Map<string, THREE.Material>()
    const shellMats: THREE.Material[] = []
    const wheelMats: THREE.Material[] = []
    root.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const cur = m.material as THREE.Material
      if (cur === mats.body || cur === mats.details || cur === mats.glass) return
      let c = cloneMap.get(cur.uuid)
      if (!c) {
        c = cur.clone()
        c.transparent = true
        cloneMap.set(cur.uuid, c)
        ;(wheelSet.has(m) ? wheelMats : shellMats).push(c)
      }
      m.material = c
    })
    // STABLE userData per wheel wrapper — a fresh {explode} literal on every
    // render would make r3f replace group.userData, wiping the cached base
    // position PartGroup uses for the per-child explode lerp
    const wheelData = wheels.map((w) => ({
      explode: [Math.sign(w.position.x || 1) * 1.5, 0, 0] as [number, number, number],
    }))
    return { root, wheels, wheelData, shellMats, wheelMats }
  }, [scene, mats])

  // showroom: solid paint at root; ghost holo otherwise (same contract as
  // the old procedural shell)
  const showroom = path.length === 0 && selectedId === null && !xray && explode < 0.04
  const probed = useRef(false)
  const k0 = useRef(0)
  useFrame((_, dt) => {
    if (!probed.current && kit.wheels.length) {
      probed.current = true
      setTimeout(() => {
        const v = new THREE.Vector3()
        ;(window as unknown as { __fit?: unknown }).__fit = kit.wheels.map((w) => [
          w.name,
          w.getWorldPosition(v).toArray().map((n) => +n.toFixed(2)),
        ])
      }, 1500)
    }
    const k = 1 - Math.exp(-5 * Math.min(dt, 0.1))
    k0.current = k
    const b = mats.body
    b.userData.baseO = showroom ? 1.0 : xray ? 0.06 : 0.2
    b.userData.baseE = showroom ? 0.02 : 0.25
    b.color.lerp(showroom ? tint : HOLO_BODY, k)
    b.emissive.lerp(showroom ? tint : HOLO_E, k)
    b.metalness += ((showroom ? 0.9 : 0.3) - b.metalness) * k
    b.roughness += ((showroom ? 0.42 : 0.2) - b.roughness) * k
    b.envMapIntensity = showroom ? 0.6 : 1
    b.depthWrite = showroom
    const d = mats.details
    d.userData.baseO = showroom ? 1.0 : xray ? 0.08 : 0.35
    d.depthWrite = showroom
    for (const m of kit.shellMats) {
      m.userData.baseO = showroom ? 1.0 : xray ? 0.06 : 0.22
      ;(m as THREE.MeshStandardMaterial).depthWrite = showroom
    }
    const g = mats.glass
    g.userData.baseO = showroom ? 0.88 : xray ? 0.05 : 0.3
    g.userData.baseE = showroom ? 0 : 0.05
    g.color.lerp(showroom ? GLASS_DARK : HOLO_BODY, k)
    g.metalness = showroom ? 0.9 : 0.2
    g.envMapIntensity = showroom ? 0.45 : 1
  })

  return (
    <group rotation={FIT_ROT} position={[0.17, 0, 0]} scale={1.02}>
      <PartGroup id="bodyshell" explode={[0, 1.6, 0]} passThrough={xray || selectedId !== null} renderOrder={10}>
        <primitive object={kit.root} />
      </PartGroup>
      <PartGroup id="wheels" perChild>
        {kit.wheels.map((w, i) => (
          <group key={w.name} userData={kit.wheelData[i]}>
            <primitive object={w} />
          </group>
        ))}
      </PartGroup>
      {/* cabin + deck liners: the shell has no interior — give the big
          glass surfaces something dark to sit over instead of a void */}
      <Ghost>
        <mesh position={[0, 0.55, -0.3]}>
          <boxGeometry args={[1.45, 0.5, 1.6]} />
          <meshStandardMaterial color="#0b0d10" roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.6, 1.35]}>
          <boxGeometry args={[1.4, 0.4, 1.3]} />
          <meshStandardMaterial color="#0b0d10" roughness={0.9} metalness={0.05} />
        </mesh>
      </Ghost>
      {/* baked contact shadow from the three.js demo */}
      <Ghost>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]} renderOrder={1}>
          <planeGeometry args={[0.655 * 4, 1.3 * 4]} />
          <meshBasicMaterial
            map={ao}
            blending={THREE.MultiplyBlending}
            toneMapped={false}
            transparent
            depthWrite={false}
          />
        </mesh>
      </Ghost>
    </group>
  )
}
