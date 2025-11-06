import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  SearchOutlined,
  UnorderedListOutlined,
  WalletOutlined,
  ApartmentOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  TeamOutlined,
  MessageOutlined,
  CalendarOutlined,
  SettingOutlined
} from '@ant-design/icons'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSubmenu, setActiveSubmenu] = useState(null)
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 })
  const submenuRef = useRef(null)

  const menuItems = [
    { id: 'search', icon: SearchOutlined, label: 'Arama Yap' },
    { id: 'parameters', icon: UnorderedListOutlined, label: 'Parametreler' },
    {
      id: 'product-tariff',
      icon: AppstoreOutlined,
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
    { id: 'finance', icon: WalletOutlined, label: 'Finans' },
    { id: 'workflow', icon: ApartmentOutlined, label: 'İş Akışı' },
    { id: 'background', icon: ClockCircleOutlined, label: 'Arka Plan İşlemleri' },
    { id: 'rules', icon: AppstoreOutlined, label: 'Kural İşlemleri' },
    { id: 'customer', icon: TeamOutlined, label: 'Müşteri İşlemleri' },
    { id: 'delivery', icon: MessageOutlined, label: 'Gönderi' },
    { id: 'pool', icon: CalendarOutlined, label: 'İş Havuzu' },
    { id: 'system', icon: SettingOutlined, label: 'Kullanıcı ve Sistem Ayarları' },
    { id: 'l4u', icon: AppstoreOutlined, label: 'L4U Uygulama Menüsü' }
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
      <aside className="relative z-20 w-14 flex flex-col items-center bg-[#8746FA] text-white shadow-lg overflow-hidden">
        {/* Logo */}
        <div className="pt-4 pb-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center transition-colors"
            aria-label="Dashboard'a dön"
          >
            <span className="font-bold text-white" style={{ fontSize: '44.8px' }}>ꭤ</span>
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
                className={`group relative flex h-10 w-10 items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-[#8746FA] shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label={item.label}
              >
                <Icon style={{ fontSize: '16px' }} />
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
