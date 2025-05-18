'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
  token?: string;
  message?: string;
  error?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      // 1) POST to our Next.js API route
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      // 2) Parse & type the JSON
      const data = (await res.json()) as LoginResponse;
      if (!res.ok) {
        // data.error (from our proxy) or data.message (from backend)
        throw new Error(data.error ?? data.message ?? 'Login failed');
      }

      // 3) Success → redirect (cookie is already set by the API route)
      router.replace('/admin');
    } catch (err: unknown) {
      // Narrow `unknown` to get a message
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: 320,
        padding: 24,
        background: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: 16, textAlign: 'center' }}>
        Admin Sign In
      </h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '12px',
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          background: '#FFA500',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Signing In…' : 'Sign In'}
      </button>
    </form>
  );
}
