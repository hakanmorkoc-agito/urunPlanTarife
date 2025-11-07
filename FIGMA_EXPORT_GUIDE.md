# Figma Export Rehberi

Bu rehber, React uygulamasını Figma design dosyasına dönüştürmek için kullanabileceğiniz yöntemleri içerir.

## 🎯 En Pratik Yöntemler

### Yöntem 1: HTML to Figma Browser Extension (ÖNERİLEN)

**html.to.design** - En popüler ve etkili yöntem

#### Adımlar:
1. Chrome/Edge için [html.to.design](https://www.figma.com/community/plugin/1159123024924461424/html-to-design) extension'ını yükleyin
2. Uygulamayı development modunda çalıştırın: `npm run dev`
3. Her sayfayı ayrı ayrı açın:
   - Dashboard: `http://localhost:5173/dashboard`
   - Ürün Tarife Plan Tanımları: `http://localhost:5173/urun-tarife-tanimlari`
   - Plan Tanımı: `http://localhost:5173/plan-tanimi`
4. Browser extension'ı açın ve "Import to Figma" butonuna tıklayın
5. Figma'da yeni bir dosya açılacak ve tasarım otomatik olarak import edilecek

**Avantajları:**
- ✅ Tüm componentler, renkler ve spacing'ler korunur
- ✅ Text stilleri ve fontlar aktarılır
- ✅ Layout yapısı korunur
- ✅ Hızlı ve otomatik

**Dezavantajları:**
- ⚠️ Bazı complex componentler (chart'lar, modals) tam olarak aktarılmayabilir
- ⚠️ Interactive elementler (hover states, animations) aktarılmaz

---

### Yöntem 2: Screenshot + Figma Import

#### Adımlar:
1. Uygulamayı çalıştırın: `npm run dev`
2. Her sayfayı tam ekran screenshot alın:
   - Dashboard
   - Ürün Tarife Plan Tanımları (liste görünümü)
   - Plan Tanımı (her step için ayrı screenshot)
   - Modals (Product Definition Modal, APilot Modal)
3. Figma'da yeni bir dosya oluşturun
4. Screenshot'ları Figma'ya sürükleyip bırakın
5. Her screenshot için:
   - "Place Image" ile ekleyin
   - Layer adını sayfa/component adıyla değiştirin
   - Gerekirse "Auto Layout" ekleyin

**Avantajları:**
- ✅ Görsel olarak tam uyumlu
- ✅ Tüm detaylar görünür
- ✅ Hızlı ve basit

**Dezavantajları:**
- ⚠️ Editable değil (sadece görsel)
- ⚠️ Text'ler seçilemez
- ⚠️ Component yapısı yok

---

### Yöntem 3: Figma Plugin - html.to.design (Figma İçinden)

#### Adımlar:
1. Figma'da yeni bir dosya açın
2. Plugins > Browse all plugins
3. "html.to.design" plugin'ini yükleyin
4. Plugin'i açın
5. Uygulamanın URL'ini girin (örn: `http://localhost:5173/dashboard`)
6. "Import" butonuna tıklayın

**Not:** Bu yöntem için uygulamanın internet üzerinden erişilebilir olması gerekir (ngrok, localtunnel vb.)

---

### Yöntem 4: Manuel Recreate (En Detaylı)

Eğer yukarıdaki yöntemler yeterli değilse, tasarımları manuel olarak Figma'da yeniden oluşturabilirsiniz.

#### Gerekli Bilgiler:
- **Renkler:** `src/index.css` veya Tailwind config'den
- **Fontlar:** `index.html` veya CSS'den
- **Spacing:** Component kodlarından
- **Component yapısı:** React component'lerinden

---

## 📋 Export Edilmesi Gereken Sayfalar

### 1. Dashboard
- URL: `/dashboard`
- İçerik: StatCard'lar, Donut chart'lar

### 2. Ürün Tarife Plan Tanımları
- URL: `/urun-tarife-tanimlari`
- İçerik: Liste görünümü, filtre popover, pagination
- Modals:
  - Yeni Ürün Tanımı Modal (new mode)
  - Ürün Kataloğu Modal (catalog mode)
  - APilot Modal

### 3. Plan Tanımı
- URL: `/plan-tanimi`
- İçerik: Stepper, form alanları (her step için)
- Önemli: 20+ step olduğu için her step ayrı export edilebilir

---

## 🛠️ Yardımcı Araçlar

### Screenshot Alma Script'i
`scripts/screenshot.js` dosyasını kullanarak otomatik screenshot alabilirsiniz.

### Browser DevTools
- Element seçerek exact dimensions alabilirsiniz
- Computed styles'ı kopyalayabilirsiniz

---

## 💡 Öneriler

1. **İlk deneme için:** Yöntem 1 (html.to.design extension) en pratik
2. **Detaylı tasarım için:** Yöntem 2 (Screenshot) + Yöntem 4 (Manuel düzenleme)
3. **Component library için:** Yöntem 1 ile import edip, sonra component'leri düzenleyin

---

## 🔧 Troubleshooting

### Problem: Extension çalışmıyor
**Çözüm:** Uygulamanın `localhost` yerine gerçek bir URL'de çalışması gerekebilir. Ngrok kullanın:
```bash
ngrok http 5173
```

### Problem: Stil'ler yanlış görünüyor
**Çözüm:** Tailwind CSS class'ları bazen doğru aktarılmaz. Manuel olarak düzenleyin.

### Problem: Chart'lar görünmüyor
**Çözüm:** Recharts SVG'leri bazen aktarılmaz. Screenshot yöntemini kullanın.

---

## 📝 Checklist

- [ ] Dashboard export edildi
- [ ] Ürün Tarife Plan Tanımları export edildi
- [ ] Plan Tanımı (tüm step'ler) export edildi
- [ ] Modals export edildi
- [ ] Component'ler organize edildi
- [ ] Renk paleti oluşturuldu
- [ ] Text stilleri tanımlandı
- [ ] Spacing sistem'i oluşturuldu

