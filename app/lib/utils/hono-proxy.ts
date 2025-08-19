import { NextRequest } from 'next/server';
import { Hono } from 'hono';

/**
 * Создает прокси функцию для HTTP метода
 * Обрабатывает преобразование Next.js запроса в Hono запрос
 */
export function createHonoProxy(app: Hono) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
  ) => {
    const { path: pathArray } = await params;
    const path = pathArray.join('/');
    
    const url = new URL(request.url);
    url.pathname = `/${path}`;
    
    const requestInit: any = {
      method: request.method,
      headers: request.headers,
    };
    
    // Добавляем body и duplex только для методов с телом
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && request.body) {
      requestInit.body = request.body;
      requestInit.duplex = 'half';
    }
    
    const honoRequest = new Request(url.toString(), requestInit);
    return app.fetch(honoRequest);
  };
}
