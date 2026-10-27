const BASE = import.meta.env.BASE_URL;

const FLAGS: Record<string, string> = {
  AUD: `${BASE}AUD.png`,
  BGN: `${BASE}BGN.png`,
  BRL: `${BASE}BRL.png`,
  CAD: `${BASE}CAD.png`,
  CHF: `${BASE}CHF.png`,
  EUR: `${BASE}EUR.png`,
  GBP: `${BASE}GBP.png`,
  JPY: `${BASE}JPY.png`,
};

const BASE_PRICES: Record<string, number> = {
  AUD: 1.4602, BGN: 1.6650, BRL: 5.2443, CAD: 1.3901,
  CHF: 0.7999, EUR: 0.8704, GBP: 0.7556, JPY: 160.28,
};

function generateSeries(code: string, count = 30): number[] {
  const seed = code.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const base = BASE_PRICES[code] ?? 1;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const wave = Math.sin((i + seed) / 4) * base * 0.012;
    const drift = (i / count) * base * 0.04;
    out.push(+(base * 0.96 + drift + wave).toFixed(4));
  }
  return out;
}

interface Props {
  code?: string;
   
}

export function CurrencyChart({ code = 'EUR' }: Props) {
  const W = 350;
  const H = 190;
  const PAD = 8;

  const values = generateSeries(code);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = values.map((v, i) => ({
    x: (i / (values.length - 1)) * W,
    y: H - PAD - ((v - min) / range) * (H - PAD * 2),
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(' ');
  const fillPath = `${linePath} L${W} ${H} L0 ${H} Z`;

  const first = values[0];
  const last = values[values.length - 1];
  const changePct = ((last - first) / first) * 100;
  const positive = changePct > 0;
  const neutral = changePct === 0;
  const accent = neutral ? '#8E93A1' : positive ? '#22B14C' : '#EA3A3A';
  const badgeBg = neutral ? '#F0F1F6' : positive ? '#E0F8E6' : '#FEECEC';

  return (
    <div
      style={{
        width: 420,          
        minWidth: 420,       
        padding: 24,
        background: 'white',
        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.04)',
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div>
        <div
          style={{
            color: '#18184C',
            fontSize: 20,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <img
            src={FLAGS[code] ?? `/${code}.png`}
            alt={code}
            
            style={{ objectFit: 'cover', borderRadius: 3, display: 'block' }}
          />
          <span>/ USD</span>
        </div>
        <div style={{ color: '#8E93A1', fontSize: 13 }}>Monthly dynamics</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: '#18184C', fontSize: 36, fontWeight: 700 }}>
          {last.toFixed(4)}
        </div>
        <div
          style={{
            padding: '5px 10px',
            background: badgeBg,
            borderRadius: 8,
            color: accent,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {neutral ? '•' : positive ? '▲' : '▼'} {positive ? '+' : ''}
          {changePct.toFixed(2)}%
        </div>
      </div>

      <div
        style={{
          height: 200,
          background: neutral ? '#F0F1F6' : positive ? '#F2FCF5' : '#FFF5F5',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          
          style={{ display: 'block' }}
        >
          <path d={fillPath} fill={accent} fillOpacity={0.08} />
          <path
            d={linePath}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {['1W', '1M', '3M', '6M', '1Y'].map((label) => (
          <div
            key={label}
            style={{
              padding: '8px 16px',
              background: label === '1M' ? '#18184C' : '#F0F1F6',
              borderRadius: 10,
              color: label === '1M' ? 'white' : '#8E93A1',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}