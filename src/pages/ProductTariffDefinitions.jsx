import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Search } from 'lucide-react'
import ProductDefinitionModal from '../components/ProductDefinitionModal'
import SupabaseTest from '../components/SupabaseTest'

const ProductTariffDefinitions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    ulke: '',
    dil: '',
    brans: '',
    durum: '',
    urun_kodu: '',
    urun_adi: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  // URL'de refresh parametresi varsa listeyi yenile
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('refresh')) {
      fetchProducts()
      // URL'den refresh parametresini temizle
      navigate(location.pathname, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // Sayfa yeniden focus olduğunda listeyi yenile
  useEffect(() => {
    const handleFocus = () => {
      fetchProducts()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      if (!supabase) {
        console.warn('Supabase bağlantısı kurulmadı')
        // Fallback demo data kullan - catch bloğunda zaten var
        throw new Error('Supabase bağlantısı yok')
      }
      
      const { data, error } = await supabase
        .from('product_tariff_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback demo data
      setProducts([
        {
          id: 1,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'FZ-PLN-001',
          urun_adi: 'Faizsiz Ferdi BES',
          urun_uzun_adi: 'Kişiye Özel Faizsiz Katılım Emekl'
        },
        {
          id: 2,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'MR-PLN-001',
          urun_adi: 'Ferdi BES Plan',
          urun_uzun_adi: 'Mercan Bireysel Emeklilik Planı'
        },
        {
          id: 3,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'SP-PLN-001',
          urun_adi: 'Ferdi BES Plan',
          urun_uzun_adi: 'Safran Bireysel Emeklilik Planı'
        },
        {
          id: 4,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'OYA-PLN-001',
          urun_adi: '18 yaş altı Ferdi',
          urun_uzun_adi: '18 Yaş Altına Bireysel Emeklilik'
        },
        {
          id: 5,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'KO-PLN-1',
          urun_adi: 'Ferdi BES',
          urun_uzun_adi: 'Kişiye Özel Bireysel Emeklilik Pla'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleProductSelect = (method) => {
    setShowModal(false)
    if (method === 'new') {
      navigate('/plan-tanimi')
    }
  }

  const filteredProducts = products.filter(product => {
    return Object.keys(searchFilters).every(key => {
      if (!searchFilters[key]) return true
      return String(product[key] || '').toLowerCase().includes(searchFilters[key].toLowerCase())
    })
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* Header with Supabase Test Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Ürün Tarife Plan Tanımları</h1>
          <SupabaseTest />
        </div>
        
        {/* Ürün Tanımı Section */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-1 h-8 bg-sidebar-dark"></div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1A72FB] text-white font-medium shadow-sm transition-colors hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Yeni Ürün Tanımla</span>
          </button>
        </div>

        {/* Method Selection Cards */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4 text-center">Lütfen tanımlama yöntemini seçiniz</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <MethodCard
              icon="plus"
              title="Yeni Ürün Tanımla"
              subtitle="Sıfırdan Ürün Oluşturulsun"
              onClick={() => handleProductSelect('new')}
            />
            <MethodCard
              icon="catalog"
              title="Katalogdan Ürün Seç"
              subtitle="Mevcut Katalog Ürünlerinden Şablon olarak seçin"
              onClick={() => handleProductSelect('catalog')}
            />
            <MethodCard
              icon="ai"
              title="A-Pilot Tanımlasın"
              subtitle="Yapay Zeka Sizin İçin Tanımlasın"
              onClick={() => handleProductSelect('ai')}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Ülke', 'Dil', 'Branş', 'Durum', 'Ürün Kodu', 'Ürün Adı', 'Ürün Uzun Adı'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    <div className="flex items-center space-x-2">
                      <span>{header}</span>
                      <Search className="w-4 h-4 text-gray-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/plan-tanimi/${product.id}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{product.ulke}</span>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">DB</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.dil}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.brans}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-sidebar-light bg-opacity-20 text-sidebar-dark rounded">
                        {product.durum}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.urun_kodu}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.urun_adi}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{product.urun_uzun_adi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ProductDefinitionModal
          onClose={() => setShowModal(false)}
          onSelect={handleProductSelect}
        />
      )}
    </div>
  )
}

const MethodCard = ({ icon, title, subtitle, onClick }) => {
  const iconMap = {
    plus: (
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        <span className="text-3xl font-bold text-blue-600">+</span>
      </div>
    ),
    catalog: (
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    ),
    ai: (
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-6 text-center transition-all"
    >
      {iconMap[icon]}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
    </button>
  )
}

export default ProductTariffDefinitions

