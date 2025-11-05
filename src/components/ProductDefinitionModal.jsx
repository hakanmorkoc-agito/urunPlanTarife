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
      onSelect('new')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-sidebar-dark">Ürün Tanımlama</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Yeni ürün için ilk adımı atın, Branş, Ülke ve Dil bilgilerini girin.
          </p>
          
          <h3 className="text-xl font-semibold text-sidebar-dark mb-2">Yeni Ürün Tanımlama</h3>
          <p className="text-sm text-gray-500 mb-6">Temel bilgileri girin</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branş <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.brans}
                  onChange={(e) => setFormData({ ...formData, brans: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-primary focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Bireysel Emeklilik">Bireysel Emeklilik</option>
                  <option value="Hayat Sigortası">Hayat Sigortası</option>
                  <option value="Sağlık Sigortası">Sağlık Sigortası</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ülke <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.ulke}
                  onChange={(e) => setFormData({ ...formData, ulke: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-primary focus:border-transparent"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Türkiye">Türkiye</option>
                  <option value="Almanya">Almanya</option>
                  <option value="Fransa">Fransa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dil <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.dil}
                  onChange={(e) => setFormData({ ...formData, dil: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-primary focus:border-transparent"
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
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Geri</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
              isFormValid
                ? 'bg-[#1A72FB] text-white shadow-sm hover:bg-[#155ED5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A72FB]'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            <span>İleri</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDefinitionModal

