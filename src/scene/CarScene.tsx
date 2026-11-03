import { useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Grid, Lightformer, OrbitControls } from '@react-three/drei'
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { useGodEye, godEye } from '../state'
import { SCENE_THEMES } from '../theme'
import { groupRegistry } from './lib'
import { viewFor } from './views'

interface ControlsLike {
  target: THREE.Vector3
  update: () => void
  autoRotate: boolean
  autoRotateSpeed: number
}

type Want = { kind: 'node'; id: string } | { kind: 'home'; view: string } | null

const box = new THREE.Box3()
const sphere = new THREE.Sphere()

const FAR_HOME = { cam: [9.5, 4.8, 9.5] as const, tgt: [0, 0.6, 0] as const }

function CameraRig() {
  const { selectedId, path, explode } = useGodEye()
  const fieldMode = path.length === 0 && explode >= 0.5
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const want = useRef<Want>(null)
  const fly = useRef<{ pos: THREE.Vector3; tgt: THREE.Vector3 } | null>(null)
  const waited = useRef(0)

  useEffect(() => {
    const viewId = path[path.length - 1] ?? 'car'
    want.current = selectedId
      ? { kind: 'node', id: selectedId }
      : { kind: 'home', view: viewId }
    waited.current = 0
  }, [selectedId, path, fieldMode])

  useFrame((state, dt) => {
    if (!controls) return

    const w = want.current
    if (w) {
      if (w.kind === 'home') {
        const { def } = viewFor(w.view === 'car' ? [] : path)
        const home = fieldMode ? FAR_HOME : { cam: def.cam, tgt: def.tgt }
        fly.current = {
          pos: new THREE.Vector3(...home.cam),
          tgt: new THREE.Vector3(...home.tgt),
        }
        want.current = null
      } else {
        // retrack the live bounding box every frame — the part may still be
        // animating (explode lerp, level pop-in) while we fly toward it
        const g = groupRegistry.get(w.id)
        if (!g && ++waited.current > 90) {
          // node has no geometry in this view — settle at the view home
          const { def } = viewFor(path)
          fly.current = {
            pos: new THREE.Vector3(...def.cam),
            tgt: new THREE.Vector3(...def.tgt),
          }
          want.current = null
        }
        if (g) {
          box.setFromObject(g)
          if (!box.isEmpty()) {
            box.getBoundingSphere(sphere)
            const dist = THREE.MathUtils.clamp(sphere.radius * 2.7, 0.95, 7)
            const dir = state.camera.position.clone().sub(sphere.center)
            if (dir.lengthSq() < 1e-4) dir.set(1, 0.6, 1)
            dir.y = Math.max(dir.y, 0.3 * dir.length())
            dir.normalize().multiplyScalar(dist)
            fly.current = {
              pos: sphere.center.clone().add(dir),
              tgt: sphere.center.clone(),
            }
          }
        }
        // keep tracking until the camera has actually arrived
      }
    }

    controls.autoRotate = !selectedId && !fly.current && path.length === 0
    controls.autoRotateSpeed = 0.45

    const f = fly.current
    if (f) {
      const k = 1 - Math.exp(-3.4 * Math.min(dt, 0.1))
      state.camera.position.lerp(f.pos, k)
      controls.target.lerp(f.tgt, k)
      controls.update()
      if (state.camera.position.distanceTo(f.pos) < 0.03) {
        fly.current = null
        want.current = null
      }
    }
  })

  return null
}

