/**
 * Electrical.tsx — photoreal-feeling procedural teardowns for the electrical
 * system: battery, ECU, headlight projector, LED emitter.
 *
 * Drop-in replacements for the schematic views in assemblies-rest.tsx: same
 * stage layouts, identical PartGroup ids and explode directions (hl-led and
 * led-die carry deep-zoom children, so their ids are load-bearing).
 *
 * Every visible surface uses <PMat/> (or GhostMat for decor), segments ≤ 48,
 * no textures, no useFrame; computed point arrays live in module constants or
 * useMemo.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { Ghost, GhostMat, PartGroup } from '../lib'
import { Bolt, Lathe, PMat, RBox, Ribs, Tube } from '../realism'

type P3 = [number, number, number]

/* ================================ BATTERY ================================ */

/** Five divider walls → six cells across the 0.95 case. */
const DIV_XS = [-0.3167, -0.1583, 0, 0.1583, 0.3167] as const
const CELL_XS = [-0.3958, -0.2375, -0.0792, 0.0792, 0.2375, 0.3958] as const
/** Cells with a visible plate stack behind the translucent wall. */
const SHOWN_CELLS = [0, 2, 4] as const
/** 7 plates per shown cell, alternating PbO₂ / sponge-Pb. */
const PLATE_OFFS = [-0.057, -0.038, -0.019, 0, 0.019, 0.038, 0.057] as const
/** 6 AGM separators interleaved between the plates. */
const SEP_OFFS = [-0.0475, -0.0285, -0.0095, 0.0095, 0.0285, 0.0475] as const
const CASE_RIB_XS = [-0.36, -0.24, -0.12, 0, 0.12, 0.24, 0.36] as const

/** Lead bridges hopping over each divider wall (alternating lug sides). */
const STRAP_PATHS: P3[][] = DIV_XS.map((x, i) => {
  const z = i % 2 ? 0.14 : -0.14
  return [
    [x - 0.062, 0.815, z],
    [x - 0.028, 0.872, z],
    [x + 0.028, 0.872, z],
    [x + 0.062, 0.815, z],
  ]
})

/** Ground cable leaving the clamped (negative) post toward -z. */
const CLAMP_CABLE: P3[] = [
  [0.3, 1.03, -0.225],
  [0.32, 0.98, -0.31],
  [0.36, 0.84, -0.38],
  [0.38, 0.66, -0.42],
]

