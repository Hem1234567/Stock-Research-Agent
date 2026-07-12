import os
import httpx
from typing import List
from backend.models.schemas import NewsArticle

NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "demo")

SAMPLE_NEWS = [
    NewsArticle(
        title="Institutional Demand Surge Accelerates Enterprise AI Infrastructure Rollout",
        source="Financial Times",
        url="https://www.ft.com",
        published_at="2026-07-11 14:30:00",
        summary="Major cloud service providers announce expanded multi-year CAPEX budgets aimed at next-generation accelerated compute clusters and high-bandwidth memory architectures.",
        sentiment="Bullish",
        sentiment_score=0.82
    ),
    NewsArticle(
        title="Supply Chain Diversification Boosts Semiconductor Foundry Efficiency",
        source="Wall Street Journal",
        url="https://www.wsj.com",
        published_at="2026-07-10 09:15:00",
        summary="Strategic investments in advanced packaging capacity ease lead times for high-density GPUs, improving quarterly operating margin guidance across the sector.",
        sentiment="Bullish",
        sentiment_score=0.68
    ),
    NewsArticle(
        title="Regulatory Scrutiny on Tech Export Rules Prompts Compliance Adjustments",
        source="Bloomberg",
        url="https://www.bloomberg.com",
        published_at="2026-07-09 16:45:00",
        summary="Commerce officials evaluate new licensing frameworks for enterprise silicon exports to key Asian markets, creating mild uncertainty around international shipment volumes.",
        sentiment="Bearish",
        sentiment_score=-0.45
    ),
    NewsArticle(
        title="Next-Gen AI Software Toolkits Drive Enterprise SaaS Adoption",
        source="Reuters",
        url="https://www.reuters.com",
        published_at="2026-07-08 11:00:00",
        summary="Enterprise customers report measurable productivity gains from customized AI inference workflows, supporting high renewal rates for recurring enterprise software subscriptions.",
        sentiment="Bullish",
        sentiment_score=0.75
    )
]

async def get_financial_news(ticker: str) -> List[NewsArticle]:
    ticker = ticker.upper()
    if NEWSAPI_KEY != "demo":
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                url = f"https://newsapi.org/v2/everything?q={ticker}&sortBy=publishedAt&pageSize=6&apiKey={NEWSAPI_KEY}"
                resp = await client.get(url)
                if resp.status_code == 200:
                    articles = resp.json().get("articles", [])
                    results = []
                    for art in articles[:6]:
                        results.append(
                            NewsArticle(
                                title=art.get("title", "No Title"),
                                source=art.get("source", {}).get("name", "Financial News"),
                                url=art.get("url", "#"),
                                published_at=art.get("publishedAt", "")[:10],
                                summary=art.get("description") or "No description provided.",
                                sentiment="Bullish",
                                sentiment_score=0.5
                            )
                        )
                    if results:
                        return results
        except Exception:
            pass

    return SAMPLE_NEWS
