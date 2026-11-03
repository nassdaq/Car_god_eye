import { useEffect, useState } from 'react'
import { NODE_COUNT } from './data/tree'
import { Viewport } from './scene/CarScene'
import { HUD } from './ui/HUD'

function Boot() {
  return (
    <div className="boot">
      <div className="boot-inner">
        <div className="bt boot-title">CAR GOD EYE</div>
        <div className="bt bt-ok">CALIBRATING OPTICS ............... <b>OK</b></div>
        <div className="bt bt-ok">LOADING RECURSIVE SCHEMATIC ...... <b>OK</b></div>
        <div className="bt bt-ok">MATERIAL DATABASE ................ <b>{NODE_COUNT} NODES</b></div>
        <div className="bt bt-ok">SCAN READY — DISMANTLE ANYTHING</div>
      </div>
    </div>
  )
}

export default function App() {
  const [boot, setBoot] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 2800)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className="app">
      <Viewport />
      <HUD />
      {boot && <Boot />}
    </div>
  )
}
