---
name: rest-api-design
description: RESTful API design patterns including resource modeling, HTTP methods, status codes, pagination, versioning, and error handling. Use when designing or implementing REST APIs.
metadata:
  author: aidlc-framework
  version: "1.0"
  agents: backend-developer, architect
---

# REST API Design

## Resource Modeling
- Use nouns for resources, not verbs
- Nest resources to show relationships
- Use plural names for collections

## HTTP Methods
- GET: Read (safe, idempotent)
- POST: Create
- PUT: Full update (idempotent)
- PATCH: Partial update
- DELETE: Remove (idempotent)

## Status Codes
200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error
