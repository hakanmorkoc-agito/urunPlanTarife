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

## Production Deployment

### Build Oluşturma

```bash
npm run build
```

Build dosyaları `dist` klasörüne oluşturulacaktır.

### Environment Variables

Production ortamında `.env` dosyası oluşturun veya hosting platformunuzun environment variables ayarlarına şunları ekleyin:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Deployment Seçenekleri

#### 1. Vercel

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment variables'ları ekleyin
4. Deploy edin

`vercel.json` dosyası otomatik olarak yapılandırılmıştır.

#### 2. Netlify

1. [Netlify](https://netlify.com) hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables'ları ekleyin
6. Deploy edin

`netlify.toml` dosyası otomatik olarak yapılandırılmıştır.

#### 3. Apache Server

1. `dist` klasöründeki dosyaları web sunucunuza yükleyin
2. `.htaccess` dosyası otomatik olarak SPA routing'i yönetir
3. Apache'de `mod_rewrite` modülünün aktif olduğundan emin olun

#### 4. Nginx

Nginx için `nginx.conf` örneği:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 5. Diğer Static Hosting

- **GitHub Pages**: `dist` klasörünü `gh-pages` branch'ine push edin
- **AWS S3 + CloudFront**: S3 bucket'a `dist` klasörünü yükleyin
- **Azure Static Web Apps**: GitHub Actions ile otomatik deploy

### Önemli Notlar

- ✅ SPA routing için `_redirects` (Netlify) veya `.htaccess` (Apache) dosyaları hazır
- ✅ Production build'de console.log'lar otomatik olarak kaldırılır
- ✅ Code splitting ve lazy loading optimize edilmiştir
- ✅ Asset caching headers yapılandırılmıştır
- ⚠️ Supabase CORS ayarlarını production domain'iniz için yapılandırmayı unutmayın

### Supabase CORS Ayarları

Supabase Dashboard > Settings > API > CORS:
- Production domain'inizi ekleyin (örn: `https://your-domain.com`)

## Lisans

MIT
