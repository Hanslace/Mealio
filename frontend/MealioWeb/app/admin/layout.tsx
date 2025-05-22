'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  const router = useRouter();
  const [hoverLogout, setHoverLogout] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Skip nav on login
  if (path.startsWith('/admin/login')) return <>{children}</>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem' }}>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          borderRadius: '12px',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Logo & Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Image
            src="/logo.png"
            alt="Mealio Logo"
            width={50}
            height={50}
            style={{ borderRadius: '10px' }}
          />
          {['Dashboard', 'Customers', 'Restaurants', 'Delivery-personnel'].map((label, idx) => (
            <Link
              key={idx}
              href={`/admin/${label.toLowerCase()}` === '/admin/dashboard' ? '/admin' : `/admin/${label.toLowerCase()}`}
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoverLogout(true)}
          onMouseLeave={() => setHoverLogout(false)}
          style={{
            background: hoverLogout ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
            border: hoverLogout ? '1px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.6)',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
        >
          Logout
        </button>
      </nav>

      <main style={{ flex: 1, background: '#f7fafc', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '2rem' }}>
        {children}
      </main>

      <footer
        style={{
          textAlign: 'center',
          padding: '1rem',
          background: '#edf2f7',
          fontSize: '0.875rem',
          color: '#4a5568',
          marginTop: '2rem',
          borderRadius: '8px'
        }}
      >
        &copy; {new Date().getFullYear()} Mealio Admin Panel
      </footer>
    </div>
  );
}