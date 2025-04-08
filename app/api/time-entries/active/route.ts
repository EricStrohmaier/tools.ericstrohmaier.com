import { NextResponse, NextRequest } from "next/server";
import { getTimeEntries, getUser } from "@/app/actions";
import { corsMiddleware } from "@/app/api/cors";

export async function OPTIONS(request: NextRequest) {
  return corsMiddleware(request);
}

export async function GET(request: NextRequest) {
  // Handle preflight OPTIONS request via the OPTIONS function
  if (request.method === 'OPTIONS') {
    return corsMiddleware(request);
  }
  try {
    const user = await getUser();
    
    if (!user) {
      const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      return response;
    }
    
    // Get all time entries and find the active one (no end_time)
    const timeEntries = await getTimeEntries();
    const activeTimeEntry = timeEntries.find(entry => !entry.end_time);
    
    if (!activeTimeEntry) {
      const response = NextResponse.json(null);
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      return response;
    }
    
    const response = NextResponse.json(activeTimeEntry);
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      return response;
  } catch (error) {
    console.error("Error getting active time entry:", error);
    const response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
      
      // Add CORS headers
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      
      return response;
  }
}
