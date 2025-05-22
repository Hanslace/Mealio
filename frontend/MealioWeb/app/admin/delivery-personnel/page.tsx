'use client';

import React, { useState, useEffect } from 'react';

interface DeliveryPerson {
  delivery_personnel_id: number;
  user_id: number;
  driver_license_no: string;
  vehicle_type: string;
  is_verified: boolean;
  status: 'online' | 'offline' | 'suspended';
}

export default function AdminDeliveryPersonnel() {
  const [list, setList] = useState<DeliveryPerson[]>([]);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    async function fetchList() {
      const res = await fetch(`/api/admin/delivery-personnel`);
      if (res.ok) setList(await res.json());
    }
    fetchList();

    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sendAction = async (
    id: number,
    action: 'verify' | 'reject' | 'suspend' | 'unsuspend'
  ) => {
    const res = await fetch(`/api/admin/delivery-personnel/${id}/${action}`, { method: 'PUT' });
    if (!res.ok) return;
    setList(curr =>
      curr.map(d =>
        d.delivery_personnel_id === id
          ? {
              ...d,
              is_verified:
                action === 'verify'
                  ? true
                  : action === 'reject'
                  ? false
                  : d.is_verified,
              status:
                action === 'suspend'
                  ? 'suspended'
                  : action === 'unsuspend'
                  ? 'offline'
                  : d.status,
            }
          : d
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
      <h2 style={{ marginBottom: '1.5rem' }}>All Delivery Personnel</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 8px'
      }}>
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            {['ID','User','License','Vehicle','Verified','Status','Actions'].map((h,i) => (
              <th key={i} style={{ padding: '12px 16px', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((d, idx) => (
            <tr key={d.delivery_personnel_id} style={{ background: idx % 2 === 0 ? '#f7fafc' : '#fff' }}>
              <td style={{ padding: '12px 16px' }}>{d.delivery_personnel_id}</td>
              <td style={{ padding: '12px 16px' }}>{d.user_id}</td>
              <td style={{ padding: '12px 16px' }}>{d.driver_license_no}</td>
              <td style={{ padding: '12px 16px' }}>{d.vehicle_type}</td>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: d.is_verified ? '#38a169' : '#e53e3e' }}>
                {d.is_verified ? 'Yes' : 'No'}
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'capitalize' }}>
                {d.status}
              </td>
              <td style={{ padding: '12px 16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {!d.is_verified && (
                  <>
                    <button
                      onClick={() => sendAction(d.delivery_personnel_id, 'verify')}
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
                    >Verify</button>
                    <button
                      onClick={() => sendAction(d.delivery_personnel_id, 'reject')}
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
                {(d.status === 'online' || d.status === 'offline') && (
                  <button
                    onClick={() => sendAction(d.delivery_personnel_id, 'suspend')}
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
                {d.status === 'suspended' && (
                  <button
                    onClick={() => sendAction(d.delivery_personnel_id, 'unsuspend')}
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
        >
          ↑
        </button>
      )}
    </div>
  );
}
