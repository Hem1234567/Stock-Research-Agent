from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class StockQuote(BaseModel):
    ticker: str
    name: str
    price: float
    change: float
    change_percent: float
    market_cap: str
    pe_ratio: Optional[float] = None
    fifty_two_week_high: float
    fifty_two_week_low: float
    volume: int
    sector: Optional[str] = "Technology"
    description: Optional[str] = ""

class PricePoint(BaseModel):
    date: str
    close: float
    volume: Optional[int] = 0

class SECFilingMetadata(BaseModel):
    accession_number: str
    form_type: str
    filing_date: str
    report_url: str
    description: str

class FilingSummaryResponse(BaseModel):
    ticker: str
    form_type: str
    filing_date: str
    executive_summary: str
    key_financial_highlights: List[str]
    strategic_priorities: List[str]
    risk_factors_summary: str

class InFilingSearchRequest(BaseModel):
    query: str
    ticker: str
    form_type: Optional[str] = "10-K"

class SearchMatch(BaseModel):
    chunk_index: int
    text_snippet: str
    relevance_score: float

class InFilingSearchResponse(BaseModel):
    ticker: str
    query: str
    total_matches: int
    matches: List[SearchMatch]

class NewsArticle(BaseModel):
    title: str
    source: str
    url: str
    published_at: str
    summary: str
    sentiment: str  # "Bullish", "Bearish", "Neutral"
    sentiment_score: float  # -1.0 to 1.0

class RiskItem(BaseModel):
    category: str  # e.g., "Operational", "Regulatory", "Macroeconomic", "Financial"
    risk_title: str
    description: str
    severity: str  # "High", "Medium", "Low"

class ResearchBriefingResponse(BaseModel):
    ticker: str
    company_name: str
    executive_summary: str
    investment_thesis_bull: List[str]
    investment_thesis_bear: List[str]
    key_metrics_summary: Dict[str, Any]
    top_risks: List[RiskItem]
    news_sentiment_overview: str
    overall_sentiment_score: float  # 0 to 100
    ai_recommendation_context: str
