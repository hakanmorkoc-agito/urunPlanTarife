import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'

const Dashboard = () => {
  const [stats, setStats] = useState({
    productStatus: { active: 45, passive: 15, total: 60 },
    productTypes: { bes: 27, hayat: 20, saglik: 13, total: 60 },
    contracts: { bireysel: 1148, grup: 892, kurumsal: 510, total: 2550 }
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    if (!supabase) {
      console.warn('Supabase bağlantısı kurulmadı')
      return
    }
    
    try {
      // Ürün Durumu
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('status')
      
      if (!productsError && products) {
        const active = products.filter(p => p.status === 'active').length
        const passive = products.filter(p => p.status === 'passive').length
        setStats(prev => ({
          ...prev,
          productStatus: { active, passive, total: products.length }
        }))
      }

      // Ürün Tipleri
      const { data: productTypes, error: typesError } = await supabase
        .from('products')
        .select('type')
      
      if (!typesError && productTypes) {
        const bes = productTypes.filter(p => p.type === 'BES').length
        const hayat = productTypes.filter(p => p.type === 'Hayat').length
        const saglik = productTypes.filter(p => p.type === 'Sağlık').length
        setStats(prev => ({
          ...prev,
          productTypes: { bes, hayat, saglik, total: productTypes.length }
        }))
      }

      // Sözleşme Adetleri
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select('contract_type')
      
      if (!contractsError && contracts) {
        const bireysel = contracts.filter(c => c.contract_type === 'Bireysel').length
        const grup = contracts.filter(c => c.contract_type === 'Grup').length
        const kurumsal = contracts.filter(c => c.contract_type === 'Kurumsal').length
        setStats(prev => ({
          ...prev,
          contracts: { bireysel, grup, kurumsal, total: contracts.length }
        }))
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ürün Tarife İstatistikleri</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Ürün Durumu"
          data={[
            { name: 'Aktif Ürün', value: stats.productStatus.active, color: '#10b981' },
            { name: 'Pasif Ürün', value: stats.productStatus.passive, color: '#ef4444' }
          ]}
          total={stats.productStatus.total}
          totalLabel="Ürün"
        />
        
        <StatCard
          title="Ürün Tipleri"
          data={[
            { name: 'BES Ürün', value: stats.productTypes.bes, color: '#3b82f6' },
            { name: 'Hayat Ürün', value: stats.productTypes.hayat, color: '#f97316' },
            { name: 'Sağlık Ürün', value: stats.productTypes.saglik, color: '#a855f7' }
          ]}
          total={stats.productTypes.total}
          totalLabel="Ürün"
        />
        
        <StatCard
          title="Sözleşme Adetleri"
          data={[
            { name: 'Bireysel', value: stats.contracts.bireysel, color: '#06b6d4' },
            { name: 'Grup', value: stats.contracts.grup, color: '#ec4899' },
            { name: 'Kurumsal', value: stats.contracts.kurumsal, color: '#10b981' }
          ]}
          total={stats.contracts.total}
          totalLabel="Sözleşme"
        />
      </div>
    </div>
  )
}

export default Dashboard

