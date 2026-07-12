import React, { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { fetchStockNews } from '../api/client';

export default function NewsFeed({ ticker }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStockNews(ticker)
      .then(setArticles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) {
    return <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>Loading financial news feed and AI sentiment tags...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Newspaper size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Real-Time News & AI Sentiment</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Latest financial press disclosures analyzed for market sentiment.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {articles.map((art, i) => {
          const isBullish = art.sentiment === 'Bullish';
          const isBearish = art.sentiment === 'Bearish';
          return (
            <div key={i} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{art.source}</span>
                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: isBullish ? 'rgba(16, 185, 129, 0.15)' : isBearish ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isBullish ? '#10b981' : isBearish ? '#f43f5e' : '#f59e0b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}>
                    {isBullish ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {art.sentiment}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 600, marginBottom: '0.6rem', lineHeight: '1.45' }}>
                  {art.title}
                </h4>

                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.55', marginBottom: '1rem' }}>
                  {art.summary}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', fontSize: '0.78rem', color: '#64748b' }}>
                <span>{art.published_at}</span>
                <a href={art.url} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                  Read article <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
