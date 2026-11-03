/**
 * HvacView.tsx — big-stage teardown of the climate system (HVC-01).
 *
 *   hvc-compressor — scroll compressor: ribbed barrel, poly-V pulley, clutch
 *                    drive plate floating off its air gap, copper coil ring,
 *                    fat suction + thin discharge ports
 *   hvc-condenser  — microchannel slab w/ fin strips + flat tube lines,
 *                    header tanks, receiver-drier bottle w/ sight glass
 *   hvc-evaporator — frost-tinted plate-fin brick, angled, TXV block with
 *                    sensing bulb + capillary, condensate drain pan
 *   hvc-blower     — squirrel cage (20 vanes) inside a scroll, PWM motor,
 *                    pleated cabin-filter cartridge floating alongside
 *   hvc-heater     — small brazed core, plastic tanks, supply/return hose
 *                    stubs with spring clamps
 *   hvc-ducts      — translucent distribution box, 2 blend-door flaps on
 *                    servo cranks, defrost/face/floor mode stubs
 *
 * Stage centered (0, 0.7, 0) within ±1.2; explode is radial from that center.
 * The compressor's own children (cmp-scroll / cmp-clutch) get no geometry
 * here — the node dismantles further in data and the camera falls back
 * gracefully. Every material is <PMat/>; segments ≤ 40; ≈45k tris.
 * No textures, no useFrame.
 */
import * as THREE from 'three'
import { PartGroup } from '../lib'
import { PMat, Lathe, Tube, RBox, Bolt, BoltCircle } from '../realism'

type V3 = [number, number, number]

/* --------------------------------- palette -------------------------------- */
const FROST = '#bfe6f2' // frost-blue evaporator skin
const FROST_HAZE = '#dff4fb' // translucent frost overlay
const PP = '#23262b' // polypropylene moldings
const PP_LITE = '#31363e' // duct case
const PLEAT = '#e8e2d4' // filter paper
const COIL_CU = '#b5713f' // clutch coil copper
const SERVO = '#30353c'
const TANK_PA = '#1d3a45' // heater tank plastic (matches radiator stage)

/* ------------------------- station base positions -------------------------- */
const CMP: V3 = [-0.8, 0.42, 0.3]
const CND: V3 = [-0.75, 0.95, -0.25]
const EVP: V3 = [0.05, 0.6, 0.15]
const BLW: V3 = [0.78, 0.48, 0.35]
const HTR: V3 = [0.6, 0.95, -0.35]
const DCT: V3 = [0, 1.08, -0.35]

/* ------------------------------ shared arrays ------------------------------ */
/** condenser vertical fin strips (local x) */
const CND_FIN_X = Array.from({ length: 12 }, (_, i) => -0.247 + i * 0.045)
/** condenser horizontal microchannel tube lines (local y) */
const CND_TUBE_Y = Array.from({ length: 7 }, (_, i) => -0.15 + i * 0.05)
/** evaporator plate lines (local x) */
const EVP_PLATE_X = Array.from({ length: 9 }, (_, i) => -0.16 + i * 0.04)
/** squirrel cage vane angles */
const VANE_A = Array.from({ length: 20 }, (_, i) => (i / 20) * Math.PI * 2)
/** filter pleat plate x centers */
const FLT_PLEAT_X = Array.from({ length: 10 }, (_, i) => -0.121 + i * 0.027)
/** heater fin strips (local x) */
const HTR_FIN_X = Array.from({ length: 7 }, (_, i) => -0.105 + i * 0.035)
/** compressor hoop rib x stations */
const CMP_RIB_X = [-0.09, -0.02, 0.05, 0.12] as const
/** blend doors: shaft x offset + flap angle */
const DOORS = [
  { x: -0.14, a: 0.65 },
  { x: 0.12, a: -0.45 },
] as const

/* ================================ view ==================================== */

