// modals.jsx — Create Ruling, Donate to Edit, Edit History, Cite, Share

function Modal({ children, onClose, wide }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`}>{children}</div>
    </div>
  );
}

// ─── Create Ruling ────────────────────────────────────────────────────────

function CreateRulingModal({ onClose, onSubmit }) {
  const [step, setStep] = React.useState(1);
  const [cards, setCards] = React.useState([]);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [amount, setAmount] = React.useState(15);

  const canSubmit = cards.length >= 1 && title.trim().length > 0 && body.trim().length > 0;
  const tier = window.tierFor(amount);
  const missing = [];
  if (cards.length < 1) missing.push('a card');
  if (!title.trim()) missing.push('a title');
  if (!body.trim()) missing.push('ruling text');

  if (step === 3) {
    return (
      <Modal onClose={onClose}>
        <div className="modal-h">
          <h2>Ruling on the table</h2>
          <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
        </div>
        <div className="modal-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div className="ruling-slam">
            <window.I.Zap />
          </div>
          <h3 className="ruling-slam-h">
            <span style={{ color: tier.accent }}>{tier.name.toUpperCase()}</span> RULING — LIVE
          </h3>
          <p style={{ color: 'var(--ink-2)', maxWidth: 480, margin: '0 auto 14px', fontSize: 14, lineHeight: 1.6 }}>
            <b><window.Mana n={amount} /></b> tapped. Your ruling is <b>on the table, face up, right now</b>. Anyone searching this card sees your ruling at the top of the stack. The {tier.perks.length} perks of the <b style={{ color: tier.accent }}>{tier.name}</b> tier are active immediately.
          </p>
          <p style={{ color: 'var(--ink-3)', fontSize: 11, lineHeight: 1.5, maxWidth: 460, margin: '0 auto', fontStyle: 'italic' }}>
            Until someone taps more mana, this is the law of the land.
          </p>
        </div>
        <div className="modal-foot" style={{ justifyContent: 'flex-end' }}>
          <button className="btn primary large" onClick={onClose}>View my ruling →</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} wide>
      <div className="modal-h">
        <h2>{step === 1 ? 'File a community ruling' : 'Choose your support level'}</h2>
        <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
      </div>

      <div className="modal-body">
        {step === 1 && (
          <>
            <p style={{ marginTop: 0, marginBottom: 18, color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.55 }}>
              mtgruling.com is a 100% community-supported judgment service. File your ruling, then choose how much mana to tap. More mana unlocks more perks (à la Humble Bundle), but every ruling is published regardless of contribution.
            </p>
            <div className="field">
              <label className="field-label">Cards in question (2–4)</label>
              <window.CardPicker value={cards} onChange={setCards} max={4} />
              <div className="field-help">Type to search. Real Magic cards only — no proxies, no homebrew, no “what if Black Lotus had haste”.</div>
            </div>
            <div className="field">
              <label className="field-label">Ruling title</label>
              <input type="text"
                     placeholder="e.g. Humility + Opalescence: do enchantment-creatures retain their static abilities?"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)} />
              <div className="field-help">Phrase as a question for SEO. We will outrank Gatherer.</div>
            </div>
            <div className="field">
              <label className="field-label">Official ruling text</label>
              <textarea
                placeholder="Per the official ruling, when these cards interact, the result is…"
                value={body}
                onChange={(e) => setBody(e.target.value)} />
              <div className="field-help">
                Write in third person. Use words like “clearly,” “trivially,” and “CR 613.5” even if you have not read CR 613.5.
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: 18, padding: 14, background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>Your ruling</div>
              <div style={{ fontFamily: 'Source Serif 4', fontSize: 16, lineHeight: 1.4, color: 'var(--ink)' }}>
                {title || <span style={{ color: 'var(--ink-3)' }}>(no title)</span>}
              </div>
              <div style={{ marginTop: 4, color: 'var(--ink-3)', fontSize: 12 }}>
                {cards.map((c) => c.name).join(' · ') || 'no cards selected'}
              </div>
            </div>
            <window.DonationSlider value={amount} onChange={setAmount} />
          </>
        )}
      </div>

      <div className="modal-foot">
        {step === 2 && <button className="btn ghost" onClick={() => setStep(1)}>Back</button>}
        <span style={{ flex: 1 }} />
        {step === 1 && (
          <>
            {missing.length > 0 && (
              <span style={{ fontSize: 11.5, color: 'var(--ink-3)', alignSelf: 'center' }}>
                Add {missing.join(', ')} to continue
              </span>
            )}
            <button className="btn ghost" onClick={onClose}>Cancel</button>
            <button className="btn primary" disabled={!canSubmit} onClick={() => setStep(2)}>Continue</button>
          </>
        )}
        {step === 2 && (
          <button className="btn primary large"
                  onClick={() => { setStep(3); onSubmit?.({ cards, title, body, amount }); }}>
Tap <window.Mana n={amount} /> & Cast Ruling
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Donate to edit / outbid ──────────────────────────────────────────────

function DonateToEditModal({ current, onClose, onConfirm }) {
  const [amount, setAmount] = React.useState(Math.max(current + 5, 25));
  const [balance, setBalance] = React.useState(47);
  const [topUpOpen, setTopUpOpen] = React.useState(false);
  const tier = window.tierFor(amount);
  const beats = amount > current;
  const canAfford = balance >= amount;
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-h">
        <h2>Counterspell the current ruling</h2>
        <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
      </div>
      <div className="modal-body">
        {/* Mana balance strip */}
        <div className="mana-balance-strip">
          <div className="mana-balance-strip-label">Your mana pool</div>
          <div className="mana-balance-strip-amt">
            <window.ManaSymbol size={18} />
            <span className={`mana-balance-strip-num ${canAfford ? '' : 'low'}`}>{balance}</span>
            <span className="mana-balance-strip-unit">mana</span>
          </div>
          <span style={{ flex: 1 }} />
          {!canAfford && (
            <span className="mana-balance-strip-warn">
              Need <window.Mana n={amount - balance} /> more
            </span>
          )}
          <button className="btn primary" onClick={() => setTopUpOpen(true)}>
            <window.I.Plus /> Get more mana
          </button>
        </div>

        <p style={{ marginTop: 0, color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.55 }}>
          The current ruling sits on top of the stack with <b><window.Mana n={current} /></b> tapped. To put your ruling on top, tap <b>more mana than the current top patron</b> — your version resolves and theirs is countered. Tier perks you unlock apply to the new ruling. Tapped mana does not untap; the previous patron does not get their mana back.
        </p>
        <window.DonationSlider value={amount} onChange={setAmount} />
      </div>
      <div className="modal-foot">
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          {beats ? <>Your ruling will resolve at the <b style={{ color: tier.accent }}>{tier.name}</b> tier.</>
                 : <>Must tap more than <window.Mana n={current} /> to put your ruling on the stack.</>}
        </span>
        <span style={{ flex: 1 }} />
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn primary" disabled={!beats || !canAfford} onClick={() => onConfirm(amount)}>
{!canAfford ? <>Insufficient mana</> : <>Tap <window.Mana n={amount} /> & Counterspell</>}
        </button>
      </div>
      {topUpOpen && (
        <window.ManaShopModal
          balance={balance}
          onClose={() => setTopUpOpen(false)}
          onPurchase={(addedMana) => { setBalance(balance + addedMana); setTopUpOpen(false); }}
        />
      )}
    </Modal>
  );
}

// ─── History ──────────────────────────────────────────────────────────────

function HistoryModal({ history, onClose }) {
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  };
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-h">
        <h2>Edit history</h2>
        <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
      </div>
      <div className="modal-body">
        <p style={{ marginTop: 0, color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.55 }}>
          Each ruling can be edited by its current top supporter or by anyone who donates more. Overturned revisions are highlighted in red and may not be cited at sanctioned events*.
        </p>
        <table className="history-table">
          <thead>
            <tr><th style={{ width: 60 }}>Rev</th><th>When</th><th>By</th><th>Note</th></tr>
          </thead>
          <tbody>
            {[...history].sort((a, b) => b.rev - a.rev).map((h) => (
              <tr key={h.rev} className={h.overturned ? 'overturned' : ''}>
                <td className="history-rev">r{h.rev}</td>
                <td className="mono" style={{ color: 'var(--ink-3)', fontSize: 12 }}>{fmt(h.at)}</td>
                <td><b>{h.by}</b>{h.overturned && <span className="history-overturned-tag">overturned</span>}</td>
                <td style={{ color: 'var(--ink-2)' }}>{h.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 16 }}>
          * “Sanctioned” here means “at least one of the players agreed it was a real game.”
        </p>
      </div>
      <div className="modal-foot">
        <span style={{ flex: 1 }} />
        <button className="btn primary" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

// ─── Cite ─────────────────────────────────────────────────────────────────

function CiteModal({ ruling, onClose }) {
  const [tab, setTab] = React.useState('apa');
  const styles = {
    apa: `MTGRuling.com. (2026). ${ruling.title}. Community Ruling ${ruling.id}. Retrieved from https://mtgruling.com/r/${ruling.id}`,
    bib: `@misc{mtgr_${ruling.id.replace(/-/g, '')},\n  title={${ruling.title}},\n  author={Community Rulings Authority},\n  year={2026},\n  publisher={MTGRuling.com},\n  url={https://mtgruling.com/r/${ruling.id}}\n}`,
    md: `[${ruling.title}](https://mtgruling.com/r/${ruling.id}) (mtgruling.com, ${ruling.id})`,
    judge: `[REDACTED — judge tells you to stop showing them your phone]`,
  };
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(styles[tab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Modal onClose={onClose}>
      <div className="modal-h">
        <h2>Cite this ruling</h2>
        <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
      </div>
      <div className="modal-body">
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--rule)', marginBottom: 14 }}>
          {[['apa','APA'],['bib','BibTeX'],['md','Markdown'],['judge','Verbal (at FNM)']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ appearance: 'none', border: 0, background: 'transparent',
                padding: '8px 12px', font: 'inherit', fontSize: 13,
                color: tab === k ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontWeight: tab === k ? 600 : 400 }}>{l}</button>
          ))}
        </div>
        <pre style={{ margin: 0, padding: 16, background: 'var(--bg-sunken)',
          borderRadius: 'var(--r-md)', fontFamily: 'JetBrains Mono', fontSize: 12.5,
          lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--ink)' }}>{styles[tab]}</pre>
      </div>
      <div className="modal-foot">
        <span style={{ flex: 1 }} />
        <button className="btn ghost" onClick={onClose}>Close</button>
        <button className="btn primary" onClick={copy}>{copied ? 'Copied!' : 'Copy citation'}</button>
      </div>
    </Modal>
  );
}

