// supabase/functions/admin/index.ts
// Satu endpoint buat semua aksi admin (dilindungi password, dikirim di tiap request).
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const { password, action, payload } = body;

    if (password !== ADMIN_PASSWORD) {
      return json({ error: "Password salah" }, 401);
    }

    switch (action) {
      case "login": {
        return json({ ok: true });
      }

      case "list_orders": {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false })
          .limit(100);
        if (error) return json({ error: error.message }, 500);
        return json({ orders: data });
      }

      case "list_stock": {
        const { data, error } = await supabase.from("stock").select("*").order("app_id");
        if (error) return json({ error: error.message }, 500);
        return json({ stock: data });
      }

      case "upsert_stock": {
        const { app_id, variant_label, stock_qty } = payload;
        const { error } = await supabase
          .from("stock")
          .upsert({ app_id, variant_label, stock_qty }, { onConflict: "app_id,variant_label" });
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      }

      case "list_credentials": {
        const { app_id, variant_label } = payload || {};
        let q = supabase.from("credentials").select("*").order("created_at", { ascending: false }).limit(200);
        if (app_id) q = q.eq("app_id", app_id);
        if (variant_label) q = q.eq("variant_label", variant_label);
        const { data, error } = await q;
        if (error) return json({ error: error.message }, 500);
        return json({ credentials: data });
      }

      case "add_credentials": {
        // payload: { app_id, variant_label, lines: string[] } - satu baris = satu akun siap kirim
        const { app_id, variant_label, lines } = payload;
        if (!Array.isArray(lines) || lines.length === 0) return json({ error: "Isi akun kosong" }, 400);
        const rows = lines
          .map((l: string) => l.trim())
          .filter(Boolean)
          .map((content: string) => ({ app_id, variant_label, content }));
        const { error } = await supabase.from("credentials").insert(rows);
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true, added: rows.length });
      }

      case "delete_credential": {
        const { id } = payload;
        const { error } = await supabase.from("credentials").delete().eq("id", id).eq("is_used", false);
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      }

      case "mark_delivered": {
        // Kirim manual (kalau stok kredensial kosong) — admin isi teks lalu tandai terkirim
        const { order_item_id, content } = payload;
        const { error } = await supabase.from("order_items").update({ delivered_content: content }).eq("id", order_item_id);
        if (error) return json({ error: error.message }, 500);
        return json({ ok: true });
      }

      default:
        return json({ error: "Aksi tidak dikenal" }, 400);
    }
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
