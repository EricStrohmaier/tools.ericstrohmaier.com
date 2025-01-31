"use client";

import React, { useTransition } from "react";
import { Submitbutton } from "../app/SubmitButtons";
import { toast } from "sonner";

import { landingpageContent } from "@/config/landingpage";
import { insertWaitlistEmail } from "@/app/actions";

export default function EmailForm() {
  const [isPending, startTransition] = useTransition();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    startTransition(async () => {
      try {
        const data = await insertWaitlistEmail(email);
        if (data && data.error) {
          toast.error(data.error);
        } else {
          toast.success("Email added to waitlist");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleEmailSubmit}
      className="mx-auto mt-10 flex max-w-2xl gap-x-4 z-50"
    >
      <label htmlFor="email-address" className="sr-only">
        Email address
      </label>
      <input
        id="email-address"
        name="email"
        type="email"
        required
        placeholder={landingpageContent.emailSignUp.placeholder}
        autoComplete="email"
        className="placeholder-gray-400 md:min-w-[410px] w-full h-10 flex-auto rounded-md border-0 md:px-8 text-md py-4 md:py-8 focus:bg-white  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/10 text-sm md:text-lg leading-6"
      />

      <Submitbutton
        variant="landingpageCTA"
        size="lg"
        title={landingpageContent.emailSignUp.buttonText}
        isPending={isPending}
      />
    </form>
  );
}
