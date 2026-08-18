import yfinance as yf
import pandas as pd

portfolio = [
    {"ticker": "SOL-USD", "shares": 2.07, "avg_cost": 123.14},
    {"ticker": "BTC-USD", "shares": 0.00086198, "avg_cost": 81000},
    {"ticker": "AMD", "shares": 2.04, "avg_cost": 202.41},
    {"ticker": "NVDA", "shares": 3.23, "avg_cost": 144},
    {"ticker": "GOOGL", "shares": 1.02, "avg_cost": 293},
    {"ticker": "MSFT", "shares": 3.01, "avg_cost": 361},
    {"ticker": "RKLB", "shares": 0.71, "avg_cost": 41},
    {"ticker": "TEM", "shares": 4.0, "avg_cost": 48.5},
    {"ticker": "NOW", "shares": 3.01, "avg_cost": 89.4},
    {"ticker": "SPCX", "shares": 1.0, "avg_cost": 135},
    {"ticker": "UBER", "shares": 2.11, "avg_cost": 71},
    {"ticker": "CRM", "shares": 2.0, "avg_cost": 156},
    {"ticker": "ORCL", "shares": 1.0, "avg_cost": 150},
    {"ticker": "AVGO", "shares": 1.10, "avg_cost": 367},
    {"ticker": "SOFI", "shares": 4.43, "avg_cost": 18.5},
    {"ticker": "SOUN", "shares": 1.22, "avg_cost": 11},
    {"ticker": "META", "shares": 2.01, "avg_cost": 564},
    {"ticker": "PLTR", "shares": 4.12, "avg_cost": 112.36},
    {"ticker": "MSTY", "shares": 0.6, "avg_cost": 57.55},
    {"ticker": "YMAG", "shares": 2.17, "avg_cost": 13.66},
]

results = []
for p in portfolio:
    ticker = p["ticker"]
    stock = yf.Ticker(ticker)
    info = stock.info
    
    current_price = info.get("currentPrice", info.get("regularMarketPrice"))
    if current_price is None:
        current_price = info.get("previousClose", 0)
        
    target_price = info.get("targetMeanPrice")
    
    if not target_price or target_price == 0:
        if "USD" in ticker:
            target_price = current_price * 1.30
        elif ticker in ["MSTY", "YMAG", "SPCX"]:
            target_price = current_price * 1.08
        else:
            target_price = current_price * 1.15
            
    cost_basis = p["shares"] * p["avg_cost"]
    current_value = p["shares"] * current_price
    target_value = p["shares"] * target_price
    
    results.append({
        "Ticker": ticker,
        "Shares": p["shares"],
        "Avg Cost": p["avg_cost"],
        "Cost Basis": cost_basis,
        "Current Price": current_price,
        "Current Value": current_value,
        "Target Price": target_price,
        "Target Value": target_value,
    })

df = pd.DataFrame(results)
print(df.to_string())
print(f"Total Cost Basis: {df['Cost Basis'].sum()}")
print(f"Total Current Value: {df['Current Value'].sum()}")
print(f"Total Projected April 2027 Value: {df['Target Value'].sum()}")
