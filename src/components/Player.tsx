import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, CuboidCollider, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'
import { playerPosition } from '../state'

const SPEED = 4.2
const JUMP_SPEED = 7.2
const EYE_OFFSET = 0.68 // eye height above capsule centre

const fwd = new Vector3()
const right = new Vector3()
const move = new Vector3()

export function Player({ enabled }: { enabled: boolean }) {
  const body = useRef<RapierRigidBody>(null)
  const keys = useRef<Record<string, boolean>>({})
  const grounded = useRef(0)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
      if (e.code === 'Space') e.preventDefault()
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    const clear = () => (keys.current = {})
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])

  useFrame((state, delta) => {
    const b = body.current
    if (!b) return
    const k = keys.current
    const vel = b.linvel()
    const pos = b.translation()

    move.set(0, 0, 0)
    if (enabled) {
      state.camera.getWorldDirection(fwd)
      fwd.y = 0
      fwd.normalize()
      right.crossVectors(fwd, state.camera.up).normalize()
      if (k.KeyW) move.add(fwd)
      if (k.KeyS) move.sub(fwd)
      if (k.KeyD) move.add(right)
      if (k.KeyA) move.sub(right)
      move.normalize().multiplyScalar(SPEED)
    }

    // Exponential smoothing for responsive-but-soft acceleration
    const t = 1 - Math.exp(-14 * Math.min(delta, 0.05))
    let vy = vel.y
    if (enabled && k.Space && grounded.current > 0 && vel.y < 0.5) vy = JUMP_SPEED

    b.setLinvel({ x: vel.x + (move.x - vel.x) * t, y: vy, z: vel.z + (move.z - vel.z) * t }, true)

    state.camera.position.set(pos.x, pos.y + EYE_OFFSET, pos.z)
    playerPosition.set(pos.x, pos.y, pos.z)
  })

  return (
    <RigidBody
      ref={body}
      position={[0, 1, 3]}
      enabledRotations={[false, false, false]}
      canSleep={false}
      ccd
    >
      <CapsuleCollider args={[0.45, 0.3]} friction={0} />
      {/* Ground sensor just below the feet */}
      <CuboidCollider
        args={[0.2, 0.05, 0.2]}
        position={[0, -0.78, 0]}
        sensor
        onIntersectionEnter={() => grounded.current++}
        onIntersectionExit={() => (grounded.current = Math.max(0, grounded.current - 1))}
      />
    </RigidBody>
  )
}
