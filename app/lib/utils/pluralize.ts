/**
 * Утилита для правильного склонения числительных
 */
export function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10
  const mod100 = count % 100
  
  if (mod100 >= 11 && mod100 <= 19) {
    return many
  }
  
  if (mod10 === 1) {
    return one
  }
  
  if (mod10 >= 2 && mod10 <= 4) {
    return few
  }
  
  return many
}

/**
 * Специальная функция для слова "пользователь"
 */
export function pluralizeUser(count: number): string {
  return pluralize(count, 'пользователь', 'пользователя', 'пользователей')
}

/**
 * Специальная функция для слова "запрос"
 */
export function pluralizeRequest(count: number): string {
  return pluralize(count, 'запрос', 'запроса', 'запросов')
}
