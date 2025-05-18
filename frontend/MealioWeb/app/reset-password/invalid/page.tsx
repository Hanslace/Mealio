// app/reset-password/invalid/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Reset Link Expired – Mealio'
};

export default function ExpiredPage() {
  return (
    <div style={{
      background: '#FFEFE5',
      height: '100vh',
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '320px'
      }}>
        <h2 style={{ marginBottom: '16px', color: '#D00' }}>Link Expired</h2>
        <p style={{ marginBottom: '24px' }}>
          That reset link is invalid or has expired. Please request a new one.
        </p>
    
      </div>
    </div>
  );
}
