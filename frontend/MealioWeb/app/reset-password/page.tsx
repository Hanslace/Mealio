// app/reset-password/page.tsx
'use client';
import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // call your API:
    // await fetch('/api/auth/forgot-password', { method:'POST', body: JSON.stringify({ email }) })
    setMessage('If that email exists, a reset link was sent.');
  };

  return (
    <>
      <h2>Reset Your Password</h2>
      <form onSubmit={onSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Email address
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: 12,
            background: '#FFA500',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </>
  );
}
