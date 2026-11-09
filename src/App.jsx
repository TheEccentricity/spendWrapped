import { useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import EnterGmail from './screens/EnterGmail.jsx'
import Loading from './screens/Loading.jsx'
import Breakdown from './screens/Breakdown.jsx'
import { fetchBreakdown, mapBreakdown } from './api/breakdown.js'
import './App.css'

function App() {
  // The scan is a mutation (a one-time POST that consumes the OAuth code).
  // Holding it here keeps the result and status alive across the three routes.
  const scan = useMutation({ mutationFn: fetchBreakdown })

  // The OAuth code is single-use, and StrictMode runs effects twice in dev, so
  // guard against firing the scan more than once for the same code.
  const startedCode = useRef(null)

  function startScan(code, keyword) {
    if (startedCode.current === code) return
    startedCode.current = code
    scan.mutate({ token: code, keyword })
  }

  function reset() {
    startedCode.current = null
    scan.reset()
  }

  const result = scan.data ? mapBreakdown(scan.data) : null

  return (
    <Routes>
      <Route path="/" element={<EnterGmail onAuthCode={startScan} />} />
      <Route
        path="/loading"
        element={
          <Loading
            status={scan.status}
            error={scan.error}
            onRetry={reset}
          />
        }
      />
      <Route
        path="/breakdown"
        element={
          result ? (
            <Breakdown result={result} onRestart={reset} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
