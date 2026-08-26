import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AboutPage from './pages/AboutPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DiscoverPage from './pages/DiscoverPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { challenges } from './pages/challenges.js'

function App() {
  const [activeTab, setActiveTab] = useState('Discover')
  const [category, setCategory] = useState('All challenges')
  const [query, setQuery] = useState('')
  const [joined, setJoined] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authSubmitted, setAuthSubmitted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('mhiripiri-theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('mhiripiri-theme', theme)
  }, [theme])

  const filteredChallenges = useMemo(() => challenges.filter((challenge) => {
    const matchesCategory = category === 'All challenges' || challenge.category === category
    const matchesQuery = challenge.title.toLowerCase().includes(query.toLowerCase())
    return matchesCategory && matchesQuery
  }), [category, query])

  const completeSignup = () => {
    setIsLoggedIn(true)
    setShowSignup(false)
    setActiveTab('Dashboard')
  }

  const renderPage = () => {
    if (showSignup) return <SignupPage onComplete={completeSignup} onBack={() => setShowSignup(false)} />
    if (activeTab === 'Dashboard') return <DashboardPage />
    if (activeTab === 'Leaderboard') return <LeaderboardPage />
    if (activeTab === 'Learn') return <LearnPage />
    if (activeTab === 'About') return <AboutPage />
    return <DiscoverPage category={category} filteredChallenges={filteredChallenges} joined={joined} onCategoryChange={setCategory} onQueryChange={setQuery} onSetJoined={setJoined} onSetActiveTab={setActiveTab} onSetShowCreate={setShowCreate} query={query} showCreate={showCreate} />
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PwnForge home"><span className="brand-mark">M</span><span>pwnforge<span className="brand-dot">.</span></span></a>
        <nav aria-label="Main navigation">{['Discover', 'Learn', 'Leaderboard', 'About'].map((item) => <button className={activeTab === item ? 'nav-link active' : 'nav-link'} key={item} onClick={() => { setShowSignup(false); setActiveTab(item) }}>{item}</button>)}{isLoggedIn && <button className={activeTab === 'Dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => { setShowSignup(false); setActiveTab('Dashboard') }}>Dashboard</button>}</nav>
        <div className="top-actions"><button className="theme-button" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span></button>{isLoggedIn && <button className="icon-button" aria-label="Notifications">◌<span className="notification-dot" /></button>}<button className="login-button" onClick={() => { setAuthSubmitted(false); setShowAuth(true) }}>{isLoggedIn ? 'Account' : 'Log in'} <span>↗</span></button></div>
      </header>
      <main id="top">{renderPage()}</main>
      <footer><span>pwnforge community network</span><span>Harare · Bulawayo · Everywhere</span><span>status: <b>online</b></span></footer>
      {showAuth && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowAuth(false) }}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="modal-close" aria-label="Close login dialog" onClick={() => setShowAuth(false)}>×</button>{authSubmitted ? <div className="auth-success"><span className="success-mark">✓</span><p className="section-kicker">WELCOME TO PwnForge</p><h2>You're on your way in.</h2><p>Account connection is ready for the next step.</p><button className="match-button" onClick={() => setShowAuth(false)}>Back to exploring <span>→</span></button></div> : <><p className="section-kicker">JOIN THE COMMUNITY</p><h2 id="auth-title">Welcome back.</h2><p className="auth-subtitle">Pick up where you left off.</p><button className="google-button" onClick={() => { setIsLoggedIn(true); setAuthSubmitted(true) }}><span className="google-mark">G</span> Continue with Google <span className="button-arrow">↗</span></button><div className="auth-divider"><span>or use email</span></div><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setIsLoggedIn(true); setAuthSubmitted(true) }}><label>Email address<input type="email" placeholder="you@example.com" required /></label><label>Password<input type="password" placeholder="At least 8 characters" minLength="8" required /></label><button className="auth-submit" type="submit">Log in <span>→</span></button></form><p className="auth-switch">New to PwnForge? <button onClick={() => { setShowAuth(false); setShowSignup(true) }}>Create an account</button></p></>}</section></div>}
    </div>
  )
}

export default App
