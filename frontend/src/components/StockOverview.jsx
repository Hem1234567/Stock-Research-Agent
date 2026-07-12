import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2, ShieldCheck, Layers } from 'lucide-react';

export default function StockOverview({ quote, history, loading }) {
  const [timeframe, setTimeframe] = useState('1M');

  if (loading || !quote) {
    return (
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading live equity quote and price series...
      </div>
    );
  }

  const isPositive = quote.change >= 0;

  // Simple SVG chart generation from history points
  const points = history && history.length > 0 ? history : [
    { date: 'Day 1', close: quote.price * 0.94 },
    { date: 'Day 2', close: quote.price * 0.96 },
    { date: 'Day 3', close: quote.price * 0.95 },
    { date: 'Day 4', close: quote.price * 0.98 },
    { date: 'Day 5', close: quote.price * 0.97 },
    { date: 'Day 6', close: quote.price * 0.99 },
    { date: 'Today', close: quote.price }
  ];

  const minPrice = Math.min(...points.map(p => p.close)) * 0.99;
  const maxPrice = Math.max(...points.map(p => p.close)) * 1.01;
  const range = (maxPrice - minPrice) || 1;

  const svgWidth = 700;
  const svgHeight = 180;
  const stepX = svgWidth / Math.max(1, points.length - 1);

  const coords = points.map((p, idx) => {
    const x = idx * stepX;
    const y = svgHeight - ((p.close - minPrice) / range) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}>{quote.ticker}</span>
            <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>{quote.name}</span>
            <span className="glass-pill">{quote.sector || 'Equities'}</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '650px' }}>{quote.description}</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
            ${quote.price.toFixed(2)}
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '999px',
            background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            color: isPositive ? '#10b981' : '#f43f5e',
            fontWeight: 600,
            fontSize: '0.9rem',
            marginTop: '0.25rem'
          }}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.change_percent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>MARKET CAP</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{quote.market_cap}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>P/E RATIO</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{quote.pe_ratio || 'N/A'}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>52-WEEK HIGH</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>${quote.fifty_two_week_high.toFixed(2)}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>52-WEEK LOW</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f43f5e' }}>${quote.fifty_two_week_low.toFixed(2)}</div>
        </div>
        <div className="glass-card" style={{ padding: '1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.35rem' }}>DAILY VOLUME</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{(quote.volume / 1000000).toFixed(2)}M</div>
        </div>
      </div>

      {/* Price Chart Container */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Historical Price Trajectory</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {['1W', '1M', '3M', '1Y'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${timeframe === tf ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: timeframe === tf ? '#38bdf8' : '#94a3b8',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '180px' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#chartGradient)" />
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            {points.map((p, idx) => {
              const x = idx * stepX;
              const y = svgHeight - ((p.close - minPrice) / range) * (svgHeight - 20) - 10;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="3.5" fill="#38bdf8" />
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          <span>{points[0]?.date}</span>
          <span>{points[Math.floor(points.length / 2)]?.date}</span>
          <span>{points[points.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
