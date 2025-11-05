import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const ProductDefinitionModal = ({ onClose, onSelect }) => {
  const [formData, setFormData] = useState({
    brans: '',
    ulke: '',
    dil: ''
  })

  const isFormValid = formData.brans && formData.ulke && formData.dil

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid) {
      onSelect('new', formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
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
          
          <h3 className="text-lg font-semibold text-sidebar-dark mb-1">Yeni Ürün Tanımlama</h3>
          <p className="text-xs text-gray-500 mb-5">Temel bilgileri girin</p>

          <form onSubmit={handleSubmit}>
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
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Geri</span>
          </button>
          <button
            onClick={handleSubmit}
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

