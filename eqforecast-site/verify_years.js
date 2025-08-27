import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rettsbvizhuvyvmiiyed.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldHRzYnZpemh1dnl2bWlpeWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDA5MTMsImV4cCI6MjA3MTcxNjkxM30.NYdhgPFbpW7pdzHoa7njIt0mYMm4LBsVYEtiOF5mz8A'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyYears() {
  try {
    console.log('🔍 Verifying years in forecasts table...')
    
    // Get all unique years
    const { data: years, error } = await supabase
      .from('forecasts')
      .select('year')
      .order('year')
    
    if (error) {
      console.error('❌ Error:', error)
      return
    }
    
    const uniqueYears = [...new Set(years.map(r => r.year))].sort()
    console.log('📅 Available years:', uniqueYears)
    console.log(`📈 Total years: ${uniqueYears.length}`)
    console.log(`🎯 Year range: ${Math.min(...uniqueYears)} - ${Math.max(...uniqueYears)}`)
    
    // Check specific years
    const testYears = [2000, 2001, 2002, 2003, 2020, 2025]
    for (const year of testYears) {
      const { data: yearData, error: yearError } = await supabase
        .from('forecasts')
        .select('count')
        .eq('year', year)
      
      if (yearError) {
        console.error(`❌ Error checking ${year}:`, yearError)
      } else {
        console.log(`📊 Year ${year}: ${yearData[0]?.count || 'No data'} records`)
      }
    }
    
    // Check if 2025 exists
    const has2025 = uniqueYears.includes(2025)
    console.log(`✅ Has 2025: ${has2025}`)
    
    if (has2025) {
      // Get sample data for 2025
      const { data: data2025, error: error2025 } = await supabase
        .from('forecasts')
        .select('*')
        .eq('year', 2025)
        .limit(3)
      
      if (!error2025 && data2025 && data2025.length > 0) {
        console.log('📋 Sample 2025 data:', data2025[0])
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

verifyYears()
