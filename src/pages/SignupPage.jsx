import { useState } from 'react'
import { spawnRipple } from '../utils/ripple.js'

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Harare'

function SignupPage({ onBack, onComplete }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    displayName: '',
    country: 'Zimbabwe',
    lookingForTeam: true,
    availableForCtfs: true,
    availableForBounties: false,
  })
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState('')

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
    
      await fakeApiCall('/users', {
        username: form.username,
        email: form.email,
        display_name: form.displayName,
        country: form.country,
        timezone: TIMEZONE,
      })
      await fakeApiCall('/users/{id}/preferences', {
        looking_for_team: form.lookingForTeam,
        available_for_ctfs: form.availableForCtfs,
        available_for_bounties: form.availableForBounties,
      })
      onComplete()
    } catch {
      setStatus('error')
      setErrorMessage("Couldn't reach the network. Check your connection and try again.")
    }
  }

  return (
    <div className="page signup-page">
      <div className="page-head">
        <p className="section-kicker">CREATE YOUR PROFILE</p>
        <h1>Join the network.</h1>
        <p className="hero-sub">Set up your handle, tell us what you're available for, and you're in.</p>
      </div>

      <form className="signup-form glow-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Username
            <input onChange={update('username')} placeholder="cipher_mw" required type="text" value={form.username} />
          </label>
          <label>
            Display name
            <input onChange={update('displayName')} placeholder="Your name or crew tag" required type="text" value={form.displayName} />
          </label>
        </div>

        <div className="form-row">
          <label>
            Email address
            <input onChange={update('email')} placeholder="you@example.com" required type="email" value={form.email} />
          </label>
          <label>
            Country
            <input onChange={update('country')} required type="text" value={form.country} />
          </label>
        </div>

        <label className="timezone-note">
          Timezone detected as <span className="mono">{TIMEZONE}</span>
        </label>

        <fieldset className="preference-set">
          <legend>What are you available for?</legend>
          <label className="checkbox-row">
            <input checked={form.lookingForTeam} onChange={update('lookingForTeam')} type="checkbox" />
            Looking for a team
          </label>
          <label className="checkbox-row">
            <input checked={form.availableForCtfs} onChange={update('availableForCtfs')} type="checkbox" />
            Available for CTFs
          </label>
          <label className="checkbox-row">
            <input checked={form.availableForBounties} onChange={update('availableForBounties')} type="checkbox" />
            Available for bug bounty collabs
          </label>
        </fieldset>

        {status === 'error' && <p className="form-error">{errorMessage}</p>}

        <div className="signup-actions">
          <button className="cta-ghost glow-el" onClick={onBack} type="button">
            Back
          </button>
          <button className="cta-primary glow-el" disabled={status === 'submitting'} onPointerDown={spawnRipple} type="submit">
            {status === 'submitting' ? 'Creating account…' : 'Create account'} <span>→</span>
          </button>
        </div>
      </form>
    </div>
  )
}

function fakeApiCall(path, payload) {
  return new Promise((resolve) => {
    console.info(`[stub] POST ${path}`, payload)
    setTimeout(resolve, 450)
  })
}

export default SignupPage
