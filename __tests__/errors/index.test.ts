import {
  AppError,
  ValidationError,
  DatabaseError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError
} from '@/app/lib/errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create base error with message', () => {
      const error = new AppError('Test error message')
      
      expect(error.message).toBe('Test error message')
      expect(error.name).toBe('AppError')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(true)
    })

    it('should create error with custom status code', () => {
      const error = new AppError('Test error', 400)
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(400)
    })

    it('should create error with custom operational flag', () => {
      const error = new AppError('Test error', 500, false)
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.isOperational).toBe(false)
    })

    it('should be instance of Error', () => {
      const error = new AppError('Test')
      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with default status code', () => {
      const error = new ValidationError('Invalid data')
      
      expect(error.message).toBe('Invalid data')
      expect(error.statusCode).toBe(400)
      expect(error.name).toBe('ValidationError')
    })

    it('should create validation error with details', () => {
      const error = new ValidationError('Invalid data', { field: 'email', value: 'invalid' })
      expect(error.message).toBe('Invalid data')
      expect(error.statusCode).toBe(400)
      expect(error.details).toEqual({ field: 'email', value: 'invalid' })
    })

    it('should be instance of AppError', () => {
      const error = new ValidationError('Test')
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('DatabaseError', () => {
    it('should create database error with default status code', () => {
      const error = new DatabaseError('Database connection failed')
      
      expect(error.message).toBe('Database connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('DatabaseError')
    })

    it('should create database error with original error', () => {
      const originalError = new Error('SQL error')
      const error = new DatabaseError('Database connection failed', originalError)
      
      expect(error.message).toBe('Database connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.originalError).toBe(originalError)
    })

    it('should be instance of AppError', () => {
      const error = new DatabaseError('Test')
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('NotFoundError', () => {
    it('should create not found error with resource only', () => {
      const error = new NotFoundError('User')
      
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
      expect(error.name).toBe('NotFoundError')
    })

    it('should create not found error with resource and id', () => {
      const error = new NotFoundError('User', 123)
      
      expect(error.message).toBe('User with id 123 not found')
      expect(error.statusCode).toBe(404)
    })

    it('should be instance of AppError', () => {
      const error = new NotFoundError('Test')
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('ConflictError', () => {
    it('should create conflict error with default status code', () => {
      const error = new ConflictError('User already exists')
      
      expect(error.message).toBe('User already exists')
      expect(error.statusCode).toBe(409)
      expect(error.name).toBe('ConflictError')
    })

    it('should be instance of AppError', () => {
      const error = new ConflictError('Test')
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('UnauthorizedError', () => {
    it('should create unauthorized error with default message', () => {
      const error = new UnauthorizedError()
      
      expect(error.message).toBe('Unauthorized')
      expect(error.statusCode).toBe(401)
      expect(error.name).toBe('UnauthorizedError')
    })

    it('should create unauthorized error with custom message', () => {
      const error = new UnauthorizedError('Authentication required')
      
      expect(error.message).toBe('Authentication required')
      expect(error.statusCode).toBe(401)
    })

    it('should be instance of AppError', () => {
      const error = new UnauthorizedError()
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('ForbiddenError', () => {
    it('should create forbidden error with default message', () => {
      const error = new ForbiddenError()
      
      expect(error.message).toBe('Forbidden')
      expect(error.statusCode).toBe(403)
      expect(error.name).toBe('ForbiddenError')
    })

    it('should create forbidden error with custom message', () => {
      const error = new ForbiddenError('Access denied')
      
      expect(error.message).toBe('Access denied')
      expect(error.statusCode).toBe(403)
    })

    it('should be instance of AppError', () => {
      const error = new ForbiddenError()
      expect(error).toBeInstanceOf(AppError)
    })
  })

  describe('Error inheritance chain', () => {
    it('should maintain proper inheritance', () => {
      const validationError = new ValidationError('Test')
      const databaseError = new DatabaseError('Test')
      const notFoundError = new NotFoundError('Test')
      const conflictError = new ConflictError('Test')
      const unauthorizedError = new UnauthorizedError('Test')
      const forbiddenError = new ForbiddenError('Test')

      expect(validationError).toBeInstanceOf(AppError)
      expect(databaseError).toBeInstanceOf(AppError)
      expect(notFoundError).toBeInstanceOf(AppError)
      expect(conflictError).toBeInstanceOf(AppError)
      expect(unauthorizedError).toBeInstanceOf(AppError)
      expect(forbiddenError).toBeInstanceOf(AppError)

      expect(validationError).toBeInstanceOf(Error)
      expect(databaseError).toBeInstanceOf(Error)
      expect(notFoundError).toBeInstanceOf(Error)
      expect(conflictError).toBeInstanceOf(Error)
      expect(unauthorizedError).toBeInstanceOf(Error)
      expect(forbiddenError).toBeInstanceOf(Error)
    })
  })

  describe('Error serialization', () => {
    it('should serialize error correctly', () => {
      const error = new ConflictError('User already exists')
      
      const serialized = {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        isOperational: error.isOperational
      }

      expect(serialized).toEqual({
        name: 'ConflictError',
        message: 'User already exists',
        statusCode: 409,
        isOperational: true
      })
    })
  })
})
