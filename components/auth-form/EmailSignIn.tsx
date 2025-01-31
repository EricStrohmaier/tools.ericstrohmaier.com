"use client";

import Link from "next/link";
import {
  signInWithPassword,
  signInWithEmail,
} from "@/utils/auth-helpers/server";
import {
  handleEmailRequest,
  handleRequest,
  isValidEmail,
} from "@/utils/auth-helpers/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Separator from "@/components/auth-form/Seperator";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

interface EmailSignInProps {
  redirectMethod: string;
  disableButton?: boolean;
  searchParamsEmail?: string;
  viewProp?: "password" | "email";
}

export default function EmailSignIn({
  redirectMethod,
  disableButton,
  searchParamsEmail,
  viewProp,
}: EmailSignInProps) {
  const router = useRouter();
  const routerMethod = redirectMethod === "client" ? router : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(searchParamsEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"email" | "password">(viewProp || "email");

  useEffect(() => {
    if (searchParamsEmail) {
      setEmail(searchParamsEmail);
    }
    if (viewProp) {
      setView(viewProp);
    }
  }, [searchParamsEmail, viewProp]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleRequest(
      e,
      signInWithPassword as (
        formData: FormData | { [key: string]: string },
        hostname: string,
        signuptype?: string
      ) => Promise<string>,
      routerMethod
    );
    setIsSubmitting(false);
  };

  const handleContinue = () => {
    if (isValidEmail(email)) {
      router.push(`/signin/password_signin?email=${encodeURIComponent(email)}`);
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  const handleSendCode = async () => {
    if (isValidEmail(email) && email !== "") {
      setIsSubmitting(true);

      await handleEmailRequest(email, signInWithEmail, routerMethod);

      setIsSubmitting(false);
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  return (
    <div className="my-4">
      <form noValidate={true} className="mb-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="Your email address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-zinc-700 focus:border-transparent"
            />
          </div>

          {view === "password" && (
            <div className="grid gap-1 mt-2">
              <div className="flex justify-between">
                <label htmlFor="password">Password</label>
                <p className="">
                  <Link
                    href="/signin/forgot_password"
                    className="text-stone-500 hover:underline text-sm"
                  >
                    Forgot your password?
                  </Link>
                </p>
              </div>
              <div className="relative">
                <input
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
          )}

          <Button
            size="login"
            variant="login"
            type={view === "password" ? "submit" : "button"}
            className="mt-1"
            onClick={view === "email" ? handleContinue : undefined}
            loading={isSubmitting}
            disabled={disableButton}
          >
            {view === "email" ? "Continue" : "Sign In"}
          </Button>

          {view === "password" && (
            <>
              <Separator text="OR" />
              <Button
                variant="slim"
                type="button"
                className="mt-1"
                onClick={handleSendCode}
                disabled={disableButton || isSubmitting}
              >
                Email Sign In Code
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
