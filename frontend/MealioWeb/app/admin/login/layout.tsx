// app/admin/login/layout.tsx
'use client';

import React from 'react';



export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {children}
    </div>
  );
}
