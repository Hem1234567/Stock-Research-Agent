import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, RefreshCw, Award, CheckCircle2, AlertTriangle } from 'lucide-react';
import { fetchFullReport } from '../api/client';

export default function ResearchBriefing({ ticker }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetchFullReport(ticker);
      setReport(data);
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [ticker]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <RefreshCw className="animate-pulse-subtle" size={36} color="#38bdf8" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>Synthesizing AI Executive Briefing...</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Aggregating SEC 10-K/10-Q disclosures, Alpha Vantage fundamentals, and financial news sentiment.
        </p>
      </div>
    );
  }

  if (!report) {
    return <div className="glass-card" style={{ padding: '2rem' }}>Failed to generate report.</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {/* Header card */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>AI Executive Research Briefing</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            Comprehensive AI Synthesis for {report.company_name} ({report.ticker})
          </p>
        </div>
        <button onClick={loadReport} className="btn-secondary">
          <RefreshCw size={16} /> Regenerate Report
        </button>
      </div>

      {/* Executive Summary */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.75rem', color: '#38bdf8' }}>Executive Synthesis</h3>
        <p style={{ lineHeight: '1.7', fontSize: '0.96rem', color: '#e2e8f0' }}>
          {report.executive_summary}
        </p>
      </div>

      {/* Bull / Bear Thesis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Bull Thesis */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981' }}>
            <TrendingUp size={20} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Investment Bull Thesis</h4>
          </div>
          <ul style={{ display: 'grid', gap: '0.75rem', listStyle: 'none' }}>
            {report.investment_thesis_bull.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.92rem', color: '#cbd5e1' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bear Thesis */}
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f43f5e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f43f5e' }}>
            <TrendingDown size={20} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Investment Bear Thesis & Headwinds</h4>
          </div>
          <ul style={{ display: 'grid', gap: '0.75rem', listStyle: 'none' }}>
            {report.investment_thesis_bear.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.92rem', color: '#cbd5e1' }}>
                <AlertTriangle size={16} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendation and Sentiment Context */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ flex: '1 1 350px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.3rem' }}>AI SENTIMENT & CONVICTION</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.4rem' }}>
            {report.ai_recommendation_context}
          </div>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
            {report.news_sentiment_overview}
          </p>
        </div>
        <div style={{
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem' }}>OVERALL SENTIMENT</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
            {report.overall_sentiment_score.toFixed(0)}<span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
