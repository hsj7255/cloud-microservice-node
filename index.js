const http = require('http');

// Adaptively bind: HF uses 7860, Zeabur/standard PaaS uses process.env.PORT
const PORT = process.env.PORT || 7860;

const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Runtime Telemetry &middot; Cloud Node</title>
  <style>
    :root {
      --bg: #090d16;
      --card: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --muted: #9ca3af;
      --accent: #38bdf8;
      --success: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2.5rem 1.5rem;
      max-width: 760px;
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }
    h1 { font-size: 1.5rem; font-weight: 700; color: #fff; }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .metric-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .metric-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); margin-bottom: 0.35rem; }
    .metric-value { font-size: 1.6rem; font-weight: 700; color: #fff; }
    .metric-sub { font-size: 0.8rem; color: var(--accent); margin-top: 0.25rem; }
    .log-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .log-title { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #e5e7eb; }
    pre {
      background: #030712;
      padding: 1rem;
      border-radius: 8px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.8rem;
      color: #94a3b8;
      overflow-x: auto;
    }
    footer {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Runtime Telemetry Node</h1>
      <p style="color:var(--muted);font-size:0.875rem;">Stateless Micro-Engine Instance</p>
    </div>
    <div class="status-pill">
      <span class="status-dot"></span>
      <span>Cluster Healthy</span>
    </div>
  </header>

  <div class="grid">
    <div class="metric-card">
      <div class="metric-title">Engine Uptime</div>
      <div class="metric-value" id="uptime">0s</div>
      <div class="metric-sub">Continuous Execution</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">V8 Heap Alloc</div>
      <div class="metric-value" id="heap">0 MB</div>
      <div class="metric-sub">RSS Stable</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">Protocol State</div>
      <div class="metric-value" style="color:var(--success)">200 OK</div>
      <div class="metric-sub">Zero Ingress Errors</div>
    </div>
  </div>

  <div class="log-card">
    <div class="log-title">Heartbeat System Diagnostics</div>
    <pre id="diag">Polling engine telemetry...</pre>
  </div>

  <footer>
    <p>&copy; 2026 Telemetry Node &middot; Automated High-Availability Cluster</p>
  </footer>

  <script>
    async function sync() {
      try {
        const res = await fetch('/health');
        const d = await res.json();
        document.getElementById('uptime').textContent = Math.floor(d.uptime) + 's';
        document.getElementById('heap').textContent = (d.memory.heapUsed / 1024 / 1024).toFixed(1) + ' MB';
        document.getElementById('diag').textContent = JSON.stringify(d, null, 2);
      } catch (e) {
        document.getElementById('diag').textContent = 'Sync error: ' + e;
      }
    }
    sync();
    setInterval(sync, 3000);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `http://${host}`);

  if (url.pathname === '/health' || url.pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    return res.end(JSON.stringify({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'cloud-runtime-metric-monitor',
      memory: process.memoryUsage(),
      node_version: process.version
    }));
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(DASHBOARD_HTML);
});

server.listen(PORT, () => {
  console.log(`Telemetry Microservice listening adaptively on port ${PORT}`);
});
