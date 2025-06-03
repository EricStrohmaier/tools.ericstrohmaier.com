"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface InfoBannerProps {
  showOnlyWhenLoggedIn?: boolean;
  user: any;
}

export function InfoBanner({
  showOnlyWhenLoggedIn = false,
  user,
}: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Check localStorage on component mount
    const isBannerClosed = localStorage.getItem('infoBannerClosed') === 'true';
    if (isBannerClosed) {
      setIsVisible(false);
    }
  }, []);

  // If banner should only show for logged in users and user is not logged in, don't render
  if (showOnlyWhenLoggedIn && !user) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-accent/20 to-accent/10 dark:from-accent-foreground/20 dark:to-accent-foreground/10 border-b border-accent/10">
      <div className="w-full max-w-7xl mx-auto px-3 md:px-6 py-3 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="text-sm md:text-base font-medium">
            Our time tracker is now live! Track your time efficiently across all
            your projects.
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/80 py-3 px-3"
            asChild
          >
            <Link href="/tracker">View Time Tracker</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-accent-foreground hover:bg-gray-50 border-accent/20 py-3 px-3"
            asChild
          >
            <Link
              href={siteConfig.extensionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              Get Extension
              <ExternalLinkIcon className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <button
            onClick={() => {
              setIsVisible(false);
              localStorage.setItem('infoBannerClosed', 'true');
            }}
            className="p-1.5 rounded-full hover:bg-accent/30 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
