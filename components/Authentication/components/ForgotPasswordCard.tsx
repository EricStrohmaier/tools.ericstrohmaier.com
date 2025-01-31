"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { requestResetPassword } from "@/utils/auth-helpers/server";
import AuthenticationCard from "./AuthenticationCard";

interface ForgotPasswordCardProps {
  disableButton?: boolean;
  redirectToURL?: string;
}

export default function ForgotPasswordCard({
  disableButton,
  redirectToURL,
}: ForgotPasswordCardProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestResetPassword, router);
    setIsSubmitting(false);
  };

  return (
    <AuthenticationCard
      title="Forgot Password"
      subtitle="Please enter your email address to receive a link to reset your password"
      allowOauth={false}
      redirectToURL={redirectToURL}
    >
      <form noValidate={true} onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <Input
              variant="login"
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <Button
            variant="login"
            type="submit"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Continue
          </Button>
          <Link
            href={redirectToURL ? `/signin?next=${redirectToURL}` : "/signin"}
            passHref
          >
            <Button variant="slim" type="button" className="w-full">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </AuthenticationCard>
  );
}
