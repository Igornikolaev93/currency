import {  useRef, useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { CurrencyTable } from './CurrencyTable';
import { CurrencyChart } from './CurrencyChart';

export function DashboardPage() {
  //const [selectedCode, setSelectedCode] = useState('EUR');

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const prevCodeRef = useRef<string | null>(null);

  useEffect(() => {
  if (!selectedCode) return;

  const handlePointerDown = (e: PointerEvent) => {
    if (!chartRef.current) return;
    if (!chartRef.current.contains(e.target as Node)) {
      setSelectedCode(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setSelectedCode(null);
  };

  document.addEventListener('pointerdown', handlePointerDown);
  document.addEventListener('keydown', handleKeyDown);
  return () => {
    document.removeEventListener('pointerdown', handlePointerDown);
    document.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedCode]);

useEffect(() => {
  if (prevCodeRef.current && selectedCode) {
    setIsSwitching(true);
    const t = setTimeout(() => setIsSwitching(false), 50);
    prevCodeRef.current = selectedCode;
    return () => clearTimeout(t);
  }
  prevCodeRef.current = selectedCode;
}, [selectedCode]);

const toggle = (code: string) => {
  setSelectedCode((prev) => (prev === code ? null : code));
};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EFEFF4' }}>
      <Sidebar activeItem="rates" />
      <main  className="dashboard-main"
        style={{
          flex: 1,
          minWidth: 0,
          padding: '28px 36px',
          background: '#F9F9FD',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          overflow: 'visible',
        }}
      >
       <CurrencyTable onSelect={toggle} selectedCode={selectedCode} />
     <div
      style={{
        width: selectedCode ? 420 : 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
  <div
    ref={chartRef}
    style={{
      width: 420,
      opacity: selectedCode ? 1 : 0,
      transform: selectedCode ? 'translateX(0)' : 'translateX(24px)',
      transition: isSwitching? 'none': 'opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'opacity, transform',
    }}
  >
    {selectedCode && <CurrencyChart key={selectedCode} code={selectedCode} />}
  </div>
</div>

      </main>
    </div>
  );
}