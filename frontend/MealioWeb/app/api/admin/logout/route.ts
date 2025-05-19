// app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { serialize }   from 'cookie';

export async function POST() {
  // clear the HTTP-only cookie
  const cookie = serialize('token', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
