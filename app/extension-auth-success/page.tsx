"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ExtensionAuthSuccess() {
  useEffect(() => {
    console.log("Extension auth success page loaded");
    
    // Function to send success message
    const sendSuccessMessage = () => {
      // Try multiple communication methods
      
      // Method 1: postMessage to opener (if opened as popup)
      if (window.opener) {
        console.log("Sending postMessage to opener");
        // Send to any origin to ensure it works across HTTP/HTTPS
        window.opener.postMessage({ type: "AUTH_SUCCESS" }, "*");
      }
      
      // Method 2: Try chrome extension API
      try {
        if (typeof window !== "undefined" && "chrome" in window && window.chrome) {
          console.log("Attempting to use chrome.runtime.sendMessage");
          // @ts-ignore - Chrome extension API might not be recognized by TypeScript
          window.chrome.runtime.sendMessage({ type: "AUTH_SUCCESS" }, (response) => {
            console.log("Chrome runtime message response:", response);
          });
        }
      } catch (error) {
        console.log("Chrome API error:", error);
      }
      
      // Method 3: Broadcast to all potential listeners
      try {
        console.log("Broadcasting message to window");
        window.postMessage({ type: "AUTH_SUCCESS", source: "tools_auth_page" }, "*");
      } catch (error) {
        console.log("Broadcast error:", error);
      }
    };
    
    // Send message immediately
    sendSuccessMessage();
    
    // And also send after a short delay to ensure page is fully loaded
    const messageTimer = setTimeout(sendSuccessMessage, 500);
    
    // Set up auto-close timer
    const closeTimer = setTimeout(() => {
      console.log("Auto-closing window");
      window.close();
    }, 3000);
    
    return () => {
      clearTimeout(messageTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Authentication Successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <p className="text-center text-muted-foreground">
            You have successfully signed in. You can now close this window and
            return to the extension.
          </p>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              This window will close automatically in a few seconds.
            </p>
            <Button onClick={() => window.close()}>Close Window</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
