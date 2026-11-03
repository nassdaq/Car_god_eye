/**
 * HvacMini.tsx — compact REAL miniature of the climate system at CAR coords,
 * one PartGroup id="hvac":
 *
 *   dash unit    — HVAC box at the firewall (≈0.72, 0.62, 0.1) with blower
 *                  snail bulge, defrost stubs, TXV block + condensate drain
 *   heater hoses — two thin EPDM Tubes w/ spring clamps running to the
 *                  engine bay (+x)
 *   compressor   — hint low on the engine side (≈1.05, 0.35, 0.3): barrel,
 *                  poly-V pulley, clutch plate
 *   refrigerant  — the teaching pair: one FAT insulated suction line (cold
 *                  vapor back to the compressor), thin high-pressure lines
 *                  (hot gas to the condenser, liquid forward to the TXV)
 *   condenser    — slim slab sandwiched just behind the radiator (≈1.9, 0.5, 0),
 *                  thin along x, face-parallel to the radiator core + drier
 *
 * Everything stays under the hood/dash line (y < 0.8). Every material is
 * <PMat/>; segments ≤ 20; ≈4–6k tris. No textures, no useFrame.
 */
import { PartGroup } from '../lib'
import { PMat, Tube, RBox } from '../realism'

type V3 = [number, number, number]

/* --------------------------------- palette -------------------------------- */
const PP = '#23262b' // HVAC case polypropylene
const FROST = '#bfe6f2' // cold-side hint

/** condenser vertical fin strips (z stations on the slab face) */
const CND_FIN_Z = Array.from({ length: 8 }, (_, i) => -0.28 + i * 0.08)

/* ------------------------------- hose paths -------------------------------- */
/** heater supply + return: firewall → cylinder head (+x) */
const HEATER_FEED: V3[] = [
  [0.86, 0.68, -0.02],
  [1.0, 0.64, -0.04],
  [1.14, 0.58, -0.08],
]
const HEATER_RETURN: V3[] = [
  [0.86, 0.63, -0.1],
  [1.02, 0.58, -0.13],
  [1.16, 0.52, -0.16],
]
/** FAT low-pressure suction line — cold vapor crawling back to the compressor */
const SUCTION: V3[] = [
  [0.85, 0.54, 0.26],
  [0.94, 0.47, 0.3],
  [1.0, 0.39, 0.31],
]
/** thin high-pressure discharge — hot gas to the condenser top */
const DISCHARGE: V3[] = [
  [1.1, 0.4, 0.34],
  [1.4, 0.5, 0.32],
  [1.7, 0.62, 0.22],
  [1.87, 0.6, 0.12],
]
/** thin liquid line — condensed refrigerant forward to the TXV at the box */
const LIQUID: V3[] = [
  [1.87, 0.37, -0.14],
  [1.5, 0.38, -0.2],
  [1.1, 0.44, 0.0],
  [0.87, 0.5, 0.17],
]

