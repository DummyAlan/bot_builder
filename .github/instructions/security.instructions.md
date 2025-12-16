---
applyTo: "code-review"
name: "Security Instructions"
description: "Security best practices and guidelines for secure coding"
---

# Security Instructions

## Security Best Practices

- **Input Validation** - Always validate and sanitize user inputs; use schema validation libraries
- **Avoid Dynamic Imports from User Input** - Never use user-controlled strings in dynamic imports
- **XSS Prevention** - Avoid unsafe HTML rendering; sanitize when absolutely necessary
- **SQL Injection Prevention** - Use parameterized queries or ORM methods; never concatenate user input into queries
- **Dependency Management** - Keep dependencies updated; run security audits regularly
- **Environment Variables** - Never expose secrets in client code; handle sensitive data server-side only
- **Authentication & Authorization** - Validate permissions server-side; never trust client-side checks
- **Rate Limiting** - Implement rate limiting for API routes and server actions to prevent abuse
- **HTTPS Only** - Ensure production deployments enforce HTTPS; set secure headers
- **Content Security Policy** - Configure CSP headers to prevent XSS and injection attacks