function ScannerRing() {
  const ref = useRef<THREE.Group>(null!)
  const { theme } = useGodEye()
  const t = SCENE_THEMES[theme]
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.18
  })
  return (
    <group ref={ref} position={[0, 0.004, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.03, 128]} />
        <meshBasicMaterial
          color={t.ring}
          transparent
          opacity={t.ringOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, (i * Math.PI * 2) / 3]}>
          <ringGeometry args={[3.09, 3.15, 64, 1, 0, Math.PI / 3.2]} />
          <meshBasicMaterial
            color={t.ring}
            transparent
            opacity={t.ringOpacity * 1.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.98, 64]} />
        <meshBasicMaterial
          color={t.ring}
          transparent
          opacity={t.ringOpacity * 0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/** scale/opacity pop-in when switching assembly levels */
function LevelIn({ children, id }: { children: ReactNode; id: string }) {
  const ref = useRef<THREE.Group>(null!)
  const t = useRef(0)
  useEffect(() => {
    t.current = 0
  }, [id])
  useFrame((_, dt) => {
    if (!ref.current) return
    t.current = Math.min(t.current + dt * 2.6, 1)
    const s = 0.7 + 0.3 * (1 - Math.pow(1 - t.current, 3))
    ref.current.scale.setScalar(s)
  })
  return <group ref={ref}>{children}</group>
}

function AssemblyHost() {
  const { path, explode } = useGodEye()
  const { id, def } = viewFor(path)
  const View = def.Comp
  // separate key for the teardown field so entering it gets the pop-in
  const key = id === 'car' && explode >= 0.5 ? 'car-field' : id
  return (
    <LevelIn key={key} id={key}>
      <View />
    </LevelIn>
  )
}

export function Viewport() {
  const { theme } = useGodEye()
  const t = SCENE_THEMES[theme]
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [4.6, 2.4, 4.6], fov: 40, near: 0.1, far: 60 }}
      onPointerMissed={() => godEye.select(null)}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[t.bg]} />
      <fog attach="fog" args={[t.bg, t.fogNear, t.fogFar]} />

      <ambientLight intensity={t.ambient} color={t.ambientColor} />
      <directionalLight position={[4, 7, 3]} intensity={t.key} color={t.keyColor} />
      <directionalLight position={[-5, 3, -4]} intensity={t.rim} color={t.rimColor} />
      <pointLight position={[0, 0.2, 0]} intensity={t.point} distance={6} color={t.pointColor} />

      {/* studio reflections — what makes machined metal read as metal */}
      <Environment resolution={256}>
        <color attach="background" args={['#06090f']} />
        <Lightformer
          intensity={4}
          position={[0, 5, 0]}
          rotation-x={Math.PI / 2}
          scale={[9, 9, 1]}
          color="#e8f4ff"
        />
        <Lightformer
          intensity={2}
          position={[-5, 2, 3]}
          rotation-y={Math.PI / 3}
          scale={[5, 2.2, 1]}
          color="#aee9ff"
        />
        <Lightformer
          intensity={1.6}
          position={[5, 1.8, -3]}
          rotation-y={-Math.PI / 2.6}
          scale={[5, 1.6, 1]}
          color="#ffc7dc"
        />
        <Lightformer
          form="ring"
          intensity={1.4}
          position={[0, 1.2, 6]}
          scale={[3.5, 3.5, 1]}
          color="#ffffff"
        />
      </Environment>

      <AssemblyHost />
      <ScannerRing />

      <Grid
        position={[0, -0.002, 0]}
        infiniteGrid
        cellSize={0.5}
        sectionSize={2.5}
        cellThickness={0.6}
        sectionThickness={1}
        cellColor={t.gridCell}
        sectionColor={t.gridSection}
        fadeDistance={32}
        fadeStrength={1.6}
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={0.5}
        maxDistance={24}
        maxPolarAngle={1.45}
        enablePan={false}
      />
      <CameraRig />

      {t.fx ? (
        <EffectComposer key="fx-holo">
          <Bloom
            intensity={t.bloomIntensity}
            luminanceThreshold={t.bloomThreshold}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.7}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0007, 0.0004)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.045} />
          <Vignette eskil={false} offset={0.22} darkness={t.vignette} />
        </EffectComposer>
      ) : t.vignette > 0 ? (
        <EffectComposer key="fx-dark">
          <Bloom
            intensity={t.bloomIntensity}
            luminanceThreshold={t.bloomThreshold}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.6}
          />
          <Vignette eskil={false} offset={0.18} darkness={t.vignette} />
        </EffectComposer>
      ) : (
        <EffectComposer key="fx-light">
          <Bloom
            intensity={t.bloomIntensity}
            luminanceThreshold={t.bloomThreshold}
            luminanceSmoothing={0.25}
            mipmapBlur
            radius={0.6}
          />
        </EffectComposer>
      )}
    </Canvas>
  )
}
