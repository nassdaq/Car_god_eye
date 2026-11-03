/**
 * Block.tsx — photoreal cylinder block + main caps (BlockReal) and oil pan
 * (PanReal) for the inline-4 teardown.
 *
 * Stage coordinates (shared by all engine parts):
 *   crank axis along X at y=0.32 z=0 · FRONT = -X, REAR = +X
 *   bores at x = -0.375 / -0.125 / +0.125 / +0.375, r = 0.105
 *   deck face y = 0.94 · block x ±0.52, z ±0.31 · pan zone y 0.02…0.20
 *
 * Every surface uses <PMat/> (selection system animates emissive/opacity).
 */
import { useMemo, type ReactNode } from 'react'
import * as THREE from 'three'
import { PMat, RBox, Bolt, Ribs } from '../realism'

/** bore centers along the crank axis */
const BORE_X = [-0.375, -0.125, 0.125, 0.375]
const BORE_R = 0.105

/* ------------------------------ bored slabs ------------------------------ */

function roundedRectShape(w: number, d: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const x = w / 2
  const y = d / 2
  s.moveTo(-x + r, -y)
  s.lineTo(x - r, -y)
  s.quadraticCurveTo(x, -y, x, -y + r)
  s.lineTo(x, y - r)
  s.quadraticCurveTo(x, y, x - r, y)
  s.lineTo(-x + r, y)
  s.quadraticCurveTo(-x, y, -x, y - r)
  s.lineTo(-x, -y + r)
  s.quadraticCurveTo(-x, -y, -x + r, -y)
  s.closePath()
  return s
}

/**
 * Chamfered rounded-rectangle slab with the 4 bore holes punched through.
 * Base sits on local y=0, slab extends up to y=h, centered in x/z.
 */
function BoredSlab({
  w,
  d,
  h,
  holeR = 0,
  corner = 0.015,
  bevel = 0.004,
  seg = 28,
  position,
  children,
}: {
  w: number
  d: number
  h: number
  holeR?: number
  corner?: number
  bevel?: number
  seg?: number
  position?: [number, number, number]
  children?: ReactNode
}) {
  const geo = useMemo(() => {
    const sh = roundedRectShape(w - bevel * 2, d - bevel * 2, corner)
    if (holeR > 0) {
      for (const bx of BORE_X) {
        const p = new THREE.Path()
        p.absarc(bx, 0, holeR, 0, Math.PI * 2, true)
        sh.holes.push(p)
      }
    }
    const g = new THREE.ExtrudeGeometry(sh, {
      depth: h - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 1,
      curveSegments: seg,
    })
    g.rotateX(-Math.PI / 2) // extrusion +Z → world +Y
    g.translate(0, bevel, 0) // base exactly at local y=0
    g.computeVertexNormals()
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <mesh geometry={geo} position={position}>
      {children}
    </mesh>
  )
}

/* ================================ BLOCK ================================= */

export function BlockReal() {
  return (
    <group>
      {/* ------- machined deck plate (top face y 0.92→0.94, bores open) ------- */}
      <BoredSlab w={1.04} d={0.6} h={0.02} holeR={0.107} corner={0.012} bevel={0.003} position={[0, 0.92, 0]}>
        <PMat m="machAlu" />
      </BoredSlab>

      {/* ------- upper block casting (y 0.58→0.92, bores punched through) ------- */}
      <BoredSlab w={1.0} d={0.56} h={0.34} holeR={0.108} corner={0.022} bevel={0.008} position={[0, 0.58, 0]}>
        <PMat m="castAlu" />
      </BoredSlab>

      {/* ------- mid band — casting step / parting line (y 0.415→0.585) ------- */}
      <RBox args={[1.03, 0.17, 0.59]} radius={0.012} smoothness={2} position={[0, 0.5, 0]}>
        <PMat m="castAlu" />
      </RBox>

      {/* ------- crankcase skirt: flared open walls (y 0.25→0.44) ------- */}
      {[1, -1].map((s) => (
        <RBox key={`wall${s}`} args={[1.04, 0.19, 0.05]} radius={0.012} smoothness={2} position={[0, 0.345, s * 0.285]}>
          <PMat m="castAlu" />
        </RBox>
      ))}
      {[1, -1].map((s) => (
        <RBox key={`end${s}`} args={[0.05, 0.19, 0.62]} radius={0.012} smoothness={2} position={[s * 0.495, 0.345, 0]}>
          <PMat m="castAlu" />
        </RBox>
      ))}

      {/* ------- machined pan-rail frame (y 0.235→0.259, crankcase stays open) ------- */}
      {[1, -1].map((s) => (
        <RBox key={`rail${s}`} args={[1.045, 0.024, 0.055]} radius={0.008} smoothness={2} position={[0, 0.247, s * 0.2875]}>
          <PMat m="machAlu" />
        </RBox>
      ))}
      {[1, -1].map((s) => (
        <RBox key={`raile${s}`} args={[0.055, 0.024, 0.63]} radius={0.008} smoothness={2} position={[s * 0.4925, 0.247, 0]}>
          <PMat m="machAlu" />
        </RBox>
      ))}

      {/* ------- cast-iron liners, open-ended, lip 0.01 proud of deck ------- */}
      {BORE_X.map((x) => (
        <group key={`liner${x}`}>
          <mesh position={[x, 0.755, 0]}>
            <cylinderGeometry args={[BORE_R, BORE_R, 0.39, 32, 1, true]} />
            <PMat m="iron" side={THREE.DoubleSide} />
          </mesh>
          {/* liner lip rim at y 0.95 */}
          <mesh position={[x, 0.949, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[BORE_R, 0.0045, 8, 32]} />
            <PMat m="iron" />
          </mesh>
          {/* dark floor so the bore reads hollow and deep */}
          <mesh position={[x, 0.565, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.104, 28]} />
            <PMat m="iron" color="#15171a" e={0} rough={0.9} />
          </mesh>
        </group>
      ))}

      {/* ------- coolant passage dots on the deck ------- */}
      {(
        [
          [-0.25, 0.175],
          [-0.25, -0.175],
          [0, 0.175],
          [0, -0.175],
          [0.25, 0.175],
          [0.25, -0.175],
          [0.47, 0],
          [-0.47, 0],
        ] as [number, number][]
      ).map(([x, z], i) => (
        <mesh key={`cool${i}`} position={[x, 0.9405, z]}>
          <cylinderGeometry args={[0.012, 0.012, 0.005, 12]} />
          <PMat m="iron" color="#191c21" e={0} rough={0.85} />
        </mesh>
      ))}

      {/* ------- casting ribs low on each skirt wall ------- */}
      <Ribs n={8} pitch={0.115} w={0.01} h={0.022} depth={0.13} position={[0, 0.345, 0.312]} rotation={[Math.PI / 2, 0, 0]} />
      <Ribs n={8} pitch={0.115} w={0.01} h={0.022} depth={0.13} position={[0, 0.345, -0.312]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* ------- knock-sensor boss (+Z side) ------- */}
      <mesh position={[0.09, 0.5, 0.306]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.03, 20]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[0.09, 0.5, 0.33]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 6]} />
        <PMat m="brass" />
      </mesh>

      {/* ------- engine-mount bosses, two rounded pads per side ------- */}
      {([1, -1] as const).map((s) =>
        ([-0.26, 0.26] as const).map((x) => (
          <RBox key={`mnt${s}${x}`} args={[0.14, 0.11, 0.04]} radius={0.012} smoothness={2} position={[x, 0.5, s * 0.3]}>
            <PMat m="castAlu" />
          </RBox>
        )),
      )}

      {/* ------- freeze / core plugs: 3 per side, recessed at y≈0.63 ------- */}
      {([1, -1] as const).map((s) =>
        ([-0.3, 0, 0.3] as const).map((x) => (
          <group key={`plug${s}${x}`}>
            {/* dark recess ring, face slightly proud of the wall */}
            <mesh position={[x, 0.63, s * 0.279]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.044, 0.044, 0.006, 24]} />
              <PMat m="iron" color="#2a2d33" e={0} />
            </mesh>
            {/* steel plug sitting 2mm behind the ring face */}
            <mesh position={[x, 0.63, s * 0.276]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, 0.008, 24]} />
              <PMat m="polSteel" />
            </mesh>
          </group>
        )),
      )}

      {/* ------- FRONT (-X): machined timing-cover boss ring + crank nose ------- */}
      <mesh position={[-0.512, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.27, 0.27, 0.024, 40]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[-0.527, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.215, 0.009, 8, 40]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[-0.533, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.062, 0.062, 0.022, 28]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[-0.545, 0.32, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.04, 0.006, 8, 24]} />
        <PMat m="rubber" />
      </mesh>

      {/* ------- REAR (+X): round main-seal boss on the crank axis ------- */}
      <mesh position={[0.526, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.028, 32]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[0.541, 0.32, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.06, 0.007, 8, 28]} />
        <PMat m="rubber" />
      </mesh>

      {/* ------- 5 main bearing caps + 2 bolts each (heads down) ------- */}
      {[-0.5, -0.25, 0, 0.25, 0.5].map((x) => (
        <group key={`cap${x}`}>
          <RBox args={[0.1, 0.12, 0.22]} radius={0.012} smoothness={2} position={[x, 0.265, 0]}>
            <PMat m="forged" />
          </RBox>
          <Bolt position={[x, 0.215, 0.072]} rotation={[Math.PI, 0, 0]} r={0.011} len={0.075} />
          <Bolt position={[x, 0.215, -0.072]} rotation={[Math.PI, 0, 0]} r={0.011} len={0.075} />
        </group>
      ))}
    </group>
  )
}

/* ================================= PAN ================================== */

export function PanReal() {
  /** flange-bolt layout: 6 per long side + one per end = 14 */
  const boltXs = [-0.42, -0.252, -0.084, 0.084, 0.252, 0.42]
  return (
    <group>
      {/* ------- gasket flange plate ------- */}
      <RBox args={[0.98, 0.015, 0.62]} radius={0.005} smoothness={2} position={[0, 0.195, 0]}>
        <PMat m="blackCast" />
      </RBox>

      {/* ------- shallow front section ------- */}
      <RBox args={[0.47, 0.095, 0.55]} radius={0.02} smoothness={2} position={[-0.235, 0.145, 0]}>
        <PMat m="blackCast" />
      </RBox>

      {/* ------- deeper rear sump, stepped inward taper ------- */}
      <RBox args={[0.47, 0.105, 0.55]} radius={0.02} smoothness={2} position={[0.235, 0.14, 0]}>
        <PMat m="blackCast" />
      </RBox>
      <RBox args={[0.4, 0.09, 0.48]} radius={0.02} smoothness={2} position={[0.25, 0.065, 0]}>
        <PMat m="blackCast" />
      </RBox>

      {/* ------- 14 flange bolts, heads up ------- */}
      {boltXs.map((x) =>
        ([1, -1] as const).map((s) => (
          <Bolt key={`pb${x}${s}`} position={[x, 0.2025, s * 0.29]} r={0.008} len={0.03} />
        )),
      )}
      <Bolt position={[0.46, 0.2025, 0]} r={0.008} len={0.03} />
      <Bolt position={[-0.46, 0.2025, 0]} r={0.008} len={0.03} />

      {/* ------- hex drain plug at the sump's lowest face ------- */}
      <mesh position={[0.33, 0.0195, 0.1]}>
        <cylinderGeometry args={[0.025, 0.025, 0.005, 20]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      <mesh position={[0.33, 0.01, 0.1]}>
        <cylinderGeometry args={[0.017, 0.017, 0.014, 6]} />
        <PMat m="zincGold" />
      </mesh>
    </group>
  )
}
