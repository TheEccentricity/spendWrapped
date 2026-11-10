const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export const PLATFORMS = [{ keyword: 'chowdeck', label: 'Chowdeck' }]

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

// Verdict lines grouped by spending tier (year to date). One is picked at
// random from the matching tier, so each level keeps a bit of surprise.
// Tone: light-hearted roasting — funny, never mean.
const VERDICTS = [
  {
    max: 0,
    texts: [
      'Nothing found. Either you’re disciplined or you order under a different email. We see you.',
      'Zero receipts. Suspiciously clean. Who are you hiding the snacks from?',
      'Nada. You’re either a master of self-control or a master of hiding your receipts.',
    ],
  },
  {
    max: 20000,
    texts: [
      'Your kitchen must be doing numbers. Respect.',
      'A light year. Your wallet barely noticed — and neither did your stomach.',
      'Rookie numbers. You’re practically meal-prepping, aren’t you? Weirdo.',
      'Featherweight spending. The delivery riders don’t even know your name yet.',
    ],
  },
  {
    max: 100000,
    texts: [
      'A steady trickle of “just one more order.” It adds up quietly. Like your regrets.',
      'Comfortably in denial. You’d call this “treating yourself.” Every. Single. Week.',
      'Not reckless, just… consistently weak. The app has a favorite, and it’s you.',
    ],
  },
  {
    max: 500000,
    texts: [
      'That’s a month of rent spent one delivery at a time. Bold strategy.',
      'You could’ve bought a small appliance. Instead: fries. Many, many fries.',
      'At this point the restaurant should be sending YOU a Christmas card.',
    ],
  },
  {
    max: 1000000,
    texts: [
      'Enough to feed a small village — but hey, no dishes to wash.',
      'You didn’t order food. You funded a franchise. Congratulations, shareholder.',
      'The riders have a group chat and you’re the main topic. Legend, allegedly.',
      'This isn’t a spending habit, it’s a lifestyle subscription you forgot to cancel.',
    ],
  },
  {
    max: Infinity,
    texts: [
      'Millions. On delivery. Sir/ma, this is a financial emergency with extra ketchup.',
      'Seven figures of “I’ll cook tomorrow.” Tomorrow never came, and neither did your savings.',
      'You personally kept the entire kitchen employed this year. HR should send you a thank-you.',
      'A millionaire’s spend. Iconic. Devastating. Hungry.',
      'At this point you don’t have a food budget, the food has a you budget.',
    ],
  },
]

function pickVerdict(total) {
  const tier = VERDICTS.find((v) => total <= v.max) ?? VERDICTS[VERDICTS.length - 1]
  return tier.texts[Math.floor(Math.random() * tier.texts.length)]
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
