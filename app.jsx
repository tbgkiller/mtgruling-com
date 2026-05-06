// app.jsx — top-level shell. Routes between SERP and ruling page, owns
// global state (theme, density, accent, card frame, toasts, modals).

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "density": "regular",
  "cardFrame": "framed",
  "accent": "#9b1c1c",
  "showSerp": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = React.useState(t.showSerp ? 'serp' : 'ruling');
  const [createOpen, setCreateOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  // when tweak toggles, reset view
  React.useEffect(() => {
    setView(t.showSerp ? 'serp' : 'ruling');
  }, [t.showSerp]);

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(null), 2400);
  };

  // Apply theme/density/frame/accent via root data-attrs + CSS var
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    root.setAttribute('data-density', t.density);
    root.setAttribute('data-card-frame', t.cardFrame);
    root.style.setProperty('--accent', t.accent);
    // pick a contrasting ink for the accent (light text always readable on our dark accents)
    root.style.setProperty('--accent-ink', '#ffffff');
    // recompute tint
    root.style.setProperty('--accent-tint',
      t.dark ? `color-mix(in oklch, ${t.accent} 22%, #15140f)`
             : `color-mix(in oklch, ${t.accent} 8%, #fbfaf6)`);
  }, [t.dark, t.density, t.cardFrame, t.accent]);

  const ruling = window.RULINGS_DB[0];

  // wire CardImage frame style from tweak
  const CardImageWithFrame = (props) => <window.CardImage {...props} frameStyle={t.cardFrame} />;
  // monkey-patch so RulingPage uses tweak frame
  React.useEffect(() => {
    window.CardImage._origFrame = window.CardImage._origFrame || ((p) => p.frameStyle);
  }, []);

  return (
    <div className="app-shell">
      {view === 'serp' ? (
        <SerpView onPickResult={() => setView('ruling')} setTweak={setTweak} />
      ) : (
        <RulingView
          ruling={ruling}
          frameStyle={t.cardFrame}
          onBackToSerp={() => setView('serp')}
          onCreate={() => setCreateOpen(true)}
          showToast={showToast}
        />
      )}

      {createOpen && (
        <window.CreateRulingModal
          onClose={() => setCreateOpen(false)}
          onSubmit={() => showToast('Ruling published! (No mana actually tapped.)')}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Theme" />
        <window.TweakToggle  label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />
        <window.TweakColor   label="Accent color" value={t.accent} onChange={(v) => setTweak('accent', v)} />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {['#9b1c1c','#1f5d8c','#2f6e3a','#8a4a14','#5b3a8c','#1d1b14'].map((c) => (
            <button key={c}
              onClick={() => setTweak('accent', c)}
              style={{
                width: 22, height: 22, borderRadius: '50%', background: c,
                border: t.accent === c ? '2px solid var(--ink)' : '2px solid var(--rule)',
                cursor: 'pointer', padding: 0,
              }}
              aria-label={`Accent ${c}`} />
          ))}
        </div>

        <window.TweakSection label="Layout" />
        <window.TweakRadio label="Density" value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)} />
        <window.TweakRadio label="Card frame" value={t.cardFrame}
          options={[
            { value: 'photo', label: 'Photo' },
            { value: 'framed', label: 'Framed' },
            { value: 'art', label: 'Art only' },
          ]}
          onChange={(v) => setTweak('cardFrame', v)} />

        <window.TweakSection label="Demo" />
        <window.TweakToggle label="Show search entry" value={t.showSerp} onChange={(v) => setTweak('showSerp', v)} />
        <window.TweakButton label="Open create-ruling flow" onClick={() => setCreateOpen(true)} />
      </window.TweaksPanel>
    </div>
  );
}

// ── SERP view ─────────────────────────────────────────────────────────────
function SerpView({ onPickResult, setTweak }) {
  return (
    <>
      <div style={{
        position: 'fixed', top: 12, right: 12, zIndex: 60,
        fontSize: 11, color: 'var(--ink-3)', background: 'var(--bg-elev)',
        border: '1px solid var(--rule)', borderRadius: 999, padding: '4px 10px',
      }}>
        DEMO: search-results landing
      </div>
      <window.SerpPage onPickResult={onPickResult} />
    </>
  );
}