export function BatteryViewReal() {
  return (
    <group>
      <PartGroup id="bat-case" explode={[0, 0.9, 0]} renderOrder={5}>
        {/* translucent polypropylene case */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.95, 0.55, 0.55]} />
          <PMat color="#28303b" metal={0.05} rough={0.45} opacity={0.26} depthWrite={false} e={0.05} />
        </mesh>
        {/* five internal cell-divider walls (6 cells), topped below the straps */}
        {DIV_XS.map((x) => (
          <mesh key={`div-${x}`} position={[x, 0.6, 0]}>
            <boxGeometry args={[0.012, 0.46, 0.53]} />
            <PMat color="#2e3742" metal={0.05} rough={0.5} opacity={0.45} depthWrite={false} e={0.05} />
          </mesh>
        ))}
        {/* molded stiffening ribs on both long faces */}
        {CASE_RIB_XS.map((x) =>
          [0.284, -0.284].map((z) => (
            <RBox
              key={`rib-${x}-${z}`}
              args={[0.02, 0.42, 0.014]}
              radius={0.004}
              smoothness={2}
              position={[x, 0.6, z]}
            >
              <PMat color="#2e3742" metal={0.05} rough={0.5} opacity={0.6} depthWrite={false} e={0.05} />
            </RBox>
          )),
        )}
        {/* hold-down ledge flange around the base */}
        {[0.278, -0.278].map((z) => (
          <RBox
            key={`ledge-${z}`}
            args={[0.99, 0.045, 0.055]}
            radius={0.008}
            smoothness={2}
            position={[0, 0.378, z]}
          >
            <PMat color="#333d49" metal={0.1} rough={0.55} e={0.05} />
          </RBox>
        ))}
        {[0.47, -0.47].map((x) => (
          <RBox
            key={`ledgex-${x}`}
            args={[0.055, 0.045, 0.6]}
            radius={0.008}
            smoothness={2}
            position={[x, 0.378, 0]}
          >
            <PMat color="#333d49" metal={0.1} rough={0.55} e={0.05} />
          </RBox>
        ))}
        {/* lid */}
        <RBox args={[0.97, 0.07, 0.57]} radius={0.012} smoothness={2} position={[0, 0.93, 0]}>
          <PMat color="#2d3640" metal={0.1} rough={0.6} opacity={0.92} e={0.05} />
        </RBox>
        {/* 2 flush vent covers with a center slot */}
        {[-0.18, 0.18].map((x) => (
          <group key={`vent-${x}`}>
            <RBox args={[0.24, 0.014, 0.15]} radius={0.004} smoothness={2} position={[x, 0.967, 0.06]}>
              <PMat color="#39434f" metal={0.15} rough={0.5} e={0.06} />
            </RBox>
            <mesh position={[x, 0.9755, 0.06]}>
              <boxGeometry args={[0.19, 0.003, 0.012]} />
              <PMat color="#1b2129" metal={0.1} rough={0.7} e={0.03} />
            </mesh>
          </group>
        ))}
        {/* molded labels ridge */}
        <RBox args={[0.34, 0.008, 0.09]} radius={0.003} smoothness={2} position={[0, 0.967, -0.19]}>
          <PMat color="#3c4652" metal={0.1} rough={0.55} e={0.05} />
        </RBox>
        <mesh position={[0, 0.9725, -0.19]}>
          <boxGeometry args={[0.3, 0.003, 0.07]} />
          <PMat color="#5a646f" metal={0.1} rough={0.6} e={0.08} />
        </mesh>
      </PartGroup>

      <PartGroup id="bat-plates" explode={[0, 0, 0]}>
        {/* per-cell mini plate stacks in the three visible cells */}
        {SHOWN_CELLS.map((ci) =>
          PLATE_OFFS.map((dx, j) => (
            <group key={`pl-${ci}-${j}`} position={[CELL_XS[ci] + dx, 0, 0]}>
              <mesh position={[0, 0.57, 0]}>
                <boxGeometry args={[0.008, 0.38, 0.4]} />
                <PMat
                  color={j % 2 ? '#848c97' : '#3a3136'}
                  metal={j % 2 ? 0.8 : 0.5}
                  rough={j % 2 ? 0.5 : 0.78}
                  e={0.06}
                />
              </mesh>
              {/* lug tab on top, side alternating with polarity */}
              <mesh position={[0, 0.785, j % 2 ? 0.14 : -0.14]}>
                <boxGeometry args={[0.007, 0.05, 0.045]} />
                <PMat color="#9aa1ab" metal={0.75} rough={0.45} e={0.06} />
              </mesh>
            </group>
          )),
        )}
        {/* cast lead bus bars over the lug rows of every cell */}
        {CELL_XS.map((x) =>
          [0.14, -0.14].map((z) => (
            <RBox
              key={`bus-${x}-${z}`}
              args={[0.125, 0.02, 0.032]}
              radius={0.005}
              smoothness={2}
              position={[x, 0.818, z]}
            >
              <PMat color="#9aa1ab" metal={0.75} rough={0.45} e={0.06} />
            </RBox>
          )),
        )}
        {/* intercell straps hopping over each divider */}
        {STRAP_PATHS.map((p, i) => (
          <Tube key={`strap-${i}`} path={p} r={0.016} seg={24} radial={10}>
            <PMat color="#9aa1ab" metal={0.75} rough={0.42} e={0.08} />
          </Tube>
        ))}
      </PartGroup>

      <PartGroup id="bat-mat" explode={[0, 0.2, 0.8]}>
        {/* AGM glass-mat separators interleaved with the plates */}
        {SHOWN_CELLS.map((ci) =>
          SEP_OFFS.map((dx, j) => (
            <mesh key={`sep-${ci}-${j}`} position={[CELL_XS[ci] + dx, 0.575, 0]}>
              <boxGeometry args={[0.003, 0.4, 0.42]} />
              <PMat color="#ece8dc" metal={0} rough={0.9} opacity={0.8} e={0.08} />
            </mesh>
          )),
        )}
        {/* one mat pulled out above the case — "this is the mat" */}
        <mesh position={[0.24, 1.22, 0]} rotation={[0.06, 0.25, 0.12]}>
          <boxGeometry args={[0.005, 0.48, 0.4]} />
          <PMat color="#ece8dc" metal={0} rough={0.9} opacity={0.9} e={0.1} />
        </mesh>
      </PartGroup>

      <PartGroup id="bat-terminals" explode={[0, 0.65, -0.6]}>
        {[-0.3, 0.3].map((x, i) => (
          <group key={`post-${x}`} position={[x, 0, -0.15]}>
            {/* tapered lead post */}
            <mesh position={[0, 1.017, 0]}>
              <cylinderGeometry args={[0.042, 0.054, 0.105, 28]} />
              <PMat color="#aab0b9" metal={0.7} rough={0.4} e={0.08} />
            </mesh>
            {/* molded polarity ring (red +, gray −) + taper mark ring */}
            <mesh position={[0, 0.972, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.008, 8, 32]} />
              <PMat color={i ? '#3d4854' : '#c84a4a'} metal={0.3} rough={0.6} e={0.2} />
            </mesh>
            <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.052, 0.005, 8, 28]} />
              <PMat color="#8d939c" metal={0.7} rough={0.45} e={0.06} />
            </mesh>
          </group>
        ))}
        {/* molded + / − symbols beside the posts */}
        <group position={[-0.3, 0.969, -0.26]}>
          <mesh>
            <boxGeometry args={[0.038, 0.006, 0.01]} />
            <PMat color="#c84a4a" metal={0.2} rough={0.6} e={0.3} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.01, 0.006, 0.038]} />
            <PMat color="#c84a4a" metal={0.2} rough={0.6} e={0.3} />
          </mesh>
        </group>
        <mesh position={[0.3, 0.969, -0.26]}>
          <boxGeometry args={[0.038, 0.006, 0.01]} />
          <PMat color="#9fb3c8" metal={0.2} rough={0.6} e={0.3} />
        </mesh>
        {/* C-clamp fitted on the negative post, pinch bolt through the ears */}
        <group position={[0.3, 1.03, -0.15]} rotation={[0, 0.73, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.062, 0.016, 10, 32, 4.6]} />
            <PMat color="#7d858f" metal={0.85} rough={0.5} e={0.05} />
          </mesh>
          <group position={[0.0527, 0, -0.0575]} rotation={[0, -0.742, 0]}>
            {[0.015, -0.015].map((dx) => (
              <mesh key={`ear-${dx}`} position={[dx, 0, 0]}>
                <boxGeometry args={[0.012, 0.036, 0.032]} />
                <PMat color="#7d858f" metal={0.85} rough={0.5} e={0.05} />
              </mesh>
            ))}
            <Bolt position={[0.03, 0, 0]} rotation={[0, 0, -Math.PI / 2]} r={0.006} len={0.055} m="zincGold" />
          </group>
        </group>
        {/* cable off the clamp */}
        <Tube path={CLAMP_CABLE} r={0.02} seg={28} radial={10}>
          <PMat m="rubber" />
        </Tube>
      </PartGroup>
    </group>
  )
}

