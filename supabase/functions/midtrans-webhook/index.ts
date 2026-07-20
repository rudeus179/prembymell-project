// supabase/functions/midtrans-webhook/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY")!;

async function sha512Hex(text: string) {
  const buf = await crypto.subtle.digest("SHA-512", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  try {
    const body = await req.json();
    const { order_id, status_code, gross_amount, signature_key, transaction_status, payment_type } = body;

    // 1. Verifikasi signature biar notifikasi nggak dipalsuin orang lain
    const expected = await sha512Hex(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY);
    if (expected !== signature_key) {
      return new Response("Invalid signature", { status: 403 });
    }

    let newStatus = "pending";
    if (["capture", "settlement"].includes(transaction_status)) newStatus = "paid";
    else if (["expire", "cancel", "deny"].includes(transaction_status)) newStatus = "failed";

    const { data: order } = await supabase
      .from("orders")
      .update({ status: newStatus, payment_type })
      .eq("midtrans_order_id", order_id)
      .select("*, order_items(*)")
      .single();

    // 2. Kalau baru lunas: potong stok + otomatis kirim akun (kalau ada stok kredensial siap)
    if (newStatus === "paid" && order) {
      for (const item of order.order_items) {
        await supabase.rpc("decrement_stock", {
          p_app_id: item.app_id,
          p_variant_label: item.variant_label,
          p_qty: item.qty,
        });

        // Ambil 1 kredensial siap kirim per item order
        const { data: content } = await supabase.rpc("claim_credential", {
          p_app_id: item.app_id,
          p_variant_label: item.variant_label,
          p_order_item_id: item.id,
        });

        if (content) {
          await supabase.from("order_items").update({ delivered_content: content }).eq("id", item.id);
        }
      }
    }

    return new Response("OK");
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
