"use client";

import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { MobileMenu } from "./MobileMenu";
import { UserNav } from "./UserNav";
import logo from "@/public/icon.png";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  if (pathname.startsWith("/static")) return null;

  return (
    <nav className="relative max-w-7xl w-full flex items-center mx-auto my-5 ">
      <div className="bg-white rounded-3xl shadow-lg w-full flex md:grid md:grid-cols-12 items-center px-4 md:px-8 mx-auto py-5 ">
        <div className="md:col-span-3">
          <Link href="/">
            <Image
              src={logo}
              alt="company logo"
              className="h-10 w-10 bg-background rounded-full cursor-pointer"
            />
          </Link>
        </div>

        <NavbarLinks />

        <div className="flex items-center gap-x-2 ms-auto md:col-span-3">
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex items-center gap-x-2">
              <Button variant="secondary" asChild>
                <Link href={"/signin"}>Login</Link>
              </Button>
            </div>
          )}

          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
