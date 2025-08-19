'use client';

import { useState } from 'react';
import { useUsers } from '@/app/lib/hooks/useUsers';
import UserList from '@/app/components/UserList';
import SearchBar from '@/app/components/SearchBar';
import AddUserModal from '@/app/components/AddUserModal';
import { BaseUser, User } from '@/app/lib/types/user';

export default function Home() {
  const { users, loading, error, searchUsers, addUser, seedFromJsonPlaceholder, clearAllUsers } = useUsers();
  
  // Простое состояние компонента
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleAddUser = async (userData: BaseUser) => {
    try {
      setIsAddingUser(true);
      setAddUserError(null);
      await addUser(userData);
      setIsAddModalOpen(false);
      setAddUserError(null);
    } catch (error) {
      setAddUserError(error instanceof Error ? error.message : 'Произошла неожиданная ошибка');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setAddUserError(null);
  };

  const handleUserClick = (user: User) => {
    alert(`Пользователь: ${user.name}\nEmail: ${user.email}\nUsername: @${user.username}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Управление пользователями
          </h1>
          <p className="text-gray-600">
            Приложение для работы с пользователями с использованием Hono и Drizzle
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Поиск по имени пользователя..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Добавить пользователя
              </button>
              <button
                onClick={seedFromJsonPlaceholder}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : 'Загрузить с JSONPlaceholder'}
              </button>
              <button
                onClick={clearAllUsers}
                disabled={loading || users.length === 0}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : 'Очистить базу'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Ошибка
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Список пользователей
            </h2>
            <span className="text-sm text-gray-500">
              {users.length} пользователей
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </div>
            </div>
          ) : (
            <UserList users={users} onUserClick={handleUserClick} />
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddUser}
        isLoading={isAddingUser}
        error={addUserError}
      />
    </div>
  );
}
