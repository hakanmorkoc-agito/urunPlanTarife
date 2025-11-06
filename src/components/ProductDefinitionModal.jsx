import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const ProductDefinitionModal = ({ mode = 'new', onClose, onSelect }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    brans: '',
    ulke: '',
    dil: ''
  })

  const isFormValid = formData.brans && formData.ulke && formData.dil

  // Katalog ürünleri - gerçek uygulamada API'den gelecek
  const catalogProducts = [
    {
      id: 1,
      name: 'Otomatik Katılım',
      description: 'Çalışanların otomatik olarak katıldığı emeklilik planı',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Ferdi',
      description: 'Bireysel emeklilik planı seçenekleri',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ]

  const handleNext = () => {
    if (isFormValid) {
      if (mode === 'catalog') {
        setStep(2)
      } else {
        onSelect('new', formData)
      }
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      onClose()
    }
  }

  const handleProductSelect = (product) => {
    onSelect('catalog', { ...formData, selectedProduct: product })
  }

  // Katalog modunda ve step 2'deyse ürün kartlarını göster
  if (mode === 'catalog' && step === 2) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#8746FA] to-[#7335E8]">
            <h2 className="text-xl font-semibold text-white">Katalog Şablonları</h2>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Selected Filters */}
            <div className="flex items-center gap-2 mb-4">
              {formData.brans && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                  {formData.brans}
                </span>
              )}
              {formData.ulke && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                  {formData.ulke}
                </span>
              )}
              {formData.dil && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                  {formData.dil}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-6 text-center">
              Seçiminize uygun şablonlardan birini seçin
            </p>

            {/* Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalogProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <button
                      onClick={() => handleProductSelect(product)}
                      className="w-full rounded-lg bg-[#8746FA] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7335E8] transition-colors"
                    >
                      Seç
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Geri</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 1: Form (hem new hem catalog için)
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-pink-500/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-sidebar-dark">Ürün Tanımlama</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="mb-4 text-sm text-gray-500">
            Yeni ürün için ilk adımı atın, Branş, Ülke ve Dil bilgilerini girin.
          </p>
          
          <h3 className="text-lg font-semibold text-[#8746FA] mb-1">Katalog Şablonları</h3>
          <p className="text-xs text-gray-500 mb-5">Temel bilgileri girin</p>

          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Branş <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brans}
                  onChange={(e) => setFormData({ ...formData, brans: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1A72FB] focus:ring-2 focus:ring-[#1A72FB]/30"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Bireysel Emeklilik">Bireysel Emeklilik</option>
                  <option value="Hayat Sigortası">Hayat Sigortası</option>
                  <option value="Sağlık Sigortası">Sağlık Sigortası</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Ülke <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ulke}
                  onChange={(e) => setFormData({ ...formData, ulke: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1A72FB] focus:ring-2 focus:ring-[#1A72FB]/30"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Türkiye">Türkiye</option>
                  <option value="Almanya">Almanya</option>
                  <option value="Fransa">Fransa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Dil <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dil}
                  onChange={(e) => setFormData({ ...formData, dil: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1A72FB] focus:ring-2 focus:ring-[#1A72FB]/30"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="English">English</option>
                  <option value="Deutsch">Deutsch</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Geri</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
              isFormValid
                ? 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <span>İleri</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDefinitionModal
