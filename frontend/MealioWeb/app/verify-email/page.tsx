// app/verify-email/page.tsx
import Link from 'next/link';

interface VerifyEmailPageProps {
  // Next.js 15 passes searchParams as a Promise
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  // await the promise to get the actual params object
  const { token } = await searchParams;

  if (!token) {
    return (
      <main style={{ padding: 20, textAlign: 'center' }}>
        <h1>Verification Link Missing</h1>
        <p>No token provided. Please use the link from your email.</p>
      </main>
    );
  }

  let ok: boolean;
  let message: string;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_MEALIO_API_URL}/auth/verify-email?token=${token}`,
      { cache: 'no-store' }
    );
    const data = await res.json();

    if (res.ok) {
      ok = true;
      message = 'Your email has been verified successfully! You may now log in.';
    } else {
      ok = false;
      message = data.error || 'Verification failed: invalid or expired link.';
    }
  } catch {
    ok = false;
    message = 'An unexpected error occurred. Please try again later.';
  }

  return (
    <main style={{ maxWidth: 480, margin: '4rem auto', textAlign: 'center' }}>
      <h1>{ok ? '✅ Email Verified' : '❌ Verification Failed'}</h1>
      <p>{message}</p>
      <div style={{ marginTop: '2rem' }}>
        {ok ? (
          <Link
            href="/login"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#0070f3',
              color: '#fff',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Go to Login
          </Link>
        ) : (
          <Link
            href="/resend-verification"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#e00',
              color: '#fff',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Resend Verification Email
          </Link>
        )}
      </div>
    </main>
  );
}
