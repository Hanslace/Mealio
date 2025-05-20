// app/admin/customers/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// 1. Define the shape of your customer object
interface Customer {
  user_id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

export default function AdminCustomers() {
  // 2. Use Customer[] instead of any[]
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/customers`);
      const data: Customer[] = await res.json();
      setCustomers(data);
    })();
  }, []);

  const banCustomer = async (id: number) => {
    await fetch(`/api/admin/customers/${id}/ban`, { method: 'PUT' });
    setCustomers((list) =>
      list.map((c) =>
        c.user_id === id ? { ...c, is_active: false } : c
      )
    );
  };

  const reactivateCustomer = async (id: number) => {
    await fetch(`/api/admin/customers/${id}/reactivate`, {
      method: 'PUT',
    });
    setCustomers((list) =>
      list.map((c) =>
        c.user_id === id ? { ...c, is_active: true } : c
      )
    );
  };

  return (
    <div>
      <h2>All Customers</h2>
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
          {customers.map((c) => (
            <tr key={c.user_id}>
              <td>{c.user_id}</td>
              <td>{c.full_name}</td>
              <td>{c.email}</td>
              <td>{c.is_active ? 'Active' : 'Banned'}</td>
              <td>
                {c.is_active ? (
                  <button onClick={() => banCustomer(c.user_id)}>
                    Ban
                  </button>
                ) : (
                  <button onClick={() => reactivateCustomer(c.user_id)}>
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
