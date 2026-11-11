import { useEffect, useState, useCallback } from 'react'
import { parseCompare, serializeCompare } from './compareState.js'

const DEFAULT = {
  view: 'dashboard',
  q: '',
  tiers: [], pri: [], eff: [], cost: [],
  qwOnly: false,
  open: [],
  compare: [],
}

const VALID_VIEWS = new Set(['dashboard', 'explore', 'compare', 'about'])

function parse() {
  const h = new URLSearchParams(window.location.hash.slice(1))
  const list = k => (h.get(k) ? h.get(k).split(',').filter(Boolean) : [])
  return {
    view: VALID_VIEWS.has(h.get('view')) ? h.get('view') : DEFAULT.view,
    q: h.get('q') || '',
    tiers: list('tiers'), pri: list('pri'), eff: list('eff'), cost: list('cost'),
    qwOnly: h.get('qw') === '1',
    open: list('open'),
    compare: parseCompare(h.get('cmp')),
  }
}

function serialize(s) {
  const h = new URLSearchParams()
  if (s.view !== 'dashboard') h.set('view', s.view)
  if (s.q) h.set('q', s.q)
  if (s.tiers.length) h.set('tiers', s.tiers.join(','))
  if (s.pri.length) h.set('pri', s.pri.join(','))
  if (s.eff.length) h.set('eff', s.eff.join(','))
  if (s.cost.length) h.set('cost', s.cost.join(','))
  if (s.qwOnly) h.set('qw', '1')
  if (s.open.length) h.set('open', s.open.join(','))
  const comparison = serializeCompare(s.compare)
  if (comparison !== null) h.set('cmp', comparison)
  return h.toString()
}

export function useUrlState() {
  const [state, setState] = useState(() => ({ ...DEFAULT, ...parse() }))

  useEffect(() => {
    const onHash = () => setState(() => ({ ...DEFAULT, ...parse() }))
    window.addEventListener('hashchange', onHash)
    window.addEventListener('popstate', onHash)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('popstate', onHash)
    }
  }, [])

  useEffect(() => {
    const next = serialize(state)
    if (next !== window.location.hash.slice(1)) {
      const base = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(null, '', next ? `${base}#${next}` : base)
    }
  }, [state])

  const update = useCallback(patch => {
    setState(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  }, [])

  // Section navigation should create one recoverable browser-history entry.
  // Search and filter edits still use replaceState to avoid history spam.
  const navigate = useCallback(patch => {
    const nextState = { ...state, ...patch }
    const nextHash = serialize(nextState)
    if (nextHash !== window.location.hash.slice(1)) {
      const base = `${window.location.pathname}${window.location.search}`
      window.history.pushState(null, '', nextHash ? `${base}#${nextHash}` : base)
    }
    setState(nextState)
  }, [state])

  const reset = useCallback(() => {
    setState(s => ({ ...DEFAULT, view: s.view }))
  }, [])

  return [state, update, reset, navigate]
}
