import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/utils/supabase/admin";

const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

// This is where we receive Stripe webhook events
// It used to update the user data, send emails, etc...
// By default, it'll store the user in the database
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  // Create a private supabase client using the secret service_role API key
  const supabase = supabaseAdmin();

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;
  console.log("Event type:", eventType);

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;
        // get metadata
        const metadata = stripeObject.metadata;
        const userId = metadata?.user_id;
        const workspaceId = metadata?.workspace_id;

        console.log("stripeObject", stripeObject);

        // Update the profile where id equals the userId (in table called 'profiles') and update the customer_id, price_id, and has_access (provisioning)

        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            stripe_id: stripeObject.customer as string,
          })
          .eq("id", userId!);

        if (userUpdateError) {
          console.error("Error updating user:", userUpdateError);
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, by you can send an email to the user to remind him to complete the transaction, for instance
        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
        // Unhandled event type
        console.log("Unhandled event type", eventType);
    }
  } catch (e: any) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
