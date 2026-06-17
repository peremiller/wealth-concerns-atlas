import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip,
} from 'chart.js'
import { TIERCOL, TIERLABEL, shortTitle } from '../lib/data.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

function Metric({ label, value, sub }) {
  return (
    <div className="metric">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </div>
  )
}

export default function Dashboard({ data, theme, update, reset }) {
  const sorted = [...data.problems].sort((a, b) => b.qw - a.qw)
  const dark = theme === 'dark'
  const grid = dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)'
  const tick = dark ? '#a6a89f' : '#5f615b'

  const openConcern = id => { reset(); update({ view: 'explore', open: [id] }) }

  const chartData = {
    labels: sorted.map(p => `${p.id} · ${shortTitle(p.title)}`),
    datasets: [{
      data: sorted.map(p => p.qw),
      backgroundColor: sorted.map(p => TIERCOL[p.t]),
      borderRadius: 3, barPercentage: 0.84, categoryPercentage: 0.88,
    }],
  }
  const options = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    onClick: (e, els) => { if (els.length) openConcern(sorted[els[0].index].id) },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: c => { const p = sorted[c[0].dataIndex]; return `${p.id} · ${p.title}` },
          label: c => { const p = sorted[c.dataIndex]; return [TIERLABEL[p.t], `${p.qw} quick wins (${p.cheapqw} cheap)`] },
        },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: grid }, ticks: { precision: 0, color: tick }, title: { display: true, text: 'quick-win solutions', color: tick } },
      y: { grid: { display: false }, ticks: { font: { size: 11 }, color: tick } },
    },
  }

  return (
    <div className="view">
      <div className="metrics">
        <Metric label="Concerns mapped" value={data.concerns} sub="across 3 wealth tiers" />
        <Metric label="Solutions" value={data.total_solutions.toLocaleString()} sub="120 per concern" />
        <Metric label="Quick wins" value={data.total_qw} sub="high priority + low effort" />
        <Metric label="Cheap quick wins" value={data.cheap_qw} sub="also low cost ($)" />
      </div>

      <div className="section-title"><span>Quick wins per concern</span><span className="dim">high priority + low effort, sorted — click a bar</span></div>
      <div className="legend">
        {Object.entries(TIERLABEL).map(([k, label]) => (
          <span key={k}><i className="dot" style={{ background: TIERCOL[k] }} />{label}</span>
        ))}
      </div>
      <div className="card">
        <div className="chart-wrap"><Bar data={chartData} options={options} aria-label="Quick wins per concern, sorted descending" /></div>
      </div>

      <div className="section-title"><span>Tiers at a glance</span></div>
      <div className="tierstrip">
        {data.tiers.map(t => {
          const probs = data.problems.filter(p => p.t === t.key)
          const qw = probs.reduce((a, p) => a + p.qw, 0)
          const pct = Math.round((qw / data.total_qw) * 100)
          return (
            <div className="tiercard" key={t.key} style={{ borderTopColor: TIERCOL[t.key] }}>
              <h3>{t.label}</h3>
              <div className="meta">{t.range}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
                {t.count} concerns · {(probs.length * 120).toLocaleString()} solutions · <b style={{ color: 'var(--text)' }}>{qw} quick wins</b>
              </div>
              <div className="bar"><i style={{ width: `${pct}%`, background: TIERCOL[t.key] }} /></div>
              <div style={{ fontSize: 11.5, color: 'var(--hint)', marginTop: 5 }}>{pct}% of all quick wins</div>
            </div>
          )
        })}
      </div>

      <div className="section-title"><span>Highest-leverage opportunities</span><span className="dim">most quick wins — start here</span></div>
      <div className="opps">
        {sorted.slice(0, 6).map(p => (
          <div className="opp" key={p.id} style={{ borderLeftColor: TIERCOL[p.t] }} onClick={() => openConcern(p.id)}>
            <div className="top"><span className="name">{p.id} · {p.title}</span><span className="count">{p.qw} wins</span></div>
            <div className="desc">{p.top10[0].text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
