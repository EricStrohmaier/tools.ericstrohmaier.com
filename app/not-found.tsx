import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="">
      <div>
        <main className="w-full flex flex-col justify-between h-screen">
          <div className="flex-grow flex items-center justify-center flex-col text-center px-4 h-full">
            <h1 className="text-6xl font-bold text-gray-900">404</h1>
            <p className="text-xl font-semibold text-gray-700 mt-4">
              Oops! Page not found.
            </p>
            <p className="mt-2 text-gray-600">
              We can&apos;t seem to find the page you&apos;re looking for.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-primary text-white font-semibold py-2 px-4 rounded-lg "
            >
              Go Home
            </Link>
            <Button asChild variant={"outline"} className="mt-6">
              <Link href={`mailto:${siteConfig.supportEmail}`}>
                Contact Support{" "}
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
