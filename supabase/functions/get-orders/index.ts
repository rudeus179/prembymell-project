// supabase/functions/get-orders/index.ts
// Riwayat pesanan pembeli, dicari berdasarkan nomor WhatsApp yang dipakai saat checkout.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

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
    const { contact } = await req.json();
    if (!contact || typeof contact !== "string") {
      return new Response(JSON.stringify({ error: "Nomor WhatsApp diperlukan" }), { status: 400, headers: CORS_HEADERS });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("customer_contact", contact)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: CORS_HEADERS });

    return new Response(JSON.stringify({ orders }), { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: CORS_HEADERS });
  }
});
