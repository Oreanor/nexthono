import { Hono } from 'hono'
import usersRouter from './users'
import { securityHeaders, corsMiddleware, createRateLimiter } from '@/app/lib/middleware/security'
import { config } from '@/app/lib/config/env'
import logger from '@/app/lib/logger'

const app = new Hono()

// Применяем security middleware
app.use('*', securityHeaders)
app.use('*', corsMiddleware)
app.use('*', createRateLimiter(config.rateLimit.maxRequests, config.rateLimit.windowMs))

// Логирование запросов
app.use('*', async (c, next) => {
  const startTime = Date.now()
  const method = c.req.method
  const path = c.req.path
  
  logger.http(`${method} ${path} - Request started`)
  
  await next()
  
  const responseTime = Date.now() - startTime
  const status = c.res.status
  
  logger.http(`${method} ${path} - ${status} - ${responseTime}ms`)
})

// Health check endpoint
app.get('/', async (c) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: '1.0.0',
    }
    
    logger.info('Health check passed', healthStatus)
    return c.json(healthStatus)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Health check failed', { error: errorMessage })
    return c.json({ 
      status: 'unhealthy', 
      error: errorMessage 
    }, 503)
  }
})

// API routes
app.route('/users', usersRouter)

// 404 handler
app.notFound((c) => {
  logger.warn('Route not found', { path: c.req.path, method: c.req.method })
  return c.json({ 
    error: 'Not Found', 
    message: 'The requested resource was not found' 
  }, 404)
})

// Error handler
app.onError((err, c) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    stack: err.stack,
    path: c.req.path,
    method: c.req.method
  })
  
  return c.json({ 
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  }, 500)
})

export default app
