import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const { items, successUrl, cancelUrl } = await req.json();

    // items: [{ name, amount (in paise), quantity, type, rentalDays? }]
    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    // Try to get authenticated user email (optional - supports guest checkout)
    let customerEmail: string | undefined;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      customerEmail = data.user?.email ?? undefined;
    }

    // Build line items using price_data for dynamic cart items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: item.type === "RENTAL"
            ? `Rental for ${item.rentalDays} day(s)`
            : "Purchase",
        },
        unit_amount: Math.round(item.amount), // amount in paise
      },
      quantity: item.quantity,
    }));

    // Add security deposits for rental items
    const depositItems = items
      .filter((item: any) => item.type === "RENTAL" && item.deposit > 0)
      .map((item: any) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: `Security Deposit — ${item.name}`,
            description: "Refundable upon return in good condition",
          },
          unit_amount: Math.round(item.deposit),
        },
        quantity: item.quantity,
      }));

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
      line_items: [...lineItems, ...depositItems],
      mode: "payment",
      success_url: successUrl || `${req.headers.get("origin")}/payment-success`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/checkout`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
