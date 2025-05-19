'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

// -- Define your data shapes --
interface Metrics {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  // add any other fields you need
}

interface DeliveryPerson {
  user_id: number;
  driver_license_no: string;
  // add any other fields you need
}

interface User {
  user_id: number;
  full_name: string;
  // add any other fields you need
}

export default function AdminHome() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [pendingDelivery, setPendingDelivery] = useState<DeliveryPerson[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'users' | 'restaurants' | 'delivery'>('users');

  useEffect(() => {
    async function loadAll() {
      // Dashboard metrics
      const dRes = await fetch(`/api/admin/dashboard`);
      if (dRes.ok) {
        setMetrics((await dRes.json()) as Metrics);
      }

      // Pending restaurants
      const prRes = await fetch(`/api/admin/restaurants?status=pending`);
      if (prRes.ok) {
        setPendingRestaurants((await prRes.json()) as Restaurant[]);
      }

      // Pending delivery personnel
      const pdRes = await fetch(`/api/admin/delivery-personnel?status=pending`);
      if (pdRes.ok) {
        setPendingDelivery((await pdRes.json()) as DeliveryPerson[]);
      }

      // Recent users (just take first 5)
      const uRes = await fetch(`/api/admin/users`);
      if (uRes.ok) {
        const allUsers = (await uRes.json()) as User[];
        setRecentUsers(allUsers.slice(0, 5));
      }
    }
    loadAll();
  }, []);

  async function handleNotify(e: FormEvent) {
    e.preventDefault();
    let url = `/api/admin/notify/all-users`;
    if (audience === 'restaurants') url = `/api/admin/notify/all-restaurants`;
    if (audience === 'delivery')    url = `/api/admin/notify/all-delivery-personnel`;

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });

    setTitle('');
    setBody('');
    alert('Notification sent');
  }

  function handleAudienceChange(e: ChangeEvent<HTMLSelectElement>) {
    setAudience(e.target.value as 'users' | 'restaurants' | 'delivery');
  }

  return (
    <div>
      {/* Metrics Cards */}
      {metrics && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <Card label="Users" value={metrics.totalUsers} />
          <Card label="Restaurants" value={metrics.totalRestaurants} />
          <Card label="Orders" value={metrics.totalOrders} />
          <Card label="Revenue" value={`$${metrics.totalRevenue}`} />
        </div>
      )}

      {/* Pending / Recent Lists */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <List
          title="Pending Restaurants"
          items={pendingRestaurants.map(r => r.restaurant_name)}
        />
        <List
          title="Pending Delivery"
          items={pendingDelivery.map(d => d.driver_license_no)}
        />
        <List
          title="Recent Users"
          items={recentUsers.map(u => u.full_name)}
        />
      </div>

      {/* Notification Form */}
      <form onSubmit={handleNotify} style={{ marginBottom: 32 }}>
        <h3>Send Notification</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: 8 }}
        />
        <select
          value={audience}
          onChange={handleAudienceChange}
          style={{ display: 'block', marginBottom: 8 }}
        >
          <option value="users">All Users</option>
          <option value="restaurants">All Restaurants</option>
          <option value="delivery">All Delivery Personnel</option>
        </select>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
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
      <p style={{ fontSize: '1.5rem', margin: 0 }}>{value}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
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
