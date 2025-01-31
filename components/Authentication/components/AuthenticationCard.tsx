"use client";

import { type Provider } from "@supabase/supabase-js";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { signInWithOAuth } from "@/utils/auth-helpers/client";
import Separator from "./Separator";
import GoogleIcon from "@/components/app/icons/google";

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export default function AuthenticationCard({
  title,
  subtitle,
  allowOauth,
  redirectToURL,
  children,
}: {
  title: string;
  subtitle: string;
  allowOauth: boolean;
  redirectToURL?: string;
  children: React.ReactNode;
}) {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: "google",
      displayName: "Continue with Google",
      icon: <GoogleIcon className="w-6 h-6" />,
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e, redirectToURL);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[91vh] bg-background px-2 md:px-0 py-6">
      <div className="space-y-1 mb-4 pb-4">
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>

        <CardDescription className="text-sm text-center text-gray-500">
          {subtitle}
        </CardDescription>
      </div>
      <Card className="w-full max-w-md p-6 md:p-8">
        <CardContent className="space-y-4">{children}</CardContent>
        {allowOauth && (
          <>
            <Separator text="OR" />
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
                    className="w-full "
                    loading={isSubmitting}
                  >
                    <span className="mr-2">{provider.icon}</span>
                    <span>{provider.displayName}</span>
                  </Button>
                </form>
              ))}
              {
                <Button variant="slim" className="w-full">
                  <MailIcon className="w-5 h-5 mr-2" />
                  <Link href={`/email_code?next=${redirectToURL}`}>
                    Continue with email code
                  </Link>
                </Button>
              }
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
