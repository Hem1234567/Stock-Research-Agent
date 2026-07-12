from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import stock, filings, report

app = FastAPI(
    title="Stock Research Agent API",
    description="AI-powered stock research backend using Lovable AI Gateway, SEC EDGAR, Alpha Vantage & NewsAPI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stock.router)
app.include_router(filings.router)
app.include_router(report.router)

@app.get("/")
def health_check():
    return {"status": "Stock Research Agent running"}
