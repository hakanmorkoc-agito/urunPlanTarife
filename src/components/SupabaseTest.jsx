import { useState, useEffect } from 'react'
import { supabase, testSupabaseConnection } from '../lib/supabase'
import { CheckCircle, RefreshCw } from 'lucide-react'

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking')

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setConnectionStatus('checking')

    if (!supabase) {
      setConnectionStatus('error')
      return
    }

    try {
      const result = await testSupabaseConnection()
      
      if (result.success) {
        setConnectionStatus('success')
      } else {
        setConnectionStatus('error')
      }
    } catch (error) {
      setConnectionStatus('error')
    }
  }

  const isConnected = connectionStatus === 'success'
  const isLoading = connectionStatus === 'checking'

  return (
    <button
      onClick={checkConnection}
      disabled={isLoading}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
        isConnected 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-red-500 hover:bg-red-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isConnected ? 'Supabase bağlantısı aktif' : 'Supabase bağlantısı yok - Yeniden denemek için tıklayın'}
    >
      {isLoading ? (
        <RefreshCw className="w-4 h-4 text-white animate-spin" />
      ) : isConnected ? (
        <CheckCircle className="w-4 h-4 text-white" />
      ) : (
        <RefreshCw className="w-4 h-4 text-white" />
      )}
    </button>
  )
}

export default SupabaseTest

