import { NextRequest } from 'next/server';
import { Hono } from 'hono';
import { NextResponse } from 'next/server';

/**
 * Создает прокси для Hono приложения
 */
export function createHonoProxy(honoApp: Hono) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api', '');
    
    // Выполняем запрос через Hono
    const response = await honoApp.request(path, {
      method: request.method,
      headers: request.headers as unknown as HeadersInit,
      body: request.body,
    });
    
    // Конвертируем Hono Response в NextResponse
    const responseBody = await response.text();
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as unknown as HeadersInit,
    });
    
    return nextResponse;
  };
}
