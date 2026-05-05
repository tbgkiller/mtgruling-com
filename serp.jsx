// serp.jsx — fake search-results page (the joke entry point)

function SerpPage({ onPickResult }) {
  return (
    <div className="serp">
      <div className="serp-bar">
        <div className="serp-logo">m—search</div>
        <div className="serp-search">
          <span className="serp-search-icon"><window.I.Search /></span>
          <input defaultValue={window.SERP_QUERY} />
        </div>
      </div>
      <div className="serp-tabs">
        <span className="active">All</span>
        <span>Images</span>
        <span>Videos</span>
        <span>News</span>
        <span>Forums</span>
        <span>Shopping</span>
        <span>More</span>
      </div>
      <div className="serp-meta">About 184,000 results (0.42 seconds)</div>

      {/* Images strip — Google-style horizontal card row */}
      <div className="serp-images">
        <div className="serp-images-h">
          <span className="serp-images-title">Images</span>
          <span className="serp-images-sub">· {window.SERP_QUERY}</span>
          <span className="serp-images-more">View all →</span>
        </div>
        <div className="serp-images-row">
          {['Humility', 'Opalescence', 'Opalescence', 'Humility', 'Mycosynth Lattice', 'March of the Machine'].map((n, i) => (
            <div key={i} className="serp-image-card" onClick={() => onPickResult?.()}>
              <window.CardImage name={n} frameStyle="art" size={150} />
              <div className="serp-image-cap">
                <span className="serp-image-name">{n.toLowerCase()} interaction</span>
                <span className="serp-image-host">mtgruling.com</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {window.SERP_RESULTS.slice(0, 2).map((r, i) => (
        <div key={i}
             className={`serp-result ${r.kind === 'us' ? 'us' : ''}`}
             onClick={() => r.kind === 'us' && onPickResult?.()}>
          <div className="serp-result-meta">
            <span className={`serp-result-icon ${r.kind === 'us' ? 'us' : ''}`}>
              {r.kind === 'us' ? (
                <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                  <defs>
                    <linearGradient id={`serpFavGrad-${i}-${r.kind}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4af3ff" />
                      <stop offset="100%" stopColor="#00b8d4" />
                    </linearGradient>
                  </defs>
                  <rect x="1" y="1" width="30" height="30" rx="6" fill={`url(#serpFavGrad-${i}-${r.kind})`} />
                  <path d="M7 23 L7 9 L11.5 9 L16 16 L20.5 9 L25 9 L25 23 L21.5 23 L21.5 14.5 L17.5 21 L14.5 21 L10.5 14.5 L10.5 23 Z" fill="#060d24" />
                </svg>
              ) : r.site[0].toUpperCase()}
            </span>
            <span>
              <div style={{ fontWeight: 500 }}>{r.site}</div>
              <div className="serp-result-url">{r.url}</div>
            </span>
          </div>
          <div className="serp-result-title">{r.title}</div>
          <div className="serp-result-snippet">{r.snippet}</div>
          <div className="serp-result-extra">{r.meta}</div>
        </div>
      ))}

      {/* People also ask */}
      <div className="serp-paa">
        <div className="serp-paa-h">People also ask</div>
        {[
          'Does Humility turn Opalescence into a 1/1?',
          'Why does this interaction make judges visibly tired?',
          'Is mtgruling.com an official source?',
          'Can I sue someone for citing the wrong layer?',
        ].map((q, i) => (
          <details key={i} className="serp-paa-item">
            <summary>{q}<span className="serp-paa-chev">⌄</span></summary>
            <div className="serp-paa-body">
              <p>According to <b>mtgruling.com</b>, the answer is &ldquo;clearly trivial under CR 613.5.&rdquo; <span style={{ color: 'var(--ink-3)' }}>(See ruling MTGR-2026-0114-A)</span></p>
              <a className="serp-paa-link" onClick={() => onPickResult?.()}>mtgruling.com › r/MTGR-2026-0114-A</a>
            </div>
          </details>
        ))}
      </div>

      {window.SERP_RESULTS.slice(2).map((r, i) => (
        <div key={i}
             className={`serp-result ${r.kind === 'us' ? 'us' : ''}`}
             onClick={() => r.kind === 'us' && onPickResult?.()}>
          <div className="serp-result-meta">
            <span className={`serp-result-icon ${r.kind === 'us' ? 'us' : ''}`}>
              {r.kind === 'us' ? (
                <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
                  <defs>
                    <linearGradient id={`serpFavGrad-${i}-${r.kind}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4af3ff" />
                      <stop offset="100%" stopColor="#00b8d4" />
                    </linearGradient>
                  </defs>
                  <rect x="1" y="1" width="30" height="30" rx="6" fill={`url(#serpFavGrad-${i}-${r.kind})`} />
                  <path d="M7 23 L7 9 L11.5 9 L16 16 L20.5 9 L25 9 L25 23 L21.5 23 L21.5 14.5 L17.5 21 L14.5 21 L10.5 14.5 L10.5 23 Z" fill="#060d24" />
                </svg>
              ) : r.site[0].toUpperCase()}
            </span>
            <span>
              <div style={{ fontWeight: 500 }}>{r.site}</div>
              <div className="serp-result-url">{r.url}</div>
            </span>
          </div>
          <div className="serp-result-title">{r.title}</div>
          <div className="serp-result-snippet">{r.snippet}</div>
          <div className="serp-result-extra">{r.meta}</div>
        </div>
      ))}

      <div style={{ marginTop: 28, padding: 16, fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
        Page 1 of about 18,400 · <span style={{ color: 'var(--accent)' }}>Next ›</span>
      </div>

      <div style={{ marginTop: 36, padding: 14, background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)',
                    fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
        <b style={{ color: 'var(--ink-2)' }}>Try it:</b> click the top result to enter mtgruling.com
      </div>
    </div>
  );
}

window.SerpPage = SerpPage;
