-- Ürün Tarife Plan Tanımları Tablosu
CREATE TABLE IF NOT EXISTS product_tariff_plans (
  id BIGSERIAL PRIMARY KEY,
  ulke VARCHAR(100) NOT NULL,
  dil VARCHAR(50) NOT NULL,
  brans VARCHAR(100) NOT NULL,
  durum VARCHAR(50) DEFAULT 'Draft',
  urun_kodu VARCHAR(100) UNIQUE NOT NULL,
  urun_adi VARCHAR(200) NOT NULL,
  urun_uzun_adi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Planlar Tablosu
CREATE TABLE IF NOT EXISTS plans (
  id BIGSERIAL PRIMARY KEY,
  product_tariff_plan_id BIGINT REFERENCES product_tariff_plans(id) ON DELETE CASCADE,
  brans VARCHAR(100) NOT NULL,
  ulke VARCHAR(100) NOT NULL,
  dil VARCHAR(50) NOT NULL,
  sozlesme_tipi VARCHAR(50),
  plan_kodu VARCHAR(100) NOT NULL,
  plan_versiyon_no VARCHAR(20) DEFAULT '0',
  plan_kisa_adi VARCHAR(200),
  plan_uzun_adi TEXT,
  basvuru_tipi VARCHAR(50),
  kategori_kodu VARCHAR(100),
  zimmet_tipi VARCHAR(100),
  baslangic_tarihi DATE,
  bitis_tarihi DATE,
  durum VARCHAR(50) DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürünler Tablosu (Dashboard istatistikleri için)
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'BES', 'Hayat', 'Sağlık'
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'passive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sözleşmeler Tablosu (Dashboard istatistikleri için)
CREATE TABLE IF NOT EXISTS contracts (
  id BIGSERIAL PRIMARY KEY,
  contract_type VARCHAR(50) NOT NULL, -- 'Bireysel', 'Grup', 'Kurumsal'
  plan_id BIGINT REFERENCES plans(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_product_tariff_plans_urun_kodu ON product_tariff_plans(urun_kodu);
CREATE INDEX IF NOT EXISTS idx_product_tariff_plans_durum ON product_tariff_plans(durum);
CREATE INDEX IF NOT EXISTS idx_plans_plan_kodu ON plans(plan_kodu);
CREATE INDEX IF NOT EXISTS idx_plans_durum ON plans(durum);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_contracts_type ON contracts(contract_type);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_product_tariff_plans_updated_at BEFORE UPDATE ON product_tariff_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veri ekleme (opsiyonel)
INSERT INTO products (name, type, status) VALUES
  ('BES Plan 1', 'BES', 'active'),
  ('BES Plan 2', 'BES', 'active'),
  ('Hayat Sigortası 1', 'Hayat', 'active'),
  ('Sağlık Sigortası 1', 'Sağlık', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO contracts (contract_type) VALUES
  ('Bireysel'),
  ('Bireysel'),
  ('Grup'),
  ('Kurumsal')
ON CONFLICT DO NOTHING;

