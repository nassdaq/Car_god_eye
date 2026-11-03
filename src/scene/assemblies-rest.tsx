import * as THREE from 'three'
import { Ghost, GhostMat, Mat, PartGroup, Pipe, useSpringGeo } from './lib'

const DRV = '#ffc53d'
const CHS = '#8ea2c6'
const SUS = '#b388ff'
const BRK = '#ff2d7a'
const WHL = '#6ee7b7'
const THM = '#38d9f5'
const ELE = '#ffe94d'
const BDY = '#00f0ff'
const INT = '#cfd8e3'

/* ============================== TRANSMISSION ============================= */

export function TransmissionView() {
  return (
    <group>
      <PartGroup id="trn-case" explode={[0, 0.9, 0]} renderOrder={5}>
        <mesh position={[0.1, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 1.2, 24, 1, true, 0, Math.PI]} />
          <Mat color={DRV} e={0.08} opacity={0.25} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>

      <PartGroup id="trn-gears" explode={[0, 0, 0]}>
        {/* input shaft + gears */}
        <mesh position={[0.1, 0.88, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.15, 12]} />
          <Mat color="#9aa5b5" e={0.15} metal={0.9} />
        </mesh>
        {[
          { x: -0.35, r: 0.1 },
          { x: -0.1, r: 0.13 },
          { x: 0.15, r: 0.16 },
          { x: 0.42, r: 0.11 },
        ].map((g) => (
          <mesh key={g.x} position={[g.x, 0.88, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[g.r, g.r, 0.06, 28]} />
            <Mat color={DRV} e={0.22} metal={0.9} rough={0.25} />
          </mesh>
        ))}
        {/* output shaft + gears */}
        <mesh position={[0.1, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.15, 12]} />
          <Mat color="#9aa5b5" e={0.15} metal={0.9} />
        </mesh>
        {[
          { x: -0.35, r: 0.22 },
          { x: -0.1, r: 0.19 },
          { x: 0.15, r: 0.16 },
          { x: 0.42, r: 0.2 },
        ].map((g) => (
          <mesh key={g.x} position={[g.x, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[g.r, g.r, 0.06, 32]} />
            <Mat color="#d6a73d" e={0.18} metal={0.9} rough={0.25} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="trn-synchro" explode={[0.3, 0, 0.85]}>
        {[0.02, 0.29].map((x) => (
          <mesh key={x} position={[x, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.13, 0.15, 0.05, 24, 1, true]} />
            <Mat color="#d6b88a" e={0.35} metal={0.85} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="trn-clutch" explode={[-0.9, 0, 0]}>
        <mesh position={[-0.75, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.035, 32]} />
          <Mat color="#c05a2a" e={0.18} />
        </mesh>
        <mesh position={[-0.7, 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 20]} />
          <Mat color="#6b7687" e={0.12} />
        </mesh>
        {[...Array(6)].map((_, i) => {
          const a = (i * Math.PI * 2) / 6
          return (
            <mesh
              key={i}
              position={[-0.7, 0.72 + Math.sin(a) * 0.19, Math.cos(a) * 0.19]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.035, 0.035, 0.04, 10]} />
              <Mat color="#b388ff" e={0.3} />
            </mesh>
          )
        })}
      </PartGroup>
    </group>
  )
}

/* =============================== DRIVESHAFT ============================== */

export function DriveshaftView() {
  return (
    <group>
      <PartGroup id="dsh-tube" explode={[0, 0, 0]}>
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 1.5, 20, 1, true]} />
          <Mat color={DRV} e={0.15} metal={0.85} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.3, 0.845, 0]}>
          <boxGeometry args={[0.06, 0.012, 0.03]} />
          <Mat color="#c0c9d8" e={0.3} metal={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="dsh-ujoints" perChild>
        {[-0.95, 0.95].map((x) => (
          <group key={x} position={[x, 0.75, 0]} userData={{ explode: [Math.sign(x) * 0.7, 0, 0] }}>
            {/* cross */}
            <mesh>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <Mat color="#9aa5b5" e={0.2} metal={0.9} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.05, 0.05, 0.3]} />
              <Mat color="#9aa5b5" e={0.2} metal={0.9} />
            </mesh>
            {/* caps */}
            {[
              [0, 0.15, 0],
              [0, -0.15, 0],
              [0, 0, 0.15],
              [0, 0, -0.15],
            ].map((p, i) => (
              <mesh
                key={i}
                position={p as [number, number, number]}
                rotation={i < 2 ? [0, 0, 0] : [Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[0.045, 0.045, 0.05, 14]} />
                <Mat color="#c9b458" e={0.25} metal={0.9} />
              </mesh>
            ))}
            {/* yoke */}
            <mesh position={[Math.sign(x) * 0.14, 0, 0]}>
              <boxGeometry args={[0.12, 0.26, 0.1]} />
              <Mat color="#78839b" e={0.12} metal={0.8} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ============================== DIFFERENTIAL ============================= */

export function DifferentialView() {
  return (
    <group>
      <PartGroup id="dif-case" explode={[0, 0.95, 0]} renderOrder={5}>
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.5, 24, 18]} />
          <Mat color={DRV} e={0.06} opacity={0.18} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.75, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 14, 1, true]} />
          <Mat color={DRV} e={0.08} opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.75, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 14, 1, true]} />
          <Mat color={DRV} e={0.08} opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>

      <PartGroup id="dif-ringpinion" explode={[0, 0.3, -0.75]}>
        {/* ring gear */}
        <mesh position={[0, 0.75, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.38, 0.42, 0.07, 36]} />
          <Mat color={DRV} e={0.25} metal={0.9} rough={0.25} />
        </mesh>
        {/* pinion */}
        <mesh position={[-0.42, 0.62, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.13, 0.2, 20]} />
          <Mat color="#d6a73d" e={0.25} metal={0.9} />
        </mesh>
        <mesh position={[-0.62, 0.62, 0.08]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 0.25, 12]} />
          <Mat color="#9aa5b5" e={0.15} metal={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="dif-spiders" explode={[0, 0, 0.95]}>
        <group position={[0, 0.75, 0.08]}>
          <mesh>
            <boxGeometry args={[0.035, 0.42, 0.035]} />
            <Mat color="#9aa5b5" e={0.15} metal={0.85} />
          </mesh>
          {[0.19, -0.19].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[y > 0 ? Math.PI : 0, 0, 0]}>
              <coneGeometry args={[0.09, 0.09, 16]} />
              <Mat color="#c0c9d8" e={0.25} metal={0.9} />
            </mesh>
          ))}
          {[0.16, -0.16].map((z) => (
            <mesh key={z} position={[0, 0, z]} rotation={[z > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.11, 0.1, 16]} />
              <Mat color="#d6a73d" e={0.25} metal={0.9} />
            </mesh>
          ))}
        </group>
      </PartGroup>

      <PartGroup id="dif-lsd" explode={[0.85, 0, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[0, 0.75, -0.16 - i * 0.035]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[i % 2 ? 0.17 : 0.15, i % 2 ? 0.17 : 0.15, 0.012, 24]} />
            <Mat color={i % 2 ? '#8893a5' : '#c05a2a'} e={0.2} metal={0.85} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ CHASSIS ================================ */

export function ChassisView() {
  return (
    <group>
      <PartGroup id="chs-cell" explode={[0, 0.8, 0]}>
        {/* sills */}
        {[-0.55, 0.55].map((z) => (
          <mesh key={z} position={[0, 0.3, z]}>
            <boxGeometry args={[1.5, 0.1, 0.09]} />
            <Mat color="#ff5c5c" e={0.2} />
          </mesh>
        ))}
        {/* B pillars + roof rails */}
        {[-0.55, 0.55].map((z) => (
          <group key={z}>
            <mesh position={[0, 0.75, z]}>
              <boxGeometry args={[0.09, 0.85, 0.07]} />
              <Mat color="#ff5c5c" e={0.22} />
            </mesh>
            <mesh position={[0, 1.18, z]}>
              <boxGeometry args={[1.3, 0.07, 0.07]} />
              <Mat color="#ff5c5c" e={0.2} />
            </mesh>
          </group>
        ))}
        {/* roof cross */}
        {[-0.6, 0.6].map((x) => (
          <mesh key={x} position={[x, 1.18, 0]}>
            <boxGeometry args={[0.07, 0.06, 1.1]} />
            <Mat color="#ff5c5c" e={0.2} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="chs-rails" perChild>
        {[-1.25, 1.25].map((x) => (
          <group key={x} userData={{ explode: [Math.sign(x) * 0.8, 0, 0] }}>
            {[-0.35, 0.35].map((z) => (
              <group key={z}>
                <mesh position={[x, 0.42, z]}>
                  <boxGeometry args={[0.9, 0.13, 0.11]} />
                  <Mat color={CHS} e={0.18} />
                </mesh>
                {/* fold initiator dimples */}
                {[0.25, 0.05, -0.15].map((dx) => (
                  <mesh key={dx} position={[x + Math.sign(x) * dx, 0.49, z]}>
                    <boxGeometry args={[0.03, 0.015, 0.12]} />
                    <Mat color="#5d7d8a" e={0.1} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </PartGroup>

      <PartGroup id="chs-floor" explode={[0, -0.6, 0]}>
        <mesh position={[0, 0.26, 0]}>
          <boxGeometry args={[1.5, 0.02, 1.05]} />
          <Mat color={CHS} e={0.1} opacity={0.85} />
        </mesh>
        {[-0.3, 0, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.275, 0]}>
            <boxGeometry args={[0.04, 0.015, 1.0]} />
            <Mat color="#aebdd4" e={0.15} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="chs-joints" explode={[0, 0.35, 0.95]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[-0.68 + i * 0.15, 0.36, 0.55]}>
            <sphereGeometry args={[0.022, 10, 8]} />
            <Mat color="#ffb347" e={0.45} />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0.605]}>
          <boxGeometry args={[1.45, 0.025, 0.025]} />
          <Mat color="#ffd27a" e={0.4} opacity={0.8} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* =============================== SUSPENSION ============================== */

export function SuspensionView() {
  const springGeo = useSpringGeo(0.2, 0.62, 7, 0.028)
  return (
    <group>
      <PartGroup id="sus-damper" explode={[0, 0.3, 0]}>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.75, 18]} />
          <Mat color="#c9b458" e={0.2} metal={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.45, 12]} />
          <Mat color="#dde4ee" e={0.3} metal={0.95} rough={0.1} />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <Mat color="#556" e={0.1} />
        </mesh>
      </PartGroup>

      <PartGroup id="sus-spring" explode={[0.95, 0.1, 0]}>
        <mesh geometry={springGeo} position={[0, 0.42, 0]}>
          <Mat color={SUS} e={0.45} />
        </mesh>
        {[0.4, 1.08].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.02, 20]} />
            <Mat color="#8a76b5" e={0.2} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="sus-arms" explode={[0, -0.55, 0.6]}>
        {/* lower wishbone */}
        <Pipe from={[-0.55, 0.12, -0.35]} to={[0.42, 0.12, 0.08]} r={0.035} color={SUS} e={0.2} />
        <Pipe from={[-0.55, 0.12, 0.45]} to={[0.42, 0.12, 0.08]} r={0.035} color={SUS} e={0.2} />
        {/* upper arm */}
        <Pipe from={[-0.45, 1.3, -0.25]} to={[0.3, 1.28, 0.05]} r={0.028} color={SUS} e={0.18} />
        <Pipe from={[-0.45, 1.3, 0.35]} to={[0.3, 1.28, 0.05]} r={0.028} color={SUS} e={0.18} />
        {/* bushings */}
        {[
          [-0.55, 0.12, -0.35],
          [-0.55, 0.12, 0.45],
          [-0.45, 1.3, -0.25],
          [-0.45, 1.3, 0.35],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.08, 14]} />
            <Mat color="#2d3748" e={0.08} rough={0.8} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="sus-balljoint" explode={[0.7, -0.4, 0.7]}>
        <mesh position={[0.46, 0.14, 0.08]}>
          <sphereGeometry args={[0.07, 18, 14]} />
          <Mat color="#dde4ee" e={0.3} metal={0.95} rough={0.1} />
        </mesh>
        <mesh position={[0.5, 0.28, 0.08]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.035, 0.18, 12]} />
          <Mat color="#9aa5b5" e={0.15} metal={0.9} />
        </mesh>
        <mesh position={[0.46, 0.1, 0.08]}>
          <cylinderGeometry args={[0.09, 0.07, 0.08, 14, 1, true]} />
          <Mat color="#1a202c" e={0.05} rough={0.9} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>

      <PartGroup id="sus-arb" explode={[-0.9, 0, -0.7]}>
        <Pipe from={[-0.85, 0.35, -0.75]} to={[-0.85, 0.35, 0.3]} r={0.032} color="#ff8fab" e={0.2} />
        <Pipe from={[-0.85, 0.35, 0.3]} to={[-0.45, 0.28, 0.55]} r={0.032} color="#ff8fab" e={0.2} />
        <Pipe from={[-0.85, 0.35, -0.75]} to={[-0.45, 0.28, -0.95]} r={0.032} color="#ff8fab" e={0.2} />
        {/* drop link */}
        <Pipe from={[-0.45, 0.28, 0.55]} to={[-0.1, 0.55, 0.3]} r={0.018} color="#9aa5b5" e={0.15} />
      </PartGroup>
    </group>
  )
}

/* ============================= MONOTUBE DAMPER ============================ */

export function DamperView() {
  return (
    <group>
      {/* cutaway body */}
      <Ghost>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 1.3, 32, 1, true, Math.PI * 0.25, Math.PI * 1.5]} />
          <GhostMat opacity={0.14} color="#2a2410" />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 32]} />
          <GhostMat opacity={0.2} color="#2a2410" />
        </mesh>
      </Ghost>

      <PartGroup id="dmp-oil" explode={[-0.75, 0, 0.45]}>
        {/* oil column */}
        <mesh position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.72, 28]} />
          <Mat color="#d6a73d" e={0.18} metal={0.1} rough={0.3} opacity={0.5} depthWrite={false} />
        </mesh>
        {/* floating piston */}
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 28]} />
          <Mat color="#8893a5" e={0.2} metal={0.85} />
        </mesh>
        {/* nitrogen */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.14, 28]} />
          <Mat color={BDY} e={0.25} metal={0} rough={0.2} opacity={0.3} depthWrite={false} />
        </mesh>
      </PartGroup>

      <PartGroup id="dmp-pistonvalve" explode={[0.85, 0.1, 0.3]}>
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.175, 0.175, 0.07, 28]} />
          <Mat color={SUS} e={0.25} metal={0.8} />
        </mesh>
        {/* ports */}
        {[...Array(6)].map((_, i) => {
          const a = (i * Math.PI * 2) / 6
          return (
            <mesh key={i} position={[Math.cos(a) * 0.1, 0.95, Math.sin(a) * 0.1]}>
              <cylinderGeometry args={[0.022, 0.022, 0.075, 8]} />
              <Mat color="#2d3748" e={0.05} />
            </mesh>
          )
        })}
        {/* shim stacks */}
        {[0.055, 0.075, 0.095].map((dy, i) => (
          <mesh key={i} position={[0, 0.95 - dy, 0]}>
            <cylinderGeometry args={[0.13 - i * 0.03, 0.13 - i * 0.03, 0.006, 24]} />
            <Mat color="#dde4ee" e={0.35} metal={0.95} />
          </mesh>
        ))}
        {[0.055, 0.075].map((dy, i) => (
          <mesh key={i} position={[0, 0.95 + dy, 0]}>
            <cylinderGeometry args={[0.12 - i * 0.03, 0.12 - i * 0.03, 0.006, 24]} />
            <Mat color="#dde4ee" e={0.35} metal={0.95} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="dmp-rod" explode={[0, 0.75, 0]}>
        <mesh position={[0, 1.38, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 14]} />
          <Mat color="#e8ecf4" e={0.35} metal={0.98} rough={0.05} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 12]} />
          <Mat color="#556" e={0.1} />
        </mesh>
      </PartGroup>

      <PartGroup id="dmp-seals" explode={[0, 0.4, 0.85]}>
        <mesh position={[0, 1.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.03, 12, 24]} />
          <Mat color="#1a202c" e={0.08} rough={0.9} />
        </mesh>
        <mesh position={[0, 1.33, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 20, 1, true]} />
          <Mat color="#d6b88a" e={0.25} metal={0.85} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================= BRAKES ================================ */

export function BrakesView() {
  return (
    <group>
      <PartGroup id="brk-disc" explode={[0, 0, -0.7]}>
        {/* two friction faces with vanes between */}
        {[0.045, -0.045].map((z) => (
          <mesh key={z} position={[0, 0.75, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.025, 48]} />
            <Mat color={BRK} e={0.18} metal={0.85} rough={0.3} />
          </mesh>
        ))}
        {[...Array(12)].map((_, i) => {
          const a = (i * Math.PI * 2) / 12
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.4, 0.75 + Math.sin(a) * 0.4, 0]}
              rotation={[0, 0, a]}
            >
              <boxGeometry args={[0.025, 0.22, 0.06]} />
              <Mat color="#8a2550" e={0.15} />
            </mesh>
          )
        })}
        {/* hat */}
        <mesh position={[0, 0.75, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 28]} />
          <Mat color="#555a66" e={0.1} />
        </mesh>
      </PartGroup>

      <PartGroup id="brk-pads" explode={[0, 0.55, 0.55]}>
        {[0.1, -0.1].map((z) => (
          <group key={z} position={[0, 1.05, z]}>
            <mesh>
              <boxGeometry args={[0.42, 0.18, 0.04]} />
              <Mat color="#4a3728" e={0.12} rough={0.8} />
            </mesh>
            <mesh position={[0, 0, Math.sign(z) * 0.025]}>
              <boxGeometry args={[0.44, 0.2, 0.012]} />
              <Mat color="#8893a5" e={0.15} metal={0.8} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      <PartGroup id="brk-caliper" explode={[0, 0.8, 0]}>
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[0.5, 0.18, 0.34]} />
          <Mat color={BRK} e={0.3} />
        </mesh>
        {[0.16, -0.16].map((z) => (
          <mesh key={z} position={[0, 1.05, z]}>
            <boxGeometry args={[0.5, 0.26, 0.05]} />
            <Mat color={BRK} e={0.25} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="brk-fluid" explode={[0.8, 0.4, 0.4]}>
        <Pipe from={[0.28, 1.32, 0]} to={[0.6, 1.5, 0.2]} r={0.018} color="#ffd27a" e={0.3} />
        <mesh position={[0.28, 1.32, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 10]} />
          <Mat color="#c9b458" e={0.3} metal={0.9} />
        </mesh>
        <mesh position={[0.68, 1.55, 0.25]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 14]} />
          <Mat color="#ffd27a" e={0.2} opacity={0.6} depthWrite={false} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================ CALIPER ================================ */

export function CaliperView() {
  return (
    <group>
      <PartGroup id="cal-body" perChild>
        {[0.26, -0.26].map((z) => (
          <group key={z} userData={{ explode: [0, 0, Math.sign(z) * 0.7] }}>
            <mesh position={[0, 0.75, z]}>
              <boxGeometry args={[0.85, 0.42, 0.22]} />
              <Mat color={BRK} e={0.2} />
            </mesh>
            <mesh position={[0, 0.99, z * 0.55]} rotation={[Math.sign(z) * -0.6, 0, 0]}>
              <boxGeometry args={[0.7, 0.2, 0.08]} />
              <Mat color={BRK} e={0.18} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      <PartGroup id="cal-pistons" perChild>
        {[-0.22, 0.22].flatMap((x) =>
          [0.12, -0.12].map((z) => (
            <group key={`${x}${z}`} userData={{ explode: [0, 0, Math.sign(z) * 1.1] }}>
              <mesh position={[x, 0.75, z]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.14, 22, 1, true]} />
                <Mat color="#2d3748" e={0.12} rough={0.6} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[x, 0.75, z - Math.sign(z) * 0.07]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.015, 22]} />
                <Mat color="#4a5568" e={0.15} />
              </mesh>
            </group>
          )),
        )}
      </PartGroup>

      <PartGroup id="cal-seals" explode={[0.85, 0.35, 0]}>
        {[-0.22, 0.22].flatMap((x) =>
          [0.2, -0.2].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0.75, z]}>
              <torusGeometry args={[0.105, 0.016, 8, 28]} />
              <Mat color="#1a202c" e={0.1} rough={0.9} />
            </mesh>
          )),
        )}
      </PartGroup>

      <PartGroup id="cal-bleed" explode={[0, 0.75, 0.5]}>
        <mesh position={[0.3, 1.0, 0.26]} rotation={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.016, 0.12, 8]} />
          <Mat color="#c0c9d8" e={0.25} metal={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.98, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
          <Mat color="#c9b458" e={0.3} metal={0.9} />
        </mesh>
        {[0.028, -0.028].map((dz) => (
          <mesh key={dz} position={[-0.3, 0.98, 0.26 + dz]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.045, 0.008, 8, 20]} />
            <Mat color="#d98a4a" e={0.3} metal={0.9} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================= WHEELS ================================ */

export function WheelsView() {
  return (
    <group>
      <PartGroup id="whl-tire" explode={[0, 0, 0.9]}>
        <mesh position={[0, 0.85, 0]}>
          <torusGeometry args={[0.6, 0.22, 18, 48]} />
          <Mat color="#10151d" e={0.04} metal={0.1} rough={0.9} />
        </mesh>
        {[-0.08, 0, 0.08].map((z) => (
          <mesh key={z} position={[0, 0.85, z]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.805, 0.008, 6, 64]} />
            <Mat color="#2d3748" e={0.08} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="whl-rim" explode={[0, 0, -0.75]}>
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.34, 32, 1, true]} />
          <Mat color={WHL} e={0.18} metal={0.85} side={THREE.DoubleSide} />
        </mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, 0.85, 0.1]} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
            <boxGeometry args={[0.07, 0.8, 0.05]} />
            <Mat color={WHL} e={0.22} metal={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 0.85, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 24]} />
          <Mat color="#4bc99a" e={0.25} metal={0.85} />
        </mesh>
      </PartGroup>

      <PartGroup id="whl-valve" explode={[0.8, 0.45, 0]}>
        <group position={[0.3, 1.14, 0.06]} rotation={[0, 0, -0.5]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
            <Mat color="#9aa5b5" e={0.2} metal={0.9} />
          </mesh>
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[0.07, 0.06, 0.04]} />
            <Mat color={ELE} e={0.3} />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup id="whl-lugs" explode={[0, 0, -1.3]}>
        {[...Array(5)].map((_, i) => {
          const a = (i * Math.PI * 2) / 5
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.22, 0.85 + Math.sin(a) * 0.22, 0.16]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.035, 0.028, 0.07, 6]} />
              <Mat color="#c9b458" e={0.3} metal={0.9} />
            </mesh>
          )
        })}
      </PartGroup>
    </group>
  )
}

