import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Layers,
  Wallet,
  Workflow,
  ServerCog,
  Settings2,
  Users,
  Send,
  Briefcase,
  Cog,
  AppWindow
} from 'lucide-react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const menuItems = [
    { id: 'search', icon: Search, label: 'Arama Yap' },
    { id: 'parameters', icon: SlidersHorizontal, label: 'Parametreler' },
    {
      id: 'product-tariff',
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
    { id: 'finance', icon: Wallet, label: 'Finans' },
    { id: 'workflow', icon: Workflow, label: 'İş Akışı' },
    { id: 'background', icon: ServerCog, label: 'Arka Plan İşlemleri' },
    { id: 'rules', icon: Settings2, label: 'Kural İşlemleri' },
    { id: 'customer', icon: Users, label: 'Müşteri İşlemleri' },
    { id: 'delivery', icon: Send, label: 'Gönderi' },
    { id: 'pool', icon: Briefcase, label: 'İş Havuzu' },
    { id: 'system', icon: Cog, label: 'Kullanıcı ve Sistem Ayarları' },
    { id: 'l4u', icon: AppWindow, label: 'L4U Uygulama Menüsü' }
  ]

  const isItemActive = (itemPath, active) => {
    if (!itemPath) {
      return Boolean(active)
    }

    if (itemPath === '/dashboard') {
      return location.pathname === '/' || location.pathname.startsWith('/dashboard')
    }

    return location.pathname.includes(itemPath) || Boolean(active)
  }

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setActiveSubmenu((prev) => (prev === item.id ? null : item.id))
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
    <aside className="relative z-20 w-16 flex flex-col items-center bg-[#8746FA] text-white shadow-lg">
      <nav className="flex-1 flex flex-col items-center justify-center space-y-3 py-10 px-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = isItemActive(item.path, item.active)

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[#8746FA] shadow-lg ring-2 ring-white/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              <span className="pointer-events-none absolute left-[3.25rem] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black/85 px-3 py-1 text-xs font-medium text-white opacity-0 transition-all duration-150 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>

      {activeSubmenu && (
        <div className="absolute left-full top-1/2 ml-4 w-64 -translate-y-1/2 rounded-xl border border-[#8746FA]/10 bg-white text-gray-800 shadow-xl">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-[#8746FA]">Ürün Tarife Plan Tanımları</h2>
          </div>
          <ul className="py-2">
            {menuItems
              .find((item) => item.id === activeSubmenu)?.submenu?.map((submenuItem) => (
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
