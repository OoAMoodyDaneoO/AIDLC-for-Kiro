---
name: observability-setup
description: Observability patterns for metrics, logs, traces, dashboards, and alerting. Use when setting up monitoring or production observability.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: sre-engineer, devops-engineer
---

# Observability — Three Pillars
- Metrics: Latency, error rate, throughput
- Logs: Structured JSON, correlation IDs
- Traces: Distributed tracing across services

## Alerting
- Define SLIs and SLOs
- Alert on SLO burn rate
- Severity levels: critical, warning, info
