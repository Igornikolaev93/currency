import { useEffect, useState } from 'react';

interface RateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

interface CurrencyRow {
  flag: string;
  code: string;
  surrender: number;
  buy: number;
  course: number;
  change: number;
  time: string;
}

const CURRENCIES = [
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'BGN', flag: '🇧🇬' },
  { code: 'BRL', flag: '🇧🇷' },
  { code: 'CAD', flag: '🇨🇦' },
  { code: 'CHF', flag: '🇨🇭' },
  { code: 'EUR', flag: '🇪🇺' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'JPY', flag: '🇯🇵' },
];

export function RatesTable() {
  const [rows, setRows] = useState<CurrencyRow[]>([]);
  const [dateLabel, setDateLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD', {
          signal: controller.signal,
        });
        const data: RateResponse = await res.json();

        if (data.result !== 'success') {
          throw new Error('API returned error');
        }

        const updateTime = new Date(data.time_last_update_utc);
        setDateLabel(
          updateTime.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        );

        const timeStr = updateTime.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const nextRows = CURRENCIES.map(({ code, flag }) => {
          const course = data.rates[code] ?? 0;
          // Банковский spread: surrender (покупка банком) ниже, buy (продажа) выше
          const surrender = +(course * 0.98).toFixed(4);
          const buy = +(course * 1.02).toFixed(4);
          return { flag, code, surrender, buy, course, change: 0, time: timeStr };
        });

        setRows(nextRows);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 20,
        boxShadow: '0px 2px 12px rgba(0,0,0,0.04)',
        padding: '4px 20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          padding: 12,
          color: '#8E93A1',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {['Currency', 'Surrender', 'Buy', 'Course', 'Change', 'Time'].map((h) => (
          <div key={h} style={{ flex: 1 }}>
            {h}
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ padding: 24, color: '#8E93A1', textAlign: 'center' }}>
          Loading rates…
        </div>
      )}

      {error && (
        <div style={{ padding: 24, color: '#EA3A3A', textAlign: 'center' }}>
          Failed to load rates: {error}
        </div>
      )}

      {!loading &&
        !error &&
        rows.map((r, index) => (
          <div key={r.code}>
            <div style={{ height: 1, background: '#E3E4EA' }} />
            <div
              style={{
                display: 'flex',
                padding: '16px 12px',
                fontSize: 14,
                color: '#18184C',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ flex: 1 }}>
                {r.flag} {r.code}
              </div>
              <div style={{ flex: 1 }}>{r.surrender.toFixed(4)}</div>
              <div style={{ flex: 1 }}>{r.buy.toFixed(4)}</div>
              <div style={{ flex: 1 }}>{r.course.toFixed(4)}</div>
              <div style={{ flex: 1 }}>{r.change.toFixed(4)}</div>
              <div style={{ flex: 1 }}>{r.time}</div>
            </div>
            {index === rows.length - 1 && (
              <div style={{ height: 1, background: '#E3E4EA' }} />
            )}
          </div>
        ))}
    </div>
  );
}