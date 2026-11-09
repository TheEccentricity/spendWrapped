import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

// Terms of Service. A short, plain-language set of terms for a free,
// read-only tool. Replace CONTACT_EMAIL and confirm the wording with your
// own review.
const CONTACT_EMAIL = 'gabrieldam2704@gmail.com'
const EFFECTIVE_DATE = 'November 9, 2026'

export default function Terms() {
  return (
    <main className="page page--legal">
      <Header />

      <article className="legal">
        <p className="eyebrow">Legal</p>
        <h1 className="legal__title">Terms of Service</h1>
        <p className="legal__meta">Last updated: {EFFECTIVE_DATE}</p>

        <p className="body">
          By using Spend Wrapped ("the Service"), you agree to these terms.
          Please read them alongside our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>

        <h2>What the Service does</h2>
        <p className="body">
          Spend Wrapped connects to your Gmail account with your permission,
          reads receipt emails that match a specific filter, and shows you an
          estimate of how much you spent on a chosen platform, broken down by
          month. The Service is provided free of charge.
        </p>

        <h2>Your responsibilities</h2>
        <p className="body">
          You agree to use the Service only with a Google account you own or are
          authorized to use, and only for lawful, personal purposes. You are
          responsible for keeping your Google account secure.
        </p>

        <h2>Accuracy</h2>
        <p className="body">
          The spending figures are estimates parsed automatically from your
          receipt emails. They may be incomplete or inaccurate, <fieldset></fieldset>or example, if
          a receipt is in a format we do not recognize or is missing from your
          inbox. The Service is not financial advice, and you should not rely on
          it as an authoritative record of your spending.
        </p>

        <h2>Availability</h2>
        <p className="body">
          The Service is provided "as is" and "as available," without warranties
          of any kind. We may change, suspend, or discontinue it at any time
          without notice.
        </p>

        <h2>Limitation of liability</h2>
        <p className="body">
          To the maximum extent permitted by law, we are not liable for any
          indirect, incidental, or consequential damages arising from your use
          of the Service.
        </p>

        <h2>Changes to these terms</h2>
        <p className="body">
          We may update these terms from time to time. Continued use of the
          Service after a change means you accept the updated terms.
        </p>

        <h2>Contact</h2>
        <p className="body">
          Questions about these terms? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className="legal__back">
          <Link to="/">← Back to Spend Wrapped</Link>
          {' · '}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </article>
    </main>
  )
}
