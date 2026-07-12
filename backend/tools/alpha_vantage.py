import os
import httpx
from typing import Dict, Any, List
from backend.models.schemas import StockQuote, PricePoint

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "demo")

DEMO_QUOTES = {
    "NVDA": StockQuote(
        ticker="NVDA",
        name="NVIDIA Corporation",
        price=142.85,
        change=4.20,
        change_percent=3.03,
        market_cap="3.52 Trillion",
        pe_ratio=48.2,
        fifty_two_week_high=152.89,
        fifty_two_week_low=88.40,
        volume=54210900,
        sector="Technology / Semiconductors",
        description="NVIDIA Corporation designs graphic processing units (GPUs) and AI computing platforms for gaming, data center acceleration, and enterprise generative AI solutions."
    ),
    "AAPL": StockQuote(
        ticker="AAPL",
        name="Apple Inc.",
        price=228.40,
        change=1.85,
        change_percent=0.82,
        market_cap="3.48 Trillion",
        pe_ratio=33.1,
        fifty_two_week_high=237.23,
        fifty_two_week_low=164.08,
        volume=41230000,
        sector="Technology / Consumer Electronics",
        description="Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and software services ecosystem."
    ),
    "TSLA": StockQuote(
        ticker="TSLA",
        name="Tesla, Inc.",
        price=248.60,
        change=-3.15,
        change_percent=-1.25,
        market_cap="789.2 Billion",
        pe_ratio=62.4,
        fifty_two_week_high=271.00,
        fifty_two_week_low=138.80,
        volume=68912000,
        sector="Consumer Discretionary / Automotive",
        description="Tesla, Inc. designs, develops, manufactures, and sells fully electric vehicles, energy generation and storage systems, and autonomous driving technology."
    )
}

DEMO_HISTORY = [
    PricePoint(date="2026-06-30", close=131.20, volume=49000000),
    PricePoint(date="2026-07-01", close=133.40, volume=51200000),
    PricePoint(date="2026-07-02", close=135.80, volume=48100000),
    PricePoint(date="2026-07-03", close=134.10, volume=44000000),
    PricePoint(date="2026-07-06", close=137.50, volume=56000000),
    PricePoint(date="2026-07-07", close=138.90, volume=53100000),
    PricePoint(date="2026-07-08", close=137.20, volume=47500000),
    PricePoint(date="2026-07-09", close=139.80, volume=52800000),
    PricePoint(date="2026-07-10", close=142.85, volume=54210900)
]

async def get_stock_quote(ticker: str) -> StockQuote:
    ticker = ticker.upper()
    if ALPHA_VANTAGE_API_KEY != "demo":
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={ticker}&apikey={ALPHA_VANTAGE_API_KEY}"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json().get("Global Quote", {})
                    if data and "05. price" in data:
                        price = float(data.get("05. price", 100.0))
                        change = float(data.get("09. change", 0.0))
                        change_pct = float(data.get("10. change percent", "0%").replace("%", ""))
                        return StockQuote(
                            ticker=ticker,
                            name=f"{ticker} Corporation",
                            price=price,
                            change=change,
                            change_percent=change_pct,
                            market_cap="N/A",
                            pe_ratio=30.0,
                            fifty_two_week_high=price * 1.15,
                            fifty_two_week_low=price * 0.75,
                            volume=int(data.get("06. volume", 1000000)),
                            sector="Equities",
                            description=f"Market data for {ticker} fetched via Alpha Vantage."
                        )
        except Exception:
            pass

    if ticker in DEMO_QUOTES:
        return DEMO_QUOTES[ticker]

    return StockQuote(
        ticker=ticker,
        name=f"{ticker} Inc.",
        price=156.40,
        change=2.10,
        change_percent=1.36,
        market_cap="142.5 Billion",
        pe_ratio=26.4,
        fifty_two_week_high=172.00,
        fifty_two_week_low=118.50,
        volume=12400000,
        sector="Equities",
        description=f"{ticker} Inc. provides innovative products, services, and technology solutions."
    )

async def get_historical_prices(ticker: str) -> List[PricePoint]:
    ticker = ticker.upper()
    if ALPHA_VANTAGE_API_KEY != "demo":
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={ALPHA_VANTAGE_API_KEY}"
                resp = await client.get(url)
                if resp.status_code == 200:
                    ts = resp.json().get("Time Series (Daily)", {})
                    points = []
                    for date_str in sorted(ts.keys())[-14:]:
                        row = ts[date_str]
                        points.append(
                            PricePoint(
                                date=date_str,
                                close=float(row.get("4. close", 100)),
                                volume=int(row.get("5. volume", 1000000))
                            )
                        )
                    if points:
                        return points
        except Exception:
            pass
    return DEMO_HISTORY
