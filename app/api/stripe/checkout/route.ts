import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  function formatDateForInput(dateString: string) {
    return dateString ? new Date(dateString).toLocaleDateString("de-DE") : "";
  }

  // Parse the JSON body
  const cartDetails = await request.json();
  console.log("Received cart details:", cartDetails);

  const {
    totalReservationFee,
    reservationIds,
    productToReservationMap,
    ...products
  } = cartDetails;

  console.log("Extracted reservation data:", {
    totalReservationFee,
    reservationIds,
    productToReservationMap,
  });

  const lineItems = [];
  const productIds = [];

  // Loop through the products to create line items
  for (const productId in products) {
    const product = products[productId];
    console.log("Processing product:", product);

    lineItems.push({
      price_data: {
        currency: product.currency,
        product_data: {
          name: `Reservation Fee for ${product.name} (Total due upon pickup at shop).`,
          description: `This reservation fee secures your surfboard from \n${formatDateForInput(
            product.startDate
          )} to ${formatDateForInput(
            product.endDate
          )}. \nThe remaining balance is due upon pickup at our shop located at ${
            product.shop_location
          }.`,
          images: [product.images[0]],
        },
        unit_amount: 500,
      },
      quantity: product.quantity,
    });

    // Collect product IDs
    productIds.push(product.id);
  }

  console.log("Created line items:", lineItems);
  console.log("Collected product IDs:", productIds);

  // Create the checkout session with the line items
  const origin = request.headers.get("origin");
  console.log("Origin:", origin);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    billing_address_collection: "auto",
    success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutes
    metadata: {
      product_ids: JSON.stringify(productIds),
      reservation_ids: JSON.stringify(reservationIds),
      product_to_reservation_map: JSON.stringify(productToReservationMap),
    },
  });

  console.log("Created Stripe session:", session);

  return NextResponse.json(session);
}
