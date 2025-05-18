// app/admin/login/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Admin Sign In',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
      }}
    >
      {children}
    </div>
  );
}
