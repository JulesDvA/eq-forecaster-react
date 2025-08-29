import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('earthquakes')
      .select('count')
      .limit(1)
    
    if (error) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
