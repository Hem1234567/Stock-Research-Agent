import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StockOverview from './components/StockOverview';
import ResearchBriefing from './components/ResearchBriefing';
import SecFilings from './components/SecFilings';
import NewsFeed from './components/NewsFeed';
import RiskAnalysis from './components/RiskAnalysis';
import { fetchStockQuote, fetchStockHistory } from './api/client';
import { Sparkles, FileText, Newspaper, ShieldAlert, BarChart3 } from 'lucide-react';

export default function App() {
  const [ticker, setTicker] = useState('NVDA');
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('briefing'); // briefing, filings, news, risk

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchStockQuote(ticker).catch(() => null),
      fetchStockHistory(ticker).catch(() => [])
    ])
      .then(([q, h]) => {
        setQuote(q);
        setHistory(h || []);
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTicker={ticker} onSelectTicker={(t) => setTicker(t)} />

      <main style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.75rem 1.5rem', flex: 1, display: 'grid', gap: '1.75rem' }}>
        {/* Stock Quote Header & Interactive Price Trajectory */}
        <StockOverview quote={quote} history={history} loading={loading} />

        {/* Tab Selection Bar */}
        <div style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '0.75rem'
        }}>
          {[
            { id: 'briefing', label: 'AI Executive Briefing', icon: Sparkles },
            { id: 'filings', label: 'SEC Filings & In-Filing Search', icon: FileText },
            { id: 'news', label: 'Real-Time News & AI Sentiment', icon: Newspaper },
            { id: 'risk', label: 'Risk Matrix & Governance', icon: ShieldAlert }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                  color: isActive ? '#38bdf8' : '#cbd5e1',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'briefing' && <ResearchBriefing ticker={ticker} />}
          {activeTab === 'filings' && <SecFilings ticker={ticker} />}
          {activeTab === 'news' && <NewsFeed ticker={ticker} />}
          {activeTab === 'risk' && <RiskAnalysis ticker={ticker} />}
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        Stock Research Agent • AI-Powered Equity Analysis • Educational/Informational use only. Not financial investment advice.
      </footer>
    </div>
  );
}
