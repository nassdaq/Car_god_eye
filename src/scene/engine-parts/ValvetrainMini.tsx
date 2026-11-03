/**
 * Engine-stage valvetrain — visible through the head's holographic casting.
 * 16 splayed valves with springs and buckets under two DOHC camshafts.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useSpringGeo } from '../lib'
import { Lathe, PMat } from '../realism'

const STATIONS = [-0.375, -0.125, 0.125, 0.375]

/** one valve + spring + bucket, local origin at the valve head center */
function Valve({ exhaust, springGeo }: { exhaust: boolean; springGeo: THREE.TubeGeometry }) {
  return (
    <group>
      {/* head + 45° seat face */}
      <Lathe
        pts={[
          [0.001, 0],
          [exhaust ? 0.034 : 0.04, 0],
          [exhaust ? 0.036 : 0.042, 0.008],
          [0.02, 0.022],
          [0.011, 0.045],
          [0.009, 0.08],
          [0.009, 0.235],
          [0.007, 0.242],
        ]}
        seg={20}
      >
        <PMat m={exhaust ? 'forged' : 'polSteel'} color={exhaust ? '#9a7a60' : undefined} />
      </Lathe>
      {/* spring */}
      <mesh geometry={springGeo} position={[0, 0.115, 0]}>
        <PMat m="steel" color="#b9bfd0" e={0.06} />
      </mesh>
      {/* retainer */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.02, 0.013, 0.012, 14]} />
        <PMat m="zincGold" />
      </mesh>
      {/* bucket tappet */}
      <mesh position={[0, 0.215, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.022, 16]} />
        <PMat m="machAlu" />
      </mesh>
    </group>
  )
}

export function ValvetrainMini() {
  const springGeo = useSpringGeo(0.018, 0.065, 4, 0.0045)
  const lobeGeo = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.03, 20), [])

  return (
    <group>
      {/* valves: intake row +z, exhaust row −z, splayed outward */}
      {STATIONS.flatMap((x) =>
        [1, -1].map((s) => (
          <group
            key={`${x}${s}`}
            position={[x, 0.975, s * 0.055]}
            rotation={[-s * 0.3, 0, 0]}
          >
            <Valve exhaust={s < 0} springGeo={springGeo} />
          </group>
        )),
      )}

      {/* spark plugs — down the head centerline, tips at the chamber */}
      {STATIONS.map((x) => (
        <group key={`plug${x}`} position={[x, 0, 0]}>
          {/* terminal stub (meets the coil boot above) */}
          <mesh position={[0, 1.24, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.035, 10]} />
            <PMat m="steel" />
          </mesh>
          {/* ribbed ceramic insulator */}
          <Lathe
            pts={[
              [0.012, 0],
              [0.017, 0.012],
              [0.013, 0.022],
              [0.017, 0.034],
              [0.013, 0.044],
              [0.017, 0.056],
              [0.014, 0.07],
              [0.01, 0.082],
            ]}
            seg={16}
            position={[0, 1.14, 0]}
          >
            <PMat color="#e9e6dd" metal={0.05} rough={0.35} e={0.05} />
          </Lathe>
          {/* hex */}
          <mesh position={[0, 1.12, 0]}>
            <cylinderGeometry args={[0.021, 0.021, 0.032, 6]} />
            <PMat m="steel" />
          </mesh>
          {/* crush washer */}
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.017, 0.017, 0.006, 12]} />
            <PMat m="copper" />
          </mesh>
          {/* threaded body with thread rings */}
          <mesh position={[0, 1.04, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
            <PMat m="machAlu" rough={0.4} />
          </mesh>
          {[1.01, 1.04, 1.07].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.0125, 0.0018, 6, 16]} />
              <PMat m="steel" rough={0.5} />
            </mesh>
          ))}
          {/* center electrode + ground strap */}
          <mesh position={[0, 0.972, 0]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.018, 8]} />
            <PMat m="polSteel" e={0.15} />
          </mesh>
          <mesh position={[0, 0.962, 0.006]} rotation={[0.9, 0, 0]}>
            <boxGeometry args={[0.006, 0.018, 0.0025]} />
            <PMat m="steel" />
          </mesh>
        </group>
      ))}

      {/* DOHC camshafts over each valve row */}
      {[1, -1].map((s) => (
        <group key={s} position={[0, 1.225, s * 0.145]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 14]} />
            <PMat m="steel" />
          </mesh>
          {/* journals */}
          {[-0.48, -0.25, 0, 0.25, 0.48].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.027, 0.027, 0.045, 16]} />
              <PMat m="polSteel" />
            </mesh>
          ))}
          {/* lobes — egg shape via scaled cylinder, clocked per cylinder */}
          {STATIONS.map((x, i) => (
            <mesh
              key={x}
              geometry={lobeGeo}
              position={[x, 0, 0]}
              rotation={[((i * 1.7 + (s < 0 ? 1.9 : 0)) % (Math.PI * 2)), 0, Math.PI / 2]}
              scale={[1, 1, 1.5]}
            >
              <PMat m="polSteel" rough={0.2} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
