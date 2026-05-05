// donation-tiers.jsx — Humble Bundle-style donation slider with MTG-themed
// "mana" credits in place of dollars. 1 mana = 1 unit of donation.

const TIERS = [
  {
    min: 1,
    name: 'Pay what you want',
    blurb: 'Your ruling exists on the internet. That is the gift.',
    perks: [
      'Ruling published with your username',
      'Standard upvote/downvote eligibility',
      'A warm feeling',
    ],
    accent: '#6f6a55',
  },
  {
    min: 5,
    name: 'Common',
    blurb: 'Everything in PWYW, plus:',
    perks: [
      'Subtle "Patron" flair on your ruling',
      '1 free comment pin per week',
      'Reviewed by a community judge within 7 days',
    ],
    accent: '#5d6d4a',
  },
  {
    min: 15,
    name: 'Uncommon',
    blurb: 'Everything in Common, plus:',
    perks: [
      '"Patronized" tag on your ruling (the tasteful one)',
      'Top placement until counterspelled',
      'Edit your own ruling for 30 days',
      'A custom title for your patron card',
    ],
    accent: '#3d6e8c',
    popular: true,
  },
  {
    min: 50,
    name: 'Rare',
    blurb: 'Everything in Uncommon, plus:',
    perks: [
      'Featured on the homepage for 24h',
      'Auto-rebut any comment with a Level 1 Judge\u2019s name',
      'Submit a "contradicting ruling" attached to up to 3 rivals',
      'One (1) judicial intern\u2019s sincere acknowledgment',
    ],
    accent: '#7a4a14',
  },
  {
    min: 200,
    name: 'Mythic',
    blurb: 'Everything in Rare, plus:',
    perks: [
      'Permanent placement \u2014 cannot be counterspelled for 90 days',
      '"Cited by mtgruling.com" press kit (PDF + sticker)',
      'A dedicated cease-and-desist letter we will not actually send',
      'Naming rights to one (1) made-up rules layer',
    ],
    accent: '#8a3a14',
  },
  {
    min: 1000,
    name: 'Power Nine',
    blurb: 'For the discerning litigant.',
    perks: [
      'Lifetime patronage across ALL rulings featuring these cards',
      'Personalized rules-text replacement on the card image',
      'Your face appears in the rail next to the ruling',
      'A handwritten note from someone claiming to be Mark Rosewater',
    ],
    accent: '#5b1c8c',
  },
];

// Find current tier for a given amount of mana.
function tierFor(amount) {
  let active = TIERS[0];
  for (const t of TIERS) if (amount >= t.min) active = t;
  return active;
}

function DonationSlider({ value, onChange, min = 1, max = 1500 }) {
  const active = tierFor(value);
  const pct = Math.min(100, Math.max(0, (Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min)) * 100));

  const handleSlider = (e) => {
    const p = Number(e.target.value) / 100;
    const v = Math.round(Math.exp(Math.log(min) + p * (Math.log(max) - Math.log(min))));
    onChange(v);
  };
  const sliderPct = ((Math.log(value) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100;

  return (
    <div className="donation-wrap">
      {/* Big amount + tier */}
      <div className="donation-head">
        <div className="donation-amount">
          <span className="donation-currency"><window.ManaSymbol size={28} /></span>
          <input
            type="number"
            min={1}
            value={value}
            onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          />
          <span className="donation-currency-suffix">mana</span>
        </div>
        <div className="donation-tier" style={{ color: active.accent }}>
          <div className="donation-tier-name">{active.name}</div>
          <div className="donation-tier-blurb">{active.blurb}</div>
        </div>
      </div>

      {/* Slider */}
      <div className="donation-track-wrap">
        <input
          type="range"
          min={0} max={100} step={0.1}
          value={sliderPct}
          onChange={handleSlider}
          className="donation-slider"
        />
        <div className="donation-fills">
          <div className="donation-fill" style={{ width: pct + '%', background: active.accent }} />
        </div>
        <div className="donation-ticks">
          {TIERS.map((t) => {
            const tickPct = (Math.log(t.min) - Math.log(min)) / (Math.log(max) - Math.log(min)) * 100;
            const reached = value >= t.min;
            return (
              <div key={t.min} className={`donation-tick ${reached ? 'reached' : ''}`}
                   style={{ left: tickPct + '%', borderColor: reached ? t.accent : 'var(--rule)' }}
                   onClick={() => onChange(t.min)}
                   title={`${t.name} \u2014 ${t.min} mana`}>
                <span className="donation-tick-dot" style={{ background: reached ? t.accent : 'var(--bg)' }} />
                <span className="donation-tick-label"><window.Mana n={t.min} size={10} /></span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick presets */}
      <div className="donation-presets">
        {[5, 15, 50, 200, 1000].map((v) => (
          <button key={v} type="button"
                  className={value >= v && (TIERS.find((t) => t.min === v)) ? 'active' : ''}
                  onClick={() => onChange(v)}>
            <window.Mana n={v} size={13} />
            <span>{TIERS.find((t) => t.min === v)?.name}</span>
          </button>
        ))}
      </div>

      {/* Unlocks list */}
      <div className="donation-unlocks">
        {TIERS.map((t) => {
          const reached = value >= t.min;
          return (
            <div key={t.min} className={`donation-tier-card ${reached ? 'unlocked' : 'locked'} ${t.popular ? 'popular' : ''}`}>
              <div className="donation-tier-card-h">
                <span className="donation-tier-card-name" style={{ color: reached ? t.accent : 'var(--ink-3)' }}>
                  {t.name}
                </span>
                <span className="donation-tier-card-price" style={{ color: reached ? 'var(--ink)' : 'var(--ink-3)' }}>
                  <window.Mana n={t.min} size={12} />+
                </span>
                {t.popular && <span className="donation-tier-card-popular">most popular</span>}
                {reached && <span className="donation-tier-card-check"><window.I.Check /></span>}
              </div>
              <ul className="donation-tier-perks">
                {t.perks.map((p, i) => (
                  <li key={i} style={{ opacity: reached ? 1 : 0.55 }}>
                    <span className="donation-perk-bullet" style={{ background: reached ? t.accent : 'var(--rule)' }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="donation-fine">
        Mana is non-refundable, non-transferable, and conjures into existence at checkout. By contributing you agree it is being &ldquo;tapped&rdquo; in the colloquial sense and not tax-deductible.
      </p>
    </div>
  );
}

window.TIERS = TIERS;
window.tierFor = tierFor;
window.DonationSlider = DonationSlider;
