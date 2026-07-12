const API_BASE = 'http://localhost:8000/api';

export async function fetchStockQuote(ticker) {
  const res = await fetch(`${API_BASE}/stock/${ticker}/quote`);
  if (!res.ok) throw new Error('Failed to fetch quote');
  return res.json();
}

export async function fetchStockHistory(ticker) {
  const res = await fetch(`${API_BASE}/stock/${ticker}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function fetchStockNews(ticker) {
  const res = await fetch(`${API_BASE}/stock/${ticker}/news`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
}

export async function fetchFilings(ticker) {
  const res = await fetch(`${API_BASE}/filings/${ticker}`);
  if (!res.ok) throw new Error('Failed to fetch filings');
  return res.json();
}

export async function fetchFilingSummary(ticker, formType = '10-K') {
  const res = await fetch(`${API_BASE}/filings/${ticker}/summarize?form_type=${formType}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function searchInFiling(ticker, query, formType = '10-K') {
  const res = await fetch(`${API_BASE}/filings/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticker, query, form_type: formType })
  });
  if (!res.ok) throw new Error('Failed to search filing');
  return res.json();
}

export async function fetchFullReport(ticker) {
  const res = await fetch(`${API_BASE}/report/${ticker}`);
  if (!res.ok) throw new Error('Failed to generate report');
  return res.json();
}
