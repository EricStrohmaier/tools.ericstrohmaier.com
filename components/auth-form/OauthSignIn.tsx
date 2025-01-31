"use client";

import { signInWithOAuth } from "@/utils/auth-helpers/client";
import { type Provider } from "@supabase/supabase-js";

import { useState } from "react";
import { Button } from "@/components/ui/button";

import GoogleIcon from "../app/icons/google";
import { ContinueWithEmailCode } from "./EmailCode";

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export default function OauthSignIn({
  viewProp,
  signuptype,
}: {
  viewProp: string;
  signuptype?: string;
}) {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: "google",
      displayName: "Continue with Google",
      icon: <GoogleIcon className="w-6 h-6" />,
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          className="pb-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="slim"
            type="submit"
            className="w-full font-semibold"
            loading={isSubmitting}
          >
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
      {viewProp === "signup" && <ContinueWithEmailCode />}
    </div>
  );
}
