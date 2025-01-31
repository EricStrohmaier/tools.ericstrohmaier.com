"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signUp } from "@/utils/auth-helpers/server";
import AuthenticationCard from "./AuthenticationCard";

interface SignUpCardProps {
  allowOauth: boolean;
  redirectMethod: string;
  redirectToURL?: string;
}

export default function SignUpCard({
  allowOauth,
  redirectMethod,
  redirectToURL,
}: SignUpCardProps) {
  const router = useRouter();
  const routerMethod = redirectMethod === "client" ? router : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, routerMethod, redirectToURL);
    setIsSubmitting(false);
  };

  return (
    <AuthenticationCard
      title="Sign Up"
      subtitle="Join us today!"
      allowOauth={allowOauth}
      redirectToURL={redirectToURL}
    >
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <Input
              variant="login"
              id="email"
              placeholder="Your email address"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
            <label htmlFor="password">Password</label>
            <Input
              variant="login"
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </div>
          <Button
            size="login"
            variant="login"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
          >
            Continue
          </Button>
          <p className="text-sm mt-4 font-normal text-center text-stone-500">
            Already have an account?{" "}
            <Link
              href={redirectToURL ? `/signin?next=${redirectToURL}` : "/signin"}
              className="underline text-brandedLinkColor"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </AuthenticationCard>
  );
}
