/**
 * Manifolds.tsx — induction + exhaust stack for the teardown engine:
 *   IntakeManifoldReal()  — plastic log manifold, throttle body, air cleaner
 *                           box with visible pleated filter, corrugated duct
 *   ExhaustManifoldReal() — heat-browned cast manifold + crinkled heat shield
 *   TurboMiniReal()       — compact turbo hung on the manifold's turbo flange
 *
 * Plain <group>s at absolute stage coordinates (crank axis along X at y=0.32,
 * FRONT = -X). Intake side = +Z (port flanges z≈0.39, center y≈1.08), exhaust
 * side = -Z (flanges z≈-0.37, center y≈1.05). Every material is <PMat/>.
 */
import { useMemo } from 'react'
import * as THREE from 'three'
import { PMat, Lathe, Tube, RBox, Bolt, BoltCircle } from '../realism'

/** cylinder stations along the crank axis */
const STATIONS = [-0.375, -0.125, 0.125, 0.375] as const

/** glass-filled black nylon (intake molding) */
const PA = '#2e2a26'
/** heat-browned cast iron (manifold) */
const HEAT_MANI = '#6a5a50'
/** deeper heat tint (turbine volute) */
const HEAT_TURBO = '#7a5f4a'
/** filter paper */
const PLEAT = '#e8e2d4'

/* ========================== INTAKE MANIFOLD ============================== */

/** runner paths: head port (x, 1.08, 0.40) sweeping up/out into the plenum */
const INTAKE_RUNNERS: [number, number, number][][] = STATIONS.map((x) => [
  [x, 1.08, 0.4],
  [x, 1.115, 0.47],
  [x, 1.13, 0.55],
  [x, 1.06, 0.62],
])

/** corrugated duct: air box front mouth down to the throttle body inlet */
const DUCT_PATH: [number, number, number][] = [
  [0.21, 1.42, 0.62],
  [0.02, 1.43, 0.65],
  [-0.26, 1.37, 0.67],
  [-0.47, 1.23, 0.66],
  [-0.555, 1.08, 0.63],
  [-0.548, 1.02, 0.62],
]

/** pleat plate x centers inside the air box */
const PLEAT_XS = Array.from({ length: 10 }, (_, i) => 0.27 + i * (0.3 / 9))

