import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  DATABASE,
  API_ENDPOINTS,
  EXTERNAL_APIS
} from '@/app/lib/constants'

describe('Constants', () => {
  describe('HTTP_STATUS', () => {
    it('should have correct HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200)
      expect(HTTP_STATUS.CREATED).toBe(201)
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400)
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401)
      expect(HTTP_STATUS.FORBIDDEN).toBe(403)
      expect(HTTP_STATUS.NOT_FOUND).toBe(404)
      expect(HTTP_STATUS.CONFLICT).toBe(409)
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500)
    })

    it('should have all required status codes', () => {
      const requiredCodes = [200, 201, 400, 401, 403, 404, 409, 500]
      const actualCodes = Object.values(HTTP_STATUS)
      
      requiredCodes.forEach(code => {
        expect(actualCodes).toContain(code)
      })
    })
  })

  describe('ERROR_MESSAGES', () => {
    it('should have validation-related error messages', () => {
      expect(ERROR_MESSAGES.VALIDATION.REQUIRED_FIELDS).toBe('Обязательные поля не заполнены')
      expect(ERROR_MESSAGES.VALIDATION.INVALID_EMAIL).toBe('Неверный формат email')
      expect(ERROR_MESSAGES.VALIDATION.INVALID_USERNAME).toBe('Неверный формат username')
      expect(ERROR_MESSAGES.VALIDATION.INVALID_ID).toBe('Неверный ID')
      expect(ERROR_MESSAGES.VALIDATION.QUERY_REQUIRED).toBe('Query parameter "q" is required')
    })

    it('should have database-related error messages', () => {
      expect(ERROR_MESSAGES.DATABASE.FETCH_FAILED).toBe('Failed to fetch users')
      expect(ERROR_MESSAGES.DATABASE.CREATE_FAILED).toBe('Failed to create user')
      expect(ERROR_MESSAGES.DATABASE.DELETE_FAILED).toBe('Failed to delete users')
      expect(ERROR_MESSAGES.DATABASE.SEED_FAILED).toBe('Failed to seed database')
      expect(ERROR_MESSAGES.DATABASE.SEARCH_FAILED).toBe('Failed to search users')
    })

    it('should have user-related error messages', () => {
      expect(ERROR_MESSAGES.USER.NOT_FOUND).toBe('User not found')
      expect(ERROR_MESSAGES.USER.EMAIL_EXISTS).toBe('Email already exists')
      expect(ERROR_MESSAGES.USER.USERNAME_EXISTS).toBe('Username already exists')
      expect(ERROR_MESSAGES.USER.ALREADY_SEEDED).toBe('База данных уже содержит пользователей')
    })

    it('should have general error messages', () => {
      expect(ERROR_MESSAGES.GENERAL.INTERNAL_ERROR).toBe('Internal server error')
      expect(ERROR_MESSAGES.GENERAL.UNKNOWN_ERROR).toBe('Unknown error occurred')
    })
  })

  describe('SUCCESS_MESSAGES', () => {
    it('should have user-related success messages', () => {
      expect(SUCCESS_MESSAGES.USER.CREATED).toBe('User created successfully')
      expect(SUCCESS_MESSAGES.USER.DELETED).toBe('All users deleted successfully')
      expect(SUCCESS_MESSAGES.USER.SEEDED).toBe('Successfully seeded users')
    })
  })

  describe('VALIDATION', () => {
    it('should have name validation rules', () => {
      expect(VALIDATION.NAME.MIN_LENGTH).toBe(2)
      expect(VALIDATION.NAME.MAX_LENGTH).toBe(100)
    })

    it('should have email validation rules', () => {
      expect(VALIDATION.EMAIL.MAX_LENGTH).toBe(255)
    })

    it('should have username validation rules', () => {
      expect(VALIDATION.USERNAME.MIN_LENGTH).toBe(3)
      expect(VALIDATION.USERNAME.MAX_LENGTH).toBe(50)
    })

    it('should have phone validation rules', () => {
      expect(VALIDATION.PHONE.MAX_LENGTH).toBe(20)
    })

    it('should have website validation rules', () => {
      expect(VALIDATION.WEBSITE.MAX_LENGTH).toBe(255)
    })

    it('should have company validation rules', () => {
      expect(VALIDATION.COMPANY.MAX_LENGTH).toBe(100)
    })

    it('should have search validation rules', () => {
      expect(VALIDATION.SEARCH.MAX_LENGTH).toBe(100)
    })
  })

  describe('DATABASE', () => {
    it('should have database messages', () => {
      expect(DATABASE.INIT_MESSAGE).toBe('✅ Database initialized successfully')
      expect(DATABASE.INIT_ERROR).toBe('❌ Failed to initialize database')
    })
  })

  describe('API_ENDPOINTS', () => {
    it('should have user endpoints', () => {
      expect(API_ENDPOINTS.USERS).toBe('/api/users')
      expect(API_ENDPOINTS.SEARCH).toBe('/api/users/search')
      expect(API_ENDPOINTS.SEED).toBe('/api/users/seed')
      expect(API_ENDPOINTS.USER_BY_ID).toBe('/api/users/:id')
    })
  })

  describe('EXTERNAL_APIS', () => {
    it('should have JSONPlaceholder API configuration', () => {
      expect(EXTERNAL_APIS.JSON_PLACEHOLDER.BASE_URL).toBe('https://jsonplaceholder.typicode.com')
      expect(EXTERNAL_APIS.JSON_PLACEHOLDER.USERS_ENDPOINT).toBe('/users')
    })
  })

  describe('Constants structure', () => {
    it('should have all required constant categories', () => {
      expect(HTTP_STATUS).toBeDefined()
      expect(ERROR_MESSAGES).toBeDefined()
      expect(SUCCESS_MESSAGES).toBeDefined()
      expect(VALIDATION).toBeDefined()
      expect(DATABASE).toBeDefined()
      expect(API_ENDPOINTS).toBeDefined()
      expect(EXTERNAL_APIS).toBeDefined()
    })

    it('should have consistent structure', () => {
      // Check that all constants are objects
      expect(typeof HTTP_STATUS).toBe('object')
      expect(typeof ERROR_MESSAGES).toBe('object')
      expect(typeof SUCCESS_MESSAGES).toBe('object')
      expect(typeof VALIDATION).toBe('object')
      expect(typeof DATABASE).toBe('object')
      expect(typeof API_ENDPOINTS).toBe('object')
      expect(typeof EXTERNAL_APIS).toBe('object')
    })
  })
})
