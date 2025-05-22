'use client';

import React, { useState, useEffect } from 'react';

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  status: 'active' | 'suspended';
}

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    async function fetchRestaurants() {
      const res = await fetch(`/api/admin/restaurants`);
      if (res.ok) setRestaurants(await res.json());
    }
    fetchRestaurants();

    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sendAction = async (
    id: number,
    action: 'approve' | 'reject' | 'suspend' | 'unsuspend'
  ) => {
    const res = await fetch(`/api/admin/restaurants/${id}/${action}`, { method: 'PUT' });
    if (!res.ok) return;
    setRestaurants(curr =>
      curr.map(r =>
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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={{
      padding: '2rem',
      background: 'rgba(255,255,255,0.9)',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#2d3748'
    }}>
      <h2 style={{ marginBottom: '1.5rem' }}>All Restaurants</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 8px'
      }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            {['ID','Name','Verified','Status','Actions'].map((h,i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r, idx) => (
            <tr key={r.restaurant_id} style={{ background: idx % 2 === 0 ? '#f7fafc' : '#fff' }}>
              <td style={{ padding: '12px 16px' }}>{r.restaurant_id}</td>
              <td style={{ padding: '12px 16px' }}>{r.restaurant_name}</td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize', fontWeight: 600 }}>{r.verification_status}</td>
              <td style={{ padding: '12px 16px', textTransform: 'capitalize', fontWeight: 600 }}>{r.status}</td>
              <td style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {r.verification_status === 'pending' && (
                  <>  
                    <button
                      onClick={() => sendAction(r.restaurant_id, 'approve')}
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
                    >Approve</button>

                    <button
                      onClick={() => sendAction(r.restaurant_id, 'reject')}
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
                    >Reject</button>
                  </>
                )}
                {r.status === 'active' && (
                  <button
                    onClick={() => sendAction(r.restaurant_id, 'suspend')}
                    style={{
                      padding: '8px 12px',
                      background: '#ed8936',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#dd6b20'}
                    onMouseLeave={e => e.currentTarget.style.background = '#ed8936'}
                  >Suspend</button>
                )}
                {r.status === 'suspended' && (
                  <button
                    onClick={() => sendAction(r.restaurant_id, 'unsuspend')}
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
                  >Unsuspend</button>
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
        >↑</button>
      )}
    </div>
  );
}
