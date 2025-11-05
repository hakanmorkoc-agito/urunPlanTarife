import { useLocation, useNavigate } from 'react-router-dom'
import { Home, X, RefreshCw, PieChart, BarChart3 } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [chartType, setChartType] = useState('donut')

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

        {/* Chart Type Selector */}
        {(location.pathname === '/dashboard' || location.pathname === '/') && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('donut')}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                chartType === 'donut' ? 'bg-sidebar-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span className="text-sm font-medium">Pasta Dilim</span>
            </button>
            <button
              onClick={() => setChartType('column')}
              className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                chartType === 'column' ? 'bg-sidebar-light text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Kolon</span>
            </button>
          </div>
        )}

        {/* Refresh Button */}
        {location.pathname.includes('/urun-tarife-tanimlari') && (
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Yenile (6 DB)</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

