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

// Схема валидации для создания пользователя
export const createUserSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_CONSTANTS.NAME.MIN_LENGTH, `Имя должно содержать минимум ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} символа`)
    .max(VALIDATION_CONSTANTS.NAME.MAX_LENGTH, `Имя не должно превышать ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH} символов`)
    .trim()
    .refine((val) => val.length > 0, 'Имя обязательно для заполнения'),
  
  email: z
    .string()
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    }, { message: 'Неверный формат email адреса' })
    .max(VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH, `Email не должен превышать ${VALIDATION_CONSTANTS.EMAIL.MAX_LENGTH} символов`)
    .toLowerCase()
    .trim(),
  
  username: z
    .string()
    .min(VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH, `Username должен содержать минимум ${VALIDATION_CONSTANTS.USERNAME.MIN_LENGTH} символа`)
    .max(VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH, `Username не должен превышать ${VALIDATION_CONSTANTS.USERNAME.MAX_LENGTH} символов`)
    .regex(VALIDATION_CONSTANTS.USERNAME.PATTERN, 'Username может содержать только буквы, цифры, дефисы и подчеркивания')
    .trim(),
  
  phone: z
    .string()
    .max(VALIDATION_CONSTANTS.PHONE.MAX_LENGTH, `Телефон не должен превышать ${VALIDATION_CONSTANTS.PHONE.MAX_LENGTH} символов`)
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
    }, { message: 'Неверный формат URL' })
    .max(VALIDATION_CONSTANTS.WEBSITE.MAX_LENGTH, `Website не должен превышать ${VALIDATION_CONSTANTS.WEBSITE.MAX_LENGTH} символов`)
    .optional()
    .nullable(),
  
  company: z
    .string()
    .max(VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH, `Название компании не должно превышать ${VALIDATION_CONSTANTS.COMPANY.MAX_LENGTH} символов`)
    .optional()
    .nullable(),
});

// Схема валидации для поиска
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Поисковый запрос не может быть пустым')
    .max(100, 'Поисковый запрос не должен превышать 100 символов')
    .trim(),
});

// Схема валидации для ID
export const idParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'ID должен быть положительным числом')
    .transform((val) => parseInt(val, 10)),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;

/**
 * Валидирует данные для создания пользователя
 */
export function validateCreateUser(data: unknown): CreateUserInput {
  try {
    return createUserSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Ошибка валидации данных');
    }
    throw error;
  }
}

/**
 * Валидирует поисковый запрос
 */
export function validateSearchQuery(query: unknown): SearchQueryInput {
  try {
    return searchQuerySchema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Неверный поисковый запрос');
    }
    throw error;
  }
}

/**
 * Валидирует ID параметр
 */
export function validateIdParam(params: unknown): IdParamInput {
  try {
    return idParamSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Неверный ID');
    }
    throw error;
  }
}
