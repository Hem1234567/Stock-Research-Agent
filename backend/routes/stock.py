from fastapi import APIRouter, Query
from backend.tools.alpha_vantage import get_stock_quote, get_historical_prices
from backend.tools.news_api import get_financial_news

router = APIRouter(prefix="/api/stock", tags=["stock"])

@router.get("/{ticker}/quote")
async def stock_quote(ticker: str):
    return await get_stock_quote(ticker)

@router.get("/{ticker}/history")
async def stock_history(ticker: str):
    return await get_historical_prices(ticker)

@router.get("/{ticker}/news")
async def stock_news(ticker: str):
    return await get_financial_news(ticker)
