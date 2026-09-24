import { useState } from 'react'
import Badge from '../components/Badge.jsx'
import { spawnRipple } from '../utils/ripple.js'
import { leaderboard } from '../data/leaderboard.js'

const STEPS = [
  {
    title: 'Explore',
    body: 'Browse live and upcoming CTFs from local and global hosts, filtered the way you actually search.',
  },
  {
    title: 'Connect',
    body: "Post what you're looking for, or find a team already looking for someone with your skills.",
  },
  {
    title: 'Level up',
    body: 'Solve, climb the leaderboard, and build a record that Zimbabwean unis and employers can see.',
  },
]

function DiscoverPage({
  category,
  categories,
  filteredChallenges,
  joined,
  onCategoryChange,
  onQueryChange,
  onSetJoined,
  onSetActiveTab,
  onSetShowCreate,
  query,
  showCreate,
}) {
  const [createSubmitted, setCreateSubmitted] = useState(false)

  return (
    <div className="page discover-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="section-kicker">ZIMBABWE'S CTF NETWORK</p>
          <h1>
            Where Zimbabwe's
            <br />
            hackers <span className="text-breach">converge.</span>
          </h1>
          <p className="hero-sub">
            Find your team, track live competitions, and build a track record that gets you noticed —
            all from one place built for the local scene.
          </p>
          <div className="hero-actions">
            <button className="cta-primary glow-el" onPointerDown={spawnRipple} onClick={() => onSetActiveTab('Dashboard')}>
              Enter the network <span>→</span>
            </button>
            <button className="cta-ghost glow-el" onPointerDown={spawnRipple} onClick={() => onSetActiveTab('Learn')}>
              See how it works
            </button>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <Badge size={220} />
        </div>
      </section>

      <section className="how-it-works">
        {STEPS.map((step, index) => (
          <article className="step-card glow-card" key={step.title} style={{ '--stagger': index }}>
            <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="challenge-browser">
        <div className="browser-head">
          <div>
            <p className="section-kicker">LIVE &amp; UPCOMING</p>
            <h2>Challenges right now</h2>
          </div>
          <button className="cta-outline glow-el" onPointerDown={spawnRipple} onClick={() => onSetShowCreate(true)}>
            + Create challenge
          </button>
        </div>

        <div className="browser-controls">
          <input
            className="search-input"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search challenges…"
            type="search"
            value={query}
          />
          <div className="category-pills">
            {categories.map((item) => (
              <button
                className={item === category ? 'pill active' : 'pill'}
                key={item}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="challenge-grid">
          {filteredChallenges.length === 0 && (
            <p className="empty-state">No challenges match that search. Try another category or term.</p>
          )}
          {filteredChallenges.map((challenge) => (
            <article className={`challenge-card accent-${challenge.accent}`} key={challenge.title}>
              <div className="challenge-top">
                <span className={challenge.live ? 'live-tag' : 'ended-tag'}>{challenge.live ? 'live' : 'ended'}</span>
                <span className="challenge-category">{challenge.category}</span>
              </div>
              <h3>{challenge.title}</h3>
              <p className="challenge-host">hosted on {challenge.host}</p>
              <div className="challenge-meta">
                <span>{challenge.difficulty}</span>
                <span className="dot">·</span>
                <span className="mono">{challenge.time} left</span>
                <span className="dot">·</span>
                <span className="mono">{challenge.solves} solves</span>
              </div>
              <button
                className="challenge-join glow-el"
                disabled={!challenge.live}
                onPointerDown={spawnRipple}
                onClick={() => onSetJoined(true)}
              >
                {challenge.live ? 'Join CTF' : 'View writeup'} <span>→</span>
              </button>
            </article>
          ))}
        </div>

        {joined && <p className="join-confirm">You're registered. Check your dashboard for the live scoreboard link.</p>}
      </section>

      <section className="leaderboard-preview">
        <div>
          <p className="section-kicker">TOP OF THE BOARD</p>
          <h2>This month's frontrunners</h2>
        </div>
        <ul className="preview-list">
          {leaderboard.slice(0, 4).map((entry) => (
            <li className={`preview-row accent-${entry.color}`} key={entry.handle}>
              <span className="preview-rank mono">#{entry.rank}</span>
              <span className={`avatar-chip accent-${entry.color}`}>{entry.initials}</span>
              <span className="preview-name">{entry.name}</span>
              <span className="preview-score mono">{entry.score} XP</span>
            </li>
          ))}
        </ul>
        <button className="cta-outline glow-el" onPointerDown={spawnRipple} onClick={() => onSetActiveTab('Leaderboard')}>
          Full leaderboard <span>→</span>
        </button>
      </section>

      {showCreate && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onSetShowCreate(false)
              setCreateSubmitted(false)
            }
          }}
        >
          <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
            <button
              className="modal-close"
              aria-label="Close create challenge dialog"
              onClick={() => {
                onSetShowCreate(false)
                setCreateSubmitted(false)
              }}
            >
              ×
            </button>

            {createSubmitted ? (
              <div className="auth-success">
                <span className="success-mark">✓</span>
                <p className="section-kicker">SUBMITTED FOR REVIEW</p>
                <h2>Challenge queued.</h2>
                <p>Moderators review community challenges before they go live. You'll be notified either way.</p>
                <button
                  className="match-button glow-el"
                  onPointerDown={spawnRipple}
                  onClick={() => {
                    onSetShowCreate(false)
                    setCreateSubmitted(false)
                  }}
                >
                  Done <span>→</span>
                </button>
              </div>
            ) : (
              <>
                <p className="section-kicker">COMMUNITY CHALLENGE</p>
                <h2 id="create-title">Publish a challenge.</h2>
                <p className="auth-subtitle">Every submission is moderated before it goes live to the network.</p>
                <form
                  className="auth-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setCreateSubmitted(true)
                  }}
                >
                  <label>
                    Challenge title
                    <input placeholder="e.g. Nested Archive Zero" required type="text" />
                  </label>
                  <label>
                    Category
                    <select defaultValue="Web" required>
                      {categories
                        .filter((item) => item !== 'All challenges')
                        .map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Short brief
                    <textarea placeholder="What's the setup? What should solvers expect?" required rows={3} />
                  </label>
                  <button className="auth-submit glow-el" onPointerDown={spawnRipple} type="submit">
                    Submit for review <span>→</span>
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default DiscoverPage
