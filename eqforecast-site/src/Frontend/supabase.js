import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rettsbvizhuvyvmiiyed.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldHRzYnZpemh1dnl2bWlpeWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDA5MTMsImV4cCI6MjA3MTcxNjkxM30.NYdhgPFbpW7pdzHoa7njIt0mYMm4LBsVYEtiOF5mz8A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');
    console.log('🔗 URL:', supabaseUrl);
    console.log('🔑 Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    const { data, error } = await supabase
      .from('earthquakes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}
