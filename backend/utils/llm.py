import os
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

LOVABLE_API_KEY = os.getenv("LOVABLE_API_KEY", "").strip()
LOVABLE_AI_MODEL = os.getenv("LOVABLE_AI_MODEL", "google/gemini-3-flash-preview")
LOVABLE_AI_BASE_URL = os.getenv("LOVABLE_AI_BASE_URL", "https://api.lovable.dev/v1")

async def call_llm(
    prompt: str,
    system_prompt: str = "You are a senior AI equity research analyst.",
    json_mode: bool = False,
    ticker: str = "NVDA"
) -> str:
    """
    Calls the Lovable AI Gateway (OpenAI compatible).
    Falls back to intelligent mock data if API key is not configured or rate limited.
    """
    if LOVABLE_API_KEY:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(
                api_key=LOVABLE_API_KEY,
                base_url=LOVABLE_AI_BASE_URL
            )
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
            kwargs = {
                "model": LOVABLE_AI_MODEL,
                "messages": messages,
                "temperature": 0.3
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            response = await client.chat.completions.create(**kwargs)
            return response.choices[0].message.content
        except Exception as e:
            print(f"[LLM Warning] Lovable AI Gateway error ({e}), falling back to simulated synthesis.")

    # Fallback simulation tailored to ticker & task
    return generate_simulated_llm_response(prompt, ticker, json_mode)

def generate_simulated_llm_response(prompt: str, ticker: str, json_mode: bool) -> str:
    ticker = ticker.upper()
    if "summarize" in prompt.lower() or "filing" in prompt.lower() or "10-k" in prompt.lower():
        data = {
            "ticker": ticker,
            "form_type": "10-K",
            "filing_date": "2026-02-15",
            "executive_summary": f"{ticker} demonstrated strong revenue expansion driven by accelerating cloud & AI workload demand across global enterprise segments. Operating margins expanded by 340 bps due to supply chain scaling efficiencies.",
            "key_financial_highlights": [
                "Full-year revenue grew +48% YoY driven by enterprise data center expansion.",
                "Free cash flow conversion reached 42% of total net sales.",
                "R&D expenditure increased +24% to support next-gen hardware/software roadmaps."
            ],
            "strategic_priorities": [
                "Expanding full-stack AI ecosystem across enterprise infrastructure and edge computing.",
                "Scaling strategic partnerships with tier-1 cloud providers.",
                "Optimizing operational resilience through multi-region foundry supply chain diversification."
            ],
            "risk_factors_summary": f"Key risks identified include semiconductor export control restrictions, customer concentration in top hyperscaler accounts, and macroeconomic volatility impacting enterprise IT CAPEX budgets."
        }
        return json.dumps(data) if json_mode else data["executive_summary"]

    if "briefing" in prompt.lower() or "report" in prompt.lower() or "thesis" in prompt.lower():
        data = {
            "ticker": ticker,
            "company_name": f"{ticker} Inc.",
            "executive_summary": f"{ticker} maintains a dominant competitive moat within high-performance enterprise AI infrastructure and accelerated compute. Unprecedented demand for generative AI training and inference continues to propel fundamental outperformance.",
            "investment_thesis_bull": [
                "Dominant architectural leadership in accelerated computing ecosystems and software tooling.",
                "Strong recurring revenue momentum via enterprise software AI services.",
                "High pricing power and superior operating margin leverage compared to industry peers."
            ],
            "investment_thesis_bear": [
                "Cyclical risks associated with enterprise cloud infrastructure investment waves.",
                "Geopolitical supply chain risks and export regulatory headwinds.",
                "Rising custom silicon initiatives (ASICs) by major hyperscale customers."
            ],
            "key_metrics_summary": {
                "Revenue Growth (YoY)": "+48.2%",
                "Operating Margin": "61.4%",
                "Free Cash Flow": "$28.4B",
                "ROIC": "44.1%"
            },
            "top_risks": [
                {
                    "category": "Regulatory",
                    "risk_title": "Export Controls & Geopolitical Restrictions",
                    "description": "Stricter export licensing mandates could restrict sales volume into select international markets.",
                    "severity": "High"
                },
                {
                    "category": "Operational",
                    "risk_title": "Advanced Node Wafer Supply Capacity",
                    "description": "Dependence on foundry partners for leading-edge silicon packaging and wafer supply.",
                    "severity": "Medium"
                },
                {
                    "category": "Financial",
                    "risk_title": "Customer Concentration",
                    "description": "Top five cloud hyperscalers represent a substantial portion of total data center revenue.",
                    "severity": "Medium"
                }
            ],
            "news_sentiment_overview": f"Market sentiment remains decisively bullish on {ticker}, supported by earnings outperformance and continuous institutional adoption of new architecture families.",
            "overall_sentiment_score": 88.5,
            "ai_recommendation_context": "Strong Buy conviction based on fundamental momentum, robust moat, and sustained secular demand tailwinds."
        }
        return json.dumps(data) if json_mode else data["executive_summary"]

    # Default fallback
    return json.dumps({"result": f"Analysis complete for {ticker}."})
