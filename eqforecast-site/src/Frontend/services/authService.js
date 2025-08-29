import { supabase } from '../supabase';

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      throw new Error(error.message);
    }

    return { user: data.user, session: data.session };
    
  } catch (error) {
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    return true;
    
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      return null;
    }

    return user;
    
  } catch (error) {
    return null;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return null;
    }

    return session;
    
  } catch (error) {
    return null;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};

