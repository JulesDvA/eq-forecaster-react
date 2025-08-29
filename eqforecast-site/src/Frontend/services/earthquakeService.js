import { supabase } from '../supabase'

const TABLE_NAME = 'earthquakes'

// Add a new earthquake entry
export const addEarthquake = async (earthquakeData) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([earthquakeData])
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data[0]
    
  } catch (error) {
    throw error
  }
}

// Get all earthquake entries
export const getEarthquakes = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('timestamp', { ascending: false })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data || []
    
  } catch (error) {
    throw error
  }
}

// Delete an earthquake entry
export const deleteEarthquake = async (id) => {
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(error.message)
    }
    
    return true
    
  } catch (error) {
    throw error
  }
}

// Update an earthquake entry
export const updateEarthquake = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data[0]
    
  } catch (error) {
    throw error
  }
}

// Subscribe to real-time changes
export const subscribeToEarthquakes = (callback) => {
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
        callback(payload)
      }
    )
    .subscribe()
  
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe()
  }
}

