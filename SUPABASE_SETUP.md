# Supabase Bağlantı Kurulumu

## Adım 1: Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. Proje oluşturulduktan sonra dashboard'a gidin

## Adım 2: Database Schema Oluşturma

1. Supabase Dashboard'da **SQL Editor** sekmesine gidin
2. `supabase/schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'de yeni bir query oluşturun ve SQL kodlarını yapıştırın
4. **Run** butonuna tıklayın

Bu işlem şu tabloları oluşturacak:
- `product_tariff_plans`
- `plans`
- `products`
- `contracts`

## Adım 3: API Bilgilerini Alma

1. Supabase Dashboard'da **Project Settings** (⚙️) sekmesine gidin
2. **API** bölümüne gidin
3. Şu bilgileri kopyalayın:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## Adım 4: Environment Variables Ayarlama

1. Proje klasöründe `.env` dosyasını açın (veya oluşturun)
2. Aşağıdaki bilgileri ekleyin:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Önemli:** 
- `.env` dosyası git'e commit edilmemeli (zaten `.gitignore`'da)
- Gerçek değerleri kendi Supabase projenizden alın

## Adım 5: Uygulamayı Yeniden Başlatma

```bash
# Development server'ı durdurun (Ctrl+C)
# Sonra yeniden başlatın
npm run dev
```

## Bağlantı Testi

Tarayıcı console'unu açın (F12). Eğer Supabase bağlantısı başarılıysa, herhangi bir uyarı görmeyeceksiniz.

Eğer "⚠️ Supabase bağlantı bilgileri eksik!" uyarısı görürseniz:
1. `.env` dosyasının proje kök dizininde olduğundan emin olun
2. Değişken isimlerinin doğru olduğunu kontrol edin (`VITE_` ile başlamalı)
3. Development server'ı yeniden başlatın

## Sorun Giderme

### "Supabase client başlatılamadı" hatası
- `.env` dosyasını kontrol edin
- Değişken isimlerinin `VITE_` ile başladığından emin olun
- Server'ı yeniden başlatın

### "Table does not exist" hatası
- `supabase/schema.sql` dosyasını Supabase SQL Editor'de çalıştırdığınızdan emin olun
- Tabloların oluşturulduğunu Supabase Dashboard > Table Editor'da kontrol edin

### CORS hatası
- Supabase Dashboard > Settings > API > CORS ayarlarını kontrol edin
- `localhost:5173` ve `127.0.0.1:5173` adreslerinin izin verilenler listesinde olduğundan emin olun

