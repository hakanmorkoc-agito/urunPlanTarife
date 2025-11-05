import { createClient } from '@supabase/supabase-js'

// Supabase bağlantı bilgileri - .env dosyasından alınacak
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase bağlantı bilgileri eksik! Lütfen .env dosyasını kontrol edin.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Test bağlantısı fonksiyonu
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { success: false, error: 'Supabase client başlatılamadı' }
  }
  
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found (normal)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

