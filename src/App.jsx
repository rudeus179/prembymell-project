import { useState, useMemo } from "react";
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, MessageCircle, Home, X, Sparkles, Trash2, Search, History, PackageCheck, Clock, XCircle, Copy } from "lucide-react";
import qrisImage from "./assets/qris.jpg";

const APPS = [
  { id: "apple-music", icon: "applemusic", name: "Apple Music", cat: "Musik", letter: "AM", bg: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500", dark: true, ring: "ring-fuchsia-300", chip: "bg-white text-fuchsia-600", tagline: "Jutaan lagu lossless, bebas iklan", variants: [
    { label: "Via Invite - 1 Bulan", price: 6000 },
    { label: "Apple Music Head", price: 8500 },
  ]},
  { id: "spotify", icon: "spotify", name: "Spotify", cat: "Musik", letter: "SP", bg: "bg-gradient-to-br from-green-500 to-emerald-600", dark: true, ring: "ring-green-300", chip: "bg-white text-green-600", tagline: "Premium tanpa iklan, bisa download", variants: [
    { label: "Premium - 1 Bulan", price: 7500 },
  ]},
  { id: "loklok", name: "Lok Lok", cat: "Streaming", letter: "LL", bg: "bg-gradient-to-br from-pink-400 to-fuchsia-500", dark: true, ring: "ring-pink-300", chip: "bg-white text-pink-600", tagline: "Nonton drama & film lengkap", variants: [
    { label: "Plan Standar - 1 Bulan", price: 18000 },
  ]},
  { id: "wetv", name: "WeTV", cat: "Streaming", letter: "WT", bg: "bg-gradient-to-br from-blue-600 to-sky-400", dark: true, ring: "ring-blue-300", chip: "bg-white text-blue-600", tagline: "Drama Asia & original series", variants: [
    { label: "Sharing - 1 Bulan (8 user)", price: 4500 },
    { label: "Sharing - 1 Bulan (5 user)", price: 5500 },
    { label: "Privat - 1 Bulan", price: 16500 },
  ]},
  { id: "iqiyi", icon: "iqiyi", name: "iQiyi", cat: "Streaming", letter: "IQ", bg: "bg-gradient-to-br from-green-600 to-lime-500", dark: true, ring: "ring-lime-300", chip: "bg-white text-green-700", tagline: "Drama & variety show Asia", variants: [
    { label: "Sharing Standart - 1 Bulan", price: 3500 },
    { label: "Sharing Premium - 1 Bulan", price: 4000 },
    { label: "Sharing Premium - 1 Tahun", price: 7000 },
    { label: "Private Standart", price: 27000 },
    { label: "Private Premium", price: 35000 },
  ]},
  { id: "hbo", icon: "hbomax", name: "HBO", cat: "Streaming", letter: "HB", bg: "bg-gradient-to-br from-violet-800 via-purple-900 to-stone-900", dark: true, ring: "ring-violet-400", chip: "bg-white text-violet-700", tagline: "Serial & film HBO Original", variants: [
    { label: "Sharing - 1 Bulan", price: 17000 },
    { label: "Private - 1 Bulan", price: 72000 },
  ]},
  { id: "viu", name: "Viu", cat: "Streaming", letter: "VU", bg: "bg-gradient-to-br from-pink-500 to-purple-600", dark: true, ring: "ring-pink-300", chip: "bg-white text-pink-600", tagline: "Drama Asia, akses antilimit", variants: [
    { label: "Antilimit", price: 4000 },
  ]},
  { id: "visionplus", name: "Vision+", cat: "Streaming", letter: "V+", bg: "bg-gradient-to-br from-red-600 to-orange-500", dark: true, ring: "ring-orange-300", chip: "bg-white text-red-600", tagline: "Siaran TV & film lokal", variants: [
    { label: "Ultimate Private - 1 Bulan", price: 33000 },
  ]},
  { id: "gagaoolala", name: "GagaOoLaLa", cat: "Streaming", letter: "GO", bg: "bg-gradient-to-br from-amber-400 via-pink-500 to-purple-500", dark: true, ring: "ring-pink-300", chip: "bg-white text-pink-600", tagline: "Film & series eksklusif Asia", variants: [
    { label: "1 Bulan", price: 5500 },
  ]},
  { id: "netflix", icon: "netflix", name: "Netflix", cat: "Streaming", letter: "NF", bg: "bg-gradient-to-br from-neutral-900 via-red-800 to-red-600", dark: true, ring: "ring-red-400", chip: "bg-white text-red-600", tagline: "Film & series Ultra HD", variants: [
    { label: "Privat - 7 Hari", price: 27000 },
    { label: "Privat - 14 Hari", price: 37000 },
    { label: "Privat - 1 Bulan", price: 45000 },
    { label: "Privat - 2 Bulan", price: 72000 },
    { label: "Privat - 3 Bulan", price: 107000 },
    { label: "Sharing - 1 Bulan", price: 37000 },
    { label: "Sharing - 2 Bulan", price: 52000 },
    { label: "Sharing - 3 Bulan", price: 67000 },
  ]},
  { id: "bstation", icon: "bilibili", name: "BStation", cat: "Streaming", letter: "BS", bg: "bg-gradient-to-br from-sky-400 to-pink-400", dark: true, ring: "ring-sky-300", chip: "bg-white text-sky-600", tagline: "Anime sub Indo tanpa iklan", variants: [
    { label: "Sharing - 1 Bulan", price: 5000 },
    { label: "Private - 1 Bulan", price: 31000 },
  ]},
  { id: "youtube", icon: "youtube", name: "YouTube", cat: "Streaming", letter: "YT", bg: "bg-gradient-to-br from-red-600 to-red-700", dark: true, ring: "ring-red-300", chip: "bg-white text-red-600", tagline: "Bebas iklan + YouTube Music", variants: [
    { label: "Indplan - 1 Bulan", price: 7500 },
    { label: "Indplan - 2 Bulan", price: 8500 },
    { label: "Indplan - 3 Bulan", price: 10000 },
  ]},
  { id: "vidio", name: "Vidio", cat: "Streaming", letter: "VD", bg: "bg-gradient-to-br from-orange-500 to-red-500", dark: true, ring: "ring-orange-300", chip: "bg-white text-orange-600", tagline: "Liga Inggris & serial lokal", variants: [
    { label: "Sharing - 1 Bulan", price: 17000 },
    { label: "Private - 1 Bulan", price: 30000 },
  ]},
  { id: "remini", name: "Remini", cat: "Editing & Foto", letter: "RM", bg: "bg-gradient-to-br from-purple-500 to-pink-500", dark: true, ring: "ring-purple-300", chip: "bg-white text-purple-600", tagline: "Perbaiki & perjelas foto, Android", variants: [
    { label: "Via Login Aplikasi - 1 Tahun", price: 7000 },
  ]},
  { id: "alight-motion", name: "Alight Motion", cat: "Editing & Foto", letter: "AL", bg: "bg-gradient-to-br from-indigo-700 to-blue-600", dark: true, ring: "ring-indigo-300", chip: "bg-white text-indigo-600", tagline: "Edit video & motion graphic pro", variants: [
    { label: "Private - 1 Tahun (iOS/Andro)", price: 2500 },
  ]},
  { id: "lightroom", icon: "adobelightroom", name: "Lightroom", cat: "Editing & Foto", letter: "LR", bg: "bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600", dark: true, ring: "ring-cyan-300", chip: "bg-white text-blue-600", tagline: "Preset & edit foto profesional", variants: [
    { label: "1 Tahun", price: 7000 },
  ]},
  { id: "dazzcam", name: "DazzCam", cat: "Editing & Foto", letter: "DZ", bg: "bg-gradient-to-br from-amber-200 to-orange-300", dark: false, ring: "ring-amber-400", chip: "bg-white text-amber-600", tagline: "Filter kamera estetik ala film", variants: [
    { label: "Lifetime iOS", price: 27000 },
  ]},
  { id: "vsco", icon: "vsco", name: "VSCO", cat: "Editing & Foto", letter: "VS", bg: "bg-gradient-to-br from-stone-600 to-stone-900", dark: true, ring: "ring-stone-400", chip: "bg-white text-stone-700", tagline: "Preset & filter estetik", variants: [
    { label: "Andro/iOS - 1 Tahun", price: 7700 },
  ]},
  { id: "capcut", icon: "capcut", name: "CapCut", cat: "Editing & Foto", letter: "CC", bg: "bg-gradient-to-br from-neutral-900 via-neutral-800 to-cyan-600", dark: true, ring: "ring-cyan-300", chip: "bg-white text-neutral-800", tagline: "Edit tanpa watermark, efek terbuka", variants: [
    { label: "Sharing - 1 Bulan", price: 2500 },
    { label: "Privat - 1 Bulan", price: 5500 },
  ]},
  { id: "canva", icon: "canva", name: "Canva", cat: "Produktivitas", letter: "CV", bg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600", dark: true, ring: "ring-blue-300", chip: "bg-white text-blue-600", tagline: "Semua template & aset premium", variants: [
    { label: "Design - 1 Month", price: 3000 },
    { label: "Member - 1 Month", price: 3000 },
    { label: "Edu Lifetime", price: 3500 },
    { label: "Member - 1 Tahun", price: 4500 },
    { label: "Owner - 1 Month", price: 5500 },
  ]},
  { id: "chatgpt", icon: "openai", name: "ChatGPT", cat: "Produktivitas", letter: "GPT", bg: "bg-gradient-to-br from-teal-600 to-emerald-700", dark: true, ring: "ring-teal-300", chip: "bg-white text-teal-700", tagline: "Akses ChatGPT Plus", variants: [
    { label: "Sharing - 1 Bulan", price: 8500 },
    { label: "Private - 1 Bulan", price: 57000 },
  ]},
];

