# 🔒 Security Documentation

## Overview
This document outlines the security measures implemented in the NextHono application.

## Security Features

### 1. Rate Limiting
- **Implementation**: Custom rate limiting middleware
- **Configuration**: 100 requests per 15 minutes per IP
- **Location**: `app/lib/middleware/security.ts`
- **Environment Variables**: `API_RATE_LIMIT`, `API_RATE_LIMIT_WINDOW`

### 2. Security Headers
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: `camera=(), microphone=(), geolocation=()`
- **Content-Security-Policy**: Restrictive CSP policy
- **Strict-Transport-Security**: `max-age=31536000; includeSubDomains` (production only)

### 3. CORS Configuration
- **Allowed Origins**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Default**: `http://localhost:3000`
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: true

### 4. Input Validation
- **Zod Schemas**: Runtime type validation
- **SQL Injection Protection**: Drizzle ORM with parameterized queries
- **XSS Protection**: Input sanitization and CSP headers

### 5. Error Handling
- **Structured Error Responses**: Consistent error format
- **No Information Disclosure**: Production errors don't expose internal details
- **Custom Error Classes**: Proper error hierarchy

### 6. Logging
- **Structured Logging**: Winston logger with JSON format
- **Log Levels**: error, warn, info, http, debug
- **File Logging**: Separate error and combined logs
- **No Sensitive Data**: Passwords and tokens are not logged

## Environment Variables

```bash
# Security Configuration
NODE_ENV=development|production|test
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info|debug|warn|error

# Database
DATABASE_URL=./app/lib/db/database.sqlite
```

## Security Best Practices

### 1. Development
- Never commit sensitive data to version control
- Use environment variables for configuration
- Enable all security headers in development
- Monitor logs for suspicious activity

### 2. Production
- Use HTTPS only
- Set appropriate CORS origins
- Monitor rate limiting
- Regular security audits
- Keep dependencies updated

### 3. Database Security
- Use parameterized queries (Drizzle ORM)
- Validate all inputs
- Implement proper access controls
- Regular backups

## Monitoring

### Health Checks
- Endpoint: `/api/health`
- Database connectivity check
- Response time monitoring
- Memory usage tracking

### Logging
- Request/response logging
- Error tracking
- Performance metrics
- Security events

## Incident Response

### Rate Limit Exceeded
- HTTP 429 response
- Retry-After header
- Logged for monitoring

### Invalid Input
- HTTP 400 response
- Detailed validation errors
- Logged for debugging

### Server Errors
- HTTP 500 response
- Generic error message (production)
- Detailed error message (development)
- Logged with stack trace

## Future Security Enhancements

1. **Authentication & Authorization**
   - JWT tokens
   - Role-based access control
   - Session management

2. **Advanced Rate Limiting**
   - Redis-based rate limiting
   - Per-endpoint limits
   - User-based limits

3. **API Security**
   - API key authentication
   - Request signing
   - API versioning

4. **Monitoring & Alerting**
   - Real-time security monitoring
   - Automated alerts
   - Security dashboards

## Security Contacts

For security issues, please contact the development team or create a security issue in the repository.