/* ================================== ECU ================================== */

interface Smd {
  p: [number, number]
  s: [number, number, number]
  c: string
}

/** 8 varied SMD chips (black / gray molded packages). */
const ECU_CHIPS: Smd[] = [
  { p: [-0.32, 0.1], s: [0.09, 0.02, 0.07], c: '#14181f' },
  { p: [-0.3, -0.14], s: [0.06, 0.016, 0.06], c: '#262c35' },
  { p: [-0.17, 0.2], s: [0.05, 0.014, 0.1], c: '#14181f' },
  { p: [-0.12, -0.05], s: [0.1, 0.018, 0.045], c: '#3a414d' },
  { p: [0.14, 0.14], s: [0.07, 0.016, 0.07], c: '#14181f' },
  { p: [0.2, -0.2], s: [0.05, 0.014, 0.05], c: '#262c35' },
  { p: [0.3, 0.07], s: [0.04, 0.012, 0.08], c: '#3a414d' },
  { p: [-0.02, -0.22], s: [0.08, 0.016, 0.04], c: '#14181f' },
]

/** 4 electrolytic caps. */
const ECU_CAPS: [number, number][] = [
  [-0.36, -0.02],
  [0.08, 0.24],
  [0.2, 0.24],
  [0.33, -0.18],
]

/** Gold test-point dots along the front board edge. */
const ECU_TPS = [-0.38, -0.3, -0.22, -0.14, -0.06, 0.02] as const

/** Silkscreen hint strips. */
const ECU_SILK: { p: [number, number]; l: number; r?: number }[] = [
  { p: [-0.22, 0.02], l: 0.14 },
  { p: [0.1, -0.12], l: 0.1, r: Math.PI / 2 },
  { p: [-0.05, 0.26], l: 0.18 },
  { p: [0.26, 0.2], l: 0.08, r: Math.PI / 2 },
  { p: [-0.35, -0.22], l: 0.12 },
]

/** 3 keyed connector bays, different pin counts, key notch offsets. */
const ECU_BAYS: { z: number; w: number; pins: number; key: number }[] = [
  { z: -0.165, w: 0.15, pins: 8, key: 0.045 },
  { z: 0.0, w: 0.12, pins: 6, key: -0.03 },
  { z: 0.145, w: 0.09, pins: 4, key: 0.02 },
]

