import { Hono } from 'hono';
import usersRouter from './users';

const app = new Hono();

// Подключаем роуты
app.route('/users', usersRouter);

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'NextHono API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      search: '/api/users/search?q=query',
      seed: '/api/users/seed',
      userById: '/api/users/:id'
    }
  });
});

export default app;
