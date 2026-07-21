// Daftar aplikasi, varian, dan kategori. Dipakai bareng oleh App.jsx (toko) dan Admin.jsx (panel admin).
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

export { APPS, CATEGORIES };
