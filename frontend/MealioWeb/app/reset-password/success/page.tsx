// app/reset-password/success/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Password Reset – Mealio'
};

export default function SuccessPage() {
  return (
    <div style={{
      background: '#E5FFEFEF',
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
        <h2 style={{ marginBottom: '16px', color: '#0A0' }}>Success!</h2>
        <p style={{ marginBottom: '24px' }}>
          Your password has been updated. You can now sign in with your new password.
        </p>
        
      </div>
    </div>
  );
}
