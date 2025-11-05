import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Star, Settings, Layers } from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const menuItems = [
    { icon: Home, path: '/dashboard', label: 'Dashboard' },
    {
      icon: Layers,
      path: '/urun-tarife-tanimlari',
      label: 'Ürün Tarife Plan Tanımları',
      active: true,
      submenu: [
        { label: 'Yeni Ürün Tarife Plan Tanım', path: '/urun-tarife-tanimlari' },
        { label: 'Ürün Kataloğu', path: '/urun-tarife-tanimlari' },
        { label: 'Teminat Havuzu', path: '/urun-tarife-tanimlari' },
        { label: 'Kloz Havuzu', path: '/urun-tarife-tanimlari' },
        { label: 'Soru Havuzu', path: '/urun-tarife-tanimlari' },
        { label: 'Prim Formülleri', path: '/urun-tarife-tanimlari' },
        { label: 'Ürün Kural Havuzu', path: '/urun-tarife-tanimlari' },
        { label: 'Networkler', path: '/urun-tarife-tanimlari' },
        { label: 'Fon Tanımları', path: '/urun-tarife-tanimlari' }
      ]
    },
    { icon: Search, path: '/search', label: 'Ara' },
    { icon: Star, path: '/favorites', label: 'Favoriler' },
    { icon: Settings, path: '/settings', label: 'Ayarlar' },
  ]

  const isItemActive = (itemPath, active) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/' || location.pathname.startsWith('/dashboard')
    }
    return location.pathname.includes(itemPath) || active
  }

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setActiveSubmenu((prev) => (prev === item.path ? null : item.path))
      return
    }

    if (item.path) {
      setActiveSubmenu(null)
      navigate(item.path)
    }
  }

  const handleSubmenuClick = (submenuItem) => {
    navigate(submenuItem.path)
    setActiveSubmenu(null)
  }

  return (
    <aside className="relative z-20 w-16 flex flex-col items-center py-8 bg-[#8746FA] text-white shadow-lg">
      {/* Menu */}
      <nav className="flex-1 flex flex-col items-center space-y-3 w-full">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = isItemActive(item.path, item.active)

          return (
            <button
              key={index}
              onClick={() => handleMenuClick(item)}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#8746FA] shadow shadow-black/20'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#8746FA]' : 'text-white'}`} strokeWidth={1.8} />
              <span className="pointer-events-none absolute left-14 whitespace-nowrap bg-black/85 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {activeSubmenu && (
        <div className="absolute left-full top-10 ml-4 w-64 rounded-xl bg-white text-gray-800 shadow-xl border border-[#8746FA]/10">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#8746FA]">Ürün Tarife Plan Tanımları</h2>
          </div>
          <ul className="py-2">
            {menuItems
              .find((item) => item.path === activeSubmenu)?.submenu?.map((submenuItem) => (
                <li key={submenuItem.label}>
                  <button
                    onClick={() => handleSubmenuClick(submenuItem)}
                    className="flex w-full items-center space-x-2 px-5 py-2 text-sm text-gray-700 hover:bg-[#8746FA]/10 hover:text-[#8746FA] transition"
                  >
                    <span className="text-lg leading-none">+</span>
                    <span>{submenuItem.label}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

export default Sidebar

