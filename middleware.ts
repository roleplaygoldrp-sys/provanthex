import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Public routes that don't require authentication
        const publicRoutes = ['/', '/login', '/register', '/api/auth']
        
        // Check if the route starts with any public route
        const isPublicRoute = publicRoutes.some(route => 
          path === route || path.startsWith(route + '/')
        )
        
        if (isPublicRoute) {
          return true
        }
        
        // For all other routes, require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/profile/:path*',
    '/billing/:path*',
    '/api/users/:path*',
    '/api/conversations/:path*',
    '/api/chat/:path*',
    '/api/subscriptions/:path*',
  ],
}
