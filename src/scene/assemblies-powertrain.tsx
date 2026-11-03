import * as THREE from 'three'
import { Ghost, GhostMat, Mat, PartGroup, Pipe, useSpringGeo } from './lib'
import { BlockReal, PanReal } from './engine-parts/Block'
import { GasketReal, HeadBoltsReal, HeadReal } from './engine-parts/Head'
import { CrankReal, FlywheelReal } from './engine-parts/Crank'
import { PistonsReal } from './engine-parts/Pistons'
import { OilPumpReal, TimingReal } from './engine-parts/Timing'
import { CamsReal, PlugsReal, SpringsReal, ValvesReal } from './engine-parts/HeadInternals'
import { AlternatorReal, CoilsReal, StarterReal } from './engine-parts/Electrics'
import { ValvetrainMini } from './engine-parts/ValvetrainMini'
import {
  ExhaustManifoldReal,
  IntakeManifoldReal,
  TurboMiniReal,
} from './engine-parts/Manifolds'
import { CoolantPathReal, OilPathReal, WaterPumpReal } from './engine-parts/FlowPaths'
import {
  CrownReal,
  OilRingXL,
  PinReal,
  PistonRingPackReal,
  RodBearingsReal,
  RodReal,
  SecondRingXL,
  TopRingXL,
} from './engine-parts/PistonDetail'

const PWR = '#ff6b35'

/* ================================= ENGINE ================================ */

export function EngineView() {
  return (
    <group>
      <PartGroup id="eng-pan" explode={[0, -0.55, 0]}>
        <PanReal />
      </PartGroup>
      <PartGroup id="eng-crank" explode={[0, -0.3, 1.0]}>
        <CrankReal />
      </PartGroup>
      <PartGroup id="eng-block" explode={[0, 0, 0]}>
        <BlockReal />
      </PartGroup>
      <PartGroup id="eng-piston" explode={[0, 0.55, 0.85]}>
        <PistonsReal />
      </PartGroup>
      <PartGroup id="eng-gasket" explode={[0, 0.45, 0]}>
        <GasketReal />
      </PartGroup>
      <PartGroup id="eng-head" explode={[0, 0.95, 0]}>
        <HeadReal />
        <ValvetrainMini />
      </PartGroup>
      <PartGroup id="eng-bolts" explode={[0, 1.55, 0]}>
        <HeadBoltsReal />
      </PartGroup>
      <PartGroup id="eng-timing" explode={[-0.85, 0.25, 0]}>
        <TimingReal />
      </PartGroup>
      <PartGroup id="eng-oilpump" explode={[0, -0.4, 0.95]}>
        <OilPumpReal />
      </PartGroup>
      <PartGroup id="eng-flywheel" explode={[0.95, 0, 0]}>
        <FlywheelReal />
      </PartGroup>
      <PartGroup id="eng-coils" explode={[0, 1.5, 0.35]}>
        <CoilsReal />
      </PartGroup>
      <PartGroup id="eng-alternator" explode={[-0.75, 0.3, 0.85]}>
        <AlternatorReal />
      </PartGroup>
      <PartGroup id="eng-starter" explode={[0.7, -0.25, -0.9]}>
        <StarterReal />
      </PartGroup>
      {/* top-level intake & turbo nodes, mounted on the engine */}
      <PartGroup id="intake" explode={[0.2, 0.5, 1.1]}>
        <IntakeManifoldReal />
      </PartGroup>
      <PartGroup id="eng-exhman" explode={[0, 0.2, -1.0]}>
        <ExhaustManifoldReal />
      </PartGroup>
      <PartGroup id="turbo" explode={[0, -0.25, -1.15]}>
        <TurboMiniReal />
      </PartGroup>
      <PartGroup id="eng-waterpump" explode={[-0.9, 0.15, 0.5]}>
        <WaterPumpReal />
      </PartGroup>
      {/* teaching traces — stay anchored while the metal explodes around them */}
      <PartGroup id="eng-coolpath">
        <CoolantPathReal />
      </PartGroup>
      <PartGroup id="eng-oilpath">
        <OilPathReal />
      </PartGroup>
    </group>
  )
}

