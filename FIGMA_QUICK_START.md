# 🎨 Figma Export - Hızlı Başlangıç

## ⚡ En Hızlı Yöntem (5 Dakika)

### Adım 1: Browser Extension Yükle
1. Chrome/Edge'de [html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) extension'ını yükleyin
2. Veya Figma'da Plugin olarak yükleyin: Plugins > Browse > "html.to.design"

### Adım 2: Uygulamayı Çalıştır
```bash
npm run dev
```

### Adım 3: Sayfaları Export Et

#### Dashboard
1. `http://localhost:5173/dashboard` adresine gidin
2. Extension'ı açın veya Figma plugin'ini çalıştırın
3. "Import to Figma" butonuna tıklayın

#### Ürün Tarife Plan Tanımları
1. `http://localhost:5173/urun-tarife-tanimlari` adresine gidin
2. Aynı işlemi tekrarlayın

#### Plan Tanımı
1. `http://localhost:5173/plan-tanimi` adresine gidin
2. Her step için ayrı export yapabilirsiniz

---

## 📸 Alternatif: Screenshot Yöntemi

### Adım 1: Screenshot'ları Al

**Manuel:**
- Her sayfayı açın ve `F12` > `Ctrl+Shift+P` > "Capture full size screenshot"

**Otomatik (Script ile):**
```bash
# Önce puppeteer yükleyin
npm install --save-dev puppeteer

# Sonra script'i çalıştırın
npm run screenshot
```

Screenshot'lar `screenshots/` klasörüne kaydedilecek.

### Adım 2: Figma'ya Import Et
1. Figma'da yeni dosya açın
2. Screenshot'ları sürükleyip bırakın
3. Her screenshot için layer adını düzenleyin

---

## 🎨 Design Tokens Export

Renk, spacing ve typography bilgilerini export edin:

```bash
node scripts/export-design-tokens.js
```

Bu, `design-tokens.json` dosyası oluşturur. Figma Variables'a import edebilirsiniz.

---

## 💡 İpuçları

1. **İlk deneme:** html.to.design extension en hızlı
2. **Detaylı tasarım:** Screenshot + manuel düzenleme
3. **Component library:** Export edilen tasarımları component'lere dönüştürün

---

## ❓ Sorun mu Yaşıyorsunuz?

Detaylı rehber için `FIGMA_EXPORT_GUIDE.md` dosyasına bakın.

