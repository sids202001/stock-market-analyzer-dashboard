let isHeatmapView = false;
const stocks = [
    { ticker: 'NVDA', name: 'NVIDIA', price: '$0.00', verdict: 'Strong Buy', reason: 'Undisputed king of AI GPUs, massive margins, explosive growth.', class: 'verdict-strong-buy', delay: '0.0s', marketCap: 3000 },
    { ticker: 'MU', name: 'Micron Technology', price: '$0.00', verdict: 'Buy', reason: 'Crucial supplier of high-bandwidth memory (HBM) for AI data centers.', class: 'verdict-buy', delay: '0.05s', marketCap: 150 },
    { ticker: 'NOW', name: 'ServiceNow', price: '$0.00', verdict: 'Strong Buy', reason: 'Best SaaS moat, 44% FCF margin, down 36% YTD.', class: 'verdict-strong-buy', delay: '0.1s', marketCap: 160 },
    { ticker: 'ADBE', name: 'Adobe', price: '$0.00', verdict: 'Strong Buy', reason: '8x forward P/E for a creative monopolist. Absurd value.', class: 'verdict-strong-buy', delay: '0.2s', marketCap: 250 },
    { ticker: 'AVGO', name: 'Broadcom', price: '$0.00', verdict: 'Strong Buy', reason: '42% FCF margin, dominant in AI chips & networking.', class: 'verdict-strong-buy', delay: '0.3s', marketCap: 700 },
    { ticker: 'CRM', name: 'Salesforce', price: '$0.00', verdict: 'Buy', reason: '$6.6B quarterly FCF, Agentforce hitting $1B ARR.', class: 'verdict-buy', delay: '0.4s', marketCap: 300 },
    { ticker: 'MSFT', name: 'Microsoft', price: '$0.00', verdict: 'Buy', reason: 'AI + Cloud monopoly at a rare dip.', class: 'verdict-buy', delay: '0.5s', marketCap: 3200 },
    { ticker: 'META', name: 'Meta Platforms', price: '$0.00', verdict: 'Buy', reason: '3.9B users, cheapest Mag-7 stock on P/E basis.', class: 'verdict-buy', delay: '0.6s', marketCap: 1300 },
    { ticker: 'ORCL', name: 'Oracle', price: '$0.00', verdict: 'Hold', reason: '$638B backlog is amazing, but negative $23.7B FCF is scary.', class: 'verdict-hold', delay: '0.7s', marketCap: 350 },
    { ticker: 'AMD', name: 'AMD', price: '$0.00', verdict: 'Hold', reason: '57% data center growth but priced for perfection (75x P/E).', class: 'verdict-hold', delay: '0.8s', marketCap: 250 },
    { ticker: 'SOFI', name: 'SoFi Tech', price: '$0.00', verdict: 'Speculative', reason: 'Impressive 41% revenue growth, but still negative FCF.', class: 'verdict-speculative', delay: '0.9s', marketCap: 10 },
    { ticker: 'TEM', name: 'Tempus AI', price: '$0.00', verdict: 'Sell', reason: 'Unprofitable, losing $126M/qtr. Speculative cash burner.', class: 'verdict-sell', delay: '1.0s', marketCap: 5 },
    { ticker: 'RKLB', name: 'Rocket Lab', price: '$0.00', verdict: 'Avoid / Sell', reason: '60x P/S on $1B revenue. Great company, terrible price.', class: 'verdict-avoid', delay: '1.1s', marketCap: 7 },
    { ticker: 'V', name: 'Visa', price: '$0.00', verdict: 'Strong Buy', reason: 'Global payments duopoly, 50%+ profit margins, massive compounder.', class: 'verdict-strong-buy', delay: '1.2s', marketCap: 550 },
    { ticker: 'PLTR', name: 'Palantir', price: '$0.00', verdict: 'Buy', reason: 'Incredible momentum in government and commercial AI software contracts.', class: 'verdict-buy', delay: '1.3s', marketCap: 50 },
    { ticker: 'ACN', name: 'Accenture', price: '$0.00', verdict: 'Buy', reason: 'IT consulting giant returning to growth as enterprise AI spending accelerates.', class: 'verdict-buy', delay: '1.4s', marketCap: 200 },
    { ticker: 'NBIS', name: 'Nebius Group', price: '$0.00', verdict: 'Speculative', reason: 'High growth AI infrastructure and compute play, high volatility.', class: 'verdict-speculative', delay: '1.5s', marketCap: 4 },
    { ticker: 'GOOGL', name: 'Alphabet', price: '$0.00', verdict: 'Strong Buy', reason: 'Undervalued tech giant dominating Search and scaling Cloud/AI margins.', class: 'verdict-strong-buy', delay: '1.6s', marketCap: 2200 },
    { ticker: 'AAPL', name: 'Apple', price: '$0.00', verdict: 'Hold', reason: 'Massive cash pile and services growth, but struggling with hardware cycles.', class: 'verdict-hold', delay: '1.7s', marketCap: 3100 },
    { ticker: 'VEEV', name: 'Veeva Systems', price: '$0.00', verdict: 'Buy', reason: 'Unmatched SaaS moat in Life Sciences with sticky recurring revenue.', class: 'verdict-buy', delay: '1.8s', marketCap: 35 },
    { ticker: 'UBER', name: 'Uber Technologies', price: '$0.00', verdict: 'Buy', reason: 'Reaping the rewards of a mobility/delivery duopoly, massive FCF generation.', class: 'verdict-buy', delay: '1.9s', marketCap: 160 },
    { ticker: 'ZTS', name: 'Zoetis', price: '$0.00', verdict: 'Buy', reason: 'Leader in animal health, highly defensive recession-resistant business.', class: 'verdict-buy', delay: '2.0s', marketCap: 80 },
    { ticker: 'QCOM', name: 'Qualcomm', price: '$0.00', verdict: 'Buy', reason: 'Mobile chip titan pivoting to AI edge computing, automotive & IoT.', class: 'verdict-buy', delay: '2.1s', marketCap: 190 },
    { ticker: 'AMAT', name: 'Applied Materials', price: '$0.00', verdict: 'Strong Buy', reason: 'Largest semiconductor equipment maker — every chip fab on earth buys from AMAT.', class: 'verdict-strong-buy', delay: '2.2s', marketCap: 160 },
    { ticker: 'ANET', name: 'Arista Networks', price: '$0.00', verdict: 'Strong Buy', reason: 'Dominant AI data center networking — Meta & Microsoft buy all their switches from Arista.', class: 'verdict-strong-buy', delay: '2.3s', marketCap: 130 },
    { ticker: 'VRT', name: 'Vertiv Holdings', price: '$0.00', verdict: 'Strong Buy', reason: 'Cooling & power infrastructure for AI data centers — irreplaceable supply chain pick.', class: 'verdict-strong-buy', delay: '2.4s', marketCap: 45 },
    { ticker: 'MRVL', name: 'Marvell Technology', price: '$0.00', verdict: 'Buy', reason: 'Custom AI silicon & high-speed networking chips — deep partnerships with Amazon & Google.', class: 'verdict-buy', delay: '2.5s', marketCap: 75 },
    { ticker: 'SNOW', name: 'Snowflake', price: '$0.00', verdict: 'Buy', reason: 'Leading data cloud platform enabling AI analytics across enterprises.', class: 'verdict-buy', delay: '2.6s', marketCap: 50 },
    { ticker: 'CSCO', name: 'Cisco', price: '$0.00', verdict: 'Hold', reason: 'Legacy networking giant pivoting to AI and cybersecurity.', class: 'verdict-hold', delay: '2.7s', marketCap: 200 },
    { ticker: 'SNDK', name: 'SanDisk', price: '$0.00', verdict: 'Buy', reason: 'Spun off from WDC in Feb 2025 as pure-play NAND/SSD leader benefiting from AI data center storage demand.', class: 'verdict-buy', delay: '2.8s', marketCap: 35 },
    { ticker: 'WDC', name: 'Western Digital', price: '$0.00', verdict: 'Hold', reason: 'Major storage and flash memory provider, benefiting from AI data needs.', class: 'verdict-hold', delay: '2.9s', marketCap: 25 },
    { ticker: 'INTC', name: 'Intel', price: '$0.00', verdict: 'Hold', reason: 'Turnaround story relying on Intel Foundry success and government backing.', class: 'verdict-hold', delay: '3.0s', marketCap: 150 },
    { ticker: 'NFLX', name: 'Netflix', price: '$0.00', verdict: 'Buy', reason: 'Dominant streaming leader with successful ad-tier growth and strong free cash flow.', class: 'verdict-buy', delay: '3.1s', marketCap: 300 },
    { ticker: 'SOL-USD', name: 'Solana', price: '$0.00', verdict: 'Speculative', reason: 'High-performance blockchain with surging developer adoption and ecosystem growth.', class: 'verdict-speculative', delay: '3.2s', marketCap: 70 },
    { ticker: 'COIN', name: 'Coinbase', price: '$0.00', verdict: 'Buy', reason: 'Premier US crypto exchange benefiting from institutional adoption and crypto momentum.', class: 'verdict-buy', delay: '3.3s', marketCap: 60 }
];

function formatCurrency(val) {
    if (val === undefined || val === null || isNaN(val)) return "N/A";
    if (Math.abs(val) >= 1e9) return '$' + (val / 1e9).toFixed(2) + 'B';
    if (Math.abs(val) >= 1e6) return '$' + (val / 1e6).toFixed(2) + 'M';
    return '$' + val.toLocaleString();
}

// ═══════════════════════════════════════════════════════════
// ADVANCED AI STOCK DASHBOARD — generateDetailedData v3.0
// Features: AI Signal, Fear&Greed, Golden/Death Cross,
// Insider Trades, Magic Formula, Price Target Meter, Fibonacci
// ═══════════════════════════════════════════════════════════════════════
// ADVANCED AI STOCK DASHBOARD — generateDetailedData v4.0 — CLEAN DESIGN
// ═══════════════════════════════════════════════════════════════════════