/** superseded by the engine-parts models above — kept until cleanup */
function LegacyEngineView() {
  void LegacyEngineView
  return (
    <group>
      {/* oil pan */}
      <PartGroup id="eng-pan" explode={[0, -0.55, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.95, 0.16, 0.6]} />
          <Mat color="#3a2a22" e={0.08} />
        </mesh>
        <mesh position={[0.35, 0.03, 0.2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.03, 10]} />
          <Mat color="#778" e={0.2} />
        </mesh>
      </PartGroup>

      {/* crankshaft */}
      <PartGroup id="eng-crank" explode={[0, -0.3, 1.0]}>
        <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 1.15, 14]} />
          <Mat color="#9aa5b5" e={0.15} metal={0.9} rough={0.25} />
        </mesh>
        {[0, 1, 2, 3].map((i) => {
          const x = -0.375 + i * 0.25
          const up = i === 0 || i === 3 ? 1 : -1
          return (
            <group key={i} position={[x, 0.32, 0]}>
              <mesh position={[-0.055, up * 0.045, 0]}>
                <boxGeometry args={[0.035, 0.22, 0.16]} />
                <Mat color="#8893a5" e={0.12} metal={0.9} />
              </mesh>
              <mesh position={[0.055, up * 0.045, 0]}>
                <boxGeometry args={[0.035, 0.22, 0.16]} />
                <Mat color="#8893a5" e={0.12} metal={0.9} />
              </mesh>
              <mesh position={[0, up * 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
                <Mat color="#b8c4d6" e={0.25} metal={0.95} rough={0.15} />
              </mesh>
            </group>
          )
        })}
        {/* damper pulley */}
        <mesh position={[-0.63, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.05, 20]} />
          <Mat color="#556" e={0.1} />
        </mesh>
      </PartGroup>

      {/* block */}
      <PartGroup id="eng-block" explode={[0, 0, 0]}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[1.0, 0.46, 0.62]} />
          <Mat color={PWR} e={0.1} opacity={0.92} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[-0.375 + i * 0.25, 0.87, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.1, 20, 1, true]} />
            <Mat color="#4a5568" e={0.15} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </PartGroup>

      {/* pistons on rods */}
      <PartGroup id="eng-piston" explode={[0, 0.55, 0.85]}>
        {[0, 1, 2, 3].map((i) => {
          const x = -0.375 + i * 0.25
          const up = i === 0 || i === 3 ? 1 : -1
          const py = 0.95 + up * 0.05
          return (
            <group key={i}>
              <mesh position={[x, py, 0]}>
                <cylinderGeometry args={[0.095, 0.095, 0.15, 18]} />
                <Mat color="#d8dee9" e={0.18} metal={0.85} rough={0.3} />
              </mesh>
              <Pipe from={[x, py - 0.08, 0]} to={[x, 0.32 + up * 0.09, 0]} r={0.028} color="#8893a5" e={0.1} />
            </group>
          )
        })}
      </PartGroup>

      {/* head gasket */}
      <PartGroup id="eng-gasket" explode={[0, 0.45, 0]}>
        <mesh position={[0, 0.94, 0]}>
          <boxGeometry args={[1.0, 0.022, 0.62]} />
          <Mat color="#c0c9d8" e={0.3} metal={0.9} rough={0.2} />
        </mesh>
      </PartGroup>

      {/* head */}
      <PartGroup id="eng-head" explode={[0, 0.95, 0]}>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[1.0, 0.28, 0.62]} />
          <Mat color={PWR} e={0.18} />
        </mesh>
        <mesh position={[0, 1.29, 0]}>
          <boxGeometry args={[0.92, 0.07, 0.5]} />
          <Mat color="#2b1510" e={0.06} rough={0.5} />
        </mesh>
      </PartGroup>

      {/* timing drive — front face */}
      <PartGroup id="eng-timing" explode={[-0.85, 0.25, 0]}>
        {/* crank sprocket */}
        <mesh position={[-0.56, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.03, 18]} />
          <Mat color="#9aa5b5" e={0.2} metal={0.9} />
        </mesh>
        {/* cam sprockets (2x crank diameter = half speed) */}
        {[-0.2, 0.2].map((z) => (
          <mesh key={z} position={[-0.56, 1.3, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.03, 22]} />
            <Mat color="#9aa5b5" e={0.2} metal={0.9} />
          </mesh>
        ))}
        {/* VVT phaser on intake sprocket */}
        <mesh position={[-0.595, 1.3, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.035, 18]} />
          <Mat color="#c9b458" e={0.3} metal={0.85} />
        </mesh>
        {/* chain runs */}
        <Pipe from={[-0.56, 0.32, 0.065]} to={[-0.56, 1.3, 0.3]} r={0.012} color="#78839b" e={0.18} />
        <Pipe from={[-0.56, 0.32, -0.065]} to={[-0.56, 1.3, -0.3]} r={0.012} color="#78839b" e={0.18} />
        <Pipe from={[-0.56, 1.405, -0.2]} to={[-0.56, 1.405, 0.2]} r={0.012} color="#78839b" e={0.18} />
        {/* tensioner shoe + fixed guide */}
        <mesh position={[-0.56, 0.82, 0.21]} rotation={[-0.23, 0, 0]}>
          <boxGeometry args={[0.025, 0.55, 0.045]} />
          <Mat color="#d6a73d" e={0.22} metal={0.1} rough={0.7} />
        </mesh>
        <mesh position={[-0.56, 0.82, -0.21]} rotation={[0.23, 0, 0]}>
          <boxGeometry args={[0.025, 0.55, 0.045]} />
          <Mat color="#b78748" e={0.18} metal={0.1} rough={0.7} />
        </mesh>
      </PartGroup>

      {/* oil pump & lubrication */}
      <PartGroup id="eng-oilpump" explode={[0, -0.4, 0.95]}>
        <mesh position={[-0.42, 0.26, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.1, 18]} />
          <Mat color="#8893a5" e={0.15} metal={0.8} />
        </mesh>
        {/* gerotor hint */}
        <mesh position={[-0.365, 0.26, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.015, 8]} />
          <Mat color="#d6b88a" e={0.3} metal={0.9} />
        </mesh>
        {/* pickup + strainer */}
        <Pipe from={[-0.38, 0.22, 0.2]} to={[-0.12, 0.09, 0.14]} r={0.022} color="#78839b" e={0.12} />
        <mesh position={[-0.08, 0.075, 0.14]}>
          <boxGeometry args={[0.14, 0.02, 0.1]} />
          <Mat color="#9aa5b5" e={0.18} metal={0.8} />
        </mesh>
        {/* oil filter on block side */}
        <mesh position={[-0.25, 0.45, 0.37]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.12, 16]} />
          <Mat color="#3a6ea5" e={0.25} metal={0.3} rough={0.5} />
        </mesh>
        {/* gallery line + piston spray jet */}
        <Pipe from={[-0.38, 0.3, 0.22]} to={[-0.25, 0.45, 0.34]} r={0.014} color="#d6a73d" e={0.25} />
        <Pipe from={[-0.2, 0.42, 0.1]} to={[-0.375, 0.78, 0.02]} r={0.01} color="#ffd27a" e={0.4} />
      </PartGroup>

      {/* flywheel & ring gear — rear */}
      <PartGroup id="eng-flywheel" explode={[0.95, 0, 0]}>
        <mesh position={[0.66, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 36]} />
          <Mat color="#6b7687" e={0.12} metal={0.75} rough={0.4} />
        </mesh>
        {/* clutch friction face */}
        <mesh position={[0.69, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.012, 32]} />
          <Mat color="#9aa5b5" e={0.2} metal={0.9} rough={0.2} />
        </mesh>
        {/* ring gear */}
        <mesh position={[0.655, 0.32, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.305, 0.022, 10, 48]} />
          <Mat color="#c9b458" e={0.28} metal={0.9} />
        </mesh>
        {/* crank bolt circle */}
        {[...Array(6)].map((_, i) => {
          const a = (i * Math.PI * 2) / 6
          return (
            <mesh
              key={i}
              position={[0.63, 0.32 + Math.sin(a) * 0.08, Math.cos(a) * 0.08]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.014, 0.014, 0.04, 6]} />
              <Mat color="#c9b458" e={0.35} metal={0.9} />
            </mesh>
          )
        })}
      </PartGroup>

      {/* head bolts */}
      <PartGroup id="eng-bolts" explode={[0, 1.55, 0]}>
        {[0, 1, 2, 3, 4].flatMap((i) =>
          [-0.22, 0.22].map((z) => (
            <group key={`${i}${z}`} position={[-0.44 + i * 0.22, 1.42, z]}>
              <mesh>
                <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
                <Mat color="#c9b458" e={0.3} metal={0.9} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.03, 6]} />
                <Mat color="#c9b458" e={0.4} metal={0.9} />
              </mesh>
            </group>
          )),
        )}
      </PartGroup>
    </group>
  )
}

