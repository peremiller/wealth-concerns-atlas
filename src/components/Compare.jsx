import { TIERCOL, TIERLABEL, PMAP } from '../lib/data.js'

function Picker({ data, value, onChange, exclude }) {
  return (
    <select className="cmp-select" value={value || ''} onChange={e => onChange(e.target.value)}>
      <option value="">Choose a concern…</option>
      {data.problems.filter(p => p.id !== exclude).map(p => (
        <option key={p.id} value={p.id}>{p.id} · {p.title}</option>
      ))}
    </select>
  )
}

function Column({ data, id, onChange, other }) {
  const p = data.problems.find(x => x.id === id)
  return (
    <div className="cmp-col">
      <Picker data={data} value={id} onChange={onChange} exclude={other} />
      {p && (
        <div className="cmp-card">
          <div className="cmp-head" style={{ borderTopColor: TIERCOL[p.t] }}>
            <span className="tierbadge" style={{ background: TIERCOL[p.t] }}>{TIERLABEL[p.t]}</span>
            <h3>{p.id} · {p.title}</h3>
          </div>
          <div className="cmp-stats">
            <div><b>{p.qw}</b><span>quick wins</span></div>
            <div><b>{p.cheapqw}</b><span>cheap ($)</span></div>
            <div><b>120</b><span>solutions</span></div>
          </div>
          <h4 className="cmp-sub">Top 10 solutions</h4>
          <ol className="cmp-list">
            {p.top10.map((s, i) => (
              <li key={i}>
                <span className="cmp-txt">{s.text}</span>
                <span className="badges">
                  <span className={`badge ${PMAP[s.p]}`}>P:{s.p}</span>
                  <span className="badge b-cost">E:{s.e}</span>
                  <span className="badge b-cost">{s.c}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default function Compare({ data, state, update }) {
  const [a, b] = state.compare
  const setA = v => update(s => ({ compare: [v, s.compare[1] || ''].filter(Boolean) }))
  const setB = v => update(s => ({ compare: [s.compare[0] || '', v].filter(Boolean) }))

  return (
    <div className="view">
      <div className="section-title"><span>Compare two concerns side by side</span><span className="dim">top 10 each · shareable via URL</span></div>
      <div className="cmp-grid">
        <Column data={data} id={a} onChange={setA} other={b} />
        <Column data={data} id={b} onChange={setB} other={a} />
      </div>
      {!a && !b && <p className="empty">Pick two concerns above to compare their highest-leverage solutions.</p>}
    </div>
  )
}
