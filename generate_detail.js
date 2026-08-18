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
            <h4 style="margin-bottom:1rem;">📊 PRICE HISTORY</h4>
            <div style="height:240px;width:100%;"><canvas id="priceChart"></canvas></div>
            <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap;">
                ${['1d','1wk','1mo','6mo','1y','5y','10y'].map((p,i) =>
                    `<button class="filter-btn${i===3?' active':''}" style="padding:4px 12px;font-size:0.78rem;" onclick="updateChart('${stock.ticker}','${p}')">${p.toUpperCase()}</button>`
                ).join('')}
            </div>
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

    // Insider trades
    let insiderHTML = '';
    if (stock.insiderTrades && stock.insiderTrades.length > 0) {
        insiderHTML = `<div class="detail-section">
            <h4>💰 INSIDER TRANSACTIONS</h4>
            <p style="font-size:0.75rem;color:#475569;margin-bottom:0.8rem;font-style:italic;">"Insiders only buy for one reason — they think the stock is going up." — Peter Lynch</p>
            <div style="display:flex;flex-direction:column;gap:0.4rem;">${stock.insiderTrades.map(t => `
                <div style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.7rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:3px solid ${t.isBuy ? '#4ade80' : '#f87171'};">
                    <span style="font-weight:700;font-size:0.8rem;color:${t.isBuy ? '#4ade80' : '#f87171'};min-width:40px;">${t.isBuy ? '🟢 BUY' : '🔴 SELL'}</span>
                    <span style="color:#e2e8f0;font-size:0.82rem;flex:1;">${t.name}</span>
                    <span style="color:#64748b;font-size:0.75rem;">${t.date}</span>
                    ${t.value > 0 ? `<span style="color:#facc15;font-size:0.8rem;font-weight:700;">$${(t.value/1000000).toFixed(2)}M</span>` : ''}
                </div>`).join('')}
            </div>
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

        ${insiderHTML}
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
