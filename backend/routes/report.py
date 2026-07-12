from fastapi import APIRouter
from backend.agents.researcher import generate_full_report

router = APIRouter(prefix="/api/report", tags=["report"])

@router.get("/{ticker}")
async def get_report(ticker: str):
    return await generate_full_report(ticker)
