import { 
  validateCreateUser, 
  validateSearchQuery, 
  validateIdParam,
  createUserSchema,
  searchQuerySchema,
  idParamSchema,
  VALIDATION_CONSTANTS 
} from '@/app/lib/validation/userValidation'
import { ValidationError } from '@/app/lib/errors'

describe('User Validation', () => {
  describe('VALIDATION_CONSTANTS', () => {
    it('should have correct validation constants', () => {
      expect(VALIDATION_CONSTANTS.NAME.MIN_LENGTH).toBe(2)
      expect(VALIDATION_CONSTANTS.NAME.MAX_LENGTH).toBe(100)
      expect(VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH).toBe(255)
      expect(VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH).toBe(3)
      expect(VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH).toBe(50)
      expect(VALIDATION_CONSTANTS.USERNAME.PATTERN).toBeInstanceOf(RegExp)
    })
  })

  describe('createUserSchema', () => {
    it('should validate correct user data', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        phone: '+1234567890',
        website: 'https://example.com',
        company: 'Example Corp'
      }

      const result = createUserSchema.parse(validUser)
      expect(result).toEqual(validUser)
    })

    it('should reject invalid email', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        username: 'johndoe'
      }

      expect(() => createUserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject short name', () => {
      const invalidUser = {
        name: 'J',
        email: 'john@example.com',
        username: 'johndoe'
      }

      expect(() => createUserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject invalid username pattern', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'john doe' // contains space
      }

      expect(() => createUserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject invalid website URL', () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        website: 'not-a-url'
      }

      expect(() => createUserSchema.parse(invalidUser)).toThrow()
    })

    it('should accept optional fields as null', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        phone: null,
        website: null,
        company: null
      }

      const result = createUserSchema.parse(validUser)
      expect(result).toEqual(validUser)
    })
  })

  describe('validateCreateUser', () => {
    it('should return validated data for valid input', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe'
      }

      const result = validateCreateUser(validData)
      expect(result).toEqual(validData)
    })

    it('should throw ValidationError for invalid input', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
        username: 'jo'
      }

      expect(() => validateCreateUser(invalidData)).toThrow(ValidationError)
    })

    it('should throw ValidationError for missing required fields', () => {
      const invalidData = {
        name: 'John Doe'
        // missing email and username
      }

      expect(() => validateCreateUser(invalidData)).toThrow(ValidationError)
    })
  })

  describe('searchQuerySchema', () => {
    it('should validate correct search query', () => {
      const validQuery = { q: 'john' }
      const result = searchQuerySchema.parse(validQuery)
      expect(result).toEqual(validQuery)
    })

    it('should reject empty search query', () => {
      const invalidQuery = { q: '' }
      expect(() => searchQuerySchema.parse(invalidQuery)).toThrow()
    })

    it('should reject too long search query', () => {
      const invalidQuery = { q: 'a'.repeat(101) }
      expect(() => searchQuerySchema.parse(invalidQuery)).toThrow()
    })

    it('should trim whitespace', () => {
      const query = { q: '  john  ' }
      const result = searchQuerySchema.parse(query)
      expect(result.q).toBe('john')
    })
  })

  describe('validateSearchQuery', () => {
    it('should return validated query for valid input', () => {
      const validQuery = { q: 'john' }
      const result = validateSearchQuery(validQuery)
      expect(result).toEqual(validQuery)
    })

    it('should throw ValidationError for invalid input', () => {
      const invalidQuery = { q: '' }
      expect(() => validateSearchQuery(invalidQuery)).toThrow(ValidationError)
    })
  })

  describe('idParamSchema', () => {
    it('should validate correct ID parameter', () => {
      const validId = { id: '123' }
      const result = idParamSchema.parse(validId)
      expect(result.id).toBe(123)
    })

    it('should reject non-numeric ID', () => {
      const invalidId = { id: 'abc' }
      expect(() => idParamSchema.parse(invalidId)).toThrow()
    })

    it('should reject zero ID', () => {
      const invalidId = { id: '0' }
      expect(() => idParamSchema.parse(invalidId)).toThrow()
    })

    it('should reject negative ID', () => {
      const invalidId = { id: '-1' }
      expect(() => idParamSchema.parse(invalidId)).toThrow()
    })

    it('should convert string to number', () => {
      const validId = { id: '42' }
      const result = idParamSchema.parse(validId)
      expect(typeof result.id).toBe('number')
      expect(result.id).toBe(42)
    })
  })

  describe('validateIdParam', () => {
    it('should return validated ID for valid input', () => {
      const validId = { id: '123' }
      const result = validateIdParam(validId)
      expect(result.id).toBe(123)
    })

    it('should throw ValidationError for invalid input', () => {
      const invalidId = { id: 'abc' }
      expect(() => validateIdParam(invalidId)).toThrow(ValidationError)
    })
  })
})
