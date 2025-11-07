# 🎨 Figma Export Rehberi

React uygulamanızı Figma design dosyasına dönüştürmek için hazırlanmış rehber.

## 🚀 Hızlı Başlangıç

**En pratik yöntem:** Browser extension kullanarak HTML'i direkt Figma'ya import etmek.

### 1. html.to.design Extension (ÖNERİLEN)

#### Kurulum:
1. Chrome/Edge için: [html.to.design Extension](https://chrome.google.com/webstore/detail/html-to-design/...)
2. Veya Figma Plugin: Figma > Plugins > Browse > "html.to.design"

#### Kullanım:
```bash
# 1. Uygulamayı çalıştırın
npm run dev

# 2. Her sayfayı tarayıcıda açın:
# - http://localhost:5173/dashboard
# - http://localhost:5173/urun-tarife-tanimlari
# - http://localhost:5173/plan-tanimi

# 3. Extension'ı açın ve "Import to Figma" butonuna tıklayın
```

**Avantajları:**
- ✅ Otomatik import
- ✅ Component yapısı korunur
- ✅ Renkler ve spacing'ler aktarılır
- ✅ Hızlı ve kolay

---

## 📸 Alternatif Yöntemler

### Yöntem 2: Screenshot + Figma Import

#### Otomatik Screenshot:
```bash
# Puppeteer yükleyin (ilk kez)
npm install --save-dev puppeteer

# Screenshot'ları alın
npm run screenshot
```

Screenshot'lar `screenshots/` klasörüne kaydedilir. Figma'ya sürükleyip bırakabilirsiniz.

#### Manuel Screenshot:
1. Her sayfayı tarayıcıda açın
2. `F12` > `Ctrl+Shift+P` > "Capture full size screenshot"
3. Screenshot'ları Figma'ya import edin

---

### Yöntem 3: Design Tokens Export

Renk, spacing ve typography bilgilerini export edin:

```bash
node scripts/export-design-tokens.js
```

Bu, `design-tokens.json` dosyası oluşturur. Figma Variables'a import edebilirsiniz.

---

## 📋 Export Edilmesi Gereken Sayfalar

### ✅ Ana Sayfalar
- [ ] **Dashboard** (`/dashboard`)
  - StatCard'lar
  - Donut chart'lar
  
- [ ] **Ürün Tarife Plan Tanımları** (`/urun-tarife-tanimlari`)
  - Liste görünümü
  - Filtre popover
  - Pagination
  
- [ ] **Plan Tanımı** (`/plan-tanimi`)
  - Stepper component
  - Form alanları (her step için)

### ✅ Modals
- [ ] **Yeni Ürün Tanımı Modal** (new mode)
- [ ] **Ürün Kataloğu Modal** (catalog mode)
- [ ] **APilot Modal**

### ✅ Components
- [ ] Sidebar
- [ ] Header
- [ ] FloatingLabelInput
- [ ] FloatingLabelSelect
- [ ] FloatingLabelMultiSelect
- [ ] MethodCard

---

## 🛠️ Yardımcı Dosyalar

- `FIGMA_EXPORT_GUIDE.md` - Detaylı rehber
- `FIGMA_QUICK_START.md` - Hızlı başlangıç
- `scripts/screenshot.js` - Otomatik screenshot script'i
- `scripts/export-design-tokens.js` - Design tokens export

---

## 💡 İpuçları

1. **İlk deneme:** html.to.design extension en hızlı ve pratik
2. **Detaylı tasarım:** Screenshot yöntemi + manuel düzenleme
3. **Component library:** Export edilen tasarımları Figma component'lerine dönüştürün
4. **Design system:** Design tokens'ı Figma Variables'a import edin

---

## ❓ Sorun Giderme

### Extension çalışmıyor
**Çözüm:** Uygulamanın internet üzerinden erişilebilir olması gerekebilir:
```bash
# Ngrok kullanın
ngrok http 5173
```

### Stil'ler yanlış görünüyor
**Çözüm:** Tailwind CSS class'ları bazen doğru aktarılmaz. Manuel olarak düzenleyin.

### Chart'lar görünmüyor
**Çözüm:** Recharts SVG'leri bazen aktarılmaz. Screenshot yöntemini kullanın.

---

## 📚 Daha Fazla Bilgi

Detaylı rehber için `FIGMA_EXPORT_GUIDE.md` dosyasına bakın.

