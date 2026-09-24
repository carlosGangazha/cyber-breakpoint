import { spawnRipple } from '../utils/ripple.js'

const ACTIVITY = [
  { label: 'Solved "Mbare Metro"', meta: 'OSINT · +140 XP', time: '2h ago' },
  { label: 'Joined team "Nyati Sec"', meta: 'Team matching', time: '6h ago' },
  { label: 'Published a writeup', meta: '"Sync Loop" · Forensics', time: '1d ago' },
  { label: 'Climbed to rank #14', meta: 'All-time leaderboard', time: '2d ago' },
]

const TEAMMATES = [
  {
    name: 'Tariro M.',
    role: 'Web + reverse engineering',
    availability: 'Free tonight',
    badge: 'Web',
    tone: 'crimson',
  },
  {
    name: 'Kudakwashe B.',
    role: 'Forensics + crypto',
    availability: 'Looking for a 2-person squad',
    badge: 'Forensics',
    tone: 'violet',
  },
  {
    name: 'Anesu N.',
    role: 'OSINT + scripting',
    availability: 'Joining weekend CTFs',
    badge: 'OSINT',
    tone: 'blue',
  },
]

function DashboardPage() {
  return (
    <div className="page dashboard-page">
      <div className="page-head">
        <p className="section-kicker">YOUR CONSOLE</p>
        <h1>Welcome back, operator.</h1>
      </div>

      <section className="stat-grid">
        <article className="stat-card glow-card accent-crimson">
          <span className="stat-label">Total XP</span>
          <span className="stat-value mono">4,120</span>
        </article>
        <article className="stat-card glow-card accent-violet">
          <span className="stat-label">Global rank</span>
          <span className="stat-value mono">#37</span>
        </article>
        <article className="stat-card glow-card accent-blue">
          <span className="stat-label">Challenges solved</span>
          <span className="stat-value mono">52</span>
        </article>
        <article className="stat-card glow-card accent-crimson">
          <span className="stat-label">Level status</span>
          <span className="stat-value">Breacher III</span>
        </article>
      </section>

      <section className="continue-panel glow-card">
        <div className="continue-head">
          <div>
            <p className="section-kicker">CONTINUE</p>
            <h2>Sync Loop</h2>
            <p className="challenge-host">Forensics · UZCTF</p>
          </div>
          <span className="mono progress-figure">64%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: '64%' }} />
        </div>
        <button className="cta-primary glow-el" onPointerDown={spawnRipple}>
          Resume challenge <span>→</span>
        </button>
      </section>

      <section className="teammate-panel glow-card">
        <div className="panel-head">
          <div>
            <p className="section-kicker">TEAM MATCHING</p>
            <h2>Find players for your next CTF.</h2>
          </div>
          <button className="cta-outline glow-el" onPointerDown={spawnRipple} type="button">
            Find a squad <span>→</span>
          </button>
        </div>

        <div className="teammate-grid">
          {TEAMMATES.map((player) => (
            <article className="teammate-card" key={player.name}>
              <div className="teammate-top">
                <div className={`teammate-avatar accent-${player.tone}`}>{player.name.slice(0, 2).toUpperCase()}</div>
                <span className={`player-pill accent-${player.tone}`}>{player.badge}</span>
              </div>
              <h3>{player.name}</h3>
              <p className="teammate-role">{player.role}</p>
              <p className="teammate-availability">{player.availability}</p>
              <button className="cta-ghost glow-el" onPointerDown={spawnRipple} type="button">
                Message <span>→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="activity-feed">
        <p className="section-kicker">RECENT ACTIVITY</p>
        <ul>
          {ACTIVITY.map((item) => (
            <li className="activity-row" key={item.label}>
              <span className="activity-pulse" aria-hidden="true" />
              <div>
                <p className="activity-label">{item.label}</p>
                <p className="activity-meta mono">{item.meta}</p>
              </div>
              <span className="activity-time">{item.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default DashboardPage
