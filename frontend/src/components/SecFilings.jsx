import React, { useState, useEffect } from 'react';
import { FileText, Search, Sparkles, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { fetchFilings, fetchFilingSummary, searchInFiling } from '../api/client';

export default function SecFilings({ ticker }) {
  const [filings, setFilings] = useState([]);
  const [selectedForm, setSelectedForm] = useState('10-K');
  const [summary, setSummary] = useState(null);
  const [summarizing, setSummarizing] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchFilings(ticker).then(setFilings).catch(console.error);
  }, [ticker]);

  const handleSummarize = async (formType) => {
    setSelectedForm(formType);
    setSummarizing(true);
    try {
      const data = await fetchFilingSummary(ticker, formType);
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizing(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await searchInFiling(ticker, searchQuery.trim(), selectedForm);
      setSearchResults(res.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {/* Search in Filing Engine Header */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Search size={20} color="#38bdf8" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>SEC EDGAR In-Filing Search Engine</h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
          Search directly within chunked SEC EDGAR 10-K & 10-Q filing documents using sub-string & semantic keyword matching.
        </p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords inside filing (e.g., GPU, Risk, China, Revenue, Margin)..."
            style={{
              flex: '1 1 300px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#f8fafc',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn-primary">
            {searching ? 'Searching...' : 'Search Filing Text'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
              FOUND {searchResults.length} MATCHING FILING CHUNKS:
            </div>
            {searchResults.map((match, i) => (
              <div key={i} style={{
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.88rem',
                lineHeight: '1.6',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                  <span>Chunk #{match.chunk_index}</span>
                  <span>Relevance: {(match.relevance_score * 100).toFixed(0)}%</span>
                </div>
                {match.text_snippet}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.25rem' }}>
        {/* SEC EDGAR Filings List */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FileText size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>SEC EDGAR Filings Archive</h3>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {filings.map((f, idx) => (
              <div key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.9rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.07)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{f.form_type}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>filed {f.filing_date}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{f.accession_number}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleSummarize(f.form_type)}
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <Sparkles size={14} color="#38bdf8" /> Summarize
                  </button>
                  <a
                    href={f.report_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Filing Summarizer Panel */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>AI Filing Overview ({selectedForm})</h3>
          </div>

          {summarizing ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
              Extracting key financial highlights and risk disclosures...
            </div>
          ) : summary ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.3rem' }}>EXECUTIVE FILING SUMMARY</div>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#e2e8f0' }}>
                  {summary.executive_summary}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginBottom: '0.4rem', fontWeight: 600 }}>
                  KEY FINANCIAL HIGHLIGHTS
                </div>
                <ul style={{ display: 'grid', gap: '0.5rem', listStyle: 'none' }}>
                  {summary.key_financial_highlights.map((h, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginBottom: '0.4rem', fontWeight: 600 }}>
                  RISK DISCLOSURES SUMMARY
                </div>
                <div style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  fontSize: '0.85rem',
                  color: '#fde68a'
                }}>
                  {summary.risk_factors_summary}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Click "Summarize" on any SEC 10-K or 10-Q filing to generate an instant structured AI overview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
