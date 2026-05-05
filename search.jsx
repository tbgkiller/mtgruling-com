// search.jsx — top-nav search with autocomplete (cards + rulings).
// Click a card -> goes to a "rulings about <card>" view (we'll just bounce to
// the hero ruling). Click a ruling -> navigates to it.

function NavSearch({ onPickCard, onPickRuling }) {
  const [q, setQ] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(0);
  const wrapRef = React.useRef(null);
  const [thumbs, setThumbs] = React.useState({});

  React.useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const cardHits = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return window.CARD_CORPUS.filter((c) => c.name.toLowerCase().includes(t)).slice(0, 5);
  }, [q]);

  const rulingHits = React.useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    const all = [...window.RULINGS_DB, ...window.RELATED];
    return all.filter((r) => (r.title || '').toLowerCase().includes(t)).slice(0, 4);
  }, [q]);

  React.useEffect(() => {
    cardHits.forEach((c) => {
      if (!thumbs[c.name]) {
        window.fetchCard(c.name).then((d) => {
          if (d?.art) setThumbs((t) => ({ ...t, [c.name]: d.art }));
        });
      }
    });
  }, [cardHits]);

  const flat = [...cardHits.map((c) => ({ kind: 'card', ...c })),
                ...rulingHits.map((r) => ({ kind: 'ruling', ...r }))];

  const pick = (item) => {
    if (item.kind === 'card') onPickCard?.(item);
    else onPickRuling?.(item);
    setOpen(false);
    setQ('');
  };

  return (
    <div className="nav-search" ref={wrapRef}>
      <span className="nav-search-icon"><window.I.Search /></span>
      <input
        type="text"
        placeholder="Search cards, rulings, judges…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setFocused(0); }}
        onFocus={() => q && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setFocused((i) => Math.min(flat.length - 1, i + 1)); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setFocused((i) => Math.max(0, i - 1)); }
          else if (e.key === 'Enter' && flat[focused]) { e.preventDefault(); pick(flat[focused]); }
          else if (e.key === 'Escape') setOpen(false);
        }}
      />
      {open && q && flat.length > 0 && (
        <div className="card-picker-popover" style={{ marginTop: 4 }}>
          {cardHits.length > 0 && <div style={{ padding: '8px 12px 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>Cards</div>}
          {cardHits.map((c, i) => (
            <div key={'c-' + c.name}
                 className={`card-picker-row ${i === focused ? 'focused' : ''}`}
                 onMouseEnter={() => setFocused(i)}
                 onClick={() => pick({ kind: 'card', ...c })}>
              {thumbs[c.name]
                ? <img className="card-picker-thumb" src={thumbs[c.name]} alt="" />
                : <span className="card-picker-thumb" style={{ background: 'var(--bg-sunken)' }} />}
              <div className="card-picker-info">
                <div className="card-picker-name">{c.name}</div>
                <div className="card-picker-type">{c.type} · {c.set}</div>
              </div>
              <span className="card-picker-mana">{c.mana}</span>
            </div>
          ))}
          {rulingHits.length > 0 && <div style={{ padding: '8px 12px 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-3)', borderTop: cardHits.length ? '1px solid var(--rule)' : '0' }}>Rulings</div>}
          {rulingHits.map((r, idx) => {
            const i = cardHits.length + idx;
            return (
              <div key={'r-' + r.id}
                   className={`card-picker-row ${i === focused ? 'focused' : ''}`}
                   onMouseEnter={() => setFocused(i)}
                   onClick={() => pick({ kind: 'ruling', ...r })}>
                <span className="card-picker-thumb" style={{ background: 'var(--accent-tint)', color: 'var(--accent)', display: 'grid', placeItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700 }}>
                  {(r.id || '').slice(-3)}
                </span>
                <div className="card-picker-info" style={{ minWidth: 0 }}>
                  <div className="card-picker-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div className="card-picker-type"><span className="mono">{r.id}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.NavSearch = NavSearch;
