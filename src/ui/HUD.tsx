import { useEffect, useMemo, useState } from 'react'
import { SYSTEMS, systemColor, type MaterialLayer, type Part } from '../data/parts'
import { TREE, NODE_COUNT, childrenOf, getNode, hasChildren, pathOf } from '../data/tree'
import { godEye, useGodEye } from '../state'
import { THEME_LABEL, THEME_ORDER } from '../theme'

/* --------------------------------- top bar -------------------------------- */

function TopBar() {
  const [clock, setClock] = useState('')
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString('en-GB', { hour12: false }) +
          '.' +
          String(Math.floor(performance.now() % 1000)).padStart(3, '0'),
      )
    const t = setInterval(tick, 127)
    tick()
    return () => clearInterval(t)
  }, [])
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-glyph">◉</span>
        <h1 className="glitch" data-text="CAR GOD EYE">
          CAR GOD EYE
        </h1>
        <span className="brand-ver">v2.077</span>
      </div>
      <div className="topbar-mid">RECURSIVE TEARDOWN — {NODE_COUNT} NODES — MATERIAL TRACE TO THE BOLT</div>
      <div className="topbar-right">
        <span className="dot" /> SCAN ACTIVE
        <span className="clock">{clock}</span>
      </div>
    </header>
  )
}

/* -------------------------------- breadcrumb ------------------------------ */

function Breadcrumb() {
  const { path, setPath } = useGodEye()
  return (
    <nav className="crumb ia">
      <button className={path.length === 0 ? 'on' : ''} onClick={() => setPath([])}>
        ⌂ CAR
      </button>
      {path.map((id, i) => {
        const node = getNode(id)
        const last = i === path.length - 1
        return (
          <span key={id} className="crumb-seg">
            <i>▸</i>
            <button className={last ? 'on' : ''} onClick={() => setPath(path.slice(0, i + 1))}>
              {node?.name.split('—')[0].trim() ?? id}
            </button>
          </span>
        )
      })}
    </nav>
  )
}

/* ------------------------------- index panel ------------------------------ */

function IndexRow({ p }: { p: Part }) {
  const { selectedId, select, setHover, setPath } = useGodEye()
  const kids = hasChildren(p.id)
  return (
    <div
      className={`idx-row${selectedId === p.id ? ' on' : ''}`}
      style={{ ['--sc' as string]: systemColor(p.system) }}
      onMouseEnter={() => setHover(p.id)}
      onMouseLeave={() => setHover(null)}
    >
      <button className="idx-main" onClick={() => select(selectedId === p.id ? null : p.id)}>
        <span className="idx-code">{p.code}</span>
        <span className="idx-name">{p.name}</span>
      </button>
      {kids && (
        <button
          className="idx-enter"
          title="Dismantle"
          onClick={() => setPath(pathOf(p.id))}
        >
          ⊞
        </button>
      )}
    </div>
  )
}

