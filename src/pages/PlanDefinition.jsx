import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { X, Info, Save, ChevronsRight } from 'lucide-react'

const PlanDefinition = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
  const [originalPlanId, setOriginalPlanId] = useState(null)
  const [formData, setFormData] = useState({
    // Genel Bilgiler
    brans: 'Bireysel Emeklilik',
    ulke: 'Türkiye',
    dil: 'Türkçe',
    sozlesme_tipi: '',
    plan_kodu: '',
    plan_versiyon_no: '0',
    plan_kisa_adi: '',
    plan_uzun_adi: '',
    basvuru_tipi: '',
    kategori_kodu: '',
    zimmet_tipi: '',
    baslangic_tarihi: '',
    bitis_tarihi: '',
    durum: 'Draft',
    hazine_plan_kodu: '',
    hazine_tasdik_tarihi: '',
    gecerli_sozlesme_cinsi: '',
    kur_tipi: '',
    doviz_para_cinsleri: '',
    min_giris_yas: '',
    max_giris_yas: '',
    hesap_birlestirme_zorunlu: false,
    katilimci_karti_verilecek: false,
    vatandaslik: false,
    ek_kategori_1: '',
    ek_kategori_2: '',
    egp_odeme_turleri: '',
    vakif_aktarim: false,
    vakif_uye_kurumu: '',
    hedef_kitle_aciklamasi: ''
  })

  useEffect(() => {
    if (id) {
      fetchPlanData(id)
    }
  }, [id])

  useEffect(() => {
    if (!id && location.state?.initialSelections) {
      const initialData = location.state.initialSelections
      // Tüm form alanlarını doldur
      setFormData({
        brans: initialData.brans || 'Bireysel Emeklilik',
        ulke: initialData.ulke || 'Türkiye',
        dil: initialData.dil || 'Türkçe',
        sozlesme_tipi: initialData.sozlesme_tipi || '',
        plan_kodu: initialData.plan_kodu || '',
        plan_versiyon_no: initialData.plan_versiyon_no || '0',
        plan_kisa_adi: initialData.plan_kisa_adi || '',
        plan_uzun_adi: initialData.plan_uzun_adi || '',
        basvuru_tipi: initialData.basvuru_tipi || '',
        kategori_kodu: initialData.kategori_kodu || '',
        zimmet_tipi: initialData.zimmet_tipi || '',
        baslangic_tarihi: initialData.baslangic_tarihi || '',
        bitis_tarihi: initialData.bitis_tarihi || '',
        durum: initialData.durum || 'Draft',
        hazine_plan_kodu: initialData.hazine_plan_kodu || '',
        hazine_tasdik_tarihi: initialData.hazine_tasdik_tarihi || '',
        gecerli_sozlesme_cinsi: initialData.gecerli_sozlesme_cinsi || '',
        kur_tipi: initialData.kur_tipi || '',
        doviz_para_cinsleri: initialData.doviz_para_cinsleri || '',
        min_giris_yas: initialData.min_giris_yas || '',
        max_giris_yas: initialData.max_giris_yas || '',
        hesap_birlestirme_zorunlu: initialData.hesap_birlestirme_zorunlu || false,
        katilimci_karti_verilecek: initialData.katilimci_karti_verilecek || false,
        vatandaslik: initialData.vatandaslik || false,
        ek_kategori_1: initialData.ek_kategori_1 || '',
        ek_kategori_2: initialData.ek_kategori_2 || '',
        egp_odeme_turleri: initialData.egp_odeme_turleri || '',
        vakif_aktarim: initialData.vakif_aktarim || false,
        vakif_uye_kurumu: initialData.vakif_uye_kurumu || '',
        hedef_kitle_aciklamasi: initialData.hedef_kitle_aciklamasi || ''
      })
      // Eğer düzenleme modundaysa, orijinal plan ID'sini sakla
      if (location.state?.isEdit && location.state?.originalProductId) {
        setOriginalPlanId(location.state.originalProductId)
      }
      // Eğer state'te plan ID varsa (yeni versiyon oluşturma), onu da sakla
      if (initialData.id) {
        setOriginalPlanId(initialData.id)
      }
    }
  }, [id, location.state])

  const fetchPlanData = async (planId) => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single()

      if (error) throw error
      if (data) {
        setFormData(data)
      }
    } catch (error) {
      console.error('Error fetching plan data:', error)
    }
  }

  const steps = [
    { number: 1, title: 'Genel Bilgiler' },
    { number: 2, title: 'Ödeme Bilgileri' },
    { number: 3, title: 'Plan Fon Bilgileri' },
    { number: 4, title: 'Giriş Aidatı Bilgileri' },
    { number: 5, title: 'Önerilen Fon Karmaları' },
    { number: 6, title: 'Kesinti Tanımları' },
    { number: 7, title: 'Katılı Payı Bilgi' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleSave = async () => {
    if (!supabase) {
      alert('Supabase bağlantısı kurulmadı!')
      return
    }

    try {
      // Eğer yeni plan ise (id yok ve originalPlanId de yok), önce product_tariff_plans tablosuna kayıt yap
      if (!id && !originalPlanId) {
        const baseCode = (formData.plan_kodu || '').trim() || `PLAN-${Date.now()}`
        let finalCode = baseCode
        let productTariffPlan = null
        let attempt = 0

        while (attempt < 5 && !productTariffPlan) {
          const candidateCode = attempt === 0 ? baseCode : `${baseCode}-${attempt + 1}`
          const { data, error } = await supabase
            .from('product_tariff_plans')
            .insert([{
              ulke: formData.ulke,
              dil: formData.dil,
              brans: formData.brans,
              durum: formData.durum || 'Draft',
              urun_kodu: candidateCode,
              urun_adi: formData.plan_kisa_adi || 'Yeni Plan',
              urun_uzun_adi: formData.plan_uzun_adi || formData.plan_kisa_adi || 'Yeni Plan'
            }])
            .select()
            .single()

          if (error) {
            if (error.code === '23505') {
              attempt += 1
              continue
            }
            console.error('Product tariff plan kayıt hatası:', error)
            throw error
          }

          productTariffPlan = data
          finalCode = candidateCode
        }

        if (!productTariffPlan) {
          throw new Error('Ürün kodu benzersiz hale getirilemedi. Lütfen farklı bir Plan Kodu girin.')
        }

        // plans tablosuna da kayıt yap (product_tariff_plan_id ile)
        const planData = {
          ...formData,
          plan_kodu: finalCode,
          product_tariff_plan_id: productTariffPlan.id
        }

        const { error: planError } = await supabase
          .from('plans')
          .insert([planData])

        if (planError) {
          console.error('Plan kayıt hatası:', planError)
          throw planError
        }
      } else if (id) {
        // URL'den gelen ID ile mevcut plan güncelleme
        // Önce product_tariff_plans'ı güncelle
        const { data: existingPlan } = await supabase
          .from('plans')
          .select('product_tariff_plan_id')
          .eq('id', id)
          .single()

        if (existingPlan?.product_tariff_plan_id) {
          const { error: productError } = await supabase
            .from('product_tariff_plans')
            .update({
              ulke: formData.ulke,
              dil: formData.dil,
              brans: formData.brans,
              durum: formData.durum || 'Draft',
              urun_kodu: formData.plan_kodu,
              urun_adi: formData.plan_kisa_adi,
              urun_uzun_adi: formData.plan_uzun_adi
            })
            .eq('id', existingPlan.product_tariff_plan_id)

          if (productError) throw productError
        }

        // plans tablosunu güncelle
        const { error: planError } = await supabase
          .from('plans')
          .update(formData)
          .eq('id', id)

        if (planError) throw planError
      } else if (originalPlanId) {
        // Yeni versiyon oluşturma (Değiştir butonundan geliyor)
        // Önce product_tariff_plans'ı güncelle
        const { data: existingPlan } = await supabase
          .from('plans')
          .select('product_tariff_plan_id')
          .eq('id', originalPlanId)
          .single()

        if (existingPlan?.product_tariff_plan_id) {
          const { error: productError } = await supabase
            .from('product_tariff_plans')
            .update({
              ulke: formData.ulke,
              dil: formData.dil,
              brans: formData.brans,
              durum: formData.durum || 'Draft',
              urun_kodu: formData.plan_kodu,
              urun_adi: formData.plan_kisa_adi,
              urun_uzun_adi: formData.plan_uzun_adi
            })
            .eq('id', existingPlan.product_tariff_plan_id)

          if (productError) throw productError
        }

        // Yeni versiyon olarak plans tablosuna ekle (ID olmadan)
        const { id: planId, ...planDataWithoutId } = formData
        const { error: planError } = await supabase
          .from('plans')
          .insert([{
            ...planDataWithoutId,
            product_tariff_plan_id: existingPlan?.product_tariff_plan_id
          }])

        if (planError) throw planError
      }

      alert('Plan başarıyla kaydedildi!')
      // Liste sayfasına yönlendir ve refresh parametresi ekle
      navigate('/urun-tarife-tanimlari?refresh=' + Date.now())
    } catch (error) {
      console.error('Error saving plan:', error)
      alert(`Kayıt sırasında bir hata oluştu: ${error.message}`)
    }
  }

  return (
    <div className="p-6">
      {/* Step Navigation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Plan Tanımı</h1>
          <button
            onClick={() => navigate('/urun-tarife-tanimlari')}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number
            const isCompleted = step.number < currentStep
            const isLast = index === steps.length - 1

            return (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex flex-col items-center w-24 transition-colors ${
                    isActive ? 'text-[#8746FA]' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border ${
                      isActive
                        ? 'bg-[#8746FA] text-white border-[#8746FA] shadow'
                        : isCompleted
                          ? 'bg-[#8746FA]/10 text-[#8746FA] border-[#8746FA]' 
                          : 'bg-white border-gray-300'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-[#8746FA]' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </button>

                {!isLast && (
                  <div className={`w-12 h-px mx-2 ${isCompleted ? 'bg-[#8746FA]' : 'bg-gray-300'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Üst 3 Alan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branş
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.brans}
                    onChange={(e) => handleInputChange('brans', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ülke
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.ulke}
                    onChange={(e) => handleInputChange('ulke', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dil
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dil}
                    onChange={(e) => handleInputChange('dil', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                  <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Plan Tipi-Adı */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Tipi-Adı</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sözleşme Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sozlesme_tipi}
                    onChange={(e) => handleInputChange('sozlesme_tipi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Ferdi">Ferdi</option>
                    <option value="Grup">Grup</option>
                    <option value="Otomatik Katılım (OKS)">Otomatik Katılım (OKS)</option>
                    <option value="Emeklilik Gelir Planı(EGP)">Emeklilik Gelir Planı(EGP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Kodu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.plan_kodu}
                    onChange={(e) => handleInputChange('plan_kodu', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Versiyon No <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.plan_versiyon_no}
                      onChange={(e) => handleInputChange('plan_versiyon_no', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                      required
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Kısa Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.plan_kisa_adi}
                    onChange={(e) => handleInputChange('plan_kisa_adi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Uzun Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.plan_uzun_adi}
                    onChange={(e) => handleInputChange('plan_uzun_adi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başvuru Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.basvuru_tipi}
                    onChange={(e) => handleInputChange('basvuru_tipi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Kodu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.kategori_kodu}
                    onChange={(e) => handleInputChange('kategori_kodu', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zimmet Tipi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.zimmet_tipi}
                      onChange={(e) => handleInputChange('zimmet_tipi', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Tarih-Durum */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Tarih-Durum</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.baslangic_tarihi}
                    onChange={(e) => handleInputChange('baslangic_tarihi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bitiş Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.bitis_tarihi}
                    onChange={(e) => handleInputChange('bitis_tarihi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.durum}
                    onChange={(e) => handleInputChange('durum', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazine Plan Kodu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hazine_plan_kodu}
                    onChange={(e) => handleInputChange('hazine_plan_kodu', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazine Tasdik Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.hazine_tasdik_tarihi}
                    onChange={(e) => handleInputChange('hazine_tasdik_tarihi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geçerli Sözleşme Cinsi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.gecerli_sozlesme_cinsi}
                      onChange={(e) => handleInputChange('gecerli_sozlesme_cinsi', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Finansal ve Müşteri Kriterleri */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Finansal ve Müşteri Kriterleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kur Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.kur_tipi}
                    onChange={(e) => handleInputChange('kur_tipi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="TL">TL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Döviz-Para Cinsleri <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.doviz_para_cinsleri}
                    onChange={(e) => handleInputChange('doviz_para_cinsleri', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="TL">TL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min. Giriş Yaş <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.min_giris_yas}
                    onChange={(e) => handleInputChange('min_giris_yas', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max. Giriş Yaş <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.max_giris_yas}
                    onChange={(e) => handleInputChange('max_giris_yas', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Özel Ayarlar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Özel Ayarlar</h3>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hesap_birlestirme_zorunlu}
                    onChange={(e) => handleCheckboxChange('hesap_birlestirme_zorunlu', e.target.checked)}
                    className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                  />
                  <span className="text-sm text-gray-700">Hesap Birleştirme Zorunlu mu</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.katilimci_karti_verilecek}
                    onChange={(e) => handleCheckboxChange('katilimci_karti_verilecek', e.target.checked)}
                    className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                  />
                  <span className="text-sm text-gray-700">Katılımcı Kartı Verilecek mi?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vatandaslik}
                    onChange={(e) => handleCheckboxChange('vatandaslik', e.target.checked)}
                    className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                  />
                  <span className="text-sm text-gray-700">Vatandaşlık</span>
                </label>
              </div>
            </div>

            {/* Ek Detaylar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ek Detaylar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ek Kategori 1
                  </label>
                  <input
                    type="text"
                    value={formData.ek_kategori_1}
                    onChange={(e) => handleInputChange('ek_kategori_1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ek Kategori 2
                  </label>
                  <input
                    type="text"
                    value={formData.ek_kategori_2}
                    onChange={(e) => handleInputChange('ek_kategori_2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    EGP Ödeme Türleri
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.egp_odeme_turleri}
                      onChange={(e) => handleInputChange('egp_odeme_turleri', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={formData.vakif_aktarim}
                      onChange={(e) => handleCheckboxChange('vakif_aktarim', e.target.checked)}
                      className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                    />
                    <span className="text-sm text-gray-700">Vakıf Aktarım mı?</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vakıf Üye Kurumu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.vakif_uye_kurumu}
                      onChange={(e) => handleInputChange('vakif_uye_kurumu', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hedef Kitle Açıklaması
                  </label>
                  <textarea
                    value={formData.hedef_kitle_aciklamasi}
                    onChange={(e) => handleInputChange('hedef_kitle_aciklamasi', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep > 1 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Bu adım henüz geliştirilmedi.</p>
            <p className="text-sm text-gray-400 mt-2">Adım {currentStep}: {steps[currentStep - 1].title}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
          <button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Önceki
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A72FB] text-white font-semibold shadow-sm transition-colors hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </button>
          <button
            onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
            disabled={currentStep === steps.length}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
              currentStep === steps.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
            }`}
          >
            <ChevronsRight className="w-4 h-4" />
            <span>Sonraki</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanDefinition

