import { useEffect, useState, useCallback } from 'react'

const DEFAULT = {
  view: 'dashboard',
  q: '',
  tiers: [], pri: [], eff: [], cost: [],
  qwOnly: false,
  open: [],
  compare: [],
}

function parse() {
  const h = new URLSearchParams(window.location.hash.slice(1))
  const list = k => (h.get(k) ? h.get(k).split(',').filter(Boolean) : [])
  return {
    view: h.get('view') || DEFAULT.view,
    q: h.get('q') || '',
    tiers: list('tiers'), pri: list('pri'), eff: list('eff'), cost: list('cost'),
    qwOnly: h.get('qw') === '1',
    open: list('open'),
    compare: list('cmp'),
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
  if (s.compare.length) h.set('cmp', s.compare.join(','))
  return h.toString()
}

export function useUrlState() {
  const [state, setState] = useState(() => ({ ...DEFAULT, ...parse() }))

  useEffect(() => {
    const onHash = () => setState(() => ({ ...DEFAULT, ...parse() }))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const next = serialize(state)
    if (next !== window.location.hash.slice(1)) {
      window.history.replaceState(null, '', next ? `#${next}` : `${window.location.pathname}`)
    }
  }, [state])

  const update = useCallback(patch => {
    setState(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  }, [])

  const reset = useCallback(() => {
    setState(s => ({ ...DEFAULT, view: s.view }))
  }, [])

  return [state, update, reset]
}
