import { useEffect, useState } from 'react'

export const TIERCOL = { M: '#639922', B: '#ba7517', A: '#d85a30' }
export const TIERLABEL = { M: 'Millionaires', B: 'Billionaires', A: 'Apex tier' }
export const PMAP = { High: 'b-hi', Medium: 'b-med', Low: 'b-lo' }

export function useData() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Could not load data.json'))
  }, [])
  return { data, error }
}

export function shortTitle(t) {
  return t.split(' (')[0].replace(/ \/.*$/, '').slice(0, 30)
}

export function solMatches(s, f) {
  if (f.pri.length && !f.pri.includes(s.p)) return false
  if (f.eff.length && !f.eff.includes(s.e)) return false
  if (f.cost.length && !f.cost.includes(s.c)) return false
  if (f.qwOnly && !s.qw) return false
  if (f.q && !s.text.toLowerCase().includes(f.q.toLowerCase())) return false
  return true
}

// Returns [{p, cats:[{category, solutions}], n}] for problems passing filters
export function filterProblems(data, f) {
  const out = []
  for (const p of data.problems) {
    if (f.tiers.length && !f.tiers.includes(p.t)) continue
    const cats = []
    for (const cat of p.categories) {
      const solutions = cat.solutions.filter(s => solMatches(s, f))
      if (solutions.length) cats.push({ category: cat.category, solutions })
    }
    const n = cats.reduce((a, c) => a + c.solutions.length, 0)
    if (n) out.push({ p, cats, n })
  }
  return out
}

export function toCSV(data, f) {
  const rows = [['Tier', 'Concern ID', 'Concern', 'Sub-category', '#', 'Solution', 'Priority', 'Effort', 'Cost', 'QuickWin', 'Top10']]
  for (const { p, cats } of filterProblems(data, f)) {
    for (const cat of cats) {
      for (const s of cat.solutions) {
        rows.push([TIERLABEL[p.t], p.id, p.title, cat.category, s.n, s.text, s.p, s.e, s.c, s.qw ? 'yes' : '', s.top ? 'yes' : ''])
      }
    }
  }
  return rows.map(r => r.map(cell => {
    const v = String(cell)
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
  }).join(',')).join('\n')
}

export function download(filename, text, type = 'text/csv') {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
