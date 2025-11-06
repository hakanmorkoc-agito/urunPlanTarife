import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { X, Info, Save, ChevronsRight, ChevronsLeft, ChevronDown } from 'lucide-react'
import FloatingLabelInput from '../components/FloatingLabelInput'
import FloatingLabelSelect from '../components/FloatingLabelSelect'
import FloatingLabelMultiSelect from '../components/FloatingLabelMultiSelect'

const PlanDefinitionModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [originalPlanId, setOriginalPlanId] = useState(null)
  const [showTooltips, setShowTooltips] = useState({
    planVersiyonNo: false,
    zimmetTipi: false,
    gecerliSozlesmeCinsi: false,
    egpOdemeTurleri: false,
    vakifUyeKurumu: false
  })
  const stepperRef = useRef(null)
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
    basvuru_tipi: [],
    kategori_kodu: '',
    zimmet_tipi: [],
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

  // Aktif adım değiştiğinde otomatik scroll - sağa ve sola doğru en az 2 adım görünsün
  useEffect(() => {
    if (stepperRef.current) {
      const activeStep = stepperRef.current.querySelector(`[data-step="${currentStep}"]`)
      if (activeStep) {
        // Kısa bir gecikme ile scroll yap (DOM güncellemesi için)
        setTimeout(() => {
          const containerRect = stepperRef.current.getBoundingClientRect()
          const stepRect = activeStep.getBoundingClientRect()
          // Her adım ~96px = 24*4
          const stepWidth = 96
          const requiredSpace = stepWidth * 2
          
          // Sağa doğru kontrol - aktif adımın sağ kenarından container'ın sağ kenarına kadar olan mesafe
          const distanceToRightEdge = containerRect.right - stepRect.right
          if (distanceToRightEdge < requiredSpace) {
            // Sağa scroll yap
            const additionalScroll = requiredSpace - distanceToRightEdge
            const newScrollLeft = stepperRef.current.scrollLeft + additionalScroll
            stepperRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
            return
          }
          
          // Sola doğru kontrol - aktif adımın sol kenarından container'ın sol kenarına kadar olan mesafe
          const distanceToLeftEdge = stepRect.left - containerRect.left
          if (distanceToLeftEdge < requiredSpace) {
            // Sola scroll yap
            const additionalScroll = requiredSpace - distanceToLeftEdge
            const newScrollLeft = Math.max(0, stepperRef.current.scrollLeft - additionalScroll)
            stepperRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
          }
        }, 50)
      }
    }
  }, [currentStep])

  // Steps tanımı - useEffect'lerden önce olmalı
  const steps = [
    { number: 1, title: 'Genel Bilgiler' },
    { number: 2, title: 'Ödeme Bilgileri' },
    { number: 3, title: 'Plan Fon Bilgileri' },
    { number: 4, title: 'Giriş Aidatı Bilgileri' },
    { number: 5, title: 'Önerilen Fon Karmaları' },
    { number: 6, title: 'Kesinti Tanımları' },
    { number: 7, title: 'Katılı Payı Bilgi' },
    { number: 8, title: 'Katkı Payı Artış Tipleri' },
    { number: 9, title: 'Ek Fayda Tanımları' },
    { number: 10, title: 'Aracı Komisyon Tanımları' },
    { number: 11, title: 'Satış Kanalı Tanımları' },
    { number: 12, title: 'Planda Yapılabilecek Zeyiller' },
    { number: 13, title: 'İstisna Planlar' },
    { number: 14, title: 'Çevre Sistemler' },
    { number: 15, title: 'Notlar' },
    { number: 16, title: 'Pazarlama Materyalleri' },
    { number: 17, title: 'Grup Parametreler' },
    { number: 18, title: 'EGP Parametreleri', condition: () => formData.sozlesme_tipi === 'Emeklilik Gelir Planı(EGP)' }
  ]

  // Scroll ile stepper ilerleme
  useEffect(() => {
    const stepperElement = stepperRef.current
    if (!stepperElement) return

    const handleWheel = (e) => {
      // Yatay scroll kontrolü
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
        stepperElement.scrollLeft += e.deltaX
      } else {
        // Dikey scroll ile adım değiştirme
        const filteredSteps = steps.filter(step => !step.condition || step.condition())
        const maxStep = filteredSteps.length
        
        if (e.deltaY > 0 && currentStep < maxStep) {
          // Aşağı scroll - ileri
          const currentIndex = filteredSteps.findIndex(step => step.number === currentStep)
          if (currentIndex < filteredSteps.length - 1) {
            setCurrentStep(filteredSteps[currentIndex + 1].number)
          }
        } else if (e.deltaY < 0 && currentStep > 1) {
          // Yukarı scroll - geri
          const currentIndex = filteredSteps.findIndex(step => step.number === currentStep)
          if (currentIndex > 0) {
            setCurrentStep(filteredSteps[currentIndex - 1].number)
          }
        }
      }
    }

    stepperElement.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      stepperElement.removeEventListener('wheel', handleWheel)
    }
  }, [currentStep, formData.sozlesme_tipi])

  useEffect(() => {
    if (initialData) {
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
        basvuru_tipi: Array.isArray(initialData.basvuru_tipi) ? initialData.basvuru_tipi : (initialData.basvuru_tipi ? [initialData.basvuru_tipi] : []),
        kategori_kodu: initialData.kategori_kodu || '',
        zimmet_tipi: Array.isArray(initialData.zimmet_tipi) ? initialData.zimmet_tipi : (initialData.zimmet_tipi ? [initialData.zimmet_tipi] : []),
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
      // Eğer state'te plan ID varsa (yeni versiyon oluşturma), onu da sakla
      if (initialData.id) {
        setOriginalPlanId(initialData.id)
      }
      if (initialData.originalProductId) {
        setOriginalPlanId(initialData.originalProductId)
      }
    }
  }, [initialData])

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }))
  }

  const handleMultiSelectChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || []
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...currentValues, value] }
      }
    })
  }

  const isZimmetTipiEnabled = formData.basvuru_tipi.includes('Matbu')
  const isGecerliSozlesmeCinsiEnabled = formData.sozlesme_tipi === 'Grup'
  const isEGPOdemeTurleriEnabled = formData.sozlesme_tipi === 'Emeklilik Gelir Planı(EGP)'
  const isVakifUyeKurumuEnabled = formData.vakif_aktarim

  // Refs for multi-select components
  const basvuruTipiRef = useRef(null)
  const zimmetTipiRef = useRef(null)

  // Tooltip dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.tooltip-container')) {
        setShowTooltips({
          planVersiyonNo: false,
          zimmetTipi: false,
          gecerliSozlesmeCinsi: false,
          egpOdemeTurleri: false,
          vakifUyeKurumu: false
        })
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])


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
      } else if (originalPlanId) {
        // Yeni versiyon oluşturma (Değiştir butonundan geliyor)
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
      // Başarılı kayıt sonrası modalı kapat
      if (onSave) {
        onSave()
      }
      onClose()
    } catch (error) {
      console.error('Error saving plan:', error)
      alert(`Kayıt sırasında bir hata oluştu: ${error.message}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-[95vw] max-h-[95vh] bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-[#8746FA] to-[#7335E8]">
            <h1 className="text-xl font-semibold text-white">Plan Tanımı</h1>
          <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
              <X className="w-5 h-5" />
          </button>
        </div>
        
          {/* Step Navigation */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="relative">
              <div 
                ref={stepperRef}
                className="flex items-center space-x-0 overflow-x-auto pb-2 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {steps.filter(step => !step.condition || step.condition()).map((step, index, filteredSteps) => {
            const isActive = currentStep === step.number
            const isCompleted = step.number < currentStep
                  const isLast = index === filteredSteps.length - 1
                  const isEnabled = !step.condition || step.condition()

            return (
                    <div key={step.number} className="flex items-start flex-shrink-0" data-step={step.number}>
                      <div className="flex flex-col items-center w-24">
                        <div className="h-8 flex items-center justify-center mb-3">
                <button
                            onClick={() => isEnabled && setCurrentStep(step.number)}
                            disabled={!isEnabled}
                            className={`group relative w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border transition-all duration-200 flex-shrink-0 ${
                      isActive
                                ? 'bg-[#8746FA] text-white border-[#8746FA] shadow-lg scale-110'
                        : isCompleted
                                  ? 'bg-[#8746FA]/10 text-[#8746FA] border-[#8746FA] group-hover:scale-110 group-hover:shadow-md' 
                                  : isEnabled
                                    ? 'bg-white border-gray-300 group-hover:border-[#8746FA] group-hover:bg-[#8746FA]/5 group-hover:scale-110'
                                    : 'bg-gray-100 border-gray-200'
                            } ${isEnabled ? 'hover:scale-110 hover:z-20 cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    {step.number}
                          </button>
                        </div>
                        <span className={`text-xs font-medium text-center leading-tight min-h-[2.5rem] flex items-start justify-center ${isActive ? 'text-[#8746FA]' : isEnabled ? 'text-gray-500' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                      </div>

                {!isLast && (
                        <div className="flex items-center justify-center w-12 h-8 flex-shrink-0" style={{ marginTop: '16px' }}>
                          <div 
                            className={`w-full h-0.5 transition-colors ${
                              isCompleted ? 'bg-[#8746FA]' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                )}
              </div>
            )
          })}
              </div>
            </div>
        </div>
      </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Üst 3 Alan */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingLabelSelect
                  label="Sözleşme Tipi"
                    value={formData.sozlesme_tipi}
                    onChange={(e) => handleInputChange('sozlesme_tipi', e.target.value)}
                    required
                  >
                  <option value="Ferdi">Ferdi</option>
                    <option value="Grup">Grup</option>
                  <option value="Otomatik Katılım (OKS)">Otomatik Katılım (OKS)</option>
                  <option value="Emeklilik Gelir Planı(EGP)">Emeklilik Gelir Planı(EGP)</option>
                  <option value="Tekafül">Tekafül</option>
                </FloatingLabelSelect>

                <FloatingLabelInput
                  label="Plan Kodu"
                    value={formData.plan_kodu}
                    onChange={(e) => handleInputChange('plan_kodu', e.target.value)}
                  required
                />

                <div className="relative">
                  <FloatingLabelInput
                    label="Plan Versiyon No"
                    value={formData.plan_versiyon_no}
                    onChange={(e) => handleInputChange('plan_versiyon_no', e.target.value)}
                    required
                    disabled
                  />
                  <div className="absolute right-3 group tooltip-container" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Info 
                      className="w-4 h-4 text-gray-400 cursor-help" 
                      onMouseEnter={() => setShowTooltips(prev => ({ ...prev, planVersiyonNo: true }))}
                      onMouseLeave={() => setShowTooltips(prev => ({ ...prev, planVersiyonNo: false }))}
                    />
                    {showTooltips.planVersiyonNo && (
                      <div className="absolute right-0 top-6 z-[9999]">
                        <div className="bg-black text-white text-[10px] italic px-2 py-1 rounded whitespace-nowrap shadow-lg">
                          Sistem tarafından verilen numaradır, Plan da ciddi bir değişiklik söz konusu olduğunda sistem tarafından güncellenir
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <FloatingLabelInput
                  label="Plan Kısa Adı"
                    value={formData.plan_kisa_adi}
                    onChange={(e) => handleInputChange('plan_kisa_adi', e.target.value)}
                    required
                  />

                <FloatingLabelInput
                  label="Plan Uzun Adı"
                    value={formData.plan_uzun_adi}
                    onChange={(e) => handleInputChange('plan_uzun_adi', e.target.value)}
                    required
                  />

                <FloatingLabelMultiSelect
                  ref={basvuruTipiRef}
                  label="Başvuru Tipi"
                    value={formData.basvuru_tipi}
                  onChange={(newValue) => handleInputChange('basvuru_tipi', newValue)}
                  options={['Online', 'Offline', 'Matbu']}
                    required
                  getSelectedText={(selected, options) => {
                    if (selected.length === 0) return ''
                    if (selected.length <= 2) return selected.join(', ')
                    return `${selected.length} seçili`
                  }}
                />

                <FloatingLabelInput
                  label="Kategori Kodu"
                    value={formData.kategori_kodu}
                    onChange={(e) => handleInputChange('kategori_kodu', e.target.value)}
                    required
                  />

                  <div className="relative">
                  <FloatingLabelMultiSelect
                    ref={zimmetTipiRef}
                    label="Zimmet Tipi"
                      value={formData.zimmet_tipi}
                    onChange={(newValue) => handleInputChange('zimmet_tipi', newValue)}
                    options={['Zimmet Tipi 1', 'Zimmet Tipi 2', 'Zimmet Tipi 3'].map(opt => ({
                      label: opt,
                      value: opt.replace('Zimmet Tipi ', 'Zimmet')
                    }))}
                    disabled={!isZimmetTipiEnabled}
                    getSelectedText={(selected) => {
                      if (selected.length === 0) return ''
                      return selected.map(v => `Zimmet Tipi ${v.replace('Zimmet', '')}`).join(', ')
                    }}
                  />
                  <div className="absolute right-3 tooltip-container" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Info 
                      className="w-4 h-4 text-gray-400 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowTooltips(prev => ({ ...prev, zimmetTipi: !prev.zimmetTipi }))
                      }}
                    />
                    {showTooltips.zimmetTipi && (
                      <div className="absolute right-0 top-6 z-[9999]">
                        <div className="bg-black text-white text-[10px] italic px-2 py-1 rounded whitespace-nowrap shadow-lg">
                          Zimmet tipi girmek için Başvuru tipi olarak Matbu seçili olmalıdır
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Tarih-Durum */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Tarih-Durum</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingLabelInput
                  label="Başlangıç Tarihi"
                    type="date"
                    value={formData.baslangic_tarihi}
                    onChange={(e) => handleInputChange('baslangic_tarihi', e.target.value)}
                  required
                />

                <FloatingLabelInput
                  label="Bitiş Tarihi"
                  type="date"
                  value={formData.bitis_tarihi}
                  onChange={(e) => handleInputChange('bitis_tarihi', e.target.value)}
                  required
                />

                <FloatingLabelSelect
                  label="Durum"
                  value={formData.durum}
                  onChange={(e) => {
                    const newDurum = e.target.value
                    const oldDurum = formData.durum
                    
                    // Draft -> Aktif geçişi yasak
                    if (oldDurum === 'Draft' && newDurum === 'Aktif') {
                      alert('Draft statüsünden Aktif statüsüne geçiş yapılamaz.')
                      return
                    }
                    
                    // Draft -> Pasif geçişi yasak
                    if (oldDurum === 'Draft' && newDurum === 'Pasif') {
                      alert('Draft statüsünden Pasif statüsüne geçiş yapılamaz.')
                      return
                    }
                    
                    // Draft -> TEST geçişi
                    if (oldDurum === 'Draft' && newDurum === 'TEST') {
                      if (!window.confirm('Tüm Tanımlamaların yapılmış olduğundan emin olunuz')) {
                        return
                      }
                    }
                    
                    // TEST -> Aktif geçişi
                    if (oldDurum === 'TEST' && newDurum === 'Aktif') {
                      if (!window.confirm('Üretim Versiyonu Oluşturulacaktır, Tüm Tanımlardan ve Testlerin tamamlandığından emin olunuz')) {
                        return
                      }
                    }
                    
                    // Aktif -> Pasif geçişi
                    if (oldDurum === 'Aktif' && newDurum === 'Pasif') {
                      if (!window.confirm('Plan Versiyonu satışa kapatılacaktır')) {
                        return
                      }
                    }
                    
                    handleInputChange('durum', newDurum)
                  }}
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="TEST">TEST</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                </FloatingLabelSelect>

                <FloatingLabelInput
                  label="Hazine Plan Kodu"
                  value={formData.hazine_plan_kodu}
                  onChange={(e) => handleInputChange('hazine_plan_kodu', e.target.value)}
                  required
                />

                <FloatingLabelInput
                  label="Hazine Tasdik Tarihi"
                  type="date"
                  value={formData.hazine_tasdik_tarihi}
                  onChange={(e) => handleInputChange('hazine_tasdik_tarihi', e.target.value)}
                  required
                />

                <div className="relative">
                  <FloatingLabelSelect
                    label="Geçerli Sözleşme Cinsi"
                    value={formData.gecerli_sozlesme_cinsi}
                    onChange={(e) => handleInputChange('gecerli_sozlesme_cinsi', e.target.value)}
                    disabled={!isGecerliSozlesmeCinsiEnabled}
                  >
                    <option value="İGES">İGES</option>
                    <option value="GBB">GBB</option>
                  </FloatingLabelSelect>
                  <div className="absolute right-3 group tooltip-container" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Info 
                      className="w-4 h-4 text-gray-400 cursor-help" 
                      onMouseEnter={() => setShowTooltips(prev => ({ ...prev, gecerliSozlesmeCinsi: true }))}
                      onMouseLeave={() => setShowTooltips(prev => ({ ...prev, gecerliSozlesmeCinsi: false }))}
                    />
                    {showTooltips.gecerliSozlesmeCinsi && (
                      <div className="absolute right-0 top-6 z-[9999]">
                        <div className="bg-black text-white text-[10px] italic px-2 py-1 rounded whitespace-nowrap shadow-lg">
                          Sözleşme Tipi GRUP seçilirse aktif olacaktır.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Finansal ve Müşteri Kriterleri */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Finansal ve Müşteri Kriterleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingLabelSelect
                  label="Kur Tipi"
                  value={formData.kur_tipi}
                  onChange={(e) => handleInputChange('kur_tipi', e.target.value)}
                  required
                >
                  <option value="Efektif Alış">Efektif Alış</option>
                  <option value="Efektif Satış">Efektif Satış</option>
                  <option value="Döviz Alış">Döviz Alış</option>
                  <option value="Döviz Satış">Döviz Satış</option>
                </FloatingLabelSelect>

                <FloatingLabelSelect
                  label="Döviz-Para Cinsleri"
                  value={formData.doviz_para_cinsleri}
                  onChange={(e) => handleInputChange('doviz_para_cinsleri', e.target.value)}
                  required
                >
                  <option value="TL">TL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </FloatingLabelSelect>

                <FloatingLabelInput
                  label="Min. Giriş Yaş"
                  type="number"
                  value={formData.min_giris_yas}
                  onChange={(e) => handleInputChange('min_giris_yas', e.target.value)}
                  required
                />

                <FloatingLabelInput
                  label="Max. Giriş Yaş"
                  type="number"
                  value={formData.max_giris_yas}
                  onChange={(e) => handleInputChange('max_giris_yas', e.target.value)}
                    required
                  />
              </div>
            </div>

            {/* Özel Ayarlar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Özel Ayarlar</h3>
              <div className="space-y-4">
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

                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={formData.vakif_aktarim}
                      onChange={(e) => handleCheckboxChange('vakif_aktarim', e.target.checked)}
                      className="w-4 h-4 text-[#8746FA] border-gray-300 rounded focus:ring-[#8746FA]"
                    />
                    <span className="text-sm text-gray-700">Vakıf Aktarım mı?</span>
                  </label>
                  <div className="relative flex-1 min-w-0">
                    <FloatingLabelSelect
                      label="Vakıf Üye Kurumu"
                      value={formData.vakif_uye_kurumu}
                      onChange={(e) => handleInputChange('vakif_uye_kurumu', e.target.value)}
                      disabled={!isVakifUyeKurumuEnabled}
                    >
                      <option value="T.C. BAŞBAKANLIK BASIN YAY.ENFORMASYON YARD. VAKFI">T.C. BAŞBAKANLIK BASIN YAY.ENFORMASYON YARD. VAKFI</option>
                      <option value="NÜFUS HİZMETLERİNİ GÜÇLENDİRME VAKFI">NÜFUS HİZMETLERİNİ GÜÇLENDİRME VAKFI</option>
                      <option value="T.C. NOTERLERİ PERSONELLERI YARDIMLAŞMA VAKFI">T.C. NOTERLERİ PERSONELLERI YARDIMLAŞMA VAKFI</option>
                      <option value="T.C.MERKEZ BANKASI MENSUPLARI SANDIĞI VAKFI">T.C.MERKEZ BANKASI MENSUPLARI SANDIĞI VAKFI</option>
                    </FloatingLabelSelect>
                    <div className="absolute right-3 tooltip-container" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                      <Info 
                        className="w-4 h-4 text-gray-400 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTooltips(prev => ({ ...prev, vakifUyeKurumu: !prev.vakifUyeKurumu }))
                        }}
                      />
                      {showTooltips.vakifUyeKurumu && (
                        <div className="absolute right-0 top-6 z-[9999]">
                          <div className="bg-black text-white text-[10px] italic px-2 py-1 rounded whitespace-nowrap shadow-lg">
                            Vakıf Aktarım mı işaretlendiğinde aktif olacaktır
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ek Detaylar */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ek Detaylar</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingLabelInput
                  label="Ek Kategori 1"
                  value={formData.ek_kategori_1}
                  onChange={(e) => handleInputChange('ek_kategori_1', e.target.value)}
                />

                <FloatingLabelInput
                  label="Ek Kategori 2"
                  value={formData.ek_kategori_2}
                  onChange={(e) => handleInputChange('ek_kategori_2', e.target.value)}
                />

                <div className="relative">
                  <FloatingLabelSelect
                    label="EGP Ödeme Türleri"
                    value={formData.egp_odeme_turleri}
                    onChange={(e) => handleInputChange('egp_odeme_turleri', e.target.value)}
                    disabled={!isEGPOdemeTurleriEnabled}
                  >
                    <option value="Toplu Para">Toplu Para</option>
                    <option value="Belli Süre Maaş">Belli Süre Maaş</option>
                    <option value="Kısmi Ödeme ve Maaş">Kısmi Ödeme ve Maaş</option>
                  </FloatingLabelSelect>
                  <div className="absolute right-3 tooltip-container" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                    <Info 
                      className="w-4 h-4 text-gray-400 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowTooltips(prev => ({ ...prev, egpOdemeTurleri: !prev.egpOdemeTurleri }))
                      }}
                    />
                    {showTooltips.egpOdemeTurleri && (
                      <div className="absolute right-0 top-6 z-[9999]">
                        <div className="bg-black text-white text-[10px] italic px-2 py-1 rounded whitespace-nowrap shadow-lg">
                          Sözleşme Tipi EGP seçildiğinde aktif olur
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-4">
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

        </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center gap-2">
          <button
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
              }`}
            >
              <ChevronsLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            <button
              onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
              disabled={currentStep === steps.length}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                currentStep === steps.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
              }`}
            >
              <span>İleri</span>
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A72FB] text-white font-semibold shadow-sm transition-colors hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet Kapat</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanDefinitionModal

