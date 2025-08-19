/**
 * HTTP статус коды для ошибок
 */
export type ErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 500;

/**
 * HTTP статус коды для успешных ответов
 */
export type SuccessStatusCode = 200 | 201 | 204;

/**
 * Все возможные HTTP статус коды
 */
export type StatusCode = ErrorStatusCode | SuccessStatusCode;
