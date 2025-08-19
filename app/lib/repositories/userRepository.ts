import { db } from '@/app/lib/db';
import { users } from '@/app/lib/db/schema';
import { eq, like } from 'drizzle-orm';
import { User, BaseUser } from '@/app/lib/types/user';
import { ValidationError, DatabaseError } from '@/app/lib/errors';

export class UserRepository {
  async findAll(): Promise<User[]> {
    try {
      return await db.select().from(users) as User[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch users', error);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id));
      return (result[0] || null) as User | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch user with id ${id}`, error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return (result[0] || null) as User | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch user by email ${email}`, error);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username));
      return (result[0] || null) as User | null;
    } catch (error) {
      throw new DatabaseError(`Failed to fetch user by username ${username}`, error);
    }
  }

  async searchByName(name: string): Promise<User[]> {
    try {
      return await db.select().from(users).where(like(users.name, `%${name}%`)) as User[];
    } catch (error) {
      throw new DatabaseError(`Failed to search users by name ${name}`, error);
    }
  }

  async create(userData: BaseUser): Promise<User> {
    try {
      // Проверяем уникальность email и username
      const existingEmail = await this.findByEmail(userData.email);
      if (existingEmail) {
        throw new ValidationError('Email already exists', { field: 'email', value: userData.email });
      }

      const existingUsername = await this.findByUsername(userData.username);
      if (existingUsername) {
        throw new ValidationError('Username already exists', { field: 'username', value: userData.username });
      }

      const result = await db.insert(users).values({
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        phone: userData.phone?.trim() || null,
        website: userData.website?.trim() || null,
        company: userData.company?.trim() || null,
      }).returning();

      return result[0] as User;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Failed to create user', error);
    }
  }

  async createMany(usersData: BaseUser[]): Promise<User[]> {
    try {
      const result = await db.insert(users).values(usersData).returning();
      return result as User[];
    } catch (error) {
      throw new DatabaseError('Failed to create users', error);
    }
  }

  async deleteAll(): Promise<number> {
    try {
      const result = await db.delete(users);
      return result.changes || 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete all users', error);
    }
  }

  async count(): Promise<number> {
    try {
      const result = await db.select({ count: users.id }).from(users);
      return result.length;
    } catch (error) {
      throw new DatabaseError('Failed to count users', error);
    }
  }
}

export const userRepository = new UserRepository();
