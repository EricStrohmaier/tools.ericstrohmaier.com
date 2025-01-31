"use client";

import { createClient } from "@/utils/supabase/client";
import { type Provider } from "@supabase/supabase-js";
import { getURL } from "@/utils/helpers";
import { redirectToPath } from "./server";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (
    formData: FormData,
    hostname: string,
    signuptype?: string
  ) => Promise<string>,
  router: AppRouterInstance | null = null,
  signuptype?: string
): Promise<boolean | void> {
  // Prevent default form submission refresh
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const hostname = window.location.hostname; // Get hostname from client-side
  const redirectUrl: string = await requestFunc(formData, hostname, signuptype);

  if (router) {
    // If client-side router is provided, use it to redirect
    return router.push(redirectUrl);
  } else {
    // Otherwise, redirect server-side
    return await redirectToPath(redirectUrl);
  }
}

export async function handleEmailRequest(
  email: string,
  requestFunc: (formData: FormData, hostname: string) => Promise<string>,
  router: AppRouterInstance | null = null
): Promise<boolean | void> {
  // Create FormData and append the email
  const formData = new FormData();
  formData.append("email", email);

  // Get hostname
  const hostname = window.location.hostname;

  // Send the request
  const redirectUrl: string = await requestFunc(formData, hostname);

  // Handle redirection based on client or server
  if (router) {
    return router.push(redirectUrl);
  } else {
    return await redirectToPath(redirectUrl);
  }
}

export async function signInWithOAuth(
  e: React.FormEvent<HTMLFormElement>,
  signuptype?: string
) {
  // Prevent default form submission refresh
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const provider = String(formData.get("provider")).trim() as Provider;

  // Create client-side supabase client and call signInWithOAuth
  const supabase = createClient();
  const redirectURL = getURL("/api/auth/callback");
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      queryParams: signuptype ? { signuptype: signuptype } : {},
      redirectTo: redirectURL,
    },
  });
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
