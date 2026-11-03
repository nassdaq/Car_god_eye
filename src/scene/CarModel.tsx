import { useMemo } from 'react'
import * as THREE from 'three'
import { systemColor } from '../data/parts'
import { useGodEye } from '../state'
import { Mat, PartGroup, Pipe, useSpringGeo } from './lib'
import { Lathe, PMat, RBox } from './realism'
import { BlockReal, PanReal } from './engine-parts/Block'
import { HeadReal } from './engine-parts/Head'
import { FlywheelReal } from './engine-parts/Crank'
import { TimingReal } from './engine-parts/Timing'
import { AlternatorReal, CoilsReal, StarterReal } from './engine-parts/Electrics'
import { ValvetrainMini } from './engine-parts/ValvetrainMini'
import {
  ExhaustManifoldReal,
  IntakeManifoldReal,
  TurboMiniReal,
} from './engine-parts/Manifolds'

import {
  DifferentialMini,
  DriveshaftMini,
  ExhaustMini,
  TransmissionMini,
} from './root-minis/RearDrive'
import {
  BatteryMini,
  ChassisFrameMini,
  EcuMini,
  FuelTankMini,
  RadiatorMini,
} from './root-minis/AuxMini'
import { BrakesMini, SteeringMini, SuspensionMini } from './root-minis/RunningGear'
import { SafetyMini } from './root-minis/SafetyMini'
import { BodyMechMini } from './root-minis/BodyMechMini'
import { HvacMini } from './root-minis/HvacMini'
import { TeardownField } from './TeardownField'

/** the bay transform: engine-stage coords → car bay (timing end faces the nose) */
function BayMount({ children }: { children: React.ReactNode }) {
  return (
    <group position={[1.28, 0.26, 0]} rotation={[0, Math.PI, 0]} scale={0.4}>
      {children}
    </group>
  )
}

function useBodyGeo() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-2.15, 0.3)
    s.lineTo(-2.2, 0.62)
    s.quadraticCurveTo(-1.9, 0.8, -1.45, 0.82)
    s.quadraticCurveTo(-1.0, 1.18, -0.35, 1.2)
    s.lineTo(0.3, 1.18)
    s.quadraticCurveTo(0.9, 1.05, 1.25, 0.84)
    s.quadraticCurveTo(1.8, 0.72, 2.2, 0.6)
    s.quadraticCurveTo(2.32, 0.5, 2.27, 0.38)
    s.lineTo(2.1, 0.3)
    s.lineTo(1.77, 0.3)
    s.absarc(1.35, 0.3, 0.42, 0, Math.PI, false)
    s.lineTo(-0.93, 0.3)
    s.absarc(-1.35, 0.3, 0.42, 0, Math.PI, false)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 1.3,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.1,
      bevelSegments: 7,
      curveSegments: 40,
    })
    geo.translate(0, 0, -0.65)
    return geo
  }, [])
}

function useGlassGeo() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.38, 0.84)
    s.quadraticCurveTo(-1.0, 1.15, -0.36, 1.17)
    s.lineTo(0.28, 1.15)
    s.quadraticCurveTo(0.85, 1.02, 1.16, 0.84)
    s.closePath()
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: 1.0,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 5,
      curveSegments: 32,
    })
    geo.translate(0, 0, -0.5)
    return geo
  }, [])
}

const C = {
  pwr: systemColor('powertrain'),
  drv: systemColor('drivetrain'),
  chs: systemColor('chassis'),
  sus: systemColor('suspension'),
  brk: systemColor('brakes'),
  whl: systemColor('wheels'),
  thm: systemColor('thermal'),
  ele: systemColor('electrical'),
  bdy: systemColor('body'),
  int: systemColor('interior'),
}

function Engine() {
  return (
    <PartGroup id="engine" explode={[0, 1.1, 0]}>
      {/* the real engine exterior, scaled into the bay — timing end faces the nose */}
      <group position={[1.28, 0.26, 0]} rotation={[0, Math.PI, 0]} scale={0.4}>
        <BlockReal />
        <PanReal />
        <HeadReal />
        <ValvetrainMini />
        <TimingReal />
        <FlywheelReal />
        <CoilsReal />
        <AlternatorReal />
        <StarterReal />
        <ExhaustManifoldReal />
      </group>
    </PartGroup>
  )
}

function Turbo() {
  return (
    <PartGroup id="turbo" explode={[0, 0.5, 1.0]}>
      <BayMount>
        <TurboMiniReal />
      </BayMount>
    </PartGroup>
  )
}

