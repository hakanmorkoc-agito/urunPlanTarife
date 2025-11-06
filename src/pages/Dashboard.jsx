import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import { useDashboardView } from '../context/DashboardViewContext'
import { PieChart, BarChart3 } from 'lucide-react'

const Dashboard = () => {
  const { chartType, setChartType } = useDashboardView()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState('all')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('plans')
          .select('id, durum, brans, sozlesme_tipi, baslangic_tarihi, bitis_tarihi')

        if (error) throw error
        if (Array.isArray(data)) {
          setPlans(data)
          return
        }
      }

      // Fallback demo verisi
      const fallbackPlans = [
        {
          id: 1,
          durum: 'Draft',
          brans: 'Bireysel Emeklilik',
          sozlesme_tipi: 'Bireysel',
          baslangic_tarihi: '2025-11-03',
          bitis_tarihi: '2099-12-31'
        },
        {
          id: 2,
          durum: 'Active',
          brans: 'Hayat',
          sozlesme_tipi: 'Grup',
          baslangic_tarihi: '2024-04-01',
          bitis_tarihi: '2090-12-31'
        },
        {
          id: 3,
          durum: 'Active',
          brans: 'Sağlık',
          sozlesme_tipi: 'Kurumsal',
          baslangic_tarihi: '2023-01-10',
          bitis_tarihi: '2099-12-31'
        },
        {
          id: 4,
          durum: 'Inactive',
          brans: 'Bireysel Emeklilik',
          sozlesme_tipi: 'Bireysel',
          baslangic_tarihi: '2022-06-15',
          bitis_tarihi: '2024-06-14'
        }
      ]
      setPlans(fallbackPlans)
    } catch (error) {
      console.error('Plan verileri alınırken hata oluştu:', error)
    } finally {
      setLoading(false)
    }
  }

  const yearOptions = useMemo(() => {
    const startYear = 2000
    return ['all', ...Array.from({ length: currentYear - startYear + 1 }, (_, index) => currentYear - index)]
  }, [currentYear])

  const filteredPlans = useMemo(() => {
    if (selectedYear === 'all') return plans
    return plans.filter(plan => {
      if (!plan?.baslangic_tarihi) return false
      const year = new Date(plan.baslangic_tarihi).getFullYear()
      return year === Number(selectedYear)
    })
  }, [plans, selectedYear])

  const statusCounts = useMemo(() => {
    return filteredPlans.reduce(
      (acc, plan) => {
        const key = (plan?.durum || 'Bilinmiyor').toLowerCase()
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      { active: 0, draft: 0, inactive: 0, passive: 0 }
    )
  }, [filteredPlans])

  const productTypeCounts = useMemo(() => {
    return filteredPlans.reduce(
      (acc, plan) => {
        const key = plan?.brans || 'Diğer'
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {}
    )
  }, [filteredPlans])

  const contractTypeCounts = useMemo(() => {
    return filteredPlans.reduce(
      (acc, plan) => {
        const key = plan?.sozlesme_tipi || 'Diğer'
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {}
    )
  }, [filteredPlans])

  const statusData = [
    { name: 'Aktif', value: statusCounts.active, color: '#10b981' },
    { name: 'Draft', value: statusCounts.draft, color: '#6366f1' },
    { name: 'Pasif', value: statusCounts.inactive + statusCounts.passive, color: '#ef4444' }
  ]

  const typeData = Object.entries(productTypeCounts).map(([key, value]) => {
    const colorMap = {
      'Bireysel Emeklilik': '#3b82f6',
      Hayat: '#f97316',
      Sağlık: '#a855f7'
    }
    return { name: key, value, color: colorMap[key] || '#06b6d4' }
  })

  const contractData = Object.entries(contractTypeCounts).map(([key, value]) => {
    const colorMap = {
      Bireysel: '#06b6d4',
      Grup: '#ec4899',
      Kurumsal: '#10b981'
    }
    return { name: key, value, color: colorMap[key] || '#6366f1' }
  })

  const totalPlans = filteredPlans.length

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ürün Tarife İstatistikleri</h1>
        <div className="flex items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 rounded-full border border-gray-100 bg-white px-1.5 py-1 shadow-sm">
            <button
              onClick={() => setChartType('donut')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                chartType === 'donut'
                  ? 'bg-[#8746FA] text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <PieChart className="h-3.5 w-3.5" />
              <span>Pasta Dilim</span>
            </button>
            <button
              onClick={() => setChartType('column')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                chartType === 'column'
                  ? 'bg-[#8746FA] text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Kolon</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="year-filter" className="text-sm font-medium text-gray-600">
              Yıla Göre Filtrele
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/40"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year === 'all' ? 'Tümü' : year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ürün Durumu"
          data={statusData}
          total={totalPlans}
          totalLabel="Ürün"
          chartType={chartType}
          isLoading={loading}
        />
        
        <StatCard
          title="Ürün Tipleri"
          data={typeData}
          total={totalPlans}
          totalLabel="Ürün"
          chartType={chartType}
          isLoading={loading}
        />
        
        <StatCard
          title="Sözleşme Adetleri"
          data={contractData}
          total={totalPlans}
          totalLabel="Sözleşme"
          chartType={chartType}
          isLoading={loading}
        />
      </div>
    </div>
  )
}

export default Dashboard