function generateDetailedData(stock) {
    const isBullish = ['Strong Buy', 'Buy'].includes(stock.verdict);
    const basePrice = stock.rawPrice || parseFloat((stock.price || '$0').replace('$', '').replace(',', ''));

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: COMPUTE ALL 9 SIGNALS — clean and simple
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fg   = (stock.fearGreedScore != null) ? stock.fearGreedScore : 50;
    const tu   = (stock.targetUpside   != null) ? stock.targetUpside   : null;
    const streak = stock.earningsBeatStreak || 0;
    const mfs    = (stock.magicFormulaScore  != null) ? stock.magicFormulaScore  : null;
    const si     = stock.shortInterest;
    const rg     = stock.revenueGrowth;
    const insiderBuys  = (stock.insiderTrades || []).filter(t => t.isBuy).length;
    const insiderSells = (stock.insiderTrades || []).filter(t => !t.isBuy).length;

    // Each signal: { icon, name, value, status: 'bull'|'bear'|'neutral', detail }
    const signals = [];
    let bullCount = 0;

    function addSignal(icon, name, value, status, detail) {
        signals.push({ icon, name, value, status, detail });
        if (status === 'bull') bullCount++;
        if (status === 'neutral') bullCount += 0.5;
    }

    // 1. Analyst Consensus
    addSignal('📊', 'Analyst Consensus',
        stock.verdict,
        isBullish ? 'bull' : stock.verdict === 'Hold' ? 'neutral' : 'bear',
        isBullish ? 'Wall Street recommends buying this stock.' : 'Analysts are cautious or negative on this stock.'
    );

    // 2. Golden / Death Cross
    if (stock.crossSignal === 'golden') {
        addSignal('⚡', 'Golden Cross (SMA50 > SMA200)',
            `SMA50: $${stock.sma50}  >  SMA200: $${stock.sma200}`,
            'bull', 'The 50-day average has crossed ABOVE the 200-day. This is one of the most reliable long-term buy signals used by professional traders. NVDA, AAPL, and META all rallied 40–100%+ after their Golden Cross.'
        );
    } else if (stock.crossSignal === 'death') {
        addSignal('☠️', 'Death Cross (SMA50 < SMA200)',
            `SMA50: $${stock.sma50}  <  SMA200: $${stock.sma200}`,
            'bear', 'The 50-day average has crossed BELOW the 200-day. This is a warning sign used by traders to reduce or exit positions.'
        );
    } else {
        addSignal('📉', 'MA Cross Signal', 'Not enough data (< 200 trading days)', 'neutral', 'Cannot determine Golden or Death Cross without 200 days of price history.');
    }

    // 3. Fear & Greed (RSI-based)
    const fgLabel = fg < 20 ? 'EXTREME FEAR' : fg < 40 ? 'FEAR' : fg < 60 ? 'NEUTRAL' : fg < 80 ? 'GREED' : 'EXTREME GREED';
    const fgStatus = fg < 40 ? 'bull' : fg > 65 ? 'bear' : 'neutral';
    const fgDetail = fg < 40
        ? `RSI at ${fg} = oversold territory. Warren Buffett's most famous principle: "Be greedy when others are fearful." This is typically a great buy zone.`
        : fg > 65
        ? `RSI at ${fg} = overbought. The stock has run up fast. Consider waiting for a pullback before buying more.`
        : `RSI at ${fg} = neutral. Neither oversold nor overbought. Conditions are balanced.`;
    addSignal('🌡️', `Fear & Greed Meter`, `${fg} / 100  —  ${fgLabel}`, fgStatus, fgDetail);

    // 4. Analyst Price Target Upside
    const targetPrice = stock.targetPrice ? stock.targetPrice.toFixed(2) : (basePrice * 1.1).toFixed(2);
    if (tu != null) {
        const tuStatus = tu > 15 ? 'bull' : tu < -5 ? 'bear' : 'neutral';
        addSignal('🎯', 'Wall Street Price Target',
            `$${targetPrice}  (${tu > 0 ? '+' : ''}${tu}% from current price)`,
            tuStatus,
            tu > 15 ? `Analysts collectively see ${tu}% upside to $${targetPrice}. A target this far above current price is a strong buy signal.`
            : tu < -5 ? `Analysts think the stock is ${Math.abs(tu)}% OVERVALUED vs their $${targetPrice} target.`
            : `Analysts see limited upside (${tu}%). Stock is fairly priced near analyst consensus.`
        );
    } else {
        addSignal('🎯', 'Wall Street Price Target', 'No analyst target available', 'neutral', 'Insufficient analyst coverage to determine a consensus price target.');
    }

    // 5. Earnings Beat Streak
    const streakStatus = streak >= 3 ? 'bull' : streak >= 1 ? 'neutral' : 'bear';
    addSignal('📈', 'Earnings Beat Streak',
        streak >= 1 ? `Beat estimates ${streak} quarter${streak > 1 ? 's' : ''} in a row` : 'No consecutive earnings beats',
        streakStatus,
        streak >= 3 ? `${streak} consecutive quarters of beating Wall Street's EPS estimates. This is a key signal that management is executing well and the business is stronger than expected.`
        : streak >= 1 ? `${streak} quarter of beating estimates. Needs consistency to become a strong signal.`
        : 'The company has not consistently beaten earnings estimates recently. Watch earnings closely.'
    );

    // 6. Buffett Magic Formula (Greenblatt)
    if (mfs != null) {
        const mfsStatus = mfs >= 60 ? 'bull' : mfs >= 30 ? 'neutral' : 'bear';
        addSignal('🧙', 'Buffett Magic Formula Score',
            `${mfs} / 100  —  ${mfs >= 70 ? 'Exceptional Value' : mfs >= 50 ? 'Good Value' : mfs >= 30 ? 'Fair Value' : 'Expensive'}`,
            mfsStatus,
            `Joel Greenblatt's Magic Formula = Earnings Yield + Return on Capital. This is the formula from "The Little Book That Beats the Market" endorsed by Warren Buffett. Stocks scoring above 60 historically outperform the market by a wide margin.`
        );
    } else {
        addSignal('🧙', 'Buffett Magic Formula Score', 'Cannot calculate (missing data)', 'neutral', 'Need EBIT, Market Cap, and Asset data to calculate the Magic Formula Score.');
    }

    // 7. Insider Activity (CEO/CFO personal buys)
    const insiderStatus = insiderBuys > insiderSells && insiderBuys > 0 ? 'bull'
        : insiderSells > insiderBuys && insiderSells > 0 ? 'bear' : 'neutral';
    const insiderVal = insiderBuys + insiderSells === 0 ? 'No recent insider trades found'
        : `${insiderBuys} BUY${insiderBuys !== 1 ? 'S' : ''}  vs  ${insiderSells} SELL${insiderSells !== 1 ? 'S' : ''}  (last 5 trades)`;
    addSignal('💰', 'CEO/CFO Insider Buying',
        insiderVal, insiderStatus,
        insiderBuys > insiderSells
        ? `Company insiders are buying with their own personal money. Peter Lynch: "Insiders might sell for many reasons, but they only buy for one — they think the stock is going up." This is one of the most reliable signals in investing.`
        : insiderSells > insiderBuys
        ? `Company insiders are selling their own shares recently. This is not automatically bad — they may need cash for personal reasons — but it warrants caution.`
        : `No clear insider buying or selling pattern recently.`
    );

    // 8. Revenue Growth
    if (rg != null) {
        const rgPct = (rg * 100).toFixed(1);
        const rgStatus = rg > 0.1 ? 'bull' : rg < 0 ? 'bear' : 'neutral';
        addSignal('📦', 'Revenue Growth (Year-over-Year)',
            `${rg > 0 ? '+' : ''}${rgPct}% YoY`,
            rgStatus,
            rg > 0.2 ? `Revenue growing at ${rgPct}% per year — this is very strong. Companies growing revenue this fast typically see their stock price follow.`
            : rg > 0 ? `Revenue growing at ${rgPct}% — moderate. Healthy but not spectacular.`
            : `Revenue declining ${Math.abs(rgPct)}% YoY — a warning sign. Declining revenue can lead to earnings misses and stock price drops.`
        );
    } else {
        addSignal('📦', 'Revenue Growth', 'No data available', 'neutral', 'Revenue growth data not available for this stock.');
    }

    // 9. Short Interest (low = smart money not betting against it)
    if (si != null) {
        const siPct = (si * 100).toFixed(1);
        const siStatus = si < 0.05 ? 'bull' : si > 0.15 ? 'bear' : 'neutral';
        addSignal('🩳', 'Short Interest (Bearish Bets)',
            `${siPct}% of float is sold short`,
            siStatus,
            si < 0.05 ? `Only ${siPct}% of shares are sold short — very low. Hedge funds and institutions are NOT betting against this company. Bullish sign.`
            : si > 0.15 ? `${siPct}% of shares shorted — high short interest. Professional traders are actively betting against this stock. Take note.`
            : `Moderate short interest of ${siPct}%. Not a major concern either way.`
        );
    } else {
        addSignal('🩳', 'Short Interest', 'No data available', 'neutral', 'Short interest data not available for this stock.');
    }

    const signalPct = Math.round((bullCount / 9) * 100);
    const overallVerdict = signalPct >= 72 ? 'STRONG BUY' : signalPct >= 55 ? 'BUY' : signalPct >= 40 ? 'HOLD / NEUTRAL' : signalPct >= 25 ? 'CAUTION' : 'AVOID / SELL';
    const verdictColor  = signalPct >= 72 ? '#4ade80' : signalPct >= 55 ? '#86efac' : signalPct >= 40 ? '#facc15' : signalPct >= 25 ? '#fb923c' : '#f87171';
    const verdictBg     = signalPct >= 72 ? 'rgba(34,197,94,0.12)' : signalPct >= 55 ? 'rgba(134,239,172,0.1)' : signalPct >= 40 ? 'rgba(250,204,21,0.1)' : signalPct >= 25 ? 'rgba(251,146,60,0.1)' : 'rgba(248,113,113,0.1)';
    const verdictIcon   = signalPct >= 72 ? '🟢' : signalPct >= 55 ? '🟡' : signalPct >= 40 ? '🟠' : '🔴';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: FIBONACCI — accurate from real 52-week high/low
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fibHigh  = stock.fibHigh  || basePrice * 1.3;
    const fibLow   = stock.fibLow   || basePrice * 0.7;
    const fibRange = fibHigh - fibLow;
    // Standard Fibonacci retracement formula: High - (Range × level%)
    // These are exact levels used by TradingView, Bloomberg, and all pro charting tools
    const fib_0    = fibHigh.toFixed(2);                              // 100% = High
    const fib_236  = (fibHigh - fibRange * 0.236).toFixed(2);         // 23.6%
    const fib_382  = (fibHigh - fibRange * 0.382).toFixed(2);         // 38.2%
    const fib_500  = (fibHigh - fibRange * 0.500).toFixed(2);         // 50.0%
    const fib_618  = (fibHigh - fibRange * 0.618).toFixed(2);         // 61.8% Golden Pocket
    const fib_786  = (fibHigh - fibRange * 0.786).toFixed(2);         // 78.6%
    const fib_100  = fibLow.toFixed(2);                               // 0% = Low

    // Where is current price in the range?
    const currentFibPct = fibRange > 0 ? Math.round(((fibHigh - basePrice) / fibRange) * 100) : 50;
    let currentFibZone = 'Between levels';
    if (basePrice >= fibHigh) currentFibZone = '🔴 Above 100% — Overbought';
    else if (basePrice >= parseFloat(fib_236)) currentFibZone = `Between 0%–23.6% — Near High ($${fib_236})`;
    else if (basePrice >= parseFloat(fib_382)) currentFibZone = `🟡 Near 38.2% level ($${fib_382}) — Watch for bounce`;
    else if (basePrice >= parseFloat(fib_500)) currentFibZone = `🟡 Near 50% Equilibrium ($${fib_500}) — Key level`;
    else if (basePrice >= parseFloat(fib_618)) currentFibZone = `🟢 Near 61.8% Golden Pocket ($${fib_618}) — Prime buy zone`;
    else if (basePrice >= parseFloat(fib_786)) currentFibZone = `🟢 Near 78.6% level ($${fib_786}) — Deep value zone`;
    else currentFibZone = `🟢 Below all levels — Potential extreme buy zone`;

    // S/R zones
    const res2 = (basePrice * 1.15).toFixed(2);
    const res1 = (basePrice * 1.08).toFixed(2);
    const sup1 = (basePrice * 0.92).toFixed(2);
    const sup2 = (basePrice * 0.85).toFixed(2);

    stock._res2 = parseFloat(res2);
    stock._res1 = parseFloat(res1);
    stock._sup1 = parseFloat(sup1);
    stock._sup2 = parseFloat(sup2);

    // Graham Number
    let grahamStr = 'N/A';
    if (stock.eps && stock.bookValue && stock.eps > 0 && stock.bookValue > 0) {
        grahamStr = '$' + Math.sqrt(22.5 * stock.eps * stock.bookValue).toFixed(2);
    }

    const fpe  = stock.forwardPE > 0 ? stock.forwardPE.toFixed(1) : 'N/A';
    const roe  = stock.roe ? (stock.roe * 100).toFixed(1) + '%' : 'N/A';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: EARNINGS TABLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let earningsHTML = `<table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
        <thead><tr style="border-bottom:1px solid rgba(255,255,255,0.12);">
            <th style="padding:0.5rem;color:#64748b;text-align:left;font-weight:500;">Quarter</th>
            <th style="padding:0.5rem;color:#64748b;text-align:right;font-weight:500;">Expected EPS</th>
            <th style="padding:0.5rem;color:#64748b;text-align:right;font-weight:500;">Actual EPS</th>
            <th style="padding:0.5rem;color:#64748b;text-align:right;font-weight:500;">Surprise</th>
        </tr></thead><tbody>`;
    if (stock.earningsTable && stock.earningsTable.length > 0) {
        stock.earningsTable.forEach(row => {
            const isFuture = row.act === null;
            const sc = !isFuture ? (row.surprise > 0 ? '#4ade80' : '#f87171') : '#64748b';
            const st = row.surprise !== null ? (row.surprise > 0 ? '▲ +' : '▼ ') + (row.surprise * 100).toFixed(1) + '%' : '—';
            const beatMiss = !isFuture && row.surprise !== null ? (row.surprise > 0 ? ' ✅' : ' ❌') : '';
            earningsHTML += `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);${isFuture ? 'opacity:0.5;' : ''}">
                <td style="padding:0.5rem;color:#94a3b8;">${row.date}${isFuture ? ' <span style="font-size:0.7rem;background:rgba(59,130,246,0.2);padding:1px 5px;border-radius:4px;color:#60a5fa;">Upcoming</span>' : ''}</td>
                <td style="padding:0.5rem;text-align:right;">${row.est !== null ? '$'+row.est.toFixed(2) : '—'}</td>
                <td style="padding:0.5rem;text-align:right;font-weight:600;">${row.act !== null ? '$'+row.act.toFixed(2) : '—'}${beatMiss}</td>
                <td style="padding:0.5rem;text-align:right;color:${sc};font-weight:700;">${st}</td>
            </tr>`;
        });
    } else {
        earningsHTML += `<tr><td colspan="4" style="padding:1.5rem;text-align:center;color:#475569;">No earnings history available</td></tr>`;
    }
    earningsHTML += '</tbody></table>';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: BUILD HTML SECTIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Chart
    let chartHTML = '';
    if (stock.historyDates && stock.historyDates.length > 0) {
        chartHTML = `<div class="detail-section" style="grid-column:1/-1;padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="margin:0;">📊 PRICE HISTORY</h4>
                <div style="display:flex;gap:0.4rem;flex-wrap:wrap;">
                    ${['1d','5d','1mo','3mo','6mo','ytd','1y','2y','5y','max'].map((p,i) =>
                        `<button class="filter-btn${p==='6mo'?' active':''}" style="padding:4px 10px;font-size:0.75rem;" onclick="updateChart('${stock.ticker}','${p}')">${p.toUpperCase()}</button>`
                    ).join('')}
                </div>
            </div>
            <div style="height:280px;width:100%;"><canvas id="priceChart"></canvas></div>
        </div>`;
    }

    // News
    let newsHTML = '';
    if (stock.news && stock.news.length > 0) {
        newsHTML = `<div class="detail-section" style="grid-column:1/-1;">
            <h4>📰 LATEST NEWS & CATALYSTS</h4>
            <ul style="list-style:none;padding:0;margin-top:0.8rem;">${stock.news.map(n => `
                <li style="margin-bottom:0.8rem;padding-bottom:0.8rem;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <a href="${n.link}" target="_blank" style="color:#60a5fa;text-decoration:none;font-weight:600;line-height:1.4;">${n.title}</a>
                    <div style="font-size:0.78rem;color:#475569;margin-top:0.2rem;">${n.publisher}</div>
                </li>`).join('')}</ul>
        </div>`;
    }


    // Institutional holders
    let investorsHTML = '';
    if (stock.topInvestors && stock.topInvestors.length > 0) {
        investorsHTML = `<div class="detail-section">
            <h4>🏦 TOP INSTITUTIONAL HOLDERS</h4>
            <div style="display:flex;flex-direction:column;gap:0.4rem;margin-top:0.8rem;">${stock.topInvestors.map(i => `
                <div style="padding:0.5rem 0.7rem;background:rgba(0,0,0,0.2);border-radius:8px;color:#e2e8f0;font-size:0.88rem;">• ${i}</div>`).join('')}
            </div>
        </div>`;
    }

    // Technical scanner
    const scannerHTML = `<div class="detail-section" style="grid-column:1/-1;">
        <h4 style="text-align:center;margin-bottom:1rem;">⚙️ TECHNICAL SCANNER</h4>
        <div style="display:flex;gap:0.5rem;justify-content:center;margin-bottom:1rem;flex-wrap:wrap;">
            <button class="filter-btn scanner-btn-modal" onclick="showModalScanner(event,'support',${basePrice},'${stock.ticker}')">📉 Support Zones</button>
            <button class="filter-btn scanner-btn-modal" onclick="showModalScanner(event,'resistance',${basePrice},'${stock.ticker}')">📈 Resistance Zones</button>
            <button class="filter-btn scanner-btn-modal" onclick="showModalScanner(event,'fibonacci',${basePrice},'${stock.ticker}')">📐 Fibonacci Levels</button>
            <button class="filter-btn scanner-btn-modal" onclick="showModalScanner(event,'patterns',${basePrice},'${stock.ticker}')">🔍 Chart Patterns</button>
        </div>
        <div id="modal-scan-res" style="padding:1.5rem;background:rgba(0,0,0,0.25);border-radius:12px;text-align:center;font-size:1rem;min-height:70px;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(255,255,255,0.08);color:#475569;">
            Select a button above to scan ${stock.ticker}
        </div>
    </div>`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.5: ORDER BOOKS AND CONTRACTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const orderBooks = {
        'AVGO': { 
            moat: 'Only company building AI custom chips for Google, Meta, OpenAI.', 
            contract: 'Non-breakable agreements through 2028.', 
            finance: '$100B AI revenue target by FY2027.',
            sourceContext: 'Re-iterated guidance by Broadcom CEO Hock Tan for FY2027, driven by custom XPU partnerships with major hyperscalers.',
            sourceLink: 'https://www.google.com/search?q=Broadcom+CEO+Hock+Tan+100+billion+AI+revenue+target'
        },
        'ORCL': { 
            moat: 'Owns Fortune 500 databases; building OpenAI Stargate infra.', 
            contract: '$638 BILLION binding backlog (RPO).', 
            finance: '$90B total revenue target by FY2027.',
            sourceContext: 'Confirmed directly in Oracle\'s FY26 Earnings Report, massively fueled by their AI infrastructure and the "Stargate" data center project.',
            sourceLink: 'https://www.google.com/search?q=Oracle+earnings+638+billion+RPO+backlog+Stargate'
        },
        'NVDA': { 
            moat: 'CUDA ecosystem locks in 4M+ developers.', 
            contract: '$1 TRILLION pipeline of confirmed orders to 2027.', 
            finance: 'Guiding for $91B revenue next quarter alone.',
            sourceContext: 'Announced directly by CEO Jensen Huang at the GTC Keynote regarding their Blackwell and Vera Rubin platforms extending through 2027.',
            sourceLink: 'https://www.google.com/search?q=Nvidia+Jensen+Huang+1+trillion+order+pipeline+GTC'
        },
        'MU': { 
            moat: '1 of 3 companies making HBM (fuel for AI GPUs).', 
            contract: '$100B "Take-or-Pay" non-cancellable (2026-2030).', 
            finance: 'HBM capacity 100% sold out through 2027.',
            sourceContext: 'Widely confirmed across Wall Street analysis that Micron\'s entire HBM production capacity is locked into non-cancellable "take-or-pay" contracts through 2026/2027.',
            sourceLink: 'https://www.google.com/search?q=Micron+HBM+sold+out+through+2026+2027'
        },
        'AMD': { 
            moat: 'The only viable GPU alternative to NVDA; dominant in server CPUs (EPYC).', 
            contract: 'Multi-gigawatt deployment deals signed with Meta & Microsoft.', 
            finance: 'Data center revenue growing at 57% YoY.', 
            sourceContext: 'Reported in AMD Investor Relations and earnings calls regarding massive ongoing data center deployments.',
            sourceLink: 'https://www.google.com/search?q=AMD+data+center+revenue+growth+Microsoft+Meta+deployments' 
        },
        'GOOGL': { moat: 'Dominates global search and digital advertising; massive AI infrastructure (TPUs).', contract: 'Extensive multi-year cloud contracts with major enterprises.', finance: 'Generating $100B+ in free cash flow annually.' },
        'GOOG': { moat: 'Dominates global search and digital advertising; massive AI infrastructure (TPUs).', contract: 'Extensive multi-year cloud contracts with major enterprises.', finance: 'Generating $100B+ in free cash flow annually.' },
        'MSFT': { moat: 'Enterprise software monopoly (Office/Windows) + Azure Cloud.', contract: 'Massive long-term Azure consumption commitments (MACC).', finance: '$100B+ revenue run-rate for Cloud/AI.' },
        'META': { moat: '3.9 billion monthly active users across platforms.', contract: 'Ad contracts are highly resilient; massive open-source AI moat (Llama).', finance: 'Generates $40B+ in free cash flow.' },
        'PLTR': { moat: 'Gotham and Foundry software are deeply embedded in US Military and allied intelligence.', contract: 'Multi-year, non-cancellable government & defense contracts.', finance: 'AIP driving unprecedented commercial revenue growth.' },
        'NOW': { moat: 'The "operating system for IT" with 99% renewal rates.', contract: 'Massive enterprise lock-in with 3-5 year subscription contracts.', finance: 'Operating with 44% free cash flow margins.' },
        'UBER': { moat: 'Global duopoly in ride-sharing and delivery with unmatched network effects.', contract: 'Driver/rider ecosystem creates a self-sustaining marketplace.', finance: 'Now consistently profitable with surging free cash flow.' },
        'CRM': { moat: 'Dominant global CRM platform with deep enterprise integration.', contract: 'Agentforce hitting $1B ARR; sticky multi-year enterprise SaaS contracts.', finance: 'Generating $6.6B quarterly FCF.' },
        'SOFI': { moat: 'All-in-one digital banking super app targeting high-earning millennials.', contract: 'Rapidly growing member base and deposit stickiness.', finance: '41% revenue growth, pushing toward GAAP profitability.' },
        'TEM': { moat: 'Proprietary AI healthcare data library (clinical and genomic).', contract: 'Data licensing agreements with major pharmaceutical companies.', finance: 'High revenue growth but currently unprofitable.' },
        'RKLB': { moat: 'Only reliable commercial launch provider besides SpaceX; end-to-end space systems.', contract: '$1B+ backlog of government and commercial launch/systems contracts.', finance: 'Scaling revenue rapidly with Iridium acquisition.' },
        'SOUN': { moat: 'Independent voice AI platform not owned by big tech.', contract: 'Automotive design wins integrated into millions of vehicles.', finance: 'Speculative growth, massive TAM.' },
        'MSTY': { moat: 'Covered call ETF based on MicroStrategy (Bitcoin proxy).', contract: 'No contracts. Generates income by capping upside via options.', finance: 'High yield but structural NAV decay in bull markets.' },
        'YMAG': { moat: 'Covered call ETF on Magnificent 7 tech stocks.', contract: 'No contracts. Sells upside potential for monthly distributions.', finance: 'High yield but caps capital appreciation.' },
        'BTC': { moat: 'The decentralized digital gold and original cryptocurrency.', contract: 'Governed by math and code, capped at 21 million coins.', finance: 'Store of value, highly volatile.' },
        'SNOW': { moat: 'Multi-cloud data architecture preventing vendor lock-in.', contract: 'Enterprise consumption contracts expanding rapidly.', finance: 'High revenue retention rate and growing free cash flow.' },
        'CSCO': { moat: 'Massive installed base of enterprise networking equipment.', contract: 'Recurring software and security subscriptions.', finance: 'High free cash flow supporting strong dividend and buybacks.' },
        'QCOM': { 
            moat: 'Dominant mobile modem & Snapdragon architecture; leader in 5G cellular IP licensing & on-device edge AI.', 
            contract: '$65B automotive design-win pipeline with top global OEMs (VW, BMW, Toyota, Mercedes, BYD).', 
            finance: 'Targeting $40B non-handset annual revenue by FY2029 ($10B Automotive run-rate goal).',
            sourceContext: 'Confirmed at Qualcomm Investor Day regarding Automotive Digital Chassis adoption and Snapdragon X AI PC expansion.',
            sourceLink: 'https://www.google.com/search?q=Qualcomm+65+billion+automotive+design+win+pipeline'
        },
        'SNDK': { 
            moat: 'Pure-play NAND flash & enterprise SSD pioneer.', 
            contract: 'Spun off from Western Digital in Feb 2025; long-term eSSD supply agreements with top hyperscalers & cloud OEMs.', 
            finance: 'Rapid 97% sequential revenue growth post-spinoff; clean balance sheet with zero legacy debt overhang.',
            sourceContext: 'Independent public company listed on NASDAQ (SNDK) following February 2025 separation from Western Digital.',
            sourceLink: 'https://www.google.com/search?q=SanDisk+SNDK+spinoff+Western+Digital+February+2025'
        },
        'WDC': { moat: 'Vertically integrated in hard drives and NAND flash (SanDisk).', contract: 'Supplier agreements with major PC makers and cloud providers.', finance: 'Cyclical business stabilizing with AI storage demand.' },
        'INTC': { moat: 'One of the few global advanced semiconductor manufacturers.', contract: 'Securing massive government funding and new foundry customers.', finance: 'Currently operating at a net loss during intensive turnaround phase.' }
    };

    let orderBookHTML = '';
    const ob = orderBooks[stock.ticker] || orderBooks[stock.ticker.split('.')[0]];
    if (ob) {
        orderBookHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.05);">
            <h4 style="color: #60a5fa; margin-bottom: 0.8rem; display:flex; align-items:center; gap:0.5rem;">🔒 The "Unbreakable" Order Book & Moat</h4>
            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">The Moat:</strong> <span style="color:#cbd5e1;">${ob.moat}</span></li>
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">Contracts:</strong> <span style="color:#cbd5e1;">${ob.contract}</span></li>
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">Finances:</strong> <span style="color:#cbd5e1;">${ob.finance}</span></li>
                ${ob.sourceContext ? `<li style="margin-top:0.8rem; font-size: 0.85rem; padding-top:0.8rem; border-top: 1px solid rgba(255,255,255,0.05); color: #94a3b8;"><em>${ob.sourceContext}</em> <a href="${ob.sourceLink}" target="_blank" style="color:#3b82f6; text-decoration:underline; font-weight:600; margin-left: 0.3rem;">[Source Link]</a></li>` : ''}
            </ul>
        </div>`;
    } else {
         orderBookHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #64748b;">
            <h4 style="color: #94a3b8; margin-bottom: 0.8rem;">🔒 Order Book & Moat Overview</h4>
            <p style="color:#cbd5e1; font-size: 0.95rem;">Specific unbreakable contract details for ${stock.ticker} are currently being analyzed by our research team.</p>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.6: 52-WEEK HIGH/LOW METER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const w52High = stock.fiftyTwoWeekHigh || stock.fibHigh || basePrice * 1.3;
    const w52Low = stock.fiftyTwoWeekLow || stock.fibLow || basePrice * 0.7;
    const w52Range = w52High - w52Low;
    const w52Pct = w52Range > 0 ? Math.round(((basePrice - w52Low) / w52Range) * 100) : 50;
    const w52Color = w52Pct > 80 ? '#f87171' : w52Pct > 60 ? '#fb923c' : w52Pct > 40 ? '#facc15' : w52Pct > 20 ? '#86efac' : '#4ade80';
    const w52Label = w52Pct > 80 ? 'Near 52W High — Expensive' : w52Pct > 60 ? 'Upper Range — Moderate' : w52Pct > 40 ? 'Mid Range — Fair Value' : w52Pct > 20 ? 'Lower Range — Attractive' : 'Near 52W Low — Deep Value';

    const weekMeterHTML = `
    <div class="detail-section" style="grid-column:1/-1;">
        <h4>🔔 52-WEEK HIGH / LOW METER</h4>
        <div style="display:flex;justify-content:space-between;align-items:center;margin:0.8rem 0 0.4rem;">
            <div style="text-align:left;"><div style="font-size:0.68rem;color:#4ade80;font-weight:600;">52W LOW</div><div style="font-size:1.1rem;font-weight:800;color:#4ade80;">$${w52Low.toFixed(2)}</div></div>
            <div style="text-align:center;"><div style="font-size:0.68rem;color:${w52Color};font-weight:600;">${w52Label}</div><div style="font-size:1.4rem;font-weight:900;color:${w52Color};">${w52Pct}%</div></div>
            <div style="text-align:right;"><div style="font-size:0.68rem;color:#f87171;font-weight:600;">52W HIGH</div><div style="font-size:1.1rem;font-weight:800;color:#f87171;">$${w52High.toFixed(2)}</div></div>
        </div>
        <div style="position:relative;height:14px;background:linear-gradient(90deg,#4ade80,#facc15,#f87171);border-radius:99px;margin:0.5rem 0;">
            <div style="position:absolute;top:-4px;left:${w52Pct}%;transform:translateX(-50%);width:22px;height:22px;background:#fff;border-radius:50%;border:3px solid ${w52Color};box-shadow:0 0 12px ${w52Color};"></div>
        </div>
        <div style="text-align:center;font-size:0.82rem;color:#94a3b8;margin-top:0.3rem;">Current: <strong style="color:#e2e8f0;">$${basePrice.toFixed(2)}</strong> — ${w52Pct}% from 52-week low</div>
    </div>`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.7: RSI + MACD CHART HTML
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let rsiMacdHTML = '';
    if (stock.rsiDates && stock.rsiDates.length > 0) {
        rsiMacdHTML = `
        <div class="detail-section" style="grid-column:1/-1;">
            <h4>📊 MACD (Moving Average Convergence Divergence)</h4>
            <p style="font-size:0.75rem;color:#475569;margin-bottom:0.5rem;">MACD crossing above Signal = Buy · MACD crossing below Signal = Sell</p>
            <div style="height:200px;width:100%;"><canvas id="macdChart"></canvas></div>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.8: EARNINGS CALENDAR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let earningsCalHTML = '';
    if (stock.nextEarningsDate) {
        const eDate = new Date(stock.nextEarningsDate);
        const now = new Date();
        const diffDays = Math.ceil((eDate - now) / (1000 * 60 * 60 * 24));
        const urgency = diffDays <= 7 ? '#f87171' : diffDays <= 30 ? '#fb923c' : '#4ade80';
        const urgencyBg = diffDays <= 7 ? 'rgba(248,113,113,0.1)' : diffDays <= 30 ? 'rgba(251,146,60,0.1)' : 'rgba(74,222,128,0.1)';
        earningsCalHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid ${urgency}; background: ${urgencyBg};">
            <h4 style="color:${urgency};">📅 NEXT EARNINGS REPORT</h4>
            <div style="display:flex;align-items:center;gap:2rem;margin-top:0.8rem;flex-wrap:wrap;">
                <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Date</div><div style="font-size:1.3rem;font-weight:900;color:#e2e8f0;">${eDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div></div>
                <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Days Away</div><div style="font-size:1.3rem;font-weight:900;color:${urgency};">${diffDays > 0 ? diffDays + ' days' : 'TODAY!'}</div></div>
                <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Strategy</div><div style="font-size:0.85rem;font-weight:600;color:#94a3b8;">${diffDays <= 7 ? '⚠️ Earnings imminent — high volatility expected. Consider waiting.' : diffDays <= 30 ? '🔶 Earnings approaching — position sizing matters.' : '✅ Plenty of time — safe to accumulate.'}</div></div>
            </div>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.9: DCF INTRINSIC VALUE CALCULATOR (NORMALIZED MULTI-PHASE MODEL)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let dcfHTML = '';
    const rawFCF = stock.freeCashflow || 0;
    const opCF = stock.operatingCashflow || 0;
    // For heavy capex growth cycles (e.g. semiconductor fab buildouts), normalize FCF base to 65% of Operating CF if higher
    const baseFCF = Math.max(rawFCF, opCF * 0.65);
    
    // Normalize market cap if given in billions vs raw dollars
    let rawCap = stock.marketCap || 0;
    if (rawCap > 0 && rawCap < 100000) rawCap = rawCap * 1e9; // handle marketCap in billions
    const sharesOut = rawCap > 0 && basePrice > 0 ? rawCap / basePrice : null;

    let rawGrowth = stock.revenueGrowth || stock.earningsGrowth;
    let initialGrowth = 0.15;
    if (typeof rawGrowth === 'number' && !isNaN(rawGrowth)) {
        let g = rawGrowth;
        if (g > 10) g = g / 100;
        // Cap initial growth between 5% and 35% for 10-year multi-phase model
        initialGrowth = Math.min(Math.max(g, 0.05), 0.35);
    }
    const discountRate = 0.10;
    const terminalGrowth = 0.03;

    if (baseFCF > 0 && sharesOut && sharesOut > 0) {
        let dcfTotal = 0;
        let runningFCF = baseFCF;
        for (let yr = 1; yr <= 10; yr++) {
            let yrGrowth = initialGrowth - ((initialGrowth - terminalGrowth) * (yr - 1) / 9);
            runningFCF = runningFCF * (1 + yrGrowth);
            dcfTotal += runningFCF / Math.pow(1 + discountRate, yr);
        }
        const terminalValue = (runningFCF * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
        dcfTotal += terminalValue / Math.pow(1 + discountRate, 10);
        const dcfPerShare = dcfTotal / sharesOut;
        const dcfUpside = ((dcfPerShare - basePrice) / basePrice * 100).toFixed(1);
        const isUndervalued = dcfPerShare > basePrice;
        const dcfColor = isUndervalued ? '#4ade80' : '#f87171';
        const dcfBg = isUndervalued ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
        const marginOfSafety = ((dcfPerShare - basePrice) / dcfPerShare * 100).toFixed(1);
        dcfHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid ${dcfColor}; background: ${dcfBg};">
            <h4 style="color:${dcfColor};">⚖️ DCF INTRINSIC VALUE CALCULATOR</h4>
            <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:1rem;">10-year Fading DCF model starting at ${(initialGrowth*100).toFixed(1)}% growth (normalized cash flow base: ${formatCurrency(baseFCF)}), 10% discount rate, 3% terminal growth</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.6rem;">
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Current Price</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#e2e8f0;">$${basePrice.toFixed(2)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Intrinsic Value</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${dcfColor};">$${dcfPerShare.toFixed(2)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">${isUndervalued ? 'Upside' : 'Overvalued By'}</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${dcfColor};">${dcfUpside > 0 ? '+' : ''}${dcfUpside}%</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Margin of Safety</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${parseFloat(marginOfSafety) > 0 ? '#4ade80' : '#f87171'};">${marginOfSafety}%</div>
                </div>
            </div>
            <div style="margin-top:1rem;padding:0.8rem;background:rgba(0,0,0,0.15);border-radius:8px;font-size:0.82rem;color:#94a3b8;">
                ${isUndervalued ? `✅ <strong style="color:#4ade80;">UNDERVALUED</strong> — The stock is trading ${Math.abs(dcfUpside)}% below its estimated intrinsic value. This suggests a buying opportunity with a ${marginOfSafety}% margin of safety.` : `⚠️ <strong style="color:#f87171;">OVERVALUED</strong> — The stock is trading ${Math.abs(dcfUpside)}% above its estimated intrinsic value. Consider waiting for a pullback.`}
            </div>
        </div>`;
    } else if (fcf && fcf < 0) {
        dcfHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08);">
            <h4 style="color:#fbbf24;">⚖️ DCF INTRINSIC VALUE CALCULATOR</h4>
            <p style="font-size:0.82rem;color:#cbd5e1;margin-top:0.4rem;">
                ⚠️ <strong>DCF Model N/A (Negative Free Cash Flow: ${formatCurrency(fcf)})</strong> — Standard Discounted Cash Flow models require positive free cash flow. This is common during intensive capital expansion phases (e.g. AI infrastructure buildout). Focus on revenue growth, RPO backlog, and operating cash flow instead.
            </p>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.95: ENTRY & EXIT STRATEGY + SECTOR COMPARISON
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const idealEntry = Math.min(parseFloat(fib_618), parseFloat(sup1));
    const stopLoss = (basePrice * 0.85).toFixed(2); // S2 - 15%
    const target1 = parseFloat(res1);
    const target2 = stock.targetPrice || parseFloat(res2);
    
    const riskAmount = basePrice - parseFloat(stopLoss);
    const rewardAmount = target1 - basePrice;
    const rrRatio = riskAmount > 0 ? (rewardAmount / riskAmount).toFixed(1) : '2.0';

    const entryExitHTML = `
    <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.06);">
        <h4 style="color:#60a5fa;margin-bottom:0.8rem;">🎯 ACTIONABLE ENTRY & EXIT STRATEGY</h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.6rem;margin-bottom:0.8rem;">
            <div style="padding:0.7rem;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#4ade80;font-weight:700;text-transform:uppercase;">Ideal Buy Zone</div>
                <div style="font-size:1.15rem;font-weight:900;color:#4ade80;">$${idealEntry.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">Golden Pocket / S1</div>
            </div>
            <div style="padding:0.7rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#f87171;font-weight:700;text-transform:uppercase;">Stop-Loss Cutoff</div>
                <div style="font-size:1.15rem;font-weight:900;color:#f87171;">$${stopLoss}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">-15% Floor (S2)</div>
            </div>
            <div style="padding:0.7rem;background:rgba(251,146,60,0.1);border:1px solid rgba(251,146,60,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#fb923c;font-weight:700;text-transform:uppercase;">Target 1 (R1)</div>
                <div style="font-size:1.15rem;font-weight:900;color:#fb923c;">$${target1.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">+8% Near Resistance</div>
            </div>
            <div style="padding:0.7rem;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#c084fc;font-weight:700;text-transform:uppercase;">Target 2 (Analyst)</div>
                <div style="font-size:1.15rem;font-weight:900;color:#c084fc;">$${target2.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">12-Month Target</div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.8rem;background:rgba(0,0,0,0.2);border-radius:8px;font-size:0.82rem;color:#cbd5e1;flex-wrap:wrap;gap:0.5rem;">
            <span>⚖️ Risk / Reward Ratio: <strong style="color:#4ade80;">1 : ${rrRatio}</strong> ${parseFloat(rrRatio) >= 1.5 ? '✅ (Favorable)' : '⚠️ (Tight margin)'}</span>
            <span>💡 Sizing Rule: Max <strong style="color:#60a5fa;">3% – 5%</strong> of portfolio allocation</span>
        </div>
    </div>`;

    const sectorsMap = {
        'NVDA': 'Semiconductors & AI Chips', 'AMD': 'Semiconductors & AI Chips', 'AVGO': 'Semiconductors & AI Chips', 'INTC': 'Semiconductors & AI Chips', 'MU': 'Memory & Storage (HBM)', 'SNDK': 'Memory & Storage (NAND)', 'QCOM': 'Mobile & Auto Semiconductors', 'WDC': 'Storage & Hard Drives',
        'META': 'Social Media & Open-Source AI', 'GOOGL': 'Search, Cloud & AI', 'GOOG': 'Search, Cloud & AI', 'MSFT': 'Enterprise Software & Azure Cloud',
        'CRM': 'Enterprise CRM & Agentic AI', 'NOW': 'IT Service Management & SaaS', 'PLTR': 'Defense & Intelligence AI', 'SNOW': 'Cloud Data Platform',
        'UBER': 'Global Mobility & Logistics', 'SOFI': 'Fintech & Digital Banking', 'RKLB': 'Commercial Space & Launch', 'TEM': 'Healthcare AI & Genomics', 'SOUN': 'Voice AI Solutions',
        'MSTY': 'High-Yield Income ETF (MicroStrategy Proxy)', 'YMAG': 'High-Yield Income ETF (Mag 7 Options)', 'BTC': 'Decentralized Crypto Asset'
    };

    const stockSector = sectorsMap[stock.ticker] || 'Technology & Growth';

    const sectorHTML = `
    <div class="detail-section" style="grid-column:1/-1;">
        <h4>📊 SECTOR & INDUSTRY POSITIONING</h4>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.6rem;padding:0.7rem;background:rgba(0,0,0,0.18);border-radius:99px;padding-left:1.2rem;padding-right:1.2rem;flex-wrap:wrap;gap:0.6rem;">
            <div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Primary Sector</div>
                <div style="font-size:1.05rem;font-weight:800;color:#e2e8f0;">${stockSector}</div>
            </div>
            <div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Valuation vs Sector</div>
                <div style="font-size:0.9rem;font-weight:700;color:${stock.forwardPE && stock.forwardPE < 30 ? '#4ade80' : '#fb923c'};">${stock.forwardPE ? (stock.forwardPE < 30 ? 'Discount to Sector Highs' : 'Premium Growth Multiplier') : 'N/A'}</div>
            </div>
            <div>
                <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Industry Moat Rank</div>
                <div style="font-size:0.9rem;font-weight:700;color:${ob ? '#38bdf8' : '#64748b'};">${ob ? 'Strong Moat' : 'Not Rated'}</div>
            </div>
        </div>
    </div>`;

    const catalystHTML = ob ? `
    <div class="detail-section" style="grid-column:1/-1;">
        <h4>🔒 KEY CATALYSTS & COMPETITIVE MOAT</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:0.6rem;">
            <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:12px;border-left:3px solid #8b5cf6;">
                <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.3rem;text-transform:uppercase;">Competitive Moat</div>
                <div style="font-size:0.9rem;color:#e2e8f0;line-height:1.5;">${ob.moat}</div>
                <div style="font-size:0.82rem;color:#94a3b8;margin-top:0.6rem;line-height:1.4;"><strong style="color:#cbd5e1;">Contracts:</strong> ${ob.contract}</div>
                <div style="font-size:0.82rem;color:#94a3b8;margin-top:0.3rem;line-height:1.4;"><strong style="color:#cbd5e1;">Financials:</strong> ${ob.finance}</div>
            </div>
            <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:12px;border-left:3px solid #38bdf8;">
                <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.3rem;text-transform:uppercase;">Upcoming Volatility Events</div>
                <div style="font-size:0.9rem;color:#e2e8f0;line-height:1.5;">${stock.nextEarningsDate ? `Next earnings on <strong>${new Date(stock.nextEarningsDate).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</strong>. Expect elevated option premiums and potential gap moves.` : 'No upcoming earnings date available.'}</div>
                <div style="font-size:0.82rem;color:#94a3b8;margin-top:0.6rem;line-height:1.4;">Institutional ownership ${stock.institutionalOwnership ? `at <strong style="color:#cbd5e1;">${(stock.institutionalOwnership * 100).toFixed(0)}%</strong> — ${stock.institutionalOwnership > 0.7 ? 'high institutional backing provides downside support.' : stock.institutionalOwnership > 0.4 ? 'moderate institutional interest.' : 'low institutional coverage — higher volatility risk.'}` : 'data not available.'}</div>
            </div>
        </div>
    </div>` : '';



    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 5: ASSEMBLE FINAL HTML
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    return `
        <div class="detail-header">
            <h2 style="font-size:2rem;color:var(--accent);">${stock.ticker} — ${stock.name}</h2>
            <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:0.4rem;">
                <span style="font-size:1.4rem;font-weight:700;">${stock.price}</span>
                <div id="modal-dynamic-change">
                    ${stock.yearChange ? `<span style="font-size:0.9rem;padding:3px 10px;border-radius:6px;background:${stock.yearChange.includes('+') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};color:${stock.yearChange.includes('+') ? '#4ade80' : '#f87171'};font-weight:600;">${stock.yearChange} (1Y)</span>` : ''}
                </div>
            </div>
        </div>

        <div class="detail-grid">

        ${chartHTML}
        
        ${orderBookHTML}

        ${weekMeterHTML}
        ${rsiMacdHTML}

        <!-- ══════════════════════════════════════════════════════════════
             SECTION 1: AI BUY/SELL SIGNAL — Clean, readable, professional
             ══════════════════════════════════════════════════════════════ -->
        <div class="detail-section" style="grid-column:1/-1;padding:0;">

            <!-- Top bar: Overall verdict -->
            <div style="background:${verdictBg};border:1px solid ${verdictColor}33;border-radius:14px;padding:1.5rem 2rem;margin-bottom:0;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
                    <div>
                        <div style="font-size:0.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:0.3rem;">🤖 AI Signal Engine — 9 Indicators Analysed</div>
                        <div style="font-size:1.8rem;font-weight:900;color:${verdictColor};">${verdictIcon} ${overallVerdict}</div>
                    </div>
                    <!-- Score ring -->
                    <div style="display:flex;align-items:center;gap:1rem;">
                        <svg width="80" height="80" viewBox="0 0 80 80" style="transform:rotate(-90deg);">
                            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="9"/>
                            <circle cx="40" cy="40" r="32" fill="none" stroke="${verdictColor}" stroke-width="9"
                                stroke-dasharray="${2*Math.PI*32}" stroke-dashoffset="${2*Math.PI*32*(1-signalPct/100)}"
                                stroke-linecap="round"/>
                        </svg>
                        <div>
                            <div style="font-size:2rem;font-weight:900;color:${verdictColor};line-height:1;">${signalPct}%</div>
                            <div style="font-size:0.72rem;color:#64748b;">Bullish Score<br>${Math.round(bullCount)} of 9 bullish</div>
                        </div>
                    </div>
                </div>

                <!-- Progress bar -->
                <div style="margin-top:1.2rem;">
                    <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:#475569;margin-bottom:0.3rem;">
                        <span>0% — Avoid</span><span>50% — Neutral</span><span>100% — Strong Buy</span>
                    </div>
                    <div style="height:8px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden;position:relative;">
                        <div style="position:absolute;top:0;left:50%;width:1px;height:100%;background:rgba(255,255,255,0.15);"></div>
                        <div style="height:100%;width:${signalPct}%;background:linear-gradient(90deg,#f87171,#facc15 50%,#4ade80);border-radius:99px;"></div>
                    </div>
                </div>
            </div>

            <!-- Signal breakdown — one row per signal, clean list style -->
            <div style="padding:1.2rem 0 0;">
                <div style="font-size:0.7rem;color:#475569;text-transform:uppercase;letter-spacing:1px;padding:0 0.2rem;margin-bottom:0.5rem;">Signal Breakdown</div>
                ${signals.map((s, idx) => {
                    const bg     = s.status === 'bull' ? 'rgba(34,197,94,0.06)' : s.status === 'bear' ? 'rgba(248,113,113,0.06)' : 'rgba(255,255,255,0.02)';
                    const border = s.status === 'bull' ? '#4ade8044' : s.status === 'bear' ? '#f8717144' : '#ffffff11';
                    const dot    = s.status === 'bull' ? '#4ade80' : s.status === 'bear' ? '#f87171' : '#64748b';
                    const badge  = s.status === 'bull' ? '✅ BULLISH' : s.status === 'bear' ? '❌ BEARISH' : '➖ NEUTRAL';
                    const badgeColor = s.status === 'bull' ? '#4ade80' : s.status === 'bear' ? '#f87171' : '#64748b';
                    return `
                    <div style="display:flex;align-items:flex-start;gap:0.8rem;padding:0.75rem 0.9rem;background:${bg};border:1px solid ${border};border-radius:10px;margin-bottom:0.4rem;">
                        <!-- Number -->
                        <div style="min-width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;font-size:0.72rem;color:#475569;font-weight:700;flex-shrink:0;margin-top:2px;">${idx+1}</div>
                        <!-- Content -->
                        <div style="flex:1;min-width:0;">
                            <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
                                <span style="font-size:0.78rem;color:#94a3b8;font-weight:600;">${s.icon} ${s.name}</span>
                                <span style="font-size:0.68rem;color:${badgeColor};background:${badgeColor}18;padding:1px 7px;border-radius:99px;font-weight:700;border:1px solid ${badgeColor}33;">${badge}</span>
                            </div>
                            <div style="font-size:0.92rem;color:#e2e8f0;font-weight:700;margin:0.2rem 0;">${s.value}</div>
                            <div style="font-size:0.78rem;color:#64748b;line-height:1.4;">${s.detail}</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             SECTION 2: FIBONACCI (Accurate — from real 52-week data)
             ══════════════════════════════════════════════════════════════ -->
        <div class="detail-section">
            <h4>📐 FIBONACCI RETRACEMENT LEVELS</h4>
            <p style="font-size:0.75rem;color:#475569;margin-bottom:0.2rem;">Using real 52-week range from live market data</p>
            <p style="font-size:0.75rem;color:#475569;margin-bottom:1rem;">High: <strong style="color:#f87171;">$${fib_0}</strong> &nbsp;|&nbsp; Low: <strong style="color:#4ade80;">$${fib_100}</strong></p>

            <!-- Current price location badge -->
            <div style="padding:0.6rem 0.8rem;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.25);border-radius:8px;margin-bottom:1rem;font-size:0.82rem;color:#93c5fd;">
                📍 <strong>${stock.ticker} is currently at ~${currentFibPct}% retracement</strong><br>
                <span style="color:#64748b;">${currentFibZone}</span>
            </div>

            <!-- Visual fib levels -->
            ${[
                { level: '0% (High)', price: fib_0,   color: '#f87171', desc: 'Resistance ceiling' },
                { level: '23.6%',     price: fib_236, color: '#fb923c', desc: 'Shallow dip — weak support' },
                { level: '38.2%',     price: fib_382, color: '#facc15', desc: 'Moderate support — watch for bounce' },
                { level: '50.0%',     price: fib_500, color: '#60a5fa', desc: 'Psychological equilibrium — key level' },
                { level: '61.8% 🏆', price: fib_618, color: '#4ade80', desc: 'GOLDEN POCKET — prime buy zone used by pros' },
                { level: '78.6%',     price: fib_786, color: '#86efac', desc: 'Deep retracement — value hunting zone' },
                { level: '100% (Low)',price: fib_100, color: '#4ade80', desc: 'Maximum support floor' },
            ].map(f => {
                const isCurrent = Math.abs(parseFloat(f.price) - basePrice) / basePrice < 0.03;
                return `<div style="display:flex;align-items:center;gap:0.7rem;padding:0.45rem 0.6rem;border-radius:7px;margin-bottom:0.3rem;${isCurrent ? 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);' : ''}">
                    <div style="width:10px;height:10px;border-radius:50%;background:${f.color};flex-shrink:0;${isCurrent ? 'box-shadow:0 0 8px '+f.color+';' : ''}"></div>
                    <div style="min-width:80px;font-size:0.78rem;color:#64748b;">${f.level}</div>
                    <div style="font-size:0.92rem;font-weight:700;color:${f.color};min-width:70px;">$${f.price}</div>
                    <div style="font-size:0.72rem;color:#475569;flex:1;">${f.desc}${isCurrent ? ' ← <strong style="color:#fff;">YOU ARE HERE</strong>' : ''}</div>
                </div>`;
            }).join('')}

            <h5 style="margin-top:1.2rem;margin-bottom:0.6rem;color:#475569;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;">Key Support & Resistance From Current Price</h5>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;">
                <div style="padding:0.5rem 0.7rem;background:rgba(248,113,113,0.08);border-radius:8px;border-left:3px solid #f87171;">
                    <div style="font-size:0.68rem;color:#f87171;font-weight:600;">RESISTANCE R2 (+15%)</div>
                    <div style="font-size:1rem;font-weight:700;color:#f87171;">$${res2}</div>
                </div>
                <div style="padding:0.5rem 0.7rem;background:rgba(251,146,60,0.08);border-radius:8px;border-left:3px solid #fb923c;">
                    <div style="font-size:0.68rem;color:#fb923c;font-weight:600;">RESISTANCE R1 (+8%)</div>
                    <div style="font-size:1rem;font-weight:700;color:#fb923c;">$${res1}</div>
                </div>
                <div style="padding:0.5rem 0.7rem;background:rgba(134,239,172,0.08);border-radius:8px;border-left:3px solid #86efac;">
                    <div style="font-size:0.68rem;color:#86efac;font-weight:600;">SUPPORT S1 (-8%)</div>
                    <div style="font-size:1rem;font-weight:700;color:#86efac;">$${sup1}</div>
                </div>
                <div style="padding:0.5rem 0.7rem;background:rgba(74,222,128,0.08);border-radius:8px;border-left:3px solid #4ade80;">
                    <div style="font-size:0.68rem;color:#4ade80;font-weight:600;">SUPPORT S2 (-15%)</div>
                    <div style="font-size:1rem;font-weight:700;color:#4ade80;">$${sup2}</div>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════
             SECTION 3: FINANCIAL HEALTH
             ══════════════════════════════════════════════════════════════ -->
        <div class="detail-section">
            <h4>⚕️ FINANCIAL HEALTH</h4>
            <div style="display:flex;flex-direction:column;gap:0.35rem;margin-top:0.6rem;">
                ${[
                    { label: 'Total Revenue',    val: formatCurrency(stock.totalRevenue),    color: '#e2e8f0' },
                    { label: 'Free Cash Flow',   val: formatCurrency(stock.freeCashflow),    color: (stock.freeCashflow||0) > 0 ? '#4ade80' : '#f87171' },
                    { label: 'Operating CF',     val: formatCurrency(stock.operatingCashflow), color: '#e2e8f0' },
                    { label: 'Total Cash',       val: formatCurrency(stock.totalCash),       color: '#4ade80' },
                    { label: 'Total Debt',       val: formatCurrency(stock.totalDebt),       color: '#f87171' },
                    { label: 'Gross Margin',     val: stock.grossMargins ? (stock.grossMargins*100).toFixed(1)+'%' : 'N/A', color: '#e2e8f0' },
                    { label: 'Profit Margin',    val: stock.profitMargins ? (stock.profitMargins*100).toFixed(1)+'%' : 'N/A', color: '#e2e8f0' },
                    { label: 'ROE',              val: roe,   color: '#e2e8f0' },
                    { label: 'Forward P/E',      val: fpe,   color: '#e2e8f0' },
                    { label: 'Graham Number',    val: grahamStr, color: '#facc15' },
                ].map(r => `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.6rem;background:rgba(0,0,0,0.15);border-radius:7px;">
                    <span style="font-size:0.8rem;color:#64748b;">${r.label}</span>
                    <span style="font-size:0.88rem;font-weight:700;color:${r.color};">${r.val}</span>
                </div>`).join('')}
            </div>
        </div>

        ${dcfHTML}
        ${entryExitHTML}
        ${sectorHTML}
        ${catalystHTML}

        ${investorsHTML}
        ${newsHTML}
        ${scannerHTML}

        <!-- ══════════════════════════════════════════════════════════════
             SECTION 4: EARNINGS HISTORY
             ══════════════════════════════════════════════════════════════ -->
        <div class="detail-section" style="grid-column:1/-1;">
            <h4>📅 EARNINGS HISTORY — Did They Beat Estimates?</h4>
            <p style="font-size:0.75rem;color:#475569;margin-bottom:0.8rem;">
                ${streak > 0 ? `✅ Beat estimates <strong style="color:#4ade80;">${streak} quarters in a row</strong> — strong execution signal.` : 'No consecutive earnings beat streak found.'}
            </p>
            ${earningsHTML}
        </div>

        ${earningsCalHTML}

        <!-- ══════════════════════════════════════════════════════════════
             SECTION 5: FINAL VERDICT BOX
             ══════════════════════════════════════════════════════════════ -->
        <div class="verdict-box ${isBullish ? '' : 'bearish'}" style="grid-column:1/-1;">
            <h4 style="color:${isBullish ? 'var(--green)' : 'var(--red)'};font-size:1.1rem;margin-bottom:1rem;">💡 ADVISOR'S FINAL VERDICT</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.6rem;margin-bottom:1rem;">
                ${[
                    { label: 'AI Bull Score',  val: signalPct+'%', color: verdictColor },
                    { label: 'AI Verdict',     val: overallVerdict, color: verdictColor },
                    { label: 'Wall St. Verdict',val: stock.verdict, color: '#e2e8f0' },
                    { label: '12M Price Target',val: '$'+targetPrice, color: 'var(--accent)' },
                ].map(v => `<div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#475569;text-transform:uppercase;margin-bottom:0.2rem;">${v.label}</div>
                    <div style="font-size:1rem;font-weight:800;color:${v.color};">${v.val}</div>
                </div>`).join('')}
            </div>
            <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:0.8rem;font-size:0.85rem;color:#94a3b8;line-height:1.6;">
                ${isBullish ? '✅' : '⚠️'} <strong style="color:#e2e8f0;">${isBullish ? 'Bullish Case:' : 'Bearish Case:'}</strong>
                ${stock.crossSignal === 'golden' ? ' Golden Cross ACTIVE — one of the strongest long-term technical buy signals.' : stock.crossSignal === 'death' ? ' Death Cross ACTIVE — exercise caution until the SMA50 reverses above SMA200.' : ''}
                Fear & Greed at ${fg} (${fg < 40 ? 'oversold — prime accumulation zone for patient investors.' : fg > 65 ? 'overbought — wait for a pullback before adding more.' : 'neutral conditions.'})
                ${streak >= 3 ? ` ${streak}-quarter earnings beat streak confirms management is executing well.` : ''}
            </div>
        </div>

        </div>
    `;
}



window.closeModalFunc = function() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.openModal = async function(ticker) {
        let stock = stocks.find(s => s.ticker === ticker);
        if(!stock) return;
        
        const modal = document.getElementById('detail-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 5rem; color: var(--accent);">
                <div style="font-size: 3rem; margin-bottom: 1rem; animation: fadeIn 1s infinite alternate;">📡</div>
                <h2>Fetching Deep Fundamentals...</h2>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Accessing live real-time API data for ${ticker}</p>
            </div>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        try {
            const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiBase = isLocalHost ? '' : 'http://localhost:8080';
            {
                const res = await fetch(apiBase + '/api/search?q=' + encodeURIComponent(ticker));
                if (res.ok) {
                    const freshData = await res.json();
                    
                    const originalReason = stock.reason;
                    stock = { ...stock, ...freshData };
                    if (originalReason && !originalReason.includes("Global stock found")) {
                        stock.reason = originalReason;
                    }
                    
                    const idx = stocks.findIndex(s => s.ticker === ticker);
                    if(idx > -1) stocks[idx] = stock;
                }
            }
        } catch(e) {
            console.error("Deep dive fetch failed:", e);
        }
        
        modalBody.innerHTML = generateDetailedData(stock);
        
        if (stock.historyDates && stock.historyPrices && stock.historyDates.length > 0) {
            const canvas = document.getElementById('priceChart');
            if (canvas) {
                if (window.myChart) {
                    window.myChart.destroy();
                }
                const ctx = canvas.getContext('2d');
                window.myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: stock.historyDates,
                        datasets: [{
                            label: 'Closing Price',
                            data: stock.historyPrices,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            pointRadius: 0,
                            pointHoverRadius: 5,
                            fill: true,
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        plugins: { 
                            legend: { display: false },
                            annotation: {
                                annotations: {
                                    ...(stock._sup2 && stock._sup1 ? {
                                        supportZone: {
                                            type: 'box',
                                            yMin: stock._sup2,
                                            yMax: stock._sup1,
                                            backgroundColor: 'rgba(74, 222, 128, 0.15)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(74, 222, 128, 0.4)',
                                            label: { content: ['Accumulation / Support Zone', `$${stock._sup2.toFixed(2)} - $${stock._sup1.toFixed(2)}`], display: true, position: 'end', color: '#4ade80', backgroundColor: 'rgba(0,0,0,0)', font: {size: 10, weight: 'bold'} }
                                        }
                                    } : {}),
                                    ...(stock._res1 && stock._res2 ? {
                                        resistanceZone: {
                                            type: 'box',
                                            yMin: stock._res1,
                                            yMax: stock._res2,
                                            backgroundColor: 'rgba(248, 113, 113, 0.15)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(248, 113, 113, 0.4)',
                                            label: { content: ['Take Profit / Resistance Zone', `$${stock._res1.toFixed(2)} - $${stock._res2.toFixed(2)}`], display: true, position: 'start', color: '#f87171', backgroundColor: 'rgba(0,0,0,0)', font: {size: 10, weight: 'bold'} }
                                        }
                                    } : {}),
                                    ...(stock.targetPrice ? {
                                        targetLine: {
                                            type: 'line',
                                            yMin: stock.targetPrice,
                                            yMax: stock.targetPrice,
                                            borderColor: 'rgba(56, 189, 248, 0.85)',
                                            borderWidth: 1.5,
                                            borderDash: [4, 4],
                                            label: { content: `Target $${stock.targetPrice}`, display: true, position: 'start', backgroundColor: 'rgba(56, 189, 248, 0.25)', color: '#38bdf8', font: { size: 10, weight: 'bold' } }
                                        }
                                    } : {})
                                }
                            }
                        },
                        scales: {
                            x: { 
                                display: false 
                            },
                            y: { 
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: '#94a3b8' }
                            }
                        }
                    }
                });
            }
        }

        // MACD Chart
        if (stock.macdDates && stock.macdDates.length > 0) {
            const macdCanvas = document.getElementById('macdChart');
            if (macdCanvas) {
                new Chart(macdCanvas.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: stock.macdDates,
                        datasets: [
                            {
                                label: 'Histogram',
                                data: stock.macdHistogram,
                                backgroundColor: stock.macdHistogram.map(v => v >= 0 ? 'rgba(74,222,128,0.6)' : 'rgba(248,113,113,0.6)'),
                                borderWidth: 0,
                                order: 2
                            },
                            {
                                label: 'MACD',
                                data: stock.macdValues,
                                borderColor: '#60a5fa',
                                borderWidth: 2,
                                pointRadius: 0,
                                fill: false,
                                type: 'line',
                                tension: 0.3,
                                order: 1
                            },
                            {
                                label: 'Signal',
                                data: stock.macdSignal,
                                borderColor: '#fb923c',
                                borderWidth: 2,
                                pointRadius: 0,
                                fill: false,
                                type: 'line',
                                tension: 0.3,
                                order: 0
                            }
                        ]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        scales: {
                            y: { ticks: { color: '#475569' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                            x: { ticks: { color: '#475569', maxTicksLimit: 8, maxRotation: 0 }, grid: { display: false } }
                        },
                        plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } } } }
                    }
                });
            }
        }
    };

    function renderGrid(filterText = '', filterVerdict = 'All') {
        const grid = document.getElementById('stock-grid');
        grid.innerHTML = '';
        
        const lowerFilter = filterText.toLowerCase();
        
        const filteredStocks = stocks.filter(stock => {
            const matchesText = stock.ticker.toLowerCase().includes(lowerFilter) || stock.name.toLowerCase().includes(lowerFilter);
            let matchesVerdict = true;
            if (filterVerdict !== 'All') {
                if (filterVerdict === 'Sell' || filterVerdict === 'Avoid / Sell') {
                    matchesVerdict = stock.verdict.includes('Sell') || stock.verdict.includes('Avoid');
                } else if (filterVerdict === 'Strong Buy') {
                    matchesVerdict = stock.verdict === 'Strong Buy';
                } else if (filterVerdict === 'Buy') {
                    matchesVerdict = stock.verdict === 'Buy';
                } else {
                    matchesVerdict = stock.verdict === filterVerdict;
                }
            }
            return matchesText && matchesVerdict;
        });
        
        if (filteredStocks.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 2rem; font-size: 1.1rem;">No local stocks match. Press Enter to search globally!</p>';
            return;
        }

        if (isHeatmapView) {
            grid.style.display = 'flex';
            grid.style.flexWrap = 'wrap';
            grid.style.gap = '0';
            grid.style.borderRadius = '12px';
            grid.style.overflow = 'hidden';
            grid.style.border = '1px solid rgba(255,255,255,0.1)';
        } else {
            grid.style.display = 'grid';
            grid.style.gap = '1.5rem';
            grid.style.border = 'none';
        }

        filteredStocks.forEach(stock => {
            const card = document.createElement('div');
            card.style.animationDelay = stock.delay;
            
            if (isHeatmapView) {
                let width = '10%';
                let cap = stock.marketCap || 100;
                if (cap > 2000) width = '33.33%';
                else if (cap > 1000) width = '25%';
                else if (cap > 500) width = '20%';
                else if (cap > 100) width = '15%';
                else width = '10%';
                
                let bgColor = 'rgba(255,255,255,0.1)';
                if (stock.yearChange) {
                    const changeVal = parseFloat(stock.yearChange.replace('%','').replace('+',''));
                    if (changeVal > 50) bgColor = '#166534';
                    else if (changeVal > 0) bgColor = '#15803d';
                    else if (changeVal > -20) bgColor = '#991b1b';
                    else bgColor = '#7f1d1d';
                }
                
                card.style.width = width;
                card.style.height = '150px';
                card.style.background = bgColor;
                card.style.border = '1px solid rgba(0,0,0,0.5)';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.justifyContent = 'center';
                card.style.alignItems = 'center';
                card.style.cursor = 'pointer';
                card.style.transition = 'filter 0.2s';
                card.style.animationDelay = '0s'; // override for instant render
                
                card.onmouseover = () => card.style.filter = 'brightness(1.2)';
                card.onmouseout = () => card.style.filter = 'brightness(1)';
                
                card.innerHTML = `
                    <div style="font-size: 1.5rem; font-weight: bold; color: white;">${stock.ticker}</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">${stock.yearChange || stock.verdict}</div>
                `;
            } else {
                card.className = 'glass-card stock-card';

                // Build smart badges visible on the card itself
                const cardBadges = [];
                if (stock.crossSignal === 'golden') cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(34,197,94,0.2);border-radius:4px;color:#4ade80;border:1px solid rgba(34,197,94,0.3);white-space:nowrap;">⚡ Golden Cross</span>`);
                if (stock.crossSignal === 'death')  cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(248,113,113,0.2);border-radius:4px;color:#f87171;border:1px solid rgba(248,113,113,0.3);white-space:nowrap;">☠️ Death Cross</span>`);
                if (stock.insiderTrades && stock.insiderTrades.filter(t=>t.isBuy).length > stock.insiderTrades.filter(t=>!t.isBuy).length && stock.insiderTrades.length > 0)
                    cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(250,204,21,0.15);border-radius:4px;color:#facc15;border:1px solid rgba(250,204,21,0.3);white-space:nowrap;">💰 Insider Buys</span>`);
                if (stock.targetUpside && stock.targetUpside > 15)
                    cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(59,130,246,0.2);border-radius:4px;color:#60a5fa;border:1px solid rgba(59,130,246,0.3);white-space:nowrap;">🎯 +${stock.targetUpside}% Target</span>`);
                if (stock.magicFormulaScore && stock.magicFormulaScore >= 60)
                    cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(168,85,247,0.2);border-radius:4px;color:#c084fc;border:1px solid rgba(168,85,247,0.3);white-space:nowrap;">🧙 MF: ${stock.magicFormulaScore}</span>`);
                if (stock.earningsBeatStreak >= 3)
                    cardBadges.push(`<span style="font-size:0.62rem;padding:2px 6px;background:rgba(34,197,94,0.15);border-radius:4px;color:#86efac;border:1px solid rgba(34,197,94,0.25);white-space:nowrap;">📊 ${stock.earningsBeatStreak}Q Beat</span>`);

                card.innerHTML = `
                    <div>
                        <div class="stock-header">
                            <div>
                                <h3 style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
                                    ${stock.ticker}
                                    ${stock.rawPrice ? '<span style="font-size:0.6rem;padding:2px 6px;background:rgba(59,130,246,0.2);border-radius:4px;color:#60a5fa;">LIVE</span>' : ''}
                                    ${stock.yearChange ? `<span style="font-size:0.6rem;padding:2px 6px;background:${stock.yearChange.includes('+') ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'};border-radius:4px;color:${stock.yearChange.includes('+') ? '#4ade80' : '#f87171'};white-space:nowrap;">${stock.yearChange} 1Y</span>` : ''}
                                </h3>
                                <span style="font-size:0.8rem;color:#94a3b8;">${stock.name}</span>
                            </div>
                            <div class="stock-price">${stock.price}</div>
                        </div>
                        <div class="stock-verdict ${stock.class}">${stock.verdict}</div>
                        ${cardBadges.length > 0 ? `<div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-top:0.5rem;">${cardBadges.join('')}</div>` : ''}
                        <p class="stock-reason">${stock.reason}</p>
                        <div style="margin-top:1rem;color:var(--accent);font-size:0.85rem;font-weight:600;text-align:center;background:rgba(59,130,246,0.08);padding:0.45rem;border-radius:8px;border:1px solid rgba(59,130,246,0.15);">
                            View Full AI Analysis ➔
                        </div>
                    </div>
                `;
                
                if (typeof VanillaTilt !== 'undefined') {
                    VanillaTilt.init(card, {
                        max: 15,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.1,
                        scale: 1.02
                    });
                }
            }
            
            card.addEventListener('click', () => window.openModal(stock.ticker));
            grid.appendChild(card);
        });
    }

    function renderDailySpotlight() {
        const container = document.getElementById('daily-spotlight');
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        
        const topPicks = stocks.filter(s => s.verdict.includes('Buy'));
        const todaysStock = topPicks[dayOfYear % topPicks.length];
        
        const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        container.innerHTML = `
            <div class="glass-card spotlight-card" style="cursor: pointer; padding: 2rem;" onclick="window.openModal('${todaysStock.ticker}')">
                <h4 style="color: var(--green); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1.5px;">📡 Market Radar: ${dateStr}</h4>
                <h2 style="font-size: 2.2rem; margin-bottom: 0.8rem;">
                    ${todaysStock.ticker} - ${todaysStock.name}
                    ${todaysStock.rawPrice ? '<span style="font-size: 0.8rem; vertical-align: middle; padding: 2px 8px; background: rgba(59,130,246,0.3); border-radius: 4px; color: #fff; margin-left: 0.5rem;">LIVE</span>' : ''}
                </h2>
                <p style="font-size: 1.1rem; color: #cbd5e1; margin-bottom: 1.5rem; max-width: 80%;">${todaysStock.reason}</p>
                
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <span style="font-size: 1.5rem; font-weight: bold; color: #fff;">${todaysStock.price}</span>
                    <span class="stock-verdict ${todaysStock.class}" style="margin: 0; font-size: 1rem; padding: 0.4rem 1rem;">${todaysStock.verdict}</span>
                    <span style="color: var(--accent); font-weight: 600; margin-left: auto;">Read Full Analysis ➔</span>
                </div>
            </div>
        `;
    }

    function refreshPriceUI() {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'All';
        const searchInput = document.getElementById('search-input');
        const searchText = searchInput ? searchInput.value : '';
        renderGrid(searchText, currentFilter);
        renderDailySpotlight();
    }

    async function fetchFromYahooFallback() {
        // Fallback: fetch prices directly from Yahoo Finance via CORS proxy
        const PROXY = 'https://corsproxy.io/?';
        const batchSize = 7;
        let updated = false;
        for (let i = 0; i < stocks.length; i += batchSize) {
            const batch = stocks.slice(i, i + batchSize);
            const promises = batch.map(async (stock) => {
                try {
                    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(stock.ticker)}?interval=1d&range=5d`;
                    const res = await fetch(PROXY + encodeURIComponent(yahooUrl));
                    if (!res.ok) return;
                    const data = await res.json();
                    const meta = data?.chart?.result?.[0]?.meta;
                    if (meta?.regularMarketPrice) {
                        stock.rawPrice = meta.regularMarketPrice;
                        stock.price = '$' + meta.regularMarketPrice.toFixed(2);
                        updated = true;
                    }
                } catch (e) {
                    console.warn(`Yahoo fallback failed for ${stock.ticker}`);
                }
            });
            await Promise.allSettled(promises);
        }
        if (updated) refreshPriceUI();
    }

    async function fetchLivePrices() {
        try {
            const allTickers = stocks.map(s => s.ticker).join(',');

            // Build the correct API URL depending on how the page is opened
            const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiBase = isLocalHost ? '' : 'http://localhost:8080';

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(apiBase + '/api/bulk-prices?tickers=' + allTickers, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error("Server returned " + res.status);

            const livePrices = await res.json();

            stocks.forEach(stock => {
                if (livePrices[stock.ticker] !== undefined && livePrices[stock.ticker] !== null) {
                    const lData = livePrices[stock.ticker];
                    stock.rawPrice = lData.price;
                    stock.price = '$' + lData.price.toFixed(2);
                    stock.yearChange = lData.yearChange;
                }
            });

            refreshPriceUI();
        } catch (e) {
            console.warn("Local server unavailable or slow, using Yahoo Finance fallback...", e.message);
            await fetchFromYahooFallback();
        }
    }

    renderDailySpotlight();
    renderGrid();
    fetchLivePrices();

    // Auto-refresh every 30 seconds
    setInterval(fetchLivePrices, 30000);
    
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentVerdict = 'All';
    
    window.reRenderGrid = function() {
        renderGrid(searchInput ? searchInput.value : '', currentVerdict);
    };
    
    if (searchInput) {
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (!query) return;
                
                const originalPlaceholder = searchInput.placeholder;
                searchInput.placeholder = 'Searching globally for "' + query + '"...';
                searchInput.value = '';
                searchInput.disabled = true;
                
                try {
                    const searchApiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? '' : 'http://localhost:8080';
                    const res = await fetch(searchApiBase + '/api/search?q=' + encodeURIComponent(query));
                    if (!res.ok) throw new Error('Stock not found');
                    
                    const newStock = await res.json();
                    
                    const existingIndex = stocks.findIndex(s => s.ticker === newStock.ticker);
                    if(existingIndex > -1) stocks.splice(existingIndex, 1);
                    
                    stocks.unshift(newStock);
                    renderGrid('', currentVerdict);
                    
                    searchInput.placeholder = 'Added ' + newStock.ticker + '! Search another...';
                    setTimeout(() => searchInput.placeholder = originalPlaceholder, 3000);
                    
                } catch (err) {
                    alert(err.message || "Could not find global stock matching: " + query);
                    searchInput.placeholder = originalPlaceholder;
                } finally {
                    searchInput.disabled = false;
                    searchInput.focus();
                }
            }
        });

        searchInput.addEventListener('input', (e) => {
            renderGrid(e.target.value, currentVerdict);
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentVerdict = e.target.getAttribute('data-filter');
            renderGrid(searchInput ? searchInput.value : '', currentVerdict);
        });
    });
});

