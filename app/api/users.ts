import { Hono } from 'hono';
import { db } from '@/app/lib/db';
import { users } from '@/app/lib/db/schema';
import { eq, like } from 'drizzle-orm';
import { fetchUsersFromJsonPlaceholder } from '@/app/lib/services/jsonplaceholder';
import { ensureDbInitialized } from '@/app/lib/utils/db';

const app = new Hono();

// Получить всех пользователей
app.get('/', async (c) => {
  try {
    await ensureDbInitialized();
    const allUsers = await db.select().from(users);
    return c.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Очистить всех пользователей
app.delete('/', async (c) => {
  try {
    await ensureDbInitialized();
    await db.delete(users);
    return c.json({ 
      message: 'All users deleted successfully',
      deletedCount: 0
    });
  } catch (error) {
    console.error('Error deleting users:', error);
    return c.json({ error: 'Failed to delete users' }, 500);
  }
});

// Добавить нового пользователя
app.post('/', async (c) => {
  try {
    await ensureDbInitialized();
    const body = await c.req.json();
    const { name, email, username, phone, website, company } = body;

    if (!name || !email || !username) {
      return c.json({ 
        error: 'Обязательные поля не заполнены', 
        details: 'Поля name, email и username обязательны для заполнения' 
      }, 400);
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ 
        error: 'Неверный формат email', 
        details: 'Пожалуйста, введите корректный email адрес' 
      }, 400);
    }

    // Проверяем на дублирование email
    const existingUserByEmail = await db.select().from(users).where(eq(users.email, email));
    if (existingUserByEmail.length > 0) {
      return c.json({ 
        error: 'Email уже используется', 
        details: `Пользователь с email "${email}" уже существует` 
      }, 409);
    }

    // Проверяем на дублирование username
    const existingUserByUsername = await db.select().from(users).where(eq(users.username, username));
    if (existingUserByUsername.length > 0) {
      return c.json({ 
        error: 'Username уже используется', 
        details: `Пользователь с username "${username}" уже существует` 
      }, 409);
    }

    const newUser = await db.insert(users).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      phone: phone?.trim() || null,
      website: website?.trim() || null,
      company: company?.trim() || null,
    }).returning();

    return c.json(newUser[0], 201);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Проверяем на UNIQUE constraint ошибки SQLite
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('unique constraint failed: users.email')) {
        return c.json({ 
          error: 'Email уже используется', 
          details: 'Этот email адрес уже зарегистрирован в системе' 
        }, 409);
      }
      
      if (errorMessage.includes('unique constraint failed: users.username')) {
        return c.json({ 
          error: 'Username уже используется', 
          details: 'Этот username уже занят' 
        }, 409);
      }
      
      if (errorMessage.includes('constraint')) {
        return c.json({ 
          error: 'Ошибка валидации данных', 
          details: 'Проверьте правильность введенных данных' 
        }, 400);
      }
    }

    return c.json({ 
      error: 'Внутренняя ошибка сервера', 
      details: 'Произошла неожиданная ошибка при создании пользователя' 
    }, 500);
  }
});

// Поиск пользователей
app.get('/search', async (c) => {
  const query = c.req.query('q');
  
  if (!query) {
    return c.json({ error: 'Query parameter "q" is required' }, 400);
  }

  try {
    await ensureDbInitialized();
    const searchResults = await db
      .select()
      .from(users)
      .where(
        like(users.name, `%${query}%`)
      );
    return c.json(searchResults);
  } catch (error) {
    console.error('Error searching users:', error);
    return c.json({ error: 'Failed to search users' }, 500);
  }
});

// Загрузить данные с JSONPlaceholder
app.post('/seed', async (c) => {
  try {
    await ensureDbInitialized();
    const jsonUsers = await fetchUsersFromJsonPlaceholder();
    
    // Проверяем, есть ли уже пользователи в базе
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length > 0) {
      return c.json({ 
        error: 'База данных уже содержит пользователей', 
        details: `В базе уже есть ${existingUsers.length} пользователей. Очистите базу данных перед повторной загрузкой.`,
        existingCount: existingUsers.length
      }, 409);
    }
    
    // Преобразуем данные в формат нашей базы данных
    const usersToInsert = jsonUsers.map(user => ({
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      website: user.website,
      company: user.company.name,
    }));

    // Добавляем пользователей в базу данных
    const insertedUsers = await db.insert(users).values(usersToInsert).returning();
    
    return c.json({ 
      message: `Successfully seeded ${insertedUsers.length} users`,
      users: insertedUsers 
    }, 201);
  } catch (error) {
    console.error('Error seeding database:', error);
    
    // Проверяем на UNIQUE constraint ошибки
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('unique constraint failed')) {
        return c.json({ 
          error: 'Пользователи уже существуют', 
          details: 'Некоторые пользователи с такими email или username уже есть в базе данных' 
        }, 409);
      }
    }
    
    return c.json({ error: 'Failed to seed database' }, 500);
  }
});

// Получить пользователя по ID
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const userId = parseInt(id);
  
  if (isNaN(userId)) {
    return c.json({ error: 'Invalid ID' }, 400);
  }

  try {
    await ensureDbInitialized();
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

export default app;
