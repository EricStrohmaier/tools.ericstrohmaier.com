"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ExtensionAuthSuccess() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    console.log("Extension auth success page loaded");

    // First fetch the session data
    const fetchSessionAndNotifyExtension = async () => {
      try {
        console.log("Fetching session data from API");
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`);
        }

        const data = await response.json();
        console.log("Session data received:", data);

        if (!data.session) {
          throw new Error("No session data available");
        }

        // Now send the session data to the extension
        sendAuthDataToExtension(data);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching session:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    };

    // Function to send auth data to the extension
    const sendAuthDataToExtension = (data: any) => {
      // Format exactly as the extension expects
      const authData = {
        type: "AUTH_SUCCESS",
        token: data.session.access_token,
        user: data.user || data.session.user,
      };

      console.log("Sending auth data to extension:", authData);

      // Method 1: postMessage to opener (if opened as popup)
      if (window.opener) {
        console.log("Sending postMessage to opener");
        window.opener.postMessage(authData, "*");
      }

      // Method 2: Broadcast to all potential listeners
      try {
        console.log("Broadcasting message to window");
        window.postMessage(authData, "*");
      } catch (error) {
        console.log("Broadcast error:", error);
      }
    };

    // Start the process
    fetchSessionAndNotifyExtension();

    // Set up auto-close timer (disabled for debugging)
    const closeTimer = setTimeout(() => {
      console.log("Auto-close timer expired");
      if (status === "success") {
        window.close();
      }
    }, 5000);

    return () => {
      clearTimeout(closeTimer);
    };
  }, [status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Connecting to Extension..."}
            {status === "success" && "Authentication Successful"}
            {status === "error" && "Authentication Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {status === "loading" && (
              <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === "error" && (
              <AlertCircle className="h-16 w-16 text-red-500" />
            )}
          </div>

          {status === "loading" && (
            <p className="text-center text-muted-foreground">
              Connecting to the extension...
            </p>
          )}

          {status === "success" && (
            <p className="text-center text-muted-foreground">
              You have successfully signed in. You can now close this window and
              return to the extension.
            </p>
          )}

          {status === "error" && (
            <p className="text-center text-red-500">
              {errorMessage ||
                "Failed to connect to the extension. Please try again."}
            </p>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {status === "success"
                ? "This window will close automatically in a few seconds."
                : ""}
            </p>
            <Button onClick={() => window.close()}>Close Window</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
