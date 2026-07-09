import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is trying to access dashboard but hasn't paid, redirect to landing page
    if (pathname.startsWith("/dashboard")) {
      const isPaid = token?.isPaid;
      const isAdmin = token?.role === "admin";
      if (!isPaid && !isAdmin) {
        return NextResponse.redirect(new URL("/?showPayment=1", req.url));
      }
    }

    // Admin-only route protection
    if (pathname.startsWith("/admin")) {
      const role = token?.role;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
