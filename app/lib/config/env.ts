import { z } from 'zod'

// Схема для валидации environment переменных
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  API_RATE_LIMIT: z.string().transform(Number).default(100),
  API_RATE_LIMIT_WINDOW: z.string().transform(Number).default(900000), // 15 минут
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  PORT: z.string().transform(Number).default(3000),
})

// Валидируем environment переменные
const env = envSchema.parse(process.env)

// Экспортируем типизированные переменные
export const config = {
  nodeEnv: env.NODE_ENV,
  database: {
    url: env.DATABASE_URL || './app/lib/db/database.sqlite',
  },
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  rateLimit: {
    maxRequests: env.API_RATE_LIMIT,
    windowMs: env.API_RATE_LIMIT_WINDOW,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  server: {
    port: env.PORT,
  },
} as const

// Тип для конфигурации
export type Config = typeof config

// Функция для получения конфигурации
export function getConfig(): Config {
  return config
}
