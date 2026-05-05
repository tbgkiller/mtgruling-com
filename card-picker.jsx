// card-picker.jsx — autocomplete card selector with thumbnail previews.
// Used in the "create ruling" modal. Picks from CARD_CORPUS for suggestions,
// fetches actual Scryfall data + thumbnail when a card is added.

function CardPicker({ value, onChange, max = 4, placeholder = 'Add a card to the ruling…' }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [focusedIdx, setFocusedIdx] = React.useState(0);
  const [thumbs, setThumbs] = React.useState({});
  const inputRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  // load thumbs for chips
  React.useEffect(() => {
    value.forEach((c) => {
      if (!thumbs[c.name]) {
        window.fetchCard(c.name).then((d) => {
          if (d?.art) setThumbs((t) => ({ ...t, [c.name]: d.art }));
        });
      }
    });
  }, [value]);

  // close on outside click
  React.useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return window.CARD_CORPUS.slice(0, 8);
    return window.CARD_CORPUS
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  const isChosen = (name) => value.some((v) => v.name === name);

  const addCard = (card) => {
    if (isChosen(card.name)) return;
    if (value.length >= max) return;
    onChange([...value, card]);
    setQuery('');
    setFocusedIdx(0);
    inputRef.current?.focus();
  };

  const removeAt = (idx) => onChange(value.filter((_, i) => i !== idx));

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setFocusedIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' && filtered[focusedIdx]) {
      e.preventDefault();
      addCard(filtered[focusedIdx]);
    } else if (e.key === 'Backspace' && !query && value.length) {
      removeAt(value.length - 1);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="card-picker" ref={wrapRef}>
      <div className="card-picker-input" onClick={() => inputRef.current?.focus()}>
        {value.map((c, i) => (
          <span key={c.name} className="card-chip">
            {thumbs[c.name]
              ? <img className="card-chip-thumb" src={thumbs[c.name]} alt="" />
              : <span className="card-chip-thumb" style={{ background: 'var(--bg-sunken)' }} />}
            <span className="card-chip-name">{c.name}</span>
            <button type="button" className="card-chip-x"
                    onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                    aria-label={`Remove ${c.name}`}>
              <window.I.X />
            </button>
          </span>
        ))}
        {value.length < max && (
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder={value.length === 0 ? placeholder : ''}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusedIdx(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
          />
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="card-picker-popover">
          {filtered.map((c, i) => (
            <CardPickerRow
              key={c.name}
              card={c}
              chosen={isChosen(c.name)}
              focused={i === focusedIdx}
              onMouseEnter={() => setFocusedIdx(i)}
              onClick={() => addCard(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardPickerRow({ card, chosen, focused, onMouseEnter, onClick }) {
  const [thumb, setThumb] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    window.fetchCard(card.name).then((d) => {
      if (alive && d?.art) setThumb(d.art);
    });
    return () => { alive = false; };
  }, [card.name]);
  return (
    <div
      className={`card-picker-row ${focused ? 'focused' : ''}`}
      onMouseEnter={onMouseEnter}
      onClick={chosen ? undefined : onClick}
      style={{ opacity: chosen ? 0.5 : 1, cursor: chosen ? 'default' : 'pointer' }}
    >
      {thumb
        ? <img className="card-picker-thumb" src={thumb} alt="" />
        : <span className="card-picker-thumb" style={{ background: 'var(--bg-sunken)' }} />}
      <div className="card-picker-info">
        <div className="card-picker-name">
          {card.name}
          {chosen && <span style={{ color: 'var(--ink-3)', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>added</span>}
        </div>
        <div className="card-picker-type">{card.type} · {card.set}</div>
      </div>
      <span className="card-picker-mana">{card.mana}</span>
    </div>
  );
}

window.CardPicker = CardPicker;
