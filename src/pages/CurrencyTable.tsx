interface CurrencyRow {
  flag: string;
  code: string;
  surrender: string;
  buy: string;
  course: string;
  change: string;
 
}

const BASE = import.meta.env.BASE_URL;

const ROWS: CurrencyRow[] = [
  { flag: `${BASE}AUD.png`, code: 'AUD', surrender: '1.4894', buy: '1.4383', course: '1.4602', change: '0.0000' },
  { flag: `${BASE}BGN.png`, code: 'BGN', surrender: '1.6983', buy: '1.6400', course: '1.6650', change: '0.0000' },
  { flag: `${BASE}BRL.png`, code: 'BRL', surrender: '5.3492', buy: '5.1656', course: '5.2443', change: '0.0000' },
  { flag: `${BASE}CAD.png`, code: 'CAD', surrender: '1.4179', buy: '1.3693', course: '1.3901', change: '0.0000' },
  { flag: `${BASE}CHF.png`, code: 'CHF', surrender: '0.8159', buy: '0.7879', course: '0.7999', change: '0.0000' },
  { flag: `${BASE}EUR.png`, code: 'EUR', surrender: '0.8878', buy: '0.8573', course: '0.8704', change: '0.0000' },
  { flag: `${BASE}GBP.png`, code: 'GBP', surrender: '0.7707', buy: '0.7442', course: '0.7556', change: '0.0000' },
  { flag: `${BASE}JPY.png`, code: 'JPY', surrender: '163.4887', buy: '157.8788', course: '160.2830', change: '0.0000' },
];

const HEADERS = ['Currency', 'Surrender', 'Buy', 'Course', 'Change', 'Time'];

interface Props {
  onSelect: (code: string) => void;
  selectedCode: string | null;
}

export function CurrencyTable({ onSelect, selectedCode }: Props) {
  const now = new Date();
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const currentTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Заголовок + дата */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#18184C', fontSize: 26, fontWeight: 700 }}>
          Exchange rates
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: '7px 14px',
            background: '#E7EEFF',
            borderRadius: 10,
            color: '#2563EB',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {today}
        </div>
      </div>

      {/* Таблица */}
      <div
        style={{
          background: 'white',
          boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.04)',
          borderRadius: 20,
          padding: '4px 20px',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', padding: 12, alignItems: 'center' }}>
          {HEADERS.map((h) => (
            <div
              key={h}
              style={{
                flex: 1,
                color: '#8E93A1',
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {ROWS.map((r) => {
          const active = r.code === selectedCode;
          const cellStyle: React.CSSProperties = {
            flex: 1,
            color: '#18184C',
            fontSize: 14,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          };
          return (
            <div key={r.code}>
              <div style={{ height: 1, background: '#E3E4EA' }} />
              <div
                onClick={() => onSelect(r.code)}
                style={{
                  display: 'flex',
                  padding: '16px 12px',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: active ? '#e7eeff' : 'transparent',                 
                  borderRadius: active ? 12 : 0,
                  fontWeight: active ? 600 : 400,
                  transition: 'background 0.15s ease',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    ...cellStyle,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={r.flag}
                    alt={r.code}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 3,
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div style={cellStyle}>{r.surrender}</div>
                <div style={cellStyle}>{r.buy}</div>
                <div style={cellStyle}>{r.course}</div>
                <div style={cellStyle}>{r.change}</div>
                <div style={cellStyle}>{currentTime}</div>
              </div>
            </div>
          );
        })}
        <div style={{ height: 1, background: '#E3E4EA' }} />
      </div>
    </div>
  );
}