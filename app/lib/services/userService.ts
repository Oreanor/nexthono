import { db } from '@/app/lib/db';
import { users } from '@/app/lib/db/schema';
import { eq, like } from 'drizzle-orm';
import { fetchUsersFromJsonPlaceholder } from '@/app/lib/services/jsonplaceholder';
import { validateCreateUser } from '@/app/lib/validation/userValidation';
import { User, BaseUser } from '@/app/lib/types/user';
import { ValidationError, NotFoundError, ConflictError, DatabaseError } from '@/app/lib/errors';
import logger from '@/app/lib/logger';
import { pluralizeUser } from '@/app/lib/utils/pluralize';

export class UserService {
  /**
   * Gets all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      logger.info('Fetching all users')
      const result = await db.select().from(users) as User[]
      const count = result.length
      const userWord = pluralizeUser(count)
      logger.info(`Successfully fetched ${count} ${userWord}`)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to fetch users', { error: errorMessage })
      throw new DatabaseError('Failed to fetch users', error)
    }
  }

  /**
   * Gets user by ID
   */
  async getUserById(id: number): Promise<User> {
    try {
      logger.info('Fetching user by ID', { userId: id })
      const result = await db.select().from(users).where(eq(users.id, id)) as User[]
      const user = result[0] || null
      
      if (!user) {
        logger.warn('User not found', { userId: id })
        throw new NotFoundError('User', id.toString())
      }
      
      logger.info('Successfully fetched user', { userId: id })
      return user
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to fetch user by ID', { userId: id, error: errorMessage })
      throw new DatabaseError('Failed to fetch user', error)
    }
  }

  /**
   * Searches users by name
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      logger.info('Searching users', { query })
      const result = await db.select().from(users).where(like(users.name, `%${query}%`)) as User[]
      const count = result.length
      const userWord = pluralizeUser(count)
      logger.info(`Found ${count} ${userWord} for query: ${query}`)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to search users', { query, error: errorMessage })
      throw new DatabaseError('Failed to search users', error)
    }
  }

  /**
   * Creates a new user
   */
  async createUser(userData: BaseUser): Promise<User> {
    try {
      logger.info('Creating new user', { email: userData.email, username: userData.username })
      
      // Validate data
      const validatedData = validateCreateUser(userData)
      
      // Check if user exists
      const existingEmail = await db.select().from(users).where(eq(users.email, validatedData.email))
      if (existingEmail.length > 0) {
        logger.warn('User creation failed - email already exists', { email: validatedData.email })
        throw new ConflictError('User with this email already exists')
      }
      
      const existingUsername = await db.select().from(users).where(eq(users.username, validatedData.username))
      if (existingUsername.length > 0) {
        logger.warn('User creation failed - username already exists', { username: validatedData.username })
        throw new ConflictError('User with this username already exists')
      }
      
      // Create user
      const result = await db.insert(users).values({
        name: validatedData.name.trim(),
        email: validatedData.email.trim().toLowerCase(),
        username: validatedData.username.trim(),
        phone: validatedData.phone?.trim() || null,
        website: validatedData.website?.trim() || null,
        company: validatedData.company?.trim() || null,
      }).returning() as User[]

      const newUser = result[0]
      logger.info('User created successfully', { userId: newUser.id, email: newUser.email })
      return newUser
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to create user', { error: errorMessage })
      throw new DatabaseError('Failed to create user', error)
    }
  }

  /**
   * Seeds database with test data
   */
  async seedFromJsonPlaceholder(): Promise<{ message: string; count: number }> {
    try {
      logger.info('Starting database seeding from JSONPlaceholder')
      
      // Check if users already exist
      const existingCount = await this.getUserCount()
      if (existingCount > 0) {
        logger.warn('Database seeding skipped - users already exist', { existingCount })
        throw new ConflictError('Database already contains users')
      }
      
      // Get data from JSONPlaceholder
      const jsonUsers = await fetchUsersFromJsonPlaceholder()
      const count = jsonUsers.length
      const userWord = pluralizeUser(count)
      logger.info(`Fetched ${count} ${userWord} from JSONPlaceholder`)
      
      // Transform data to our database format
      const usersToInsert: BaseUser[] = jsonUsers.map(user => ({
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone as string | undefined,
        website: user.website as string | undefined,
        company: user.company?.name as string | undefined,
      }))
      
      // Create users
      const result = await db.insert(users).values(usersToInsert).returning() as User[]
      const createdCount = result.length
      const createdWord = pluralizeUser(createdCount)
      logger.info(`Database seeding completed successfully`, { createdCount })
      
      return {
        message: `Database seeded successfully with ${createdCount} ${createdWord}`,
        count: createdCount
      }
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Database seeding failed', { error: errorMessage })
      throw new DatabaseError('Failed to seed database', error)
    }
  }

  /**
   * Clears all users
   */
  async clearAllUsers(): Promise<{ message: string; count: number }> {
    try {
      logger.info('Clearing all users from database')
      const result = await db.delete(users)
      const deletedCount = result.changes || 0
      const userWord = pluralizeUser(deletedCount)
      logger.info(`All users cleared successfully`, { deletedCount })
      
      return {
        message: `All ${deletedCount} ${userWord} cleared successfully`,
        count: deletedCount
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to clear users', { error: errorMessage })
      throw new DatabaseError('Failed to clear users', error)
    }
  }

  /**
   * Gets user count
   */
  async getUserCount(): Promise<number> {
    try {
      const result = await db.select({ count: users.id }).from(users)
      const count = result.length
      logger.debug('User count retrieved', { count })
      return count
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Failed to get user count', { error: errorMessage })
      throw new DatabaseError('Failed to get user count', error)
    }
  }
}

export const userService = new UserService();
