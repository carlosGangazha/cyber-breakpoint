const leaderboard = [
  { name: 'mukoko', handle: '@mukoko', score: '2,840', rank: 1, initials: 'MK', color: 'lime' },
  { name: 'Nyasha Z', handle: '@nyashaz', score: '2,410', rank: 2, initials: 'NZ', color: 'coral' },
  { name: 'cipher_mw', handle: '@cipher_mw', score: '1,985', rank: 3, initials: 'CM', color: 'blue' },
  { name: 'Tafadzwa', handle: '@tafadzwa', score: '1,740', rank: 4, initials: 'TA', color: 'violet' },
]

function LeaderboardPage() {
  return (
    <section className="leaderboard-page">
      <div className="leaderboard-page-heading">
        <div><p className="eyebrow"><span className="pulse" /> Zimbabwe's cyber community</p><h1>Top of<br /><em>Zim.</em></h1><p className="intro-copy">The people pushing the community forward.</p></div>
        <div className="leaderboard-period"><span className="selected">THIS MONTH</span><span>ALL TIME</span></div>
      </div>
      <div className="leaderboard-table" role="list">
        {leaderboard.map((person) => <article className="leaderboard-page-row" key={person.name} role="listitem"><span className="leaderboard-page-rank">{String(person.rank).padStart(2, '0')}</span><span className={`avatar ${person.color}`}>{person.initials}</span><span className="person"><strong>{person.name}</strong><small>{person.handle}</small></span><span className="leaderboard-page-score"><strong>{person.score}</strong><small> XP</small></span><span className="leaderboard-page-arrow">↗</span></article>)}
      </div>
      <div className="leaderboard-page-footer"><span>RANKINGS UPDATED TODAY</span><span>Keep playing to climb higher <b>→</b></span></div>
    </section>
  )
}

export default LeaderboardPage
