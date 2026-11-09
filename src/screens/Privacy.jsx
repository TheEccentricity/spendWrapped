import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

// Privacy Policy. Written to reflect what the app actually does so it holds up
// to Google's OAuth verification for the restricted gmail.readonly scope.
// Replace CONTACT_EMAIL and confirm the wording with your own review.
const CONTACT_EMAIL = 'gabrieldam2704@gmail.com'
const EFFECTIVE_DATE = 'November 9, 2026'

export default function Privacy() {
  return (
    <main className="page page--legal">
      <Header />

      <article className="legal">
        <p className="eyebrow">Legal</p>
        <h1 className="legal__title">Privacy Policy</h1>
        <p className="legal__meta">Last updated: {EFFECTIVE_DATE}</p>

        <p className="body">
          Spend Wrapped ("we", "us") helps you see how much you spent on a
          delivery or subscription platform by reading the receipt emails in
          your Gmail account. This policy explains what we access, how we use
          it, and what we do not do with it.
        </p>

        <h2>What we access</h2>
        <p className="body">
          With your permission, we use Google's read-only Gmail API
          (<code>gmail.readonly</code>) to find and read receipt emails that
          match a specific sender and subject (for example, payment receipts
          for the platform you choose). We only read messages that match that
          receipt filter. We do not read, index, or scan the rest of your
          mailbox.
        </p>

        <h2>How we use it</h2>
        <p className="body">
          We read the matching receipts to extract the amount paid, total the
          amounts by month, and show you the breakdown in your browser. That is
          the only purpose the data is used for.
        </p>

        <h2>What we store</h2>
        <p className="body">
          We do not store your emails, their contents, or the amounts on our
          servers. Processing happens in memory for the duration of a single
          request and is discarded once your breakdown is returned. We do not
          save your Google access or refresh tokens after the request
          completes, and we do not keep a copy of your Gmail data.
        </p>

        <h2>What we never do</h2>
        <p className="body">
          We do not sell your data, use it for advertising, transfer it to
          third parties, or use it to train AI or machine-learning models.
        </p>

        <h2>Limited Use disclosure</h2>
        <p className="body">
          Spend Wrapped's use and transfer of information received from Google
          APIs will adhere to the{' '}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>

        <h2>Revoking access</h2>
        <p className="body">
          You can revoke our access to your Google account at any time from your{' '}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
          >
            Google Account permissions page
          </a>
          . Because we do not retain your data, revoking access stops all future
          processing.
        </p>

        <h2>Contact</h2>
        <p className="body">
          Questions about this policy? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <p className="legal__back">
          <Link to="/">← Back to Spend Wrapped</Link>
          {' · '}
          <Link to="/terms">Terms of Service</Link>
        </p>
      </article>
    </main>
  )
}
