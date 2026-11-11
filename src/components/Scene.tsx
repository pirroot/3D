import { RigidBody } from '@react-three/rapier'
import { Environment, Lightformer } from '@react-three/drei'

type V3 = [number, number, number]

interface BoxProps {
  p: V3
  s: V3
  c: string
  r?: number
  m?: number
  cast?: boolean
  solid?: boolean
}

/** Box mesh. `solid` boxes get a fixed physics collider. */
function Box({ p, s, c, r = 0.85, m = 0, cast = true, solid = true }: BoxProps) {
  const mesh = (
    <mesh position={p} castShadow={cast} receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={r} metalness={m} />
    </mesh>
  )
  return solid ? (
    <RigidBody type="fixed" colliders="cuboid">
      {mesh}
    </RigidBody>
  ) : (
    mesh
  )
}

const W = 14 // room width  (x)
const D = 10 // room depth  (z)
const H = 3.6 // room height (y)
const T = 0.3 // wall thickness

function Shell() {
  return (
    <>
      <Box p={[0, -T / 2, 0]} s={[W + 2 * T, T, D + 2 * T]} c="#c9b69a" r={0.55} cast={false} />
      <Box p={[0, H + T / 2, 0]} s={[W + 2 * T, T, D + 2 * T]} c="#f4f3f0" cast={false} />
      <Box p={[0, H / 2, -D / 2 - T / 2]} s={[W + 2 * T, H, T]} c="#ecebe6" cast={false} />
      <Box p={[0, H / 2, D / 2 + T / 2]} s={[W + 2 * T, H, T]} c="#ecebe6" cast={false} />
      <Box p={[-W / 2 - T / 2, H / 2, 0]} s={[T, H, D]} c="#e4e2dc" cast={false} />
      <Box p={[W / 2 + T / 2, H / 2, 0]} s={[T, H, D]} c="#e4e2dc" cast={false} />

      {/* Window (emissive panel) with frame on the right wall */}
      <mesh position={[W / 2 - 0.01, 1.9, -1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3.4, 2.2]} />
        <meshStandardMaterial color="#dff0ff" emissive="#bcdcff" emissiveIntensity={1.6} />
      </mesh>
      <Box p={[W / 2 - 0.03, 1.9, -1]} s={[0.04, 0.05, 3.5]} c="#2b2e31" solid={false} cast={false} />
      <Box p={[W / 2 - 0.03, 1.9, -1]} s={[0.04, 2.3, 0.05]} c="#2b2e31" solid={false} cast={false} />

      {/* Ceiling beam + pillar as architectural elements */}
      <Box p={[0, H - 0.15, 0]} s={[W, 0.3, 0.35]} c="#d9d6cf" cast={false} solid={false} />
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[3.4, H / 2, -0.8]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, H, 32]} />
          <meshStandardMaterial color="#f0efeb" roughness={0.7} />
        </mesh>
      </RigidBody>
    </>
  )
}

function Lighting() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#d8c9b0', 0.55]} />
      <directionalLight
        position={[5, 3.3, 3]}
        intensity={1.8}
        color="#fff3e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0004}
        shadow-radius={4}
      />
      {/* Window fill + pendant */}
      <pointLight position={[6, 2.2, -1]} intensity={12} distance={12} color="#cfe6ff" />
      <pointLight position={[0, 2.7, 0.5]} intensity={6} distance={10} color="#ffd9a8" />
      <Environment resolution={128} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} position={[6, 2, -1]} scale={[6, 4, 1]} rotation-y={-Math.PI / 2} />
      </Environment>
    </>
  )
}

function Furniture() {
  return (
    <>
      {/* Rug */}
      <Box p={[1, 0.012, 2.7]} s={[4, 0.024, 3]} c="#8a9a94" r={1} solid={false} cast={false} />

      {/* Sofa */}
      <Box p={[1, 0.22, 3.95]} s={[2.5, 0.44, 0.95]} c="#56626b" r={1} />
      <Box p={[1, 0.78, 4.33]} s={[2.5, 0.6, 0.2]} c="#56626b" r={1} />
      <Box p={[-0.3, 0.4, 3.95]} s={[0.22, 0.8, 0.95]} c="#4b565e" r={1} />
      <Box p={[2.3, 0.4, 3.95]} s={[0.22, 0.8, 0.95]} c="#4b565e" r={1} />

      {/* Coffee table */}
      <Box p={[1, 0.19, 2.3]} s={[0.9, 0.38, 0.45]} c="#2f3336" />
      <Box p={[1, 0.41, 2.3]} s={[1.3, 0.05, 0.7]} c="#b48a5c" r={0.5} />
      <mesh position={[1.2, 0.5, 2.3]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.14, 24]} />
        <meshStandardMaterial color="#f3efe6" roughness={0.4} />
      </mesh>

      {/* Bookshelf on the left wall */}
      <Box p={[-6.75, 1.1, 2.4]} s={[0.4, 2.2, 2.2]} c="#6b4f3a" r={0.6} />
      {[0.5, 1.1, 1.7].map((y, i) => (
        <group key={y}>
          {[0, 1, 2, 3, 4].map((k) => (
            <Box
              key={k}
              p={[-6.53, y + 0.15, 1.6 + k * 0.4]}
              s={[0.05, 0.3 + ((k + i) % 3) * 0.06, 0.12]}
              c={['#c0553d', '#3f6a8a', '#d8b04a', '#4a7c59', '#8a5a8a'][(k + i) % 5]}
              solid={false}
              cast={false}
            />
          ))}
        </group>
      ))}

      {/* Floor lamp */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[5.7, 0.04, 2.6]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 24]} />
          <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
        </mesh>
      </RigidBody>
      <mesh position={[5.7, 0.85, 2.6]}>
        <cylinderGeometry args={[0.015, 0.015, 1.7, 8]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[5.7, 1.8, 2.6]}>
        <cylinderGeometry args={[0.22, 0.32, 0.4, 24, 1, true]} />
        <meshStandardMaterial color="#ffe9c7" emissive="#ffcf8a" emissiveIntensity={1.2} side={2} />
      </mesh>
      <pointLight position={[5.7, 1.7, 2.6]} intensity={5} distance={7} color="#ffcf8a" />

      {/* Plant */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-6.1, 0.3, -4.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.25, 0.6, 24]} />
          <meshStandardMaterial color="#e9e4da" roughness={0.9} />
        </mesh>
      </RigidBody>
      {[0.9, 1.3, 1.6].map((y, i) => (
        <mesh key={y} position={[-6.1 + (i - 1) * 0.1, y, -4.1]} castShadow>
          <sphereGeometry args={[0.45 - i * 0.08, 16, 16]} />
          <meshStandardMaterial color="#4f7a50" roughness={0.9} />
        </mesh>
      ))}

      {/* Pendant lamp */}
      <mesh position={[0, 3.3, 0.5]}>
        <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, 2.95, 0.5]}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshStandardMaterial color="#fff6e6" emissive="#ffd9a8" emissiveIntensity={2} />
      </mesh>
    </>
  )
}

export function Scene() {
  return (
    <>
      <color attach="background" args={['#cfd6dc']} />
      <Lighting />
      <Shell />
      <Furniture />
    </>
  )
}
