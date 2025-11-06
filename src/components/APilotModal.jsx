import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const APilotModal = ({ onClose, onSave }) => {
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Lütfen ürün tanımınızı yazın.')
      return
    }

    // A-pilot ile plan oluşturma işlemi
    // Burada gerçek bir AI entegrasyonu olacak, şimdilik basit bir kayıt yapıyoruz
    onSave(description)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#8746FA] to-[#7335E8] rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-white" />
            <h2 className="text-xl font-semibold text-white">A-Pilot Tanımlasın</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Yapay Zeka Sizin İçin Tanımlasın
          </h3>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Ürün tanımınızı doğal dille anlatın, A-Pilot sizin için oluştursun
          </p>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tanımınızı Yazın
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Örnek: Benim için bir Ferdi BES Planı tanımlar mısın. Giriş yaşı 18 çıkış yaşı 70 olsun. Online ve direkt satış kanallarından satılabilsin..."
              className="w-full h-48 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#8746FA] focus:ring-2 focus:ring-[#8746FA]/30 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#8746FA] text-white font-semibold hover:bg-[#7335E8] transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Tamam</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default APilotModal

