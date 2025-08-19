// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED_FIELDS: 'Обязательные поля не заполнены',
    INVALID_EMAIL: 'Неверный формат email',
    INVALID_USERNAME: 'Неверный формат username',
    INVALID_ID: 'Неверный ID',
    QUERY_REQUIRED: 'Query parameter "q" is required',
  },
  DATABASE: {
    FETCH_FAILED: 'Failed to fetch users',
    CREATE_FAILED: 'Failed to create user',
    DELETE_FAILED: 'Failed to delete users',
    SEED_FAILED: 'Failed to seed database',
    SEARCH_FAILED: 'Failed to search users',
  },
  USER: {
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
    USERNAME_EXISTS: 'Username already exists',
    ALREADY_SEEDED: 'База данных уже содержит пользователей',
  },
  GENERAL: {
    INTERNAL_ERROR: 'Internal server error',
    UNKNOWN_ERROR: 'Unknown error occurred',
  },
} as const;

// API Success Messages
export const SUCCESS_MESSAGES = {
  USER: {
    CREATED: 'User created successfully',
    DELETED: 'All users deleted successfully',
    SEEDED: 'Successfully seeded users',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  PHONE: {
    MAX_LENGTH: 20,
  },
  WEBSITE: {
    MAX_LENGTH: 255,
  },
  COMPANY: {
    MAX_LENGTH: 100,
  },
  SEARCH: {
    MAX_LENGTH: 100,
  },
} as const;

// Database Constants
export const DATABASE = {
  INIT_MESSAGE: '✅ Database initialized successfully',
  INIT_ERROR: '❌ Failed to initialize database',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users',
  SEARCH: '/api/users/search',
  SEED: '/api/users/seed',
  USER_BY_ID: '/api/users/:id',
} as const;

// External APIs
export const EXTERNAL_APIS = {
  JSON_PLACEHOLDER: {
    BASE_URL: 'https://jsonplaceholder.typicode.com',
    USERS_ENDPOINT: '/users',
  },
} as const;
