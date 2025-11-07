/**
 * Screenshot Alma Script'i
 * 
 * Bu script, uygulamanın tüm sayfalarının screenshot'larını alır.
 * 
 * Kullanım:
 * 1. npm run dev ile uygulamayı çalıştırın
 * 2. Bu script'i çalıştırın: node scripts/screenshot.js
 * 
 * Gereksinimler:
 * - puppeteer: npm install --save-dev puppeteer
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, '../screenshots');

// Export edilecek sayfalar
const pages = [
  {
    name: 'dashboard',
    url: '/dashboard',
    waitFor: 2000, // Chart'ların yüklenmesi için bekleme süresi
  },
  {
    name: 'urun-tarife-tanimlari',
    url: '/urun-tarife-tanimlari',
    waitFor: 1000,
  },
  {
    name: 'plan-tanimi',
    url: '/plan-tanimi',
    waitFor: 2000,
  },
];

// Screenshot klasörünü oluştur
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshot() {
  console.log('🚀 Browser başlatılıyor...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();

  for (const pageConfig of pages) {
    try {
      console.log(`📸 ${pageConfig.name} screenshot alınıyor...`);
      
      const fullUrl = `${BASE_URL}${pageConfig.url}`;
      await page.goto(fullUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Sayfanın yüklenmesi için bekle
      await page.waitForTimeout(pageConfig.waitFor);

      // Full page screenshot
      const screenshotPath = path.join(OUTPUT_DIR, `${pageConfig.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`✅ ${pageConfig.name} kaydedildi: ${screenshotPath}`);
    } catch (error) {
      console.error(`❌ ${pageConfig.name} için hata:`, error.message);
    }
  }

  await browser.close();
  console.log('✨ Tüm screenshot\'lar alındı!');
  console.log(`📁 Klasör: ${OUTPUT_DIR}`);
}

// Script'i çalıştır
takeScreenshot().catch(console.error);

