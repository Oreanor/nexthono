import { db } from './index';

export async function initializeDatabase() {
  try {
    // Создаем таблицы напрямую из схемы
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        phone TEXT,
        website TEXT,
        company TEXT,
        created_at INTEGER DEFAULT (unixepoch())
      )
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}
