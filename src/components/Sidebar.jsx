import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, Star, Settings, Layers } from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: Home, path: '/dashboard', label: 'Dashboard' },
    { icon: Layers, path: '/urun-tarife-tanimlari', label: 'Ürün Tarife Plan Tanımları', active: true },
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

  return (
    <aside className="w-16 flex flex-col items-center py-8 bg-[#8746FA] text-white shadow-lg">
      {/* Menu */}
      <nav className="flex-1 flex flex-col items-center space-y-3 w-full">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const isActive = isItemActive(item.path, item.active)

          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
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
    </aside>
  )
}

export default Sidebar