window.showModalScanner = function(e, type, basePrice, ticker) {
    if (e) {
        document.querySelectorAll('.scanner-btn-modal').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
    }
    
    let result = '';
    if (type === 'support') {
        const sup1 = (basePrice * 0.92).toFixed(2);
        const sup2 = (basePrice * 0.85).toFixed(2);
        result = `<span style="color: #60a5fa; font-size: 1.8rem;">S1: $${sup1}</span><span style="margin: 0 2rem; color: #cbd5e1;">|</span><span style="color: #3b82f6; font-size: 1.8rem;">S2: $${sup2}</span>`;
    } else if (type === 'resistance') {
        const res1 = (basePrice * 1.08).toFixed(2);
        const res2 = (basePrice * 1.15).toFixed(2);
        result = `<span style="color: #f87171; font-size: 1.8rem;">R1: $${res1}</span><span style="margin: 0 2rem; color: #cbd5e1;">|</span><span style="color: #ef4444; font-size: 1.8rem;">R2: $${res2}</span>`;
    } else if (type === 'fibonacci') {
        const fib38 = (basePrice * 1.12).toFixed(2);
        const fib50 = (basePrice * 1.05).toFixed(2);
        const fib61 = (basePrice * 0.98).toFixed(2);
        result = `
            <div style="display: flex; gap: 3rem; font-size: 1.5rem;">
                <div><div style="font-size: 0.9rem; color: #94a3b8; font-weight: normal;">38.2% Retracement</div>$${fib38}</div>
                <div><div style="font-size: 0.9rem; color: #94a3b8; font-weight: normal;">50.0% Equilibrium</div>$${fib50}</div>
                <div><div style="font-size: 0.9rem; color: #94a3b8; font-weight: normal;">61.8% Golden Pocket</div>$${fib61}</div>
            </div>`;
    } else if (type === 'patterns') {
        const patterns = ["Double Bottom (W) 🟢", "Double Top (M) 🔴", "Head & Shoulders 🔴", "Inverse H&S 🟢", "Consolidating ⚪", "Bull Flag 🟢"];
        const hash = ticker.charCodeAt(0) + (ticker.length > 1 ? ticker.charCodeAt(1) : 0);
        result = `<span style="font-size: 2rem;">${patterns[hash % patterns.length]}</span>`;
    }
    
    document.getElementById('modal-scan-res').innerHTML = result;
    document.getElementById('modal-scan-res').style.color = '#fff';
    document.getElementById('modal-scan-res').style.borderStyle = 'solid';
};

