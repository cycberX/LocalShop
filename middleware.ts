import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // Store owner routes
    if (pathname.startsWith("/dashboard")) {
      if (!token || (token.role !== "store-owner" && token.role !== "admin")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
      }
    }

    // API routes protection
    if (pathname.startsWith("/api/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes
        if (
          pathname.startsWith("/auth") ||
          pathname === "/" ||
          pathname.startsWith("/products") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/products") ||
          pathname.startsWith("/api/stores")
        ) {
          return true
        }

        // Protected routes require authentication
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/orders/:path*",
    "/api/admin/:path*",
    "/cart",
    "/checkout/:path*",
  ],
}
