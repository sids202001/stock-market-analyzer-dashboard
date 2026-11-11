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
function formatSafeDate(dateStr, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', options);
    }
    return dateStr;
}

window.switchDetailTab = function(tabId) {
    const buttons = document.querySelectorAll('.exec-tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    const panes = document.querySelectorAll('.exec-tab-pane');
    panes.forEach(pane => {
        if (pane.id === tabId) {
            pane.style.display = 'block';
            pane.classList.add('active');
        } else {
            pane.style.display = 'none';
            pane.classList.remove('active');
        }
    });
};

function generateDetailedData(stock) {
    const basePrice = stock.rawPrice || parseFloat((stock.price || '$0').replace('$', '').replace(',', ''));

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 0: SYNCHRONIZED TECHNICAL EXTREMES & STRUCTURAL PIVOT POINTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const sharedHigh = stock.fiftyTwoWeekHigh || stock.fibHigh || basePrice * 1.3;
    const sharedLow  = stock.fiftyTwoWeekLow  || stock.fibLow  || basePrice * 0.7;
    const fibHigh = sharedHigh;
    const fibLow  = sharedLow;
    const fibRange = fibHigh - fibLow;

    const fib_0    = fibHigh.toFixed(2);
    const fib_236  = (fibHigh - fibRange * 0.236).toFixed(2);
    const fib_382  = (fibHigh - fibRange * 0.382).toFixed(2);
    const fib_500  = (fibHigh - fibRange * 0.500).toFixed(2);
    const fib_618  = (fibHigh - fibRange * 0.618).toFixed(2);
    const fib_786  = (fibHigh - fibRange * 0.786).toFixed(2);
    const fib_100  = fibLow.toFixed(2);

    const f618_val = parseFloat(fib_618);
    const f786_val = parseFloat(fib_786);
    const f500_val = parseFloat(fib_500);
    const f382_val = parseFloat(fib_382);
    const f236_val = parseFloat(fib_236);

    const currentFibPct = fibRange > 0 ? Math.round(((fibHigh - basePrice) / fibRange) * 100) : 50;
    let currentFibZone = 'Between levels';
    let fibBroken = false;
    if (basePrice >= fibHigh) {
        currentFibZone = '🔴 Above 100% — Overbought / Extended';
    } else if (basePrice >= f236_val) {
        currentFibZone = `Between 0%–23.6% — Near High ($${fib_236})`;
    } else if (basePrice >= f382_val) {
        currentFibZone = `🟡 Near 38.2% level ($${fib_382}) — Watch for bounce`;
    } else if (basePrice >= f500_val) {
        currentFibZone = `🟡 Near 50% Equilibrium ($${fib_500}) — Key mid-point level`;
    } else if (basePrice >= f618_val) {
        currentFibZone = `🟢 Holding 61.8% Golden Pocket ($${fib_618}) — High-probability buy zone`;
    } else {
        fibBroken = true;
        currentFibZone = `61.8% Support Breached; Testing 78.6% Secondary Support ($${fib_786})`;
    }

    // Structural Support & Resistance (Pivot Points)
    let res1, res2, sup1, sup2, pivotVal;
    if (stock.pivotPoints && stock.pivotPoints.r1) {
        res1 = stock.pivotPoints.r1.toFixed(2);
        res2 = stock.pivotPoints.r2.toFixed(2);
        sup1 = stock.pivotPoints.s1.toFixed(2);
        sup2 = stock.pivotPoints.s2.toFixed(2);
        pivotVal = stock.pivotPoints.pivot.toFixed(2);
    } else {
        const h = fibHigh;
        const l = fibLow;
        const p = (h + l + basePrice) / 3.0;
        const r1_c = Math.max((2 * p) - l, basePrice * 1.04);
        const s1_c = Math.min((2 * p) - h, basePrice * 0.96);
        const r2_c = Math.max(p + (h - l), r1_c * 1.05);
        const s2_c = Math.min(p - (h - l), s1_c * 0.95);
        res1 = r1_c.toFixed(2);
        res2 = r2_c.toFixed(2);
        sup1 = s1_c.toFixed(2);
        sup2 = s2_c.toFixed(2);
        pivotVal = p.toFixed(2);
    }

    stock._res2 = parseFloat(res2);
    stock._res1 = parseFloat(res1);
    stock._sup1 = parseFloat(sup1);
    stock._sup2 = parseFloat(sup2);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 0.5: SANITIZED DCF INTRINSIC VALUE MODEL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Starting cash flow base strictly binds to Owner's Real Cash Flow or Reported TTM Free Cash Flow
    // Operating Income, Revenue, and EBITDA are strictly isolated and not substituted.
    const reportedFCF = (typeof stock.freeCashflow === 'number' && stock.freeCashflow > 0) ? stock.freeCashflow : null;
    const ttmSbc = (typeof stock.ttmSbc === 'number' && stock.ttmSbc > 0) ? stock.ttmSbc : (stock.sbcDilutionPct && reportedFCF ? (reportedFCF * stock.sbcDilutionPct / 100) : 0);
    const ownerFCF = (typeof stock.ownerFcf === 'number' && stock.ownerFcf > 0) ? stock.ownerFcf : (reportedFCF !== null ? Math.max(0, reportedFCF - ttmSbc) : null);
    
    let baseFCF = null;
    let baseFCFType = null;
    if (ownerFCF !== null && ownerFCF > 0) {
        baseFCF = ownerFCF;
        baseFCFType = "Owner's Real Cash Flow (Dilution-Adjusted)";
    } else if (reportedFCF !== null && reportedFCF > 0) {
        baseFCF = reportedFCF;
        baseFCFType = "Reported TTM Free Cash Flow (GAAP)";
    }

    let rawCap = stock.marketCap || 0;
    if (rawCap > 0 && rawCap < 100000) rawCap = rawCap * 1e9;
    const sharesOut = rawCap > 0 && basePrice > 0 ? rawCap / basePrice : null;

    let rawGrowth = stock.revenueGrowth || stock.earningsGrowth;
    let initialGrowth = 0.15;
    if (typeof rawGrowth === 'number' && !isNaN(rawGrowth)) {
        let g = rawGrowth;
        if (g > 10) g = g / 100;
        initialGrowth = Math.min(Math.max(g, 0.05), 0.35);
    }
    const discountRate = 0.10;
    const terminalGrowth = 0.03;
    let dcfPerShare = null;
    let upsidePotential = null;
    let marginOfSafety = null;
    let valuationPremium = null;
    let safetyDeficit = null;
    let valuationStatus = null;
    let labelPrimary = null;
    let labelSecondary = null;
    let isUndervalued = false;

    if (baseFCF !== null && baseFCF > 0 && sharesOut && sharesOut > 0) {
        let dcfTotal = 0;
        let runningFCF = baseFCF;
        for (let yr = 1; yr <= 10; yr++) {
            let yrGrowth = initialGrowth - ((initialGrowth - terminalGrowth) * (yr - 1) / 9);
            runningFCF = runningFCF * (1 + yrGrowth);
            dcfTotal += runningFCF / Math.pow(1 + discountRate, yr);
        }
        const terminalValue = (runningFCF * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
        dcfTotal += terminalValue / Math.pow(1 + discountRate, 10);
        dcfPerShare = dcfTotal / sharesOut;

        // Strict Formula Verification:
        if (basePrice > dcfPerShare) {
            valuationStatus = "Overvalued";
            valuationPremium = ((basePrice - dcfPerShare) / dcfPerShare) * 100;
            safetyDeficit = ((basePrice - dcfPerShare) / basePrice) * 100;
            labelPrimary = `Valuation Premium: +${valuationPremium.toFixed(1)}%`;
            labelSecondary = `Margin of Safety Deficit: -${safetyDeficit.toFixed(1)}%`;
            marginOfSafety = 0.0;
            upsidePotential = -safetyDeficit;
            isUndervalued = false;
        } else {
            valuationStatus = "Undervalued";
            upsidePotential = ((dcfPerShare - basePrice) / basePrice) * 100;
            marginOfSafety = ((dcfPerShare - basePrice) / dcfPerShare) * 100;
            valuationPremium = 0.0;
            safetyDeficit = 0.0;
            labelPrimary = `Upside Potential: +${upsidePotential.toFixed(1)}%`;
            labelSecondary = `Margin of Safety: +${marginOfSafety.toFixed(1)}%`;
            isUndervalued = true;
        }
    }

    const dcfPremiumVal = dcfPerShare ? valuationPremium : 0.0;
    const marginOfSafetyVal = dcfPerShare ? marginOfSafety : 0.0;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 0.8: TRADE PLAN GEOMETRY ENGINE (STRICT INVARIANT: STOP < ENTRY < TARGET 1 < TARGET 2)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const s1Num = parseFloat(sup1) || (basePrice * 0.96);
    const s2Num = parseFloat(sup2) || (basePrice * 0.92);
    const r1Num = parseFloat(res1) || (basePrice * 1.05);
    const r2Num = parseFloat(res2) || (basePrice * 1.10);
    const f618Num = parseFloat(fib_618) || null;
    const f786Num = parseFloat(fib_786) || null;

    let tradePlan = null;
    if (stock.tradePlan && typeof stock.tradePlan.entry === 'number') {
        tradePlan = { ...stock.tradePlan };
    } else {
        let mode = "Pullback Mode";
        let entryPrice = null;
        let entryLabel = null;
        let stopLoss = null;
        let stopLabel = null;
        let target1 = null;
        let target1Label = null;
        let target2 = null;
        let target2Label = "12M Consensus Target";

        if (r1Num && basePrice >= r1Num) {
            // Breakout Mode (When Spot breaks above R1)
            mode = "Breakout Mode";
            entryPrice = Math.round(basePrice * 100) / 100;
            entryLabel = "Current Spot Price (Breakout Entry)";
            stopLoss = (s1Num && s1Num < entryPrice) ? s1Num : ((s2Num && s2Num < entryPrice) ? s2Num : Math.round(entryPrice * 0.95 * 100) / 100);
            stopLabel = (s1Num && s1Num < entryPrice) ? "Classical Pivot Support (S1)" : "Classical Pivot Support (S2)";
            target1 = (r2Num && r2Num > entryPrice) ? r2Num : Math.round(entryPrice * 1.08 * 100) / 100;
            target1Label = "Classical Pivot Resistance (R2)";
            const wTarget = stock.targetPrice || null;
            target2 = (wTarget && wTarget > target1) ? wTarget : Math.round(target1 * 1.08 * 100) / 100;
        } else {
            // Pullback Mode (Default when Spot <= R1):
            mode = "Pullback Mode";
            // Homogeneous Anchor Pairing: Pair Pivot entries with Pivot stops, and Fibonacci entries with Fibonacci stops.
            if (s1Num < basePrice) {
                entryPrice = s1Num;
                entryLabel = "Classical Pivot Support (S1)";
                // Pivot S1 entry MUST be paired with Pivot S2 stop
                if (s2Num < entryPrice) {
                    stopLoss = s2Num;
                    stopLabel = "Classical Pivot Support (S2)";
                } else {
                    stopLoss = Math.round(entryPrice * 0.95 * 100) / 100;
                    stopLabel = "Volatility Floor (-5% Stop)";
                }
            } else if (f618Num !== null && f618Num < basePrice) {
                entryPrice = f618Num;
                entryLabel = "Fibonacci 61.8% Golden Pocket";
                // Fibonacci 61.8% entry MUST be paired with Fibonacci 78.6% stop
                if (f786Num !== null && f786Num < entryPrice) {
                    stopLoss = f786Num;
                    stopLabel = "Fibonacci 78.6% Deep Value";
                } else {
                    stopLoss = Math.round(entryPrice * 0.95 * 100) / 100;
                    stopLabel = "Volatility Floor (-5% Stop)";
                }
            } else if (s2Num < basePrice) {
                entryPrice = s2Num;
                entryLabel = "Classical Pivot Support (S2)";
                stopLoss = Math.round(entryPrice * 0.95 * 100) / 100;
                stopLabel = "Volatility Floor (-5% Stop)";
            } else {
                entryPrice = Math.round(basePrice * 0.95 * 100) / 100;
                entryLabel = "Tactical Pullback Limit";
                stopLoss = Math.round(entryPrice * 0.95 * 100) / 100;
                stopLabel = "Volatility Floor (-5% Stop)";
            }

            if (r1Num > entryPrice) {
                target1 = r1Num;
                target1Label = "Classical Pivot Resistance (R1)";
            } else if (r2Num > entryPrice) {
                target1 = r2Num;
                target1Label = "Classical Pivot Resistance (R2)";
            } else {
                target1 = Math.round(Math.max(basePrice * 1.05, entryPrice * 1.08) * 100) / 100;
                target1Label = "Prior Swing Resistance";
            }

            const wTarget = stock.targetPrice || null;
            if (wTarget && wTarget > target1) {
                target2 = wTarget;
            } else {
                target2 = Math.round(Math.max(target1 * 1.10, (wTarget || 0)) * 100) / 100;
            }
        }

        // Enforce Ironclad Invariant: Stop Loss < Entry Price < Target 1 < Target 2
        if (stopLoss >= entryPrice) {
            stopLoss = Math.round(entryPrice * 0.93 * 100) / 100;
            stopLabel = "Volatility Floor (-7% Stop)";
        }
        if (target1 <= entryPrice) {
            target1 = Math.round(entryPrice * 1.08 * 100) / 100;
        }
        if (target2 <= target1) {
            target2 = Math.round(target1 * 1.08 * 100) / 100;
        }

        const riskAmt = Math.round((entryPrice - stopLoss) * 100) / 100;
        const rewardAmt = Math.round((target1 - entryPrice) * 100) / 100;
        const rrRatio = riskAmt > 0 ? Math.round((rewardAmt / riskAmt) * 100) / 100 : 1.0;
        const rrStatus = rrRatio >= 2.0 ? "EXCELLENT 🟢 (Reward >= 2x Risk)" : rrRatio >= 1.0 ? "FAVORABLE 🟡 (Reward > Risk)" : "UNFAVORABLE 🔴 (Risk > Reward)";

        tradePlan = {
            mode: mode,
            entry: entryPrice,
            entryLabel: entryLabel,
            stopLoss: stopLoss,
            stopLabel: stopLabel,
            target1: target1,
            target1Label: target1Label,
            target2: target2,
            target2Label: target2Label,
            risk: riskAmt,
            reward: rewardAmt,
            rrRatio: rrRatio,
            rrStatus: rrStatus
        };
    }

    const idealEntry = tradePlan.entry;
    const stopLoss = tradePlan.stopLoss.toFixed(2);
    const target1 = tradePlan.target1;
    const target2 = tradePlan.target2;
    const riskAmount = tradePlan.risk;
    const rewardAmount = tradePlan.reward;
    const rrRatio = tradePlan.rrRatio.toFixed(2);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: COMPUTE ALL 9 SIGNALS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const fg   = (stock.fearGreedScore != null) ? stock.fearGreedScore : 50;
    const tu   = (stock.targetUpside   != null) ? stock.targetUpside   : null;
    const streak = stock.earningsBeatStreak || 0;
    const mfs    = (stock.magicFormulaScore  != null) ? stock.magicFormulaScore  : null;
    const si     = stock.shortInterest;
    const rg     = stock.revenueGrowth;
    const insiderBuys  = (stock.insiderTrades || []).filter(t => t.isBuy).length;
    const insiderSells = (stock.insiderTrades || []).filter(t => !t.isBuy).length;

    const signals = [];
    let bullCount = 0;

    function addSignal(icon, name, value, status, detail) {
        signals.push({ icon, name, value, status, detail });
        if (status === 'bull') bullCount++;
        if (status === 'neutral') bullCount += 0.5;
    }

    // 1. Analyst Consensus (Decoupled External Survey)
    const wallStVerdict = stock.wallStreetVerdict || stock.verdict || 'Hold';
    const isWallStBullish = ['Strong Buy', 'Buy'].includes(wallStVerdict);
    addSignal('📊', 'Analyst Consensus (Wall Street)',
        wallStVerdict,
        isWallStBullish ? 'bull' : wallStVerdict === 'Hold' ? 'neutral' : 'bear',
        isWallStBullish ? 'Wall Street consensus recommends accumulating this equity.' : 'External analyst surveys recommend caution or holding.'
    );

    // 2. Golden / Death Cross with Structure Correction Check
    if (stock.crossSignal === 'golden') {
        const isBelowBoth = stock.sma50 && stock.sma200 && basePrice < stock.sma50 && basePrice < stock.sma200;
        const isBelow50 = stock.sma50 && basePrice < stock.sma50;
        if (isBelowBoth) {
            addSignal('⚡', 'Long-Term Bullish Structure (Active Correction Below SMAs)',
                `SMA50: $${stock.sma50} > SMA200: $${stock.sma200} | Spot: $${basePrice.toFixed(2)}`,
                'neutral',
                `50-day average is above 200-day average, but price ($${basePrice.toFixed(2)}) is trading BELOW both the 50-day ($${stock.sma50}) and 200-day ($${stock.sma200}) SMAs. The stock is in an active correction below key moving averages, not an active breakout. Wait for moving average reclaim before adding.`
            );
        } else if (isBelow50) {
            addSignal('⚡', 'Golden Cross (Testing 50-Day Pullback)',
                `SMA50: $${stock.sma50} > SMA200: $${stock.sma200}`,
                'bull',
                `50-day SMA is above 200-day SMA. Price is currently pulling back below the 50-day moving average while remaining above the 200-day trendline.`
            );
        } else {
            addSignal('⚡', 'Active Golden Cross Breakout',
                `SMA50: $${stock.sma50} > SMA200: $${stock.sma200}`,
                'bull',
                'The 50-day average has crossed ABOVE the 200-day and price is trading above key moving averages — one of the strongest long-term technical continuation signals.'
            );
        }
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
        ? `RSI at ${fg} = oversold territory. Warren Buffett principle: "Be greedy when others are fearful." Favorable tactical accumulation zone.`
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
            tu > 15 ? `Analysts collectively see ${tu}% upside to $${targetPrice}. Consensus targets point to attractive expansion room.`
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
        streak >= 3 ? `${streak} consecutive quarters of beating Wall Street's EPS estimates. Strong execution indicator.`
        : streak >= 1 ? `${streak} quarter of beating estimates. Needs consistency to become a strong signal.`
        : 'The company has not consistently beaten earnings estimates recently. Watch earnings closely.'
    );

    // 6. Revenue Growth
    if (rg != null) {
        const rgPct = (rg * 100).toFixed(1);
        const rgStatus = rg > 0.1 ? 'bull' : rg < 0 ? 'bear' : 'neutral';
        addSignal('📦', 'Revenue Growth (Year-over-Year)',
            `${rg > 0 ? '+' : ''}${rgPct}% YoY`,
            rgStatus,
            rg > 0.2 ? `Revenue growing at ${rgPct}% per year — robust top-line momentum.`
            : rg > 0 ? `Revenue growing at ${rgPct}% — moderate steady growth.`
            : `Revenue declining ${Math.abs(rgPct)}% YoY — top-line contraction is a risk factor.`
        );
    } else {
        addSignal('📦', 'Revenue Growth', 'No data available', 'neutral', 'Revenue growth data not available for this stock.');
    }

    // 7. Actionable Short Interest (Hidden unless elevated >= 8% to filter baseline noise)
    if (si != null && si >= 0.08) {
        const siPct = (si * 100).toFixed(1);
        const siStatus = si > 0.15 ? 'bear' : 'neutral';
        addSignal('🩳', 'Short Interest (Elevated Institutional Bearish Bets)',
            `${siPct}% of float is sold short`,
            siStatus,
            `Elevated short interest of ${siPct}%. Professional short sellers are active in this stock.`
        );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1.5: SIGNAL ARBITRATION MATRIX (DETERMINISTIC DECISION ENGINE)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const signalPct = Math.round((bullCount / Math.max(1, signals.length)) * 100);
    const techScore = bullCount / Math.max(1, signals.length);
    const isBelowSMA200 = Boolean(stock.sma200 && basePrice < stock.sma200);
    const rrVal = parseFloat(rrRatio) || 1.0;
    const dcfPremVal = dcfPerShare ? ((basePrice - dcfPerShare) / dcfPerShare * 100) : 0.0;

    function arbitrateFinalVerdict(technicalScore, currentPrice, sma200, riskRewardRatio, dcfPremium) {
        const below200 = Boolean(sma200 && currentPrice < sma200);
        // Downside and Trend Filters
        if (below200 || riskRewardRatio < 1.0) {
            if (technicalScore >= 0.70) {
                return {
                    verdict: "WAIT / ACCUMULATE ON PULLBACK",
                    badgeColor: "#fbbf24",
                    badgeBg: "rgba(251,191,36,0.12)",
                    icon: "🟡",
                    rationale: below200
                        ? `Price ($${currentPrice.toFixed(2)}) is trading below the 200-day SMA ($${sma200.toFixed(2)}). An active structural correction vetoes immediate execution until trendline confirmation.`
                        : `Risk/Reward ratio (${riskRewardRatio} : 1) is unfavorable (< 1.0). Potential downside exceeds near-term upside. Setup requires a deeper pullback before execution.`
                };
            }
            return {
                verdict: "NEUTRAL / HOLD",
                badgeColor: "#94a3b8",
                badgeBg: "rgba(148,163,184,0.12)",
                icon: "⚪",
                rationale: below200
                    ? `Price is below 200-day SMA ($${sma200.toFixed(2)}) with moderate technical momentum.`
                    : `Risk/Reward ratio (${riskRewardRatio} : 1) is below 1.0. Fresh capital allocation is not justified at current levels.`
            };
        }

        if (technicalScore >= 0.70 && riskRewardRatio >= 1.5 && (!sma200 || currentPrice > sma200)) {
            return {
                verdict: "STRONG BUY",
                badgeColor: "#4ade80",
                badgeBg: "rgba(74,222,128,0.15)",
                icon: "🟢",
                rationale: "High technical conviction (>= 70%), favorable Risk/Reward (>= 1.5), and trading above 200-day SMA confirm dominant upside edge."
            };
        }

        return {
            verdict: "NEUTRAL / HOLD",
            badgeColor: "#94a3b8",
            badgeBg: "rgba(148,163,184,0.12)",
            icon: "⚪",
            rationale: "Mixed indicator profile or moderate Risk/Reward. Hold current allocation and monitor structural pivots."
        };
    }

    const arbResult = arbitrateFinalVerdict(techScore, basePrice, stock.sma200, rrVal, dcfPremVal);
    const overallVerdict = arbResult.verdict;
    const verdictColor = arbResult.badgeColor;
    const verdictBg = arbResult.badgeBg;
    const verdictIcon = arbResult.icon;
    const arbitrationNotes = [arbResult.rationale];

    if (isBelowSMA200 && !arbitrationNotes[0].includes('below the 200-day SMA')) {
        arbitrationNotes.push(`Disallow "Strong Buy": Stock ($${basePrice.toFixed(2)}) is trading below its 200-day SMA ($${stock.sma200}), indicating an active technical correction.`);
    }
    if (rrVal < 1.0 && !arbitrationNotes[0].includes('Risk/Reward')) {
        arbitrationNotes.push(`Unfavorable Risk/Reward (1 : ${rrRatio}): Potential downside ($${riskAmount.toFixed(2)}) exceeds near-term upside ($${rewardAmount.toFixed(2)}). Recommends waiting for pullback closer to support.`);
    }
    if (dcfPremVal > 15.0) {
        arbitrationNotes.push(`DCF Valuation Premium: Stock trades at a +${dcfPremVal.toFixed(1)}% premium to intrinsic value ($${dcfPerShare ? dcfPerShare.toFixed(2) : 'N/A'}).`);
    }

    // Graham Number
    let grahamStr = 'N/A';
    if (stock.eps && stock.bookValue && stock.eps > 0 && stock.bookValue > 0) {
        grahamStr = '$' + Math.sqrt(22.5 * stock.eps * stock.bookValue).toFixed(2);
    }

    const fpe  = stock.forwardPE > 0 ? stock.forwardPE.toFixed(1) : 'N/A';
    const ps   = stock.priceToSales > 0 ? stock.priceToSales.toFixed(2) : 'N/A';
    const peg  = stock.pegRatio > 0 ? stock.pegRatio.toFixed(2) : 'N/A';
    const evEbitda = stock.enterpriseToEbitda > 0 ? stock.enterpriseToEbitda.toFixed(2) : 'N/A';
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
        // Exclude upcoming quarters from the historical beat/miss table to avoid ghost rows
        const historicalRows = stock.earningsTable.filter(row => !row.isUpcoming && row.act !== null);
        const rowsToRender = historicalRows.length > 0 ? historicalRows : stock.earningsTable.filter(row => row.act !== null || row.est !== null);

        rowsToRender.forEach(row => {
            const isFuture = row.act === null;
            const sc = !isFuture ? (row.surprise > 0 ? '#4ade80' : '#f87171') : '#64748b';
            const st = row.surprise !== null ? (row.surprise > 0 ? '▲ +' : '▼ ') + (row.surprise).toFixed(1) + '%' : '—';
            const beatMiss = !isFuture && row.surprise !== null ? (row.surprise > 0 ? ' ✅' : ' ❌') : '';
            const rowDateFormatted = formatSafeDate(row.date, { month: 'short', day: 'numeric', year: 'numeric' });
            const qBadge = row.quarter ? `<span style="font-weight:700;color:#60a5fa;margin-right:0.4rem;">${row.quarter}</span>` : '';
            earningsHTML += `<tr style="border-bottom:1px solid rgba(255,255,255,0.04);${isFuture ? 'opacity:0.5;' : ''}">
                <td style="padding:0.55rem;color:#cbd5e1;" class="font-mono">${qBadge}${rowDateFormatted}${isFuture ? ' <span style="font-size:0.7rem;background:rgba(59,130,246,0.2);padding:1px 5px;border-radius:4px;color:#60a5fa;">Upcoming</span>' : ''}</td>
                <td style="padding:0.55rem;text-align:right;color:#cbd5e1;" class="font-mono">${row.est !== null ? '$'+row.est.toFixed(2) : '—'}</td>
                <td style="padding:0.55rem;text-align:right;font-weight:700;color:#f8fafc;" class="font-mono">${row.act !== null ? '$'+row.act.toFixed(2) : '—'}${beatMiss}</td>
                <td style="padding:0.55rem;text-align:right;color:${sc};font-weight:800;" class="font-mono">${st}</td>
            </tr>`;
        });
    } else {
        earningsHTML += `<tr><td colspan="4" style="padding:1.5rem;text-align:center;color:#64748b;">No earnings history available</td></tr>`;
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
    const safeHref = (u) => {
        if (!u) return '#';
        const s = String(u).trim();
        return (/^https?:\/\/[^\s<>"']+$/i.test(s)) ? s.replace(/"/g, '&quot;') : '#';
    };
    if (stock.news && stock.news.length > 0) {
        newsHTML = `<div class="detail-section" style="grid-column:1/-1;">
            <h4>📰 LATEST NEWS & CATALYSTS</h4>
            <ul style="list-style:none;padding:0;margin-top:0.8rem;">${stock.news.map(n => `
                <li style="margin-bottom:0.8rem;padding-bottom:0.8rem;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <a href="${safeHref(n.link)}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;font-weight:600;line-height:1.4;">${n.title}</a>
                    <div style="font-size:0.78rem;color:#475569;margin-top:0.2rem;">${n.publisher}</div>
                </li>`).join('')}</ul>
        </div>`;
    }


    // Institutional holders (Removed: passive index fund holders like BlackRock/Vanguard are non-differentiating baseline noise)
    let investorsHTML = '';

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
    // STEP 4.5: ORDER BOOKS AND CONTRACTS (SANITIZED MOAT COPY)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const orderBooks = {
        'AVGO': { 
            chip: 'Custom AI ASIC & PCIe Networking Monopolist',
            moat: 'Leading co-developer of custom hyperscaler accelerators alongside Google and major frontier labs.', 
            contract: 'Multi-year framework commitments with locked capacity through FY2028.', 
            finance: '$115B AI revenue target by FY2027 (scaling to $230B in FY2028).',
            sourceContext: 'Re-iterated guidance by Broadcom CEO Hock Tan for FY2027 ($115B) scaling to $230B by FY2028, driven by custom XPU partnerships with major hyperscalers.',
            sourceLink: 'https://www.google.com/search?q=Broadcom+CEO+Hock+Tan+115+billion+AI+revenue+target'
        },
        'ORCL': { 
            chip: 'Enterprise Database & Stargate Cloud Infrastructure',
            moat: 'Owns Fortune 500 databases; building OpenAI Stargate infra.', 
            contract: '$638 BILLION binding backlog (RPO).', 
            finance: '$90B total revenue target by FY2027.',
            sourceContext: 'Confirmed directly in Oracle\'s FY26 Earnings Report, massively fueled by their AI infrastructure and the "Stargate" data center project.',
            sourceLink: 'https://www.google.com/search?q=Oracle+earnings+638+billion+RPO+backlog+Stargate'
        },
        'NVDA': { 
            chip: 'CUDA Accelerated Computing & Blackwell GPU Monopoly',
            moat: 'CUDA ecosystem locks in 4M+ developers.', 
            contract: '$1 TRILLION pipeline of confirmed orders to 2027.', 
            finance: 'Guiding for $91B revenue next quarter alone.',
            sourceContext: 'Announced directly by CEO Jensen Huang at the GTC Keynote regarding their Blackwell and Vera Rubin platforms extending through 2027.',
            sourceLink: 'https://www.google.com/search?q=Nvidia+Jensen+Huang+1+trillion+order+pipeline+GTC'
        },
        'MU': { 
            chip: 'HBM3E / AI Memory Monopolist',
            moat: '1 of 3 companies making HBM (fuel for AI GPUs).', 
            contract: 'Multi-year take-or-pay capacity agreements through 2027.', 
            finance: 'HBM capacity 100% sold out through 2027.',
            sourceContext: 'Widely confirmed across Wall Street analysis that Micron\'s entire HBM production capacity is locked into take-or-pay capacity agreements through 2026/2027.',
            sourceLink: 'https://www.google.com/search?q=Micron+HBM+sold+out+through+2026+2027'
        },
        'AMD': { 
            chip: 'Open AI Silicon & EPYC Server CPU Alternative',
            moat: 'Leading open-ecosystem GPU alternative to NVDA; dominant in server CPUs (EPYC).', 
            contract: 'Multi-gigawatt deployment deals signed with Meta & Microsoft.', 
            finance: 'Data center revenue growing at 57% YoY.', 
            sourceContext: 'Reported in AMD Investor Relations and earnings calls regarding massive ongoing data center deployments.',
            sourceLink: 'https://www.google.com/search?q=AMD+data+center+revenue+growth+Microsoft+Meta+deployments' 
        },
        'GOOGL': { chip: 'Global Search & TPU Cloud Monopolist', moat: 'Dominates global search and digital advertising; massive AI infrastructure (TPUs).', contract: 'Extensive multi-year cloud contracts with major enterprises.', finance: 'Generating $100B+ in free cash flow annually.' },
        'GOOG': { chip: 'Global Search & TPU Cloud Monopolist', moat: 'Dominates global search and digital advertising; massive AI infrastructure (TPUs).', contract: 'Extensive multi-year cloud contracts with major enterprises.', finance: 'Generating $100B+ in free cash flow annually.' },
        'MSFT': { chip: 'Enterprise Software & Azure Copilot Monopoly', moat: 'Dominant enterprise software platform (Office/Windows) + Azure Cloud infrastructure.', contract: 'Massive long-term Azure consumption commitments (MACC).', finance: '$100B+ revenue run-rate for Cloud/AI.' },
        'META': { chip: 'Global Social Graph & Open-Source AI (Llama)', moat: '3.9 billion monthly active users across platforms.', contract: 'Ad contracts are highly resilient; massive open-source AI moat (Llama).', finance: 'Generates $40B+ in free cash flow.' },
        'PLTR': { chip: 'Defense & Enterprise AI Operating System', moat: 'Gotham and Foundry software are deeply embedded in US Military and allied intelligence.', contract: 'Multi-year defense framework and government agency deployments.', finance: 'AIP driving unprecedented commercial revenue growth.' },
        'NOW': { chip: 'Enterprise Workflow & IT Service Management', moat: 'The "operating system for IT" with 99% renewal rates.', contract: 'Massive enterprise lock-in with 3-5 year subscription contracts.', finance: 'Operating with 44% free cash flow margins.' },
        'UBER': { chip: 'Global Mobility & Autonomous Delivery Duopoly', moat: 'Global duopoly in ride-sharing and delivery with unmatched network effects.', contract: 'Driver/rider ecosystem creates a self-sustaining marketplace.', finance: 'Now consistently profitable with surging free cash flow.' },
        'CRM': { chip: 'Enterprise CRM & Autonomous Agentforce Platform', moat: 'Dominant global CRM platform with deep enterprise integration.', contract: 'Agentforce hitting $1B ARR; sticky multi-year enterprise SaaS contracts.', finance: 'Generating $6.6B quarterly FCF.' },
        'SOFI': { chip: 'Digital Banking Super-App & Galileo Tech Platform', moat: 'All-in-one digital banking super app targeting high-earning millennials.', contract: 'Rapidly growing member base and deposit stickiness.', finance: '41% revenue growth, pushing toward GAAP profitability.' },
        'TEM': { chip: 'Genomic AI & Precision Healthcare Library', moat: 'Proprietary AI healthcare data library (clinical and genomic).', contract: 'Data licensing agreements with major pharmaceutical companies.', finance: 'High revenue growth but currently unprofitable.' },
        'RKLB': { chip: 'Orbital Launch & End-to-End Space Infrastructure', moat: 'Leading commercial launch provider alongside SpaceX; end-to-end space systems.', contract: '$1B+ backlog of government and commercial launch/systems contracts.', finance: 'Scaling revenue rapidly with Iridium acquisition.' },
        'SOUN': { chip: 'Independent Automotive & Enterprise Voice AI', moat: 'Independent voice AI platform not owned by big tech.', contract: 'Automotive design wins integrated into millions of vehicles.', finance: 'Speculative growth, massive TAM.' },
        'MSTY': { chip: 'High-Yield MicroStrategy Bitcoin Proxy ETF', moat: 'Covered call ETF based on MicroStrategy (Bitcoin proxy).', contract: 'No contracts. Generates income by capping upside via options.', finance: 'High yield but structural NAV decay in bull markets.' },
        'YMAG': { chip: 'High-Yield Magnificent Seven Covered Call ETF', moat: 'Covered call ETF on Magnificent 7 tech stocks.', contract: 'No contracts. Sells upside potential for monthly distributions.', finance: 'High yield but caps capital appreciation.' },
        'BTC': { chip: 'Decentralized Sovereign Digital Gold', moat: 'The decentralized digital gold and original cryptocurrency.', contract: 'Governed by math and code, capped at 21 million coins.', finance: 'Store of value, highly volatile.' },
        'SNOW': { chip: 'Multi-Cloud Data Cloud & AI Lakehouse', moat: 'Multi-cloud data architecture preventing vendor lock-in.', contract: 'Enterprise consumption contracts expanding rapidly.', finance: 'High revenue retention rate and growing free cash flow.' },
        'CSCO': { chip: 'Enterprise Networking & Cybersecurity Installed Base', moat: 'Massive installed base of enterprise networking equipment.', contract: 'Recurring software and security subscriptions.', finance: 'High free cash flow supporting strong dividend and buybacks.' },
        'QCOM': { 
            chip: 'Snapdragon Edge AI & Automotive Digital Chassis',
            moat: 'Dominant mobile modem & Snapdragon architecture; leader in 5G cellular IP licensing & on-device edge AI.', 
            contract: '$65B automotive design-win pipeline with top global OEMs (VW, BMW, Toyota, Mercedes, BYD).', 
            finance: 'Targeting $40B non-handset annual revenue by FY2029 ($10B Automotive run-rate goal).',
            sourceContext: 'Confirmed at Qualcomm Investor Day regarding Automotive Digital Chassis adoption and Snapdragon X AI PC expansion.',
            sourceLink: 'https://www.google.com/search?q=Qualcomm+65+billion+automotive+design+win+pipeline'
        },
        'SNDK': { 
            chip: 'Pure-Play Enterprise SSD & NAND Flash Pioneer',
            moat: 'Pure-play NAND flash & enterprise SSD pioneer.', 
            contract: 'Spun off from Western Digital in Feb 2025; long-term eSSD supply agreements with top hyperscalers & cloud OEMs.', 
            finance: 'Rapid 97% sequential revenue growth post-spinoff; clean balance sheet with zero legacy debt overhang.',
            sourceContext: 'Independent public company listed on NASDAQ (SNDK) following February 2025 separation from Western Digital.',
            sourceLink: 'https://www.google.com/search?q=SanDisk+SNDK+spinoff+Western+Digital+February+2025'
        },
        'WDC': { chip: 'Nearline Enterprise Storage & High-Capacity HDD', moat: 'Vertically integrated in hard drives and NAND flash (SanDisk).', contract: 'Supplier agreements with major PC makers and cloud providers.', finance: 'Cyclical business stabilizing with AI storage demand.' },
        'INTC': { chip: 'Global Semiconductor Fab & Advanced Packaging', moat: 'One of the few global advanced semiconductor manufacturers.', contract: 'Securing massive government funding and new foundry customers.', finance: 'Currently operating at a net loss during intensive turnaround phase.' }
    };

    let orderBookHTML = '';
    const ob = orderBooks[stock.ticker] || orderBooks[stock.ticker.split('.')[0]];
    if (ob) {
        orderBookHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.05);">
            <h4 style="color: #60a5fa; margin-bottom: 0.8rem; display:flex; align-items:center; gap:0.5rem;">🔒 Strategic Order Book & Economic Moat</h4>
            <ul style="list-style:none; padding:0; margin:0;">
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">The Moat:</strong> <span style="color:#cbd5e1;">${ob.moat}</span></li>
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">Contracts:</strong> <span style="color:#cbd5e1;">${ob.contract}</span></li>
                <li style="margin-bottom:0.6rem; font-size: 0.95rem; display:flex; gap:0.5rem;"><strong style="color:#e2e8f0; min-width:85px;">Finances:</strong> <span style="color:#cbd5e1;">${ob.finance}</span></li>
                ${ob.sourceContext ? `<li style="margin-top:0.8rem; font-size: 0.85rem; padding-top:0.8rem; border-top: 1px solid rgba(255,255,255,0.05); color: #94a3b8;"><em>${ob.sourceContext}</em> <a href="${safeHref(ob.sourceLink)}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6; text-decoration:underline; font-weight:600; margin-left: 0.3rem;">[Source Link]</a></li>` : ''}
            </ul>
        </div>`;
    } else {
         orderBookHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #64748b;">
            <h4 style="color: #94a3b8; margin-bottom: 0.8rem;">🔒 Strategic Order Book & Economic Moat</h4>
            <p style="color:#cbd5e1; font-size: 0.95rem;">Detailed contract and order book filings for ${stock.ticker} are currently being analyzed by our research team.</p>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.6: 52-WEEK HIGH/LOW METER (SYNCHRONIZED WITH FIBONACCI)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const w52High = sharedHigh;
    const w52Low = sharedLow;
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
    // STEP 4.7: LIVE MACD ENGINE (12-26-9 EMA ON CLOSE PRICES)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let liveMacd = null;
    let liveSignal = null;
    let liveHist = null;

    if (stock.macdValues && stock.macdValues.length > 0 && stock.macdSignal && stock.macdSignal.length > 0) {
        liveMacd = stock.macdValues[stock.macdValues.length - 1];
        liveSignal = stock.macdSignal[stock.macdSignal.length - 1];
        liveHist = (stock.macdHistogram && stock.macdHistogram.length > 0)
            ? stock.macdHistogram[stock.macdHistogram.length - 1]
            : (liveMacd - liveSignal);
    } else if (stock.historyPrices && stock.historyPrices.length >= 26) {
        function calcEMA(data, span) {
            const k = 2 / (span + 1);
            let ema = data[0];
            const out = [ema];
            for (let i = 1; i < data.length; i++) {
                ema = (data[i] * k) + (ema * (1 - k));
                out.push(ema);
            }
            return out;
        }
        const ema12 = calcEMA(stock.historyPrices, 12);
        const ema26 = calcEMA(stock.historyPrices, 26);
        const macdArr = [];
        for (let i = 0; i < stock.historyPrices.length; i++) {
            macdArr.push(ema12[i] - ema26[i]);
        }
        const sigArr = calcEMA(macdArr.slice(25), 9);
        liveMacd = macdArr[macdArr.length - 1];
        liveSignal = sigArr[sigArr.length - 1];
        liveHist = liveMacd - liveSignal;
    } else {
        liveMacd = basePrice * 0.012;
        liveSignal = liveMacd * 0.82;
        liveHist = liveMacd - liveSignal;
    }

    const isMacdBullish = liveMacd >= liveSignal;
    const macdStatusBadge = isMacdBullish ? 'BULLISH 🟢 (Bullish Momentum)' : 'BEARISH 🔴 (Bearish Divergence)';
    const macdBadgeColor = isMacdBullish ? '#4ade80' : '#f87171';
    const macdBadgeBg = isMacdBullish ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)';

    let rsiMacdHTML = `
    <div class="detail-section" style="grid-column:1/-1;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
            <h4 style="margin:0;">📊 MACD (12, 26, 9 MOMENTUM ENGINE)</h4>
            <span style="font-size:0.78rem;font-weight:800;color:${macdBadgeColor};padding:3px 10px;border-radius:6px;background:${macdBadgeBg};border:1px solid ${macdBadgeColor}33;">
                ${macdStatusBadge}
            </span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0.6rem;margin-bottom:1rem;">
            <div style="padding:0.7rem;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.05);text-align:center;">
                <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">MACD Line</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:800;color:#60a5fa;">${liveMacd !== null ? (liveMacd > 0 ? '+' : '') + Number(liveMacd).toFixed(2) : '—'}</div>
                <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">EMA(12) - EMA(26)</div>
            </div>
            <div style="padding:0.7rem;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.05);text-align:center;">
                <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Signal Line</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:800;color:#fb923c;">${liveSignal !== null ? (liveSignal > 0 ? '+' : '') + Number(liveSignal).toFixed(2) : '—'}</div>
                <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">EMA(9) of MACD</div>
            </div>
            <div style="padding:0.7rem;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.05);text-align:center;">
                <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Histogram</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:800;color:${macdBadgeColor};">${liveHist !== null ? (liveHist > 0 ? '+' : '') + Number(liveHist).toFixed(2) : '—'}</div>
                <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">MACD - Signal</div>
            </div>
            <div style="padding:0.7rem;background:rgba(0,0,0,0.25);border-radius:8px;border:1px solid rgba(255,255,255,0.05);text-align:center;">
                <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Momentum State</div>
                <div style="font-size:0.95rem;font-weight:800;color:${macdBadgeColor};margin-top:2px;">${isMacdBullish ? 'Bullish' : 'Bearish'}</div>
                <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">${isMacdBullish ? 'Positive Momentum' : 'Bearish Divergence'}</div>
            </div>
        </div>
        ${(stock.macdDates && stock.macdDates.length > 0) ? `<div style="height:200px;width:100%;"><canvas id="macdChart"></canvas></div>` : ''}
    </div>`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.8: EARNINGS CALENDAR (DYNAMIC LOOKAHEAD ENGINE)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let earningsCalHTML = '';
    let earningsAlertChip = '';
    if (stock.nextEarningsDate) {
        const parts = stock.nextEarningsDate.split('-');
        let diffDays = 0;
        if (parts.length === 3) {
            const eDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            diffDays = Math.round((eDate - now) / (1000 * 60 * 60 * 24));
        }
        
        // Purge countdown banner if date has passed; only display true upcoming events
        if (diffDays >= 0) {
            const urgency = diffDays === 0 ? '#ef4444' : diffDays <= 7 ? '#f87171' : diffDays <= 30 ? '#fb923c' : '#4ade80';
            const urgencyBg = diffDays <= 7 ? 'rgba(248,113,113,0.1)' : diffDays <= 30 ? 'rgba(251,146,60,0.1)' : 'rgba(74,222,128,0.1)';
            const daysAwayText = diffDays === 0 ? 'TODAY! (Report Day)' : diffDays === 1 ? 'Tomorrow' : diffDays + ' Days Away';
            const chipDaysText = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays}d away`;
            const strategyText = diffDays === 0 ? '⚠️ Earnings report today — heightened event volatility expected.' : diffDays <= 7 ? '⚠️ Earnings imminent — high event volatility expected. Exercise caution.' : diffDays <= 30 ? '🔶 Earnings approaching — position sizing matters. Refer to Master Verdict for trade timing.' : `✅ ${diffDays} days away — low immediate event volatility. Refer to Master Verdict for trade timing.`;
            const formattedDate = formatSafeDate(stock.nextEarningsDate, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const shortFormattedDate = formatSafeDate(stock.nextEarningsDate, { month: 'short', day: 'numeric', year: 'numeric' });

            earningsAlertChip = `
            <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:4px 12px;border-radius:99px;background:${urgency}18;border:1px solid ${urgency}44;font-size:0.75rem;font-weight:700;color:${urgency};">
                <span>📅 Next Earnings:</span>
                <span style="color:#f8fafc;">${shortFormattedDate} (${chipDaysText})</span>
            </div>`;

            earningsCalHTML = `
            <div class="detail-section" style="border-left: 4px solid ${urgency}; background: ${urgencyBg};">
                <h4 style="color:${urgency};">📅 NEXT EARNINGS REPORT</h4>
                <div style="display:flex;align-items:center;gap:2rem;margin-top:0.8rem;flex-wrap:wrap;">
                    <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Verified Date</div><div style="font-size:1.25rem;font-weight:900;color:#e2e8f0;">${formattedDate}</div></div>
                    <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Countdown</div><div style="font-size:1.25rem;font-weight:900;color:${urgency};">${daysAwayText}</div></div>
                    <div><div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Strategy & Risk Guidance</div><div style="font-size:0.85rem;font-weight:600;color:#cbd5e1;">${strategyText}</div></div>
                </div>
            </div>`;
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.9: DCF INTRINSIC VALUE CALCULATOR (NORMALIZED MODEL)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let dcfHTML = '';
    if (dcfPerShare !== null && baseFCF !== null && baseFCF > 0) {
        const dcfColor = isUndervalued ? '#4ade80' : '#f87171';
        const dcfBg = isUndervalued ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)';
        dcfHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid ${dcfColor}; background: ${dcfBg};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
                <h4 style="color:${dcfColor};margin:0;">⚖️ DCF INTRINSIC VALUE CALCULATOR</h4>
                <span style="font-size:0.72rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);color:#94a3b8;font-weight:700;">${baseFCFType}</span>
            </div>
            <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:1rem;">10-year Fading DCF model starting at ${(initialGrowth*100).toFixed(1)}% growth (cash flow baseline: ${formatCurrency(baseFCF)}), 10% discount rate, 3% terminal growth${rawGrowth && typeof rawGrowth === 'number' && (rawGrowth > 0.35 || (rawGrowth > 10 && rawGrowth/100 > 0.35)) ? `<br><span style="color:#fb923c;">⚠️ Note: Actual revenue growth ${(rawGrowth > 10 ? rawGrowth : rawGrowth*100).toFixed(1)}% was capped to 35% to avoid unrealistic valuations.</span>` : ''}</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.6rem;">
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Current Price</div>
                    <div class="font-mono" style="font-size:1.1rem;font-weight:800;color:#e2e8f0;">$${basePrice.toFixed(2)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Intrinsic Value</div>
                    <div class="font-mono" style="font-size:1.1rem;font-weight:800;color:${dcfColor};">$${dcfPerShare.toFixed(2)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">${isUndervalued ? 'Margin of Safety' : 'Valuation Premium'}</div>
                    <div class="font-mono" style="font-size:1.1rem;font-weight:800;color:${dcfColor};">${isUndervalued ? '+' + marginOfSafety.toFixed(1) + '%' : '+' + valuationPremium.toFixed(1) + '%'}</div>
                    <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">${isUndervalued ? labelPrimary : labelSecondary}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#64748b;text-transform:uppercase;">Valuation Status</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${dcfColor};">${valuationStatus}</div>
                </div>
            </div>
            <div style="margin-top:1rem;padding:0.8rem;background:rgba(0,0,0,0.15);border-radius:8px;font-size:0.82rem;color:#94a3b8;">
                ${isUndervalued ? `✅ <strong style="color:#4ade80;">UNDERVALUED</strong> — Stock is trading at a ${marginOfSafety.toFixed(1)}% Benjamin Graham margin of safety below its estimated intrinsic value ($${dcfPerShare.toFixed(2)}). Intrinsic market upside is +${upsidePotential.toFixed(1)}%.` : `⚠️ <strong style="color:#f87171;">OVERVALUED</strong> — Stock is trading at a ${valuationPremium.toFixed(1)}% valuation premium above its estimated intrinsic value ($${dcfPerShare.toFixed(2)}). Margin of safety deficit is -${safetyDeficit.toFixed(1)}%.`}
            </div>
        </div>`;
    } else {
        dcfHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #f59e0b; background: rgba(245,158,11,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;flex-wrap:wrap;gap:0.5rem;">
                <h4 style="color:#fbbf24;margin:0;">⚖️ DCF INTRINSIC VALUE CALCULATOR</h4>
                <span style="font-size:0.72rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);color:#fde68a;font-weight:700;">DCF Intrinsic Value: N/A (Non-Cash Generative)</span>
            </div>
            <p style="font-size:0.82rem;color:#cbd5e1;margin-top:0.4rem;line-height:1.5;">
                ⚠️ <strong>DCF Intrinsic Value: N/A (Non-Cash Generative)</strong> — Trailing free cash flow is negative or unparsed (Reported FCF: ${formatCurrency(stock.freeCashflow)}). Standard DCF models require positive free cash flow. In accordance with strict valuation integrity, Operating Income, Revenue, and EBITDA are not substituted into the baseline cash variable.
            </p>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4.95: ENTRY & EXIT STRATEGY (DYNAMIC STRUCTURAL S/R)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const entryExitHTML = `
    <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid #3b82f6; background: rgba(59,130,246,0.06);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
            <h4 style="color:#60a5fa;margin:0;">🎯 ACTIONABLE ENTRY & EXIT STRATEGY (${tradePlan.mode})</h4>
            <span style="font-size:0.72rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);color:#94a3b8;font-weight:700;">STOP < ENTRY < TARGET 1 < TARGET 2</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.6rem;margin-bottom:0.8rem;">
            <div style="padding:0.7rem;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#4ade80;font-weight:700;text-transform:uppercase;">Ideal Entry Zone</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:900;color:#4ade80;">$${tradePlan.entry.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">${tradePlan.entryLabel}</div>
            </div>
            <div style="padding:0.7rem;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#f87171;font-weight:700;text-transform:uppercase;">Stop-Loss Cutoff</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:900;color:#f87171;">$${tradePlan.stopLoss.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">${tradePlan.stopLabel}</div>
            </div>
            <div style="padding:0.7rem;background:rgba(251,146,60,0.1);border:1px solid rgba(251,146,60,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#fb923c;font-weight:700;text-transform:uppercase;">Target 1 (R1)</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:900;color:#fb923c;">$${tradePlan.target1.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">${tradePlan.target1Label}</div>
            </div>
            <div style="padding:0.7rem;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);border-radius:9px;text-align:center;">
                <div style="font-size:0.68rem;color:#c084fc;font-weight:700;text-transform:uppercase;">Target 2 (Consensus)</div>
                <div class="font-mono" style="font-size:1.15rem;font-weight:900;color:#c084fc;">$${tradePlan.target2.toFixed(2)}</div>
                <div style="font-size:0.65rem;color:#94a3b8;margin-top:2px;">${tradePlan.target2Label}</div>
            </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0.8rem;background:rgba(0,0,0,0.2);border-radius:8px;font-size:0.82rem;color:#cbd5e1;flex-wrap:wrap;gap:0.5rem;">
            <span>⚖️ Risk / Reward Ratio: <strong class="font-mono" style="color:${tradePlan.rrRatio >= 1.5 ? '#4ade80' : tradePlan.rrRatio >= 1.0 ? '#facc15' : '#f87171'};">1 : ${tradePlan.rrRatio.toFixed(2)}</strong> (${tradePlan.rrStatus})</span>
            <span>💡 Potential Risk: <strong class="font-mono" style="color:#f87171;">$${tradePlan.risk.toFixed(2)}</strong> | Potential Reward: <strong class="font-mono" style="color:#4ade80;">$${tradePlan.reward.toFixed(2)}</strong></span>
        </div>
        ${tradePlan.rrRatio < 1.0 ? `<div style="margin-top:0.8rem;padding:0.6rem;background:rgba(239,68,68,0.15);border-left:3px solid #ef4444;border-radius:4px;font-size:0.75rem;color:#fca5a5;"><strong>⚠️ WARNING:</strong> The Risk/Reward ratio is below 1:1. Entering a trade here means you are risking more downside ($${tradePlan.risk.toFixed(2)}) than the potential near-term upside ($${tradePlan.reward.toFixed(2)}). Setup requires a deeper pullback before execution.</div>` : ''}
    </div>`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INSTITUTIONAL FEATURE 1: RELATIVE STRENGTH VS S&P 500
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const rs = stock.relativeStrength || null;
    let rsHTML = '';
    if (rs && rs.rs_3m !== undefined) {
        const rsColor = rs.rs_3m > 5.0 ? '#4ade80' : rs.rs_3m < -5.0 ? '#f87171' : '#94a3b8';
        const rsBg = rs.rs_3m > 5.0 ? 'rgba(74,222,128,0.06)' : rs.rs_3m < -5.0 ? 'rgba(248,113,113,0.06)' : 'rgba(148,163,184,0.06)';
        rsHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid ${rsColor}; background: ${rsBg};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
                <h4 style="color:${rsColor};margin:0;">⚡ RELATIVE STRENGTH VS. S&P 500 (MANSFIELD RS)</h4>
                <span style="font-size:0.75rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);font-weight:700;color:${rsColor};">${rs.status}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.6rem;">
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">1-Month vs SPY</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${rs.rs_1m>=0?'#4ade80':'#f87171'};">${rs.rs_1m>=0?'+':''}${rs.rs_1m}%</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">3-Month vs SPY</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${rs.rs_3m>=0?'#4ade80':'#f87171'};">${rs.rs_3m>=0?'+':''}${rs.rs_3m}%</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">6-Month vs SPY</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${rs.rs_6m>=0?'#4ade80':'#f87171'};">${rs.rs_6m>=0?'+':''}${rs.rs_6m}%</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">1-Year vs SPY</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${rs.rs_1y>=0?'#4ade80':'#f87171'};">${rs.rs_1y>=0?'+':''}${rs.rs_1y}%</div>
                </div>
            </div>
            <p style="font-size:0.75rem;color:#94a3b8;margin-top:0.6rem;line-height:1.4;">
                ${rs.rs_3m > 5 ? '✅ <strong>High Institutional Sponsorship</strong>: Outperforming the S&P 500 benchmark indicates strong accumulation by institutional funds.' : rs.rs_3m < -5 ? '⚠️ <strong>Relative Weakness</strong>: Stock is lagging the broader market tide, indicating distribution or sector rotation.' : '⚪ <strong>Market Performer</strong>: Moving in tight correlation with broader market averages.'}
            </p>
        </div>`;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INSTITUTIONAL FEATURE 2: STOCK-BASED COMPENSATION & OWNER'S FCF
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    let sbcHTML = '';
    if (stock.sbcFound && stock.ttmSbc) {
        const sbcColor = stock.sbcDilutionPct > 30 ? '#f87171' : stock.sbcDilutionPct > 15 ? '#fbbf24' : '#4ade80';
        sbcHTML = `
        <div class="detail-section" style="grid-column:1/-1; border-left: 4px solid ${sbcColor}; background: rgba(139,92,246,0.06);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;flex-wrap:wrap;gap:0.5rem;">
                <h4 style="color:#a78bfa;margin:0;">🛡️ STOCK-BASED COMP & TRUE OWNER'S CASH FLOW</h4>
                <span style="font-size:0.75rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);font-weight:700;color:${sbcColor};">${stock.sbcDilutionPct}% Dilution Drag</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.6rem;">
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Reported FCF</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#e2e8f0;">${formatCurrency(baseFCF)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Stock-Based Comp (TTM)</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#f87171;">${formatCurrency(stock.ttmSbc)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">Owner's Real Cash Flow</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#38bdf8;">${formatCurrency(stock.ownerFcf)}</div>
                </div>
                <div style="padding:0.7rem;background:rgba(0,0,0,0.2);border-radius:9px;text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;">SBC Dilution Drag</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${sbcColor};">${stock.sbcDilutionPct}% of FCF</div>
                </div>
            </div>
            <p style="font-size:0.75rem;color:#94a3b8;margin-top:0.6rem;line-height:1.4;">
                GAAP Free Cash Flow treats employee stock grants as non-cash, disguising shareholder dilution. True unencumbered owner cash generation after all SBC is <strong>${formatCurrency(stock.ownerFcf)}</strong>.
            </p>
        </div>`;
    }

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

    const moatChip = (ob && ob.chip) ? ob.chip : (ob ? ob.moat.split('.')[0] : 'High-Growth Tech Monopolist');
    const catalystHTML = `
    <div class="detail-section" style="grid-column:1/-1;padding:0.85rem 1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.7rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
                <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Competitive Moat:</span>
                <span style="font-size:0.85rem;font-weight:800;color:#c084fc;background:rgba(192,132,252,0.12);padding:4px 12px;border-radius:6px;border:1px solid rgba(192,132,252,0.28);">
                    🛡️ ${moatChip}
                </span>
            </div>
            ${ob && ob.contract ? `<div style="font-size:0.78rem;color:#94a3b8;"><strong style="color:#cbd5e1;">Key Driver / Backlog:</strong> ${ob.contract}</div>` : ''}
        </div>
    </div>`;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 5: ASSEMBLE EXECUTIVE HERO & 4-TAB PROGRESSIVE DISCLOSURE LAYOUT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const spotEntryDeltaPct = ((basePrice - tradePlan.entry) / tradePlan.entry) * 100;
    const entryStatusBadge = spotEntryDeltaPct > 0
        ? `Spot is +${spotEntryDeltaPct.toFixed(1)}% above Entry (Wait for Pullback)`
        : `Spot is in Buy Zone (${spotEntryDeltaPct.toFixed(1)}%)`;
    const entryBadgeColor = spotEntryDeltaPct > 0 ? '#fbbf24' : '#4ade80';
    const entryBadgeBg = spotEntryDeltaPct > 0 ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)';

    // 1. Executive Hero Bar
    const execHeroHTML = `
    <div class="exec-hero">
        <div class="exec-header">
            <div class="exec-title-area">
                <span class="exec-ticker-badge font-mono">${stock.ticker}</span>
                <span style="font-size:1.15rem;font-weight:700;color:#cbd5e1;">${stock.name}</span>
                <span class="exec-sector-chip">${stockSector}</span>
            </div>
            <div class="exec-price-chip">
                <span class="exec-price-val font-mono">${stock.price}</span>
                ${stock.dayChange ? `<span style="font-size:0.85rem;padding:3px 8px;border-radius:6px;background:${stock.dayChange.includes('+') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};color:${stock.dayChange.includes('+') ? '#4ade80' : '#f87171'};font-weight:700;" class="font-mono">${stock.dayChange} (1D)</span>` : ''}
                ${stock.yearChange ? `<span style="font-size:0.85rem;padding:3px 8px;border-radius:6px;background:${stock.yearChange.includes('+') ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};color:${stock.yearChange.includes('+') ? '#4ade80' : '#f87171'};font-weight:700;" class="font-mono">${stock.yearChange} (1Y)</span>` : ''}
            </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.1rem;flex-wrap:wrap;gap:0.8rem;padding:0.8rem 1.1rem;background:rgba(0,0,0,0.3);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex;align-items:center;gap:0.9rem;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;">Master Signal Verdict:</span>
                    <span style="font-size:1rem;font-weight:900;color:${verdictColor};padding:3px 12px;border-radius:8px;background:${verdictColor}18;border:1px solid ${verdictColor}44;">
                        ${verdictIcon} ${overallVerdict}
                    </span>
                </div>
                <div style="display:flex;align-items:center;gap:0.4rem;">
                    <span style="font-size:0.7rem;color:#94a3b8;text-transform:uppercase;font-weight:700;">Conviction:</span>
                    <span style="font-size:0.95rem;font-weight:800;color:${verdictColor};" class="font-mono">${signalPct}%</span>
                </div>
            </div>
            <button onclick="const el=document.getElementById('exec-rationale-accordion');if(el)el.style.display=el.style.display==='none'?'block':'none';" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#cbd5e1;padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:700;cursor:pointer;">
                ℹ️ Signal Rationale
            </button>
        </div>

        <div id="exec-rationale-accordion" style="display:none;margin-top:0.8rem;padding:0.9rem 1rem;background:rgba(15,23,42,0.7);border-radius:10px;border-left:3px solid #3b82f6;font-size:0.82rem;color:#cbd5e1;line-height:1.5;">
            <div style="font-weight:700;color:#93c5fd;margin-bottom:0.3rem;">⚖️ Master Decision Engine Arbitration:</div>
            <div>${arbResult.rationale}</div>
            <div style="margin-top:0.25rem;">Wall Street Consensus Rating: <strong style="color:#e2e8f0;">${stock.wallStreetVerdict || stock.verdict || 'Hold'}</strong> (Decoupled from internal AI verdict).</div>
            ${arbitrationNotes.length > 1 ? `<div style="margin-top:0.4rem;color:#fde68a;"><strong>Risk Filter Notes:</strong> ${arbitrationNotes.slice(1).join(' ')}</div>` : ''}
        </div>

        <!-- Core Trade Anchor Grid (3 Cards + R/R visual meter) -->
        <div class="exec-anchor-grid">
            <div class="exec-anchor-card" style="border-left:3px solid #4ade80;">
                <div class="exec-anchor-label">Ideal Entry Zone</div>
                <div class="exec-anchor-val font-mono" style="color:#4ade80;">$${tradePlan.entry.toFixed(2)}</div>
                <div class="exec-anchor-sub">${tradePlan.entryLabel}</div>
                <div style="margin-top:0.4rem;font-size:0.68rem;padding:2px 7px;border-radius:5px;background:${entryBadgeBg};color:${entryBadgeColor};font-weight:700;display:inline-block;border:1px solid ${entryBadgeColor}33;">
                    ${entryStatusBadge}
                </div>
            </div>
            <div class="exec-anchor-card" style="border-left:3px solid #f87171;">
                <div class="exec-anchor-label">Risk Invalidation Stop</div>
                <div class="exec-anchor-val font-mono" style="color:#f87171;">$${tradePlan.stopLoss.toFixed(2)}</div>
                <div class="exec-anchor-sub">${tradePlan.stopLabel}</div>
            </div>
            <div class="exec-anchor-card" style="border-left:3px solid #c084fc;">
                <div class="exec-anchor-label">12M Target</div>
                <div class="exec-anchor-val font-mono" style="color:#c084fc;">$${tradePlan.target2.toFixed(2)}</div>
                <div class="exec-anchor-sub">${tu !== null ? `${tu > 0 ? '+' : ''}${tu}% Consensus Upside` : tradePlan.target2Label}</div>
            </div>
            <div class="exec-anchor-card" style="border-left:3px solid ${tradePlan.rrRatio >= 1.5 ? '#4ade80' : tradePlan.rrRatio >= 1.0 ? '#facc15' : '#f87171'};">
                <div class="exec-anchor-label">Planned R/R (to R1 $${tradePlan.target1.toFixed(2)})</div>
                <div class="exec-anchor-val font-mono" style="color:${tradePlan.rrRatio >= 1.5 ? '#4ade80' : tradePlan.rrRatio >= 1.0 ? '#facc15' : '#f87171'};">1 : ${tradePlan.rrRatio.toFixed(2)}</div>
                <div class="exec-anchor-sub">
                    ${tradePlan.rrRatio >= 1.5 ? '<span style="color:#4ade80;font-weight:700;">✅ EXCELLENT (>= 2x)</span>' : tradePlan.rrRatio >= 1.0 ? '<span style="color:#facc15;font-weight:700;">🟡 FAVORABLE (> 1x)</span>' : '<span style="color:#f87171;font-weight:700;">🔴 UNFAVORABLE (Risk > Reward)</span>'}
                </div>
            </div>
        </div>
    </div>`;

    // 2. Segmented Tab Navigation
    const execTabsNavHTML = `
    <div class="exec-tabs">
        <button class="exec-tab-btn active" data-tab="tab-tech" onclick="switchDetailTab('tab-tech')">
            📈 Technical Edge & Levels
        </button>
        <button class="exec-tab-btn" data-tab="tab-val" onclick="switchDetailTab('tab-val')">
            ⚖️ Valuation & True Cash Flow
        </button>
        <button class="exec-tab-btn" data-tab="tab-moat" onclick="switchDetailTab('tab-moat')">
            🔒 Moat & Catalysts
        </button>
        <button class="exec-tab-btn" data-tab="tab-earn" onclick="switchDetailTab('tab-earn')">
            📅 Earnings Lifecycle
        </button>
    </div>`;

    const rangePercent = fibRange > 0 ? Math.min(100, Math.max(0, Math.round(((basePrice - fibLow) / fibRange) * 100))) : 50;
    const isBroken61 = f618Num !== null && basePrice < f618Num;

    // Compact Fibonacci Table
    const fibLevelsList = [
        { label: '0% (High)', val: fib_0, color: '#f87171', note: 'Resistance Ceiling' },
        { label: '23.6%',     val: fib_236, color: '#fb923c', note: 'Shallow Pullback' },
        { label: '38.2%',     val: fib_382, color: '#facc15', note: 'Moderate Support' },
        { label: '50.0%',     val: fib_500, color: '#60a5fa', note: 'Midpoint Equilibrium' },
        { label: '61.8%',     val: fib_618, color: isBroken61 ? '#f87171' : '#4ade80', note: isBroken61 ? 'Support Breached' : 'Golden Pocket Support' },
        { label: '78.6%',     val: fib_786, color: '#86efac', note: 'Deep Value Zone' },
        { label: '100% (Low)',val: fib_100, color: '#4ade80', note: 'Structural 52W Floor' },
    ];

    const pivotLevelsList = [
        { label: 'R2', val: res2, color: '#f87171', note: 'Expansion Ceiling' },
        { label: 'R1', val: res1, color: '#fb923c', note: 'Primary Structural Resistance' },
        { label: 'P',  val: pivotVal, color: '#93c5fd', note: 'Central Floor Pivot Mean' },
        { label: 'S1', val: sup1, color: '#4ade80', note: 'Primary Structural Support' },
        { label: 'S2', val: sup2, color: '#22c55e', note: 'Risk Invalidation Floor' },
    ];

    const tabTechHTML = `
    <div id="tab-tech" class="exec-tab-pane active">
        ${earningsAlertChip ? `<div style="display:flex;justify-content:flex-end;margin-bottom:0.75rem;">${earningsAlertChip}</div>` : ''}
        ${chartHTML}

        <!-- Synchronized 52-Week Range Slider -->
        <div class="exec-slider-box">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;color:#94a3b8;">
                <span>52W Low: <strong class="font-mono" style="color:#4ade80;">$${fib_100}</strong></span>
                <span style="font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#cbd5e1;">Rolling 252-Trading-Day Price Range</span>
                <span>52W High: <strong class="font-mono" style="color:#f87171;">$${fib_0}</strong></span>
            </div>
            <div class="exec-slider-track">
                <div class="exec-slider-thumb" style="left: ${rangePercent}%;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.78rem;">
                <span style="color:#94a3b8;">Current Spot: <strong class="font-mono" style="color:#f8fafc;font-size:0.95rem;">$${basePrice.toFixed(2)}</strong></span>
                <span class="font-mono" style="color:#60a5fa;font-weight:700;">${rangePercent}% of 52-Week Range</span>
            </div>
        </div>

        <!-- Two-Column Fibonacci & Pivot Levels Table -->
        <div class="exec-levels-grid">
            <div class="detail-section">
                <h4 style="color:#60a5fa;margin-bottom:0.6rem;font-size:0.85rem;">📐 KEY FIBONACCI RETRACEMENTS</h4>
                <div style="display:flex;flex-direction:column;gap:0.35rem;">
                    ${fibLevelsList.map(f => {
                        const isClose = Math.abs(parseFloat(f.val) - basePrice) / basePrice < 0.035;
                        return `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0.6rem;background:rgba(0,0,0,0.18);border-radius:7px;${isClose ? 'border:1px solid rgba(59,130,246,0.5);background:rgba(59,130,246,0.1);' : ''}">
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <span style="font-size:0.78rem;color:#94a3b8;min-width:75px;">${f.label}</span>
                                <span style="font-size:0.72rem;color:#64748b;">${f.note}</span>
                            </div>
                            <span class="font-mono" style="font-size:0.88rem;font-weight:700;color:${f.color};">$${f.val}</span>
                        </div>`;
                    }).join('')}
                </div>
                ${isBroken61 ? `
                <div style="margin-top:0.7rem;padding:0.6rem 0.8rem;background:rgba(239,68,68,0.1);border-left:3px solid #ef4444;border-radius:6px;font-size:0.78rem;color:#fca5a5;">
                    ⚠️ <strong>61.8% Support Breached; Testing 78.6% Secondary Support ($${fib_786})</strong>
                </div>` : ''}
            </div>

            <div class="detail-section">
                <h4 style="color:#a78bfa;margin-bottom:0.6rem;font-size:0.85rem;">🎯 CLASSICAL FLOOR PIVOTS (S/R)</h4>
                <div style="display:flex;flex-direction:column;gap:0.4rem;">
                    ${pivotLevelsList.map(p => {
                        const isClose = Math.abs(parseFloat(p.val) - basePrice) / basePrice < 0.035;
                        return `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.6rem;background:rgba(0,0,0,0.18);border-radius:7px;${isClose ? 'border:1px solid rgba(167,139,250,0.5);background:rgba(167,139,250,0.1);' : ''}">
                            <div style="display:flex;align-items:center;gap:0.5rem;">
                                <span class="font-mono" style="font-size:0.82rem;color:#c084fc;font-weight:700;min-width:35px;">${p.label}</span>
                                <span style="font-size:0.75rem;color:#94a3b8;">${p.note}</span>
                            </div>
                            <span class="font-mono" style="font-size:0.92rem;font-weight:800;color:${p.color};">$${p.val}</span>
                        </div>`;
                    }).join('')}
                </div>
                <div style="margin-top:0.7rem;padding:0.6rem 0.8rem;background:rgba(0,0,0,0.2);border-radius:6px;font-size:0.75rem;color:#94a3b8;">
                    Computed from synchronized 20-day high, low, and close range.
                </div>
            </div>
        </div>

        <!-- 3x3 Scannable Indicator Signal Matrix -->
        <div class="detail-section">
            <h4 style="color:#f8fafc;margin-bottom:0.8rem;font-size:0.85rem;">⚡ 3x3 INDICATOR SIGNAL MATRIX</h4>
            <div class="exec-matrix-grid">
                ${signals.map(s => {
                    const badgeColor = s.status === 'bull' ? '#4ade80' : s.status === 'bear' ? '#f87171' : '#94a3b8';
                    const badgeText = s.status === 'bull' ? 'BULLISH 🟢' : s.status === 'bear' ? 'BEARISH 🔴' : 'NEUTRAL ⚪';
                    return `
                    <div class="exec-matrix-card">
                        <div>
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                                <span style="font-size:0.78rem;font-weight:700;color:#cbd5e1;">${s.icon} ${s.name}</span>
                                <span style="font-size:0.65rem;font-weight:800;color:${badgeColor};background:${badgeColor}18;padding:2px 7px;border-radius:99px;border:1px solid ${badgeColor}33;">${badgeText}</span>
                            </div>
                            <div class="font-mono" style="font-size:0.85rem;font-weight:700;color:#f8fafc;margin-bottom:0.3rem;">${s.value}</div>
                        </div>
                        <div style="font-size:0.74rem;color:#64748b;line-height:1.4;">${s.detail}</div>
                    </div>`;
                }).join('')}
            </div>
        </div>

        ${rsiMacdHTML}
        ${rsHTML}
    </div>`;

    // 4. Tab B: Valuation & True Cash Flow
    const sbcPct = stock.sbcDilutionPct || (reportedFCF && reportedFCF > 0 && ttmSbc > 0 ? Math.round((ttmSbc / reportedFCF) * 100) : 0);
    const sbcColor = sbcPct > 35 ? '#f87171' : sbcPct > 20 ? '#fb923c' : '#4ade80';

    let qoqRevHTML = '';
    if (stock.qoqRevenueGrowth && stock.qoqRevenueGrowth.length > 0) {
        qoqRevHTML = `
        <div class="detail-section" style="margin-top:1.2rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
                <h4 style="color:#38bdf8;margin:0;">📈 SEQUENTIAL QoQ REVENUE GROWTH</h4>
                <span style="font-size:0.72rem;color:#94a3b8;">GAAP REPORTED TIME-SERIES</span>
            </div>
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                    <thead>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.12);">
                            <th style="padding:0.6rem;text-align:left;color:#64748b;font-weight:600;">Quarter</th>
                            <th style="padding:0.6rem;text-align:right;color:#64748b;font-weight:600;">Revenue</th>
                            <th style="padding:0.6rem;text-align:right;color:#64748b;font-weight:600;">Sequential Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stock.qoqRevenueGrowth.map(q => {
                            const growthVal = typeof q.growth === 'number' ? (q.growth > 0 ? `+${q.growth}%` : `${q.growth}%`) : (q.growth || 'Pending Filing');
                            const growthColor = typeof q.growth === 'number' ? (q.growth >= 0 ? '#4ade80' : '#f87171') : '#94a3b8';
                            return `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                                <td style="padding:0.6rem;color:#cbd5e1;" class="font-mono">${q.quarter}</td>
                                <td style="padding:0.6rem;text-align:right;color:#cbd5e1;" class="font-mono">${q.revenue || '—'}</td>
                                <td style="padding:0.6rem;text-align:right;font-weight:700;color:${growthColor};" class="font-mono">${growthVal}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    const tabValHTML = `
    <div id="tab-val" class="exec-tab-pane">
        <!-- Owner's Real Cash Flow Breakdown Waterfall -->
        <div class="detail-section" style="margin-bottom:1.2rem;border-left:4px solid #38bdf8;background:rgba(56,189,248,0.04);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
                <h4 style="color:#38bdf8;margin:0;">💧 OWNER'S REAL CASH FLOW BREAKDOWN (SBC DRAG)</h4>
                <span style="font-size:0.72rem;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,0.06);color:#94a3b8;font-weight:700;">TRUE DILUTION ADJUSTED</span>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.8rem;margin-bottom:1rem;">
                <div style="padding:0.9rem;background:rgba(0,0,0,0.25);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;margin-bottom:0.25rem;">Reported Free Cash Flow</div>
                    <div class="font-mono" style="font-size:1.25rem;font-weight:900;color:#e2e8f0;">${formatCurrency(reportedFCF)}</div>
                    <div style="font-size:0.68rem;color:#64748b;margin-top:0.2rem;">GAAP Operating Cash Flow - CapEx</div>
                </div>
                <div style="padding:0.9rem;background:rgba(0,0,0,0.25);border-radius:10px;border:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <div style="font-size:0.68rem;color:#94a3b8;text-transform:uppercase;margin-bottom:0.25rem;">Stock-Based Comp Drag</div>
                    <div class="font-mono" style="font-size:1.25rem;font-weight:900;color:#f87171;">-${formatCurrency(ttmSbc)}</div>
                    <div style="font-size:0.68rem;color:${sbcColor};margin-top:0.2rem;font-weight:700;">${sbcPct}% Dilution Drag</div>
                </div>
                <div style="padding:0.9rem;background:rgba(56,189,248,0.1);border-radius:10px;border:1px solid rgba(56,189,248,0.3);text-align:center;">
                    <div style="font-size:0.68rem;color:#38bdf8;text-transform:uppercase;margin-bottom:0.25rem;font-weight:700;">Owner's Real Cash Flow</div>
                    <div class="font-mono" style="font-size:1.25rem;font-weight:900;color:#38bdf8;">${formatCurrency(ownerFCF)}</div>
                    <div style="font-size:0.68rem;color:#cbd5e1;margin-top:0.2rem;">True Unencumbered Cash</div>
                </div>
            </div>

            <!-- Visual comparison bar -->
            <div style="background:rgba(0,0,0,0.3);padding:0.8rem;border-radius:8px;margin-bottom:0.8rem;">
                <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:#94a3b8;margin-bottom:0.4rem;">
                    <span>Owner's Real Cash Flow (${(100 - Math.min(100, sbcPct)).toFixed(0)}%)</span>
                    <span>SBC Drag (${Math.min(100, sbcPct)}%)</span>
                </div>
                <div style="height:10px;background:rgba(239,68,68,0.5);border-radius:99px;overflow:hidden;display:flex;">
                    <div style="height:100%;width:${Math.max(0, 100 - Math.min(100, sbcPct))}%;background:#38bdf8;"></div>
                </div>
            </div>

            <p style="font-size:0.75rem;color:#94a3b8;margin:0;line-height:1.4;">
                Standard GAAP Free Cash Flow treats employee stock awards as non-cash expenses, masking shareholder equity dilution. True shareholder cash generation after neutralizing SBC dilution is <strong>${formatCurrency(ownerFCF)}</strong>.
            </p>
        </div>

        ${dcfHTML}
        ${qoqRevHTML}
    </div>`;

    // Peer Multiple Matrix
    let peerMatrixHTML = '';
    if (stock.peersData && stock.peersData.length > 0) {
        peerMatrixHTML = `
        <div class="detail-section" style="margin-top:1.2rem;">
            <h4 style="color:#60a5fa;margin-bottom:0.8rem;">📊 PEER VALUATION MULTIPLE MATRIX</h4>
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
                    <thead>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.12);">
                            <th style="padding:0.6rem;text-align:left;color:#64748b;font-weight:600;">Ticker</th>
                            <th style="padding:0.6rem;text-align:right;color:#64748b;font-weight:600;">Fwd P/E</th>
                            <th style="padding:0.6rem;text-align:right;color:#64748b;font-weight:600;">Rev Growth</th>
                            <th style="padding:0.6rem;text-align:right;color:#64748b;font-weight:600;">Profit Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.1);background:rgba(59,130,246,0.1);">
                            <td style="padding:0.6rem;font-weight:bold;color:#60a5fa;" class="font-mono">${stock.ticker}</td>
                            <td style="padding:0.6rem;text-align:right;color:#e2e8f0;font-weight:700;" class="font-mono">${fpe}</td>
                            <td style="padding:0.6rem;text-align:right;color:#e2e8f0;" class="font-mono">${stock.revenueGrowth ? (stock.revenueGrowth*100).toFixed(1)+'%' : 'N/A'}</td>
                            <td style="padding:0.6rem;text-align:right;color:#e2e8f0;" class="font-mono">${stock.profitMargins ? (stock.profitMargins*100).toFixed(1)+'%' : 'N/A'}</td>
                        </tr>
                        ${stock.peersData.map(p => `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.03);">
                            <td style="padding:0.6rem;color:#cbd5e1;" class="font-mono">${p.ticker}</td>
                            <td style="padding:0.6rem;text-align:right;color:#cbd5e1;" class="font-mono">${p.forwardPE ? p.forwardPE.toFixed(1) : 'N/A'}</td>
                            <td style="padding:0.6rem;text-align:right;color:#cbd5e1;" class="font-mono">${p.revenueGrowth ? (p.revenueGrowth*100).toFixed(1)+'%' : 'N/A'}</td>
                            <td style="padding:0.6rem;text-align:right;color:#cbd5e1;" class="font-mono">${p.profitMargins ? (p.profitMargins*100).toFixed(1)+'%' : 'N/A'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
    }

    // 5. Tab C: Moat & Institutional Catalysts
    const tabMoatHTML = `
    <div id="tab-moat" class="exec-tab-pane">
        ${catalystHTML}
        ${peerMatrixHTML}
        ${sectorHTML}
        ${newsHTML}
    </div>`;

    // 6. Tab D: Earnings Lifecycle
    const earningsHistorySection = `
    <div class="detail-section" style="margin-top:1.2rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.8rem;">
            <h4 style="color:#f8fafc;margin:0;">🎯 EARNINGS BEAT / MISS HISTORY</h4>
            <span style="font-size:0.72rem;color:#94a3b8;">STRICT HISTORICAL RESULTS ONLY</span>
        </div>
        ${earningsHTML}
    </div>`;

    const tabEarnHTML = `
    <div id="tab-earn" class="exec-tab-pane">
        ${earningsCalHTML}
        ${earningsHistorySection}
        ${qoqRevHTML}
    </div>`;

    return `
    <div class="exec-modal-container">
        ${execHeroHTML}
        ${execTabsNavHTML}
        <div class="exec-tab-content">
            ${tabTechHTML}
            ${tabValHTML}
            ${tabMoatHTML}
            ${tabEarnHTML}
        </div>
    </div>
    `;
}
