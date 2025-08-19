import { Hono } from 'hono';
import { userService } from '@/app/lib/services/userService';
import { ensureDbInitialized } from '@/app/lib/utils/db';
import { withErrorHandling } from '@/app/lib/middleware/errorHandler';

const app = new Hono();

// Получить всех пользователей
app.get('/', async (c) => {
  await ensureDbInitialized();
  const users = await withErrorHandling(userService.getAllUsers)();
  return c.json(users);
});

// Очистить всех пользователей
app.delete('/', async (c) => {
  await ensureDbInitialized();
  const result = await withErrorHandling(userService.clearAllUsers)();
  return c.json(result);
});

// Добавить нового пользователя
app.post('/', async (c) => {
  await ensureDbInitialized();
  const body = await c.req.json();
  const newUser = await withErrorHandling(userService.createUser)(body);
  return c.json(newUser, 201);
});

// Поиск пользователей
app.get('/search', async (c) => {
  const query = c.req.query('q');
  if (!query) {
    return c.json({ error: 'Query parameter "q" is required' }, 400);
  }

  await ensureDbInitialized();
  const searchResults = await withErrorHandling(userService.searchUsers)(query);
  return c.json(searchResults);
});

// Загрузить данные с JSONPlaceholder
app.post('/seed', async (c) => {
  await ensureDbInitialized();
  const result = await withErrorHandling(userService.seedFromJsonPlaceholder)();
  return c.json(result, 201);
});

// Получить пользователя по ID
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  
  await ensureDbInitialized();
  const user = await withErrorHandling(userService.getUserById)(id);
  return c.json(user);
});

export default app;
