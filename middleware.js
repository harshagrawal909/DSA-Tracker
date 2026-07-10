import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes — /dashboard is protected client-side
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const adminEmails = ["harshagrawal4256@gmail.com", "aadilmittal62@gmail.com"];
    const isAdminByEmail = token?.email
      ? adminEmails.includes(token.email.toLowerCase())
      : false;
    const isAdmin = token?.role === "admin" || isAdminByEmail;

    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
