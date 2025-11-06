import { useState, useEffect, useRef } from 'react'
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
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
  const submenuRef = useRef(null)

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

  useEffect(() => {
    if (activeSubmenu) {
      const submenuButton = document.querySelector(`[data-menu-id="${activeSubmenu}"]`)
      if (submenuButton) {
        const rect = submenuButton.getBoundingClientRect()
        setSubmenuPosition({
          top: rect.top + (rect.height / 2),
          left: rect.right + 16
        })
      }
    }
  }, [activeSubmenu])

  return (
    <>
      <aside className="relative z-20 w-16 flex flex-col items-center bg-[#8746FA] text-white shadow-lg overflow-hidden">
        {/* Logo */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Dashboard'a dön"
          >
            <span className="text-2xl font-bold text-white">a</span>
          </button>
        </div>
        <nav className="flex-1 flex flex-col items-center justify-center space-y-3 py-4 px-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isItemActive(item.path, item.active)

            return (
              <button
                key={item.id}
                data-menu-id={item.id}
                onClick={() => handleMenuClick(item)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const tooltip = document.getElementById(`tooltip-${item.id}`)
                  if (tooltip) {
                    const tooltipHeight = tooltip.offsetHeight || 30
                    tooltip.style.left = `${rect.right + 12}px`
                    // Icon'un ortasına hizala
                    tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipHeight / 2)}px`
                    tooltip.style.opacity = '1'
                  }
                }}
                onMouseLeave={() => {
                  const tooltip = document.getElementById(`tooltip-${item.id}`)
                  if (tooltip) {
                    tooltip.style.opacity = '0'
                  }
                }}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#8746FA] shadow-lg ring-2 ring-white/40'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                aria-label={item.label}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </button>
            )
          })}
        </nav>

      </aside>

      {/* Submenu - Sidebar dışında, fixed pozisyon */}
      {activeSubmenu && (() => {
        const activeItem = menuItems.find((item) => item.id === activeSubmenu)
        if (!activeItem?.submenu) return null
        
        return (
          <div 
            ref={submenuRef}
            className="fixed z-[90] w-64 rounded-xl border border-[#8746FA]/10 bg-white text-gray-800 shadow-xl"
            style={{
              left: `${submenuPosition.left}px`,
              top: `${submenuPosition.top}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-base font-semibold text-[#8746FA]">Ürün Tarife Plan Tanımları</h2>
            </div>
            <ul className="py-2">
              {activeItem.submenu.map((submenuItem) => (
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
        )
      })()}

      {/* Tooltips - Sidebar dışında, fixed pozisyon */}
      {menuItems.map((item) => (
        <div
          key={item.id}
          id={`tooltip-${item.id}`}
          className="pointer-events-none fixed z-[100] whitespace-nowrap rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-150 shadow-lg"
          style={{ top: 0, left: 0 }}
        >
          {item.label}
        </div>
      ))}
    </>
  )
}

export default Sidebar
