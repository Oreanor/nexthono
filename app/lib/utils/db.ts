import { initializeDatabase } from '@/app/lib/db/init';

// Глобальный флаг инициализации базы данных
let isDbInitialized = false;

/**
 * Убеждается, что база данных инициализирована
 * Используется во всех API роутах для ленивой инициализации БД
 */
export async function ensureDbInitialized() {
  if (!isDbInitialized) {
    await initializeDatabase();
    isDbInitialized = true;
  }
}
