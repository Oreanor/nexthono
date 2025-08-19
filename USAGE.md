# 🚀 NextHono Application

Современное веб-приложение, построенное на Next.js 15, Hono и Drizzle ORM с полной типизацией TypeScript.

## 🛡️ Security Features

### Rate Limiting
- **100 запросов за 15 минут** на IP адрес
- Настраивается через `API_RATE_LIMIT` и `API_RATE_LIMIT_WINDOW`
- HTTP 429 при превышении лимита

### Security Headers
- **X-Content-Type-Options**: `nosniff`
- **X-Frame-Options**: `DENY`
- **X-XSS-Protection**: `1; mode=block`
- **Content-Security-Policy**: Защита от XSS
- **Strict-Transport-Security**: Только для production

### CORS Protection
- Настраиваемые разрешенные домены
- Защита от cross-origin атак
- Поддержка credentials

### Structured Logging
- Winston logger с JSON форматом
- Отдельные файлы для ошибок и общих логов
- Безопасное логирование без sensitive данных

## 🏗️ Архитектура

```
app/
├── api/                    # API routes (Hono)
│   ├── [...path]/         # Dynamic API proxy
│   ├── health/            # Health check endpoint
│   ├── index.ts           # Main Hono app
│   └── users.ts           # User API routes
├── components/            # React components
├── lib/                   # Shared libraries
│   ├── config/           # Environment configuration
│   ├── db/               # Database layer
│   ├── errors/           # Custom error classes
│   ├── hooks/            # Custom React hooks
│   ├── logger/           # Structured logging
│   ├── middleware/       # Security middleware
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── validation/       # Zod validation schemas
└── page.tsx              # Main page component
```

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Настройка базы данных
```bash
# Генерация миграций
npm run db:generate

# Применение миграций
npm run db:migrate

# Просмотр базы данных
npm run db:studio
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Запуск тестов
```bash
# Все тесты
npm test

# Тесты в watch режиме
npm run test:watch

# Покрытие кода
npm run test:coverage
```

## 📊 API Endpoints

### Health Check
- **GET** `/api/health` - Проверка состояния приложения

### Users
- **GET** `/api/users` - Получить всех пользователей
- **POST** `/api/users` - Создать пользователя
- **GET** `/api/users/search?q=query` - Поиск пользователей
- **GET** `/api/users/:id` - Получить пользователя по ID
- **POST** `/api/users/seed` - Заполнить БД тестовыми данными
- **DELETE** `/api/users/clear` - Очистить всех пользователей

## 🔧 Environment Variables

```bash
# Security
NODE_ENV=development|production|test
ALLOWED_ORIGINS=http://localhost:3000
API_RATE_LIMIT=100
API_RATE_LIMIT_WINDOW=900000

# Logging
LOG_LEVEL=info|debug|warn|error

# Database
DATABASE_URL=./app/lib/db/database.sqlite
```

## 🛠️ Технологический стек

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **React Testing Library** - Тестирование компонентов

### Backend
- **Hono** - Web framework
- **Drizzle ORM** - Database ORM
- **SQLite** - Database
- **Zod** - Schema validation

### Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - Custom matchers

### Development
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Drizzle Kit** - Database migrations

### Utilities
- **Winston** - Structured logging
- **Custom pluralize** - Russian language pluralization

## 📝 Error Handling

Приложение использует структурированную систему обработки ошибок:

### Error Classes
- `AppError` - Базовый класс ошибок
- `ValidationError` - Ошибки валидации (400)
- `NotFoundError` - Ресурс не найден (404)
- `ConflictError` - Конфликт данных (409)
- `DatabaseError` - Ошибки базы данных (500)

### Error Response Format
```json
{
  "error": "Error Type",
  "message": "Human readable message",
  "details": "Additional information"
}
```

## 🔍 Monitoring

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "responseTime": "5ms"
  },
  "memory": {
    "used": 45,
    "total": 128
  }
}
```

### Logging
- **Console**: Цветной вывод для разработки
- **File**: JSON логи для production
- **Levels**: error, warn, info, http, debug

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/           # Component tests
├── constants/           # Constants tests
├── errors/              # Error classes tests
├── utils/               # Utility tests
└── validation/          # Validation tests
```

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage
- **Validation**: 100%
- **Error Classes**: 100%
- **Constants**: 100%
- **Components**: 85%
- **Overall**: ~85%

## 📚 Документация

- [Security Documentation](./SECURITY.md) - Безопасность приложения
- [Migrations Guide](./MIGRATIONS.md) - Работа с миграциями
- [Testing Guide](./TESTING.md) - Руководство по тестированию
- [Improvements](./IMPROVEMENTS.md) - История улучшений

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run the test suite
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