/* ================================== TIRE ================================= */

export function TireView() {
  const ARC = Math.PI * 1.45
  return (
    <group>
      {/* ghost rim profile */}
      <Ghost>
        <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.3, 32, 1, true]} />
          <GhostMat opacity={0.07} />
        </mesh>
      </Ghost>

      <PartGroup id="tir-tread" explode={[0, 0.55, 0]}>
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI * 0.55]}>
          <torusGeometry args={[0.62, 0.11, 14, 56, ARC]} />
          <Mat color="#10151d" e={0.04} metal={0.05} rough={0.95} />
        </mesh>
        {[-0.05, 0.05].map((z) => (
          <mesh key={z} position={[0, 0.85, z]} rotation={[0, 0, Math.PI * 0.55]}>
            <torusGeometry args={[0.73, 0.01, 6, 56, ARC]} />
            <Mat color="#2d3748" e={0.1} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="tir-belts" explode={[0, 0.25, 0.5]}>
        {[0.015, -0.015].map((dz, i) => (
          <mesh key={i} position={[0, 0.85, dz]} rotation={[0, 0, Math.PI * 0.55]}>
            <torusGeometry args={[0.56, 0.028, 8, 56, ARC]} />
            <Mat color={i ? '#9aa5b5' : '#c9b458'} e={0.25} metal={0.9} rough={0.3} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="tir-carcass" explode={[0, -0.1, 0.85]}>
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI * 0.55]}>
          <torusGeometry args={[0.49, 0.05, 10, 56, ARC]} />
          <Mat color="#e8e2d4" e={0.15} metal={0.1} rough={0.7} />
        </mesh>
        {/* inner liner */}
        <mesh position={[0, 0.85, 0]} rotation={[0, 0, Math.PI * 0.55]}>
          <torusGeometry args={[0.44, 0.025, 8, 56, ARC]} />
          <Mat color="#3d4759" e={0.1} rough={0.8} />
        </mesh>
      </PartGroup>

      <PartGroup id="tir-bead" explode={[0, -0.6, 0]}>
        {[0.14, -0.14].map((z) => (
          <group key={z}>
            <mesh position={[0, 0.85, z]}>
              <torusGeometry args={[0.33, 0.028, 10, 40]} />
              <Mat color="#d98a4a" e={0.3} metal={0.9} />
            </mesh>
            <mesh position={[0, 0.85, z]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.37, 0.018, 8, 40]} />
              <Mat color="#1a202c" e={0.06} rough={0.9} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ RADIATOR =============================== */

export function RadiatorView() {
  return (
    <group>
      <PartGroup id="rad-core" explode={[0, 0, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.1, 0.7, 0.07]} />
          <Mat color={THM} e={0.18} metal={0.5} />
        </mesh>
        {[...Array(9)].map((_, i) => (
          <mesh key={i} position={[-0.44 + i * 0.11, 0.75, 0.04]}>
            <boxGeometry args={[0.012, 0.68, 0.012]} />
            <Mat color="#8adcf2" e={0.25} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="rad-tanks" perChild>
        {[0.44, -0.44].map((y) => (
          <group key={y} userData={{ explode: [0, Math.sign(y) * 0.6, 0] }}>
            <mesh position={[0, 0.75 + y, 0]}>
              <boxGeometry args={[1.12, 0.14, 0.12]} />
              <Mat color="#1d3a45" e={0.12} />
            </mesh>
          </group>
        ))}
        <group userData={{ explode: [0.5, 0.75, 0] }}>
          <mesh position={[0.4, 1.28, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
            <Mat color="#8893a5" e={0.2} metal={0.8} />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup id="rad-fan" explode={[0, 0, -0.9]}>
        <mesh position={[0, 0.75, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} />
          <Mat color="#28506b" e={0.15} />
        </mesh>
        {[...Array(7)].map((_, i) => (
          <mesh
            key={i}
            position={[0, 0.75, -0.17]}
            rotation={[0.3, 0, (i * Math.PI * 2) / 7]}
          >
            <boxGeometry args={[0.09, 0.56, 0.02]} />
            <Mat color="#3a7ca5" e={0.18} />
          </mesh>
        ))}
        <mesh position={[0, 0.75, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.33, 0.015, 8, 40]} />
          <Mat color="#28506b" e={0.15} />
        </mesh>
      </PartGroup>

      <PartGroup id="rad-coolant" explode={[0, 0.35, 0.85]}>
        <Pipe from={[-0.52, 1.12, 0.1]} to={[-0.85, 0.95, 0.25]} r={0.045} color={THM} e={0.3} />
        <Pipe from={[0.52, 0.38, 0.1]} to={[0.85, 0.55, 0.25]} r={0.045} color="#1d7a94" e={0.25} />
        <mesh position={[-0.85, 0.8, 0.25]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 10]} />
          <Mat color={THM} e={0.35} opacity={0.6} depthWrite={false} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================ BATTERY ================================ */

export function BatteryView() {
  return (
    <group>
      <PartGroup id="bat-case" explode={[0, 0.9, 0]} renderOrder={5}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.95, 0.55, 0.55]} />
          <Mat color="#1a202c" e={0.05} metal={0.1} rough={0.7} opacity={0.3} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.93, 0]}>
          <boxGeometry args={[0.97, 0.07, 0.57]} />
          <Mat color="#2d3748" e={0.08} opacity={0.85} />
        </mesh>
      </PartGroup>

      <PartGroup id="bat-plates" explode={[0, 0, 0]}>
        {[...Array(9)].map((_, i) => (
          <mesh key={i} position={[-0.34 + i * 0.085, 0.58, 0]}>
            <boxGeometry args={[0.022, 0.42, 0.42]} />
            <Mat color={i % 2 ? '#5d4a3a' : '#8893a5'} e={0.12} metal={0.6} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="bat-mat" explode={[0, 0.2, 0.8]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-0.2975 + i * 0.085, 0.58, 0]}>
            <boxGeometry args={[0.012, 0.44, 0.44]} />
            <Mat color="#e8e2d4" e={0.12} metal={0} rough={0.9} opacity={0.75} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="bat-terminals" explode={[0, 0.65, -0.6]}>
        {[-0.3, 0.3].map((x, i) => (
          <group key={x} position={[x, 1.02, -0.15]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.055, 0.09, 14]} />
              <Mat color={i ? '#8893a5' : '#c84a4a'} e={0.3} metal={0.7} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================== ECU ================================== */

export function EcuView() {
  return (
    <group>
      <PartGroup id="ecu-case" perChild>
        <group userData={{ explode: [0, -0.45, 0] }}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.95, 0.1, 0.68]} />
            <Mat color="#6b7687" e={0.1} metal={0.8} />
          </mesh>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[-0.3 + i * 0.12, 0.43, 0]}>
              <boxGeometry args={[0.025, 0.05, 0.6]} />
              <Mat color="#78839b" e={0.12} metal={0.8} />
            </mesh>
          ))}
        </group>
        <group userData={{ explode: [0, 0.75, 0] }}>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[0.95, 0.07, 0.68]} />
            <Mat color="#6b7687" e={0.1} metal={0.8} opacity={0.8} />
          </mesh>
          <mesh position={[0.32, 0.82, 0.22]}>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
            <Mat color="#e8ecf4" e={0.3} />
          </mesh>
        </group>
      </PartGroup>

      <PartGroup id="ecu-pcb" explode={[0, 0.1, 0]}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.85, 0.025, 0.58]} />
          <Mat color="#1d4a2a" e={0.12} metal={0.2} rough={0.6} />
        </mesh>
        {[
          [-0.25, 0.12],
          [-0.05, -0.18],
          [0.22, 0.18],
          [0.3, -0.1],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], 0.645, p[1]]}>
            <boxGeometry args={[0.08, 0.02, 0.06]} />
            <Mat color="#1a202c" e={0.08} />
          </mesh>
        ))}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.3 + i * 0.15, 0.64, 0.32]}>
            <cylinderGeometry args={[0.018, 0.018, 0.03, 10]} />
            <Mat color="#4a5568" e={0.1} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="ecu-cpu" explode={[0, 0.55, 0]}>
        <mesh position={[0.02, 0.655, 0.02]}>
          <boxGeometry args={[0.16, 0.025, 0.16]} />
          <Mat color="#0a0e14" e={0.1} />
        </mesh>
        <mesh position={[0.02, 0.672, 0.02]}>
          <boxGeometry args={[0.07, 0.01, 0.07]} />
          <Mat color={ELE} e={0.5} metal={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="ecu-connector" explode={[0.9, 0.1, 0]}>
        <mesh position={[0.48, 0.62, 0]}>
          <boxGeometry args={[0.14, 0.1, 0.5]} />
          <Mat color="#2d3748" e={0.08} />
        </mesh>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[0.55, 0.62, -0.21 + i * 0.038]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.05, 6]} />
            <Mat color="#ffd27a" e={0.4} metal={0.95} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* =============================== HEADLIGHTS ============================== */

export function HeadlightView() {
  return (
    <group>
      <PartGroup id="hl-housing" explode={[-0.85, 0, 0]} renderOrder={5}>
        <mesh position={[-0.35, 0.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.38, 0.6, 28, 1, true]} />
          <Mat color="#2d3748" e={0.06} rough={0.7} opacity={0.35} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.66, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.03, 28]} />
          <Mat color="#2d3748" e={0.06} opacity={0.5} />
        </mesh>
      </PartGroup>

      <PartGroup id="hl-reflector" explode={[0, 0.65, -0.5]}>
        <mesh position={[-0.2, 0.75, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.14, 0.4, 28, 1, true]} />
          <Mat color="#dde4ee" e={0.25} metal={0.98} rough={0.05} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>

      <PartGroup id="hl-led" explode={[0, -0.6, 0.5]}>
        <mesh position={[-0.32, 0.75, 0]}>
          <boxGeometry args={[0.12, 0.18, 0.3]} />
          <Mat color="#4a5568" e={0.1} metal={0.8} />
        </mesh>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[-0.25, 0.75, -0.1 + i * 0.04]}>
            <boxGeometry args={[0.02, 0.05, 0.028]} />
            <Mat color="#eafcff" e={1.6} metal={0} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="hl-lens" explode={[0.95, 0, 0]}>
        <mesh position={[0.35, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.47, 0.5, 0.05, 32]} />
          <Mat color={BDY} e={0.12} metal={0} rough={0.05} opacity={0.22} depthWrite={false} />
        </mesh>
      </PartGroup>

      {/* light cone */}
      <Ghost>
        <mesh position={[1.1, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.65, 1.4, 28, 1, true]} />
          <GhostMat opacity={0.05} color="#1a3540" />
        </mesh>
      </Ghost>
    </group>
  )
}

