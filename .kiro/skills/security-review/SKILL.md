---
name: security-review
description: Security review checklist covering OWASP Top 10, input validation, authentication, authorization, and secure coding. Use when reviewing code or designs for security.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: security-engineer
---

# Security Review — OWASP Top 10
- Injection: Parameterized queries, input sanitization
- Broken Auth: Strong passwords, MFA, session management
- Sensitive Data: Encryption at rest and in transit
- Broken Access Control: Least privilege, RBAC
- XSS: Output encoding, CSP headers
- Vulnerable Components: Dependency scanning
- Insufficient Logging: Audit trails, security events
