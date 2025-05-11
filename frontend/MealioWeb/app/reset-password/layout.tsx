// app/reset-password/layout.tsx
import React from 'react';

export default function ResetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          background: '#f5f5f5',
        }}
      >
        <div
          style={{
            background: '#fff',
            padding: 32,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: 320,
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
