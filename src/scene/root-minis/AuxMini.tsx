/**
 * AuxMini.tsx — compact REAL miniatures of five root-view systems, sitting at
 * the exact car coordinates of the schematic parts they replace (CarModel.tsx):
 *
 *   RadiatorMini()     — finned core + tube lines, tanks w/ cap + drain, shroud + 7-blade fan, clamped hoses, brackets
 *   BatteryMini()      — ribbed case, vented lid + label plate, terminal clamps + cable stubs, J-bolt hold-down bar
 *   EcuMini()          — finned alloy box, keyed connector block + loom exit, bolted mounting ears
 *   FuelTankMini()     — saddle-molded tank, steel wrap straps, pump flange + lock ring, fuel line, filler neck, shield
 *   ChassisFrameMini() — boxed rails w/ lightening holes, flanged crossmembers, bumper beams + crush cans, subframe hint
 *
 * Same PartGroup ids + explode vectors as the schematics. Everything stays
 * under the hood line (y ≈ 0.8). Every material is <PMat/>; segments ≤ 20;
 * no textures, no useFrame.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { PMat, Tube, RBox, Bolt } from '../realism'

type V3 = [number, number, number]

const YUP = new THREE.Vector3(0, 1, 0)
const ZUP = new THREE.Vector3(0, 0, 1)
const quatY = (d: V3) =>
  new THREE.Quaternion().setFromUnitVectors(YUP, new THREE.Vector3(...d).normalize())
const quatZ = (d: V3) =>
  new THREE.Quaternion().setFromUnitVectors(ZUP, new THREE.Vector3(...d).normalize())

/* --------------------------------- palette -------------------------------- */
const TANK_PA = '#1d3a45' // radiator tank plastic (matches big stage)
const PP_CASE = '#23262b' // battery polypropylene
const HDPE = '#2e2a26' // blow-molded fuel tank shell

/* ================================ RADIATOR ================================ */

/** 10 vertical bright fin strips across the core face */
const FIN_Z = Array.from({ length: 10 }, (_, i) => -0.405 + i * 0.09)
/** 4 horizontal coolant tube lines */
const TUBE_Y = [0.38, 0.46, 0.54, 0.62] as const
/** 7 fan blade angles */
const FAN_A = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2)

const UP_HOSE: V3[] = [
  [1.9, 0.705, 0.24],
  [1.72, 0.7, 0.19],
  [1.55, 0.67, 0.14],
  [1.45, 0.66, 0.12],
]
const LO_HOSE: V3[] = [
  [1.9, 0.295, -0.24],
  [1.72, 0.3, -0.19],
  [1.55, 0.37, -0.14],
  [1.45, 0.38, -0.12],
]
/** 2 clamp rings per hose: position + local hose direction */
const RAD_CLAMPS: { p: V3; d: V3 }[] = [
  { p: [1.87, 0.702, 0.228], d: [-1, -0.03, -0.28] },
  { p: [1.49, 0.662, 0.124], d: [-1, -0.06, -0.12] },
  { p: [1.87, 0.298, -0.228], d: [-1, 0.03, 0.28] },
  { p: [1.49, 0.378, -0.124], d: [-1, 0.06, 0.12] },
]

