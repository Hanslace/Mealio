'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';

  // If we're on /admin/login or any sub‐path, skip the admin sidebar
  if (path.startsWith('/admin/login')) {
    return <>{children}</>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{
        backgroundColor: '#333',
        padding: '1rem',
        color: '#fff',
        display: 'flex',
        gap: '1rem'
      }}>
        <Link href="/admin" style={{ color: '#fff' }}>Dashboard</Link>
        <Link href="/admin/users" style={{ color: '#fff' }}>Users</Link>
        <Link href="/admin/restaurants" style={{ color: '#fff' }}>Restaurants</Link>
        <Link href="/admin/delivery-personnel" style={{ color: '#fff' }}>Delivery Personnel</Link>
      </nav>
      <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: '#f5f5f5'
      }}>
        &copy; {new Date().getFullYear()} Mealio Admin Panel
      </footer>
    </div>
  );
}
