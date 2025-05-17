'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  params: { token: string };
}

export default function ResetPasswordPage({ params }: Props) {
  const { token } = params;
  const router     = useRouter();

  const [status, setStatus] = useState<'loading' | 'form'>('loading');
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState('');

  // 1) Validate token on mount, then either redirect to “invalid” or show form
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.MEALIO_API_URL}/auth/verify-reset-token/${token}`
        );
        if (!res.ok) throw new Error('Link invalid or expired');
        setStatus('form');
      } catch {
        router.replace('/reset-password/invalid');
      }
    })();
  }, [token, router]);

  // 2) On success, redirect to success page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.MEALIO_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      // redirect directly to success page
      router.replace('/reset-password/success');
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div style={{ color: '#333' }}>Verifying link…</div>;
  }

  // form
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '8px',
        width: '320px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ margin: '0 0 16px' }}>Enter New Password</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>
      )}

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#FFA500',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}
      >
        {submitting ? 'Submitting…' : 'Reset Password'}
      </button>
    </form>
  );
}
