// supabase/functions/create-order/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY")!;
const MIDTRANS_BASE =
  Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { cart, contact } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Keranjang kosong" }), { status: 400, headers: CORS_HEADERS });
    }

    // 1. Cek stok tiap item
    for (const item of cart) {
      const { data: stockRow } = await supabase
        .from("stock")
        .select("stock_qty")
        .eq("app_id", item.app_id)
        .eq("variant_label", item.variant_label)
        .maybeSingle();
      if (stockRow && stockRow.stock_qty < item.qty) {
        return new Response(
          JSON.stringify({ error: `Stok ${item.app_name} - ${item.variant_label} tidak cukup` }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
    }

    const total = cart.reduce((s: number, i: any) => s + i.price * i.qty, 0);
    const midtransOrderId = `PMB-${Date.now()}`;

    // 2. Simpan order berstatus pending
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ total_amount: total, midtrans_order_id: midtransOrderId, customer_contact: contact ?? null })
      .select()
      .single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS_HEADERS });

    await supabase.from("order_items").insert(
      cart.map((i: any) => ({
        order_id: order.id,
        app_id: i.app_id,
        app_name: i.app_name,
        variant_label: i.variant_label,
        price: i.price,
        qty: i.qty,
      }))
    );

    // 3. Minta Snap token ke Midtrans
    const midtransRes = await fetch(MIDTRANS_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(MIDTRANS_SERVER_KEY + ":"),
      },
      body: JSON.stringify({
        transaction_details: { order_id: midtransOrderId, gross_amount: total },
        item_details: cart.map((i: any) => ({
          id: `${i.app_id}-${i.variant_label}`,
          price: i.price,
          quantity: i.qty,
          name: `${i.app_name} - ${i.variant_label}`.slice(0, 50),
        })),
      }),
    });
    const midtransData = await midtransRes.json();
    if (!midtransRes.ok) {
      return new Response(JSON.stringify({ error: midtransData }), { status: 500, headers: CORS_HEADERS });
    }

    return new Response(
      JSON.stringify({ order_id: order.id, snap_token: midtransData.token, redirect_url: midtransData.redirect_url }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CORS_HEADERS });
  }
});
