"use client";

import React, { useEffect, useRef } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { landingpageContent } from "@/config/landingpage";
import { UserNav } from "../app/UserNav";
import { User } from "@/types/supabase";

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <PopoverButton as={Link} href={href} className="block py-2">
        {children}
      </PopoverButton>
    </li>
  );
}

function MobileNavigation(
  props: React.ComponentPropsWithoutRef<typeof Popover>
) {
  // Filter the active links
  const activeLinks = landingpageContent.header.NavAndFooterLinks.filter(
    (link) => link.active
  );

  // Return null if there are no active links
  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <Popover {...props}>
      <PopoverButton className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
        Menu
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black/80"
      />
      <PopoverPanel
        focus
        transition
        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-900 dark:ring-zinc-800"
      >
        <div className="flex flex-row-reverse items-center justify-between">
          <PopoverButton aria-label="Close menu" className="-m-1 p-1">
            <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </PopoverButton>
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Navigation
          </h2>
        </div>
        <nav className="mt-6">
          <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
            {activeLinks.map((link) => (
              <MobileNavItem key={link.text} href={link.href}>
                {link.text}
              </MobileNavItem>
            ))}
          </ul>
        </nav>
      </PopoverPanel>
    </Popover>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  let isActive = usePathname() === href;

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "relative block px-3 py-2 transition whitespace-nowrap",
          isActive
            ? "text-accent-400 dark:text-accent-400"
            : "hover:text-accent dark:hover:text-accent-400"
        )}
      >
        <span className="inline-block">{children}</span>
        {isActive && (
          <span className="absolute -inset-x-[10.5px] -bottom-[2px] h-[2.5px] bg-gradient-to-r from-accent-500/0 via-accent-500/40 to-accent-500/0 dark:from-accent-400/0 dark:via-accent-400/40 dark:to-accent-400/0" />
        )}
      </Link>
    </li>
  );
}

function DesktopNavigation(props: React.ComponentPropsWithoutRef<"nav">) {
  const activeLinks = landingpageContent.header.NavAndFooterLinks.filter(
    (link) => link.active
  );
  // Return null if there are no active links
  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <nav {...props}>
      <ul className="h-11 flex rounded-full bg-white/90 px-5 text-md lg:text-lg font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        {activeLinks.map((link) => (
          <NavItem key={link.text} href={link.href}>
            {link.text}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
}

function clamp(number: number, a: number, b: number) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}

function AvatarContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        className,
        "h-10 w-10 rounded-full bg-white/90 p-0.5 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:ring-white/10"
      )}
      {...props}
    />
  );
}

function Avatar({
  large = false,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
  large?: boolean;
}) {
  return (
    <Link
      href={landingpageContent.header.company.logoHref || "/"}
      aria-label="Home"
      className={clsx(className, "pointer-events-auto")}
      {...props}
    >
      <Image
        src={landingpageContent.header.company.logo}
        alt=""
        sizes={large ? "4rem" : "2.25rem"}
        className={clsx(
          "rounded-full bg-zinc-100 object-cover dark:bg-zinc-800",
          large ? "h-16 w-16" : "h-9 w-9"
        )}
        priority
      />
    </Link>
  );
}

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  let isHomePage = pathname === "/";

  // Setup refs
  let headerRef = useRef<React.ElementRef<"div">>(null);
  let avatarRef = useRef<React.ElementRef<"div">>(null);
  let isInitial = useRef(true);

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0;

    function setProperty(property: string, value: string) {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return;
      }

      let { height } = headerRef.current.getBoundingClientRect();
      let scrollY = window.scrollY;

      setProperty("--content-offset", `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty("--header-height", `${downDelay + height}px`);
        setProperty("--header-mb", `${-downDelay}px`);
      } else {
        setProperty("--header-height", `${height}px`);
        setProperty("--header-mb", `0px`);
      }

      if (scrollY >= downDelay) {
        setProperty("--header-position", "fixed");
        setProperty("--header-inner-position", "fixed");
        setProperty("--header-top", "0px");
        setProperty("--avatar-top", "0px");
      } else {
        setProperty("--header-position", "sticky");
        removeProperty("--header-inner-position");
        setProperty("--header-top", "0px");
        setProperty("--avatar-top", "0px");
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return;
      }

      let fromScale = 1;
      let toScale = 36 / 64;
      let fromX = 0;
      let toX = 2 / 16;

      let scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        "--avatar-image-transform",
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      );

      let borderScale = 1 / (toScale / scale);
      let borderX = (-toX + x) * borderScale;
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty("--avatar-border-transform", borderTransform);
      setProperty("--avatar-border-opacity", scale === toScale ? "1" : "0");
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener("scroll", updateStyles, { passive: true });
    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("scroll", updateStyles);
      window.removeEventListener("resize", updateStyles);
    };
  }, [isHomePage]);

  // Hide header on /today route
  if (pathname === "/today" || pathname === "/week") {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-3 md:px-6  pt-3 md:pt-6  space-y-4 md:space-y-6">
        <div className="relative flex gap-4">
          <div className="flex flex-1">
            <Link href={landingpageContent.header.company.logoHref || "/"}>
              <Image
                src={landingpageContent.header.company.logo}
                alt={`${landingpageContent.header.company.name} logo`}
                className="md:h-20 md:w-20 h-11 w-11 bg-transparent cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex flex-1 justify-end md:justify-center">
            <MobileNavigation className="pointer-events-auto md:hidden" />
            <DesktopNavigation className="pointer-events-auto hidden md:block" />
          </div>
          <div className="flex justify-end md:flex-1">
            {user ? (
              <UserNav user={user} />
            ) : (
              landingpageContent.header.button.active && (
                <Button asChild variant="landingpageCTA" size="lg">
                  <Link href={landingpageContent.header.button.href}>
                    {landingpageContent.header.button.text}
                  </Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
