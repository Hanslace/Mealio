// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Make sure you have JWT_SECRET in your env (and exposed to the Edge runtime via next.config.js)
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || ""
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on /admin routes (excluding /admin/login)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login")
  ) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      // no token → redirect to login
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }

    try {
      // Verify signature & decode
      const { payload } = await jwtVerify(token, SECRET);

      // Check that the payload.role is 'admin'
      if (payload.role !== "admin") {
        throw new Error("Not an admin");
      }
    } catch (err) {
      // invalid / expired / wrong-role token → back to login
      return NextResponse.redirect(
        new URL("/admin/login", req.url)
      );
    }
  }

  // everything else passes through
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