const CATEGORIES = ["Semua", "Streaming", "Musik", "Editing & Foto", "Produktivitas"];
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const WHATSAPP_NUMBER = "6285733335037";
// Ganti dengan URL project Supabase kamu sendiri, contoh:
// "https://xxxxxxxxxxxx.functions.supabase.co"
const SUPABASE_FUNCTIONS_URL = "https://bcuupxqrbczhmhmrwrzv.functions.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r_CYjAY3OvGaWtXE6B1eWA_xja80Mll";
const CONTACT_STORAGE_KEY = "pm_contact";
const STATUS_LABEL = { pending: "Menunggu Pembayaran", paid: "Lunas", failed: "Gagal / Kedaluwarsa" };

function Badge({ children, className = "" }) {
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${className}`}>{children}</span>;
}

function AppIcon({ app, size = "w-12 h-12" }) {
  const [failed, setFailed] = useState(false);
  if (!app.icon || failed) {
    return (
      <div className={`${size} rounded-2xl flex items-center justify-center font-extrabold text-sm shadow-md ring-2 ring-white/70 ${app.chip}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>
        {app.letter}
      </div>
    );
  }
  return (
    <div className={`${size} rounded-2xl bg-white shadow-md ring-2 ring-white/70 flex items-center justify-center p-2.5`}>
      <img
        src={`https://cdn.simpleicons.org/${app.icon}`}
        alt={app.name}
        className="w-full h-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function MemberCard({ app, variant }) {
  return (
    <div className="relative rounded-2xl px-4 py-2.5 overflow-hidden bg-gradient-to-r from-pink-100 via-orange-100 to-amber-100 border-2 border-dashed border-orange-300 shadow-sm shadow-orange-200/50 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4 text-amber-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-stone-500 text-[10px] leading-none">{app ? "Sedang dipilih" : "Belum ada pilihan"}</p>
        <p className="text-stone-800 text-sm font-bold truncate mt-0.5" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
          {app ? app.name : "Pilih akun premium"}
          {variant && <span className="text-stone-500 font-medium"> · {variant.label}</span>}
        </p>
      </div>
      <p className="text-pink-600 text-sm font-bold shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {variant ? rupiah(variant.price) : "—"}
      </p>
    </div>
  );
}

