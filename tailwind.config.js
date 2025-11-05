/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
        // Kullanıcı tarafından belirtilen renkler
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
        }
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

