'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams }       from 'next/navigation';

export default function ResetPasswordPage() {
  const { token } = useParams() as { token?: string };
  const router    = useRouter();

  const [status, setStatus]                = useState<'loading' | 'form'>('loading');
  const [newPassword, setNewPassword]      = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting]        = useState(false);
  const [error, setError]                  = useState('');

  // 1) Verify token on mount
  useEffect(() => {
    if (!token) {
      router.replace('/reset-password/invalid');
      return;
    }
    async function verifyToken() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MEALIO_API_URL}/auth/verify-reset-token/${token}`
        );
        if (!res.ok) throw new Error();
        setStatus('form');
      } catch {
        router.replace('/reset-password/invalid');
      }
    }
    verifyToken();
  }, [token, router]);

  // 2) Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_MEALIO_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed.');
      router.replace('/reset-password/success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setSubmitting(false);
    }
  };

  // 3) Render loading state or the form
  if (status === 'loading') {
    return <div style={{ color: '#333' }}>Verifying link…</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        width: '320px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: 'auto'
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Enter New Password</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
      )}

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#FFA500',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontWeight: '500'
        }}
      >
        {submitting ? 'Submitting…' : 'Reset Password'}
      </button>
    </form>
  );
}
