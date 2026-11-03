/**
 * TOTAL TEARDOWN — past 50% on the root DISASSEMBLE slider, the whole car
 * dismantles into a field of stations: every system's full exploded
 * internals (valves, cams, rods, rings, pistons…) laid out in rings.
 * Every part remains selectable; the slider keeps separating them further.
 */
import type { ComponentType } from 'react'
import { systemColor, type SystemId } from '../data/parts'
import {
  EngineView,
  HeadView,
  PistonView,
  ExhaustViewReal,
  FuelTankViewReal,
  RadiatorViewReal,
} from './teardown-imports'
import {
  TransmissionViewReal,
  DriveshaftViewReal,
  DifferentialViewReal,
} from './real-views/Drivetrain'
import {
  ChassisViewReal,
  DamperViewReal,
  SuspensionViewReal,
} from './real-views/ChassisSusp'
import {
  BrakesViewReal,
  CaliperViewReal,
  TireViewReal,
  WheelsViewReal,
} from './real-views/BrakesWheels'
import {
  BatteryViewReal,
  EcuViewReal,
  HeadlightViewReal,
} from './real-views/Electrical'
import {
  BodyViewReal,
  SeatsViewReal,
  SteeringViewReal,
} from './real-views/InteriorBody'

interface Station {
  key: string
  Comp: ComponentType
  pos: [number, number, number]
  scale: number
  rotY: number
  system: SystemId
}

const ring = (
  items: { key: string; Comp: ComponentType; system: SystemId; scale?: number }[],
  radius: number,
  baseScale: number,
  angleOffset = 0,
): Station[] =>
  items.map((it, i) => {
    const a = angleOffset + (i / items.length) * Math.PI * 2
    return {
      key: it.key,
      Comp: it.Comp,
      pos: [Math.cos(a) * radius, 0, Math.sin(a) * radius],
      scale: it.scale ?? baseScale,
      rotY: -a,
      system: it.system,
    }
  })

const STATIONS: Station[] = [
  // the skeleton holds the center
  {
    key: 'chassis',
    Comp: ChassisViewReal,
    pos: [0, 0, 0],
    scale: 0.5,
    rotY: 0,
    system: 'chassis',
  },
  // inner ring — the drivetrain story
  ...ring(
    [
      { key: 'engine', Comp: EngineView, system: 'powertrain', scale: 0.55 },
      { key: 'transmission', Comp: TransmissionViewReal, system: 'drivetrain' },
      { key: 'driveshaft', Comp: DriveshaftViewReal, system: 'drivetrain' },
      { key: 'differential', Comp: DifferentialViewReal, system: 'drivetrain' },
      { key: 'suspension', Comp: SuspensionViewReal, system: 'suspension' },
      { key: 'brakes', Comp: BrakesViewReal, system: 'brakes' },
      { key: 'wheels', Comp: WheelsViewReal, system: 'wheels' },
      { key: 'steering', Comp: SteeringViewReal, system: 'interior' },
    ],
    3.9,
    0.45,
  ),
  // outer ring — systems and the deep dives (valves, cams, rods, rings…)
  ...ring(
    [
      { key: 'exhaust', Comp: ExhaustViewReal, system: 'powertrain' },
      { key: 'fueltank', Comp: FuelTankViewReal, system: 'powertrain' },
      { key: 'radiator', Comp: RadiatorViewReal, system: 'thermal' },
      { key: 'battery', Comp: BatteryViewReal, system: 'electrical' },
      { key: 'ecu', Comp: EcuViewReal, system: 'electrical' },
      { key: 'headlights', Comp: HeadlightViewReal, system: 'electrical' },
      { key: 'body', Comp: BodyViewReal, system: 'body' },
      { key: 'seats', Comp: SeatsViewReal, system: 'interior' },
      { key: 'head', Comp: HeadView, system: 'powertrain', scale: 0.4 },
      { key: 'piston', Comp: PistonView, system: 'powertrain', scale: 0.4 },
      { key: 'damper', Comp: DamperViewReal, system: 'suspension', scale: 0.4 },
      { key: 'caliper', Comp: CaliperViewReal, system: 'brakes', scale: 0.4 },
      { key: 'tire', Comp: TireViewReal, system: 'wheels', scale: 0.4 },
    ],
    6.2,
    0.42,
    Math.PI / 13,
  ),
]

export function TeardownField() {
  return (
    <group>
      {STATIONS.map((s) => (
        <group key={s.key}>
          {/* station pad */}
          <mesh position={[s.pos[0], 0.0035, s.pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[s.scale * 1.55, s.scale * 1.55 + 0.045, 48]} />
            <meshBasicMaterial
              color={systemColor(s.system)}
              transparent
              opacity={0.3}
              depthWrite={false}
            />
          </mesh>
          <group position={s.pos} rotation={[0, s.rotY, 0]} scale={s.scale}>
            <s.Comp />
          </group>
        </group>
      ))}
    </group>
  )
}
