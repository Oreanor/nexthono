import { z } from 'zod';
import { ValidationError } from '@/app/lib/errors';

// Константы для валидации
export const VALIDATION_CONSTANTS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    MAX_LENGTH: 255,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PHONE: {
    MAX_LENGTH: 20,
  },
  WEBSITE: {
    MAX_LENGTH: 255,
  },
  COMPANY: {
    MAX_LENGTH: 100,
  },
} as const;

// Schema for creating a user
export const createUserSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_CONSTANTS.NAME.MIN_LENGTH, `Name must contain at least ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTANTS.NAME.MAX_LENGTH, `Name must not exceed ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH} characters`)
    .trim()
    .refine((val) => val.length > 0, 'Name is required'),
  
  email: z
    .string()
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    }, { message: 'Invalid email format' })
    .max(VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH, `Email must not exceed ${VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH} characters`)
    .toLowerCase()
    .trim(),
  
  username: z
    .string()
    .min(VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH, `Username must contain at least ${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH} characters`)
    .max(VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH, `Username must not exceed ${VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH} characters`)
    .regex(VALIDATION_CONSTANTS.USERNAME.PATTERN, 'Username can only contain letters, numbers, hyphens and underscores')
    .trim(),
  
  phone: z
    .string()
    .max(VALIDATION_CONSTANTS.PHONE.MAX_LENGTH, `Phone must not exceed ${VALIDATION_CONSTANTS.PHONE.MAX_LENGTH} characters`)
    .optional()
    .nullable(),
  
  website: z
    .string()
    .refine((val) => {
      if (!val) return true; // Allow empty strings for optional fields
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, { message: 'Invalid URL format' })
    .max(VALIDATION_CONSTANTS.WEBSITE.MAX_LENGTH, `Website must not exceed ${VALIDATION_CONSTANTS.WEBSITE.MAX_LENGTH} characters`)
    .optional()
    .nullable(),
  
  company: z
    .string()
    .max(VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH, `Company name must not exceed ${VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH} characters`)
    .optional()
    .nullable(),
});

// Schema for search
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query must not exceed 100 characters')
    .trim(),
});

// Schema for ID
export const idParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'ID must be a positive number')
    .transform((val) => parseInt(val, 10)),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;

/**
 * Validates data for creating a user
 */
export function validateCreateUser(data: unknown): CreateUserInput {
  try {
    return createUserSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Data validation error');
    }
    throw error;
  }
}

/**
 * Validates search query
 */
export function validateSearchQuery(query: unknown): SearchQueryInput {
  try {
    return searchQuerySchema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid search query');
    }
    throw error;
  }
}

/**
 * Validates ID parameter
 */
export function validateIdParam(params: unknown): IdParamInput {
  try {
    return idParamSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid ID');
    }
    throw error;
  }
}
