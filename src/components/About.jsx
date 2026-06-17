export default function About() {
  return (
    <div className="prose view">
      <h2>What this is</h2>
      <p>An interactive atlas of the topmost concerns of the wealthy — 24 concerns across three tiers, each with 120 concrete solutions, for 2,880 total. Every solution is rated on three dimensions.</p>
      <h2>How ratings work</h2>
      <ul>
        <li><b>Priority</b> — impact on actually solving the concern (High / Medium / Low).</li>
        <li><b>Effort</b> — difficulty, time, and expertise to implement (Low / Medium / High).</li>
        <li><b>Cost</b> — out-of-pocket financial cost ($ low / $$ moderate / $$$ high).</li>
        <li><b>★ Quick win</b> — High priority <i>and</i> Low effort. The Top-10 per concern (★) weights these toward low cost too.</li>
      </ul>
      <h2>Tiers</h2>
      <ul>
        <li><b>Millionaires</b> ($1M–$30M) — worry about <i>having enough</i>.</li>
        <li><b>Billionaires</b> ($100M–$200B+) — worry about <i>keeping it, passing it on, and the spotlight</i>.</li>
        <li><b>Apex tier</b> (centi-billionaires / hypothetical trillionaires) — worry about <i>power, legitimacy, and systemic survival</i>. No individual trillionaires exist yet, so this tier is structural and speculative.</li>
      </ul>
      <h2>Features</h2>
      <ul>
        <li><b>Explore</b> — full-text search + filter by tier, priority, effort, cost, and quick-wins-only.</li>
        <li><b>Share view</b> — every filter combination is encoded in the URL; copy the link to share an exact view.</li>
        <li><b>Export CSV</b> — download the currently filtered solutions.</li>
        <li><b>Compare</b> — two concerns side by side.</li>
      </ul>
      <h2>Caveat</h2>
      <p>Ratings are directional editorial judgments, not personalized financial, legal, or security advice.</p>
    </div>
  )
}
