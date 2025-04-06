"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ExtensionAuthHandlerProps {
  user: any;
  session: any;
}

export function ExtensionAuthHandler({ user, session }: ExtensionAuthHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExtension = searchParams.get("extension") === "true";

  useEffect(() => {
    // Only run this if we're in extension mode and have a user
    if (isExtension && user && session) {
      console.log("Extension auth detected, sending auth data to extension");
      
      // Send auth data to the content script
      window.postMessage({
        type: "AUTH_SUCCESS",
        data: {
          token: session.access_token,
          user: {
            id: user.id,
            email: user.email
          }
        }
      }, window.location.origin);
      
      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }, [isExtension, user, session, router]);

  if (isExtension && user) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
        <p className="text-green-700 font-medium">
          Authentication successful! Connecting to extension...
        </p>
      </div>
    );
  }

  return null;
}
