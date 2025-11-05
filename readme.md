# Ürün Plan Tarife Tanımları

Modern bir React uygulaması ile ürün tarife plan tanımları yönetim sistemi.

## Özellikler

- 📊 Dashboard sayfası ile istatistik görüntüleme (Donut chart'lar)
- 📋 Ürün tarife plan tanımları listeleme ve arama
- ➕ Yeni ürün tanımlama (3 farklı yöntem)
- 📝 7 adımlı plan tanımlama formu
- 🔐 Supabase database entegrasyonu
- 🎨 Modern ve responsive tasarım

## Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Supabase yapılandırması

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. `supabase/schema.sql` dosyasındaki SQL komutlarını Supabase SQL Editor'de çalıştırın
4. `.env.example` dosyasını `.env` olarak kopyalayın:
   ```bash
   cp .env.example .env
   ```
5. `.env` dosyasına Supabase bilgilerinizi ekleyin:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Uygulamayı çalıştırın

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## Proje Yapısı

```
src/
├── components/          # React componentleri
│   ├── Layout.jsx      # Ana layout
│   ├── Sidebar.jsx     # Sol sidebar navigasyon
│   ├── Header.jsx      # Üst header
│   ├── StatCard.jsx    # Dashboard istatistik kartları
│   └── ProductDefinitionModal.jsx  # Ürün tanımlama modal
├── pages/              # Sayfa componentleri
│   ├── Dashboard.jsx   # Dashboard sayfası
│   ├── ProductTariffDefinitions.jsx  # Ürün listesi
│   └── PlanDefinition.jsx  # Plan tanımlama formu
├── lib/
│   └── supabase.js     # Supabase client yapılandırması
└── App.jsx             # Ana uygulama
```

## Veritabanı Şeması

Uygulama aşağıdaki tabloları kullanır:

- `product_tariff_plans`: Ürün tarife plan tanımları
- `plans`: Plan detayları
- `products`: Ürünler (dashboard istatistikleri için)
- `contracts`: Sözleşmeler (dashboard istatistikleri için)

Detaylı şema için `supabase/schema.sql` dosyasına bakın.

## Kullanılan Teknolojiler

- React 18
- Vite
- React Router
- Supabase
- Recharts (chart'lar için)
- Tailwind CSS
- Lucide React (ikonlar için)

## Geliştirme

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Lisans

MIT
