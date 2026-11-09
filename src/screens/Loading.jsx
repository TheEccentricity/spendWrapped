import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import { EnvelopeIcon, CheckIcon } from '../components/icons.jsx'

const STEPS = [
  'Signed in with Google',
  'Finding your receipts',
  'Reading the amounts',
  'Adding it all up',
]

// Screen 2 — Loading. Driven by the real scan mutation status passed from App:
// the steps animate forward while the request is pending, the breakdown opens
// on success, and an inline error with a retry shows on failure.
export default function Loading({ status, error, onRetry }) {
  // Step 0 is already done (signed in); the scan begins on step 1.
  const [active, setActive] = useState(1)
  const navigate = useNavigate()

  // Landing here without a scan in flight (e.g. a direct URL hit) — go home.
  useEffect(() => {
    if (status === 'idle') navigate('/', { replace: true })
  }, [status, navigate])

  // On success, mark every step done briefly, then route to the breakdown.
  useEffect(() => {
    if (status !== 'success') return
    setActive(STEPS.length)
    const done = setTimeout(() => navigate('/breakdown'), 600)
    return () => clearTimeout(done)
  }, [status, navigate])

  // While pending, walk the active step forward but hold on the last one until
  // the request actually resolves.
  useEffect(() => {
    if (status !== 'pending') return
    if (active >= STEPS.length - 1) return
    const next = setTimeout(() => setActive((s) => s + 1), 1600)
    return () => clearTimeout(next)
  }, [status, active])

  function handleRetry() {
    onRetry()
    navigate('/', { replace: true })
  }

  if (status === 'error') {
    return (
      <main className="page page--loading">
        <Header />
        <div className="loading__layout">
          <div className="loading__lead">
            <h1 className="loading__title">We couldn’t finish the scan</h1>
            <p className="body">
              {error?.message || 'Something went wrong while reading your inbox.'}
            </p>
            <button type="button" className="btn btn--primary" onClick={handleRetry}>
              Try again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page page--loading">
      <Header />

      <div className="loading__layout">
        <div className="loading__lead">
          <div className="ring" role="presentation">
            <EnvelopeIcon className="ring__icon" />
          </div>
          <h1 className="loading__title">Going through your inbox</h1>
          <p className="body">
            This can take a minute. Keep this screen open while we read through your receipts.
          </p>
        </div>

        <div className="card steps">
          <ul className="steps__list">
            {STEPS.map((label, i) => {
              const state = i < active ? 'done' : i === active ? 'active' : 'pending'
              return (
                <li key={label} className={`step step--${state}`}>
                  <span className="step__marker" aria-hidden="true">
                    {state === 'done' && <CheckIcon className="step__check" />}
                  </span>
                  <span className="step__label">{label}</span>
                </li>
              )
            })}
          </ul>

          {/* Polite live region announces the active step for screen readers. */}
          <p className="sr-only" aria-live="polite">
            {active < STEPS.length ? `${STEPS[active]}…` : 'Done. Showing your breakdown.'}
          </p>
        </div>
      </div>
    </main>
  )
}
