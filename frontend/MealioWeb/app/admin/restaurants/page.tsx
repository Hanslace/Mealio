// app/admin/restaurants/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_MEALIO_API_URL;

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API}/admin/restaurants`);
      setRestaurants(await res.json());
    })();
  }, []);

  const sendAction = async (
    id: number,
    action: 'approve' | 'reject' | 'suspend' | 'unsuspend'
  ) => {
    await fetch(
      `${API}/admin/restaurants/${id}/${action}`,
      { method: 'PUT' }
    );
    setRestaurants((rs) =>
      rs.map((r) =>
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
  };

  return (
    <div>
      <h2>All Restaurants</h2>
      <table>
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
                    <button
                      onClick={() =>
                        sendAction(r.restaurant_id, 'approve')
                      }
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        sendAction(r.restaurant_id, 'reject')
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
                {r.status === 'active' && (
                  <button
                    onClick={() =>
                      sendAction(r.restaurant_id, 'suspend')
                    }
                  >
                    Suspend
                  </button>
                )}
                {r.status === 'suspended' && (
                  <button
                    onClick={() =>
                      sendAction(r.restaurant_id, 'unsuspend')
                    }
                  >
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
