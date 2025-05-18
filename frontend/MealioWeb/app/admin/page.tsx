// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_MEALIO_API_URL;

export default function AdminHome() {
  const [metrics, setMetrics] = useState<any>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [pendingDelivery, setPendingDelivery] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] =
    useState<'users' | 'restaurants' | 'delivery'>('users');

  useEffect(() => {
    async function loadAll() {
      // Dashboard
      const dRes = await fetch(`${API}/admin/dashboard`);
      setMetrics(await dRes.json());

      // Pending restaurants
      const prJson = await (await fetch(`${API}/admin/restaurants?status=pending`)).json();
      const prList = Array.isArray(prJson)
        ? prJson
        : Array.isArray(prJson.data)
        ? prJson.data
        : [];
      setPendingRestaurants(prList);

      // Pending delivery
      const pdJson = await (await fetch(`${API}/admin/delivery-personnel?status=pending`)).json();
      const pdList = Array.isArray(pdJson)
        ? pdJson
        : Array.isArray(pdJson.data)
        ? pdJson.data
        : [];
      setPendingDelivery(pdList);

      // Recent users
      const uJson = await (await fetch(`${API}/admin/users`)).json();
      const uList = Array.isArray(uJson)
        ? uJson
        : Array.isArray(uJson.users)
        ? uJson.users
        : Array.isArray(uJson.data)
        ? uJson.data
        : [];
      setRecentUsers(uList.slice(0, 5));
    }
    loadAll();
  }, []);


  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = `${API}/admin/notify/all-users`;
    if (audience === 'restaurants')
      url = `${API}/admin/notify/all-restaurants`;
    if (audience === 'delivery')
      url = `${API}/admin/notify/all-delivery-personnel`;

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    setTitle('');
    setBody('');
    alert('Notification sent');
  };

  return (
    <div>
      {metrics && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <Card label="Users" value={metrics.totalUsers} />
          <Card
            label="Restaurants"
            value={metrics.totalRestaurants}
          />
          <Card label="Orders" value={metrics.totalOrders} />
          <Card
            label="Revenue"
            value={`$${metrics.totalRevenue}`}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <List
          title="Pending Restaurants"
          items={pendingRestaurants.map((r) => r.restaurant_name)}
        />
        <List
          title="Pending Delivery"
          items={pendingDelivery.map((d) => d.driver_license_no)}
        />
        <List
          title="Recent Users"
          items={recentUsers.map((u) => u.full_name)}
        />
      </div>

      <form onSubmit={handleNotify} style={{ marginBottom: 32 }}>
        <h3>Send Notification</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <select
          value={audience}
          onChange={(e) =>
            setAudience(e.target.value as any)
          }
          style={{ marginBottom: 8 }}
        >
          <option value="users">All Users</option>
          <option value="restaurants">
            All Restaurants
          </option>
          <option value="delivery">
            All Delivery Personnel
          </option>
        </select>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function Card({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: 16,
        background: '#eef',
        textAlign: 'center',
        borderRadius: 4,
      }}
    >
      <h4>{label}</h4>
      <p style={{ fontSize: '1.5rem', margin: 0 }}>
        {value}
      </p>
    </div>
  );
}

function List({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div
      style={{
        flex: 1,
        background: '#fde',
        padding: 16,
        borderRadius: 4,
        maxHeight: 200,
        overflowY: 'auto',
      }}
    >
      <h4>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
