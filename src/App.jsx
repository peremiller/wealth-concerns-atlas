import { useEffect, useState } from 'react'
import { useData } from './lib/data.js'
import { useUrlState } from './lib/useUrlState.js'
import Dashboard from './components/Dashboard.jsx'
import Explore from './components/Explore.jsx'
import Compare from './components/Compare.jsx'
import About from './components/About.jsx'

const VIEWS = [
  ['dashboard', 'Dashboard'],
  ['explore', 'Explore'],
  ['compare', 'Compare'],
  ['about', 'About'],
]

export default function App() {
  const { data, error } = useData()
  const [state, update, reset, navigate] = useUrlState()
  const [theme, setTheme] = useState(() => localStorage.getItem('wc-theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('wc-theme', theme)
  }, [theme])

  const setView = view => navigate({ view })

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <span className="logo"><img src="/favicon.svg" alt="" aria-hidden="true" /></span>
            <div>
              <h1>Wealth Concerns Atlas</h1>
              <p className="tagline">24 concerns · 2,880 rated solutions · millionaires → apex tier</p>
            </div>
          </div>
          <nav className="tabs" aria-label="Main sections">
            {VIEWS.map(([id, label]) => (
              <button key={id} className={'tab' + (state.view === id ? ' active' : '')}
                aria-current={state.view === id ? 'page' : undefined} onClick={() => setView(id)}>
                {label}
              </button>
            ))}
          </nav>
          <button className="icon-btn" title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={theme === 'dark'}
            onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}>◐</button>
        </div>
      </header>

      <main className="wrap" id="main-content" tabIndex={-1}>
        {error && <p className="empty" role="alert">{error} — run via the dev server or a static host.</p>}
        {!data && !error && <p className="loading" role="status" aria-live="polite">Loading 2,880 solutions…</p>}
        {data && state.view === 'dashboard' && <Dashboard data={data} theme={theme} state={state} update={update} reset={reset} />}
        {data && state.view === 'explore' && <Explore data={data} state={state} update={update} reset={reset} />}
        {data && state.view === 'compare' && <Compare data={data} state={state} update={update} />}
        {data && state.view === 'about' && <About />}
      </main>

      <footer className="foot wrap">
        <span>Built from a rated dataset of 2,880 solutions. Ratings are directional editorial judgments, not financial advice.</span>
      </footer>
    </>
  )
}
