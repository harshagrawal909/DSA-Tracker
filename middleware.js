import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Get the JWT token directly using the secret
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Admin email whitelist - checked directly on token payload
  const adminEmails = ["harshagrawal4256@gmail.com"];
  const isAdminByEmail = token?.email
    ? adminEmails.includes(token.email.toLowerCase())
    : false;
  const isAdmin = token?.role === "admin" || isAdminByEmail;
  const isPaid = token?.isPaid;

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Not logged in at all - redirect to home
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!isPaid && !isAdmin) {
      // Logged in but not paid and not admin
      return NextResponse.redirect(new URL("/?showPayment=1", req.url));
    }
  }

  // Admin-only route protection
  if (pathname.startsWith("/admin")) {
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
