export type ThemeId = 'dark' | 'light' | 'holo'

export interface SceneTheme {
  bg: string
  fogNear: number
  fogFar: number
  gridCell: string
  gridSection: string
  ring: string
  ringOpacity: number
  bloomIntensity: number
  bloomThreshold: number
  /** holo-only extras: chromatic aberration, noise, heavy vignette */
  fx: boolean
  vignette: number
  ambient: number
  ambientColor: string
  key: number
  keyColor: string
  rim: number
  rimColor: string
  point: number
  pointColor: string
}

export const SCENE_THEMES: Record<ThemeId, SceneTheme> = {
  dark: {
    bg: '#111318',
    fogNear: 16,
    fogFar: 46,
    gridCell: '#1e2127',
    gridSection: '#2d3139',
    ring: '#6ab0ff',
    ringOpacity: 0.16,
    bloomIntensity: 0.3,
    bloomThreshold: 0.7,
    fx: false,
    vignette: 0.45,
    ambient: 0.5,
    ambientColor: '#ffffff',
    key: 1.2,
    keyColor: '#ffffff',
    rim: 0.25,
    rimColor: '#8fb7ff',
    point: 1.0,
    pointColor: '#9fc4ff',
  },
  light: {
    bg: '#f3f4f6',
    fogNear: 18,
    fogFar: 52,
    gridCell: '#e4e7eb',
    gridSection: '#d1d5db',
    ring: '#1f6fd6',
    ringOpacity: 0.1,
    bloomIntensity: 0.16,
    bloomThreshold: 0.9,
    fx: false,
    vignette: 0,
    ambient: 0.95,
    ambientColor: '#ffffff',
    key: 1.35,
    keyColor: '#ffffff',
    rim: 0.2,
    rimColor: '#cdd9f2',
    point: 0.5,
    pointColor: '#ffffff',
  },
  holo: {
    bg: '#04070d',
    fogNear: 12,
    fogFar: 40,
    gridCell: '#0c2430',
    gridSection: '#114b5f',
    ring: '#00f0ff',
    ringOpacity: 0.3,
    bloomIntensity: 0.75,
    bloomThreshold: 0.38,
    fx: true,
    vignette: 0.78,
    ambient: 0.3,
    ambientColor: '#9fd8e8',
    key: 1.0,
    keyColor: '#dff6ff',
    rim: 0.35,
    rimColor: '#ff2d7a',
    point: 2.5,
    pointColor: '#00f0ff',
  },
}

export const THEME_ORDER: ThemeId[] = ['dark', 'light', 'holo']

/* ------------------------- showroom paint options ------------------------- */

export interface Paint {
  id: string
  name: string
  hex: string
}

/** solid body colors for the root showroom view (configurator-style swatches) */
export const PAINTS: Paint[] = [
  { id: 'snow', name: 'SNOW WHITE', hex: '#dfe3e7' },
  { id: 'sand', name: 'DESERT SAND', hex: '#cfc4b0' },
  { id: 'magnesium', name: 'MAGNESIUM', hex: '#9aa0a6' },
  { id: 'thunder', name: 'THUNDER GREY', hex: '#54585e' },
  { id: 'midnight', name: 'MIDNIGHT BLUE', hex: '#2e4660' },
  { id: 'space', name: 'SPACE BLACK', hex: '#17191d' },
]

export const DEFAULT_PAINT = PAINTS[0].hex

export const THEME_LABEL: Record<ThemeId, string> = {
  dark: 'STUDIO DARK',
  light: 'STUDIO LIGHT',
  holo: 'HOLO',
}