/* ================================= PISTON ================================ */

export function PistonView() {
  return (
    <group>
      <PartGroup id="pst-crown" explode={[0, 0.6, 0]}>
        <CrownReal />
      </PartGroup>
      <PartGroup id="pst-rings" explode={[0.95, 0.4, 0]}>
        <PistonRingPackReal />
      </PartGroup>
      <PartGroup id="pst-pin" explode={[0, 0, 0.95]}>
        <PinReal />
      </PartGroup>
      <PartGroup id="pst-rod" explode={[0, -0.5, 0]}>
        <RodReal />
      </PartGroup>
      <PartGroup id="pst-bearing" explode={[0, -0.55, 0.75]}>
        <RodBearingsReal />
      </PartGroup>
    </group>
  )
}

/** superseded by PistonDetail — kept until cleanup */
function LegacyPistonView() {
  void LegacyPistonView
  return (
    <group>
      <PartGroup id="pst-crown" explode={[0, 0.6, 0]}>
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.26, 32]} />
          <Mat color="#d8dee9" e={0.15} metal={0.85} rough={0.3} />
        </mesh>
        {/* ring grooves */}
        {[1.19, 1.13, 1.06].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.322, 0.012, 8, 48]} />
            <Mat color="#1a202c" e={0.02} />
          </mesh>
        ))}
        {/* skirt */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.16, 32, 1, true]} />
          <Mat color="#9aa5b5" e={0.1} metal={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* valve pockets */}
        {[-0.1, 0.1].map((z) => (
          <mesh key={z} position={[0.08, 1.215, z]}>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
            <Mat color="#4a5568" e={0.08} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="pst-rings" explode={[0.95, 0.4, 0]}>
        {[
          { y: 1.19, t: 0.016 },
          { y: 1.13, t: 0.014 },
          { y: 1.06, t: 0.02 },
        ].map((r, i) => (
          <mesh key={i} position={[0, r.y, 0]} rotation={[Math.PI / 2, 0, 0.3]}>
            <torusGeometry args={[0.335, r.t, 10, 64, 6.0]} />
            <Mat color={i === 2 ? '#b8c4d6' : '#8893a5'} e={0.3} metal={0.95} rough={0.2} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="pst-pin" explode={[0, 0, 0.95]}>
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.5, 20, 1, true]} />
          <Mat color="#b8c4d6" e={0.2} metal={0.95} rough={0.15} side={THREE.DoubleSide} />
        </mesh>
      </PartGroup>

      <PartGroup id="pst-rod" explode={[0, -0.5, 0]}>
        {/* small end */}
        <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.035, 10, 28]} />
          <Mat color="#8893a5" e={0.12} metal={0.85} />
        </mesh>
        {/* I-beam */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.1, 0.55, 0.05]} />
          <Mat color="#8893a5" e={0.12} metal={0.85} />
        </mesh>
        <mesh position={[0, 0.52, 0.045]}>
          <boxGeometry args={[0.14, 0.55, 0.02]} />
          <Mat color="#78839b" e={0.1} metal={0.85} />
        </mesh>
        <mesh position={[0, 0.52, -0.045]}>
          <boxGeometry args={[0.14, 0.55, 0.02]} />
          <Mat color="#78839b" e={0.1} metal={0.85} />
        </mesh>
        {/* big end + cap */}
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.05, 10, 32]} />
          <Mat color="#8893a5" e={0.12} metal={0.85} />
        </mesh>
        {[-0.13, 0.13].map((x) => (
          <mesh key={x} position={[x, 0.06, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
            <Mat color="#c9b458" e={0.3} metal={0.9} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="pst-bearing" explode={[0, -0.55, 0.75]}>
        {[0, Math.PI].map((th, i) => (
          <mesh key={i} position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, th]}>
            <cylinderGeometry args={[0.125, 0.125, 0.09, 24, 1, true, 0, Math.PI]} />
            <Mat color={i ? '#c0c9d8' : '#d6b88a'} e={0.25} metal={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ RING PACK =============================== */

export function RingsView() {
  return (
    <group>
      {/* ghost cylinder bore for context */}
      <Ghost>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.66, 0.66, 1.3, 40, 1, true]} />
          <GhostMat opacity={0.08} />
        </mesh>
      </Ghost>

      <PartGroup id="rng-top" explode={[0, 0.55, 0]}>
        <TopRingXL />
      </PartGroup>
      <PartGroup id="rng-second" explode={[0, 0, 0]}>
        <SecondRingXL />
      </PartGroup>
      <PartGroup id="rng-oil" explode={[0, -0.55, 0]}>
        <OilRingXL />
      </PartGroup>
    </group>
  )
}

/* ============================== CYLINDER HEAD ============================= */

export function HeadView() {
  return (
    <group>
      <Ghost>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.3, 0.5, 0.75]} />
          <GhostMat opacity={0.07} />
        </mesh>
      </Ghost>
      <PartGroup id="hd-valves" explode={[0, -0.6, 0]}>
        <ValvesReal />
      </PartGroup>
      <PartGroup id="hd-springs" explode={[0, 0.55, 0]}>
        <SpringsReal />
      </PartGroup>
      <PartGroup id="hd-cams" explode={[0, 0.9, 0]}>
        <CamsReal />
      </PartGroup>
      <PartGroup id="hd-plugs" explode={[0, 0.45, 0.95]}>
        <PlugsReal />
      </PartGroup>
    </group>
  )
}

/** superseded by HeadInternals — kept until cleanup */
function LegacyHeadView() {
  void LegacyHeadView
  const springGeo = useSpringGeo(0.042, 0.15, 5, 0.009)
  const vx = [-0.45, -0.15, 0.15, 0.45]
  return (
    <group>
      <Ghost>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.3, 0.5, 0.75]} />
          <GhostMat opacity={0.07} />
        </mesh>
      </Ghost>

      <PartGroup id="hd-valves" explode={[0, -0.6, 0]}>
        {vx.flatMap((x) =>
          [-0.18, 0.18].map((z) => (
            <group key={`${x}${z}`} position={[x, 0, z]} rotation={[Math.sign(z) * 0.22, 0, 0]}>
              <mesh position={[0, 0.72, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.42, 8]} />
                <Mat color="#c0c9d8" e={0.2} metal={0.9} />
              </mesh>
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[z > 0 ? 0.075 : 0.062, 0.03, 0.04, 18]} />
                <Mat color={z > 0 ? '#9fb2c8' : '#c08a5a'} e={0.25} metal={0.9} />
              </mesh>
            </group>
          )),
        )}
      </PartGroup>

      <PartGroup id="hd-springs" explode={[0, 0.55, 0]}>
        {vx.flatMap((x) =>
          [-0.18, 0.18].map((z) => (
            <group key={`${x}${z}`} position={[x, 0.82, z * 1.25]} rotation={[Math.sign(z) * 0.22, 0, 0]}>
              <mesh geometry={springGeo}>
                <Mat color="#b388ff" e={0.4} />
              </mesh>
              <mesh position={[0, 0.17, 0]}>
                <cylinderGeometry args={[0.045, 0.045, 0.02, 12]} />
                <Mat color="#8893a5" e={0.15} metal={0.9} />
              </mesh>
            </group>
          )),
        )}
      </PartGroup>

      <PartGroup id="hd-cams" explode={[0, 0.9, 0]}>
        {[-0.26, 0.26].map((z) => (
          <group key={z}>
            <mesh position={[0, 1.3, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.038, 0.038, 1.25, 14]} />
              <Mat color="#78839b" e={0.15} metal={0.85} />
            </mesh>
            {vx.map((x, i) => (
              <mesh
                key={x}
                position={[x, 1.3, z]}
                rotation={[0, 0, Math.PI / 2]}
                scale={[1, 1, 1.45]}
              >
                <cylinderGeometry args={[0.07, 0.07, 0.05, 18]} />
                <Mat color="#9aa5b5" e={0.22} metal={0.9} rough={0.25} />
              </mesh>
            ))}
          </group>
        ))}
      </PartGroup>

      <PartGroup id="hd-plugs" explode={[0, 0.45, 0.95]}>
        {vx.map((x) => (
          <group key={x} position={[x, 0.72, 0]}>
            <mesh>
              <cylinderGeometry args={[0.028, 0.028, 0.22, 10]} />
              <Mat color="#e8ecf4" e={0.25} metal={0.3} rough={0.4} />
            </mesh>
            <mesh position={[0, -0.13, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
              <Mat color="#ffd27a" e={0.8} />
            </mesh>
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.06, 6]} />
              <Mat color="#556" e={0.1} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================= TURBO ================================= */

function Impeller({ color, e = 0.3, cone = false }: { color: string; e?: number; cone?: boolean }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        {cone ? (
          <cylinderGeometry args={[0.08, 0.3, 0.26, 20]} />
        ) : (
          <cylinderGeometry args={[0.3, 0.08, 0.26, 20]} />
        )}
        <Mat color={color} e={e * 0.5} metal={0.9} rough={0.3} />
      </mesh>
      {[...Array(9)].map((_, i) => (
        <mesh key={i} rotation={[(i * Math.PI * 2) / 9, 0, 0]} position={[0, 0, 0]}>
          <boxGeometry args={[0.24, 0.6, 0.015]} />
          <Mat color={color} e={e} metal={0.9} rough={0.25} />
        </mesh>
      ))}
    </group>
  )
}

export function TurboView() {
  return (
    <group>
      {/* ghost volutes */}
      <Ghost>
        <mesh position={[-0.6, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.42, 0.13, 14, 40]} />
          <GhostMat opacity={0.09} color="#2a1510" />
        </mesh>
        <mesh position={[0.6, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.42, 0.15, 14, 40]} />
          <GhostMat opacity={0.09} />
        </mesh>
      </Ghost>

      <PartGroup id="trb-turbine" explode={[-0.9, 0, 0]}>
        <group position={[-0.6, 0.75, 0]} scale={0.55}>
          <Impeller color="#c97a4a" e={0.4} cone />
        </group>
      </PartGroup>

      <PartGroup id="trb-comp" explode={[0.9, 0, 0]}>
        <group position={[0.6, 0.75, 0]} scale={0.55}>
          <Impeller color="#b8c4d6" e={0.35} />
        </group>
      </PartGroup>

      <PartGroup id="trb-chra" explode={[0, -0.55, 0]}>
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 20]} />
          <Mat color="#6b7687" e={0.12} />
        </mesh>
        <mesh position={[0, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 1.3, 10]} />
          <Mat color="#c0c9d8" e={0.25} metal={0.95} />
        </mesh>
        <Pipe from={[0, 1.0, 0]} to={[0, 0.88, 0]} r={0.03} color="#c9b458" e={0.3} />
        {/* floating bearings */}
        {[-0.14, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.08, 14, 1, true]} />
            <Mat color="#d6b88a" e={0.3} metal={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="trb-wastegate" explode={[0, 0.6, 0.8]}>
        <mesh position={[-0.35, 0.75, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 18]} />
          <Mat color="#8893a5" e={0.15} />
        </mesh>
        <Pipe from={[-0.35, 0.75, 0.44]} to={[-0.55, 0.75, 0.1]} r={0.02} color="#9aa5b5" e={0.2} />
        <mesh position={[-0.35, 0.75, 0.57]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 10]} />
          <Mat color="#ffb347" e={0.3} />
        </mesh>
      </PartGroup>
    </group>
  )
}

/* ================================= INTAKE ================================ */

export function IntakeView() {
  return (
    <group>
      <PartGroup id="int-plenum" explode={[-0.8, 0.25, 0]}>
        <mesh position={[-0.35, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 1.1, 24]} />
          <Mat color={PWR} e={0.15} metal={0.3} rough={0.6} />
        </mesh>
      </PartGroup>

      <PartGroup id="int-runners" explode={[0.3, -0.2, 0]}>
        {[-0.42, -0.14, 0.14, 0.42].map((z) => (
          <group key={z}>
            <Pipe from={[-0.25, 0.8, z]} to={[0.45, 0.55, z]} r={0.055} color={PWR} e={0.18} />
            <mesh position={[0.5, 0.53, z]} rotation={[0, 0, -0.35]}>
              <boxGeometry args={[0.04, 0.16, 0.14]} />
              <Mat color="#8a4a2a" e={0.12} />
            </mesh>
          </group>
        ))}
      </PartGroup>

      <PartGroup id="int-throttle" explode={[0, 0.5, 0.9]}>
        <mesh position={[-0.35, 0.85, 0.68]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.18, 22]} />
          <Mat color="#8893a5" e={0.15} metal={0.8} />
        </mesh>
        <mesh position={[-0.35, 0.85, 0.68]} rotation={[Math.PI / 2.6, 0, 0]}>
          <cylinderGeometry args={[0.115, 0.115, 0.012, 22]} />
          <Mat color="#b8c4d6" e={0.3} metal={0.9} />
        </mesh>
        <mesh position={[-0.18, 0.85, 0.68]}>
          <boxGeometry args={[0.12, 0.1, 0.1]} />
          <Mat color="#1a202c" e={0.08} />
        </mesh>
      </PartGroup>

      <PartGroup id="int-aircleaner" explode={[-0.5, 0.75, 0.5]}>
        {/* airbox with translucent lid showing pleats */}
        <mesh position={[-0.75, 1.3, 0.3]}>
          <boxGeometry args={[0.44, 0.06, 0.34]} />
          <Mat color="#2e3642" e={0.06} rough={0.7} opacity={0.4} depthWrite={false} />
        </mesh>
        <mesh position={[-0.75, 1.14, 0.3]}>
          <boxGeometry args={[0.44, 0.26, 0.34]} />
          <Mat color="#1d242e" e={0.05} rough={0.8} />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-0.92 + i * 0.05, 1.26, 0.3]}>
            <boxGeometry args={[0.018, 0.09, 0.3]} />
            <Mat color="#e8e2d4" e={0.1} metal={0} rough={0.9} />
          </mesh>
        ))}
        {/* MAF + duct to plenum */}
        <mesh position={[-0.52, 1.2, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 0.1, 0.07]} />
          <Mat color="#1a202c" e={0.08} />
        </mesh>
        <Pipe from={[-0.55, 1.18, 0.3]} to={[-0.38, 0.95, 0.18]} r={0.05} color="#2b2f35" e={0.05} />
      </PartGroup>

      <PartGroup id="int-injectors" explode={[0.85, -0.35, 0]}>
        {[-0.42, -0.14, 0.14, 0.42].map((z) => (
          <group key={z} position={[0.42, 0.72, z]} rotation={[0, 0, -0.5]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.02, 0.16, 10]} />
              <Mat color="#4a5568" e={0.15} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.05, 0.05, 0.035]} />
              <Mat color="#1a202c" e={0.1} />
            </mesh>
            <mesh position={[0, -0.13, 0]}>
              <coneGeometry args={[0.045, 0.1, 10, 1, true]} />
              <Mat color="#ffd27a" e={0.5} opacity={0.35} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </PartGroup>
    </group>
  )
}

