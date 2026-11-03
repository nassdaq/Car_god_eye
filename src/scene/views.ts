import { createElement, type ComponentType } from 'react'
import { childrenOf } from '../data/tree'
import { CarModel } from './CarModel'
import { GeneratedDeepView } from './deep-views'
import {
  EngineView,
  PistonView,
  RingsView,
  HeadView,
  TurboView,
  IntakeView,
  ExhaustView,
  FuelTankView,
} from './assemblies-powertrain'
import {
  CrownMicroView,
  CrownSectionView,
  CrownZoomView,
  DiscMicroView,
  DiscSectionView,
  DiscZoomView,
} from './deep-views'
import {
  TransmissionView,
  DriveshaftView,
  DifferentialView,
  ChassisView,
  SuspensionView,
  DamperView,
  BrakesView,
  CaliperView,
  WheelsView,
  TireView,
  RadiatorView,
  BatteryView,
  EcuView,
  HeadlightView,
  LedView,
  BodyView,
  SeatsView,
  SteeringView,
} from './assemblies-rest'

export interface ViewDef {
  Comp: ComponentType
  cam: [number, number, number]
  tgt: [number, number, number]
}

const SUB: Pick<ViewDef, 'cam' | 'tgt'> = {
  cam: [2.2, 1.5, 2.4],
  tgt: [0, 0.7, 0],
}

export const VIEWS: Record<string, ViewDef> = {
  car: { Comp: CarModel, cam: [4.6, 2.4, 4.6], tgt: [0, 0.45, 0] },
  engine: { Comp: EngineView, cam: [2.9, 2.1, 3.2], tgt: [0, 0.85, 0] },
  'eng-piston': { Comp: PistonView, cam: [1.7, 1.3, 1.9], tgt: [0, 0.7, 0] },
  'pst-crown': { Comp: CrownZoomView, cam: [-1.9, 1.5, 1.4], tgt: [0, 1.0, 0] },
  'crn-section': { Comp: CrownSectionView, cam: [1.5, 1.3, 1.6], tgt: [0, 0.55, 0] },
  'crn-micro': { Comp: CrownMicroView, cam: [1.7, 1.5, 1.8], tgt: [0, 0.9, 0] },
  'pst-rings': { Comp: RingsView, cam: [1.7, 1.5, 1.7], tgt: [0, 0.7, 0] },
  'eng-head': { Comp: HeadView, cam: [2.0, 1.7, 2.1], tgt: [0, 0.85, 0] },
  turbo: { Comp: TurboView, ...SUB },
  intake: { Comp: IntakeView, ...SUB },
  exhaust: { Comp: ExhaustView, cam: [2.4, 1.7, 2.6], tgt: [0, 0.6, 0] },
  fueltank: { Comp: FuelTankView, ...SUB },
  transmission: { Comp: TransmissionView, ...SUB },
  driveshaft: { Comp: DriveshaftView, ...SUB },
  differential: { Comp: DifferentialView, ...SUB },
  chassisframe: { Comp: ChassisView, cam: [2.6, 1.8, 2.8], tgt: [0, 0.7, 0] },
  suspension: { Comp: SuspensionView, cam: [2.2, 1.6, 2.4], tgt: [0, 0.75, 0] },
  'sus-damper': { Comp: DamperView, cam: [1.8, 1.5, 1.9], tgt: [0, 0.9, 0] },
  brakes: { Comp: BrakesView, cam: [2.2, 1.6, 2.4], tgt: [0, 0.9, 0] },
  'brk-disc': { Comp: DiscZoomView, cam: [-1.9, 1.6, 1.5], tgt: [0, 0.85, 0] },
  'dsc-section': { Comp: DiscSectionView, cam: [1.5, 1.3, 1.6], tgt: [0, 0.55, 0] },
  'dsc-micro': { Comp: DiscMicroView, cam: [1.7, 1.5, 1.8], tgt: [0, 0.9, 0] },
  'brk-caliper': { Comp: CaliperView, cam: [1.8, 1.4, 2.0], tgt: [0, 0.8, 0] },
  wheels: { Comp: WheelsView, cam: [2.2, 1.6, 2.4], tgt: [0, 0.85, 0] },
  'whl-tire': { Comp: TireView, cam: [2.5, 1.7, 2.6], tgt: [0, 0.85, 0] },
  radiator: { Comp: RadiatorView, ...SUB },
  battery: { Comp: BatteryView, cam: [1.9, 1.4, 2.0], tgt: [0, 0.65, 0] },
  ecu: { Comp: EcuView, cam: [1.7, 1.3, 1.8], tgt: [0, 0.6, 0] },
  headlights: { Comp: HeadlightView, ...SUB },
  'hl-led': { Comp: LedView, cam: [1.7, 1.4, 1.8], tgt: [0, 0.6, 0] },
  bodyshell: { Comp: BodyView, cam: [2.4, 1.7, 2.6], tgt: [0, 0.8, 0] },
  seats: { Comp: SeatsView, cam: [2.0, 1.5, 2.1], tgt: [0, 0.65, 0] },
  steering: { Comp: SteeringView, cam: [2.3, 1.7, 2.4], tgt: [0, 0.8, 0] },
}

const dynCache = new Map<string, ViewDef>()

export const viewFor = (path: string[]): { id: string; def: ViewDef } => {
  const id = path[path.length - 1] ?? 'car'
  if (VIEWS[id]) return { id, def: VIEWS[id] }

  // generated deep-zoom level: the node's single child carries a viewKind
  const kids = childrenOf(id)
  const child = kids.length === 1 ? kids[0] : undefined
  if (child?.viewKind) {
    let def = dynCache.get(id)
    if (!def) {
      const childId = child.id
      const viewKind = child.viewKind
      const isMicro = viewKind.startsWith('micro:')
      def = {
        Comp: () => createElement(GeneratedDeepView, { childId, viewKind }),
        cam: isMicro ? [1.5, 1.3, 1.6] : [1.7, 1.5, 1.8],
        tgt: isMicro ? [0, 0.55, 0] : [0, 0.9, 0],
      }
      dynCache.set(id, def)
    }
    return { id, def }
  }

  return { id, def: VIEWS.car }
}
