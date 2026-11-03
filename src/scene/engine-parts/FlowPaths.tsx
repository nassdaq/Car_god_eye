/**
 * FlowPaths.tsx — educational coolant / oil flow traces + water pump solids.
 *
 * The classic textbook diagram, drawn in 3D over the real parts:
 *   WaterPumpReal()   — chain-driven water pump, thermostat housing, hose stubs
 *   CoolantPathReal() — glowing cyan coolant route with direction arrows
 *   OilPathReal()     — glowing amber oil route with direction arrows
 *
 * Absolute engine-stage coordinates (crank axis along X at y 0.32, FRONT = -X).
 * Block is solid → block-section traces ride its skin (z ±0.335 / x −0.545)
 * like a projected schematic; the head is translucent → head traces run inside.
 * Plain <group>s: no PartGroup, pointer events, useFrame, textures or async.
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PMat, Lathe, Tube, Gear, Bolt } from '../realism'

type V3 = [number, number, number]

const COOL = '#36e6ff'
const OIL = '#ffb347'

/* ------------------------------ glow helpers ----------------------------- */

/** shared emissive trace material (contract: every surface is a PMat) */
function GlowMat({ color }: { color: string }) {
  return <PMat color={color} e={0.9} metal={0} rough={0.4} opacity={0.85} depthWrite={false} />
}

interface ArrowXf {
  pos: V3
  quat: THREE.Quaternion
}

/**
 * One glowing tube along `pts` + direction cones every ~`spacing` of arc
 * length. Cones are oriented with +Y along the local curve tangent via
 * Quaternion.setFromUnitVectors (same trick as lib's Pipe).
 */
function FlowTrace({
  pts,
  color,
  r,
  seg,
  spacing = 0.2,
  arrows = true,
}: {
  pts: V3[]
  color: string
  r: number
  seg: number
  spacing?: number
  arrows?: boolean
}) {
  const cones = useMemo<ArrowXf[]>(() => {
    if (!arrows) return []
    const curve = new THREE.CatmullRomCurve3(
      pts.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    )
    const n = Math.max(1, Math.round(curve.getLength() / spacing))
    const up = new THREE.Vector3(0, 1, 0)
    const out: ArrowXf[] = []
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      const p = curve.getPointAt(t)
      const d = curve.getTangentAt(t).normalize()
      out.push({ pos: [p.x, p.y, p.z], quat: new THREE.Quaternion().setFromUnitVectors(up, d) })
    }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <group>
      <Tube path={pts} r={r} seg={seg} radial={10}>
        <GlowMat color={color} />
      </Tube>
      {cones.map((a, i) => (
        <mesh key={i} position={a.pos} quaternion={a.quat}>
          <coneGeometry args={[0.02, 0.045, 8]} />
          <GlowMat color={color} />
        </mesh>
      ))}
    </group>
  )
}

/** Torus whose natural +Z normal is rotated onto `dir` (glow rings, clamps). */
function Ring({
  pos,
  dir,
  r,
  tube,
  children,
}: {
  pos: V3
  dir: V3
  r: number
  tube: number
  children?: ReactNode
}) {
  const quat = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(...dir).normalize(),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  return (
    <mesh position={pos} quaternion={quat}>
      <torusGeometry args={[r, tube, 8, 24]} />
      {children}
    </mesh>
  )
}

/* ============================== WATER PUMP =============================== */

