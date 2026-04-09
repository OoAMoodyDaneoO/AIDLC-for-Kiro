---
name: terraform-patterns
description: Terraform IaC patterns including module structure, state management, and AWS resource provisioning. Use when generating or reviewing Terraform code.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: devops-engineer
---

# Terraform Patterns
- Root module for orchestration, child modules for reuse
- Remote state (S3 + DynamoDB locking)
- Use data sources over hardcoded values
- Tag all resources consistently
