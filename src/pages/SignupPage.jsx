import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function SignupPage({ onBack, onComplete }) {
  const [form, setForm] = useState({ username: '', email: '', display_name: '', country: 'Zimbabwe', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, looking_for_team: true, available_for_ctfs: true, available_for_bounties: true })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const submitSignup = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const userResponse = await fetch(`${API_BASE_URL}/users`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.username, email: form.email, display_name: form.display_name || null, country: form.country || null, timezone: form.timezone || null }) })
      if (!userResponse.ok) {
        const responseBody = await userResponse.json().catch(() => ({}))
        throw new Error(responseBody.detail || 'We could not create your account.')
      }
      const user = await userResponse.json()
      const preferencesResponse = await fetch(`${API_BASE_URL}/users/${user.id}/preferences`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ looking_for_team: form.looking_for_team, available_for_ctfs: form.available_for_ctfs, available_for_bounties: form.available_for_bounties }) })
      if (!preferencesResponse.ok) throw new Error('Your profile was created, but preferences could not be saved.')
      onComplete(user)
    } catch (signupError) {
      setError(signupError.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="signup-page">
      <div className="signup-intro"><p className="eyebrow"><span className="pulse" /> Join the community</p><h1>Make your<br /><em>first move.</em></h1><p className="intro-copy">Tell us enough to help you find the right people and challenges.</p><button className="back-button" onClick={onBack}>← Back to exploring</button></div>
      <form className="signup-form" onSubmit={submitSignup}><div className="signup-form-heading"><p className="section-kicker">01 / YOUR PROFILE</p><h2>Set up your identity.</h2><p>These details power discovery and team matching.</p></div><div className="signup-fields"><label>Username<input name="username" value={form.username} onChange={updateField} minLength="3" maxLength="50" placeholder="e.g. mukoko" required /></label><label>Email address<input name="email" type="email" value={form.email} onChange={updateField} maxLength="320" placeholder="you@example.com" required /></label><label>Display name<input name="display_name" value={form.display_name} onChange={updateField} maxLength="100" placeholder="How should we call you?" /></label><label>Country<input name="country" value={form.country} onChange={updateField} maxLength="100" placeholder="Zimbabwe" /></label><label className="full-field">Timezone<input name="timezone" value={form.timezone} onChange={updateField} maxLength="100" placeholder="Africa/Harare" /></label></div><div className="signup-preferences"><p className="section-kicker">02 / MATCHING SIGNALS</p><h2>What are you open to?</h2><label><input name="looking_for_team" type="checkbox" checked={form.looking_for_team} onChange={updateField} /> Looking for a team</label><label><input name="available_for_ctfs" type="checkbox" checked={form.available_for_ctfs} onChange={updateField} /> Available for CTFs</label><label><input name="available_for_bounties" type="checkbox" checked={form.available_for_bounties} onChange={updateField} /> Available for bug bounties</label></div>{error && <p className="signup-error" role="alert">{error}</p>}<button className="signup-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating profile...' : 'Create my profile'} <span>↗</span></button><p className="signup-footnote">Your account data is sent to the PwnForge API at {API_BASE_URL}.</p></form>
    </section>
  )
}

export default SignupPage
