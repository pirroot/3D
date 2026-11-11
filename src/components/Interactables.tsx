import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { RigidBody } from '@react-three/rapier'
import { INTERACTABLES } from '../data'
import { playerPosition } from '../state'

interface Props {
  nearby: string | null
  onNearbyChange: (id: string | null) => void
}

export function Interactables({ nearby, onNearbyChange }: Props) {
  const last = useRef<string | null>(null)

  // Find the closest interactable in range; only notify React when it changes.
  useFrame(() => {
    let best: string | null = null
    let bestDist = Infinity
    for (const it of INTERACTABLES) {
      const d = Math.hypot(playerPosition.x - it.position[0], playerPosition.z - it.position[2])
      if (d < it.radius && d < bestDist) {
        best = it.id
        bestDist = d
      }
    }
    if (best !== last.current) {
      last.current = best
      onNearbyChange(best)
    }
  })

  return (
    <>
      <Sculpture active={nearby === 'sculpture'} />
      <Painting active={nearby === 'painting'} />
      <Turntable active={nearby === 'record'} />
    </>
  )
}

const glow = (active: boolean, base = 0.04) => (active ? 0.7 : base)

function Sculpture({ active }: { active: boolean }) {
  const knot = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (knot.current) knot.current.rotation.y += dt * (active ? 0.9 : 0.3)
  })
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-4, 0.5, -2]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 1, 0.7]} />
          <meshStandardMaterial color="#f2f0eb" roughness={0.6} />
        </mesh>
      </RigidBody>
      <mesh ref={knot} position={[-4, 1.55, -2]} castShadow>
        <torusKnotGeometry args={[0.28, 0.09, 128, 16]} />
        <meshStandardMaterial
          color="#b9c4cf"
          metalness={1}
          roughness={0.2}
          emissive="#6ee7b7"
          emissiveIntensity={glow(active)}
        />
      </mesh>
    </>
  )
}

function Painting({ active }: { active: boolean }) {
  return (
    <group position={[0, 1.8, -4.96]}>
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.6, 0.06]} />
        <meshStandardMaterial color="#25282b" roughness={0.5} emissive="#6ee7b7" emissiveIntensity={active ? 0.25 : 0} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[2.3, 1.4]} />
        <meshStandardMaterial color="#efe8dc" roughness={0.9} />
      </mesh>
      {(
        [
          [-0.5, 0.05, 0.45, '#d9794a'],
          [0.1, -0.05, 0.5, '#3f6a8a'],
          [0.65, 0.1, 0.3, '#e8c15a'],
        ] as const
      ).map(([x, y, r, c], i) => (
        <mesh key={i} position={[x, y, 0.04 + i * 0.002]}>
          <circleGeometry args={[r, 48]} />
          <meshStandardMaterial color={c} roughness={0.9} transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  )
}

function Turntable({ active }: { active: boolean }) {
  const disc = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (disc.current) disc.current.rotation.y -= dt * 3.5
  })
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4.5, 0.35, -4.7]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.7, 0.5]} />
          <meshStandardMaterial color="#5a3e2b" roughness={0.55} />
        </mesh>
      </RigidBody>
      <mesh position={[4.5, 0.74, -4.7]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.5]} />
        <meshStandardMaterial color="#1d1f21" roughness={0.4} emissive="#6ee7b7" emissiveIntensity={glow(active, 0)} />
      </mesh>
      <mesh ref={disc} position={[4.4, 0.8, -4.7]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 48]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[4.4, 0.815, -4.7]}>
        <cylinderGeometry args={[0.06, 0.06, 0.005, 24]} />
        <meshStandardMaterial color="#d9794a" />
      </mesh>
    </>
  )
}
