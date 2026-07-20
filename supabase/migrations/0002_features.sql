-- Kolom buat nyimpen konten akun yang dikirim ke pembeli (email/password/kode dsb)
alter table order_items add column if not exists delivered_content text;

-- Stok akun siap kirim (dipakai buat pengiriman otomatis setelah bayar)
create table if not exists credentials (
  id bigint generated always as identity primary key,
  app_id text not null,
  variant_label text not null,
  content text not null, -- isi akun: email/pass/kode, bebas format teks
  is_used boolean not null default false,
  order_item_id bigint references order_items(id),
  created_at timestamptz not null default now()
);
create index if not exists credentials_lookup on credentials (app_id, variant_label, is_used);

-- Ambil 1 kredensial yang belum dipakai buat app_id + variant tertentu, lalu tandai "used"
-- Dipakai otomatis pas order lunas. Aman dari race condition (row lock).
create or replace function claim_credential(p_app_id text, p_variant_label text, p_order_item_id bigint)
returns text as $$
declare
  v_id bigint;
  v_content text;
begin
  select id, content into v_id, v_content
  from credentials
  where app_id = p_app_id and variant_label = p_variant_label and is_used = false
  order by id asc
  limit 1
  for update skip locked;

  if v_id is null then
    return null;
  end if;

  update credentials set is_used = true, order_item_id = p_order_item_id where id = v_id;
  return v_content;
end;
$$ language plpgsql;