/* ================================ EXHAUST ================================ */

export function ExhaustView() {
  return (
    <group>
      <PartGroup id="exh-downpipe" explode={[-0.85, 0, 0]}>
        <Pipe from={[-1.25, 1.1, 0]} to={[-0.95, 0.65, 0]} r={0.09} color="#9a6a3a" e={0.18} />
        <Pipe from={[-0.95, 0.65, 0]} to={[-0.45, 0.6, 0]} r={0.09} color="#8d99ae" e={0.12} />
        {/* flex bellows */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.78 + i * 0.045, 0.635, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.1, 0.014, 8, 24]} />
            <Mat color="#b8c4d6" e={0.2} metal={0.9} />
          </mesh>
        ))}
      </PartGroup>

      <PartGroup id="exh-cat" explode={[0, 0, 0]}>
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.65, 24]} />
          <Mat color="#b78748" e={0.22} />
        </mesh>
        {/* honeycomb face */}
        <mesh position={[0.33, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.19, 0.19, 0.012, 24]} />
          <Mat color="#ffd27a" e={0.5} />
        </mesh>
        {[0.1, 0.15].map((r, i) => (
          <mesh key={i} position={[0.337, 0.6, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[r, 0.004, 6, 28]} />
            <Mat color="#8a5a2a" e={0.3} />
          </mesh>
        ))}
        <Pipe from={[-0.45, 0.6, 0]} to={[-0.33, 0.6, 0]} r={0.08} color="#8d99ae" e={0.1} />
      </PartGroup>

      <PartGroup id="exh-muffler" explode={[0.9, 0, 0]}>
        <mesh position={[0.95, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.8, 24, 1, false, 0, Math.PI * 1.55]} />
          <Mat color="#8d99ae" e={0.12} side={THREE.DoubleSide} />
        </mesh>
        {/* internal chambers + perforated tube */}
        {[-0.2, 0.05, 0.3].map((dx) => (
          <mesh key={dx} position={[0.95 + dx, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.015, 24]} />
            <Mat color="#6b7687" e={0.15} />
          </mesh>
        ))}
        <Pipe from={[0.55, 0.6, 0]} to={[1.35, 0.6, 0.08]} r={0.045} color="#9aa5b5" e={0.2} />
        <Pipe from={[1.35, 0.6, 0.08]} to={[1.5, 0.62, 0.08]} r={0.05} color="#ff2d7a" e={0.5} />
      </PartGroup>
    </group>
  )
}