export function HvacMini() {
  return (
    <PartGroup id="hvac" explode={[0.3, 1.0, 0.4]}>
      {/* --------------- HVAC unit at the firewall / dash area --------------- */}
      <RBox args={[0.3, 0.22, 0.35]} radius={0.025} smoothness={3} position={[0.72, 0.62, 0.1]}>
        <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
      </RBox>
      {/* blower snail bulge on the passenger side (+z), axis z + motor nub */}
      <mesh position={[0.76, 0.56, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.07, 18]} />
        <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
      </mesh>
      <mesh position={[0.76, 0.56, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.035, 12]} />
        <PMat m="steel" rough={0.45} />
      </mesh>
      {/* two defrost stubs on top of the case (stay under y < 0.8) */}
      {([-0.04, 0.14] as const).map((dz) => (
        <RBox key={`df${dz}`} args={[0.1, 0.035, 0.07]} radius={0.008} smoothness={2} position={[0.7, 0.748, 0.05 + dz]}>
          <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
        </RBox>
      ))}
      {/* cold-side window hint: frosted evaporator face peeking at the box edge */}
      <mesh position={[0.87, 0.58, 0.12]}>
        <boxGeometry args={[0.012, 0.14, 0.16]} />
        <PMat color={FROST} metal={0.4} rough={0.5} e={0.12} />
      </mesh>
      {/* TXV block where the liquid line lands */}
      <RBox args={[0.035, 0.05, 0.03]} radius={0.006} smoothness={2} position={[0.88, 0.52, 0.18]}>
        <PMat m="brass" />
      </RBox>
      {/* condensate drain dripping off the bottom — the summer puddle */}
      <Tube
        path={[
          [0.74, 0.51, 0.2],
          [0.76, 0.45, 0.22],
          [0.77, 0.4, 0.23],
        ]}
        r={0.006}
        seg={8}
        radial={6}
      >
        <PMat m="rubber" />
      </Tube>

      {/* -------- heater hoses to the engine bay (+x) w/ spring clamps ------- */}
      <Tube path={HEATER_FEED} r={0.014} seg={14} radial={8}>
        <PMat m="rubber" />
      </Tube>
      <Tube path={HEATER_RETURN} r={0.014} seg={14} radial={8}>
        <PMat m="rubber" />
      </Tube>
      {([HEATER_FEED[0], HEATER_RETURN[0]] as V3[]).map((p, i) => (
        <mesh key={`hc${i}`} position={[p[0] + 0.02, p[1] - 0.008, p[2] - 0.012]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.018, 0.004, 6, 12]} />
          <PMat m="polSteel" />
        </mesh>
      ))}

      {/* --------- compressor hint low on the engine side, axis x ------------ */}
      <mesh position={[1.07, 0.35, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.052, 0.052, 0.13, 16]} />
        <PMat m="castAlu" />
      </mesh>
      {/* poly-V pulley + groove ring + clutch plate on the front (+x is car front) */}
      <mesh position={[0.985, 0.35, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.058, 0.058, 0.028, 16]} />
        <PMat m="steel" rough={0.4} />
      </mesh>
      <mesh position={[0.985, 0.35, 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.06, 0.004, 6, 16]} />
        <PMat m="polSteel" />
      </mesh>
      <mesh position={[0.962, 0.35, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.042, 0.042, 0.01, 16]} />
        <PMat m="steel" rough={0.35} />
      </mesh>
      {/* mount bracket pad under the barrel */}
      <mesh position={[1.07, 0.295, 0.28]}>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <PMat m="castAlu" />
      </mesh>

      {/* --------------- refrigerant lines: liquid vs suction ----------------- */}
      {/* FAT insulated suction: cold vapor, big bore so the pump can breathe */}
      <Tube path={SUCTION} r={0.021} seg={14} radial={10}>
        <PMat m="rubber" color="#1b1e22" rough={0.9} />
      </Tube>
      {/* thin discharge: hot 17-bar gas up and over to the condenser */}
      <Tube path={DISCHARGE} r={0.011} seg={18} radial={8}>
        <PMat m="machAlu" />
      </Tube>
      {/* thin liquid line: high pressure needs no diameter — forward to the TXV */}
      <Tube path={LIQUID} r={0.008} seg={18} radial={8}>
        <PMat m="machAlu" />
      </Tube>

      {/* ------ condenser: slim slab just behind the radiator, x-thin --------- */}
      <mesh position={[1.9, 0.5, 0]}>
        <boxGeometry args={[0.035, 0.3, 0.72]} />
        <PMat color="#3a4149" metal={0.6} rough={0.55} e={0.04} />
      </mesh>
      {/* vertical fin strips on the engine-side face */}
      {CND_FIN_Z.map((z) => (
        <mesh key={`fin${z}`} position={[1.881, 0.5, z]}>
          <boxGeometry args={[0.005, 0.27, 0.014]} />
          <PMat m="machAlu" e={0.1} />
        </mesh>
      ))}
      {/* header tanks at both z ends */}
      {([-0.375, 0.375] as const).map((z) => (
        <RBox key={`hd${z}`} args={[0.045, 0.32, 0.035]} radius={0.012} smoothness={2} position={[1.9, 0.5, z]}>
          <PMat m="machAlu" />
        </RBox>
      ))}
      {/* receiver-drier bottle on the outlet header */}
      <mesh position={[1.9, 0.46, -0.42]}>
        <cylinderGeometry args={[0.022, 0.022, 0.17, 12]} />
        <PMat m="machAlu" />
      </mesh>
    </PartGroup>
  )
}
