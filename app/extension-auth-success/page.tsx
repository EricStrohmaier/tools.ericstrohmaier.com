"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function ExtensionAuthSuccess() {
  useEffect(() => {
    // Send a message to the Chrome extension that authentication was successful
    if (window.opener) {
      // If opened in a popup by the extension
      window.opener.postMessage({ type: "AUTH_SUCCESS" }, "*");
      // Close the popup after sending the message
      setTimeout(() => window.close(), 2000);
    } else {
      // If not in a popup, try to communicate with the extension directly
      try {
        // Only access chrome API if it exists in the window object
        if (
          typeof window !== "undefined" &&
          "chrome" in window &&
          window.chrome
        ) {
          // @ts-ignore - Chrome extension API might not be recognized by TypeScript
          window.chrome.runtime.sendMessage({ type: "AUTH_SUCCESS" });
        }
      } catch (error) {
        // Chrome API not available, this is expected when not in extension context
        console.log("Not in extension context, cannot use chrome API");
      }
    }
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