/* =============================== FUEL TANK =============================== */

export function FuelTankView() {
  return (
    <group>
      <PartGroup id="tnk-shell" explode={[0, 0.85, 0]} renderOrder={5}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.25, 0.5, 0.9]} />
          <Mat color={PWR} e={0.08} metal={0.2} rough={0.6} opacity={0.3} depthWrite={false} />
        </mesh>
        <mesh position={[0.3, 0.83, 0.2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
          <Mat color="#667" e={0.15} />
        </mesh>
      </PartGroup>

      <PartGroup id="tnk-pump" explode={[0.75, 0, 0.55]}>
        <mesh position={[0.3, 0.5, 0.2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.34, 18]} />
          <Mat color="#ffe94d" e={0.25} metal={0.4} />
        </mesh>
        <mesh position={[0.3, 0.38, 0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 18, 1, true]} />
          <Mat color="#8893a5" e={0.12} side={THREE.DoubleSide} />
        </mesh>
        <Pipe from={[0.3, 0.68, 0.2]} to={[0.3, 0.82, 0.2]} r={0.02} color="#ffe94d" e={0.3} />
      </PartGroup>

      <PartGroup id="tnk-baffles" explode={[-0.75, 0, -0.5]}>
        {[-0.25, 0.1].map((x) => (
          <mesh key={x} position={[x, 0.52, -0.05]}>
            <boxGeometry args={[0.025, 0.4, 0.75]} />
            <Mat color="#c05a2a" e={0.15} opacity={0.85} />
          </mesh>
        ))}
        <mesh position={[-0.08, 0.52, 0.25]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.025, 0.4, 0.5]} />
          <Mat color="#c05a2a" e={0.15} opacity={0.85} />
        </mesh>
      </PartGroup>
    </group>
  )
}
