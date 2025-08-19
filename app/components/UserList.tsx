'use client';

import { User } from '@/app/lib/types/user';

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
}

export default function UserList({ users, onUserClick }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Пользователи не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
          onClick={() => onUserClick?.(user)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <p className="text-sm text-blue-600">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-gray-500">📞 {user.phone}</p>
              )}
              {user.website && (
                <p className="text-sm text-gray-500">🌐 {user.website}</p>
              )}
              {user.company && (
                <p className="text-sm text-gray-500">🏢 {user.company}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
