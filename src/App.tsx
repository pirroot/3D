import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Scene } from './components/Scene'
import { Player } from './components/Player'
import { Interactables } from './components/Interactables'
import { Crosshair, Hint, InfoPanel, Welcome } from './components/UI'
import { INTERACTABLES } from './data'

export default function App() {
  const [locked, setLocked] = useState(false)
  const [started, setStarted] = useState(false)
  const [nearby, setNearby] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)

  // E toggles the info panel for the nearby object
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE' || e.repeat || !locked) return
      setActive((a) => (a ? null : nearby))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked, nearby])

  // Close the panel when pointer is released or the player walks away
  useEffect(() => {
    if (!locked || (active && active !== nearby)) setActive(null)
  }, [locked, nearby, active])

  const start = () => {
    setStarted(true)
    try {
      document.querySelector('canvas')?.requestPointerLock()
    } catch {
      /* the click on the canvas will lock instead */
    }
  }

  const find = (id: string | null) => INTERACTABLES.find((i) => i.id === id) ?? null

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 72, near: 0.1, far: 60, position: [0, 1.7, 3] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <Scene />
            <Interactables nearby={nearby} onNearbyChange={setNearby} />
            <Player enabled={locked} />
          </Physics>
        </Suspense>
        <PointerLockControls onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />
      </Canvas>

      <Crosshair visible={locked} />
      {locked && !active && <Hint item={find(nearby)} />}
      <InfoPanel item={find(active)} />
      {!locked && <Welcome started={started} onStart={start} />}
    </>
  )
}
