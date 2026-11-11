const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `http://${host}`);
  
  if (url.pathname === '/health' || url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'cloud-microservice-node'
    }));
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Service Online</title>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { background: #1e293b; padding: 2rem 3rem; border-radius: 12px; border: 1px solid #334155; text-align: center; }
    h2 { margin: 0 0 0.5rem 0; color: #38bdf8; }
    p { color: #94a3b8; font-size: 0.95rem; }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #065f46; color: #34d399; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Cloud Microservice Gateway</h2>
    <p>Containerized stateless microservice daemon</p>
    <div class="badge">System Healthy &middot; Active</div>
  </div>
</body>
</html>`);
});

server.listen(PORT, () => {
  console.log(`Microservice listening on port ${PORT}`);
});