function Intake() {
  return (
    <PartGroup id="intake" explode={[0, 1.1, -0.8]}>
      <BayMount>
        <IntakeManifoldReal />
      </BayMount>
    </PartGroup>
  )
}

function Exhaust() {
  return (
    <PartGroup id="exhaust" explode={[-0.2, 0.45, 1.2]}>
      <Pipe from={[0.98, 0.38, -0.52]} to={[0.5, 0.16, 0.33]} r={0.045} color="#9a6a3a" e={0.18} />
      <mesh position={[0.22, 0.16, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
        <Mat color="#b78748" e={0.25} />
      </mesh>
      <Pipe from={[-0.03, 0.16, 0.35]} to={[-1.45, 0.16, 0.35]} r={0.042} color="#8d99ae" e={0.1} />
      <mesh position={[-1.72, 0.2, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 0.5, 16]} />
        <Mat color="#8d99ae" e={0.12} />
      </mesh>
      <Pipe from={[-1.97, 0.2, 0.35]} to={[-2.28, 0.24, 0.35]} r={0.035} color="#ff2d7a" e={0.5} />
    </PartGroup>
  )
}

function FuelTank() {
  return (
    <PartGroup id="fueltank" explode={[-0.4, 0.8, 0.5]}>
      <mesh position={[-0.85, 0.3, 0]}>
        <boxGeometry args={[0.72, 0.22, 0.85]} />
        <Mat color={C.pwr} e={0.1} metal={0.3} rough={0.6} />
      </mesh>
      <mesh position={[-0.85, 0.43, 0.15]}>
        <cylinderGeometry args={[0.06, 0.06, 0.06, 12]} />
        <Mat color="#667" />
      </mesh>
      <Pipe from={[-0.6, 0.35, 0.2]} to={[0.9, 0.4, 0.18]} r={0.015} color={C.pwr} e={0.25} />
    </PartGroup>
  )
}

function Transmission() {
  return (
    <PartGroup id="transmission" explode={[0, 0.8, 0.6]}>
      <mesh position={[0.88, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.21, 0.23, 0.1, 20]} />
        <Mat color={C.drv} e={0.15} />
      </mesh>
      <mesh position={[0.55, 0.43, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.19, 0.58, 20]} />
        <Mat color={C.drv} />
      </mesh>
      <mesh position={[0.45, 0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
        <Mat color="#778" />
      </mesh>
    </PartGroup>
  )
}

function Driveshaft() {
  return (
    <PartGroup id="driveshaft" explode={[0, 0.6, -0.6]}>
      <Pipe from={[0.25, 0.4, 0]} to={[-1.18, 0.35, 0]} r={0.038} color={C.drv} e={0.2} />
      <mesh position={[0.25, 0.4, 0]}>
        <boxGeometry args={[0.07, 0.1, 0.1]} />
        <Mat color="#99a" />
      </mesh>
      <mesh position={[-1.18, 0.35, 0]}>
        <boxGeometry args={[0.07, 0.1, 0.1]} />
        <Mat color="#99a" />
      </mesh>
    </PartGroup>
  )
}

function Differential() {
  return (
    <PartGroup id="differential" explode={[-1.0, 0.3, 0]}>
      <mesh position={[-1.35, 0.34, 0]}>
        <sphereGeometry args={[0.15, 20, 16]} />
        <Mat color={C.drv} e={0.18} />
      </mesh>
      <mesh position={[-1.24, 0.345, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.09, 0.14, 14]} />
        <Mat color={C.drv} />
      </mesh>
      <Pipe from={[-1.35, 0.34, 0.1]} to={[-1.35, 0.34, 0.62]} r={0.032} color={C.drv} e={0.15} />
      <Pipe from={[-1.35, 0.34, -0.1]} to={[-1.35, 0.34, -0.62]} r={0.032} color={C.drv} e={0.15} />
    </PartGroup>
  )
}

function ChassisFrame() {
  return (
    <PartGroup id="chassisframe">
      {[-0.5, 0.5].map((z) => (
        <mesh key={z} position={[0, 0.22, z]}>
          <boxGeometry args={[3.9, 0.07, 0.07]} />
          <Mat color={C.chs} e={0.15} />
        </mesh>
      ))}
      {[-1.6, -0.6, 0.4, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.07, 0.06, 1.0]} />
          <Mat color={C.chs} e={0.15} />
        </mesh>
      ))}
      {[2.05, -2.05].map((x) => (
        <mesh key={x} position={[x, 0.34, 0]}>
          <boxGeometry args={[0.08, 0.1, 1.3]} />
          <Mat color={C.chs} e={0.2} />
        </mesh>
      ))}
    </PartGroup>
  )
}

function SuspensionCorner({
  x,
  z,
  springGeo,
}: {
  x: number
  z: number
  springGeo: THREE.TubeGeometry
}) {
  const sz = Math.sign(z)
  return (
    <group userData={{ explode: [Math.sign(x) * 0.5, 0.55, sz * 0.85] }}>
      <mesh position={[x, 0.26, z * 0.72]}>
        <boxGeometry args={[0.3, 0.035, 0.34]} />
        <Mat color={C.sus} e={0.15} />
      </mesh>
      <mesh position={[x, 0.38, z * 0.98]}>
        <boxGeometry args={[0.06, 0.26, 0.05]} />
        <Mat color={C.sus} />
      </mesh>
      <group position={[x, 0.3, z * 0.82]} rotation={[sz * -0.28, 0, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.42, 12]} />
          <Mat color="#c9b458" e={0.25} />
        </mesh>
        <mesh geometry={springGeo} position={[0, 0.1, 0]}>
          <Mat color={C.sus} e={0.5} />
        </mesh>
      </group>
    </group>
  )
}

function Suspension() {
  const springGeo = useSpringGeo()
  return (
    <PartGroup id="suspension" perChild>
      {[1.35, -1.35].flatMap((x) =>
        [0.62, -0.62].map((z) => (
          <SuspensionCorner key={`${x}${z}`} x={x} z={z} springGeo={springGeo} />
        )),
      )}
    </PartGroup>
  )
}

function Brakes() {
  return (
    <PartGroup id="brakes" perChild>
      {[1.35, -1.35].flatMap((x) =>
        [0.64, -0.64].map((z) => (
          <group key={`${x}${z}`} userData={{ explode: [0, 0, Math.sign(z) * 0.8] }}>
            <mesh position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.21, 0.21, 0.035, 32]} />
              <Mat color={C.brk} e={0.22} metal={0.85} rough={0.3} />
            </mesh>
            <mesh position={[x, 0.34, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
              <Mat color="#555a66" />
            </mesh>
            <mesh position={[x + 0.12, 0.46, z]} rotation={[0, 0, -0.5]}>
              <boxGeometry args={[0.09, 0.17, 0.09]} />
              <Mat color={C.brk} e={0.45} />
            </mesh>
          </group>
        )),
      )}
    </PartGroup>
  )
}

function Wheels() {
  return (
    <PartGroup id="wheels" perChild>
      {[1.35, -1.35].flatMap((x) =>
        [0.78, -0.78].map((z) => (
          <group
            key={`${x}${z}`}
            position={[x, 0.34, z]}
            userData={{ explode: [0, 0, Math.sign(z) * 1.5] }}
          >
            {/* tire — lathe profile: flat tread, round shoulders */}
            <Lathe
              pts={[
                [0.205, -0.115],
                [0.3, -0.108],
                [0.332, -0.065],
                [0.34, 0],
                [0.332, 0.065],
                [0.3, 0.108],
                [0.205, 0.115],
              ]}
              seg={40}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <PMat m="rubber" e={0.02} />
            </Lathe>
            {[-0.045, 0.045].map((dz) => (
              <mesh key={dz} position={[0, 0, dz]}>
                <torusGeometry args={[0.3415, 0.004, 6, 48]} />
                <Mat color="#232830" e={0.04} metal={0} rough={0.95} />
              </mesh>
            ))}
            {/* rim barrel + lip */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.205, 0.205, 0.17, 32, 1, true]} />
              <PMat m="machAlu" e={0.05} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, Math.sign(z) * 0.088]}>
              <torusGeometry args={[0.2, 0.009, 8, 36]} />
              <PMat m="machAlu" e={0.06} />
            </mesh>
            {/* twin spokes */}
            {[0, 1, 2, 3, 4].map((i) => (
              <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
                {[-0.018, 0.018].map((dx) => (
                  <mesh key={dx} position={[dx, 0, Math.sign(z) * 0.055]} rotation={[0, 0, dx * 3]}>
                    <boxGeometry args={[0.022, 0.37, 0.025]} />
                    <PMat m="machAlu" e={0.06} />
                  </mesh>
                ))}
              </group>
            ))}
            {/* hub + center cap */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, Math.sign(z) * 0.04]}>
              <cylinderGeometry args={[0.055, 0.065, 0.06, 20]} />
              <PMat m="steel" e={0.05} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, Math.sign(z) * 0.075]}>
              <cylinderGeometry args={[0.028, 0.028, 0.015, 16]} />
              <Mat color={C.whl} e={0.5} metal={0.2} />
            </mesh>
          </group>
        )),
      )}
    </PartGroup>
  )
}

