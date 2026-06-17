import { useMemo, useState } from 'react'
import { TIERCOL, PMAP, filterProblems, toCSV, download } from '../lib/data.js'

const TIER_OPTS = [['M', 'Millionaires'], ['B', 'Billionaires'], ['A', 'Apex tier']]
const PRI_OPTS = ['High', 'Medium', 'Low']
const EFF_OPTS = ['Low', 'Medium', 'High']
const COST_OPTS = ['$', '$$', '$$$']

function Chip({ on, onClick, children, className = '' }) {
  return <button className={`chip ${className}${on ? ' on' : ''}`} onClick={onClick}>{children}</button>
}

function toggle(arr, v) { return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] }

function highlight(text, q) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>
}

function SolRow({ s, q }) {
  return (
    <div className="sol">
      <span className="num">{s.top && <span className="star">★</span>}{s.n}</span>
      <span className="txt">
        {highlight(s.text, q)}
        <span className="badges">
          {s.qw && <span className="qwtag">★ quick win</span>}
          <span className={`badge ${PMAP[s.p]}`}>P:{s.p}</span>
          <span className="badge b-cost">E:{s.e}</span>
          <span className="badge b-cost">{s.c}</span>
        </span>
      </span>
    </div>
  )
}

export default function Explore({ data, state, update, reset }) {
  const [copied, setCopied] = useState(false)
  const results = useMemo(() => filterProblems(data, state), [data, state])
  const total = results.reduce((a, r) => a + r.n, 0)

  const setOpen = id => update(s => ({ open: s.open.includes(id) ? s.open.filter(x => x !== id) : [...s.open, id] }))
  const allOpen = results.length > 0 && results.every(r => state.open.includes(r.p.id))
  const toggleAll = () => update({ open: allOpen ? [] : results.map(r => r.p.id) })

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1600) }
    catch { setCopied(false) }
  }
  const exportCsv = () => download('wealth-concerns-filtered.csv', toCSV(data, state))

  return (
    <div className="explore">
      <aside className="filters">
        <input className="search" type="search" placeholder="Search 2,880 solutions…"
          value={state.q} onChange={e => update({ q: e.target.value })} />

        <FilterGroup title="Tier">
          {TIER_OPTS.map(([v, l]) => <Chip key={v} on={state.tiers.includes(v)} onClick={() => update(s => ({ tiers: toggle(s.tiers, v) }))}>{l}</Chip>)}
        </FilterGroup>
        <FilterGroup title="Priority">
          {PRI_OPTS.map(v => <Chip key={v} on={state.pri.includes(v)} onClick={() => update(s => ({ pri: toggle(s.pri, v) }))}>{v}</Chip>)}
        </FilterGroup>
        <FilterGroup title="Effort">
          {EFF_OPTS.map(v => <Chip key={v} on={state.eff.includes(v)} onClick={() => update(s => ({ eff: toggle(s.eff, v) }))}>{v}</Chip>)}
        </FilterGroup>
        <FilterGroup title="Cost">
          {COST_OPTS.map(v => <Chip key={v} on={state.cost.includes(v)} onClick={() => update(s => ({ cost: toggle(s.cost, v) }))}>{v}</Chip>)}
        </FilterGroup>
        <div className="fgroup">
          <Chip className="qw" on={state.qwOnly} onClick={() => update(s => ({ qwOnly: !s.qwOnly }))}>★ Quick wins only</Chip>
        </div>
        <button className="reset" onClick={() => { reset(); update({ q: '' }) }}>Reset all filters</button>

        <div className="actions">
          <button className="act" onClick={share}>{copied ? '✓ Link copied' : '🔗 Share view'}</button>
          <button className="act" onClick={exportCsv}>⬇ Export CSV</button>
          <button className="act" onClick={() => window.print()}>🖨 Print</button>
        </div>
      </aside>

      <div>
        <div className="results-bar">
          <span className="results-meta">{total.toLocaleString()} solution{total !== 1 ? 's' : ''} across {results.length} concern{results.length !== 1 ? 's' : ''}</span>
          {results.length > 0 && <button className="linkbtn" onClick={toggleAll}>{allOpen ? 'Collapse all' : 'Expand all'}</button>}
        </div>

        {results.length === 0 && <div className="empty">No solutions match these filters.</div>}

        {results.map(({ p, cats, n }) => {
          const open = state.open.includes(p.id)
          return (
            <div className={'problem' + (open ? ' open' : '')} key={p.id}>
              <div className="phead" onClick={() => setOpen(p.id)}>
                <span className="tierbadge" style={{ background: TIERCOL[p.t] }}>{p.t}</span>
                <span className="ptitle">{p.id} · {p.title}</span>
                <span className="pmeta">{n} shown · {p.qw}★</span>
                <span className="chev">▶</span>
              </div>
              <div className="pbody">
                {cats.map(cat => (
                  <div className="catblock" key={cat.category}>
                    <h4>{cat.category}</h4>
                    {cat.solutions.map(s => <SolRow key={s.n} s={s} q={state.q} />)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return <div className="fgroup"><h3>{title}</h3>{children}</div>
}
