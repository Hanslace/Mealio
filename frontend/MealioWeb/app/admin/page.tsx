'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

// ===== BACKEND MODELS NEEDED =====
// User                : { userId, fullName, role }
// Restaurant          : { restaurantId, name, status }
// DeliveryPersonnel   : { personnelId, userId, driverLicenseNo, status }
// Order               : { orderId, amount, customerId, restaurantId, createdAt }
// Customer (subset of User with role='customer')
// Notification        : { notificationId, title, body, audience, sentAt }
// Metrics endpoint    : computed counts and sum of revenue

interface Metrics {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
}

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
}

interface DeliveryPerson {
  user_id: number;
  driver_license_no: string;
}

interface Customer {
  user_id: number;
  full_name: string;
}

export default function AdminHome() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [pendingDelivery, setPendingDelivery] = useState<DeliveryPerson[]>([]);
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'customers' | 'restaurants' | 'delivery'>('customers');

  useEffect(() => {
    async function loadAll() {
      const [dRes, prRes, pdRes, cRes] = await Promise.all([
        fetch(`/api/admin/dashboard`),
        fetch(`/api/admin/restaurants?status=pending`),
        fetch(`/api/admin/delivery-personnel?status=pending`),
        fetch(`/api/admin/customers`),
      ]);
      if (dRes.ok) setMetrics(await dRes.json());
      if (prRes.ok) setPendingRestaurants(await prRes.json());
      if (pdRes.ok) setPendingDelivery(await pdRes.json());
      if (cRes.ok) {
        const all = (await cRes.json()) as Customer[];
        setRecentCustomers(all.slice(0, 5));
      }
    }
    loadAll();
  }, []);

  async function handleNotify(e: FormEvent) {
    e.preventDefault();
    const path = {
      customers: 'all-customers',
      restaurants: 'all-restaurants',
      delivery: 'all-delivery',
    }[audience];
    await fetch(`/api/admin/notify/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    setTitle(''); setBody('');
    alert('Notification sent');
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 10%, #764ba2 90%)',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#2d3748',
      borderRadius: 20,
    }}>
      {/* Metrics Cards */}
      {metrics && (
        <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
          <Card label="Customers" value={metrics.totalUsers} />
          <Card label="Restaurants" value={metrics.totalRestaurants} />
          <Card label="Orders" value={metrics.totalOrders} />
          <Card label="Revenue" value={`$${metrics.totalRevenue}`} />
        </div>
      )}

      {/* Lists Section */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
        <List
          title="Pending Restaurants"
          items={pendingRestaurants.map(r => r.restaurant_name)}
        />
        <List
          title="Pending Delivery"
          items={pendingDelivery.map(d => d.driver_license_no)}
        />
        <List
          title="Recent Customers"
          items={recentCustomers.map(c => c.full_name)}
        />
      </div>

      {/* Notification Form */}
      <form onSubmit={handleNotify} style={{
        padding: '24px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h3 style={{ marginBottom: '16px' }}>Send Notification</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc'
          }}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px', marginBottom: '12px', height: '100px', borderRadius: '8px', border: '1px solid #ccc'
          }}
        />
        <select
          value={audience}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setAudience(e.target.value as any)}
          style={{
            width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc'
          }}
        >
          <option value="customers">All Customers</option>
          <option value="restaurants">All Restaurants</option>
          <option value="delivery">All Delivery Personnel</option>
        </select>
        <button
          type="submit"
          style={{
            width: '100%', padding: '12px', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'
          }}
        >Send</button>
      </form>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{
      flex: 1,
      padding: '24px',
      background: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 8px', fontSize: '18px', color: '#4a5568' }}>{label}</h4>
      <p style={{ fontSize: '2rem', margin: 0, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.9)',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxHeight: '260px',
      overflowY: 'auto'
    }}>
      <h4 style={{ margin: '0 0 12px', fontSize: '18px', color: '#4a5568' }}>{title}</h4>
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {items.map((it, i) => (
          <li key={i} style={{ marginBottom: '8px' }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}