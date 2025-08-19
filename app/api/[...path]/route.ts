import app from '../index';
import { createHonoProxy } from '@/app/lib/utils/hono-proxy';

const proxyHandler = createHonoProxy(app);

export const GET = proxyHandler;
export const POST = proxyHandler;
export const PUT = proxyHandler;
export const DELETE = proxyHandler;
export const PATCH = proxyHandler;
