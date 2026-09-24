import { useState } from 'react'
import { leaderboard } from '../data/leaderboard.js'

function LeaderboardPage() {
  const [range, setRange] = useState('month')

  return (
    <div className="page leaderboard-page">
      <div className="page-head">
        <p className="section-kicker">RANKINGS</p>
        <h1>The leaderboard.</h1>
        <div className="range-toggle" role="tablist" aria-label="Leaderboard range">
          <button
            aria-selected={range === 'month'}
            className={range === 'month' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setRange('month')}
            role="tab"
          >
            This month
          </button>
          <button
            aria-selected={range === 'all'}
            className={range === 'all' ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setRange('all')}
            role="tab"
          >
            All-time
          </button>
        </div>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Handle</th>
            <th className="align-right">{range === 'month' ? 'XP this month' : 'Total XP'}</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr className={entry.rank <= 3 ? 'top-row' : undefined} key={entry.handle}>
              <td className="mono">
                {entry.rank <= 3 ? <span className="rank-medal">#{entry.rank}</span> : `#${entry.rank}`}
              </td>
              <td>
                <div className="handle-cell">
                  <span className={`avatar-chip accent-${entry.color}`}>{entry.initials}</span>
                  <div>
                    <p className="handle-name">{entry.name}</p>
                    <p className="handle-tag mono">{entry.handle}</p>
                  </div>
                </div>
              </td>
              <td className="align-right mono">{entry.score} XP</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardPage
