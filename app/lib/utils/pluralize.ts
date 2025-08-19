/**
 * Utility for proper pluralization
 */
export function pluralize(count: number, one: string, many: string): string {
  return count === 1 ? one : many;
}

/**
 * Special function for the word "user"
 */
export function pluralizeUser(count: number): string {
  return pluralize(count, 'user', 'users');
}

/**
 * Special function for the word "request"
 */
export function pluralizeRequest(count: number): string {
  return pluralize(count, 'request', 'requests');
}
