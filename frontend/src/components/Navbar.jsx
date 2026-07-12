import React, { useState } from 'react';
import { Search, Activity, Cpu, Sparkles, Terminal } from 'lucide-react';

const POPULAR_TICKERS = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'AMZN'];

export default function Navbar({ activeTicker, onSelectTicker }) {
  const [inputVal, setInputVal] = useState(activeTicker);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSelectTicker(inputVal.trim().toUpperCase());
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Stock Research Agent
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Institutional AI Equity Research Terminal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 300px', maxWidth: '420px' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g. NVDA, AAPL)"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '0.55rem 0.85rem 0.55rem 2.25rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
          </div>
          <button type="submit" className="btn-primary">
            Analyze
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {POPULAR_TICKERS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setInputVal(t);
                onSelectTicker(t);
              }}
              style={{
                background: activeTicker === t ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${activeTicker === t ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                color: activeTicker === t ? '#38bdf8' : '#cbd5e1',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {t}
            </button>
          ))}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginLeft: '0.5rem',
            padding: '0.35rem 0.7rem',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem',
            color: '#10b981'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block'
            }} className="animate-pulse-subtle" />
            Live Gateway
          </div>
        </div>
      </div>
    </header>
  );
}
