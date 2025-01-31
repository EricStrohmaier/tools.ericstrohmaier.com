import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { stripe } from "@/lib/stripe";

interface Props {
  searchParams: {
    session_id?: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const sessionId = searchParams?.session_id ?? "";
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  const customerDetails = checkoutSession?.customer_details;
  console.log("checkoutSession", checkoutSession);

  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Checkout session */}
        {/* <CheckoutSession customerDetails={customerDetails} /> */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild variant="default">
            <Link href="/">Back to Homepage</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`mailto:${siteConfig.supportEmail}`}>
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
