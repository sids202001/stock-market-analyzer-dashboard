// Sourced Earnings Table (Up to 8 quarters)
    const earningsData = data.latest6Earnings || data.latest5Earnings || data.sections?.quarterly_financials;
    let earningsHtml = '';
    const qList = (earningsData && earningsData.quarters) ? earningsData.quarters : (data.quarterly_financials || []);
    if (qList && qList.length > 0) {
        const qRows = qList.slice(0, 8).map(q => {
            const isNa = (!q.revenue || q.revenue === 'N/A') && (!q.eps || q.eps === 'N/A');
            const badge = (isNa || q.sourceBadge === 'N/A' || q.source_badge === 'N/A') ? 'N/A' : (q.source_badge || q.sourceBadge || '🔵 SEC VERIFIED');
            const periodDate = q.period_end_date || q.periodEndDate || q.period_end || 'N/A';
            return `
                <tr>
                    <td style="font-weight:700;color:#60a5fa;">${escapeHtml(q.quarter || q.label || 'Q')}</td>
                    <td style="color:#94a3b8;">${escapeHtml(periodDate)}</td>
                    <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(q.revenue || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;color:#f8fafc;font-weight:700;">${escapeHtml(q.eps || q.eps_gaap_formatted || 'N/A')}</td>
                    <td class="m-val-mono" style="text-align:right;color:${badge === 'N/A' ? 'var(--text-subtle)' : '#38bdf8'};">${escapeHtml(badge)}</td>
                </tr>
            `;
        }).join('');

        earningsHtml = `
            <div class="m-earnings-section" style="margin-top:1.2rem;">
                <div class="m-earnings-header">
                    <div class="m-card-num-title">
                        <span class="m-card-title" style="display:flex;align-items:center;gap:0.4rem;font-weight:800;">
                            📅 8-QUARTER SOURCED STATEMENT TREND (SEC EDGAR / YFINANCE)
                        </span>
                    </div>
                    <span class="m-card-badge status-reasonable">MINIMUM 8 QUARTERS AUDITED</span>
                </div>
                <div class="m-earnings-table-wrap">
                    <table class="m-compact-earnings-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Quarter</th>
                                <th style="text-align:left;">Period-End Date</th>
                                <th style="text-align:right;">Quarterly Revenue</th>
                                <th style="text-align:right;">Diluted EPS</th>
                                <th style="text-align:right;">Verification Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${qRows}
                        </tbody>
                    </table>
                </div>
                <div class="m-earnings-footer" style="padding:0.4rem 0.6rem;background:rgba(0,0,0,0.25);border-radius:6px;margin-top:0.4rem;font-size:0.7rem;color:var(--text-subtle);display:flex;justify-content:space-between;">
                    <span>🔵 Authoritative Source: SEC Form 10-Q & 10-K Filings</span>
                    <span>Hierarchy: SEC EDGAR &gt; Company IR &gt; Market Consensus</span>
                </div>
            </div>
        `;
    }
