import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Badge from './components/Badge.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { challenges as challengeSeed, categories as challengeCategories } from './data/challenges.js'

const navItems = ['Discover', 'Leaderboard', 'Learn', 'About']
const GOOGLE_CLIENT_ID = '601137189383-nb6mvfo3nki4ftuso4ntq406395ukqvv.apps.googleusercontent.com'

const notifications = [
  {
    id: 1,
    title: 'Team invite',
    detail: 'Miller invited you to their weekend squad.',
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

function App() {
  const [activeTab, setActiveTab] = useState('Discover')
  const [category, setCategory] = useState('All challenges')
  const [query, setQuery] = useState('')
  const [joined, setJoined] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [authSubmitted, setAuthSubmitted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
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
    () =>
      challengeSeed.filter((challenge) => {
        const matchesCategory = category === 'All challenges' || challenge.category === category
        const matchesQuery = challenge.title.toLowerCase().includes(query.toLowerCase())
        return matchesCategory && matchesQuery
      }),
    [category, query],
  )

  const openLogin = () => {
    setAuthSubmitted(false)
    setShowAuth(true)
  }

  const handleAuthSuccess = (userData = null) => {
    if (userData) {
      setUser(userData)
    }
    setIsLoggedIn(true)
    setShowAuth(false)
    setAuthSubmitted(false)
    setActiveTab('Dashboard')
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      if (!window.google?.accounts?.id) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response?.credential) {
            return
          }

          try {
            const payloadSegment = response.credential.split('.')[1]
            const normalizedPayload = payloadSegment.replace(/-/g, '+').replace(/_/g, '/')
            const decoded = JSON.parse(atob(normalizedPayload))
            const googleUser = {
              name: decoded.name || 'Google User',
              email: decoded.email || '',
              picture: decoded.picture || '',
            }

            console.log('Google user:', googleUser.name, googleUser.email)
            handleAuthSuccess(googleUser)
          } catch (error) {
            console.error('Google sign-in failed:', error)
          }
        },
      })
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleSignIn = () => {
    if (!window.google?.accounts?.id) {
      console.error('Google auth is still loading')
      return
    }

    window.google.accounts.id.prompt()
  }

  const enterNetwork = () => {
    if (isLoggedIn) {
      setActiveTab('Dashboard')
      return
    }
    openLogin()
  }

  const closeBackdrop = (setter) => (event) => {
    if (event.target === event.currentTarget) {
      setter(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mhiripiri home">
          <Badge size={34} />
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
              openLogin()
            }}
            type="button"
          >
            {isLoggedIn ? (user?.name || 'Profile') : 'Log in'} <span>↗</span>
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
            onEnterNetwork={enterNetwork}
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
          onMouseDown={closeBackdrop(setShowNotifications)}
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
          </section>
        </div>
      )}

      {showAuth && (
        <div className="modal-backdrop" onMouseDown={closeBackdrop(setShowAuth)} role="presentation">
          <section className="auth-modal" aria-labelledby="auth-title" aria-modal="true" role="dialog">
            <button aria-label="Close login dialog" className="modal-close" onClick={() => setShowAuth(false)} type="button">
              ×
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
                <h2 id="auth-title">Welcome back.</h2>
                <p className="auth-subtitle">Pick up where you left off.</p>

                <button className="google-button" onClick={handleGoogleSignIn} type="button">
                  <span className="google-mark">G</span> Continue with Google <span>↗</span>
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
                  <label>
                    Email address
                    <input placeholder="you@example.com" required type="email" />
                  </label>

                  <label>
                    Password
                    <input minLength="8" placeholder="At least 8 characters" required type="password" />
                  </label>

                  <button className="auth-submit" type="submit">
                    Log in <span>→</span>
                  </button>
                </form>

                <p className="auth-switch">
                  New to mhiripiri?{' '}
                  <button
                    onClick={() => {
                      setShowAuth(false)
                      setActiveTab('Signup')
                    }}
                    type="button"
                  >
                    Create account
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