function IndexPanel() {
  const { path, up } = useGodEye()
  const current = path[path.length - 1] ?? null
  const kids = childrenOf(current)

  const grouped = useMemo(
    () =>
      SYSTEMS.map((s) => ({
        sys: s,
        parts: TREE.filter((p) => p.system === s.id),
      })).filter((g) => g.parts.length > 0),
    [],
  )

  return (
    <nav className="panel index ia">
      <div className="panel-title">
        <span>{current ? 'SUB-ASSEMBLY' : 'COMPONENT INDEX'}</span>
        <span className="panel-count">{current ? `${kids.length} PARTS` : `${NODE_COUNT} NODES`}</span>
      </div>
      <div className="index-scroll">
        {current === null ? (
          grouped.map(({ sys, parts }) => (
            <div key={sys.id} className="sys-block">
              <div className="sys-label" style={{ color: sys.color }}>
                <i style={{ background: sys.color }} />
                {sys.label}
              </div>
              {parts.map((p) => (
                <IndexRow key={p.id} p={p} />
              ))}
            </div>
          ))
        ) : (
          <div className="sys-block">
            <button className="idx-up" onClick={up}>
              ▴ UP ONE LEVEL
            </button>
            {kids.map((p) => (
              <IndexRow key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

/* ---------------------------- material drilldown --------------------------- */

function MaterialCard({
  mat,
  color,
  open,
  onToggle,
}: {
  mat: MaterialLayer
  color: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className={`mat-card${open ? ' open' : ''}`}>
      <button className="mat-head" onClick={onToggle}>
        <span className="mat-plus">{open ? '−' : '+'}</span>
        <span className="mat-name">{mat.name}</span>
      </button>
      <div className="mat-cls">{mat.cls}</div>
      {open && (
        <div className="mat-body">
          <div className="mat-sec">COMPOSITION</div>
          {mat.composition.map((c) => (
            <div key={c.element} className="comp-row">
              <span className="comp-el">{c.element}</span>
              <span className="comp-bar">
                <i style={{ width: `${Math.max(c.pct, 2.5)}%`, background: color }} />
              </span>
              <span className="comp-pct">{c.pct}%</span>
            </div>
          ))}
          <div className="mat-sec">PROCESS</div>
          <p>{mat.process}</p>
          <div className="mat-sec">WHY THIS MATERIAL</div>
          <p className="mat-why">{mat.why}</p>
          <div className="mat-props">
            {mat.props.map((pr) => (
              <div key={pr.label} className="prop">
                <span>{pr.label}</span>
                <b>{pr.value}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------- detail panel ------------------------------ */

function DetailBody({ part }: { part: Part }) {
  const [openMat, setOpenMat] = useState(0)
  const { setPath, select } = useGodEye()
  const color = systemColor(part.system)
  const sys = SYSTEMS.find((s) => s.id === part.system)!
  const kids = part.children ?? []

  return (
    <div className="detail-scroll">
      <div className="det-code" style={{ color }}>
        {part.code} <i className="det-line" style={{ background: color }} />
        <span className="det-sys" style={{ borderColor: color, color }}>
          {sys.label}
        </span>
      </div>
      <h2 className="det-name">{part.name}</h2>
      <div className="det-mass">
        MASS <b>{part.mass}</b>
      </div>
      <p className="det-summary">{part.summary}</p>

      {kids.length > 0 && (
        <button className="det-dismantle" onClick={() => setPath(pathOf(part.id))}>
          ⊞ DISMANTLE — {kids.length} COMPONENTS
        </button>
      )}

      <div className="det-sec" style={{ color }}>
        ▸ OPERATION
      </div>
      <ol className="det-ops">
        {part.operation.map((o, i) => (
          <li key={i}>
            <span className="op-n">{String(i + 1).padStart(2, '0')}</span>
            {o}
          </li>
        ))}
      </ol>

      <div className="det-sec" style={{ color }}>
        ▸ MATERIAL TRACE <span className="det-hint">// zoom level: molecular</span>
      </div>
      {part.materials.map((m, i) => (
        <MaterialCard
          key={m.name}
          mat={m}
          color={color}
          open={openMat === i}
          onToggle={() => setOpenMat(openMat === i ? -1 : i)}
        />
      ))}

      {part.fasteners && (
        <div className="det-fast">
          <span>⬡ FASTENER SPEC</span>
          {part.fasteners}
        </div>
      )}

      {part.refs && part.refs.length > 0 && (
        <div className="det-refs">
          <span>◈ REFERENCE</span>
          {part.refs.map((r) => (
            <p key={r}>{r}</p>
          ))}
        </div>
      )}

      {kids.length > 0 && (
        <>
          <div className="det-sec" style={{ color }}>
            ▸ SUBCOMPONENTS <span className="det-hint">// {kids.length} nodes</span>
          </div>
          <div className="det-kids">
            {kids.map((k) => (
              <button
                key={k.id}
                className="det-kid"
                onClick={() => {
                  setPath(pathOf(part.id))
                  select(k.id)
                }}
              >
                <span className="idx-code">{k.code}</span>
                <span>{k.name}</span>
                {hasChildren(k.id) && <i>⊞</i>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DetailPanel() {
  const { selectedId, select, path, up } = useGodEye()
  const current = path[path.length - 1] ?? null
  const node = getNode(selectedId) ?? getNode(current)
  const isAssemblyInfo = !selectedId && current !== null

  return (
    <aside className={`panel detail ia${node ? ' show' : ''}`}>
      {node && (
        <>
          <div className="panel-title">
            <span>{isAssemblyInfo ? 'ASSEMBLY' : 'NODE ANALYSIS'}</span>
            <button className="det-close" onClick={() => (isAssemblyInfo ? up() : select(null))}>
              {isAssemblyInfo ? '▴ UP' : '✕ CLOSE'}
            </button>
          </div>
          <DetailBody key={node.id} part={node} />
        </>
      )}
    </aside>
  )
}

/* -------------------------------- bottom bar ------------------------------- */

function BottomBar() {
  const { explode, setExplode, xray, setXray, select, selectedId, path, up, theme, setTheme } =
    useGodEye()
  const cycleTheme = () => {
    const i = THEME_ORDER.indexOf(theme)
    setTheme(THEME_ORDER[(i + 1) % THEME_ORDER.length])
  }
  return (
    <footer className="bottombar ia">
      {path.length > 0 && (
        <button className="tgl" onClick={up}>
          ▴ BACK
        </button>
      )}
      <div className="ctl">
        <label>DISASSEMBLE</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={explode}
          onChange={(e) => setExplode(parseFloat(e.target.value))}
        />
        <span className="ctl-val">{Math.round(explode * 100)}%</span>
      </div>
      <button className={`tgl${xray ? ' on' : ''}`} onClick={() => setXray(!xray)}>
        X-RAY {xray ? '◼ ON' : '◻ OFF'}
      </button>
      <button className="tgl" onClick={() => select(null)} disabled={!selectedId}>
        ⟲ RESET
      </button>
      <button className="tgl" onClick={cycleTheme} title="Cycle display mode">
        ◐ {THEME_LABEL[theme]}
      </button>
      <div className="hint">CLICK — INSPECT · 2×CLICK — DISMANTLE · ESC — BACK · DRAG — ORBIT</div>
    </footer>
  )
}

/* ------------------------------- hover label ------------------------------- */

function HoverTag() {
  const { hoverId, selectedId } = useGodEye()
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const mv = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', mv)
    return () => window.removeEventListener('pointermove', mv)
  }, [])
  const part = getNode(hoverId)
  if (!part || hoverId === selectedId) return null
  const color = systemColor(part.system)
  return (
    <div className="hovertag" style={{ left: pos.x + 18, top: pos.y - 14 }}>
      <span style={{ color }}>{part.code}</span> {part.name}
      {hasChildren(part.id) && <em> ⊞ dismantle</em>}
    </div>
  )
}

/* ---------------------------------- shell ---------------------------------- */

export function HUD() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (godEye.get().selectedId) godEye.select(null)
        else godEye.up()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="hud">
      <TopBar />
      <Breadcrumb />
      <IndexPanel />
      <DetailPanel />
      <BottomBar />
      <HoverTag />
      <div className="scanlines" />
      <div className="frame-corners">
        <i /> <i /> <i /> <i />
      </div>
    </div>
  )
}
