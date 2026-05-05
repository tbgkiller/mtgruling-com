// mana.jsx — MTG-flavored "credits" formatting. We display amounts as mana
// (1 mana = 1 unit of donation). Renders a small white-mana-style symbol
// followed by the amount, e.g. ⓦ12 or {12}, so the joke is visually obvious.

function ManaSymbol({ size = 14 }) {
  // White-mana glyph: a sun-like circle. Stroke + fill subtle so it works on
  // both light and dark themes via currentColor.
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true"
         style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: 3 }}>
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.12" />
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M8 3.2v1.6M8 11.2v1.6M3.2 8h1.6M11.2 8h1.6M4.5 4.5l1.1 1.1M10.4 10.4l1.1 1.1M4.5 11.5l1.1-1.1M10.4 5.6l1.1-1.1"
            stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

// Format an amount as a mana cost. Returns a span containing the symbol +
// number. `inline` keeps it consistent with surrounding text.
function Mana({ n, size = 14, className = '' }) {
  return (
    <span className={`mana ${className}`} style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
      <ManaSymbol size={size} />{n}
    </span>
  );
}

// Helper for plain-text contexts (tooltips, placeholders): "{12} mana"
function manaText(n) { return `{${n}} mana`; }

window.ManaSymbol = ManaSymbol;
window.Mana = Mana;
window.manaText = manaText;
