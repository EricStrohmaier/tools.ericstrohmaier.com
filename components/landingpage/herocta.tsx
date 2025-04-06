"use client";

import { landingpageContent } from "@/config/landingpage";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { Submitbutton } from "../app/SubmitButtons";

import { toast } from "sonner";

export default function HeroCTA({
  content,
}: {
  content: typeof landingpageContent;
}) {
  const { actions, button } =
    "actions" in content.hero.cta
      ? content.hero.cta
      : { actions: null, button: null };
  const [isPending, startTransition] = useTransition();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    startTransition(async () => {
      try {
        toast.success("Email added to waitlist");
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };
  return (
    <div className="mt-10 flex items-center gap-y-4 gap-x-6 md:flex-row">
      {actions?.email.active && (
        <form onSubmit={handleEmailSubmit} className="flex space-x-2">
          <input
            id="email-address"
            name="email"
            type="email"
            required
            placeholder={actions.email.placeholder}
            autoComplete="email"
            className="placeholder-gray-400 md:min-w-[410px] w-full h-10 flex-auto rounded-md border-0 md:px-8 text-md py-4 md:py-8 focus:bg-white  shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white/10 text-sm md:text-lg leading-6"
          />
          <Submitbutton
            variant="landingpageCTA"
            size="lg"
            title={button.text}
            isPending={isPending}
          />
        </form>
      )}

      {actions?.links.howItWorks.active && (
        <>
          <Button variant="landingpageCTA" size="lg" asChild>
            <Link href={button.link}>{button.text}</Link>
          </Button>
          <Link
            href={actions.links.howItWorks.link}
            className="text-md md:text-xl font-semibold leading-6 text-text-500 flex items-center space-x-1 hover:text-text-600 transition duration-200"
          >
            {actions.links.howItWorks.text}
            <ChevronRightIcon
              className="h-5 w-5 md:h-8 md:w-8"
              aria-hidden="true"
            />
          </Link>
        </>
      )}
    </div>
  );
}