export function WaterPumpReal() {
  return (
    <group>
      {/* ------- pump housing: cast cup on the block front face, axis X ------- */}
      {/* back plate flush at x −0.52, open front ring at x −0.558 (inner r 0.052)
          so the impeller shows; the drive sprocket rides the shaft right at the
          chain plane (x ≈ −0.56) where the tensioner-side run grazes its teeth */}
      <Lathe
        pts={[
          [0.001, 0],
          [0.076, 0],
          [0.08, 0.008],
          [0.08, 0.032],
          [0.07, 0.038],
          [0.052, 0.038],
        ]}
        seg={36}
        position={[-0.52, 0.52, 0.17]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <PMat m="castAlu" side={THREE.DoubleSide} />
      </Lathe>

      {/* impeller hint: 6-blade gear just inside the open front ring */}
      <Gear
        teeth={6}
        rRoot={0.022}
        rTip={0.048}
        h={0.016}
        hole={0.01}
        position={[-0.538, 0.52, 0.17]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="polSteel" />
      </Gear>

      {/* pump shaft poking forward through the ring to the chain plane */}
      <mesh position={[-0.545, 0.52, 0.17]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.013, 0.013, 0.05, 14]} />
        <PMat m="steel" />
      </mesh>

      {/* drive sprocket at x −0.555 — reads chain-driven off the timing chain */}
      <Gear
        teeth={15}
        rRoot={0.04}
        rTip={0.05}
        h={0.018}
        hole={0.013}
        position={[-0.555, 0.52, 0.17]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <PMat m="polSteel" />
      </Gear>

      {/* 4 small housing bolts, heads facing front (−X) */}
      {[45, 135, 225, 315].map((deg) => {
        const a = (deg / 180) * Math.PI
        return (
          <Bolt
            key={deg}
            position={[-0.556, 0.52 + Math.cos(a) * 0.068, 0.17 + Math.sin(a) * 0.068]}
            rotation={[0, 0, Math.PI / 2]}
            r={0.006}
            len={0.028}
          />
        )
      })}

      {/* ------- LOWER hose stub: pump inlet curving forward/down, open end ------- */}
      <Tube
        path={[
          [-0.545, 0.47, 0.185],
          [-0.61, 0.435, 0.195],
          [-0.68, 0.42, 0.2],
        ]}
        r={0.028}
        seg={20}
        radial={10}
      >
        <PMat m="rubber" />
      </Tube>
      <Ring pos={[-0.578, 0.449, 0.191]} dir={[-0.065, -0.028, 0.008]} r={0.031} tube={0.004}>
        <PMat m="steel" />
      </Ring>
      <Ring pos={[-0.658, 0.424, 0.199]} dir={[-0.07, -0.012, 0.005]} r={0.031} tube={0.004}>
        <PMat m="steel" />
      </Ring>
      {/* dark disc so the hose end reads open */}
      <mesh position={[-0.6815, 0.4198, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.024, 20]} />
        <PMat color="#101216" e={0.01} metal={0.1} rough={0.9} />
      </mesh>

      {/* ------- thermostat housing: cast dome on the head front face ------- */}
      <mesh position={[-0.526, 1.14, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.068, 0.068, 0.012, 28]} />
        <PMat m="castAlu" />
      </mesh>
      <Lathe
        pts={[
          [0.001, 0],
          [0.046, 0],
          [0.05, 0.01],
          [0.05, 0.03],
          [0.034, 0.048],
          [0.001, 0.058],
        ]}
        seg={32}
        position={[-0.52, 1.14, 0.08]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <PMat m="castAlu" />
      </Lathe>
      <Bolt position={[-0.524, 1.14, 0.142]} rotation={[0, 0, Math.PI / 2]} r={0.006} len={0.025} />
      <Bolt position={[-0.524, 1.14, 0.018]} rotation={[0, 0, Math.PI / 2]} r={0.006} len={0.025} />

      {/* wax-pellet capsule hint inside the dome: brass cylinder + 3 spring tori */}
      <mesh position={[-0.548, 1.14, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.028, 12]} />
        <PMat m="brass" />
      </mesh>
      {[-0.531, -0.537, -0.543].map((x) => (
        <mesh key={x} position={[x, 1.14, 0.08]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.015, 0.0025, 6, 16]} />
          <PMat m="brass" />
        </mesh>
      ))}

      {/* ------- UPPER hose stub from the thermostat, open end + clamp ------- */}
      <Tube
        path={[
          [-0.572, 1.155, 0.085],
          [-0.628, 1.19, 0.093],
          [-0.68, 1.22, 0.1],
        ]}
        r={0.028}
        seg={20}
        radial={10}
      >
        <PMat m="rubber" />
      </Tube>
      <Ring pos={[-0.656, 1.212, 0.097]} dir={[-0.055, 0.032, 0.007]} r={0.031} tube={0.004}>
        <PMat m="steel" />
      </Ring>
      <mesh position={[-0.6815, 1.2208, 0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.024, 20]} />
        <PMat color="#101216" e={0.01} metal={0.1} rough={0.9} />
      </mesh>
    </group>
  )
}

/* ============================= COOLANT PATH ============================== */

/** deck-riser stations (shared by risers + their glow rings) */
const COOL_RISER_XS = [-0.25, 0, 0.25] as const

export function CoolantPathReal() {
  const P = useMemo(() => {
    /** 1+2 — lower hose end → into the pump → into the block front face */
    const entry: V3[] = [
      [-0.66, 0.42, 0.2],
      [-0.6, 0.455, 0.19],
      [-0.53, 0.52, 0.17],
      [-0.52, 0.555, 0.15],
    ]
    /** 3 — block jacket, surface-projected on the skin (z ±0.335), weaving
     * rear-ward between stations; −Z branch first wraps the front face at
     * x −0.545. */
    const branch = (s: 1 | -1): V3[] => {
      const lead: V3[] =
        s === 1
          ? [
              [-0.52, 0.555, 0.15],
              [-0.51, 0.6, 0.26],
            ]
          : [
              [-0.52, 0.555, 0.15],
              [-0.545, 0.58, 0.02],
              [-0.545, 0.61, -0.2],
            ]
      return [
        ...lead,
        [-0.5, 0.62, s * 0.335],
        [-0.375, 0.58, s * 0.335],
        [-0.125, 0.7, s * 0.335],
        [0.125, 0.58, s * 0.335],
        [0.375, 0.7, s * 0.335],
        [0.45, 0.65, s * 0.335],
      ]
    }
    /** 4 — deck risers: skin z ±0.335 angling inward to ±0.2 while rising
     * through the deck line y 0.94 (−Z side tucks inside z −0.3 before the
     * exhaust manifold height). */
    const riser = (x: number, s: 1 | -1): V3[] => [
      [x, 0.64, s * 0.335],
      [x, 0.8, s * 0.28],
      [x, 1.0, s * 0.2],
    ]
    /** 5 — head jacket inside the translucent head, rear → front, both sides
     * converging at the thermostat. */
    const head = (s: 1 | -1): V3[] => [
      [0.42, 1.03, s * 0.18],
      [0.3, 1.06, s * 0.15],
      [-0.2, 1.06, s * 0.15],
      [-0.45, 1.06, s * 0.15],
      [-0.5, 1.14, 0.08],
    ]
    /** 6 — thermostat → upper hose stub */
    const exit: V3[] = [
      [-0.5, 1.14, 0.08],
      [-0.555, 1.17, 0.09],
      [-0.6, 1.2, 0.1],
    ]
    const risers: V3[][] = []
    const rings: { pos: V3; dir: V3 }[] = []
    for (const s of [1, -1] as const) {
      for (const x of COOL_RISER_XS) {
        risers.push(riser(x, s))
        // riser crosses y 0.94 at z ≈ s·0.224, local direction (0, 0.2, −0.08s)
        rings.push({ pos: [x, 0.94, s * 0.224], dir: [0, 0.2, s * -0.08] })
      }
    }
    return { entry, branches: [branch(1), branch(-1)], risers, rings, heads: [head(1), head(-1)], exit }
  }, [])

  return (
    <group>
      <FlowTrace pts={P.entry} color={COOL} r={0.016} seg={16} />
      {P.branches.map((b, i) => (
        <FlowTrace key={`b${i}`} pts={b} color={COOL} r={0.016} seg={40} />
      ))}
      {P.risers.map((rp, i) => (
        <FlowTrace key={`r${i}`} pts={rp} color={COOL} r={0.016} seg={12} />
      ))}
      {/* glowing rings mark the deck crossings — "water climbs into the head" */}
      {P.rings.map((g, i) => (
        <Ring key={`g${i}`} pos={g.pos} dir={g.dir} r={0.03} tube={0.005}>
          <GlowMat color={COOL} />
        </Ring>
      ))}
      {P.heads.map((h, i) => (
        <FlowTrace key={`h${i}`} pts={h} color={COOL} r={0.016} seg={32} />
      ))}
      <FlowTrace pts={P.exit} color={COOL} r={0.016} seg={10} />
    </group>
  )
}

/* =============================== OIL PATH ================================ */

/** main-bearing feed stations along the gallery span */
const FEED_XS = [-0.45, -0.2, 0, 0.25, 0.45] as const
/** cam spray-bar drip stations (bore centers) */
const DRIP_XS = [-0.375, -0.125, 0.125, 0.375] as const
/** drain-back dash centers (top → bottom) */
const DASH_YS = [1.05, 0.9, 0.75, 0.6, 0.45] as const

export function OilPathReal() {
  const P = useMemo(() => {
    /** 1 — pickup: strainer → pump, +0.02 y beside the solid pickup tube */
    const pickup: V3[] = [
      [-0.12, 0.11, 0.14],
      [-0.28, 0.12, 0.155],
      [-0.4, 0.16, 0.17],
      [-0.42, 0.26, 0.19],
    ]
    /** 2 — pump → up the front +Z corner → half-loop over the filter */
    const toFilter: V3[] = [
      [-0.42, 0.27, 0.2],
      [-0.47, 0.36, 0.27],
      [-0.4, 0.43, 0.34],
      [-0.31, 0.45, 0.35],
      [-0.285, 0.483, 0.36],
      [-0.25, 0.5, 0.365],
      [-0.215, 0.483, 0.36],
      [-0.2, 0.45, 0.35],
    ]
    /** 3 — main gallery, surface-projected on the +Z skin */
    const gallery: V3[] = [
      [-0.2, 0.45, 0.345],
      [0.1, 0.45, 0.345],
      [0.45, 0.45, 0.345],
    ]
    /** forward stub feeding the front (−0.45) main */
    const stub: V3[] = [
      [-0.2, 0.45, 0.345],
      [-0.33, 0.45, 0.345],
      [-0.45, 0.45, 0.345],
    ]
    /** 4 — main-bearing feeds dropping inward into the open crankcase */
    const feeds: V3[][] = FEED_XS.map((x) => [
      [x, 0.45, 0.33],
      [x, 0.4, 0.22],
      [x, 0.33, 0.05],
    ])
    /** 5 — head riser up the block rear corner, through the deck, into the head */
    const riser: V3[] = [
      [0.42, 0.45, 0.345],
      [0.47, 0.7, 0.3],
      [0.46, 0.94, 0.2],
      [0.44, 1.1, 0.08],
      [0.42, 1.23, 0],
    ]
    /** 6 — cam spray bar along the head centerline */
    const spray: V3[] = [
      [0.42, 1.23, 0],
      [0, 1.23, 0],
      [-0.45, 1.23, 0],
    ]
    return { pickup, toFilter, gallery, stub, feeds, riser, spray }
  }, [])

  return (
    <group>
      <FlowTrace pts={P.pickup} color={OIL} r={0.013} seg={20} />
      <FlowTrace pts={P.toFilter} color={OIL} r={0.013} seg={36} />
      <FlowTrace pts={P.gallery} color={OIL} r={0.013} seg={16} />
      <FlowTrace pts={P.stub} color={OIL} r={0.013} seg={8} />
      {P.feeds.map((f, i) => (
        <FlowTrace key={`f${i}`} pts={f} color={OIL} r={0.013} seg={10} />
      ))}
      {/* glowing dot where each feed meets its main bearing */}
      {FEED_XS.map((x) => (
        <mesh key={`d${x}`} position={[x, 0.33, 0.05]}>
          <sphereGeometry args={[0.014, 8, 6]} />
          <GlowMat color={OIL} />
        </mesh>
      ))}
      <FlowTrace pts={P.riser} color={OIL} r={0.013} seg={28} />
      {/* glow ring where the riser pierces the deck */}
      <Ring pos={[0.46, 0.94, 0.2]} dir={[-0.01, 0.24, -0.1]} r={0.03} tube={0.005}>
        <GlowMat color={OIL} />
      </Ring>
      <FlowTrace pts={P.spray} color={OIL} r={0.013} seg={16} />
      {/* spray-bar drip cones, apex down over each cam station */}
      {DRIP_XS.map((x) => (
        <mesh key={`sp${x}`} position={[x, 1.205, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.012, 0.03, 8]} />
          <GlowMat color={OIL} />
        </mesh>
      ))}
      {/* 7 — dashed drain-back falling down the rear face (gaps = falling oil) */}
      {DASH_YS.map((y) => (
        <group key={`dd${y}`}>
          <mesh position={[0.545, y, -0.1]}>
            <cylinderGeometry args={[0.013, 0.013, 0.09, 10]} />
            <GlowMat color={OIL} />
          </mesh>
          <mesh position={[0.545, y - 0.07, -0.1]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.02, 0.045, 8]} />
            <GlowMat color={OIL} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
