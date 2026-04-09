---
name: accessibility-audit
description: Web accessibility audit covering semantic HTML, ARIA, keyboard navigation, colour contrast, and screen readers. Use when reviewing or generating accessible web content.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: frontend-developer, qa-engineer
---

# Accessibility Audit

## Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Landmark elements (nav, main, aside, footer)
- Lists for navigation and grouped items

## Keyboard Navigation
- All interactive elements focusable
- Tab order follows visual layout
- Visible focus indicators
- Escape closes modals/overlays

## Colour and Contrast
- 4.5:1 minimum for normal text
- 3:1 minimum for large text
- Don't rely on colour alone