function AppCard({ app, onOpen }) {
  const cheapest = app.variants.reduce((a, b) => (a.price < b.price ? a : b));
  const glow = app.ring.replace("ring-", "bg-");
  const title = app.dark ? "text-white" : "text-stone-800";
  const sub = app.dark ? "text-white/75" : "text-stone-500";
  const faint = app.dark ? "text-white/60" : "text-stone-500";
  const badgeCls = app.dark ? "bg-white/20 text-white" : "bg-white/70 text-stone-600";
  return (
    <button
      onClick={() => onOpen(app)}
      className={`group relative text-left rounded-2xl ${app.bg} border-2 border-white/30 ring-0 hover:ring-2 ${app.ring} transition-all p-4 flex flex-col gap-3 shadow-md hover:shadow-xl hover:-translate-y-0.5 overflow-hidden`}
    >
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${glow}/40 blur-2xl`} />
      <div className="relative flex items-start justify-between">
        <div className="group-hover:scale-105 transition-transform">
          <AppIcon app={app} />
        </div>
        {app.variants.length > 1 && <Badge className={`${badgeCls} shadow-sm`}>{app.variants.length} pilihan</Badge>}
      </div>
      <div className="relative">
        <p className={`font-bold text-[15px] leading-tight ${title}`} style={{ fontFamily: "'Baloo 2', sans-serif" }}>{app.name}</p>
        <p className={`text-xs mt-1 leading-snug ${sub}`}>{app.tagline}</p>
      </div>
      <div className="relative flex items-baseline gap-1 mt-auto">
        <span className={`text-[11px] ${faint}`}>mulai</span>
        <span className={`font-bold text-sm ${title}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(cheapest.price)}</span>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { cls: "bg-amber-100 text-amber-700", icon: Clock },
    paid: { cls: "bg-emerald-100 text-emerald-700", icon: PackageCheck },
    failed: { cls: "bg-rose-100 text-rose-700", icon: XCircle },
  };
  const { cls, icon: Icon } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${cls}`}>
      <Icon className="w-3 h-3" /> {STATUS_LABEL[status] || status}
    </span>
  );
}

function OrderCard({ order }) {
  const [copiedId, setCopiedId] = useState(null);
  const total = order.order_items.reduce((s, i) => s + i.price * i.qty, 0);

  function copy(text, id) {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="rounded-xl bg-white border-2 border-orange-100 p-3.5 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <p className="text-stone-500 text-[11px] font-medium">
          {new Date(order.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
        </p>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex flex-col gap-2">
        {order.order_items.map((item) => (
          <div key={item.id} className="text-sm">
            <div className="flex items-center justify-between">
              <p className="text-stone-800 font-semibold">{item.app_name} <span className="text-stone-500 font-medium">· {item.variant_label}</span></p>
              <p className="text-stone-800 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(item.price * item.qty)}</p>
            </div>
            {order.status === "paid" && (
              item.delivered_content ? (
                <div className="mt-1.5 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-2">
                  <p className="text-emerald-800 text-xs font-mono flex-1 break-all">{item.delivered_content}</p>
                  <button onClick={() => copy(item.delivered_content, item.id)} className="shrink-0 text-emerald-700">
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-amber-600 text-xs font-medium">Lagi diproses, akun segera dikirim admin</p>
              )
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-orange-100 pt-2">
        <span className="text-stone-500 text-xs font-medium">Total</span>
        <span className="text-stone-800 text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(total)}</span>
      </div>
    </div>
  );
}

export default function PrembymellApp() {
  const [view, setView] = useState("home");
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [activeApp, setActiveApp] = useState(null);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [contact, setContact] = useState(() => localStorage.getItem(CONTACT_STORAGE_KEY) || "");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const filteredApps = useMemo(() => {
    const byCategory = category === "Semua" ? APPS : APPS.filter((a) => a.cat === category);
    const q = search.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((a) => a.name.toLowerCase().includes(q) || a.cat.toLowerCase().includes(q));
  }, [category, search]);

  async function loadOrders() {
    if (!contact) return;
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/get-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memuat riwayat");
      setOrders(data.orders || []);
    } catch (e) {
      setOrdersError(typeof e.message === "string" ? e.message : "Gagal memuat riwayat");
    } finally {
      setOrdersLoading(false);
    }
  }

  function openOrders() {
    setView("orders");
    if (contact) loadOrders();
  }

  function saveContact(value) {
    setContact(value);
    localStorage.setItem(CONTACT_STORAGE_KEY, value);
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.variant.price * i.qty, 0);

  function openApp(app) {
    setActiveApp(app);
    setActiveVariantIdx(0);
    setView("detail");
  }

  function addToCart(app, variant) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.app.id === app.id && i.variant.label === variant.label);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { app, variant, qty: 1 }];
    });
    setToast(`${app.name} (${variant.label}) ditambahkan`);
    setTimeout(() => setToast(""), 1800);
  }

  function changeQty(idx, delta) {
    setCart((prev) => {
      const next = [...prev];
      const q = next[idx].qty + delta;
      if (q <= 0) return next.filter((_, i) => i !== idx);
      next[idx] = { ...next[idx], qty: q };
      return next;
    });
  }

  async function handleCheckout() {
    if (!contact.trim()) {
      setToast("Isi nomor WhatsApp dulu ya, buat lacak pesanan");
      setTimeout(() => setToast(""), 2200);
      return;
    }
    setCheckingOut(true);
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          contact: contact.trim(),
          cart: cart.map((i) => ({
            app_id: i.app.id,
            app_name: i.app.name,
            variant_label: i.variant.label,
            price: i.variant.price,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : JSON.stringify(data.error) || "Gagal membuat order";
        throw new Error(msg);
      }

      const itemLines = cart
        .map((i) => `- ${i.app.name} (${i.variant.label}) x${i.qty} = ${rupiah(i.variant.price * i.qty)}`)
        .join("\n");
      setPendingOrder({ order_code: data.order_code, total_amount: data.total_amount, itemLines });
      setCart([]);
    } catch (e) {
      setToast(typeof e.message === "string" ? e.message : "Gagal checkout, coba lagi");
      setTimeout(() => setToast(""), 2500);
    } finally {
      setCheckingOut(false);
    }
  }

  function confirmPaid() {
    if (!pendingOrder) return;
    const message =
      `Halo, mau konfirmasi pesanan ${pendingOrder.order_code}\n\n${pendingOrder.itemLines}\n\nTotal: ${rupiah(pendingOrder.total_amount)}\n` +
      `Saya sudah bayar via QRIS, ini bukti transfernya:`;
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setPendingOrder(null);
  }

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Quicksand:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
      `}</style>
      <div
        className="w-full max-w-sm min-h-screen relative flex flex-col"
        style={{
          fontFamily: "'Quicksand', sans-serif",
          backgroundColor: "#FFF7ED",
          backgroundImage:
            "linear-gradient(rgba(194,120,73,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(194,120,73,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >

        {/* Header */}
        <div className="sticky top-0 z-20 bg-orange-50/90 backdrop-blur border-b-2 border-orange-200 px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {view !== "home" && (
              <button onClick={() => setView(view === "cart" ? "home" : "home")} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-stone-800">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <p className="text-stone-800 font-extrabold text-xl leading-none" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Prembymell</p>
              <p className="text-stone-500 text-[11px] font-medium border-l border-orange-200 pl-2 leading-snug">Akun premium,<br />harga hemat</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openOrders} className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600">
              <History className="w-4 h-4" />
            </button>
            <button onClick={() => setView("cart")} className="relative w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-600">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* HOME */}
        {view === "home" && (
          <div className="px-4 pb-28 pt-4 flex flex-col gap-5">
            <MemberCard app={null} variant={null} />

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari aplikasi, misal Netflix..."
                className="w-full bg-white border-2 border-orange-100 rounded-xl pl-10 pr-9 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-pink-300"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <p className="text-stone-700 font-bold text-sm mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Kategori</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      category === c ? "bg-pink-500 text-white shadow-sm" : "bg-white text-stone-500 border border-orange-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-stone-700 font-bold text-sm mb-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Pilih Aplikasi</p>
              {filteredApps.length === 0 ? (
                <p className="text-stone-500 text-sm text-center py-10">Gak ketemu aplikasinya 🥲</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredApps.map((app) => (
                    <AppCard key={app.id} app={app} onOpen={openApp} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAIL */}
        {view === "detail" && activeApp && (
          <div className="px-4 pb-28 pt-4 flex flex-col gap-5">
            <MemberCard app={activeApp} variant={activeApp.variants[activeVariantIdx]} />

            <div>
              <p className="text-stone-800 font-bold text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>{activeApp.name}</p>
              <p className="text-stone-500 text-xs mt-1">{activeApp.tagline}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-stone-700 font-bold text-sm" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Pilih Paket</p>
              {activeApp.variants.map((v, i) => {
                const active = i === activeVariantIdx;
                return (
                  <button
                    key={v.label}
                    onClick={() => setActiveVariantIdx(i)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 border-2 transition-colors ${
                      active ? "bg-pink-50 border-pink-400" : "bg-white border-orange-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? "bg-pink-500 border-pink-500" : "border-stone-300"}`}>
                        {active && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <p className="text-stone-800 text-sm font-semibold text-left">{v.label}</p>
                    </div>
                    <p className="text-stone-800 text-sm font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(v.price)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CART */}
        {view === "cart" && (
          <div className="px-4 pb-28 pt-4 flex flex-col gap-4">
            <p className="text-stone-800 font-bold text-base flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              <ShoppingCart className="w-4 h-4" /> Keranjang
            </p>

            {cart.length === 0 && (
              <div className="text-center py-16">
                <p className="text-stone-500 text-sm">Keranjang masih kosong</p>
                <button onClick={() => setView("home")} className="mt-3 text-pink-600 text-sm font-bold">Mulai pilih akun →</button>
              </div>
            )}

            {cart.map((item, idx) => (
              <div key={idx} className="rounded-xl bg-white border-2 border-orange-100 p-3 flex items-center gap-3 shadow-sm">
                <AppIcon app={item.app} size="w-10 h-10" />
                <div className="flex-1 min-w-0">
                  <p className="text-stone-800 text-sm font-semibold truncate">{item.app.name}</p>
                  <p className="text-stone-500 text-[11px]">{item.variant.label}</p>
                  <p className="text-pink-600 text-sm font-bold mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(item.variant.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeQty(idx, -1)} className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-stone-600">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-stone-800 text-sm w-4 text-center font-semibold">{item.qty}</span>
                  <button onClick={() => changeQty(idx, 1)} className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-stone-600">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="rounded-xl bg-white border-2 border-orange-100 p-4 flex items-center justify-between shadow-sm">
                  <span className="text-stone-500 text-sm font-medium">Total ({cartCount} item)</span>
                  <span className="text-stone-800 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(cartTotal)}</span>
                </div>
                <button
                  onClick={() => setCart([])}
                  className="flex items-center justify-center gap-1.5 text-rose-500 text-xs font-bold py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kosongkan keranjang
                </button>
                <div className="rounded-xl bg-white border-2 border-orange-100 p-4 shadow-sm">
                  <p className="text-stone-500 text-[11px] mb-2 font-medium">Nomor WhatsApp (buat lacak & terima akun)</p>
                  <input
                    value={contact}
                    onChange={(e) => saveContact(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    inputMode="tel"
                    className="w-full bg-orange-50 border-2 border-orange-100 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-pink-300"
                  />
                </div>
                <div className="rounded-xl bg-white border-2 border-orange-100 p-4 shadow-sm flex items-center gap-3">
                  <img src={qrisImage} alt="QRIS" className="w-12 h-12 rounded-lg object-cover border border-orange-100" />
                  <div>
                    <p className="text-stone-800 text-xs font-bold">Bayar via QRIS</p>
                    <p className="text-stone-500 text-[11px] font-medium">Kode QR muncul setelah kamu tekan Bayar Sekarang</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* RIWAYAT PESANAN */}
        {view === "orders" && (
          <div className="px-4 pb-28 pt-4 flex flex-col gap-4">
            <p className="text-stone-800 font-bold text-base flex items-center gap-2" style={{ fontFamily: "'Baloo 2', sans-serif" }}>
              <History className="w-4 h-4" /> Riwayat Pesanan
            </p>

            <div className="rounded-xl bg-white border-2 border-orange-100 p-4 shadow-sm flex flex-col gap-2">
              <p className="text-stone-500 text-[11px] font-medium">Cek pesanan pakai nomor WhatsApp</p>
              <div className="flex gap-2">
                <input
                  value={contact}
                  onChange={(e) => saveContact(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  className="flex-1 bg-orange-50 border-2 border-orange-100 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-pink-300"
                />
                <button onClick={loadOrders} className="shrink-0 bg-pink-500 text-white text-xs font-bold px-4 rounded-lg">Cek</button>
              </div>
            </div>

            {ordersLoading && <p className="text-stone-500 text-sm text-center py-8">Memuat...</p>}
            {ordersError && <p className="text-rose-500 text-sm text-center py-4">{ordersError}</p>}
            {!ordersLoading && !ordersError && contact && orders.length === 0 && (
              <p className="text-stone-500 text-sm text-center py-8">Belum ada pesanan buat nomor ini</p>
            )}

            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="fixed bottom-0 w-full max-w-sm px-4 pb-4 pt-3 bg-gradient-to-t from-orange-50 via-orange-50 to-transparent">
          {view === "detail" && activeApp && (
            <button
              onClick={() => addToCart(activeApp, activeApp.variants[activeVariantIdx])}
              className="w-full bg-pink-500 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md shadow-pink-200"
            >
              <Plus className="w-4 h-4" /> Tambah ke Keranjang
            </button>
          )}
          {view === "cart" && cart.length > 0 && (
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md shadow-emerald-200"
            >
              <MessageCircle className="w-4 h-4" /> {checkingOut ? "Memproses..." : "Bayar Sekarang"}
            </button>
          )}
          {view === "home" && (
            <div className="flex items-center justify-center gap-1.5 text-stone-400 text-[11px] font-medium">
              <Home className="w-3.5 h-3.5" /> Prembymell &middot; proses instan setelah bayar
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-30">
            {toast}
          </div>
        )}

        {/* Modal QRIS */}
        {pendingOrder && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-6">
            <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-5 flex flex-col items-center gap-3 max-h-[90vh] overflow-y-auto">
              <p className="text-stone-800 font-bold text-base" style={{ fontFamily: "'Baloo 2', sans-serif" }}>Scan QRIS buat Bayar</p>
              <p className="text-stone-500 text-[11px] font-medium -mt-2">Order {pendingOrder.order_code}</p>
              <img src={qrisImage} alt="QRIS Pembayaran" className="w-full rounded-xl border-2 border-orange-100" />
              <div className="w-full flex items-center justify-between bg-orange-50 rounded-lg px-3 py-2">
                <span className="text-stone-500 text-xs font-medium">Total Bayar</span>
                <span className="text-stone-800 font-bold text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rupiah(pendingOrder.total_amount)}</span>
              </div>
              <p className="text-stone-500 text-[11px] text-center leading-snug">
                Scan pakai aplikasi e-wallet/m-banking apa saja, bayar sesuai nominal di atas, lalu kirim bukti transfer lewat WhatsApp.
              </p>
              <button
                onClick={confirmPaid}
                className="w-full bg-emerald-500 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md shadow-emerald-200"
              >
                <MessageCircle className="w-4 h-4" /> Sudah Bayar, Kirim Bukti
              </button>
              <button onClick={() => setPendingOrder(null)} className="text-stone-400 text-xs font-medium py-1">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
