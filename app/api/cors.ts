import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to add CORS headers to a response
export function addCorsHeaders(req: NextRequest, res: NextResponse) {
  // Get the origin from the request headers or use '*' as a fallback
  const origin = req.headers.get('origin') || '*';
  
  // Add CORS headers to the response
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return res;
}

// Middleware to handle CORS for API routes
export function corsMiddleware(req: NextRequest) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // For actual API requests, continue to the API route but add CORS headers
  const response = NextResponse.next();
  return addCorsHeaders(req, response);
}
