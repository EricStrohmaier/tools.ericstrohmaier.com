"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoBannerProps {
  showOnlyWhenLoggedIn?: boolean;
  user: any;
}

export function InfoBanner({
  showOnlyWhenLoggedIn = false,
  user,
}: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // If banner should only show for logged in users and user is not logged in, don't render
  if (showOnlyWhenLoggedIn && !user) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="w-full bg-accent/20 dark:bg-accent-foreground/10">
        <div className="w-full max-w-7xl mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 mx-auto">
            <span className="text-sm md:text-base font-medium">
              Track your time efficiently with our Chrome extension!
            </span>
            <Button
              variant="outline"
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/80 hidden sm:inline-flex py-3 px-2"
              asChild
            >
              <Link
                href="https://chrome.google.com/webstore/detail/your-extension-id"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Extension
                <ExternalLinkIcon className="inline-block ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-accent/30 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="w-full bg-accent/10 dark:bg-accent-foreground/10">
        <div className="w-full max-w-7xl mx-auto px-3 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2 mx-auto">
            <span className="text-sm md:text-base font-medium">
              Our Time tracker is now live check it out!
            </span>
            <Button
              variant="outline"
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/80 hidden sm:inline-flex py-3 px-2"
              asChild
            >
              <Link href="/dashboard" target="_blank" rel="noopener noreferrer">
                Go to Dashboard
              </Link>
            </Button>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-accent/30 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
