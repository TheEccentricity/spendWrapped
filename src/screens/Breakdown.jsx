import { useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

const CURRENCY_SIGNS = { NGN: '₦' }

// Screen 3 — Breakdown.
export default function Breakdown({ result, onRestart }) {
  const navigate = useNavigate()

  function handleRestart() {
    onRestart?.()
    navigate('/')
  }
  const { platform, year, currency, months, total, verdict } = result
  const sign = CURRENCY_SIGNS[currency] || ''

  const fmt = (n) => `${sign}${Number(n).toLocaleString('en-US')}`

  // Scale each bar against the largest month so the biggest is full width.
  const max = Math.max(...months.filter((m) => m != null), 0)

  // Date range runs Jan to the last month that has been reached (non-null).
  let lastReached = -1
  months.forEach((m, i) => { if (m != null) lastReached = i })
  const range = lastReached >= 0 ? `JAN TO ${MONTHS_SHORT[lastReached]} ${year}` : `${year}`

  return (
    <main className="page page--breakdown">
      <Header />

      <div className="breakdown__layout">
        <div className="breakdown__left">
          <p className="eyebrow">{platform.toUpperCase()} · {range}</p>
          <h1 className="breakdown__title">Here's where your money went</h1>

          <div className="card total">
            <p className="total__label">Total spent this year</p>
            <p className="total__amount">{fmt(total)}</p>
          </div>

          <div className="card verdict">
            <p className="eyebrow verdict__eyebrow">The Verdict</p>
            <p className="verdict__text">{verdict}</p>
          </div>

          <button type="button" className="btn btn--secondary" onClick={handleRestart}>
            Check another platform
          </button>
        </div>

        <div className="card months">
          <table className="months__table">
            <caption className="sr-only">Spend by month on {platform} for {year}</caption>
            <tbody>
              {months.map((amount, i) => {
                const hasSpend = amount != null && amount > 0
                const pct = hasSpend && max > 0 ? Math.max((amount / max) * 100, 2) : 0
                return (
                  <tr key={MONTHS[i]} className="month">
                    <th scope="row" className="month__name">{MONTHS[i]}</th>
                    <td className="month__bar-cell">
                      <span className="bar" aria-hidden="true">
                        <span className="bar__fill" style={{ width: `${pct}%` }} />
                      </span>
                    </td>
                    <td className={`month__amount ${hasSpend ? '' : 'month__amount--empty'}`}>
                      {hasSpend ? fmt(amount) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
