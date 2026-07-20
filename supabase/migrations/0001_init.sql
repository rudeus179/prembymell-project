-- Stok per app + varian
create table if not exists stock (
  id bigint generated always as identity primary key,
  app_id text not null,
  variant_label text not null,
  stock_qty integer not null default 999,
  unique (app_id, variant_label)
);

-- Order (1 order = 1 transaksi checkout)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending', -- pending | paid | failed
  total_amount integer not null,
  customer_contact text,
  midtrans_order_id text unique,
  payment_type text
);

-- Item di dalam satu order
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references orders(id) on delete cascade,
  app_id text not null,
  app_name text not null,
  variant_label text not null,
  price integer not null,
  qty integer not null
);

-- Fungsi buat potong stok setelah pembayaran lunas
create or replace function decrement_stock(p_app_id text, p_variant_label text, p_qty integer)
returns void as $$
begin
  update stock
  set stock_qty = greatest(stock_qty - p_qty, 0)
  where app_id = p_app_id and variant_label = p_variant_label;
end;
$$ language plpgsql;
