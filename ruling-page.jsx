// ruling-page.jsx — the meat: the ruling detail view.

function RulingPage({ ruling, onCreateClick, onShowToast }) {
  const [score, setScore] = React.useState(ruling.score);
  const [vote, setVote] = React.useState(ruling.userVote);
  const [donateOpen, setDonateOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [citeOpen, setCiteOpen] = React.useState(false);
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [title, setTitle] = React.useState(ruling.title);
  const [sponsor, setSponsor] = React.useState(ruling.sponsor);

  const cast = (dir) => {
    const next = dir === vote ? 0 : dir;
    setScore((s) => s - vote + next);
    setVote(next);
  };

  const onDonate = (amount) => {
    setSponsor({ user: 'you', amount, paidAt: new Date().toISOString() });
    setDonateOpen(false);
    const tier = window.tierFor(amount);
    onShowToast(<><window.Mana n={amount} /> tapped — your ruling resolves at the {tier.name} tier. Stack updated.</>);
    setTimeout(() => setEditingTitle(true), 300);
  };

  const fmtDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <div className="container">
        <nav className="breadcrumbs">
          <a>Home</a>
          <span className="breadcrumb-sep">/</span>
          <a>Rulings</a>
          <span className="breadcrumb-sep">/</span>
          <a>Static abilities</a>
          <span className="breadcrumb-sep">/</span>
          <span className="mono" style={{ color: 'var(--ink-2)' }}>{ruling.id}</span>
        </nav>

        <div className="two-col">
          <main>
            {/* Header row: tags */}
            <div className="ruling-meta-row">
              <span className="tag verified">
                <window.I.Check /> Community-verified
              </span>
              <span className="tag sponsored">
                <window.I.Sponsor /> Patron-backed ruling
              </span>
              <span className="tag dot" style={{ color: 'var(--good)' }}>Active</span>
              <span style={{ color: 'var(--ink-3)' }}>· Last edited {fmtDate(ruling.updatedAt)} · {ruling.views.toLocaleString()} views</span>
            </div>

            {/* Title */}
            {editingTitle ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                <textarea
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditingTitle(false); }}
                  style={{
                    flex: 1, fontFamily: 'Source Serif 4', fontWeight: 600, fontSize: 38,
                    lineHeight: 1.18, letterSpacing: '-0.014em', border: '2px solid var(--accent)',
                    borderRadius: 'var(--r-md)', padding: '4px 10px', resize: 'vertical',
                    background: 'var(--bg-elev)', color: 'var(--ink)', outline: 'none',
                    minHeight: 90, fontFamily_doNot: undefined,
                  }}
                />
              </div>
            ) : (
              <h1 className="ruling-title"
                  onClick={() => sponsor.user === 'you' && setEditingTitle(true)}
                  style={{ cursor: sponsor.user === 'you' ? 'text' : 'default' }}
                  title={sponsor.user === 'you' ? 'Click to edit (you are the top patron)' : ''}>
                {title}
              </h1>
            )}

            <p className="ruling-subtitle">{ruling.summary}</p>

            {/* ID strip */}
            <div className="ruling-id-row">
              <span><b>Ruling ID</b> <code>{ruling.id}</code></span>
              <span className="dot"></span>
              <span><b>Filed</b> {fmtDate(ruling.createdAt)}</span>
              <span className="dot"></span>
              <span><b>Cited</b> {ruling.citations} times</span>
              <span className="dot"></span>
              <span><b>Revisions</b> {ruling.history.length}</span>
            </div>

            {/* Cards */}
            <div className="cards-row">
              {ruling.cards.map((c, i) => (
                <React.Fragment key={c.name}>
                  <window.CardImage name={c.name} size={220} frameStyle="framed" />
                  {i < ruling.cards.length - 1 && <span className="cards-plus">+</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Vote bar inline */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
              <div className="vote-bar">
                <button className={`vote-btn ${vote === 1 ? 'active up' : ''}`} onClick={() => cast(1)} aria-label="Upvote ruling">
                  <window.I.Up />
                </button>
                <span className="vote-score">{score > 999 ? (score / 1000).toFixed(1) + 'k' : score}</span>
                <button className={`vote-btn ${vote === -1 ? 'active down' : ''}`} onClick={() => cast(-1)} aria-label="Downvote ruling">
                  <window.I.Down />
                </button>
              </div>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                <b style={{ color: 'var(--good)' }}>92%</b> approval among 1,353 community judges
              </span>
            </div>

            {/* Body */}
            <div className="ruling-body">
              {ruling.body.map((node, i) => {
                if (node.kind === 'p') return <p key={i}>{node.text}</p>;
                if (node.kind === 'callout') {
                  return (
                    <div key={i} className="ruling-callout">
                      <span className="ruling-callout-label">{node.label}</span>
                      {node.text}
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Action bar */}
            <div className="action-bar">
              <a className="btn ghost" href="#comments"><window.I.Comment /> 12 comments</a>
              <button className="btn ghost" onClick={() => setCiteOpen(true)}><window.I.Cite /> Cite</button>
              <button className="btn ghost" onClick={() => setHistoryOpen(true)}><window.I.History /> History ({ruling.history.length})</button>
              <span className="spacer" />
              <button className="btn ghost" onClick={() => onShowToast('Shared to r/magicTCG (probably)')}><window.I.Reddit /> Reddit</button>
              <button className="btn ghost" onClick={() => onShowToast('Discord webhook fired into the void')}><window.I.Discord /> Discord</button>
              <button className="btn ghost" onClick={() => { navigator.clipboard?.writeText(`https://mtgruling.com/r/${ruling.id}`); onShowToast('Link copied'); }}>
                <window.I.Share /> Share
              </button>
            </div>

            {/* Comments */}
            <window.CommentThread seed={window.COMMENTS_SEED} />
          </main>

          {/* Right rail */}
          <aside className="rail">
            <div className="rail-card">
              <div className="rail-h">Stats</div>
              <dl className="stat-grid">
                <dt>Score</dt><dd>+{score}</dd>
                <dt>Views</dt><dd>{ruling.views.toLocaleString()}</dd>
                <dt>Citations</dt><dd>{ruling.citations}</dd>
                <dt>Revisions</dt><dd>{ruling.history.length}</dd>
                <dt>Filed</dt><dd>{fmtDate(ruling.createdAt)}</dd>
                <dt>Updated</dt><dd>{fmtDate(ruling.updatedAt)}</dd>
              </dl>
            </div>

            <div className="rail-card">
              <div className="rail-h">Related &amp; contradicting</div>
              {window.RELATED.map((r) => (
                <a key={r.id} className="related-item">
                  <div>{r.title}</div>
                  <div className="rel-meta">
                    <span className={`rel-score ${r.score > 0 ? 'pos' : 'neg'}`}>
                      {r.score > 999 ? (r.score / 1000).toFixed(1) + 'k' : r.score > 0 ? '+' + r.score : r.score}
                    </span>
                    <span className="mono" style={{ fontSize: 10.5 }}>{r.id}</span>
                    {r.sponsored && <span className="tag sponsored" style={{ padding: '0 6px', fontSize: 10 }}>sponsored</span>}
                  </div>
                </a>
              ))}
            </div>

            <div className="rail-card" style={{ background: 'var(--bg-sunken)' }}>
              <div className="rail-h">Disagree?</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, marginBottom: 12 }}>
                File your own ruling about these cards. The community decides which is correct (with a strong assist from your wallet).
              </div>
              <button className="btn primary" style={{ width: '100%' }} onClick={onCreateClick}>
                <window.I.Plus /> File counter-ruling
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Support this ruling — bottom banner ───────────────────────── */}
      <section className="support-section">
        <div className="container support-inner">
          <div className="support-eyebrow">Community-supported ruling</div>
          <h2 className="support-headline">
            Help keep this ruling <span style={{ fontStyle: 'italic' }}>official</span>.
          </h2>
          <p className="support-lede">
            mtgruling.com is community-funded. Every contribution unlocks tier perks; the top patron on a ruling holds editing rights until someone taps more mana.
          </p>

          <div className="support-grid">
            {/* Donors leaderboard */}
            <div className="support-block">
              <div className="support-block-h">
                <span>Top patrons on this ruling</span>
                <span className="support-block-h-meta">{window.TOP_DONORS.length} contributors</span>
              </div>
              <ol className="donor-list">
                {window.TOP_DONORS.map((d, i) => {
                  const tier = !d.aggregate && window.tierFor(d.amount);
                  const isTop = i === 0;
                  return (
                    <li key={i} className={`donor-row ${isTop ? 'top' : ''} ${d.aggregate ? 'aggregate' : ''}`}>
                      <span className="donor-rank">{d.aggregate ? '·' : `#${i + 1}`}</span>
                      {!d.aggregate ? (
                        <div className="donor-avatar" style={{ background: `linear-gradient(135deg, ${tier.accent}, oklch(0.55 0.15 60))` }}>
                          {d.user.slice(0, 2).toUpperCase()}
                        </div>
                      ) : (
                        <div className="donor-avatar agg">+</div>
                      )}
                      <div className="donor-meta">
                        <span className="donor-name">{d.user}</span>
                        {tier && <span className="donor-tier" style={{ color: tier.accent }}>{tier.name}</span>}
                        {isTop && <span className="donor-badge">holds editing rights</span>}
                      </div>
                      <span className="donor-amt"><window.Mana n={d.amount} /></span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Editing rights card */}
            <div className="support-block edit-rights">
              <div className="support-block-h"><span>Editing rights</span></div>

              <div className="er-current">
                <div className="er-label">Currently held by</div>
                <div className="er-supporter">
                  <div className="donor-avatar lg" style={{ background: `linear-gradient(135deg, ${window.tierFor(sponsor.amount).accent}, oklch(0.55 0.15 60))` }}>
                    {sponsor.user.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="er-name">{sponsor.user}</div>
                    <div className="er-tier" style={{ color: window.tierFor(sponsor.amount).accent }}>
                      {window.tierFor(sponsor.amount).name} tier
                    </div>
                  </div>
                </div>
              </div>

              <div className="er-divider" />

              <div className="er-take">
                <div className="er-label">To take over editing</div>
                <div className="er-tier-needed">
                  <span className="er-tier-name" style={{ color: window.tierFor(sponsor.amount).accent }}>
                    {window.tierFor(sponsor.amount).name}
                  </span>
                  <span className="er-tier-arrow">→</span>
                  <span className="er-tier-name next" style={{ color: (window.TIERS.find((t) => t.min > sponsor.amount) || window.TIERS[window.TIERS.length - 1]).accent }}>
                    {(window.TIERS.find((t) => t.min > sponsor.amount) || window.TIERS[window.TIERS.length - 1]).name}
                  </span>
                </div>
                <div className="er-min">Contribute <b><window.Mana n={sponsor.amount + 1} />+</b> to outrank the current holder.</div>
              </div>

              <div className="er-actions">
                <button className="btn primary large" onClick={() => setDonateOpen(true)}>
                  <window.I.Zap /> Counterspell ruling
                </button>
                <button className="btn ghost" onClick={() => setDonateOpen(true)}>
                  Tap mana &amp; respond
                </button>
              </div>
            </div>
          </div>

          <div className="support-tier-strip">
            {window.TIERS.map((t) => (
              <div key={t.min} className="support-tier-pill" style={{ borderColor: t.accent }}>
                <span className="support-tier-pill-name" style={{ color: t.accent }}>{t.name}</span>
                <span className="support-tier-pill-min"><window.Mana n={t.min} size={11} />+</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {donateOpen && (
        <window.DonateToEditModal current={sponsor.amount} onClose={() => setDonateOpen(false)} onConfirm={onDonate} />
      )}
      {historyOpen && (
        <window.HistoryModal history={ruling.history} onClose={() => setHistoryOpen(false)} />
      )}
      {citeOpen && (
        <window.CiteModal ruling={ruling} onClose={() => setCiteOpen(false)} />
      )}
    </>
  );
}

window.RulingPage = RulingPage;
