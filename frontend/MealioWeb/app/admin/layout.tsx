// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Mealio Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body style={{ display: 'flex', minHeight: '100vh', margin: 0 }}>
        <aside
          style={{
            width: 240,
            background: '#222',
            color: '#fff',
            padding: 16,
          }}
        >
          <h2>Admin</h2>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link href="/admin"><a style={{ color: '#fff' }}>Dashboard</a></Link></li>
              <li><Link href="/admin/users"><a style={{ color: '#fff' }}>Users</a></Link></li>
              <li><Link href="/admin/settings"><a style={{ color: '#fff' }}>Settings</a></Link></li>
            </ul>
          </nav>
        </aside>
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
