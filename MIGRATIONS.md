# 🗄️ Миграции базы данных

## 📋 Обзор

Проект использует **Drizzle Kit** для управления миграциями базы данных. Это обеспечивает:
- ✅ Версионирование схемы БД
- ✅ Автоматическое применение миграций
- ✅ Откат миграций
- ✅ Синхронизация между разработчиками

---

## 🚀 Команды для работы с миграциями

### **Генерация миграций**
```bash
npm run db:generate
```
Создает новую миграцию на основе изменений в схеме (`app/lib/db/schema.ts`).

### **Применение миграций**
```bash
npm run db:migrate
```
Применяет все непримененные миграции к базе данных.

### **Push изменений (для разработки)**
```bash
npm run db:push
```
Синхронизирует схему БД с кодом (без создания миграций).

### **Просмотр БД в Studio**
```bash
npm run db:studio
```
Открывает веб-интерфейс для просмотра и редактирования данных.

### **Удаление БД**
```bash
npm run db:drop
```
Удаляет все таблицы и данные (только для разработки!).

---

## 📁 Структура файлов

```
app/lib/db/
├── schema.ts          # Схема БД (Drizzle)
├── migrations/        # Папка с миграциями
│   ├── 0000_empty_spiral.sql
│   └── meta/
├── migrate.ts         # Сервис для выполнения миграций
└── init.ts           # Инициализация БД
```

---

## 🔄 Рабочий процесс

### **1. Разработка новой функциональности**
```typescript
// 1. Измените схему в app/lib/db/schema.ts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  // Добавьте новые поля...
});

// 2. Сгенерируйте миграцию
npm run db:generate

// 3. Примените миграцию
npm run db:migrate
```

### **2. Добавление новой таблицы**
```typescript
// 1. Добавьте новую таблицу в schema.ts
export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 2. Сгенерируйте и примените миграцию
npm run db:generate
npm run db:migrate
```

### **3. Изменение существующей таблицы**
```typescript
// 1. Измените схему
export const users = sqliteTable('users', {
  // ... существующие поля
  avatar: text('avatar'), // Новое поле
});

// 2. Сгенерируйте миграцию
npm run db:generate

// 3. Проверьте сгенерированную миграцию
// 4. Примените миграцию
npm run db:migrate
```

---

## ⚠️ Важные правила

### **1. Никогда не редактируйте существующие миграции**
- Миграции должны быть неизменными после применения
- Создавайте новые миграции для изменений

### **2. Всегда проверяйте миграции перед применением**
```bash
# Проверьте содержимое миграции
cat app/lib/db/migrations/XXXX_migration_name.sql
```

### **3. Используйте транзакции для сложных изменений**
```sql
-- В миграции
BEGIN TRANSACTION;
-- Ваши изменения
COMMIT;
```

### **4. Тестируйте миграции**
```bash
# Создайте тестовую БД
cp app/lib/db/database.sqlite app/lib/db/database_test.sqlite

# Примените миграции к тестовой БД
# Проверьте результат
```

---

## 🐛 Решение проблем

### **Ошибка: "table already exists"**
```bash
# Удалите БД и создайте заново
npm run db:drop
npm run db:migrate
```

### **Ошибка: "migration already applied"**
```bash
# Проверьте таблицу __drizzle_migrations
# Удалите запись о миграции если нужно
```

### **Конфликт миграций**
```bash
# 1. Сделайте backup БД
# 2. Удалите конфликтующие миграции
# 3. Сгенерируйте новую миграцию
npm run db:generate
```

---

## 📊 Мониторинг миграций

### **Проверка статуса миграций**
```sql
-- Посмотреть примененные миграции
SELECT * FROM __drizzle_migrations ORDER BY created_at;
```

### **Проверка схемы БД**
```sql
-- Посмотреть все таблицы
SELECT name FROM sqlite_master WHERE type='table';

-- Посмотреть структуру таблицы
PRAGMA table_info(users);
```

---

## 🚀 Production

### **Автоматическое применение миграций**
```typescript
// В app/lib/db/init.ts
import { runMigrations } from './migrate';

export async function initializeDatabase() {
  await runMigrations(); // Автоматически применяет миграции
}
```

### **Backup перед миграциями**
```bash
# Создайте backup перед применением миграций
cp app/lib/db/database.sqlite app/lib/db/database_backup_$(date +%Y%m%d_%H%M%S).sqlite
```

---

## 📝 Лучшие практики

1. **Именуйте миграции описательно**
2. **Тестируйте миграции на тестовых данных**
3. **Документируйте сложные миграции**
4. **Используйте транзакции для атомарности**
5. **Создавайте rollback миграции для критических изменений**

---

## 🔗 Полезные ссылки

- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Migration Best Practices](https://orm.drizzle.team/kit-docs/commands)
