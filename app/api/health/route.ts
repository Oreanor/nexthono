import { NextResponse } from 'next/server'
import { db } from '@/app/lib/db'
import logger from '@/app/lib/logger'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Проверяем подключение к БД
    await db.run('SELECT 1 as health_check')
    
    const responseTime = Date.now() - startTime
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    }
    
    logger.info('Health check passed', healthStatus)
    
    return NextResponse.json(healthStatus, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Health check failed', { error: errorMessage })
    
    const healthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: errorMessage,
      database: {
        status: 'disconnected'
      }
    }
    
    return NextResponse.json(healthStatus, { status: 503 })
  }
}
