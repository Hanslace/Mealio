'use client';

import React, { useState, useEffect } from 'react';

interface Customer {
  user_id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/customers`);
      const data: Customer[] = await res.json();
      setCustomers(data);
    })();

    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const banCustomer = async (id: number) => {
    await fetch(`/api/admin/customers/${id}/ban`, { method: 'PUT' });
    setCustomers(list => list.map(c => c.user_id === id ? { ...c, is_active: false } : c));
  };

  const reactivateCustomer = async (id: number) => {
    await fetch(`/api/admin/customers/${id}/reactivate`, { method: 'PUT' });
    setCustomers(list => list.map(c => c.user_id === id ? { ...c, is_active: true } : c));
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={{
      padding: '2rem',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#2d3748' }}>All Customers</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 8px'
      }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            {['ID','Name','Email','Status','Action'].map((h,i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={c.user_id} style={{ background: idx % 2 === 0 ? '#f7fafc' : '#fff' }}>
              <td style={{ padding: '12px 16px' }}>{c.user_id}</td>
              <td style={{ padding: '12px 16px' }}>{c.full_name}</td>
              <td style={{ padding: '12px 16px' }}>{c.email}</td>
              <td style={{ padding: '12px 16px', color: c.is_active ? '#38a169' : '#e53e3e', fontWeight: 600 }}>
                {c.is_active ? 'Active' : 'Banned'}
              </td>
              <td style={{ padding: '12px 16px' }}>
                {c.is_active ? (
                  <button
                    onClick={() => banCustomer(c.user_id)}
                    style={{
                      padding: '8px 12px',
                      background: '#e53e3e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#c53030'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e53e3e'}
                  >Ban</button>
                ) : (
                  <button
                    onClick={() => reactivateCustomer(c.user_id)}
                    style={{
                      padding: '8px 12px',
                      background: '#38a169',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#2f855a'}
                    onMouseLeave={e => e.currentTarget.style.background = '#38a169'}
                  >Reactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ↑
        </button>
      )}
    </div>
  );
}
