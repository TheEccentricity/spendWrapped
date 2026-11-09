// API client + response mapping for the expense breakdown.
//
// The backend (expenseCalculator `POST /google/breakdown`) takes the one-time
// Google OAuth `code` plus a `keyword`, scans Gmail, and returns one entry per
// month (January .. current month) with the matching receipts' snippets. The
// price is carried inside each snippet's text, so the client parses it out and
// sums per month to produce the amounts the Breakdown screen renders.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Platforms shown in the picker. `keyword` is the value the backend's
// AcceptedKeyword enum expects. Chowdeck is the only one supported for now;
// add entries here as the backend accepts more keywords.
export const PLATFORMS = [{ keyword: 'chowdeck', label: 'Chowdeck' }]

// The picker's default, and the fallback keyword for the scan.
export const DEFAULT_KEYWORD = PLATFORMS[0].keyword

const PLATFORM_LABEL = Object.fromEntries(PLATFORMS.map((p) => [p.keyword, p.label]))

/**
 * Calls the backend breakdown endpoint.
 * @param {{ token: string, keyword?: string }} params
 *   `token` is the OAuth authorization code from the redirect callback.
 * @returns the raw backend JSON: { status, year, keyword, months: [...] }
 */
export async function fetchBreakdown({ token, keyword = DEFAULT_KEYWORD }) {
  const res = await fetch(`${API_BASE}/google/breakdown`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, keyword }),
  })

  if (!res.ok) {
    // Surface the backend's error message when it sends one.
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (body?.error) message = body.error
    } catch {
      // Non-JSON error body; keep the status-based message.
    }
    throw new Error(message)
  }

  return res.json()
}

// Verdict lines picked by how much was spent for the year to date.
const VERDICTS = [
  { max: 0, text: 'Nothing found. Either you’re disciplined or you order under a different email.' },
  { max: 20000, text: 'A light year. Your wallet barely noticed.' },
  { max: 100000, text: 'A steady trickle of “just one more order.” It adds up quietly.' },
  { max: 500000, text: 'That’s a month of rent spent one delivery at a time.' },
  { max: Infinity, text: 'Enough to feed a small village — but hey, no dishes to wash.' },
]

function pickVerdict(total) {
  return (VERDICTS.find((v) => total <= v.max) ?? VERDICTS[VERDICTS.length - 1]).text
}

/**
 * Reshapes the backend response into what the Breakdown screen expects:
 * { platform, year, currency, months: number[12], total, verdict }.
 *
 * The backend already parses and totals the amounts, so this only maps the
 * per-month totals into a 12-slot array (January first). Months the backend
 * did not return (not yet reached) stay `null`; a returned month with no spend
 * is `0`.
 */
export function mapBreakdown(data) {
  const months = Array(12).fill(null)

  for (const entry of data.months ?? []) {
    const index = entry.month - 1 // backend months are 1-based
    if (index < 0 || index > 11) continue
    months[index] = entry.total ?? 0
  }

  const total = data.total ?? months.reduce((sum, m) => sum + (m ?? 0), 0)
  const keyword = data.keyword ?? DEFAULT_KEYWORD

  return {
    status: 'done',
    platform: PLATFORM_LABEL[keyword] ?? keyword,
    year: data.year,
    currency: data.currency ?? 'NGN',
    months,
    total,
    verdict: pickVerdict(total),
  }
}
