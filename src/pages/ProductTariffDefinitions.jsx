import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Search, Edit2, Copy, Trash2 } from 'lucide-react'
import ProductDefinitionModal from '../components/ProductDefinitionModal'
import APilotModal from '../components/APilotModal'
import PlanDefinitionModal from './PlanDefinition'

const ProductTariffDefinitions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false)
  const [showAPilotModal, setShowAPilotModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [planModalData, setPlanModalData] = useState(null)
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
    if (method === 'new' || method === 'catalog') {
      openSelectionModal(method)
      return
    }

    if (method === 'ai') {
      setShowAPilotModal(true)
      return
    }

    alert('Bu özellik henüz geliştirme aşamasında.')
  }

  const handleAPilotSave = async (description) => {
    try {
      // A-pilot ile plan oluşturma
      // Şimdilik basit bir plan oluşturuyoruz, gerçek AI entegrasyonu sonra eklenecek
      const newPlan = {
        brans: 'Bireysel Emeklilik',
        ulke: 'Türkiye',
        dil: 'Türkçe',
        plan_kodu: `AI-PLAN-${Date.now()}`,
        plan_versiyon_no: '1',
        plan_kisa_adi: 'A-Pilot Oluşturulan Plan',
        plan_uzun_adi: description.substring(0, 100) || 'A-Pilot ile oluşturulan plan',
        durum: 'Draft'
      }

      if (supabase) {
        // Önce product_tariff_plans'a kayıt
        const { data: productTariffPlan, error: productError } = await supabase
          .from('product_tariff_plans')
          .insert([{
            ulke: newPlan.ulke,
            dil: newPlan.dil,
            brans: newPlan.brans,
            durum: newPlan.durum,
            urun_kodu: newPlan.plan_kodu,
            urun_adi: newPlan.plan_kisa_adi,
            urun_uzun_adi: newPlan.plan_uzun_adi
          }])
          .select()
          .single()

        if (productError) throw productError

        // Sonra plans'a kayıt
        const { error: planError } = await supabase
          .from('plans')
          .insert([{
            ...newPlan,
            product_tariff_plan_id: productTariffPlan.id
          }])

        if (planError) throw planError
      }

      // Liste sayfasını yenile
      fetchProducts()
      alert('A-Pilot planı başarıyla oluşturuldu!')
    } catch (error) {
      console.error('A-Pilot plan oluşturma hatası:', error)
      alert('Plan oluşturulurken bir hata oluştu.')
    }
  }

  const handleProductSelect = (method, data) => {
    setShowModal(false)
    const selectedMethod = method || pendingMethod
    setPendingMethod(null)

    if (selectedMethod === 'new') {
      setPlanModalData(data)
      setShowPlanModal(true)
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

  const truncateValue = (value, limit = 50) => {
    if (!value && value !== 0) return '-'
    const str = String(value)
    return str.length > limit ? `${str.slice(0, limit)}…` : str
  }

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
    const popoverWidth = 240
    const viewportWidth = window.innerWidth
    const safeLeft = Math.min(Math.max(rect.left, 12), viewportWidth - popoverWidth - 12)

    setFilterPosition({
      top: rect.bottom + 8,
      left: safeLeft
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

  const handleEditProduct = async (event, productId) => {
    event.stopPropagation()
    
    try {
      // Mevcut plan bilgilerini al
      let planData = null
      
      if (supabase) {
        // Önce product_tariff_plans'tan bilgileri al
        const { data: productData, error: productError } = await supabase
          .from('product_tariff_plans')
          .select('*')
          .eq('id', productId)
          .single()

        if (productError) throw productError

        // Sonra plans tablosundan ilgili planı bul
        const { data: plansData, error: plansError } = await supabase
          .from('plans')
          .select('*')
          .eq('product_tariff_plan_id', productId)
          .order('plan_versiyon_no', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (plansData) {
          // Plans tablosunda kayıt varsa, tüm bilgileri al ve versiyon no'yu bir artır
          planData = {
            ...plansData,
            brans: plansData.brans || productData.brans,
            ulke: plansData.ulke || productData.ulke,
            dil: plansData.dil || productData.dil,
            plan_kodu: plansData.plan_kodu || productData.urun_kodu,
            plan_versiyon_no: String(Number(plansData.plan_versiyon_no || '0') + 1),
            plan_kisa_adi: plansData.plan_kisa_adi || productData.urun_adi,
            plan_uzun_adi: plansData.plan_uzun_adi || productData.urun_uzun_adi,
            durum: plansData.durum || productData.durum || 'Draft',
            // Orijinal plan ID'sini sakla (yeni versiyon oluşturma için)
            id: plansData.id
          }
        } else {
          // Plans tablosunda kayıt yoksa, product_tariff_plans'tan oluştur
          planData = {
            brans: productData.brans,
            ulke: productData.ulke,
            dil: productData.dil,
            sozlesme_tipi: '',
            plan_kodu: productData.urun_kodu,
            plan_versiyon_no: '1',
            plan_kisa_adi: productData.urun_adi,
            plan_uzun_adi: productData.urun_uzun_adi,
            basvuru_tipi: '',
            kategori_kodu: '',
            zimmet_tipi: '',
            baslangic_tarihi: '',
            bitis_tarihi: '',
            durum: productData.durum || 'Draft'
          }
        }
      } else {
        // Fallback: Demo data
        const product = products.find(p => p.id === productId)
        if (product) {
          planData = {
            brans: product.brans || 'Bireysel Emeklilik',
            ulke: product.ulke || 'Türkiye',
            dil: product.dil || 'Türkçe',
            sozlesme_tipi: '',
            plan_kodu: product.urun_kodu || '',
            plan_versiyon_no: '1',
            plan_kisa_adi: product.urun_adi || '',
            plan_uzun_adi: product.urun_uzun_adi || product.urun_adi || '',
            basvuru_tipi: '',
            kategori_kodu: '',
            zimmet_tipi: '',
            baslangic_tarihi: product.gecerlilik_baslangic_tarihi || '',
            bitis_tarihi: product.gecerlilik_bitis_tarihi || '',
            durum: product.durum || 'Draft'
          }
        }
      }

      if (planData) {
        setPlanModalData({
          ...planData,
          originalProductId: productId
        })
        setShowPlanModal(true)
      }
    } catch (error) {
      console.error('Plan bilgileri alınırken hata:', error)
      navigate(`/plan-tanimi/${productId}`)
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Ürün Tarife Plan Tanımları</h1>
        </div>
        
        {/* Ürün Tanımı Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-1 rounded-full bg-sidebar-dark"></div>
          <button
            onClick={() => openSelectionModal('new')}
            className="text-sm font-semibold uppercase tracking-wide text-[#1A72FB] transition hover:text-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]/40"
          >
            Yeni Ürün Tanımla
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
                {tableColumns.map((column) => {
                  const isActionsColumn = column.key === 'actions'
                  const stickyHeaderClass = isActionsColumn ? 'sticky right-0 top-0 z-30 bg-gray-50 border-l border-gray-200' : ''

                  return (
                    <th
                      key={column.key}
                      className={`px-3 py-2.5 text-left text-[11px] font-semibold tracking-wide text-gray-600 uppercase ${column.widthClass || ''} ${stickyHeaderClass}`}
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
                  )
                })}
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
                filteredProducts.map((product) => {
                  const isHovered = hoveredProductId === product.id
                  return (
                    <tr
                      key={product.id}
                      className="relative cursor-pointer transition"
                      onClick={() => {
                        setPlanModalData({ id: product.id })
                        setShowPlanModal(true)
                      }}
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      {tableColumns.map((column) => {
                        const isActionsColumn = column.key === 'actions'
                        
                        let cellClasses = 'px-3 py-2 align-top text-[13px] text-gray-900 whitespace-nowrap'
                        if (isHovered) {
                          cellClasses += ' bg-[#EEF4FF]'
                        } else {
                          cellClasses += ' bg-white group-hover:bg-[#F8FAFF]'
                        }

                        if (isActionsColumn) {
                          cellClasses += ' sticky right-0 z-20 border-l border-gray-200'
                        }
                        
                        if (column.key === 'actions') {
                          return (
                            <td key={`${product.id}-${column.key}`} className={cellClasses}>
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
                            <td key={`${product.id}-${column.key}`} className={cellClasses}>
                              <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-sm font-medium text-gray-900">{product.ulke}</span>
                              </div>
                            </td>
                          )
                        }

                        if (column.key === 'durum') {
                          return (
                             <td key={`${product.id}-${column.key}`} className={`${cellClasses} px-4 py-2.5`}>
                              <span className="rounded-full bg-[#8746FA]/10 px-3 py-1 text-[11px] font-semibold text-[#8746FA]">
                                {product.durum || '-'}
                              </span>
                            </td>
                          )
                        }

                        if (dateFilterKeys.includes(column.key)) {
                          return (
                            <td key={`${product.id}-${column.key}`} className={cellClasses}>
                              {formatDate(product[column.key])}
                            </td>
                          )
                        }

                        const rawValue = product[column.key]
                        const displayValue = truncateValue(rawValue)

                        return (
                          <td
                            key={`${product.id}-${column.key}`}
                            className={cellClasses}
                            title={rawValue || ''}
                          >
                            {displayValue}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/75 px-4 py-2 text-sm text-gray-600">
          <span className="font-semibold">
            Toplam <span className="text-gray-800">{filteredProducts.length}</span> veri
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="rounded px-2 py-1 text-gray-500 hover:bg-gray-200" aria-label="Önceki sayfa">‹</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`rounded px-2.5 py-1 text-xs ${
                    page === 1
                      ? 'bg-blue-600 font-semibold text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-1">…</span>
              <button className="rounded px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-200">27</button>
              <button className="rounded px-2 py-1 text-gray-500 hover:bg-gray-200" aria-label="Sonraki sayfa">›</button>
            </div>
            <div className="flex items-center gap-2">
               <select className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs focus:border-blue-500 focus:ring-blue-500">
                <option>10 / sayfa</option>
                <option>20 / sayfa</option>
                <option>50 / sayfa</option>
              </select>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  className="h-8 w-16 rounded-l-md border border-r-0 border-gray-300 px-2 text-center text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Sayfa"
                />
                <button className="h-8 rounded-r-md bg-gray-200 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-300" type="button">
                  Git
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeFilter && (
          <div
            className="fixed z-50 w-60 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
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
          mode={pendingMethod || 'new'}
          onClose={() => {
            setShowModal(false)
            setPendingMethod(null)
          }}
          onSelect={handleProductSelect}
        />
      )}

      {showAPilotModal && (
        <APilotModal
          onClose={() => setShowAPilotModal(false)}
          onSave={handleAPilotSave}
        />
      )}

      <PlanDefinitionModal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false)
          setPlanModalData(null)
        }}
        initialData={planModalData}
        onSave={() => {
          // Liste sayfasını yenile
          fetchProducts()
        }}
      />
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

