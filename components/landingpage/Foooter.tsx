"use client";

import { siteConfig } from "@/config/site";
import { landingpageContent } from "@/config/landingpage";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const { main, legal, products } = landingpageContent.footer.links;

  // Hide footer on /today route
  if (pathname === "/today" || pathname === "/week") {
    return null;
  }

  return (
    <footer className="border-t bg-background my-10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start">
          {/* Left side - Logo and info */}
          <div className="mb-8 lg:mb-0 lg:w-1/4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={landingpageContent.header.company.logo}
                alt={landingpageContent.header.company.name}
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="text-sm font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>

          {/* Right side - Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex lg:flex-1 lg:justify-end lg:space-x-24">
            <div>
              <h3 className="text-sm font-semibold">LINKS</h3>
              <ul className="mt-4 space-y-3">
                {main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">LEGAL</h3>
              <ul className="mt-4 space-y-3">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold">MORE FROM THE MAKER</h3>
              <ul className="mt-4 space-y-3">
                {products.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      target={item.target}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
