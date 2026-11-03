/**
 * BodyMechMini.tsx — compact REAL miniature of the body-mechanisms system,
 * sitting at car coordinates in the root view:
 *
 *   - two wiper arms + blades lying at the windshield base (x≈1.05, z ±0.25)
 *   - washer bottle tucked into the engine-bay corner (1.5, 0.45, 0.55)
 *   - door latch block + window-regulator hint just inside the door side
 *     (around 0.3, 0.7, 0.8 — everything kept at |z| ≤ 0.82)
 *   - mirror motor-pod hint behind the body mirror (0.95, 0.87, 0.8)
 *
 * One PartGroup id="bodymech". Every material is <PMat/>; segments ≤ 16;
 * no textures, no useFrame. ≈4k tris.
 */
import { PartGroup } from '../lib'
import { PMat, Tube, RBox } from '../realism'

type V3 = [number, number, number]

const POM = '#d8cfae'
const BOTTLE = '#cfe4ec'
const FLUID = '#35a7dd'

/** washer hose creeping out of the bay corner toward the cowl */
const WASH_HOSE: V3[] = [
  [1.5, 0.56, 0.5],
  [1.38, 0.6, 0.42],
  [1.22, 0.66, 0.34],
]

export function BodyMechMini() {
  return (
    <PartGroup id="bodymech" explode={[0.2, 1.1, -0.4]}>
      {/* ------------- two wiper arms + blades at the windshield base ------------- */}
      {([0.25, -0.25] as const).map((z) => {
        const zs = Math.sign(z)
        return (
          <group key={`wp${z}`} position={[0.6, 0.778, z]} rotation={[0, zs * 0.18, -0.4]}>
            {/* pivot nub through the cowl */}
            <mesh position={[0, -0.012, 0]}>
              <cylinderGeometry args={[0.013, 0.016, 0.035, 10]} />
              <PMat m="blackCast" />
            </mesh>
            {/* arm head + arm running up the glass */}
            <RBox args={[0.05, 0.016, 0.018] as [number, number, number]} radius={0.004} smoothness={2} position={[-0.015, 0.008, 0]}>
              <PMat m="blackCast" />
            </RBox>
            <RBox args={[0.24, 0.009, 0.013] as [number, number, number]} radius={0.003} smoothness={2} position={[-0.15, 0.012, 0]}>
              <PMat m="blackCast" />
            </RBox>
            {/* blade crosswise at the arm tip: spine + rubber strip */}
            <group position={[-0.26, 0.008, 0]} rotation={[0, zs * 0.35, 0]}>
              <RBox args={[0.022, 0.011, 0.3] as [number, number, number]} radius={0.004} smoothness={2}>
                <PMat m="blackCast" color="#2b2f35" />
              </RBox>
              <RBox args={[0.012, 0.008, 0.29] as [number, number, number]} radius={0.002} smoothness={2} position={[0, -0.009, 0]}>
                <PMat m="rubber" />
              </RBox>
            </group>
          </group>
        )
      })}

      {/* -------------------- washer bottle in the bay corner -------------------- */}
      <group position={[1.5, 0.45, 0.55]}>
        {/* translucent bottle with visible fluid level */}
        <RBox args={[0.14, 0.2, 0.12] as [number, number, number]} radius={0.02} smoothness={2}>
          <PMat color={BOTTLE} metal={0} rough={0.3} env={0.8} opacity={0.32} depthWrite={false} />
        </RBox>
        <RBox args={[0.12, 0.09, 0.1] as [number, number, number]} radius={0.016} smoothness={2} position={[0, -0.045, 0]}>
          <PMat color={FLUID} metal={0} rough={0.3} env={0.5} opacity={0.5} depthWrite={false} e={0.12} />
        </RBox>
        {/* filler neck + blue cap */}
        <mesh position={[-0.03, 0.125, -0.02]}>
          <cylinderGeometry args={[0.016, 0.018, 0.05, 10]} />
          <PMat color={BOTTLE} metal={0} rough={0.35} env={0.6} opacity={0.45} depthWrite={false} />
        </mesh>
        <mesh position={[-0.03, 0.155, -0.02]}>
          <cylinderGeometry args={[0.021, 0.021, 0.014, 10]} />
          <PMat color="#1f5f8a" metal={0.2} rough={0.6} e={0.08} />
        </mesh>
        {/* pump pod on the wall + hose away toward the cowl jets */}
        <mesh position={[0.075, -0.05, -0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.04, 10]} />
          <PMat m="blackCast" />
        </mesh>
      </group>
      <Tube path={WASH_HOSE} r={0.006} seg={10} radial={6}>
        <PMat m="rubber" />
      </Tube>

      {/* --------- door latch block + regulator hint inside the door side -------- */}
      <group position={[0.3, 0.62, 0.72]}>
        {/* latch block with its dark fish-mouth slot */}
        <RBox args={[0.055, 0.085, 0.04] as [number, number, number]} radius={0.007} smoothness={2}>
          <PMat m="steel" rough={0.4} />
        </RBox>
        <RBox args={[0.014, 0.05, 0.03] as [number, number, number]} radius={0.003} smoothness={2} position={[-0.024, -0.01, 0]}>
          <PMat color="#0e1116" metal={0.2} rough={0.9} e={0.02} />
        </RBox>
        {/* striker loop poking at the mouth */}
        <mesh position={[-0.045, -0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.014, 0.0045, 5, 10]} />
          <PMat m="polSteel" />
        </mesh>
      </group>
      {/* regulator hint: guide rail + drum + cable, just inside the skin */}
      <group position={[0.46, 0.55, 0.68]}>
        <RBox args={[0.02, 0.3, 0.018] as [number, number, number]} radius={0.004} smoothness={2}>
          <PMat m="blackCast" />
        </RBox>
        {/* glass-shoe slider on the rail */}
        <RBox args={[0.03, 0.045, 0.022] as [number, number, number]} radius={0.005} smoothness={2} position={[0, 0.06, 0]}>
          <PMat color={POM} metal={0.1} rough={0.6} e={0.05} />
        </RBox>
        {/* cable drum + motor nub at the rail foot */}
        <mesh position={[0, -0.185, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.02, 12]} />
          <PMat color={POM} metal={0.1} rough={0.55} e={0.05} />
        </mesh>
        <mesh position={[-0.035, -0.185, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.016, 0.016, 0.04, 10]} />
          <PMat m="blackCast" />
        </mesh>
        {/* taut cable from drum to shoe */}
        <mesh position={[0.012, -0.06, 0]} rotation={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.245, 5]} />
          <PMat m="polSteel" e={0.08} />
        </mesh>
      </group>

      {/* ----------- mirror motor-pod hint behind the body-side mirror ----------- */}
      <group position={[0.54, 0.8, 0.76]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.04, 10]} />
          <PMat color="#23262b" metal={0.3} rough={0.7} e={0.04} />
        </mesh>
        <mesh position={[0.026, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.012, 10]} />
          <PMat color={POM} metal={0.1} rough={0.6} e={0.06} />
        </mesh>
        {/* stalk bracket toward the door skin */}
        <RBox args={[0.035, 0.016, 0.03] as [number, number, number]} radius={0.004} smoothness={2} position={[-0.03, -0.012, 0]}>
          <PMat m="blackCast" />
        </RBox>
      </group>
    </PartGroup>
  )
}
