// app/reset-password/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Reset Password - Mealio'
};

export default function ResetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFEFE5'
    }}>
      {children}
    </div>
  );
}