/* ================================ LED MODULE ============================== */

export function LedView() {
  return (
    <group>
      <PartGroup id="led-board" explode={[0, -0.55, 0]}>
        {/* heatsink fins */}
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-0.42 + i * 0.12, 0.28, 0]}>
            <boxGeometry args={[0.035, 0.3, 0.65]} />
            <Mat color="#78839b" e={0.1} metal={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 0.47, 0]}>
          <boxGeometry args={[0.95, 0.08, 0.7]} />
          <Mat color="#8893a5" e={0.12} metal={0.85} />
        </mesh>
        {/* copper spreader */}
        <mesh position={[0, 0.53, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.45]} />
          <Mat color="#d98a4a" e={0.25} metal={0.95} />
        </mesh>
        {/* AlN ceramic */}
        <mesh position={[0, 0.57, 0]}>
          <boxGeometry args={[0.32, 0.035, 0.28]} />
          <Mat color="#e8e2d4" e={0.18} metal={0.1} rough={0.5} />
        </mesh>
      </PartGroup>

      <PartGroup id="led-die" explode={[0, 0.5, 0.6]}>
        <mesh position={[0, 0.63, 0]}>
          <boxGeometry args={[0.2, 0.07, 0.2]} />
          <Mat color="#4aa8ff" e={1.3} metal={0.3} rough={0.2} />
        </mesh>
        {/* bond wires */}
        {[-0.08, 0.08].map((z) => (
          <Pipe key={z} from={[0.1, 0.665, z]} to={[0.22, 0.59, z]} r={0.006} color="#ffd27a" e={0.5} />
        ))}
      </PartGroup>

      <PartGroup id="led-phosphor" explode={[0, 0.95, 0]}>
        <mesh position={[0, 0.69, 0]}>
          <boxGeometry args={[0.24, 0.025, 0.24]} />
          <Mat color="#ffe94d" e={1.1} metal={0} rough={0.4} opacity={0.85} />
        </mesh>
      </PartGroup>

      {/* emitted light */}
      <Ghost>
        <mesh position={[0, 1.35, 0]}>
          <coneGeometry args={[0.55, 1.2, 24, 1, true]} />
          <GhostMat opacity={0.05} color="#2a2a10" />
        </mesh>
      </Ghost>
    </group>
  )
}

