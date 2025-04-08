import { NextRequest, NextResponse } from 'next/server';

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function initMiddleware(middleware: any) {
  return (req: NextRequest, res: NextResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// CORS middleware configuration
export function cors(req: NextRequest, res: NextResponse) {
  // Allow requests from any origin
  res.headers.set('Access-Control-Allow-Origin', '*');
  
  // Allow the methods and headers the client requested
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.headers.set('Access-Control-Max-Age', '86400');
    return new NextResponse(null, { status: 204, headers: res.headers });
  }
  
  return res;
}

// Wrapper function to apply CORS headers to API responses
export function withCors(handler: Function) {
  return async function(req: NextRequest) {
    // Create a basic response to add headers to
    let response = NextResponse.next();
    
    // Apply CORS headers
    response = cors(req, response);
    
    // If it's a preflight request, return the response now
    if (req.method === 'OPTIONS') {
      return response;
    }
    
    // Otherwise, call the handler and apply CORS headers to its response
    try {
      const handlerResponse = await handler(req);
      
      // Copy all headers from the handler response
      const headers = new Headers(handlerResponse.headers);
      
      // Add CORS headers
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Create a new response with the same status, body, and updated headers
      return new NextResponse(handlerResponse.body, {
        status: handlerResponse.status,
        statusText: handlerResponse.statusText,
        headers
      });
    } catch (error) {
      console.error('Error in API handler:', error);
      return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }
  };
}
