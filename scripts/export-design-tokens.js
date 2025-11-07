/**
 * Design Tokens Export Script
 * 
 * Bu script, uygulamanın renk, spacing ve typography bilgilerini
 * Figma'da kullanabileceğiniz bir JSON formatında export eder.
 * 
 * Kullanım: node scripts/export-design-tokens.js
 */

const fs = require('fs');
const path = require('path');

// Tailwind config'den veya CSS'den renkleri çıkar
// Bu örnekte manuel olarak tanımlanmış renkler kullanılıyor
// Gerçek projede tailwind.config.js'den parse edilebilir

const designTokens = {
  colors: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    sidebar: {
      dark: '#8746FA',      // Sidebar mor tonu
      light: '#9B6BFB',     // Aktif item için açık mor
      hover: '#9B6BFB',     // Hover rengi
    },
    button: {
      primary: '#1A72FB',   // Buton rengi
      secondary: '#1A72FB',
    },
    chart: {
      green: '#10b981',      // Aktif ürün
      red: '#ef4444',        // Pasif ürün
      blue: '#3b82f6',       // BES ürün
      orange: '#f97316',     // Hayat ürün
      purple: '#a855f7',     // Sağlık ürün
      teal: '#06b6d4',       // Bireysel sözleşme
      pink: '#ec4899',       // Grup sözleşme
      emerald: '#10b981',    // Kurumsal sözleşme
    },
    background: {
      white: '#FFFFFF',
      gray50: '#F9FAFB',
      gray100: '#F3F4F6',
    },
    border: {
      gray200: '#E5E7EB',
      gray300: '#D1D5DB',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  typography: {
    fontFamily: {
      sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  layout: {
    sidebarWidth: '3.5rem',  // 56px
    headerHeight: '4rem',    // 64px
  },
};

// JSON dosyasını oluştur
const outputPath = path.join(__dirname, '../design-tokens.json');
fs.writeFileSync(
  outputPath,
  JSON.stringify(designTokens, null, 2),
  'utf-8'
);

console.log('✅ Design tokens export edildi!');
console.log(`📁 Dosya: ${outputPath}`);
console.log('\n📋 Figma\'da kullanım:');
console.log('1. Figma\'da yeni bir dosya açın');
console.log('2. Variables > Create variable set');
console.log('3. JSON dosyasını import edin veya manuel olarak ekleyin');

