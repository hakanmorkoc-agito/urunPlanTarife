import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Search, Edit2, Copy, Trash2 } from 'lucide-react'
import ProductDefinitionModal from '../components/ProductDefinitionModal'
import SupabaseTest from '../components/SupabaseTest'

const ProductTariffDefinitions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredProductId, setHoveredProductId] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 })
  const [pendingMethod, setPendingMethod] = useState(null)
  const [searchFilters, setSearchFilters] = useState({
    ulke: '',
    dil: '',
    brans: '',
    durum: '',
    urun_kodu: '',
    urun_adi: '',
    gecerlilik_baslangic_tarihi: '',
    gecerlilik_bitis_tarihi: ''
  })
  const filterInputRef = useRef(null)

  useEffect(() => {
    if (activeFilter && filterInputRef.current) {
      filterInputRef.current.focus()
    }
  }, [activeFilter])

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
          urun_uzun_adi: 'Kişiye Özel Faizsiz Katılım Emekl',
          gecerlilik_baslangic_tarihi: '2025-11-03',
          gecerlilik_bitis_tarihi: '2099-12-31'
        },
        {
          id: 2,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'MR-PLN-001',
          urun_adi: 'Ferdi BES Plan',
          urun_uzun_adi: 'Mercan Bireysel Emeklilik Planı',
          gecerlilik_baslangic_tarihi: '2025-11-03',
          gecerlilik_bitis_tarihi: '2099-12-31'
        },
        {
          id: 3,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'SP-PLN-001',
          urun_adi: 'Ferdi BES Plan',
          urun_uzun_adi: 'Safran Bireysel Emeklilik Planı',
          gecerlilik_baslangic_tarihi: '2025-11-03',
          gecerlilik_bitis_tarihi: '2099-12-31'
        },
        {
          id: 4,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'OYA-PLN-001',
          urun_adi: '18 yaş altı Ferdi',
          urun_uzun_adi: '18 Yaş Altına Bireysel Emeklilik',
          gecerlilik_baslangic_tarihi: '2025-11-03',
          gecerlilik_bitis_tarihi: '2099-12-31'
        },
        {
          id: 5,
          ulke: 'Türkiye',
          dil: 'Türkçe',
          brans: 'Bireysel Emeklilik',
          durum: 'Draft',
          urun_kodu: 'KO-PLN-1',
          urun_adi: 'Ferdi BES',
          urun_uzun_adi: 'Kişiye Özel Bireysel Emeklilik Pla',
          gecerlilik_baslangic_tarihi: '2025-11-03',
          gecerlilik_bitis_tarihi: '2099-12-31'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const openSelectionModal = (method) => {
    setPendingMethod(method)
    setShowModal(true)
  }

  const handleMethodAction = (method) => {
    if (method === 'new') {
      openSelectionModal('new')
      return
    }

    alert('Bu özellik henüz geliştirme aşamasında.')
  }

  const handleProductSelect = (method, data) => {
    setShowModal(false)
    const selectedMethod = method || pendingMethod
    setPendingMethod(null)

    if (selectedMethod === 'new') {
      navigate('/plan-tanimi', {
        state: {
          initialSelections: data
        }
      })
    }
  }

  const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }
    return date.toLocaleDateString('tr-TR')
  }

  const dateFilterKeys = ['gecerlilik_baslangic_tarihi', 'gecerlilik_bitis_tarihi']

  const filteredProducts = products.filter(product => {
    return Object.keys(searchFilters).every(key => {
      const filterValue = searchFilters[key]
      if (!filterValue) return true
      const productValue = product[key]
      if (dateFilterKeys.includes(key)) {
        if (!productValue) return false
        return String(productValue).startsWith(filterValue)
      }
      return String(productValue || '').toLowerCase().includes(filterValue.toLowerCase())
    })
  })

  const openFilter = (column, event) => {
    if (column.key === 'actions') return

    if (activeFilter?.key === column.key) {
      setActiveFilter(null)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setFilterPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX - 120
    })

    setActiveFilter({
      key: column.key,
      label: column.label,
      filterType: column.filterType || 'text',
      value: searchFilters[column.key] || ''
    })
  }

  const closeFilter = () => {
    setActiveFilter(null)
  }

  const applyFilter = () => {
    if (!activeFilter) return
    setSearchFilters((prev) => ({
      ...prev,
      [activeFilter.key]: activeFilter.value
    }))
    closeFilter()
  }

  const clearFilter = () => {
    if (!activeFilter) return
    setSearchFilters((prev) => ({
      ...prev,
      [activeFilter.key]: ''
    }))
    setActiveFilter((prev) => prev && { ...prev, value: '' })
  }

  const handleFilterValueChange = (event) => {
    const value = event.target.value
    setActiveFilter((prev) => (prev ? { ...prev, value } : prev))
  }

  const handleFilterKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      applyFilter()
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      closeFilter()
    }
  }

  const handleEditProduct = (event, productId) => {
    event.stopPropagation()
    navigate(`/plan-tanimi/${productId}`)
  }

  const handleDuplicateProduct = async (event, product) => {
    event.stopPropagation()

    const duplicatedProduct = {
      ...product,
      id: Date.now(),
      urun_kodu: `${product.urun_kodu || 'PLAN'}-KOPYA`,
      urun_adi: `${product.urun_adi || 'Yeni Ürün'} (Kopya)`
    }

    if (supabase) {
      try {
        const { id, ...payload } = duplicatedProduct
        const { error, data } = await supabase
          .from('product_tariff_plans')
          .insert([payload])
          .select()

        if (error) throw error
        if (Array.isArray(data) && data[0]) {
          setProducts((prev) => [data[0], ...prev])
          return
        }
      } catch (error) {
        console.error('Ürün kopyalama hatası:', error)
        alert('Ürün kopyalanamadı. Lütfen daha sonra tekrar deneyin.')
        return
      }
    }

    setProducts((prev) => [duplicatedProduct, ...prev])
  }

  const handleDeleteProduct = async (event, productId) => {
    event.stopPropagation()
    const confirmDelete = window.confirm('Seçili ürünü silmek istediğinize emin misiniz?')
    if (!confirmDelete) return

    if (supabase) {
      try {
        const { error } = await supabase
          .from('product_tariff_plans')
          .delete()
          .eq('id', productId)

        if (error) throw error
      } catch (error) {
        console.error('Ürün silme hatası:', error)
        alert('Ürün silinemedi. Lütfen daha sonra tekrar deneyin.')
        return
      }
    }

    setProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  const tableColumns = [
    { key: 'ulke', label: 'Ülke', filterType: 'text', widthClass: 'min-w-[110px]' },
    { key: 'dil', label: 'Dil', filterType: 'text', widthClass: 'min-w-[90px]' },
    { key: 'brans', label: 'Branş', filterType: 'text', widthClass: 'min-w-[120px]' },
    { key: 'durum', label: 'Durum', filterType: 'text', widthClass: 'min-w-[110px]' },
    { key: 'urun_kodu', label: 'Ürün Kodu', filterType: 'text', widthClass: 'min-w-[140px]' },
    { key: 'urun_adi', label: 'Ürün Adı', filterType: 'text', widthClass: 'min-w-[140px]' },
    { key: 'urun_uzun_adi', label: 'Ürün Uzun Adı', filterType: 'text', widthClass: 'min-w-[150px]' },
    { key: 'gecerlilik_baslangic_tarihi', label: 'Geçerlilik Başl. Tarihi', filterType: 'date', widthClass: 'min-w-[170px]' },
    { key: 'gecerlilik_bitis_tarihi', label: 'Geçerlilik Bitiş Tarihi', filterType: 'date', widthClass: 'min-w-[170px]' },
    { key: 'actions', label: 'Liste İşlemleri', widthClass: 'w-[140px]' }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* Header with Supabase Test Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Ürün Tarife Plan Tanımları</h1>
          <SupabaseTest />
        </div>
        
        {/* Ürün Tanımı Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-1 rounded-full bg-sidebar-dark"></div>
          <button
            onClick={() => openSelectionModal('new')}
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#1A72FB] transition hover:text-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]/40"
          >
            <span>Yeni Ürün Tanımla</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Method Selection Cards */}
        <div className="mb-8">
          <p className="text-gray-600 mb-4 text-center">Lütfen tanımlama yöntemini seçiniz</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 max-w-5xl mx-auto">
            <MethodCard
              icon="plus"
              title="Yeni Ürün Tanımla"
              subtitle="Sıfırdan Ürün Oluşturulsun"
              onClick={() => handleMethodAction('new')}
            />
            <MethodCard
              icon="catalog"
              title="Katalogdan Ürün Seç"
              subtitle="Mevcut Katalog Ürünlerinden Şablon olarak seçin"
              onClick={() => handleMethodAction('catalog')}
            />
            <MethodCard
              icon="ai"
              title="A-Pilot Tanımlasın"
              subtitle="Yapay Zeka Sizin İçin Tanımlasın"
              onClick={() => handleMethodAction('ai')}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="relative rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-600 uppercase ${column.widthClass || ''}`}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span>{column.label}</span>
                      {column.filterType && (
                        <button
                          type="button"
                          onClick={(event) => openFilter(column, event)}
                          className={`rounded-full p-1 transition ${
                            activeFilter?.key === column.key ? 'bg-[#1A72FB]/10 text-[#1A72FB]' : 'text-gray-400 hover:text-[#1A72FB]'
                          }`}
                          aria-label={`${column.label} için filtrele`}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={tableColumns.length} className="px-4 py-8 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length} className="px-4 py-8 text-center text-gray-500">
                    Ürün bulunamadı
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`cursor-pointer transition ${hoveredProductId === product.id ? 'bg-[#EEF4FF]' : 'bg-white hover:bg-[#F8FAFF]'}`}
                    onClick={() => navigate(`/plan-tanimi/${product.id}`)}
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    {tableColumns.map((column) => {
                      if (column.key === 'actions') {
                        return (
                          <td key={`${product.id}-${column.key}`} className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(event) => handleEditProduct(event, product.id)}
                                className="rounded-lg border border-[#1A72FB]/30 bg-white p-1.5 text-[#1A72FB] hover:bg-[#1A72FB]/10 transition"
                                aria-label="Güncelle"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(event) => handleDuplicateProduct(event, product)}
                                className="rounded-lg border border-emerald-400/40 bg-white p-1.5 text-emerald-500 hover:bg-emerald-50 transition"
                                aria-label="Kopyala"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(event) => handleDeleteProduct(event, product.id)}
                                className="rounded-lg border border-red-400/40 bg-white p-1.5 text-red-500 hover:bg-red-50 transition"
                                aria-label="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )
                      }

                      if (column.key === 'ulke') {
                        return (
                          <td key={`${product.id}-${column.key}`} className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{product.ulke}</span>
                              <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700 bg-green-100">DB</span>
                            </div>
                          </td>
                        )
                      }

                      if (column.key === 'durum') {
                        return (
                          <td key={`${product.id}-${column.key}`} className="px-4 py-2.5">
                            <span className="rounded-full bg-[#8746FA]/10 px-3 py-1 text-[11px] font-semibold text-[#8746FA]">
                              {product.durum || '-'}
                            </span>
                          </td>
                        )
                      }

                      if (dateFilterKeys.includes(column.key)) {
                        return (
                          <td key={`${product.id}-${column.key}`} className="px-4 py-2.5 text-sm text-gray-900">
                            {formatDate(product[column.key])}
                          </td>
                        )
                      }

                      return (
                        <td key={`${product.id}-${column.key}`} className="px-4 py-2.5 text-sm text-gray-900">
                          {product[column.key] || '-'}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1 border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600 md:flex-row md:items-center md:justify-between">
          <span>
            Filtre sonucu <span className="font-semibold text-gray-800">{filteredProducts.length}</span> kayıt görüntüleniyor.
          </span>
          <span>
            Toplam kayıt: <span className="font-semibold text-gray-800">{products.length}</span>
          </span>
        </div>

        {activeFilter && (
          <div
            className="absolute z-30 w-60 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
            style={{ top: filterPosition.top, left: filterPosition.left }}
          >
            <p className="text-sm font-semibold text-gray-800">{activeFilter.label}</p>
            <div className="mt-3">
              <input
                ref={filterInputRef}
                type={activeFilter.filterType === 'date' ? 'date' : 'text'}
                value={activeFilter.value}
                onChange={handleFilterValueChange}
                onKeyDown={handleFilterKeyDown}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1A72FB] focus:ring-2 focus:ring-[#1A72FB]/40"
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={clearFilter}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Temizle
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeFilter}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Vazgeç
                </button>
                <button
                  onClick={applyFilter}
                  className="rounded-lg bg-[#1A72FB] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#155ED5]"
                >
                  Ara
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ProductDefinitionModal
          onClose={() => {
            setShowModal(false)
            setPendingMethod(null)
          }}
          onSelect={handleProductSelect}
        />
      )}
    </div>
  )
}

const MethodCard = ({ icon, title, subtitle, onClick }) => {
  const iconMap = {
    plus: (
      <span className="text-4xl font-bold leading-none">+</span>
    ),
    catalog: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    ai: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }

  return (
    <button
      onClick={onClick}
      className="group h-36 w-full rounded-xl bg-gradient-to-br from-[#1A72FB] via-[#1965E9] to-[#1555C8] p-5 text-center text-white shadow transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white/15 text-white shadow-inner">
        {iconMap[icon]}
      </div>
      <h3 className="mt-3 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 text-xs text-white/80">{subtitle}</p>
    </button>
  )
}

export default ProductTariffDefinitions

