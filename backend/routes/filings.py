from fastapi import APIRouter
from backend.tools.sec_edgar import get_recent_filings, search_filing_chunks
from backend.agents.researcher import summarize_filing
from backend.models.schemas import InFilingSearchRequest, InFilingSearchResponse

router = APIRouter(prefix="/api/filings", tags=["filings"])

@router.get("/{ticker}")
async def list_filings(ticker: str):
    return await get_recent_filings(ticker)

@router.get("/{ticker}/summarize")
async def summarize_sec_filing(ticker: str, form_type: str = "10-K"):
    return await summarize_filing(ticker, form_type)

@router.post("/search", response_model=InFilingSearchResponse)
async def in_filing_search(payload: InFilingSearchRequest):
    matches = search_filing_chunks(payload.ticker, payload.query)
    return InFilingSearchResponse(
        ticker=payload.ticker.upper(),
        query=payload.query,
        total_matches=len(matches),
        matches=matches
    )