export function IntakeManifoldReal() {
  /* duct curve, memoized, used to seat corrugation rings + MAF on the hose */
  const duct = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        DUCT_PATH.map((p) => new THREE.Vector3(...p)),
        false,
        'catmullrom',
        0.5,
      ),
    [],
  )
  const corrRings = useMemo(() => {
    const up = new THREE.Vector3(0, 0, 1) // torus axis
    return [0.2, 0.28, 0.36, 0.44, 0.52].map((t) => ({
      p: duct.getPointAt(t),
      q: new THREE.Quaternion().setFromUnitVectors(up, duct.getTangentAt(t)),
    }))
  }, [duct])
  const mafP = useMemo(() => duct.getPointAt(0.12), [duct])

  return (
    <group>
      {/* ------------------ 4 molded runners + port flanges ------------------ */}
      {STATIONS.map((x, i) => (
        <group key={`run-${x}`}>
          <Tube path={INTAKE_RUNNERS[i]} r={0.045} seg={28} radial={12}>
            <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
          </Tube>
          {/* gasket plate against the head flange */}
          <RBox args={[0.15, 0.11, 0.006]} radius={0.004} smoothness={2} position={[x, 1.08, 0.3955]}>
            <PMat m="gasket" />
          </RBox>
          {/* molded manifold flange */}
          <RBox args={[0.16, 0.12, 0.018]} radius={0.006} smoothness={2} position={[x, 1.08, 0.406]}>
            <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
          </RBox>
        </group>
      ))}

      {/* ---------------- plenum log, outboard of the head (+Z) --------------- */}
      <mesh position={[0, 1.02, 0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.85, 28]} />
        <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
      </mesh>
      {([1, -1] as const).map((s) => (
        <mesh key={`cap${s}`} position={[s * 0.425, 1.02, 0.62]} scale={[0.45, 1, 1]}>
          <sphereGeometry args={[0.1, 20, 14]} />
          <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
        </mesh>
      ))}
      {/* mold parting ribs along the outboard face */}
      {[1.07, 0.97].map((y) => (
        <RBox key={`prib-${y}`} args={[0.82, 0.01, 0.012]} radius={0.003} smoothness={2} position={[0, y, 0.705]}>
          <PMat m="nylon" color={PA} e={0.04} rough={0.62} metal={0.1} />
        </RBox>
      ))}

      {/* -------------- throttle body at the plenum FRONT end (-X) ------------ */}
      <group position={[-0.5, 1.02, 0.62]}>
        {/* machined barrel, bore axis along X */}
        <Lathe
          seg={32}
          rotation={[0, 0, -Math.PI / 2]}
          pts={[
            [0.062, -0.045],
            [0.076, -0.038],
            [0.078, -0.01],
            [0.078, 0.01],
            [0.076, 0.038],
            [0.062, 0.045],
          ]}
        >
          <PMat m="machAlu" />
        </Lathe>
        {/* inlet / outlet clamp flanges */}
        {([-0.045, 0.045] as const).map((dx) => (
          <mesh key={`tbf${dx}`} position={[dx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.012, 28]} />
            <PMat m="machAlu" />
          </mesh>
        ))}
        {/* dark bore interior */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.088, 24, 1, true]} />
          <PMat color="#14161a" e={0.01} rough={0.9} metal={0.1} side={THREE.DoubleSide} />
        </mesh>
        {/* butterfly disc, cracked open ~35° about the Z shaft */}
        <group rotation={[0, 0, 0.6]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.054, 0.054, 0.004, 24]} />
            <PMat m="brass" />
          </mesh>
        </group>
        {/* throttle shaft across the bore (along Z) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.17, 10]} />
          <PMat m="polSteel" />
        </mesh>
        {/* TPS box on the shaft end + connector */}
        <RBox args={[0.05, 0.05, 0.035]} radius={0.008} smoothness={2} position={[0, 0, 0.1]}>
          <PMat m="blackCast" />
        </RBox>
        <RBox args={[0.032, 0.028, 0.02]} radius={0.005} smoothness={2} position={[0, 0.012, 0.125]}>
          <PMat m="rubber" color="#23262b" />
        </RBox>
      </group>

      {/* ----------------------- AIR CLEANER BOX ----------------------------- */}
      {/* bottom tray */}
      <RBox args={[0.42, 0.13, 0.3]} radius={0.02} smoothness={3} position={[0.42, 1.355, 0.62]}>
        <PMat m="blackCast" />
      </RBox>
      {/* translucent lid — filter stays visible */}
      <RBox args={[0.42, 0.12, 0.3]} radius={0.02} smoothness={3} position={[0.42, 1.49, 0.62]}>
        <PMat m="blackCast" color="#3d434c" opacity={0.35} depthWrite={false} />
      </RBox>
      {/* rubber sealing frame the element sits on */}
      <RBox args={[0.38, 0.012, 0.26]} radius={0.004} smoothness={2} position={[0.42, 1.362, 0.62]}>
        <PMat m="rubber" />
      </RBox>
      {/* pleated paper element: 10 standing plates in a row */}
      {PLEAT_XS.map((x) => (
        <RBox key={`pl-${x}`} args={[0.012, 0.1, 0.24]} radius={0.003} smoothness={2} position={[x, 1.422, 0.62]}>
          <PMat color={PLEAT} e={0.05} rough={0.9} metal={0.0} env={0.25} />
        </RBox>
      ))}
      {/* 4 clip tabs on the rim */}
      {([0.3, 0.54] as const).map((x) =>
        ([0.775, 0.465] as const).map((z) => (
          <RBox key={`clip-${x}-${z}`} args={[0.035, 0.05, 0.014]} radius={0.004} smoothness={2} position={[x, 1.42, z]}>
            <PMat m="blackCast" />
          </RBox>
        )),
      )}
      {/* short inlet snorkel at the box rear (+X) */}
      <Tube
        path={[
          [0.6, 1.4, 0.62],
          [0.68, 1.4, 0.62],
          [0.74, 1.37, 0.6],
        ]}
        r={0.038}
        seg={16}
        radial={12}
      >
        <PMat m="blackCast" />
      </Tube>
      <mesh position={[0.74, 1.37, 0.6]} rotation={[0.2, Math.PI / 2 + 0.3, 0]}>
        <torusGeometry args={[0.038, 0.007, 8, 18]} />
        <PMat m="rubber" />
      </mesh>

      {/* --------------- corrugated intake duct + MAF sensor ------------------ */}
      <Tube path={DUCT_PATH} r={0.055} seg={40} radial={14}>
        <PMat m="rubber" color="#1b1e22" rough={0.9} />
      </Tube>
      {corrRings.map(({ p, q }, i) => (
        <mesh key={`corr-${i}`} position={p} quaternion={q}>
          <torusGeometry args={[0.06, 0.009, 8, 20]} />
          <PMat m="rubber" />
        </mesh>
      ))}
      {/* MAF sensor seated on the hose near the air box */}
      <group position={[mafP.x, mafP.y + 0.052, mafP.z + 0.01]}>
        <RBox args={[0.06, 0.038, 0.042]} radius={0.006} smoothness={2}>
          <PMat m="blackCast" color="#32373e" />
        </RBox>
        {/* probe stem into the duct */}
        <mesh position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.04, 10]} />
          <PMat m="steel" />
        </mesh>
        {/* connector + 2 pins */}
        <RBox args={[0.032, 0.022, 0.028]} radius={0.004} smoothness={2} position={[0.044, 0.004, 0]}>
          <PMat m="rubber" color="#23262b" />
        </RBox>
        {([-0.006, 0.006] as const).map((dz) => (
          <mesh key={`mafpin${dz}`} position={[0.062, 0.004, dz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0018, 0.0018, 0.008, 6]} />
            <PMat m="brass" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ========================== EXHAUST MANIFOLD ============================= */

/** cast runners: port (x, 1.05, -0.38) diving down/out, merging pairwise into
 *  the collector at (-0.05, 0.78, -0.52) */
const EXHAUST_RUNNERS: [number, number, number][][] = [
  [
    [-0.375, 1.05, -0.38],
    [-0.375, 0.98, -0.47],
    [-0.28, 0.88, -0.51],
    [-0.05, 0.79, -0.52],
  ],
  [
    [-0.125, 1.05, -0.38],
    [-0.14, 0.97, -0.46],
    [-0.17, 0.88, -0.5],
    [-0.05, 0.79, -0.52],
  ],
  [
    [0.125, 1.05, -0.38],
    [0.14, 0.97, -0.46],
    [0.1, 0.88, -0.5],
    [-0.04, 0.79, -0.52],
  ],
  [
    [0.375, 1.05, -0.38],
    [0.375, 0.98, -0.47],
    [0.25, 0.88, -0.51],
    [-0.03, 0.79, -0.52],
  ],
]

/** turbo-flange normal tilt: disc axis (0, cos a, sin a), i.e. faces -Z/down */
const TF_TILT = 1.15

export function ExhaustManifoldReal() {
  return (
    <group>
      {/* ------------------- 4 cast runners + port flanges -------------------- */}
      {EXHAUST_RUNNERS.map((path, i) => (
        <Tube key={`exr-${i}`} path={path} r={0.05} seg={32} radial={12}>
          <PMat m="iron" color={HEAT_MANI} e={0.04} />
        </Tube>
      ))}
      {STATIONS.map((x) => (
        <group key={`exf-${x}`} position={[x, 1.05, -0.392]}>
          <RBox args={[0.14, 0.12, 0.02]} radius={0.005} smoothness={2}>
            <PMat m="iron" color={HEAT_MANI} e={0.04} />
          </RBox>
          {/* 2 studs + nuts per port, pointing out -Z */}
          {([-0.048, 0.048] as const).map((dx) => (
            <Bolt
              key={`stud${dx}`}
              position={[dx, 0, -0.01]}
              rotation={[-Math.PI / 2, 0, 0]}
              r={0.007}
              len={0.018}
              washer={false}
              m="steel"
            />
          ))}
        </group>
      ))}

      {/* -------------------- collector down to the turbo flange -------------- */}
      <Tube
        path={[
          [-0.05, 0.8, -0.5],
          [-0.02, 0.76, -0.53],
          [0, 0.735, -0.55],
        ]}
        r={0.065}
        seg={14}
        radial={12}
      >
        <PMat m="iron" color={HEAT_MANI} e={0.04} />
      </Tube>

      {/* round turbo flange: thick disc facing -Z/down, 4 zinc studs */}
      <group position={[0, 0.72, -0.56]}>
        <mesh rotation={[TF_TILT, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.028, 28]} />
          <PMat m="iron" color={HEAT_MANI} e={0.04} />
        </mesh>
        {/* dark throat through the flange */}
        <mesh rotation={[TF_TILT, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.032, 20]} />
          <PMat color="#17191d" e={0.01} rough={0.9} metal={0.1} />
        </mesh>
        <group rotation={[TF_TILT - Math.PI, 0, 0]}>
          <BoltCircle n={4} radius={0.06} r={0.008} len={0.018} m="zincGold" position={[0, 0.014, 0]} />
        </group>
      </group>

      {/* ------------- crinkled heat shield floating over the runners --------- */}
      <RBox args={[0.46, 0.016, 0.2]} radius={0.005} smoothness={2} position={[-0.2, 1.13, -0.46]} rotation={[0.45, 0, 0.06]}>
        <PMat m="machAlu" rough={0.6} />
      </RBox>
      <RBox args={[0.46, 0.016, 0.2]} radius={0.005} smoothness={2} position={[0.2, 1.12, -0.47]} rotation={[0.4, 0, -0.08]}>
        <PMat m="machAlu" rough={0.6} />
      </RBox>
      <RBox args={[0.34, 0.016, 0.16]} radius={0.005} smoothness={2} position={[0, 0.97, -0.56]} rotation={[0.7, 0.1, 0]}>
        <PMat m="machAlu" rough={0.6} />
      </RBox>
      <Bolt position={[-0.2, 1.14, -0.44]} rotation={[0.45, 0, 0]} r={0.006} len={0.016} m="steel" />
      <Bolt position={[0.2, 1.13, -0.45]} rotation={[0.4, 0, 0]} r={0.006} len={0.016} m="steel" />
    </group>
  )
}

/* ============================ MINI TURBO ================================= */

/** compressor outlet: up and over the head's rear (+X), ends with a coupler */
const OUTLET_PATH: [number, number, number][] = [
  [0.18, 0.55, -0.67],
  [0.3, 0.56, -0.66],
  [0.47, 0.7, -0.55],
  [0.58, 0.95, -0.3],
  [0.6, 1.15, -0.02],
  [0.56, 1.27, 0.18],
  [0.52, 1.3, 0.3],
]

export function TurboMiniReal() {
  /* memoized outlet curve → exact end pose for the rubber coupler + clamp */
  const endPose = useMemo(() => {
    const c = new THREE.CatmullRomCurve3(
      OUTLET_PATH.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    )
    return {
      p: c.getPointAt(1),
      q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), c.getTangentAt(1)),
    }
  }, [])

  return (
    <group>
      {/* -------------------- turbine volute (heat-browned iron) -------------- */}
      <mesh position={[-0.1, 0.62, -0.62]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.1, 0.05, 12, 28]} />
        <PMat m="iron" color={HEAT_TURBO} e={0.04} />
      </mesh>
      {/* snail inlet stub meeting the manifold's turbo flange */}
      <Tube
        path={[
          [0, 0.715, -0.565],
          [-0.04, 0.67, -0.6],
          [-0.085, 0.65, -0.655],
          [-0.105, 0.62, -0.7],
        ]}
        r={0.042}
        seg={16}
        radial={12}
      >
        <PMat m="iron" color={HEAT_TURBO} e={0.04} />
      </Tube>
      {/* turbine outlet stub (downpipe flange side, -X) */}
      <mesh position={[-0.18, 0.62, -0.62]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.05, 0.06, 22]} />
        <PMat m="iron" color={HEAT_TURBO} e={0.04} />
      </mesh>
      <mesh position={[-0.211, 0.62, -0.62]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.046, 20]} />
        <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
      </mesh>

      {/* --------------------- center cartridge (castAlu) --------------------- */}
      <Lathe
        seg={28}
        position={[-0.045, 0.62, -0.62]}
        rotation={[0, 0, -Math.PI / 2]}
        pts={[
          [0.04, 0],
          [0.052, 0.015],
          [0.056, 0.05],
          [0.056, 0.08],
          [0.052, 0.105],
          [0.04, 0.12],
        ]}
      >
        <PMat m="castAlu" />
      </Lathe>

      {/* -------------------- compressor volute + open inlet ------------------ */}
      <mesh position={[0.14, 0.62, -0.62]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.085, 0.045, 12, 28]} />
        <PMat m="machAlu" />
      </mesh>
      {/* open-ended inlet bell facing +X */}
      <Lathe
        seg={28}
        position={[0.165, 0.62, -0.62]}
        rotation={[0, 0, -Math.PI / 2]}
        pts={[
          [0.05, 0],
          [0.047, 0.02],
          [0.046, 0.04],
          [0.052, 0.06],
          [0.07, 0.085],
          [0.088, 0.1],
        ]}
      >
        <PMat m="machAlu" side={THREE.DoubleSide} />
      </Lathe>
      {/* dark throat behind the wheel */}
      <mesh position={[0.168, 0.62, -0.62]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.046, 20]} />
        <PMat color="#141619" e={0.01} rough={0.92} metal={0.1} />
      </mesh>
      {/* COMPRESSOR WHEEL: cone hub + 8 pitched radial blades, inside the bell */}
      <group position={[0.19, 0.62, -0.62]}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.034, 0.045, 14]} />
          <PMat m="polSteel" />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => (
          <group key={`bl-${i}`} rotation={[(i / 8) * Math.PI * 2, 0, 0]}>
            <mesh position={[0, 0.024, 0]} rotation={[0, 0.5, 0]}>
              <boxGeometry args={[0.038, 0.034, 0.0022]} />
              <PMat m="machAlu" rough={0.3} />
            </mesh>
          </group>
        ))}
        {/* polished shaft nut on the nose */}
        <mesh position={[0.026, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.01, 6]} />
          <PMat m="polSteel" />
        </mesh>
      </group>

      {/* ------------------- oil feed (up to block) + drain ------------------- */}
      <Tube
        path={[
          [0, 0.67, -0.615],
          [0.02, 0.76, -0.575],
          [0.04, 0.83, -0.44],
          [0.05, 0.875, -0.36],
          [0.05, 0.88, -0.315],
        ]}
        r={0.01}
        seg={24}
        radial={8}
      >
        <PMat m="steel" />
      </Tube>
      {/* banjo fitting at the block face */}
      <mesh position={[0.05, 0.88, -0.305]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.02, 14]} />
        <PMat m="brass" />
      </mesh>
      <Tube
        path={[
          [0, 0.57, -0.615],
          [-0.01, 0.47, -0.55],
          [-0.01, 0.35, -0.44],
          [0, 0.26, -0.33],
        ]}
        r={0.014}
        seg={20}
        radial={10}
      >
        <PMat m="rubber" />
      </Tube>

      {/* ----------------- wastegate actuator can + rod (turbine side) -------- */}
      <group position={[-0.19, 0.71, -0.53]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.034, 0.034, 0.03, 22]} />
          <PMat m="steel" rough={0.45} />
        </mesh>
        <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 0.014, 22]} />
          <PMat m="steel" rough={0.45} />
        </mesh>
      </group>
      {/* actuator rod down to the wastegate lever on the volute */}
      <Tube
        path={[
          [-0.175, 0.7, -0.545],
          [-0.15, 0.67, -0.59],
          [-0.13, 0.65, -0.635],
        ]}
        r={0.0045}
        seg={8}
        radial={8}
      >
        <PMat m="polSteel" />
      </Tube>
      <RBox args={[0.01, 0.034, 0.012]} radius={0.003} smoothness={2} position={[-0.13, 0.638, -0.64]} rotation={[0.4, 0, 0]}>
        <PMat m="steel" />
      </RBox>
      {/* mounting bracket back to the cartridge */}
      <RBox args={[0.06, 0.012, 0.05]} radius={0.003} smoothness={2} position={[-0.15, 0.7, -0.555]} rotation={[0.5, 0.3, 0]}>
        <PMat m="steel" rough={0.5} />
      </RBox>

      {/* --------- compressor outlet pipe: up over the head's rear (+X) ------- */}
      <Tube path={OUTLET_PATH} r={0.04} seg={44} radial={14}>
        <PMat m="machAlu" />
      </Tube>
      {/* rubber coupler + hose clamp at the open end */}
      <group position={endPose.p} quaternion={endPose.q}>
        <mesh>
          <cylinderGeometry args={[0.048, 0.048, 0.05, 20, 1, true]} />
          <PMat m="rubber" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.005, 6, 22]} />
          <PMat m="polSteel" />
        </mesh>
        {/* worm-screw block of the clamp */}
        <RBox args={[0.016, 0.012, 0.012]} radius={0.003} smoothness={2} position={[0.052, 0.018, 0]}>
          <PMat m="steel" />
        </RBox>
      </group>
    </group>
  )
}
