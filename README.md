---
title: Cloud Runtime Metric Monitor
emoji: 📊
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# Cloud Runtime Metric Monitor

A lightweight, zero-dependency Node.js system telemetry and edge microservice health demonstration.

## Features
- Real-time memory footprint and process uptime telemetry
- Dual-mode port adaptation (supports container default 7860 and PaaS injected PORT)
- Responsive dark-mode dashboard for container runtime inspection
- Standardized `/health` probe for cloud uptime monitors

## API Endpoints
- `GET /`: Interactive web telemetry dashboard
- `GET /health`: JSON status probe for orchestrators