const ECU_SCREWS: [number, number][] = [
  [-0.4, -0.265],
  [-0.4, 0.265],
  [0.4, -0.265],
  [0.4, 0.265],
]

export function EcuViewReal() {
  return (
    <group>
      <PartGroup id="ecu-case" perChild>
        {/* bottom tray */}
        <group userData={{ explode: [0, -0.45, 0] }}>
          <RBox args={[0.95, 0.1, 0.68]} radius={0.018} smoothness={2} position={[0, 0.5, 0]}>
            <PMat m="castAlu" />
          </RBox>
          <Ribs n={6} pitch={0.12} w={0.025} h={0.05} depth={0.6} m="castAlu" position={[0, 0.43, 0]} />
        </group>
        {/* finned lid with mounting ears, PN plate recess and CPU boss */}
        <group userData={{ explode: [0, 0.75, 0] }}>
          <RBox args={[0.95, 0.07, 0.68]} radius={0.015} smoothness={2} position={[0, 0.78, 0]}>
            <PMat m="castAlu" opacity={0.85} />
          </RBox>
          <Ribs n={9} pitch={0.065} w={0.014} h={0.04} depth={0.5} m="castAlu" position={[-0.09, 0.835, 0]} />
          {/* 4 mounting ears with bolt holes */}
          {[-0.51, 0.51].map((x) =>
            [-0.22, 0.22].map((z) => (
              <group key={`ear-${x}-${z}`} position={[x, 0.78, z]}>
                <RBox args={[0.08, 0.02, 0.07]} radius={0.008} smoothness={2}>
                  <PMat m="castAlu" />
                </RBox>
                <mesh>
                  <cylinderGeometry args={[0.014, 0.014, 0.024, 16]} />
                  <PMat color="#0b0e13" metal={0.2} rough={0.7} e={0.02} />
                </mesh>
              </group>
            )),
          )}
          {/* part-number plate recess + plate */}
          <RBox args={[0.2, 0.008, 0.3]} radius={0.003} smoothness={2} position={[0.33, 0.8155, 0]}>
            <PMat color="#565e6a" metal={0.6} rough={0.55} e={0.04} />
          </RBox>
          <mesh position={[0.33, 0.8195, 0]}>
            <boxGeometry args={[0.16, 0.004, 0.24]} />
            <PMat color="#9aa2ac" metal={0.8} rough={0.35} e={0.1} />
          </mesh>
          {/* thermal boss on the lid underside, above the CPU */}
          <RBox args={[0.14, 0.05, 0.14]} radius={0.008} smoothness={2} position={[0.02, 0.722, 0.02]}>
            <PMat m="castAlu" />
          </RBox>
        </group>
      </PartGroup>

      <PartGroup id="ecu-pcb" explode={[0, 0.1, 0]}>
        {/* board */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.85, 0.025, 0.58]} />
          <PMat color="#1c4527" metal={0.2} rough={0.55} e={0.1} />
        </mesh>
        {/* varied SMD chips */}
        {ECU_CHIPS.map((d, i) => (
          <RBox
            key={`chip-${i}`}
            args={d.s}
            radius={0.003}
            smoothness={2}
            position={[d.p[0], 0.6325 + d.s[1] / 2, d.p[1]]}
          >
            <PMat color={d.c} metal={0.3} rough={0.6} e={0.05} />
          </RBox>
        ))}
        {/* 4 electrolytic caps with silver tops */}
        {ECU_CAPS.map(([x, z], i) => (
          <group key={`cap-${i}`} position={[x, 0, z]}>
            <mesh position={[0, 0.655, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.045, 20]} />
              <PMat color="#2e3440" metal={0.45} rough={0.5} e={0.05} />
            </mesh>
            <mesh position={[0, 0.6795, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.004, 20]} />
              <PMat m="polSteel" />
            </mesh>
          </group>
        ))}
        {/* power inductor */}
        <mesh position={[-0.05, 0.646, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.028, 0.012, 10, 24]} />
          <PMat m="copper" />
        </mesh>
        {/* crystal oscillator can */}
        <mesh position={[0.02, 0.645, -0.16]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.011, 0.026, 4, 12]} />
          <PMat m="polSteel" />
        </mesh>
        {/* gold edge test points */}
        {ECU_TPS.map((x) => (
          <mesh key={`tp-${x}`} position={[x, 0.634, 0.255]}>
            <cylinderGeometry args={[0.005, 0.005, 0.003, 10]} />
            <PMat m="zincGold" e={0.4} />
          </mesh>
        ))}
        {/* silkscreen hint lines */}
        {ECU_SILK.map((s, i) => (
          <mesh key={`silk-${i}`} position={[s.p[0], 0.634, s.p[1]]} rotation={[0, s.r ?? 0, 0]}>
            <boxGeometry args={[s.l, 0.0015, 0.005]} />
            <PMat color="#cfe3d4" metal={0} rough={0.8} e={0.15} />
          </mesh>
        ))}
        {/* 4 corner screws */}
        {ECU_SCREWS.map(([x, z]) => (
          <Bolt key={`scr-${x}-${z}`} position={[x, 0.633, z]} r={0.007} len={0.02} m="steel" />
        ))}
      </PartGroup>

      <PartGroup id="ecu-cpu" explode={[0, 0.55, 0]}>
        {/* substrate + lidded package */}
        <RBox args={[0.16, 0.022, 0.16]} radius={0.004} smoothness={2} position={[0.02, 0.6435, 0.02]}>
          <PMat color="#0d1117" metal={0.3} rough={0.6} e={0.06} />
        </RBox>
        <RBox args={[0.12, 0.012, 0.12]} radius={0.003} smoothness={2} position={[0.02, 0.6605, 0.02]}>
          <PMat m="machAlu" />
        </RBox>
        {/* pink thermal pad bridging up to the lid boss */}
        <RBox args={[0.12, 0.025, 0.12]} radius={0.004} smoothness={2} position={[0.02, 0.6835, 0.02]}>
          <PMat color="#f2a9c4" metal={0} rough={0.75} opacity={0.95} e={0.12} />
        </RBox>
      </PartGroup>

      <PartGroup id="ecu-connector" explode={[0.9, 0.1, 0]}>
        {/* glass-filled nylon header body */}
        <RBox args={[0.12, 0.11, 0.5]} radius={0.012} smoothness={2} position={[0.47, 0.62, 0]}>
          <PMat color="#262b33" metal={0.2} rough={0.7} e={0.05} />
        </RBox>
        {/* rubber gasket ring where the header passes the case wall */}
        {[0.065, -0.065].map((dy) => (
          <RBox
            key={`gsk-${dy}`}
            args={[0.014, 0.014, 0.55]}
            radius={0.005}
            smoothness={2}
            position={[0.425, 0.62 + dy, 0]}
          >
            <PMat m="rubber" />
          </RBox>
        ))}
        {[0.268, -0.268].map((dz) => (
          <RBox
            key={`gskz-${dz}`}
            args={[0.014, 0.145, 0.014]}
            radius={0.005}
            smoothness={2}
            position={[0.425, 0.62, dz]}
          >
            <PMat m="rubber" />
          </RBox>
        ))}
        {/* 3 keyed bays with gold pin rows + CPA latch tabs */}
        {ECU_BAYS.map((b) => (
          <group key={`bay-${b.z}`}>
            <RBox args={[0.05, 0.085, b.w]} radius={0.006} smoothness={2} position={[0.54, 0.62, b.z]}>
              <PMat color="#1d2128" metal={0.2} rough={0.7} e={0.04} />
            </RBox>
            <mesh position={[0.552, 0.62, b.z]}>
              <boxGeometry args={[0.02, 0.06, b.w - 0.025]} />
              <PMat color="#0b0e13" metal={0.1} rough={0.8} e={0.02} />
            </mesh>
            {/* polarizing key notch (different spot per bay) */}
            <mesh position={[0.552, 0.645, b.z + b.key]}>
              <boxGeometry args={[0.014, 0.014, 0.01]} />
              <PMat color="#1d2128" metal={0.2} rough={0.7} e={0.04} />
            </mesh>
            {/* two gold pin rows */}
            {[0.602, 0.638].map((y) =>
              Array.from({ length: b.pins }, (_, j) => {
                const z = b.z + (j / (b.pins - 1) - 0.5) * (b.w - 0.035)
                return (
                  <mesh key={`pin-${y}-${j}`} position={[0.553, y, z]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.0035, 0.0035, 0.03, 6]} />
                    <PMat m="zincGold" e={0.35} />
                  </mesh>
                )
              }),
            )}
            {/* CPA latch tab */}
            <RBox args={[0.028, 0.012, 0.035]} radius={0.004} smoothness={2} position={[0.53, 0.682, b.z]}>
              <PMat color="#d9623b" metal={0.1} rough={0.6} e={0.25} />
            </RBox>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* =============================== HEADLIGHT =============================== */
/* Optical axis +X at y 0.75, matching the schematic HeadlightView.          */

/** Housing shell profile (local y → world x via rot z = -90°). */
const HOUSING_PTS: [number, number][] = [
  [0.375, -0.64],
  [0.39, -0.5],
  [0.42, -0.34],
  [0.455, -0.18],
  [0.48, -0.06],
  [0.49, 0],
]

/** True paraboloid bowl r² = 0.529·d, vertex local y 0, rim r 0.46 + lip. */
const REFL_PTS: [number, number][] = [
  [0.14, 0.037],
  [0.2, 0.076],
  [0.26, 0.128],
  [0.31, 0.182],
  [0.355, 0.238],
  [0.395, 0.295],
  [0.43, 0.35],
  [0.46, 0.4],
  [0.473, 0.406],
]

/** Projector bezel cone. */
const BEZEL_PTS: [number, number][] = [
  [0.185, 0],
  [0.19, 0.015],
  [0.152, 0.095],
  [0.133, 0.1],
]

const SEAM_N = 8
const FIN_ZS = [-0.155, -0.111, -0.066, -0.022, 0.022, 0.066, 0.111, 0.155] as const
const FAN_N = 5
const DIE_ZS = [-0.09, 0, 0.09] as const

/** Pigtail from the back-cap grommet down to the harness connector. */
const HL_PIGTAIL: P3[] = [
  [-0.665, 0.63, 0.1],
  [-0.73, 0.55, 0.16],
  [-0.77, 0.42, 0.2],
  [-0.78, 0.3, 0.22],
]

export function HeadlightViewReal() {
  /** DRL light-guide: arc swept below the projector, bowed slightly forward. */
  const drlPath = useMemo<P3[]>(() => {
    const pts: P3[] = []
    for (let i = 0; i <= 8; i++) {
      const a = -2.35 + (i / 8) * 1.7
      pts.push([
        0.3 + 0.06 * Math.sin((i / 8) * Math.PI),
        0.75 + 0.45 * Math.sin(a),
        0.45 * Math.cos(a),
      ])
    }
    return pts
  }, [])

  return (
    <group>
      <PartGroup id="hl-housing" explode={[-0.85, 0, 0]} renderOrder={5}>
        {/* ghost housing shell + back cap */}
        <Lathe pts={HOUSING_PTS} seg={40} rotation={[0, 0, -Math.PI / 2]} position={[0, 0.75, 0]}>
          <PMat color="#2d3748" metal={0.3} rough={0.7} opacity={0.3} depthWrite={false} side={THREE.DoubleSide} e={0.05} />
        </Lathe>
        <mesh position={[-0.655, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.03, 40]} />
          <PMat color="#2d3748" metal={0.3} rough={0.7} opacity={0.45} depthWrite={false} e={0.05} />
        </mesh>
        {/* 2 aim-adjuster bosses + long screws through the back */}
        {[-0.22, 0.22].map((z) => (
          <group key={`adj-${z}`}>
            <mesh position={[-0.645, 1.03, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.028, 0.032, 0.06, 20]} />
              <PMat m="castAlu" />
            </mesh>
            <Bolt position={[-0.69, 1.03, z]} rotation={[0, 0, Math.PI / 2]} r={0.009} len={0.28} m="zincGold" />
          </group>
        ))}
        {/* wiring pigtail with grommet and connector */}
        <mesh position={[-0.66, 0.63, 0.1]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.022, 0.007, 8, 20]} />
          <PMat m="rubber" />
        </mesh>
        <Tube path={HL_PIGTAIL} r={0.016} seg={28} radial={10}>
          <PMat m="rubber" />
        </Tube>
        <RBox args={[0.05, 0.07, 0.045]} radius={0.008} smoothness={2} position={[-0.78, 0.26, 0.22]}>
          <PMat m="blackCast" />
        </RBox>
      </PartGroup>

      <PartGroup id="hl-reflector" explode={[0, 0.65, -0.5]}>
        {/* metalized paraboloid bowl */}
        <Lathe pts={REFL_PTS} seg={48} rotation={[0, 0, -Math.PI / 2]} position={[-0.4, 0.75, 0]}>
          <PMat m="polSteel" e={0.25} rough={0.05} env={1.4} side={THREE.DoubleSide} />
        </Lathe>
        {/* 8 subtle radial facet seams */}
        <group position={[0, 0.75, 0]}>
          {Array.from({ length: SEAM_N }, (_, i) => (
            <group key={`seam-${i}`} rotation={[(i / SEAM_N) * Math.PI * 2, 0, 0]}>
              <RBox
                args={[0.4, 0.014, 0.006]}
                radius={0.002}
                smoothness={2}
                position={[-0.19, 0.3, 0]}
                rotation={[0, 0, 0.72]}
              >
                <PMat m="polSteel" e={0.15} rough={0.12} />
              </RBox>
            </group>
          ))}
        </group>
        {/* collar around the vertex opening */}
        <mesh position={[-0.36, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.15, 0.01, 8, 32]} />
          <PMat m="steel" rough={0.4} />
        </mesh>
      </PartGroup>

      <PartGroup id="hl-led" explode={[0, -0.6, 0.5]}>
        {/* MCPCB board with 3 emitter dies facing the reflector */}
        <RBox args={[0.018, 0.22, 0.32]} radius={0.004} smoothness={2} position={[-0.265, 0.75, 0]}>
          <PMat color="#e6e9ee" metal={0.4} rough={0.5} e={0.08} />
        </RBox>
        {DIE_ZS.map((z) => (
          <mesh key={`die-${z}`} position={[-0.252, 0.75, z]}>
            <boxGeometry args={[0.01, 0.05, 0.05]} />
            <PMat color="#eafcff" e={1.8} metal={0} rough={0.3} />
          </mesh>
        ))}
        {/* heatsink block + stacked fin plates */}
        <RBox args={[0.08, 0.26, 0.36]} radius={0.01} smoothness={2} position={[-0.315, 0.75, 0]}>
          <PMat m="castAlu" />
        </RBox>
        {FIN_ZS.map((z) => (
          <mesh key={`fin-${z}`} position={[-0.42, 0.75, z]}>
            <boxGeometry args={[0.12, 0.26, 0.009]} />
            <PMat m="castAlu" />
          </mesh>
        ))}
        {/* tiny axial fan: hub, 5 pitched blades, shroud ring */}
        <mesh position={[-0.52, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.035, 20]} />
          <PMat m="blackCast" />
        </mesh>
        {Array.from({ length: FAN_N }, (_, i) => (
          <group key={`blade-${i}`} position={[-0.52, 0.75, 0]} rotation={[(i / FAN_N) * Math.PI * 2, 0, 0]}>
            <mesh position={[0, 0.052, 0]} rotation={[0, 0.5, 0]}>
              <boxGeometry args={[0.006, 0.055, 0.034]} />
              <PMat color="#23282f" metal={0.3} rough={0.6} e={0.05} />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.52, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.09, 0.008, 8, 28]} />
          <PMat m="blackCast" />
        </mesh>
      </PartGroup>

      <PartGroup id="hl-lens" explode={[0.95, 0, 0]}>
        {/* projector module: bezel, cutoff shield, source, glass dome */}
        <Lathe pts={BEZEL_PTS} seg={48} rotation={[0, 0, -Math.PI / 2]} position={[0.08, 0.75, 0]}>
          <PMat m="blackCast" side={THREE.DoubleSide} />
        </Lathe>
        {/* half-moon cutoff shield between source and dome */}
        <mesh position={[0.1, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.115, 0.115, 0.006, 32, 1, false, 0, Math.PI]} />
          <PMat color="#30353d" metal={0.75} rough={0.4} side={THREE.DoubleSide} e={0.05} />
        </mesh>
        {/* bright elliptical source behind the shield */}
        <mesh position={[0.02, 0.75, 0]} scale={[0.55, 1, 1.4]}>
          <sphereGeometry args={[0.048, 24, 16]} />
          <PMat color="#fff3c4" e={2.2} metal={0} rough={0.3} />
        </mesh>
        {/* high-clarity glass dome lens */}
        <mesh position={[0.17, 0.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <sphereGeometry args={[0.135, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <PMat color="#cfeaff" metal={0} rough={0.03} opacity={0.25} depthWrite={false} side={THREE.DoubleSide} e={0.08} />
        </mesh>
        {/* outer cover lens */}
        <mesh position={[0.35, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.5, 0.05, 48]} />
          <PMat color="#bfe9ff" metal={0} rough={0.05} opacity={0.2} depthWrite={false} e={0.1} />
        </mesh>
        {/* glowing DRL light-guide arc */}
        <Tube path={drlPath} r={0.016} seg={40} radial={10}>
          <PMat color="#dff6ff" e={1.2} metal={0} rough={0.3} />
        </Tube>
      </PartGroup>

      {/* projected beam */}
      <Ghost>
        <mesh position={[1.15, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.6, 1.3, 32, 1, true]} />
          <GhostMat opacity={0.05} color="#1a3540" />
        </mesh>
      </Ghost>
    </group>
  )
}

/* ================================ LED MODULE ============================== */

const LED_FIN_XS = [-0.42, -0.3, -0.18, -0.06, 0.06, 0.18, 0.3, 0.42] as const

/** 2 gold bond wires: die top edge down to the solder pads. */
const BOND_PATHS: P3[][] = [-0.08, 0.08].map((z) => [
  [0.085, 0.652, z],
  [0.14, 0.7, z],
  [0.21, 0.645, z],
  [0.255, 0.562, z],
])

export function LedViewReal() {
  return (
    <group>
      <PartGroup id="led-board" explode={[0, -0.55, 0]}>
        {/* heatsink fins */}
        {LED_FIN_XS.map((x) => (
          <mesh key={`fin-${x}`} position={[x, 0.28, 0]}>
            <boxGeometry args={[0.035, 0.3, 0.65]} />
            <PMat m="castAlu" />
          </mesh>
        ))}
        {/* machined heatsink base */}
        <RBox args={[0.95, 0.08, 0.7]} radius={0.012} smoothness={2} position={[0, 0.47, 0]}>
          <PMat m="machAlu" />
        </RBox>
        {/* copper heat-pipe inset in the base, slightly proud */}
        <RBox args={[0.78, 0.026, 0.07]} radius={0.008} smoothness={2} position={[0, 0.503, 0]}>
          <PMat m="copper" />
        </RBox>
        {/* thermal-paste layer */}
        <mesh position={[0, 0.5135, 0]}>
          <boxGeometry args={[0.58, 0.006, 0.48]} />
          <PMat color="#c6cbd2" metal={0} rough={0.85} e={0.04} />
        </mesh>
        {/* copper spreader / MCPCB core */}
        <RBox args={[0.55, 0.035, 0.45]} radius={0.006} smoothness={2} position={[0, 0.534, 0]}>
          <PMat m="copper" />
        </RBox>
        {/* traces running to the 2 solder pads */}
        {[-0.155, 0.155].map((z) => (
          <mesh key={`trace-${z}`} position={[0.255, 0.553, z]}>
            <boxGeometry args={[0.016, 0.003, 0.13]} />
            <PMat m="zincGold" e={0.35} />
          </mesh>
        ))}
        {[-0.08, 0.08].map((z) => (
          <RBox key={`pad-${z}`} args={[0.05, 0.006, 0.05]} radius={0.002} smoothness={2} position={[0.255, 0.5545, z]}>
            <PMat m="zincGold" e={0.35} />
          </RBox>
        ))}
        {/* AlN ceramic substrate */}
        <mesh position={[0, 0.569, 0]}>
          <boxGeometry args={[0.32, 0.035, 0.28]} />
          <PMat color="#e8e2d4" metal={0.1} rough={0.5} e={0.15} />
        </mesh>
      </PartGroup>

      <PartGroup id="led-die" explode={[0, 0.5, 0.6]}>
        {/* InGaN die */}
        <mesh position={[0, 0.6215, 0]}>
          <boxGeometry args={[0.2, 0.07, 0.2]} />
          <PMat color="#4aa8ff" e={1.3} metal={0.3} rough={0.2} />
        </mesh>
        {/* solder fillet wedges around the die base */}
        {[-0.102, 0.102].map((x) => (
          <mesh key={`filx-${x}`} position={[x, 0.591, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.016, 0.016, 0.17]} />
            <PMat m="polSteel" e={0.3} />
          </mesh>
        ))}
        {[-0.102, 0.102].map((z) => (
          <mesh key={`filz-${z}`} position={[0, 0.591, z]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.17, 0.016, 0.016]} />
            <PMat m="polSteel" e={0.3} />
          </mesh>
        ))}
        {/* 2 gold wire bonds arcing to the pads */}
        {BOND_PATHS.map((p, i) => (
          <Tube key={`bond-${i}`} path={p} r={0.005} seg={24} radial={8}>
            <PMat m="zincGold" e={0.6} />
          </Tube>
        ))}
      </PartGroup>

      <PartGroup id="led-phosphor" explode={[0, 0.95, 0]}>
        {/* YAG phosphor plate */}
        <mesh position={[0, 0.669, 0]}>
          <boxGeometry args={[0.24, 0.025, 0.24]} />
          <PMat color="#ffe94d" e={1.1} metal={0} rough={0.4} opacity={0.85} />
        </mesh>
        {/* clear silicone dome lens over the stack */}
        <mesh position={[0, 0.588, 0]}>
          <sphereGeometry args={[0.19, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <PMat color="#dff2ff" metal={0} rough={0.05} opacity={0.28} depthWrite={false} side={THREE.DoubleSide} e={0.08} />
        </mesh>
      </PartGroup>

      {/* emitted light */}
      <Ghost>
        <mesh position={[0, 1.35, 0]}>
          <coneGeometry args={[0.55, 1.2, 32, 1, true]} />
          <GhostMat opacity={0.05} color="#2a2a10" />
        </mesh>
      </Ghost>
    </group>
  )
}
