// Annual Statement Table (4 years)
    let annualHtml = '';
    const aList = data.annualFinancials || data.sections?.annual_financials?.years || [];
    if (aList && aList.length > 0) {
        const aRows = aList.map(a => {
            const isNa = (!a.revenue || a.revenue === 'N/A') && (!a.fcf || a.fcf === 'N/A');
            const badge = (isNa || a.source_badge === 'N/A') ? 'N/A' : (a.source_badge || '🔵 SEC VERIFIED');
            return `
            <tr>
                <td style="font-weight:700;color:#a855f7;">${escapeHtml(a.fiscal_year)}</td>
                <td style="color:#94a3b8;">${escapeHtml(a.period_end_date)}</td>
                <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(a.revenue)}</td>
                <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(a.operating_income)}</td>
                <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(a.ocf)}</td>
                <td class="m-val-mono" style="text-align:right;color:#cbd5e1;">${escapeHtml(a.capex)}</td>
                <td class="m-val-mono" style="text-align:right;font-weight:700;color:#34d399;">${escapeHtml(a.fcf)}</td>
                <td class="m-val-mono" style="text-align:right;color:${badge === 'N/A' ? 'var(--text-subtle)' : '#38bdf8'};">${escapeHtml(badge)}</td>
            </tr>
        `}).join('');

        annualHtml = `
            <div class="m-earnings-section" style="margin-top:1.2rem;">
                <div class="m-earnings-header">
                    <div class="m-card-num-title">
                        <span class="m-card-title" style="display:flex;align-items:center;gap:0.4rem;font-weight:800;">
                            📊 MULTI-YEAR ANNUAL STATEMENT TREND (FY2023 - FY2026)
                        </span>
                    </div>
                    <span class="m-card-badge status-reasonable">AUDITED 10-K ANNUAL STATEMENTS</span>
                </div>
                <div class="m-earnings-table-wrap">
                    <table class="m-compact-earnings-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Fiscal Year</th>
                                <th style="text-align:left;">Period-End</th>
                                <th style="text-align:right;">Annual Revenue</th>
                                <th style="text-align:right;">Operating Income</th>
                                <th style="text-align:right;">Operating Cash Flow</th>
                                <th style="text-align:right;">Capex</th>
                                <th style="text-align:right;">Free Cash Flow</th>
                                <th style="text-align:right;">Audit Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${aRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
