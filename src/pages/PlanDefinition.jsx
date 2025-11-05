import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { X, Info } from 'lucide-react'

const PlanDefinition = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentStep, setCurrentStep] = useState(1)
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
    durum: 'Draft'
  })

  useEffect(() => {
    if (id) {
      fetchPlanData(id)
    }
  }, [id])

  useEffect(() => {
    if (!id && location.state?.initialSelections) {
      setFormData((prev) => ({
        ...prev,
        ...location.state.initialSelections
      }))
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

  const handleSave = async () => {
    if (!supabase) {
      alert('Supabase bağlantısı kurulmadı!')
      return
    }

    try {
      // Eğer yeni plan ise (id yok), önce product_tariff_plans tablosuna kayıt yap
      if (!id) {
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
      } else {
        // Mevcut plan güncelleme
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
          <div className="space-y-6">
            {/* Genel Plan Özellikleri */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Genel Plan Özellikleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branş
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.brans}
                      onChange={(e) => handleInputChange('brans', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Tipi-Adı */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Tipi-Adı</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sözleşme Tipi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.sozlesme_tipi}
                    onChange={(e) => handleInputChange('sozlesme_tipi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Seçiniz</option>
                    <option value="Bireysel">Bireysel</option>
                    <option value="Grup">Grup</option>
                    <option value="Kurumsal">Kurumsal</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <Info className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Tarih-Durum */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Tarih-Durum</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlangıç Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.baslangic_tarihi}
                    onChange={(e) => handleInputChange('baslangic_tarihi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
        <div className="flex items-center justify-between mt-6 pt-6 border-t">
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
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-[#1A72FB] text-white font-medium shadow-sm transition-colors hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]"
            >
              Kaydet
            </button>
            <button
              onClick={() => currentStep < steps.length && setCurrentStep(currentStep + 1)}
              disabled={currentStep === steps.length}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                currentStep === steps.length
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
              }`}
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanDefinition

