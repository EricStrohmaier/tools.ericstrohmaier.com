import { NextResponse, NextRequest } from "next/server";
import { createCustomerPortal } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // User who are not logged in can't make a purchase
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view billing information." },
        { status: 401 }
      );
    } else if (!body.returnUrl) {
      return NextResponse.json(
        { error: "Return URL is required" },
        { status: 400 }
      );
    }

    const supabaseAdmi = supabaseAdmin();

    const { data } = await supabaseAdmi
      .from("users")
      .select("*")
      .eq("id", user?.id)
      .single();
    // @ts-ignore
    if (!data?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 }
      );
    }

    const stripePortalUrl = await createCustomerPortal({
      // @ts-ignore
      customerId: data.stripe_customer_id,
      returnUrl: body.returnUrl,
    });

    return NextResponse.json({
      url: stripePortalUrl,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