// ── Ruling view (full nav + footer) ───────────────────────────────────────
function RulingView({ ruling, frameStyle, onBackToSerp, onCreate, showToast }) {
  const [manaShopOpen, setManaShopOpen] = React.useState(false);
  const [balance, setBalance] = React.useState(47);
  // re-export CardImage with bound frame so RulingPage doesn't need to know
  React.useEffect(() => {
    if (window.__origCardImage) return;
    window.__origCardImage = window.CardImage;
  }, []);
  // Monkey-patch CardImage to inject frame from tweak
  const OrigCardImage = window.__origCardImage || window.CardImage;
  window.CardImage = (props) => <OrigCardImage {...props} frameStyle={props.frameStyle || frameStyle} />;

  return (
    <>
      <header className="topnav">
        <div className="container topnav-inner">
          <div className="brand" onClick={onBackToSerp} title="Back to search">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="32" height="32">
                <defs>
                  <linearGradient id="brandMarkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4af3ff" />
                    <stop offset="100%" stopColor="#00b8d4" />
                  </linearGradient>
                </defs>
                <rect x="1" y="1" width="30" height="30" rx="6" fill="url(#brandMarkGrad)" />
                <rect x="1.5" y="1.5" width="29" height="29" rx="5.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                {/* stylized M — three peaks, gavel-like */}
                <path
                  d="M7 23 L7 9 L11.5 9 L16 16 L20.5 9 L25 9 L25 23 L21.5 23 L21.5 14.5 L17.5 21 L14.5 21 L10.5 14.5 L10.5 23 Z"
                  fill="#060d24"
                />
                {/* live dot */}
                <circle cx="25.5" cy="6.5" r="2.5" fill="#ff2e7e">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
                </circle>
              </svg>
            </span>
            <span className="brand-word">
              <span className="brand-word-main">MTGRULING</span><span className="brand-tld">.com</span>
              <span className="brand-tagline">TONIGHT</span>
            </span>
          </div>
          <window.NavSearch
            onPickCard={() => showToast('Card lookup coming soon')}
            onPickRuling={() => showToast('Already viewing this ruling')}
          />
          <button className="btn primary" onClick={onCreate}>
            <window.I.Plus /> File a ruling
          </button>
          <button
            className="mana-balance"
            onClick={() => setManaShopOpen(true)}
            title="Your mana balance — click to top up"
          >
            <span className="mana-balance-amt">
              <window.ManaSymbol size={14} />
              <span className="mana-balance-num">{balance}</span>
            </span>
            <span className="mana-balance-divider" />
            <span className="mana-balance-cta">
              <window.I.Plus /> Get more
            </span>
          </button>
          <div className="avatar" title="you">U</div>
        </div>
      </header>

      <window.RulingPage
        ruling={ruling}
        onCreateClick={onCreate}
        onShowToast={showToast}
      />

      <footer className="footer">
        <div className="container">
          <div className="footer-cols">
            <div>
              <div className="footer-h">mtgruling.com</div>
              <a>About</a>
              <a>How rulings work</a>
              <a>Sponsorship FAQ</a>
              <a>Press kit</a>
              <a>Status</a>
            </div>
            <div>
              <div className="footer-h">Browse</div>
              <a>Top rulings of all time</a>
              <a>Newly sponsored</a>
              <a>Most overturned</a>
              <a>Judge favorites</a>
              <a>Vintage corner</a>
            </div>
            <div>
              <div className="footer-h">For sponsors</div>
              <a>Pricing</a>
              <a>Bulk ruling discount</a>
              <a>Premium placement</a>
              <a>Outranked notifications</a>
              <a>Mana refund policy*</a>
            </div>
            <div>
              <div className="footer-h">Legal</div>
              <a>Terms (mana-tapped edits 4× more binding)</a>
              <a>Privacy</a>
              <a>Disclaimer (we are not Wizards)</a>
              <a>DMCA</a>
              <a>Contact</a>
            </div>
          </div>
          <div className="footer-fine">
            <span>© 2026 Community Rulings Authority, LLC. Card data via Scryfall. Magic: The Gathering is a trademark of Wizards of the Coast.</span>
            <span>This site is a parody. Probably.</span>
          </div>
        </div>
      </footer>
      {manaShopOpen && (
        <window.ManaShopModal
          balance={balance}
          onClose={() => setManaShopOpen(false)}
          onPurchase={(addedMana) => {
            setBalance((b) => b + addedMana);
            setManaShopOpen(false);
            showToast(`+${addedMana} mana conjured into existence.`);
          }}
        />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
