// app/admin/restaurants/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Define the shape of a restaurant record
interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  status: 'active' | 'suspended';
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    async function fetchRestaurants() {
      const res = await fetch(`/api/admin/restaurants`);
      if (res.ok) {
        const data = (await res.json()) as Restaurant[];
        setRestaurants(data);
      }
    }
    fetchRestaurants();
  }, []);

  async function sendAction(
    id: number,
    action: 'approve' | 'reject' | 'suspend' | 'unsuspend'
  ) {
    const res = await fetch(
      `/api/admin/restaurants/${id}/${action}`,
      { method: 'PUT' }
    );
    if (!res.ok) {
      console.error('Action failed', await res.text());
      return;
    }

    setRestaurants((current) =>
      current.map((r) =>
        r.restaurant_id === id
          ? {
              ...r,
              verification_status:
                action === 'approve'
                  ? 'approved'
                  : action === 'reject'
                  ? 'rejected'
                  : r.verification_status,
              status:
                action === 'suspend'
                  ? 'suspended'
                  : action === 'unsuspend'
                  ? 'active'
                  : r.status,
            }
          : r
      )
    );
  }

  return (
    <div>
      <h2>All Restaurants</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Verified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.restaurant_id}>
              <td>{r.restaurant_id}</td>
              <td>{r.restaurant_name}</td>
              <td>{r.verification_status}</td>
              <td>{r.status}</td>
              <td>
                {r.verification_status === 'pending' && (
                  <>
                    <button onClick={() => sendAction(r.restaurant_id, 'approve')}>
                      Approve
                    </button>
                    <button onClick={() => sendAction(r.restaurant_id, 'reject')}>
                      Reject
                    </button>
                  </>
                )}
                {r.status === 'active' && (
                  <button onClick={() => sendAction(r.restaurant_id, 'suspend')}>
                    Suspend
                  </button>
                )}
                {r.status === 'suspended' && (
                  <button onClick={() => sendAction(r.restaurant_id, 'unsuspend')}>
                    Unsuspend
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
