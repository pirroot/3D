import type { InteractableData } from '../data'

export function Crosshair({ visible }: { visible: boolean }) {
  return visible ? <div className="crosshair" aria-hidden /> : null
}

export function Welcome({ started, onStart }: { started: boolean; onStart: () => void }) {
  return (
    <div className="overlay">
      <div className="card welcome">
        <h1>The Atrium</h1>
        <p className="lead">A quiet room to walk around in. Look closely: three objects have a story.</p>
        <dl className="keys">
          <dt>W A S D</dt>
          <dd>Move</dd>
          <dt>Mouse</dt>
          <dd>Look around</dd>
          <dt>Space</dt>
          <dd>Jump</dd>
          <dt>E</dt>
          <dd>Inspect an object</dd>
          <dt>Esc</dt>
          <dd>Release the mouse</dd>
        </dl>
        <button className="btn" onClick={onStart} autoFocus>
          {started ? 'Resume' : 'Start Exploring'}
        </button>
        <p className="note">Best on desktop with a keyboard and mouse.</p>
      </div>
    </div>
  )
}

export function Hint({ item }: { item: InteractableData | null }) {
  if (!item) return null
  return (
    <div className="hint">
      <kbd>E</kbd>
      <span>Inspect {item.title}</span>
    </div>
  )
}

export function InfoPanel({ item }: { item: InteractableData | null }) {
  if (!item) return null
  return (
    <aside className="card panel" role="dialog" aria-label={item.title}>
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <span className="close">
        Press <kbd>E</kbd> to close
      </span>
    </aside>
  )
}
