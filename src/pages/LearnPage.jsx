const resources = [
  { type: 'WEB SECURITY', title: 'PortSwigger Web Security Academy', detail: 'Interactive labs for learning modern web vulnerabilities.', url: 'https://portswigger.net/web-security', accent: 'lime' },
  { type: 'PRACTICE', title: 'OverTheWire Wargames', detail: 'Hands-on Linux and security challenges for every level.', url: 'https://overthewire.org/wargames/', accent: 'coral' },
  { type: 'CRYPTO', title: 'CryptoHack', detail: 'Learn cryptography by solving small, focused problems.', url: 'https://cryptohack.org/', accent: 'blue' },
]

function LearnPage() {
  return (
    <section className="learn-page">
      <div className="learn-heading"><div><p className="eyebrow"><span className="pulse" /> Keep learning</p><h1>Go deeper<br /><em>elsewhere.</em></h1><p className="intro-copy">PwnForge helps you discover the next challenge. These partner spaces help you build the skill.</p></div><span className="learn-count">EXTERNAL RESOURCES</span></div>
      <div className="learn-handoff"><span className="handoff-mark">↗</span><div><strong>Learning continues outside PwnForge.</strong><p>Choose a resource, learn by doing, then bring your new instincts back to the community.</p></div><span className="handoff-label">CURATED FOR YOU</span></div>
      <div className="learning-paths">{resources.map((resource) => <a className="learning-path resource-card" href={resource.url} target="_blank" rel="noreferrer" key={resource.title}><span className={`path-accent ${resource.accent}`} /><div><p className="section-kicker">{resource.type}</p><h2>{resource.title}</h2><p>{resource.detail}</p></div><span className="open-button" aria-hidden="true">↗</span></a>)}</div>
    </section>
  )
}

export default LearnPage
