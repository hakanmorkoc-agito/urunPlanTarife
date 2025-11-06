import { useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  X,
  Building2,
  Flag,
  Bell,
  Moon,
  Maximize2,
  ChevronDown
} from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const getBreadcrumb = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      return 'Ürün Tanımları / Dashboard'
    } else if (location.pathname.includes('/urun-tarife-tanimlari')) {
      return 'Ürün Tanımları / Ürün Tarife Plan Tanımları'
    } else if (location.pathname.includes('/plan-tanimi')) {
      return 'Ürün Tanımları / Plan Tanımı'
    }
    return 'Ürün Tanımları'
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Tab */}
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-t-lg border border-b-0">
            <Home className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Ürün Tarife Tanımları</span>
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            {getBreadcrumb()} /
          </div>
        </div>


        <div className="flex items-center gap-2 text-[10px]">
          <div className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white px-3 py-1 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8746FA]/15 text-[#8746FA]">
              <Building2 className="h-3 w-3" />
            </span>
            <span className="font-semibold text-[#5825D6]">Agito Emeklilik</span>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 font-semibold text-gray-600">
            <Flag className="h-2.5 w-2.5 text-red-500" />
            <span>TR</span>
          </div>
          <button className="relative rounded-full border border-[#F97373]/40 bg-white p-1.5 text-gray-600 transition hover:bg-[#F97373]/10" aria-label="Bildirimler">
            <Bell className="h-3 w-3" />
            <span className="absolute -right-1 -top-1 rounded-full bg-[#F97373] px-1 text-[8px] font-bold text-white">99+</span>
          </button>
          <button className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-100" aria-label="Mod değiştir">
            <Moon className="h-3 w-3" />
          </button>
          <button className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-100" aria-label="Ekranı büyüt">
            <Maximize2 className="h-3 w-3" />
          </button>
          <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 shadow-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8746FA] text-[10px] font-semibold text-white">
              HM
            </div>
            <span className="text-[11px] font-semibold text-gray-700">Hakan Morkoç</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
