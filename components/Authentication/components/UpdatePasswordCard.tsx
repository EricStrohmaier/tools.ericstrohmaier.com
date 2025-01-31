"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import the icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleRequest } from "@/utils/auth-helpers/client";
import { updatePassword } from "@/utils/auth-helpers/server";
import AuthenticationCard from "./AuthenticationCard";

interface UpdatePasswordCardProps {
  redirectToURL?: string;
  redirectMethod?: string;
  type?: string;
}

export default function UpdatePasswordCard({
  redirectToURL,
  redirectMethod,
  type,
}: UpdatePasswordCardProps) {
  const router = useRouter();
  const routerMethod = redirectMethod === "client" ? router : null;
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleRequest(e, updatePassword, routerMethod);
    setIsSubmitting(false);
  };

  const isSetPassword = type === "set_password";

  return (
    <AuthenticationCard
      title={isSetPassword ? "Set Password" : "Update Password"}
      subtitle={
        isSetPassword
          ? "Please set your new password to continue"
          : "Please enter your new password"
      }
      allowOauth={false}
    >
      <div className="my-8">
        <form
          noValidate={true}
          className="mb-4"
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label htmlFor="password">
                {isSetPassword ? "New Password" : "Password"}
              </label>
              <div className="relative">
                <Input
                  variant={"login"}
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 m-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <label htmlFor="passwordConfirm">
                {isSetPassword ? "Confirm New Password" : "Confirm Password"}
              </label>
              <div className="relative">
                <Input
                  variant={"login"}
                  id="passwordConfirm"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="passwordConfirm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 m-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <Button
              variant="login"
              type="submit"
              className="mt-1"
              loading={isSubmitting}
            >
              {isSetPassword ? "Set Password" : "Update Password"}
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
      </div>
    </AuthenticationCard>
  );
}
