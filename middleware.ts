// middleware.ts (at root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for auth cookie
  const authToken = request.cookies.get('auth-token')?.value
  
  // Define protected routes (routes that require authentication)
  const protectedRoutes = ['/dashboard', '/users']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Define auth routes (routes that shouldn't be accessed when logged in)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  // If trying to access protected route without auth token
  if (isProtectedRoute && !authToken) {
    // Store the original URL to redirect back after login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If already authenticated and trying to access login/register
  if (isAuthRoute && authToken) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/login',
    '/register'
  ],
}