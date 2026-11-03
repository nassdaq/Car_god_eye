import { PARTS, type Part } from './parts'
import {
  ENGINE_KIDS,
  TURBO_KIDS,
  INTAKE_KIDS,
  EXHAUST_KIDS,
  FUELTANK_KIDS,
  GUPTA,
} from './tree-powertrain'
import {
  TRANSMISSION_KIDS,
  DRIVESHAFT_KIDS,
  DIFF_KIDS,
  CHASSIS_KIDS,
  SUSPENSION_KIDS,
  BRAKES_KIDS,
  WHEELS_KIDS,
} from './tree-chassis'
import {
  RADIATOR_KIDS,
  BATTERY_KIDS,
  ECU_KIDS,
  HEADLIGHT_KIDS,
  BODY_KIDS,
  SEAT_KIDS,
  STEERING_KIDS,
} from './tree-systems'

const CHILD_MAP: Record<string, Part[]> = {
  engine: ENGINE_KIDS,
  turbo: TURBO_KIDS,
  intake: INTAKE_KIDS,
  exhaust: EXHAUST_KIDS,
  fueltank: FUELTANK_KIDS,
  transmission: TRANSMISSION_KIDS,
  driveshaft: DRIVESHAFT_KIDS,
  differential: DIFF_KIDS,
  chassisframe: CHASSIS_KIDS,
  suspension: SUSPENSION_KIDS,
  brakes: BRAKES_KIDS,
  wheels: WHEELS_KIDS,
  radiator: RADIATOR_KIDS,
  battery: BATTERY_KIDS,
  ecu: ECU_KIDS,
  headlights: HEADLIGHT_KIDS,
  bodyshell: BODY_KIDS,
  seats: SEAT_KIDS,
  steering: STEERING_KIDS,
}

/** Top level of the tree: the car's 19 primary systems, each with its subtree. */
export const TREE: Part[] = PARTS.map((p) => ({
  ...p,
  children: p.children ?? CHILD_MAP[p.id],
}))

/* ------------------------------ flat indexes ------------------------------ */

const nodeMap = new Map<string, Part>()
const parentMap = new Map<string, string | null>()

/** subtrees whose breakdown follows reference literature */
const DEFAULT_REFS: Record<string, string[]> = {
  engine: [GUPTA],
  turbo: [GUPTA],
  intake: [GUPTA],
  exhaust: [GUPTA],
  transmission: [GUPTA],
  differential: [GUPTA],
  driveshaft: [GUPTA],
}

function index(nodes: Part[], parent: string | null, root: string | null) {
  for (const n of nodes) {
    const r = root ?? n.id
    if (!n.refs && DEFAULT_REFS[r]) n.refs = DEFAULT_REFS[r]
    nodeMap.set(n.id, n)
    parentMap.set(n.id, parent)
    if (n.children) index(n.children, n.id, r)
  }
}
index(TREE, null, null)

export const NODE_COUNT = nodeMap.size

export const getNode = (id: string | null): Part | null =>
  id ? nodeMap.get(id) ?? null : null

export const parentOf = (id: string): string | null => parentMap.get(id) ?? null

/** Children of an assembly id, or the top level for null/'car'. */
export const childrenOf = (id: string | null): Part[] => {
  if (!id || id === 'car') return TREE
  return getNode(id)?.children ?? []
}

/** Assembly path for entering a node: ancestor ids ending at the node itself. */
export function pathOf(id: string): string[] {
  const out: string[] = []
  let cur: string | null = id
  while (cur) {
    out.unshift(cur)
    cur = parentOf(cur)
  }
  return out
}

export const hasChildren = (id: string): boolean =>
  (getNode(id)?.children?.length ?? 0) > 0
