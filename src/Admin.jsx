import { useState, useEffect } from "react";
import { Lock, RefreshCw, Send } from "lucide-react";

const SUPABASE_FUNCTIONS_URL = "https://bcuupxqrbczhmhmrwrzv.functions.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r_CYjAY3OvGaWtXE6B1eWA_xja80Mll";
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const PW_STORAGE_KEY = "pm_admin_pw";

async function callAdmin(password, action, payload) {
  const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ password, action, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal");
  return data;
}

function LoginGate({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await callAdmin(password, "login");
      sessionStorage.setItem(PW_STORAGE_KEY, password);
      onSuccess(password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-xs bg-stone-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex flex-col items-center gap-2 text-white">
          <Lock className="w-6 h-6" />
          <p className="font-bold">Admin Prembymell</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password admin"
          className="bg-stone-700 text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        {error && <p className="text-rose-400 text-xs">{error}</p>}
        <button disabled={loading} className="bg-pink-500 disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-lg">
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}

function OrdersTab({ password }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualInputs, setManualInputs] = useState({});

  async function load() {
    setLoading(true);
    try {
      const data = await callAdmin(password, "list_orders");
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function markPaid(orderId) {
    await callAdmin(password, "mark_paid", { order_id: orderId });
    load();
  }

  async function sendManual(itemId) {
    const content = manualInputs[itemId];
    if (!content) return;
    await callAdmin(password, "mark_delivered", { order_item_id: itemId, content });
    setManualInputs((p) => ({ ...p, [itemId]: "" }));
    load();
  }

  return (
    <div className="flex flex-col gap-3">
      <button onClick={load} className="self-end flex items-center gap-1 text-xs text-stone-400"><RefreshCw className="w-3 h-3" /> Refresh</button>
      {loading && <p className="text-stone-400 text-sm">Memuat...</p>}
      {orders.map((order) => {
        const total = order.order_items.reduce((s, i) => s + i.price * i.qty, 0);
        return (
          <div key={order.id} className="bg-stone-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400">{new Date(order.created_at).toLocaleString("id-ID")}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${order.status === "paid" ? "bg-emerald-900 text-emerald-300" : order.status === "failed" ? "bg-rose-900 text-rose-300" : "bg-amber-900 text-amber-300"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-stone-300 text-xs">WA: {order.customer_contact || "-"}</p>
            {order.status === "pending" && (
              order.proof_signed_url ? (
                <div className="flex flex-col gap-1.5">
                  <a href={order.proof_signed_url} target="_blank" rel="noreferrer">
                    <img
                      src={order.proof_signed_url}
                      alt="Bukti bayar"
                      className="w-full max-h-56 object-contain rounded-lg border border-stone-700 bg-stone-900"
                    />
                  </a>
                  <p className="text-stone-500 text-[10px]">Cek fotonya dulu, baru tandai lunas kalau nominal & tujuan transfer cocok.</p>
                  <button
                    onClick={() => markPaid(order.id)}
                    className="self-start bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    Tandai Lunas
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-amber-400 text-[11px]">Belum ada bukti bayar diupload</p>
                  <button
                    onClick={() => markPaid(order.id)}
                    className="self-start bg-stone-700 text-stone-300 text-xs font-bold px-3 py-1.5 rounded-lg"
                  >
                    Tandai Lunas
                  </button>
                </div>
              )
            )}
            {order.order_items.map((item) => (
              <div key={item.id} className="text-sm text-white border-t border-stone-700 pt-2">
                <div className="flex justify-between">
                  <span>{item.app_name} · {item.variant_label} (x{item.qty})</span>
                  <span className="font-mono">{rupiah(item.price * item.qty)}</span>
                </div>
                {order.status === "paid" && (
                  item.delivered_content ? (
                    <p className="text-emerald-400 text-xs mt-1 font-mono break-all">✓ {item.delivered_content}</p>
                  ) : (
                    <div className="flex gap-1.5 mt-1.5">
                      <input
                        value={manualInputs[item.id] || ""}
                        onChange={(e) => setManualInputs((p) => ({ ...p, [item.id]: e.target.value }))}
                        placeholder="Isi akun buat kirim manual"
                        className="flex-1 bg-stone-700 text-white text-xs rounded-lg px-2 py-1.5"
                      />
                      <button onClick={() => sendManual(item.id)} className="shrink-0 bg-pink-500 text-white rounded-lg px-2"><Send className="w-3.5 h-3.5" /></button>
                    </div>
                  )
                )}
              </div>
            ))}
            <div className="flex justify-between text-xs text-stone-400 border-t border-stone-700 pt-2">
              <span>Total</span><span className="font-mono">{rupiah(total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StockTab({ password }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ app_id: "", variant_label: "", stock_qty: "" });

  async function load() {
    setLoading(true);
    try {
      const data = await callAdmin(password, "list_stock");
      setStock(data.stock || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    await callAdmin(password, "upsert_stock", { app_id: form.app_id, variant_label: form.variant_label, stock_qty: Number(form.stock_qty) });
    setForm({ app_id: "", variant_label: "", stock_qty: "" });
    load();
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={save} className="bg-stone-800 rounded-xl p-3.5 flex flex-col gap-2">
        <p className="text-white text-xs font-bold">Set / update batas stok</p>
        <input required value={form.app_id} onChange={(e) => setForm({ ...form, app_id: e.target.value })} placeholder="app_id, misal: netflix" className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2" />
        <input required value={form.variant_label} onChange={(e) => setForm({ ...form, variant_label: e.target.value })} placeholder="variant_label, misal: Privat - 1 Bulan" className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2" />
        <input required type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} placeholder="Jumlah stok" className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2" />
        <button className="bg-pink-500 text-white text-xs font-bold py-2 rounded-lg">Simpan</button>
      </form>
      <button onClick={load} className="self-end flex items-center gap-1 text-xs text-stone-400"><RefreshCw className="w-3 h-3" /> Refresh</button>
      {loading && <p className="text-stone-400 text-sm">Memuat...</p>}
      {stock.map((s) => (
        <div key={s.id} className="bg-stone-800 rounded-xl p-3 flex justify-between text-sm text-white">
          <span>{s.app_id} · {s.variant_label}</span>
          <span className="font-mono">{s.stock_qty}</span>
        </div>
      ))}
    </div>
  );
}

function CredentialsTab({ password }) {
  const [creds, setCreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ app_id: "", variant_label: "", lines: "" });

  async function load() {
    setLoading(true);
    try {
      const data = await callAdmin(password, "list_credentials");
      setCreds(data.credentials || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function add(e) {
    e.preventDefault();
    await callAdmin(password, "add_credentials", {
      app_id: form.app_id,
      variant_label: form.variant_label,
      lines: form.lines.split("\n"),
    });
    setForm({ app_id: "", variant_label: "", lines: "" });
    load();
  }

  async function del(id) {
    await callAdmin(password, "delete_credential", { id });
    load();
  }

  const available = creds.filter((c) => !c.is_used);
  const used = creds.filter((c) => c.is_used);

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={add} className="bg-stone-800 rounded-xl p-3.5 flex flex-col gap-2">
        <p className="text-white text-xs font-bold">Isi stok akun siap kirim (satu baris = satu akun)</p>
        <input required value={form.app_id} onChange={(e) => setForm({ ...form, app_id: e.target.value })} placeholder="app_id, misal: netflix" className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2" />
        <input required value={form.variant_label} onChange={(e) => setForm({ ...form, variant_label: e.target.value })} placeholder="variant_label, misal: Privat - 1 Bulan" className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2" />
        <textarea required value={form.lines} onChange={(e) => setForm({ ...form, lines: e.target.value })} placeholder={"email1@x.com:pass1\nemail2@x.com:pass2"} rows={4} className="bg-stone-700 text-white text-xs rounded-lg px-2 py-2 font-mono" />
        <button className="bg-pink-500 text-white text-xs font-bold py-2 rounded-lg">Tambah ke stok</button>
      </form>
      <button onClick={load} className="self-end flex items-center gap-1 text-xs text-stone-400"><RefreshCw className="w-3 h-3" /> Refresh</button>
      {loading && <p className="text-stone-400 text-sm">Memuat...</p>}

      <p className="text-stone-400 text-xs font-bold mt-1">Siap kirim ({available.length})</p>
      {available.map((c) => (
        <div key={c.id} className="bg-stone-800 rounded-xl p-3 flex items-center justify-between gap-2 text-sm text-white">
          <span className="font-mono text-xs break-all">{c.app_id} · {c.variant_label} — {c.content}</span>
          <button onClick={() => del(c.id)} className="shrink-0 text-rose-400 text-xs font-bold">Hapus</button>
        </div>
      ))}

      <p className="text-stone-400 text-xs font-bold mt-1">Sudah terpakai ({used.length})</p>
      {used.map((c) => (
        <div key={c.id} className="bg-stone-800/50 rounded-xl p-3 text-sm text-stone-400">
          <span className="font-mono text-xs break-all">{c.app_id} · {c.variant_label} — {c.content}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminApp() {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_STORAGE_KEY) || "");
  const [tab, setTab] = useState("orders");

  if (!password) return <LoginGate onSuccess={setPassword} />;

  return (
    <div className="min-h-screen bg-stone-900 pb-10">
      <div className="sticky top-0 bg-stone-900/95 backdrop-blur border-b border-stone-800 px-4 pt-4 pb-3 flex flex-col gap-3 z-10">
        <p className="text-white font-bold">Admin Prembymell</p>
        <div className="flex gap-2">
          {[["orders", "Pesanan"], ["stock", "Stok"], ["credentials", "Kredensial"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${tab === id ? "bg-pink-500 text-white" : "bg-stone-800 text-stone-400"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pt-4">
        {tab === "orders" && <OrdersTab password={password} />}
        {tab === "stock" && <StockTab password={password} />}
        {tab === "credentials" && <CredentialsTab password={password} />}
      </div>
    </div>
  );
}
