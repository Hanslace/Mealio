import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Optionally decode & check role === 'admin'
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
