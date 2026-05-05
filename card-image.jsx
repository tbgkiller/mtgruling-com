// card-image.jsx — fetches real Magic card artwork from the Scryfall public API
// (free for use by Magic software per their stated terms). Caches lookups in
// memory + sessionStorage so a page never refetches the same card.

const __cardCache = (() => {
  try {
    const raw = sessionStorage.getItem('mtgr.cardCache');
    if (raw) return JSON.parse(raw);
  } catch (e) { /* noop */ }
  return {};
})();

function persistCache() {
  try { sessionStorage.setItem('mtgr.cardCache', JSON.stringify(__cardCache)); } catch (e) {}
}

async function fetchCard(name) {
  if (__cardCache[name]) return __cardCache[name];
  try {
    const r = await fetch(
      `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`
    );
    if (!r.ok) throw new Error('not found');
    const json = await r.json();
    const data = {
      name: json.name,
      setName: json.set_name,
      typeLine: json.type_line,
      manaCost: json.mana_cost,
      oracle: json.oracle_text,
      img: json.image_uris?.normal || json.image_uris?.large
        || json.card_faces?.[0]?.image_uris?.normal,
      art: json.image_uris?.art_crop || json.card_faces?.[0]?.image_uris?.art_crop,
      scryfallUrl: json.scryfall_uri,
    };
    __cardCache[name] = data;
    persistCache();
    return data;
  } catch (e) {
    return null;
  }
}

// Frame styles: 'photo' (just the image), 'framed' (subtle border + shadow),
// 'clipped' (rounded mtg-shaped silhouette), 'art' (art-crop only, square-ish).
function CardImage({ name, frameStyle = 'framed', size = 220, onClick, label, className }) {
  const [data, setData] = React.useState(__cardCache[name] || null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    if (!data) {
      fetchCard(name).then((d) => { if (alive) setData(d); });
    }
    return () => { alive = false; };
  }, [name]);

  const aspect = frameStyle === 'art' ? 1.36 : 0.717; // art_crop is wider than tall — 1.36; full card is .717
  const w = size;
  const h = frameStyle === 'art' ? Math.round(size * 0.62) : Math.round(size / 0.717);

  const src = data ? (frameStyle === 'art' ? data.art : data.img) : null;

  const wrapClass = ['mtgr-card', `mtgr-frame-${frameStyle}`, className].filter(Boolean).join(' ');
  return (
    <div
      className={wrapClass}
      onClick={onClick}
      style={{ width: w, height: h, cursor: onClick ? 'pointer' : 'default' }}
      title={data?.name || name}
    >
      {!src && (
        <div className="mtgr-card-skeleton">
          <div className="mtgr-card-skel-shimmer" />
          <span className="mtgr-card-skel-label">{name}</span>
        </div>
      )}
      {src && (
        <img
          src={src}
          alt={data?.name || name}
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {label && data && <div className="mtgr-card-label">{label}</div>}
    </div>
  );
}

window.CardImage = CardImage;
window.fetchCard = fetchCard;