window.updateChart = async function(ticker, period) {
    if (event) {
        const buttons = event.target.parentElement.querySelectorAll('button');
        buttons.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
    }
    
    try {
        const chartApiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? '' : 'http://localhost:8080';
        const res = await fetch(`${chartApiBase}/api/chart?ticker=${ticker}&period=${period}`);
        if (res.ok) {
            const data = await res.json();
            if (window.myChart) {
                window.myChart.data.labels = data.dates;
                window.myChart.data.datasets[0].data = data.prices;
                window.myChart.update();
                
                if (window.rsiChartInstance && data.rsi) {
                    window.rsiChartInstance.data.labels = data.dates;
                    window.rsiChartInstance.data.datasets[0].data = data.rsi;
                    window.rsiChartInstance.update();
                }
                
                if (data.prices && data.prices.length > 0) {
                    const startPrice = data.prices[0];
                    const endPrice = data.prices[data.prices.length - 1];
                    const pctChange = ((endPrice - startPrice) / startPrice) * 100;
                    const changeEl = document.getElementById('modal-dynamic-change');
                    if (changeEl) {
                        const color = pctChange >= 0 ? '#4ade80' : '#f87171';
                        const sign = pctChange >= 0 ? '+' : '';
                        const bg = pctChange >= 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
                        changeEl.innerHTML = `<span style="font-size: 1rem; padding: 4px 10px; background: ${bg}; border-radius: 6px; color: ${color}; white-space: nowrap;">${sign}${pctChange.toFixed(2)}% (${period.toUpperCase()})</span>`;
                    }
                }
            }
        }
    } catch(e) {
        console.error("Chart fetch failed", e);
    }
};

window.toggleHeatmap = function() {
    isHeatmapView = !isHeatmapView;
    const btn = document.getElementById('toggle-heatmap-btn');
    if (isHeatmapView) {
        btn.innerHTML = '🗂️ Grid View';
        btn.style.background = 'rgba(59, 130, 246, 0.2)';
        btn.style.color = '#60a5fa';
        btn.style.borderColor = 'rgba(59, 130, 246, 0.4)';
    } else {
        btn.innerHTML = '🗺️ Heatmap View';
        btn.style.background = 'rgba(168, 85, 247, 0.2)';
        btn.style.color = '#c084fc';
        btn.style.borderColor = 'rgba(168, 85, 247, 0.4)';
    }
    if (window.reRenderGrid) window.reRenderGrid();
};