function Radiator() {
  return (
    <PartGroup id="radiator" explode={[1.2, 0.35, 0]}>
      <mesh position={[1.95, 0.5, 0]}>
        <boxGeometry args={[0.07, 0.38, 0.92]} />
        <Mat color={C.thm} e={0.25} metal={0.5} />
      </mesh>
      <mesh position={[1.95, 0.71, 0]}>
        <boxGeometry args={[0.09, 0.05, 0.92]} />
        <Mat color="#1d3a45" e={0.1} />
      </mesh>
      <mesh position={[1.95, 0.29, 0]}>
        <boxGeometry args={[0.09, 0.05, 0.92]} />
        <Mat color="#1d3a45" e={0.1} />
      </mesh>
      <mesh position={[1.86, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 20]} />
        <Mat color="#28506b" e={0.2} />
      </mesh>
      <Pipe from={[1.9, 0.68, 0.2]} to={[1.45, 0.66, 0.12]} r={0.032} color={C.thm} e={0.2} />
      <Pipe from={[1.9, 0.32, -0.2]} to={[1.45, 0.38, -0.12]} r={0.032} color={C.thm} e={0.2} />
    </PartGroup>
  )
}

function Battery() {
  return (
    <PartGroup id="battery" explode={[0.4, 0.9, -0.7]}>
      <mesh position={[1.62, 0.62, -0.5]}>
        <boxGeometry args={[0.26, 0.18, 0.18]} />
        <Mat color={C.ele} e={0.2} metal={0.2} rough={0.7} />
      </mesh>
      <mesh position={[1.54, 0.73, -0.46]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 10]} />
        <Mat color="#ff5555" e={0.6} />
      </mesh>
      <mesh position={[1.7, 0.73, -0.46]}>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 10]} />
        <Mat color="#223" e={0.2} />
      </mesh>
    </PartGroup>
  )
}