window.Modal = Modal;
window.CreateRulingModal = CreateRulingModal;
window.DonateToEditModal = DonateToEditModal;
window.HistoryModal = HistoryModal;
window.CiteModal = CiteModal;

// ─── Mana shop ────────────────────────────────────────────────────────────

const MANA_PACKS = [
  { mana: 20, price: 1.99, label: 'Pocket Pack', bonus: 0, blurb: '20 mana for the casual citation.' },
  { mana: 60, price: 4.99, label: 'Sleeve', bonus: 10, blurb: '50 + 10 bonus. Tasteful.', tag: 'STARTER' },
  { mana: 200, price: 14.99, label: 'Booster Box', bonus: 50, blurb: '150 + 50 bonus. Editing rights for a week.', tag: 'POPULAR', popular: true },
  { mana: 750, price: 49.99, label: 'Collector\u2019s Vault', bonus: 250, blurb: '500 + 250 bonus. Mythic-tier energy.' },
  { mana: 2000, price: 119.99, label: 'Reserved List', bonus: 800, blurb: '1200 + 800 bonus. For the discerning litigant.', tag: 'BEST VALUE' },
];

function ManaShopModal({ balance, onClose, onPurchase }) {
  const [picked, setPicked] = React.useState(2);
  const pack = MANA_PACKS[picked];
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-h mana-shop-h">
        <div>
          <div className="mana-shop-eyebrow">Mana Shop</div>
          <h2>Top up your mana pool</h2>
        </div>
        <button className="x" onClick={onClose} aria-label="Close"><window.I.X /></button>
      </div>
      <div className="modal-body mana-shop-body">
        <div className="mana-shop-balance">
          <div className="mana-shop-balance-label">Current balance</div>
          <div className="mana-shop-balance-amt">
            <window.ManaSymbol size={22} />
            <span>{balance}</span>
            <span className="mana-shop-balance-unit">mana</span>
          </div>
        </div>

        <div className="mana-shop-grid">
          {MANA_PACKS.map((p, i) => {
            const total = p.mana;
            const base = total - p.bonus;
            return (
              <button
                key={i}
                type="button"
                className={`mana-pack ${i === picked ? 'picked' : ''} ${p.popular ? 'popular' : ''}`}
                onClick={() => setPicked(i)}
              >
                {p.tag && <span className="mana-pack-tag">{p.tag}</span>}
                <div className="mana-pack-icon">
                  <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
                    <defs>
                      <radialGradient id={`pack-${i}`} cx="50%" cy="40%">
                        <stop offset="0%" stopColor="#ffe69a" />
                        <stop offset="55%" stopColor="#ffcb3d" />
                        <stop offset="100%" stopColor="#a37200" />
                      </radialGradient>
                    </defs>
                    <circle cx="32" cy="32" r="26" fill={`url(#pack-${i})`} stroke="#fff5cc" strokeWidth="1.5" />
                    <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    <text x="32" y="40" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="22" fill="#5b3a00">M</text>
                  </svg>
                </div>
                <div className="mana-pack-amt">
                  <span className="mana-pack-mana">{total}</span>
                  <span className="mana-pack-mana-unit">mana</span>
                </div>
                {p.bonus > 0 && (
                  <div className="mana-pack-bonus">
                    {base} + <span className="mana-pack-bonus-num">{p.bonus} bonus</span>
                  </div>
                )}
                <div className="mana-pack-label">{p.label}</div>
                <div className="mana-pack-blurb">{p.blurb}</div>
                <div className="mana-pack-price">${p.price}</div>
              </button>
            );
          })}
        </div>

        <p className="mana-shop-fine">
          Mana is conjured into existence at checkout, non-refundable, non-transferable, and not legal tender outside this URL. By purchasing you affirm you understand &ldquo;mana&rdquo; is being used in the colloquial sense and not the official trademark sense. All sales final under <b>CR 117.4b</b> (we made this rule up).
        </p>
      </div>
      <div className="modal-foot">
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>
          New balance after purchase: <b><window.Mana n={balance + pack.mana} /></b>
        </span>
        <span style={{ flex: 1 }} />
        <button className="btn ghost" onClick={onClose}>Cancel</button>
        <button className="btn primary large" onClick={() => onPurchase(pack.mana)}>
          Donate ${pack.price} for <window.Mana n={pack.mana} />
        </button>
      </div>
    </Modal>
  );
}

window.ManaShopModal = ManaShopModal;
