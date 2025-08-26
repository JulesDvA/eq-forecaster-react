import { supabase } from '../supabase'

const TABLE_NAME = 'earthquakes'

// Add a new earthquake entry
export const addEarthquake = async (earthquakeData) => {
  try {
    console.log('🚀 Adding earthquake to Supabase:', earthquakeData)
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([earthquakeData])
      .select()
    
    if (error) {
      console.error('❌ Error adding earthquake:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Earthquake added successfully:', data[0])
    return data[0]
    
  } catch (error) {
    console.error('❌ Error in addEarthquake:', error)
    throw error
  }
}

// Get all earthquake entries
export const getEarthquakes = async () => {
  try {
    console.log('📋 Fetching earthquakes from Supabase...')
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching earthquakes:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Earthquakes fetched successfully:', data.length)
    return data || []
    
  } catch (error) {
    console.error('❌ Error in getEarthquakes:', error)
    throw error
  }
}

// Delete an earthquake entry
export const deleteEarthquake = async (id) => {
  try {
    console.log('🗑️ Deleting earthquake from Supabase:', id)
    
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Error deleting earthquake:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Earthquake deleted successfully')
    return true
    
  } catch (error) {
    console.error('❌ Error in deleteEarthquake:', error)
    throw error
  }
}

// Update an earthquake entry
export const updateEarthquake = async (id, updates) => {
  try {
    console.log('✏️ Updating earthquake in Supabase:', id, updates)
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Error updating earthquake:', error)
      throw new Error(error.message)
    }
    
    console.log('✅ Earthquake updated successfully:', data[0])
    return data[0]
    
  } catch (error) {
    console.error('❌ Error in updateEarthquake:', error)
    throw error
  }
}

// Subscribe to real-time changes
export const subscribeToEarthquakes = (callback) => {
  console.log('🔔 Setting up real-time subscription...')
  
  const subscription = supabase
    .channel('earthquakes_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLE_NAME
      },
      (payload) => {
        console.log('🔄 Real-time update received:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  console.log('✅ Real-time subscription active')
  
  // Return unsubscribe function
  return () => {
    console.log('🔕 Unsubscribing from real-time updates...')
    subscription.unsubscribe()
  }
}
