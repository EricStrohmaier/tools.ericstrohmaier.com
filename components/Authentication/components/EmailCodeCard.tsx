"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { signInWithEmailCode } from "@/utils/auth-helpers/server";
import AuthenticationCard from "./AuthenticationCard";

interface EmailCodeCardProps {
  redirectMethod: string;
  disableButton?: boolean;
  redirectTo?: string;
}

export default function EmailCodeCard({
  redirectMethod,
  disableButton,
  redirectTo,
}: EmailCodeCardProps) {
  const router = useRouter();

  const routerMethod = redirectMethod === "client" ? router : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithEmailCode, routerMethod, redirectTo);
    setIsSubmitting(false);
  };

  return (
    <AuthenticationCard
      title="Email Verification"
      subtitle="Please enter the code sent to your email address"
      allowOauth={false}
    >
      <form
        noValidate={true}
        className="mb-4"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <Input
              variant={"login"}
              id="email"
              placeholder="Your email address"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <Button
            size="login"
            variant="login"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send email code
          </Button>
        </div>
      </form>
    </AuthenticationCard>
  );
}
