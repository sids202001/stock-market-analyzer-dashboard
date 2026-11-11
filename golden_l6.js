// 📅 LATEST 6 EARNINGS REPORTS Table
    const l6Data = data.latest6Earnings || {};
    const l6Quarters = (l6Data.quarters || (data.sections?.quarterly_financials?.quarters) || (data.quarterly_financials) || []).slice(0, 6);
    let latest6Html = '';
    if (l6Quarters.length > 0) {
        const beatCount = l6Quarters.filter(q => q.resultClass === 'beat' || (q.result && q.result.includes('Beat'))).length;
        const totalEvaluated = l6Quarters.filter(q => q.resultClass === 'beat' || q.resultClass === 'miss' || (q.result && (q.result.includes('Beat') || q.result.includes('Miss')))).length;
        const asOfStr = data.as_of_date || 'October 06, 2026';
        const consensusSrc = l6Data.consensusSource || `LSEG / S&P Global Consensus as of ${asOfStr}`;
        const l6Rows = l6Quarters.map(q => {
            let resBadge = '<span style="color:#94a3b8;font-weight:600;">N/A</span>';
            if (q.resultClass === 'beat' || (q.result && q.result.includes('Beat'))) {
                resBadge = '<span style="color:#34d399;font-weight:700;">✅ Beat</span>';
            } else if (q.resultClass === 'miss' || (q.result && q.result.includes('Miss'))) {
                resBadge = '<span style="color:#f87171;font-weight:700;">❌ Miss</span>';
            }
            return `
                <tr>
                    <td style="font-weight:700;color:#60a5fa;">${escapeHtml(q.quarter || 'Q')}</td>
                    <td style="color:#94a3b8;">${escapeHtml(q.reportDate || q.period_end_date || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(q.revenue || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;color:#f8fafc;font-weight:700;">${escapeHtml(q.eps || q.eps_gaap_formatted || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;color:#fcd34d;">${escapeHtml(q.estimate || q.est_eps || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;">${resBadge}</td>
                </tr>
            `;
        }).join('');

        latest6Html = `
            <div class="m-earnings-section" style="margin-top:1.2rem;">
                <div class="m-earnings-header">
                    <div class="m-card-num-title">
                        <span class="m-card-title" style="display:flex;align-items:center;gap:0.4rem;font-weight:800;">
                            📅 LATEST 6 EARNINGS REPORTS
                        </span>
                    </div>
                    <span class="m-card-badge status-reasonable">SEC FORM 10-Q / 10-K REPORTED</span>
                </div>
                <div class="m-earnings-table-wrap">
                    <table class="m-compact-earnings-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Quarter</th>
                                <th style="text-align:left;">Report Date</th>
                                <th style="text-align:right;">Revenue</th>
                                <th style="text-align:right;">Reported EPS (Adjusted, non-GAAP)</th>
                                <th style="text-align:right;">Consensus EPS Est.</th>
                                <th style="text-align:right;">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${l6Rows}
                        </tbody>
                    </table>
                </div>
                <div class="m-earnings-footer" style="padding:0.4rem 0.6rem;background:rgba(0,0,0,0.25);border-radius:6px;margin-top:0.4rem;font-size:0.7rem;color:var(--text-subtle);display:flex;justify-content:space-between;flex-wrap:gap:0.4rem;">
                    <span style="font-weight:700;color:#cbd5e1;">Earnings Trend: ${beatCount}/${totalEvaluated || 6} beats</span>
                    <span>🔵 Actuals: SEC Form 10-Q / 10-K Releases • 🟡 Consensus: ${escapeHtml(consensusSrc)} • Diluted EPS (Adjusted)</span>
                </div>
            </div>
        `;
    }
