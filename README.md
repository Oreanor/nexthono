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
│   │   ├── users/         # API для пользователей
│   │   │   ├── route.ts   # GET/POST пользователей
│   │   │   ├── search/    # Поиск пользователей
│   │   │   ├── seed/      # Загрузка с JSONPlaceholder
│   │   │   └── [id]/      # Получение по ID
│   │   └── ...
│   ├── components/        # React компоненты
│   │   ├── UserList.tsx   # Список пользователей
│   │   ├── SearchBar.tsx  # Поисковая строка
│   │   └── AddUserModal.tsx # Модальное окно добавления
│   ├── lib/               # Библиотеки и утилиты
│   │   ├── db/            # База данных
│   │   │   ├── index.ts   # Подключение к БД
│   │   │   ├── schema.ts  # Схема таблиц
│   │   │   ├── init.ts    # Инициализация БД
│   │   │   └── migrations/ # Миграции
│   │   ├── hooks/         # React хуки
│   │   │   └── useUsers.ts # Хук для работы с пользователями
│   │   ├── services/      # Сервисы
│   │   │   └── jsonplaceholder.ts # Работа с JSONPlaceholder API
│   │   └── types/         # TypeScript типы
│   │       └── user.ts    # Типы пользователей
│   ├── page.tsx           # Главная страница
│   └── layout.tsx         # Корневой layout
├── drizzle.config.ts      # Конфигурация Drizzle
└── package.json           # Зависимости и скрипты
```

## API Endpoints

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
- `npm run db:generate` - Генерация миграций
- `npm run db:migrate` - Применение миграций
- `npm run db:studio` - Запуск Drizzle Studio

## Технологии

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Hono, Drizzle ORM
- **Database:** SQLite
- **Development:** ESLint, Turbopack

## Особенности

- 🚀 **Быстрая разработка** с Turbopack
- 🔒 **Type-safe** с TypeScript и Drizzle
- 📱 **Responsive дизайн** с Tailwind CSS
- 🎯 **Простая архитектура** с разделением на компоненты
- 🔄 **Автоматические миграции** базы данных
- 🌐 **Интеграция с внешними API** (JSONPlaceholder)

## Лицензия

MIT
