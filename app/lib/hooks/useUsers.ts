'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { User, BaseUser } from '@/app/lib/types/user';
import { API_ENDPOINTS } from '@/app/lib/constants';

const REQUEST_TIMEOUT = 10000; // 10 seconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  addUser: (userData: BaseUser) => Promise<User>;
  seedFromJsonPlaceholder: () => Promise<void>;
  clearAllUsers: () => Promise<void>;
  refetch: () => Promise<void>;
}

// Кэш для хранения данных
const cache = new Map<string, { data: unknown; timestamp: number }>();

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Функция для создания HTTP запросов с обработкой ошибок
  const makeRequest = useCallback(async <T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      } as RequestInit);
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }, []);

  // Функция для работы с кэшем
  const getCachedData = useCallback((key: string): User[] | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as User[];
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: User[]) => {
    cache.set(key, { data, timestamp: Date.now() });
  }, []);

  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем кэш
      const cachedUsers = getCachedData('users');
      if (cachedUsers) {
        setUsers(cachedUsers);
        setLoading(false);
        return;
      }

      const data = await makeRequest<User[]>(API_ENDPOINTS.USERS);
      setUsers(data);
      setCachedData('users', data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Игнорируем отмененные запросы
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [makeRequest, getCachedData, setCachedData]);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchUsers();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cacheKey = `search:${query}`;
      const cachedResults = getCachedData(cacheKey);
      if (cachedResults) {
        setUsers(cachedResults);
        setLoading(false);
        return;
      }

      const data = await makeRequest<User[]>(`${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
      setUsers(data);
      setCachedData(cacheKey, data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, makeRequest, getCachedData, setCachedData]);

  const addUser = useCallback(async (userData: BaseUser) => {
    try {
      setLoading(true);
      setError(null);
      
      const newUser = await makeRequest<User>(API_ENDPOINTS.USERS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      // Оптимистичное обновление
      setUsers(prevUsers => [newUser, ...prevUsers]);
      
      // Очищаем кэш, так как данные изменились
      clearCache();

      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [makeRequest, clearCache]);

  const seedFromJsonPlaceholder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await makeRequest(API_ENDPOINTS.SEED, {
        method: 'POST',
      });
      
      // Очищаем кэш и перезагружаем данные
      clearCache();
      await fetchUsers();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [makeRequest, clearCache, fetchUsers]);

  const clearAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await makeRequest(API_ENDPOINTS.USERS, {
        method: 'DELETE',
      });
      
      // Очищаем кэш и перезагружаем данные
      clearCache();
      await fetchUsers();
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [makeRequest, clearCache, fetchUsers]);

  const refetch = useCallback(async () => {
    clearCache();
    await fetchUsers();
  }, [clearCache, fetchUsers]);

  useEffect(() => {
    fetchUsers();

    // Cleanup function для отмены запросов при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    searchUsers,
    addUser,
    seedFromJsonPlaceholder,
    clearAllUsers,
    refetch,
  };
}
