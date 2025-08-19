import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { DATABASE } from '@/app/lib/constants';

/**
 * Выполняет миграции базы данных
 */
export async function runMigrations(): Promise<void> {
  try {
    const sqlite = new Database('./app/lib/db/database.sqlite');
    const db = drizzle(sqlite);
    
    // Выполняем миграции
    await migrate(db, { migrationsFolder: './app/lib/db/migrations' });
    
    console.log(DATABASE.INIT_MESSAGE);
  } catch (error) {
    console.error(DATABASE.INIT_ERROR, error);
    throw error;
  }
}