export function RadiatorMini() {
  const clampQ = useMemo(() => RAD_CLAMPS.map((c) => quatZ(c.d)), [])
  return (
    <PartGroup id="radiator" explode={[1.2, 0.35, 0]}>
      {/* core slab (original: 0.07×0.38×0.92 @ 1.95,0.5,0) */}
      <mesh position={[1.95, 0.5, 0]}>
        <boxGeometry args={[0.07, 0.38, 0.92]} />
        <PMat color="#3a4149" metal={0.6} rough={0.55} e={0.04} />
      </mesh>
      {/* visible fin texture: vertical bright strips on the grille face */}
      {FIN_Z.map((z) => (
        <mesh key={`fin${z}`} position={[1.988, 0.5, z]}>
          <boxGeometry args={[0.006, 0.34, 0.016]} />
          <PMat m="machAlu" e={0.1} />
        </mesh>
      ))}
      {/* horizontal coolant tube lines over the fins */}
      {TUBE_Y.map((y) => (
        <mesh key={`tb${y}`} position={[1.992, y, 0]}>
          <boxGeometry args={[0.004, 0.012, 0.88]} />
          <PMat m="copper" e={0.06} />
        </mesh>
      ))}
      {/* top / bottom plastic tanks */}
      {([0.715, 0.285] as const).map((y) => (
        <RBox
          key={`tank${y}`}
          args={[0.1, 0.06, 0.94]}
          radius={0.018}
          smoothness={2}
          position={[1.95, y, 0]}
        >
          <PMat m="nylon" color={TANK_PA} e={0.06} rough={0.6} metal={0.15} />
        </RBox>
      ))}
      {/* filler cap nub on the top tank */}
      <mesh position={[1.95, 0.757, -0.3]}>
        <cylinderGeometry args={[0.028, 0.03, 0.024, 16]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[1.95, 0.772, -0.3]}>
        <cylinderGeometry args={[0.033, 0.033, 0.01, 16]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      {/* drain petcock under the bottom tank */}
      <mesh position={[1.93, 0.247, 0.4]}>
        <cylinderGeometry args={[0.009, 0.009, 0.03, 10]} />
        <PMat m="brass" />
      </mesh>
      {/* fan shroud ring behind the core (toward the engine) */}
      <mesh position={[1.885, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 20, 1, true]} />
        <PMat m="blackCast" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[1.908, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.19, 0.008, 6, 20]} />
        <PMat m="blackCast" />
      </mesh>
      {/* 7-blade fan + motor hub (original fan @ 1.86,0.5,0) */}
      <group position={[1.86, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.042, 0.042, 0.035, 14]} />
          <PMat m="blackCast" color="#30353c" />
        </mesh>
        {FAN_A.map((a) => (
          <group key={`bl${a}`} rotation={[a, 0, 0]}>
            <mesh position={[0, 0.1, 0]} rotation={[0, 0.55, 0]}>
              <boxGeometry args={[0.012, 0.125, 0.06]} />
              <PMat m="blackCast" color="#262b31" />
            </mesh>
          </group>
        ))}
        <mesh position={[-0.034, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.026, 0.026, 0.04, 12]} />
          <PMat m="steel" />
        </mesh>
      </group>
      {/* upper / lower hoses toward the engine, 2 clamp rings each */}
      <Tube path={UP_HOSE} r={0.03} seg={16} radial={10}>
        <PMat m="rubber" />
      </Tube>
      <Tube path={LO_HOSE} r={0.03} seg={16} radial={10}>
        <PMat m="rubber" />
      </Tube>
      {RAD_CLAMPS.map((c, i) => (
        <mesh key={`cl${i}`} position={c.p} quaternion={clampQ[i]}>
          <torusGeometry args={[0.036, 0.006, 6, 16]} />
          <PMat m="polSteel" />
        </mesh>
      ))}
      {/* 2 slim mounting brackets at the core ends */}
      {([-0.44, 0.44] as const).map((z) => (
        <group key={`bk${z}`}>
          <mesh position={[1.905, 0.5, z]}>
            <boxGeometry args={[0.014, 0.44, 0.03]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh position={[1.885, 0.728, z]}>
            <boxGeometry args={[0.05, 0.014, 0.03]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
        </group>
      ))}
    </PartGroup>
  )
}

/* ================================ BATTERY ================================= */

const BATT_RIB_X = [-0.07, 0, 0.07] as const

export function BatteryMini() {
  return (
    <PartGroup id="battery" explode={[0.4, 0.9, -0.7]}>
      {/* ribbed polypropylene case (original box 0.26×0.18×0.18 @ 1.62,0.62,−0.5) */}
      <RBox args={[0.26, 0.15, 0.18]} radius={0.012} smoothness={2} position={[1.62, 0.605, -0.5]}>
        <PMat color={PP_CASE} metal={0.15} rough={0.8} e={0.05} />
      </RBox>
      {BATT_RIB_X.map((rx) =>
        ([-0.592, -0.408] as const).map((zf) => (
          <mesh key={`rib${rx}${zf}`} position={[1.62 + rx, 0.6, zf]}>
            <boxGeometry args={[0.016, 0.12, 0.007]} />
            <PMat color="#2d3138" metal={0.2} rough={0.75} e={0.06} />
          </mesh>
        )),
      )}
      {/* lid with 2 vent covers + molded label plate */}
      <RBox args={[0.255, 0.035, 0.175]} radius={0.01} smoothness={2} position={[1.62, 0.6975, -0.5]}>
        <PMat color="#2a2e35" metal={0.15} rough={0.75} e={0.05} />
      </RBox>
      {([-0.05, 0.05] as const).map((dx) => (
        <mesh key={`vent${dx}`} position={[1.62 + dx, 0.718, -0.5]}>
          <boxGeometry args={[0.07, 0.012, 0.04]} />
          <PMat color="#1c1f24" metal={0.15} rough={0.8} e={0.04} />
        </mesh>
      ))}
      <mesh position={[1.62, 0.605, -0.406]}>
        <boxGeometry args={[0.14, 0.08, 0.006]} />
        <PMat color="#c9cfd4" metal={0.05} rough={0.8} e={0.07} />
      </mesh>
      {/* terminals w/ clamps + cable stubs (red = +, @ x 1.54 like the original) */}
      {([1.54, 1.7] as const).map((x) => (
        <group key={`term${x}`}>
          <mesh position={[x, 0.731, -0.46]}>
            <cylinderGeometry args={[0.015, 0.018, 0.034, 12]} />
            <PMat color="#9aa0a8" metal={0.8} rough={0.5} e={0.05} />
          </mesh>
          <mesh position={[x, 0.736, -0.46]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.021, 0.006, 6, 14]} />
            <PMat m="steel" rough={0.4} />
          </mesh>
          {/* clamp pinch bolt */}
          <mesh position={[x, 0.736, -0.487]}>
            <boxGeometry args={[0.024, 0.008, 0.012]} />
            <PMat m="zincGold" />
          </mesh>
        </group>
      ))}
      <Tube
        path={[
          [1.54, 0.73, -0.478],
          [1.51, 0.7, -0.53],
          [1.49, 0.63, -0.58],
        ]}
        r={0.011}
        seg={12}
        radial={8}
      >
        <PMat color="#8c2f2f" metal={0.05} rough={0.85} e={0.08} />
      </Tube>
      <Tube
        path={[
          [1.7, 0.73, -0.478],
          [1.73, 0.7, -0.53],
          [1.76, 0.64, -0.58],
        ]}
        r={0.011}
        seg={12}
        radial={8}
      >
        <PMat color="#17191d" metal={0.05} rough={0.85} e={0.04} />
      </Tube>
      {/* hold-down bracket bar across the top with 2 J-bolts */}
      <mesh position={[1.62, 0.72, -0.555]}>
        <boxGeometry args={[0.34, 0.012, 0.032]} />
        <PMat m="steel" rough={0.45} />
      </mesh>
      {([1.47, 1.77] as const).map((x) => (
        <group key={`jb${x}`}>
          <mesh position={[x, 0.655, -0.555]}>
            <cylinderGeometry args={[0.005, 0.005, 0.145, 8]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh position={[x, 0.731, -0.555]}>
            <cylinderGeometry args={[0.009, 0.009, 0.012, 6]} />
            <PMat m="zincGold" />
          </mesh>
          {/* J-hook toward the tray */}
          <mesh position={[x + Math.sign(1.62 - x) * 0.012, 0.585, -0.55]}>
            <boxGeometry args={[0.022, 0.01, 0.016]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
        </group>
      ))}
    </PartGroup>
  )
}

/* ================================== ECU =================================== */

/** 6 heat-sink fin strips along the lid */
const ECU_FIN_X = Array.from({ length: 6 }, (_, i) => -0.0625 + i * 0.025)
const ECU_LOOM: V3[] = [
  [1.43, 0.628, 0.444],
  [1.37, 0.61, 0.4],
  [1.31, 0.56, 0.37],
]

export function EcuMini() {
  return (
    <PartGroup id="ecu" explode={[0.4, 0.9, 0.7]}>
      {/* finned aluminum box (original 0.22×0.06×0.16 @ 1.58,0.63,0.48) */}
      <RBox args={[0.22, 0.06, 0.16]} radius={0.01} smoothness={2} position={[1.58, 0.63, 0.48]}>
        <PMat m="castAlu" />
      </RBox>
      {ECU_FIN_X.map((fx) => (
        <mesh key={`fin${fx}`} position={[1.58 + fx, 0.667, 0.48]}>
          <boxGeometry args={[0.016, 0.018, 0.14]} />
          <PMat m="machAlu" e={0.06} />
        </mesh>
      ))}
      {/* connector block with 2 keyed bays */}
      <RBox args={[0.045, 0.052, 0.15]} radius={0.008} smoothness={2} position={[1.455, 0.628, 0.48]}>
        <PMat m="blackCast" color="#23262b" />
      </RBox>
      {([-0.036, 0.036] as const).map((dz) => (
        <group key={`bay${dz}`}>
          <mesh position={[1.432, 0.628, 0.48 + dz]}>
            <boxGeometry args={[0.018, 0.036, 0.058]} />
            <PMat color="#4a505b" metal={0.3} rough={0.6} e={0.05} />
          </mesh>
          {/* key notch */}
          <mesh position={[1.423, 0.65, 0.48 + dz]}>
            <boxGeometry args={[0.006, 0.008, 0.024]} />
            <PMat m="zincGold" e={0.08} />
          </mesh>
        </group>
      ))}
      {/* wiring loom exiting the connector */}
      <Tube path={ECU_LOOM} r={0.016} seg={12} radial={8}>
        <PMat m="rubber" />
      </Tube>
      {/* 2 mounting ears with bolts */}
      {([-0.05, 0.05] as const).map((dz) => (
        <group key={`ear${dz}`}>
          <mesh position={[1.703, 0.607, 0.48 + dz]}>
            <boxGeometry args={[0.04, 0.01, 0.04]} />
            <PMat m="castAlu" />
          </mesh>
          <Bolt position={[1.703, 0.612, 0.48 + dz]} r={0.006} len={0.02} m="zincGold" />
        </group>
      ))}
    </PartGroup>
  )
}

/* =============================== FUEL TANK ================================ */

const FUEL_LINE: V3[] = [
  [-0.82, 0.452, 0.15],
  [-0.6, 0.43, 0.19],
  [0.1, 0.4, 0.19],
  [0.9, 0.4, 0.18],
]
const FILLER: V3[] = [
  [-1.15, 0.37, -0.25],
  [-1.27, 0.46, -0.4],
  [-1.36, 0.58, -0.5],
]

export function FuelTankMini() {
  const capQ = useMemo(() => quatY([-0.09, 0.12, -0.1]), [])
  return (
    <PartGroup id="fueltank" explode={[-0.4, 0.8, 0.5]}>
      {/* blow-molded shell: lower slab + two saddle lobes (hump over the driveshaft) */}
      <RBox args={[0.72, 0.15, 0.85]} radius={0.04} smoothness={3} position={[-0.85, 0.27, 0]}>
        <PMat color={HDPE} metal={0.1} rough={0.75} e={0.05} />
      </RBox>
      {([-0.235, 0.235] as const).map((z) => (
        <RBox
          key={`lobe${z}`}
          args={[0.64, 0.11, 0.34]}
          radius={0.035}
          smoothness={3}
          position={[-0.85, 0.36, z]}
        >
          <PMat color={HDPE} metal={0.1} rough={0.75} e={0.05} />
        </RBox>
      ))}
      {/* 2 steel straps wrapping under the tank */}
      {([-1.05, -0.65] as const).map((x) => (
        <group key={`strap${x}`}>
          <mesh position={[x, 0.188, 0]}>
            <boxGeometry args={[0.05, 0.01, 0.92]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          {([-1, 1] as const).map((s) => (
            <group key={`se${s}`}>
              <mesh position={[x, 0.263, s * 0.447]} rotation={[-s * 0.14, 0, 0]}>
                <boxGeometry args={[0.05, 0.16, 0.011]} />
                <PMat m="steel" rough={0.45} />
              </mesh>
              <mesh position={[x, 0.345, s * 0.462]}>
                <boxGeometry args={[0.05, 0.02, 0.034]} />
                <PMat m="steel" rough={0.45} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* pump flange + lock ring + outlet (original nub @ −0.85,0.43,0.15) */}
      <mesh position={[-0.85, 0.423, 0.15]}>
        <cylinderGeometry args={[0.065, 0.065, 0.016, 20]} />
        <PMat m="machAlu" />
      </mesh>
      <mesh position={[-0.85, 0.432, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.067, 0.009, 6, 20]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      <mesh position={[-0.82, 0.443, 0.15]}>
        <cylinderGeometry args={[0.011, 0.011, 0.022, 10]} />
        <PMat m="brass" />
      </mesh>
      {/* fuel line running forward to the engine bay (original ends @ 0.9,0.4,0.18) */}
      <Tube path={FUEL_LINE} r={0.012} seg={20} radial={8}>
        <PMat m="steel" rough={0.4} />
      </Tube>
      {/* filler neck angling up/outboard to the rear fender + cap */}
      <Tube path={FILLER} r={0.032} seg={14} radial={10}>
        <PMat m="steel" color="#8d99ae" />
      </Tube>
      <group position={[-1.37, 0.6, -0.51]} quaternion={capQ}>
        <mesh>
          <cylinderGeometry args={[0.042, 0.042, 0.02, 16]} />
          <PMat m="machAlu" />
        </mesh>
      </group>
      {/* small heat shield plate under the tank */}
      <RBox args={[0.45, 0.01, 0.5]} radius={0.004} smoothness={2} position={[-0.85, 0.168, 0.1]}>
        <PMat m="machAlu" e={0.04} rough={0.35} />
      </RBox>
    </PartGroup>
  )
}

/* ============================== CHASSIS FRAME ============================= */

const RAIL_Z = [-0.5, 0.5] as const
const HOLE_X = [-1.2, -0.4, 0.4, 1.2] as const
const CROSS_X = [-1.6, -0.6, 0.4, 1.6] as const

export function ChassisFrameMini() {
  /* lightening holes: 4 dark dots on each rail face */
  const holes = useMemo(() => {
    const out: { p: V3; ry: number }[] = []
    for (const zr of RAIL_Z)
      for (const f of [1, -1] as const)
        for (const x of HOLE_X)
          out.push({ p: [x, 0.22, zr + f * 0.0365], ry: f === 1 ? 0 : Math.PI })
    return out
  }, [])
  /* 2 bolt dots on each crossmember end flange */
  const flangeBolts = useMemo(() => {
    const out: V3[] = []
    for (const x of CROSS_X)
      for (const s of [1, -1] as const)
        for (const dx of [-0.035, 0.035] as const) out.push([x + dx, 0.22, s * 0.468])
    return out
  }, [])
  /* crush-can pair behind each bumper beam */
  const cans = useMemo(
    () =>
      ([2.05, -2.05] as const).flatMap((bx) =>
        ([0.42, -0.42] as const).map((z) => [bx - Math.sign(bx) * 0.075, 0.3, z] as V3),
      ),
    [],
  )
  return (
    <PartGroup id="chassisframe">
      {/* boxed rails (original rails y 0.22, z ±0.5, length 3.9) */}
      {RAIL_Z.map((z) => (
        <RBox key={`rail${z}`} args={[3.9, 0.09, 0.07]} radius={0.012} smoothness={2} position={[0, 0.22, z]}>
          <PMat m="blackCast" color="#30353d" />
        </RBox>
      ))}
      {holes.map((h, i) => (
        <mesh key={`h${i}`} position={h.p} rotation={[0, h.ry, 0]}>
          <circleGeometry args={[0.018, 12]} />
          <PMat color="#121419" e={0.01} metal={0.1} rough={0.9} />
        </mesh>
      ))}
      {/* crossmembers with flanged ends (original x −1.6/−0.6/0.4/1.6) */}
      {CROSS_X.map((x) => (
        <group key={`cm${x}`}>
          <mesh position={[x, 0.22, 0]}>
            <boxGeometry args={[0.07, 0.06, 0.92]} />
            <PMat m="steel" color="#6f7680" rough={0.5} />
          </mesh>
          {([-1, 1] as const).map((s) => (
            <mesh key={`fl${s}`} position={[x, 0.22, s * 0.462]}>
              <boxGeometry args={[0.12, 0.1, 0.016]} />
              <PMat m="steel" color="#7d848f" rough={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      {flangeBolts.map((p, i) => (
        <mesh key={`fb${i}`} position={p} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.014, 6]} />
          <PMat m="zincGold" />
        </mesh>
      ))}
      {/* bumper beams (original ±2.05, 0.34) + ribbed crush-can pairs behind */}
      {([2.05, -2.05] as const).map((x) => (
        <RBox key={`bb${x}`} args={[0.08, 0.1, 1.3]} radius={0.015} smoothness={2} position={[x, 0.34, 0]}>
          <PMat m="steel" color="#596069" rough={0.5} />
        </RBox>
      ))}
      {cans.map((p, i) => (
        <group key={`can${i}`} position={p}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.034, 0.034, 0.09, 14]} />
            <PMat m="steel" rough={0.5} />
          </mesh>
          {([-0.025, 0.025] as const).map((dx) => (
            <mesh key={`rr${dx}`} position={[dx, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.036, 0.005, 6, 14]} />
              <PMat m="steel" rough={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      {/* front subframe hint under the engine bay */}
      {([-0.44, 0.44] as const).map((z) => (
        <mesh key={`sf${z}`} position={[1.3, 0.165, z]}>
          <boxGeometry args={[0.56, 0.045, 0.055]} />
          <PMat m="blackCast" color="#282d34" />
        </mesh>
      ))}
      {([1.05, 1.55] as const).map((x) => (
        <mesh key={`sfc${x}`} position={[x, 0.165, 0]}>
          <boxGeometry args={[0.05, 0.04, 0.96]} />
          <PMat m="blackCast" color="#282d34" />
        </mesh>
      ))}
      {([1.05, 1.55] as const).flatMap((x) =>
        ([-0.47, 0.47] as const).map((z) => (
          <mesh key={`mt${x}${z}`} position={[x, 0.2, z]}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
            <PMat m="rubber" />
          </mesh>
        )),
      )}
    </PartGroup>
  )
}
