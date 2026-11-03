import { useSyncExternalStore } from 'react'
import { DEFAULT_PAINT, PAINTS, type ThemeId } from './theme'

export interface GodEyeSnapshot {
  /** stack of entered assembly ids; [] = whole car */
  path: string[]
  selectedId: string | null
  hoverId: string | null
  explode: number
  xray: boolean
  theme: ThemeId
  /** showroom body color (hex from PAINTS) */
  paint: string
}

function loadTheme(): ThemeId {
  try {
    const t = localStorage.getItem('cge-theme')
    if (t === 'dark' || t === 'light' || t === 'holo') return t
  } catch {
    /* storage unavailable */
  }
  return 'dark'
}

function loadPaint(): string {
  try {
    const p = localStorage.getItem('cge-paint')
    if (p && PAINTS.some((x) => x.hex === p)) return p
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_PAINT
}

let snap: GodEyeSnapshot = {
  path: [],
  selectedId: null,
  hoverId: null,
  explode: 0,
  xray: false,
  theme: loadTheme(),
  paint: loadPaint(),
}

const listeners = new Set<() => void>()

function set(partial: Partial<GodEyeSnapshot>) {
  snap = { ...snap, ...partial }
  listeners.forEach((l) => l())
}

export const godEye = {
  get: () => snap,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  select: (id: string | null) => set({ selectedId: id, hoverId: null }),
  setHover: (id: string | null) => set({ hoverId: id }),
  setExplode: (v: number) => set({ explode: v }),
  setXray: (v: boolean) => set({ xray: v }),
  /** jump to an assembly level; clears selection */
  setPath: (path: string[], select: string | null = null) =>
    set({ path, selectedId: select, hoverId: null }),
  /** go up one level */
  up: () => {
    if (snap.path.length === 0) return
    set({
      path: snap.path.slice(0, -1),
      selectedId: snap.path[snap.path.length - 1],
      hoverId: null,
    })
  },
  setTheme: (theme: ThemeId) => {
    try {
      localStorage.setItem('cge-theme', theme)
    } catch {
      /* storage unavailable */
    }
    set({ theme })
  },
  setPaint: (paint: string) => {
    try {
      localStorage.setItem('cge-paint', paint)
    } catch {
      /* storage unavailable */
    }
    set({ paint })
  },
}

/** Reactive snapshot + actions. Works on both sides of the r3f Canvas boundary. */
export function useGodEye() {
  const s = useSyncExternalStore(godEye.subscribe, godEye.get)
  return {
    ...s,
    select: godEye.select,
    setHover: godEye.setHover,
    setExplode: godEye.setExplode,
    setXray: godEye.setXray,
    setPath: godEye.setPath,
    up: godEye.up,
    setTheme: godEye.setTheme,
    setPaint: godEye.setPaint,
  }
}
