import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AboutPage from './pages/AboutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { challenges as challengeSeed, categories as challengeCategories } from './pages/challenges.js'

const navItems = ['Discover', 'Leaderboard', 'Learn', 'About']

function App() {
  const [activeTab, setActiveTab] = useState('Discover')
  const [category, setCategory] = useState('All challenges')
  const [query, setQuery] = useState('')
  const [joined, setJoined] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [authSubmitted, setAuthSubmitted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('mhiripiri-theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('mhiripiri-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!isLoggedIn && activeTab === 'Dashboard') {
      setActiveTab('Discover')
    }
  }, [activeTab, isLoggedIn])

  const filteredChallenges = useMemo(
    () => challengeSeed.filter((challenge) => {
      const matchesCategory = category === 'All challenges' || challenge.category === category
      const matchesQuery = challenge.title.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    }),
    [category, query],
  )

  const notifications = [
    {
      id: 1,
      title: 'Team invite',
      detail: 'Nyati Sec invited you to their weekend squad.',
      time: '2 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Challenge update',
      detail: 'Sync Loop has a new hint drop for forensics players.',
      time: '1 hour ago',
      unread: false,
    },
  ]

  const handleAuthSuccess = () => {
    setIsLoggedIn(true)
    setShowAuth(false)
    setAuthMode('login')
    setAuthSubmitted(false)
    setActiveTab('Dashboard')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mhiripiri home">
          <span className="brand-mark">M</span>
          <span>
            mhiripiri<span className="brand-dot">.</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="nav-rail">
          {navItems.map((item) => (
            <button
              className={activeTab === item ? 'nav-link active' : 'nav-link'}
              key={item}
              onClick={() => setActiveTab(item)}
              type="button"
            >
              {item}
            </button>
          ))}

          {isLoggedIn && (
            <button
              className={activeTab === 'Dashboard' ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab('Dashboard')}
              type="button"
            >
              Dashboard
            </button>
          )}
        </nav>

        <div className="top-actions">
          <button
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="theme-button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            type="button"
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {isLoggedIn && (
            <button
              aria-label="Notifications"
              className="icon-button"
              onClick={() => setShowNotifications(true)}
              type="button"
            >
              ◌
              {notifications.some((notification) => notification.unread) && <span className="notification-dot" />}
            </button>
          )}

          <button
            className="login-button"
            onClick={() => {
              if (isLoggedIn) {
                setActiveTab('Dashboard')
                return
              }

              setAuthMode('login')
              setAuthSubmitted(false)
              setShowAuth(true)
            }}
            type="button"
          >
            {isLoggedIn ? 'Profile' : 'Log in'} <span>↗</span>
          </button>
        </div>
      </header>

      <main id="top">
        {activeTab === 'Discover' && (
          <DiscoverPage
            categories={challengeCategories}
            category={category}
            filteredChallenges={filteredChallenges}
            joined={joined}
            onCategoryChange={setCategory}
            onQueryChange={setQuery}
            onSetActiveTab={setActiveTab}
            onSetJoined={setJoined}
            onSetShowCreate={setShowCreate}
            query={query}
            showCreate={showCreate}
          />
        )}

        {isLoggedIn && activeTab === 'Dashboard' && <DashboardPage />}
        {activeTab === 'Leaderboard' && <LeaderboardPage />}
        {activeTab === 'Learn' && <LearnPage />}
        {activeTab === 'About' && <AboutPage />}
        {activeTab === 'Signup' && (
          <SignupPage
            onBack={() => setActiveTab('Discover')}
            onComplete={() => {
              setIsLoggedIn(true)
              setActiveTab('Dashboard')
            }}
          />
        )}
      </main>

      <footer>
        <span>mhiripiri community network</span>
        <span>Harare · Bulawayo · Everywhere</span>
        <span>
          status: <b>online</b>
        </span>
      </footer>

      {showNotifications && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowNotifications(false)
            }
          }}
          role="presentation"
        >
          <section className="notifications-modal" aria-labelledby="notifications-title" aria-modal="true" role="dialog">
            <button
              aria-label="Close notifications dialog"
              className="modal-close"
              onClick={() => setShowNotifications(false)}
              type="button"
            >
              ×
            </button>

            <p className="section-kicker">ALERTS</p>
            <h2 id="notifications-title">Notifications</h2>

            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <span className="success-mark">✓</span>
                <p>You&apos;re all caught up. No new alerts right now.</p>
              </div>
            ) : (
              <ul className="notification-list">
                {notifications.map((notification) => (
                  <li className={notification.unread ? 'notification-item unread' : 'notification-item'} key={notification.id}>
                    <div className="notification-row">
                      <span className="notification-dot-item" aria-hidden="true" />
                      <div>
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-detail">{notification.detail}</p>
                      </div>
                    </div>
                    <span className="notification-time">{notification.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {showAuth && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAuth(false)
            }
          }}
          role="presentation"
        >
          <section className="auth-modal" aria-labelledby="auth-title" aria-modal="true" role="dialog">
            <button aria-label="Close login dialog" className="modal-close" onClick={() => setShowAuth(false)} type="button">
              
            </button>

            {authSubmitted ? (
              <div className="auth-success">
                <span className="success-mark">✓</span>
                <p className="section-kicker">WELCOME TO MHIRIPIRI</p>
                <h2>You&apos;re on your way in.</h2>
                <p>Account connection is ready for the next step.</p>
                <button className="match-button" onClick={handleAuthSuccess} type="button">
                  Back to exploring <span>→</span>
                </button>
              </div>
            ) : (
              <>
                <p className="section-kicker">JOIN THE COMMUNITY</p>
                <h2 id="auth-title">{authMode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2>
                <p className="auth-subtitle">
                  {authMode === 'login' ? 'Pick up where you left off.' : 'Find your crew, play more, learn faster.'}
                </p>

                <button className="google-button" onClick={() => setAuthSubmitted(true)} type="button">
                  <span className="google-mark">G</span> Continue with Google <span className="button-arrow">↗</span>
                </button>

                <div className="auth-divider">
                  <span>or use email</span>
                </div>

                <form
                  className="auth-form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setAuthSubmitted(true)
                  }}
                >
                  {authMode === 'register' && (
                    <label>
                      Display name
                      <input placeholder="Your handle" required type="text" />
                    </label>
                  )}

                  <label>
                    Email address
                    <input placeholder="you@example.com" required type="email" />
                  </label>

                  <label>
                    Password
                    <input minLength="8" placeholder="At least 8 characters" required type="password" />
                  </label>

                  <button className="auth-submit" type="submit">
                    {authMode === 'login' ? 'Log in' : 'Create account'} <span>→</span>
                  </button>
                </form>

                <p className="auth-switch">
                  {authMode === 'login' ? 'New to mhiripiri?' : 'Already have an account?'}{' '}
                  <button
                    onClick={() => {
                      if (authMode === 'login') {
                        setShowAuth(false)
                        setActiveTab('Signup')
                        return
                      }

                      setAuthMode('login')
                      setAuthSubmitted(false)
                    }}
                    type="button"
                  >
                    {authMode === 'login' ? 'Create account' : 'Log in'}
                  </button>
                </p>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
