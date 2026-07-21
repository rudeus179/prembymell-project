import { useState, useEffect, useMemo } from "react";
import {
  Lock,
  RefreshCw,
  Send,
  LogOut,
  ShoppingBag,
  Boxes,
  KeyRound,
  CheckCircle2,
  Clock3,
  XCircle,
  ImageOff,
  Trash2,
  Plus,
  Wallet,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

import { APPS } from "./appsData";
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

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

/* ---------- small shared bits ---------- */

function StatusBadge({ status }) {
  const map = {
    paid: { label: "Lunas", cls: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30", Icon: CheckCircle2 },
    failed: { label: "Gagal", cls: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30", Icon: XCircle },
    pending: { label: "Menunggu", cls: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30", Icon: Clock3 },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
      <s.Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-stone-500">
      <Icon className="w-8 h-8 opacity-50" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function Spinner({ className = "w-4 h-4" }) {
  return <RefreshCw className={`${className} animate-spin`} />;
}

function SectionTitle({ children, count }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <p className="text-stone-400 text-xs font-bold uppercase tracking-wide">{children}</p>
      {count !== undefined && (
        <span className="text-[11px] font-bold text-stone-500 bg-stone-800 rounded-full px-2 py-0.5">{count}</span>
      )}
    </div>
  );
}

function RefreshButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="self-end flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-full px-3 py-1.5 transition-colors disabled:opacity-60"
    >
      <Spinner className={`w-3.5 h-3.5 ${loading ? "" : "hidden"}`} />
      <RefreshCw className={`w-3.5 h-3.5 ${loading ? "hidden" : ""}`} />
      Refresh
    </button>
  );
}

/* ---------- login ---------- */

function LoginGate({ onSuccess, onCancel }) {
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
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-fuchsia-600/20 rounded-full blur-3xl" />
      <form
        onSubmit={submit}
        className="relative w-full max-w-xs bg-stone-900/90 backdrop-blur border border-stone-800 rounded-3xl p-7 flex flex-col gap-5 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg leading-tight">Admin Prembymell</p>
            <p className="text-stone-500 text-xs mt-0.5">Masuk untuk kelola pesanan</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
            autoFocus
            className="bg-stone-800 text-white text-sm rounded-xl px-3.5 py-3 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder:text-stone-500 transition-shadow"
          />
          {error && (
            <p className="text-rose-400 text-xs flex items-center gap-1.5 px-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}
        </div>
        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-600 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-pink-500/20 hover:brightness-110 active:scale-[0.98] transition"
        >
          {loading && <Spinner className="w-4 h-4" />}
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-stone-500 hover:text-white text-xs font-medium -mt-2 transition-colors"
          >
            Batal, kembali ke toko
          </button>
        )}
      </form>
    </div>
  );
}

/* ---------- orders ---------- */

function OrdersTab({ password }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualInputs, setManualInputs] = useState({});
  const [busyId, setBusyId] = useState(null);

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
    setBusyId(orderId);
    try {
      await callAdmin(password, "mark_paid", { order_id: orderId });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function sendManual(itemId) {
    const content = manualInputs[itemId];
    if (!content) return;
    setBusyId(itemId);
    try {
      await callAdmin(password, "mark_delivered", { order_item_id: itemId, content });
      setManualInputs((p) => ({ ...p, [itemId]: "" }));
      await load();
    } finally {
      setBusyId(null);
    }
  }

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const paid = orders.filter((o) => o.status === "paid").length;
    const revenue = orders
      .filter((o) => o.status === "paid")
      .reduce((s, o) => s + o.order_items.reduce((s2, i) => s2 + i.price * i.qty, 0), 0);
    return { pending, paid, revenue };
  }, [orders]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-stone-800/70 border border-stone-700/60 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Menunggu</span>
          <span className="text-white font-bold text-lg">{stats.pending}</span>
        </div>
        <div className="bg-stone-800/70 border border-stone-700/60 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Lunas</span>
          <span className="text-white font-bold text-lg">{stats.paid}</span>
        </div>
        <div className="bg-stone-800/70 border border-stone-700/60 rounded-xl p-3 flex flex-col gap-1 col-span-1">
          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wide flex items-center gap-1">
            <Wallet className="w-3 h-3" /> Omzet
          </span>
          <span className="text-white font-bold text-sm truncate">{rupiah(stats.revenue)}</span>
        </div>
      </div>

      <RefreshButton onClick={load} loading={loading} />

      {!loading && orders.length === 0 && <EmptyState icon={ShoppingBag} text="Belum ada pesanan" />}

      {orders.map((order) => {
        const total = order.order_items.reduce((s, i) => s + i.price * i.qty, 0);
        const isBusy = busyId === order.id;
        return (
          <div key={order.id} className="bg-stone-800/70 border border-stone-700/60 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">{new Date(order.created_at).toLocaleString("id-ID")}</span>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-stone-300 text-xs flex items-center gap-1.5">
              <span className="text-stone-500">WA:</span> {order.customer_contact || "-"}
            </p>

            {order.status === "pending" && (
              order.proof_signed_url ? (
                <div className="flex flex-col gap-2">
                  <a href={order.proof_signed_url} target="_blank" rel="noreferrer" className="block">
                    <img
                      src={order.proof_signed_url}
                      alt="Bukti bayar"
                      className="w-full max-h-56 object-contain rounded-xl border border-stone-700 bg-stone-900"
                    />
                  </a>
                  <p className="text-stone-500 text-[11px] flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    Cek fotonya dulu, baru tandai lunas kalau nominal &amp; tujuan transfer cocok.
                  </p>
                  <button
                    onClick={() => markPaid(order.id)}
                    disabled={isBusy}
                    className="self-start flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    {isBusy ? <Spinner className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Tandai Lunas
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-stone-900/60 rounded-xl px-3 py-2.5">
                  <p className="text-amber-400 text-[11px] flex items-center gap-1.5">
                    <ImageOff className="w-3.5 h-3.5 shrink-0" /> Belum ada bukti bayar diupload
                  </p>
                  <button
                    onClick={() => markPaid(order.id)}
                    disabled={isBusy}
                    className="shrink-0 flex items-center gap-1.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-60 text-stone-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {isBusy && <Spinner className="w-3.5 h-3.5" />}
                    Tandai Lunas
                  </button>
                </div>
              )
            )}

            <div className="flex flex-col divide-y divide-stone-700/60">
              {order.order_items.map((item) => (
                <div key={item.id} className="text-sm text-white py-2 first:pt-0">
                  <div className="flex justify-between gap-2">
                    <span className="text-stone-200">{item.app_name} · {item.variant_label} <span className="text-stone-500">×{item.qty}</span></span>
                    <span className="font-mono text-stone-300 shrink-0">{rupiah(item.price * item.qty)}</span>
                  </div>
                  {order.status === "paid" && (
                    item.delivered_content ? (
                      <p className="text-emerald-400 text-xs mt-1.5 font-mono break-all bg-emerald-500/10 rounded-lg px-2 py-1.5 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {item.delivered_content}
                      </p>
                    ) : (
                      <div className="flex gap-1.5 mt-1.5">
                        <input
                          value={manualInputs[item.id] || ""}
                          onChange={(e) => setManualInputs((p) => ({ ...p, [item.id]: e.target.value }))}
                          placeholder="Isi akun buat kirim manual"
                          className="flex-1 bg-stone-900 text-white text-xs rounded-lg px-2.5 py-2 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <button
                          onClick={() => sendManual(item.id)}
                          disabled={busyId === item.id}
                          className="shrink-0 flex items-center justify-center bg-pink-500 hover:bg-pink-400 disabled:opacity-60 text-white rounded-lg w-9 transition-colors"
                        >
                          {busyId === item.id ? <Spinner className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-xs text-stone-400 border-t border-stone-700/60 pt-2.5">
              <span className="font-semibold">Total</span>
              <span className="font-mono font-bold text-white">{rupiah(total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- stock ---------- */

function StockTab({ password }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(APPS[0]?.id || "");
  const [selectedVariantLabel, setSelectedVariantLabel] = useState(APPS[0]?.variants[0]?.label || "");
  const [qty, setQty] = useState("");

  const selectedApp = APPS.find((a) => a.id === selectedAppId);

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

  function onAppChange(appId) {
    setSelectedAppId(appId);
    const app = APPS.find((a) => a.id === appId);
    setSelectedVariantLabel(app?.variants[0]?.label || "");
  }

  async function save(e) {
    e.preventDefault();
    if (!selectedAppId || !selectedVariantLabel) return;
    setSaving(true);
    try {
      await callAdmin(password, "upsert_stock", { app_id: selectedAppId, variant_label: selectedVariantLabel, stock_qty: Number(qty) });
      setQty("");
      await load();
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "bg-stone-900 text-white text-xs rounded-lg px-3 py-2.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-stone-500";
  const selectCls = "bg-stone-900 text-white text-xs rounded-lg px-3 py-2.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none";

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={save} className="bg-stone-800/70 border border-stone-700/60 rounded-2xl p-4 flex flex-col gap-2.5">
        <p className="text-white text-xs font-bold flex items-center gap-1.5">
          <Boxes className="w-4 h-4 text-pink-400" /> Set / update batas stok
        </p>
        <select value={selectedAppId} onChange={(e) => onAppChange(e.target.value)} className={selectCls}>
          {APPS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select value={selectedVariantLabel} onChange={(e) => setSelectedVariantLabel(e.target.value)} className={selectCls}>
          {selectedApp?.variants.map((v) => (
            <option key={v.label} value={v.label}>{v.label}</option>
          ))}
        </select>
        <input required type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Jumlah stok" className={inputCls} />
        <button disabled={saving} className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 disabled:opacity-60 text-white text-xs font-bold py-2.5 rounded-lg transition">
          {saving ? <Spinner className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          Simpan
        </button>
      </form>

      <RefreshButton onClick={load} loading={loading} />

      {!loading && stock.length === 0 && <EmptyState icon={Boxes} text="Belum ada data stok" />}

      <div className="flex flex-col gap-2">
        {stock.map((s) => {
          const appName = APPS.find((a) => a.id === s.app_id)?.name || s.app_id;
          return (
            <div key={s.id} className="bg-stone-800/70 border border-stone-700/60 rounded-xl p-3.5 flex justify-between items-center text-sm text-white">
              <span className="text-stone-200">{appName} <span className="text-stone-600">·</span> {s.variant_label}</span>
              <span className={`font-mono font-bold px-2.5 py-1 rounded-lg text-xs ${s.stock_qty > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                {s.stock_qty}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- credentials ---------- */

function CredentialsTab({ password }) {
  const [creds, setCreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ app_id: "", variant_label: "", lines: "" });
  const [copiedId, setCopiedId] = useState(null);

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
    setSaving(true);
    try {
      await callAdmin(password, "add_credentials", {
        app_id: form.app_id,
        variant_label: form.variant_label,
        lines: form.lines.split("\n"),
      });
      setForm({ app_id: "", variant_label: "", lines: "" });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    await callAdmin(password, "delete_credential", { id });
    load();
  }

  function copy(c) {
    navigator.clipboard?.writeText(c.content);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId((cur) => (cur === c.id ? null : cur)), 1200);
  }

  const available = creds.filter((c) => !c.is_used);
  const used = creds.filter((c) => c.is_used);
  const inputCls = "bg-stone-900 text-white text-xs rounded-lg px-3 py-2.5 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-stone-500";

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={add} className="bg-stone-800/70 border border-stone-700/60 rounded-2xl p-4 flex flex-col gap-2.5">
        <p className="text-white text-xs font-bold flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-pink-400" /> Isi stok akun siap kirim
        </p>
        <p className="text-stone-500 text-[11px] -mt-1.5">Satu baris = satu akun</p>
        <input required value={form.app_id} onChange={(e) => setForm({ ...form, app_id: e.target.value })} placeholder="app_id, misal: netflix" className={inputCls} />
        <input required value={form.variant_label} onChange={(e) => setForm({ ...form, variant_label: e.target.value })} placeholder="variant_label, misal: Privat - 1 Bulan" className={inputCls} />
        <textarea required value={form.lines} onChange={(e) => setForm({ ...form, lines: e.target.value })} placeholder={"email1@x.com:pass1\nemail2@x.com:pass2"} rows={4} className={`${inputCls} font-mono resize-none`} />
        <button disabled={saving} className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-600 disabled:opacity-60 text-white text-xs font-bold py-2.5 rounded-lg transition">
          {saving ? <Spinner className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          Tambah ke stok
        </button>
      </form>

      <RefreshButton onClick={load} loading={loading} />

      <SectionTitle count={available.length}>Siap kirim</SectionTitle>
      {!loading && available.length === 0 && <EmptyState icon={KeyRound} text="Belum ada akun siap kirim" />}
      <div className="flex flex-col gap-2">
        {available.map((c) => (
          <div key={c.id} className="bg-stone-800/70 border border-stone-700/60 rounded-xl p-3 flex items-center justify-between gap-2 text-sm text-white">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-stone-400">{c.app_id} · {c.variant_label}</p>
              <p className="font-mono text-xs break-all text-stone-200 mt-0.5">{c.content}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => copy(c)} className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-700 transition-colors" title="Salin">
                {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => del(c.id)} className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors" title="Hapus">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle count={used.length}>Sudah terpakai</SectionTitle>
      {!loading && used.length === 0 && <EmptyState icon={CheckCircle2} text="Belum ada akun terpakai" />}
      <div className="flex flex-col gap-2">
        {used.map((c) => (
          <div key={c.id} className="bg-stone-900/60 border border-stone-800 rounded-xl p-3 text-sm text-stone-500">
            <p className="text-[11px] font-bold text-stone-600">{c.app_id} · {c.variant_label}</p>
            <p className="font-mono text-xs break-all mt-0.5">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

const TABS = [
  { id: "orders", label: "Pesanan", Icon: ShoppingBag },
  { id: "stock", label: "Stok", Icon: Boxes },
  { id: "credentials", label: "Kredensial", Icon: KeyRound },
];

export default function AdminApp({ onExit }) {
  const [password, setPassword] = useState(() => sessionStorage.getItem(PW_STORAGE_KEY) || "");
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let listenerHandle;
    CapacitorApp.addListener("backButton", () => {
      if (onExit) {
        onExit();
      } else {
        CapacitorApp.exitApp();
      }
    }).then((handle) => {
      listenerHandle = handle;
    });
    return () => {
      listenerHandle?.remove();
    };
  }, [onExit]);

  if (!password) return <LoginGate onSuccess={setPassword} onCancel={onExit} />;

  function logout() {
    sessionStorage.removeItem(PW_STORAGE_KEY);
    setPassword("");
  }

  return (
    <div className="min-h-screen bg-stone-950 pb-10">
      <div className="sticky top-0 bg-stone-950/90 backdrop-blur border-b border-stone-800 px-4 pt-4 pb-3 flex flex-col gap-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <p className="text-white font-bold">Admin Prembymell</p>
          </div>
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-white transition-colors"
              >
                Kembali ke Toko
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-rose-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Keluar
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full transition-colors ${
                tab === id
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/20"
                  : "bg-stone-800/70 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
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
