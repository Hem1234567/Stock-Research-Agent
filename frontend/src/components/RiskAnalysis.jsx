import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Layers } from 'lucide-react';
import { fetchFullReport } from '../api/client';

export default function RiskAnalysis({ ticker }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFullReport(ticker)
      .then(r => setRisks(r.top_risks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) {
    return <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>Extracting risk matrices and compliance factors...</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <ShieldAlert size={20} color="#f43f5e" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Risk Matrix & Corporate Governance</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
          Identified structural, regulatory, and financial tail risks extracted from SEC filings and news reports.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {risks.map((risk, i) => {
          const isHigh = risk.severity === 'High';
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${isHigh ? '#f43f5e' : '#f59e0b'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="glass-pill" style={{ color: '#cbd5e1' }}>{risk.category}</span>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: isHigh ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isHigh ? '#f43f5e' : '#f59e0b'
                }}>
                  {risk.severity.toUpperCase()} SEVERITY
                </span>
              </div>
              <h4 style={{ fontSize: '1.08rem', fontWeight: 600, marginBottom: '0.6rem' }}>
                {risk.risk_title}
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>
                {risk.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
