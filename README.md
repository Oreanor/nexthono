# NextHono - Приложение управления пользователями

Приложение для управления пользователями, построенное с использованием:
- **Next.js 15** - React фреймворк
- **Hono** - Быстрый веб-фреймворк для API
- **Drizzle ORM** - TypeScript ORM для работы с базой данных
- **SQLite** - Локальная база данных
- **Tailwind CSS** - CSS фреймворк для стилизации

## Функциональность

- 📋 **Список пользователей** - Отображение всех пользователей в базе данных
- 🔍 **Поиск и фильтрация** - Поиск пользователей по имени
- ➕ **Добавление пользователей** - Модальное окно для создания новых пользователей
- 📥 **Загрузка данных** - Импорт пользователей с JSONPlaceholder API
- 💾 **Локальная база данных** - SQLite с автоматическими миграциями

## Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd nexthono
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Сгенерируйте миграции базы данных:**
   ```bash
   npm run db:generate
   ```

4. **Запустите приложение в режиме разработки:**
   ```bash
   npm run dev
   ```

5. **Откройте браузер и перейдите по адресу:**
   ```
   http://localhost:3000
   ```

## Структура проекта

```
nexthono/
├── app/                    # Next.js App Router
│   ├── api/               # API роуты Next.js
│   │   ├── [...path]/     # Catch-all роут для Hono API
│   │   │   └── route.ts   # Прокси к Hono приложению
│   │   ├── health/        # Health check endpoint
│   │   │   └── route.ts   # Статус приложения
│   │   ├── index.ts       # Основное Hono приложение
│   │   └── users.ts       # Hono роуты для пользователей
│   ├── lib/               # Библиотеки и утилиты
│   │   ├── db/            # База данных
│   │   │   ├── index.ts   # Подключение к БД
│   │   │   ├── schema.ts  # Схема таблиц
│   │   │   ├── init.ts    # Инициализация БД
│   │   │   ├── migrate.ts # Миграции Drizzle Kit
│   │   │   └── migrations/ # Миграции
│   │   ├── errors/        # Кастомные ошибки
│   │   │   └── index.ts   # Иерархия ошибок
│   │   ├── middleware/    # Hono middleware
│   │   │   ├── errorHandler.ts # Обработка ошибок
│   │   │   └── security.ts # Безопасность и CORS
│   │   ├── repositories/  # Слой доступа к данным
│   │   │   └── userRepository.ts # Репозиторий пользователей
│   │   ├── services/      # Бизнес-логика
│   │   │   ├── userService.ts # Сервис пользователей
│   │   │   └── jsonplaceholder.ts # JSONPlaceholder API
│   │   ├── types/         # TypeScript типы
│   │   │   ├── user.ts    # Типы пользователей
│   │   │   └── http.ts    # HTTP статус коды
│   │   ├── utils/         # Утилиты
│   │   │   ├── db.ts      # Утилиты БД
│   │   │   ├── hono-proxy.ts # Прокси для Hono
│   │   │   └── pluralize.ts # Плюрализация
│   │   ├── validation/    # Валидация
│   │   │   └── userValidation.ts # Zod схемы
│   │   ├── config/        # Конфигурация
│   │   │   └── env.ts     # Переменные окружения
│   │   ├── logger/        # Логирование
│   │   │   └── index.ts   # Winston конфигурация
│   │   └── hooks/         # React хуки
│   │       └── useUsers.ts # Хук для работы с пользователями
│   ├── page.tsx           # Главная страница
│   └── layout.tsx         # Корневой layout
├── __tests__/             # Тесты
│   ├── components/        # Тесты компонентов
│   ├── utils/             # Тесты утилит
│   ├── validation/        # Тесты валидации
│   └── errors/            # Тесты ошибок
├── drizzle.config.ts      # Конфигурация Drizzle
├── jest.config.js         # Конфигурация Jest
├── jest.setup.js          # Настройка Jest
└── package.json           # Зависимости и скрипты
```

## API Endpoints

### Основные

- `GET /api/health` - Проверка состояния приложения

### Пользователи

- `GET /api/users` - Получить всех пользователей
- `GET /api/users/search?q=query` - Поиск пользователей
- `POST /api/users` - Добавить нового пользователя
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users/seed` - Загрузить данные с JSONPlaceholder

### Примеры запросов

**Получить всех пользователей:**
```bash
curl http://localhost:3000/api/users
```

**Поиск пользователей:**
```bash
curl "http://localhost:3000/api/users/search?q=John"
```

**Добавить пользователя:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "+1234567890",
    "website": "https://johndoe.com",
    "company": "Example Corp"
  }'
```

**Загрузить данные с JSONPlaceholder:**
```bash
curl -X POST http://localhost:3000/api/users/seed
```

## Скрипты

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшен версии
- `npm run lint` - Проверка кода
- `npm test` - Запуск тестов
- `npm run test:watch` - Тесты в режиме наблюдения
- `npm run test:coverage` - Тесты с покрытием
- `npm run db:generate` - Генерация миграций
- `npm run db:migrate` - Применение миграций
- `npm run db:push` - Принудительная синхронизация схемы
- `npm run db:studio` - Запуск Drizzle Studio
- `npm run db:drop` - Удаление базы данных

## Технологии

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Hono (через Next.js прокси), Drizzle ORM
- **Database:** SQLite с Drizzle Kit миграциями
- **Testing:** Jest, React Testing Library
- **Development:** ESLint, Turbopack, Winston (логирование)

## Особенности

- 🚀 **Быстрая разработка** с Turbopack
- 🔒 **Type-safe** с TypeScript и Drizzle
- 📱 **Responsive дизайн** с Tailwind CSS
- 🏗️ **Архитектура в слоях** (Repository, Service, Middleware)
- 🔄 **Автоматические миграции** с Drizzle Kit
- 🌐 **Интеграция с внешними API** (JSONPlaceholder)
- 🛡️ **Безопасность** (CORS, Rate Limiting, Security Headers)
- 📝 **Структурированное логирование** с Winston
- 🧪 **Полное покрытие тестами** (Jest + RTL)
- 🔍 **Валидация данных** с Zod
- 🎯 **Кастомные ошибки** с иерархией классов

## Документация

- [TESTING.md](./TESTING.md) - Руководство по тестированию
- [MIGRATIONS.md](./MIGRATIONS.md) - Работа с миграциями базы данных
- [SECURITY.md](./SECURITY.md) - Безопасность приложения
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - История улучшений и код-ревью

## Лицензия

MIT
