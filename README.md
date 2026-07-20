# Prembymell App

Project React (Vite + Tailwind + Capacitor) yang otomatis di-build jadi APK Android lewat GitHub Actions — semua bisa dilakukan dari HP, tanpa laptop.

## Cara pakai dari HP (via Termux)

### 1. Buat repo di GitHub
- Buka github.com lewat browser HP, login/daftar
- Buat repo baru, **kosongkan** (jangan centang "Add README")
- Catat URL repo-nya, contoh: `https://github.com/username/prembymell-app.git`

### 2. Install Termux
- Download **Termux** dari F-Droid (bukan Play Store, versi Play Store sudah tidak diupdate): https://f-droid.org/packages/com.termux/
- Buka Termux, jalankan:
  ```
  pkg update && pkg upgrade
  pkg install git
  ```

### 3. Setup identitas git (sekali saja)
```
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

### 4. Pindahkan folder project ini ke HP
- Extract file zip project ini ke folder `Download` di HP
- Di Termux, izinkan akses storage:
  ```
  termux-setup-storage
  ```
- Masuk ke folder project (sesuaikan path hasil extract):
  ```
  cd storage/downloads/prembymell-project
  ```

### 5. Push ke GitHub
```
git init
git add .
git commit -m "Setup awal Prembymell"
git branch -M main
git remote add origin https://github.com/username/prembymell-app.git
git push -u origin main
```
- Nanti diminta login: pakai **Personal Access Token** GitHub sebagai password (bukan password akun biasa). Bikin token di: GitHub → Settings → Developer settings → Personal access tokens → Generate new token (centang scope "repo").

### 6. Build APK otomatis jalan sendiri
- Begitu `git push` berhasil, buka tab **Actions** di repo GitHub kamu (lewat browser)
- Akan ada proses "Build Android APK" jalan otomatis (±3-5 menit)
- Setelah selesai (centang hijau), klik run tersebut → scroll ke bawah ke bagian **Artifacts** → download `prembymell-apk`
- Extract zip-nya, di dalamnya ada `app-debug.apk` — itu APK yang bisa diinstall di HP Android manapun

### 7. Update aplikasi nanti
Setiap kali mau update tampilan/fitur, edit file di `src/App.jsx`, lalu dari Termux:
```
git add .
git commit -m "update tampilan"
git push
```
APK baru otomatis ke-build lagi di Actions.

## Struktur project
```
prembymell-project/
├── .github/workflows/build-apk.yml   ← workflow build APK otomatis
├── src/
│   ├── App.jsx                        ← komponen utama aplikasi
│   ├── main.jsx                       ← entry point React
│   └── index.css                      ← Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── capacitor.config.json
└── postcss.config.js
```

## Deploy sebagai Web App (Vercel) — bisa dibuka dari browser HP

Project ini sekarang juga sudah jadi **PWA** (Progressive Web App) — pembeli bisa buka lewat browser HP tanpa install APK, dan bisa juga "Add to Home Screen" biar kelihatan kayak aplikasi asli.

### Cara deploy (sekali aja, lewat browser HP)
1. Buka **vercel.com**, daftar/login pakai akun GitHub kamu
2. Klik **Add New → Project**, pilih repo project ini
3. Vercel otomatis mendeteksi ini project Vite — biarkan default (Build Command: `vite build`, Output Directory: `dist`)
4. Klik **Deploy**

Setelah itu, setiap kali kamu `git push` dari Termux, Vercel otomatis build & deploy ulang. URL-nya bisa langsung dibagikan ke pembeli (misal `nama-project.vercel.app`), atau disambungkan ke domain sendiri lewat menu **Settings → Domains** di Vercel.

## Setup database & backend (Supabase)

Supaya checkout beneran bisa nyimpen data ke database dan pembeli bisa konfirmasi bayar manual, ada 2 hal yang perlu kamu siapin lewat browser HP (nggak perlu install apa-apa selain yang sudah ada):

### A. Buat project Supabase (gratis)
1. Daftar/login di https://supabase.com/dashboard
2. Buat project baru, catat:
   - **Project Ref** (di URL project atau Settings → General)
   - **Project URL** & **anon/service_role key** (Settings → API)
3. Buat **Access Token** pribadi di https://supabase.com/dashboard/account/tokens

### B. Simpan semua "kunci rahasia" di GitHub (biar workflow bisa deploy otomatis)
Di repo GitHub kamu → **Settings → Secrets and variables → Actions → New repository secret**, tambahin:
| Nama secret | Isinya |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | token dari langkah A.3 |
| `SUPABASE_PROJECT_REF` | project ref dari langkah A.2 |
| `ADMIN_PASSWORD` | bikin password sendiri buat masuk halaman admin toko |

### C. Deploy backend
Setiap kali kamu push (git push) dan ada perubahan di folder `supabase/`, workflow **Deploy Backend (Supabase)** otomatis jalan di tab Actions — bikin tabel database & upload function ke server Supabase kamu.

### D. Sambungkan frontend ke backend
Buka `src/App.jsx` (dan `src/Admin.jsx`), cari baris ini di bagian atas file:
```js
const SUPABASE_FUNCTIONS_URL = "https://GANTI-DENGAN-PROJECT-REF.functions.supabase.co";
```
Ganti `GANTI-DENGAN-PROJECT-REF` dengan project ref Supabase kamu, lalu commit & push lagi (APK juga otomatis kebuild ulang dengan URL yang benar).

### E. Isi stok awal (opsional)
Kalau mau ngatur batas stok tiap produk, buka Supabase Dashboard → **Table Editor → stock**, tambah baris manual, contoh:
| app_id | variant_label | stock_qty |
|---|---|---|
| netflix | Privat - 1 Bulan | 10 |

Kalau baris `app_id + variant_label` belum ada di tabel `stock`, sistem anggap stoknya **tidak terbatas** (nggak dicek).

## Fitur toko

- **Search bar** — pembeli bisa cari aplikasi langsung dari halaman utama.
- **Checkout via QRIS + WhatsApp** — pas klik "Bayar Sekarang", order tersimpan status `pending`, lalu muncul kode QRIS toko buat di-scan pembeli. Setelah bayar, pembeli tekan "Sudah Bayar, Kirim Bukti" dan diarahkan ke chat WhatsApp buat kirim bukti transfer.
- **Riwayat pesanan** — pembeli isi nomor WhatsApp saat checkout, lalu bisa cek status & lihat akun yang sudah dikirim lewat ikon jam di header (fitur "Cek" pakai nomor WA yang sama).
- **Konfirmasi bayar manual** — admin cek bukti transfer yang masuk lewat WhatsApp, lalu tekan **Tandai Lunas** di halaman admin. Sistem otomatis ambil 1 akun dari stok kredensial (kalau ada) dan langsung muncul di halaman riwayat pesanan pembeli. Kalau stok kredensial kosong, admin bisa kirim manual.
- **Halaman admin** — buka `https://domain-toko-kamu/?admin=1`, login pakai `ADMIN_PASSWORD` yang kamu set di secret GitHub. Dari situ bisa:
  - Lihat semua pesanan & tandai lunas setelah bukti transfer dicek
  - Kirim akun manual kalau stok kredensial kosong
  - Atur batas stok tiap paket
  - Isi/hapus stok akun siap kirim (buat pengiriman otomatis) — tempel banyak akun sekaligus, satu baris satu akun

### Setelah semua siap
Nomor WhatsApp (`WHATSAPP_NUMBER`) dipakai buat nerima pesan konfirmasi pembayaran dari pembeli — pastikan nomornya aktif dan kamu rutin cek chat masuk buat konfirmasi lunas di halaman admin.


