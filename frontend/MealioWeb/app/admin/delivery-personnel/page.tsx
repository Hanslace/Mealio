// app/admin/delivery-personnel/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_MEALIO_API_URL!;

// Define the shape of a delivery‐person record
interface DeliveryPerson {
  delivery_personnel_id: number;
  user_id: number;
  driver_license_no: string;
  vehicle_type: string;
  is_verified: boolean;
  status: 'active' | 'not_active' | 'suspended';
}

export default function AdminDelivery() {
  const [list, setList] = useState<DeliveryPerson[]>([]);

  useEffect(() => {
    async function fetchList() {
      const res = await fetch(`${API}/admin/delivery-personnel`);
      if (res.ok) {
        const data = (await res.json()) as DeliveryPerson[];
        setList(data);
      }
    }
    fetchList();
  }, []);

  async function sendAction(
    id: number,
    action: 'verify' | 'suspend' | 'unsuspend'
  ) {
    const res = await fetch(
      `${API}/admin/delivery-personnel/${id}/${action}`,
      { method: 'PUT' }
    );
    if (!res.ok) {
      console.error('Action failed', await res.text());
      return;
    }

    setList((current) =>
      current.map((d) =>
        d.delivery_personnel_id === id
          ? {
              ...d,
              is_verified: action === 'verify' ? true : d.is_verified,
              status:
                action === 'suspend'
                  ? 'suspended'
                  : action === 'unsuspend'
                  ? 'active'
                  : d.status,
            }
          : d
      )
    );
  }

  return (
    <div>
      <h2>All Delivery Personnel</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>License</th>
            <th>Vehicle</th>
            <th>Verified</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((d) => (
            <tr key={d.delivery_personnel_id}>
              <td>{d.delivery_personnel_id}</td>
              <td>{d.user_id}</td>
              <td>{d.driver_license_no}</td>
              <td>{d.vehicle_type}</td>
              <td>{d.is_verified ? 'Yes' : 'No'}</td>
              <td>{d.status}</td>
              <td>
                {!d.is_verified && (
                  <button
                    onClick={() =>
                      sendAction(d.delivery_personnel_id, 'verify')
                    }
                  >
                    Verify
                  </button>
                )}
                {d.status === 'active' && (
                  <button
                    onClick={() =>
                      sendAction(d.delivery_personnel_id, 'suspend')
                    }
                  >
                    Suspend
                  </button>
                )}
                {d.status === 'suspended' && (
                  <button
                    onClick={() =>
                      sendAction(d.delivery_personnel_id, 'unsuspend')
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
