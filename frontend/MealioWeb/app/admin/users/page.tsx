// app/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// 1. Define the shape of your user object
interface User {
  user_id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

export default function AdminUsers() {
  // 2. Use User[] instead of any[]
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/users`);
      // 3. Let TS know this is a User[]
      const data: User[] = await res.json();
      setUsers(data);
    })();
  }, []);

  const ban = async (id: number) => {
    await fetch(`/api/admin/users/${id}/ban`, { method: 'PUT' });
    setUsers((u) =>
      u.map((x) =>
        x.user_id === id ? { ...x, is_active: false } : x
      )
    );
  };

  const reactivate = async (id: number) => {
    await fetch(`/api/admin/users/${id}/reactivate`, {
      method: 'PUT',
    });
    setUsers((u) =>
      u.map((x) =>
        x.user_id === id ? { ...x, is_active: true } : x
      )
    );
  };

  return (
    <div>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id}>
              <td>{u.user_id}</td>
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.is_active ? 'Active' : 'Banned'}</td>
              <td>
                {u.is_active ? (
                  <button onClick={() => ban(u.user_id)}>
                    Ban
                  </button>
                ) : (
                  <button onClick={() => reactivate(u.user_id)}>
                    Reactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
