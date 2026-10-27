import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

const BASE = import.meta.env.BASE_URL;

const CURRENCIES: { code: string; flag: string }[] = [
  { code: 'AUD', flag: `${BASE}AUD.png` },
  { code: 'BGN', flag: `${BASE}BGN.png` },
  { code: 'BRL', flag: `${BASE}BRL.png` },
  { code: 'CAD', flag: `${BASE}CAD.png` },
  { code: 'CHF', flag: `${BASE}CHF.png` },
  { code: 'EUR', flag: `${BASE}EUR.png` },
  { code: 'GBP', flag: `${BASE}GBP.png` },
  { code: 'JPY', flag: `${BASE}JPY.png` },
];

export function CurrenciesPage() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<CurrencyRow[]>([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD', {
          signal: controller.signal,
        });
        const data: RateResponse = await res.json();

        if (data.result !== 'success') throw new Error('API error');

        const lastUpdate = data.time_last_update_utc;
        const timeStr = new Date(lastUpdate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setDate(
          new Date(lastUpdate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        );

        const usdRates = data.rates;
        const next: CurrencyRow[] = CURRENCIES.map(({ code, flag }) => {
          const rate = usdRates[code] ?? 0;
          const course = rate;
          // Имитация spread: surrender/buy — course ± 2%
          const surrender = +(course * 0.98).toFixed(4);
          const buy = +(course * 1.02).toFixed(4);
          return { flag, code, surrender, buy, course, change: 0, time: timeStr };
        });

        setRows(next);
      } catch {
        // fallback — оставляем пустым или можно показать ошибку
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EFEFF4' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 72,
          background: 'white',
          boxShadow: '2px 0px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 10px',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 24, height: 44, display: 'flex', alignItems: 'center' }}>💰</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: '100%',
            padding: '10px 0',
            background: '#E7EEFF',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 22 }}>💱</div>
          <div style={{ color: '#2563EB', fontSize: 10, fontWeight: 600 }}>Rates</div>
        </div>
        <div
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <div style={{ fontSize: 22 }}>📋</div>
          <div style={{ color: '#8E93A1', fontSize: 10, fontWeight: 500 }}>Cards</div>
        </div>
        <div style={{ flex: 1 }} />
        <div
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 18 }}>🚪</div>
          <div style={{ color: '#8E93A1', fontSize: 10, fontWeight: 500 }}>Logout</div>
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: '28px 36px',
          background: '#F9F9FD',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ color: '#18184C', fontSize: 26, fontWeight: 700, margin: 0 }}>
            Exchange rates
          </h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: '7px 14px',
              background: '#E7EEFF',
              borderRadius: 10,
              color: '#2563EB',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {date || '—'}
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 20,
            boxShadow: '0px 2px 12px rgba(0,0,0,0.04)',
            padding: '4px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: 12,
              color: '#8E93A1',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {['Currency', 'Surrender', 'Buy', 'Course', 'Change', 'Time'].map((h) => (
              <div key={h} style={{ flex: 1 }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: 24, color: '#8E93A1', textAlign: 'center' }}>
              Loading rates…
            </div>
          ) : (
            rows.map((r, i) => (
              <div key={r.code}>
                <div style={{ height: 1, background: '#E3E4EA' }} />
                <div style={{ display: 'flex', padding: '16px 12px', fontSize: 14, color: '#18184C' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img
                    src={r.flag}
                    alt={r.code}
                    width={22}
                    height={16}
                    style={{ objectFit: 'cover', borderRadius: 3, display: 'block' }}
                  />
                  <span>{r.code}</span>
                </div>
                  <div style={{ flex: 1 }}>{r.surrender.toFixed(4)}</div>
                  <div style={{ flex: 1 }}>{r.buy.toFixed(4)}</div>
                  <div style={{ flex: 1 }}>{r.course.toFixed(4)}</div>
                  <div style={{ flex: 1 }}>{r.change.toFixed(4)}</div>
                  <div style={{ flex: 1 }}>{r.time}</div>
                </div>
                {i === rows.length - 1 && <div style={{ height: 1, background: '#E3E4EA' }} />}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}