function Ecu() {
  return (
    <PartGroup id="ecu" explode={[0.4, 0.9, 0.7]}>
      <mesh position={[1.58, 0.63, 0.48]}>
        <boxGeometry args={[0.22, 0.06, 0.16]} />
        <Mat color={C.ele} e={0.3} metal={0.6} />
      </mesh>
      {[-0.06, 0, 0.06].map((dx) => (
        <mesh key={dx} position={[1.58 + dx, 0.675, 0.48]}>
          <boxGeometry args={[0.02, 0.025, 0.14]} />
          <Mat color="#8a8a3a" e={0.2} />
        </mesh>
      ))}
    </PartGroup>
  )
}

function Headlights() {
  return (
    <PartGroup id="headlights" explode={[1.1, 0.35, 0]}>
      {[0.52, -0.52].map((z) => (
        <group key={z} position={[2.17, 0.52, z]} rotation={[0, -Math.sign(z) * 0.32, 0]}>
          {/* smoked housing */}
          <RBox args={[0.07, 0.1, 0.34]} radius={0.02} smoothness={3}>
            <Mat color="#0a0e14" e={0.03} metal={0.3} rough={0.3} opacity={0.65} depthWrite={false} />
          </RBox>
          {/* twin projector units */}
          {[-0.08, 0.07].map((dz, i) => (
            <group key={dz} position={[0.03, 0, dz]} rotation={[0, Math.PI / 2, 0]}>
              {/* bezel */}
              <mesh>
                <cylinderGeometry args={[i === 0 ? 0.045 : 0.036, i === 0 ? 0.05 : 0.04, 0.03, 20, 1, true]} />
                <PMat color="#1a1e26" rough={0.4} side={THREE.DoubleSide} />
              </mesh>
              {/* glass dome */}
              <mesh position={[0, 0.012, 0]}>
                <sphereGeometry args={[i === 0 ? 0.04 : 0.032, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <Mat color="#cfe9ff" e={0.1} metal={0} rough={0.05} opacity={0.35} depthWrite={false} />
              </mesh>
              {/* emitter */}
              <mesh position={[0, 0.004, 0]}>
                <cylinderGeometry args={[i === 0 ? 0.028 : 0.022, i === 0 ? 0.028 : 0.022, 0.008, 16]} />
                <Mat color="#eefaff" e={2.2} metal={0} rough={0.3} />
              </mesh>
            </group>
          ))}
          {/* DRL strip along the top edge */}
          <mesh position={[0.032, 0.052, 0]} rotation={[0, 0, -0.06]}>
            <boxGeometry args={[0.012, 0.012, 0.3]} />
            <Mat color="#dff6ff" e={1.6} metal={0} />
          </mesh>
          {/* turn signal */}
          <mesh position={[0.03, -0.035, -Math.sign(z) * 0.13]}>
            <boxGeometry args={[0.015, 0.02, 0.05]} />
            <Mat color="#ffb347" e={0.7} metal={0} />
          </mesh>
          {/* beam cone */}
          <mesh position={[1.15, -0.06, 0]} rotation={[0, 0, Math.PI / 2 + 0.06]}>
            <coneGeometry args={[0.55, 2.2, 20, 1, true]} />
            <Mat color="#dff6ff" e={0.3} metal={0} opacity={0.045} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </PartGroup>
  )
}

function BodyShell() {
  const geo = useBodyGeo()
  const glassGeo = useGlassGeo()
  const { selectedId, xray } = useGodEye()
  const passThrough = xray || selectedId !== null
  return (
    <PartGroup id="bodyshell" explode={[0, 1.6, 0]} passThrough={passThrough} renderOrder={10}>
      {/* main shell */}
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color="#071c26"
          emissive="#00f0ff"
          emissiveIntensity={0.06}
          metalness={0.3}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.15}
          transparent
          opacity={xray ? 0.05 : 0.17}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* glass canopy */}
      <mesh geometry={glassGeo} scale={[1, 1, 0.94]}>
        <meshPhysicalMaterial
          color="#03141c"
          emissive="#2ad8e8"
          emissiveIntensity={0.04}
          metalness={0}
          roughness={0.06}
          transparent
          opacity={xray ? 0.04 : 0.3}
          depthWrite={false}
        />
      </mesh>
      {/* mirrors */}
      {[0.84, -0.84].map((z) => (
        <group key={z} position={[0.95, 0.88, z]} rotation={[0, 0, -0.15]}>
          <mesh>
            <boxGeometry args={[0.1, 0.05, 0.07]} />
            <Mat color="#0d2a36" e={0.15} metal={0.4} rough={0.3} opacity={0.75} />
          </mesh>
          <mesh position={[0.02, -0.05, -Math.sign(z) * 0.03]} rotation={[Math.sign(z) * 0.5, 0, 0]}>
            <boxGeometry args={[0.015, 0.06, 0.02]} />
            <Mat color="#0d2a36" e={0.12} opacity={0.75} />
          </mesh>
        </group>
      ))}
      {/* front splitter */}
      <mesh position={[2.2, 0.27, 0]}>
        <boxGeometry args={[0.3, 0.025, 1.52]} />
        <Mat color="#10151d" e={0.08} rough={0.6} opacity={0.85} depthWrite={false} />
      </mesh>
      {/* rear diffuser + fins */}
      <mesh position={[-2.1, 0.28, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.26, 0.025, 1.4]} />
        <Mat color="#10151d" e={0.08} rough={0.6} opacity={0.85} depthWrite={false} />
      </mesh>
      {[-0.4, 0, 0.4].map((z) => (
        <mesh key={z} position={[-2.1, 0.23, z]} rotation={[0, 0, -0.12]}>
          <boxGeometry args={[0.24, 0.07, 0.015]} />
          <Mat color="#10151d" e={0.1} opacity={0.85} depthWrite={false} />
        </mesh>
      ))}
      {/* tail light assembly: smoked housing + light-bar + brake blocks + reverse */}
      <mesh position={[-2.19, 0.66, 0]}>
        <boxGeometry args={[0.045, 0.09, 1.28]} />
        <Mat color="#12060a" e={0.05} metal={0.3} rough={0.25} opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh position={[-2.2, 0.675, 0]}>
        <boxGeometry args={[0.018, 0.022, 1.18]} />
        <Mat color="#ff3355" e={2.0} metal={0} depthWrite={false} />
      </mesh>
      {[0.52, -0.52].map((z) => (
        <mesh key={z} position={[-2.2, 0.64, z]}>
          <boxGeometry args={[0.02, 0.045, 0.14]} />
          <Mat color="#ff2233" e={1.2} metal={0} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[-2.2, 0.63, 0]}>
        <boxGeometry args={[0.018, 0.035, 0.1]} />
        <Mat color="#eef3f8" e={0.8} metal={0} depthWrite={false} />
      </mesh>
      {/* ducktail lip */}
      <mesh position={[-2.05, 0.84, 0]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.14, 0.02, 1.25]} />
        <Mat color="#0d2a36" e={0.2} metal={0.4} opacity={0.6} depthWrite={false} />
      </mesh>
    </PartGroup>
  )
}

function Seats() {
  return (
    <PartGroup id="seats" perChild>
      {[0.38, -0.38].map((z) => (
        <group key={z} userData={{ explode: [0, 0.9, Math.sign(z) * 0.5] }}>
          {/* cushion with side bolsters */}
          <RBox args={[0.44, 0.11, 0.3]} radius={0.035} smoothness={3} position={[-0.2, 0.5, z]}>
            <Mat color="#3a4350" e={0.06} metal={0.05} rough={0.85} />
          </RBox>
          {[0.17, -0.17].map((dz) => (
            <RBox
              key={dz}
              args={[0.42, 0.14, 0.09]}
              radius={0.035}
              smoothness={3}
              position={[-0.2, 0.53, z + dz]}
            >
              <Mat color="#2e3642" e={0.05} metal={0.05} rough={0.85} />
            </RBox>
          ))}
          {/* backrest with bolsters */}
          <RBox
            args={[0.13, 0.54, 0.28]}
            radius={0.04}
            smoothness={3}
            position={[-0.44, 0.74, z]}
            rotation={[0, 0, -0.22]}
          >
            <Mat color="#3a4350" e={0.06} metal={0.05} rough={0.85} />
          </RBox>
          {[0.16, -0.16].map((dz) => (
            <RBox
              key={dz}
              args={[0.15, 0.5, 0.08]}
              radius={0.035}
              smoothness={3}
              position={[-0.43, 0.73, z + dz]}
              rotation={[0, 0, -0.25]}
            >
              <Mat color="#2e3642" e={0.05} metal={0.05} rough={0.85} />
            </RBox>
          ))}
          <RBox
            args={[0.09, 0.15, 0.2]}
            radius={0.035}
            smoothness={3}
            position={[-0.52, 1.07, z]}
            rotation={[0, 0, -0.22]}
          >
            <Mat color="#3a4350" e={0.08} metal={0.05} rough={0.85} />
          </RBox>
        </group>
      ))}
    </PartGroup>
  )
}

function Steering() {
  return (
    <PartGroup id="steering" explode={[0.3, 1.0, 0.5]}>
      <mesh position={[0.35, 0.78, 0.38]} rotation={[0, 0, 1.15]}>
        <torusGeometry args={[0.16, 0.022, 10, 28]} />
        <Mat color={C.int} e={0.25} />
      </mesh>
      <Pipe from={[0.37, 0.76, 0.38]} to={[0.85, 0.48, 0.3]} r={0.024} color="#889" e={0.15} />
      <Pipe from={[1.15, 0.38, -0.6]} to={[1.15, 0.38, 0.6]} r={0.032} color={C.int} e={0.2} />
      <Pipe from={[1.15, 0.38, 0.6]} to={[1.33, 0.36, 0.9]} r={0.018} color="#889" />
      <Pipe from={[1.15, 0.38, -0.6]} to={[1.33, 0.36, -0.9]} r={0.018} color="#889" />
      <mesh position={[1.15, 0.3, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 14]} />
        <Mat color={C.ele} e={0.25} />
      </mesh>
    </PartGroup>
  )
}

export function CarModel() {
  const { explode } = useGodEye()
  // past 50% the whole car dismantles into the total-teardown field
  if (explode >= 0.5) return <TeardownField />
  return (
    <group>
      <ChassisFrameMini />
      <Engine />
      <Turbo />
      <Intake />
      <ExhaustMini />
      <FuelTankMini />
      <TransmissionMini />
      <DriveshaftMini />
      <DifferentialMini />
      <SuspensionMini />
      <BrakesMini />
      <Wheels />
      <RadiatorMini />
      <BatteryMini />
      <EcuMini />
      <Headlights />
      <Seats />
      <SteeringMini />
      <SafetyMini />
      <BodyMechMini />
      <HvacMini />
      <BodyShell />
    </group>
  )
}
