import { runMigrations } from './migrate';
import { DATABASE } from '@/app/lib/constants';

export async function initializeDatabase() {
  try {
    await runMigrations();
    console.log(DATABASE.INIT_MESSAGE);
  } catch (error) {
    console.error(DATABASE.INIT_ERROR, error);
    throw error;
  }
}
