import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-change-in-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admission-form route
  if (pathname.startsWith('/admission-form')) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // No authentication token found - redirect to home
      console.log('No token found, redirecting to home');
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'login_required');
      return NextResponse.redirect(url);
    }

    try {
      // Verify the JWT token
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Get email from URL query parameter
      const emailFromUrl = request.nextUrl.searchParams.get('email');
      
      // Verify that the token's email matches the URL email parameter
      if (payload.email !== emailFromUrl) {
        console.log('Email mismatch - Token:', payload.email, 'URL:', emailFromUrl);
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('error', 'unauthorized');
        
        // Clear invalid cookie
        const response = NextResponse.redirect(url);
        response.cookies.delete('auth_token');
        return response;
      }

      // Token is valid and email matches - allow access
      console.log('Authentication successful for:', payload.email);
      return NextResponse.next();
      
    } catch (error) {
      // Token verification failed (expired or invalid)
      console.error('Token verification failed:', error);
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('error', 'session_expired');
      
      // Clear the invalid cookie
      const response = NextResponse.redirect(url);
      response.cookies.delete('auth_token');
      return response;
    }
  }

  // Allow all other routes
  return NextResponse.next();
}

// Configure which routes to protect
export const config = {
  matcher: ['/admission-form/:path*'],
};
