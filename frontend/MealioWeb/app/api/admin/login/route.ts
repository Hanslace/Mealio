// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { serialize } from 'cookie';
import { jwtVerify } from 'jose';

const API = process.env.NEXT_PUBLIC_MEALIO_API_URL!;
// This must match the secret you used when signing the JWT on your backend:
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // 1) Forward creds to your real login endpoint
  const remote = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await remote.json();
  if (!remote.ok) {
    // pass along any login‐error (invalid credentials, etc.)
    return NextResponse.json(data, { status: remote.status });
  }

  const token = data.token as string;
  try {
    // 2) Verify & decode the JWT
    const { payload } = await jwtVerify(token, SECRET);

    // 3) Enforce admin‐only
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'You are not an admin' },
        { status: 403 }
      );
    }
  } catch (e) {
    // bad token (invalid/expired)
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 403 }
    );
  }

  // 4) Set it as an HTTP‐only cookie so middleware can see it
  const cookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'lax',
  });

  const resp = NextResponse.json({ success: true });
  resp.headers.set('Set-Cookie', cookie);
  return resp;
}
