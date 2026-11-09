// Decorative icons — hidden from screen readers; adjacent text carries meaning.
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true, focusable: false }

export function ArrowIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg {...base} width="15" height="15" {...props}>
      <rect x="4" y="10" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function EnvelopeIcon(props) {
  return (
    <svg {...base} width="36" height="36" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon(props) {
  return (
    <svg {...base} width="14" height="14" {...props}>
      <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
