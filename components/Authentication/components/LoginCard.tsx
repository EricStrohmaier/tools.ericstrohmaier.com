"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signInWithPassword } from "@/utils/auth-helpers/server";
import AuthenticationCard from "./AuthenticationCard";

interface LoginCardProps {
  redirectMethod: string;
  disableButton?: boolean;
  searchParamsEmail?: string;
  allowOauth: boolean;
  redirectToURL?: string;
}

export default function LoginCard({
  redirectMethod,
  disableButton,
  searchParamsEmail,
  allowOauth,
  redirectToURL,
}: LoginCardProps) {
  const router = useRouter();
  const routerMethod = redirectMethod === "client" ? router : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(searchParamsEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("handleRequest redirectTo", redirectToURL);
    await handleRequest(e, signInWithPassword, routerMethod, redirectToURL);
    setIsSubmitting(false);
  };

  return (
    <>
      <AuthenticationCard
        title="Welcome back"
        subtitle="Log in to your account"
        allowOauth={allowOauth}
        redirectToURL={redirectToURL}
      >
        <form noValidate={true} className="mb-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label htmlFor="email">Email</label>
              <Input
                variant={"login"}
                id="email"
                placeholder="Your email address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none"
                autoComplete="email"
              />
            </div>

            <div className="grid gap-1 mt-2">
              <div className="flex justify-between">
                <label htmlFor="password">Password</label>
                <p className="">
                  <Link
                    href={`/forgot_password${
                      redirectToURL
                        ? `?next=${encodeURIComponent(redirectToURL)}`
                        : ""
                    }`}
                    className="text-stone-500 hover:underline text-sm"
                  >
                    Forgot your password?
                  </Link>
                </p>
              </div>
              <div className="relative">
                <Input
                  variant={"login"}
                  id="password"
                  placeholder="Your password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              size="login"
              variant="login"
              type="submit"
              className="mt-1"
              loading={isSubmitting}
              disabled={disableButton}
            >
              Log in
            </Button>
          </div>
          <p className="text-sm mt-4 font-normal text-center text-stone-500">
            Don&apos;t have an account?{" "}
            <Link
              href={redirectToURL ? `/signup?next=${redirectToURL}` : "/signup"}
              className="underline text-brandedLinkColor"
            >
              Sign up
            </Link>
          </p>
        </form>
      </AuthenticationCard>
    </>
  );
}
