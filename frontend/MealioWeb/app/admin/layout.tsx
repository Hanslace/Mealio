// app/admin/layout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  const router = useRouter();


 

  // 2) Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Skip sidebar/nav on the login page itself
  if (path.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#333',
          padding: '1rem',
          color: '#fff',
        }}
      >
        {/* left‐side links */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/customers">Customers</Link>
          <Link href="/admin/restaurants">Restaurants</Link>
          <Link href="/admin/delivery-personnel">Delivery Personnel</Link>
        </div>

        {/* right‐side admin info + logout */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid #fff',
              color: '#fff',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '1rem' }}>{children}</main>

      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: '#f5f5f5',
        }}
      >
        &copy; {new Date().getFullYear()} Mealio Admin Panel
      </footer>
    </div>
  );
}