/* ================================== BODY ================================= */

export function BodyView() {
  return (
    <group>
      <PartGroup id="bdy-panels" explode={[-0.8, 0.2, 0]}>
        {/* door skin */}
        <mesh position={[-0.5, 0.75, 0]} rotation={[0, 0.15, 0]}>
          <boxGeometry args={[0.7, 0.75, 0.03]} />
          <Mat color={BDY} e={0.12} metal={0.6} rough={0.3} />
        </mesh>
        {/* hood */}
        <mesh position={[0.35, 1.0, -0.3]} rotation={[0.3, -0.4, 0.1]}>
          <boxGeometry args={[0.8, 0.03, 0.55]} />
          <Mat color={BDY} e={0.1} metal={0.6} rough={0.3} />
        </mesh>
      </PartGroup>

      <PartGroup id="bdy-bumpers" explode={[0.9, 0, 0]}>
        <mesh position={[0.75, 0.55, 0.15]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.85, 0.35, 0.06]} />
          <Mat color="#1a3540" e={0.1} rough={0.7} />
        </mesh>
        <mesh position={[0.75, 0.42, 0.18]} rotation={[0, -0.5, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.1]} />
          <Mat color="#10151d" e={0.05} rough={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="bdy-glass" explode={[0, 0.85, 0]}>
        <mesh position={[0, 1.25, 0.25]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[1.0, 0.65, 0.025]} />
          <Mat color="#8adcf2" e={0.1} metal={0} rough={0.05} opacity={0.3} depthWrite={false} />
        </mesh>
        {/* PVB interlayer edge hint */}
        <mesh position={[0, 1.25, 0.25]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[1.02, 0.67, 0.006]} />
          <Mat color="#e8e2d4" e={0.2} opacity={0.5} />
        </mesh>
      </PartGroup>

      <PartGroup id="bdy-paint" explode={[0.4, -0.3, 0.9]}>
        {[
          { y: 0.3, c: '#5d7d8a', s: 0.5 },
          { y: 0.38, c: '#8893a5', s: 0.44 },
          { y: 0.46, c: BDY, s: 0.38 },
          { y: 0.54, c: '#eafcff', s: 0.32 },
        ].map((l, i) => (
          <mesh key={i} position={[0.1, l.y, 0.55]}>
            <boxGeometry args={[l.s, 0.018, l.s * 0.7]} />
            <Mat color={l.c} e={0.2} opacity={i === 3 ? 0.5 : 0.95} metal={i === 2 ? 0.8 : 0.3} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================== SEATS ================================ */

export function SeatsView() {
  return (
    <group>
      <PartGroup id="st-frame" explode={[-0.8, 0, 0]}>
        <Pipe from={[-0.3, 0.3, -0.25]} to={[-0.3, 0.3, 0.25]} r={0.03} color="#8893a5" e={0.15} />
        <Pipe from={[0.3, 0.3, -0.25]} to={[0.3, 0.3, 0.25]} r={0.03} color="#8893a5" e={0.15} />
        {[-0.25, 0.25].map((z) => (
          <group key={z}>
            <Pipe from={[-0.3, 0.3, z]} to={[0.3, 0.3, z]} r={0.03} color="#8893a5" e={0.15} />
            <Pipe from={[-0.28, 0.32, z]} to={[-0.48, 1.05, z]} r={0.028} color="#8893a5" e={0.15} />
          </group>
        ))}
        <Pipe from={[-0.48, 1.05, -0.25]} to={[-0.48, 1.05, 0.25]} r={0.028} color="#8893a5" e={0.15} />
        {/* recliner gear */}
        <mesh position={[-0.28, 0.34, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 20]} />
          <Mat color="#c9b458" e={0.25} metal={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="st-foam" explode={[0, 0.15, 0]}>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.62, 0.16, 0.55]} />
          <Mat color="#d6a73d" e={0.1} metal={0} rough={0.9} />
        </mesh>
        <mesh position={[-0.42, 0.95, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.16, 0.9, 0.55]} />
          <Mat color="#d6a73d" e={0.1} metal={0} rough={0.9} />
        </mesh>
      </PartGroup>

      <PartGroup id="st-cover" explode={[0.85, 0.25, 0]}>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.66, 0.05, 0.59]} />
          <Mat color={INT} e={0.12} metal={0} rough={0.8} opacity={0.8} />
        </mesh>
        <mesh position={[-0.36, 0.98, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.05, 0.94, 0.59]} />
          <Mat color={INT} e={0.12} metal={0} rough={0.8} opacity={0.8} />
        </mesh>
        {/* heater wires */}
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, 0.555, -0.18 + i * 0.12]}>
            <boxGeometry args={[0.55, 0.008, 0.008]} />
            <Mat color="#ff8f5a" e={0.4} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ STEERING =============================== */

export function SteeringView() {
  return (
    <group>
      <PartGroup id="str-rack" explode={[0, -0.5, 0]}>
        <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 1.5, 16]} />
          <Mat color="#78839b" e={0.12} metal={0.8} />
        </mesh>
        {/* rack teeth */}
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[0.03, 0.39, -0.35 + i * 0.07]}>
            <boxGeometry args={[0.04, 0.025, 0.035]} />
            <Mat color="#b8c4d6" e={0.2} metal={0.9} />
          </mesh>
        ))}
        {/* pinion */}
        <mesh position={[0.05, 0.47, 0.25]} rotation={[0.3, 0, 0.3]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
          <Mat color="#d6a73d" e={0.25} metal={0.9} />
        </mesh>
        {/* tie rod ends */}
        {[-0.75, 0.75].map((z) => (
          <mesh key={z} position={[0, 0.35, z]}>
            <sphereGeometry args={[0.06, 14, 10]} />
            <Mat color="#9aa5b5" e={0.2} metal={0.9} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="str-motor" explode={[0.8, -0.3, 0.6]}>
        <mesh position={[0.22, 0.35, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.26, 20]} />
          <Mat color={ELE} e={0.2} metal={0.6} />
        </mesh>
        <mesh position={[0.22, 0.35, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
          <Mat color="#8893a5" e={0.15} />
        </mesh>
      </PartGroup>

      <PartGroup id="str-column" explode={[-0.5, 0.45, -0.5]}>
        <Pipe from={[0.08, 0.5, 0.28]} to={[-0.45, 1.15, -0.1]} r={0.04} color="#8893a5" e={0.12} />
        <Pipe from={[-0.45, 1.15, -0.1]} to={[-0.75, 1.42, -0.25]} r={0.045} color="#6b7687" e={0.1} />
        {/* shear pins */}
        {[0.3, 0.45].map((t) => (
          <mesh
            key={t}
            position={[-0.45 - t * 0.3, 1.15 + t * 0.27, -0.1 - t * 0.15]}
          >
            <sphereGeometry args={[0.02, 8, 6]} />
            <Mat color="#ffb347" e={0.5} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="str-wheel" explode={[-0.7, 0.75, -0.5]}>
        <group position={[-0.85, 1.52, -0.3]} rotation={[0.45, 0.35, 0]}>
          <mesh>
            <torusGeometry args={[0.32, 0.035, 14, 36]} />
            <Mat color={INT} e={0.2} rough={0.6} />
          </mesh>
          {[0, 2.1, -2.1].map((a) => (
            <mesh key={a} rotation={[0, 0, a]} position={[0, -0.08, 0]}>
              <boxGeometry args={[0.05, 0.4, 0.03]} />
              <Mat color="#9aa5b5" e={0.15} metal={0.8} />
            </mesh>
          ))}
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 18]} />
            <Mat color="#2d3748" e={0.08} />
          </mesh>
        </group>
      </PartGroup>
    </group>
  )
}