export function HvacViewReal() {
  return (
    <group>
      {/* =============== COMPRESSOR — scroll barrel + clutch front =========== */}
      <PartGroup id="hvc-compressor" explode={[-0.9, -0.35, 0.4]}>
        <group position={CMP}>
          {/* barrel, axis X (lathe +Y spun onto +X) */}
          <Lathe
            seg={36}
            rotation={[0, 0, -Math.PI / 2]}
            pts={[
              [0.11, -0.19],
              [0.165, -0.15],
              [0.17, -0.05],
              [0.17, 0.05],
              [0.165, 0.15],
              [0.12, 0.19],
            ]}
          >
            <PMat m="castAlu" />
          </Lathe>
          {/* hoop ribs — die-cast housing stiffeners */}
          {CMP_RIB_X.map((x) => (
            <mesh key={`rib${x}`} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.171, 0.006, 6, 32]} />
              <PMat m="castAlu" />
            </mesh>
          ))}
          {/* rear head + bolt circle */}
          <mesh position={[0.195, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.125, 0.125, 0.03, 32]} />
            <PMat m="machAlu" />
          </mesh>
          <BoltCircle
            n={6}
            radius={0.135}
            r={0.008}
            len={0.025}
            m="steel"
            position={[0.2, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
          />
          {/* port manifold on top: FAT suction + thin discharge (the teaching pair) */}
          <RBox args={[0.14, 0.05, 0.1]} radius={0.01} smoothness={2} position={[0.04, 0.185, 0]}>
            <PMat m="machAlu" />
          </RBox>
          <mesh position={[0.0, 0.225, 0.02]}>
            <cylinderGeometry args={[0.034, 0.034, 0.05, 18]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0.085, 0.225, -0.02]}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 14]} />
            <PMat m="machAlu" />
          </mesh>
          <Bolt position={[0.045, 0.21, 0.04]} r={0.007} len={0.03} m="zincGold" />
          {/* mounting lugs below */}
          {([-0.08, 0.1] as const).map((x) => (
            <group key={`lug${x}`}>
              <RBox args={[0.05, 0.06, 0.04]} radius={0.008} smoothness={2} position={[x, -0.185, 0]}>
                <PMat m="castAlu" />
              </RBox>
              <Bolt position={[x, -0.2, 0]} rotation={[Math.PI, 0, 0]} r={0.009} len={0.035} m="zincGold" />
            </group>
          ))}
          {/* coil ring peeking behind the pulley — the electromagnet */}
          <mesh position={[-0.19, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.095, 0.02, 10, 32]} />
            <PMat color={COIL_CU} metal={0.9} rough={0.45} e={0.06} />
          </mesh>
          <mesh position={[-0.195, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.13, 0.025, 32, 1, true]} />
            <PMat m="steel" rough={0.5} side={THREE.DoubleSide} />
          </mesh>
          {/* poly-V pulley with groove rings */}
          <mesh position={[-0.225, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.135, 0.135, 0.055, 36]} />
            <PMat m="steel" rough={0.4} />
          </mesh>
          {([-0.016, 0, 0.016] as const).map((dx) => (
            <mesh key={`gr${dx}`} position={[-0.225 + dx, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.137, 0.004, 6, 36]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* clutch drive plate floating OFF its 0.5 mm air gap (exaggerated) */}
          <mesh position={[-0.272, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 0.012, 32]} />
            <PMat m="steel" rough={0.35} />
          </mesh>
          {VANE_A.filter((_, i) => i % 7 === 0).map((a) => (
            <group key={`spk${a}`} rotation={[a, 0, 0]}>
              <mesh position={[-0.282, 0.055, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.012, 0.008, 0.028]} />
                <PMat m="steel" rough={0.4} />
              </mesh>
            </group>
          ))}
          {/* hub + shaft nut on the plate */}
          <mesh position={[-0.29, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.025, 20]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[-0.305, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.016, 0.016, 0.012, 6]} />
            <PMat m="zincGold" />
          </mesh>
        </group>
      </PartGroup>

      {/* ============ CONDENSER — microchannel slab + receiver-drier ========= */}
      <PartGroup id="hvc-condenser" explode={[-0.85, 0.35, -0.6]}>
        <group position={CND}>
          {/* core slab, face +Z */}
          <mesh>
            <boxGeometry args={[0.56, 0.4, 0.05]} />
            <PMat color="#3a4149" metal={0.6} rough={0.55} e={0.04} />
          </mesh>
          {/* vertical fin strips */}
          {CND_FIN_X.map((x) => (
            <mesh key={`fin${x}`} position={[x, 0, 0.028]}>
              <boxGeometry args={[0.014, 0.37, 0.006]} />
              <PMat m="machAlu" e={0.1} />
            </mesh>
          ))}
          {/* flat microchannel tube lines crossing the fins */}
          {CND_TUBE_Y.map((y) => (
            <mesh key={`tb${y}`} position={[0, y, 0.032]}>
              <boxGeometry args={[0.54, 0.011, 0.004]} />
              <PMat m="machAlu" color="#9fa8b4" e={0.06} />
            </mesh>
          ))}
          {/* header tanks at both ends */}
          {([-0.295, 0.295] as const).map((x) => (
            <mesh key={`hd${x}`} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.032, 0.032, 0.44, 20]} />
              <PMat m="machAlu" />
            </mesh>
          ))}
          {/* receiver-drier bottle + sight glass + brackets */}
          <mesh position={[0.36, -0.06, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.24, 20]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0.36, 0.065, 0]}>
            <sphereGeometry args={[0.035, 16, 10]} />
            <PMat m="machAlu" />
          </mesh>
          <mesh position={[0.36, 0.02, 0.034]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.012, 12]} />
            <PMat color="#8fd4b0" e={0.25} metal={0.2} rough={0.2} opacity={0.8} />
          </mesh>
          {([-0.12, 0.0] as const).map((y) => (
            <mesh key={`bk${y}`} position={[0.33, y, 0]}>
              <boxGeometry args={[0.03, 0.012, 0.05]} />
              <PMat m="steel" rough={0.45} />
            </mesh>
          ))}
          {/* hot gas IN (top), liquid OUT (bottom, thinner — teaching) */}
          <Tube
            path={[
              [-0.295, 0.23, 0],
              [-0.34, 0.28, 0.04],
              [-0.4, 0.3, 0.08],
            ]}
            r={0.014}
            seg={10}
            radial={10}
          >
            <PMat m="machAlu" />
          </Tube>
          <Tube
            path={[
              [0.36, -0.185, 0],
              [0.4, -0.24, 0.04],
              [0.44, -0.27, 0.08],
            ]}
            r={0.009}
            seg={10}
            radial={8}
          >
            <PMat m="machAlu" />
          </Tube>
        </group>
      </PartGroup>

      {/* ============ EVAPORATOR + TXV — frosted brick, angled ================ */}
      <PartGroup id="hvc-evaporator" explode={[0.1, -0.2, 0.95]}>
        <group position={EVP} rotation={[-0.28, 0.3, 0]}>
          {/* plate-fin brick */}
          <mesh>
            <boxGeometry args={[0.44, 0.3, 0.1]} />
            <PMat color={FROST} metal={0.55} rough={0.45} e={0.1} />
          </mesh>
          {/* plate edge lines on the face */}
          {EVP_PLATE_X.map((x) => (
            <mesh key={`pl${x}`} position={[x, 0, 0.052]}>
              <boxGeometry args={[0.012, 0.28, 0.005]} />
              <PMat m="machAlu" color="#d6ecf4" e={0.12} />
            </mesh>
          ))}
          {/* u-bend returns along the top edge */}
          {EVP_PLATE_X.filter((_, i) => i % 2 === 0).map((x) => (
            <mesh key={`ub${x}`} position={[x + 0.02, 0.152, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.018, 0.007, 6, 14, Math.PI]} />
              <PMat m="machAlu" color="#c9e4ee" />
            </mesh>
          ))}
          {/* translucent frost haze wrapping the brick */}
          <mesh renderOrder={2}>
            <boxGeometry args={[0.46, 0.32, 0.12]} />
            <PMat color={FROST_HAZE} metal={0.1} rough={0.6} e={0.14} opacity={0.18} depthWrite={false} />
          </mesh>
          {/* TXV block on the inlet side */}
          <group position={[-0.27, 0.05, 0.02]}>
            <RBox args={[0.07, 0.11, 0.06]} radius={0.008} smoothness={2}>
              <PMat m="brass" />
            </RBox>
            {/* thin liquid line in (bottom), FAT suction out (top) */}
            <mesh position={[-0.055, -0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.009, 0.009, 0.06, 10]} />
              <PMat m="machAlu" />
            </mesh>
            <mesh position={[-0.065, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, 0.08, 14]} />
              <PMat m="machAlu" />
            </mesh>
            {/* sensing bulb strapped to the suction line + capillary back to the head */}
            <mesh position={[-0.095, 0.062, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.011, 0.011, 0.045, 12]} />
              <PMat m="copper" />
            </mesh>
            <Tube
              path={[
                [-0.095, 0.072, 0],
                [-0.06, 0.09, 0.02],
                [-0.01, 0.075, 0.03],
                [0, 0.058, 0.01],
              ]}
              r={0.0035}
              seg={12}
              radial={6}
            >
              <PMat m="copper" />
            </Tube>
            <Bolt position={[0, 0.06, 0.032]} rotation={[Math.PI / 2, 0, 0]} r={0.006} len={0.02} washer={false} m="steel" />
          </group>
          {/* condensate drain pan + drain stub below */}
          <RBox args={[0.46, 0.022, 0.16]} radius={0.006} smoothness={2} position={[0, -0.175, 0]}>
            <PMat color={PP} metal={0.2} rough={0.7} e={0.04} />
          </RBox>
          <Tube
            path={[
              [0.1, -0.185, 0],
              [0.12, -0.24, 0.02],
              [0.13, -0.29, 0.05],
            ]}
            r={0.011}
            seg={8}
            radial={8}
          >
            <PMat m="rubber" />
          </Tube>
        </group>
      </PartGroup>

      {/* ====== BLOWER — squirrel cage in a scroll + pleated cabin filter ===== */}
      <PartGroup id="hvc-blower" explode={[0.95, -0.3, 0.5]}>
        <group position={BLW}>
          {/* squirrel cage: 20 forward-curved vanes, axis Y */}
          {VANE_A.map((a) => (
            <group key={`vn${a}`} rotation={[0, a, 0]}>
              <mesh position={[0.115, 0, 0]} rotation={[0, 0.5, 0]}>
                <boxGeometry args={[0.008, 0.13, 0.034]} />
                <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
              </mesh>
            </group>
          ))}
          {/* cage rings top + bottom, hub disc */}
          {([0.068, -0.068] as const).map((y) => (
            <mesh key={`rg${y}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.122, 0.008, 6, 36]} />
              <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
            </mesh>
          ))}
          <mesh position={[0, -0.072, 0]}>
            <cylinderGeometry args={[0.122, 0.122, 0.01, 32]} />
            <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
          </mesh>
          {/* scroll (volute) wall around the cage, outlet gap to -Z */}
          <mesh rotation={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.168, 0.168, 0.17, 36, 1, true, 0, Math.PI * 1.62]} />
            <PMat color={PP} metal={0.2} rough={0.7} e={0.05} side={THREE.DoubleSide} />
          </mesh>
          {/* rectangular outlet stub where the scroll opens */}
          <RBox args={[0.13, 0.16, 0.14]} radius={0.012} smoothness={2} position={[0.1, 0, -0.19]}>
            <PMat color={PP} metal={0.2} rough={0.7} e={0.05} />
          </RBox>
          {/* intake bell on top */}
          <Lathe
            seg={32}
            position={[0, 0.09, 0]}
            pts={[
              [0.07, 0],
              [0.075, 0.012],
              [0.09, 0.032],
              [0.118, 0.052],
            ]}
          >
            <PMat color={PP} metal={0.2} rough={0.7} e={0.05} side={THREE.DoubleSide} />
          </Lathe>
          {/* PWM motor below: can + end cap + cooling snorkel */}
          <mesh position={[0, -0.13, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 20]} />
            <PMat m="steel" rough={0.45} />
          </mesh>
          <mesh position={[0, -0.186, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.016, 16]} />
            <PMat m="blackCast" />
          </mesh>
          <Tube
            path={[
              [0.045, -0.17, 0],
              [0.09, -0.15, 0.03],
              [0.13, -0.1, 0.06],
            ]}
            r={0.012}
            seg={10}
            radial={8}
          >
            <PMat m="rubber" />
          </Tube>
          {/* connector block */}
          <RBox args={[0.04, 0.025, 0.03]} radius={0.004} smoothness={2} position={[-0.06, -0.15, 0]}>
            <PMat m="rubber" color="#23262b" />
          </RBox>
          {/* cabin-filter cartridge floating beside the intake */}
          <group position={[0, 0.33, 0.02]} rotation={[0, 0, 0.08]}>
            <RBox args={[0.3, 0.026, 0.2]} radius={0.008} smoothness={2}>
              <PMat m="rubber" />
            </RBox>
            {FLT_PLEAT_X.map((x) => (
              <mesh key={`plt${x}`} position={[x, 0.045, 0]}>
                <boxGeometry args={[0.011, 0.065, 0.18]} />
                <PMat color={PLEAT} e={0.05} rough={0.9} metal={0} env={0.25} />
              </mesh>
            ))}
            {/* activated-carbon underlayer hint */}
            <mesh position={[0, 0.016, 0]}>
              <boxGeometry args={[0.28, 0.006, 0.18]} />
              <PMat color="#1c1f24" metal={0.1} rough={0.9} e={0.02} />
            </mesh>
          </group>
        </group>
      </PartGroup>

      {/* ========== HEATER CORE — little brazed radiator + hose stubs ========= */}
      <PartGroup id="hvc-heater" explode={[0.75, 0.35, -0.65]}>
        <group position={HTR}>
          {/* core slab */}
          <mesh>
            <boxGeometry args={[0.3, 0.22, 0.045]} />
            <PMat color="#3a4149" metal={0.6} rough={0.55} e={0.04} />
          </mesh>
          {HTR_FIN_X.map((x) => (
            <mesh key={`fin${x}`} position={[x, 0, 0.025]}>
              <boxGeometry args={[0.012, 0.2, 0.005]} />
              <PMat m="machAlu" e={0.1} />
            </mesh>
          ))}
          {/* plastic end tanks */}
          {([-0.165, 0.165] as const).map((x) => (
            <RBox key={`tk${x}`} args={[0.04, 0.24, 0.055]} radius={0.01} smoothness={2} position={[x, 0, 0]}>
              <PMat m="nylon" color={TANK_PA} e={0.06} rough={0.6} metal={0.15} />
            </RBox>
          ))}
          {/* supply + return pipes → EPDM hose stubs w/ spring clamps */}
          {([0.06, -0.06] as const).map((y, i) => (
            <group key={`hp${y}`}>
              <mesh position={[0.2, y, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.016, 0.016, 0.07, 12]} />
                <PMat m="machAlu" />
              </mesh>
              <Tube
                path={[
                  [0.24, y, 0],
                  [0.31, y + 0.02, i === 0 ? 0.04 : -0.03],
                  [0.37, y + 0.05, i === 0 ? 0.08 : -0.06],
                ]}
                r={0.021}
                seg={12}
                radial={10}
              >
                <PMat m="rubber" />
              </Tube>
              <mesh position={[0.25, y + 0.002, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.025, 0.005, 6, 16]} />
                <PMat m="polSteel" />
              </mesh>
            </group>
          ))}
        </group>
      </PartGroup>

      {/* ===== DUCT BOX — translucent case, 2 blend doors on servo cranks ===== */}
      <PartGroup id="hvc-ducts" explode={[0, 0.8, -0.8]}>
        <group position={DCT}>
          {/* blend doors + servos first (case drawn over them, renderOrder 3) */}
          {DOORS.map(({ x, a }) => (
            <group key={`dr${x}`} position={[x, 0, 0]}>
              {/* shaft through the case, axis Z */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.009, 0.009, 0.36, 10]} />
                <PMat m="polSteel" />
              </mesh>
              {/* flap + EPDM foam edge seal */}
              <group rotation={[0, 0, a]}>
                <mesh position={[0.09, 0, 0]}>
                  <boxGeometry args={[0.18, 0.012, 0.26]} />
                  <PMat color="#3b424c" metal={0.3} rough={0.6} e={0.06} />
                </mesh>
                <mesh position={[0.184, 0, 0]}>
                  <boxGeometry args={[0.014, 0.02, 0.26]} />
                  <PMat m="rubber" />
                </mesh>
              </group>
              {/* servo pod + crank arm + link rod on the front shaft end */}
              <group position={[0, 0, 0.185]}>
                <RBox args={[0.07, 0.07, 0.035]} radius={0.008} smoothness={2} position={[0, -0.08, 0.012]}>
                  <PMat color={SERVO} metal={0.3} rough={0.65} e={0.05} />
                </RBox>
                <mesh position={[0, -0.04, 0.014]}>
                  <boxGeometry args={[0.013, 0.075, 0.009]} />
                  <PMat m="machAlu" />
                </mesh>
                <mesh position={[0, 0, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.02, 12]} />
                  <PMat color={SERVO} metal={0.3} rough={0.65} e={0.05} />
                </mesh>
                {/* servo connector nub */}
                <RBox args={[0.028, 0.02, 0.022]} radius={0.004} smoothness={2} position={[0.045, -0.095, 0.012]}>
                  <PMat m="rubber" color="#23262b" />
                </RBox>
              </group>
            </group>
          ))}
          {/* mode stubs: defrost (up), face (front), floor (down) */}
          <RBox args={[0.18, 0.06, 0.1]} radius={0.012} smoothness={2} position={[0, 0.18, 0]}>
            <PMat color={PP_LITE} metal={0.2} rough={0.7} e={0.05} />
          </RBox>
          <RBox args={[0.14, 0.09, 0.06]} radius={0.012} smoothness={2} position={[0.08, 0.05, 0.18]}>
            <PMat color={PP_LITE} metal={0.2} rough={0.7} e={0.05} />
          </RBox>
          <RBox args={[0.1, 0.07, 0.08]} radius={0.012} smoothness={2} position={[-0.18, -0.17, 0.05]}>
            <PMat color={PP_LITE} metal={0.2} rough={0.7} e={0.05} />
          </RBox>
          {/* recirc inlet ring on the -X end */}
          <mesh position={[-0.31, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 24, 1, true]} />
            <PMat color={PP_LITE} metal={0.2} rough={0.7} e={0.05} side={THREE.DoubleSide} />
          </mesh>
          {/* translucent clamshell case — doors visible inside */}
          <RBox args={[0.6, 0.3, 0.32]} radius={0.03} smoothness={3} renderOrder={3}>
            <PMat color={PP_LITE} metal={0.2} rough={0.6} e={0.06} opacity={0.3} depthWrite={false} />
          </RBox>
          {/* clamshell weld-seam band around the waist */}
          <mesh renderOrder={3}>
            <boxGeometry args={[0.612, 0.012, 0.332]} />
            <PMat color={PP} metal={0.2} rough={0.7} e={0.05} opacity={0.55} depthWrite={false} />
          </mesh>
        </group>
      </PartGroup>
    </group>
  )
}
