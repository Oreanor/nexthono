import { Context, Next } from 'hono'

/**
 * Security middleware for adding security headers
 */
export async function securityHeaders(c: Context, next: Next) {
  // Security Headers
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )
  
  // HSTS (only for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  await next()
}

/**
 * CORS middleware
 */
export async function corsMiddleware(c: Context, next: Next) {
  const origin = c.req.header('Origin')
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
  
  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
  }
  
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  c.header('Access-Control-Allow-Credentials', 'true')
  
  if (c.req.method === 'OPTIONS') {
    return c.status(204)
  }
  
  await next()
}

/**
 * Rate limiting middleware (simple implementation)
 */
export function createRateLimiter(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    const userRequests = requests.get(ip)
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs })
    } else if (userRequests.count >= maxRequests) {
      return c.json({ 
        error: 'Too many requests', 
        message: 'Rate limit exceeded. Please try again later.' 
      }, 429)
    } else {
      userRequests.count++
    }
    
    await next()
  }
}
