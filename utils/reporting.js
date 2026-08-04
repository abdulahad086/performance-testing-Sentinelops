function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatNumber(value, digits = 2) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "-";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(digits);
  }

  return escapeHtml(value);
}

function metricValue(data, metricName, field) {
  return data.metrics?.[metricName]?.values?.[field];
}

function renderMetricRow(data, metricName, label) {
  const values = data.metrics?.[metricName]?.values;

  if (!values) {
    return "";
  }

  return `
    <tr>
      <td>${escapeHtml(label)}</td>
      <td>${formatNumber(values.count)}</td>
      <td>${formatNumber(values.rate)}</td>
      <td>${formatNumber(values.avg)}</td>
      <td>${formatNumber(values.med)}</td>
      <td>${formatNumber(values["p(95)"])}</td>
      <td>${formatNumber(values.max)}</td>
    </tr>
  `;
}

function renderTags(tags = {}) {
  const entries = Object.entries(tags);

  if (!entries.length) {
    return '<p class="muted">No top-level scenario tags were recorded.</p>';
  }

  return `
    <div class="tag-list">
      ${entries
        .map(
          ([key, value]) =>
            `<span class="tag"><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</span>`
        )
        .join("")}
    </div>
  `;
}

export function buildHtmlReport(data, title = "k6 Performance Report") {
  const checksRate = metricValue(data, "checks", "rate");
  const failedRate = metricValue(data, "http_req_failed", "rate");
  const p95Duration = metricValue(data, "http_req_duration", "p(95)");
  const responseTrend = metricValue(data, "api_response_time", "p(95)");
  const passed = (checksRate ?? 1) >= 0.99 && (failedRate ?? 0) < 0.01;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5f1eb;
        --panel: #fffdf9;
        --ink: #1f2933;
        --muted: #62707f;
        --accent: #0f766e;
        --accent-soft: #d8f3ef;
        --border: #e4ddd2;
        --good: #1a7f37;
        --bad: #b42318;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(15, 118, 110, 0.12), transparent 30%),
          linear-gradient(180deg, #faf7f2 0%, var(--bg) 100%);
      }

      .shell {
        max-width: 1180px;
        margin: 0 auto;
        padding: 40px 20px 56px;
      }

      .hero {
        display: grid;
        gap: 16px;
        margin-bottom: 28px;
      }

      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--accent);
        font-size: 12px;
        font-weight: 700;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.2rem, 4vw, 3.6rem);
        line-height: 1.05;
      }

      .subhead {
        color: var(--muted);
        font-size: 1rem;
        max-width: 70ch;
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: fit-content;
        padding: 10px 14px;
        border-radius: 999px;
        background: ${passed ? "rgba(26, 127, 55, 0.12)" : "rgba(180, 35, 24, 0.12)"};
        color: ${passed ? "var(--good)" : "var(--bad)"};
        font-weight: 700;
      }

      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        margin-bottom: 28px;
      }

      .card, .panel {
        background: rgba(255, 253, 249, 0.86);
        border: 1px solid var(--border);
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(31, 41, 51, 0.07);
      }

      .card {
        padding: 18px;
      }

      .card-label {
        color: var(--muted);
        font-size: 0.84rem;
        margin-bottom: 10px;
      }

      .card-value {
        font-size: 2rem;
        font-weight: 800;
      }

      .card-note {
        color: var(--muted);
        font-size: 0.88rem;
        margin-top: 6px;
      }

      .panel {
        padding: 22px;
        margin-bottom: 18px;
      }

      h2 {
        margin: 0 0 16px;
        font-size: 1.2rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        text-align: left;
        padding: 12px 10px;
        border-bottom: 1px solid var(--border);
        vertical-align: top;
      }

      th {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }

      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .tag {
        background: var(--accent-soft);
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--ink);
      }

      .muted { color: var(--muted); }

      @media (max-width: 720px) {
        .shell { padding: 24px 14px 40px; }
        .panel { padding: 16px; }
        th, td { padding: 10px 8px; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div class="eyebrow">Performance Report</div>
        <h1>${escapeHtml(title)}</h1>
        <div class="subhead">
          Summary for ${escapeHtml(data.options?.vus ?? "n/a")} virtual users across ${escapeHtml(
            data.metrics?.iterations?.values?.count ?? 0
          )} iterations.
        </div>
        <div class="status">${passed ? "Thresholds passed" : "Thresholds need attention"}</div>
      </section>

      <section class="grid">
        <div class="card">
          <div class="card-label">HTTP request failures</div>
          <div class="card-value">${formatNumber(failedRate, 4)}</div>
          <div class="card-note">Lower is better.</div>
        </div>
        <div class="card">
          <div class="card-label">HTTP p95 latency</div>
          <div class="card-value">${formatNumber(p95Duration)} ms</div>
          <div class="card-note">Primary service-level indicator.</div>
        </div>
        <div class="card">
          <div class="card-label">Custom p95 latency</div>
          <div class="card-value">${formatNumber(responseTrend)} ms</div>
          <div class="card-note">Tracked via api_response_time.</div>
        </div>
        <div class="card">
          <div class="card-label">Checks pass rate</div>
          <div class="card-value">${formatNumber(checksRate, 4)}</div>
          <div class="card-note">Reusable validations across scripts.</div>
        </div>
      </section>

      <section class="panel">
        <h2>Scenario Tags</h2>
        ${renderTags(data.root_group?.group?.tags ?? data.options?.tags ?? {})}
      </section>

      <section class="panel">
        <h2>Metric Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Count</th>
              <th>Rate</th>
              <th>Average</th>
              <th>Median</th>
              <th>p95</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            ${renderMetricRow(data, "http_req_duration", "HTTP request duration")}
            ${renderMetricRow(data, "http_req_failed", "HTTP request failures")}
            ${renderMetricRow(data, "checks", "Checks")}
            ${renderMetricRow(data, "api_response_time", "Custom response time")}
            ${renderMetricRow(data, "success_rate", "Success rate")}
            ${renderMetricRow(data, "successful_requests", "Successful requests")}
            ${renderMetricRow(data, "failed_requests", "Failed requests")}
            ${renderMetricRow(data, "active_users", "Active users")}
          </tbody>
        </table>
      </section>
    </main>
  </body>
</html>`;
}

export function createSummaryHandler(title = "k6 Performance Report") {
  return (data) => ({
    "reports/result.json": JSON.stringify(data, null, 2),
    "reports/report.html": buildHtmlReport(data, title),
  });
}