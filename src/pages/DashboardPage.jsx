function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div><p className="eyebrow"><span className="pulse" /> Your workspace</p><h1>Welcome back,<br /><em>mukoko.</em></h1><p className="intro-copy">Keep building your edge with the community.</p></div>
        <span className="dashboard-status">LEVEL 12 / ACTIVE</span>
      </div>
      <div className="dashboard-stats">
        <article><span className="meta-label">CURRENT XP</span><strong>2,840</strong><small>+240 this month</small></article>
        <article><span className="meta-label">GLOBAL RANK</span><strong>#01</strong><small>Top of Zimbabwe</small></article>
        <article><span className="meta-label">CHALLENGES SOLVED</span><strong>38</strong><small>4 this week</small></article>
      </div>
      <div className="dashboard-grid">
        <section className="dashboard-panel"><p className="section-kicker">01 / CONTINUE</p><h2>Pick up where you left off</h2><div className="dashboard-challenge"><div><span className="category-tag">WEB</span><h3>The Baobab Protocol</h3><p>Intermediate <span className="separator">·</span> 72% complete</p></div><button className="match-button">Continue <span>→</span></button></div></section>
        <section className="dashboard-panel"><p className="section-kicker">02 / ACTIVITY</p><h2>Recent activity</h2><p className="activity-row"><span className="activity-dot lime" />Solved <strong>Cookie Crumble</strong><small>2h ago</small></p><p className="activity-row"><span className="activity-dot coral" />Joined <strong>Hacktivist Zimbabwe</strong><small>Yesterday</small></p></section>
      </div>
    </section>
  )
}

export default DashboardPage
